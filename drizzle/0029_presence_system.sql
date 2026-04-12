-- ImAInd Presence System — Phase 1 Tables

CREATE TABLE IF NOT EXISTS `presence_states` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `student_id` int NOT NULL,
  `state` enum('idle','listening','thinking','speaking','reacting','encouraging') NOT NULL DEFAULT 'idle',
  `emotion` varchar(50) NOT NULL DEFAULT 'neutral',
  `context` varchar(100),
  `environment` enum('app','reception','game_room','cafe','classroom','garden') NOT NULL DEFAULT 'app',
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` timestamp NULL,
  `interaction_count` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_presence_student` (`student_id`),
  INDEX `idx_presence_state` (`state`),
  INDEX `idx_presence_started` (`started_at`)
);

CREATE TABLE IF NOT EXISTS `presence_interactions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `student_id` int NOT NULL,
  `presence_state_id` int,
  `type` enum('message','voice','reaction','cta_click') NOT NULL,
  `content` text,
  `xp_earned` int NOT NULL DEFAULT 0,
  `response_latency` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_interaction_student` (`student_id`),
  INDEX `idx_interaction_type` (`type`),
  INDEX `idx_interaction_created` (`created_at`)
);
