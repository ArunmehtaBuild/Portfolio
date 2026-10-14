"use client";

import { useEffect } from "react";
import type { Stop } from "@/data/atlas";
import { useActiveStop } from "../useActiveStop";

// Sets the page palette to the tone of the region being read. The colours themselves
// cross-fade in CSS (see the @property rules in globals.css).
export function ToneController({ stops, ids }: { stops: Stop[]; ids: string[] }) {
  const active = useActiveStop(ids, stops[0].id);

  useEffect(() => {
    const tone = stops.find((s) => s.id === active)?.tone ?? "ink";
    document.documentElement.dataset.tone = tone;
  }, [active, stops]);

  return null;
}
