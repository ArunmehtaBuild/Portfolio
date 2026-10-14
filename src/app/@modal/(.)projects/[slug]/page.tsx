import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectDossier } from "@/components/projects/ProjectDossier";
import { ProjectPanel } from "@/components/projects/ProjectPanel";
import { findProject, orderedProjects } from "@/lib/projects";

export function generateStaticParams() {
  return orderedProjects.map((r) => ({ slug: r.slug }));
}

// Opened from the home page: the project slides up over the list instead of leaving it.
// Params are read inside Suspense so the navigation can start instantly.
export default function ProjectPanelRoute({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={null}>
      <Panel params={params} />
    </Suspense>
  );
}

async function Panel({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const found = findProject(slug);
  if (!found) notFound();
  const { region, index, prev, next } = found;

  return (
    <ProjectPanel tone={region.tone} index={index} total={orderedProjects.length} prevSlug={prev.slug} nextSlug={next.slug}>
      <ProjectDossier region={region} prev={prev} next={next} />
    </ProjectPanel>
  );
}
