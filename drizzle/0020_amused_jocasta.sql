CREATE TABLE `badge_definitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`name` varchar(128) NOT NULL,
	`name_en` varchar(128) NOT NULL,
	`description` text NOT NULL,
	`description_en` text NOT NULL,
	`ellie_message` text NOT NULL,
	`ellie_message_en` text NOT NULL,
	`category` enum('welcome','exercise','streak','vocabulary','speaking','cultural','book','special') NOT NULL,
	`icon` varchar(64) NOT NULL,
	`color` varchar(7) NOT NULL DEFAULT '#6B21A8',
	`requirement` text NOT NULL,
	`influxcoins_reward` int NOT NULL DEFAULT 0,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badge_definitions_id` PRIMARY KEY(`id`),
	CONSTRAINT `badge_definitions_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `student_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`badge_id` int NOT NULL,
	`earned_at` timestamp NOT NULL DEFAULT (now()),
	`seen_by_student` boolean NOT NULL DEFAULT false,
	`influxcoins_awarded` int NOT NULL DEFAULT 0,
	CONSTRAINT `student_badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `student_badges` ADD CONSTRAINT `student_badges_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_badges` ADD CONSTRAINT `student_badges_badge_id_badge_definitions_id_fk` FOREIGN KEY (`badge_id`) REFERENCES `badge_definitions`(`id`) ON DELETE cascade ON UPDATE no action;