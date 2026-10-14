"use client";

import { AnimatePresence, LayoutGroup, motion, type PanInfo } from "motion/react";
import Link from "next/link";
import { useCallback, useState, type KeyboardEvent, type ReactNode } from "react";
import type { Region } from "@/data/types";
import { visuals } from "../visuals";

const EASE = [0.22, 1, 0.36, 1] as const;

// Projects as a deck. The active project fills the stage; the next two peek out behind it
// in their own colours. The whole section takes on the active project's tone.
// Tabs, arrows, keyboard and swipe all move through it; "Open project" opens the panel.
export function ProjectCarousel({ projects, header }: { projects: Region[]; header: ReactNode }) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const count = projects.length;
  const active = projects[index];
  const Visual = visuals[active.slug];

  const go = useCallback(
    (next: number, dir?: number) => {
      const wrapped = (next + count) % count;
      setState(([current]) => [wrapped, dir ?? (wrapped > current ? 1 : -1)]);
    },
    [count],
  );

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1, -1);
    }
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -70 || info.velocity.x < -400) go(index + 1, 1);
    else if (info.offset.x > 70 || info.velocity.x > 400) go(index - 1, -1);
  }

  const behind = [1, 2].map((k) => projects[(index + k) % count]);

  return (
    <section
      id="projects"
      data-stop="projects"
      data-tone={active.tone}
      aria-labelledby="projects-title"
      className="tone-fade relative overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {header}
        <div role="region" aria-roledescription="carousel" aria-label="Projects" tabIndex={0} onKeyDown={onKeyDown} className="mt-12 outline-none">
          {/* Tabs */}
          <LayoutGroup id="project-tabs">
            <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
              <ul role="tablist" aria-label="Choose a project" className="flex min-w-max gap-1 border-b border-line">
                {projects.map((p, i) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      onClick={() => go(i)}
                      className={`relative flex items-center gap-2.5 px-4 pt-2 pb-4 text-left transition-colors ${i === index ? "text-fg" : "text-muted hover:text-fg"}`}
                    >
                      <span className="font-mono text-[0.68rem] text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <span className="wide text-[0.95rem]">{p.project}</span>
                      {p.status === "current" && <span aria-label="in progress" className="size-1.5 rounded-full bg-accent" />}
                      {i === index && (
                        <motion.span
                          layoutId="tab-underline"
                          className="absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-accent"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </LayoutGroup>

          {/* Stage */}
          <div className="relative isolate mt-10 mr-9 sm:mt-12">
            {/* The next two projects, stacked behind in their own tones */}
            {behind.map((p, k) => (
              <motion.div
                key={`${p.slug}-behind-${k}`}
                aria-hidden="true"
                data-tone={p.tone}
                className="absolute inset-0 rounded-[2rem] border border-line bg-bg"
                initial={false}
                animate={{ x: (k + 1) * 16, scale: 1 - (k + 1) * 0.05, opacity: 0.95 - k * 0.3 }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ zIndex: -1 - k, transformOrigin: "100% 50%" }}
              />
            ))}

            <div className="relative overflow-hidden rounded-[2rem] border border-line bg-card" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={active.slug}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: d * 140, opacity: 0, rotate: d * 1.5, filter: "blur(8px)" }),
                    center: { x: 0, opacity: 1, rotate: 0, filter: "blur(0px)" },
                    exit: (d: number) => ({ x: d * -140, opacity: 0, rotate: d * -1.5, filter: "blur(8px)" }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: EASE }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={onDragEnd}
                  className="grid cursor-grab gap-10 p-6 active:cursor-grabbing sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12"
                >
                  <div className="flex flex-col lg:col-span-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-serif text-[3.2rem] leading-none text-accent italic">{String(index + 1).padStart(2, "0")}</span>
                      <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[0.66rem] tracking-[0.08em] uppercase">
                        {active.status === "current" && (
                          <span className="relative flex size-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                            <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                          </span>
                        )}
                        {active.badge}
                      </span>
                    </div>

                    <h3 className="wide mt-6 text-[clamp(2.4rem,5.4vw,4.4rem)] leading-[0.92] font-black">{active.project}</h3>
                    <p className="mt-4 font-serif text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.15] text-accent italic">{active.statement}</p>
                    <p className="mt-4 max-w-[34rem] text-[1.02rem] leading-[1.65] text-muted">{active.summary}</p>

                    <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
                      <div>
                        <dt className="label">My part</dt>
                        <dd className="mt-2 text-[1.05rem] font-bold">{active.role}</dd>
                      </div>
                      {active.teamResults[0] ? (
                        <div>
                          <dt className="label">Result</dt>
                          <dd className="mt-2 text-[0.98rem]">
                            <span className="font-mono text-[1.15rem] font-semibold text-accent">{active.teamResults[0].value}</span>{" "}
                            <span className="text-muted">{active.teamResults[0].label.split(",")[0]}</span>
                          </dd>
                        </div>
                      ) : (
                        <div>
                          <dt className="label">Where it fits</dt>
                          <dd className="mt-2 text-[0.98rem] text-muted">{active.context}</dd>
                        </div>
                      )}
                    </dl>

                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                      <Link
                        href={`/projects/${active.slug}`}
                        scroll={false}
                        draggable={false}
                        className="group inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3 font-mono text-[0.76rem] font-medium tracking-[0.08em] text-bg uppercase"
                      >
                        Open project
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                      {active.myStack.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-6 [&_[data-visual]]:aspect-[4/3]">
                    <div className="mx-auto max-w-[30rem] lg:mt-2">{Visual && <Visual />}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-12 flex items-center justify-between gap-6 sm:mt-14">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(index - 1, -1)}
                aria-label="Previous project"
                className="grid size-12 place-items-center rounded-full border border-line text-[1.1rem] transition-colors hover:border-accent hover:bg-accent hover:text-bg"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(index + 1, 1)}
                aria-label="Next project"
                className="grid size-12 place-items-center rounded-full border border-line text-[1.1rem] transition-colors hover:border-accent hover:bg-accent hover:text-bg"
              >
                →
              </button>
            </div>
            <div className="flex flex-1 items-center gap-4">
              <div className="h-[2px] flex-1 bg-line">
                <motion.div className="h-full origin-left bg-accent" animate={{ scaleX: (index + 1) / count }} transition={{ duration: 0.6, ease: EASE }} />
              </div>
              <span className="font-mono text-[0.8rem] tabular-nums">
                <span className="text-accent">{String(index + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
              </span>
            </div>
            <span className="label hidden md:block">Drag · ← → keys</span>
          </div>

          {/* Without JS only the first slide shows, so list every project. */}
          <noscript>
            <ul className="mt-8 grid gap-2">
              {projects.map((p) => (
                <li key={p.slug}>
                  <a href={`/projects/${p.slug}`} className="prose-link">
                    {p.project}: {p.summary}
                  </a>
                </li>
              ))}
            </ul>
          </noscript>
        </div>
      </div>
    </section>
  );
}
