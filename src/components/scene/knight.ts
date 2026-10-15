import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";

// The knight's head, sculpted from a side silhouette. Every part (neck and head, each lock
// of the mane, the ears) is a 2D outline "inflated" into a slab with flat polished sides,
// bevelled facets and a rounded rim. The parts are fused and meshed once with marching
// cubes, so the gold reads as one cast surface. The head faces +x and stands on y = 0.

// Outlines are traced in pixels from a reference drawing (x right, y down) and mapped here.
const S = 0.00165;
const px = (x: number, y: number): [number, number] => [(x - 545) * S, (945 - y) * S];
const poly = (pts: [number, number][]) => pts.map(([x, y]) => px(x, y));

// Neck and head in one outline (sunk a little below y = 0 so it sits into the base).
const BODY = poly([
  [368, 985], [795, 985],
  // chest and the front of the neck, curving in to the throat
  [793, 925], [780, 872], [755, 816], [726, 760], [704, 706], [693, 656], [696, 616],
  // under the jaw to the chin
  [714, 598], [752, 610], [796, 636], [836, 664], [860, 680],
  // mouth, muzzle and nose
  [880, 680], [898, 668], [918, 654], [936, 632], [947, 604], [945, 576],
  // bridge of the nose and the forehead
  [928, 550], [895, 513], [856, 466], [816, 418], [782, 372], [752, 320], [728, 280], [704, 250],
  // poll
  [668, 222], [624, 202], [580, 194], [540, 202],
  // back of the neck (under the mane)
  [505, 228], [470, 282], [446, 362], [430, 462], [418, 572], [407, 690], [394, 800], [380, 900],
]);

// The mane: shingled locks hanging off a crest line, each tip hooking up and back. Every
// lock runs a little way under the one below it, and its lower edge stands proud.
const CREST: [number, number][] = [
  [590, 206], [528, 262], [488, 370], [466, 492], [455, 616], [446, 738], [436, 860], [430, 990],
];
const TIPS: [number, number][] = [
  [412, 194], [302, 300], [250, 424], [248, 552], [270, 676], [308, 796],
];
const LOCKS = TIPS.map((tip, k) => {
  const root = CREST[k];
  const below = CREST[Math.min(k + 2, CREST.length - 1)];
  const next = TIPS[k + 1] ?? [360, 990];
  // Outer edge: a full, rounded curve from the tip down to just inside the next lock's tip.
  const lerp = (t: number, out: number): [number, number] => [
    tip[0] + (next[0] - tip[0]) * t - out,
    tip[1] + (next[1] - tip[1]) * t,
  ];
  const tuck: [number, number] = [next[0] + 34, next[1] + 26];
  return {
    outline: poly([root, tip, lerp(0.25, 16), lerp(0.5, 20), lerp(0.75, 12), tuck, below]),
    top: (945 - tip[1]) * S,
    bottom: (945 - tuck[1]) * S,
  };
});

const EAR = poly([[650, 250], [668, 186], [696, 136], [736, 98], [741, 148], [733, 202], [728, 258]]);

/** Signed distance to a closed polygon: positive inside, negative outside. */
function polyDistance(x: number, y: number, pts: [number, number][]) {
  let best = Infinity;
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [ax, ay] = pts[j];
    const [bx, by] = pts[i];
    const ex = bx - ax;
    const ey = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey)));
    const dx = x - ax - ex * t;
    const dy = y - ay - ey * t;
    best = Math.min(best, dx * dx + dy * dy);
    if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) inside = !inside;
  }
  return inside ? Math.sqrt(best) : -Math.sqrt(best);
}

const smin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * One inflated slab, positive inside: flat sides at ±half, a rounded rim of radius r along
 * the outline, and a bevel plane (slope k from c at the rim) that cuts a facet in between.
 */
function slab(d: number, z: number, half: number, r: number, c: number, k: number) {
  const a = r - d;
  const b = z - (half - r);
  const box = Math.hypot(Math.max(a, 0), Math.max(b, 0)) + Math.min(Math.max(a, b), 0) - r;
  const bevel = (c + k * d - z) / Math.sqrt(1 + k * k);
  return smin(-box, bevel, 0.014);
}

/** Half-thickness of the neck and head: full at the chest, slimmer up the neck, tapering to the nose. */
function bodyHalf(x: number, y: number) {
  const [, chest] = px(0, 945);
  const [muzzleX] = px(770, 0);
  const [noseX] = px(945, 0);
  let t = 0.2 + 0.03 * smoothstep(0.5, chest, y);
  t -= 0.075 * smoothstep(muzzleX, noseX, x);
  // Rounded jowl below the eye.
  const [jx, jy] = px(752, 528);
  t += 0.026 * Math.exp(-((x - jx) ** 2 + (y - jy) ** 2) / 0.012);
  return t;
}

const [EYE_X, EYE_Y] = px(712, 372);
const [NOSTRIL_X, NOSTRIL_Y] = px(918, 590);
const [MOUTH_AX, MOUTH_AY] = px(842, 656);
const [MOUTH_BX, MOUTH_BY] = px(902, 650);

function capsule(x: number, y: number, z: number, ax: number, ay: number, bx: number, by: number, cz: number, r: number) {
  const ex = bx - ax;
  const ey = by - ay;
  const t = Math.max(0, Math.min(1, ((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey)));
  return Math.hypot(x - ax - ex * t, y - ay - ey * t, z - cz) - r;
}

// Sampling box (scene units, head space).
const N = 112;
const BOX = { cx: 0.085, cy: 0.66, cz: 0, lx: 1.36, ly: 1.56, lz: 0.64 };

let cached: THREE.BufferGeometry | null = null;

/** The knight's head as one smooth mesh. Built once per page and shared. */
export function knightHeadGeometry(): THREE.BufferGeometry {
  if (cached) return cached;

  const mc = new MarchingCubes(N, new THREE.MeshBasicMaterial(), false, false, 160000);
  mc.isolation = 0;
  const field = mc.field as Float32Array;
  const coord = (i: number, c: number, l: number) => c + ((i - N / 2) / (N / 2)) * (l / 2);

  for (let j = 0; j < N; j++) {
    const y = coord(j, BOX.cy, BOX.ly);
    for (let i = 0; i < N; i++) {
      const x = coord(i, BOX.cx, BOX.lx);
      // Everything that depends only on (x, y) is worked out once per column.
      const dBody = polyDistance(x, y, BODY);
      const halfBody = bodyHalf(x, y);
      const locks = LOCKS.map((lock) => ({
        d: polyDistance(x, y, lock.outline),
        // Each lock thickens towards its lower edge, so it steps out over the one below.
        half: 0.115 + 0.06 * smoothstep(lock.top, lock.bottom, y),
      })).filter((l) => l.d > -0.06);
      const dEar = polyDistance(x, y, EAR);

      for (let k = 0; k < N; k++) {
        const z = Math.abs(coord(k, BOX.cz, BOX.lz));
        let f = slab(dBody, z, halfBody, 0.032, 0.07, 1.05);
        for (const lock of locks) f = Math.max(f, slab(lock.d, z, lock.half, 0.024, 0.05, 1.2));
        if (dEar > -0.06) f = Math.max(f, slab(dEar, Math.abs(z - 0.085), 0.05, 0.018, 0.02, 1.4));
        // Carved details: an almond eye, a nostril and the line of the mouth.
        const eye = Math.hypot((x - EYE_X) / 1.5, (y - EYE_Y) / 0.95, z - 0.215) - 0.055;
        const nostril = Math.hypot(x - NOSTRIL_X, (y - NOSTRIL_Y) / 1.2, z - 0.155) - 0.04;
        const mouth = capsule(x, y, z, MOUTH_AX, MOUTH_AY, MOUTH_BX, MOUTH_BY, 0.135, 0.012);
        f = smin(f, eye, 0.02);
        f = smin(f, nostril, 0.02);
        f = smin(f, mouth, 0.01);
        field[i + j * N + k * N * N] = f;
      }
    }
  }
  mc.update();

  // Copy out of the marching-cubes buffers into scene units, then drop the volume.
  const count = mc.count;
  const src = mc.positionArray as Float32Array;
  const srcN = mc.normalArray as Float32Array;
  const position = new Float32Array(count * 3);
  const normal = new Float32Array(count * 3);
  const n = new THREE.Vector3();
  for (let v = 0; v < count; v++) {
    const o = v * 3;
    position[o] = BOX.cx + (src[o] * BOX.lx) / 2;
    position[o + 1] = BOX.cy + (src[o + 1] * BOX.ly) / 2;
    position[o + 2] = BOX.cz + (src[o + 2] * BOX.lz) / 2;
    // The field gradient was taken on a stretched grid; undo the stretch before normalising.
    n.set(srcN[o] / BOX.lx, srcN[o + 1] / BOX.ly, srcN[o + 2] / BOX.lz).normalize();
    normal[o] = n.x;
    normal[o + 1] = n.y;
    normal[o + 2] = n.z;
  }
  mc.geometry.dispose();
  (mc.material as THREE.Material).dispose();

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  geometry.computeBoundingSphere();
  cached = geometry;
  return geometry;
}

/** Lathe profile for the knight's base: foot, bell, collar ring and a flat platform. */
export const KNIGHT_BASE: [number, number][] = [
  [0, 0], [0.66, 0], [0.69, 0.03], [0.7, 0.08], [0.68, 0.13], [0.64, 0.15],
  [0.63, 0.17], [0.62, 0.22], [0.58, 0.25],
  [0.5, 0.3], [0.42, 0.37], [0.36, 0.46], [0.32, 0.58], [0.31, 0.7], [0.32, 0.76],
  [0.42, 0.79], [0.47, 0.82], [0.47, 0.87], [0.4, 0.89], [0.4, 0.92],
  [0.47, 0.94], [0.5, 0.97], [0.5, 1.03], [0.47, 1.06], [0, 1.06],
];
/** Where the head stands on the base, and how large it is drawn. */
export const KNIGHT_HEAD_Y = 1.04;
export const KNIGHT_HEAD_SCALE = 1.27;
