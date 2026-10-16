"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGuestbookAuth } from "../../guestbook/hooks/useGuestbookAuth";
import type { BlogArticle, ArticleParagraphBlock } from "../../blog/types";

import { BlogTableComponent } from "./components/BlogTableComponent";
import { AddArticlePopup } from "./components/AddArticlePopup";
import { EditArticlePopup } from "./components/EditArticlePopup";
import { ConfirmDeletePopup } from "../shared/components/ConfirmDelete.popup";

import { optimizeImage } from "../../../lib/utils/image-optimizer";
import { uploadStorageAsset, deleteStorageAsset } from "../../../app/actions/storage-actions";
import {
  addArticle,
  updateArticle,
  deleteArticle,
} from "../../blog/services/blog.service";

type PopupState =
  | { type: "none" }
  | { type: "add" }
  | { type: "edit"; article: BlogArticle }
  | { type: "delete"; article: BlogArticle };

interface BlogCRUDContainerProps {
  articles: BlogArticle[];
}

export const BlogCRUDContainer = ({ articles }: BlogCRUDContainerProps) => {
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

  // Helper to upload an image to "blog" bucket folder
  const uploadBlogImage = async (file: File, baseName: string): Promise<string> => {
    const optimized = await optimizeImage(file, {
      maxWidth: 1400,
      maxHeight: 1400,
      quality: 0.8,
    });
    const formData = new FormData();
    formData.append("file", optimized);
    formData.append("folder", "blog");
    const hash = Math.random().toString(36).substring(2, 8);
    const cleanName = baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    formData.append(
      "filename",
      `${cleanName}-${hash}.${optimized.name.split(".").pop()}`
    );
    return await uploadStorageAsset(formData);
  };

  const handleAddArticle = async (
    articleData: Omit<BlogArticle, "id">,
    thumbnailFile: File | null,
    blockImageFiles: Record<string, File>
  ) => {
    let thumbPath = "";
    const uploadedBlockImages: Record<string, string> = {};

    try {
      if (thumbnailFile) {
        thumbPath = await uploadBlogImage(thumbnailFile, `${articleData.title}-thumb`);
      }

      // Upload block images
      for (const [blockId, file] of Object.entries(blockImageFiles)) {
        const path = await uploadBlogImage(file, `${articleData.title}-block-${blockId}`);
        uploadedBlockImages[blockId] = path;
      }

      const processedBlocks: ArticleParagraphBlock[] = (articleData.content_blocks || []).map((b) => ({
        ...b,
        image_url: uploadedBlockImages[b.id] || b.image_url,
      }));

      await addArticle({
        ...articleData,
        is_featured: Boolean(articleData.is_featured),
        thumbnail: thumbPath,
        content_blocks: processedBlocks,
      });
    } catch (err) {
      // Cleanup uploaded files on failure
      if (thumbPath) await deleteStorageAsset(thumbPath).catch(console.error);
      for (const path of Object.values(uploadedBlockImages)) {
        await deleteStorageAsset(path).catch(console.error);
      }
      throw err;
    }

    closePopup();
    router.refresh();
  };

  const handleUpdateArticle = async (
    id: string | number,
    updates: Partial<BlogArticle>,
    thumbnailFile?: File | null,
    blockImageFiles?: Record<string, File>
  ) => {
    let newThumbPath = "";
    const uploadedBlockImages: Record<string, string> = {};
    const currentArticle = articles.find((a) => a.id === id);

    try {
      if (thumbnailFile) {
        newThumbPath = await uploadBlogImage(
          thumbnailFile,
          `${updates.title || currentArticle?.title || "article"}-thumb`
        );
      }

      if (blockImageFiles) {
        for (const [blockId, file] of Object.entries(blockImageFiles)) {
          const path = await uploadBlogImage(
            file,
            `${updates.title || "article"}-block-${blockId}`
          );
          uploadedBlockImages[blockId] = path;
        }
      }

      let processedBlocks = updates.content_blocks;
      if (processedBlocks) {
        processedBlocks = processedBlocks.map((b) => ({
          ...b,
          image_url: uploadedBlockImages[b.id] || b.image_url,
        }));
      }

      const updatedPayload: Partial<BlogArticle> = {
        ...updates,
        ...(newThumbPath ? { thumbnail: newThumbPath } : {}),
        ...(processedBlocks ? { content_blocks: processedBlocks } : {}),
      };

      await updateArticle(id, updatedPayload);

      // If thumbnail was replaced and old thumbnail exists, clean up old
      if (
        newThumbPath &&
        currentArticle?.thumbnail &&
        currentArticle.thumbnail !== newThumbPath
      ) {
        await deleteStorageAsset(currentArticle.thumbnail).catch(console.error);
      }
    } catch (err) {
      if (newThumbPath) await deleteStorageAsset(newThumbPath).catch(console.error);
      for (const path of Object.values(uploadedBlockImages)) {
        await deleteStorageAsset(path).catch(console.error);
      }
      throw err;
    }

    closePopup();
    router.refresh();
  };

  const handleToggleFeatured = async (article: BlogArticle) => {
    await updateArticle(article.id, {
      is_featured: !article.is_featured,
    });
    router.refresh();
  };

  const handleDeleteArticle = async (article: BlogArticle) => {
    if (article.thumbnail) {
      await deleteStorageAsset(article.thumbnail).catch(console.error);
    }
    if (article.content_blocks) {
      for (const b of article.content_blocks) {
        if (b.image_url) {
          await deleteStorageAsset(b.image_url).catch(console.error);
        }
      }
    }

    await deleteArticle(article.id);
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
            Se requieren privilegios de Administrador para gestionar el blog.
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
              Admin // Blog Module
            </p>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
              GESTIÓN DEL BLOG
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">
              Administra publicaciones editoriales, destacados Top Articles, párrafos con imágenes laterales y reflexiones técnicas.
            </p>
          </div>
        </div>

        {/* Blog Table Card */}
        <div className="rounded-2xl border border-aperture-gray/50 bg-aperture-dark/50 p-6 sm:p-8 backdrop-blur-sm">
          <BlogTableComponent
            articles={articles}
            onAdd={() => setPopup({ type: "add" })}
            onEdit={(art) => setPopup({ type: "edit", article: art })}
            onDelete={(art) => setPopup({ type: "delete", article: art })}
            onToggleFeatured={handleToggleFeatured}
          />
        </div>
      </div>

      {/* Popups */}
      {popup.type === "add" && (
        <AddArticlePopup onAdd={handleAddArticle} onCancel={closePopup} />
      )}

      {popup.type === "edit" && (
        <EditArticlePopup
          article={popup.article}
          onSave={handleUpdateArticle}
          onDelete={() => setPopup({ type: "delete", article: popup.article })}
          onCancel={closePopup}
        />
      )}

      {popup.type === "delete" && (
        <ConfirmDeletePopup
          itemTitle={popup.article.title}
          onConfirm={() => handleDeleteArticle(popup.article)}
          onCancel={closePopup}
        />
      )}
    </div>
  );
};
