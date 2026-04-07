CREATE TABLE `books` (
	`id` int AUTO_INCREMENT NOT NULL,
	`book_id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`level` enum('starter','beginner','elementary','pre_intermediate','intermediate','upper_intermediate','advanced') NOT NULL,
	`category` enum('junior','regular') NOT NULL,
	`stages` int NOT NULL DEFAULT 2,
	`total_units` int NOT NULL,
	`description` text,
	`order` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `books_id` PRIMARY KEY(`id`),
	CONSTRAINT `books_book_id_unique` UNIQUE(`book_id`)
);
--> statement-breakpoint
CREATE TABLE `chunks_by_unit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`unit_id` int NOT NULL,
	`chunk_id` int NOT NULL,
	`chunk_type` enum('phrasal_verb','collocation','expression','grammar_structure','vocabulary_set','conversational_pattern') NOT NULL,
	`order` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chunks_by_unit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `spaced_repetition_schedule` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`chunk_id` int NOT NULL,
	`next_review_at` timestamp NOT NULL,
	`interval` int NOT NULL DEFAULT 1,
	`ease_factor` decimal(3,2) NOT NULL DEFAULT '2.5',
	`repetitions` int NOT NULL DEFAULT 0,
	`last_review_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `spaced_repetition_schedule_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_book_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`book_id` int NOT NULL,
	`current_unit` int NOT NULL DEFAULT 1,
	`completed_units` int NOT NULL DEFAULT 0,
	`progress_percentage` decimal(5,2) NOT NULL DEFAULT '0',
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_book_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` int AUTO_INCREMENT NOT NULL,
	`book_id` int NOT NULL,
	`unit_number` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`stage` int NOT NULL,
	`lessons` int NOT NULL,
	`description` text,
	`learning_objectives` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `units_id` PRIMARY KEY(`id`)
);
