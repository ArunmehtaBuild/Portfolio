"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

export function ThemeToggle() {
  // null on the server: the button renders without a pressed state until hydration.
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode); the choice still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="label inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 transition-colors hover:border-sea hover:text-sea"
      aria-label={theme ? `Switch to ${next} theme` : "Toggle theme"}
    >
      <span aria-hidden="true" className="inline-block size-2.5 rounded-full border border-current bg-[linear-gradient(90deg,currentColor_50%,transparent_50%)]" />
      {theme === "dark" ? "Night chart" : theme === "light" ? "Paper" : "Theme"}
    </button>
  );
}
