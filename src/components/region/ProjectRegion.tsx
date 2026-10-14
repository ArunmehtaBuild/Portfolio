import type { Region } from "@/data/types";
import { EvidenceLinks } from "../EvidenceLinks";
import { FadeUp } from "../motion/Reveal";
import { RichText } from "../RichText";
import { visuals } from "../visuals";
import { ChapterIntro } from "./ChapterIntro";
import { Chips } from "./Chips";
import { StatRow } from "./StatRow";
import { WorkGrid } from "./WorkGrid";

export function ProjectRegion({ region }: { region: Region }) {
  const Visual = visuals[region.slug];

  return (
    <section id={region.slug} data-stop={region.slug} aria-labelledby={`${region.slug}-title`} className="relative">
      <ChapterIntro
        id={region.slug}
        index={region.index}
        bearing={region.bearing}
        title={region.title}
        statement={region.statement}
        project={region.project}
        context={region.context}
      />

      <div className="mx-auto max-w-7xl space-y-20 px-5 pb-28 sm:px-8 sm:pb-36">
        {/* Problem and build on the left, the illustration pinned on the right. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-10 lg:col-span-5">
            <FadeUp>
              <h3 className="label mb-4">The problem</h3>
              <p className="text-[1.22rem] leading-[1.6]">
                <RichText text={region.problem} />
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h3 className="label mb-4">What we built</h3>
              <p className="text-[1.05rem] leading-[1.65] text-muted">
                <RichText text={region.built} />
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <Chips items={region.teamStack} label="Team stack" />
            </FadeUp>
          </div>
          {Visual && (
            <div className="lg:col-span-7">
              <div className="lg:sticky lg:top-28">
                <FadeUp>
                  <Visual />
                </FadeUp>
              </div>
            </div>
          )}
        </div>

        {region.teamResults.length > 0 && <StatRow stats={region.teamResults} caption="Team results" />}

        {/* Arun's own work: always its own block, never mixed with the team's. */}
        <div>
          <div className="mb-8 flex flex-col gap-6 border-t border-accent pt-8 lg:flex-row lg:items-end lg:justify-between">
            <FadeUp>
              <p className="label !text-accent">My part</p>
              <h3 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.02em]">
                {region.myWorkHeading.replace(/^What I did: /, "")}
              </h3>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Chips items={region.myStack} label="My tools" strong />
            </FadeUp>
          </div>
          <WorkGrid items={region.myWork} />
        </div>

        {(region.notes || region.status) && (
          <div className="grid gap-10 lg:grid-cols-12">
            {region.notes && (
              <FadeUp className="space-y-5 border-l-2 border-accent pl-6 lg:col-span-8">
                {region.notes.map((note, i) => (
                  <p
                    key={note}
                    className={i === 0 ? "font-mono text-[0.95rem] text-accent" : "font-serif text-[clamp(1.35rem,2.2vw,1.75rem)] leading-[1.3] italic"}
                  >
                    <RichText text={note} />
                  </p>
                ))}
              </FadeUp>
            )}
            {region.status && (
              <FadeUp delay={0.1} className="self-start rounded-2xl border border-line bg-card p-6 lg:col-span-4">
                <p className="label flex items-center gap-2">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent" />
                  </span>
                  Status
                </p>
                <p className="mt-3 text-[1rem] leading-[1.6]">
                  <RichText text={region.status} />
                </p>
              </FadeUp>
            )}
          </div>
        )}

        <EvidenceLinks links={region.evidence} />
      </div>
    </section>
  );
}
