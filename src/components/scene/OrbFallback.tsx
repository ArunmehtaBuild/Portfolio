"use client";

import { motion, useScroll, useTransform } from "motion/react";

// Used when WebGL isn't available: a CSS-drawn gold sphere that still drifts, shrinks and
// "rolls" as you scroll, so the page keeps its look without the 3D scene.
export function OrbFallback() {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 0.35, 0.6, 1], ["0vw", "12vw", "18vw", "4vw"]);
  const y = useTransform(scrollYProgress, [0, 0.35, 0.6, 1], ["0vh", "22vh", "34vh", "6vh"]);
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.6, 1], [1, 0.62, 0.45, 0.85]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 540]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 0.62, 0.8, 1], [1, 0.7, 0.15, 0.55, 0.9]);

  return (
    <motion.div style={{ x, y, scale, opacity }} className="absolute top-[14vh] right-[8vw] size-[min(34vw,26rem)] max-md:top-[9vh] max-md:right-[-12vw] max-md:size-[55vw]">
      <motion.div
        style={{ rotate }}
        className="size-full rounded-full shadow-[0_40px_90px_-20px_rgba(255,190,40,0.35)]"
      >
        <div className="size-full rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff1b8_0%,#ffd04a_18%,#f2a91c_48%,#a86a07_78%,#4a2c00_100%)]" />
        {/* Dimples */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.22)_1.1px,transparent_1.6px)] bg-[length:9px_9px] mix-blend-multiply [mask-image:radial-gradient(circle_at_40%_35%,black_40%,transparent_72%)]" />
      </motion.div>
    </motion.div>
  );
}
