import { nexera, NEXERA_CHECKED_ON } from "@/data/nexera";
import { EvidenceLinks } from "./EvidenceLinks";
import { Block, RegionShell } from "./RegionShell";
import { RichText } from "./RichText";
import { StatList } from "./StatList";

const checked = new Date(`${NEXERA_CHECKED_ON}T00:00:00Z`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function NexeraRegion() {
  return (
    <RegionShell
      id={nexera.slug}
      bearing={nexera.bearing}
      title={nexera.title}
      project={nexera.project}
      context={`${nexera.role} · ${nexera.period}`}
    >
      <Block label="The problem">
        <p>{nexera.problem}</p>
      </Block>

      <Block label="What Nexera does">
        <p>
          <RichText text={nexera.whatNexeraDoes} />
        </p>
      </Block>

      <Block label="What I do: running it" accent>
        {nexera.running.map((item) => (
          <p key={item.title}>
            <RichText text={item.text} />
          </p>
        ))}
      </Block>

      <div>
        <h3 className="label mb-4">Launches I ran in 2026</h3>
        <ol className="relative grid gap-4 sm:grid-cols-3">
          {nexera.launches.map((launch) => (
            <li key={launch.what} className="border-t-2 border-survey pt-3">
              <span className="block font-mono text-[0.8rem] text-muted">{launch.when}</span>
              <span className="mt-1 block text-[1.05rem] leading-snug">{launch.what}</span>
            </li>
          ))}
        </ol>
      </div>

      <StatList
        stats={nexera.stats}
        caption="The scale · the whole team’s numbers"
        note={`Public figures, checked ${checked}`}
      />

      <div className="relative rounded-sm bg-sea-soft/70 px-5 py-6 sm:px-7 sm:py-8">
        <span aria-hidden="true" className="absolute top-0 left-0 h-full w-[3px] bg-survey" />
        <h3 className="label !text-survey">What I do: building it</h3>
        <p className="mt-3 text-[1.08rem] leading-[1.65]">I build alongside our CTO and the tech team.</p>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          {nexera.building.map((item) => (
            <div key={item.heading}>
              <dt className="font-semibold">{item.heading}</dt>
              <dd className="mt-1.5 text-[1.02rem] leading-[1.6] text-ink/85">{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Block label="What it taught me">
        <p className="text-[1.25rem] leading-[1.55] italic">{nexera.lesson}</p>
      </Block>

      <EvidenceLinks links={[{ label: "nexeraofficial.in", href: nexera.href }]} />
    </RegionShell>
  );
}
