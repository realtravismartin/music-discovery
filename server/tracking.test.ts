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

describe("music.getPlaylistSongsWithPopularity", () => {
  it("should return songs with popularity data", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // This will return empty array or songs depending on test data
    const result = await caller.music.getPlaylistSongsWithPopularity({ playlistId: 1 });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // Each song should have a popularity field
    result.forEach(song => {
      expect(song).toHaveProperty('popularity');
      expect(typeof song.popularity).toBe('number');
    });
  });
});

describe("music.getMyPlaylists", () => {
  it("should return playlists with export tracking fields", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.music.getMyPlaylists();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // Playlists should have export tracking fields
    result.forEach(playlist => {
      expect(playlist).toHaveProperty('exportedAt');
      expect(playlist).toHaveProperty('spotifyPlaylistId');
      expect(playlist).toHaveProperty('spotifyPlaylistUrl');
    });
  });
});
