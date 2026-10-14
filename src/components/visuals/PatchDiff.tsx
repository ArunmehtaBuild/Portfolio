"use client";

import { motion } from "motion/react";
import { VisualFrame } from "./VisualFrame";

// Onyx: a finding becomes a fix. A vulnerable line is flagged, replaced with a safe one,
// and a pull request opens. The code is a generic example, not taken from a real scan.
const LOOP = 6;

export function PatchDiff() {
  const step = (from: number, to: number) => ({
    animate: { opacity: [0, 0, 1, 1, 0] },
    transition: { duration: LOOP, times: [0, from, from + 0.04, to, to + 0.04], repeat: Infinity },
  });

  return (
    <VisualFrame fig={4} caption="Finding → fix → pull request">
      <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-5 font-mono text-[0.7rem] leading-[1.7] sm:px-7 sm:text-[0.76rem]">
        <p className="text-muted">
          <span className="mr-3 opacity-50">41</span>def get_user(user_id):
        </p>
        <motion.p className="relative rounded px-2 -mx-2" animate={{ backgroundColor: ["rgba(255,90,90,0)", "rgba(255,90,90,0.18)", "rgba(255,90,90,0.18)", "rgba(255,90,90,0)"] }} transition={{ duration: LOOP, times: [0, 0.15, 0.55, 0.6], repeat: Infinity }}>
          <span className="mr-3 opacity-50">42</span>
          <span className="text-[#ff8a8a]">-</span> q = f&quot;SELECT * FROM users WHERE id = {"{user_id}"}&quot;
        </motion.p>
        <motion.p className="rounded bg-[rgba(110,255,160,0.14)] px-2 -mx-2" {...step(0.35, 0.92)}>
          <span className="mr-3 opacity-50">42</span>
          <span className="text-[#7dffae]">+</span> q = &quot;SELECT * FROM users WHERE id = %s&quot;
        </motion.p>
        <motion.p className="rounded bg-[rgba(110,255,160,0.14)] px-2 -mx-2" {...step(0.42, 0.92)}>
          <span className="mr-3 opacity-50">43</span>
          <span className="text-[#7dffae]">+</span> cursor.execute(q, (user_id,))
        </motion.p>

        <motion.div
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-bg"
          animate={{ opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, 0] }}
          transition={{ duration: LOOP, times: [0, 0.55, 0.62, 0.92, 0.96], repeat: Infinity }}
        >
          <span className="size-1.5 rounded-full bg-bg" />
          Pull request opened
        </motion.div>
        <motion.p
          className="absolute top-5 right-5 rounded-full border border-[#ff8a8a]/60 px-2.5 py-0.5 text-[0.62rem] text-[#ff8a8a] uppercase sm:right-7"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: LOOP, times: [0, 0.12, 0.5, 0.56], repeat: Infinity }}
        >
          SQL injection
        </motion.p>
      </div>
    </VisualFrame>
  );
}
