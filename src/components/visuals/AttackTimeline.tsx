"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { VisualFrame } from "./VisualFrame";

// NETWM: one network state per minute, left to right. An attack lights up stage by stage,
// and the model's imagined next five minutes sit in the hatched zone on the right.
const STAGES = ["Recon", "Initial access", "Lateral movement", "C2"];
const COLS = 10;
const ROWS = 5;
// Nodes that belong to the unfolding attack, as [column, row].
const PATH: [number, number][] = [
  [0, 2], [1, 1], [2, 1], [3, 2], [4, 3], [5, 3], [6, 2], [7, 1], [8, 2], [9, 2],
];

export function AttackTimeline() {
  const x = (c: number) => 28 + c * 36;
  const y = (r: number) => 44 + r * 46;
  const loop = 6;
  // Unique per instance: the same illustration can be on screen twice (card and panel).
  const hatch = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-hatch`;

  return (
    <VisualFrame fig={2} caption="One state per minute, five ahead">
      <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id={hatch} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" style={{ stroke: "var(--line)" }} strokeWidth="2" />
          </pattern>
        </defs>
        <rect x={x(6.5)} y="18" width={400 - x(6.5)} height="250" fill={`url(#${hatch})`} />
        <text x={x(6.5) + 8} y="32" className="font-mono" fontSize="8" style={{ fill: "var(--muted)" }}>
          IMAGINED · t+1 … t+5 min
        </text>

        {/* Background grid of hosts */}
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const c = i % COLS;
          const r = Math.floor(i / COLS);
          return <circle key={i} cx={x(c)} cy={y(r)} r="2.6" style={{ fill: "var(--line)" }} />;
        })}

        {/* The attack path, drawn and re-drawn */}
        <motion.polyline
          points={PATH.map(([c, r]) => `${x(c)},${y(r)}`).join(" ")}
          fill="none"
          style={{ stroke: "var(--accent)" }}
          strokeWidth="1.6"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1] }}
          transition={{ duration: loop, times: [0, 0.75, 1], repeat: Infinity, ease: "easeInOut" }}
        />
        {PATH.map(([c, r], i) => (
          <motion.circle
            key={`${c}-${r}`}
            cx={x(c)}
            cy={y(r)}
            r="5"
            style={{ fill: c > 6 ? "var(--card)" : "var(--accent)", stroke: "var(--accent)" }}
            strokeWidth="1.4"
            strokeDasharray={c > 6 ? "2 2" : undefined}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 0, 1.25, 1, 1] }}
            transition={{ duration: loop, times: [0, (i / PATH.length) * 0.75, (i / PATH.length) * 0.75 + 0.05, (i / PATH.length) * 0.75 + 0.09, 1], repeat: Infinity }}
          />
        ))}

        {/* Time cursor */}
        <motion.line
          y1="18"
          y2="268"
          style={{ stroke: "var(--fg)" }}
          strokeOpacity="0.35"
          strokeWidth="1"
          animate={{ x1: [x(0), x(9), x(9)], x2: [x(0), x(9), x(9)] }}
          transition={{ duration: loop, times: [0, 0.75, 1], repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Kill-chain stages, on two rows so long names never collide. */}
        {STAGES.map((stage, i) => (
          <text
            key={stage}
            x={20 + (i % 2) * 190}
            y={290 + Math.floor(i / 2) * 15}
            className="font-mono"
            fontSize="8.5"
            style={{ fill: "var(--muted)" }}
          >
            {String(i + 1).padStart(2, "0")} {stage.toUpperCase()}
          </text>
        ))}
      </svg>
    </VisualFrame>
  );
}
