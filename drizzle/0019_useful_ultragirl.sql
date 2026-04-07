CREATE TABLE `extra_exercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`book_id` int NOT NULL,
	`lesson_number` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('vocabulary','grammar','listening','reading','writing','speaking','communicative') NOT NULL,
	`content` longtext NOT NULL,
	`image_url` varchar(512),
	`difficulty` enum('beginner','elementary','intermediate','upper_intermediate','advanced','proficient') NOT NULL DEFAULT 'beginner',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `extra_exercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_exercise_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`exercise_id` int NOT NULL,
	`status` enum('not_started','in_progress','completed','reviewed') NOT NULL DEFAULT 'not_started',
	`score` decimal(5,2),
	`attempts` int NOT NULL DEFAULT 0,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_exercise_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `extra_exercises` ADD CONSTRAINT `extra_exercises_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_exercise_progress` ADD CONSTRAINT `student_exercise_progress_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_exercise_progress` ADD CONSTRAINT `student_exercise_progress_exercise_id_extra_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `extra_exercises`(`id`) ON DELETE cascade ON UPDATE no action;