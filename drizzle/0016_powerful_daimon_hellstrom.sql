CREATE TABLE `back_to_school_campaign` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaign_id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`status` enum('planning','active','completed','archived') NOT NULL DEFAULT 'planning',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `back_to_school_campaign_id` PRIMARY KEY(`id`),
	CONSTRAINT `back_to_school_campaign_campaign_id_unique` UNIQUE(`campaign_id`)
);
--> statement-breakpoint
CREATE TABLE `back_to_school_sync_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaign_id` int NOT NULL,
	`sync_type` enum('initial_sync','update','verification','report_generation') NOT NULL,
	`total_students` int NOT NULL,
	`success_count` int NOT NULL,
	`error_count` int NOT NULL DEFAULT 0,
	`errors` json,
	`synced_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `back_to_school_sync_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_back_to_school_enrollment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaign_id` int NOT NULL,
	`student_id` int NOT NULL,
	`current_book` int,
	`previous_books` json,
	`enrollment_status` enum('enrolled','pending','completed','cancelled') NOT NULL DEFAULT 'enrolled',
	`temp_password` varchar(255),
	`access_granted_at` timestamp,
	`access_expires_at` timestamp,
	`enrolled_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_back_to_school_enrollment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_book_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`book_id` int NOT NULL,
	`status` enum('completed','in_progress','paused','abandoned') NOT NULL,
	`started_at` timestamp NOT NULL,
	`completed_at` timestamp,
	`final_grade` decimal(3,1),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_book_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `back_to_school_sync_log` ADD CONSTRAINT `back_to_school_sync_log_campaign_id_back_to_school_campaign_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `back_to_school_campaign`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_back_to_school_enrollment` ADD CONSTRAINT `student_back_to_school_enrollment_campaign_id_back_to_school_campaign_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `back_to_school_campaign`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_back_to_school_enrollment` ADD CONSTRAINT `student_back_to_school_enrollment_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_back_to_school_enrollment` ADD CONSTRAINT `student_back_to_school_enrollment_current_book_books_id_fk` FOREIGN KEY (`current_book`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_book_history` ADD CONSTRAINT `student_book_history_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_book_history` ADD CONSTRAINT `student_book_history_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;