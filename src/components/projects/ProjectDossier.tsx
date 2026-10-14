import Link from "next/link";
import type { Region } from "@/data/types";
import { EvidenceLinks } from "../EvidenceLinks";
import { FadeUp, SplitWords } from "../motion/Reveal";
import { Chips } from "../region/Chips";
import { StatRow } from "../region/StatRow";
import { WorkGrid } from "../region/WorkGrid";
import { RichText } from "../RichText";
import { visuals } from "../visuals";

const sentenceCase = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// The full story of one project. Rendered inside the slide-up panel when opened from
// the home page, and as a standalone page when the URL is visited directly.
export function ProjectDossier({ region, prev, next }: { region: Region; prev: Region; next: Region }) {
  const Visual = visuals[region.slug];

  return (
    <article aria-labelledby={`${region.slug}-name`} className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      {/* Hero */}
      <header className="pt-10 sm:pt-14">
        <p className="label flex flex-wrap items-center gap-3">
          <span className="inline-block h-px w-10 bg-accent" />
          {region.bearing}
        </p>
        <h1 id={`${region.slug}-name`} className="wide mt-6 text-[clamp(3rem,10vw,7.5rem)] leading-[0.9]">
          <SplitWords text={region.project} immediate />
        </h1>
        <p className="mt-6 max-w-[30ch] font-serif text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.12] text-accent italic">{region.statement}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.72rem] tracking-[0.06em] uppercase">{region.badge}</span>
          <span className="rounded-full bg-accent px-3.5 py-1.5 font-mono text-[0.72rem] tracking-[0.06em] text-bg uppercase">My part · {region.role}</span>
          <span className="font-mono text-[0.75rem] text-muted">{region.context}</span>
        </div>
      </header>

      {Visual && (
        <FadeUp className="mt-14">
          <Visual />
        </FadeUp>
      )}

      {/* Overview */}
      <section className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-16" aria-label="Overview">
        <FadeUp>
          <h2 className="label mb-4">The problem</h2>
          <p className="text-[1.18rem] leading-[1.65]">
            <RichText text={region.problem} />
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="label mb-4">What we built</h2>
          <p className="text-[1.05rem] leading-[1.7] text-muted">
            <RichText text={region.built} />
          </p>
          <div className="mt-6">
            <Chips items={region.teamStack} label="Team stack" />
          </div>
        </FadeUp>
      </section>

      {region.teamResults.length > 0 && (
        <div className="mt-20">
          <StatRow stats={region.teamResults} caption="Team results" />
        </div>
      )}

      {/* Arun's own work, always separate from the team's */}
      <section className="mt-20" aria-labelledby={`${region.slug}-mine`}>
        <div className="mb-8 flex flex-col gap-6 border-t border-accent pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label !text-accent">My part</p>
            <h2 id={`${region.slug}-mine`} className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.02em]">
              {sentenceCase(region.myWorkHeading.replace(/^What I did: /, ""))}
            </h2>
          </div>
          <Chips items={region.myStack} label="My tools" strong />
        </div>
        <WorkGrid items={region.myWork} />
      </section>

      {(region.notes || region.progress) && (
        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          {region.notes && (
            <FadeUp className="space-y-5 border-l-2 border-accent pl-6 lg:col-span-8">
              {region.notes.map((note, i) => (
                <p key={note} className={i === 0 ? "font-mono text-[0.95rem] text-accent" : "font-serif text-[clamp(1.35rem,2.2vw,1.75rem)] leading-[1.3] italic"}>
                  <RichText text={note} />
                </p>
              ))}
            </FadeUp>
          )}
          {region.progress && (
            <FadeUp delay={0.1} className="self-start rounded-2xl border border-line bg-card p-6 lg:col-span-4">
              <p className="label flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                Status
              </p>
              <p className="mt-3 text-[1rem] leading-[1.6]">
                <RichText text={region.progress} />
              </p>
            </FadeUp>
          )}
        </div>
      )}

      <div className="mt-16">
        <EvidenceLinks links={region.evidence} />
      </div>

      {/* Move between projects without going back to the list */}
      <nav aria-label="More projects" className="mt-20 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
        {[
          { r: prev, dir: "Previous" },
          { r: next, dir: "Next" },
        ].map(({ r, dir }) => (
          <Link
            key={dir}
            href={`/projects/${r.slug}`}
            replace
            scroll={false}
            className={`group rounded-2xl border border-line p-6 transition-colors hover:border-accent ${dir === "Next" ? "sm:text-right" : ""}`}
          >
            <span className="label">{dir} project</span>
            <span className="wide mt-2 block text-[1.4rem]">
              {dir === "Previous" && <span aria-hidden="true" className="mr-2 inline-block transition-transform group-hover:-translate-x-1">←</span>}
              {r.project}
              {dir === "Next" && <span aria-hidden="true" className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>}
            </span>
          </Link>
        ))}
      </nav>
    </article>
  );
}
