"use client";

import { useActiveStop } from "./ActiveStop";

// Phones and tablets: a segmented bar along the bottom edge showing how far through the atlas you are.
export function AtlasStrip() {
  const { stops, index } = useActiveStop();

  return (
    <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-30 flex gap-1 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
      {stops.map((stop, i) => (
        <span
          key={stop.id}
          className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= index ? "bg-accent" : "bg-line"}`}
        />
      ))}
    </div>
  );
}
