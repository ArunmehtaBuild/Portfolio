"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";

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
  // LatheGeometry brings its own normals, matched across the seam; recomputing them
  // would split the seam into a visible vertical line.
  return new THREE.LatheGeometry(v(points), 64);
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

// The knight's head is one seamless surface: a chain of metaballs (chest, arched neck,
// skull, face, muzzle, mane, ears) melted together with marching cubes, so polished gold
// flows across it with no joins, like a cast piece. Computed once, not per frame. Faces +x.
// Each ball is [x, y, z, radius] in the unit cube; strength is derived from the radius.
const KNIGHT_BALLS: [number, number, number, number][] = [
  // chest flaring into the base, then the neck, leaning forward as it rises
  [0.47, 0.07, 0.5, 0.13],
  [0.46, 0.14, 0.5, 0.115],
  [0.47, 0.24, 0.5, 0.1],
  [0.49, 0.34, 0.5, 0.09],
  [0.51, 0.44, 0.5, 0.085],
  [0.53, 0.53, 0.5, 0.085],
  // skull and crown
  [0.55, 0.63, 0.5, 0.105],
  [0.53, 0.7, 0.5, 0.082],
  // face running down to the muzzle
  [0.62, 0.62, 0.5, 0.08],
  [0.69, 0.58, 0.5, 0.07],
  [0.75, 0.54, 0.5, 0.064],
  [0.79, 0.51, 0.5, 0.058],
  [0.62, 0.55, 0.5, 0.078],
  // mane along the back of the neck
  [0.4, 0.3, 0.5, 0.068],
  [0.4, 0.4, 0.5, 0.068],
  [0.42, 0.5, 0.5, 0.068],
  [0.45, 0.6, 0.5, 0.066],
  [0.48, 0.68, 0.5, 0.062],
  // ears
  [0.53, 0.79, 0.46, 0.036],
  [0.53, 0.79, 0.54, 0.036],
  [0.535, 0.83, 0.46, 0.024],
  [0.535, 0.83, 0.54, 0.024],
];
const SUBTRACT = 12;

export function Knight({ material }: PieceProps) {
  const base = useMemo(() => lathe([...BASE, [0.38, 0.5], [0, 0.52]]), []);
  const head = useMemo(() => {
    const mc = new MarchingCubes(64, material, false, false, 60000);
    mc.isolation = 80;
    mc.reset();
    for (const [x, y, z, r] of KNIGHT_BALLS) {
      // Field is strength / d² − subtract; it crosses the isolation level at d = r.
      mc.addBall(x, y, z, r * r * (mc.isolation + SUBTRACT), SUBTRACT);
    }
    // Smooth the field so the chain of balls reads as one even curve, not a row of bumps.
    mc.blur(1);
    mc.update();
    mc.castShadow = true;
    return mc;
  }, [material]);

  return (
    <group>
      <mesh geometry={base} material={material} castShadow receiveShadow />
      <primitive object={head} position={[-0.08, 1.37, 0]} scale={0.95} />
    </group>
  );
}
