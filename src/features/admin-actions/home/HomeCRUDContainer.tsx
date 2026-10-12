"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGuestbookAuth } from "../../guestbook/hooks/useGuestbookAuth";
import type { HomeService, HomeCaseOfStudy } from "../../home/types";

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
  | { type: "deleteCase"; caseItem: HomeCaseOfStudy };

interface HomeCRUDContainerProps {
  services: HomeService[];
  casesOfStudy: HomeCaseOfStudy[];
}

export const HomeCRUDContainer = ({
  services,
  casesOfStudy,
}: HomeCRUDContainerProps) => {
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

      // If a new image was uploaded and previous one existed, delete old one
      if (
        newImageUrl &&
        currentCase?.image_url &&
        currentCase.image_url !== newImageUrl
      ) {
        await deleteStorageAsset(currentCase.image_url).catch(console.error);
      }
      // If image was explicitly cleared (empty string), delete old image
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
