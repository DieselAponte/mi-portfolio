"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Footer } from "../../home/components/Footer";
import { useProjectFilters } from "../hooks/useProjectFIlters";
import {
  fetchProjects,
} from "../services/projects.service";
import type { Project } from "../types";
import { HeaderTitle } from "./HeaderTitle";
import { ProjectsList } from "./ProjectsList";
import { TechFilters } from "./TechFilters";

const PAGE_LIMIT = 4;

export default function ProjectsContainer() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    activeFilters,
    filteredProjects,
    filterKey,
    toggleFilter,
    clearFilters,
  } = useProjectFilters({ projects });

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await fetchProjects({
        limit: PAGE_LIMIT,
        offset: 0,
      });
      setProjects(items);
      setHasMore(items.length === PAGE_LIMIT);
    } catch (fetchError) {
      setProjects([]);
      setHasMore(false);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load live projects.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const nextBatch = await fetchProjects({
        limit: PAGE_LIMIT,
        offset: projects.length,
      });
      setProjects((prev) => [...prev, ...nextBatch]);
      setHasMore(nextBatch.length === PAGE_LIMIT);
    } catch (fetchError) {
      setHasMore(false);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load more projects.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, projects.length]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const init = () => {
      timeoutId = setTimeout(() => {
        void loadProjects();
      }, 0);
    };
    init();
    return () => clearTimeout(timeoutId);
  }, [loadProjects]);

  const statusMessage = useMemo(() => {
    if (!error) {
      return null;
    }
    return (
      <div className="rounded-2xl border border-aperture-yellow/40 bg-[#1a1810]/60 px-4 py-3 text-xs text-aperture-yellow">
        {error}
      </div>
    );
  }, [error]);

  return (
    <main className="relative w-full overflow-hidden bg-[#0a0a0c] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(86,204,242,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(86,204,242,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(86,204,242,0.18),transparent_60%)]" />
      <section className="relative min-h-screen px-6 pb-20 pt-24">
        <div className="mx-auto w-full max-w-6xl space-y-12">
          <HeaderTitle />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
            <TechFilters
              activeFilters={activeFilters}
              onToggle={toggleFilter}
              onClear={clearFilters}
            />

            <div className="space-y-6">
              {statusMessage}
              <ProjectsList
                projects={filteredProjects}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                filterKey={filterKey}
                onLoadMore={handleLoadMore}
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
