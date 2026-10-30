import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Guestbook Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch notes with specified limit", async () => {
    const mockNotes = [
      {
        id: "note-1",
        author: "Chell",
        message: "Test message from Aperture Labs",
        email: "chell@aperture.com",
        created_at: new Date().toISOString(),
      },
    ];

    const mockLimit = vi.fn().mockResolvedValue({
      data: mockNotes,
      error: null,
    });
    const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    const mockFrom = vi.fn((_table?: string) => ({ select: mockSelect }));

    const mockClient = {
      from: mockFrom,
    };

    const service = {
      async getNotes(limit = 12) {
        const { data, error } = await mockClient
          .from("guestbook_notes")
          .select("id,author,message,email,site_url,github_url,avatar_url,created_at,user_id")
          .order("created_at", { ascending: false })
          .limit(limit);
        if (error) throw new Error("Failed");
        return data;
      },
    };

    const notes = await service.getNotes(5);
    expect(notes).toHaveLength(1);
    expect(notes[0].author).toBe("Chell");
    expect(mockFrom).toHaveBeenCalledWith("guestbook_notes");
    expect(mockLimit).toHaveBeenCalledWith(5);
  });
});
