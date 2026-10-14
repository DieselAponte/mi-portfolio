import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { BlogArticle } from "../../types";

type ListArticlesProps = {
	articles: BlogArticle[];
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

export const ListArticles = ({ articles }: ListArticlesProps) => {
	if (articles.length === 0) {
		return (
			<section className="rounded-2xl border border-aperture-gray/60 bg-aperture-dark/40 px-6 py-8 text-center">
				<p className="text-sm text-zinc-400">Actualmente no hay artículos disponibles que coincidan con la sección o los filtros activos.</p>
			</section>
		);
	}

	return (
		<section className="rounded-3xl border border-aperture-gray/60 bg-aperture-dark/40 px-6 py-8">
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-semibold text-white">Archive Feed</h3>
				<span className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-400">
					Experimental Log
				</span>
			</div>

			<motion.div layout className="mt-8 space-y-5">
				<AnimatePresence mode="popLayout">
					{articles.map((article) => (
						<motion.article
							key={article.id}
							layout
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -12 }}
							transition={{ duration: 0.25 }}
							className="grid gap-6 rounded-2xl border border-aperture-gray/60 bg-[#111218]/70 p-4 md:grid-cols-[120px_200px_1fr] md:items-center"
						>
							<div className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400">
								{formatDate(article.date)}
							</div>

							<div className="relative h-28 w-full overflow-hidden rounded-2xl border border-aperture-gray/60 md:h-24">
								<Image
									src={article.thumbnail}
									alt={article.title}
									fill
									sizes="(max-width: 768px) 100vw, 200px"
									className="object-cover"
								/>
							</div>

							<div className="space-y-2">
								<Link
									href={`/blog/${article.id}`}
									className="text-xl font-semibold text-white hover:text-aperture-yellow"
								>
									{article.title}
								</Link>
								<p className="text-sm leading-6 text-zinc-300">
									{article.description}
								</p>
							</div>
						</motion.article>
					))}
				</AnimatePresence>
			</motion.div>

			<div className="mt-10 flex justify-center">
				<button
					type="button"
					className="flex items-center gap-3 rounded-full border border-aperture-gray/60 bg-black/40 px-6 py-2 text-xs font-mono uppercase tracking-[0.3em] text-white transition hover:border-aperture-yellow hover:text-aperture-yellow"
				>
					See More
					<span className="flex h-8 w-8 items-center justify-center rounded-full border border-aperture-gray/70">
						<ArrowDown className="h-4 w-4" />
					</span>
				</button>
			</div>
		</section>
	);
};
