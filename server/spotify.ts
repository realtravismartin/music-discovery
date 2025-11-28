import axios from 'axios';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
    }
  );

  accessToken = response.data.access_token as string;
  tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 min early

  return accessToken;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export async function searchSpotifyTrack(query: string): Promise<SpotifyTrack[]> {
  const token = await getAccessToken();

  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    params: {
      q: query,
      type: 'track',
      limit: 10,
    },
  });

  return response.data.tracks.items;
}

export async function getSpotifyRecommendations(seedTrackIds: string[]): Promise<SpotifyTrack[]> {
  const token = await getAccessToken();

  // Spotify allows max 5 seed tracks
  const seeds = seedTrackIds.slice(0, 5);

  const response = await axios.get('https://api.spotify.com/v1/recommendations', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    params: {
      seed_tracks: seeds.join(','),
      limit: 20,
      target_energy: 0.8, // High energy for upbeat
      target_valence: 0.7, // High valence for positive/happy
      min_tempo: 120, // Faster tempo for upbeat
    },
  });

  return response.data.tracks;
}
