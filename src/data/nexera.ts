import type { Source, Stat, Tone, WorkItem } from "./types";

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
  statement: "Everything a GGSIPU semester asks of you, in one place.",
  tone: "sand" as Tone,
  project: "Nexera",
  role: "Director & COO",
  period: "Oct 2025 – present",
  href: "https://nexeraofficial.in/",

  problem:
    "A GGSIPU semester asks a lot of students, and the help they need is scattered across group chats, random PDFs and one-shot videos. It’s hard to know what to study, where to find it, or who to ask.",

  whatNexeraDoes:
    "Nexera brings it together. **IPUNEX** covers academics (syllabus, free notes and PYQs, lectures and exam-focused courses), **SkillX** covers skills beyond exams, and **IPUClan** connects GGSIPU college communities in one place.",

  running: [
    {
      title: "Departments and workflows",
      text: "I manage the core departments and the workflows that keep Nexera moving, from our paid batches to the IPUNEX YouTube channel.",
    },
    {
      title: "Site content",
      text: "I own the workflow for everything that goes on the site.",
    },
    {
      title: "Batch launches",
      text: "I run launches end to end: getting notes and lectures ready, coordinating the people who make them, and making sure students have a smooth experience from enrolment to exam day.",
    },
    {
      title: "Campus Ambassador Program",
      text: "I designed the program’s full workflow, then built the system behind it.",
    },
  ] satisfies WorkItem[],

  launches: [
    { when: "May – Jun 2026", what: "End-semester batches" },
    { when: "Jul 2026", what: "DSA batch" },
    { when: "Sep 2026", what: "GGSIPU mid-semester batches" },
  ],

  stats: [
    { value: "3,500+", label: "students enrolled in exam-focused premium courses", source: site(", confirmed by Arun") },
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
      text: "I rebuilt it as a tabbed dashboard for revenue, user creation, password resets and access control, with revenue split by SkillX and IPUNEX, course-by-course sales, date filters and the backend endpoint behind it. The team can now see which courses are working.",
    },
    {
      heading: "Sign-in and sign-up",
      text: "I worked on the sign-in and sign-up flow, the first screens every student meets on the platform.",
    },
    {
      heading: "Content delivery and infrastructure",
      text: "I manage how lectures and paid notes are delivered through Bunny, along with the rest of the setup that gets content to students smoothly.",
    },
  ],

  lesson:
    "Most problems in a growing company are coordination problems. Being able to fix the tool yourself makes coordination much faster.",

  contributionSource: arun,
};
