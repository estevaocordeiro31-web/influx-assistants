CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coordinator_id` int NOT NULL,
	`student_id` int NOT NULL,
	`alert_type` enum('milestone_reached','recurring_difficulty','low_engagement','high_progress') NOT NULL,
	`chunk_id` int,
	`message` text NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chunks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`english_chunk` text NOT NULL,
	`portuguese_equivalent` text NOT NULL,
	`level` enum('beginner','elementary','intermediate','upper_intermediate','advanced') NOT NULL,
	`context` enum('career','travel','studies','daily_life','general') NOT NULL,
	`example` text,
	`native_usage_frequency` enum('very_common','common','occasional','rare') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chunks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`simulation_type` enum('career','travel','studies','free_chat','pronunciation_practice') NOT NULL,
	`title` varchar(255),
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`ended_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercise_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`exercise_id` int NOT NULL,
	`is_correct` boolean NOT NULL,
	`student_answer` text,
	`time_spent_seconds` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exercise_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chunk_id` int NOT NULL,
	`level` enum('beginner','elementary','intermediate','upper_intermediate','advanced') NOT NULL,
	`exercise_type` enum('fill_blank','multiple_choice','translation','sentence_building','conversation') NOT NULL,
	`question` text NOT NULL,
	`options` json,
	`correct_answer` text NOT NULL,
	`explanation` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversation_id` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`chunks_used` json,
	`audio_url` varchar(512),
	`audio_transcription` text,
	`pronunciation_score` decimal(3,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_chunk_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`chunk_id` int NOT NULL,
	`mastery_level` enum('not_started','learning','practicing','mastered') NOT NULL DEFAULT 'not_started',
	`correct_answers` int NOT NULL DEFAULT 0,
	`total_attempts` int NOT NULL DEFAULT 0,
	`last_practiced_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_chunk_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`objective` enum('career','travel','studies','other') NOT NULL,
	`current_level` enum('beginner','elementary','intermediate','upper_intermediate','advanced','proficient') NOT NULL DEFAULT 'beginner',
	`total_hours_learned` int NOT NULL DEFAULT 0,
	`streak_days` int NOT NULL DEFAULT 0,
	`last_activity_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_profiles_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','student') NOT NULL DEFAULT 'user';