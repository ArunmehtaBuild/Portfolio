// Every claim shown on the site carries a source and a status. scripts/check-facts.mts
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

/** One piece of Arun's own work: a short title and a sentence of detail. */
export interface WorkItem {
  title: string;
  text: Rich;
}

/** Colour theme for a region; values live in globals.css as [data-tone=...]. */
export type Tone = "sand" | "ocean" | "signal" | "gold" | "violet" | "ink";

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
  /** A one-line restatement of the problem, set large. No new claims. */
  statement: string;
  /** One sentence for the project card on the home page. */
  summary: string;
  /** Arun's role in a few words, shown on the card. */
  role: string;
  /** "current": still being built. "featured": finished main project. */
  status: "current" | "featured";
  /** Short badge on the card, e.g. the event or award. */
  badge: string;
  tone: Tone;
  project: string;
  context: string;
  problem: Rich;
  built: Rich;
  /** The team's stack, from the shared project write-up. */
  teamStack: string[];
  /** Tools Arun used in his own part, backed by his commits or notes. */
  myStack: string[];
  teamResults: Stat[];
  myWorkHeading: string;
  myWork: WorkItem[];
  /** Short first-person asides after the work cards. */
  notes?: Rich[];
  /** Where the project stands now, in a sentence. */
  progress?: Rich;
  evidence: Link[];
  /** Backs Arun's personal contribution. */
  contributionSource: Source;
}
