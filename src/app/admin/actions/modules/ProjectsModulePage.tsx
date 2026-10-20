import { ProjectsCRUDContainer } from "../../../../features/admin-actions/projects/ProjectsCRUDContainer";
import { fetchProjects } from "../../../../features/projects/services/projects.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsModulePage() {
  const projects = await fetchProjects({ bypassCache: true });

  return <ProjectsCRUDContainer projects={projects} />;
}
