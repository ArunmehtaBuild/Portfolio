import type { Region, Source } from "./types";

// Shared project facts and team results come from the team write-up on Atharv Tiwari's
// portfolio, which Arun approved for reuse as team results. Arun's own contributions are
// confirmed by Arun and, where noted, checked against GitHub commit history.
const teamWriteUp = (extra = ""): Source => ({
  status: "team-reported",
  source: `Team write-up, atharvportfolio-wheat.vercel.app${extra}`,
  checkedOn: "2026-10-14",
});

const deck = (slide: number): Source => ({
  status: "verified",
  source: `OKEANOS SIH26066 deck, slide ${slide}`,
  checkedOn: "2026-10-14",
});

export const regions: Region[] = [
  {
    slug: "okeanos",
    index: 2,
    mapLabel: "OKEANOS",
    bearing: "Region 02 · North Indian Ocean · 5–30°N 45–105°E",
    title: "The ocean we can’t see below the surface",
    statement: "Satellites see the whole ocean every day. Only its surface.",
    summary: "Reconstructs ocean temperature at 15 depths from daily satellite data alone.",
    role: "Backend & inference API",
    status: "current",
    badge: "SIH 2026 · in progress",
    tone: "ocean",
    project: "OKEANOS",
    context: "Smart India Hackathon 2026 · SIH26066 (Ministry of Earth Sciences) · Team PIRATES",
    problem:
      "The heat stored below the surface affects how fast cyclones intensify over the Bay of Bengal and the Arabian Sea, and it’s measured mostly by sparse Argo floats: roughly one profile per 3° × 3° box every ten days.",
    built:
      "A system that reconstructs ocean temperature at 15 depths, from the surface to 1,000 m, across the North Indian Ocean, using only daily satellite data. A U-Net model, a 13-year data pipeline, validation against real float observations, and a web platform with 2-D and 3-D ocean views.",
    teamStack: ["PyTorch", "U-Net", "xarray + Dask", "FastAPI", "XGBoost", "Zarr", "deck.gl", "Docker"],
    myStack: ["FastAPI", "NumPy memmap", "float16 cache", "Docker", "pytest"],
    teamResults: [
      { value: "29%", label: "lower thermocline error than climatology, on a year the model never saw", source: deck(2) },
      { value: "23%", label: "lower error below the surface on the same held-out year", source: deck(2) },
      { value: "79 s", label: "to regenerate a full year of daily ocean fields", source: deck(4) },
    ],
    myWorkHeading: "What I did: the backend",
    myWork: [
      {
        title: "Inference API",
        text: "Designed the **FastAPI** service that serves the model to the visualiser: health, metadata, prediction by date, live prediction, depth profiles and Argo float data.",
      },
      {
        title: "ModelService",
        text: "Loads the model, handles normalisation, detects 5- or 7-channel inputs, and serves predictions through a two-tier cache (memory, then disk) before falling back to live inference.",
      },
      {
        title: "Self-invalidating cache",
        text: "Stores predictions in half precision (half the disk size) and invalidates itself when the model weights change, so a retrained model never serves stale predictions.",
      },
      {
        title: "Memory-mapped reader",
        text: "Serves 13 years of ocean arrays on a laptop with 7.3 GB of RAM without running out of memory.",
      },
      {
        title: "Coastline handling",
        text: "Keeps land values from leaking into coastal predictions through the convolutions.",
      },
      {
        title: "Packaging and tests",
        text: "Offline cache-building script, error handling, **Docker** packaging and API tests.",
      },
    ],
    notes: [
      "Locally, a cached prediction came back in about 1.3 ms.",
      "Before writing any of it, I spent a full month studying the problem itself: satellite products, ocean layers, the thermocline. I wanted to understand what the numbers meant before I built the system that serves them.",
    ],
    progress:
      "We cleared our college’s internal round and submitted on the SIH portal. The result is due in November 2026.",
    evidence: [
      { label: "Live app", href: "https://okeanos-pirates.vercel.app/" },
      { label: "Demo video", href: "https://youtu.be/uufrmJR8MEI" },
    ],
    contributionSource: {
      status: "confirmed",
      source: "Arun Mehta; Arun’s SIH internal-round backend notes",
      checkedOn: "2026-10-14",
    },
  },
  {
    slug: "netwm",
    index: 3,
    mapLabel: "NETWM",
    bearing: "Region 03 · Network traffic · five minutes ahead",
    title: "Attacks that unfold over time",
    statement: "An attack isn’t a packet. It’s a sequence.",
    summary: "A world model that looks five minutes ahead to forecast how a network attack will unfold.",
    role: "Backend API & offline deployment",
    status: "current",
    badge: "SIH 2026 · in progress",
    tone: "signal",
    project: "NETWM",
    context: "Smart India Hackathon 2026 · NTRO problem statement · Team PIRATES",
    problem:
      "Intrusion detectors judge each network flow on its own. But an attack moves from reconnaissance to lateral movement, and it unfolds over minutes or hours.",
    built:
      "A world model for networks. It turns traffic into one state per minute, learns how that state evolves, and looks five minutes ahead to estimate risk and the MITRE ATT&CK stage the network is heading into.",
    teamStack: ["PyTorch", "Transformer", "RSSM world model", "MITRE ATT&CK", "Scapy", "FastAPI"],
    myStack: ["FastAPI", "Server-sent events", "Pydantic", "pytest", "Windows launcher"],
    teamResults: [
      { value: "0.677", label: "PR-AUC on a held-out day, against 0.139 for the baseline", source: teamWriteUp() },
      { value: "Offline", label: "the whole system runs with no network access", source: teamWriteUp() },
    ],
    myWorkHeading: "What I did: the backend and deployment",
    myWork: [
      {
        title: "API server",
        text: "The **FastAPI** server: analysis routes, a server-sent-events stream with replay, and a background job queue.",
      },
      {
        title: "Inference runner",
        text: "Loads model checkpoints lazily, with a fallback so the API keeps answering.",
      },
      {
        title: "Contract and errors",
        text: "Request schemas matching the API contract, unified error handling, CORS and upload limits.",
      },
      {
        title: "Proof it’s offline",
        text: "Integration tests for every endpoint and error path, plus a test that blocks every network connection to prove the system runs fully offline.",
      },
      {
        title: "One-click demo",
        text: "A Windows launcher that starts the backend and frontend together, so the demo runs on any machine.",
      },
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
    statement: "Make the money mistakes before they cost real money.",
    summary: "A mobile game that teaches teenagers to budget, save and invest by playing.",
    role: "UI, games & quizzes",
    status: "featured",
    badge: "2nd · IEEE T-Hacks 8.0",
    tone: "gold",
    project: "FinStar",
    context: "2nd place, IEEE T-Hacks 8.0",
    problem:
      "Most teenagers first manage money after their first salary, when mistakes cost real money, and there’s nowhere to practise before that.",
    built:
      "A mobile game that teaches 15–18 year olds to budget, save and invest through play: short lessons, four games, streaks and leaderboards.",
    teamStack: ["Flutter", "Dart", "Riverpod", "Firebase", "Supabase Edge Functions", "Rive"],
    myStack: ["Flutter", "Dart", "JavaScript"],
    teamResults: [
      { value: "100+", label: "positive reviews from users", source: teamWriteUp() },
      { value: "2nd", label: "place at IEEE T-Hacks 8.0", source: { status: "confirmed", source: "Arun Mehta, certificate", checkedOn: "2026-10-14" } },
    ],
    myWorkHeading: "What I did: the experience",
    myWork: [
      {
        title: "Budget Blitz",
        text: "A rapid-fire game where expenses fall down the screen and players sort them into needs, wants or savings.",
      },
      {
        title: "Learning module",
        text: "Redesigned the learning-road UI, the lesson layout and the profile screen.",
      },
      {
        title: "Lesson quizzes",
        text: "The questions, the explanations and the format after each lesson.",
      },
      {
        title: "Chatbot and sign-in",
        text: "Added the in-app AI chatbot, and fixed Google Sign-In on web.",
      },
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
    statement: "Don’t stop at the report. Ship the fix.",
    summary: "Scans a live web app, triages findings with AI, and opens a pull request with the fix.",
    role: "Frontend & onboarding",
    status: "featured",
    badge: "4th · HackWithBVP 7.0",
    tone: "violet",
    project: "Onyx",
    context: "4th position, Bytecode (HackWithBVP 7.0)",
    problem:
      "Security scanners produce long lists with no priority, and audits end as PDFs nobody acts on. Small teams rarely have a security engineer.",
    built:
      "A platform that scans a live web app, uses AI to triage what’s real, and opens a GitHub pull request with the fix.",
    teamStack: ["FastAPI", "Next.js", "Celery + Redis", "Nuclei", "PostgreSQL", "GitHub App"],
    myStack: ["Next.js", "React", "TypeScript", "FastAPI routes"],
    teamResults: [
      { value: "~70%", label: "faster time-to-fix", source: teamWriteUp() },
      { value: "90%+", label: "accuracy removing duplicate findings", source: teamWriteUp() },
    ],
    myWorkHeading: "What I did: the frontend",
    myWork: [
      {
        title: "App frontend",
        text: "Built the authenticated app’s frontend and the domain flow: adding a target, validating it, and showing clear errors.",
      },
      {
        title: "Onboarding and tours",
        text: "In [one pull request](https://github.com/Atharv-tw/Onyx/pull/24): an onboarding wizard (domain check, GitHub connection, vault setup) and guided tours across the app.",
      },
      {
        title: "Domain controls",
        text: "An authentication step after adding a domain, plus deleting domains and cancelling audits, including the backend routes for both.",
      },
      {
        title: "Landing performance",
        text: "Fixed the landing page’s performance and a hydration bug, which was the main issue at the time.",
      },
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
  {
    slug: "civic-setu",
    index: 6,
    mapLabel: "Civic Setu",
    bearing: "Where I started · Civic issue reporting",
    title: "Complaints that disappear",
    statement: "Report the pothole. Watch it get fixed.",
    summary: "Citizens report a civic issue with a photo and location, then follow it until the municipality resolves it.",
    role: "Idea & validation",
    status: "first",
    badge: "First project experience",
    tone: "rose",
    project: "Civic Setu",
    context: "My first team project",
    problem:
      "A complaint to a municipality usually disappears: no acknowledgement, no owner, and no way to know whether anyone saw it.",
    built:
      "A citizen app for reporting issues with a photo and GPS location, a staff dashboard to triage and assign them, and an API behind both. Every report moves through visible stages until it’s resolved.",
    teamStack: ["React Native", "Expo", "React", "Node.js", "Express", "MongoDB"],
    myStack: [],
    teamResults: [],
    myWorkHeading: "What I did: the idea and the groundwork",
    myWork: [
      {
        title: "The idea",
        text: "Contributed to shaping what the platform should do and who it was for.",
      },
      {
        title: "Validation",
        text: "Helped check whether the idea held up before and while the team built it.",
      },
      {
        title: "Working with the team",
        text: "Worked through the project with the team. I didn’t write the core code; this is where I started learning how products get built.",
      },
    ],
    evidence: [{ label: "Repository", href: "https://github.com/Atharv-tw/CIVIC_SETU" }],
    contributionSource: {
      status: "confirmed",
      source: "Arun Mehta, 2026-10-14",
      checkedOn: "2026-10-14",
    },
  },
];
