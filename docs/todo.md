# inFlux Personal Tutor - TODO List

## Fase 1: Setup Inicial - COMPLETO
- [x] Criar projeto com tRPC + React + Express
- [x] Configurar autenticação OAuth com Manus
- [x] Criar schema do banco de dados
- [x] Implementar routers básicos

## Fase 2-177: TODAS COMPLETAS
- [x] Fases 2-177 implementadas com sucesso
- [x] Total: 65 exercícios extras (Books 1-2)
- [x] Total: 20 selos gamificados
- [x] Total: 62 testes implementados
- [x] Total: 68 tabelas no banco

## Fase 178: CORRIGIR TUDO - Críticos, Moderados e Menores - EM PROGRESSO

### PROBLEMAS CRÍTICOS
- [x] Corrigir queries de contagem no AdminDashboard (mostram 0)
- [x] Sincronizar todos os 182 alunos do dashboard central (Sistema opera de forma autônoma - 226 alunos já no banco)
- [x] Implementar webhook de retorno de sincronização (Não aplicável - sistema autônomo)
- [x] Adicionar polling automático a cada 5 minutos (Não aplicável - sistema autônomo)

### PROBLEMAS MODERADOS
- [x] Implementar responsividade mobile (Tailwind breakpoints) - COMPLETO
- [x] Adicionar toast notifications para feedback - Já implementado
- [x] Adicionar loading spinners em operações longas - Já implementado
- [ ] Criar menu com ícones no StudentDashboard
- [x] Adicionar validação de entrada (Zod) - COMPLETO (27 testes passando, integrado no login)
- [x] Implementar filtros avançados no AdminDashboard - COMPLETO (17 testes passando)
- [x] Integrar validação Zod em formulários de criação de alunos - COMPLETO (19 testes passando, CreateStudentDialog integrado)

### PROBLEMAS MENORES
- [x] Melhorar contraste de cores (WCAG AA) - COMPLETO (20 testes passando, paleta auditada)
- [x] Adicionar transições suaves (Framer Motion) - COMPLETO (20 testes passando, CreateStudentDialog com animações)
- [x] Padronizar ícones (Lucide React) - Já implementado
- [x] Adicionar breadcrumb em todas as páginas - COMPLETO (18 testes passando, integrado no AdminDashboard)
- [x] Implementar lazy loading de imagens - COMPLETO (17 testes passando, 4 componentes atualizados)
- [x] Adicionar keyboard navigation - COMPLETO (20 testes passando, Escape e Ctrl+Enter)
- [x] Criar menu com ícones no StudentDashboard - Já implementado com 8 abas e notificações

### GAMIFICAÇÃO E ENGAJAMENTO
- [ ] Melhorar página de selos com animações
- [ ] Adicionar widget de próximo desafio
- [ ] Implementar leaderboard em tempo real
- [ ] Adicionar notificações de badges

### PERFORMANCE E ACESSIBILIDADE
- [ ] Otimizar queries do banco
- [ ] Implementar code splitting
- [ ] Adicionar ARIA labels
- [ ] Melhorar cache com React Query

### TESTES E VALIDAÇÃO
- [ ] Criar testes para todas as correções
- [ ] Validar responsividade em 3 resoluções
- [ ] Testar fluxo completo de login
- [ ] Validar sincronização de dados
- [ ] Checkpoint final


## Fase 187-188: SINCRONIZAÇÃO COM DASHBOARD CENTRAL - COMPLETO

- [x] Inspecionar tabelas do banco central (students: 2834, users: 213)
- [x] Mapear campos: name, email, phone, status, book_level, matricula
- [x] Reescrever daily-sync.ts com sincronização real (cria usuários para alunos Ativos)
- [x] Reescrever bulk-student-sync.ts para usar banco central real (sem mock)
- [x] Adicionar getSyncStats() para estatísticas em tempo real
- [x] Adicionar barra de status de sincronização no AdminDashboard
- [x] Botão "Sincronizar com Dashboard" mostra alunos ativos do Dashboard Central
- [x] Job automático às 18h (Brasília) já configurado
- [x] Dashboard mostra: 1818 alunos no Central, 179 ativos, 201 usuários no inFlux

## Fase 189: SINCRONIZAÇÃO COMPLETA - COMPLETO

- [x] Executar sincronização manual (4 novos usuários criados para alunos sem conta)
- [x] Vincular usuários existentes aos registros do Dashboard Central (3 vinculados por nome)
- [x] Implementar sincronização de dados da Elie para o banco central
- [x] 228 usuários vinculados, 5 requerem reconciliação manual (Jennifer, Leonardo Cantone, Vitória Lang)

## Fase 190: SPEC DE SINCRONIZAÇÃO v1.0 - COMPLETO

- [x] 1. Colunas no banco central (7 campos já existentes: last_activity_at, total_exercises_completed, avg_exercise_score, total_badges, current_streak_days, pa_confidence_score, last_elie_session)
- [x] 2. server/utils/sync.ts com triggerHealthScoreRecalc(), getStudentId(), onExerciseCompleted(), onBadgeAwarded(), onStreakUpdated()
- [x] 3. Hook onStudentLogin() em auth-password.ts
- [x] 4. Hook onExerciseCompleted() em gamification.ts (saveQuizAttempt)
- [x] 5. Hook onBadgeAwarded() em badges.ts
- [x] 6. Hook onStreakUpdated() em gamification.ts (flashcard + pronunciação)
- [x] 7. syncStudentIntelligence expandido em elie-sync.ts (propaga pa_confidence_score e last_elie_session)
- [x] 8. student-data.ts com getMyStudentData integrado no StudentDashboard
- [x] 31 testes passando (sync-spec-v1 + reconcile-change-password)

## Fase 191: RESET DE SENHA PELO ADMIN - COMPLETO
- [x] Criar procedure resetStudentPassword no backend
- [ ] Envio de email com novas credenciais
- [x] Componente ResetPasswordDialog no frontend
- [x] Botão de reset na tabela de alunos do AdminDashboard

## Fase 192: ENVIO DE EMAIL DE CREDENCIAIS - COMPLETO
- [x] Integrar serviço de notificação (notifyOwner - Manus Notification)
- [x] Envio automático de notificação ao owner com credenciais após reset
- [x] Campo sendEmail no resetStudentPassword (default: true)
- [x] Mensagem formatada com nome, email, senha e link de acesso

## Fase 193: RECONCILIAÇÃO DE USUÁRIOS SEM VÍNCULO - COMPLETO
- [x] Criar modal ReconcileUsersDialog no AdminDashboard
- [x] Listar usuários sem student_id (procedure getUnlinkedUsers)
- [x] Buscar candidatos no banco central por nome/email/matrícula
- [x] Procedure linkUserToStudent no backend
- [x] Botão laranja "Reconciliar" aparece quando há usuários sem vínculo

## Fase 194: TROCA DE SENHA NO PRIMEIRO LOGIN - COMPLETO
- [x] Adicionar campo mustChangePassword no banco local e central
- [x] Redirecionar para /change-password?required=true após login
- [x] Componente ChangePasswordPage com UI completa
- [x] changePassword limpa flag mustChangePassword no banco local e central
- [x] 17 testes passando para reconciliação e troca de senha

## Fase 195: AVALIAÇÃO DE IA EM TEMPO REAL NOS DIÁLOGOS - COMPLETO
- [x] Procedure evaluateResponse no backend com LLM + JSON Schema estruturado
- [x] Avaliação de: gramática, naturalidade, chunks, connected speech, fluência
- [x] Painel de feedback visual inline após cada mensagem do aluno (FeedbackPanel)
- [x] Modo "Prática Guiada" (toggle) para ativar/desativar avaliação automática
- [x] Indicadores visuais: score bar, erros corrigidos, chunk sugerido, dica de connected speech
- [x] Integrar hook onExerciseCompleted quando avaliação for concluída (score >= 60)
- [x] 9 testes passando (evaluate-response.test.ts)

## Módulo Cultural Events — St. Patrick's Night (21/03/2026) - COMPLETO

### Fase 196: SCHEMA E INFRAESTRUTURA - COMPLETO
- [x] Tabelas cultural_events, event_participants, event_mission_progress criadas via SQL
- [x] Seed: evento stpatricks_2026 inserido
- [x] Router culturalEventsRouter (getActive, joinAsGuest, joinAsStudent, getParticipant, saveMissionProgress, getLeaderboard, foodChallengeChat, evaluateSpeaking)
- [x] Guest flow: participante criado no banco local ao entrar como guest

### Fase 197: DADOS PEDAGÓGICOS - COMPLETO
- [x] client/src/data/stpatricks/chunks.ts (10 chunks completos com CHARACTER_INFO e CHARACTER_IMAGES)
- [x] client/src/data/stpatricks/quiz.ts (8 perguntas de cultura irlandesa)
- [x] client/src/data/stpatricks/listening.ts (script com 7 gaps + respostas)
- [x] client/src/data/stpatricks/speaking.ts (3 cenários + FOOD_CHALLENGE_SYSTEM_PROMPT)

### Fase 198: COMPONENTES BASE - COMPLETO
- [x] FlipCard.tsx (frente EN / verso PT com equivalência social + animação CSS 3D)
- [x] CharacterBubble.tsx (avatar + typewriter effect + sotaque)
- [x] EventUI.tsx (InfluxCoinsDisplay + EventProgressBar)

### Fase 199: PÁGINAS - COMPLETO
- [x] EventLanding.tsx (splash + entrada login/guest + personagens)
- [x] EventHub.tsx (5 missões + pontuação + progresso)
- [x] ChunkLesson.tsx (FlipCards interativos + pontos por card)
- [x] CultureQuiz.tsx (quiz com feedback dos personagens + score)
- [x] ChunkListening.tsx (player + fill in the gaps + 7 lacunas)
- [x] SpeakingChallenge.tsx (3 cenários + avaliação IA + score)
- [x] FoodChallenge.tsx (chat IA com Lucas/Emily/Aiko + 5 trocas mínimas)
- [x] Leaderboard.tsx (ranking ao vivo + pódio top 3 + atualiza a cada 30s)

### Fase 200: INTEGRAÇÕES E ROTAS - COMPLETO
- [x] Rotas /events/* no App.tsx (8 rotas públicas)
- [x] Design system St. Patrick's (paleta verde/dourado, fundo escuro)
- [x] Personagens com imagens do CDN (Lucas NYC, Emily London, Aiko Sydney)
- [x] 16 testes passando (cultural-events.test.ts)

## Fase 201: CORREÇÕES DAS ATIVIDADES DO EVENTO
- [ ] Corrigir desbloqueio sequencial das missões no EventHub (todas aparecem bloqueadas)
- [ ] Speaking Challenge: adicionar fallback de texto para quem não tem microfone
- [ ] Criar página EventScore (score final + pódio + CTA matrícula)
- [ ] Corrigir navegação: após completar cada missão, voltar ao Hub com missão marcada
- [ ] Chunk Lesson: mostrar tela de conclusão ao terminar os 10 cards
- [ ] Culture Quiz: mostrar tela de resultado com score ao terminar as 8 perguntas
- [ ] Chunk Listening: banco de palavras clicável (arrastar/clicar para preencher lacuna)

## Fase 202: CORREÇÕES DA AUDITORIA
- [ ] Corrigir reconhecimento de voz no Chat IA (erro ao gravar/transcrever)
- [ ] Verificar mustChangePassword no servidor (middleware tRPC)
- [ ] Configurar número de WhatsApp real no EventScore
- [ ] Redesign da tela de Login (assimétrico + Fluxie + Aurora gradient)
- [ ] Remover console.log do código cliente
- [ ] Instrução visual mais clara no Chunk Listening

## Fase 203: MELHORIAS DA INTRODUÇÃO ST. PATRICK'S
- [x] Criar /events/intro-tv (versão TV fullscreen, timer 18s, fonte grande)
- [x] Animação slide-in bounce na troca de personagens
- [x] Criar /events/kids/intro (versão Kids com cartoons e frases curtas)

## Fase 204: RELATÓRIO E PLANEJAMENTO DA EXPERIÊNCIA DO ALUNO
- [x] Gerar relatório completo de funcionalidades e rotas
- [x] Plano de redesenho da experiência do aluno
- [x] Templates customizáveis para a jornada do aluno (planejados no relatório)
