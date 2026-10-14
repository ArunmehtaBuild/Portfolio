import type { Link } from "./types";

export const profile = {
  name: "Arun Mehta",
  tagline: ["Builder and operator", "B.Tech CSE, GGSIPU ’28", "Director & COO at Nexera"],
  intro: [
    "I help run an education company, and I build the backend systems behind the things my teams make.",
    "I care about the core of a system: how it’s designed, how it holds up, and why it works.",
    "This site is a map of the problems I’ve worked on so far, plus the one I haven’t found yet.",
  ],
  location: "New Delhi, India",
  email: "arunmehta2812@gmail.com",
  /** Set to "/resume.pdf" once the revised résumé is in public/. Hidden while null. */
  resumeHref: null as string | null,
  links: [
    { label: "GitHub", href: "https://github.com/ArunmehtaBuild" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/arunmehtaa" },
  ] satisfies Link[],
};

export const offTheMap = [
  {
    heading: "Chess",
    text: "I play for fun, mostly over the board, and I go to offline chess events when I can.",
  },
  {
    heading: "Outdoors",
    text: "Volleyball, mountain trekking and hiking.",
  },
];

export const unmapped = {
  title: "The unmapped region",
  paragraphs: [
    "I don’t have my next project yet, and I’m not going to pretend I do.",
    "I’m spending time on problems first: reading, talking to people who live with them, and looking for one that’s big enough to be worth years and concrete enough that software can change it. When I find it, it’ll go here.",
    "If you’re working on a hard problem and need someone who can run things and build things, I’d like to hear about it.",
  ],
};
