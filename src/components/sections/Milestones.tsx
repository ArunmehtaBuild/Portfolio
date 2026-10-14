"use client";

import { motion } from "motion/react";
import { milestones } from "@/data/milestones";
import { RichText } from "../RichText";
import { SectionHead } from "./SectionHead";

// Results as a compact grid: one glance, no long scroll. Cards tilt in on arrival.
export function Milestones() {
  return (
    <section id="milestones" data-stop="milestones" aria-labelledby="milestones-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead index="04" label="Track record" id="milestones-title" title="Milestones" />

      <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {milestones.map((m, i) => (
          <motion.li
            key={m.event}
            data-reveal=""
            initial={{ opacity: 0, y: 30, rotate: i % 2 ? 1.5 : -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.08 }}
            className="group flex flex-col justify-between gap-8 rounded-3xl border border-line bg-card p-7 transition-colors hover:border-accent"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-[0.72rem] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="label text-right">{m.event}</span>
            </div>
            <div>
              <p className="font-serif text-[clamp(2.1rem,3.2vw,2.8rem)] leading-[0.95] italic">{m.result}</p>
              {m.detail && (
                <p className="mt-3 text-[0.95rem] leading-[1.6] text-muted">
                  <RichText text={m.detail} />
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
