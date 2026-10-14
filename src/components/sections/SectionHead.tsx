import { SplitWords } from "../motion/Reveal";

interface Props {
  index: string;
  label: string;
  id: string;
  /** Lead-in set in the serif italic, e.g. "Who". */
  accent: string;
  /** Main words set in heavy wide capitals, e.g. "I am". */
  title: string;
  aside?: string;
}

// Shared heading for home-page sections. Two typefaces in one line, a serif italic lead-in
// and heavy wide capitals, so headings never look like body text.
export function SectionHead({ index, label, id, accent, title, aside }: Props) {
  return (
    <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="label flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span className="inline-block h-px w-10 bg-accent" />
          {label}
        </p>
        <h2 id={id} className="mt-5 flex flex-wrap items-baseline gap-x-4 leading-[0.95]">
          <span className="font-serif text-[clamp(2.8rem,6.4vw,5.4rem)] text-accent italic">
            <SplitWords text={accent} />
          </span>
          <span className="wide text-[clamp(2.3rem,5.6vw,4.6rem)] font-black">
            <SplitWords text={title} delay={0.1} />
          </span>
        </h2>
      </div>
      {aside && <p className="max-w-[24rem] text-[0.98rem] leading-[1.6] text-muted sm:text-right">{aside}</p>}
    </div>
  );
}
