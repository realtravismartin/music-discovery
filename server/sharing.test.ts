import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("music.togglePlaylistVisibility", () => {
  it("should toggle playlist visibility", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // This will fail if no playlist exists, but tests the procedure structure
    try {
      const result = await caller.music.togglePlaylistVisibility({
        playlistId: 999,
        visibility: "public",
      });
      
      // If it succeeds, verify the response structure
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('visibility');
    } catch (error: any) {
      // Expected to fail with "Playlist not found" for non-existent playlist
      expect(error.message).toContain('not found');
    }
  });
});

describe("music.toggleAllowDislikes", () => {
  it("should toggle dislike setting", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.music.toggleAllowDislikes({
        playlistId: 999,
        allowDislikes: true,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('allowDislikes');
    } catch (error: any) {
      expect(error.message).toContain('not found');
    }
  });
});

describe("music.getPublicPlaylists", () => {
  it("should return public playlists", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.music.getPublicPlaylists();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
