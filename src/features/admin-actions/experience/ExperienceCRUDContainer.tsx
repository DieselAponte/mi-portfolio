"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGuestbookAuth } from "../../guestbook/hooks/useGuestbookAuth";
import type { ExperienceCertification, ExperienceCarouselItem, FullPublication, Technology, Topic, PublicationType } from "../../experience/types";

import { RowBubblesCertifications } from "./components/RowBubblesCertifications";
import { AddBubbleCertPopup } from "./components/AddBubbleCert.popup";
import { EditBubbleCertPopup } from "./components/EditBubbleCert.popup";
import { RowItemsCarousel } from "./components/RowItemsCarousel";
import { AddItemsCarouselPopup } from "./components/AddItemsCarousel.popup";
import { EditItemsCarouselPopup } from "./components/EditItemsCarousel.popup";
import { ConfirmDeletePopup } from "../shared/components/ConfirmDelete.popup";

import { TrayectoryTableComponent } from "./components/trayectory/TrayectoryTableComponent";
import { OnboardingAddNivelPublicacion } from "./components/trayectory/OnboardingAddNivelPublicacion.popup";
import { OnboardingEditNivelPublicacion } from "./components/trayectory/OnboardingEditNivelPublicacion.popup";

import { optimizeImage } from "../../../lib/utils/image-optimizer";
import { uploadStorageAsset, deleteStorageAsset } from "../../../app/actions/storage-actions";


import {
  addCertification,
  updateCertification,
  deleteCertification,
  addCarouselItem,
  updateCarouselItem,
  deleteCarouselItem,
  deleteCarouselImage,
  uploadCarouselImage,
} from "../../experience/services/experience.service";

import {
  addPublicacion,
  updatePublicacion,
  deletePublicacion,
  addTechnology,
  deleteTechnology as deleteServiceTechnology,
  addTopic,
  deleteTopic as deleteServiceTopic,
} from "../../experience/services/trayectory.service";

type PopupState =
  | { type: "none" }
  | { type: "addCert" }
  | { type: "editCert"; cert: ExperienceCertification }
  | { type: "deleteCert"; cert: ExperienceCertification }
  | { type: "addCarousel" }
  | { type: "editCarousel"; item: ExperienceCarouselItem }
  | { type: "deleteCarousel"; item: ExperienceCarouselItem }
  | { type: "addPublicacion" }
  | { type: "editPublicacion"; pub: FullPublication }
  | { type: "deletePublicacion"; pub: FullPublication };

interface ExperienceCRUDContainerProps {
  certifications: ExperienceCertification[];
  carouselItems: ExperienceCarouselItem[];
  publicaciones: FullPublication[];
  technologies: Technology[];
  topics: Topic[];
}

export const ExperienceCRUDContainer = ({
  certifications,
  carouselItems,
  publicaciones,
  technologies,
  topics,
}: ExperienceCRUDContainerProps) => {
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

  // --- Certification Handlers ---
  const handleAddCert = async (data: { title: string; meta: string; url?: string; order_index: number }) => {
    await addCertification(data);
    closePopup();
    router.refresh();
  };
  const handleUpdateCert = async (id: string | number, updates: Partial<ExperienceCertification>) => {
    await updateCertification(id, updates);
    closePopup();
    router.refresh();
  };
  const handleDeleteCert = async (cert: ExperienceCertification) => {
    await deleteCertification(cert.id);
    closePopup();
    router.refresh();
  };

  // --- Carousel Handlers ---
  const handleUploadImage = async (file: File): Promise<string> => {
    return await uploadCarouselImage(file);
  };
  const handleAddCarousel = async (data: { title: string; subtitle: string; image_path: string; order_index: number }) => {
    await addCarouselItem(data);
    closePopup();
    router.refresh();
  };
  const handleUpdateCarousel = async (id: string | number, updates: Partial<ExperienceCarouselItem>) => {
    await updateCarouselItem(id, updates);
    closePopup();
    router.refresh();
  };
  const handleDeleteCarousel = async (item: ExperienceCarouselItem) => {
    if (item.image_path) await deleteCarouselImage(item.image_path);
    await deleteCarouselItem(item.id);
    closePopup();
    router.refresh();
  };

  // --- Trayectory Handlers ---
  const handleAddPublicacion = async (
    type: PublicationType,
    baseData: Record<string, unknown>,
    details: Record<string, unknown>,
    techIds: (string | number)[],
    topicIds: (string | number)[],
    imageFile: File | null,
    responsibilities?: string[],
    achievements?: string[],
    onProgress?: (status: "optimizing" | "uploading" | "saving") => void
  ) => {
    let imagePath = "";
    if (imageFile) {
      if (onProgress) onProgress("optimizing");
      const optimizedFile = await optimizeImage(imageFile, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 });
      
      if (onProgress) onProgress("uploading");
      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("folder", "experience");
      const hash = Math.random().toString(36).substring(2, 8);
      const name = baseData.title ? String(baseData.title).toLowerCase().replace(/[^a-z0-9]+/g, "-") : "pub";
      formData.append("filename", `${name}-${hash}.${optimizedFile.name.split('.').pop()}`);
      
      imagePath = await uploadStorageAsset(formData);
    }
    
    if (onProgress) onProgress("saving");
    try {
      await addPublicacion(type, { ...baseData, image_path: imagePath } as never, details, techIds, topicIds, responsibilities, achievements);
    } catch (error) {
      if (imagePath) {
        await deleteStorageAsset(imagePath).catch(console.error);
      }
      throw error;
    }
    
    closePopup();
    router.refresh();
  };

  const handleUpdatePublicacion = async (
    id: string | number,
    type: PublicationType,
    baseData: Record<string, unknown>,
    details: Record<string, unknown>,
    techIds: (string | number)[],
    topicIds: (string | number)[],
    imageFile: File | null,
    responsibilities?: string[],
    achievements?: string[],
    onProgress?: (status: "optimizing" | "uploading" | "saving") => void
  ) => {
    let updatedBase = { ...baseData };
    let newImagePath = "";
    
    if (imageFile) {
      if (onProgress) onProgress("optimizing");
      const optimizedFile = await optimizeImage(imageFile, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 });
      
      if (onProgress) onProgress("uploading");
      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("folder", "experience");
      const hash = Math.random().toString(36).substring(2, 8);
      const name = baseData.title ? String(baseData.title).toLowerCase().replace(/[^a-z0-9]+/g, "-") : "pub";
      formData.append("filename", `${name}-${hash}.${optimizedFile.name.split('.').pop()}`);
      
      newImagePath = await uploadStorageAsset(formData);
      updatedBase = { ...updatedBase, image_path: newImagePath };
    }
    
    if (onProgress) onProgress("saving");
    try {
      await updatePublicacion(id, type, updatedBase as never, details, techIds, topicIds, responsibilities, achievements);
      if (newImagePath && baseData.image_path && typeof baseData.image_path === "string" && baseData.image_path !== newImagePath) {
        await deleteStorageAsset(baseData.image_path).catch(console.error);
      }
    } catch (error) {
      if (newImagePath) {
        await deleteStorageAsset(newImagePath).catch(console.error);
      }
      throw error;
    }

    closePopup();
    router.refresh();
  };

  const handleDeletePublicacion = async (pub: FullPublication) => {
    await deletePublicacion(pub.id, pub.image_path);
    closePopup();
    router.refresh();
  };

  const handleAddTech = async (name: string) => {
    await addTechnology({ name, sector: "Custom" });
    router.refresh();
  };
  const handleDeleteTech = async (id: string | number) => {
    await deleteServiceTechnology(id);
    router.refresh();
  };
  const handleAddTopicItem = async (name: string) => {
    await addTopic(name);
    router.refresh();
  };
  const handleDeleteTopicItem = async (id: string | number) => {
    await deleteServiceTopic(id);
    router.refresh();
  };

  // --- Loading / Auth States ---
  if (authLoading || isCheckingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-aperture-blue border-t-transparent" />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c]">
        <div className="glass-panel rounded-2xl px-8 py-10 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-red-400">Acceso Denegado</p>
          <p className="mt-2 text-sm text-zinc-400">Debes ser administrador para acceder a este panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] px-6 pb-12 pt-28">
      <div className="mx-auto max-w-5xl">
        {/* Back button + Header */}
        <div className="mb-10">
          <Link href="/admin/actions"
            className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 transition hover:text-aperture-blue">
            <ArrowLeft className="h-3 w-3" /> Volver a módulos
          </Link>
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-aperture-yellow">Admin // Experience Module</p>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">GESTIÓN EXPERIENCE</h1>
          </div>
        </div>

        {/* Section 1: Certifications & Carousel Items */}
        <div className="mb-12 rounded-xl border border-aperture-gray/50 bg-aperture-dark/50 p-6">
          <RowBubblesCertifications certifications={certifications}
            onAdd={() => setPopup({ type: "addCert" })} onEdit={(cert) => setPopup({ type: "editCert", cert })} />
        </div>
        <div className="mb-12 rounded-xl border border-aperture-gray/50 bg-aperture-dark/50 p-6">
          <RowItemsCarousel items={carouselItems}
            onAdd={() => setPopup({ type: "addCarousel" })} onEdit={(item) => setPopup({ type: "editCarousel", item })} />
        </div>

        {/* Section 2: Trayectoria */}
        <div className="mb-12 rounded-xl border border-aperture-gray/50 bg-aperture-dark/50 p-6">
          <TrayectoryTableComponent publicaciones={publicaciones}
            onAdd={() => setPopup({ type: "addPublicacion" })} onEdit={(pub) => setPopup({ type: "editPublicacion", pub })} />
        </div>
      </div>

      {/* Popups — Section 1 */}
      {popup.type === "addCert" && (
        <AddBubbleCertPopup onAdd={handleAddCert} onCancel={closePopup} currentCount={certifications.length} />
      )}
      {popup.type === "editCert" && (
        <EditBubbleCertPopup cert={popup.cert} onSave={handleUpdateCert}
          onDelete={() => setPopup({ type: "deleteCert", cert: popup.cert })} onCancel={closePopup} />
      )}
      {popup.type === "deleteCert" && (
        <ConfirmDeletePopup itemTitle={popup.cert.title} onConfirm={() => handleDeleteCert(popup.cert)} onCancel={closePopup} />
      )}
      {popup.type === "addCarousel" && (
        <AddItemsCarouselPopup onAdd={handleAddCarousel} onUploadImage={handleUploadImage} onCancel={closePopup} currentCount={carouselItems.length} />
      )}
      {popup.type === "editCarousel" && (
        <EditItemsCarouselPopup item={popup.item} onSave={handleUpdateCarousel} onUploadImage={handleUploadImage}
          onDelete={() => setPopup({ type: "deleteCarousel", item: popup.item })} onCancel={closePopup} />
      )}
      {popup.type === "deleteCarousel" && (
        <ConfirmDeletePopup itemTitle={popup.item.title} onConfirm={() => handleDeleteCarousel(popup.item)} onCancel={closePopup} />
      )}

      {/* Popups — Section 2 */}
      {popup.type === "addPublicacion" && (
        <OnboardingAddNivelPublicacion technologies={technologies} topics={topics} currentCount={publicaciones.length}
          onSubmit={handleAddPublicacion} onAddTechnology={handleAddTech} onDeleteTechnology={handleDeleteTech}
          onAddTopic={handleAddTopicItem} onDeleteTopic={handleDeleteTopicItem} onCancel={closePopup} />
      )}
      {popup.type === "editPublicacion" && (
        <OnboardingEditNivelPublicacion publication={popup.pub} technologies={technologies} topics={topics}
          onSave={handleUpdatePublicacion} onDelete={() => setPopup({ type: "deletePublicacion", pub: popup.pub })}
          onAddTechnology={handleAddTech} onDeleteTechnology={handleDeleteTech}
          onAddTopic={handleAddTopicItem} onDeleteTopic={handleDeleteTopicItem} onCancel={closePopup} />
      )}
      {popup.type === "deletePublicacion" && (
        <ConfirmDeletePopup itemTitle={popup.pub.title} onConfirm={() => handleDeletePublicacion(popup.pub)} onCancel={closePopup} />
      )}
    </div>
  );
};
