import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, playlists, songs, InsertPlaylist, InsertSong, spotifyTokens, InsertSpotifyToken } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createPlaylist(playlist: InsertPlaylist) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(playlists).values(playlist);
  return Number(result[0].insertId);
}

export async function getUserPlaylists(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(playlists).where(eq(playlists.userId, userId));
}

export async function getPlaylistById(playlistId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(playlists).where(eq(playlists.id, playlistId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function addSongToPlaylist(song: InsertSong) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(songs).values(song);
  return Number(result[0].insertId);
}

export async function getPlaylistSongs(playlistId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(songs).where(eq(songs.playlistId, playlistId));
}

export async function deletePlaylist(playlistId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(songs).where(eq(songs.playlistId, playlistId));
  await db.delete(playlists).where(eq(playlists.id, playlistId));
}

export async function upsertSpotifyToken(token: InsertSpotifyToken) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(spotifyTokens).values(token).onDuplicateKeyUpdate({
    set: {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: token.expiresAt,
    },
  });
}

export async function getSpotifyToken(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(spotifyTokens).where(eq(spotifyTokens.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteSpotifyToken(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(spotifyTokens).where(eq(spotifyTokens.userId, userId));
}

export async function updatePlaylistExport(
  playlistId: number,
  exportData: { exportedAt: Date; spotifyPlaylistId: string; spotifyPlaylistUrl: string }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(playlists)
    .set(exportData)
    .where(eq(playlists.id, playlistId));
}

export async function updatePlaylistVisibility(
  playlistId: number,
  userId: number,
  visibility: "private" | "public"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verify ownership
  const playlist = await getPlaylistById(playlistId);
  if (!playlist || playlist.userId !== userId) {
    throw new Error("Playlist not found or unauthorized");
  }
  
  // Generate share token if making public and doesn't exist
  const updates: any = { visibility };
  if (visibility === "public" && !playlist.shareToken) {
    const { nanoid } = await import('nanoid');
    updates.shareToken = nanoid(32);
  }
  
  await db
    .update(playlists)
    .set(updates)
    .where(eq(playlists.id, playlistId));
  
  return updates.shareToken || playlist.shareToken;
}

export async function updatePlaylistDislikeSetting(
  playlistId: number,
  userId: number,
  allowDislikes: boolean
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verify ownership
  const playlist = await getPlaylistById(playlistId);
  if (!playlist || playlist.userId !== userId) {
    throw new Error("Playlist not found or unauthorized");
  }
  
  await db
    .update(playlists)
    .set({ allowDislikes: allowDislikes ? 1 : 0 })
    .where(eq(playlists.id, playlistId));
}

export async function getPublicPlaylists(limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .select({
      id: playlists.id,
      name: playlists.name,
      service: playlists.service,
      createdAt: playlists.createdAt,
      views: playlists.views,
      likes: playlists.likes,
      shareToken: playlists.shareToken,
      userId: playlists.userId,
      userName: users.name,
    })
    .from(playlists)
    .leftJoin(users, eq(playlists.userId, users.id))
    .where(eq(playlists.visibility, "public"))
    .orderBy(playlists.createdAt)
    .limit(limit);
  
  return result;
}

export async function getPlaylistByShareToken(shareToken: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .select({
      id: playlists.id,
      name: playlists.name,
      service: playlists.service,
      createdAt: playlists.createdAt,
      views: playlists.views,
      likes: playlists.likes,
      userId: playlists.userId,
      userName: users.name,
      visibility: playlists.visibility,
    })
    .from(playlists)
    .leftJoin(users, eq(playlists.userId, users.id))
    .where(eq(playlists.shareToken, shareToken))
    .limit(1);
  
  if (result.length === 0) return undefined;
  
  // Increment view count
  await db
    .update(playlists)
    .set({ views: result[0].views + 1 })
    .where(eq(playlists.shareToken, shareToken));
  
  return result[0];
}

export async function getTrendingPlaylists(limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .select({
      id: playlists.id,
      name: playlists.name,
      service: playlists.service,
      createdAt: playlists.createdAt,
      views: playlists.views,
      likes: playlists.likes,
      shareToken: playlists.shareToken,
      userId: playlists.userId,
      userName: users.name,
      genre: playlists.genre,
      mood: playlists.mood,
    })
    .from(playlists)
    .leftJoin(users, eq(playlists.userId, users.id))
    .where(eq(playlists.visibility, "public"))
    .orderBy(playlists.views, playlists.likes)
    .limit(limit);
  
  return result;
}

export async function getFilteredPlaylists(filters: {
  genre?: string;
  mood?: string;
  search?: string;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  let query = db
    .select({
      id: playlists.id,
      name: playlists.name,
      service: playlists.service,
      createdAt: playlists.createdAt,
      views: playlists.views,
      likes: playlists.likes,
      shareToken: playlists.shareToken,
      userId: playlists.userId,
      userName: users.name,
      genre: playlists.genre,
      mood: playlists.mood,
    })
    .from(playlists)
    .leftJoin(users, eq(playlists.userId, users.id))
    .where(eq(playlists.visibility, "public"));
  
  // Note: Drizzle doesn't support dynamic where clauses easily
  // For now, return all public playlists and filter in memory
  const result = await query.orderBy(playlists.views).limit(filters.limit || 50);
  
  // Apply filters in memory
  let filtered = result;
  
  if (filters.genre) {
    filtered = filtered.filter(p => p.genre?.toLowerCase() === filters.genre?.toLowerCase());
  }
  
  if (filters.mood) {
    filtered = filtered.filter(p => p.mood?.toLowerCase() === filters.mood?.toLowerCase());
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.userName?.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
}

export async function clonePlaylist(
  sourcePlaylistId: number,
  userId: number,
  newName: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get source playlist
  const sourcePlaylist = await getPlaylistById(sourcePlaylistId);
  if (!sourcePlaylist) {
    throw new Error("Source playlist not found");
  }
  
  // Create new playlist
  const result = await db.insert(playlists).values({
    userId,
    name: newName,
    service: sourcePlaylist.service,
    genre: sourcePlaylist.genre,
    mood: sourcePlaylist.mood,
  });
  
  const newPlaylistId = Number(result[0].insertId);
  
  // Copy songs
  const sourceSongs = await getPlaylistSongs(sourcePlaylistId);
  if (sourceSongs.length > 0) {
    await db.insert(songs).values(
      sourceSongs.map(song => ({
        playlistId: newPlaylistId,
        title: song.title,
        artist: song.artist,
        externalId: song.externalId,
        previewUrl: song.previewUrl,
        albumArt: song.albumArt,
        service: song.service,
        isGenerated: 0,
      }))
    );
  }
  
  return newPlaylistId;
}
