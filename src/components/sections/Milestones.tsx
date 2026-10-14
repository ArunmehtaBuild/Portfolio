"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { milestones } from "@/data/milestones";
import { RichText } from "../RichText";
import { SplitWords } from "../motion/Reveal";
import { useMedia } from "../motion/useMedia";

// Desktop: the section pins and vertical scrolling slides the cards sideways.
// Phones: a native swipeable row with snap points.
export function Milestones() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const pinned = useMedia("(min-width: 1024px)");
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);

  // How far the track must travel so its last card ends inside the viewport.
  useEffect(() => {
    if (!pinned || !track.current) return;
    const measure = () => setDistance(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth + 64));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pinned]);
  const progress = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <section ref={ref} id="milestones" data-stop="milestones" aria-labelledby="milestones-title" className="relative lg:h-[320vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-5 pt-28 sm:px-8 lg:pt-0">
          <p className="label flex items-center gap-3">
            <span className="inline-block h-px w-10 bg-accent" />
            Region 07 · Survey record
          </p>
          <div className="mt-6 flex items-end justify-between gap-6">
            <h2 id="milestones-title" className="text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.98] font-semibold tracking-[-0.03em]">
              <SplitWords text="Milestones" />
            </h2>
            <div className="mb-3 hidden w-48 lg:block" aria-hidden="true">
              <div className="h-[2px] w-full bg-line">
                <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-accent" />
              </div>
              <p className="label mt-2 text-right">Scroll →</p>
            </div>
          </div>
        </div>

        <div className="mt-12 overflow-x-auto pb-6 [scrollbar-width:none] lg:overflow-visible lg:pb-0">
          <motion.ol
            ref={track}
            style={pinned ? { x } : undefined}
            className="flex w-max snap-x snap-mandatory gap-5 px-5 sm:px-8 lg:snap-none lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
          >
            {milestones.map((m, i) => (
              <li
                key={m.event}
                className="flex w-[78vw] max-w-[24rem] shrink-0 snap-start flex-col justify-between gap-10 rounded-3xl border border-line bg-card p-7 sm:w-[24rem] lg:h-[24rem]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[0.72rem] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="label text-right">{m.event}</span>
                </div>
                <div>
                  <p className="font-serif text-[clamp(2.4rem,4vw,3.4rem)] leading-[0.95] italic">{m.result}</p>
                  {m.detail && (
                    <p className="mt-4 text-[0.98rem] leading-[1.6] text-muted">
                      <RichText text={m.detail} />
                    </p>
                  )}
                </div>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
