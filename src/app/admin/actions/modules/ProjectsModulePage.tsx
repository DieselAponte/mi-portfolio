import { ProjectsCRUDContainer } from "../../../../features/admin-actions/projects/ProjectsCRUDContainer";
import { fetchProjects } from "../../../../features/projects/services/projects.service";

export default async function ProjectsModulePage() {
  const projects = await fetchProjects();

  return <ProjectsCRUDContainer projects={projects} />;
}
