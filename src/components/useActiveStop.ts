"use client";

import { useEffect, useState } from "react";

// Tracks which atlas section is in the middle band of the viewport.
export function useActiveStop(ids: string[], initial: string): string {
  const [active, setActive] = useState(initial);

  useEffect(() => {
    const elements = ids
      .map((id) => document.querySelector<HTMLElement>(`[data-stop="${id}"]`))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const id = (visible[0].target as HTMLElement).dataset.stop;
          if (id) setActive(id);
        }
      },
      // A thin band just above the middle of the screen decides the active section.
      { rootMargin: "-38% 0px -58% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
