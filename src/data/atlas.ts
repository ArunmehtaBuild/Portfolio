import { nexera } from "./nexera";
import { civicSetu, regions } from "./regions";
import type { Tone } from "./types";

export interface Stop {
  id: string;
  label: string;
  /** Page palette while this stop is being read. */
  tone: Tone;
  /** Uncharted stops are drawn as hollow, dashed nodes on the map. */
  uncharted?: boolean;
}

// The order the atlas map shows, matching the order of sections on the page.
export const stops: Stop[] = [
  { id: "origin", label: "Origin", tone: "ink" },
  { id: nexera.slug, label: nexera.mapLabel, tone: nexera.tone },
  ...regions.map((r) => ({ id: r.slug, label: r.mapLabel, tone: r.tone })),
  { id: civicSetu.slug, label: civicSetu.mapLabel, tone: "ink" as Tone },
  { id: "milestones", label: "Milestones", tone: "ink" as Tone },
  { id: "unmapped", label: "Unmapped", tone: "ink" as Tone, uncharted: true },
  { id: "contact", label: "Contact", tone: "ink" as Tone },
];
