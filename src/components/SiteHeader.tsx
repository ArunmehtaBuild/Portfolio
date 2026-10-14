import type { Stop } from "@/data/atlas";
import { AtlasStrip } from "./AtlasMap";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader({ stops, ids }: { stops: Stop[]; ids: string[] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#origin" className="flex items-baseline gap-2">
          <span className="text-[1.15rem] font-semibold tracking-[-0.01em]">Arun Mehta</span>
          <span className="label hidden sm:inline">Problem Atlas</span>
        </a>
        <ThemeToggle />
      </div>
      <AtlasStrip stops={stops} ids={ids} />
    </header>
  );
}
