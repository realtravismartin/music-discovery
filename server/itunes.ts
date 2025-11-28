import axios from 'axios';

export interface ITunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl: string;
  trackViewUrl: string;
  primaryGenreName: string;
}

export async function searchITunesTrack(query: string): Promise<ITunesTrack[]> {
  const response = await axios.get('https://itunes.apple.com/search', {
    params: {
      term: query,
      media: 'music',
      entity: 'song',
      limit: 10,
    },
  });

  return response.data.results;
}

export async function getITunesRecommendations(seedTracks: ITunesTrack[]): Promise<ITunesTrack[]> {
  // iTunes doesn't have a recommendations API, so we'll search for similar songs
  // based on the genres and artists from the seed tracks
  
  const genreSet = new Set(seedTracks.map(t => t.primaryGenreName));
  const genres = Array.from(genreSet);
  const artistSet = new Set(seedTracks.map(t => t.artistName));
  const artists = Array.from(artistSet);
  
  const recommendations: ITunesTrack[] = [];
  const seenTrackIds = new Set(seedTracks.map(t => t.trackId));
  
  // Search by top genres
  for (const genre of genres.slice(0, 3)) {
    try {
      const response = await axios.get('https://itunes.apple.com/search', {
        params: {
          term: genre,
          media: 'music',
          entity: 'song',
          limit: 10,
        },
      });
      
      const tracks = response.data.results.filter((t: ITunesTrack) => !seenTrackIds.has(t.trackId));
      recommendations.push(...tracks);
      tracks.forEach((t: ITunesTrack) => seenTrackIds.add(t.trackId));
    } catch (error) {
      console.error(`Error searching iTunes for genre ${genre}:`, error);
    }
  }
  
  // Search by top artists
  for (const artist of artists.slice(0, 2)) {
    try {
      const response = await axios.get('https://itunes.apple.com/search', {
        params: {
          term: artist,
          media: 'music',
          entity: 'song',
          limit: 10,
        },
      });
      
      const tracks = response.data.results.filter((t: ITunesTrack) => !seenTrackIds.has(t.trackId));
      recommendations.push(...tracks);
      tracks.forEach((t: ITunesTrack) => seenTrackIds.add(t.trackId));
    } catch (error) {
      console.error(`Error searching iTunes for artist ${artist}:`, error);
    }
  }
  
  // Return up to 20 unique recommendations
  return recommendations.slice(0, 20);
}
