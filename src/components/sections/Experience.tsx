import { nexera, NEXERA_CHECKED_ON } from "@/data/nexera";
import { FadeUp } from "../motion/Reveal";
import { RunBuildTabs } from "../region/RunBuildTabs";
import { StatRow } from "../region/StatRow";
import { RichText } from "../RichText";
import { SectionHead } from "./SectionHead";

const checked = new Date(`${NEXERA_CHECKED_ON}T00:00:00Z`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

// Work experience. Kept separate from Projects: this is the role Arun holds, not a team build.
export function Experience() {
  const build = nexera.building.map((b) => ({ title: b.heading, text: b.text }));

  return (
    <section id="experience" data-stop="experience" aria-labelledby="experience-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead index="02" label="Experience" id="experience-title" accent="Where" title="I work" />

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Role card */}
        <FadeUp className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="label">{nexera.period}</p>
            <h3 className="wide mt-4 text-[clamp(2.2rem,4vw,3rem)] leading-none">{nexera.project}</h3>
            <p className="mt-3 text-[1.15rem] font-semibold">{nexera.role}</p>
            <p className="mt-5 text-[1rem] leading-[1.65] text-muted">
              <RichText text={nexera.whatNexeraDoes} />
            </p>
            <a
              href={nexera.href}
              target="_blank"
              rel="noreferrer"
              className="group mt-6 inline-flex items-center gap-2 font-mono text-[0.78rem] tracking-[0.06em] text-accent uppercase"
            >
              nexeraofficial.in
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
            </a>

            <div className="mt-8">
              <p className="label mb-3">Launches I ran in 2026</p>
              <ul className="flex flex-wrap gap-2">
                {nexera.launches.map((l) => (
                  <li key={l.what} className="rounded-full border border-line px-3 py-1.5 text-[0.85rem]">
                    <span className="font-mono text-[0.72rem] text-muted">{l.when}</span> · {l.what}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeUp>

        <div className="space-y-14 lg:col-span-8">
          <RunBuildTabs run={nexera.running} build={build} />
          <StatRow stats={nexera.stats} caption="Nexera’s scale · the whole team’s numbers" note={`Public figures, checked ${checked}`} compact />
        </div>
      </div>
    </section>
  );
}
