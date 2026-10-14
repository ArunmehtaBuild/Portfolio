import type { MetadataRoute } from "next";
import { NEXERA_CHECKED_ON } from "@/data/nexera";
import { orderedProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // A fixed date keeps the sitemap static; it moves when the content is re-checked.
  return [
    { url: siteUrl, lastModified: NEXERA_CHECKED_ON, changeFrequency: "monthly", priority: 1 },
    ...orderedProjects.map((r) => ({
      url: `${siteUrl}/projects/${r.slug}`,
      lastModified: NEXERA_CHECKED_ON,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
