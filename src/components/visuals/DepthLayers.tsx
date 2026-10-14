"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { VisualFrame } from "./VisualFrame";

// OKEANOS: an ocean cross-section to 1,000 m. Only the surface strip is "seen" by the
// satellite; a scan line sweeps across and reconstructs the temperature below it, the
// way the model turns surface fields into 15 depth levels. Colours are illustrative.
const COLS = 36;
const DEPTHS = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];
const STOPS: [number, [number, number, number]][] = [
  [0, [255, 196, 120]],
  [0.25, [244, 132, 95]],
  [0.5, [96, 160, 190]],
  [0.75, [40, 104, 158]],
  [1, [18, 52, 96]],
];

function colour(t: number) {
  const v = Math.min(1, Math.max(0, t));
  for (let i = 1; i < STOPS.length; i++) {
    const [p1, c1] = STOPS[i];
    const [p0, c0] = STOPS[i - 1];
    if (v <= p1) {
      const k = (v - p0) / (p1 - p0);
      return `rgb(${c0.map((c, j) => Math.round(c + (c1[j] - c) * k)).join(",")})`;
    }
  }
  return "rgb(18,52,96)";
}

// Deterministic field: warm near the surface, a wavy thermocline, cold at depth.
const CELLS = DEPTHS.flatMap((_, row) =>
  Array.from({ length: COLS }, (_, col) => {
    const depthT = row / (DEPTHS.length - 1);
    const wave = Math.sin(col / 4.2) * 0.07 + Math.sin(col / 9 + 1.3) * 0.05;
    return { row, col, fill: colour(depthT * 1.05 + wave - 0.04) };
  }),
);

const X0 = 46;
const W = 330;
const Y0 = 64;
const ROW_H = 15;
const CELL_W = W / COLS;
// Rounded so server and browser render identical attributes.
const cx = (col: number) => Math.round((X0 + col * CELL_W) * 100) / 100;
const CW = Math.round((CELL_W + 0.4) * 100) / 100;

export function DepthLayers() {
  // Unique per instance: the same illustration can be on screen twice (card and panel).
  const clip = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-scan`;
  const thermoTop = Y0 + 5 * ROW_H;
  const thermoBottom = Y0 + 11 * ROW_H;

  return (
    <VisualFrame fig={1} caption="Surface in, 15 depths out">
      <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full">
        <defs>
          <clipPath id={clip}>
            <motion.rect
              x={X0}
              y={Y0 + ROW_H}
              height={ROW_H * (DEPTHS.length - 1)}
              initial={{ width: 0 }}
              animate={{ width: [0, W, W, 0] }}
              transition={{ duration: 7, times: [0, 0.6, 0.9, 1], repeat: Infinity, ease: "easeInOut" }}
            />
          </clipPath>
        </defs>

        {/* Satellite over the surface */}
        <motion.g animate={{ x: [0, W - 30, 0] }} transition={{ duration: 7, times: [0, 0.6, 1], repeat: Infinity, ease: "easeInOut" }}>
          <path d={`M${X0 + 15} 26 L${X0 + 3} ${Y0} L${X0 + 27} ${Y0} Z`} style={{ fill: "var(--accent)" }} opacity="0.16" />
          <rect x={X0 + 8} y="16" width="14" height="8" rx="2" style={{ fill: "var(--accent)" }} />
          <rect x={X0 - 3} y="18" width="10" height="4" style={{ fill: "var(--muted)" }} />
          <rect x={X0 + 23} y="18" width="10" height="4" style={{ fill: "var(--muted)" }} />
        </motion.g>

        {/* Ghost of the unknown subsurface */}
        <rect x={X0} y={Y0 + ROW_H} width={W} height={ROW_H * (DEPTHS.length - 1)} style={{ fill: "var(--line)" }} opacity="0.45" />

        {/* Surface row: always known */}
        {CELLS.filter((c) => c.row === 0).map((c) => (
          <rect key={`s${c.col}`} x={cx(c.col)} y={Y0} width={CW} height={ROW_H} fill={c.fill} />
        ))}

        {/* Reconstructed rows, revealed by the scan */}
        <g clipPath={`url(#${clip})`}>
          {CELLS.filter((c) => c.row > 0).map((c) => (
            <rect key={`${c.row}-${c.col}`} x={cx(c.col)} y={Y0 + c.row * ROW_H} width={CW} height={ROW_H + 0.4} fill={c.fill} />
          ))}
        </g>

        {/* Scan line */}
        <motion.line
          y1={Y0}
          y2={Y0 + ROW_H * DEPTHS.length}
          style={{ stroke: "var(--fg)" }}
          strokeWidth="1.5"
          animate={{ x1: [X0, X0 + W, X0 + W, X0], x2: [X0, X0 + W, X0 + W, X0] }}
          transition={{ duration: 7, times: [0, 0.6, 0.9, 1], repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Thermocline band */}
        <rect x={X0} y={thermoTop} width={W} height={thermoBottom - thermoTop} fill="none" style={{ stroke: "var(--fg)" }} strokeDasharray="4 4" strokeWidth="1" opacity="0.7" />
        <text x={X0 + W - 4} y={thermoTop - 4} textAnchor="end" className="font-mono" fontSize="8" style={{ fill: "var(--fg)" }}>
          THERMOCLINE · 50–200 m
        </text>

        {/* Depth axis */}
        {[0, 5, 10, 13, 14].map((row) => (
          <text key={row} x={X0 - 6} y={Y0 + row * ROW_H + 10} textAnchor="end" className="font-mono" fontSize="7.5" style={{ fill: "var(--muted)" }}>
            {DEPTHS[row]}m
          </text>
        ))}
        <text x={X0} y={Y0 - 6} className="font-mono" fontSize="7.5" style={{ fill: "var(--muted)" }}>
          SATELLITE SURFACE
        </text>
      </svg>
    </VisualFrame>
  );
}
