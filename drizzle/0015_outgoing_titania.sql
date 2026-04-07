CREATE TABLE `student_topic_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`topic_id` varchar(100) NOT NULL,
	`topic_name` varchar(255) NOT NULL,
	`category` enum('professional','traveller','general') NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`completed_at` timestamp,
	`progress_percentage` int NOT NULL DEFAULT 0,
	`time_spent_minutes` int NOT NULL DEFAULT 0,
	`last_accessed_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_topic_progress_id` PRIMARY KEY(`id`)
);
