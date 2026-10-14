"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { Region } from "@/data/types";
import { visuals } from "../visuals";

// Projects as a stacked deck. On desktop each card pins in turn and the next slides over
// it, while the cards beneath shrink back and dim into a visible stack. Phones get a
// plain vertical list. Each card is an overview; clicking it opens the full project.
export function ProjectDeck({ projects, header }: { projects: Region[]; header: ReactNode }) {
  const deck = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: deck, offset: ["start start", "end end"] });

  return (
    <section id="projects" data-stop="projects" aria-labelledby="projects-title" className="relative pt-24 pb-10 sm:pt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">{header}</div>
      <div ref={deck} className="mx-auto mt-12 max-w-7xl space-y-6 px-5 sm:px-8 md:mt-4 md:space-y-0">
        {projects.map((region, i) => (
          <DeckCard key={region.slug} region={region} index={i} total={projects.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

function DeckCard({ region, index, total, progress }: { region: Region; index: number; total: number; progress: MotionValue<number> }) {
  const Visual = visuals[region.slug];
  const stat = region.teamResults[0];
  const start = index / total;
  // Cards lower in the stack end up slightly smaller and darker.
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - index) * 0.045]);
  const shade = useTransform(progress, [start, Math.min(1, start + 1 / total)], [0, index === total - 1 ? 0 : 0.45]);

  return (
    <div style={{ "--stack": `${index * 22}px` } as CSSProperties} className="md:sticky md:top-0 md:flex md:h-[92vh] md:items-center">
      <motion.article
        data-tone={region.tone}
        data-cursor="Open"
        style={{ scale }}
        className="group relative w-full origin-top overflow-hidden rounded-[2rem] border border-line bg-bg text-fg md:top-[var(--stack)] md:min-h-[min(76vh,40rem)]"
      >
        {/* Accent glow and a large faint index for depth */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-1/3 -right-1/4 size-[70%] rounded-full bg-accent opacity-[0.07] blur-3xl" />
        <span aria-hidden="true" className="wide pointer-events-none absolute -bottom-[0.18em] -left-[0.04em] text-[clamp(8rem,22vw,18rem)] leading-none text-fg/[0.04] select-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative grid h-full gap-10 p-7 sm:p-10 md:min-h-[min(76vh,40rem)] lg:grid-cols-12 lg:gap-12 lg:p-12">
          <div className="flex flex-col lg:col-span-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[0.74rem] text-accent">
                {String(index + 1).padStart(2, "0")} <span className="text-muted">/ {String(total).padStart(2, "0")}</span>
              </span>
              <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[0.64rem] tracking-[0.1em] uppercase">
                {region.status === "current" && (
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                  </span>
                )}
                {region.badge}
              </span>
            </div>

            <h3 className="wide mt-8 text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[0.9]">{region.project}</h3>
            <p className="mt-5 max-w-[26ch] font-serif text-[clamp(1.4rem,2.3vw,1.9rem)] leading-[1.15] text-accent italic">{region.statement}</p>
            <p className="mt-4 max-w-[32rem] text-[1rem] leading-[1.65] text-muted">{region.summary}</p>

            <dl className="mt-auto grid grid-cols-2 gap-6 border-t border-line pt-6">
              <div>
                <dt className="label">My part</dt>
                <dd className="mt-2 text-[1.02rem] font-semibold">{region.role}</dd>
              </div>
              <div>
                <dt className="label">{stat ? "Result" : "Where it fits"}</dt>
                <dd className="mt-2 text-[0.95rem]">
                  {stat ? (
                    <>
                      <span className="font-mono text-[1.1rem] font-semibold text-accent">{stat.value}</span>{" "}
                      <span className="text-muted">{stat.label.split(",")[0]}</span>
                    </>
                  ) : (
                    <span className="text-muted">{region.context}</span>
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Link
                href={`/projects/${region.slug}`}
                scroll={false}
                className="inline-flex items-center gap-3 rounded-full bg-accent px-5 py-2.5 font-mono text-[0.74rem] font-medium tracking-[0.08em] text-bg uppercase after:absolute after:inset-0 after:content-['']"
              >
                Open project
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              {region.myStack.slice(0, 3).map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[0.66rem] text-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center lg:col-span-6 [&_[data-visual]]:aspect-[4/3]">
            <div className="w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]">{Visual && <Visual />}</div>
          </div>
        </div>

        {/* Darkens as the next card slides over this one */}
        <motion.div aria-hidden="true" style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.article>
    </div>
  );
}
