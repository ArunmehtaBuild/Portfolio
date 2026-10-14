import type { Region } from "@/data/types";
import { EvidenceLinks } from "./EvidenceLinks";
import { Block, RegionShell } from "./RegionShell";
import { RichText } from "./RichText";
import { StatList } from "./StatList";

export function ProjectRegion({ region }: { region: Region }) {
  return (
    <RegionShell id={region.slug} bearing={region.bearing} title={region.title} project={region.project} context={region.context}>
      <Block label="The problem">
        <p>
          <RichText text={region.problem} />
        </p>
      </Block>

      <Block label="What we built">
        <p>
          <RichText text={region.built} />
        </p>
      </Block>

      {region.teamResults.length > 0 && <StatList stats={region.teamResults} caption="Team results" />}

      {/* Arun's own work, always visually separate from the team's. */}
      <div className="relative rounded-sm bg-sea-soft/70 px-5 py-6 sm:px-7 sm:py-8">
        <span aria-hidden="true" className="absolute top-0 left-0 h-full w-[3px] bg-survey" />
        <h3 className="label !text-survey">{region.myWorkHeading}</h3>
        <ul className="mt-4 space-y-3 text-[1.08rem] leading-[1.65]">
          {region.myWork.map((item) => (
            <li key={item.title} className="grid grid-cols-[1rem_1fr] gap-2">
              <span aria-hidden="true" className="mt-[0.7em] size-1.5 rotate-45 bg-survey" />
              <span>
                <strong className="font-semibold">{item.title}.</strong> <RichText text={item.text} />
              </span>
            </li>
          ))}
        </ul>
        {region.notes && (
          <div className="mt-6 space-y-3 border-t border-line pt-5 text-[1.05rem] leading-[1.65] italic">
            {region.notes.map((note) => (
              <p key={note}>
                <RichText text={note} />
              </p>
            ))}
          </div>
        )}
      </div>

      {region.status && (
        <Block label="Status">
          <p>
            <RichText text={region.status} />
          </p>
        </Block>
      )}

      <EvidenceLinks links={region.evidence} />
    </RegionShell>
  );
}
