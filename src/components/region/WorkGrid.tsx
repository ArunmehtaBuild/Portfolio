"use client";

import { motion } from "motion/react";
import type { WorkItem } from "@/data/types";
import { RichText } from "../RichText";

// Arun's own work as numbered cards. Cards stagger in, and the first one spans wider
// so the grid reads as a layout rather than a list.
export function WorkGrid({ items }: { items: WorkItem[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.li
          key={item.title}
          data-reveal=""
          initial={{ opacity: 0, y: 34, rotate: i % 2 ? 1.2 : -1.2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.08 }}
          whileHover={{ y: -4 }}
          className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-card p-6 transition-colors hover:border-accent ${
            i === 0 && items.length > 3 ? "lg:col-span-2" : ""
          }`}
        >
          <span className="flex items-center justify-between">
            <span className="font-mono text-[0.72rem] text-accent">{String(i + 1).padStart(2, "0")}</span>
            <span aria-hidden="true" className="size-2 rotate-45 border border-accent transition-colors group-hover:bg-accent" />
          </span>
          <h4 className="text-[1.25rem] leading-tight font-semibold tracking-[-0.01em]">{item.title}</h4>
          <p className="text-[0.98rem] leading-[1.6] text-muted">
            <RichText text={item.text} />
          </p>
        </motion.li>
      ))}
    </ol>
  );
}
