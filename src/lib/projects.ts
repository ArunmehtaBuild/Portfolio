import { regions } from "@/data/regions";

// Project order everywhere: the ones still being built first, then the finished ones.
export const orderedProjects = [...regions.filter((r) => r.status === "current"), ...regions.filter((r) => r.status === "featured")];

/** The project, its position, and its neighbours (wrapping around), or null if unknown. */
export function findProject(slug: string) {
  const index = orderedProjects.findIndex((r) => r.slug === slug);
  if (index === -1) return null;
  const n = orderedProjects.length;
  return {
    region: orderedProjects[index],
    index,
    prev: orderedProjects[(index - 1 + n) % n],
    next: orderedProjects[(index + 1) % n],
  };
}
