"use client";

import { useState, useRef } from "react";
import {
  X,
  Plus,
  Upload,
  Layers,
  BookOpen,
  AlignLeft,
  Award,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import type { BlogArticle, ArticleParagraphBlock } from "../../../blog/types";

interface AddArticlePopupProps {
  onAdd: (
    articleData: Omit<BlogArticle, "id">,
    thumbnailFile: File | null,
    blockImageFiles: Record<string, File>
  ) => Promise<void>;
  onCancel: () => void;
}

type TabKey = "general" | "intro" | "blocks" | "conclusion";

export const AddArticlePopup = ({ onAdd, onCancel }: AddArticlePopupProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Tab 1: General
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => {
    const d = new Date();
    return `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
  });
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Tab 2: Introducción
  const [introduction, setIntroduction] = useState("");

  // Tab 3: Bloques de Párrafos dinámicos
  const [blocks, setBlocks] = useState<ArticleParagraphBlock[]>([]);
  const [blockFiles, setBlockFiles] = useState<Record<string, File>>({});
  const [blockPreviews, setBlockPreviews] = useState<Record<string, string>>({});

  // Tab 4: Reflexión y Conclusión
  const [reflection, setReflection] = useState("");
  const [conclusion, setConclusion] = useState("");

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setError("Formato de imagen no soportado. Usa PNG, JPG, WEBP o SVG.");
      return;
    }
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbnailPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setError("");
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;
    setTags([...tags, trimmed]);
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Block management
  const handleAddBlock = () => {
    const newBlock: ArticleParagraphBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: "",
      image_position: "right",
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleUpdateBlock = (id: string, updates: Partial<ArticleParagraphBlock>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    const nextFiles = { ...blockFiles };
    delete nextFiles[id];
    setBlockFiles(nextFiles);
    const nextPreviews = { ...blockPreviews };
    delete nextPreviews[id];
    setBlockPreviews(nextPreviews);
  };

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
  };

  const handleBlockImageChange = (
    blockId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setError("Formato de imagen no compatible para el bloque.");
      return;
    }
    setBlockFiles((prev) => ({ ...prev, [blockId]: file }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBlockPreviews((prev) => ({ ...prev, [blockId]: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
    setError("");
  };

  const handleRemoveBlockImage = (blockId: string) => {
    const nextFiles = { ...blockFiles };
    delete nextFiles[blockId];
    setBlockFiles(nextFiles);

    const nextPreviews = { ...blockPreviews };
    delete nextPreviews[blockId];
    setBlockPreviews(nextPreviews);

    handleUpdateBlock(blockId, { image_url: undefined });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("El título del artículo es obligatorio.");
      setActiveTab("general");
      return;
    }
    if (!description.trim()) {
      setError("La descripción/resumen del artículo es obligatoria.");
      setActiveTab("general");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      // Content fallback string: concatenates intro + blocks text
      const contentCompiled = [
        introduction,
        ...blocks.map((b) => b.text),
        reflection,
        conclusion,
      ]
        .filter(Boolean)
        .join("\n\n");

      await onAdd(
        {
          title: title.trim(),
          date: date.trim() || "Reciente",
          description: description.trim(),
          thumbnail: "",
          tags,
          is_featured: isFeatured,
          content: contentCompiled,
          introduction: introduction.trim(),
          content_blocks: blocks,
          reflection: reflection.trim(),
          conclusion: conclusion.trim(),
        },
        thumbnailFile,
        blockFiles
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar artículo");
      setIsSaving(false);
    }
  };

  const tabs: { key: TabKey; label: string; icon: typeof Layers }[] = [
    { key: "general", label: "1. General & Portada", icon: Layers },
    { key: "intro", label: "2. Introducción", icon: BookOpen },
    { key: "blocks", label: "3. Bloques e Imágenes", icon: AlignLeft },
    { key: "conclusion", label: "4. Reflexión & Cierre", icon: Award },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-panel relative w-full max-w-3xl rounded-2xl border border-aperture-gray/60 bg-[#0f0f13] px-6 py-6 sm:px-8 sm:py-8 my-auto shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-aperture-gray/40 pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-aperture-yellow">
              Aperture Editorial // Blog
            </span>
            <h3 className="mt-1 text-xl font-black text-white">
              Nuevo Artículo Editorial
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-aperture-gray/30 pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs uppercase tracking-wider transition ${
                  isActive
                    ? "border border-aperture-blue/50 bg-aperture-blue/15 text-aperture-blue font-semibold shadow-[0_0_15px_rgba(86,204,242,0.15)]"
                    : "border border-transparent text-zinc-400 hover:border-aperture-gray/50 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: General */}
        {activeTab === "general" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                  Título del Artículo *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Principios de Arquitectura Serverless en Producción"
                  className="w-full rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                  Fecha
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Ej: Oct 2026"
                  className="w-full rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
                />
              </div>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between rounded-xl border border-aperture-yellow/30 bg-aperture-yellow/5 p-3.5">
              <div className="flex items-center gap-3">
                <Star
                  className={`h-5 w-5 ${
                    isFeatured
                      ? "fill-aperture-yellow text-aperture-yellow"
                      : "text-zinc-500"
                  }`}
                />
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-white">
                    Top Article (Destacado en portada)
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Muestra este artículo en la sección principal superior del blog.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFeatured(!isFeatured)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isFeatured ? "bg-aperture-yellow" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                    isFeatured ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Resumen / Breve Descripción * (Sin límite de caracteres)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Resumen introductorio que cautive al lector y explique el valor del artículo..."
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>

            {/* Thumbnail upload */}
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Imagen de Portada (Thumbnail)
              </label>
              <input
                ref={thumbInputRef}
                type="file"
                accept=".png,.jpeg,.jpg,.webp,.svg"
                onChange={handleThumbChange}
                className="hidden"
              />
              {thumbnailPreview ? (
                <div className="relative overflow-hidden rounded-xl border border-aperture-gray bg-black/60">
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="h-40 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => thumbInputRef.current?.click()}
                    className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white hover:bg-black"
                  >
                    <Upload className="mr-1 inline h-3 w-3" /> Cambiar Portada
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => thumbInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-aperture-gray/60 bg-black/30 py-6 font-mono text-[10px] uppercase tracking-widest text-zinc-400 transition hover:border-aperture-blue/50 hover:text-aperture-blue"
                >
                  <Upload className="h-4 w-4" /> Subir Imagen de Portada
                </button>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Categorías / Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Ej: Arquitectura, React, Base de Datos..."
                  className="flex-1 rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center gap-1 rounded-lg border border-aperture-blue/40 bg-aperture-blue/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-aperture-blue hover:bg-aperture-blue/20"
                >
                  <Plus className="h-3 w-3" /> Añadir
                </button>
              </div>

              {tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-aperture-gray/70 bg-black/60 px-3 py-1 font-mono text-[10px] text-aperture-blue"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(i)}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Introducción */}
        {activeTab === "intro" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Introducción Editorial y Contexto
              </label>
              <p className="mb-2 text-xs text-zinc-500">
                Sección inicial que contextualiza al lector, plantea la tesis principal y establece el tono del artículo.
              </p>
              <textarea
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                rows={9}
                placeholder="Escribe la introducción editorial..."
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none leading-relaxed transition focus:border-aperture-blue"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Bloques dinámicos */}
        {activeTab === "blocks" && (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <div className="flex items-center justify-between border-b border-aperture-gray/30 pb-3">
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-white">
                  Desarrollo del Artículo por Bloques
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Crea párrafos con imágenes laterales envolventes alineadas a la izquierda o derecha (estilo revista Apple HIG).
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddBlock}
                className="inline-flex items-center gap-1.5 rounded-lg border border-aperture-blue/50 bg-aperture-blue/15 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-aperture-blue hover:bg-aperture-blue/25"
              >
                <Plus className="h-3.5 w-3.5" /> Añadir Párrafo
              </button>
            </div>

            {blocks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-aperture-gray/50 bg-black/30 p-8 text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
                <p className="font-mono text-xs uppercase text-zinc-400">
                  No has añadido bloques de párrafo todavía
                </p>
                <button
                  type="button"
                  onClick={handleAddBlock}
                  className="mt-3 text-xs font-mono text-aperture-blue underline hover:text-white"
                >
                  + Agregar primer bloque
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {blocks.map((block, index) => {
                  const preview = blockPreviews[block.id] || block.image_url;

                  return (
                    <div
                      key={block.id}
                      className="rounded-xl border border-aperture-gray/50 bg-black/40 p-4 space-y-3"
                    >
                      {/* Block bar */}
                      <div className="flex items-center justify-between border-b border-aperture-gray/30 pb-2">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-aperture-yellow">
                          Párrafo #{index + 1}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMoveBlock(index, "up")}
                            disabled={index === 0}
                            className="rounded p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                            title="Subir bloque"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveBlock(index, "down")}
                            disabled={index === blocks.length - 1}
                            className="rounded p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                            title="Bajar bloque"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveBlock(block.id)}
                            className="rounded p-1 text-red-400 hover:text-red-300"
                            title="Eliminar bloque"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Paragraph Text */}
                      <div>
                        <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                          Texto del Párrafo (Sin límite)
                        </label>
                        <textarea
                          value={block.text}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, { text: e.target.value })
                          }
                          rows={4}
                          placeholder="Escribe el contenido de este bloque de texto..."
                          className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
                        />
                      </div>

                      {/* Image settings for block */}
                      <div className="rounded-lg border border-aperture-gray/40 bg-zinc-900/40 p-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-300">
                              Imagen Lateral (Opcional)
                            </span>
                            <p className="text-[10px] text-zinc-500">
                              El texto se envolverá naturalmente alrededor de esta imagen.
                            </p>
                          </div>

                          {/* Wrap alignment selector */}
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-zinc-400">
                              Posición:
                            </span>
                            <div className="inline-flex rounded-lg border border-aperture-gray/60 p-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateBlock(block.id, {
                                    image_position: "left",
                                  })
                                }
                                className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase transition ${
                                  block.image_position === "left"
                                    ? "bg-aperture-blue text-black font-bold"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                Izquierda
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateBlock(block.id, {
                                    image_position: "right",
                                  })
                                }
                                className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase transition ${
                                  block.image_position !== "left"
                                    ? "bg-aperture-blue text-black font-bold"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                Derecha
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Image file input */}
                        <div className="mt-3">
                          {preview ? (
                            <div className="flex items-center gap-3">
                              <img
                                src={preview}
                                alt="Bloque"
                                className="h-14 w-20 rounded border border-aperture-gray object-cover bg-black"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveBlockImage(block.id)}
                                className="font-mono text-[10px] uppercase text-red-400 hover:text-red-300"
                              >
                                Quitar Imagen
                              </button>
                            </div>
                          ) : (
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-aperture-gray/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:border-aperture-blue/60 hover:text-aperture-blue">
                              <Upload className="h-3 w-3" /> Seleccionar Imagen para este Párrafo
                              <input
                                type="file"
                                accept=".png,.jpeg,.jpg,.webp,.svg"
                                onChange={(e) =>
                                  handleBlockImageChange(block.id, e)
                                }
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Reflexión & Conclusión */}
        {activeTab === "conclusion" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Reflexión y Aprendizajes
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={5}
                placeholder="Lecciones aprendidas, implicaciones teóricas o prácticas para el lector..."
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Conclusión y Continuidad (Cierre del Artículo)
              </label>
              <textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                rows={5}
                placeholder="Síntesis final, preguntas abiertas para la comunidad o llamado a la acción..."
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-between border-t border-aperture-gray/40 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-lg border border-aperture-gray px-4 py-2 font-mono text-xs uppercase tracking-wider text-zinc-400 transition hover:border-white/40 hover:text-white disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg border border-aperture-blue/50 bg-aperture-blue/15 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/25 hover:text-white hover:shadow-[0_0_20px_rgba(86,204,242,0.3)] disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border border-aperture-blue border-t-transparent" />
                Guardando Artículo...
              </>
            ) : (
              "Publicar Artículo"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
