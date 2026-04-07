ALTER TABLE `users` ADD `status` enum('ativo','inativo','desistente','trancado') DEFAULT 'ativo' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `sponteId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_sponteId_unique` UNIQUE(`sponteId`);