"use server";

import { getSupabaseClient } from "../../../lib/supabase";
import { safeRedisGet, safeRedisSet, safeRedisKeys, safeRedisDel } from "../../../lib/redis";
import type { HomeCaseOfStudy, HomeService } from "../types";
import { checkAdminAuth } from "../../../lib/admin-auth";
import { revalidatePath } from "next/cache";

const CACHE_KEY_CASES = "home_cases_of_study";
const CACHE_KEY_SERVICES = "home_services";
const CACHE_TTL = 3600;

export const fetchCasesOfStudy = async (): Promise<HomeCaseOfStudy[]> => {
    const cached = await safeRedisGet(CACHE_KEY_CASES);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch {
            // continuar a DB
        }
    }

    const client = getSupabaseClient();
    const { data, error } = await client.from("home_cases_of_study").select("*").order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching home cases of study from Supabase:", error);
        return [];
    }

    await safeRedisSet(CACHE_KEY_CASES, CACHE_TTL, JSON.stringify(data));
    return data as HomeCaseOfStudy[];
};

export const fetchHomeServices = async (): Promise<HomeService[]> => {
    const cached = await safeRedisGet(CACHE_KEY_SERVICES);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch {
            // continuar a DB
        }
    }

    const client = getSupabaseClient();
    const { data, error } = await client.from("home_services").select("*").order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching home services from Supabase:", error);
        return [];
    }

    await safeRedisSet(CACHE_KEY_SERVICES, CACHE_TTL, JSON.stringify(data));
    return data as HomeService[];
};

const invalidateHomeCache = async () => {
    const keys = await safeRedisKeys("home_*");
    if (keys.length > 0) {
        await safeRedisDel(...keys);
    }
    try {
        revalidatePath("/");
        revalidatePath("/admin/actions/home");
    } catch {
        // En entornos de testing unitario sin contexto de Next.js
    }
};

export const addCaseOfStudy = async (item: Omit<HomeCaseOfStudy, "id"> & { id?: string | number }) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("home_cases_of_study").insert(item);
    if (error) throw new Error(error.message);
    await invalidateHomeCache();
};

export const updateCaseOfStudy = async (id: string | number, updates: Partial<HomeCaseOfStudy>) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("home_cases_of_study").update(updates).eq("id", id);
    if (error) throw new Error(error.message);
    await invalidateHomeCache();
};

export const deleteCaseOfStudy = async (id: string | number) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("home_cases_of_study").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await invalidateHomeCache();
};

export const addHomeService = async (item: Omit<HomeService, "id">) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("home_services").insert(item);
    if (error) throw new Error(error.message);
    await invalidateHomeCache();
};

export const updateHomeService = async (id: string | number, updates: Partial<HomeService>) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("home_services").update(updates).eq("id", id);
    if (error) throw new Error(error.message);
    await invalidateHomeCache();
};

export const deleteHomeService = async (id: string | number) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("home_services").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await invalidateHomeCache();
};

