"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useId, useState } from "react";
import type { WorkItem } from "@/data/types";
import { RichText } from "../RichText";

interface Props {
  run: WorkItem[];
  build: WorkItem[];
}

// Nexera's two sides in one place: switch between running the company and building it.
// The pill slides between tabs and the cards swap with a short stagger.
export function RunBuildTabs({ run, build }: Props) {
  const [tab, setTab] = useState<"run" | "build">("run");
  const id = useId();
  const items = tab === "run" ? run : build;
  const tabs = [
    { key: "run" as const, label: "Running it", hint: "Operations" },
    { key: "build" as const, label: "Building it", hint: "Engineering" },
  ];

  return (
    <div>
      <LayoutGroup id={id}>
        <div role="tablist" aria-label="What I do at Nexera" className="inline-flex rounded-full border border-line bg-card p-1.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              id={`${id}-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls={`${id}-panel`}
              onClick={() => setTab(t.key)}
              className={`relative rounded-full px-5 py-2.5 text-left transition-colors sm:px-7 ${tab === t.key ? "text-bg" : "text-muted hover:text-fg"}`}
            >
              {tab === t.key && (
                <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <span className="relative block text-[1rem] font-semibold">{t.label}</span>
              <span className="relative block font-mono text-[0.62rem] tracking-[0.12em] uppercase opacity-75">{t.hint}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${tab}`} className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol
            key={tab}
            className="grid gap-3 md:grid-cols-2"
            initial="hidden"
            animate="shown"
            exit="gone"
            variants={{ shown: { transition: { staggerChildren: 0.06 } } }}
          >
            {items.map((item, i) => (
              <motion.li
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
                  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                  gone: { opacity: 0, y: -12, transition: { duration: 0.18 } },
                }}
                className="group flex gap-5 rounded-2xl border border-line bg-card p-6 transition-colors hover:border-accent"
              >
                <span className="font-mono text-[0.72rem] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-[1.2rem] leading-tight font-semibold">{item.title}</span>
                  <span className="mt-2 block text-[0.98rem] leading-[1.6] text-muted">
                    <RichText text={item.text} />
                  </span>
                </span>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>

      {/* Without JS the tabs can't switch, so list the engineering side too. */}
      <noscript>
        <ol className="mt-3 grid gap-3 md:grid-cols-2">
          {build.map((item) => (
            <li key={item.title} className="rounded-2xl border border-line bg-card p-6">
              <span className="block text-[1.2rem] font-semibold">{item.title}</span>
              <span className="mt-2 block text-muted">{item.text}</span>
            </li>
          ))}
        </ol>
      </noscript>
    </div>
  );
}
