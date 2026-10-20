"use client";

import { Plus, Edit2, Trash2, ExternalLink, BookOpen, RefreshCw } from "lucide-react";
import type { Project } from "../../../projects/types";

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

const formatProjectDate = (value: string) => {
  if (!value) return "Sin fecha";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("es-ES", {
    month: "short",
    year: "numeric",
  });
};

interface ProjectsTableComponentProps {
  projects: Project[];
  isSyncing?: boolean;
  onSync?: () => void;
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectsTableComponent = ({
  projects,
  isSyncing = false,
  onSync,
  onAdd,
  onEdit,
  onDelete,
}: ProjectsTableComponentProps) => {
  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-mono text-sm uppercase tracking-[0.25em] text-aperture-yellow">
              Catálogo de Proyectos
            </h2>
            <span className="rounded-full border border-aperture-gray bg-black/40 px-2.5 py-0.5 font-mono text-[10px] text-zinc-400">
              {projects.length} {projects.length === 1 ? "proyecto" : "proyectos"}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Administra tus casos de estudio de software, especificaciones técnicas y enlaces de demostración.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onSync && (
            <button
              type="button"
              onClick={onSync}
              disabled={isSyncing}
              title="Sincronizar proyectos con Supabase"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-aperture-gray/70 bg-black/50 px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:border-aperture-blue/60 hover:text-white disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-aperture-blue ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
            </button>
          )}

          <button
            onClick={onAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-aperture-blue/40 bg-aperture-blue/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Añadir Proyecto
          </button>
        </div>
      </div>

      {/* Projects list */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-aperture-gray/50 bg-aperture-dark/30 p-12 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
            No hay proyectos registrados todavía
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Crea tu primer proyecto haciendo clic en el botón superior.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const hasExtendedStudy =
              Boolean(project.problem_statement) ||
              Boolean(project.technical_decisions) ||
              Boolean(project.measurable_results);

            return (
              <div
                key={project.id}
                className="group relative flex flex-col gap-4 rounded-xl border border-aperture-gray/40 bg-[#0f0f12]/80 p-4 transition duration-200 hover:border-aperture-blue/40 hover:bg-[#121217] sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="h-16 w-24 shrink-0 rounded-lg border border-aperture-gray/40 object-cover bg-black/60"
                    />
                  ) : (
                    <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-aperture-gray/40 bg-black/40 font-mono text-[9px] uppercase text-zinc-600">
                      Sin imagen
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white text-base truncate">
                        {project.title}
                      </h3>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {formatProjectDate(project.date)}
                      </span>
                      {hasExtendedStudy && (
                        <span className="rounded-full border border-aperture-yellow/30 bg-aperture-yellow/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-aperture-yellow">
                          Estudio Detallado
                        </span>
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs text-zinc-400 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech stack & links */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      {project.tech_stack.map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="rounded border border-aperture-gray/50 bg-black/40 px-2 py-0.5 font-mono text-[9px] text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}

                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-zinc-800/80 px-2 py-0.5 font-mono text-[9px] text-zinc-400 hover:text-white"
                          title="Repositorio en GitHub"
                        >
                          <GithubIcon className="h-2.5 w-2.5" />
                          Repo
                        </a>
                      )}

                      {project.live_demo_url && (
                        <a
                          href={project.live_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-aperture-blue/15 px-2 py-0.5 font-mono text-[9px] text-aperture-blue hover:text-cyan-200"
                          title="Demostración en vivo"
                        >
                          <ExternalLink className="h-2.5 w-2.5" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex shrink-0 items-center gap-2 sm:self-center">
                  <button
                    onClick={() => onEdit(project)}
                    className="flex items-center gap-1.5 rounded-lg border border-aperture-gray/60 bg-black/40 px-3 py-2 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:border-aperture-blue/60 hover:text-white hover:bg-aperture-blue/10"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-aperture-blue" />
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(project)}
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
