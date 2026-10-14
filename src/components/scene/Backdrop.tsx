"use client";

import { motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { Stop } from "@/data/atlas";
import { ChessFallback } from "./ChessFallback";
import { SceneBoundary } from "./SceneBoundary";

// The 3D scene loads in the browser only, after the page, so it never blocks first paint.
const ChessScene = dynamic(() => import("./ChessScene"), { ssr: false });

// Checked once per visit: can this browser create a WebGL context at all? If WebGL is
// disabled or blocked we never mount the canvas, so three.js doesn't log errors either.
let webgl: boolean | undefined;
function webglAvailable() {
  if (webgl === undefined) {
    try {
      const probe = document.createElement("canvas");
      webgl = !!(probe.getContext("webgl2") ?? probe.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}
const noSubscribe = () => () => {};

// Fixed, full-screen 3D layer behind every section. Purely decorative.
export function Backdrop({ stops }: { stops: Stop[] }) {
  const order = useMemo(() => stops.map((s) => s.id), [stops]);
  // WebGL can be missing or blocked; then flat gold silhouettes stand in so the page never breaks.
  const [lost, setLost] = useState(false);
  const supported = useSyncExternalStore(noSubscribe, webglAvailable, () => true);
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
      {lost || !supported ? (
        <ChessFallback />
      ) : (
        <SceneBoundary fallback={<ChessFallback />}>
          <ChessScene order={order} onLost={() => setLost(true)} />
        </SceneBoundary>
      )}
      {/* Scrim: the text column (left on desktop, top on phones) always sits on clean dark,
          while the board stays bright on the right. Plus a soft vignette. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,26,0.55)_0%,rgba(8,18,26,0.2)_40%,rgba(8,18,26,0.75)_100%)] md:bg-[linear-gradient(90deg,rgba(8,18,26,0.95)_0%,rgba(8,18,26,0.88)_36%,rgba(8,18,26,0.4)_58%,transparent_76%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,transparent_35%,rgba(5,8,11,0.6)_85%)]" />
    </motion.div>
  );
}
