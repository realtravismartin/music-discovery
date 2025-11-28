import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  music: router({
    searchSpotify: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const { searchSpotifyTrack } = await import('./spotify');
        return await searchSpotifyTrack(input.query);
      }),
    
    searchITunes: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const { searchITunesTrack } = await import('./itunes');
        return await searchITunesTrack(input.query);
      }),
    
    generateSpotifyPlaylist: protectedProcedure
      .input(z.object({ 
        trackIds: z.array(z.string()),
        playlistName: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { getSpotifyRecommendations } = await import('./spotify');
        const { createPlaylist, addSongToPlaylist } = await import('./db');
        
        const recommendations = await getSpotifyRecommendations(input.trackIds);
        
        const playlistId = await createPlaylist({
          userId: ctx.user.id,
          name: input.playlistName,
          service: 'spotify',
        });
        
        for (const track of recommendations) {
          await addSongToPlaylist({
            playlistId: Number(playlistId),
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            externalId: track.id,
            previewUrl: track.preview_url,
            albumArt: track.album.images[0]?.url,
            service: 'spotify',
            isGenerated: 1,
          });
        }
        
        return { playlistId, tracks: recommendations };
      }),
    
    generateITunesPlaylist: protectedProcedure
      .input(z.object({ 
        seedTracks: z.array(z.object({
          trackId: z.number(),
          trackName: z.string(),
          artistName: z.string(),
          collectionName: z.string(),
          artworkUrl100: z.string(),
          previewUrl: z.string(),
          trackViewUrl: z.string(),
          primaryGenreName: z.string(),
        })),
        playlistName: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { getITunesRecommendations } = await import('./itunes');
        const { createPlaylist, addSongToPlaylist } = await import('./db');
        
        const recommendations = await getITunesRecommendations(input.seedTracks);
        
        const playlistId = await createPlaylist({
          userId: ctx.user.id,
          name: input.playlistName,
          service: 'itunes',
        });
        
        for (const track of recommendations) {
          await addSongToPlaylist({
            playlistId: Number(playlistId),
            title: track.trackName,
            artist: track.artistName,
            externalId: String(track.trackId),
            previewUrl: track.previewUrl,
            albumArt: track.artworkUrl100,
            service: 'itunes',
            isGenerated: 1,
          });
        }
        
        return { playlistId, tracks: recommendations };
      }),
    
    getMyPlaylists: protectedProcedure.query(async ({ ctx }) => {
      const { getUserPlaylists } = await import('./db');
      return await getUserPlaylists(ctx.user.id);
    }),
    
    getPlaylistSongs: protectedProcedure
      .input(z.object({ playlistId: z.number() }))
      .query(async ({ input }) => {
        const { getPlaylistSongs } = await import('./db');
        return await getPlaylistSongs(input.playlistId);
      }),
    
    deletePlaylist: protectedProcedure
      .input(z.object({ playlistId: z.number() }))
      .mutation(async ({ input }) => {
        const { deletePlaylist } = await import('./db');
        await deletePlaylist(input.playlistId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
