"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface AddServicesPopupProps {
  onAdd: (data: {
    title: string;
    description: string;
    highlights: string[];
    order_index: number;
  }) => Promise<void>;
  onCancel: () => void;
  currentCount: number;
}

export const AddServicesPopup = ({
  onAdd,
  onCancel,
  currentCount,
}: AddServicesPopupProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
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

  const handleSubmit = async () => {
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
      await onAdd({
        title: title.trim(),
        description: description.trim(),
        highlights,
        order_index: currentCount + 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al añadir servicio.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-panel relative w-full max-w-lg rounded-2xl px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-aperture-yellow">
            Añadiendo Servicio:
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
              placeholder="Ej: Full-Stack Development"
              className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue/60"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Breve descripción del servicio..."
              className="w-full resize-y rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue/60"
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
                placeholder="Ej: React, Node.js..."
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
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 rounded-lg border border-aperture-gray px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-zinc-300 transition hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 rounded-lg border border-aperture-blue/50 bg-aperture-blue/10 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border border-aperture-blue border-t-transparent" />
                Añadiendo...
              </span>
            ) : (
              "Añadir"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
