import type { Stat } from "@/data/types";
import { CountUp, FadeUp } from "../motion/Reveal";

// Big counting figures. The caption always says whose numbers these are.
// Cells stay solid; only their contents fade in, so the grid never flashes as an empty block.
export function StatRow({ stats, caption, note, compact = false }: { stats: Stat[]; caption: string; note?: string; compact?: boolean }) {
  const cols = stats.length > 3 ? "grid-cols-2 md:grid-cols-5" : stats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <figure>
      <figcaption className="label mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <span>{caption}</span>
        {note && <span className="tracking-normal normal-case">{note}</span>}
      </figcaption>
      <dl className={`grid gap-px overflow-hidden rounded-2xl border border-line bg-line ${cols}`}>
        {stats.map((stat, i) => (
          <div key={stat.label} className={`bg-card ${compact ? "p-4 sm:p-5" : "p-6 sm:p-7"} ${compact && stats.length % 2 === 1 && stats.length > 3 ? "last:col-span-2 md:last:col-span-1" : ""}`}>
            <FadeUp delay={i * 0.08} className="flex flex-col-reverse justify-end gap-3">
              <dt className={`${compact ? "text-[0.85rem]" : "text-[0.95rem]"} leading-snug text-muted`}>{stat.label}</dt>
              <dd className={`font-mono ${compact ? "text-[clamp(1.5rem,2.4vw,2rem)]" : "text-[clamp(2.2rem,4vw,3.2rem)]"} leading-none font-medium tracking-[-0.03em] text-accent`}>
                <CountUp value={stat.value} />
              </dd>
            </FadeUp>
          </div>
        ))}
      </dl>
    </figure>
  );
}
