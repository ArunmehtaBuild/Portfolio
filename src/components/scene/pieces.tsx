"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { KNIGHT_BASE, KNIGHT_HEAD_SCALE, KNIGHT_HEAD_Y, knightHeadGeometry } from "./knight";

// Gold chess pieces built in code: pawn, bishop and queen are lathe-turned profiles;
// the knight is a lathe base with a sculpted horse head (see knight.ts).
// Heights (in scene units): pawn ~1.9, knight ~2.4, bishop ~2.5, queen ~2.75.

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
  // LatheGeometry brings its own normals, matched across the seam; recomputing them
  // would split the seam into a visible vertical line.
  return new THREE.LatheGeometry(v(points), 64);
}

export function useGold() {
  return useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#e0a53e", metalness: 0.92, roughness: 0.28, envMapIntensity: 1.05 }),
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

export function Knight({ material }: PieceProps) {
  const base = useMemo(() => lathe(KNIGHT_BASE), []);
  const head = useMemo(() => knightHeadGeometry(), []);
  // Drawn a touch smaller so its foot matches the other pieces.
  return (
    <group scale={0.85}>
      <mesh geometry={base} material={material} castShadow receiveShadow />
      <mesh
        geometry={head}
        material={material}
        position={[0, KNIGHT_HEAD_Y, 0]}
        scale={KNIGHT_HEAD_SCALE}
        castShadow
        receiveShadow
      />
    </group>
  );
}
