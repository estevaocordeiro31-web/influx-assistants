CREATE TABLE `cultural_events` (
	`id` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`event_date` date NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`config` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cultural_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_mission_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`participant_id` int NOT NULL,
	`mission_id` varchar(50) NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`completed` boolean NOT NULL DEFAULT false,
	`time_spent_seconds` int NOT NULL DEFAULT 0,
	`answers` json,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_mission_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_id` varchar(50) NOT NULL,
	`user_id` int,
	`guest_name` varchar(100),
	`guest_whatsapp` varchar(20),
	`guest_token` varchar(100),
	`total_points` int NOT NULL DEFAULT 0,
	`missions_completed` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `event_mission_progress` ADD CONSTRAINT `event_mission_progress_participant_id_event_participants_id_fk` FOREIGN KEY (`participant_id`) REFERENCES `event_participants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_participants` ADD CONSTRAINT `event_participants_event_id_cultural_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `cultural_events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_participants` ADD CONSTRAINT `event_participants_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;