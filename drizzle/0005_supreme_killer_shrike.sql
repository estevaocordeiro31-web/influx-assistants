CREATE TABLE `exclusive_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`file_url` varchar(512) NOT NULL,
	`file_key` varchar(255) NOT NULL,
	`file_type` varchar(50),
	`file_size` int,
	`created_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`is_active` boolean DEFAULT true,
	CONSTRAINT `exclusive_materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `material_class_share` (
	`id` int AUTO_INCREMENT NOT NULL,
	`material_id` int NOT NULL,
	`class_id` int NOT NULL,
	`shared_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `material_class_share_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `material_student_share` (
	`id` int AUTO_INCREMENT NOT NULL,
	`material_id` int NOT NULL,
	`student_id` int NOT NULL,
	`shared_at` timestamp NOT NULL DEFAULT (now()),
	`accessed_at` timestamp,
	CONSTRAINT `material_student_share_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `personalized_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`link_hash` varchar(64) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp NOT NULL,
	`accessed_at` timestamp,
	`access_count` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	CONSTRAINT `personalized_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `personalized_links_link_hash_unique` UNIQUE(`link_hash`)
);
--> statement-breakpoint
ALTER TABLE `exclusive_materials` ADD CONSTRAINT `exclusive_materials_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `material_class_share` ADD CONSTRAINT `material_class_share_material_id_exclusive_materials_id_fk` FOREIGN KEY (`material_id`) REFERENCES `exclusive_materials`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `material_student_share` ADD CONSTRAINT `material_student_share_material_id_exclusive_materials_id_fk` FOREIGN KEY (`material_id`) REFERENCES `exclusive_materials`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `material_student_share` ADD CONSTRAINT `material_student_share_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `personalized_links` ADD CONSTRAINT `personalized_links_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;