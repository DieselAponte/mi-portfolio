import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogArticle } from "../../types";

type ArticleCardProps = {
	article: BlogArticle;
};

export const ArticleCard = ({ article }: ArticleCardProps) => {
	return (
		<article className="group relative flex h-full flex-col rounded-2xl border border-aperture-gray/60 bg-[#111218]/70 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:border-aperture-blue/50 hover:shadow-[0_0_25px_rgba(86,204,242,0.1)]">
			<Link href={`/blog/${article.id}`} className="flex flex-1 flex-col">
				<div className="relative h-44 w-full overflow-hidden rounded-2xl border border-aperture-gray/60">
					{article.thumbnail ? (
						<Image
							src={article.thumbnail}
							alt={article.title}
							fill
							sizes="(max-width: 768px) 100vw, 33vw"
							className="object-cover transition duration-500 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-black/50 font-mono text-xs uppercase text-zinc-600">
							Sin portada
						</div>
					)}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

					{article.is_featured && (
						<div className="absolute left-3 top-3 rounded-full border border-aperture-yellow/40 bg-black/70 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-aperture-yellow backdrop-blur-md">
							★ Top Article
						</div>
					)}
				</div>

				<div className="mt-4 flex flex-1 flex-col gap-2">
					<h4 className="text-lg font-bold text-white transition-colors group-hover:text-aperture-blue">
						{article.title}
					</h4>
					<p className="text-sm leading-6 text-zinc-300 line-clamp-3">
						{article.description}
					</p>
				</div>

				<div className="mt-5 inline-flex items-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-white">
					<span className="group-hover:text-aperture-blue transition-colors">
						Leer artículo
					</span>
					<span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-aperture-gray/70 bg-black/40 text-white transition group-hover:border-aperture-blue group-hover:bg-aperture-blue/15 group-hover:text-aperture-blue">
						<ArrowRight className="h-4 w-4" />
					</span>
				</div>
			</Link>
		</article>
	);
};
