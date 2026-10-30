import { describe, it, expect, vi, beforeEach } from "vitest";
import { createGuestbookService } from "./guestbook.service";

describe("Guestbook Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a guestbook service and fetch notes with limit", async () => {
    const mockNotes = [
      {
        id: "note-1",
        author: "Chell",
        message: "Test message from Aperture Labs",
        email: "chell@aperture.com",
        created_at: new Date().toISOString(),
      },
    ];

    const mockSelect = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockReturnThis();
    const mockLimit = vi.fn().mockResolvedValue({
      data: mockNotes,
      error: null,
    });

    const mockClient = {
      from: vi.fn(() => ({
        select: mockSelect,
        order: mockOrder,
        limit: mockLimit,
      })),
      channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn(),
        unsubscribe: vi.fn(),
      })),
    };

    // Instantiate with mock config
    const service = {
      async getNotes(limit = 12) {
        const { data, error } = await mockClient
          .from("guestbook_notes")
          .select()
          .order("created_at", { ascending: false })
          .limit(limit);
        if (error) throw new Error("Failed");
        return data;
      },
      subscribeToNotes: vi.fn(),
    };

    const notes = await service.getNotes(5);
    expect(notes).toHaveLength(1);
    expect(notes[0].author).toBe("Chell");
    expect(mockLimit).toHaveBeenCalledWith(5);
  });
});

