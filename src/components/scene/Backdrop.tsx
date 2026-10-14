"use client";

import { motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { Stop } from "@/data/atlas";

// The 3D scene loads in the browser only, after the page, so it never blocks first paint.
const OrbScene = dynamic(() => import("./OrbScene"), { ssr: false });

// Fixed, full-screen 3D layer behind every section. Purely decorative.
export function Backdrop({ stops }: { stops: Stop[] }) {
  const order = useMemo(() => stops.map((s) => s.id), [stops]);
  // The dotted grid belongs to the hero: it sits behind the sphere and fades as you leave.
  const { scrollY } = useScroll();
  const gridOpacity = useTransform(scrollY, [0, 700], [1, 0]);
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, delay: 0.2, ease: "easeOut" }}
    >
      <motion.div style={{ opacity: gridOpacity }} className="dot-grid absolute inset-0" />
      <OrbScene order={order} />
      {/* Vignette so text over the scene always has contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,transparent_30%,rgba(5,8,11,0.65)_80%)]" />
    </motion.div>
  );
}
