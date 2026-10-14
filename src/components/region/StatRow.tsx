import type { Stat } from "@/data/types";
import { CountUp, FadeUp } from "../motion/Reveal";

// Big counting figures. The caption always says whose numbers these are.
export function StatRow({ stats, caption, note }: { stats: Stat[]; caption: string; note?: string }) {
  return (
    <figure>
      <figcaption className="label mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <span>{caption}</span>
        {note && <span className="tracking-normal normal-case">{note}</span>}
      </figcaption>
      <dl className={`grid gap-px overflow-hidden rounded-2xl border border-line bg-line ${stats.length > 3 ? "sm:grid-cols-2 lg:grid-cols-5" : stats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {stats.map((stat, i) => (
          <FadeUp key={stat.label} delay={i * 0.08} className="flex flex-col-reverse justify-end gap-3 bg-card p-6 sm:p-7">
            <dt className="text-[0.95rem] leading-snug text-muted">{stat.label}</dt>
            <dd className="font-mono text-[clamp(2.2rem,4vw,3.2rem)] leading-none font-medium tracking-[-0.03em] text-accent">
              <CountUp value={stat.value} />
            </dd>
          </FadeUp>
        ))}
      </dl>
    </figure>
  );
}
