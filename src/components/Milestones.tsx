import { milestones } from "@/data/milestones";
import { RegionShell } from "./RegionShell";
import { RichText } from "./RichText";

export function Milestones() {
  return (
    <RegionShell id="milestones" bearing="Region 07 · Survey record" title="Milestones">
      <ol className="divide-y divide-line border-y border-line">
        {milestones.map((m) => (
          <li key={m.event} className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[minmax(0,15rem)_1fr]">
            <span className="font-semibold">{m.event}</span>
            <span className="text-[1.05rem] leading-[1.6]">
              <span className="font-mono text-[0.9rem] text-sea">{m.result}</span>
              {m.detail && (
                <>
                  <span aria-hidden="true" className="mx-2 text-faint">·</span>
                  <span className="text-muted">
                    <RichText text={m.detail} />
                  </span>
                </>
              )}
            </span>
          </li>
        ))}
      </ol>
    </RegionShell>
  );
}
