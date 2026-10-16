import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleById } from "../../../features/blog/services/blog.service";
import { ArticleDetail } from "../../../features/blog/components/ArticleDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) {
    return { title: "Artículo no encontrado | Aperture Archives" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const articleUrl = new URL(`/blog/${article.id}`, siteUrl).toString();
  const imageUrl = article.thumbnail
    ? (article.thumbnail.startsWith("http")
      ? article.thumbnail
      : new URL(article.thumbnail, siteUrl).toString())
    : "";

  return {
    title: `${article.title} | Aperture Archives`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url: articleUrl,
      type: "article",
      images: imageUrl ? [{ url: imageUrl, alt: article.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
};

export default async function BlogArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) {
    notFound();
  }

  return <ArticleDetail article={article} />;
}

