import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectById } from "../../../features/projects/services/projects.service";
import { ProjectDetail } from "../../../features/projects/components/ProjectDetail";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return {
      title: "Proyecto no encontrado | Kevin Aponte",
    };
  }

  return {
    title: `${project.title} — Caso de Estudio | Kevin Aponte`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image_url ? [project.image_url] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
