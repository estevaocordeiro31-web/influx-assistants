-- Inserir Val
INSERT INTO users (openId, student_id, name, email, loginMethod, role, status, createdAt, updatedAt, lastSignedIn)
VALUES (
  CONCAT('val_', UNIX_TIMESTAMP() * 1000),
  'INF-2026-0001',
  'Val',
  'valfsouza16@gmail.com',
  'email',
  'user',
  'ativo',
  NOW(),
  NOW(),
  NOW()
);

-- Inserir Rebeca
INSERT INTO users (openId, student_id, name, email, loginMethod, role, status, createdAt, updatedAt, lastSignedIn)
VALUES (
  CONCAT('rebeca_', UNIX_TIMESTAMP() * 1000),
  'INF-2026-0002',
  'Rebeca',
  'rebecaresende@icloud.com',
  'email',
  'user',
  'ativo',
  NOW(),
  NOW(),
  NOW()
);

-- Inserir perfil de Val (Book 2, Intermediate, Pessoal/Profissional)
INSERT INTO student_profiles (user_id, objective, current_level, total_hours_learned, streak_days, created_at, updated_at)
SELECT id, 'studies', 'intermediate', 0, 0, NOW(), NOW()
FROM users WHERE email = 'valfsouza16@gmail.com' LIMIT 1;

-- Inserir perfil de Rebeca (Book 2, Intermediate, Viagens)
INSERT INTO student_profiles (user_id, objective, current_level, total_hours_learned, streak_days, created_at, updated_at)
SELECT id, 'travel', 'intermediate', 0, 0, NOW(), NOW()
FROM users WHERE email = 'rebecaresende@icloud.com' LIMIT 1;
