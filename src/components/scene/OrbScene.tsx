"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { dimpleTexture, stoneTexture } from "./textures";

/**
 * One pose per home-page section. As you scroll, the scene glides from the current
 * section's pose to the next one: the sphere rolls, the camera drifts, and the light
 * and fog close in so text stays readable.
 */
interface Pose {
  sphere: [number, number, number];
  scale: number;
  camera: [number, number, number];
  look: [number, number, number];
  light: number;
  fogFar: number;
  spin: number;
}

const POSES: Record<string, Pose> = {
  origin: { sphere: [1.5, 0.82, 0], scale: 0.86, camera: [0, 0.7, 7.8], look: [0.7, 0.15, 0], light: 1, fogFar: 22, spin: 0 },
  about: { sphere: [2.75, -0.35, 0.5], scale: 0.6, camera: [-0.6, 1.3, 9.2], look: [1.1, -0.3, 0], light: 0.8, fogFar: 20, spin: 0.22 },
  experience: { sphere: [3.4, -1.3, 0.9], scale: 0.5, camera: [-1, 2, 10], look: [1.4, -0.8, 0], light: 0.6, fogFar: 17, spin: 0.42 },
  projects: { sphere: [5.2, -2.6, 1.2], scale: 0.42, camera: [-2.6, 2.8, 11.5], look: [0.8, -1.2, 0], light: 0.12, fogFar: 9, spin: 0.55 },
  milestones: { sphere: [0.2, -0.3, -2.5], scale: 0.55, camera: [0.4, 0.8, 8.6], look: [0, -0.2, -1], light: 0.45, fogFar: 15, spin: 0.9 },
  contact: { sphere: [2.2, 0.35, 0.2], scale: 0.85, camera: [0, 0.6, 7.6], look: [0.8, 0, 0], light: 0.85, fogFar: 20, spin: 1.2 },
};

const lerp = THREE.MathUtils.lerp;
const damp = THREE.MathUtils.damp;
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Scroll position → blended pose between the two surrounding sections. */
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
    // Hold the pose through most of a section, then blend in its last stretch.
    const raw = span > 0 ? (y - a[i]) / span : 0;
    const t = smooth(Math.min(1, Math.max(0, (raw - 0.45) / 0.55)));
    return { from, to, t };
  };
}

// Angular dark stone: an extruded polygon with a small bevel.
function Stone({ points, depth, position, rotation, map }: { points: [number, number][]; depth: number; position: [number, number, number]; rotation?: [number, number, number]; map: THREE.Texture }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 });
    g.translate(0, 0, -depth / 2);
    return g;
  }, [points, depth]);
  return (
    <mesh geometry={geometry} position={position} rotation={rotation} castShadow receiveShadow>
      <meshStandardMaterial map={map} roughness={0.88} metalness={0.05} color="#d6d9e0" />
    </mesh>
  );
}

function World({ order, mobile }: { order: string[]; mobile: boolean }) {
  const sphere = useRef<THREE.Mesh>(null!);
  const stones = useRef<THREE.Group>(null!);
  const key = useRef<THREE.SpotLight>(null!);
  const rim = useRef<THREE.DirectionalLight>(null!);
  const ambient = useRef<THREE.AmbientLight>(null!);
  const fog = useRef<THREE.Fog>(null!);
  const look = useRef(new THREE.Vector3(...POSES.origin.look));
  const last = useRef(new THREE.Vector3(...POSES.origin.sphere));
  const pose = usePoseFromScroll(order);

  const dimples = useMemo(() => dimpleTexture(), []);
  const terrazzo = useMemo(() => [stoneTexture(1), stoneTexture(2), stoneTexture(3)], []);

  useFrame(({ camera }, dt) => {
    const { from, to, t } = pose();
    const mx = mobile ? 0.3 : 1;
    const lookX = lerp(from.look[0], to.look[0], t) * mx;
    const lookY = lerp(from.look[1], to.look[1], t);
    const target = new THREE.Vector3(lerp(from.sphere[0], to.sphere[0], t) * mx, lerp(from.sphere[1], to.sphere[1], t), lerp(from.sphere[2], to.sphere[2], t));
    // Phones have one column of text, so the sphere moves out of its way and sits in the
    // top-right corner (a little larger in the hero).
    const heroWeight = from === POSES.origin ? 1 - t : 0;
    if (mobile) {
      target.x = lookX + lerp(1.05, 0.8, heroWeight);
      target.y = lookY + lerp(1.75, 1.85, heroWeight);
    }
    const s = sphere.current;

    // Glide toward the pose, then roll by the distance actually travelled.
    s.position.x = damp(s.position.x, target.x, 3, dt);
    s.position.y = damp(s.position.y, target.y, 3, dt);
    s.position.z = damp(s.position.z, target.z, 3, dt);
    const scale = mobile ? lerp(0.42, 0.55, heroWeight) : lerp(from.scale, to.scale, t);
    s.scale.setScalar(damp(s.scale.x, scale, 3, dt));
    const dx = s.position.x - last.current.x;
    const dz = s.position.z - last.current.z;
    s.rotation.z -= dx / Math.max(0.3, s.scale.x);
    s.rotation.x += dz / Math.max(0.3, s.scale.x);
    s.rotation.y += dt * 0.08;
    last.current.copy(s.position);

    const cz = mobile ? 1.25 : 1;
    camera.position.x = damp(camera.position.x, lerp(from.camera[0], to.camera[0], t), 2.5, dt);
    camera.position.y = damp(camera.position.y, lerp(from.camera[1], to.camera[1], t), 2.5, dt);
    camera.position.z = damp(camera.position.z, lerp(from.camera[2], to.camera[2], t) * cz, 2.5, dt);
    look.current.x = damp(look.current.x, lerp(from.look[0], to.look[0], t) * mx, 2.5, dt);
    look.current.y = damp(look.current.y, lerp(from.look[1], to.look[1], t), 2.5, dt);
    look.current.z = damp(look.current.z, lerp(from.look[2], to.look[2], t), 2.5, dt);
    camera.lookAt(look.current);

    const light = lerp(from.light, to.light, t);
    key.current.intensity = damp(key.current.intensity, 120 * light, 3, dt);
    rim.current.intensity = damp(rim.current.intensity, 1.6 * light, 3, dt);
    ambient.current.intensity = damp(ambient.current.intensity, 0.12 + 0.3 * light, 3, dt);
    stones.current.rotation.y = damp(stones.current.rotation.y, lerp(from.spin, to.spin, t) * 0.35, 2, dt);
    fog.current.far = damp(fog.current.far, lerp(from.fogFar, to.fogFar, t), 2, dt);
  });

  return (
    <>
      <fog ref={fog} attach="fog" args={["#05080b", 6, POSES.origin.fogFar]} />
      <ambientLight ref={ambient} intensity={0.3} />
      <spotLight
        ref={key}
        position={[-3, 7, 5]}
        angle={0.55}
        penumbra={0.8}
        intensity={120}
        color="#fff1d6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <directionalLight ref={rim} position={[6, 2, -4]} intensity={1.6} color="#8fb7ff" />
      {/* Soft fill from the front so stone edges and speckles read */}
      <pointLight position={[2, 1.5, 6]} intensity={6} distance={14} color="#ffe2b0" />

      {/* The gold sphere */}
      <mesh ref={sphere} position={POSES.origin.sphere} castShadow>
        <sphereGeometry args={[1, 96, 64]} />
        <meshStandardMaterial color="#ffc72c" roughness={0.48} metalness={0.08} bumpMap={dimples} bumpScale={1.2} emissive="#6b4300" emissiveIntensity={0.45} />
      </mesh>

      {/* Angular stone: pedestal under the sphere, a long ramp, shards around it */}
      <group ref={stones}>
        <Stone points={[[-1.7, -1.6], [1.9, -1.6], [1.6, 0], [-1.3, 0]]} depth={2.4} position={[1.5, -0.08, 0]} map={terrazzo[0]} />
        <Stone points={[[0, 0], [7.5, -3.6], [7.5, -4.3], [0, -0.7]]} depth={2.6} position={[2.6, -0.2, 0.7]} map={terrazzo[1]} />
        <Stone points={[[0, 0], [1.4, 4.6], [2.3, 4.2], [1.6, -0.2]]} depth={1.6} position={[4.2, 0.2, -2.2]} rotation={[0, -0.4, 0.15]} map={terrazzo[2]} />
        <Stone points={[[-2.4, -2], [0.4, -2.2], [0.9, 1.1], [-1.6, 0.4]]} depth={3} position={[-4.4, -1.4, -2.6]} rotation={[0, 0.5, 0]} map={terrazzo[1]} />
        <Stone points={[[-6, -0.5], [6, -0.5], [5, 0.3], [-5, 0.3]]} depth={5} position={[0.5, -3.6, -5]} map={terrazzo[0]} />
      </group>
    </>
  );
}

export default function OrbScene({ order }: { order: string[] }) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Canvas
      shadows
      dpr={[1, mobile ? 1.5 : 1.75]}
      camera={{ fov: 32, position: POSES.origin.camera, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <World order={order} mobile={mobile} />
    </Canvas>
  );
}
