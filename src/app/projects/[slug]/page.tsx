import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/atlas/Logo";
import { ProjectDossier } from "@/components/projects/ProjectDossier";
import { findProject, orderedProjects } from "@/lib/projects";

export function generateStaticParams() {
  return orderedProjects.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = findProject(slug);
  if (!found) return {};
  const { region } = found;
  return {
    title: `${region.project} · Arun Mehta`,
    description: `${region.summary} My part: ${region.role}.`,
  };
}

// Visited directly (shared link or refresh): the same dossier as a full page.
export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const found = findProject(slug);
  if (!found) notFound();
  const { region, prev, next } = found;

  return (
    <div data-tone={region.tone} className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Logo />
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[0.7rem] tracking-[0.1em] uppercase transition-colors hover:border-accent hover:bg-accent hover:text-bg"
          >
            <span aria-hidden="true">←</span> All projects
          </Link>
        </div>
      </header>
      <main>
        <ProjectDossier region={region} prev={prev} next={next} />
      </main>
    </div>
  );
}
