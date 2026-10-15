import type { Source } from "./types";

// Certificate photos shown in the moving strip under Milestones. Only entries with an
// image appear; the title and note are used as the image description, not shown.
//
// To add one: put the image (JPG, PNG or WebP) in public/certificates/, then add an entry
// with its file name and pixel size (the card takes the photo's shape).
export interface Certificate {
  title: string;
  /** The result, or who issued it (part of the image description). */
  note: string;
  /** File name inside public/certificates/, e.g. "t-hacks-8.jpg". */
  image?: string;
  width?: number;
  height?: number;
  source: Source;
}

const fromFile = (what: string): Source => ({ status: "verified", source: `${what}, provided by Arun`, checkedOn: "2026-10-15" });
const arun: Source = { status: "confirmed", source: "Arun Mehta, holds the certificate", checkedOn: "2026-10-14" };

export const certificates: Certificate[] = [
  {
    title: "VibeForge’26, ADGIPS E-Cell",
    note: "Prize winner, with the trophy",
    image: "vibeforge-trophy.jpg",
    width: 1280,
    height: 939,
    source: fromFile("Photo of the certificate (April 2026)"),
  },
  {
    title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    note: "Oracle University, August 2025",
    image: "oracle-oci-ai-foundations.jpg",
    width: 1600,
    height: 1100,
    source: fromFile("Oracle eCertificate PDF"),
  },
  {
    title: "MongoDB Overview: Core Concepts and Architecture",
    note: "MongoDB Skill, March 2026",
    image: "mongodb-overview.jpg",
    width: 1600,
    height: 1131,
    source: fromFile("MongoDB proof of completion PDF"),
  },
  {
    title: "Student Development Program on Internet of Things",
    note: "E&ICT Academy, IIT Kanpur, September 2025",
    image: "iit-kanpur-iot.jpg",
    width: 1262,
    height: 956,
    source: fromFile("E&ICT Academy IIT Kanpur certificate PDF"),
  },
  {
    title: "VibeForge’26",
    note: "Receiving the certificate and trophy",
    image: "vibeforge-award.jpg",
    width: 1247,
    height: 1600,
    source: fromFile("Photo from the event (April 2026)"),
  },
  {
    title: "BECon 2026 Incubator Summit, eDC IIT Delhi",
    note: "At the summit, January 2026",
    image: "becon-2026-incubator-summit.jpg",
    width: 818,
    height: 1174,
    source: fromFile("Photo from the event (31 January 2026)"),
  },
  {
    title: "Event certificate",
    note: "Receiving a certificate",
    image: "certificate-photo.jpg",
    width: 407,
    height: 756,
    source: fromFile("Photo from an event"),
  },
  // Certificates Arun holds that don't have a photo here yet.
  { title: "IEEE T-Hacks 8.0", note: "2nd place", source: arun },
  { title: "Shloka Decode 2.0, NSUT", note: "Winner", source: arun },
  { title: "Bytecode, HackWithBVP 7.0", note: "4th position", source: arun },
];
