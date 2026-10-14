// Every claim shown on the site carries a source and a status. scripts/check-facts.ts
// refuses to build if a claim has any other status or no source.
//
// verified      checked against a primary source (live site, GitHub, official deck)
// confirmed     confirmed by Arun himself
// team-reported a team result taken from the shared project write-up, shown as a team result
export type FactStatus = "verified" | "confirmed" | "team-reported";

export interface Source {
  status: FactStatus;
  source: string;
  /** ISO date (YYYY-MM-DD) the claim was last checked. */
  checkedOn: string;
}

export interface Stat {
  value: string;
  label: string;
  source: Source;
}

export interface Link {
  label: string;
  href: string;
}

/**
 * Inline text may use two marks, rendered by <RichText>:
 *   **bold**  and  [label](https://url)
 */
export type Rich = string;

export interface Region {
  slug: string;
  /** Position on the atlas, starting at 1 (0 is the opening). */
  index: number;
  /** Short name for the atlas map. */
  mapLabel: string;
  /** A real place or domain, never a decorative fake coordinate. */
  bearing: string;
  /** The problem, used as the section heading. */
  title: string;
  project: string;
  context: string;
  problem: Rich;
  built: Rich;
  teamResults: Stat[];
  myWorkHeading: string;
  myWork: Rich[];
  /** Short first-person paragraphs after the work list. */
  notes?: Rich[];
  status?: Rich;
  evidence: Link[];
  /** Backs Arun's personal contribution. */
  contributionSource: Source;
}
