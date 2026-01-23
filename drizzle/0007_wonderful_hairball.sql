CREATE TABLE `student_imported_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`matricula` varchar(50) NOT NULL,
	`book` varchar(50),
	`class_name` varchar(100),
	`schedule` varchar(100),
	`teacher` varchar(100),
	`grades_data` json,
	`attendance_data` json,
	`average_grade` decimal(4,2),
	`overall_attendance_rate` decimal(5,2),
	`notes` text,
	`imported_at` timestamp NOT NULL DEFAULT (now()),
	`imported_by` int,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_imported_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `student_imported_data` ADD CONSTRAINT `student_imported_data_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_imported_data` ADD CONSTRAINT `student_imported_data_imported_by_users_id_fk` FOREIGN KEY (`imported_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;