"use server";

import { getSupabaseClient } from "../../../lib/supabase";
import { safeRedisGet, safeRedisSet, safeRedisKeys, safeRedisDel } from "../../../lib/redis";
import type { BlogArticle, BlogSortOrder } from "../types";
import { checkAdminAuth } from "../../../lib/admin-auth";
import { revalidatePath } from "next/cache";

export type BlogArticleRecord = {
	id: string;
	date: string;
	title: string;
	description: string;
	thumbnail: string;
	tags: string[];
	content: string;
	is_featured: boolean;
};

export type BlogQuery = {
	tag?: string;
	order?: BlogSortOrder;
	query?: string;
	limit?: number;
	featuredOnly?: boolean;
};

const CACHE_KEY_PREFIX = "blog_articles:";
const CACHE_TTL = 3600; // 1 hour

const mapRecordToArticle = (record: BlogArticleRecord): BlogArticle => ({
	id: record.id,
	date: record.date,
	title: record.title,
	description: record.description,
	thumbnail: record.thumbnail,
	tags: record.tags,
	content: record.content,
});

export const fetchArticles = async (query?: BlogQuery): Promise<BlogArticle[]> => {
	const cacheKey = `${CACHE_KEY_PREFIX}${JSON.stringify(query || {})}`;
	const cached = await safeRedisGet(cacheKey);

	if (cached) {
		try { return JSON.parse(cached); } catch {}
	}

	const client = getSupabaseClient();
	let supabaseQuery = client.from("blog_articles").select("*");

	if (query?.featuredOnly) {
		supabaseQuery = supabaseQuery.eq("is_featured", true);
	}
	if (query?.tag && query.tag !== "all") {
		supabaseQuery = supabaseQuery.contains("tags", [query.tag]);
	}
	if (query?.query) {
		supabaseQuery = supabaseQuery.ilike("title", `%${query.query}%`);
	}

	if (query?.order === "oldest") {
		supabaseQuery = supabaseQuery.order("date", { ascending: true });
	} else if (query?.order === "az") {
		supabaseQuery = supabaseQuery.order("title", { ascending: true });
	} else {
		supabaseQuery = supabaseQuery.order("date", { ascending: false });
	}

	if (query?.limit) {
		supabaseQuery = supabaseQuery.limit(query.limit);
	}

	const { data, error } = await supabaseQuery;

	if (error) {
		console.error("Error fetching blog articles from Supabase:", error);
		return [];
	}

	const articles = (data as BlogArticleRecord[]).map(mapRecordToArticle);

	await safeRedisSet(cacheKey, CACHE_TTL, JSON.stringify(articles));

	return articles;
};

const invalidateBlogCache = async () => {
	const keys = await safeRedisKeys(`${CACHE_KEY_PREFIX}*`);
	if (keys.length > 0) {
		await safeRedisDel(...keys);
	}
	try {
		revalidatePath("/blog");
	} catch {
		// En entornos de testing unitario sin contexto de Next.js
	}
};

export const addArticle = async (article: BlogArticleRecord) => {
	await checkAdminAuth();
	const client = getSupabaseClient();
	const { error } = await client.from("blog_articles").insert(article);
	if (error) throw new Error(error.message);
	await invalidateBlogCache();
};

export const updateArticle = async (id: string, updates: Partial<BlogArticleRecord>) => {
	await checkAdminAuth();
	const client = getSupabaseClient();
	const { error } = await client.from("blog_articles").update(updates).eq("id", id);
	if (error) throw new Error(error.message);
	await invalidateBlogCache();
};

export const deleteArticle = async (id: string) => {
	await checkAdminAuth();
	const client = getSupabaseClient();
	const { error } = await client.from("blog_articles").delete().eq("id", id);
	if (error) throw new Error(error.message);
	await invalidateBlogCache();
};

export const getArticleById = async (id: string): Promise<BlogArticle | null> => {
	const articles = await fetchArticles();
	return articles.find((a) => a.id === id) ?? null;
};
