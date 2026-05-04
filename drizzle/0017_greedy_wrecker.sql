CREATE TABLE `activity_tag_associations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`activity_id` int NOT NULL,
	`tag_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_tag_associations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activity_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`color` varchar(7) NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `activity_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `activity_tags_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `school_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`activity_date` date NOT NULL,
	`start_time` varchar(8),
	`end_time` varchar(8),
	`location` varchar(255),
	`enrollment_link` varchar(500),
	`max_participants` int,
	`created_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `school_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_activity_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`activity_id` int NOT NULL,
	`status` enum('pending','confirmed','attended','cancelled','no_show') NOT NULL DEFAULT 'pending',
	`enrolled_at` timestamp NOT NULL DEFAULT (now()),
	`confirmed_at` timestamp,
	`attended_at` timestamp,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_activity_enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `activity_tag_associations` ADD CONSTRAINT `activity_tag_associations_activity_id_school_activities_id_fk` FOREIGN KEY (`activity_id`) REFERENCES `school_activities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_tag_associations` ADD CONSTRAINT `activity_tag_associations_tag_id_activity_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `activity_tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `school_activities` ADD CONSTRAINT `school_activities_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_activity_enrollments` ADD CONSTRAINT `student_activity_enrollments_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_activity_enrollments` ADD CONSTRAINT `student_activity_enrollments_activity_id_school_activities_id_fk` FOREIGN KEY (`activity_id`) REFERENCES `school_activities`(`id`) ON DELETE cascade ON UPDATE no action;