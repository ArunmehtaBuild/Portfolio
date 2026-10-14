"use client";

import { motion } from "motion/react";
import { useId } from "react";
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
  // Unique per instance: the same illustration can be on screen twice (card and panel).
  const clip = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-water`;
  return (
    <VisualFrame fig={1} caption="15 depths, 0 to 1,000 m">
      <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full">
        <defs>
          <clipPath id={clip}>
            <rect x="0" y="0" width="346" height="320" />
          </clipPath>
        </defs>

        {/* Satellite and scan beam */}
        <motion.g initial={{ x: 40 }} animate={{ x: [40, 260, 40] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M30 22 L10 62 L50 62 Z" style={{ fill: "var(--accent)" }} opacity="0.14" />
          <rect x="22" y="12" width="16" height="9" rx="2" style={{ fill: "var(--accent)" }} />
          <rect x="8" y="14" width="12" height="5" style={{ fill: "var(--muted)" }} />
          <rect x="40" y="14" width="12" height="5" style={{ fill: "var(--muted)" }} />
        </motion.g>

        {/* Layers draw in once (parent variants); each drifts on its own CSS loop. */}
        <motion.g clipPath={`url(#${clip})`} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.3 }}>
          {DEPTHS.map((depth, i) => {
            const y = 70 + i * 16;
            const t = i / (DEPTHS.length - 1);
            return (
              <g key={depth} style={{ animation: `drift ${7 + i * 0.45}s ease-in-out ${-i * 0.7}s infinite alternate` }}>
                <motion.path
                  d={wave(y, 3.2 - t * 2, i * 0.6)}
                  fill="none"
                  stroke={mix(WARM, COLD, t)}
                  strokeWidth={i === 0 ? 2.4 : 1.6}
                  strokeLinecap="round"
                  variants={{
                    hidden: { pathLength: 0 },
                    shown: { pathLength: 1, transition: { duration: 1.2, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } },
                  }}
                />
              </g>
            );
          })}
        </motion.g>

        {DEPTHS.map((depth, i) => (
          <text key={depth} x="392" y={73 + i * 16} textAnchor="end" className="font-mono" fontSize="8" style={{ fill: "var(--muted)" }}>
            {depth} m
          </text>
        ))}

        {/* A single Argo float, for scale: roughly one profile per 3° box every ten days. */}
        <motion.g animate={{ y: [0, 150, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
          <rect x="196" y="64" width="6" height="14" rx="3" style={{ fill: "var(--fg)" }} />
          <line x1="199" y1="60" x2="199" y2="64" style={{ stroke: "var(--fg)" }} strokeWidth="1" />
        </motion.g>
      </svg>
    </VisualFrame>
  );
}
