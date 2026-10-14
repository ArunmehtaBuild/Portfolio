import { civicSetu } from "@/data/regions";
import { orderedProjects } from "@/lib/projects";
import { FadeUp } from "../motion/Reveal";
import { ProjectCard } from "../projects/ProjectCard";
import { SectionHead } from "./SectionHead";

// Projects as an overview: four main cards (two still being built), then smaller work.
// Each card opens the full story in its own panel, so this section stays short.
export function Projects() {
  return (
    <section id="projects" data-stop="projects" aria-labelledby="projects-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        index="03"
        label="Projects"
        id="projects-title"
        title="What I’ve built"
        aside="Team projects, with my part called out. OKEANOS and NETWM are in progress for Smart India Hackathon 2026. Open any project for the full story."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {orderedProjects.map((region, i) => (
          <ProjectCard key={region.slug} region={region} order={i} />
        ))}
      </div>

      <FadeUp className="mt-16">
        <p className="label mb-4">More work</p>
        <div className="grid gap-4 rounded-2xl border border-line p-6 sm:grid-cols-[3rem_14rem_1fr] sm:items-baseline sm:gap-8 sm:p-7">
          <span className="font-mono text-[0.72rem] text-accent">05</span>
          <div>
            <p className="wide text-[1.1rem]">{civicSetu.project}</p>
            <p className="mt-1 font-mono text-[0.72rem] text-muted">{civicSetu.context}</p>
          </div>
          <p className="text-[0.98rem] leading-[1.65] text-muted">{civicSetu.text}</p>
        </div>
      </FadeUp>
    </section>
  );
}
