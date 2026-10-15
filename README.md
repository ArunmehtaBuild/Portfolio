# Arun Mehta · Portfolio

My portfolio: a single scrolling page where a gold chess piece crosses a terrazzo board as you read.
The pawn opens the page, becomes a knight at Experience, a bishop through Projects and Milestones,
and is promoted to a queen by Contact.

The page opens light (warm bisque) for the hero and About, then cross-fades to dark from Experience on.
Team results are always labelled as team results, and my own work sits in its own block.

## What's on the page

| Section | What it shows |
|---|---|
| Hero | Name, focus tags, one line about the work, links and three quick facts |
| About | Who I am, my photo and quick facts |
| Experience | Nexera (Director & COO): running it and building it, plus Nexera's public figures |
| Projects | A stacked scroll deck; each card opens a full project panel (`/projects/[slug]`) |
| Milestones | Hackathon results in a pinned sideways scroll |
| Gallery | Certificates and event photos in a strip that drifts on its own |
| Off the board | Chess and the outdoors |
| Contact | Email, GitHub and LinkedIn, with a typed-out sign-off |

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components), fully static
- TypeScript, Tailwind CSS v4
- [three.js](https://threejs.org) with [React Three Fiber](https://r3f.docs.pmnd.rs) for the chess scene
  (procedural textures, lathe-turned pieces, a sculpted knight head). If WebGL is missing or the GPU drops
  the context, flat gold silhouettes stand in and the scene rebuilds itself.
- [Motion](https://motion.dev) for reveals, scroll-linked transforms and layout animation
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling (off for reduced motion)
- Fonts via `next/font`: Fraunces (name), Instrument Serif (headings), Archivo (body and wide caps),
  IBM Plex Mono (labels), Special Elite (typed lines)
- A custom cursor for mouse users: a gold diamond with trailing corner brackets
- Deployed on Vercel

## Run it

```bash
npm install
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Local dev server on http://localhost:3000 |
| `npm run build` | Fact check, then production build |
| `npm run check:facts` | Validates every claim in `src/data` |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript |
| `npm run release:check` | Strict fact check (fails on stale figures), lint, typecheck, build |

## How the content works

- The source material (verified facts, evidence notes, drafts) is kept locally and not published.
- `src/data/` holds the typed data the site renders. Components never hard-code claims. Every figure carries
  a `source`, a `status` (`verified`, `confirmed` or `team-reported`) and the date it was last checked.
- `scripts/check-facts.mts` runs before every build. It fails on unsourced claims and on phrases the site
  must never contain. With `--strict`, it also fails if Nexera's public figures haven't been re-checked in 30 days.

### Adding a certificate to the Gallery

1. Put the image (JPG, PNG or WebP) in `public/certificates/`.
2. Add an entry to `src/data/certificates.ts` with its file name and pixel size.

Only entries with an image are shown. The repository is public, so check images for private details first.

## Structure

```
src/app/                 layout, home page, project routes (+ intercepted panel), 404, OG image, sitemap, robots, icon
src/components/atlas     active-section provider, header, mobile progress strip, logo
src/components/hero      hero, tilting portrait
src/components/scene     chess scene, pieces, knight head, textures, WebGL fallback and error boundary
src/components/sections  about, experience, projects, milestones, gallery, off the board, contact, footer
src/components/projects  project deck, cards, panel and full page
src/components/region    Nexera tabs, stats, work cards, chips
src/components/visuals   one animated illustration per project
src/components/motion    smooth scrolling, reveals, cursor, typewriter
src/data/                profile, nexera, regions (projects), milestones, certificates, atlas stops, types
public/certificates/     Gallery images
scripts/                 check-facts.mts
```
