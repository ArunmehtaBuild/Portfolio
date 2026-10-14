import type { Stat } from "@/data/types";

interface Props {
  stats: Stat[];
  /** Heading that says whose numbers these are, e.g. "Team results". */
  caption: string;
  note?: string;
}

// Figures rendered like survey readings. The caption always says whose result it is.
export function StatList({ stats, caption, note }: Props) {
  return (
    <figure className="rounded-sm border border-line bg-surface/60 p-5 sm:p-6">
      <figcaption className="label flex flex-wrap items-baseline justify-between gap-2">
        <span>{caption}</span>
        {note && <span className="normal-case tracking-normal text-faint">{note}</span>}
      </figcaption>
      <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse border-l-2 border-sea pl-4">
            <dt className="mt-2 text-[0.98rem] leading-snug text-muted">{stat.label}</dt>
            <dd className="font-mono text-[1.65rem] leading-none font-medium text-sea">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
