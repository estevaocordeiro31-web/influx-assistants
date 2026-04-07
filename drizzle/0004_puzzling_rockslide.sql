CREATE TABLE `blog_tips_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`badge_name` varchar(100) NOT NULL,
	`badge_description` text NOT NULL,
	`badge_icon` varchar(255),
	`tips_completed` int NOT NULL DEFAULT 0,
	`unlocked_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_tips_badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_tips_favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`tip_id` varchar(255) NOT NULL,
	`tip_title` varchar(255) NOT NULL,
	`tip_category` varchar(100) NOT NULL,
	`saved_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_tips_favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_tips_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`tip_id` varchar(255) NOT NULL,
	`tip_title` varchar(255) NOT NULL,
	`feedback` enum('useful','not_useful') NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_tips_feedback_id` PRIMARY KEY(`id`)
);
