"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into place the first time they scroll into view. */
export function FadeUp({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p" | "section";
}) {
  const Tag = motion[as];
  return (
    <Tag
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/**
 * Splits text into words that rise out of a mask, one after another.
 * Screen readers get the plain sentence once.
 */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  immediate = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of on scroll (for the hero). */
  immediate?: boolean;
}) {
  const words = text.split(" ");
  const trigger = immediate ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <motion.span className={className} initial="hidden" {...trigger} aria-label={text} role="text">
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            data-reveal=""
            className="inline-block"
            variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Counts the numeric part of a figure up from zero when it scrolls into view,
 * keeping any prefix and suffix ("~70%", "0.677", "3.5K+", "2nd").
 * Values without a number ("Offline") are shown as they are.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  // The real value is rendered on the server, so it's correct without JS. On the client,
  // figures that start below the fold are zeroed (off-screen, so no visible flash) and
  // count up when they arrive.
  const [shown, setShown] = useState(value);
  const primed = useRef(false);

  useEffect(() => {
    if (!match || reduce || !ref.current) return;
    if (ref.current.getBoundingClientRect().top > window.innerHeight) {
      primed.current = true;
      setShown(`${match[1]}0${match[3]}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!match || !inView || !primed.current) return;
    const [, prefix, num, suffix] = match;
    const target = Number(num.replace(/,/g, ""));
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const grouped = num.includes(",");
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => {
        const n = decimals ? v.toFixed(decimals) : Math.round(v).toString();
        setShown(`${prefix}${grouped ? Number(n).toLocaleString("en-US") : n}${suffix}`);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
