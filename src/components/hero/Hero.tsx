import { stops } from "@/data/atlas";
import { profile } from "@/data/profile";
import { FadeUp, SplitWords } from "../motion/Reveal";
import { Portrait } from "./Portrait";
import { RouteRibbon } from "./RouteRibbon";

export function Hero() {
  const links = [
    ...profile.links,
    { label: "Email", href: `mailto:${profile.email}` },
    ...(profile.resumeHref ? [{ label: "Résumé", href: profile.resumeHref }] : []),
  ];
  const [lead, ...rest] = profile.intro;

  return (
    <section id="origin" data-stop="origin" aria-labelledby="origin-title" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="chart-grid pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl content-center gap-12 px-5 pt-28 pb-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_27rem]">
        <div className="flex flex-col justify-center">
          <FadeUp className="label">Region 00 · Origin · New Delhi · 28.61°N 77.21°E</FadeUp>

          <h1 id="origin-title" className="mt-6 leading-[0.86]">
            <span className="block font-serif text-[clamp(4.6rem,15vw,11.5rem)] italic tracking-[-0.02em]">
              <SplitWords text="Arun" immediate delay={0.15} />
            </span>
            <span className="wide block text-[clamp(3.4rem,11.4vw,8.6rem)] text-accent">
              <SplitWords text="Mehta" immediate delay={0.3} />
            </span>
          </h1>

          <FadeUp delay={0.6} className="mt-8 flex flex-wrap gap-2">
            {profile.tagline.map((part) => (
              <span key={part} className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.78rem] text-muted">
                {part}
              </span>
            ))}
          </FadeUp>

          <FadeUp delay={0.75} className="mt-10 max-w-[38rem]">
            <p className="font-serif text-[clamp(1.6rem,2.6vw,2.1rem)] leading-[1.18]">{lead}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {rest.map((line, i) => (
                <p key={line} className="flex gap-3 text-[0.98rem] leading-[1.55] text-muted">
                  <span className="font-mono text-[0.72rem] text-accent">0{i + 1}</span>
                  {line}
                </p>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.9} className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#nexera"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3 font-mono text-[0.8rem] tracking-[0.06em] text-bg uppercase transition-transform hover:-translate-y-0.5"
            >
              Explore the map
              <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
            </a>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                className="inline-flex items-center rounded-full border border-line px-5 py-3 font-mono text-[0.78rem] tracking-[0.06em] uppercase transition-colors hover:border-accent hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </FadeUp>
        </div>

        <Portrait />
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <RouteRibbon stops={stops} />
      </div>
    </section>
  );
}
