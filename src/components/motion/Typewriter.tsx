"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Types its text out letter by letter once it scrolls into view, then leaves a blinking
// caret. Screen readers get the whole text at once; with reduced motion it simply appears.
export function Typewriter({ text, className, speed = 70, delay = 400 }: { text: string; className?: string; speed?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    let i = 0;
    let timer = window.setTimeout(function tick() {
      i += 1;
      setCount(i);
      if (i < text.length) timer = window.setTimeout(tick, speed + Math.random() * speed * 0.6);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [inView, reduce, text, speed, delay]);

  const shown = reduce ? text.length : count;
  return (
    <span ref={ref} className={className} aria-label={text} role="text">
      <span aria-hidden="true">{text.slice(0, shown)}</span>
      <span aria-hidden="true" className="typewriter-caret" />
      {/* Keeps the line's full width reserved so nothing below jumps while it types. */}
      <span aria-hidden="true" className="invisible">{text.slice(shown)}</span>
    </span>
  );
}
