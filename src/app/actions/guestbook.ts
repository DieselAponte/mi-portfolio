"use server";

import { createClient } from "@supabase/supabase-js";
import { requireServerSession } from "../../lib/auth-server";
import type { GuestbookNoteInsert, GuestbookNote } from "../../features/guestbook/types";

const sanitizeValue = (value?: string | null) => {
	if (value === "$undefined" || value === "undefined" || value === "") {
		return null;
	}
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
};

export async function createGuestbookNoteAction(
	note: Omit<GuestbookNoteInsert, "user_id" | "author" | "email" | "avatar_url">
): Promise<GuestbookNote> {
    const sessionData = await requireServerSession();
    
    // We need service_role key to bypass RLS since the client won't have the Supabase Auth JWT
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Supabase is not properly configured for server actions.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    });

    const payload: GuestbookNoteInsert = {
        author: sessionData.user.name.trim(),
        message: note.message.trim(),
        email: sessionData.user.email,
        site_url: sanitizeValue(note.site_url),
        github_url: sanitizeValue(note.github_url),
        avatar_url: sessionData.user.image || null,
        user_id: sessionData.user.id,
    };

    const { data, error } = await supabase
        .from("guestbook_notes")
        .insert([payload] as any)
        .select("id,author,message,email,site_url,github_url,avatar_url,created_at,user_id")
        .single();

    if (error) {
        throw new Error(`Failed to create guestbook note: ${error.message}`);
    }

    if (!data) {
        throw new Error("Supabase insert returned no data.");
    }

    return data as GuestbookNote;
}
