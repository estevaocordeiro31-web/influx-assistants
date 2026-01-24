-- ============================================================================
-- Script de Criação de Tabelas do inFlux Personal Tutor
-- Banco: Centralizado (TiDB Cloud)
-- Data: 24/01/2026
-- ============================================================================

-- 1. tutor_conversations - Conversas do Chat
CREATE TABLE IF NOT EXISTS tutor_conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  intelligence_id INT,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (intelligence_id) REFERENCES student_intelligence(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. tutor_messages - Mensagens do Chat
CREATE TABLE IF NOT EXISTS tutor_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  role ENUM('user', 'assistant', 'system') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES tutor_conversations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. tutor_chunks - Chunks de Conteúdo do Material Didático
CREATE TABLE IF NOT EXISTS tutor_chunks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_level VARCHAR(50) NOT NULL,
  chunk_number INT NOT NULL,
  content TEXT NOT NULL,
  grammar_focus VARCHAR(255),
  vocabulary JSON,
  difficulty_level INT DEFAULT 1,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_chunk (book_level, chunk_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. tutor_student_progress - Progresso do Aluno em Chunks
CREATE TABLE IF NOT EXISTS tutor_student_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  intelligence_id INT,
  chunk_id INT NOT NULL,
  mastery_level INT DEFAULT 0,
  practice_count INT DEFAULT 0,
  last_practiced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (intelligence_id) REFERENCES student_intelligence(id),
  FOREIGN KEY (chunk_id) REFERENCES tutor_chunks(id),
  UNIQUE KEY unique_progress (student_id, chunk_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. tutor_reading_club - Experiências do Reading Club
CREATE TABLE IF NOT EXISTS tutor_reading_club (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  story_title VARCHAR(255) NOT NULL,
  story_content TEXT NOT NULL,
  difficulty_level VARCHAR(50),
  completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP NULL,
  reading_time_minutes INT,
  comprehension_score INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Índices adicionais para performance
-- ============================================================================

-- Índice para buscar conversas por aluno
CREATE INDEX idx_conversations_student ON tutor_conversations(student_id);

-- Índice para buscar mensagens por conversa
CREATE INDEX idx_messages_conversation ON tutor_messages(conversation_id);

-- Índice para buscar chunks por nível
CREATE INDEX idx_chunks_level ON tutor_chunks(book_level);

-- Índice para buscar progresso por aluno
CREATE INDEX idx_progress_student ON tutor_student_progress(student_id);

-- Índice para buscar reading club por aluno
CREATE INDEX idx_reading_club_student ON tutor_reading_club(student_id);

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
