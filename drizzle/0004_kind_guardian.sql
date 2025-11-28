ALTER TABLE `playlists` ADD `visibility` enum('private','public') DEFAULT 'private' NOT NULL;--> statement-breakpoint
ALTER TABLE `playlists` ADD `shareToken` varchar(64);--> statement-breakpoint
ALTER TABLE `playlists` ADD `views` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `playlists` ADD `likes` int DEFAULT 0 NOT NULL;