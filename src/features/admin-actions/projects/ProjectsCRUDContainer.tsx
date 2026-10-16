"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGuestbookAuth } from "../../guestbook/hooks/useGuestbookAuth";
import type { Project } from "../../projects/types";

import { ProjectsTableComponent } from "./components/ProjectsTableComponent";
import { AddProjectPopup } from "./components/AddProjectPopup";
import { EditProjectPopup } from "./components/EditProjectPopup";
import { ConfirmDeletePopup } from "../shared/components/ConfirmDelete.popup";

import { optimizeImage } from "../../../lib/utils/image-optimizer";
import { uploadStorageAsset, deleteStorageAsset } from "../../../app/actions/storage-actions";
import {
  addProject,
  updateProject,
  deleteProject,
} from "../../projects/services/projects.service";

type PopupState =
  | { type: "none" }
  | { type: "add" }
  | { type: "edit"; project: Project }
  | { type: "delete"; project: Project };

interface ProjectsCRUDContainerProps {
  projects: Project[];
}

export const ProjectsCRUDContainer = ({ projects }: ProjectsCRUDContainerProps) => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useGuestbookAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [popup, setPopup] = useState<PopupState>({ type: "none" });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!authLoading) {
      if (!user) {
        router.push("/guestbook");
      } else {
        timeoutId = setTimeout(() => {
          setIsAdmin(user?.role === "admin");
          setIsCheckingAdmin(false);
        }, 0);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [user, authLoading, router]);

  const closePopup = () => setPopup({ type: "none" });

  const handleAddProject = async (
    projectData: Omit<Project, "id">,
    imageFile: File | null
  ) => {
    let imagePath = "";
    if (imageFile) {
      const optimizedFile = await optimizeImage(imageFile, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
      });

      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("folder", "projects");
      const hash = Math.random().toString(36).substring(2, 8);
      const name = projectData.title
        ? String(projectData.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")
        : "proj";
      formData.append(
        "filename",
        `${name}-${hash}.${optimizedFile.name.split(".").pop()}`
      );

      imagePath = await uploadStorageAsset(formData);
    }

    try {
      await addProject({
        ...projectData,
        image_url: imagePath,
      });
    } catch (err) {
      if (imagePath) {
        await deleteStorageAsset(imagePath).catch(console.error);
      }
      throw err;
    }

    closePopup();
    router.refresh();
  };

  const handleUpdateProject = async (
    id: string | number,
    updates: Partial<Project>,
    imageFile?: File | null
  ) => {
    let updatedPayload = { ...updates };
    let newImagePath = "";

    if (imageFile) {
      const optimizedFile = await optimizeImage(imageFile, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
      });

      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("folder", "projects");
      const hash = Math.random().toString(36).substring(2, 8);
      const name = updates.title
        ? String(updates.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")
        : "proj";
      formData.append(
        "filename",
        `${name}-${hash}.${optimizedFile.name.split(".").pop()}`
      );

      newImagePath = await uploadStorageAsset(formData);
      updatedPayload = { ...updatedPayload, image_url: newImagePath };
    }

    try {
      await updateProject(id, updatedPayload);

      // If replacement succeeded and there was an old image, clean it up
      const currentProject = projects.find((p) => p.id === id);
      if (
        newImagePath &&
        currentProject?.image_url &&
        currentProject.image_url !== newImagePath
      ) {
        await deleteStorageAsset(currentProject.image_url).catch(console.error);
      }
    } catch (err) {
      if (newImagePath) {
        await deleteStorageAsset(newImagePath).catch(console.error);
      }
      throw err;
    }

    closePopup();
    router.refresh();
  };

  const handleDeleteProject = async (project: Project) => {
    if (project.image_url) {
      await deleteStorageAsset(project.image_url).catch(console.error);
    }
    await deleteProject(project.id);
    closePopup();
    router.refresh();
  };

  if (authLoading || isCheckingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-aperture-blue border-t-transparent" />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
            Verificando credenciales de acceso...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c]">
        <div className="glass-panel rounded-2xl px-8 py-10 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-red-400">
            Acceso Denegado
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Se requieren privilegios de Administrador para gestionar proyectos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] px-6 pb-16 pt-28">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/admin/actions"
            className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 transition hover:text-aperture-blue"
          >
            <ArrowLeft className="h-3 w-3" /> Volver a módulos
          </Link>
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-aperture-yellow">
              Admin // Projects Module
            </p>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
              GESTIÓN DE PROYECTOS
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">
              Administra los estudios de caso de software, especificaciones técnicas y enlaces de demostración del portafolio.
            </p>
          </div>
        </div>

        {/* Projects Table Card */}
        <div className="rounded-2xl border border-aperture-gray/50 bg-aperture-dark/50 p-6 sm:p-8 backdrop-blur-sm">
          <ProjectsTableComponent
            projects={projects}
            onAdd={() => setPopup({ type: "add" })}
            onEdit={(proj) => setPopup({ type: "edit", project: proj })}
            onDelete={(proj) => setPopup({ type: "delete", project: proj })}
          />
        </div>
      </div>

      {/* Popups */}
      {popup.type === "add" && (
        <AddProjectPopup onAdd={handleAddProject} onCancel={closePopup} />
      )}

      {popup.type === "edit" && (
        <EditProjectPopup
          project={popup.project}
          onSave={handleUpdateProject}
          onDelete={() => setPopup({ type: "delete", project: popup.project })}
          onCancel={closePopup}
        />
      )}

      {popup.type === "delete" && (
        <ConfirmDeletePopup
          itemTitle={popup.project.title}
          onConfirm={() => handleDeleteProject(popup.project)}
          onCancel={closePopup}
        />
      )}
    </div>
  );
};
