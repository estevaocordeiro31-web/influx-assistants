CREATE TABLE `rc_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`badge_type` enum('active_reader','sharer','commenter','event_participant','book_master','weekly_warrior') NOT NULL,
	`influx_dollars` int NOT NULL DEFAULT 10,
	`earned_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rc_badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rc_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`student_id` int NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rc_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rc_event_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_id` int NOT NULL,
	`student_id` int NOT NULL,
	`attended_at` timestamp,
	`notes` text,
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rc_event_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rc_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`event_type` enum('discussion','dramatization','book_club','library_visit') NOT NULL,
	`scheduled_at` timestamp NOT NULL,
	`location` varchar(255),
	`capacity` int,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rc_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rc_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`content_type` enum('book','magazine','comic','podcast','article') NOT NULL,
	`title` varchar(255) NOT NULL,
	`excerpt` text,
	`image_url` varchar(255),
	`source_url` varchar(255),
	`notes` text,
	`likes` int NOT NULL DEFAULT 0,
	`comments_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rc_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vacation_plus_2_dialogue_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`lesson_number` int NOT NULL,
	`dialogue_id` varchar(100) NOT NULL,
	`character` enum('lucas','emily','aiko') NOT NULL,
	`listened_count` int NOT NULL DEFAULT 0,
	`last_listened_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vacation_plus_2_dialogue_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vacation_plus_2_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`lesson_number` int NOT NULL,
	`section_completed` enum('overview','vocabulary','dialogues','cultural_tips','exercises'),
	`progress_percentage` decimal(5,2) NOT NULL DEFAULT '0',
	`vocabulary_completed` int NOT NULL DEFAULT 0,
	`dialogues_listened` int NOT NULL DEFAULT 0,
	`exercises_completed` int NOT NULL DEFAULT 0,
	`cultural_tips_viewed` int NOT NULL DEFAULT 0,
	`last_activity_at` timestamp,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vacation_plus_2_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vacation_plus_2_vocabulary_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`lesson_number` int NOT NULL,
	`vocabulary_item` varchar(255) NOT NULL,
	`character` enum('lucas','emily','aiko') NOT NULL,
	`audio_listened` boolean NOT NULL DEFAULT false,
	`marked_as_learned` boolean NOT NULL DEFAULT false,
	`practice_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vacation_plus_2_vocabulary_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `reading_club_badges`;--> statement-breakpoint
DROP TABLE `reading_club_comments`;--> statement-breakpoint
DROP TABLE `reading_club_event_participants`;--> statement-breakpoint
DROP TABLE `reading_club_events`;--> statement-breakpoint
DROP TABLE `reading_club_posts`;--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `users_sponteId_unique`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','owner') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `status` enum('ativo','inativo','desistente','trancado');--> statement-breakpoint
ALTER TABLE `users` ADD `password_hash` varchar(255);--> statement-breakpoint
ALTER TABLE `rc_badges` ADD CONSTRAINT `rc_badges_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rc_comments` ADD CONSTRAINT `rc_comments_post_id_rc_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `rc_posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rc_comments` ADD CONSTRAINT `rc_comments_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rc_event_participants` ADD CONSTRAINT `rc_event_participants_event_id_rc_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `rc_events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rc_event_participants` ADD CONSTRAINT `rc_event_participants_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rc_events` ADD CONSTRAINT `rc_events_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rc_posts` ADD CONSTRAINT `rc_posts_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vacation_plus_2_dialogue_progress` ADD CONSTRAINT `vacation_plus_2_dialogue_progress_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vacation_plus_2_progress` ADD CONSTRAINT `vacation_plus_2_progress_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vacation_plus_2_vocabulary_progress` ADD CONSTRAINT `vacation_plus_2_vocabulary_progress_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `sponteId`;