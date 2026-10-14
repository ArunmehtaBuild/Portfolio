import { regions } from "@/data/regions";

// Project order everywhere: still being built, then main projects, then where Arun started.
const rank = { current: 0, featured: 1, first: 2 } as const;
export const orderedProjects = [...regions].sort((a, b) => rank[a.status] - rank[b.status]);

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
