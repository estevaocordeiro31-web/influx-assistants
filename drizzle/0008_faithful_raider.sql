CREATE TABLE `influx_dollar_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`amount` int NOT NULL,
	`type` enum('earn','spend') NOT NULL,
	`reason` varchar(255) NOT NULL,
	`related_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `influx_dollar_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `library_books` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`author` varchar(255),
	`language` enum('english','portuguese','spanish') NOT NULL DEFAULT 'english',
	`level` enum('beginner','elementary','intermediate','upper_intermediate','advanced'),
	`isbn` varchar(20),
	`image_url` varchar(255),
	`description` text,
	`quantity` int NOT NULL DEFAULT 1,
	`added_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `library_books_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `library_loans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`book_id` int NOT NULL,
	`borrowed_at` timestamp NOT NULL DEFAULT (now()),
	`returned_at` timestamp,
	`due_at` timestamp,
	CONSTRAINT `library_loans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reading_club_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`badge_type` enum('active_reader','sharer','commenter','event_participant','book_master','weekly_warrior') NOT NULL,
	`influx_dollars` int NOT NULL DEFAULT 10,
	`earned_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reading_club_badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reading_club_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`student_id` int NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reading_club_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reading_club_event_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_id` int NOT NULL,
	`student_id` int NOT NULL,
	`attended_at` timestamp,
	`notes` text,
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reading_club_event_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reading_club_events` (
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
	CONSTRAINT `reading_club_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reading_club_posts` (
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
	CONSTRAINT `reading_club_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_influx_dollars` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`total_earned` int NOT NULL DEFAULT 0,
	`total_spent` int NOT NULL DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_influx_dollars_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_influx_dollars_student_id_unique` UNIQUE(`student_id`)
);
--> statement-breakpoint
ALTER TABLE `influx_dollar_transactions` ADD CONSTRAINT `influx_dollar_transactions_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `library_loans` ADD CONSTRAINT `library_loans_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `library_loans` ADD CONSTRAINT `library_loans_book_id_library_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `library_books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_club_badges` ADD CONSTRAINT `reading_club_badges_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_club_comments` ADD CONSTRAINT `reading_club_comments_post_id_reading_club_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `reading_club_posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_club_comments` ADD CONSTRAINT `reading_club_comments_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_club_event_participants` ADD CONSTRAINT `reading_club_event_participants_event_id_reading_club_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `reading_club_events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_club_event_participants` ADD CONSTRAINT `reading_club_event_participants_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_club_events` ADD CONSTRAINT `reading_club_events_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_club_posts` ADD CONSTRAINT `reading_club_posts_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_influx_dollars` ADD CONSTRAINT `student_influx_dollars_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;