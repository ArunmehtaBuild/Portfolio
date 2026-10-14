import type { Link } from "@/data/types";

export function EvidenceLinks({ links }: { links: Link[] }) {
  if (links.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-3" aria-label="Evidence">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[0.8rem] transition-colors hover:border-sea hover:text-sea"
          >
            {link.label}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
