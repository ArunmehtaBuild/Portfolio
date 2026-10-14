import { civicSetu } from "@/data/regions";
import { RegionShell } from "./RegionShell";

export function CivicSetuRegion() {
  return (
    <RegionShell
      id={civicSetu.slug}
      bearing={civicSetu.bearing}
      title={civicSetu.title}
      project={civicSetu.project}
      context={civicSetu.context}
    >
      <p className="max-w-[38rem] text-[1.13rem] leading-[1.7]">{civicSetu.text}</p>
    </RegionShell>
  );
}
