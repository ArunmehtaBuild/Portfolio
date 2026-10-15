// Fact guard for the portfolio. Runs before every build (npm run check:facts).
// Fails if any claim lacks a valid source, or if banned phrases appear anywhere in the
// site's data. Pass --strict before a release to also fail on stale Nexera figures.
//
// Rules come from CLAUDE.md: no unverified claims, no phone number, never "AI Engineer",
// never an internship, never call Arun CTO, never list the DTU B-Plan result.

import { createHash } from "node:crypto";
import { certificates } from "../src/data/certificates.ts";
import { milestones } from "../src/data/milestones.ts";
import { NEXERA_CHECKED_ON, nexera } from "../src/data/nexera.ts";
import { about, offTheMap, profile } from "../src/data/profile.ts";
import { regions } from "../src/data/regions.ts";

const STATUSES = new Set(["verified", "confirmed", "team-reported"]);
const STALE_AFTER_DAYS = 30;
const strict = process.argv.includes("--strict");

const BANNED: [RegExp, string][] = [
  [/\bAI Engineer\b/i, "the label \"AI Engineer\" (Arun's focus is systems, backend and ML systems)"],
  [/\bintern(ed)?\b|internship (at|with)/i, "any internship claim (Arun has done none)"],
  [/\b(I am|I'm|I’m|as) (the )?(CTO|chief technical officer)\b/i, "calling Arun CTO"],
  [/Director of Operations/i, "the old title (use Director & COO)"],
  [/\bB-?Plan\b|e-Summit/i, "the DTU B-Plan result (Arun was not part of it)"],
  [/\b(sole|only) (developer|architect)\b/i, "sole-developer claims"],
];

// SHA-256 of numbers that must never be published (e.g. a phone number). Stored as hashes so
// the number itself never appears in this public repository.
const PRIVATE_NUMBER_HASHES = new Set(["301fa22e6ac4e5109e8ae13cd6f761fa3380d5cff00f5488e3f459f24fc77530"]);

function containsPrivateNumber(text: string): boolean {
  for (const run of text.match(/\d[\d\s-]{8,}\d/g) ?? []) {
    const digits = run.replace(/\D/g, "");
    for (let i = 0; i + 10 <= digits.length; i++) {
      if (PRIVATE_NUMBER_HASHES.has(createHash("sha256").update(digits.slice(i, i + 10)).digest("hex"))) return true;
    }
  }
  return false;
}

const errors: string[] = [];
const warnings: string[] = [];

function walk(value: unknown, path: string): void {
  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, `${path}[${i}]`));
    return;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if ("status" in record && "checkedOn" in record) checkSource(record, path);
    for (const [key, child] of Object.entries(record)) walk(child, `${path}.${key}`);
    return;
  }
  if (typeof value === "string") {
    if (containsPrivateNumber(value)) errors.push(`${path}: contains a private phone number`);
    for (const [pattern, why] of BANNED) {
      if (pattern.test(value)) errors.push(`${path}: contains ${why}: "${value.slice(0, 80)}"`);
    }
  }
}

function checkSource(source: Record<string, unknown>, path: string): void {
  if (!STATUSES.has(String(source.status))) errors.push(`${path}: status "${source.status}" is not allowed`);
  if (typeof source.source !== "string" || source.source.trim().length < 5) errors.push(`${path}: missing source`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(source.checkedOn))) errors.push(`${path}: checkedOn must be YYYY-MM-DD`);
}

// Every stat must carry a source object.
function requireSources(stats: { source?: unknown }[], path: string): void {
  stats.forEach((s, i) => {
    if (!s.source) errors.push(`${path}[${i}]: stat has no source`);
  });
}

walk({ profile, about, offTheMap }, "profile");
walk(nexera, "nexera");
walk(regions, "regions");
walk(milestones, "milestones");
walk(certificates, "certificates");

requireSources(nexera.stats, "nexera.stats");
regions.forEach((r) => {
  requireSources(r.teamResults, `regions.${r.slug}.teamResults`);
  if (!r.contributionSource) errors.push(`regions.${r.slug}: missing contributionSource`);
  if (r.myWork.length === 0) errors.push(`regions.${r.slug}: "What I did" is empty`);
  if (r.slug === "civic-setu" && r.myStack.length > 0) errors.push("regions.civic-setu: Arun wrote no core code, so it must list no personal tools");
});
milestones.forEach((m, i) => {
  if (!m.source) errors.push(`milestones[${i}]: missing source`);
});

const ageDays = Math.floor((Date.now() - Date.parse(NEXERA_CHECKED_ON)) / 86_400_000);
if (ageDays > STALE_AFTER_DAYS) {
  const msg = `Nexera figures were last checked ${ageDays} days ago (${NEXERA_CHECKED_ON}). Re-check nexeraofficial.in and update NEXERA_CHECKED_ON.`;
  if (strict) errors.push(msg);
  else warnings.push(msg);
}

for (const w of warnings) console.warn(`⚠  ${w}`);
if (errors.length > 0) {
  console.error(`✗ Fact check failed (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ Fact check passed${strict ? " (strict)" : ""}.`);
