import type { Source } from "./types";

// Certificates shown in the moving strip under Milestones.
//
// To add one: put the image (JPG, PNG or WebP, landscape works best) in
// public/certificates/ and set `image` to its file name. Until an image is there, the card
// shows a framed placeholder with the title and note.
export interface Certificate {
  title: string;
  /** Short line under the title: the result, or who issued it. */
  note: string;
  /** File name inside public/certificates/, e.g. "t-hacks-8.jpg". */
  image?: string;
  source: Source;
}

const arun: Source = { status: "confirmed", source: "Arun Mehta, holds the certificate", checkedOn: "2026-10-14" };

// The results Arun holds certificates for (same wording as Milestones).
export const certificates: Certificate[] = [
  { title: "IEEE T-Hacks 8.0", note: "2nd place", source: arun },
  { title: "Shloka Decode 2.0, NSUT", note: "Winner", source: arun },
  { title: "Bytecode, HackWithBVP 7.0", note: "4th position", source: arun },
  { title: "VibeForge’26", note: "Winner", source: arun },
  { title: "Blueprint 2026, eDC IIT Delhi", note: "Selected for incubation", source: arun },
];
