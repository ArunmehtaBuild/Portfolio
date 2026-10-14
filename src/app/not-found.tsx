import type { Metadata } from "next";
import Link from "next/link";
import { Contours } from "@/components/Contours";
import { stops } from "@/data/atlas";

export const metadata: Metadata = {
  title: "Off the map · Arun Mehta",
};

export default function NotFound() {
  const charted = stops.filter((s) => !s.uncharted && s.id !== "origin");

  return (
    <main className="relative isolate mx-auto flex min-h-screen max-w-3xl flex-col justify-center overflow-x-clip px-4 py-20 sm:px-6">
      <Contours className="pointer-events-none absolute top-10 -right-40 -z-10 w-[52rem] max-w-none opacity-70" />

      <p className="label">Error 404 · Uncharted waters</p>
      <h1 className="mt-5 text-[2.8rem] leading-[1] font-medium tracking-[-0.02em] sm:text-[4rem]">
        You’ve sailed off the map.
      </h1>
      <p className="mt-6 max-w-[32rem] text-[1.2rem] leading-[1.6] text-muted">
        There’s nothing charted at this address. The regions below are all surveyed, so pick one and head back in.
      </p>

      <nav aria-label="Regions" className="mt-10">
        <ul className="flex flex-wrap gap-2">
          {charted.map((stop) => (
            <li key={stop.id}>
              <Link
                href={`/#${stop.id}`}
                className="inline-flex rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.78rem] transition-colors hover:border-accent hover:text-accent"
              >
                {stop.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link
        href="/"
        className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-mono text-[0.82rem] text-bg transition-opacity hover:opacity-85"
      >
        <span aria-hidden="true">←</span> Back to the origin
      </Link>
    </main>
  );
}
