import type { Rich, Source } from "./types";

export interface Milestone {
  event: string;
  result: string;
  detail?: Rich;
  source: Source;
}

const arun = (note: string): Source => ({ status: "confirmed", source: `Arun Mehta, ${note}`, checkedOn: "2026-10-14" });
const teamWriteUp: Source = {
  status: "team-reported",
  source: "Team write-up, atharvportfolio-wheat.vercel.app (Arun was on the team; project not named)",
  checkedOn: "2026-10-14",
};

export const milestones: Milestone[] = [
  { event: "IEEE T-Hacks 8.0", result: "2nd place", detail: "With FinStar, among 200+ teams.", source: arun("certificate; team count confirmed 2026-10-15") },
  {
    event: "Shloka Decode 2.0, NSUT",
    result: "Winner",
    detail: "We had 8 hours to decode Sanskrit shlokas given live and build a website around them. I did the decoding and its code.",
    source: arun("certificate"),
  },
  { event: "CodeVeda 2.0", result: "Finalist", detail: "Among 2,000+ participants.", source: arun("2026-10-15") },
  { event: "Bytecode, HackWithBVP 7.0", result: "4th position", detail: "With Onyx.", source: arun("2026-10-14") },
  { event: "VibeForge’26", result: "Winner", detail: "Team result.", source: teamWriteUp },
  { event: "Blueprint 2026, eDC IIT Delhi", result: "Selected for incubation", detail: "Team result.", source: teamWriteUp },
  {
    event: "Smart India Hackathon 2026",
    result: "Internal round cleared",
    detail: "Submitted OKEANOS and NETWM. Result due November 2026.",
    source: arun("2026-10-14"),
  },
];
