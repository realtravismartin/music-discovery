ALTER TABLE `playlists` ADD `exportedAt` timestamp;--> statement-breakpoint
ALTER TABLE `playlists` ADD `spotifyPlaylistId` varchar(255);--> statement-breakpoint
ALTER TABLE `playlists` ADD `spotifyPlaylistUrl` text;