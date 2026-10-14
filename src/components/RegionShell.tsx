import type { ReactNode } from "react";

interface Props {
  id: string;
  bearing: string;
  title: string;
  project?: string;
  context?: string;
  children: ReactNode;
}

// Shared frame for every region: anchor, bearing label, problem heading, project line.
export function RegionShell({ id, bearing, title, project, context, children }: Props) {
  return (
    <section id={id} data-stop={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-line pt-14 pb-20 sm:pt-20 sm:pb-28">
      <p className="label">{bearing}</p>
      <h2 id={`${id}-title`} className="mt-4 text-[2rem] leading-[1.1] font-medium tracking-[-0.01em] text-balance sm:text-[2.6rem]">
        {title}
      </h2>
      {(project || context) && (
        <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {project && <span className="text-lg font-semibold">{project}</span>}
          {context && <span className="font-mono text-[0.8rem] text-muted">{context}</span>}
        </p>
      )}
      <div className="mt-10 space-y-10">{children}</div>
    </section>
  );
}

// A labelled block inside a region ("The problem", "What we built", ...).
export function Block({ label, children, accent = false }: { label: string; children: ReactNode; accent?: boolean }) {
  return (
    <div>
      <h3 className={`label mb-3 ${accent ? "!text-survey" : ""}`}>{label}</h3>
      <div className="space-y-4 text-[1.13rem] leading-[1.7]">{children}</div>
    </div>
  );
}
