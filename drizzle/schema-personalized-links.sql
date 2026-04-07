-- Tabela de Links Personalizados para Alunos
CREATE TABLE IF NOT EXISTS personalized_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  link_hash VARCHAR(64) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  accessed_at TIMESTAMP NULL,
  access_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_link_hash (link_hash),
  INDEX idx_student_id (student_id),
  INDEX idx_expires_at (expires_at)
);

-- Tabela de Materiais Exclusivos
CREATE TABLE IF NOT EXISTS exclusive_materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(512) NOT NULL,
  file_key VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_created_at (created_at)
);

-- Tabela de Compartilhamento de Materiais (Turma)
CREATE TABLE IF NOT EXISTS material_class_share (
  id INT PRIMARY KEY AUTO_INCREMENT,
  material_id INT NOT NULL,
  class_id INT NOT NULL,
  shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES exclusive_materials(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_material_class (material_id, class_id)
);

-- Tabela de Compartilhamento de Materiais (Individual)
CREATE TABLE IF NOT EXISTS material_student_share (
  id INT PRIMARY KEY AUTO_INCREMENT,
  material_id INT NOT NULL,
  student_id INT NOT NULL,
  shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accessed_at TIMESTAMP NULL,
  FOREIGN KEY (material_id) REFERENCES exclusive_materials(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_material_student (material_id, student_id)
);
