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

## Playlist Sharing and Social Features
- [x] Add visibility field to playlists table (public/private)
- [x] Add shareToken field for unique shareable links
- [x] Add likes/views counter fields to playlists table
- [x] Create backend procedure to toggle playlist visibility
- [x] Create backend procedure to generate share links
- [x] Create backend procedure to get public playlists for discovery
- [ ] Create backend procedure to clone playlists
- [x] Add share button with copy link functionality to playlist view
- [ ] Create discovery page to browse public playlists
- [ ] Add public playlist view page (accessible without login)
- [ ] Display playlist creator name and stats on public view
- [ ] Add clone/save button for public playlists
- [x] Write vitest tests for sharing functionality

## Legal Pages
- [x] Create Terms of Service page
- [x] Create Privacy Policy page
- [x] Add footer with links to legal pages
- [x] Include privacy statement about PII handling

## Opt-in Dislike System
- [x] Add allowDislikes field to playlists table (default false)
- [x] Add dislikes counter field to playlists table
- [x] Create backend procedure to toggle dislike setting
- [x] Add UI toggle for enabling/disabling dislikes
- [ ] Display dislike count only when enabled by creator
- [ ] Add dislike button for public playlists (when enabled)

## Discovery Gallery
- [x] Add genre and mood fields to playlists table
- [x] Create backend procedure to get trending playlists (sorted by views/likes)
- [x] Create backend procedure to filter playlists by genre
- [x] Create backend procedure to filter playlists by mood
- [x] Create backend procedure to clone playlists
- [x] Build Discovery page with playlist grid layout
- [x] Add genre filter dropdown
- [x] Add mood filter dropdown
- [x] Add search functionality for playlist names
- [x] Create public playlist view page (accessible via share token)
- [x] Add clone button on public playlist view
- [x] Display playlist stats (views, likes) on cards
- [x] Add navigation link to Discovery page
- [x] Write vitest tests for discovery and clone functionality

## Like Feature
- [ ] Create playlistLikes table to track user likes
- [ ] Add backend procedure to like a playlist
- [ ] Add backend procedure to unlike a playlist
- [ ] Add backend procedure to check if user has liked a playlist
- [ ] Update like counter when users like/unlike
- [ ] Add like button to Discovery page playlist cards
- [ ] Add like button to ShareView page
- [ ] Show liked state (filled heart) when user has liked
- [ ] Update like count in real-time after like/unlike
- [ ] Write vitest tests for like functionality

## Color Scheme Redesign
- [x] Update CSS variables in index.css with music-oriented colors
- [x] Use bold gradients with electric blues and vibrant purples
- [x] Add energetic accent colors for buttons and highlights
- [x] Update all page backgrounds with new gradient scheme
- [x] Ensure text contrast and readability with new colors
