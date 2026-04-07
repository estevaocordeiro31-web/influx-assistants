# inFlux Personal Assistants — Relatório Completo de Funcionalidades
## Plano de Redesenho da Experiência do Aluno

**Data:** 21 de Março de 2026  
**Versão atual:** `2f6a2922` (deployed em influxassist-2anfqga4.manus.space)  
**Autor:** Manus AI para inFlux Jundiaí

---

## 1. Visão Geral do Sistema

O **inFlux Personal Assistants** é uma plataforma web completa construída com React 19 + TypeScript + tRPC + MySQL, integrada ao Dashboard Central da inFlux. O sistema possui três grandes módulos:

| Módulo | Descrição | Status |
|---|---|---|
| **inFlux Personal Tutor** | Assistente de IA para alunos — exercícios, chat, voz, badges | ✅ Ativo |
| **Admin Dashboard** | Gestão de alunos, sincronização Sponte, relatórios | ✅ Ativo |
| **Cultural Events** | Noite cultural interativa (St. Patrick's Night) | ✅ Ativo |

---

## 2. Mapa Completo de Rotas

### 2.1 Módulo do Aluno (`/student/*`)

| Rota | Componente | Funcionalidade | Status |
|---|---|---|---|
| `/student/dashboard` | StudentDashboard | Hub central do aluno — 8 abas | ✅ |
| `/student/chat` | Chat | Chat com IA (Lucas/Emily/Aiko) | ✅ |
| `/student/voice-chat` | VoiceChatPage | Bate-papo por voz com IA | ✅ |
| `/student/exercises` | Exercises | Exercícios interativos por livro | ✅ |
| `/student/extra-exercises/:bookId/:lesson` | ExtraExercisesPage | 65 exercícios extras Books 1-2 | ✅ |
| `/student/badges` | BadgesPage | 20 selos gamificados | ✅ |
| `/student/profile` | StudentProfile | Perfil e progresso do aluno | ✅ |
| `/student/edit-profile` | EditProfile | Edição de dados pessoais | ✅ |
| `/student/blog-tips` | BlogTips | Dicas do blog inFlux | ✅ |
| `/student/simulator` | SituationSimulator | Simulador de situações reais | ✅ |
| `/student/passport` | InfluxPassportPage | Passaporte inFlux (check-ins) | ✅ |

### 2.2 Módulo Admin (`/admin/*`)

| Rota | Componente | Funcionalidade | Status |
|---|---|---|---|
| `/admin/dashboard` | AdminDashboard | Gestão de alunos + sincronização | ✅ |
| `/admin/notifications` | AdminNotifications | Envio de notificações em massa | ✅ |
| `/admin/personalized-links` | PersonalizedLinksManager | Links de acesso individuais | ✅ |
| `/admin/gemini-chat` | GeminiChat | Chat estratégico com Gemini | ✅ |
| `/admin/gemini-suggestions` | GeminiSuggestions | Sugestões pedagógicas IA | ✅ |
| `/admin/gemini-analysis` | GeminiStrategicAnalysis | Análise estratégica da escola | ✅ |
| `/admin/bulk-sync` | AdminBulkSyncPage | Sincronização em massa | ✅ |
| `/admin/student/:id/edit` | StudentProfileEditPage | Edição de perfil do aluno | ✅ |
| `/admin/student/:id/analysis` | StudentCrossAnalysisPage | Análise cruzada do aluno | ✅ |
| `/admin/student-stats` | StudentStatsPage | Estatísticas de alunos | ✅ |
| `/admin/activities` | AdminActivitiesPage | Gestão de atividades | ✅ |
| `/admin/upload-materials` | MaterialUploadPage | Upload de materiais didáticos | ✅ |
| `/admin/back-to-school` | BackToSchoolAdminPage | Campanha Back to School | ✅ |
| `/support/ellie` | ElliesSupportPage | Suporte via Ellie | ✅ |
| `/support/tickets` | SupportTicketsPage | Tickets de suporte | ✅ |

### 2.3 Módulo Cultural Events (`/events/*`)

| Rota | Componente | Funcionalidade | Status |
|---|---|---|---|
| `/events` | EventLanding | Tela de entrada + QR Code | ✅ |
| `/events/register` | EventRegister | Cadastro de participante | ✅ |
| `/events/welcome` | EventWelcome | Boas-vindas pós-cadastro | ✅ |
| `/events/hub` | EventHub | Hub das 5 missões + pontuação | ✅ |
| `/events/chunk-lesson` | ChunkLesson | FlipCards com chunks idiomáticos | ✅ |
| `/events/culture-quiz` | CultureQuiz | Quiz de cultura irlandesa (8 perguntas) | ✅ |
| `/events/chunk-listening` | ChunkListening | Fill in the gaps com áudio | ✅ |
| `/events/speaking-challenge` | SpeakingChallenge | Avaliação de fala por IA | ✅ |
| `/events/food-challenge` | FoodChallenge | Chat com personagens sobre comida | ✅ |
| `/events/tongue-twister` | TongueTwisterChallenge | Tongue twisters com avaliação IA | ✅ |
| `/events/who-am-i` | WhoAmIGame | Jogo Who Am I? com personagens | ✅ |
| `/events/finish-lyrics` | FinishTheLyrics | Complete a letra da música | ✅ |
| `/events/hot-seat` | HotSeatGame | Hot Seat individual | ✅ |
| `/events/leaderboard` | Leaderboard | Ranking ao vivo | ✅ |
| `/events/score` | EventScore | Pontuação final + CTA | ✅ |
| `/events/closing` | ClosingCeremony | Pódio animado + confetes | ✅ |
| `/events/intro` | StPatricksIntro | Introdução com personagens (mobile) | ✅ |
| `/events/intro-tv` | StPatricksIntroTV | Introdução fullscreen TV (timer 18s) | ✅ **NOVO** |
| `/events/kids` | KidsHub | Hub de atividades Kids | ✅ |
| `/events/kids/intro` | StPatricksIntroKids | Introdução Kids com cartoons | ✅ **NOVO** |
| `/events/kids/tongue-twister` | KidsTongueTwister | Tongue Twister versão Kids | ✅ |
| `/events/kids/who-am-i` | KidsWhoAmI | Who Am I? versão Kids | ✅ |
| `/events/kids/sing-along` | KidsSingAlong | Sing Along versão Kids | ✅ |
| `/events/teacher` | TeacherDashboard | Dashboard do professor (PIN) | ✅ |
| `/events/welcome-screen` | WelcomeScreen | Tela de boas-vindas TV | ✅ |
| `/events/reception-tv` | ReceptionTV | Tela de recepção com QR | ✅ |
| `/events/leaderboard-tv` | LeaderboardTV | Leaderboard fullscreen TV | ✅ |
| `/events/hot-seat-tv` | HotSeatPresenter | Hot Seat modo TV | ✅ |

### 2.4 Outras Rotas

| Rota | Funcionalidade | Status |
|---|---|---|
| `/` | Home / Landing page | ✅ |
| `/login` | Login com senha | ✅ |
| `/change-password` | Troca de senha (obrigatória no 1º login) | ✅ |
| `/access/:linkHash` | Acesso via link personalizado | ✅ |
| `/login-direct/:token` | Login direto por token | ✅ |
| `/passport/checkin` | Check-in no passaporte | ✅ |
| `/lessons` | Aulas e lições | ✅ |

---

## 3. Backend — Módulos tRPC

O sistema possui **65 tabelas no banco de dados** e mais de **50 routers tRPC**. Os principais módulos são:

| Router | Funcionalidades principais |
|---|---|
| `auth-password` | Login, logout, troca de senha, mustChangePassword |
| `admin-students` | CRUD de alunos, reset de senha, reconciliação |
| `cultural-events` | Eventos, missões, leaderboard, avaliação de fala |
| `gamification` | Pontos, streaks, flashcards, conquistas |
| `badges` | 20 selos com critérios e animações |
| `chat` | Chat com IA (Lucas/Emily/Aiko) com avaliação em tempo real |
| `tts` | Text-to-Speech com sotaque por personagem |
| `extra-exercises` | 65 exercícios extras Books 1-2 |
| `student-data` | Dados consolidados do aluno |
| `sponte-sync` | Sincronização com Dashboard Central |
| `bulk-student-sync` | Sincronização em massa de 1800+ alunos |
| `notifications` | Notificações push para alunos |
| `whatsapp-messages` | Envio de mensagens WhatsApp |
| `blog-tips` | Dicas personalizadas do blog inFlux |
| `passport-qr` | QR Code e check-ins do passaporte |
| `reports` | Geração de relatórios |
| `personalized-links` | Links de acesso individuais por aluno |
| `gemini` | Análise estratégica com Gemini AI |
| `tutor` / `tutor-personalized-v2` | Tutor personalizado por nível e livro |

---

## 4. O Que Está Funcionando — Resumo por Área

### Personal Tutor (Alunos)
- Chat com IA em inglês com avaliação de gramática, naturalidade e connected speech em tempo real
- Bate-papo por voz com transcrição Whisper + resposta em áudio
- 65 exercícios extras organizados por livro e lição
- 20 selos gamificados com critérios claros
- Streaks diários e pontuação de confiança (pa_confidence_score)
- Simulador de situações reais (restaurante, aeroporto, entrevista)
- Dicas personalizadas do blog inFlux
- Passaporte inFlux com check-ins

### Admin
- Gestão completa de alunos (226 no banco local, sincronizados com 1818 no Dashboard Central)
- Sincronização automática diária às 18h com o Sponte
- Reset de senha com notificação ao owner
- Links de acesso personalizados por aluno
- Análise estratégica com Gemini AI
- Exportação de relatórios

### Cultural Events
- Fluxo completo: QR Code → Cadastro → Hub → 5 Missões → Leaderboard → Encerramento
- 5 missões principais + 3 drinking games + Hot Seat
- Versão Kids com 4 atividades
- Teacher Dashboard com PIN, timeline, dicas e telas TV
- Leaderboard em tempo real (atualiza a cada 30s)
- TTS com sotaque correto por personagem (Americano, Britânico, Australiano)

---

## 5. O Que Falta — Backlog Prioritário

### 5.1 Crítico (bloqueia uso em produção)

| Item | Impacto | Esforço |
|---|---|---|
| Acesso individual dos alunos — links únicos e onboarding | Alto | Médio |
| Redesign da tela de Login (assimétrico + Fluxie + Aurora gradient) | Alto | Baixo |
| mustChangePassword no middleware tRPC (segurança) | Alto | Baixo |
| Configurar WhatsApp real no EventScore | Alto | Baixo |
| Remover console.log do código cliente | Médio | Baixo |

### 5.2 Alta Prioridade (experiência do aluno)

| Item | Impacto | Esforço |
|---|---|---|
| **Onboarding do aluno** — tela de boas-vindas personalizada no 1º acesso | Alto | Médio |
| **Dashboard do aluno redesenhado** — layout assimétrico, visual Disney/Pixar | Alto | Alto |
| **Templates customizáveis** — professor define o tema da semana | Alto | Alto |
| **Notificações push** — dicas diárias do blog inFlux | Médio | Médio |
| **Reading Club** — aba com sistema de badges e influxcoins | Médio | Médio |
| Menu com ícones no StudentDashboard (mobile-first) | Médio | Baixo |

### 5.3 Melhorias do Evento Cultural

| Item | Impacto | Esforço |
|---|---|---|
| Desbloqueio sequencial das missões no EventHub | Alto | Baixo |
| Fallback de texto no Speaking Challenge (sem microfone) | Alto | Baixo |
| Banco de palavras clicável no Chunk Listening | Médio | Médio |
| Tela de conclusão no Chunk Lesson e Culture Quiz | Médio | Baixo |
| Reconhecimento de voz no Chat IA | Médio | Médio |

---

## 6. Plano de Redesenho — Experiência do Aluno

### 6.1 Filosofia de Design

A experiência do aluno deve ser **cinematográfica, personalizada e motivadora**. Cada aluno deve sentir que o sistema foi feito especificamente para ele. O estilo visual segue o universo Disney/Pixar — cores vibrantes, personagens expressivos, microanimações que celebram o progresso.

**Princípios:**
- **Identidade visual consistente** — Lucas, Emily e Aiko presentes em toda a jornada
- **Gamificação significativa** — cada ponto, badge e streak tem significado pedagógico real
- **Mobile-first** — 90% dos acessos são pelo celular
- **Progressão clara** — o aluno sempre sabe onde está e para onde vai

### 6.2 Jornada Proposta do Aluno

```
1. PRIMEIRO ACESSO
   ↓ Link personalizado recebido por WhatsApp
   ↓ Tela de boas-vindas com nome do aluno + personagem do seu nível
   ↓ Troca de senha obrigatória
   ↓ Onboarding de 3 passos (nível, objetivos, personagem favorito)
   ↓ Dashboard personalizado

2. ACESSO DIÁRIO
   ↓ Dica do dia (blog inFlux) via notificação push
   ↓ Dashboard com streak, próximo exercício sugerido
   ↓ Atividade rápida (5 min) — flashcard ou exercício do livro atual
   ↓ Chat com personagem do dia

3. SEMANA CULTURAL
   ↓ Evento cultural temático (St. Patrick's, Halloween, Christmas...)
   ↓ Missões desbloqueadas progressivamente
   ↓ Leaderboard com amigos da turma
   ↓ Premiação e badges exclusivos

4. PROGRESSO MENSAL
   ↓ Relatório de evolução (exercícios, streak, badges)
   ↓ Sugestão de próximo nível
   ↓ Reading Club — leitura compartilhada
```

### 6.3 Templates Customizáveis

O professor deve poder configurar o tema da semana em 3 cliques. Cada template inclui:

| Elemento | Descrição |
|---|---|
| **Tema visual** | Cor de fundo, personagem em destaque, emoji temático |
| **Vocabulário da semana** | 5-10 chunks com FlipCards |
| **Atividade principal** | Quiz, Listening, Speaking ou Chat temático |
| **Desafio bônus** | Tongue Twister ou Sing Along temático |
| **Recompensa** | Badge exclusivo do tema |

**Templates iniciais sugeridos:**
1. St. Patrick's Day (☘️ — já implementado)
2. Halloween (🎃)
3. Thanksgiving (🦃)
4. Christmas (🎄)
5. New Year (🎉)
6. Valentine's Day (💝)
7. Easter (🐣)
8. Back to School (📚)

### 6.4 Redesign do Student Dashboard

**Layout atual:** Abas horizontais com conteúdo empilhado verticalmente  
**Layout proposto:** Sidebar fixa (desktop) / Bottom nav (mobile) + área principal com cards dinâmicos

**Estrutura proposta:**

```
┌─────────────────────────────────────────────────────┐
│  🌟 Olá, [Nome]!  Streak: 🔥7 dias  Nível: Book 2  │
├──────────┬──────────────────────────────────────────┤
│          │  📌 HOJE                                  │
│  Lucas   │  ┌─────────────────┐ ┌─────────────────┐ │
│  Emily   │  │ 💬 Chat do dia  │ │ 📖 Exercício    │ │
│  Aiko    │  │ "Ask about..."  │ │ Book 2, Lição 4 │ │
│          │  └─────────────────┘ └─────────────────┘ │
│ ──────── │                                           │
│ 🏠 Home  │  🏆 SEUS BADGES (3/20)                   │
│ 💬 Chat  │  [🌟][🎯][🔥] + 17 para conquistar       │
│ 📖 Exer  │                                           │
│ 🎖 Badge │  📊 PROGRESSO                             │
│ 🌍 Clube │  Exercícios: ████████░░ 78%               │
│ ⚙️ Perf  │  Streak: 🔥 7 dias consecutivos           │
└──────────┴──────────────────────────────────────────┘
```

### 6.5 Onboarding do Aluno (Novo)

Sequência de 3 telas no primeiro acesso:

**Tela 1 — Boas-vindas personalizada**
- Foto do personagem do nível do aluno (Kids: cartoon / Teens: foto real)
- "Olá, [Nome]! Eu sou o Lucas e vou te ajudar a falar inglês de verdade!"
- Áudio TTS com sotaque americano

**Tela 2 — Escolha seu objetivo**
- 3 opções: Viagem, Trabalho, Cultura/Entretenimento
- Personaliza as sugestões de chat e exercícios

**Tela 3 — Escolha seu personagem favorito**
- Lucas (🇺🇸), Emily (🇬🇧) ou Aiko (🇦🇺)
- Define o personagem padrão do chat

---

## 7. Próximos Passos Imediatos

### Sprint 1 — Acesso dos Alunos (Esta semana)

1. **Gerar links de acesso individuais** para todos os alunos ativos (226 no banco)
2. **Enviar por WhatsApp** via bulk-send com mensagem personalizada
3. **Testar fluxo completo** no celular: link → login → dashboard → exercício
4. **Corrigir bugs críticos** antes do envio (mustChangePassword, console.log)

### Sprint 2 — Redesign (Próximas 2 semanas)

1. **Redesign da tela de Login** — assimétrico com Fluxie e Aurora gradient
2. **Onboarding de 3 passos** para novos alunos
3. **Novo Student Dashboard** — layout mobile-first com bottom nav
4. **Templates de eventos** — estrutura para Halloween, Christmas, etc.

### Sprint 3 — Engajamento (Próximo mês)

1. **Reading Club** — aba com sistema de badges e influxcoins
2. **Notificações push diárias** — dicas do blog inFlux
3. **Relatório mensal** para o aluno — evolução, badges, streak
4. **Versão PWA** — instalável no celular como app

---

## 8. Métricas de Sucesso

| Métrica | Meta 30 dias | Como medir |
|---|---|---|
| Alunos com 1º acesso | 80% dos ativos (180/226) | Banco de dados |
| Retenção semanal | 40% voltam em 7 dias | last_activity_at |
| Exercícios completados | 500/mês | total_exercises_completed |
| Streak médio | 3 dias | current_streak_days |
| NPS dos alunos | 8+ | Formulário após 2 semanas |

---

*Relatório gerado em 21/03/2026 — inFlux Personal Assistants v2f6a2922*
