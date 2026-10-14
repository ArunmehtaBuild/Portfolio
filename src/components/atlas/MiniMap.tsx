"use client";

import { motion } from "motion/react";
import { useActiveStop } from "./ActiveStop";

// A vertical chart of every region, pinned to the left edge on wide screens. The active
// region stretches into a pill; labels appear on hover or focus. Plain anchor links.
export function MiniMap() {
  const { stops, index } = useActiveStop();

  return (
    <nav aria-label="Atlas" className="fixed top-1/2 left-5 z-30 hidden -translate-y-1/2 2xl:block">
      <ol className="flex flex-col gap-3">
        {stops.map((stop, i) => {
          const isActive = i === index;
          const reached = i <= index;
          return (
            <li key={stop.id}>
              <a
                href={`#${stop.id}`}
                aria-current={isActive ? "location" : undefined}
                className="group flex items-center gap-3 py-0.5"
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`block rounded-full ${isActive ? "h-7 w-1.5" : "h-1.5 w-1.5"} ${
                    stop.uncharted ? "border border-dashed border-muted" : reached ? "bg-accent" : "bg-line"
                  }`}
                />
                <span
                  className={`font-mono text-[0.66rem] tracking-[0.1em] uppercase transition-all duration-300 ${
                    isActive ? "translate-x-0 text-fg opacity-100" : "-translate-x-1 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  }`}
                >
                  {stop.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
