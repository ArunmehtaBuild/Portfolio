import { nexera, NEXERA_CHECKED_ON } from "@/data/nexera";
import { EvidenceLinks } from "../EvidenceLinks";
import { FadeUp } from "../motion/Reveal";
import { RichText } from "../RichText";
import { Constellation } from "../visuals/Constellation";
import { ChapterIntro } from "./ChapterIntro";
import { LaunchTimeline } from "./LaunchTimeline";
import { RunBuildTabs } from "./RunBuildTabs";
import { StatRow } from "./StatRow";

const checked = new Date(`${NEXERA_CHECKED_ON}T00:00:00Z`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function NexeraRegion() {
  const build = nexera.building.map((b) => ({ title: b.heading, text: b.text }));

  return (
    <section id={nexera.slug} data-stop={nexera.slug} aria-labelledby={`${nexera.slug}-title`} className="relative">
      <ChapterIntro
        id={nexera.slug}
        index={nexera.index}
        bearing={nexera.bearing}
        title={nexera.title}
        statement={nexera.statement}
        project={nexera.project}
        context={`${nexera.role} · ${nexera.period}`}
      />

      <div className="mx-auto max-w-7xl space-y-20 px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-10 lg:col-span-5">
            <FadeUp>
              <h3 className="label mb-4">The problem</h3>
              <p className="text-[1.22rem] leading-[1.6]">{nexera.problem}</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h3 className="label mb-4">What Nexera does</h3>
              <p className="text-[1.05rem] leading-[1.65] text-muted">
                <RichText text={nexera.whatNexeraDoes} />
              </p>
            </FadeUp>
          </div>
          <div className="lg:col-span-7">
            <FadeUp>
              <Constellation />
            </FadeUp>
          </div>
        </div>

        <div>
          <FadeUp className="mb-8 border-t border-accent pt-8">
            <p className="label !text-accent">My part</p>
            <h3 className="mt-3 max-w-[22ch] text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.02em]">
              I run it, and I build it.
            </h3>
          </FadeUp>
          <RunBuildTabs run={nexera.running} build={build} />
        </div>

        <LaunchTimeline launches={nexera.launches} />

        <StatRow stats={nexera.stats} caption="The scale · the whole team’s numbers" note={`Public figures, checked ${checked}`} />

        <FadeUp className="grid gap-6 lg:grid-cols-12">
          <p className="label lg:col-span-3">What it taught me</p>
          <blockquote className="font-serif text-[clamp(1.7rem,3.4vw,2.8rem)] leading-[1.12] italic lg:col-span-9">
            “{nexera.lesson}”
          </blockquote>
        </FadeUp>

        <EvidenceLinks links={[{ label: "nexeraofficial.in", href: nexera.href }]} />
      </div>
    </section>
  );
}
