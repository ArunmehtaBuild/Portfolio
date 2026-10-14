"use client";

import type { Stop } from "@/data/atlas";
import { useActiveStop } from "./useActiveStop";

const ROW = 46;
const PAD = 14;
// Nodes sway left and right a little so the route reads as a path, not a list.
const sway = (i: number) => 16 + Math.round(Math.sin(i * 1.15) * 9);

function routePath(count: number): string {
  let d = `M${sway(0)},${PAD}`;
  for (let i = 1; i < count; i++) {
    const x0 = sway(i - 1);
    const y0 = PAD + (i - 1) * ROW;
    const x1 = sway(i);
    const y1 = PAD + i * ROW;
    d += ` C${x0},${y0 + ROW / 2} ${x1},${y1 - ROW / 2} ${x1},${y1}`;
  }
  return d;
}

interface Props {
  stops: Stop[];
  ids: string[];
}

// Desktop: a sticky winding route in the side column.
export function AtlasMap({ stops, ids }: Props) {
  const active = useActiveStop(ids, stops[0].id);
  const activeIndex = Math.max(0, ids.indexOf(active));
  const progress = stops.length > 1 ? activeIndex / (stops.length - 1) : 0;
  const height = PAD * 2 + (stops.length - 1) * ROW;
  const d = routePath(stops.length);

  return (
    <nav aria-label="Atlas" className="sticky top-24">
      <p className="label mb-4">The atlas</p>
      <div className="relative" style={{ height }}>
        <svg width="40" height={height} className="absolute top-0 left-0" aria-hidden="true">
          <path d={d} fill="none" style={{ stroke: "var(--line)" }} strokeWidth="1.5" strokeDasharray="3 5" />
          <path
            d={d}
            fill="none"
            strokeWidth="1.5"
            pathLength={1}
            strokeDasharray="1 1"
            style={{ stroke: "var(--sea)", strokeDashoffset: 1 - progress }}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
          {stops.map((stop, i) => {
            const reached = i <= activeIndex;
            const isActive = i === activeIndex;
            return (
              <g key={stop.id} transform={`translate(${sway(i)},${PAD + i * ROW})`}>
                {isActive && <circle r="9" fill="none" style={{ stroke: "var(--survey)" }} strokeWidth="1.2" />}
                <circle
                  r={isActive ? 4.5 : 3.5}
                  style={{
                    fill: !stop.uncharted && reached ? "var(--sea)" : "var(--paper)",
                    stroke: !stop.uncharted && reached ? "var(--sea)" : "var(--faint)",
                  }}
                  strokeWidth="1.2"
                  strokeDasharray={stop.uncharted ? "2 2" : undefined}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}
        </svg>
        <ol className="absolute top-0 left-12 w-[10rem]">
          {stops.map((stop, i) => {
            const isActive = i === activeIndex;
            return (
              <li key={stop.id} className="absolute flex items-center" style={{ top: PAD + i * ROW - 11, height: 22 }}>
                <a
                  href={`#${stop.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`group flex items-baseline gap-2 font-mono text-[0.74rem] tracking-[0.04em] transition-colors ${
                    isActive ? "text-ink" : "text-muted hover:text-sea"
                  } ${stop.uncharted ? "italic" : ""}`}
                >
                  <span className={isActive ? "text-survey" : "text-faint"}>{String(i).padStart(2, "0")}</span>
                  {stop.label}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

// Mobile: a thin progress strip under the header showing where the reader is.
export function AtlasStrip({ stops, ids }: Props) {
  const active = useActiveStop(ids, stops[0].id);
  const activeIndex = Math.max(0, ids.indexOf(active));
  const current = stops[activeIndex];

  return (
    <div className="border-t border-line/70 px-4 py-2 lg:hidden" aria-hidden="true">
      <div className="flex items-center justify-between font-mono text-[0.7rem] text-muted">
        <span>
          <span className="text-survey">{String(activeIndex).padStart(2, "0")}</span> · {current.label}
        </span>
        <span>
          {activeIndex} / {stops.length - 1}
        </span>
      </div>
      <div className="mt-1.5 flex gap-1">
        {stops.map((stop, i) => (
          <span
            key={stop.id}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
              i <= activeIndex ? (stop.uncharted ? "bg-faint" : "bg-sea") : "bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
