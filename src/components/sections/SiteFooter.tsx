import { profile } from "@/data/profile";

// Closing footer: links, a back-to-top, and a wordmark sized to always fit the full width.
export function SiteFooter() {
  const links = [
    { label: "Email", href: `mailto:${profile.email}` },
    ...profile.links,
    ...(profile.resumeHref ? [{ label: "Résumé", href: profile.resumeHref }] : []),
  ];

  return (
    <footer className="relative z-10 overflow-hidden border-t border-line bg-bg/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label">Get in touch</p>
            <a href={`mailto:${profile.email}`} className="mt-3 block font-serif text-[clamp(1.5rem,3vw,2.2rem)] italic transition-colors hover:text-accent">
              {profile.email}
            </a>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group inline-flex items-center gap-1.5 font-mono text-[0.78rem] tracking-[0.08em] text-muted uppercase transition-colors hover:text-fg"
              >
                {link.label}
                <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </a>
            ))}
            <a href="#origin" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[0.72rem] tracking-[0.08em] uppercase transition-colors hover:border-accent hover:text-accent">
              Back to top <span aria-hidden="true">↑</span>
            </a>
          </nav>
        </div>

        {/* Wordmark: 9.2vw keeps all ten letters of the wide face inside the screen at any width */}
        <p aria-hidden="true" className="wide mt-14 text-center text-[9.2vw] leading-[0.8] whitespace-nowrap text-fg/[0.07] select-none lg:text-[min(9.2vw,8.6rem)]">
          Arun Mehta
        </p>

        <div className="flex flex-col gap-2 border-t border-line py-6 font-mono text-[0.7rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Arun Mehta · {profile.location}</span>
          <span>Every figure is sourced. Team results are marked as team results.</span>
        </div>
      </div>
    </footer>
  );
}
