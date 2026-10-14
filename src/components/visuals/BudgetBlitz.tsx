"use client";

import { motion } from "motion/react";
import { VisualFrame } from "./VisualFrame";

// FinStar: a looping sketch of Budget Blitz. Expenses fall and get sorted into
// needs, wants or savings, the way the game asks players to.
const BUCKETS = ["Needs", "Wants", "Savings"];
const ITEMS: { label: string; bucket: number }[] = [
  { label: "Bus fare", bucket: 0 },
  { label: "Pizza", bucket: 1 },
  { label: "Pocket money", bucket: 2 },
  { label: "Movie ticket", bucket: 1 },
  { label: "School books", bucket: 0 },
  { label: "New phone fund", bucket: 2 },
];
const LOOP = 7.2;

export function BudgetBlitz() {
  const bucketX = (b: number) => 22 + b * 33.3;

  return (
    <VisualFrame fig={3} caption="Budget Blitz, sorting spend">
      <div className="absolute inset-0">
        {ITEMS.map((item, i) => {
          const start = (i / ITEMS.length) * LOOP;
          const startX = 18 + ((i * 29) % 64);
          return (
            <motion.span
              key={item.label}
              className="absolute top-0 -translate-x-1/2 rounded-full border border-fg/20 bg-bg px-3 py-1 font-mono text-[0.7rem] whitespace-nowrap text-fg shadow-sm"
              initial={{ top: "-10%", left: `${startX}%`, opacity: 0 }}
              animate={{
                top: ["-10%", "38%", "66%", "66%"],
                left: [`${startX}%`, `${startX}%`, `${bucketX(item.bucket) + 5}%`, `${bucketX(item.bucket) + 5}%`],
                opacity: [0, 1, 1, 0],
                rotate: [0, i % 2 ? 8 : -8, 0, 0],
              }}
              transition={{ duration: LOOP / 2, delay: start, repeat: Infinity, repeatDelay: LOOP / 2, times: [0, 0.45, 0.8, 1], ease: "easeIn" }}
            >
              {item.label}
            </motion.span>
          );
        })}

        <div className="absolute inset-x-[6%] bottom-[8%] grid grid-cols-3 gap-3">
          {BUCKETS.map((bucket) => (
            <div key={bucket} className="flex h-[5.5rem] items-end justify-center rounded-b-2xl border-2 border-t-0 border-fg/70 pb-2">
              <span className="font-mono text-[0.72rem] tracking-[0.1em] text-fg uppercase">{bucket}</span>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
