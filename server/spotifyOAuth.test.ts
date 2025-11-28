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

describe("music.getSpotifyAuthUrl", () => {
  it("should return Spotify authorization URL", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.music.getSpotifyAuthUrl();

    expect(result).toBeDefined();
    expect(result.url).toContain("https://accounts.spotify.com/authorize");
    expect(result.url).toContain("client_id=");
    expect(result.url).toContain("scope=");
  });
});

describe("music.getSpotifyConnectionStatus", () => {
  it("should return connection status", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.music.getSpotifyConnectionStatus();

    expect(result).toBeDefined();
    expect(typeof result.connected).toBe("boolean");
  });
});
