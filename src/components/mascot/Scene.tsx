"use client";

import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";

/** Shared, mutable state the wrapper writes and the 3D scene reads every frame. */
export interface MascotState {
  /** Pointer relative to the mascot's head, roughly -1..1 on each axis. */
  pointer: { x: number; y: number };
  waving: boolean;
  walking: boolean;
  /** -1 walking left, 1 walking right, 0 facing the viewer. */
  facing: number;
  /** Seconds (performance.now()/1000) of the last click, for the jump. */
  jumpAt: number;
  /** Mouth moves until this time. */
  talkUntil: number;
  /** Body lean from scroll speed, in radians. */
  lean: number;
  /** Reduced motion: no walking cycle or bounce. */
  calm: boolean;
}

const C = {
  skin: "#b37a52",
  skinShade: "#9c6544",
  hair: "#16100d",
  shirt: "#f4f2ec",
  shirtShade: "#dcd8cd",
  pants: "#2a2e3a",
  shoe: "#17181d",
  tilak: "#e5501b",
  thread: "#f28c16",
  eye: "#fbfbf7",
  pupil: "#1a120e",
  lip: "#7a3328",
};

const now = () => performance.now() / 1000;
const damp = THREE.MathUtils.damp;

function Skin(props: ThreeElements["meshStandardMaterial"]) {
  return <meshStandardMaterial color={C.skin} roughness={0.62} {...props} />;
}

// A chibi Arun: big head, short black hair, white shirt, orange tilak and kalava.
function Character({ state }: { state: RefObject<MascotState> }) {
  const root = useRef<THREE.Group>(null!);
  const turn = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const eyes = useRef<THREE.Group>(null!);
  const pupilL = useRef<THREE.Group>(null!);
  const pupilR = useRef<THREE.Group>(null!);
  const armL = useRef<THREE.Group>(null!);
  const armR = useRef<THREE.Group>(null!);
  const legL = useRef<THREE.Group>(null!);
  const legR = useRef<THREE.Group>(null!);
  const mouth = useRef<THREE.Mesh>(null!);
  const blink = useRef({ next: 2.5, until: 0 });

  useFrame((_, dt) => {
    const s = state.current;
    if (!s) return;
    const t = now();
    const { x: px, y: py } = s.pointer;

    // Head turns toward the pointer; pupils move inside the eyes for the rest.
    head.current.rotation.y = damp(head.current.rotation.y, px * 0.55, 7, dt);
    head.current.rotation.x = damp(head.current.rotation.x, -py * 0.28, 7, dt);
    head.current.rotation.z = damp(head.current.rotation.z, -px * 0.06, 5, dt);
    for (const pupil of [pupilL.current, pupilR.current]) {
      pupil.position.x = damp(pupil.position.x, px * 0.045, 12, dt);
      pupil.position.y = damp(pupil.position.y, py * 0.04, 12, dt);
    }

    // Blink every few seconds.
    if (t > blink.current.next) {
      blink.current.until = t + 0.13;
      blink.current.next = t + 2.4 + Math.random() * 2.8;
    }
    eyes.current.scale.y = damp(eyes.current.scale.y, t < blink.current.until ? 0.08 : 1, 30, dt);

    // Breathing.
    body.current.scale.y = 1 + Math.sin(t * 2.2) * 0.012;

    // Face the way it walks, then turn back to the viewer.
    turn.current.rotation.y = damp(turn.current.rotation.y, s.walking ? s.facing * 0.9 : 0, 6, dt);

    // Walk cycle.
    const walk = s.walking && !s.calm;
    const phase = Math.sin(t * 11);
    legL.current.rotation.x = damp(legL.current.rotation.x, walk ? phase * 0.55 : 0, 12, dt);
    legR.current.rotation.x = damp(legR.current.rotation.x, walk ? -phase * 0.55 : 0, 12, dt);
    armL.current.rotation.x = damp(armL.current.rotation.x, walk ? -phase * 0.45 : 0, 12, dt);

    // Wave with the right arm on hover; otherwise swing with the walk.
    const waveZ = s.waving ? 2.6 + Math.sin(t * 13) * 0.35 : 0.12;
    armR.current.rotation.z = damp(armR.current.rotation.z, waveZ, 9, dt);
    armR.current.rotation.x = damp(armR.current.rotation.x, walk && !s.waving ? phase * 0.45 : 0, 12, dt);
    armL.current.rotation.z = damp(armL.current.rotation.z, -0.12, 9, dt);

    // Jump on click, a small bounce while walking.
    const since = t - s.jumpAt;
    const jump = since >= 0 && since < 0.55 && !s.calm ? Math.sin((since / 0.55) * Math.PI) * 0.5 : 0;
    const bounce = walk ? Math.abs(phase) * 0.05 : 0;
    root.current.position.y = -1.32 + jump + bounce;

    // Talking mouth.
    const talking = t < s.talkUntil;
    const open = talking ? 0.5 + Math.abs(Math.sin(t * 17)) * 1.1 : 1;
    mouth.current.scale.y = damp(mouth.current.scale.y, open, 20, dt);

    // Lean into fast scrolling.
    root.current.rotation.z = damp(root.current.rotation.z, s.calm ? 0 : s.lean, 4, dt);
  });

  return (
    <group ref={root} position={[0, -1.32, 0]}>
      {/* Soft contact shadow */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </mesh>

      <group ref={turn}>
        {/* Legs, pivoting at the hip */}
        {[
          { ref: legL, x: -0.16 },
          { ref: legR, x: 0.16 },
        ].map(({ ref, x }) => (
          <group key={x} ref={ref} position={[x, 0.66, 0]}>
            <mesh position={[0, -0.28, 0]}>
              <capsuleGeometry args={[0.13, 0.36, 8, 16]} />
              <meshStandardMaterial color={C.pants} roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.6, 0.07]} scale={[0.16, 0.09, 0.24]}>
              <sphereGeometry args={[1, 20, 14]} />
              <meshStandardMaterial color={C.shoe} roughness={0.5} />
            </mesh>
          </group>
        ))}

        <group ref={body}>
          {/* Shirt */}
          <mesh position={[0, 1.04, 0]}>
            <capsuleGeometry args={[0.37, 0.4, 10, 24]} />
            <meshStandardMaterial color={C.shirt} roughness={0.7} />
          </mesh>
          {/* Collar */}
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.12, 1.42, 0.24]} rotation={[0.5, 0, side * 0.55]}>
              <boxGeometry args={[0.2, 0.05, 0.12]} />
              <meshStandardMaterial color={C.shirtShade} roughness={0.7} />
            </mesh>
          ))}
          {/* Buttons and pocket */}
          {[1.28, 1.08, 0.88].map((y) => (
            <mesh key={y} position={[0, y, 0.37]}>
              <sphereGeometry args={[0.022, 10, 8]} />
              <meshStandardMaterial color={C.shirtShade} />
            </mesh>
          ))}
          <mesh position={[0.17, 1.18, 0.35]} rotation-x={-0.15}>
            <boxGeometry args={[0.15, 0.13, 0.01]} />
            <meshStandardMaterial color={C.shirtShade} roughness={0.8} />
          </mesh>

          {/* Arms, pivoting at the shoulder */}
          <group ref={armL} position={[-0.43, 1.33, 0]}>
            <mesh position={[0, -0.2, 0]}>
              <capsuleGeometry args={[0.11, 0.26, 8, 16]} />
              <meshStandardMaterial color={C.shirt} roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.5, 0]}>
              <capsuleGeometry args={[0.09, 0.2, 8, 16]} />
              <Skin />
            </mesh>
            <mesh position={[0, -0.7, 0.02]}>
              <sphereGeometry args={[0.1, 16, 12]} />
              <Skin />
            </mesh>
          </group>
          <group ref={armR} position={[0.43, 1.33, 0]}>
            <mesh position={[0, -0.2, 0]}>
              <capsuleGeometry args={[0.11, 0.26, 8, 16]} />
              <meshStandardMaterial color={C.shirt} roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.5, 0]}>
              <capsuleGeometry args={[0.09, 0.2, 8, 16]} />
              <Skin />
            </mesh>
            {/* Kalava, the orange thread on the wrist */}
            <mesh position={[0, -0.6, 0]} rotation-x={Math.PI / 2}>
              <torusGeometry args={[0.095, 0.022, 8, 20]} />
              <meshStandardMaterial color={C.thread} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.7, 0.02]}>
              <sphereGeometry args={[0.1, 16, 12]} />
              <Skin />
            </mesh>
          </group>

          {/* Neck */}
          <mesh position={[0, 1.54, 0]}>
            <cylinderGeometry args={[0.12, 0.13, 0.16, 16]} />
            <Skin color={C.skinShade} />
          </mesh>

          {/* Head, pivoting at the neck */}
          <group ref={head} position={[0, 1.6, 0]}>
            <mesh position={[0, 0.56, 0]} scale={[1, 1.06, 0.95]}>
              <sphereGeometry args={[0.62, 40, 30]} />
              <Skin />
            </mesh>
            {/* Ears */}
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 0.6, 0.52, -0.02]} scale={[0.6, 1, 0.8]}>
                <sphereGeometry args={[0.13, 16, 12]} />
                <Skin color={C.skinShade} />
              </mesh>
            ))}
            {/* Hair: a cap over the top and back, plus a short quiff */}
            {/* Tilted back so the hairline sits high and the forehead (and tilak) show */}
            <mesh position={[0, 0.56, 0]} rotation-x={-0.42} scale={[1.05, 1.1, 1.05]}>
              <sphereGeometry args={[0.62, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.47]} />
              <meshStandardMaterial color={C.hair} roughness={0.85} side={THREE.DoubleSide} />
            </mesh>
            {[
              [-0.22, 1.16, 0.3, 0.17],
              [0.02, 1.2, 0.34, 0.19],
              [0.24, 1.15, 0.28, 0.16],
              [0.1, 1.24, 0.12, 0.18],
            ].map(([x, y, z, r]) => (
              <mesh key={`${x}-${y}`} position={[x, y, z]} scale={[1.1, 0.75, 1]}>
                <sphereGeometry args={[r, 16, 12]} />
                <meshStandardMaterial color={C.hair} roughness={0.85} />
              </mesh>
            ))}

            {/* Eyebrows */}
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 0.22, 0.76, 0.56]} rotation-z={side * -0.12}>
                <boxGeometry args={[0.19, 0.045, 0.035]} />
                <meshStandardMaterial color={C.hair} />
              </mesh>
            ))}

            {/* Eyes: whites scale for blinks; pupils follow the pointer */}
            <group ref={eyes} position={[0, 0.58, 0.5]}>
              {[
                { side: -1, ref: pupilL },
                { side: 1, ref: pupilR },
              ].map(({ side, ref }) => (
                <group key={side} position={[side * 0.22, 0, 0]}>
                  <mesh scale={[1, 1.15, 0.55]}>
                    <sphereGeometry args={[0.125, 24, 18]} />
                    <meshStandardMaterial color={C.eye} roughness={0.3} />
                  </mesh>
                  <group ref={ref}>
                    <mesh position={[0, 0, 0.065]} scale={[1, 1, 0.5]}>
                      <sphereGeometry args={[0.068, 20, 14]} />
                      <meshStandardMaterial color={C.pupil} roughness={0.2} />
                    </mesh>
                    <mesh position={[0.025, 0.03, 0.1]}>
                      <sphereGeometry args={[0.018, 10, 8]} />
                      <meshBasicMaterial color="#ffffff" />
                    </mesh>
                  </group>
                </group>
              ))}
            </group>

            {/* Tilak */}
            <mesh position={[0, 0.82, 0.585]}>
              <capsuleGeometry args={[0.024, 0.07, 4, 8]} />
              <meshStandardMaterial color={C.tilak} roughness={0.4} />
            </mesh>
            {/* Nose */}
            <mesh position={[0, 0.45, 0.6]}>
              <sphereGeometry args={[0.055, 14, 10]} />
              <Skin color={C.skinShade} />
            </mesh>
            {/* Mouth */}
            <mesh ref={mouth} position={[0, 0.3, 0.57]} rotation-z={Math.PI}>
              <torusGeometry args={[0.085, 0.022, 8, 20, Math.PI]} />
              <meshStandardMaterial color={C.lip} roughness={0.5} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

export default function Scene({ state }: { state: RefObject<MascotState> }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 26, position: [0, 0.35, 7.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#ffffff", "#2b3440", 0.7]} />
      <directionalLight position={[3, 5, 6]} intensity={1.5} />
      <directionalLight position={[-4, 3, -4]} intensity={0.9} color="#d6ff5c" />
      <Character state={state} />
    </Canvas>
  );
}
