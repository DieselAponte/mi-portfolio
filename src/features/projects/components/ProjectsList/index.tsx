import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
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
import type { Project } from "../../types";

type ProjectsListProps = {
  projects: Project[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  filterKey: string;
  onLoadMore: () => void;
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const ProjectSkeleton = () => {
  return (
    <section className="rounded-3xl border border-aperture-gray/60 bg-aperture-dark/40 p-6">
      <div className="space-y-2">
        <div className="h-4 w-40 rounded-full bg-aperture-gray/70" />
        <div className="h-3 w-52 rounded-full bg-aperture-gray/50" />
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="overflow-hidden rounded-2xl border border-aperture-gray/70 bg-[#101219]/80"
          >
            <div
              className="h-40 w-full animate-pulse"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(86,204,242,0.12), rgba(242,201,76,0.25), rgba(86,204,242,0.12))",
              }}
            />
            <div className="space-y-3 p-4">
              <div className="h-4 w-1/2 rounded-full bg-aperture-gray/60" />
              <div className="h-3 w-2/3 rounded-full bg-aperture-gray/50" />
              <div className="h-3 w-full rounded-full bg-aperture-gray/40" />
              <div className="h-3 w-5/6 rounded-full bg-aperture-gray/40" />
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-aperture-gray/60" />
                <div className="h-6 w-16 rounded-full bg-aperture-gray/60" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const ProjectsList = ({
  projects,
  isLoading,
  isLoadingMore,
  hasMore,
  filterKey,
  onLoadMore,
}: ProjectsListProps) => {
  if (isLoading) {
    return <ProjectSkeleton />;
  }

  if (projects.length === 0) {
    return (
      <section className="rounded-2xl border border-aperture-gray/60 bg-aperture-dark/40 px-6 py-12 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-aperture-yellow">
          Testing Tracks // Feed Status
        </p>
        <p className="mt-3 text-sm text-zinc-300">
          Actualmente no hay proyectos disponibles que coincidan con la sección o los filtros activos.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-aperture-gray/60 bg-aperture-dark/40 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Testing Tracks</h3>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400">
            Live project feed
          </p>
        </div>
        <span className="text-xs font-mono uppercase tracking-[0.35em] text-aperture-blue">
          Status: Online
        </span>
      </div>

      <div className="relative mt-8">
        <motion.div
          key={`scan-${filterKey}`}
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-aperture-blue to-transparent"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: [0, 1, 0], y: [0, 48, 120] }}
          transition={{ duration: 0.6 }}
        />

        <motion.div layout className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(12px)" }}
                transition={{ duration: 0.25 }}
                className="group overflow-hidden rounded-2xl border border-aperture-gray/70 bg-[#101219]/80"
              >
                <div className="relative h-44 w-full overflow-hidden border-b border-aperture-gray/60">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-[0.3em] text-aperture-blue">
                        {formatDate(project.date)}
                      </p>
                      <h4 className="mt-2 text-lg font-semibold text-white">
                        {project.title}
                      </h4>
                    </div>
                    <Link
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/btn flex h-9 w-9 items-center justify-center rounded-full border border-aperture-blue/40 bg-aperture-blue/10 text-aperture-blue transition-all duration-300 hover:border-aperture-blue hover:bg-aperture-blue/25 hover:text-white hover:shadow-[0_0_14px_rgba(86,204,242,0.45)]"
                      aria-label={`Open ${project.title} on GitHub`}
                    >
                      <GithubIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
                    </Link>
                  </div>
                  <p className="text-sm leading-6 text-zinc-300">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-aperture-blue/60 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-aperture-blue"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {hasMore ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-3 rounded-sm border border-aperture-blue/70 bg-black/40 px-5 py-2 text-[10px] font-mono uppercase tracking-[0.35em] text-aperture-blue transition hover:bg-aperture-blue hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Load More
            <span className="text-xs">-&gt;</span>
          </button>
        </div>
      ) : (
        <p className="mt-8 text-center text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">
          End of feed
        </p>
      )}
    </section>
  );
};
