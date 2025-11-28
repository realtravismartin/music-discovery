import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const playlists = mysqlTable("playlists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  service: mysqlEnum("service", ["spotify", "itunes"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  exportedAt: timestamp("exportedAt"),
  spotifyPlaylistId: varchar("spotifyPlaylistId", { length: 255 }),
  spotifyPlaylistUrl: text("spotifyPlaylistUrl"),
  visibility: mysqlEnum("visibility", ["private", "public"]).default("private").notNull(),
  shareToken: varchar("shareToken", { length: 64 }),
  views: int("views").default(0).notNull(),
  likes: int("likes").default(0).notNull(),
  allowDislikes: int("allowDislikes").default(0).notNull(), // 0 = false, 1 = true (boolean in MySQL)
  dislikes: int("dislikes").default(0).notNull(),
  genre: varchar("genre", { length: 100 }),
  mood: varchar("mood", { length: 100 }),
});

export const songs = mysqlTable("songs", {
  id: int("id").autoincrement().primaryKey(),
  playlistId: int("playlistId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }).notNull(),
  externalId: varchar("externalId", { length: 255 }),
  previewUrl: text("previewUrl"),
  albumArt: text("albumArt"),
  service: mysqlEnum("service", ["spotify", "itunes"]).notNull(),
  isGenerated: int("isGenerated").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = typeof playlists.$inferInsert;
export type Song = typeof songs.$inferSelect;
export type InsertSong = typeof songs.$inferInsert;

export const spotifyTokens = mysqlTable("spotifyTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  accessToken: text("accessToken").notNull(),
  refreshToken: text("refreshToken").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SpotifyToken = typeof spotifyTokens.$inferSelect;
export type InsertSpotifyToken = typeof spotifyTokens.$inferInsert;