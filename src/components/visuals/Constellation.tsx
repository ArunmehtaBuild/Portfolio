"use client";

import { motion } from "motion/react";
import { VisualFrame } from "./VisualFrame";

// Nexera: a hub with three products in orbit and forty-odd college dots around it,
// standing in for the 40+ GGSIPU colleges on IPUClan. Positions are decorative.
const PRODUCTS = ["IPUNEX", "SkillX", "IPUClan"];
const COLLEGES = Array.from({ length: 42 }, (_, i) => {
  const ring = i % 3;
  const angle = (i / 42) * Math.PI * 2 + ring * 0.35;
  const radius = 98 + ring * 26 + ((i * 7) % 9);
  // Rounded so server and browser render identical attributes (no hydration mismatch).
  const round = (n: number) => Math.round(n * 100) / 100;
  return { x: round(200 + Math.cos(angle) * radius * 1.25), y: round(160 + Math.sin(angle) * radius * 0.82), ring };
});

export function Constellation() {
  return (
    <VisualFrame fig={1} caption="One hub for 40+ colleges">
      <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full">
        {COLLEGES.map((c, i) => (
          <motion.line
            key={`l${i}`}
            x1="200"
            y1="160"
            x2={c.x}
            y2={c.y}
            style={{ stroke: "var(--accent)" }}
            strokeWidth="0.6"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.35 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.2 + i * 0.025 }}
          />
        ))}
        {COLLEGES.map((c, i) => (
          <motion.circle
            key={`c${i}`}
            cx={c.x}
            cy={c.y}
            r={2.6 - c.ring * 0.5}
            style={{ fill: "var(--fg)" }}
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.6, delay: (i % 7) * 0.35, repeat: Infinity }}
          />
        ))}

        {/* Orbiting products */}
        <motion.g
          style={{ originX: "200px", originY: "160px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <ellipse cx="200" cy="160" rx="62" ry="44" fill="none" style={{ stroke: "var(--line)" }} strokeDasharray="3 4" />
          {PRODUCTS.map((p, i) => {
            const a = (i / PRODUCTS.length) * Math.PI * 2;
            const cx = Math.round((200 + Math.cos(a) * 62) * 100) / 100;
            const cy = Math.round((160 + Math.sin(a) * 44) * 100) / 100;
            return <circle key={p} cx={cx} cy={cy} r="5" style={{ fill: "var(--accent)" }} />;
          })}
        </motion.g>

        <circle cx="200" cy="160" r="22" style={{ fill: "var(--fg)" }} />
        <text x="200" y="163.5" textAnchor="middle" className="font-mono" fontSize="9" fontWeight="500" style={{ fill: "var(--bg)" }}>
          NEXERA
        </text>
        {PRODUCTS.map((p, i) => (
          <text key={p} x={16} y={290 - (PRODUCTS.length - 1 - i) * 14} className="font-mono" fontSize="8.5" style={{ fill: "var(--muted)" }}>
            ● {p}
          </text>
        ))}
      </svg>
    </VisualFrame>
  );
}
