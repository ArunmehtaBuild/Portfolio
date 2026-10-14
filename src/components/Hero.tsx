import { profile } from "@/data/profile";
import { Contours } from "./Contours";

export function Hero() {
  const links = [
    ...profile.links,
    { label: "Email", href: `mailto:${profile.email}` },
    ...(profile.resumeHref ? [{ label: "Résumé", href: profile.resumeHref }] : []),
  ];

  return (
    <section id="origin" data-stop="origin" aria-labelledby="origin-title" className="relative isolate pt-10 pb-20 sm:pt-16 sm:pb-28">
      <Contours className="pointer-events-none absolute -top-10 -right-24 -z-10 w-[46rem] max-w-none opacity-80 sm:-right-40 sm:w-[60rem]" />

      <p className="label">Region 00 · Origin · New Delhi · 28.61°N 77.21°E</p>
      <h1 id="origin-title" className="mt-6 text-[3.4rem] leading-[0.95] font-medium tracking-[-0.025em] sm:text-[5.2rem]">
        {profile.name}
      </h1>
      <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.85rem] text-muted">
        {profile.tagline.map((part, i) => (
          <span key={part} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden="true" className="text-survey">·</span>}
            {part}
          </span>
        ))}
      </p>

      <div className="mt-10 max-w-[36rem] space-y-4 text-[1.25rem] leading-[1.6] sm:text-[1.35rem]">
        {profile.intro.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href="#nexera"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-mono text-[0.82rem] text-paper transition-opacity hover:opacity-85"
        >
          Explore the map <span aria-hidden="true">↓</span>
        </a>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            className="inline-flex items-center rounded-full border border-line px-4 py-2.5 font-mono text-[0.82rem] transition-colors hover:border-sea hover:text-sea"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
