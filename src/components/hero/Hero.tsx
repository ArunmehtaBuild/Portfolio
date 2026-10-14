"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { profile } from "@/data/profile";
import { FadeUp, SplitWords } from "../motion/Reveal";

// Hero in the style of a 3D landing page: the text sits bottom-left over a dotted grid,
// leaving the centre-right to the gold sphere in the scene behind. Scrolling away blurs
// and lifts the text out.
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

  return (
    <section ref={ref} id="origin" data-stop="origin" aria-labelledby="origin-title" className="relative isolate min-h-[100svh] overflow-hidden">
      <motion.div style={{ opacity, y, filter }} className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pt-28 pb-16 sm:px-8 sm:pb-20">
        <FadeUp immediate className="label">Portfolio · New Delhi · 28.61°N 77.21°E</FadeUp>

        <h1 id="origin-title" className="mt-6 leading-[0.86]">
          <span className="block font-serif text-[clamp(4.2rem,12vw,9.5rem)] italic tracking-[-0.02em]">
            <SplitWords text="Arun" immediate delay={0.3} />
          </span>
          <span className="wide block text-[clamp(3.2rem,9.4vw,7.4rem)] text-accent">
            <SplitWords text="Mehta" immediate delay={0.5} />
          </span>
        </h1>

        <FadeUp immediate delay={0.7} className="mt-8 flex flex-wrap gap-2">
          {profile.tagline.map((part) => (
            <span key={part} className="rounded-full border border-line bg-bg/40 px-3.5 py-1.5 font-mono text-[0.78rem] text-muted backdrop-blur-sm">
              {part}
            </span>
          ))}
        </FadeUp>

        <FadeUp immediate delay={0.85} className="mt-8 max-w-[34rem]">
          <p className="font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15]">{profile.headline}</p>
          <p className="mt-3 text-[1rem] leading-[1.6] text-muted">{profile.subline}</p>
        </FadeUp>

        <FadeUp immediate delay={1} className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="group inline-flex items-center gap-3 rounded-full bg-fg px-6 py-3 font-mono text-[0.8rem] tracking-[0.06em] text-bg uppercase transition-colors hover:bg-accent"
          >
            See my work
            <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
          </a>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              className="inline-flex items-center rounded-full border border-line bg-bg/40 px-5 py-3 font-mono text-[0.78rem] tracking-[0.06em] uppercase backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </FadeUp>
      </motion.div>

      {/* Scroll cue */}
      <motion.div style={{ opacity }} aria-hidden="true" className="absolute right-6 bottom-8 hidden items-center gap-3 sm:flex">
        <span className="label">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-accent" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
        </span>
      </motion.div>
    </section>
  );
}
