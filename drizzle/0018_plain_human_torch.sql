CREATE TABLE `passport_qr_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` varchar(20) NOT NULL,
	`qr_code` longtext NOT NULL,
	`type` enum('checkin','objectives') NOT NULL,
	`check_in_data` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `passport_qr_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_objectives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` varchar(20) NOT NULL,
	`objectives` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_objectives_id` PRIMARY KEY(`id`)
);
