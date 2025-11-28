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

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("music.getTrendingPlaylists", () => {
  it("should return trending playlists without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.music.getTrendingPlaylists();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should accept limit parameter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.music.getTrendingPlaylists({ limit: 10 });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(10);
  });
});

describe("music.getFilteredPlaylists", () => {
  it("should return filtered playlists", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.music.getFilteredPlaylists({});

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should accept genre filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.music.getFilteredPlaylists({
      genre: "Pop",
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should accept mood filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.music.getFilteredPlaylists({
      mood: "Upbeat",
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should accept search query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.music.getFilteredPlaylists({
      search: "test",
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("music.clonePlaylist", () => {
  it("should require authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.music.clonePlaylist({
        playlistId: 999,
        newName: "Cloned Playlist",
      })
    ).rejects.toThrow();
  });

  it("should fail for non-existent playlist", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.music.clonePlaylist({
        playlistId: 999999,
        newName: "Cloned Playlist",
      })
    ).rejects.toThrow("Source playlist not found");
  });
});
