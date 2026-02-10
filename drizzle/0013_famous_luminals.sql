CREATE TABLE `leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`student_name` varchar(255) NOT NULL,
	`total_points` int NOT NULL DEFAULT 0,
	`quizzes_completed` int NOT NULL DEFAULT 0,
	`lessons_completed` int NOT NULL DEFAULT 0,
	`rank` int NOT NULL DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboard_id` PRIMARY KEY(`id`),
	CONSTRAINT `leaderboard_student_id_unique` UNIQUE(`student_id`)
);
--> statement-breakpoint
CREATE TABLE `points_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`points` int NOT NULL,
	`reason` varchar(255) NOT NULL,
	`related_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `points_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`video_id` varchar(100) NOT NULL,
	`video_title` varchar(255) NOT NULL,
	`score` int NOT NULL,
	`total_questions` int NOT NULL,
	`correct_answers` int NOT NULL,
	`passed` boolean NOT NULL,
	`points_earned` int NOT NULL,
	`completed_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `leaderboard` ADD CONSTRAINT `leaderboard_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `points_history` ADD CONSTRAINT `points_history_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_results` ADD CONSTRAINT `quiz_results_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;