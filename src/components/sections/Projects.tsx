import { orderedProjects } from "@/lib/projects";
import { ProjectCarousel } from "../projects/ProjectCarousel";
import { SectionHead } from "./SectionHead";

// Projects as a carousel: one project at a time, the full story one click away.
export function Projects() {
  return (
    <ProjectCarousel
      projects={orderedProjects}
      header={
        <SectionHead
          index="03"
          label="Projects"
          id="projects-title"
          accent="My"
          title="Projects"
          aside="OKEANOS and NETWM are in progress for Smart India Hackathon 2026. Open any project for the full story."
        />
      }
    />
  );
}
