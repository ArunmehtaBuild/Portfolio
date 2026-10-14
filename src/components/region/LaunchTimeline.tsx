"use client";

import { motion } from "motion/react";

// The 2026 launches on a line that draws itself as it scrolls in, each stop popping up in turn.
export function LaunchTimeline({ launches }: { launches: { when: string; what: string }[] }) {
  return (
    <div>
      <p className="label mb-8">Launches I ran in 2026</p>
      <div className="relative">
        <motion.span
          aria-hidden="true"
          data-reveal=""
          className="absolute top-[0.6rem] left-0 hidden h-[2px] w-full origin-left bg-accent md:block"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <ol className="grid gap-8 md:grid-cols-3">
          {launches.map((launch, i) => (
            <motion.li
              key={launch.what}
              data-reveal=""
              className="relative pl-8 md:pt-10 md:pl-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.25 }}
            >
              <span aria-hidden="true" className="absolute top-1 left-0 size-5 rounded-full border-[3px] border-bg bg-accent ring-2 ring-accent md:top-0" />
              <span className="block font-mono text-[0.8rem] text-muted">{launch.when}</span>
              <span className="mt-2 block text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight font-semibold tracking-[-0.01em]">{launch.what}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
