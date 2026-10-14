"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { Region } from "@/data/types";
import { visuals } from "../visuals";

// Overview of one project. Only the headline facts; everything else lives in the
// project panel that opens on click.
export function ProjectCard({ region, order }: { region: Region; order: number }) {
  const Visual = visuals[region.slug];
  const stat = region.teamResults[0];

  return (
    <motion.article
      data-reveal=""
      data-tone={region.tone}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (order % 2) * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-bg text-fg transition-transform duration-500 hover:-translate-y-1.5"
    >
      <div className="flex items-center justify-between gap-3 px-6 pt-6 sm:px-7 sm:pt-7">
        <span className="font-mono text-[0.72rem] text-accent">{String(order + 1).padStart(2, "0")}</span>
        <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[0.66rem] tracking-[0.08em] uppercase">
          {region.status === "current" && (
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
          )}
          {region.badge}
        </span>
      </div>

      <div className="px-6 pt-5 sm:px-7">
        <div className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] [&_[data-visual]]:aspect-[16/10]">{Visual && <Visual />}</div>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-7 pb-6 sm:px-7 sm:pb-7">
        <h3 className="wide text-[clamp(1.7rem,3vw,2.3rem)] leading-none">{region.project}</h3>
        <p className="mt-3 font-serif text-[1.35rem] leading-[1.2] text-accent italic">{region.statement}</p>
        <p className="mt-3 text-[0.98rem] leading-[1.6] text-muted">{region.summary}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
          <div>
            <dt className="label">My part</dt>
            <dd className="mt-1.5 text-[0.95rem] font-semibold">{region.role}</dd>
          </div>
          {stat && (
            <div>
              <dt className="label">Team result</dt>
              <dd className="mt-1.5 text-[0.95rem]">
                <span className="font-mono font-semibold text-accent">{stat.value}</span>{" "}
                <span className="text-muted">{stat.label.split(",")[0]}</span>
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-7">
          <ul className="flex flex-wrap gap-1.5">
            {region.myStack.slice(0, 3).map((t) => (
              <li key={t} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.68rem] text-muted">
                {t}
              </li>
            ))}
          </ul>
          <Link
            href={`/projects/${region.slug}`}
            scroll={false}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-mono text-[0.74rem] tracking-[0.08em] text-bg uppercase after:absolute after:inset-0 after:content-['']"
          >
            Open project
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
