import * as THREE from "three";

// Procedural textures drawn on a canvas, so the scene needs no image files.

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

/** A soft round shadow that grounds a piece where its foot meets the board. */
export function contactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(0, 0, 0, 0.85)");
  g.addColorStop(0.45, "rgba(0, 0, 0, 0.55)");
  g.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/** An 8×8 board in two tones of terrazzo, speckled across both, for the chessboard slab. */
export function boardTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  let s = 7 * 9301 + 49297;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const cell = size / 8;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      ctx.fillStyle = (r + c) % 2 ? "#101115" : "#2a2c33";
      ctx.fillRect(c * cell, r * cell, cell, cell);
    }
  }
  for (let i = 0; i < 4200; i++) {
    ctx.fillStyle = `rgba(225, 228, 232, ${0.25 + rand() * 0.55})`;
    const r = rand() < 0.93 ? 0.7 + rand() * 1 : 1.8 + rand() * 1.6;
    ctx.beginPath();
    ctx.arc(rand() * size, rand() * size, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // A thin gold inlay around the playing area.
  ctx.strokeStyle = "rgba(240, 190, 80, 0.55)";
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, size - 6, size - 6);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
