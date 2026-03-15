CREATE TABLE `chat_memory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`memory_key` varchar(100) NOT NULL,
	`memory_value` text NOT NULL,
	`source` varchar(50) DEFAULT 'conversation',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_memory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mining_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phone` varchar(30) NOT NULL,
	`status` enum('pending','processing','done','error','ignored') NOT NULL DEFAULT 'pending',
	`analise_json` json,
	`nome` varchar(100),
	`interesse` varchar(255),
	`lead_status` varchar(50),
	`temperatura` int DEFAULT 0,
	`urgencia` varchar(20),
	`melhor_abordagem` text,
	`resumo` text,
	`acao` varchar(50),
	`processado_em` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mining_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `mining_progress_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `mining_session` (
	`id` int AUTO_INCREMENT NOT NULL,
	`status` enum('idle','running','paused','completed','error') NOT NULL DEFAULT 'idle',
	`total_chats` int NOT NULL DEFAULT 0,
	`processados` int NOT NULL DEFAULT 0,
	`novos_contatos` int NOT NULL DEFAULT 0,
	`contatos_atualizados` int NOT NULL DEFAULT 0,
	`follows_criados` int NOT NULL DEFAULT 0,
	`leads_quentes` int NOT NULL DEFAULT 0,
	`last_phone` varchar(30),
	`started_at` timestamp,
	`completed_at` timestamp,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mining_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vip_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`name` varchar(100) NOT NULL,
	`email` varchar(320),
	`phone` varchar(30),
	`relationship` varchar(100),
	`role` varchar(100),
	`bio` text,
	`tone_instructions` text,
	`personal_context` json,
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vip_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chat_memory` ADD CONSTRAINT `chat_memory_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vip_profiles` ADD CONSTRAINT `vip_profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;