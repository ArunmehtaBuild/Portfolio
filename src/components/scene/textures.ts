import * as THREE from "three";

// Procedural textures drawn on a canvas, so the scene needs no image files.

/** A tiled hexagonal pattern of soft dimples, used as the sphere's bump map. */
export function dimpleTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#c8c8c8";
  ctx.fillRect(0, 0, size, size);
  const step = 16;
  const r = 5.6;
  for (let row = 0, y = 0; y < size + step; row++, y += step * 0.866) {
    for (let x = row % 2 ? step / 2 : 0; x < size + step; x += step) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "#6a6a6a");
      g.addColorStop(1, "#c8c8c8");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 3);
  texture.anisotropy = 4;
  return texture;
}

/** Dark terrazzo: near-black stone with fine light specks and faint blotches. */
export function stoneTexture(seed = 1): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  // Small deterministic PRNG so every load looks the same.
  let s = seed * 9301 + 49297;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);

  ctx.fillStyle = "#141518";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(${40 + rand() * 25}, ${40 + rand() * 25}, ${44 + rand() * 25}, ${0.25 + rand() * 0.3})`;
    ctx.beginPath();
    ctx.arc(rand() * size, rand() * size, 6 + rand() * 26, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 1400; i++) {
    const a = 0.35 + rand() * 0.6;
    ctx.fillStyle = `rgba(225, 228, 232, ${a})`;
    const r = rand() < 0.92 ? 0.6 + rand() * 0.9 : 1.6 + rand() * 1.4;
    ctx.beginPath();
    ctx.arc(rand() * size, rand() * size, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
