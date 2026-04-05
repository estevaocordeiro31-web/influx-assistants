# Análise do inFlux Dashboard AI First

## Informações Gerais
- **Projeto**: inFlux Jundiái Retiro — Dashboard de Gestão Inteligente
- **Data**: 10 de fevereiro de 2026
- **Versão**: 193 checkpoints | 102.343 linhas de código | 62 tabelas no banco de dados
- **Stack**: React 19 + Tailwind 4 + Express 4 + tRPC 11 + MySQL (TiDB) + S3
- **Início**: 13 de janeiro de 2026

## Escala do Projeto
- **89 páginas de frontend**
- **36 routers de backend**
- **19 arquivos de teste automatizado**
- **62 tabelas no banco de dados**
- **7 serviços externos integrados**

## Módulos Implementados

### 1. Dashboard Principal (9 abas)
- **Visão Geral**: KPIs de 171 alunos ativos, receita pendente, turmas, ações rápidas, gráficos
- **Gestão de Relacionamento**: Funil de vendas, leads por estágio, storytelling
- **Alunos & Retenção**: Módulo de retenção, sistema NPS
- **Vacation Plus**: Banners Welcome Quest (Semana 1) e Cooking Challenge (Semana 2)
- **Conversas**: Dashboard de conversas WhatsApp com métricas
- **WhatsApp**: Configuração, monitoramento e analytics do bot
- **Pedagógico**: Pedagogia IA com acompanhamento inteligente
- **Personal Tutor**: Acesso ao tutor pessoal com IA para cada aluno
- **Funcionários**: Gestão de equipe com perfis, acessos e permissões

### 2. Sistema Comercial e CRM
- **Pipeline visual** com storytelling em 4 etapas (Protagonista → Problema → Solução → Resultado)
- **Automação de follow-ups** com IA (mensagens personalizadas por perfil)
- **Importação em lote** de interessados com deduplicação automática
- **Campanha WhatsApp** segmentada (alunos ativos, interessados, ex-alunos)
- **Análise comportamental** de conversas com IA para classificação de leads
- **Sistema de aprovação** de mensagens antes do envio

### 3. Gestão de Alunos e Dados
- **Migração Sponte concluída** (04/02/2026):
  - 1.731 alunos extraídos do Sponte
  - 171 alunos ativos migrados (60 inseridos, 111 atualizados)
  - 1.560 ex-alunos migrados (81 inseridos, 1.479 atualizados)
  - 290 registros ativos no banco de dados
  - Status: 202 ativos, 27 inativos, 41 desistentes, 20 trancados

### 4. WhatsApp Bot e Automação
- **Bot de atendimento** com IA (OpenAI) que responde automaticamente
- **Monitor de saúde** com reconexão automática e alertas de queda
- **Fila de mensagens** com sistema de aprovação prévia
- **Fluxos automatizados** configuráveis por tipo de contato
- **Histórico de alertas** e analytics de conversas
- **Deduplicação** com hash SHA256 e cache de 24h
- **Rate limiting** configurável (40 mensagens/dia padrão)

### 5. Integração Microsoft Outlook
- **Autenticação OAuth2** com Microsoft 365
- **Captura automática** de leads por email
- **Calendário Outlook** integrado para agenda compartilhada
- **Sincronização bidirecional** de eventos

### 6. Gestão de Funcionários e Acessos
- **RBAC completo** com 5 perfis:
  - Gestão: Acesso completo a todos os módulos
  - Coordenação: Pedagógico, alunos, relatórios
  - Gestão Comercial: CRM, leads, campanhas, follow-ups
  - Consultor: Atendimento, follow-ups limitados
  - Professor: Pedagógico, turmas, alunos da turma

### 7. Sistema de Jobs e Automação
- **Rotina Diária** (07:30 todos os dias): Check WhatsApp, reconexão, processar follow-ups, gerar relatório
- **Follow-up Contínuo** (a cada 30min, seg-sex 09:00-20:30): Processar e enviar follow-ups pendentes
- **Monitor WhatsApp** (a cada 5 minutos): Verificar saúde da conexão

### 8. Rematrícula
- Módulo dedicado ao processo de rematrícula
- Dashboard de rematrícula, gestão de alunos, professores, edição, mensagens, relatórios

### 9. Programas Especiais
- **Superstar**: Sistema de gamificação para equipe com métricas, metas e ranking
- **Vamos Juntos**: Programa de indicação com ranking de embaixadores
- **Portal inFlux**: Portal centralizado com acesso a todas as funcionalidades
- **Portal de Atividades**: Gestão de atividades extracurriculares e eventos

## Módulo Pedagógico e IA

### 3.1 Personal Tutor
Assistente pessoal de IA para alunos com:
- **Chat com IA** personalizado por aluno (nível, interesses, dificuldades)
- **Prática de pronúncia** com análise de áudio
- **Dicas diárias** do blog inFlux
- **Exercícios de revisiting** (revisitação de conteúdo)
- **Integração com dados** do Sponte para perfil cirúrgico do aluno

### 3.2 Síntese de Voz (TTS)
Integração dupla com sotaques autênticos:

| Personagem | País | Sotaque | Vozes por Faixa Etária |
|-----------|------|---------|----------------------|
| Lucas | EUA (Nova York) | American English | Kids (7-9), Transition (10-12), Teens (13-15) |
| Emily | UK (Londres) | British English | Kids (7-9), Transition (10-12), Teens (13-15) |
| Aiko | Austrália (Sydney) | Australian English | Kids (7-9), Transition (10-12), Teens (13-15) |

**Provedores**: ElevenLabs (primário) com fallback para Google Cloud TTS

### 3.3 Pedagogia IA
Módulo de acompanhamento pedagógico inteligente com:
- **Análise de performance** por aluno
- **Relatórios pedagógicos** automáticos
- **Recomendações de curso** personalizadas
- **Inteligência do estudante** (student intelligence)
- **Histórico de interações** com o tutor

## Vacation Plus — Programa de Férias

### 4.1 Welcome Quest (Semana 1 — 14 a 18 de Julho)
Atividade imersiva de inglês com gamificação completa (7 abas interativas):
- **Welcome**: Hero com personagens Lucas, Emily e Aiko, missão do dia
- **Vocabulary**: Power Words com pronúncia em 3 sotaques
- **Connected Speech**: "gonna, wanna, gotta" com exemplos práticos
- **Dialogues**: Conversas interativas entre personagens
- **Games**: Match Game, Memory Game, Quick Quiz, Pronunciation Practice, Team Quests
- **Stories**: Vídeos animados estilo Disney/Pixar com legendas duplas (EN/PT)
- **Achievements**: Sistema de badges e conquistas

**Assets**: 5 vídeos animados com narração TTS, personagens 3D estilo Pixar, cenários futuristas com neon

### 4.2 Cooking Challenge (Semana 2 — 21 a 25 de Julho)
Atividade temática de culinária com vocabulário de cozinha (9 abas interativas):
- **Welcome**: Hero com tema culinário, personagens como chefs
- **Food Culture**: Cultura gastronômica dos 3 países (USA, UK, Australia)
- **Vocabulary**: Vocabulário de cozinha (utensílios, ingredientes, verbos culinários)
- **Connected Speech**: Expressões naturais de cozinha aplicadas a receitas
- **Dialogues**: Conversas em contexto de cozinha entre personagens
- **Games**: Jogos temáticos de culinária
- **Recipes**: Cards de receita ilustrados por IA (frente com ingredientes, verso com passos)
- **City Life**: Vida nas cidades dos personagens
- **Achievements**: Badges e conquistas culinárias

**Cards de Receita Ilustrados**: 7 imagens geradas por IA hospedadas no CDN, incluindo logo do Cooking Challenge

**PDF Imprimível**: Documento de 8 páginas (capa + 3 frentes + 3 versos + contracapa) para uso em sala de aula

### 4.3 VacationPlusModule
Módulo no dashboard principal com dois banners distintos:
- **Welcome Quest** — Semana 1 (14-18 Jul) com botão "Acessar Atividade"
- **Cooking Challenge** — Semana 2 (21-25 Jul) com logo e botão "Acessar Atividade"

Inclui sistema de campanha WhatsApp para divulgação segmentada

## Integrações Externas

| Serviço | Finalidade | Status |
|---------|-----------|--------|
| WhatsApp (Z-API) | Bot de atendimento, campanhas, follow-ups automáticos | Ativo com monitor de saúde |
| ElevenLabs | Síntese de voz com sotaques autênticos (US/UK/AU) | Ativo (primário) |
| Google Cloud TTS | Fallback para síntese de voz | Ativo (secundário) |
| Microsoft Outlook | Email, calendário, captura de leads | Ativo com OAuth2 |
| Sponte | Migração de dados de alunos e ex-alunos | Migração concluída |
| OpenAI | IA para chatbot, análise de conversas, geração de conteúdo | Ativo |
| AWS S3 | Armazenamento de arquivos, áudios, imagens | Ativo |

## Banco de Dados (62 tabelas)

### Gestão de Pessoas
users, students, funcionarios, staffProfiles, staffMembers, customPermissions, accessAuditLog

### Comercial/CRM
contacts, contactTimeline, contactNotes, followups, followupInteractions, followupObjections, followupScripts, campaigns, campaignRecipients, automationHistory

### WhatsApp
whatsappConfig, whatsappMessages, whatsappFlows, whatsappAlerts, whatsappAlertHistory, whatsappRateLimit, messageQueue, messageApprovalConfig

### Pedagógico
courses, courseRecommendations, studentIntelligence, tutorInteractions, pedagogicalReports, tutorBlogTips, pronunciationPractice, dialogueHistory, studentPerformanceAnalysis

### Vacation Plus
welcomeQuestProgress, welcomeQuestSessions, welcomeQuestInscricoes, vacationPlusCampaigns, vacationPlusCampaignMessages, vacationPlusCampaignDelivery

### Voz/TTS
voiceSynthesisHistory, ttsProviderConfig

### Financeiro
payments

### Operacional
systemJobs, jobExecutionHistory, calendarEvents, outlookIntegration, activities, activityRegistrations, conversationMetrics, adminChatHistory, superstarMetrics, superstarTasks, superstarHistory, alunosRematricula, professoresRematricula, atividadesRematricula, mensagemTemplatesRematricula, mensagensEnviadasRematricula, unidades

## Itens Pendentes

### Em Andamento (Cooking Challenge — Fase 2)
- Gerar áudios ElevenLabs com sotaques regionais e entonação por idade
- Criar slides para TV/lousa do Cooking Challenge
- Criar histórias animadas com exercícios (estilo Welcome Quest)
- Adicionar sistema de pontuação no Recipe Puzzle com drag-and-drop
- Integrar áudios, slides e histórias no dashboard

### Pendências Gerais
- Migração de follow-ups do Sponte (extrair e mapear para tabela followups)
- Botão de adicionar professores com correção pendente
- Geração de relatórios em PDF
- Implementação completa do Reading Club com influxcoins
- Integração de calendários específicos para alunos (agenda de aulas, prazos, eventos)
- Integração de mensagens do pedagógico
- Integração de informações sobre eventos e notícias
- Sistema de notas e presença
- Compartilhamento de dados entre projetos (Dashboard ↔ inFlux Personal Assistants)

## Arquitetura de Dados

### Fluxo de Dados de Alunos
1. **Fonte Primária**: Sponte (migração concluída)
2. **Armazenamento**: Tabela `students` no Dashboard
3. **Consumidores**: Personal Tutor (inFlux), Pedagógico, Comercial
4. **Enriquecimento**: Dados de acompanhamento (performance, dificuldades, adaptação da IA)

### Dados de Acompanhamento (Feedback Loop)
- **Origem**: Personal Tutor (inFlux Personal Assistants)
- **Dados**: Resultado de quizzes, dificuldades identificadas, padrões de aprendizado, adaptação da IA
- **Destino**: Dashboard (tabelas pedagógicas)
- **Uso**: Relatórios pedagógicos, recomendações personalizadas, análise de performance

## Próximos Passos para Integração

1. **Sincronização de Alunos**: Dashboard → inFlux Personal Assistants
   - Alunos ativos, nível, turmas, dados cadastrais
   - Atualização em tempo real

2. **Feedback de Acompanhamento**: inFlux Personal Assistants → Dashboard
   - Resultados de quizzes, dificuldades, padrões de aprendizado
   - Atualização após cada interação

3. **Calendários e Agenda**: Dashboard → inFlux Personal Assistants
   - Calendário de aulas, prazos, eventos
   - Integração com Outlook

4. **Mensagens do Pedagógico**: Dashboard → inFlux Personal Assistants
   - Notificações, avisos, mensagens personalizadas
   - Sistema de notificação em tempo real

5. **Eventos e Notícias**: Dashboard → inFlux Personal Assistants
   - Feed de notícias da plataforma
   - Eventos da instituição

6. **Notas e Presença**: Dashboard → inFlux Personal Assistants
   - Histórico de notas por disciplina
   - Registro de presença por aula

7. **Relatórios Integrados**: Dashboard ← inFlux Personal Assistants
   - Relatórios pedagógicos consolidados
   - Análise de performance do aluno
