CREATE TABLE `lesson_chunks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lesson_id` int NOT NULL,
	`expression` varchar(255) NOT NULL,
	`portuguese_equivalent` text,
	`example` text,
	`chunk_type` enum('phrasal_verb','collocation','expression','idiom','grammar_structure') NOT NULL DEFAULT 'expression',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lesson_chunks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lesson_examples` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lesson_id` int NOT NULL,
	`sentence` text NOT NULL,
	`portuguese_translation` text,
	`audio_url` varchar(512),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lesson_examples_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lesson_vocabulary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lesson_id` int NOT NULL,
	`word` varchar(255) NOT NULL,
	`portuguese_translation` text,
	`example` text,
	`audio_url` varchar(512),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lesson_vocabulary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`book_id` int NOT NULL,
	`unit_id` int NOT NULL,
	`lesson_number` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`audio_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
