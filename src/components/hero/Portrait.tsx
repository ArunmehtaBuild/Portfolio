"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import type { PointerEvent } from "react";
import portrait from "@/assets/arun-portrait.jpg";

// The portrait as a framed chart specimen: corner ticks, a caption, and a gentle tilt
// toward the pointer. It wipes up into view on load.
export function Portrait() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 140, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 140, damping: 18 });
  const shineX = useTransform(px, [-0.5, 0.5], ["20%", "80%"]);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <motion.figure
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="relative mx-auto w-full max-w-[22rem] lg:max-w-none"
    >
      <motion.div
        data-reveal=""
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.35 }}
        className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] border border-line bg-card"
      >
        <motion.div
          data-reveal=""
          initial={{ scale: 1.25 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="absolute inset-0"
        >
          <Image
            src={portrait}
            alt="Arun Mehta, sitting in an office chair in a white shirt"
            placeholder="blur"
            priority
            sizes="(min-width: 1024px) 26rem, 22rem"
            className="h-full w-full object-cover object-[50%_30%]"
          />
        </motion.div>
        {/* Light sheen that follows the tilt. */}
        <motion.div
          aria-hidden="true"
          style={{ left: shineX }}
          className="pointer-events-none absolute top-0 h-full w-1/2 -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,255,255,0.16),transparent)] mix-blend-soft-light"
        />
        {/* Corner ticks */}
        {["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((c) => (
          <span key={c} aria-hidden="true" className={`absolute size-5 border-accent ${c}`} />
        ))}
      </motion.div>
      <figcaption className="label mt-4 flex items-center justify-between gap-4">
        <span>Fig. 01 · Arun Mehta</span>
        <span className="text-accent">Director &amp; COO, Nexera</span>
      </figcaption>
    </motion.figure>
  );
}
