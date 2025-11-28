# Music API Integration Notes

## Spotify Web API
- **Authentication**: Requires OAuth 2.0 with Client Credentials flow
- **Search Endpoint**: `GET https://api.spotify.com/v1/search`
  - Parameters: `q` (query), `type` (track, artist, album), `limit`
- **Recommendations Endpoint**: `GET https://api.spotify.com/v1/recommendations`
  - Parameters: `seed_tracks` (up to 5 track IDs), `target_energy`, `target_valence` (for upbeat)
- **Rate Limits**: Standard rate limiting applies
- **Credentials Required**: Client ID and Client Secret

## iTunes Search API
- **Authentication**: None required (public API)
- **Search Endpoint**: `GET https://itunes.apple.com/search`
  - Parameters: 
    - `term` (URL-encoded search term)
    - `media=music`
    - `entity=song` or `entity=musicTrack`
    - `limit` (1-200, default 50)
    - `country` (default US)
- **Rate Limits**: ~20 calls per minute
- **No Recommendations**: iTunes API doesn't have a recommendations endpoint, we'll need to implement our own logic

## Implementation Strategy
1. For Spotify: Use OAuth Client Credentials flow for server-side authentication
2. For iTunes: Direct API calls (no auth needed)
3. For recommendations:
   - Spotify: Use native recommendations API with seed tracks
   - iTunes: Implement custom logic based on genre/artist matching
4. Store user playlists in database with service type (spotify/itunes)
