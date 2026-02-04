# 🏗️ Arquitetura Técnica e Features Prioritárias
## inFlux Learning Experience 2.0

---

## PRIORIZAÇÃO: O QUE IMPLEMENTAR PRIMEIRO?

Usando a matriz **Impacto x Esforço**, priorizamos as features que entregam mais valor com menos complexidade:

### 🟢 QUICK WINS (Alto Impacto, Baixo Esforço)

| Feature | Impacto | Esforço | Prazo |
|---------|---------|---------|-------|
| Sistema de Pontos Básico | ⭐⭐⭐⭐⭐ | 🔧🔧 | 1 semana |
| Quiz Interativo por Lesson | ⭐⭐⭐⭐⭐ | 🔧🔧 | 1 semana |
| Streak de Dias Consecutivos | ⭐⭐⭐⭐ | 🔧 | 3 dias |
| Badges Visuais | ⭐⭐⭐⭐ | 🔧🔧 | 1 semana |
| Leaderboard por Turma | ⭐⭐⭐⭐ | 🔧🔧 | 1 semana |

### 🟡 PROJETOS ESTRATÉGICOS (Alto Impacto, Médio Esforço)

| Feature | Impacto | Esforço | Prazo |
|---------|---------|---------|-------|
| Micro-Animações (já temos pipeline) | ⭐⭐⭐⭐⭐ | 🔧🔧🔧 | 2 semanas |
| Músicas Originais por Lesson | ⭐⭐⭐⭐⭐ | 🔧🔧🔧 | 2 semanas |
| Gravação de Pronúncia | ⭐⭐⭐⭐ | 🔧🔧🔧 | 2 semanas |
| Desafios Semanais | ⭐⭐⭐⭐ | 🔧🔧 | 1 semana |

### 🔴 MOONSHOTS (Alto Impacto, Alto Esforço)

| Feature | Impacto | Esforço | Prazo |
|---------|---------|---------|-------|
| Análise de Pronúncia com IA | ⭐⭐⭐⭐⭐ | 🔧🔧🔧🔧🔧 | 4 semanas |
| Speed Friending Virtual | ⭐⭐⭐⭐ | 🔧🔧🔧🔧 | 3 semanas |
| Integração Spotify | ⭐⭐⭐ | 🔧🔧🔧🔧 | 3 semanas |

---

## 🎯 MVP RECOMENDADO: "LESSON QUEST"

Para a primeira versão, focamos em transformar cada lesson em uma **quest gamificada** com:

### Componentes do MVP

```
┌─────────────────────────────────────────────────────────────────┐
│                        LESSON QUEST                              │
├─────────────────────────────────────────────────────────────────┤
│  📺 WATCH                                                        │
│  • Micro-animação (30-60s) com os chunks                        │
│  • Legendas EN + PT                                              │
│  • +10 pontos por assistir                                       │
├─────────────────────────────────────────────────────────────────┤
│  🎵 LISTEN                                                       │
│  • Música original da lesson                                     │
│  • Letra com chunks destacados                                   │
│  • +15 pontos por ouvir completo                                │
├─────────────────────────────────────────────────────────────────┤
│  📝 PRACTICE                                                     │
│  • Quiz de 10 questões                                           │
│  • Fill-in-the-blank, matching, multiple choice                 │
│  • +5 pontos por acerto                                          │
├─────────────────────────────────────────────────────────────────┤
│  🎙️ SPEAK                                                        │
│  • Gravar pronúncia de 3 chunks                                  │
│  • Comparar com áudio nativo                                     │
│  • +20 pontos por gravação                                       │
├─────────────────────────────────────────────────────────────────┤
│  🏆 COMPLETE                                                     │
│  • Badge da lesson desbloqueada                                  │
│  • Progresso salvo                                               │
│  • Próxima lesson liberada                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ MODELO DE DADOS (Extensões ao Schema Atual)

### Novas Tabelas Necessárias

```typescript
// Sistema de Pontos
export const studentPoints = mysqlTable("student_points", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  totalPoints: int("total_points").default(0).notNull(),
  currentLevel: int("current_level").default(1).notNull(),
  currentStreak: int("current_streak").default(0).notNull(),
  longestStreak: int("longest_streak").default(0).notNull(),
  lastActivityDate: timestamp("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Histórico de Pontos
export const pointTransactions = mysqlTable("point_transactions", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  points: int("points").notNull(),
  action: mysqlEnum("action", [
    "watch_video", "complete_quiz", "record_audio", 
    "daily_login", "streak_bonus", "challenge_complete",
    "badge_earned", "lesson_complete"
  ]).notNull(),
  relatedId: int("related_id"), // ID da lesson, quiz, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Badges do Aluno
export const studentBadges = mysqlTable("student_badges", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  badgeId: varchar("badge_id", { length: 50 }).notNull(),
  badgeName: varchar("badge_name", { length: 100 }).notNull(),
  badgeDescription: text("badge_description"),
  badgeIcon: varchar("badge_icon", { length: 255 }),
  category: mysqlEnum("category", [
    "lesson", "streak", "pronunciation", "social", "special"
  ]).notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

// Progresso em Quizzes
export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  lessonId: int("lesson_id").notNull(),
  score: int("score").notNull(),
  totalQuestions: int("total_questions").notNull(),
  timeSpentSeconds: int("time_spent_seconds"),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// Gravações de Áudio
export const audioRecordings = mysqlTable("audio_recordings", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  lessonId: int("lesson_id").notNull(),
  chunkId: int("chunk_id"),
  audioUrl: varchar("audio_url", { length: 512 }).notNull(),
  duration: int("duration"), // em segundos
  pronunciationScore: decimal("pronunciation_score", { precision: 5, scale: 2 }),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Músicas por Lesson
export const lessonSongs = mysqlTable("lesson_songs", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lesson_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 100 }).default("inFlux Music").notNull(),
  audioUrl: varchar("audio_url", { length: 512 }).notNull(),
  karaokeUrl: varchar("karaoke_url", { length: 512 }),
  lyrics: text("lyrics").notNull(),
  lyricsWithChunks: json("lyrics_with_chunks"), // Letra com marcação dos chunks
  duration: int("duration"), // em segundos
  genre: varchar("genre", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Desafios Semanais
export const weeklyChallenges = mysqlTable("weekly_challenges", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  challengeType: mysqlEnum("challenge_type", [
    "quiz_score", "recordings", "streak", "social", "creative"
  ]).notNull(),
  targetValue: int("target_value").notNull(),
  rewardPoints: int("reward_points").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Progresso em Desafios
export const challengeProgress = mysqlTable("challenge_progress", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  challengeId: int("challenge_id").notNull(),
  currentValue: int("current_value").default(0).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
});
```

---

## 🎵 GERAÇÃO DE MÚSICAS: COMO FUNCIONA

### Processo de Criação

1. **Input**: Lista de chunks da lesson + tema/contexto
2. **Geração de Letra**: IA cria letra incorporando todos os chunks
3. **Geração de Áudio**: Suno AI ou similar para criar a música
4. **Pós-produção**: Ajustes e versão karaokê
5. **Upload**: CDN + banco de dados

### Exemplo de Prompt para Geração de Letra

```
Crie uma letra de música pop/lo-fi em inglês para adolescentes.
A música deve incorporar naturalmente os seguintes chunks:
- out of the blue (inesperadamente)
- green with envy (morto de inveja)
- red tape (burocracia)
- straighten up (endireitar, organizar)
- draw the line (estabelecer limite)
- inside out (do avesso)
- upside down (de ponta cabeça)

Tema: Um dia caótico que termina bem
Tom: Otimista, divertido, relatable
Estrutura: Verso 1, Refrão, Verso 2, Refrão, Bridge, Refrão final
```

### APIs/Ferramentas para Música

| Ferramenta | Uso | Custo |
|------------|-----|-------|
| Suno AI | Geração de música completa | $10/mês |
| ElevenLabs | Voz para versões faladas | Já temos |
| Mubert | Música instrumental/background | Freemium |
| AIVA | Composição clássica/orquestral | $15/mês |

---

## 📱 WIREFRAMES CONCEITUAIS

### Tela Principal: Lesson Quest

```
┌─────────────────────────────────────────┐
│  ← Book 5 • Unit 3                      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🎬 LESSON 5                     │   │
│  │  Shapes and Colors               │   │
│  │                                  │   │
│  │  ████████████░░░░░ 65%          │   │
│  │  245 pontos ganhos               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 📺      │ │ 🎵      │ │ 📝      │   │
│  │ WATCH   │ │ LISTEN  │ │ PRACTICE│   │
│  │ ✅ Done │ │ ✅ Done │ │ 🔓 Start│   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│  ┌─────────┐ ┌─────────┐               │
│  │ 🎙️      │ │ 🏆      │               │
│  │ SPEAK   │ │ BADGE   │               │
│  │ 🔒 Lock │ │ 🔒 Lock │               │
│  └─────────┘ └─────────┘               │
│                                         │
│  ─────────────────────────────────────  │
│  📊 Seu Progresso                       │
│  🔥 Streak: 12 dias                     │
│  ⭐ Nível: 8 (Chunk Collector)          │
│  🏅 Badges: 15                          │
└─────────────────────────────────────────┘
```

### Tela: Quiz Interativo

```
┌─────────────────────────────────────────┐
│  Questão 3 de 10          ⏱️ 0:45       │
│                                         │
│  Complete a frase:                      │
│                                         │
│  "She showed up _________ and           │
│   surprised everyone at the party."     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  A) in the red                   │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  B) out of the blue ✓           │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  C) green with envy              │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  D) red tape                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ████████░░░░░░░░░░░░░░░ 30%           │
└─────────────────────────────────────────┘
```

---

## 🚀 PLANO DE IMPLEMENTAÇÃO DETALHADO

### Sprint 1 (Semana 1-2): Fundação

**Objetivo**: Sistema de pontos e gamificação básica

- [ ] Criar tabelas de pontos, badges e transações
- [ ] Implementar API de pontos (ganhar, consultar, histórico)
- [ ] Criar componente de nível/XP bar
- [ ] Implementar streak de dias consecutivos
- [ ] Criar página de perfil com estatísticas

### Sprint 2 (Semana 3-4): Quiz System

**Objetivo**: Quizzes interativos para cada lesson

- [ ] Criar banco de questões por lesson (10+ por lesson)
- [ ] Implementar tipos de questão (multiple choice, fill blank, matching)
- [ ] Sistema de pontuação e feedback
- [ ] Integração com sistema de pontos
- [ ] Animações de acerto/erro

### Sprint 3 (Semana 5-6): Conteúdo Multimídia

**Objetivo**: Músicas e animações integradas

- [ ] Gerar músicas para Lessons 1-6
- [ ] Player de música com letra sincronizada
- [ ] Integrar animações existentes
- [ ] Sistema de progresso por mídia assistida
- [ ] Karaokê mode básico

### Sprint 4 (Semana 7-8): Pronúncia e Áudio

**Objetivo**: Gravação e feedback de pronúncia

- [ ] Componente de gravação de áudio
- [ ] Upload para S3 e persistência
- [ ] Comparação lado-a-lado com nativo
- [ ] Score básico de pronúncia
- [ ] Histórico de gravações

### Sprint 5 (Semana 9-10): Social e Desafios

**Objetivo**: Engajamento social e competição

- [ ] Leaderboard por turma e geral
- [ ] Sistema de desafios semanais
- [ ] Notificações de conquistas
- [ ] Compartilhamento de badges
- [ ] Integração com Reading Club

---

## 📊 KPIs E MÉTRICAS

### Métricas de Engajamento
- DAU/MAU (Daily/Monthly Active Users)
- Tempo médio por sessão
- Taxa de conclusão de lessons
- Streak médio dos alunos

### Métricas de Aprendizado
- Score médio em quizzes
- Evolução de pronúncia ao longo do tempo
- Retenção de chunks (quiz de revisão)
- Chunks mais difíceis (taxa de erro)

### Métricas de Gamificação
- Distribuição de níveis
- Badges mais conquistadas
- Desafios mais completados
- Uso de influxcoin

---

## 💰 ESTIMATIVA DE RECURSOS

### Desenvolvimento
- 1 desenvolvedor full-stack: 10 semanas
- Design de UI/UX: 2 semanas
- QA e testes: 2 semanas

### Conteúdo
- Músicas (30 lessons × $50/música): $1,500
- Animações adicionais: Já temos pipeline
- Questões de quiz: Interno

### Infraestrutura
- Armazenamento de áudio (S3): ~$50/mês
- Processamento de áudio: ~$30/mês
- APIs de IA: ~$100/mês

---

*Documento técnico - inFlux Learning Experience 2.0*
*Versão 1.0 - Fevereiro 2026*
