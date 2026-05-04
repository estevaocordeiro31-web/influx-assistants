-- Presence System Phase 3: Multi-Contexto + QR Integration
-- Migration: 0030_presence_phase3.sql

-- Environments table
CREATE TABLE IF NOT EXISTS `environments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('reception', 'game_room', 'cafe', 'classroom', 'garden', 'app', 'totem') NOT NULL,
  `location_name` VARCHAR(255),
  `floor` VARCHAR(50),
  `room` VARCHAR(50),
  `totem_id` VARCHAR(100) UNIQUE,
  `persona` JSON,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Environment visits table
CREATE TABLE IF NOT EXISTS `environment_visits` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(20) NOT NULL,
  `environment_id` VARCHAR(100) NOT NULL,
  `arrived_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `left_at` TIMESTAMP NULL,
  `xp_earned` INT NOT NULL DEFAULT 0,
  `influx_dollars_earned` INT NOT NULL DEFAULT 0,
  `interactions` INT NOT NULL DEFAULT 0,
  `check_in_method` ENUM('qr', 'manual', 'auto') NOT NULL DEFAULT 'qr',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_env_visits_student` (`student_id`),
  INDEX `idx_env_visits_env` (`environment_id`),
  INDEX `idx_env_visits_arrived` (`arrived_at`)
);

-- Totem sessions table
CREATE TABLE IF NOT EXISTS `totem_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `totem_id` VARCHAR(100) NOT NULL,
  `student_id` VARCHAR(20),
  `started_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` TIMESTAMP NULL,
  `qr_scanned_at` TIMESTAMP NULL,
  `environment_id` VARCHAR(100),
  `presence_state` VARCHAR(50),
  `xp_earned` INT NOT NULL DEFAULT 0,
  `summary` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_totem_sessions_totem` (`totem_id`),
  INDEX `idx_totem_sessions_student` (`student_id`)
);

-- NOTE: users table is in the BRAiN database, not TUTOR.
-- Run ALTER TABLE separately on brain DB if needed.

-- Seed 5 inFlux Jundiaí environments
INSERT INTO `environments` (`name`, `type`, `location_name`, `floor`, `room`, `totem_id`, `persona`, `is_active`) VALUES
('Recepção', 'reception', 'inFlux Jundiaí', 'Térreo', NULL, 'totem-reception-jundiai',
  '{"tone":"warm_welcoming","responseLength":"short","languageMix":"mixed_pt_en","allowVoice":true,"allowPronunciationFeedback":false,"showProgress":true,"showLeaderboard":false,"greetingTemplate":"Hey {name}! Welcome back. You have class today at {nextClassTime} with {teacher}.","idleMessage":"Hey! Welcome to inFlux. Scan your QR to check in"}',
  TRUE),

('Game Room', 'game_room', 'inFlux Jundiaí', 'Térreo', NULL, 'totem-game-jundiai',
  '{"tone":"playful","responseLength":"short","languageMix":"mixed_pt_en","allowVoice":true,"allowPronunciationFeedback":false,"showProgress":false,"showLeaderboard":true,"greetingTemplate":"Nice! Want a quick English challenge while you wait?","idleMessage":"Challenge a friend! Scan to play"}',
  TRUE),

('Café', 'cafe', 'inFlux Jundiaí', 'Térreo', NULL, 'totem-cafe-jundiai',
  '{"tone":"light","responseLength":"short","languageMix":"mixed_pt_en","allowVoice":false,"allowPronunciationFeedback":false,"showProgress":false,"showLeaderboard":false,"greetingTemplate":"Ordering in English today? Try: I''d like a {randomDrink}, please","idleMessage":"Practice ordering in English! Scan to start"}',
  TRUE),

('Sala 1', 'classroom', 'inFlux Jundiaí', '1º Andar', 'Sala 1', 'totem-sala1-jundiai',
  '{"tone":"pedagogical","responseLength":"medium","languageMix":"en_only","allowVoice":true,"allowPronunciationFeedback":true,"showProgress":true,"showLeaderboard":false,"greetingTemplate":"Let''s focus. Today we''re working on {currentLesson}.","idleMessage":"Ready to learn? Scan to start your lesson"}',
  TRUE),

('Jardim', 'garden', 'inFlux Jundiaí', 'Térreo', NULL, 'totem-garden-jundiai',
  '{"tone":"social","responseLength":"medium","languageMix":"mixed_pt_en","allowVoice":true,"allowPronunciationFeedback":false,"showProgress":false,"showLeaderboard":false,"greetingTemplate":"Hey {name}! Beautiful day. Want to practice English outdoors?","idleMessage":"Practice English in the fresh air! Scan to chat"}',
  TRUE)

ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
