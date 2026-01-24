# 🔗 Mapeamento de Integração - Personal Tutor com Banco Centralizado

**Data:** 24 de janeiro de 2026  
**Estratégia:** Opção A - Reutilizar Tabelas Existentes

---

## 📊 Tabelas Existentes no Banco Centralizado

### 1. **users** (Autenticação)
✅ **100% compatível** - Já usamos esta tabela

**Campos principais:**
- `id`, `openId`, `name`, `email`, `passwordHash`
- `role` (admin, user, student)
- `status` (ativo, inativo, desistente, trancado)
- `sponteId` - Integração com Sponte

**Status:** 134 usuários cadastrados

---

### 2. **students** (Dados Cadastrais dos Alunos)
✅ **Usar esta tabela** para dados cadastrais

**Campos principais:**
- `id`, `matricula`, `name`, `cpf`, `rg`
- `gender`, `birthDate`, `phone`, `email`, `address`
- `status` (Ativo, Bolsista, Desistente, Formado, Inativo, Trancado, etc.)
- `responsibleName`, `responsiblePhone`, `responsibleEmail`
- `notes`, `metadata` (JSON)
- `unidade_id` - FK para unidades

**Status:** 134 alunos cadastrados

---

### 3. **student_intelligence** (Inteligência sobre Aprendizado)
✅ **Usar esta tabela** para perfil de aprendizado

**Campos principais:**
- `id`, `contact_phone` (UNIQUE), `student_id`
- `interest_profile` - Perfil de interesses
- `pain_points` - Pontos de dor/dificuldade
- `learning_style` - enum: visual, auditivo, cinestético, leitura_escrita
- `current_level` - Nível atual (Book 1, Book 2, etc.)
- `mastered_topics` (JSON) - Tópicos dominados
- `struggling_topics` (JSON) - Tópicos com dificuldade
- `confidence_score` - Pontuação de confiança
- `last_tutor_sync` - Última sincronização com tutor
- `metadata` (JSON)

**Status:** 0 registros (tabela vazia, pronta para usar!)

---

### 4. **tutor_interactions** (Sessões do Tutor)
✅ **Usar esta tabela** para registrar interações

**Campos principais:**
- `id`, `intelligence_id`, `student_id`
- `session_type` - enum: conversacao, gramatica, vocabulario, pronuncia, revisao, avaliacao
- `session_summary` - Resumo da sessão
- `duration_minutes` - Duração em minutos
- `mastered_chunks` (JSON) - Chunks dominados na sessão
- `struggled_chunks` (JSON) - Chunks com dificuldade
- `student_rating` - Avaliação do aluno
- `student_feedback` - Feedback do aluno
- `next_recommendations` (JSON) - Recomendações para próxima sessão
- `interaction_date`
- `metadata` (JSON)

**Status:** 0 registros (pronta para usar!)

---

### 5. **tutor_blog_tips** (Dicas do Blog)
✅ **Usar esta tabela** para recomendações de conteúdo

**Campos principais:**
- `id`, `intelligence_id`
- `blog_post_url` - URL do post do blog
- `blog_post_title` - Título do post
- `recommendation_reason` - Motivo da recomendação
- `viewed` - Se foi visualizado (boolean)
- `sent_at`, `viewed_at`

**Status:** 0 registros (pronta para usar!)

---

## 🆕 Tabelas Novas a Criar

### 1. **tutor_conversations** (Conversas do Chat)
Armazena conversas completas do aluno com o tutor IA

```sql
CREATE TABLE tutor_conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  intelligence_id INT,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (intelligence_id) REFERENCES student_intelligence(id)
);
```

---

### 2. **tutor_messages** (Mensagens do Chat)
Armazena mensagens individuais

```sql
CREATE TABLE tutor_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  role ENUM('user', 'assistant', 'system') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES tutor_conversations(id) ON DELETE CASCADE
);
```

---

### 3. **tutor_chunks** (Chunks de Conteúdo)
Armazena chunks do material didático

```sql
CREATE TABLE tutor_chunks (
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
);
```

---

### 4. **tutor_student_progress** (Progresso do Aluno)
Rastreia progresso em chunks específicos

```sql
CREATE TABLE tutor_student_progress (
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
);
```

---

### 5. **tutor_reading_club** (Reading Club)
Gerencia experiências do Reading Club

```sql
CREATE TABLE tutor_reading_club (
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
);
```

---

## 🔄 Plano de Migração

### Fase 1: Preparação
- [x] Conectar ao banco centralizado
- [x] Analisar schemas existentes
- [ ] Criar tabelas novas (tutor_conversations, tutor_messages, tutor_chunks, tutor_student_progress, tutor_reading_club)

### Fase 2: Migração de Dados
- [ ] Migrar Laís e Camila para tabela `students` (se ainda não existirem)
- [ ] Criar registros em `student_intelligence` para ambas
- [ ] Popular `tutor_chunks` com conteúdo dos Books

### Fase 3: Atualização do Código
- [ ] Atualizar `drizzle/schema.ts` para usar tabelas centralizadas
- [ ] Modificar `server/db.ts` para apontar para `CENTRAL_DATABASE_URL`
- [ ] Ajustar todas as queries para novo schema
- [ ] Atualizar procedures do tRPC

### Fase 4: Testes
- [ ] Testar login com dados centralizados
- [ ] Validar dashboard com dados reais
- [ ] Testar chat e salvamento de conversas
- [ ] Verificar sincronização entre sistemas

---

## ✅ Vantagens da Integração

1. **Single Source of Truth**: Todos os dados em um único lugar
2. **Sincronização Automática**: Mudanças refletem instantaneamente
3. **Inteligência Compartilhada**: `student_intelligence` alimenta ambos os sistemas
4. **Escalabilidade**: Fácil adicionar novos módulos ao ecossistema
5. **Análise Integrada**: Cruzamento de dados entre Personal Tutor e sistema principal

---

*Documento criado em 24/01/2026 às 08:35*
