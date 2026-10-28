"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft, Upload, Trash2, Camera, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useGuestbookAuth } from "../../guestbook/hooks/useGuestbookAuth";
import type { HomeService, HomeCaseOfStudy, HomeAbout } from "../../home/types";

import { ServicesTableComponent } from "./components/ServicesTableComponent";
import { CasesOfStudyTableComponent } from "./components/CasesOfStudyTableComponent";
import { AddServicesPopup } from "./components/addServices.popup";
import { EditServicesPopup } from "./components/editServices.popup";
import { AddCasesPopup } from "./components/addCases.popup";
import { EditCasesPopup } from "./components/editCases.popup";
import { ConfirmDeletePopup } from "../shared/components/ConfirmDelete.popup";

import {
  addHomeService,
  updateHomeService,
  deleteHomeService,
  addCaseOfStudy,
  updateCaseOfStudy,
  deleteCaseOfStudy,
  updateHomeAbout,
  deleteHomeAboutPhoto,
} from "../../home/services/home.service";
import { optimizeImage } from "../../../lib/utils/image-optimizer";
import {
  uploadStorageAsset,
  deleteStorageAsset,
} from "../../../app/actions/storage-actions";

type PopupState =
  | { type: "none" }
  | { type: "addService" }
  | { type: "editService"; service: HomeService }
  | { type: "deleteService"; service: HomeService }
  | { type: "addCase" }
  | { type: "editCase"; caseItem: HomeCaseOfStudy }
  | { type: "deleteCase"; caseItem: HomeCaseOfStudy }
  | { type: "deleteAboutPhoto" };

interface HomeCRUDContainerProps {
  services: HomeService[];
  casesOfStudy: HomeCaseOfStudy[];
  about?: HomeAbout;
}

export const HomeCRUDContainer = ({
  services,
  casesOfStudy,
  about,
}: HomeCRUDContainerProps) => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useGuestbookAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [popup, setPopup] = useState<PopupState>({ type: "none" });

  const [aboutPhotoUrl, setAboutPhotoUrl] = useState(about?.image_url || "");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

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

  // --- About Photo Handlers ---
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setPhotoUploadError(null);

    try {
      const optimizedFile = await optimizeImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
      });

      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("folder", "about");
      const hash = Math.random().toString(36).substring(2, 8);
      const ext = optimizedFile.name.split(".").pop() || "jpg";
      formData.append("filename", `about-profile-${hash}.${ext}`);

      const newImageUrl = await uploadStorageAsset(formData);

      if (aboutPhotoUrl && aboutPhotoUrl !== newImageUrl) {
        await deleteStorageAsset(aboutPhotoUrl).catch(console.error);
      }

      await updateHomeAbout({ image_url: newImageUrl });
      setAboutPhotoUrl(newImageUrl);
      router.refresh();
    } catch (err: unknown) {
      console.error("Error al subir foto de About Me:", err);
      const message = err instanceof Error ? err.message : "Error al subir la imagen";
      setPhotoUploadError(message);
    } finally {
      setIsUploadingPhoto(false);
      event.target.value = "";
    }
  };

  const handleConfirmDeletePhoto = async () => {
    try {
      if (aboutPhotoUrl) {
        await deleteStorageAsset(aboutPhotoUrl).catch(console.error);
      }
      await deleteHomeAboutPhoto();
      setAboutPhotoUrl("");
    } catch (err) {
      console.error("Error al eliminar foto de About Me:", err);
    }
    closePopup();
    router.refresh();
  };

  // --- Service Handlers ---
  const handleAddService = async (data: {
    title: string;
    description: string;
    highlights: string[];
    order_index: number;
  }) => {
    await addHomeService(data);
    closePopup();
    router.refresh();
  };

  const handleUpdateService = async (
    id: string | number,
    updates: Partial<HomeService>
  ) => {
    await updateHomeService(id, updates);
    closePopup();
    router.refresh();
  };

  const handleDeleteService = async (service: HomeService) => {
    await deleteHomeService(service.id);
    closePopup();
    router.refresh();
  };

  // --- Case Handlers ---
  const handleAddCase = async (
    data: {
      title: string;
      description: string;
      tags: string[];
      order_index: number;
    },
    imageFile: File | null
  ) => {
    let imageUrl = "";
    if (imageFile) {
      const optimizedFile = await optimizeImage(imageFile, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
      });
      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("folder", "cases");
      const hash = Math.random().toString(36).substring(2, 8);
      const name = data.title
        ? String(data.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")
        : "case";
      formData.append(
        "filename",
        `${name}-${hash}.${optimizedFile.name.split(".").pop()}`
      );

      imageUrl = await uploadStorageAsset(formData);
    }

    try {
      await addCaseOfStudy({
        ...data,
        image_url: imageUrl,
      } as HomeCaseOfStudy);
    } catch (error) {
      if (imageUrl) {
        await deleteStorageAsset(imageUrl).catch(console.error);
      }
      throw error;
    }

    closePopup();
    router.refresh();
  };

  const handleUpdateCase = async (
    id: string | number,
    updates: Partial<HomeCaseOfStudy>,
    imageFile?: File | null
  ) => {
    let updatedData = { ...updates };
    let newImageUrl = "";
    const currentCase = casesOfStudy.find((c) => String(c.id) === String(id));

    if (imageFile) {
      const optimizedFile = await optimizeImage(imageFile, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
      });
      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("folder", "cases");
      const hash = Math.random().toString(36).substring(2, 8);
      const name =
        updates.title || currentCase?.title
          ? String(updates.title || currentCase?.title)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
          : "case";
      formData.append(
        "filename",
        `${name}-${hash}.${optimizedFile.name.split(".").pop()}`
      );

      newImageUrl = await uploadStorageAsset(formData);
      updatedData = { ...updatedData, image_url: newImageUrl };
    }

    try {
      await updateCaseOfStudy(id, updatedData);

      if (
        newImageUrl &&
        currentCase?.image_url &&
        currentCase.image_url !== newImageUrl
      ) {
        await deleteStorageAsset(currentCase.image_url).catch(console.error);
      }
      if (updatedData.image_url === "" && currentCase?.image_url) {
        await deleteStorageAsset(currentCase.image_url).catch(console.error);
      }
    } catch (error) {
      if (newImageUrl) {
        await deleteStorageAsset(newImageUrl).catch(console.error);
      }
      throw error;
    }

    closePopup();
    router.refresh();
  };

  const handleDeleteCase = async (caseItem: HomeCaseOfStudy) => {
    await deleteCaseOfStudy(caseItem.id);
    if (caseItem.image_url) {
      await deleteStorageAsset(caseItem.image_url).catch(console.error);
    }
    closePopup();
    router.refresh();
  };

  // --- Loading / Auth States ---
  if (authLoading || isCheckingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-aperture-blue border-t-transparent" />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
            Verificando acceso...
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
            Debes ser administrador para acceder a este panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] px-6 pb-12 pt-28">
      <div className="mx-auto max-w-5xl">
        {/* Back button + Header */}
        <div className="mb-10">
          <Link
            href="/admin/actions"
            className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 transition hover:text-aperture-blue"
          >
            <ArrowLeft className="h-3 w-3" />
            Volver a módulos
          </Link>
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-aperture-blue">
              Admin // Home Module
            </p>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
              GESTIÓN HOME
            </h1>
          </div>
        </div>

        {/* About Me Photo Section */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-aperture-yellow">
              Foto de Perfil (About Me)
            </h2>
          </div>
          <div className="rounded-xl border border-aperture-gray/50 bg-aperture-dark/50 p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-aperture-gray/70 bg-[#121216]">
                {aboutPhotoUrl ? (
                  <img
                    src={aboutPhotoUrl}
                    alt="Foto About Me"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                    <Camera className="h-8 w-8 text-zinc-500" />
                    <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Sin foto
                    </span>
                  </div>
                )}
                {isUploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/75">
                    <RefreshCw className="h-6 w-6 animate-spin text-aperture-blue" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-sm text-zinc-300">
                  Esta foto se despliega en el contenedor principal de la sección About Me en la página Home.
                </p>

                {photoUploadError && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-400">
                    {photoUploadError}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-aperture-blue/40 bg-aperture-blue/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white">
                    <Upload className="h-3.5 w-3.5" />
                    {isUploadingPhoto ? "Subiendo..." : aboutPhotoUrl ? "Cambiar foto" : "Subir foto"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhoto}
                    />
                  </label>

                  {aboutPhotoUrl && (
                    <button
                      onClick={() => setPopup({ type: "deleteAboutPhoto" })}
                      disabled={isUploadingPhoto}
                      className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-red-400 transition hover:bg-red-500/20 hover:text-white disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar foto
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-aperture-yellow">
              Servicios (What I Do)
            </h2>
            <button
              onClick={() => setPopup({ type: "addService" })}
              className="flex items-center gap-2 rounded-lg border border-aperture-blue/40 bg-aperture-blue/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar
            </button>
          </div>
          <div className="rounded-xl border border-aperture-gray/50 bg-aperture-dark/50 p-4">
            <ServicesTableComponent
              services={services}
              onEdit={(service) =>
                setPopup({ type: "editService", service })
              }
            />
          </div>
        </div>

        {/* Cases of Study Section */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-aperture-yellow">
              Casos de Estudio
            </h2>
            <button
              onClick={() => setPopup({ type: "addCase" })}
              className="flex items-center gap-2 rounded-lg border border-aperture-blue/40 bg-aperture-blue/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar
            </button>
          </div>
          <div className="rounded-xl border border-aperture-gray/50 bg-aperture-dark/50 p-4">
            <CasesOfStudyTableComponent
              cases={casesOfStudy}
              onEdit={(caseItem) =>
                setPopup({ type: "editCase", caseItem })
              }
            />
          </div>
        </div>
      </div>

      {/* Popups */}
      {popup.type === "deleteAboutPhoto" && (
        <ConfirmDeletePopup
          itemTitle="Foto de perfil (About Me)"
          onConfirm={handleConfirmDeletePhoto}
          onCancel={closePopup}
        />
      )}

      {popup.type === "addService" && (
        <AddServicesPopup
          onAdd={handleAddService}
          onCancel={closePopup}
          currentCount={services.length}
        />
      )}

      {popup.type === "editService" && (
        <EditServicesPopup
          service={popup.service}
          onSave={handleUpdateService}
          onDelete={() =>
            setPopup({ type: "deleteService", service: popup.service })
          }
          onCancel={closePopup}
        />
      )}

      {popup.type === "deleteService" && (
        <ConfirmDeletePopup
          itemTitle={popup.service.title}
          onConfirm={() => handleDeleteService(popup.service)}
          onCancel={closePopup}
        />
      )}

      {popup.type === "addCase" && (
        <AddCasesPopup
          onAdd={handleAddCase}
          onCancel={closePopup}
          currentCount={casesOfStudy.length}
        />
      )}

      {popup.type === "editCase" && (
        <EditCasesPopup
          caseItem={popup.caseItem}
          onSave={handleUpdateCase}
          onDelete={() =>
            setPopup({ type: "deleteCase", caseItem: popup.caseItem })
          }
          onCancel={closePopup}
        />
      )}

      {popup.type === "deleteCase" && (
        <ConfirmDeletePopup
          itemTitle={popup.caseItem.title}
          onConfirm={() => handleDeleteCase(popup.caseItem)}
          onCancel={closePopup}
        />
      )}
    </div>
  );
};
