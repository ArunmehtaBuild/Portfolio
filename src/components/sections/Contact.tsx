import { profile } from "@/data/profile";
import { FadeUp, SplitWords } from "../motion/Reveal";

export function Contact() {
  const links = [
    { label: "GitHub", sub: "ArunmehtaBuild", href: profile.links[0].href },
    { label: "LinkedIn", sub: "arunmehtaa", href: profile.links[1].href },
    ...(profile.resumeHref ? [{ label: "Résumé", sub: "PDF", href: profile.resumeHref }] : []),
  ];

  return (
    <section id="contact" data-stop="contact" aria-labelledby="contact-title" className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 pt-24 pb-24 sm:px-8 sm:pt-32">
          <p className="label flex items-center gap-3">
            <span className="text-accent">05</span>
            <span className="inline-block h-px w-10 bg-accent" />
            Contact
          </p>
          <h2 id="contact-title" className="mt-8 max-w-[56rem] leading-[0.98]">
            <span className="block font-serif text-[clamp(2.2rem,5vw,4.2rem)] text-accent italic">
              <SplitWords text="Open to internships, collaborations" />
            </span>
            <span className="wide mt-2 block text-[clamp(2.2rem,5.4vw,4.6rem)]">
              <SplitWords text="and real contributions." delay={0.15} />
            </span>
          </h2>

          <FadeUp delay={0.2} className="mt-12">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex flex-wrap items-baseline gap-x-4 font-serif text-[clamp(1.6rem,4.6vw,3.6rem)] italic"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                {profile.email}
              </span>
              <span aria-hidden="true" className="font-sans text-[0.5em] text-accent not-italic transition-transform group-hover:translate-x-2">
                →
              </span>
            </a>
          </FadeUp>

          <ul className="mt-14 grid gap-3 sm:grid-cols-3">
            {links.map((link, i) => (
              <FadeUp as="li" key={link.label} delay={0.1 + i * 0.08}>
                <a
                  href={link.href}
                  {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group flex items-center justify-between rounded-2xl border border-line p-6 transition-colors hover:border-accent hover:bg-accent hover:text-bg"
                >
                  <span>
                    <span className="block text-[1.2rem] font-semibold">{link.label}</span>
                    <span className="block font-mono text-[0.75rem] opacity-70">{link.sub}</span>
                  </span>
                  <span aria-hidden="true" className="text-[1.4rem] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </a>
              </FadeUp>
            ))}
          </ul>
        </div>

      </section>
  );
}
