ALTER TABLE `users` ADD `student_id` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_student_id_unique` UNIQUE(`student_id`);