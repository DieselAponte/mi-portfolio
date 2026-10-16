"use server";

import { getSupabaseClient } from "../../../lib/supabase";
import { safeRedisGet, safeRedisSet, safeRedisKeys, safeRedisDel } from "../../../lib/redis";
import type { Project } from "../types";
import { checkAdminAuth } from "../../../lib/admin-auth";
import { revalidatePath } from "next/cache";

export type ProjectRecord = {
	id: string | number;
	title: string;
	description: string;
	date: string;
	tech_stack: string[];
	github_url: string;
	image_url: string;
	live_demo_url?: string;
	problem_statement?: string;
	solution_statement?: string;
	target_users?: string[];
	value_proposition?: string;
	technical_decisions?: string;
	key_challenge?: string;
	challenges_faced?: string;
	measurable_results?: string;
	technical_learnings?: string;
	next_steps?: string;
};

export type ProjectsQuery = {
	limit?: number;
	offset?: number;
	techStack?: string[];
};

const CACHE_KEY_PREFIX = "projects:";
const CACHE_TTL = 3600;

const mapRecordToProject = (record: ProjectRecord): Project => ({
	id: record.id,
	title: record.title,
	description: record.description,
	date: record.date,
	tech_stack: record.tech_stack ?? [],
	github_url: record.github_url,
	image_url: record.image_url,
	live_demo_url: record.live_demo_url ?? "",
	problem_statement: record.problem_statement ?? "",
	solution_statement: record.solution_statement ?? "",
	target_users: record.target_users ?? [],
	value_proposition: record.value_proposition ?? "",
	technical_decisions: record.technical_decisions ?? "",
	key_challenge: record.key_challenge ?? "",
	challenges_faced: record.challenges_faced ?? "",
	measurable_results: record.measurable_results ?? "",
	technical_learnings: record.technical_learnings ?? "",
	next_steps: record.next_steps ?? "",
});

export const fetchProjects = async (query?: ProjectsQuery): Promise<Project[]> => {
	const cacheKey = `${CACHE_KEY_PREFIX}${JSON.stringify(query || {})}`;
	const cached = await safeRedisGet(cacheKey);

	if (cached) {
		try {
			return JSON.parse(cached);
		} catch {
			// si el json está corrupto, continúa a DB
		}
	}

	const client = getSupabaseClient();
	let supabaseQuery = client.from("projects").select("*").order("date", { ascending: false });

	if (query?.limit) {
		supabaseQuery = supabaseQuery.limit(query.limit);
	}
	if (query?.offset) {
		supabaseQuery = supabaseQuery.range(query.offset, query.offset + (query.limit || 4) - 1);
	}
	if (query?.techStack && query.techStack.length > 0) {
		supabaseQuery = supabaseQuery.contains("tech_stack", query.techStack);
	}

	const { data, error } = await supabaseQuery;

	if (error) {
		console.error("Error fetching projects from Supabase:", error);
		return [];
	}

	const projects = (data as ProjectRecord[]).map(mapRecordToProject);

	await safeRedisSet(cacheKey, CACHE_TTL, JSON.stringify(projects));

	return projects;
};

export const getProjectById = async (id: string | number): Promise<Project | null> => {
	const client = getSupabaseClient();
	const { data, error } = await client
		.from("projects")
		.select("*")
		.eq("id", id)
		.single();

	if (error || !data) {
		return null;
	}

	return mapRecordToProject(data as ProjectRecord);
};

const invalidateProjectsCache = async (id?: string | number) => {
	const keys = await safeRedisKeys(`${CACHE_KEY_PREFIX}*`);
	if (keys.length > 0) {
		await safeRedisDel(...keys);
	}
	try {
		revalidatePath("/projects");
		if (id) {
			revalidatePath(`/projects/${id}`);
		}
	} catch {
		// En entornos de testing unitario sin contexto de Next.js
	}
};

export const addProject = async (project: Omit<ProjectRecord, "id"> & { id?: string | number }) => {
	await checkAdminAuth();
	const client = getSupabaseClient();
	const { data, error } = await client.from("projects").insert(project).select().single();
	if (error) throw new Error(error.message);
	await invalidateProjectsCache(data?.id);
	return data;
};

export const updateProject = async (id: string | number, updates: Partial<ProjectRecord>) => {
	await checkAdminAuth();
	const client = getSupabaseClient();
	const { error } = await client.from("projects").update(updates).eq("id", id);
	if (error) throw new Error(error.message);
	await invalidateProjectsCache(id);
};

export const deleteProject = async (id: string | number) => {
	await checkAdminAuth();
	const client = getSupabaseClient();
	const { error } = await client.from("projects").delete().eq("id", id);
	if (error) throw new Error(error.message);
	await invalidateProjectsCache(id);
};

