"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Stop } from "@/data/atlas";

interface ActiveStopValue {
  stops: Stop[];
  active: string;
  index: number;
}

const ActiveStopContext = createContext<ActiveStopValue | null>(null);

// One IntersectionObserver for the whole page. The header, minimap, mobile strip and
// tone controller all read the active region from here.
export function ActiveStopProvider({ stops, children }: { stops: Stop[]; children: ReactNode }) {
  const [active, setActive] = useState(stops[0].id);

  useEffect(() => {
    const elements = stops
      .map((s) => document.querySelector<HTMLElement>(`[data-stop="${s.id}"]`))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        const id = (hit?.target as HTMLElement | undefined)?.dataset.stop;
        if (id) setActive(id);
      },
      // A thin band just above the middle of the screen decides the active region.
      { rootMargin: "-40% 0px -58% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [stops]);

  useEffect(() => {
    document.documentElement.dataset.tone = stops.find((s) => s.id === active)?.tone ?? "ivory";
    // The 3D backdrop reads this to adjust its scrims per section.
    document.documentElement.dataset.stop = active;
  }, [active, stops]);

  const index = Math.max(0, stops.findIndex((s) => s.id === active));
  return <ActiveStopContext.Provider value={{ stops, active, index }}>{children}</ActiveStopContext.Provider>;
}

export function useActiveStop(): ActiveStopValue {
  const value = useContext(ActiveStopContext);
  if (!value) throw new Error("useActiveStop must be used inside <ActiveStopProvider>");
  return value;
}
