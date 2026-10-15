"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { useActiveStop } from "./ActiveStop";
import { Logo } from "./Logo";

// Fixed header on the home page. Transparent over the hero, frosted once you scroll.
// The current section's name slides in as you move; a hairline shows overall progress.
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
      <div className="mx-auto w-full max-w-[110rem] px-5 sm:px-10 lg:px-14 flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
          {stops.slice(1).map((stop) => (
            <a
              key={stop.id}
              href={`#${stop.id}`}
              aria-current={stop.id === current.id ? "location" : undefined}
              className={`relative rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.1em] uppercase transition-colors ${
                stop.id === current.id ? "text-bg" : "text-muted hover:text-fg"
              }`}
            >
              {stop.id === current.id && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
              )}
              <span className="relative">{stop.label}</span>
            </a>
          ))}
        </nav>

        {/* Phones: the current section's name instead of the full nav. */}
        <div className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.1em] uppercase lg:hidden" aria-hidden="true">
          <span className="text-accent">{String(index).padStart(2, "0")}</span>
          <span className="relative h-4 w-24 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={current.id}
                className="absolute inset-0"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-110%" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {current.label}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
      </div>
      <motion.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-accent" />
    </header>
  );
}
