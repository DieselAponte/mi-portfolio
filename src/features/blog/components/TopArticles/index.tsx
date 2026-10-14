import type { BlogArticle } from "../../types";
import { ArticleCard } from "../ArticleCard";

type TopArticlesProps = {
	articles: BlogArticle[];
};

export const TopArticles = ({ articles }: TopArticlesProps) => {
	return (
		<section className="relative overflow-hidden rounded-3xl border border-aperture-gray/60 bg-[url('/images/portal-ending.jpg')] bg-cover bg-center">
			<div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/70 to-black/90" />
			<div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,rgba(242,201,76,0.2)_0%,rgba(10,10,12,0)_45%,rgba(10,10,12,0.5)_100%)]" />

			<div className="relative px-6 py-10">
				<div className="text-center">
					<p className="text-xs font-mono uppercase tracking-[0.5em] text-aperture-yellow">
						Exhibition Case
					</p>
					<h3 className="mt-3 text-2xl font-semibold text-aperture-yellow sm:text-3xl">
						Top Articles
					</h3>
				</div>

				{articles.length === 0 ? (
					<p className="mt-8 text-center text-sm text-zinc-300">
						Actualmente no hay artículos destacados disponibles en esta sección.
					</p>
				) : (
					<div className="mt-8 grid gap-6 md:grid-cols-3">
						{articles.map((article) => (
							<ArticleCard key={article.id} article={article} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};
