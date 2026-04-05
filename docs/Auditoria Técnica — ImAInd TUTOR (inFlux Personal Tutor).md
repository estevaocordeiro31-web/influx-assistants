# Auditoria Técnica — ImAInd TUTOR (inFlux Personal Tutor)
**Data:** 23 de março de 2026 | **Versão do sistema:** `275d4b9f` | **Projeto:** `influx-assistants`

---

## SEÇÃO 1 — ESTRUTURA DE DADOS: ALUNOS

### Como o Tutor busca os dados dos alunos?

O Tutor opera com **dois bancos de dados em paralelo**: um banco local (TiDB/MySQL) exclusivo do projeto e um banco central compartilhado com o ImAInd BRAiN. A lógica de busca segue uma hierarquia clara:

1. **Banco local** (`studentPersonalization.getPersonalizedDashboard`) — é consultado primeiro. Contém o progresso real do aluno: livros em andamento, unidades concluídas, streak de dias, horas estudadas, badges conquistadas, configurações de personagem favorito e histórico de prática.
2. **Banco central** (`studentData.getMyStudentData`) — consultado em paralelo para enriquecer o perfil com dados administrativos: nível do book, nome da turma, horário, health score e PA confidence score. Esses dados vêm da tabela `students` do banco central TiDB.

Se o aluno não tiver vínculo no banco central (ou seja, não foi importado do Sponte), o sistema **não quebra** — ele exibe os dados locais e omite silenciosamente as informações administrativas. Se também não houver dados locais, o sistema exibe o `DEMO_STUDENT`, um perfil fictício de demonstração que simula um aluno do Book 5.

### Está conectado ao banco do Brain ou tem banco próprio?

**Ambos.** O sistema usa `DATABASE_URL` (banco local MySQL/TiDB) para dados pedagógicos e `CENTRAL_DATABASE_URL` (banco central compartilhado com o BRAiN) para dados administrativos dos alunos. A conexão com o banco central é feita via `server/db-central.ts`, que usa Drizzle ORM com o schema `shared/central-schema.ts`.

### Quais tabelas/endpoints está consumindo?

| Fonte | Tabela / Router | Dados |
|---|---|---|
| Banco local | `studentProfiles` | Nível, streak, horas, personagem favorito |
| Banco local | `studentBookProgress` | Livros em andamento e concluídos |
| Banco local | `studentPracticeHistory` | Histórico de prática com Elie |
| Banco local | `studentBadges` | Badges conquistadas |
| Banco central | `students` | Nome, turma, book, horário, health score |
| Banco central | `studentEnrollments` | Matrículas e status ativo/inativo |
| API Sponte | `SPONTE_API_URL` | Sincronização periódica via `elie-sync` router |

### Os dados estão sincronizados em tempo real ou são estáticos?

**Híbrido.** Os dados pedagógicos (progresso, prática, badges) são atualizados em tempo real via mutações tRPC. Os dados administrativos do banco central são sincronizados via **cron job** configurado no router `elie-sync`, que puxa do Sponte e atualiza o banco central periodicamente. Não há WebSocket ou streaming — tudo é polling/query padrão do tRPC.

---

## SEÇÃO 2 — AUTENTICAÇÃO

### Como o aluno faz login hoje?

O aluno tem **dois caminhos de acesso**:

**Caminho 1 — Link Personalizado** (`/access/:linkHash`): O admin gera um link único por aluno no BRAiN. O aluno clica no link, o sistema valida o `linkHash` via `personalizedLinks.authenticateViaLink`, cria uma sessão JWT e redireciona para `/student/dashboard`. Este é o **fluxo principal planejado para o lançamento**.

**Caminho 2 — Manus OAuth** (`/api/oauth/callback`): Login padrão via Manus OAuth Portal. O aluno acessa a URL raiz, clica em "Entrar" e é redirecionado para o portal de login Manus. Após autenticação, o sistema verifica o `role` do usuário (`user` → Student Dashboard, `admin` → Admin Dashboard).

### O sistema de auth é compartilhado com o Brain ou separado?

**Compartilhado.** Ambos usam o mesmo mecanismo de autenticação: Manus OAuth + JWT cookie (`COOKIE_NAME`). O `ctx.user` injetado em cada procedure tRPC é o mesmo objeto em todos os módulos. A diferença é o campo `role` — alunos têm `role: "user"`, administradores têm `role: "admin"`. Não existe `role: "teacher"` ou `role: "staff"` implementado atualmente.

### Existe perfil de Teacher/Staff no modelo de dados?

**Não como role de autenticação.** O schema tem um campo `teacher` (varchar) na tabela de turmas para registrar o nome do professor, mas não existe um `role: "teacher"` no enum de roles da tabela `users`. O modelo atual suporta apenas `admin` e `user`. A criação de um role `teacher` exigiria migração de schema e novas procedures protectedProcedure com verificação de role.

---

## SEÇÃO 3 — ELIE

### A Elie está implementada no Tutor?

**Sim, parcialmente.** A Elie está implementada com os seguintes componentes funcionais:

**O que existe e funciona:**
- Router `elie` com procedures: `chat` (conversa com IA), `getHistory` (histórico de mensagens), `clearHistory` (limpar conversa), `getProfile` (perfil da Elie para o aluno)
- Componente `AIChatBox.tsx` integrado à aba "Meu Tutor" do Student Dashboard
- Personalidade completa definida em `server/routers/elie.ts` via system prompt

**Personalidade configurada:**
A Elie é definida como tutora de inglês da inFlux com as seguintes características: entusiasta, encorajadora, especialista em inglês real (connected speech, pronúncia), focada no conteúdo que o aluno está estudando no momento, sem introduzir estruturas gramaticais além do nível atual. O system prompt inclui o nome do aluno, nível atual, livro em andamento e histórico recente de prática para personalização contextual.

**Modelo de IA:**
Usa `invokeLLM` do helper `server/_core/llm.ts`, que aponta para a Forge API (`BUILT_IN_FORGE_API_URL` + `BUILT_IN_FORGE_API_KEY`). O modelo específico é definido pelo helper — não está hardcoded no código da Elie.

**Endpoints que usa:**
- `trpc.elie.chat` — envio de mensagem e resposta da Elie
- `trpc.elie.getHistory` — carregamento do histórico
- `trpc.elie.getProfile` — dados da Elie para exibição no chat

**O que está incompleto:**
- Não há TTS (voz) na Elie — ela responde apenas em texto. O bate-papo por voz está planejado mas não implementado.
- Não há streaming de resposta — a resposta aparece completa após o processamento, sem efeito de digitação em tempo real.
- A sincronização com o Sponte (`elie-sync`) está implementada no backend mas o cron job não está ativo em produção.

---

## SEÇÃO 4 — INTERFACE ATUAL

### Quais são as telas existentes no Tutor hoje?

| Rota | Tela | Status |
|---|---|---|
| `/` | Home / Landing Page | Funcional |
| `/student/dashboard` | Student Dashboard (hub principal) | Funcional |
| `/student/dashboard` → aba Elie | Chat com a Elie | Funcional (sem voz) |
| `/student/dashboard` → aba Meu Tutor | Perfil + dados do aluno | Funcional |
| `/student/dashboard` → aba Reading Club | Clube de leitura | Funcional (liberado para todos) |
| `/student/dashboard` → aba Vacation+ | Conteúdo extra | Funcional (acesso por curso) |
| `/access/:linkHash` | Entrada via link personalizado | Funcional |
| `/lessons` | Biblioteca de lições | Funcional |
| `/animations` | Animações pedagógicas | Funcional |
| `/demo` | Demo do sistema | Funcional |
| `/onboarding` | Tutorial de boas-vindas | Funcional (via localStorage) |

### Qual o stack frontend?

**React 19** + **TypeScript** + **Tailwind CSS 4** + **shadcn/ui** + **tRPC 11** + **Wouter** (roteamento). Build via **Vite**. Sem Next.js — é uma SPA pura servida pelo Express.

### Tem dark mode implementado?

**Sim.** O `ThemeProvider` está configurado com `defaultTheme="dark"`. O CSS em `index.css` define as variáveis de cor para o tema escuro (`.dark {}`). O Student Dashboard usa fundo dinâmico baseado no book do aluno (`getBookTheme(bookNumber)`) — cada livro tem um gradiente de cor próprio. Não há toggle de dark/light mode exposto ao usuário — o dark mode é fixo.

---

## SEÇÃO 5 — PONTOS DE FALHA E BLOQUEADORES

### O que está quebrado ou incompleto?

| # | Problema | Impacto | Gravidade |
|---|---|---|---|
| 1 | **Elie sem voz** | Experiência incompleta — a proposta de bate-papo por voz não está entregue | Alta |
| 2 | **Sem streaming na Elie** | Respostas longas parecem travadas — UX inferior ao ChatGPT | Média |
| 3 | **Cron de sincronização Sponte inativo** | Dados administrativos do aluno (turma, horário, health score) ficam desatualizados | Média |
| 4 | **Sem role `teacher`** | Professores não têm acesso diferenciado — precisam de conta admin para ver dados dos alunos | Média |
| 5 | **Onboarding via localStorage** | Se o aluno trocar de dispositivo ou limpar o cache, o onboarding reaparece | Baixa |
| 6 | **Links sem prazo de expiração** | Os links personalizados não têm `expiresAt` configurado — ficam ativos indefinidamente | Baixa |
| 7 | **DEMO_STUDENT como fallback** | Aluno sem vínculo no banco central vê dados fictícios sem aviso visual claro | Baixa |

### O que impede de liberar acesso aos alunos agora?

Tecnicamente, **nada impede** o lançamento imediato. O sistema está funcional para o fluxo principal. Os três passos necessários são:

1. **Gerar os links personalizados** — no Admin Dashboard → Gestão de Alunos → gerar link para cada aluno ativo. Pode ser feito em lote via script ou um a um pela interface.
2. **Enviar os links** — via WhatsApp ou e-mail com mensagem personalizada. O link leva diretamente ao Student Dashboard sem necessidade de senha.
3. **Verificar se os alunos estão no banco central** — alunos sem vínculo verão o `DEMO_STUDENT`. Recomenda-se rodar a sincronização manual do Sponte antes do lançamento para garantir que todos os 226 alunos ativos estejam com dados reais.

### Os 3 maiores problemas hoje

**1. Elie sem voz e sem streaming** — é o diferencial mais prometido e está incompleto. Um aluno que abre o chat espera uma experiência próxima ao ChatGPT com voz; o que encontra é um chat de texto com delay perceptível.

**2. Ausência de role `teacher`** — professores não conseguem acompanhar o progresso dos seus alunos sem ter acesso admin completo. Isso cria um risco de privacidade e impede o uso pedagógico real do sistema em sala de aula.

**3. Sincronização Sponte manual** — sem o cron ativo, os dados de turma, horário e health score ficam congelados no momento da última sincronização manual. Alunos que trocam de turma ou têm status alterado no Sponte não terão isso refletido automaticamente no Tutor.

---

## RESUMO EXECUTIVO

O ImAInd Tutor está **pronto para lançamento** com as funcionalidades core: acesso via link personalizado, Student Dashboard com dados reais, chat com a Elie, Reading Club, Vacation+ e onboarding. A infraestrutura de dados (banco local + banco central + Sponte) está conectada e funcionando.

O lançamento pode acontecer **esta semana** com 3 ações: gerar links, sincronizar Sponte e enviar por WhatsApp. As melhorias de voz da Elie, streaming e role de professor podem ser implementadas em paralelo sem bloquear o acesso dos alunos.

---

*Auditoria realizada por varredura direta no código-fonte do projeto `influx-assistants` (versão `275d4b9f`). Todos os dados são verificáveis nos arquivos referenciados.*
