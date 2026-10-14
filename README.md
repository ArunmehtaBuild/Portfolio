# Arun Mehta · Problem Atlas

My portfolio, built as a map of the problems I've worked on, from subsurface ocean heat to network attacks,
and the one I haven't found yet.

Each section follows the same pattern: **the problem → why it matters → what the team built → what I did → evidence.**
Team results are always labelled as team results, and my own work sits in its own block.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components), fully static
- TypeScript, Tailwind CSS v4
- Newsreader and IBM Plex Mono via `next/font`
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
| `npm run release:check` | Strict fact check (fails on stale figures), lint, typecheck, build |

## How the content works

- `content/` holds the source material: verified facts, evidence notes and the full site copy.
- `src/data/` holds the typed data the site renders. Every figure carries a `source`, a `status`
  (`verified`, `confirmed` or `team-reported`) and the date it was last checked.
- `scripts/check-facts.mts` runs before every build. It fails on unsourced claims and on phrases the site
  must never contain. With `--strict`, it also fails if Nexera's public figures haven't been re-checked in 30 days.

## Structure

```
src/app/          layout, page, Open Graph image, sitemap, robots, icon
src/components/   Hero, NexeraRegion, ProjectRegion, AtlasMap, Milestones, Unmapped, Contact, ...
src/data/         profile, nexera, regions, milestones, atlas stops, types
scripts/          check-facts.mts
content/          verified source material and site copy
```
