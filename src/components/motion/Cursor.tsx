"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

// Custom cursor for mouse users: a dot that tracks the pointer exactly and a ring that
// trails it on a spring. Over links and buttons the ring grows; elements with
// data-cursor="Open" (or any word) show that word inside the ring. Touch devices and
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

  const ringSize = label ? 76 : hover ? 54 : 34;

  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}>
      <motion.div style={{ x: ringX, y: ringY }} className="absolute top-0 left-0">
        <motion.div
          animate={{ width: ringSize, height: ringSize, scale: down ? 0.85 : 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full mix-blend-difference ${
            label ? "bg-white" : "border border-white/80"
          }`}
        >
          {label && <span className="font-mono text-[0.62rem] tracking-[0.12em] text-black uppercase">{label}</span>}
        </motion.div>
      </motion.div>
      <motion.div style={{ x, y }} className="absolute top-0 left-0">
        <div className={`size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference transition-opacity ${label ? "opacity-0" : ""}`} />
      </motion.div>
    </div>
  );
}
