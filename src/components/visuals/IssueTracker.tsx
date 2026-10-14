"use client";

import { motion } from "motion/react";
import { VisualFrame } from "./VisualFrame";

// Civic Setu: a pin drops on a street grid, then the report walks through the five
// stages a citizen can watch. Positions and timing are illustrative.
const STAGES = ["Submitted", "Acknowledged", "Assigned", "In progress", "Resolved"];
const LOOP = 7;

export function IssueTracker() {
  const stageAt = (i: number) => 0.18 + i * 0.13;

  return (
    <VisualFrame fig={5} caption="Five visible stages">
      <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full">
        {/* Street grid */}
        <g style={{ stroke: "var(--line)" }} strokeWidth="6" strokeLinecap="round">
          <line x1="40" y1="70" x2="360" y2="70" />
          <line x1="40" y1="150" x2="360" y2="150" />
          <line x1="110" y1="30" x2="110" y2="190" />
          <line x1="230" y1="30" x2="230" y2="190" />
          <line x1="320" y1="30" x2="320" y2="190" />
        </g>

        {/* Pin drop with ripple */}
        <motion.circle
          cx="230"
          cy="110"
          style={{ fill: "none", stroke: "var(--accent)" }}
          strokeWidth="1.5"
          animate={{ r: [0, 0, 26, 26], opacity: [0, 0.9, 0, 0] }}
          transition={{ duration: LOOP, times: [0, 0.1, 0.22, 1], repeat: Infinity }}
        />
        <motion.g animate={{ y: [-60, -60, 0, 0, 0], opacity: [0, 1, 1, 1, 0] }} transition={{ duration: LOOP, times: [0, 0.02, 0.1, 0.92, 1], repeat: Infinity, ease: "easeIn" }}>
          <path d="M230 110 C222 98 216 92 216 84 a14 14 0 0 1 28 0 c0 8 -6 14 -14 26 Z" style={{ fill: "var(--accent)" }} />
          <circle cx="230" cy="84" r="5" style={{ fill: "var(--bg)" }} />
        </motion.g>
        <motion.text
          x="252"
          y="96"
          className="font-mono"
          fontSize="8"
          style={{ fill: "var(--fg)" }}
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: LOOP, times: [0, 0.12, 0.16, 0.92, 1], repeat: Infinity }}
        >
          POTHOLE · PHOTO + GPS
        </motion.text>

        {/* Stage tracker */}
        <line x1="44" y1="250" x2="356" y2="250" style={{ stroke: "var(--line)" }} strokeWidth="2" />
        <motion.line
          x1="44"
          y1="250"
          y2="250"
          style={{ stroke: "var(--accent)" }}
          strokeWidth="2"
          animate={{ x2: [44, 44, 356, 356] }}
          transition={{ duration: LOOP, times: [0, stageAt(0), stageAt(4), 1], repeat: Infinity, ease: "linear" }}
        />
        {STAGES.map((stage, i) => {
          const x = 44 + i * 78;
          return (
            <g key={stage}>
              <circle cx={x} cy="250" r="7" strokeWidth="2" style={{ fill: "var(--card)", stroke: "var(--accent)" }} />
              <motion.circle
                cx={x}
                cy="250"
                r="7"
                style={{ fill: "var(--accent)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 1, 1, 0] }}
                transition={{ duration: LOOP, times: [0, stageAt(i) - 0.005, stageAt(i), 0.95, 1], repeat: Infinity }}
              />
              <text x={x} y="276" textAnchor="middle" className="font-mono" fontSize="7.5" style={{ fill: "var(--muted)" }}>
                {stage.toUpperCase()}
              </text>
            </g>
          );
        })}
        <motion.text
          x="356"
          y="232"
          textAnchor="end"
          className="font-mono"
          fontSize="9"
          fontWeight="500"
          style={{ fill: "var(--accent)" }}
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: LOOP, times: [0, stageAt(4), stageAt(4) + 0.02, 0.95, 1], repeat: Infinity }}
        >
          RESOLVED ✓
        </motion.text>
      </svg>
    </VisualFrame>
  );
}
