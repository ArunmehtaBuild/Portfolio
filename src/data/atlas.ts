import { nexera } from "./nexera";
import { civicSetu, regions } from "./regions";

export interface Stop {
  id: string;
  label: string;
  /** Uncharted stops are drawn as hollow, dashed nodes on the map. */
  uncharted?: boolean;
}

// The order the atlas map shows, matching the order of sections on the page.
export const stops: Stop[] = [
  { id: "origin", label: "Origin" },
  { id: nexera.slug, label: nexera.mapLabel },
  ...regions.map((r) => ({ id: r.slug, label: r.mapLabel })),
  { id: civicSetu.slug, label: civicSetu.mapLabel },
  { id: "milestones", label: "Milestones" },
  { id: "unmapped", label: "Unmapped", uncharted: true },
  { id: "contact", label: "Contact" },
];
