// Topographic contour rings, computed once on the server. Deterministic, so the markup is
// identical on every render and needs no image assets.

function ring(cx: number, cy: number, radius: number, seed: number, steps = 48): string {
  const points: [number, number][] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const wobble = 1 + 0.09 * Math.sin(3 * t + seed) + 0.05 * Math.sin(5 * t + seed * 1.7) + 0.03 * Math.cos(7 * t - seed);
    points.push([cx + Math.cos(t) * radius * wobble * 1.35, cy + Math.sin(t) * radius * wobble]);
  }
  // Closed Catmull-Rom spline as cubic Béziers.
  let d = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  for (let i = 0; i < steps; i++) {
    const p0 = points[(i - 1 + steps) % steps];
    const p1 = points[i];
    const p2 = points[(i + 1) % steps];
    const p3 = points[(i + 2) % steps];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

const RINGS = Array.from({ length: 9 }, (_, i) => ring(520, 260, 36 + i * 30, 0.6 + i * 0.35));

export function Contours({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 520" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="var(--contour)" strokeWidth="1">
        {RINGS.map((d, i) => (
          <path key={i} d={d} strokeDasharray={i === 6 ? "4 6" : undefined} opacity={1 - i * 0.07} />
        ))}
      </g>
      <g stroke="var(--survey)" strokeWidth="1.2">
        <line x1="514" y1="260" x2="526" y2="260" />
        <line x1="520" y1="254" x2="520" y2="266" />
      </g>
    </svg>
  );
}
