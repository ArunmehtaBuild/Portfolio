import type { Link } from "./types";

export const profile = {
  name: "Arun Mehta",
  /** Chips under the name. */
  tagline: ["B.Tech CSE", "Backend · Systems · AI"],
  /** The hero line. Kept modest: a student who runs things and builds things. */
  headline: "I like understanding how systems work, and then building them.",
  subline: "Backends, APIs and the infrastructure underneath. I study CSE at GGSIPU, and I’m part of the team at Nexera.",
  location: "New Delhi, India",
  email: "arunmehta2812@gmail.com",
  /** Set to "/resume.pdf" once the revised résumé is in public/. Hidden while null. */
  resumeHref: null as string | null,
  links: [
    { label: "GitHub", href: "https://github.com/ArunmehtaBuild" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/arunmehtaa" },
  ] satisfies Link[],
};

export const about = {
  lead: "I’m Arun. I get to the core of how systems work, then build them.",
  paragraphs: [
    "At Nexera, a learning platform for GGSIPU students, I’m Director & COO. I keep launches and workflows moving, and I build parts of the platform myself.",
    "Beyond Nexera, I’ve worked on products across ocean science, cybersecurity, fintech and civic tech. At Smart India Hackathon 2026 I built the backends for OKEANOS and NETWM, taking machine-learning models and serving them through APIs that hold up under real use.",
    "Most of my work sits where backend, systems and AI meet: the services, data paths and infrastructure that let a model or a product run for real. I’m a third-year CSE student in Delhi, and I’d rather ship something small that works than plan something big that doesn’t.",
  ],
  facts: [
    { label: "Based in", value: "New Delhi, India" },
    { label: "Currently", value: "Director & COO @ Nexera" },
    { label: "Studying", value: "B.Tech CSE, GGSIPU · 2024–2028" },
    { label: "Focus", value: "Backend, system design and AI" },
  ],
  /** The "unmapped region", now one honest line instead of a whole section. */
  exploring:
    "I don’t have my next project yet. I’m spending time on real problems first, looking for one big enough to be worth years and concrete enough that software can change it.",
};

export const offTheMap = [
  { heading: "Chess", text: "Over the board, for fun, and at offline chess events when I can." },
  { heading: "Outdoors", text: "Volleyball, mountain trekking and hiking." },
];
