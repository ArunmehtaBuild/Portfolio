"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Bishop, Knight, Pawn, Queen, useGold } from "./pieces";
import { boardTexture, stoneTexture } from "./textures";

/**
 * A gold chess piece travels across a terrazzo board as you scroll the home page:
 * the pawn opens (e2 → e4), the knight jumps (f6), the bishop slides along a diagonal
 * (c3 → b4), and the pawn's journey ends promoted, as a queen in the centre (d4).
 * Every move lifts the piece in an arc; piece changes happen mid-air. All of it is
 * scrubbed by scroll position, so scrolling back replays it in reverse.
 */
type PieceKind = "pawn" | "knight" | "bishop" | "queen";

interface Pose {
  piece: PieceKind;
  /** Board square as [file 0–7 (a–h), rank 1–8]. */
  square: [number, number];
  /** Camera position relative to the point it looks at. */
  camera: [number, number, number];
  /** Where the camera looks, relative to the piece (x, y), so the piece sits clear of text. */
  aim: [number, number];
  light: number;
  fogFar: number;
  /** Phones pull the camera back by this much (default 1.35) to keep the piece small. */
  phone?: number;
  /** Phones raise the camera by this much, to look down on the board rather than at its edge. */
  phoneLift?: number;
  /** Phones aim here instead of the default top-right corner framing. */
  phoneAim?: [number, number];
}

const POSES: Record<string, Pose> = {
  origin: { piece: "pawn", square: [4, 2], camera: [-0.8, 1.3, 6.2], aim: [-1.85, 0.1], light: 1, fogFar: 26, phone: 1.25, phoneLift: 2.4, phoneAim: [0, -1.8] },
  about: { piece: "pawn", square: [4, 4], camera: [-2.2, 2.3, 8], aim: [-1.7, 0.85], light: 0.8, fogFar: 22 },
  experience: { piece: "knight", square: [5, 6], camera: [-3, 3.1, 9], aim: [-2.55, -0.45], light: 0.62, fogFar: 20 },
  projects: { piece: "bishop", square: [2, 3], camera: [-3.4, 3.6, 7], aim: [-1.6, 0.6], light: 0.12, fogFar: 10 },
  milestones: { piece: "bishop", square: [1, 4], camera: [0.6, 2.2, 7.8], aim: [-1.6, 0.05], light: 0.5, fogFar: 18 },
  contact: { piece: "queen", square: [3, 4], camera: [-0.6, 1.4, 7.4], aim: [-1.7, 0.85], light: 0.95, fogFar: 24 },
};

const KINDS: PieceKind[] = ["pawn", "knight", "bishop", "queen"];
// The knight is the only asymmetric piece: turn it to face left, toward the text, so the
// camera sees its profile rather than its mane.
const FACING: Record<PieceKind, number> = { pawn: 0, knight: Math.PI, bishop: 0, queen: 0 };
const SQUARE = 0.8;
const BOARD = new THREE.Vector3(1.6, -0.75, -0.6);
const BOARD_TOP = BOARD.y + 0.2;
const squareToWorld = ([file, rank]: [number, number]) =>
  new THREE.Vector3(BOARD.x + (file - 3.5) * SQUARE, BOARD_TOP, BOARD.z + (4.5 - rank) * SQUARE);

// Fog fades distant stone into the page background, so it follows the page's tone.
const FOG_IVORY = new THREE.Color("#f5e6cc");
const FOG_DARK = new THREE.Color("#05080b");

const lerp = THREE.MathUtils.lerp;
const damp = THREE.MathUtils.damp;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Scroll position → the two surrounding section poses and how far between them we are. */
function usePoseFromScroll(order: string[]) {
  const anchors = useRef<number[]>([]);

  useEffect(() => {
    const measure = () => {
      anchors.current = order.map((id) => {
        const el = document.querySelector<HTMLElement>(`[data-stop="${id}"]`);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [order]);

  return () => {
    const a = anchors.current;
    const y = window.scrollY + window.innerHeight * 0.45;
    let i = 0;
    while (i < a.length - 1 && y >= a[i + 1]) i++;
    const from = POSES[order[i]];
    const to = POSES[order[Math.min(i + 1, order.length - 1)]];
    const span = (a[i + 1] ?? a[i] + 1) - a[i];
    // Hold each pose through most of its section, then play the move in the last stretch.
    const raw = span > 0 ? (y - a[i]) / span : 0;
    return { from, to, t: smooth(clamp01((raw - 0.45) / 0.55)) };
  };
}

function Stone({ points, depth, position, rotation, map }: { points: [number, number][]; depth: number; position: [number, number, number]; rotation?: [number, number, number]; map: THREE.Texture }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 });
    g.translate(0, 0, -depth / 2);
    return g;
  }, [points, depth]);
  return (
    <mesh geometry={geometry} position={position} rotation={rotation} castShadow receiveShadow>
      <meshStandardMaterial map={map} roughness={0.88} metalness={0.05} color="#d6d9e0" transparent />
    </mesh>
  );
}

function Board() {
  const top = useMemo(() => boardTexture(), []);
  const side = useMemo(() => stoneTexture(4), []);
  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ map: side, roughness: 0.9, color: "#c9ccd3" });
    const face = new THREE.MeshStandardMaterial({ map: top, roughness: 0.62, metalness: 0.08 });
    // Box faces: +x, -x, +y (top), -y, +z, -z
    return [edge, edge, face, edge, edge, edge];
  }, [top, side]);
  return (
    <group>
      <mesh position={BOARD} material={materials} receiveShadow castShadow>
        <boxGeometry args={[SQUARE * 8 + 0.3, 0.4, SQUARE * 8 + 0.3]} />
      </mesh>
    </group>
  );
}

/** Studio reflections so polished gold actually looks like metal. */
function Studio() {
  const { gl } = useThree();
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return texture;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  return <primitive object={env} attach="environment" />;
}

function World({ order, mobile }: { order: string[]; mobile: boolean }) {
  const piece = useRef<THREE.Group>(null!);
  const kinds = useRef<Record<PieceKind, THREE.Group | null>>({ pawn: null, knight: null, bishop: null, queen: null });
  const stones = useRef<THREE.Group>(null!);
  const key = useRef<THREE.SpotLight>(null!);
  const rim = useRef<THREE.DirectionalLight>(null!);
  const ambient = useRef<THREE.AmbientLight>(null!);
  const fog = useRef<THREE.Fog>(null!);
  const look = useRef(new THREE.Vector3());
  const spin = useRef(0);
  const stoneFade = useRef(0);
  const pose = usePoseFromScroll(order);
  const gold = useGold();
  const terrazzo = useMemo(() => [stoneTexture(1), stoneTexture(2), stoneTexture(3)], []);

  useFrame(({ camera, size }, dt) => {
    const { from, to, t } = pose();
    const a = squareToWorld(from.square);
    const b = squareToWorld(to.square);
    const moving = from.square[0] !== to.square[0] || from.square[1] !== to.square[1];
    const jump = from.piece === "knight" || to.piece === "knight" ? 1.25 : 0.85;
    const lift = moving || from.piece !== to.piece ? Math.sin(Math.PI * t) * jump : 0;

    // Move across the board along the scroll, lifted in an arc.
    const g = piece.current;
    g.position.x = damp(g.position.x, lerp(a.x, b.x, t), 6, dt);
    g.position.z = damp(g.position.z, lerp(a.z, b.z, t), 6, dt);
    g.position.y = damp(g.position.y, BOARD_TOP + lift, 8, dt);
    // Tilt a little toward the direction of travel while in the air.
    g.rotation.z = damp(g.rotation.z, -(b.x - a.x) * 0.12 * Math.sin(Math.PI * t), 5, dt);
    g.rotation.x = damp(g.rotation.x, (b.z - a.z) * 0.1 * Math.sin(Math.PI * t), 5, dt);
    // A slow sway, not a full spin, so the knight always shows its profile to the camera.
    spin.current += dt;
    g.rotation.y = Math.sin(spin.current * 0.35) * 0.28;
    g.scale.setScalar(damp(g.scale.x, mobile ? 0.42 : 0.8, 4, dt));

    // Swap pieces mid-move: the old one spins down as the new one spins up.
    const swap = smooth(clamp01((t - 0.35) / 0.3));
    for (const kind of KINDS) {
      const node = kinds.current[kind];
      if (!node) continue;
      const w = (from.piece === kind ? 1 - swap : 0) + (to.piece === kind ? swap : 0);
      const s = damp(node.scale.x, w, 10, dt);
      node.scale.setScalar(s);
      node.visible = s > 0.01;
      node.rotation.y = FACING[kind] + (1 - w) * 2.4;
    }

    // Camera: aim beside the piece so it sits clear of the text column.
    // Phones: one column of text, so look well left of and below the piece, which puts it
    // small in the top-right corner, clear of the text.
    const phoneAim = (p: Pose) => p.phoneAim ?? [-1.15, -2.25];
    const [fa, ta] = mobile ? [phoneAim(from), phoneAim(to)] : [from.aim, to.aim];
    const aim = [lerp(fa[0], ta[0], t), lerp(fa[1], ta[1], t)] as const;
    const tx = g.position.x + aim[0];
    // Aim at the (scaled) piece's middle so it keeps the same place on screen at any size.
    const ty = BOARD_TOP + (mobile ? 1 : 0.72) + aim[1];
    const tz = g.position.z;
    // The camera keeps pace with the piece, so a mid-air move never swings it into the text.
    look.current.set(damp(look.current.x, tx, 5, dt), damp(look.current.y, ty, 5, dt), damp(look.current.z, tz, 5, dt));
    const zoom = mobile ? lerp(from.phone ?? 1.35, to.phone ?? 1.35, t) : 1;
    // Narrower-than-usual windows (a smaller browser, or zoomed out on a small laptop): pull
    // the camera back so the piece keeps the same share of the screen width and never
    // slides off the right edge.
    const fit = mobile ? 1 : Math.max(1, 1.6 / (size.width / size.height));
    camera.position.x = damp(camera.position.x, tx + lerp(from.camera[0], to.camera[0], t) * zoom * fit, 5, dt);
    const raise = mobile ? lerp(from.phoneLift ?? 0, to.phoneLift ?? 0, t) : 0;
    camera.position.y = damp(camera.position.y, ty + lerp(from.camera[1], to.camera[1], t) * fit + raise, 5, dt);
    camera.position.z = damp(camera.position.z, tz + lerp(from.camera[2], to.camera[2], t) * zoom * fit, 5, dt);
    camera.lookAt(look.current);

    const ivory = document.documentElement.dataset.tone === "ivory";
    fog.current.color.lerp(ivory ? FOG_IVORY : FOG_DARK, 1 - Math.exp(-3 * dt));
    const light = lerp(from.light, to.light, t) * (ivory ? 1.15 : 1);
    key.current.intensity = damp(key.current.intensity, 140 * light, 3, dt);
    rim.current.intensity = damp(rim.current.intensity, 2 * light, 3, dt);
    ambient.current.intensity = damp(ambient.current.intensity, (ivory ? 0.35 : 0.1) + 0.25 * light, 3, dt);
    fog.current.far = damp(fog.current.far, lerp(from.fogFar, to.fogFar, t), 2, dt);
    stones.current.rotation.y = damp(stones.current.rotation.y, t * 0.05, 2, dt);
    // The angular stones belong to the dark scene; the ivory opening is just board and piece.
    stoneFade.current = damp(stoneFade.current, ivory ? 0 : 1, 3, dt);
    stones.current.visible = stoneFade.current > 0.01;
    stones.current.traverse((o) => {
      if (o instanceof THREE.Mesh) (o.material as THREE.Material).opacity = stoneFade.current;
    });
  });

  const start = squareToWorld(POSES.origin.square);

  return (
    <>
      <fog ref={fog} attach="fog" args={["#f5e6cc", 7, POSES.origin.fogFar]} />
      <Studio />
      <ambientLight ref={ambient} intensity={0.3} />
      <spotLight
        ref={key}
        position={[-2, 8, 6]}
        angle={0.6}
        penumbra={0.85}
        intensity={140}
        color="#fff1d6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <directionalLight ref={rim} position={[6, 3, -5]} intensity={2} color="#8fb7ff" />

      <Board />

      {/* The travelling piece: all four live here; only the active one has scale */}
      <group ref={piece} position={start}>
        <group ref={(n) => void (kinds.current.pawn = n)}>
          <Pawn material={gold} />
        </group>
        <group ref={(n) => void (kinds.current.knight = n)} scale={0} visible={false}>
          <Knight material={gold} />
        </group>
        <group ref={(n) => void (kinds.current.bishop = n)} scale={0} visible={false}>
          <Bishop material={gold} />
        </group>
        <group ref={(n) => void (kinds.current.queen = n)} scale={0} visible={false}>
          <Queen material={gold} />
        </group>
      </group>

      {/* Angular stone around the board */}
      <group ref={stones}>
        <Stone points={[[0, 0], [1.4, 4.6], [2.3, 4.2], [1.6, -0.2]]} depth={1.6} position={[5.6, -0.9, -3.4]} rotation={[0, -0.4, 0.15]} map={terrazzo[2]} />
        <Stone points={[[-2.4, -2], [0.4, -2.2], [0.9, 1.1], [-1.6, 0.4]]} depth={3} position={[-4.6, -1.2, -3.2]} rotation={[0, 0.5, 0]} map={terrazzo[1]} />
        <Stone points={[[-6, -0.5], [6, -0.5], [5, 0.3], [-5, 0.3]]} depth={5} position={[0.5, -3.4, -7]} map={terrazzo[0]} />
        <Stone points={[[0, 0], [3.2, -1.6], [3.2, -2.2], [0, -0.6]]} depth={2} position={[5.4, -0.8, 1.6]} rotation={[0, -0.3, 0]} map={terrazzo[1]} />
      </group>
    </>
  );
}

export default function ChessScene({ order, onLost }: { order: string[]; onLost: () => void }) {
  // Phones and portrait tablets share the one-column framing: piece small, top right.
  const mobile = typeof window !== "undefined" && (window.innerWidth < 768 || window.innerWidth < window.innerHeight);

  return (
    <Canvas
      shadows={mobile ? false : "percentage"}
      dpr={[1, mobile ? 1.25 : 1.5]}
      camera={{ fov: 32, position: [0, 2, 9], near: 0.1, far: 60 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "default", failIfMajorPerformanceCaveat: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        // react-three-fiber force-loses the context whenever the canvas unmounts (hot reload,
        // Next's back/forward cache). Chrome counts those losses and eventually blocks WebGL
        // for the page, so skip the forced loss: the renderer is still disposed, and the
        // browser frees the context with the canvas.
        gl.forceContextLoss = () => {};
        // A real loss (GPU reset, driver issue): switch to the fallback for this visit.
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            onLost();
          },
          { once: true },
        );
      }}
    >
      <World order={order} mobile={mobile} />
    </Canvas>
  );
}
