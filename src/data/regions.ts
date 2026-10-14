import type { Region, Source } from "./types";

// Shared project facts and team results come from the team write-up on Atharv Tiwari's
// portfolio, which Arun approved for reuse as team results. Arun's own contributions are
// confirmed by him and, where noted, checked against GitHub commit history.
const teamWriteUp = (extra = ""): Source => ({
  status: "team-reported",
  source: `Team write-up, atharvportfolio-wheat.vercel.app${extra}`,
  checkedOn: "2026-10-14",
});

export const regions: Region[] = [
  {
    slug: "okeanos",
    index: 2,
    mapLabel: "OKEANOS",
    bearing: "Region 02 · North Indian Ocean · 5–30°N 45–105°E",
    title: "The ocean we can’t see below the surface",
    project: "OKEANOS",
    context: "Smart India Hackathon 2026 · SIH26066 (Ministry of Earth Sciences) · Team PIRATES",
    problem:
      "Satellites see the whole ocean every day, but only its surface. The heat stored below the surface affects how fast cyclones intensify over the Bay of Bengal and the Arabian Sea, and it’s measured mostly by sparse Argo floats: roughly one profile per 3° × 3° box every ten days.",
    built:
      "A system that reconstructs ocean temperature at 15 depths, from the surface to 1,000 m, across the North Indian Ocean, using only daily satellite data. A U-Net model, a 13-year data pipeline, validation against real float observations, and a web platform with 2-D and 3-D ocean views.",
    teamResults: [
      {
        value: "29%",
        label: "lower thermocline error than climatology, on a year the model never saw",
        source: { status: "verified", source: "OKEANOS SIH26066 deck, slide 2", checkedOn: "2026-10-14" },
      },
      {
        value: "23%",
        label: "lower error below the surface on the same held-out year",
        source: { status: "verified", source: "OKEANOS SIH26066 deck, slide 2", checkedOn: "2026-10-14" },
      },
      {
        value: "79 s",
        label: "to regenerate a full year of daily ocean fields",
        source: { status: "verified", source: "OKEANOS SIH26066 deck, slide 4", checkedOn: "2026-10-14" },
      },
    ],
    myWorkHeading: "What I did: the backend",
    myWork: [
      "Owned the inference API and the infrastructure that serves the model to the visualiser.",
      "Designed the **FastAPI** service: health, metadata, prediction by date, live prediction, depth profiles, and Argo float data.",
      "Built **ModelService**, which loads the model, handles normalisation, detects 5- or 7-channel inputs, and serves predictions through a two-tier cache (in memory, then on disk) before falling back to live inference.",
      "Built a prediction cache that stores results in half precision (half the disk size) and invalidates itself when the model weights change, so a retrained model never serves stale predictions.",
      "Built a memory-mapped data reader so 13 years of ocean arrays could be served on a laptop with 7.3 GB of RAM without running out of memory.",
      "Handled the land/ocean boundary so land values don’t leak into coastal predictions through the convolutions.",
      "Wrote the offline cache-building script, error handling, **Docker** packaging and API tests.",
    ],
    notes: [
      "Locally, a cached prediction came back in about 1.3 ms.",
      "Before writing any of it, I spent a full month studying the problem itself: satellite products, ocean layers, the thermocline. I wanted to understand what the numbers meant before I built the system that serves them.",
    ],
    status:
      "We cleared our college’s internal round and submitted on the SIH portal. The result is due in November 2026.",
    evidence: [
      { label: "Live app", href: "https://okeanos-pirates.vercel.app/" },
      { label: "Demo video", href: "https://youtu.be/uufrmJR8MEI" },
    ],
    contributionSource: {
      status: "confirmed",
      source: "Arun Mehta; his SIH internal-round backend notes (content/evidence)",
      checkedOn: "2026-10-14",
    },
  },
  {
    slug: "netwm",
    index: 3,
    mapLabel: "NETWM",
    bearing: "Region 03 · Network traffic · five minutes ahead",
    title: "Attacks that unfold over time",
    project: "NETWM",
    context: "Smart India Hackathon 2026 · NTRO problem statement · Team PIRATES",
    problem:
      "Intrusion detectors judge each network flow on its own. But an attack is a sequence, from reconnaissance to lateral movement, and it unfolds over minutes or hours.",
    built:
      "A world model for networks. It turns traffic into one state per minute, learns how that state evolves, and looks five minutes ahead to estimate risk and the MITRE ATT&CK stage the network is heading into.",
    teamResults: [
      { value: "0.677", label: "PR-AUC on a held-out day, against 0.139 for the baseline", source: teamWriteUp() },
      { value: "Offline", label: "the whole system runs with no network access", source: teamWriteUp() },
    ],
    myWorkHeading: "What I did: the backend and deployment",
    myWork: [
      "The **FastAPI** server: analysis routes, a server-sent-events stream with replay, a background job queue, and an inference runner with lazy loading and a fallback.",
      "Request schemas matching the API contract, unified error handling, CORS and upload limits.",
      "Integration tests for every endpoint and error path, plus a test that blocks every network connection to prove the system works fully offline.",
      "A one-click Windows launcher that starts the backend and frontend together, so the demo runs on any machine.",
    ],
    evidence: [
      { label: "Repository", href: "https://github.com/ArunmehtaBuild/NetWM" },
      { label: "Demo video", href: "https://youtu.be/9HpoNZa3afw" },
    ],
    contributionSource: {
      status: "verified",
      source: "GitHub commits by ArunmehtaBuild in ArunmehtaBuild/NetWM, 25–26 Sep 2026",
      checkedOn: "2026-10-14",
    },
  },
  {
    slug: "finstar",
    index: 4,
    mapLabel: "FinStar",
    bearing: "Region 04 · Teenagers, ages 15–18",
    title: "Teens with nowhere to practise money decisions",
    project: "FinStar",
    context: "2nd place, IEEE T-Hacks 8.0",
    problem:
      "Most teenagers first manage money after their first salary, when mistakes cost real money, and there’s nowhere to practise before that.",
    built:
      "A mobile game that teaches 15–18 year olds to budget, save and invest through play: short lessons, four games, streaks and leaderboards.",
    teamResults: [
      { value: "100+", label: "positive reviews from users", source: teamWriteUp() },
      { value: "2nd", label: "place at IEEE T-Hacks 8.0", source: { status: "confirmed", source: "Arun Mehta, certificate", checkedOn: "2026-10-14" } },
    ],
    myWorkHeading: "What I did: the experience",
    myWork: [
      "Built **Budget Blitz**, a rapid-fire game where expenses fall down the screen and players sort them into needs, wants or savings.",
      "Redesigned the learning module: the learning-road UI, lesson layout and the profile screen.",
      "Built the lesson quizzes: the questions, the explanations and the format after each lesson.",
      "Added the in-app AI chatbot, and fixed Google Sign-In on web.",
    ],
    evidence: [
      { label: "Repository", href: "https://github.com/Atharv-tw/FINSTAR" },
      { label: "Budget Blitz", href: "https://github.com/ArunmehtaBuild/Budget.Blitz--FINSTAR" },
    ],
    contributionSource: {
      status: "verified",
      source: "GitHub: 11 commits in Atharv-tw/FINSTAR and ArunmehtaBuild/Budget.Blitz--FINSTAR",
      checkedOn: "2026-10-14",
    },
  },
  {
    slug: "onyx",
    index: 5,
    mapLabel: "Onyx",
    bearing: "Region 05 · Live web applications",
    title: "Security findings nobody fixes",
    project: "Onyx",
    context: "4th position, Bytecode (HackWithBVP 7.0)",
    problem:
      "Security scanners produce long lists with no priority, and audits end as PDFs nobody acts on. Small teams rarely have a security engineer.",
    built:
      "A platform that scans a live web app, uses AI to triage what’s real, and opens a GitHub pull request with the fix.",
    teamResults: [
      { value: "~70%", label: "faster time-to-fix", source: teamWriteUp() },
      { value: "90%+", label: "accuracy removing duplicate findings", source: teamWriteUp() },
    ],
    myWorkHeading: "What I did: the frontend",
    myWork: [
      "Built the authenticated app’s frontend and the domain flow: adding a target, validating it, and showing clear errors.",
      "In [one pull request](https://github.com/Atharv-tw/Onyx/pull/24): an onboarding wizard (domain check, GitHub connection, vault setup), guided tours across the app, an authentication step after adding a domain, and deleting domains and cancelling audits, including the backend routes for both.",
      "Fixed the landing page’s performance and a hydration bug, which was the main issue at the time.",
    ],
    evidence: [
      { label: "Repository", href: "https://github.com/Atharv-tw/Onyx" },
      { label: "Demo video", href: "https://youtu.be/yADRor3sAJU" },
    ],
    contributionSource: {
      status: "verified",
      source: "GitHub: Atharv-tw/Onyx PR #24 (merged 25 Apr 2026) and commits by ArunmehtaBuild",
      checkedOn: "2026-10-14",
    },
  },
];

export const civicSetu = {
  slug: "civic-setu",
  index: 6,
  mapLabel: "Civic Setu",
  bearing: "Region 06 · Where I started",
  title: "Complaints that disappear",
  project: "Civic Setu",
  context: "My first project",
  text: "A platform that lets citizens report civic issues with a photo and location and follow them until they’re resolved. It was my first team project. I contributed to the idea, helped validate it and worked through it with the team. I didn’t write the core code, but it’s where I started.",
  contributionSource: {
    status: "confirmed",
    source: "Arun Mehta, 2026-10-14",
    checkedOn: "2026-10-14",
  } satisfies Source,
};
