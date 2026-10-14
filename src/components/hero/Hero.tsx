"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { profile } from "@/data/profile";
import { FadeUp, SplitWords } from "../motion/Reveal";

// Hero: the name is the subject. Kicker, name, one line about the work and the buttons sit
// in a clean column on the left; a facts bar is pinned to the bottom edge; the 3D board
// stays on the right behind a soft scrim so it never competes with the text.
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -90]);
  const blur = useTransform(scrollYProgress, [0, 0.55], [0, 14]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  const links = [
    ...profile.links,
    { label: "Email", href: `mailto:${profile.email}` },
    ...(profile.resumeHref ? [{ label: "Résumé", href: profile.resumeHref }] : []),
  ];
  const facts = [
    { label: "Currently", value: "Director & COO @ Nexera" },
    { label: "Building", value: "OKEANOS · NETWM · SIH 2026" },
    { label: "Based in", value: profile.location },
  ];

  return (
    <section ref={ref} id="origin" data-stop="origin" aria-labelledby="origin-title" className="relative isolate overflow-hidden">
      <motion.div style={{ opacity, y, filter }} className="mx-auto flex min-h-[100svh] max-w-7xl flex-col px-5 pt-32 sm:px-8 sm:pt-36">
        {/* Main column, vertically centred in the space above the facts bar */}
        <div className="flex flex-1 flex-col justify-center pb-10">
          <FadeUp immediate className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {profile.tagline.map((part, i) => (
              <span key={part} className="flex items-center gap-3 font-mono text-[0.74rem] tracking-[0.12em] text-muted uppercase">
                {i > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-accent" />}
                {part}
              </span>
            ))}
          </FadeUp>

          <h1 id="origin-title" className="mt-7 leading-[0.84]">
            <span className="block font-serif text-[clamp(4.6rem,13vw,10.5rem)] italic tracking-[-0.025em]">
              <SplitWords text="Arun" immediate delay={0.2} />
            </span>
            <span className="wide block text-[clamp(3.4rem,10vw,8.2rem)] text-accent">
              <SplitWords text="Mehta" immediate delay={0.4} />
            </span>
          </h1>

          <FadeUp immediate delay={0.7} className="mt-9 max-w-[36rem]">
            <p className="font-serif text-[clamp(1.5rem,2.3vw,1.95rem)] leading-[1.18]">{profile.headline}</p>
            <p className="mt-3 max-w-[32rem] text-[1rem] leading-[1.65] text-muted">{profile.subline}</p>
          </FadeUp>

          <FadeUp immediate delay={0.85} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3 font-mono text-[0.8rem] font-medium tracking-[0.06em] text-bg uppercase transition-transform hover:-translate-y-0.5"
            >
              See my work
              <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
            </a>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group inline-flex items-center gap-1.5 px-3 py-3 font-mono text-[0.76rem] tracking-[0.08em] text-muted uppercase transition-colors hover:text-fg"
              >
                {link.label}
                <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </a>
            ))}
          </FadeUp>
        </div>

        {/* Facts bar pinned to the bottom edge */}
        <FadeUp immediate delay={1} className="border-t border-line">
          <dl className="grid grid-cols-1 gap-x-10 gap-y-4 py-6 sm:grid-cols-3 sm:py-7">
            {facts.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-4 sm:block">
                <dt className="label">{f.label}</dt>
                <dd className="text-[0.98rem] font-medium sm:mt-1.5">{f.value}</dd>
              </div>
            ))}
          </dl>
        </FadeUp>
      </motion.div>
    </section>
  );
}
