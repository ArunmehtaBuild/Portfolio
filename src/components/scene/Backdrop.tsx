"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
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
  // The GPU can also drop the context mid-visit (sleep, tab switches, driver resets). Then the
  // silhouettes show briefly and the scene is rebuilt on a fresh canvas, a few times at most.
  const [lost, setLost] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!lost || attempt >= 4) return;
    const retry = () => {
      if (document.visibilityState !== "visible") return;
      setAttempt((a) => a + 1);
      setLost(false);
    };
    const timer = window.setTimeout(retry, 1200);
    document.addEventListener("visibilitychange", retry);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", retry);
    };
  }, [lost, attempt]);
  const supported = useSyncExternalStore(noSubscribe, webglAvailable, () => true);
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, delay: 0.2, ease: "easeOut" }}
    >
      {lost || !supported ? (
        <ChessFallback />
      ) : (
        <SceneBoundary key={attempt} fallback={<ChessFallback />}>
          <ChessScene order={order} onLost={() => setLost(true)} />
        </SceneBoundary>
      )}
      {/* Scrim: the text column (left on desktop, top on phones) always sits on clean dark,
          while the board stays bright on the right. Plus a soft vignette. */}
      <div className="scene-scrim absolute inset-0" />
      <div className="scene-vignette absolute inset-0" />
      {/* About is light too: a soft panel keeps the dark board from showing behind its text. */}
      <div className="scene-scrim-about absolute inset-0" />
    </motion.div>
  );
}
