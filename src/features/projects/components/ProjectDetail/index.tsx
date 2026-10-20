"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Layers,
  AlertCircle,
  CheckCircle2,
  Users,
  Lightbulb,
  Cpu,
  Flame,
  Award,
  TrendingUp,
  Compass,
} from "lucide-react";
import type { Project } from "../../types";
import { ProjectVideoBackground } from "../ProjectVideoBackground";

const GithubIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

interface ProjectDetailProps {
  project: Project;
}

const formatDate = (value: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const hasProblemSolution =
    Boolean(project.problem_statement) || Boolean(project.solution_statement);
  const hasTargetOrValue =
    (project.target_users && project.target_users.length > 0) ||
    Boolean(project.value_proposition);
  const hasDecisionsOrChallenges =
    Boolean(project.technical_decisions) ||
    Boolean(project.key_challenge) ||
    Boolean(project.challenges_faced);
  const hasResultsOrLearnings =
    Boolean(project.measurable_results) ||
    Boolean(project.technical_learnings) ||
    Boolean(project.next_steps);

  return (
    <article className="min-h-screen bg-[#0a0a0c] text-zinc-200 relative">
      {/* Translucent cinematic laboratory background video */}
      <ProjectVideoBackground />

      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-28">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-zinc-400 transition hover:text-aperture-blue"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Volver al Catálogo de Proyectos
          </Link>
        </div>

        {/* Hero Header */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-aperture-blue/50 bg-aperture-blue/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-aperture-blue shadow-[0_0_12px_rgba(86,204,242,0.2)]">
              Caso de Estudio // Aperture Labs
            </span>
            <span className="font-mono text-xs text-zinc-500">
              {formatDate(project.date)}
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {project.description}
          </p>

          {/* Action Links & Tech Stack */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-aperture-gray/40 py-5">
            {/* Tech badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                Stack:
              </span>
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-aperture-gray/70 bg-black/60 px-3 py-1 font-mono text-xs text-zinc-200"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-aperture-blue/80 bg-aperture-blue/20 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white shadow-[0_0_18px_rgba(86,204,242,0.35)] transition duration-200 hover:bg-aperture-blue hover:text-black hover:shadow-[0_0_25px_rgba(86,204,242,0.7)]"
                >
                  <GithubIcon className="h-4 w-4" />
                  Ver Repositorio
                </a>
              )}

              {project.live_demo_url && (
                <a
                  href={project.live_demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-aperture-yellow/70 bg-aperture-yellow/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-aperture-yellow shadow-[0_0_15px_rgba(242,201,76,0.25)] transition duration-200 hover:bg-aperture-yellow hover:text-black hover:shadow-[0_0_25px_rgba(242,201,76,0.6)]"
                >
                  <ExternalLink className="h-4 w-4" />
                  Demo en Vivo
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Hero Mockup / Image */}
        {project.image_url && (
          <div className="my-12 overflow-hidden rounded-3xl border border-aperture-gray/60 bg-[#0f0f13] shadow-2xl">
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/60 via-transparent to-transparent" />
            </div>
          </div>
        )}

        {/* Bento Grid: Software Case Study Deep Dive */}
        <div className="mt-16 space-y-12">
          {/* Section: Problem & Solution */}
          {hasProblemSolution && (
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-aperture-blue" />
                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-aperture-blue">
                  01 // Contexto y Solución Arquitectónica
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Problem */}
                {project.problem_statement && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-950/10 p-6 backdrop-blur-sm sm:p-8">
                    <div className="mb-4 flex items-center gap-2 text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      <h3 className="font-mono text-sm uppercase tracking-wider font-semibold">
                        El Problema
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-300 sm:text-base whitespace-pre-line">
                      {project.problem_statement}
                    </p>
                  </div>
                )}

                {/* Solution */}
                {project.solution_statement && (
                  <div className="rounded-2xl border border-aperture-blue/40 bg-aperture-blue/5 p-6 backdrop-blur-sm sm:p-8">
                    <div className="mb-4 flex items-center gap-2 text-aperture-blue">
                      <CheckCircle2 className="h-5 w-5" />
                      <h3 className="font-mono text-sm uppercase tracking-wider font-semibold">
                        La Solución Propuesta
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-300 sm:text-base whitespace-pre-line">
                      {project.solution_statement}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Section: Target Users & Value Proposition */}
          {hasTargetOrValue && (
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-aperture-yellow" />
                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-aperture-yellow">
                  02 // Usuarios Objetivo y Propuesta de Valor
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Target Users */}
                {project.target_users && project.target_users.length > 0 && (
                  <div className="rounded-2xl border border-aperture-gray/60 bg-[#101219]/80 p-6 sm:p-8 md:col-span-1">
                    <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-zinc-400">
                      Audiencia Objetivo
                    </h3>
                    <ul className="space-y-2.5">
                      {project.target_users.map((user, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 rounded-lg border border-aperture-gray/40 bg-black/40 px-3 py-2 font-mono text-xs text-white"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-aperture-yellow" />
                          {user}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Value Proposition */}
                {project.value_proposition && (
                  <div
                    className={`rounded-2xl border border-aperture-yellow/30 bg-aperture-yellow/5 p-6 sm:p-8 ${
                      project.target_users && project.target_users.length > 0
                        ? "md:col-span-2"
                        : "md:col-span-3"
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-2 text-aperture-yellow">
                      <Lightbulb className="h-5 w-5" />
                      <h3 className="font-mono text-sm uppercase tracking-wider font-semibold">
                        Propuesta de Valor Diferencial
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-200 sm:text-base whitespace-pre-line">
                      {project.value_proposition}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Section: Technical Decisions & Challenges */}
          {hasDecisionsOrChallenges && (
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-aperture-blue" />
                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-aperture-blue">
                  03 // Decisiones de Ingeniería y Retos Técnicos
                </h2>
              </div>

              <div className="space-y-6">
                {/* Technical Decisions */}
                {project.technical_decisions && (
                  <div className="rounded-2xl border border-aperture-gray/60 bg-[#101219]/90 p-6 sm:p-8">
                    <h3 className="mb-3 font-mono text-sm uppercase tracking-wider font-bold text-white">
                      Decisiones Técnicas y Patrones de Arquitectura
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-300 sm:text-base whitespace-pre-line">
                      {project.technical_decisions}
                    </p>
                  </div>
                )}

                {/* Key Challenge Highlight Card */}
                {project.key_challenge && (
                  <div className="rounded-2xl border border-orange-500/40 bg-orange-950/20 p-6 sm:p-8">
                    <div className="mb-2 flex items-center gap-2 text-orange-400">
                      <Flame className="h-5 w-5" />
                      <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                        Desafío Principal
                      </span>
                    </div>
                    <p className="text-base font-bold text-white sm:text-lg">
                      &quot;{project.key_challenge}&quot;
                    </p>
                  </div>
                )}

                {/* Challenges Faced */}
                {project.challenges_faced && (
                  <div className="rounded-2xl border border-aperture-gray/60 bg-[#101219]/90 p-6 sm:p-8">
                    <h3 className="mb-3 font-mono text-sm uppercase tracking-wider font-bold text-zinc-300">
                      Resolución de Obstáculos y Mitigación
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-300 sm:text-base whitespace-pre-line">
                      {project.challenges_faced}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Section: Results, Learnings & Next Steps */}
          {hasResultsOrLearnings && (
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-400" />
                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400">
                  04 // Impacto Medible y Aprendizajes
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Measurable Results */}
                {project.measurable_results && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-6 sm:p-8">
                    <div className="mb-3 flex items-center gap-2 text-emerald-400">
                      <TrendingUp className="h-5 w-5" />
                      <h3 className="font-mono text-sm uppercase tracking-wider font-semibold">
                        Resultados e Impacto Medible
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-200 sm:text-base whitespace-pre-line">
                      {project.measurable_results}
                    </p>
                  </div>
                )}

                {/* Technical Learnings */}
                {project.technical_learnings && (
                  <div className="rounded-2xl border border-aperture-blue/30 bg-aperture-blue/5 p-6 sm:p-8">
                    <div className="mb-3 flex items-center gap-2 text-aperture-blue">
                      <Award className="h-5 w-5" />
                      <h3 className="font-mono text-sm uppercase tracking-wider font-semibold">
                        Aprendizajes Técnicos Clave
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-200 sm:text-base whitespace-pre-line">
                      {project.technical_learnings}
                    </p>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              {project.next_steps && (
                <div className="rounded-2xl border border-aperture-gray/60 bg-[#101219]/80 p-6 sm:p-8">
                  <div className="mb-3 flex items-center gap-2 text-aperture-yellow">
                    <Compass className="h-5 w-5" />
                    <h3 className="font-mono text-sm uppercase tracking-wider font-semibold">
                      Próximos Pasos y Roadmap
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300 sm:text-base whitespace-pre-line">
                    {project.next_steps}
                  </p>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 border-t border-aperture-gray/40 pt-10 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl border border-aperture-blue/40 bg-aperture-blue/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Explorar más proyectos
          </Link>
        </div>
      </div>
    </article>
  );
};
