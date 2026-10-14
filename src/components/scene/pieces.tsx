"use client";

import { useMemo } from "react";
import * as THREE from "three";

// Gold chess pieces built in code: pawn, bishop and queen are lathe-turned profiles;
// the knight is a lathe base with an extruded, bevelled horse-head silhouette.
// Heights (in scene units): pawn ~1.9, knight ~2.2, bishop ~2.5, queen ~2.75.

const v = (pts: [number, number][]) => pts.map(([r, y]) => new THREE.Vector2(r, y));

/** The shared Staunton-style base: a wide foot, a ring, and the start of the stem. */
const BASE: [number, number][] = [
  [0, 0],
  [0.66, 0],
  [0.68, 0.06],
  [0.66, 0.14],
  [0.58, 0.18],
  [0.6, 0.26],
  [0.5, 0.32],
  [0.42, 0.38],
];

function lathe(points: [number, number][]) {
  const g = new THREE.LatheGeometry(v(points), 64);
  g.computeVertexNormals();
  return g;
}

export function useGold() {
  return useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffc451", metalness: 0.92, roughness: 0.26, envMapIntensity: 1.25 }),
    [],
  );
}

type PieceProps = { material: THREE.Material };

export function Pawn({ material }: PieceProps) {
  const body = useMemo(
    () => lathe([...BASE, [0.3, 0.62], [0.24, 0.98], [0.22, 1.12], [0.38, 1.18], [0.4, 1.24], [0.26, 1.3], [0, 1.32]]),
    [],
  );
  return (
    <group>
      <mesh geometry={body} material={material} castShadow receiveShadow />
      <mesh position={[0, 1.6, 0]} material={material} castShadow>
        <sphereGeometry args={[0.34, 48, 32]} />
      </mesh>
    </group>
  );
}

export function Bishop({ material }: PieceProps) {
  const body = useMemo(
    () =>
      lathe([
        ...BASE,
        [0.32, 0.7],
        [0.24, 1.2],
        [0.22, 1.5],
        [0.4, 1.56],
        [0.42, 1.62],
        [0.26, 1.68],
        [0.3, 1.78],
        [0.36, 1.95],
        [0.34, 2.12],
        [0.26, 2.28],
        [0.13, 2.4],
        [0.05, 2.46],
        [0, 2.47],
      ]),
    [],
  );
  return (
    <group>
      <mesh geometry={body} material={material} castShadow receiveShadow />
      {/* The mitre's diagonal slit */}
      <mesh position={[0.06, 2.12, 0]} rotation={[0, 0, -0.62]}>
        <boxGeometry args={[0.07, 0.42, 0.8]} />
        <meshStandardMaterial color="#1a1206" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 2.56, 0]} material={material} castShadow>
        <sphereGeometry args={[0.1, 24, 16]} />
      </mesh>
    </group>
  );
}

export function Queen({ material }: PieceProps) {
  const body = useMemo(
    () =>
      lathe([
        ...BASE,
        [0.34, 0.72],
        [0.25, 1.3],
        [0.23, 1.72],
        [0.42, 1.8],
        [0.44, 1.87],
        [0.28, 1.93],
        [0.3, 2.02],
        [0.46, 2.36],
        [0.4, 2.4],
        [0.22, 2.38],
        [0, 2.38],
      ]),
    [],
  );
  const points = Array.from({ length: 9 }, (_, i) => (i / 9) * Math.PI * 2);
  return (
    <group>
      <mesh geometry={body} material={material} castShadow receiveShadow />
      {/* Crown: a ring of points and a small dome with a ball on top */}
      {points.map((a) => (
        <mesh key={a} position={[Math.cos(a) * 0.43, 2.44, Math.sin(a) * 0.43]} material={material} castShadow>
          <sphereGeometry args={[0.065, 16, 12]} />
        </mesh>
      ))}
      <mesh position={[0, 2.4, 0]} scale={[1, 0.7, 1]} material={material} castShadow>
        <sphereGeometry args={[0.24, 32, 20]} />
      </mesh>
      <mesh position={[0, 2.66, 0]} material={material} castShadow>
        <sphereGeometry args={[0.1, 24, 16]} />
      </mesh>
    </group>
  );
}

// The knight's head is sculpted from rounded parts (chest, arched neck, skull, muzzle,
// mane, ears) so polished gold catches reflections across curved surfaces. Faces +x.
export function Knight({ material }: PieceProps) {
  const base = useMemo(() => lathe([...BASE, [0.38, 0.5], [0, 0.52]]), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1a1206", roughness: 0.4 }), []);
  return (
    <group>
      <mesh geometry={base} material={material} castShadow receiveShadow />
      {/* Chest */}
      <mesh position={[0.02, 0.86, 0]} rotation-z={-0.18} scale={[0.44, 0.5, 0.34]} material={material} castShadow>
        <sphereGeometry args={[1, 40, 28]} />
      </mesh>
      {/* Arched neck, leaning forward */}
      <mesh position={[0.04, 1.28, 0]} rotation-z={-0.42} material={material} castShadow>
        <capsuleGeometry args={[0.27, 0.5, 12, 28]} />
      </mesh>
      {/* Skull */}
      <mesh position={[0.18, 1.74, 0]} scale={[1.05, 0.95, 0.9]} material={material} castShadow>
        <sphereGeometry args={[0.25, 36, 26]} />
      </mesh>
      {/* Face, angled down toward the muzzle */}
      <mesh position={[0.4, 1.6, 0]} rotation-z={1.05} scale={[1, 1, 0.92]} material={material} castShadow>
        <capsuleGeometry args={[0.19, 0.36, 12, 28]} />
      </mesh>
      <mesh position={[0.6, 1.44, 0]} scale={[1, 0.82, 0.9]} material={material} castShadow>
        <sphereGeometry args={[0.18, 30, 22]} />
      </mesh>
      {/* Mane: a ridge down the back of the neck */}
      <mesh position={[-0.2, 1.36, 0]} rotation-z={-0.32} scale={[1, 1, 0.75]} material={material} castShadow>
        <capsuleGeometry args={[0.11, 0.72, 10, 20]} />
      </mesh>
      {/* Ears */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0.1, 2.02, side * 0.1]} rotation={[side * -0.15, 0, -0.2]} material={material} castShadow>
          <coneGeometry args={[0.07, 0.24, 16]} />
        </mesh>
      ))}
      {/* Eyes and nostril */}
      {[-1, 1].map((side) => (
        <mesh key={`e${side}`} position={[0.3, 1.8, side * 0.21]} material={dark}>
          <sphereGeometry args={[0.04, 12, 10]} />
        </mesh>
      ))}
      <mesh position={[0.76, 1.42, 0.06]} material={dark}>
        <sphereGeometry args={[0.028, 10, 8]} />
      </mesh>
    </group>
  );
}
