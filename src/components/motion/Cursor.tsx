"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

// Custom cursor for mouse users, drawn like a square being picked on a chessboard: a small
// diamond tracks the pointer exactly and four corner brackets (the logo's frame) trail it
// on a spring. Over links and buttons the frame opens wider; elements with
// data-cursor="Open" (or any word) show that word in a small tag. Touch devices and
// keyboards never see it, and the system cursor comes back if JS fails.
export function Cursor() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, reduce ? { duration: 0 } : { stiffness: 420, damping: 36, mass: 0.6 });
  const ringY = useSpring(y, reduce ? { duration: 0 } : { stiffness: 420, damping: 36, mass: 0.6 });
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const html = document.documentElement;

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!html.classList.contains("has-cursor")) html.classList.add("has-cursor");
      setActive(true);
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? null);
      setHover(!!target?.closest("a, button, [role='tab'], [data-cursor]"));
    }
    const onLeave = () => setActive(false);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      html.classList.remove("has-cursor");
    };
  }, [x, y]);

  const frame = label ? 64 : hover ? 46 : 26;
  const corner = "absolute size-2 border-fg";

  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}>
      <motion.div style={{ x: ringX, y: ringY }} className="absolute top-0 left-0">
        <motion.div
          animate={{ width: frame, height: frame, rotate: hover ? 0 : 45, scale: down ? 0.8 : 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="relative -translate-x-1/2 -translate-y-1/2"
        >
          <span className={`${corner} top-0 left-0 border-t-2 border-l-2`} />
          <span className={`${corner} top-0 right-0 border-t-2 border-r-2`} />
          <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
          <span className={`${corner} right-0 bottom-0 border-r-2 border-b-2`} />
        </motion.div>
        {label && (
          <span className="absolute top-0 left-0 -translate-x-1/2 translate-y-[2.6rem] rounded-sm bg-accent px-2 py-1 font-mono text-[0.6rem] whitespace-nowrap tracking-[0.12em] text-bg uppercase">
            {label}
          </span>
        )}
      </motion.div>
      <motion.div style={{ x, y }} className="absolute top-0 left-0">
        <div className={`size-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent transition-transform ${hover ? "scale-125" : ""}`} />
      </motion.div>
    </div>
  );
}
