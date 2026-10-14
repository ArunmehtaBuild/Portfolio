"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SplitWords } from "../motion/Reveal";

interface Props {
  id: string;
  index: number;
  bearing: string;
  title: string;
  statement: string;
  project: string;
  context: string;
}

// Opens a region. While it passes through the viewport, the giant region number drifts
// and grows, and the statement slides in: a chapter break, not just another heading.
export function ChapterIntro({ id, index, bearing, title, statement, project, context }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const numeralY = useTransform(scrollYProgress, [0, 1], ["-18%", "22%"]);
  const numeralScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1.12]);
  const numeralOpacity = useTransform(scrollYProgress, [0, 0.3, 0.75, 1], [0, 1, 1, 0.2]);
  const statementX = useTransform(scrollYProgress, [0.15, 0.55], ["6%", "0%"]);

  return (
    <div ref={ref} className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20">
      <motion.span
        aria-hidden="true"
        style={{ y: numeralY, scale: numeralScale, opacity: numeralOpacity }}
        className="pointer-events-none absolute -top-6 right-[-4vw] -z-10 font-serif text-[clamp(16rem,42vw,34rem)] leading-none text-line italic select-none"
      >
        {String(index).padStart(2, "0")}
      </motion.span>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="label flex flex-wrap items-center gap-3">
          <span className="inline-block h-px w-10 bg-accent" />
          {bearing}
        </p>

        <h2 id={`${id}-title`} className="mt-7 max-w-[15ch] text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-balance">
          <SplitWords text={title} />
        </h2>

        <motion.p style={{ x: statementX }} className="mt-8 max-w-[30ch] font-serif text-[clamp(1.5rem,2.8vw,2.3rem)] leading-[1.15] text-accent italic">
          {statement}
        </motion.p>

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="wide text-[1.05rem]">{project}</span>
          <span className="hidden h-4 w-px bg-line sm:block" />
          <span className="font-mono text-[0.78rem] text-muted">{context}</span>
        </div>
      </div>
    </div>
  );
}
