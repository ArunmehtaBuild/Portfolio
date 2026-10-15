import type { Tone } from "./types";

export interface Stop {
  id: string;
  label: string;
  /** Page palette while this section is being read. */
  tone: Tone;
}

// Sections of the home page, in order. Projects open in their own panel, so the home
// page stays short: overview first, depth on demand.
export const stops: Stop[] = [
  // Light, warm opening screen; the page cross-fades to dark from About onward.
  { id: "origin", label: "Origin", tone: "ivory" },
  { id: "about", label: "About", tone: "ink" },
  { id: "experience", label: "Experience", tone: "ink" },
  { id: "projects", label: "Projects", tone: "ink" },
  { id: "milestones", label: "Milestones", tone: "ink" },
  { id: "contact", label: "Contact", tone: "ink" },
];
