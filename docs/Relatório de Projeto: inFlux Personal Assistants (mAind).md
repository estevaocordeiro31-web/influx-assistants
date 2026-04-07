# Relatório de Projeto: inFlux Personal Assistants (mAind)

**Data de geração:** 18 de março de 2026  
**Responsável:** Estevão Cordeiro — Empresário, Designer de Produto, Professor de Inglês  
**Escola:** inFlux Jundiaí  
**URL de Produção:** [influxassist-2anfqga4.manus.space](https://influxassist-2anfqga4.manus.space)  
**Versão atual:** `36ec738b`  
**Total de checkpoints:** 172 iterações de desenvolvimento

---

## 1. Visão Geral e Propósito

O **mAind** (inFlux Personal Assistants) é uma plataforma de inteligência artificial desenvolvida especificamente para a operação da inFlux Jundiaí, com potencial de expansão para toda a rede de franquias. O sistema nasce da visão do Estevão Cordeiro de usar tecnologia para amplificar o que a inFlux sempre fez de melhor: **realizar o sonho dos alunos, transformar vidas e oferecer a melhor experiência possível no aprendizado de inglês**.

A plataforma integra três grandes frentes: o atendimento inteligente ao aluno (tutoria personalizada, chat com IA, exercícios adaptativos), a gestão comercial e operacional da escola (CRM, sincronização com Sponte, mineração de histórico de WhatsApp) e a produção de conteúdo pedagógico (materiais, dicas, blog, eventos culturais). Tudo isso em um único sistema, construído de forma incremental ao longo de mais de 170 versões.

---

## 2. Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Frontend** | React 19 + Tailwind CSS 4 + shadcn/ui |
| **Backend** | Node.js + Express 4 + tRPC 11 |
| **Banco de Dados** | MySQL/TiDB (via Drizzle ORM) |
| **Autenticação** | Manus OAuth + JWT + cookies seguros |
| **IA / LLM** | Manus Built-in LLM (OpenAI-compatible) + Gemini |
| **Voz** | Whisper (transcrição) + Google Cloud TTS + ElevenLabs |
| **WhatsApp** | Z-API (instância própria da inFlux) |
| **CRM Externo** | Sponte Web (API REST) |
| **Armazenamento** | S3 (arquivos, áudios, materiais) |
| **Tipagem** | TypeScript end-to-end (0 erros) |
| **Testes** | Vitest (29 arquivos de teste) |

---

## 3. Módulos Implementados

### 3.1 Autenticação e Gestão de Usuários

O sistema conta com autenticação via Manus OAuth, login direto por token (para links personalizados), troca de senha e controle de acesso por papel (`admin` / `user`). O middleware `protectedProcedure` garante que todas as rotas sensíveis exijam sessão válida. O campo `mustChangePassword` força a redefinição de senha no primeiro acesso, verificado diretamente no servidor.

### 3.2 Chat com IA — Elie / Fluxie

O coração do sistema é o chat com inteligência artificial, acessível tanto para alunos quanto para o time da escola. O bot possui:

- **Personalidade adaptativa** baseada no perfil do usuário (nível, objetivo, histórico de conversas)
- **Memória cross-session** via tabela `chat_memory` — o bot lembra o que foi discutido em sessões anteriores
- **Perfis VIP** — Paula Calefi e Aly Baddauhy têm perfis cadastrados com bio, relação com o Estevão e instruções de tom personalizadas
- **Suporte a áudio** — o aluno pode enviar mensagens de voz, que são transcritas via Whisper (S3 + API) e processadas pelo bot
- **Streaming de resposta** — respostas chegam em tempo real, com renderização de Markdown via `Streamdown`

| Perfil VIP | Relação | Tom configurado |
|---|---|---|
| Paula Oliveira Calefi | Esposa do Estevão, co-gestora da escola | Caloroso, pessoal, familiar |
| Aly Baddauhy Jr. | Futuro sócio, franqueado inFlux Cuiabá | Estratégico, direto, entre parceiros |

### 3.3 Tutor Personalizado

O módulo de tutoria oferece conteúdo adaptado ao nível e objetivo de cada aluno. Existem três versões do tutor em produção (`tutor`, `tutor-personalized`, `tutor-personalized-v2`), cada uma com maior grau de personalização. O sistema cruza dados do Sponte (nível, livro atual, unidade) com o histórico de exercícios para gerar sugestões cirúrgicas.

### 3.4 Exercícios e Gamificação

Os alunos têm acesso a exercícios adaptativos, extra-exercícios por livro/unidade e um sistema completo de gamificação:

- **influxcoin** — moeda interna de recompensa
- **Badges** — conquistas desbloqueáveis por ações específicas
- **Leaderboard** — ranking de pontos entre alunos
- **Spaced Repetition** — agendamento de revisão baseado em desempenho
- **Quiz** com leaderboard em tempo real

### 3.5 Pronúncia e Voz

O módulo de pronúncia permite que o aluno grave sua fala, envie ao servidor e receba avaliação da IA comparando com o áudio nativo. O fluxo completo é: gravação no browser → upload S3 → transcrição Whisper → análise LLM → feedback detalhado com pontuação e sugestões.

### 3.6 Passaporte inFlux

Sistema de check-in gamificado via QR Code. Cada aluno possui um passaporte digital com carimbos por presença e participação. O módulo inclui geração de QR Codes únicos, página de check-in para tablets na recepção e sincronização automática de presenças.

### 3.7 Reading Club

Clube de leitura digital com posts, comentários, eventos e sistema de pontuação em influxcoin. Temporariamente liberado para todos os usuários; no futuro será restrito a membros.

### 3.8 Blog de Dicas (Blog Tips)

Canal de dicas de inglês com engajamento (curtidas, favoritos, feedback). As dicas são geradas com suporte de IA e podem ser compartilhadas via WhatsApp. O módulo rastreia engajamento por aluno para personalizar o conteúdo futuro.

### 3.9 Eventos Culturais — St. Patrick's Night

Módulo completo para eventos temáticos com missões gamificadas. O evento St. Patrick's Night (20 de março de 2026) inclui:

| Missão | Descrição |
|---|---|
| **Chunk Lesson** | 10 FlipCards com expressões irlandesas |
| **Culture Quiz** | 8 perguntas sobre cultura irlandesa |
| **Chunk Listening** | 7 lacunas de áudio para completar |
| **Speaking Challenge** | Desafio de pronúncia com microfone |
| **Food Challenge** | Desafio culinário cultural |
| **Leaderboard** | Ranking em tempo real dos participantes |
| **EventScore** | Tela final com resultado, score e CTA de matrícula |

### 3.10 Integração com Sponte (CRM)

Sincronização bidirecional com o sistema Sponte Web da inFlux. O job diário (18h, horário de Brasília) atualiza automaticamente: alunos ativos, níveis, livros, unidades, objetivos e status financeiro. O módulo `cross-analysis` cruza dados do Sponte com o comportamento na plataforma para identificar alunos em risco.

### 3.11 Mineração do Histórico WhatsApp

Módulo novo (versão `36ec738b`) que processa o histórico completo do celular do Retiro (11) 95766-7482 via Z-API. O fluxo é:

1. **Extração** — lista todos os chats individuais via Z-API, paginando mensagens
2. **Análise IA** — cada conversa é analisada pelo LLM, que extrai: nome, interesse, status, temperatura (1-10), urgência, objeções e melhor abordagem
3. **Classificação** — leads com temperatura ≥ 7 são marcados como "quentes"
4. **Interface** — painel em `/admin/mineracao-historico` com progress bar, contadores e tabela de leads quentes

### 3.12 Notificações e Alertas

Sistema de notificações push para o dono da escola (`notifyOwner`) e para alunos. Inclui alertas de follow-up, novos leads, sincronizações concluídas e eventos pedagógicos.

### 3.13 Gestão de Materiais e Conteúdo

Upload de materiais pedagógicos com compartilhamento por turma ou aluno individual. Suporte a PDF, áudio e vídeo, com armazenamento em S3 e metadados no banco.

### 3.14 Links Personalizados

Geração de links únicos para acesso direto à plataforma sem necessidade de login manual — ideal para campanhas de WhatsApp e e-mail marketing.

### 3.15 Sincronização em Massa e Back to School

Módulos especializados para campanhas sazonais: `back-to-school` com dashboard de conversão, `bulk-student-sync` para importação em massa de alunos e `bulk-config` para configurações globais.

---

## 4. Banco de Dados — Tabelas Ativas

O banco possui **62 tabelas** cobrindo todas as entidades do sistema:

| Categoria | Tabelas |
|---|---|
| **Usuários e Perfis** | `users`, `studentProfiles`, `vipProfiles` |
| **Chat e IA** | `conversations`, `messages`, `chatMemory` |
| **Conteúdo Pedagógico** | `books`, `units`, `lessons`, `chunks`, `exercises`, `extraExercises` |
| **Progresso do Aluno** | `studentBookProgress`, `studentChunkProgress`, `studentExerciseProgress`, `studentTopicProgress`, `spacedRepetitionSchedule` |
| **Gamificação** | `badgeDefinitions`, `studentBadges`, `leaderboard`, `quizResults`, `studentInfluxDollars`, `influxDollarTransactions`, `pointsHistory` |
| **Reading Club** | `readingClubPosts`, `readingClubComments`, `readingClubEvents`, `readingClubEventParticipants`, `readingClubBadges` |
| **Eventos** | `culturalEvents`, `eventParticipants`, `eventMissionProgress` |
| **CRM / Comercial** | `miningProgress`, `miningSession`, `studentImportedData` |
| **Operacional** | `passportQRCodes`, `personalizedLinks`, `materialClassShare`, `materialStudentShare`, `schoolActivities` |
| **Campanhas** | `backToSchoolCampaign`, `backToSchoolSyncLog`, `studentBackToSchoolEnrollment` |

---

## 5. Cobertura de Testes

O projeto conta com **29 arquivos de teste** (Vitest), cobrindo os módulos mais críticos:

- Autenticação (logout, login direto)
- Chat e mensagens WhatsApp
- Sincronização Sponte
- Gamificação e badges
- Passaporte QR
- Exercícios extras e TTS
- Exportação admin
- Notificações

---

## 6. Ativos de Marketing Produzidos

Além do sistema web, foram produzidos os seguintes ativos para o evento St. Patrick's Night:

| Formato | Descrição | Status |
|---|---|---|
| **WhatsApp Mobile** (3:4) | Arte principal com duas mulheres brindando, data e telefone | ✅ Final |
| **Instagram Feed** (1:1) | Arte quadrada para feed | ✅ Produzida |
| **Instagram Stories** (9:16) | Arte vertical para stories | ✅ Produzida |
| **WhatsApp Banner** (16:9) | Banner horizontal para grupos | ✅ Produzida |
| **Vídeo convite** (9:16, ~12s) | 3 cenas: trevo animado → celebração → convite | ✅ Produzido |

**Dados do evento:**
- **Data:** Sexta-feira, 20 de Março de 2026
- **Horário:** 18h30 às 22h00
- **Local:** inFlux Jundiaí
- **Contato:** (11) 95766-7482

---

## 7. Pessoas-Chave no Sistema

| Nome | Papel | Status no Sistema |
|---|---|---|
| **Estevão Cordeiro** | Dono, admin, fundador da mAind | Admin ativo |
| **Paula Oliveira Calefi** | Esposa, co-gestora | Perfil VIP cadastrado |
| **Aly Baddauhy Jr.** | Futuro sócio, franqueado inFlux Cuiabá | Perfil VIP cadastrado |
| **Isis Calefi** | Filha da Paula, aluna da inFlux | Aluna na plataforma |

---

## 8. Próximos Passos Prioritários

Com base no estado atual do projeto, as seguintes iniciativas têm maior potencial de impacto imediato:

**8.1 Vincular contas VIP** — Paula e Aly precisam fazer login na plataforma para que seus perfis VIP sejam associados ao `userId` deles. Isso ativa o reconhecimento automático e a memória personalizada no chat.

**8.2 Executar a Mineração do Histórico** — O motor está pronto. Acessar `/admin/mineracao-historico` e iniciar o job para processar os anos de conversas do celular do Retiro. O resultado será uma lista de leads quentes com temperatura, interesse e melhor abordagem para cada contato.

**8.3 Expandir para outras unidades** — A arquitetura do mAind foi construída para ser multi-escola. O próximo passo natural é criar um modo de onboarding para que o Aly possa conectar a unidade de Cuiabá ao sistema, testando o modelo de franquia da mAind.

**8.4 Painel de gestão de Perfis VIP** — Criar interface admin para cadastrar novos VIPs, editar bio/tom e visualizar o histórico de memórias de cada pessoa — essencial à medida que a rede de parceiros cresce.

**8.5 Integração de pagamento** — Adicionar Stripe para cobranças de matrículas, mensalidades e eventos diretamente pela plataforma, eliminando a dependência do Sponte para o fluxo financeiro.

---

## 9. Métricas do Projeto

| Métrica | Valor |
|---|---|
| **Checkpoints (versões)** | 172 |
| **Routers de backend** | 55 arquivos |
| **Páginas de frontend** | 50 arquivos |
| **Tabelas no banco** | 62 |
| **Arquivos de teste** | 29 |
| **Linhas de código (backend)** | ~20.000 |
| **Linhas de código (frontend)** | ~15.800 |
| **Alunos sincronizados** | 246 (182 ativos) |
| **Usuários na plataforma** | 234 (229 vinculados ao Sponte) |

---

*Relatório gerado em 18 de março de 2026. Projeto em desenvolvimento ativo.*
