"use client";

import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import type { ExperienceCarouselItem } from "../../../experience/types";

interface EditItemsCarouselPopupProps {
  item: ExperienceCarouselItem;
  onSave: (id: string | number, updates: Partial<ExperienceCarouselItem>) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
  onDelete: () => void;
  onCancel: () => void;
}

export const EditItemsCarouselPopup = ({
  item,
  onSave,
  onUploadImage,
  onDelete,
  onCancel,
}: EditItemsCarouselPopupProps) => {
  const [title, setTitle] = useState(item.title);
  const [subtitle, setSubtitle] = useState(item.subtitle);
  const [imagePreview, setImagePreview] = useState<string | null>(item.image_path || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }

    setImageFile(file);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!subtitle.trim()) {
      setError("El subtítulo es obligatorio.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      let imagePath = item.image_path;
      if (imageFile) {
        imagePath = await onUploadImage(imageFile);
      }

      await onSave(item.id, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        image_path: imagePath,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar cambios.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-panel relative w-full max-w-lg rounded-2xl px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-aperture-yellow">
            Editando Item
          </h3>
          <button
            onClick={onCancel}
            className="text-zinc-400 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue/60"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Subtítulo
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue/60"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Imagen
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl border border-aperture-gray/50">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-full object-cover"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white transition hover:bg-black/80"
                >
                  <Upload className="mr-1 inline h-3 w-3" />
                  Cambiar
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-aperture-gray/50 bg-aperture-dark/40 py-10 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition hover:border-aperture-blue/40 hover:text-aperture-blue"
              >
                <Upload className="h-4 w-4" />
                Seleccionar imagen
              </button>
            )}
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onDelete}
            disabled={isSaving}
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-red-400 transition hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
          >
            Eliminar
          </button>
          <div className="flex-1" />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg border border-aperture-blue/50 bg-aperture-blue/10 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border border-aperture-blue border-t-transparent" />
                Guardando...
              </span>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
