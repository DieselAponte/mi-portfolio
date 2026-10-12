"use server";

import { getSupabaseClient } from "../../../lib/supabase";
import { safeRedisGet, safeRedisSet, safeRedisKeys, safeRedisDel } from "../../../lib/redis";
import type { TechBubble, ExperienceSlide, TrajectorySectionData, ExperienceCertification, ExperienceCarouselItem } from "../types";
import { checkAdminAuth } from "../../../lib/admin-auth";

const CACHE_KEY_MODULES = "experience_modules";
const CACHE_KEY_SLIDES = "experience_slides";
const CACHE_KEY_BUBBLES = "tech_bubbles";
const CACHE_KEY_CERTS = "experience_certifications";
const CACHE_KEY_CAROUSEL = "experience_carousel_items";
const CACHE_TTL = 3600;

export const fetchModules = async (): Promise<TrajectorySectionData[]> => {
    const cached = await safeRedisGet(CACHE_KEY_MODULES);
    if (cached) {
        try { return JSON.parse(cached); } catch {}
    }

    const client = getSupabaseClient();
    const { data, error } = await client.from("experience_modules").select("*").order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching experience modules from Supabase:", error);
        return [];
    }

    await safeRedisSet(CACHE_KEY_MODULES, CACHE_TTL, JSON.stringify(data));
    return data as TrajectorySectionData[];
};

export const fetchSlides = async (moduleId?: string | number): Promise<ExperienceSlide[]> => {
    const cacheKey = `${CACHE_KEY_SLIDES}${moduleId ? `_${moduleId}` : ''}`;
    const cached = await safeRedisGet(cacheKey);
    if (cached) {
        try { return JSON.parse(cached); } catch {}
    }

    const client = getSupabaseClient();
    let query = client.from("experience_slides").select("*").order("order_index", { ascending: true });
    if (moduleId) {
        query = query.eq("module_id", moduleId);
    }

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching experience slides from Supabase:", error);
        return [];
    }

    await safeRedisSet(cacheKey, CACHE_TTL, JSON.stringify(data));
    return data as ExperienceSlide[];
};

export const fetchTechBubbles = async (moduleId?: string | number): Promise<TechBubble[]> => {
    const cacheKey = `${CACHE_KEY_BUBBLES}${moduleId ? `_${moduleId}` : ''}`;
    const cached = await safeRedisGet(cacheKey);
    if (cached) {
        try { return JSON.parse(cached); } catch {}
    }

    const client = getSupabaseClient();
    let query = client.from("tech_bubbles").select("*");
    if (moduleId) {
        query = query.eq("module_id", moduleId);
    }

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching tech bubbles from Supabase:", error);
        return [];
    }

    await safeRedisSet(cacheKey, CACHE_TTL, JSON.stringify(data));
    return data as TechBubble[];
};

const invalidateExperienceCache = async () => {
    const keys = await safeRedisKeys("experience_*");
    const techKeys = await safeRedisKeys("tech_bubbles*");
    const allKeys = [...keys, ...techKeys];
    if (allKeys.length > 0) {
        await safeRedisDel(...allKeys);
    }
};

// Simplified admin actions for Experience
export const addModule = async (module: TrajectorySectionData) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("experience_modules").insert(module);
    if (error) throw new Error(error.message);
    await invalidateExperienceCache();
};

export const updateModule = async (id: string | number, updates: Partial<TrajectorySectionData>) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("experience_modules").update(updates).eq("id", id);
    if (error) throw new Error(error.message);
    await invalidateExperienceCache();
};

export const deleteModule = async (id: string | number) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("experience_modules").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await invalidateExperienceCache();
};

// =============================================================================
// Certifications CRUD
// =============================================================================

export const fetchCertifications = async (): Promise<ExperienceCertification[]> => {
    const cached = await safeRedisGet(CACHE_KEY_CERTS);
    if (cached) {
        try { return JSON.parse(cached); } catch {}
    }

    const client = getSupabaseClient();
    const { data, error } = await client.from("experience_certifications").select("*").order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching certifications from Supabase:", error);
        return [];
    }

    await safeRedisSet(CACHE_KEY_CERTS, CACHE_TTL, JSON.stringify(data));
    return data as ExperienceCertification[];
};

export const addCertification = async (item: Omit<ExperienceCertification, "id">) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("experience_certifications").insert(item);
    if (error) throw new Error(error.message);
    await invalidateExperienceCache();
};

export const updateCertification = async (id: string | number, updates: Partial<ExperienceCertification>) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("experience_certifications").update(updates).eq("id", id);
    if (error) throw new Error(error.message);
    await invalidateExperienceCache();
};

export const deleteCertification = async (id: string | number) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("experience_certifications").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await invalidateExperienceCache();
};

// =============================================================================
// Carousel Items CRUD
// =============================================================================

export const fetchCarouselItems = async (): Promise<ExperienceCarouselItem[]> => {
    const cached = await safeRedisGet(CACHE_KEY_CAROUSEL);
    if (cached) {
        try { return JSON.parse(cached); } catch {}
    }

    const client = getSupabaseClient();
    const { data, error } = await client.from("experience_carousel_items").select("*").order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching carousel items from Supabase:", error);
        return [];
    }

    await safeRedisSet(CACHE_KEY_CAROUSEL, CACHE_TTL, JSON.stringify(data));
    return data as ExperienceCarouselItem[];
};

export const uploadCarouselImage = async (file: File): Promise<string> => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `carousel-${Date.now()}.${fileExt}`;
    const filePath = `carousel-images/${fileName}`;

    const { error } = await client.storage.from("experience").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
    });
    if (error) throw new Error(error.message);

    const { data: publicUrlData } = client.storage.from("experience").getPublicUrl(filePath);
    return publicUrlData.publicUrl;
};

export const deleteCarouselImage = async (imagePath: string) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const bucketPrefix = "/experience/";
    const idx = imagePath.indexOf(bucketPrefix);
    if (idx === -1) return;
    const storagePath = imagePath.substring(idx + bucketPrefix.length);

    const { error } = await client.storage.from("experience").remove([storagePath]);
    if (error) console.error("Error deleting carousel image:", error);
};

export const addCarouselItem = async (item: Omit<ExperienceCarouselItem, "id">) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("experience_carousel_items").insert(item);
    if (error) throw new Error(error.message);
    await invalidateExperienceCache();
};

export const updateCarouselItem = async (id: string | number, updates: Partial<ExperienceCarouselItem>) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("experience_carousel_items").update(updates).eq("id", id);
    if (error) throw new Error(error.message);
    await invalidateExperienceCache();
};

export const deleteCarouselItem = async (id: string | number) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("experience_carousel_items").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await invalidateExperienceCache();
};

