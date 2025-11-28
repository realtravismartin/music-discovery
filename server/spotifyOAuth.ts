import axios from 'axios';
import { getSpotifyToken, upsertSpotifyToken } from './db';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'https://3000-i7pnkog8d7kl50s2626k2-544b89fc.manusvm.computer/api/spotify/callback';

export function getSpotifyAuthUrl(state: string): string {
  const scopes = [
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-private',
    'user-read-email',
  ];

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: scopes.join(' '),
    state,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
      },
    }
  );

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresIn: response.data.expires_in,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
      },
    }
  );

  return {
    accessToken: response.data.access_token,
    expiresIn: response.data.expires_in,
  };
}

export async function getUserAccessToken(userId: number): Promise<string | null> {
  const token = await getSpotifyToken(userId);
  
  if (!token) {
    return null;
  }

  // Check if token is expired
  if (new Date() >= new Date(token.expiresAt)) {
    // Refresh the token
    const refreshed = await refreshAccessToken(token.refreshToken);
    
    await upsertSpotifyToken({
      userId,
      accessToken: refreshed.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: new Date(Date.now() + refreshed.expiresIn * 1000),
    });

    return refreshed.accessToken;
  }

  return token.accessToken;
}

export async function createSpotifyPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description: string,
  trackUris: string[]
) {
  // Create playlist
  const createResponse = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      name,
      description,
      public: false,
    },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const playlistId = createResponse.data.id;

  // Add tracks to playlist
  if (trackUris.length > 0) {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: trackUris,
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return {
    playlistId,
    url: createResponse.data.external_urls.spotify,
  };
}

export async function getSpotifyUserProfile(accessToken: string) {
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  return {
    id: response.data.id,
    displayName: response.data.display_name,
    email: response.data.email,
  };
}

export async function getTracksPopularity(accessToken: string, trackIds: string[]) {
  if (trackIds.length === 0) return [];
  
  // Spotify API allows max 50 tracks per request
  const chunks = [];
  for (let i = 0; i < trackIds.length; i += 50) {
    chunks.push(trackIds.slice(i, i + 50));
  }
  
  const results = [];
  for (const chunk of chunks) {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks?ids=${chunk.join(',')}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    results.push(...response.data.tracks.map((track: any) => ({
      id: track.id,
      popularity: track.popularity, // 0-100 scale
      name: track.name,
    })));
  }
  
  return results;
}
