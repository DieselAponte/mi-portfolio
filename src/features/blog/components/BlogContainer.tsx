"use client";

import { useMemo } from "react";
import { Footer } from "../../home/components/Footer";
import { useBlogFilters } from "../hooks/useBlogFilters";
import type { BlogArticle } from "../types";
import { FilterNavigation } from "./FilterNavigation";
import { HeaderTitle } from "./HeaderTitle";
import { ListArticles } from "./ListArticles";
import { TopArticles } from "./TopArticles";
import { BlogImageBackground } from "./BlogImageBackground";

type BlogContainerProps = {
	articles?: BlogArticle[];
	featuredArticles?: BlogArticle[];
};
const fallbackTags = ["all", "tech", "college", "work", "life"];

export default function BlogContainer({
	articles = [],
	featuredArticles = [],
}: BlogContainerProps) {
	const baseArticles = articles;

	const resolvedFeatured = useMemo(() => {
		if (featuredArticles.length > 0) {
			return featuredArticles;
		}

		return baseArticles.slice(0, 3);
	}, [baseArticles, featuredArticles]);

	const listSource = useMemo(() => {
		if (resolvedFeatured.length === 0) {
			return baseArticles;
		}

		const featuredIds = new Set(resolvedFeatured.map((item) => item.id));
		return baseArticles.filter((item) => !featuredIds.has(item.id));
	}, [baseArticles, resolvedFeatured]);

	const {
		filters,
		availableTags,
		filteredArticles,
		setOrder,
		setQuery,
		setTag,
		resetFilters,
	} = useBlogFilters({ articles: listSource });

	const tagOptions =
		availableTags.length > 0 ? ["all", ...availableTags] : fallbackTags;

	return (
		<div className="relative min-h-screen text-white">
			<BlogImageBackground overlayOpacity="bg-[#0a0a0c]/40" imageOpacity="opacity-40" />
			<div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-20">
				<HeaderTitle />

				<div className="mt-10">
					<FilterNavigation
						tags={tagOptions}
						filters={filters}
						onTagChange={setTag}
						onOrderChange={setOrder}
						onQueryChange={setQuery}
						onReset={resetFilters}
					/>
				</div>

				<div className="mt-12">
					<TopArticles articles={resolvedFeatured} />
				</div>

				<div className="mt-12">
					<ListArticles articles={filteredArticles} />
				</div>
			</div>

			<Footer />
		</div>
	);
}
