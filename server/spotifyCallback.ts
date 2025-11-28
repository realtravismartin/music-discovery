import { Router } from 'express';
import { exchangeCodeForToken } from './spotifyOAuth';
import { upsertSpotifyToken } from './db';
import { createContext } from './_core/context';

export const spotifyCallbackRouter = Router();

spotifyCallbackRouter.get('/api/spotify/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect('/?error=spotify_auth_denied');
    }

    if (!code || typeof code !== 'string') {
      return res.redirect('/?error=invalid_code');
    }

    // Verify user session
    const ctx = await createContext({ req, res } as any);
    if (!ctx.user) {
      return res.redirect('/?error=not_authenticated');
    }
    const user = ctx.user;

    // Exchange code for tokens
    const tokens = await exchangeCodeForToken(code);

    // Store tokens in database
    await upsertSpotifyToken({
      userId: user.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
    });

    // Redirect back to the app
    res.redirect('/?spotify_connected=true');
  } catch (error) {
    console.error('Spotify OAuth callback error:', error);
    res.redirect('/?error=spotify_auth_failed');
  }
});
