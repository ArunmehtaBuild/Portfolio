"use client";

import { motion } from "motion/react";
import { VisualFrame } from "./VisualFrame";

// OKEANOS: a satellite scans the surface while 15 depth layers, warm at the top and cold
// at 1,000 m, undulate below it. The same 15 depths the model reconstructs.
const DEPTHS = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];

function mix(a: number[], b: number[], t: number) {
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
}
const WARM = [255, 183, 107];
const COLD = [38, 118, 168];

function wave(y: number, amp: number, phase: number) {
  let d = `M0,${y}`;
  for (let x = 0; x <= 800; x += 20) d += ` L${x},${(y + Math.sin(x / 46 + phase) * amp).toFixed(1)}`;
  return d;
}

export function DepthLayers() {
  return (
    <VisualFrame fig={2} caption="15 depths, 0 to 1,000 m">
      <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full">
        {/* Satellite and scan beam */}
        <motion.g
          initial={{ x: 40 }}
          animate={{ x: [40, 300, 40] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M30 22 L10 62 L50 62 Z" style={{ fill: "var(--accent)" }} opacity="0.12" />
          <rect x="22" y="12" width="16" height="9" rx="2" style={{ fill: "var(--accent)" }} />
          <rect x="8" y="14" width="12" height="5" style={{ fill: "var(--muted)" }} />
          <rect x="40" y="14" width="12" height="5" style={{ fill: "var(--muted)" }} />
        </motion.g>

        {DEPTHS.map((depth, i) => {
          const y = 70 + i * 16;
          const t = i / (DEPTHS.length - 1);
          return (
            <g key={depth}>
              <motion.path
                d={wave(y, 3.2 - t * 2, i * 0.6)}
                fill="none"
                stroke={mix(WARM, COLD, t)}
                strokeWidth={i === 0 ? 2.4 : 1.6}
                strokeLinecap="round"
                initial={{ pathLength: 0, x: 0 }}
                whileInView={{ pathLength: 1 }}
                animate={{ x: [0, -92, 0] }}
                viewport={{ once: true }}
                transition={{
                  pathLength: { duration: 1.2, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
                  x: { duration: 7 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
                }}
              />
              <text x="392" y={y + 3} textAnchor="end" className="font-mono" fontSize="8" style={{ fill: "var(--muted)" }}>
                {depth} m
              </text>
            </g>
          );
        })}
        {/* A single Argo float, for scale: one profile per 3° box every ten days. */}
        <motion.g animate={{ y: [0, 150, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
          <rect x="196" y="64" width="6" height="14" rx="3" style={{ fill: "var(--fg)" }} />
          <line x1="199" y1="60" x2="199" y2="64" style={{ stroke: "var(--fg)" }} strokeWidth="1" />
        </motion.g>
      </svg>
    </VisualFrame>
  );
}
