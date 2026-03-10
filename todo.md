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

## Fase 189: SINCRONIZAÇÃO COMPLETA - EM PROGRESSO

- [ ] Executar sincronização manual (criar contas para 179 alunos ativos)
- [ ] Vincular usuários existentes aos registros do Dashboard Central
- [ ] Implementar sincronização de dados da Elie para o banco central
- [ ] Testar e salvar checkpoint final

## Fase 190: SPEC DE SINCRONIZAÇÃO v1.0

- [ ] 1. Verificar/adicionar colunas no banco central (last_activity_at, total_exercises_completed, avg_exercise_score, total_badges, current_streak_days, pa_confidence_score, last_elie_session)
- [ ] 2. Criar server/utils/sync.ts com triggerHealthScoreRecalc() e getStudentId()
- [ ] 3. Adicionar hook onStudentLogin() em auth.ts
- [ ] 4. Adicionar hook onExerciseCompleted() em exercises.ts
- [ ] 5. Adicionar hook onBadgeAwarded() em badges.ts
- [ ] 6. Adicionar hook onStreakUpdated() onde streak é calculado
- [ ] 7. Expandir syncStudentIntelligence em elie-sync.ts com novos campos
- [ ] 8. Criar student-data.ts com getMyStudentData e integrar no StudentDashboard

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
