"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  BookOpen,
  Sparkles,
  Quote,
  Share2,
} from "lucide-react";
import type { BlogArticle } from "../../types";

interface ArticleDetailProps {
  article: BlogArticle;
}

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("es-ES", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const calculateReadingTime = (article: BlogArticle) => {
  const allText = [
    article.title,
    article.description,
    article.introduction,
    article.content,
    article.reflection,
    article.conclusion,
    ...(article.content_blocks?.map((b) => b.text) || []),
  ].join(" ");

  const words = allText.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min de lectura`;
};

export const ArticleDetail = ({ article }: ArticleDetailProps) => {
  const readingTime = calculateReadingTime(article);
  const blocks = article.content_blocks || [];
  const hasBlocks = blocks.length > 0;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  return (
    <article className="min-h-screen bg-[#0a0a0c] text-zinc-200">
      {/* Ambient background lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-aperture-blue/10 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 h-[450px] w-[500px] rounded-full bg-aperture-yellow/5 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 pb-28 pt-28">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-zinc-400 transition hover:text-aperture-blue"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Volver a Artículos
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg border border-aperture-gray/60 bg-black/40 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-400 transition hover:border-aperture-blue/60 hover:text-white"
            title="Compartir artículo"
          >
            <Share2 className="h-3.5 w-3.5" />
            Compartir
          </button>
        </div>

        {/* Article Header */}
        <header className="space-y-6">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
              <Calendar className="h-3.5 w-3.5 text-aperture-blue" />
              {formatDate(article.date)}
            </span>

            <span className="text-zinc-600">•</span>

            <span className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-aperture-yellow" />
              {readingTime}
            </span>

            {article.is_featured && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-aperture-yellow/40 bg-aperture-yellow/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-aperture-yellow shadow-[0_0_12px_rgba(242,201,76,0.2)]">
                  <Star className="h-3 w-3 fill-aperture-yellow" />
                  Top Article
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.12]">
            {article.title}
          </h1>

          {/* Editorial Summary */}
          <p className="text-lg sm:text-xl font-light leading-relaxed text-zinc-300">
            {article.description}
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-aperture-gray/30">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-aperture-gray/60 bg-black/40 px-3 py-1 font-mono text-xs text-zinc-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Hero Image */}
        {article.thumbnail && (
          <div className="my-12 overflow-hidden rounded-3xl border border-aperture-gray/60 bg-[#0f0f13] shadow-2xl">
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/60 via-transparent to-transparent" />
            </div>
          </div>
        )}

        {/* Editorial Body Content */}
        <div className="mt-12 space-y-12 text-zinc-200">
          {/* Section: Editorial Introduction */}
          {article.introduction && (
            <section className="relative rounded-2xl border-l-2 border-aperture-blue bg-aperture-blue/[0.03] p-6 sm:p-8">
              <Quote className="absolute right-6 top-6 h-8 w-8 text-aperture-blue/20" />
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-aperture-blue" />
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-aperture-blue font-semibold">
                  Introducción y Tesis
                </span>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-zinc-200 italic whitespace-pre-line font-serif sm:font-sans">
                {article.introduction}
              </p>
            </section>
          )}

          {/* Section: Content Blocks with Float-Wrap Images */}
          {hasBlocks ? (
            <section className="space-y-8">
              {blocks.map((block, index) => {
                const isLeft = block.image_position === "left";

                return (
                  <div key={block.id || index} className="group flow-root clear-both">
                    {/* Wrapped Image */}
                    {block.image_url && (
                      <figure
                        className={`mb-4 w-full md:w-80 ${
                          isLeft
                            ? "md:float-left md:mr-6"
                            : "md:float-right md:ml-6"
                        } overflow-hidden rounded-2xl border border-aperture-gray/60 bg-[#0f0f13] p-1.5 shadow-xl transition duration-300 group-hover:border-aperture-blue/40`}
                      >
                        <img
                          src={block.image_url}
                          alt={`Ilustración del párrafo ${index + 1}`}
                          className="h-auto w-full rounded-xl object-cover"
                        />
                      </figure>
                    )}

                    {/* Paragraph Text */}
                    <p className="text-base sm:text-lg leading-relaxed sm:leading-8 text-zinc-300 whitespace-pre-line">
                      {block.text}
                    </p>
                  </div>
                );
              })}
            </section>
          ) : (
            // Fallback if article has simple content string
            article.content && (
              <section className="space-y-6 text-base sm:text-lg leading-relaxed sm:leading-8 text-zinc-300 whitespace-pre-line">
                {article.content}
              </section>
            )
          )}

          {/* Section: Reflection & Learnings */}
          {article.reflection && (
            <section className="clear-both rounded-2xl border border-aperture-yellow/30 bg-aperture-yellow/[0.04] p-6 sm:p-8 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-2 text-aperture-yellow">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-mono text-xs uppercase tracking-[0.25em] font-bold">
                  Reflexión y Aprendizajes Clave
                </h3>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-zinc-200 whitespace-pre-line">
                {article.reflection}
              </p>
            </section>
          )}

          {/* Section: Conclusion & Continuity */}
          {article.conclusion && (
            <section className="clear-both rounded-2xl border border-aperture-blue/30 bg-[#101219]/90 p-6 sm:p-8">
              <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-zinc-400 font-bold">
                Conclusión y Continuidad
              </h3>
              <p className="text-base sm:text-lg leading-relaxed text-zinc-300 whitespace-pre-line">
                {article.conclusion}
              </p>
            </section>
          )}
        </div>

        {/* Footer Navigation CTA */}
        <footer className="mt-20 border-t border-aperture-gray/40 pt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-aperture-blue/40 bg-aperture-blue/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Explorar más publicaciones
          </Link>
        </footer>
      </div>
    </article>
  );
};
