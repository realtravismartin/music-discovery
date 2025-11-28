# Project TODO

- [x] Setup database schema for playlists and songs
- [x] Research and integrate Spotify API
- [x] Implement backend procedure to search songs
- [x] Implement backend procedure to generate upbeat playlist recommendations
- [x] Create frontend UI for inputting 20 songs
- [x] Create frontend UI for displaying generated playlist
- [x] Add loading states and error handling
- [x] Write vitest tests for backend procedures
- [x] Test end-to-end flow
- [x] Create checkpoint and deliver to user
- [x] Research and integrate iTunes Search API
- [x] Implement backend procedure to search songs on iTunes
- [x] Add option for users to choose between Spotify and iTunes
- [x] Support generating playlists from both services

## OAuth Integration for Playlist Export
- [x] Update database schema to store Spotify OAuth tokens
- [x] Implement Spotify OAuth authorization flow
- [x] Add token refresh logic for expired tokens
- [x] Create backend procedure to export playlist to Spotify
- [x] Add "Export to Spotify" button in frontend
- [x] Handle OAuth callback and token storage
- [x] Test OAuth flow end-to-end
- [x] Write vitest tests for export functionality

## Export Tracking and Play Counts
- [x] Update database schema to track playlist exports
- [x] Add exportedAt timestamp and spotifyPlaylistId to playlists table
- [x] Fetch play counts from Spotify API for tracks
- [x] Create backend procedure to get export history
- [x] Display export status and timestamp in playlist view
- [x] Show play counts for each song in playlist
- [x] Add export history section to home page
- [x] Write vitest tests for tracking functionality
