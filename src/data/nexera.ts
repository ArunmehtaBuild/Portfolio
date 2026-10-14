import type { Rich, Source, Stat } from "./types";

// Public figures from nexeraofficial.in and the IPUNEX YouTube channel. Re-check them
// on the day of every release and update NEXERA_CHECKED_ON (see content/nexera.md).
export const NEXERA_CHECKED_ON = "2026-10-14";

const site = (note: string): Source => ({
  status: "verified",
  source: `nexeraofficial.in homepage${note}`,
  checkedOn: NEXERA_CHECKED_ON,
});

const arun: Source = {
  status: "confirmed",
  source: "Arun Mehta, 2026-10-14 (content/nexera.md)",
  checkedOn: "2026-10-14",
};

export const nexera = {
  slug: "nexera",
  index: 1,
  mapLabel: "Nexera",
  bearing: "Region 01 · GGSIPU, Delhi · 28.59°N 77.02°E",
  title: "Students lost in scattered material",
  project: "Nexera",
  role: "Director & COO",
  period: "Oct 2025 – present",
  href: "https://nexeraofficial.in/",

  problem:
    "A GGSIPU semester asks a lot of students, and the help they need is scattered across group chats, random PDFs and one-shot videos. It’s hard to know what to study, where to find it, or who to ask.",

  whatNexeraDoes:
    "Nexera brings it together. **IPUNEX** covers academics (syllabus, free notes and PYQs, lectures and exam-focused courses), **SkillX** covers skills beyond exams, and **IPUClan** connects GGSIPU college communities in one place.",

  running: [
    "I manage the core departments and the workflows that keep Nexera moving, from our paid batches to the IPUNEX YouTube channel.",
    "I own the workflow for everything that goes on the site, and I run batch launches end to end: getting notes and lectures ready, coordinating the people who make them, and making sure students have a smooth experience from enrolment to exam day.",
    "I also designed the full workflow for our Campus Ambassador Program.",
  ] satisfies Rich[],

  launches: [
    { when: "May – Jun 2026", what: "End-semester batches" },
    { when: "Jul 2026", what: "DSA batch" },
    { when: "Sep 2026", what: "GGSIPU mid-semester batches" },
  ],

  stats: [
    { value: "3,500+", label: "students enrolled in exam-focused courses", source: site(", confirmed by Arun") },
    { value: "9.8K+", label: "members in the WhatsApp community", source: site("") },
    {
      value: "3.5K+",
      label: "subscribers on the IPUNEX YouTube channel",
      source: { status: "verified", source: "youtube.com/@ipunexofficial showed 3.62K", checkedOn: NEXERA_CHECKED_ON },
    },
    { value: "700+", label: "free notes and previous-year papers", source: site("") },
    { value: "40+", label: "GGSIPU colleges on IPUClan", source: site("") },
  ] satisfies Stat[],

  building: [
    {
      heading: "Campus Ambassador system",
      text: "I designed the program’s workflow, then built its UI and backend, connected to the database, so the process became the system we actually run.",
    },
    {
      heading: "Super-admin panel",
      text: "It had almost nothing in it. I re-architected it into a tabbed dashboard (revenue, user creation, password resets, access control), with revenue analytics split by SkillX and IPUNEX, course-by-course sales, date and month filters, and the backend endpoint behind it. The team can now see which courses are working.",
    },
    {
      heading: "Login and signup",
      text: "I worked on the login and signup screens.",
    },
    {
      heading: "Content delivery and infrastructure",
      text: "I manage how lectures and paid notes are delivered through Bunny, and I work on Redis (Upstash).",
    },
  ],

  lesson:
    "Most problems in a growing company are coordination problems. Being able to fix the tool yourself makes coordination much faster.",

  contributionSource: arun,
};
