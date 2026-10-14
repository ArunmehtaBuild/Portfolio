"use client";

import { motion } from "motion/react";
import type { Stop } from "@/data/atlas";

// The whole atlas as one horizontal route under the hero. The line draws itself on load,
// then each stop pops in. Every stop is a link to its region.
export function RouteRibbon({ stops }: { stops: Stop[] }) {
  const charted = stops.slice(1);

  return (
    <nav aria-label="Regions on this page" className="relative hidden md:block">
      <svg aria-hidden="true" className="absolute top-[7px] left-0 h-3 w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 2">
        <motion.line
          x1="0"
          y1="1"
          x2="100"
          y2="1"
          style={{ stroke: "var(--line)" }}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="4 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
        />
      </svg>
      <ol className="relative flex justify-between">
        {charted.map((stop, i) => (
          <motion.li
            key={stop.id}
            data-reveal=""
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 + i * 0.07 }}
          >
            <a href={`#${stop.id}`} className="group flex flex-col items-center gap-2">
              <span className="size-4 rounded-full border-2 border-accent bg-bg transition-all duration-300 group-hover:scale-125 group-hover:bg-accent" />
              <span className="font-mono text-[0.68rem] tracking-[0.08em] text-muted uppercase transition-colors group-hover:text-fg">
                {String(i + 1).padStart(2, "0")} {stop.label}
              </span>
            </a>
          </motion.li>
        ))}
      </ol>
    </nav>
  );
}
