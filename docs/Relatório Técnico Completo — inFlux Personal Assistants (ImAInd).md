# Relatório Técnico Completo — inFlux Personal Assistants (ImAInd)

**Data:** Abril 2026  
**Versão:** 02aa0b0d  
**Status:** Produção com Vídeo de Onboarding Integrado

---

## 📋 Sumário Executivo

O **inFlux Personal Assistants** é uma plataforma web full-stack de tutoria de inglês personalizada, construída com **React 19 + Express 4 + tRPC 11 + MySQL** e integrada com múltiplos serviços de IA (OpenAI, Gemini, ElevenLabs, Google Cloud TTS). A arquitetura segue o padrão **tRPC-first**, onde todos os endpoints são procedures tipadas que garantem segurança de tipos end-to-end.

**Públicos-alvo:**
- 258 alunos ativos (distribuição por nível: beginner, elementary, intermediate, upper_intermediate, advanced, proficient)
- 3 escolas inFlux (Jundiaí, Retiro, etc.)
- Professores e administradores da inFlux

**Principais features:**
- ✅ Tutoria personalizada com Miss Elie (IA + voz ElevenLabs)
- ✅ Chat interativo com histórico de conversas
- ✅ Prática de pronúncia com análise de áudio
- ✅ Gamificação (badges, pontos, leaderboard)
- ✅ Integração com Sponte (gestão escolar)
- ✅ Leitura de livros com progresso sincronizado
- ✅ Exercícios extras e quizzes
- ✅ Dashboard administrativo com sincronização de dados
- ✅ Vídeo de onboarding com a Miss Elie em português

---

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENTE (Frontend)                           │
│  React 19 + Tailwind 4 + shadcn/ui + Framer Motion             │
│  ├─ Student Dashboard (alunos)                                 │
│  ├─ Admin Dashboard (professores/coordenadores)                │
│  ├─ Chat com Miss Elie (IA)                                    │
│  ├─ Voice Chat (pronúncia)                                     │
│  ├─ Reading Club (livros)                                      │
│  ├─ Gamification (badges, leaderboard)                         │
│  └─ Onboarding com vídeo 9:16 (Miss Elie)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓ tRPC
┌─────────────────────────────────────────────────────────────────┐
│              API GATEWAY (tRPC + Express)                        │
│  /api/trpc/* — 40+ routers com 200+ procedures                 │
│  Autenticação: OAuth Manus + Password (bcrypt)                 │
│  Sessões: JWT + Cookies (HttpOnly, SameSite=Lax)              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│           BACKEND LOGIC (Node.js + Drizzle ORM)                │
│  ├─ Chat Router (conversas, histórico)                         │
│  ├─ Tutor Router (Miss Elie personalizada)                     │
│  ├─ Pronunciation Router (análise de áudio)                    │
│  ├─ Student Router (perfil, objetivos, progresso)             │
│  ├─ Admin Router (gestão de alunos, sincronização)            │
│  ├─ Sponte Sync Router (integração com gestão escolar)        │
│  ├─ Gamification Router (badges, pontos, leaderboard)         │
│  ├─ TTS Router (síntese de voz ElevenLabs)                    │
│  ├─ LLM Router (OpenAI, Gemini)                               │
│  └─ 30+ outros routers especializados                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              BANCO DE DADOS (MySQL)                             │
│  ├─ Banco Local (SQLite dev, MySQL prod)                       │
│  ├─ Banco Centralizado (CENTRAL_DATABASE_URL)                  │
│  └─ 56 tabelas com relações complexas                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│           INTEGRAÇÕES EXTERNAS (APIs)                           │
│  ├─ OpenAI (GPT-4, embeddings)                                 │
│  ├─ Google Gemini (análise de conteúdo)                        │
│  ├─ ElevenLabs (síntese de voz — Voice ID: mmhTWXIU9zlmbfIMh4y0)
│  ├─ Google Cloud TTS (alternativa)                            │
│  ├─ Sponte (gestão escolar, sincronização)                    │
│  ├─ Manus Built-in Forge API (notificações, storage)          │
│  └─ Google Maps (integração de mapas)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Banco de Dados (MySQL)

### Tabelas Principais (56 total)

#### **Autenticação & Usuários**
| Tabela | Descrição | Campos-chave |
|--------|-----------|--------------|
| `users` | Usuários (alunos, professores, admins) | id, openId, email, passwordHash, role, lastSignedIn |
| `studentProfiles` | Perfil detalhado do aluno | userId, objective, currentLevel, totalHoursLearned, streakDays |

#### **Conversas & Mensagens**
| Tabela | Descrição | Campos-chave |
|--------|-----------|--------------|
| `conversations` | Sessões de chat/tutor | id, studentId, simulationType, startedAt, endedAt |
| `messages` | Mensagens (user/assistant) | id, conversationId, role, content, chunksUsed |
| `chatMemory` | Memória contextual do chat | conversationId, context, summary |

#### **Conteúdo Educacional**
| Tabela | Descrição | Campos-chave |
|--------|-----------|--------------|
| `chunks` | Frases/expressões de inglês | englishChunk, portugueseEquivalent, level, context |
| `lessons` | Lições estruturadas | id, title, description, level, unitId |
| `units` | Unidades de estudo | id, bookId, title, orderInBook |
| `books` | Livros (Book 1, 2, 3, 4) | id, title, level, totalUnits |
| `exercises` | Exercícios por lição | id, lessonId, type, content, correctAnswer |
| `extraExercises` | Exercícios adicionais | id, studentId, type, difficulty |

#### **Progresso & Gamificação**
| Tabela | Descrição | Campos-chave |
|--------|-----------|--------------|
| `studentChunkProgress` | Progresso em chunks | studentId, chunkId, masteredAt, reviewCount |
| `studentBookProgress` | Progresso em livros | studentId, bookId, currentUnit, percentComplete |
| `studentTopicProgress` | Progresso por tópico | studentId, topicId, completedAt |
| `exerciseResults` | Resultados de exercícios | studentId, exerciseId, score, attemptedAt |
| `studentBadges` | Badges conquistadas | studentId, badgeId, earnedAt |
| `badgeDefinitions` | Definições de badges | id, name, description, icon |
| `leaderboard` | Ranking de alunos | studentId, totalPoints, rank, lastUpdated |
| `pointsHistory` | Histórico de pontos | studentId, points, reason, earnedAt |

#### **Leitura & Biblioteca**
| Tabela | Descrição | Campos-chave |
|--------|-----------|--------------|
| `libraryBooks` | Livros da biblioteca | id, title, author, level, coverUrl |
| `libraryLoans` | Empréstimos de livros | studentId, bookId, borrowedAt, returnedAt |
| `readingClubEvents` | Eventos de leitura | id, title, bookId, startDate, endDate |
| `readingClubPosts` | Posts no clube de leitura | id, eventId, studentId, content, createdAt |
| `readingClubComments` | Comentários em posts | id, postId, studentId, content |

#### **Integrações Externas**
| Tabela | Descrição | Campos-chave |
|--------|-----------|--------------|
| `studentImportedData` | Dados importados de Sponte | studentId, sponteId, syncedAt |
| `backToSchoolCampaign` | Campanha volta às aulas | id, title, startDate, endDate |
| `schoolActivities` | Atividades escolares | id, title, description, schoolId |
| `culturalEvents` | Eventos culturais | id, title, date, description |

#### **Recursos & Materiais**
| Tabela | Descrição | Campos-chave |
|--------|-----------|--------------|
| `exclusiveMaterials` | Materiais exclusivos | id, title, type, accessLevel, uploadedAt |
| `materialStudentShare` | Compartilhamento com alunos | materialId, studentId, sharedAt |
| `materialClassShare` | Compartilhamento com turmas | materialId, classId, sharedAt |

#### **Gamificação Avançada**
| Tabela | Descrição | Campos-chave |
|--------|-----------|--------------|
| `influxDollarTransactions` | Transações de moeda virtual | studentId, amount, reason, transactedAt |
| `studentInfluxDollars` | Saldo de moeda virtual | studentId, balance, lastUpdated |
| `quizResults` | Resultados de quizzes | studentId, quizId, score, completedAt |
| `passportQRCodes` | QR codes para eventos | id, code, eventId, scannedBy, scannedAt |

#### **Outras Tabelas**
| Tabela | Descrição |
|--------|-----------|
| `spacedRepetitionSchedule` | Agendamento de revisão espaçada |
| `studentCourses` | Cursos inscritos por aluno |
| `studentObjectives` | Objetivos personalizados |
| `studentActivityEnrollments` | Inscrições em atividades |
| `vipProfiles` | Perfis VIP com acesso especial |
| `miningSession` | Sessões de "mineração" de conteúdo |
| `miningProgress` | Progresso em mineração |
| `activityTags` | Tags para atividades |
| `activityTagAssociations` | Associações de tags |
| `alerts` | Alertas do sistema |
| `passportQRCodes` | Códigos QR de passaporte |
| `personalizedLinks` | Links personalizados por aluno |

---

## 🔌 Routers (APIs tRPC) — 40+ Routers

### Estrutura de Routers

```typescript
appRouter = {
  // Autenticação
  auth: { me, logout }
  authPassword: { login, changePassword, setInitialPassword }
  directLogin: { loginWithToken }
  
  // Chat & Tutoria
  chat: { sendMessage, getHistory, clearHistory, ... }
  tutor: { getTutorResponse, getProfile, ... }
  tutorPersonalized: { getPersonalizedResponse, ... }
  tutorPersonalizedV2: { advancedTutoring, ... }
  elliesSupport: { getEllieResponse, ... }
  
  // Pronúncia & Áudio
  pronunciation: { analyzePronunciation, recordAudio, ... }
  voiceChat: { startVoiceSession, recordAndAnalyze, ... }
  tts: { generateSpeech, speakText, ... }
  
  // Perfil & Dados do Aluno
  student: { getProfile, updateProfile, getProgress, ... }
  studentProfile: { getDetailedProfile, updateObjectives, ... }
  studentPersonalization: { getPersonalizedContent, ... }
  studentData: { exportStudentData, ... }
  
  // Progresso & Gamificação
  progressTracker: { getProgress, trackActivity, ... }
  gamification: { earnBadge, updatePoints, getLeaderboard, ... }
  badges: { getBadges, earnBadge, ... }
  quizLeaderboard: { getLeaderboard, submitQuiz, ... }
  
  // Leitura & Biblioteca
  readingClub: { getEvents, postComment, joinEvent, ... }
  
  // Exercícios
  lessons: { getLesson, getExercises, submitAnswer, ... }
  extraExercises: { getExercises, submitAnswer, ... }
  
  // Integrações
  sponteSync: { syncStudents, getStudentData, ... }
  sponteData: { getSponteData, ... }
  webhookSync: { handleWebhook, ... }
  
  // Admin
  admin: { getStudents, updateStudent, exportData, ... }
  adminStudents: { listStudents, updateBulk, ... }
  adminExport: { exportStudents, exportReports, ... }
  
  // Notificações & Comunicação
  notifications: { getNotifications, markAsRead, ... }
  welcomeEmails: { sendWelcomeEmail, ... }
  whatsappMessages: { sendMessage, ... }
  
  // Conteúdo & Materiais
  materialUpload: { uploadMaterial, shareMaterial, ... }
  personalizedLinks: { getLinks, createLink, ... }
  personalizedContent: { getContent, ... }
  
  // Relatórios & Análise
  reports: { getStudentReport, getClassReport, ... }
  crossAnalysis: { analyzeTrends, ... }
  
  // Eventos & Atividades
  schoolActivities: { getActivities, enrollStudent, ... }
  culturalEvents: { getEvents, registerEvent, ... }
  backToSchool: { getCampaignData, ... }
  
  // Outros
  gemini: { analyzeContent, ... }
  scheduler: { scheduleTask, ... }
  bulkConfig: { configureBulk, ... }
  dailySync: { runDailySync, ... }
  userManagement: { createUser, updateUser, ... }
  dashboardIntegration: { getDashboardData, ... }
  dashboardSync: { syncDashboard, ... }
  studentCourses: { getCourses, enrollCourse, ... }
  passportQR: { generateQR, scanQR, ... }
  vipProfiles: { getVIPProfile, ... }
  historicoMiner: { mineHistory, ... }
  elieSyncRouter: { syncElieData, ... }
}
```

---

## 🔐 Autenticação & Segurança

### Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────────┐
│ 1. OAUTH MANUS (Padrão)                                     │
│    /api/oauth/callback → cria sessão JWT                    │
│    Cookie: MANUS_SESSION (HttpOnly, SameSite=Lax)          │
└─────────────────────────────────────────────────────────────┘
                          OU
┌─────────────────────────────────────────────────────────────┐
│ 2. PASSWORD LOGIN (Alternativo)                             │
│    POST /api/trpc/authPassword.login                        │
│    Email + Senha (bcrypt hash)                              │
│    Busca no CENTRAL_DATABASE_URL                            │
│    Cria token JWT + cookie                                  │
└─────────────────────────────────────────────────────────────┘
                          OU
┌─────────────────────────────────────────────────────────────┐
│ 3. DIRECT LOGIN (Desenvolvimento)                           │
│    GET /api/direct-login/:token                             │
│    Token temporário para testes                             │
└─────────────────────────────────────────────────────────────┘
```

### Roles & Permissões

| Role | Permissões |
|------|-----------|
| `user` | Acesso ao dashboard do aluno, chat, lições, exercícios |
| `admin` | Gestão de alunos, sincronização, relatórios, exportação |
| `owner` | Acesso total (Estevao Cordeiro) |

### Proteção de Procedures

```typescript
publicProcedure      // Sem autenticação (login, logout)
protectedProcedure   // Requer autenticação (user ou admin)
adminProcedure       // Requer role === 'admin'
```

---

## 🌐 Integrações Externas

### 1. **OpenAI (GPT-4)**
- **Uso:** Geração de respostas do tutor, análise de conteúdo
- **Variável:** `OPENAI_API_KEY`
- **Endpoints:** `invokeLLM()` em `server/_core/llm.ts`

### 2. **Google Gemini**
- **Uso:** Análise de conteúdo alternativa
- **Variável:** `GEMINI_API_KEY`
- **Router:** `gemini.ts`

### 3. **ElevenLabs (Síntese de Voz)**
- **Uso:** Voz da Miss Elie, TTS para lições
- **Variável:** `ELEVENLABS_API_KEY`
- **Voice ID da Elie:** `mmhTWXIU9zlmbfIMh4y0` (Mia)
- **Configuração:** `server/_core/textToSpeech.ts`
- **Stability:** 0.5 | **Similarity Boost:** 0.75 | **Model:** eleven_multilingual_v2

### 4. **Google Cloud TTS**
- **Uso:** Alternativa para síntese de voz
- **Variável:** `GOOGLE_CLOUD_TTS_API_KEY`

### 5. **Sponte (Gestão Escolar)**
- **Uso:** Sincronização de alunos, dados de turmas
- **Variáveis:** `SPONTE_LOGIN`, `SPONTE_PASSWORD`, `SPONTE_API_URL`
- **Routers:** `sponte-sync.ts`, `sponte-data.ts`
- **Frequência:** Sincronização diária via `daily-sync.ts`

### 6. **Manus Built-in Forge API**
- **Uso:** Notificações, storage S3, data API
- **Variáveis:** `BUILT_IN_FORGE_API_KEY`, `BUILT_IN_FORGE_API_URL`
- **Helpers:** `server/_core/notification.ts`, `server/storage.ts`

### 7. **Google Maps**
- **Uso:** Integração de mapas no componente `Map.tsx`
- **Proxy:** Autenticação automática via Manus

---

## 📁 Estrutura de Diretórios

```
influx-assistants/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/                   # Páginas principais
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── StudentDashboard.tsx # Dashboard do aluno
│   │   │   ├── Chat.tsx             # Chat com Miss Elie
│   │   │   ├── VoiceChatPage.tsx    # Pronúncia
│   │   │   ├── Login.tsx            # Login
│   │   │   └── ...
│   │   ├── components/              # Componentes reutilizáveis
│   │   │   ├── DashboardLayout.tsx  # Layout do dashboard
│   │   │   ├── AIChatBox.tsx        # Chat box
│   │   │   ├── OnboardingTutorial.tsx # Onboarding
│   │   │   ├── WelcomeVideoModal.tsx # Vídeo de boas-vindas
│   │   │   ├── BadgesDisplay.tsx    # Badges
│   │   │   ├── LeaderboardWidget.tsx # Leaderboard
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── trpc.ts              # Cliente tRPC
│   │   │   └── ...
│   │   ├── _core/
│   │   │   └── hooks/
│   │   │       └── useAuth.ts       # Hook de autenticação
│   │   ├── App.tsx                  # Roteamento principal
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Estilos globais
│   ├── public/                      # Assets estáticos
│   └── index.html
│
├── server/                          # Backend Node.js
│   ├── routers/                     # 40+ tRPC routers
│   │   ├── chat.ts                  # Chat com IA
│   │   ├── tutor.ts                 # Tutoria básica
│   │   ├── tutor-personalized-v2.ts # Tutoria avançada
│   │   ├── pronunciation.ts         # Análise de pronúncia
│   │   ├── student.ts               # Dados do aluno
│   │   ├── admin-students.ts        # Gestão de alunos
│   │   ├── sponte-sync.ts           # Sincronização Sponte
│   │   ├── gamification.ts          # Gamificação
│   │   ├── tts.ts                   # Síntese de voz
│   │   ├── auth-password.ts         # Login com senha
│   │   └── ...
│   ├── _core/                       # Infraestrutura
│   │   ├── trpc.ts                  # Configuração tRPC
│   │   ├── context.ts               # Contexto de requisição
│   │   ├── llm.ts                   # Integração com LLMs
│   │   ├── textToSpeech.ts          # TTS (ElevenLabs)
│   │   ├── notification.ts          # Notificações
│   │   ├── oauth.ts                 # OAuth Manus
│   │   ├── sdk.ts                   # SDK Manus
│   │   ├── webhook-handler.ts       # Webhooks
│   │   └── ...
│   ├── db.ts                        # Query helpers
│   ├── routers.ts                   # Agregação de routers
│   └── index.ts                     # Entry point
│
├── drizzle/                         # ORM (Drizzle)
│   ├── schema.ts                    # Schema do banco (56 tabelas)
│   └── migrations/                  # Migrações
│
├── shared/                          # Código compartilhado
│   ├── types.ts                     # Tipos TypeScript
│   ├── validation-schemas.ts        # Schemas Zod
│   ├── const.ts                     # Constantes
│   └── situations.ts                # Situações de chat
│
├── storage/                         # S3 helpers
│   └── index.ts                     # Upload/download
│
├── package.json                     # Dependências
├── tsconfig.json                    # Configuração TypeScript
├── vite.config.ts                   # Configuração Vite
├── vitest.config.ts                 # Configuração Vitest
└── drizzle.config.ts                # Configuração Drizzle
```

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React | 19 | UI framework |
| TypeScript | Latest | Type safety |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | Latest | Componentes UI |
| Framer Motion | 12.23 | Animações |
| tRPC Client | 11.6 | Chamadas de API |
| React Query | 5.90 | State management |
| Vite | Latest | Build tool |

### Backend
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Node.js | 22.13 | Runtime |
| Express | 4.21 | HTTP server |
| tRPC | 11.6 | RPC framework |
| TypeScript | Latest | Type safety |
| Drizzle ORM | 0.44 | Database ORM |
| MySQL | 8+ | Database |
| Zod | Latest | Schema validation |

### Integrações & APIs
| Serviço | Versão | Uso |
|---------|--------|-----|
| OpenAI | GPT-4 | LLM |
| Google Gemini | Latest | LLM alternativo |
| ElevenLabs | v1 | TTS (Voice ID: mmhTWXIU9zlmbfIMh4y0) |
| Google Cloud TTS | Latest | TTS alternativo |
| AWS S3 | SDK v3 | File storage |
| Sponte API | v1 | Gestão escolar |
| Manus Forge | Latest | Notificações, storage |

### DevOps & Testing
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Vitest | Latest | Unit testing |
| Docker | Latest | Containerização |
| pnpm | Latest | Package manager |
| Git | Latest | Version control |

---

## 📞 Variáveis de Ambiente

### Banco de Dados
```bash
DATABASE_URL=mysql://user:pass@localhost:3306/influx_local
CENTRAL_DATABASE_URL=mysql://user:pass@central-db:3306/influx_central
```

### Autenticação
```bash
JWT_SECRET=<secret-key-for-jwt>
VITE_APP_ID=<manus-oauth-app-id>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/app-auth
OWNER_OPEN_ID=<owner-open-id>
OWNER_NAME=Estevao Cordeiro
```

### APIs Externas
```bash
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=<gemini-key>
ELEVENLABS_API_KEY=<eleven-labs-key>
GOOGLE_CLOUD_TTS_API_KEY=<google-tts-key>
SPONTE_LOGIN=<sponte-username>
SPONTE_PASSWORD=<sponte-password>
SPONTE_API_URL=https://api.sponte.com.br
```

### Manus Built-in APIs
```bash
BUILT_IN_FORGE_API_KEY=<forge-key>
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge
VITE_FRONTEND_FORGE_API_KEY=<frontend-forge-key>
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/forge
VITE_ANALYTICS_ENDPOINT=<analytics-endpoint>
VITE_ANALYTICS_WEBSITE_ID=<analytics-id>
```

### Webhooks & Segurança
```bash
WEBHOOK_SECRET=<webhook-secret>
NODE_ENV=production
PORT=3000
```

---

## 🔄 Fluxos Principais

### 1. **Fluxo de Login do Aluno**

```
1. Aluno acessa /login
2. Escolhe: OAuth Manus OU Email+Senha
3. Se OAuth:
   → Redireciona para Manus OAuth
   → Callback em /api/oauth/callback
   → Cria sessão JWT
   → Redireciona para /student/dashboard
4. Se Email+Senha:
   → POST /api/trpc/authPassword.login
   → Busca usuário em CENTRAL_DATABASE_URL
   → Verifica bcrypt hash
   → Cria sessão JWT
   → Redireciona para /student/dashboard
5. No dashboard:
   → Exibe WelcomeVideoModal (primeira vez)
   → Vídeo da Miss Elie em português (9:16)
   → Botão "Pular" após 2s
   → Após vídeo: OnboardingTutorial
```

### 2. **Fluxo de Chat com Miss Elie**

```
1. Aluno clica em "Chat com Elie"
2. Abre /student/chat
3. Aluno digita mensagem
4. Frontend: POST /api/trpc/chat.sendMessage
5. Backend:
   → Busca histórico de conversa (conversations table)
   → Injeta system prompt da Elie
   → Injeta perfil do aluno (studentProfiles)
   → Chama OpenAI GPT-4 com contexto
   → Salva mensagem em messages table
   → Retorna resposta
6. Frontend:
   → Exibe resposta com avatar da Elie
   → Opção de ouvir (TTS via ElevenLabs)
   → Salva em localStorage para histórico
```

### 3. **Fluxo de Pronúncia**

```
1. Aluno acessa /student/voice-chat
2. Clica em "Gravar"
3. Frontend: Usa Web Audio API para capturar áudio
4. Aluno fala a frase
5. Clica em "Enviar"
6. Frontend: POST /api/trpc/pronunciation.analyzePronunciation
   → Envia arquivo de áudio (WAV/MP3)
7. Backend:
   → Transcreve com Whisper API
   → Compara com texto esperado
   → Analisa pronúncia (stress, intonation, etc.)
   → Retorna feedback
8. Frontend:
   → Exibe score de pronúncia
   → Mostra áreas de melhoria
   → Oferece tentar novamente
```

### 4. **Fluxo de Sincronização com Sponte**

```
Diariamente (via scheduler):
1. Backend: GET /api/trpc/sponte-sync.syncStudents
2. Conecta à API Sponte com SPONTE_LOGIN/PASSWORD
3. Busca lista de alunos da escola
4. Para cada aluno:
   → Verifica se existe em users table
   → Se não existe: cria novo usuário
   → Se existe: atualiza dados (nome, email, turma)
5. Sincroniza dados em studentImportedData table
6. Atualiza lastSyncedAt
7. Envia notificação de sucesso ao admin
```

### 5. **Fluxo de Gamificação**

```
Quando aluno completa atividade:
1. Backend: POST /api/trpc/gamification.earnBadge
2. Verifica critério do badge
3. Se critério atendido:
   → Insere em studentBadges table
   → Adiciona pontos em pointsHistory
   → Atualiza leaderboard
   → Envia notificação
4. Frontend:
   → Exibe animação de badge conquistado
   → Atualiza contador de pontos
   → Atualiza posição no leaderboard
```

---

## 📊 Diagrama de Entidades (Principais Relações)

```
users (1) ──→ (N) studentProfiles
users (1) ──→ (N) conversations
users (1) ──→ (N) studentBadges
users (1) ──→ (N) pointsHistory
users (1) ──→ (N) studentChunkProgress
users (1) ──→ (N) studentBookProgress

conversations (1) ──→ (N) messages
conversations (1) ──→ (N) chatMemory

lessons (1) ──→ (N) exercises
lessons (1) ──→ (N) lessonChunks
lessons (1) ──→ (N) lessonVocabulary

units (1) ──→ (N) lessons
books (1) ──→ (N) units

chunks (1) ──→ (N) studentChunkProgress

studentProfiles (1) ──→ (N) studentObjectives
studentProfiles (1) ──→ (N) studentCourses

badgeDefinitions (1) ──→ (N) studentBadges

readingClubEvents (1) ──→ (N) readingClubPosts
readingClubPosts (1) ──→ (N) readingClubComments
```

---

## 🚀 Deployment & Hosting

### Ambiente Atual
- **Host:** Manus Platform (manus.space)
- **Domain:** https://influxassist-2anfqga4.manus.space
- **Dev Server:** http://localhost:3000
- **Database:** MySQL remoto (CENTRAL_DATABASE_URL)

### Processo de Deploy
```bash
1. Commit código no Git
2. Criar checkpoint via webdev_save_checkpoint
3. Clicar "Publish" no Management UI
4. Sistema faz build + deploy automático
5. Novo domínio disponível em minutos
```

---

## 📱 Vídeo de Onboarding (Miss Elie)

### Especificações
- **Formato:** 9:16 (mobile first)
- **Duração:** ~20 segundos
- **Estilo:** Pixar 3D → Anime Futurista (transformação)
- **Voz:** ElevenLabs Voice ID `mmhTWXIU9zlmbfIMh4y0` (Mia)
- **Idioma:** Português (BR)
- **Roteiro:**
  - Cena 1 (0–6s): Elie sentada na carteira, levantando
  - Cena 2 (6–14s): Caminhando, sala se transforma em futurista
  - Cena 3 (14–20s): Close-up, fala "Bem-vindo ao futuro"

### Integração
- **Componente:** `WelcomeVideoModal.tsx`
- **Exibição:** Primeira vez que aluno entra no dashboard
- **Controles:** Botão "Pular" (após 2s), barra de progresso
- **Storage:** localStorage (`influx_welcome_video_seen`)
- **CDN:** Manus webdev storage

---

## 🔍 Monitoramento & Logs

### Logs do Sistema
```bash
# Ver logs do servidor
tail -f /home/ubuntu/influx-assistants/logs/server.log

# Ver logs de sincronização
grep "Sponte\|sync" /home/ubuntu/influx-assistants/logs/server.log

# Ver logs de autenticação
grep "Auth\|login" /home/ubuntu/influx-assistants/logs/server.log
```

### Métricas Importantes
- **Usuários ativos:** 258 alunos
- **Conversas:** Histórico em `conversations` table
- **Taxa de sincronização:** Diária (Sponte)
- **Uptime:** Monitorado pelo Manus Platform

---

## 🔐 Segurança

### Práticas Implementadas
✅ Senhas com bcrypt (10 rounds)  
✅ JWT com expiração  
✅ Cookies HttpOnly + SameSite=Lax  
✅ CORS configurado  
✅ Validação Zod em todas as procedures  
✅ SQL injection prevention (Drizzle ORM)  
✅ Rate limiting (via Manus Platform)  
✅ Webhooks com WEBHOOK_SECRET  

---

## 📚 Próximos Passos para Integração com Novos Apps

### Para Conectar Novos Aplicativos:

1. **Usar a mesma base de dados:**
   ```bash
   CENTRAL_DATABASE_URL=mysql://user:pass@central-db/influx_central
   ```

2. **Reutilizar tabelas existentes:**
   - `users` — autenticação centralizada
   - `studentProfiles` — perfis de alunos
   - `studentBadges`, `pointsHistory` — gamificação
   - `conversations`, `messages` — histórico de chat

3. **Integrar via tRPC:**
   ```typescript
   // Novo app chama procedures existentes
   const response = await trpc.student.getProfile.query({ userId: 123 });
   ```

4. **Usar mesmas credenciais OAuth:**
   - `VITE_APP_ID` — app ID Manus
   - `OAUTH_SERVER_URL` — servidor OAuth

5. **Compartilhar LLMs:**
   - `OPENAI_API_KEY` — GPT-4
   - `ELEVENLABS_API_KEY` — Voice ID da Elie

---

## 📄 Documentação Adicional

- **Relatório de Alunas:** `RELATORIO_ALUNAS_LAIS_CAMILA.md`
- **Análise de Conteúdo:** `ANALISE_CONTEUDO_PROGRAMATICO.md`
- **Guia de Implementação:** `GUIA_IMPLEMENTACAO_COMPLETO.md`
- **Design System:** `DESIGN_SYSTEM.md`

---

**Relatório gerado em:** Abril 2026  
**Versão do projeto:** 02aa0b0d  
**Responsável:** Estevao Cordeiro (Owner)  
**Status:** ✅ Produção com Vídeo de Onboarding

