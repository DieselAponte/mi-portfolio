export type ArticleParagraphBlock = {
	id: string;
	text: string;
	image_url?: string;
	image_position?: "left" | "right";
};

export type BlogArticle = {
	id: string | number;
	date: string;
	title: string;
	description: string;
	thumbnail: string;
	tags: string[];
	content: string;
	is_featured?: boolean;

	// Secciones detalladas (BlogArticleDetail)
	introduction?: string;
	content_blocks?: ArticleParagraphBlock[];
	reflection?: string;
	conclusion?: string;
};

export type BlogSortOrder = "newest" | "oldest" | "az";
