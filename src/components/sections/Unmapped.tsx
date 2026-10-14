"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent } from "react";
import { unmapped } from "@/data/profile";
import { FadeUp, SplitWords } from "../motion/Reveal";

// The empty part of the map. A fog covers a chart grid; the pointer clears a patch of it.
// The text itself is always readable; only the decoration responds.
export function Unmapped() {
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const x = useSpring(mx, { stiffness: 220, damping: 30 });
  const y = useSpring(my, { stiffness: 220, damping: 30 });
  const mask = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, black 0%, black 35%, transparent 100%)`;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  }

  return (
    <section id="unmapped" data-stop="unmapped" aria-labelledby="unmapped-title" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <p className="label flex items-center gap-3">
        <span className="inline-block h-px w-10 border-t border-dashed border-muted" />
        Region 08 · Uncharted
      </p>

      <div
        onPointerMove={onMove}
        onPointerLeave={() => {
          mx.set(-400);
          my.set(-400);
        }}
        className="relative mt-8 overflow-hidden rounded-3xl border-2 border-dashed border-line"
      >
        {/* Hatched fog */}
        <div aria-hidden="true" className="absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--line)_0,var(--line)_1px,transparent_1px,transparent_14px)] opacity-70" />
        {/* What the pointer uncovers: a chart grid with a few soundings. */}
        <motion.div aria-hidden="true" style={{ maskImage: mask, WebkitMaskImage: mask }} className="absolute inset-0 bg-bg">
          <div className="chart-grid absolute inset-0 [mask-image:none]" />
          {["?", "?", "?", "?", "?"].map((q, i) => (
            <span
              key={i}
              className="absolute font-serif text-[2.4rem] text-accent italic"
              style={{ left: `${14 + i * 18}%`, top: `${22 + ((i * 37) % 55)}%` }}
            >
              {q}
            </span>
          ))}
        </motion.div>

        <div className="relative grid gap-10 px-6 py-16 sm:px-12 sm:py-24 lg:grid-cols-12">
          <h2 id="unmapped-title" className="font-serif text-[clamp(2.8rem,7vw,6rem)] leading-[0.95] italic lg:col-span-6">
            <SplitWords text={unmapped.title} />
          </h2>
          <FadeUp className="space-y-5 lg:col-span-6 lg:pt-4">
            {unmapped.paragraphs.map((p, i) => (
              <p key={p} className={i === 0 ? "text-[1.35rem] leading-[1.45] font-semibold" : "text-[1.05rem] leading-[1.7] text-muted"}>
                <span className="bg-bg/80 box-decoration-clone">{p}</span>
              </p>
            ))}
            <p className="label pt-4">Here be problems worth solving · move your cursor</p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
