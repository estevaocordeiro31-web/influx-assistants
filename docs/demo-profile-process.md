# Processo de Criação de Perfis de Demonstração - inFlux

## Resumo do Processo

Este documento descreve o processo usado para criar perfis de demonstração completos para o sistema inFlux Personal Assistants.

## Etapas Realizadas

### 1. Criar Usuário no Banco de Dados
```sql
INSERT INTO users (open_id, name, email, role, created_at, updated_at)
VALUES (
  'demo-[nome-slug]',
  '[Nome Completo]',
  '[email]@influx.com.br',
  'user',
  NOW(),
  NOW()
);
```

### 2. Criar Perfil de Estudante
```sql
INSERT INTO student_profiles (
  user_id, 
  english_level, 
  learning_goal, 
  total_study_hours, 
  current_book_id, 
  current_unit
)
VALUES (
  '[user_id]',
  'advanced',
  'career',
  450,
  5,
  8
);
```

### 3. Adicionar Progresso em Livros (Book 1-5)
```sql
INSERT INTO student_book_progress (user_id, book_id, progress_percentage, completed_at, started_at)
VALUES
  ('[user_id]', 1, 100, NOW(), DATE_SUB(NOW(), INTERVAL 2 YEAR)),
  ('[user_id]', 2, 100, DATE_SUB(NOW(), INTERVAL 18 MONTH), DATE_SUB(NOW(), INTERVAL 20 MONTH)),
  ('[user_id]', 3, 100, DATE_SUB(NOW(), INTERVAL 12 MONTH), DATE_SUB(NOW(), INTERVAL 14 MONTH)),
  ('[user_id]', 4, 100, DATE_SUB(NOW(), INTERVAL 6 MONTH), DATE_SUB(NOW(), INTERVAL 8 MONTH)),
  ('[user_id]', 5, 83, NULL, DATE_SUB(NOW(), INTERVAL 3 MONTH));
```

### 4. Adicionar Dados de Gamificação (Streak)
```sql
INSERT INTO daily_streaks (user_id, current_streak, longest_streak, last_activity_date)
VALUES ('[user_id]', 45, 60, CURDATE());
```

### 5. Adicionar Progresso de Prática
```sql
INSERT INTO student_practice_progress (user_id, lesson_id, score, completed_at)
VALUES
  ('[user_id]', 1, 95, DATE_SUB(NOW(), INTERVAL 30 DAY)),
  ('[user_id]', 2, 88, DATE_SUB(NOW(), INTERVAL 25 DAY)),
  ('[user_id]', 3, 92, DATE_SUB(NOW(), INTERVAL 20 DAY)),
  ('[user_id]', 4, 90, DATE_SUB(NOW(), INTERVAL 15 DAY)),
  ('[user_id]', 5, 85, DATE_SUB(NOW(), INTERVAL 10 DAY)),
  ('[user_id]', 6, 78, DATE_SUB(NOW(), INTERVAL 5 DAY));
```

### 6. Adicionar inFlux Dollars
```sql
INSERT INTO influx_dollars (user_id, balance, total_earned, total_spent, updated_at)
VALUES ('[user_id]', 2500, 5000, 2500, NOW());
```

### 7. Adicionar Dados do Sponte (se aplicável)
```sql
INSERT INTO sponte_data (
  user_id, 
  sponte_id, 
  matricula, 
  turma, 
  nota_media, 
  frequencia, 
  status
)
VALUES (
  '[user_id]',
  'SPONTE-[id]',
  'MAT-2024-[numero]',
  'Turma Avançado',
  9.65,
  99.0,
  'ativo'
);
```

### 8. Atribuir ID Único
```sql
UPDATE users SET student_id = '[próximo_id]' WHERE id = '[user_id]';
```

### 9. Criar Link Personalizado
```sql
INSERT INTO personalized_links (user_id, link_hash, created_at, expires_at)
VALUES (
  '[user_id]',
  SHA2(CONCAT('[user_id]', NOW(), RAND()), 256),
  NOW(),
  DATE_ADD(NOW(), INTERVAL 30 DAY)
);
```

## Dados de Demonstração Padrão

### Níveis de Inglês
- beginner, elementary, pre_intermediate, intermediate, upper_intermediate, advanced

### Objetivos de Aprendizado
- career, travel, studies, personal, certification

### Livros inFlux
- Book 1 (A1), Book 2 (A2), Book 3 (B1), Book 4 (B2), Book 5 (C1)

## Perfis Criados
1. Sara Leite (Teacher) - ID: 30024
2. Jenifer Borges (Coordenadora) - ID: 30025
