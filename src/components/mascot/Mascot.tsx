"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useActiveStop } from "../atlas/ActiveStop";
import type { MascotState } from "./Scene";

// The 3D scene is client-only and loaded after the page, so it never slows first paint.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

// What the mascot says when you reach each section, and when you click it.
const SECTION_LINES: Record<string, string> = {
  origin: "नमस्ते! Move your mouse, I’m watching.",
  about: "That’s me, in a few lines.",
  experience: "This is where I work: Nexera.",
  projects: "Pick a project, then hit Open.",
  milestones: "Keep scrolling. These slide sideways.",
  contact: "Say hi. The email’s right there.",
};
const CLICK_LINES = ["Hey! That tickles.", "नमस्कार!", "I like backends.", "Try the project carousel.", "Okay, okay, I’m walking."];

const now = () => performance.now() / 1000;

// A small 3D Arun that walks to the other side of the screen at each section, follows the
// pointer with its head and eyes, waves on hover, jumps on click and talks in a bubble.
export function Mascot() {
  const { stops, index } = useActiveStop();
  const reduce = useReducedMotion() ?? false;
  const wrapper = useRef<HTMLDivElement>(null);
  const state = useRef<MascotState>({
    pointer: { x: 0, y: 0 },
    waving: false,
    walking: false,
    facing: 0,
    jumpAt: -10,
    talkUntil: 0,
    lean: 0,
    calm: false,
  });

  // Even sections on the left (clear of the hero portrait), odd on the right. With reduced
  // motion it stays on the right and never walks.
  const side: "right" | "left" = reduce ? "right" : index % 2 === 0 ? "left" : "right";
  const [travel, setTravel] = useState(0);
  const [line, setLine] = useState<string | null>(null);
  const [shownFor, setShownFor] = useState(index);
  const lineMs = useRef(3400);
  const clickCount = useRef(0);

  // Reaching a new section: comment on it (state adjusted during render, not in an effect).
  if (index !== shownFor) {
    setShownFor(index);
    setLine(SECTION_LINES[stops[index]?.id] ?? null);
  }

  useEffect(() => {
    state.current.calm = reduce;
  }, [reduce]);

  // While a line is up the mouth moves, and the bubble hides on its own.
  useEffect(() => {
    if (!line) return;
    state.current.talkUntil = now() + Math.min(1.8, line.length * 0.06);
    const t = setTimeout(() => setLine(null), lineMs.current);
    lineMs.current = 3400;
    return () => clearTimeout(t);
  }, [line]);

  // First greeting, shortly after the page settles.
  useEffect(() => {
    const t = setTimeout(() => {
      lineMs.current = 4200;
      setLine(SECTION_LINES.origin);
    }, 1600);
    return () => clearTimeout(t);
  }, []);

  // Changing sides: face the way it walks and play the walk cycle for the trip.
  // Starts as "right" so it walks in from the right edge on load.
  const lastSide = useRef<"right" | "left">("right");
  useEffect(() => {
    if (side === lastSide.current || travel === 0) return;
    lastSide.current = side;
    state.current.facing = side === "left" ? -1 : 1;
    state.current.walking = true;
    const t = setTimeout(() => (state.current.walking = false), 1300);
    return () => clearTimeout(t);
  }, [side, travel]);

  // How far it walks: the width of the screen minus its own width and margins.
  useEffect(() => {
    const measure = () => setTravel(Math.max(0, window.innerWidth - (wrapper.current?.offsetWidth ?? 160) - 48));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Head and eyes follow the pointer, measured from the mascot's own head.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      const r = wrapper.current?.getBoundingClientRect();
      if (!r) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.32;
      state.current.pointer.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.45)));
      state.current.pointer.y = Math.max(-1, Math.min(1, -(e.clientY - cy) / (window.innerHeight * 0.45)));
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Lean into fast scrolling, then settle.
  useEffect(() => {
    let last = window.scrollY;
    let lastT = performance.now();
    let settle: ReturnType<typeof setTimeout>;
    function onScroll() {
      const t = performance.now();
      const v = (window.scrollY - last) / Math.max(1, t - lastT);
      last = window.scrollY;
      lastT = t;
      state.current.lean = Math.max(-0.22, Math.min(0.22, -v * 0.08));
      clearTimeout(settle);
      settle = setTimeout(() => (state.current.lean = 0), 140);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(settle);
    };
  }, []);

  function onClick() {
    state.current.jumpAt = now();
    lineMs.current = 2600;
    setLine(CLICK_LINES[clickCount.current++ % CLICK_LINES.length]);
  }

  return (
    <motion.div
      ref={wrapper}
      aria-hidden="true"
      className="fixed right-3 bottom-5 z-30 h-[9.5rem] w-[7rem] sm:right-6 sm:bottom-6 sm:h-[17rem] sm:w-[12rem]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0, x: side === "left" ? -travel : 0 }}
      transition={{
        opacity: { duration: 0.6, delay: 1 },
        y: { duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] },
        x: { duration: 1.3, ease: [0.45, 0, 0.25, 1] },
      }}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {line && (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute bottom-[92%] w-max max-w-[11rem] sm:max-w-[15rem] rounded-2xl border border-line bg-card px-4 py-2.5 text-[0.85rem] leading-snug font-medium text-fg shadow-lg ${
              side === "left" ? "left-2 origin-bottom-left" : "right-2 origin-bottom-right"
            }`}
          >
            {line}
            <span className={`absolute -bottom-1.5 size-3 rotate-45 border-r border-b border-line bg-card ${side === "left" ? "left-8" : "right-8"}`} />
          </motion.p>
        )}
      </AnimatePresence>

      <Scene state={state} />

      {/* Hit area over the body: hover to wave, click to jump. */}
      <button
        type="button"
        tabIndex={-1}
        onPointerEnter={() => (state.current.waving = true)}
        onPointerLeave={() => (state.current.waving = false)}
        onClick={onClick}
        className="absolute inset-x-[18%] top-[6%] bottom-[4%] cursor-pointer rounded-full"
      />
    </motion.div>
  );
}
