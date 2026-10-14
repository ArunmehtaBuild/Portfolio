"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Smooth, weighted scrolling for the whole page. Skipped entirely for people who ask
// their system for reduced motion; MotionConfig also tones down every animation for them.
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      {reduce ? children : (
        <ReactLenis root options={{ lerp: 0.09, anchors: { offset: -72 }, wheelMultiplier: 1 }}>
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
