"use client";

import { motion } from "motion/react";
import { VisualFrame } from "./VisualFrame";

// FinStar: a phone running a round of Budget Blitz. One expense falls at a time and
// lands in Needs, Wants or Savings; the bucket flashes and the XP bar fills.
// Items and scoring are illustrative, not taken from the real game.
const BUCKETS = ["Needs", "Wants", "Savings"];
const ITEMS: { label: string; bucket: number }[] = [
  { label: "Bus fare", bucket: 0 },
  { label: "Pizza", bucket: 1 },
  { label: "Pocket money", bucket: 2 },
  { label: "Movie ticket", bucket: 1 },
];
const STEP = 1.6;
const LOOP = STEP * ITEMS.length;
const columnX = ["17%", "50%", "83%"];

/** Opacity keyframes that pulse a bucket each time one of its items lands. */
function flash(bucket: number) {
  const times = [0];
  const values = [0];
  ITEMS.forEach((item, i) => {
    if (item.bucket !== bucket) return;
    const land = (i * STEP + 1.15) / LOOP;
    times.push(land - 0.01, land + 0.01, Math.min(land + 0.09, 0.999));
    values.push(0, 0.22, 0);
  });
  times.push(1);
  values.push(0);
  return { times, values };
}

export function BudgetBlitz() {
  return (
    <VisualFrame fig={3} caption="Budget Blitz, one round">
      <div className="absolute inset-0 flex items-center justify-center gap-6">
        {/* Phone */}
        <div className="relative h-[92%] aspect-[9/16] rounded-[1.6rem] border-[3px] border-fg/80 bg-bg p-2 shadow-xl">
          <div className="absolute top-1.5 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-fg/70" />
          <div className="relative flex h-full flex-col overflow-hidden rounded-[1.1rem] bg-card">
            {/* HUD */}
            <div className="flex items-center justify-between px-2.5 pt-4 font-mono text-[0.7rem] text-fg">
              <span>LVL 3</span>
              <span>BUDGET BLITZ</span>
            </div>
            <div className="mx-2.5 mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full origin-left rounded-full bg-fg"
                animate={{ scaleX: [0.15, 0.4, 0.6, 0.8, 1, 0.15] }}
                transition={{ duration: LOOP, times: [0, 0.25, 0.5, 0.75, 0.97, 1], repeat: Infinity, ease: "easeOut" }}
              />
            </div>

            {/* Falling items */}
            <div className="relative flex-1">
              {ITEMS.map((item, i) => (
                <motion.span
                  key={item.label}
                  className="absolute top-0 -translate-x-1/2 rounded-md border border-fg/25 bg-bg px-2 py-1 shadow-sm font-mono text-[0.7rem] whitespace-nowrap text-fg"
                  initial={{ top: "-12%", left: "50%", opacity: 0 }}
                  animate={{
                    top: ["-12%", "-12%", "40%", "78%", "78%"],
                    left: ["50%", "50%", "50%", columnX[item.bucket], columnX[item.bucket]],
                    opacity: [0, 0, 1, 1, 0],
                    scale: [1, 1, 1, 1, 0.6],
                  }}
                  transition={{
                    duration: LOOP,
                    repeat: Infinity,
                    times: [0, (i * STEP) / LOOP, (i * STEP + 0.6) / LOOP, (i * STEP + 1.15) / LOOP, (i * STEP + 1.4) / LOOP],
                    ease: "easeInOut",
                  }}
                >
                  {item.label}
                </motion.span>
              ))}
            </div>

            {/* Buckets */}
            <div className="grid grid-cols-3 gap-1 px-1.5 pb-2">
              {BUCKETS.map((bucket, b) => (
                <div key={bucket} className="relative flex h-11 items-end justify-center overflow-hidden rounded-b-lg border-2 border-t-0 border-fg/70 pb-1">
                  {/* Flash exactly when an item lands in this bucket */}
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 bg-fg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: flash(b).values }}
                    transition={{ duration: LOOP, times: flash(b).times, repeat: Infinity }}
                  />
                  <span className="relative font-mono text-[0.6rem] tracking-[0.06em] text-fg uppercase">{bucket}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating feedback chips */}
        <div className="hidden flex-col gap-3 sm:flex">
          <motion.span
            className="rounded-full bg-fg px-3 py-1 font-mono text-[0.68rem] text-bg"
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            +10 XP
          </motion.span>
          <motion.span
            className="rounded-full border-2 border-fg px-3 py-1 font-mono text-[0.68rem] text-fg"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            Streak · 7 days
          </motion.span>
          <motion.span
            className="rounded-full border border-fg/40 px-3 py-1 font-mono text-[0.68rem] text-fg"
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            Needs ✓
          </motion.span>
        </div>
      </div>
    </VisualFrame>
  );
}
