"use server";

import { getSupabaseClient } from "../../../lib/supabase";
import { safeRedisGet, safeRedisSet, safeRedisKeys, safeRedisDel } from "../../../lib/redis";
import { checkAdminAuth } from "../../../lib/admin-auth";
import { deleteStorageAsset } from "../../../app/actions/storage-actions";
import { revalidatePath } from "next/cache";
import type {
    Technology,
    Topic,
    NivelPublicacion,
    EducationDetails,
    ProjectDetails,
    ProfessionalExpDetails,
    PublicationResponsibility,
    PublicationAchievement,
    FullPublication,
    EducationPublication,
    ProjectPublication,
    ExperiencePublication,
    PublicationType,
} from "../types";

const CACHE_KEY_PUBLICATIONS = "trayectory_publications";
const CACHE_KEY_TECHNOLOGIES = "trayectory_technologies";
const CACHE_KEY_TOPICS = "trayectory_topics";
const CACHE_TTL = 3600;

const invalidateTrayectoryCache = async () => {
    const keys = await safeRedisKeys("trayectory_*");
    if (keys.length > 0) {
        await safeRedisDel(...keys);
    }
    try {
        revalidatePath("/experience");
        revalidatePath("/admin/actions/experience");
    } catch {
        // En entornos de testing unitario sin contexto de Next.js
    }
};

// =============================================================================
// Technologies Catalog CRUD
// =============================================================================

export const fetchTechnologies = async (): Promise<Technology[]> => {
    const cached = await safeRedisGet(CACHE_KEY_TECHNOLOGIES);
    if (cached) {
        try { return JSON.parse(cached); } catch {}
    }

    const client = getSupabaseClient();
    const { data, error } = await client
        .from("technologies")
        .select("*")
        .order("sector", { ascending: true })
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching technologies from Supabase:", error);
        return [];
    }

    await safeRedisSet(CACHE_KEY_TECHNOLOGIES, CACHE_TTL, JSON.stringify(data));
    return data as Technology[];
};

export const addTechnology = async (tech: { name: string; icon?: string; sector: string }) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { data, error } = await client
        .from("technologies")
        .insert({ ...tech, is_predefined: false })
        .select()
        .single();
    if (error) throw new Error(error.message);
    await invalidateTrayectoryCache();
    return data as Technology;
};

export const deleteTechnology = async (id: string | number) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("technologies").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await invalidateTrayectoryCache();
};

// =============================================================================
// Topics Catalog CRUD
// =============================================================================

export const fetchTopics = async (): Promise<Topic[]> => {
    const cached = await safeRedisGet(CACHE_KEY_TOPICS);
    if (cached) {
        try { return JSON.parse(cached); } catch {}
    }

    const client = getSupabaseClient();
    const { data, error } = await client
        .from("topics")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching topics from Supabase:", error);
        return [];
    }

    await safeRedisSet(CACHE_KEY_TOPICS, CACHE_TTL, JSON.stringify(data));
    return data as Topic[];
};

export const addTopic = async (name: string) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { data, error } = await client
        .from("topics")
        .insert({ name, is_predefined: false })
        .select()
        .single();
    if (error) throw new Error(error.message);
    await invalidateTrayectoryCache();
    return data as Topic;
};

export const deleteTopic = async (id: string | number) => {
    await checkAdminAuth();
    const client = getSupabaseClient();
    const { error } = await client.from("topics").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await invalidateTrayectoryCache();
};

// =============================================================================
// NivelPublicacion CRUD
// =============================================================================

export const fetchPublicaciones = async (): Promise<FullPublication[]> => {
    const cached = await safeRedisGet(CACHE_KEY_PUBLICATIONS);
    if (cached) {
        try { return JSON.parse(cached); } catch {}
    }

    const client = getSupabaseClient();

    // Fetch base publications
    const { data: pubs, error: pubsError } = await client
        .from("nivel_publicacion")
        .select("*")
        .order("order_index", { ascending: true });

    if (pubsError) {
        console.error("Error fetching publicaciones:", pubsError);
        return [];
    }
    if (!pubs || pubs.length === 0) return [];

    const pubIds = pubs.map((p: NivelPublicacion) => p.id);

    // Fetch all related data in parallel
    const [
        { data: eduDetails },
        { data: projDetails },
        { data: expDetails },
        { data: responsibilities },
        { data: achievements },
        { data: techJunctions },
        { data: topicJunctions },
    ] = await Promise.all([
        client.from("education_details").select("*").in("publicacion_id", pubIds),
        client.from("project_details").select("*").in("publicacion_id", pubIds),
        client.from("professional_exp_details").select("*").in("publicacion_id", pubIds),
        client.from("publication_responsibilities").select("*").in("publicacion_id", pubIds).order("order_index"),
        client.from("publication_achievements").select("*").in("publicacion_id", pubIds).order("order_index"),
        client.from("nivel_publicacion_technologies").select("publicacion_id, technologies(*)").in("publicacion_id", pubIds),
        client.from("nivel_publicacion_topics").select("publicacion_id, topics(*)").in("publicacion_id", pubIds),
    ]);

    // Build tech/topic maps
    const techMap = new Map<string, Technology[]>();
    const topicMap = new Map<string, Topic[]>();

    (techJunctions ?? []).forEach((j: Record<string, unknown>) => {
        const pubId = String(j.publicacion_id);
        if (!techMap.has(pubId)) techMap.set(pubId, []);
        if (j.technologies) techMap.get(pubId)!.push(j.technologies as Technology);
    });

    (topicJunctions ?? []).forEach((j: Record<string, unknown>) => {
        const pubId = String(j.publicacion_id);
        if (!topicMap.has(pubId)) topicMap.set(pubId, []);
        if (j.topics) topicMap.get(pubId)!.push(j.topics as Topic);
    });

    // Assemble full publications
    const result: FullPublication[] = pubs.map((pub: NivelPublicacion) => {
        const key = String(pub.id);
        const base = {
            ...pub,
            technologies: techMap.get(key) ?? [],
            topics: topicMap.get(key) ?? [],
        };

        if (pub.type === "EDUCATION") {
            const detail = (eduDetails ?? []).find((d: EducationDetails) => String(d.publicacion_id) === key);
            return { ...base, details: detail ?? {} } as EducationPublication;
        }
        if (pub.type === "PROJECT") {
            const detail = (projDetails ?? []).find((d: ProjectDetails) => String(d.publicacion_id) === key);
            return { ...base, details: detail ?? {} } as ProjectPublication;
        }
        // EXPERIENCE
        const detail = (expDetails ?? []).find((d: ProfessionalExpDetails) => String(d.publicacion_id) === key);
        const pubResponsibilities = (responsibilities ?? []).filter(
            (r: PublicationResponsibility) => String(r.publicacion_id) === key
        );
        const pubAchievements = (achievements ?? []).filter(
            (a: PublicationAchievement) => String(a.publicacion_id) === key
        );
        return {
            ...base,
            details: detail ?? {},
            responsibilities: pubResponsibilities,
            achievements: pubAchievements,
        } as ExperiencePublication;
    });

    await safeRedisSet(CACHE_KEY_PUBLICATIONS, CACHE_TTL, JSON.stringify(result));
    return result;
};

export const addPublicacion = async (
    type: PublicationType,
    baseData: Omit<NivelPublicacion, "id" | "technologies" | "topics">,
    details: Record<string, unknown>,
    techIds: (string | number)[],
    topicIds: (string | number)[],
    responsibilities?: string[],
    achievements?: string[],
) => {
    await checkAdminAuth();
    const client = getSupabaseClient();

    // Insert base publication
    const { data: pub, error: pubError } = await client
        .from("nivel_publicacion")
        .insert(baseData)
        .select()
        .single();
    if (pubError) throw new Error(pubError.message);

    const pubId = pub.id;

    // Insert type-specific details
    const detailTable =
        type === "EDUCATION" ? "education_details" :
        type === "PROJECT" ? "project_details" :
        "professional_exp_details";

    const { error: detailError } = await client
        .from(detailTable)
        .insert({ ...details, publicacion_id: pubId });
    if (detailError) throw new Error(detailError.message);

    // Insert responsibilities (Experience only)
    if (type === "EXPERIENCE" && responsibilities && responsibilities.length > 0) {
        const respRows = responsibilities.map((content, i) => ({
            publicacion_id: pubId,
            content,
            order_index: i + 1,
        }));
        const { error: respError } = await client.from("publication_responsibilities").insert(respRows);
        if (respError) throw new Error(respError.message);
    }

    // Insert achievements (Experience only)
    if (type === "EXPERIENCE" && achievements && achievements.length > 0) {
        const achRows = achievements.map((content, i) => ({
            publicacion_id: pubId,
            content,
            order_index: i + 1,
        }));
        const { error: achError } = await client.from("publication_achievements").insert(achRows);
        if (achError) throw new Error(achError.message);
    }

    // Insert technology junctions
    if (techIds.length > 0) {
        const techRows = techIds.map((tid) => ({ publicacion_id: pubId, technology_id: tid }));
        const { error: techError } = await client.from("nivel_publicacion_technologies").insert(techRows);
        if (techError) throw new Error(techError.message);
    }

    // Insert topic junctions
    if (topicIds.length > 0) {
        const topicRows = topicIds.map((tid) => ({ publicacion_id: pubId, topic_id: tid }));
        const { error: topicError } = await client.from("nivel_publicacion_topics").insert(topicRows);
        if (topicError) throw new Error(topicError.message);
    }

    await invalidateTrayectoryCache();
};

export const updatePublicacion = async (
    id: string | number,
    type: PublicationType,
    baseData: Partial<NivelPublicacion>,
    details: Record<string, unknown>,
    techIds: (string | number)[],
    topicIds: (string | number)[],
    responsibilities?: string[],
    achievements?: string[],
) => {
    await checkAdminAuth();
    const client = getSupabaseClient();

    // Update base publication
    const { error: pubError } = await client
        .from("nivel_publicacion")
        .update(baseData)
        .eq("id", id);
    if (pubError) throw new Error(pubError.message);

    // Update type-specific details
    const detailTable =
        type === "EDUCATION" ? "education_details" :
        type === "PROJECT" ? "project_details" :
        "professional_exp_details";

    const { error: detailError } = await client
        .from(detailTable)
        .update(details)
        .eq("publicacion_id", id);
    if (detailError) throw new Error(detailError.message);

    // Replace responsibilities (Experience only)
    if (type === "EXPERIENCE" && responsibilities) {
        await client.from("publication_responsibilities").delete().eq("publicacion_id", id);
        if (responsibilities.length > 0) {
            const respRows = responsibilities.map((content, i) => ({
                publicacion_id: id,
                content,
                order_index: i + 1,
            }));
            const { error: respError } = await client.from("publication_responsibilities").insert(respRows);
            if (respError) throw new Error(respError.message);
        }
    }

    // Replace achievements (Experience only)
    if (type === "EXPERIENCE" && achievements) {
        await client.from("publication_achievements").delete().eq("publicacion_id", id);
        if (achievements.length > 0) {
            const achRows = achievements.map((content, i) => ({
                publicacion_id: id,
                content,
                order_index: i + 1,
            }));
            const { error: achError } = await client.from("publication_achievements").insert(achRows);
            if (achError) throw new Error(achError.message);
        }
    }

    // Replace technology junctions
    await client.from("nivel_publicacion_technologies").delete().eq("publicacion_id", id);
    if (techIds.length > 0) {
        const techRows = techIds.map((tid) => ({ publicacion_id: id, technology_id: tid }));
        const { error: techError } = await client.from("nivel_publicacion_technologies").insert(techRows);
        if (techError) throw new Error(techError.message);
    }

    // Replace topic junctions
    await client.from("nivel_publicacion_topics").delete().eq("publicacion_id", id);
    if (topicIds.length > 0) {
        const topicRows = topicIds.map((tid) => ({ publicacion_id: id, topic_id: tid }));
        const { error: topicError } = await client.from("nivel_publicacion_topics").insert(topicRows);
        if (topicError) throw new Error(topicError.message);
    }

    await invalidateTrayectoryCache();
};

export const deletePublicacion = async (id: string | number, imagePath?: string) => {
    await checkAdminAuth();
    const client = getSupabaseClient();

    // Delete image from storage if exists
    if (imagePath) {
        try {
            await deleteStorageAsset(imagePath);
        } catch (error) {
            console.error("Failed to delete storage asset:", error);
        }
    }

    // Cascade delete will handle details, junctions, responsibilities, achievements
    const { error } = await client.from("nivel_publicacion").delete().eq("id", id);
    if (error) throw new Error(error.message);

    await invalidateTrayectoryCache();
};
