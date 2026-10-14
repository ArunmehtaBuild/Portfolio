import { SplitWords } from "../motion/Reveal";

// Shared heading for home-page sections: index, mono label, big title.
export function SectionHead({ index, label, id, title, aside }: { index: string; label: string; id: string; title: string; aside?: string }) {
  return (
    <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="label flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span className="inline-block h-px w-10 bg-accent" />
          {label}
        </p>
        <h2 id={id} className="mt-5 text-[clamp(2.6rem,6vw,5rem)] leading-[0.98] font-semibold tracking-[-0.03em]">
          <SplitWords text={title} />
        </h2>
      </div>
      {aside && <p className="max-w-[24rem] text-[0.98rem] leading-[1.6] text-muted sm:text-right">{aside}</p>}
    </div>
  );
}
