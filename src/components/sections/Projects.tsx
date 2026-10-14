import { orderedProjects } from "@/lib/projects";
import { ProjectDeck } from "../projects/ProjectDeck";
import { SectionHead } from "./SectionHead";

// Projects as a stacked deck: one card per project, the full story one click away.
export function Projects() {
  return (
    <ProjectDeck
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
