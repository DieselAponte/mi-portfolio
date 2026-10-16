"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Star, Newspaper, Sparkles } from "lucide-react";
import type { BlogArticle } from "../../../blog/types";

interface BlogTableComponentProps {
  articles: BlogArticle[];
  onAdd: () => void;
  onEdit: (article: BlogArticle) => void;
  onDelete: (article: BlogArticle) => void;
  onToggleFeatured: (article: BlogArticle) => Promise<void>;
}

export const BlogTableComponent = ({
  articles,
  onAdd,
  onEdit,
  onDelete,
  onToggleFeatured,
}: BlogTableComponentProps) => {
  const [filterMode, setFilterMode] = useState<"all" | "featured">("all");
  const [togglingId, setTogglingId] = useState<string | number | null>(null);

  const displayedArticles = filterMode === "featured"
    ? articles.filter((a) => a.is_featured)
    : articles;

  const featuredCount = articles.filter((a) => a.is_featured).length;

  const handleToggle = async (article: BlogArticle) => {
    setTogglingId(article.id);
    try {
      await onToggleFeatured(article);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-mono text-sm uppercase tracking-[0.25em] text-aperture-yellow">
              Publicaciones del Blog
            </h2>
            <span className="rounded-full border border-aperture-gray bg-black/40 px-2.5 py-0.5 font-mono text-[10px] text-zinc-400">
              {articles.length} {articles.length === 1 ? "artículo" : "artículos"}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Administra tus artículos editoriales, artículos destacados en portada y bloques con imágenes envolventes.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-aperture-blue/40 bg-aperture-blue/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          Añadir Artículo
        </button>
      </div>

      {/* Tabs / Filters for Top Articles */}
      <div className="flex items-center gap-2 border-b border-aperture-gray/30 pb-3">
        <button
          onClick={() => setFilterMode("all")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
            filterMode === "all"
              ? "border border-aperture-blue/50 bg-aperture-blue/15 text-aperture-blue font-semibold"
              : "border border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Newspaper className="h-3.5 w-3.5" />
          Todos ({articles.length})
        </button>

        <button
          onClick={() => setFilterMode("featured")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
            filterMode === "featured"
              ? "border border-aperture-yellow/50 bg-aperture-yellow/15 text-aperture-yellow font-semibold"
              : "border border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-aperture-yellow" />
          Top Articles / Destacados ({featuredCount})
        </button>
      </div>

      {/* List */}
      {displayedArticles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-aperture-gray/50 bg-aperture-dark/30 p-12 text-center">
          <Newspaper className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
            {filterMode === "featured"
              ? "No hay artículos destacados en este momento"
              : "No hay artículos registrados en el blog"}
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            {filterMode === "featured"
              ? "Marca artículos como destacados haciendo clic en la estrella."
              : "Crea tu primer artículo haciendo clic en 'Añadir Artículo'."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedArticles.map((article) => {
            const blockCount = article.content_blocks?.length || 0;
            const isToggling = togglingId === article.id;

            return (
              <div
                key={article.id}
                className="group relative flex flex-col gap-4 rounded-xl border border-aperture-gray/40 bg-[#0f0f12]/80 p-4 transition duration-200 hover:border-aperture-blue/40 hover:bg-[#121217] sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {article.thumbnail ? (
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="h-16 w-24 shrink-0 rounded-lg border border-aperture-gray/40 object-cover bg-black/60"
                    />
                  ) : (
                    <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-aperture-gray/40 bg-black/40 font-mono text-[9px] uppercase text-zinc-600">
                      Sin portada
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white text-base truncate">
                        {article.title}
                      </h3>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {article.date}
                      </span>
                      {article.is_featured && (
                        <span className="flex items-center gap-1 rounded-full border border-aperture-yellow/40 bg-aperture-yellow/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-aperture-yellow">
                          <Star className="h-2.5 w-2.5 fill-aperture-yellow" />
                          Top Article
                        </span>
                      )}
                      {blockCount > 0 && (
                        <span className="rounded-full border border-aperture-blue/30 bg-aperture-blue/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-aperture-blue">
                          {blockCount} {blockCount === 1 ? "bloque" : "bloques"}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs text-zinc-400 leading-relaxed">
                      {article.description}
                    </p>

                    {/* Tags */}
                    {article.tags.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        {article.tags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="rounded border border-aperture-gray/50 bg-black/40 px-2 py-0.5 font-mono text-[9px] text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex shrink-0 items-center gap-2 sm:self-center">
                  {/* Quick Toggle Featured */}
                  <button
                    onClick={() => handleToggle(article)}
                    disabled={isToggling}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-xs uppercase tracking-wider transition ${
                      article.is_featured
                        ? "border-aperture-yellow/50 bg-aperture-yellow/15 text-aperture-yellow hover:bg-aperture-yellow/25"
                        : "border-aperture-gray/60 bg-black/40 text-zinc-400 hover:text-aperture-yellow hover:border-aperture-yellow/40"
                    } disabled:opacity-50`}
                    title={
                      article.is_featured
                        ? "Quitar de Top Articles"
                        : "Marcar como Top Article"
                    }
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${
                        article.is_featured ? "fill-aperture-yellow" : ""
                      }`}
                    />
                    {article.is_featured ? "Destacado" : "Destacar"}
                  </button>

                  <button
                    onClick={() => onEdit(article)}
                    className="flex items-center gap-1.5 rounded-lg border border-aperture-gray/60 bg-black/40 px-3 py-2 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:border-aperture-blue/60 hover:text-white hover:bg-aperture-blue/10"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-aperture-blue" />
                    Editar
                  </button>

                  <button
                    onClick={() => onDelete(article)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 font-mono text-xs uppercase tracking-wider text-red-400 transition hover:border-red-500/60 hover:bg-red-500/15 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
