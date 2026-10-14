"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { useActiveStop } from "./ActiveStop";

// Fixed header. Transparent over the hero, frosted once you scroll. The current region's
// name slides in as you move between regions; a hairline at the bottom shows progress.
export function SiteHeader() {
  const { stops, index } = useActiveStop();
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));
  const current = stops[index];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled ? "border-b border-line bg-bg/75 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#origin" className="group flex items-center gap-3" aria-label="Arun Mehta, back to top">
          <span className="grid size-9 place-items-center rounded-full border border-fg font-serif text-[1.05rem] italic transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
            am
          </span>
          <span className="label hidden sm:block">Problem Atlas</span>
        </a>

        <div className="flex min-w-0 items-center gap-3 font-mono text-[0.72rem] tracking-[0.1em] uppercase" aria-live="polite">
          <span className="text-accent">{String(index).padStart(2, "0")}</span>
          <span className="relative h-4 w-28 overflow-hidden sm:w-40">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={current.id}
                className="absolute inset-0 truncate"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-110%" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {current.label}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        <a
          href="#contact"
          className="rounded-full border border-line px-4 py-2 font-mono text-[0.72rem] tracking-[0.08em] uppercase transition-colors hover:border-accent hover:bg-accent hover:text-bg"
        >
          Contact
        </a>
      </div>
      <motion.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-accent" />
    </header>
  );
}
