"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import type { HomeService } from "../../../home/types";

interface EditServicesPopupProps {
  service: HomeService;
  onSave: (id: string | number, updates: Partial<HomeService>) => Promise<void>;
  onDelete: () => void;
  onCancel: () => void;
}

export const EditServicesPopup = ({
  service,
  onSave,
  onDelete,
  onCancel,
}: EditServicesPopupProps) => {
  const [title, setTitle] = useState(service.title);
  const [description, setDescription] = useState(service.description);
  const [highlights, setHighlights] = useState<string[]>([...service.highlights]);
  const [highlightInput, setHighlightInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const addHighlight = () => {
    const trimmed = highlightInput.trim();
    if (!trimmed) return;
    if (highlights.length >= 8) {
      setError("Máximo 8 highlights permitidos.");
      return;
    }
    if (highlights.includes(trimmed)) {
      setError("Este highlight ya existe.");
      return;
    }
    setHighlights([...highlights, trimmed]);
    setHighlightInput("");
    setError("");
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addHighlight();
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!description.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await onSave(service.id, {
        title: title.trim(),
        description: description.trim(),
        highlights,
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
            Editando {service.title}:
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
          {/* Title */}
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

          {/* Description */}
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Descripción
              <span className="ml-2 text-zinc-600">
                ({description.length}/500)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value.slice(0, 500))
              }
              maxLength={500}
              rows={3}
              className="w-full resize-none rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue/60"
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Highlights
              <span className="ml-2 text-zinc-600">
                ({highlights.length}/8)
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Agregar highlight..."
                disabled={highlights.length >= 8}
                className="flex-1 rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue/60 disabled:opacity-40"
              />
              <button
                onClick={addHighlight}
                disabled={highlights.length >= 8 || !highlightInput.trim()}
                className="flex items-center gap-1 rounded-lg border border-aperture-blue/40 bg-aperture-blue/10 px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-aperture-blue transition hover:bg-aperture-blue/20 disabled:opacity-40"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            {highlights.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {highlights.map((h, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 rounded-full border border-aperture-gray/70 bg-aperture-dark/60 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-aperture-blue"
                  >
                    {h}
                    <button
                      onClick={() => removeHighlight(i)}
                      className="text-zinc-500 transition hover:text-red-400"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
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
