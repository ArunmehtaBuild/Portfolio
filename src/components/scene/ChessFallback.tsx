"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

// Used when WebGL isn't available: gold silhouettes of the same four pieces, crossfading
// as you scroll (pawn → knight → bishop → queen) and drifting like the 3D piece does.
const PIECES = [
  // Pawn
  "M30 92h40v-6c0-3-3-5-7-6l-3-1 2-22h6v-5H52c6-3 10-9 10-15 0-9-6-15-12-15s-12 6-12 15c0 6 4 12 10 15H32v5h6l2 22-3 1c-4 1-7 3-7 6z",
  // Knight
  "M28 92h46v-6c0-3-2-5-6-6l-2-1c-2-10 1-19 6-27 4-7 5-15 0-22-6-8-16-12-26-11l-4-7-4 9c-6 4-10 10-11 17l-5 8c-2 3-1 7 3 8l9 1c3-1 6-3 9-6 1 7-3 13-9 18-6 5-7 11-6 17l-3 1c-4 1-6 3-6 6z",
  // Bishop
  "M28 92h44v-6c0-3-3-5-7-6l-3-1 1-24h6v-5h-6c6-5 10-12 10-20 0-9-6-17-13-21 2-1 3-3 3-5 0-3-2-5-5-5s-5 2-5 5c0 2 1 4 3 5-7 4-13 12-13 21 0 8 4 15 10 20h-6v5h6l1 24-3 1c-4 1-7 3-7 6z",
  // Queen
  "M26 92h48v-6c0-3-3-5-7-6l-3-1 1-26h6v-5h-6l6-26 4-2c1-2 0-4-2-4s-3 2-2 4l-8 18-4-22c2 0 3-2 2-4s-4-2-5 0 0 4 2 4l-4 22-8-18c1-2 0-4-2-4s-3 2-2 4l4 2 6 26h-6v5h6l1 26-3 1c-4 1-7 3-7 6z",
];

function Silhouette({ d, progress, range }: { d: string; progress: MotionValue<number>; range: [number, number, number, number] }) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const rotateY = useTransform(progress, range, [80, 0, 0, -80]);
  return (
    <motion.svg viewBox="0 0 100 100" style={{ opacity, rotateY }} className="absolute inset-0 size-full drop-shadow-[0_30px_60px_rgba(255,190,40,0.25)]">
      <defs>
        <linearGradient id="gold-fallback" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset="0.35" stopColor="#ffc451" />
          <stop offset="0.7" stopColor="#c98a12" />
          <stop offset="1" stopColor="#6b4300" />
        </linearGradient>
      </defs>
      <path d={d} fill="url(#gold-fallback)" />
    </motion.svg>
  );
}

export function ChessFallback() {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 0.35, 0.6, 1], ["0vw", "4vw", "-6vw", "0vw"]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], ["0vh", "12vh", "4vh"]);
  // Each piece owns a stretch of the page; neighbours overlap briefly while they swap.
  const ranges: [number, number, number, number][] = [
    [-0.1, -0.05, 0.3, 0.38],
    [0.3, 0.38, 0.5, 0.58],
    [0.5, 0.58, 0.8, 0.88],
    [0.8, 0.88, 1.05, 1.1],
  ];
  return (
    <motion.div
      style={{ x, y, transformPerspective: 900 }}
      className="absolute top-[16vh] right-[8vw] size-[min(30vw,24rem)] max-md:top-[8vh] max-md:right-[-6vw] max-md:size-[48vw]"
    >
      {PIECES.map((d, i) => (
        <Silhouette key={i} d={d} progress={scrollYProgress} range={ranges[i]} />
      ))}
    </motion.div>
  );
}
