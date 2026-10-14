"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Tone } from "@/data/types";

interface Props {
  tone: Tone;
  index: number;
  total: number;
  prevSlug: string;
  nextSlug: string;
  children: ReactNode;
}

// Slide-up panel that holds a project's dossier over the home page. The URL changes to
// /projects/<slug>, so it can be shared, and Back closes it. Esc and the close button
// animate it out first, then go back.
export function ProjectPanel({ tone, index, total, prevSlug, nextSlug, children }: Props) {
  const router = useRouter();
  const lenis = useLenis();
  const [open, setOpen] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  // Freeze the page behind the panel.
  useEffect(() => {
    lenis?.stop();
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
      lenis?.start();
    };
  }, [lenis]);

  // Esc closes; Tab stays inside the panel.
  useEffect(() => {
    scroller.current?.focus({ preventScroll: true });
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && scroller.current) {
        const focusable = scroller.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Moving to the previous/next project starts at the top of the new one.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [index]);

  return (
    <AnimatePresence onExitComplete={() => router.back()}>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Project"
          initial="hidden"
          animate="shown"
          exit="hidden"
        >
          <motion.button
            type="button"
            aria-label="Close project"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            ref={scroller}
            tabIndex={-1}
            data-tone={tone}
            data-lenis-prevent=""
            className="absolute inset-x-0 top-[2.5vh] bottom-0 overflow-y-auto overscroll-contain rounded-t-[1.75rem] border-t border-line bg-bg text-fg shadow-2xl outline-none sm:inset-x-4 lg:inset-x-8"
            variants={{ hidden: { y: "100%" }, shown: { y: 0 } }}
            transition={{ type: "spring", stiffness: 210, damping: 30, mass: 0.9 }}
          >
            <div className="sticky top-0 z-10 border-b border-line bg-bg/85 backdrop-blur-md">
              <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
                <p className="label">
                  <span className="text-accent">{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")} · Projects
                </p>
                <div className="flex items-center gap-2">
                  <Link href={`/projects/${prevSlug}`} replace scroll={false} aria-label="Previous project" className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-accent hover:text-accent">
                    ←
                  </Link>
                  <Link href={`/projects/${nextSlug}`} replace scroll={false} aria-label="Next project" className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-accent hover:text-accent">
                    →
                  </Link>
                  <button
                    type="button"
                    onClick={close}
                    className="ml-1 inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 font-mono text-[0.7rem] tracking-[0.1em] uppercase transition-colors hover:border-accent hover:bg-accent hover:text-bg"
                  >
                    Esc <span aria-hidden="true" className="text-[1rem] leading-none">×</span>
                  </button>
                </div>
              </div>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
