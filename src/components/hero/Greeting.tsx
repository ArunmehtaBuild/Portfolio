"use client";

import { motion } from "motion/react";

// "नमस्कार !" in heavy gold Devanagari. The reveal animates a wrapper so it doesn't fight
// the gold's own shadow filter; the sheen itself is CSS (.gold-3d).
export function Greeting() {
  return (
    <motion.p
      lang="hi"
      data-reveal=""
      initial={{ opacity: 0, y: 40, scale: 0.92, rotateX: 35 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      style={{ transformPerspective: 800 }}
      className="text-center leading-[1.15]"
    >
      <span className="gold-3d inline-block px-[0.08em] pb-[0.12em] font-hindi text-[clamp(4.2rem,15vw,12rem)]">नमस्कार !</span>
    </motion.p>
  );
}
