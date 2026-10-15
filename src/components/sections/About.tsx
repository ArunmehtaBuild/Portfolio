import { about } from "@/data/profile";
import { Portrait } from "../hero/Portrait";
import { FadeUp, SplitWords } from "../motion/Reveal";
import { SectionHead } from "./SectionHead";

// Who Arun is in one screen: a lead line, a few short paragraphs, quick facts,
// and what's next.
export function About() {
  return (
    <section id="about" data-stop="about" aria-labelledby="about-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead index="01" label="About" id="about-title" accent="Who" title="I am" />

      <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="font-serif text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.12]">
            <SplitWords text={about.lead} stagger={0.025} />
          </p>
          <FadeUp delay={0.15} className="mt-8 space-y-5 text-[1.08rem] leading-[1.7] text-muted">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </FadeUp>

          <FadeUp delay={0.2} className="mt-10 rounded-2xl border-2 border-dashed border-line p-6">
            <p className="label flex items-center gap-2 !text-accent">
              <span className="inline-block size-2 rounded-full border border-dashed border-accent" />
              Currently exploring
            </p>
            <p className="mt-3 text-[1.02rem] leading-[1.65]">{about.exploring}</p>
          </FadeUp>
        </div>

        <div className="space-y-10 lg:col-span-5">
          <div className="mx-auto max-w-[20rem] lg:mx-0 lg:max-w-[22rem]">
            <Portrait />
          </div>
          <FadeUp as="div">
            <dl className="divide-y divide-line border-y border-line">
              {about.facts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[7.5rem_1fr] gap-4 py-4">
                  <dt className="label pt-0.5">{fact.label}</dt>
                  <dd className="text-[1rem] font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </FadeUp>

        </div>
      </div>
    </section>
  );
}
