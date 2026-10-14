import type { Link } from "@/data/types";

export function EvidenceLinks({ links }: { links: Link[] }) {
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="label mr-2">Evidence</span>
      <ul className="flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 rounded-full border border-line px-5 py-2.5 font-mono text-[0.78rem] tracking-[0.04em] uppercase transition-all hover:border-accent hover:bg-accent hover:text-bg"
            >
              {link.label}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
