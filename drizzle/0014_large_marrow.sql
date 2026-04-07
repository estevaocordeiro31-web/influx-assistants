CREATE TABLE `student_courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`course_code` varchar(50) NOT NULL,
	`course_name` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`enrolled_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`enrolled_by` int,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `student_courses` ADD CONSTRAINT `student_courses_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_courses` ADD CONSTRAINT `student_courses_enrolled_by_users_id_fk` FOREIGN KEY (`enrolled_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;