import type { ReactNode } from "react";

// Frame for the decorative per-region animations. Always marked "Illustration" so no one
// mistakes the motion for real data.
export function VisualFrame({ fig, caption, children }: { fig: number; caption: string; children: ReactNode }) {
  return (
    <figure className="relative overflow-hidden rounded-2xl border border-line bg-card">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line px-5 py-3">
        <span className="label">
          Fig. {String(fig).padStart(2, "0")} · {caption}
        </span>
        <span className="font-mono text-[0.62rem] tracking-[0.14em] text-muted uppercase">Illustration</span>
      </div>
      <div aria-hidden="true" data-visual="" className="relative aspect-[5/4] w-full overflow-hidden">
        {children}
      </div>
    </figure>
  );
}
