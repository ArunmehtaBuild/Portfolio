"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { profile } from "@/data/profile";
import { FadeUp, SplitWords } from "../motion/Reveal";

// Hero: one full screen on the page's centred grid. The name sits low on the left, the gold
// pawn owns the right half, and a single row under a hairline holds the line about the work,
// the buttons and three quick facts. Nothing else, so the first screen stays calm.
export function Hero() {
  // The name fades out by window scroll in pixels (the hero is always the top of the page).
  // The buttons and facts below stay crisp so they can still be read and used.
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [40, 520], [1, 0]);
  const y = useTransform(scrollY, [0, 560], [0, -90]);
  const blur = useTransform(scrollY, [40, 520], [0, 14]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  const links = [
    ...profile.links,
    { label: "Email", href: `mailto:${profile.email}` },
    ...(profile.resumeHref ? [{ label: "Résumé", href: profile.resumeHref }] : []),
  ];
  const facts = [
    { label: "Currently", value: "Director & COO, Nexera" },
    { label: "Building", value: "OKEANOS · NETWM · SIH 2026" },
    { label: "Based in", value: profile.location },
  ];

  return (
    <section id="origin" data-stop="origin" aria-labelledby="origin-title" className="relative isolate overflow-hidden">
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-5 pt-24 pb-8 sm:px-8 sm:pt-28 sm:pb-10">
        {/* Landscape screens: the board fades into the page above the hairline, so the details
            sit on clean ground, like a caption under the picture. */}
        <div aria-hidden="true" className="hero-fade-bottom pointer-events-none absolute inset-x-[-50vw] bottom-0 -z-10" />
        {/* Portrait screens: a stage at the top for the pawn, like a picture above its caption. */}
        <div aria-hidden="true" className="hero-stage" />

        {/* The name sits low, just above the hairline, so name and board fill the top three
            quarters of the screen and the details sit below. */}
        <motion.div style={{ opacity, y, filter }} className="flex flex-1 flex-col justify-end pt-10 pb-10 sm:pb-12">
          <div className="relative">
            {/* Portrait screens: the board fades out just above the text. */}
            <div aria-hidden="true" className="hero-fade-text pointer-events-none absolute inset-x-[-50vw] -top-20 -z-10 h-[200vh]" />
            <FadeUp immediate className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {profile.tagline.map((part, i) => (
                <span key={part} className="flex items-center gap-3 font-mono text-[0.74rem] tracking-[0.14em] text-fg/80 uppercase">
                  {i > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-accent" />}
                  {part}
                </span>
              ))}
            </FadeUp>

            {/* One heavy face for both lines; the surname sits on a gold plate cast like the pawn. */}
            <h1 id="origin-title" className="name-display mt-6 text-[clamp(3.8rem,10.8vw,10.4rem)] leading-[0.92] sm:mt-8">
              <span className="block">
                <SplitWords text="Arun" immediate delay={0.2} />
              </span>
              <span className="mt-[0.08em] block">
                <span className="relative -ml-[0.1em] inline-block px-[0.1em] pt-[0.06em]">
                  <motion.span
                    aria-hidden="true"
                    data-reveal=""
                    className="gold-plate absolute inset-0 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                  />
                  <span className="relative">
                    <SplitWords text="Mehta" immediate delay={0.55} />
                  </span>
                </span>
              </span>
            </h1>
          </div>
        </motion.div>

        {/* One row under a hairline: the line about the work and the buttons, then the facts */}
        <FadeUp immediate delay={0.75} className="border-t border-line pt-7 sm:pt-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="max-w-[34rem] font-serif text-[clamp(1.45rem,2.1vw,1.9rem)] leading-[1.15]">{profile.headline}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3">
                <a
                  href="#projects"
                  className="group mr-2 inline-flex items-center gap-3 rounded-full bg-fg px-6 py-3.5 font-mono text-[0.78rem] font-medium tracking-[0.08em] text-bg uppercase transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-accent"
                >
                  See my work
                  <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
                </a>
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group inline-flex items-center gap-1.5 px-3 py-3 font-mono text-[0.74rem] tracking-[0.1em] text-muted uppercase transition-colors hover:text-fg"
                  >
                    {link.label}
                    <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  </a>
                ))}
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-y-3 sm:grid-cols-[repeat(3,auto)] sm:justify-between sm:gap-x-10 lg:justify-end lg:gap-x-14 lg:text-right">
              {facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-4 sm:block">
                  <dt className="label">{f.label}</dt>
                  <dd className="text-[0.95rem] leading-snug font-medium sm:mt-2 sm:text-[1rem] sm:whitespace-nowrap">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
