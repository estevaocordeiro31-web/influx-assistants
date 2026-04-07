# Relatório Técnico: Sincronização inFlux ↔ Dashboard Central

**Projeto:** inFlux Personal Assistants  
**Versão:** 08d05439 (atual)  
**Data:** Março 2026  
**Autor:** Manus AI  

---

## 1. Visão Geral da Arquitetura

O ecossistema inFlux é composto por dois sistemas que compartilham o **mesmo banco de dados MySQL** (variável de ambiente `CENTRAL_DATABASE_URL`):

| Sistema | URL | Função |
|---|---|---|
| **Dashboard Central (influxmind)** | https://influxmind.manus.space | Gestão de alunos, matrículas, financeiro, CRM |
| **inFlux Personal Assistants** | https://influxassist-2anfqga4.manus.space | Tutor IA (Elie), exercícios, badges, passaporte |

Como ambos os sistemas acessam o **mesmo banco de dados**, a sincronização é direta via SQL — sem necessidade de API REST intermediária.

---

## 2. Estado Atual do Banco de Dados (Março 2026)

| Métrica | Valor |
|---|---|
| Total de alunos na tabela `students` | **2.849** |
| Alunos com status `Ativo` | **190** |
| Usuários na tabela `users` (role = 'user') | **208** |
| Usuários vinculados (`student_id` preenchido) | **198** |
| Usuários sem vínculo | **10** |
| Registros de inteligência (`student_intelligence`) | **7** |

---

## 3. Estrutura das Tabelas Relevantes

### 3.1 Tabela `students` (fonte de verdade — Dashboard Central)

Esta é a tabela principal de cadastro de alunos, gerenciada pelo Dashboard Central.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int PK | ID único do aluno |
| `matricula` | varchar(255) | Número de matrícula |
| `name` | varchar(255) | Nome completo |
| `email` | varchar(320) | Email do aluno |
| `phone` | varchar(100) | Telefone |
| `cpf` | varchar(14) | CPF |
| `status` | enum | `Ativo`, `Inativo`, `Desistente`, `Trancado`, `Bolsista`, `Formado`, `Interessado`, `OnBusiness1`, `OnBusiness2`, `Travel`, `Transferido`, `pendente_pagamento` |
| `book_level` | enum | Nível atual: `BOOK_1`…`BOOK_5`, `CAMINO_1`…`CAMINO_4`, `SUMMIT`, `FLUXIE_*`, `JUNIOR_*`, `ON_BUSINESS_*`, `TRAVEL_*`, `COMUNICACAO_AVANCADA` |
| `class_group_id` | int | ID da turma |
| `schedule` | varchar(255) | Horário das aulas |
| `health_score` | int | Score de saúde do aluno (0–100) |
| `churn_risk_level` | enum | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `unidade_id` | int | ID da unidade (escola) |

### 3.2 Tabela `users` (compartilhada — login e perfil)

Tabela de usuários do sistema, usada tanto pelo Dashboard Central quanto pelo inFlux.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int PK | ID do usuário |
| `openId` | varchar(64) UNIQUE | Identificador OAuth único |
| `name` | text | Nome do usuário |
| `email` | varchar(320) | Email |
| `password_hash` | varchar(255) | Hash da senha (bcrypt) |
| `role` | enum | `user`, `admin`, `owner`, `teacher` |
| `student_id` | int FK | **Vínculo com `students.id`** — campo chave para sincronização |
| `unidade_id` | int | ID da unidade |

> **Campo crítico:** `student_id` é o elo entre o usuário do inFlux e o cadastro do aluno no Dashboard Central. Quando preenchido, o sistema consegue sincronizar dados bidirecionalmente.

### 3.3 Tabela `student_intelligence` (dados da Elie)

Armazena o perfil de aprendizado gerado pela Elie após sessões de tutoria.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int PK | ID do registro |
| `contact_phone` | varchar(20) UNIQUE | Telefone do aluno (chave de busca) |
| `student_id` | int | Vínculo com `students.id` |
| `interest_profile` | text | Perfil de interesses do aluno |
| `pain_points` | text | Dificuldades identificadas |
| `learning_style` | enum | `visual`, `auditivo`, `cinestetico`, `leitura_escrita` |
| `current_level` | varchar(50) | Nível atual avaliado pela Elie |
| `mastered_topics` | json | Tópicos dominados `["grammar", "vocabulary"]` |
| `struggling_topics` | json | Tópicos com dificuldade |
| `confidence_score` | int | Score de confiança (0–100) |
| `last_tutor_sync` | timestamp | Última sincronização com a Elie |

### 3.4 Tabela `tutor_conversations` (histórico de conversas)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int PK | ID da conversa |
| `student_id` | int | Vínculo com `students.id` |
| `intelligence_id` | int | Vínculo com `student_intelligence.id` |
| `title` | varchar(255) | Título/resumo da sessão |
| `created_at` | timestamp | Data da conversa |

### 3.5 Tabela `student_profiles` (perfil pedagógico)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int PK | ID do perfil |
| `user_id` | int | Vínculo com `users.id` |
| `photo_url` | text | URL da foto do aluno |
| `learning_goal` | text | Objetivo de aprendizado |
| `notification_preferences` | json | Preferências de notificação |

### 3.6 Tabela `tutor_student_progress` (progresso por chunk)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int PK | ID do progresso |
| `student_id` | int | Vínculo com `students.id` |
| `chunk_id` | int | ID do chunk de vocabulário |
| `mastery_level` | int | Nível de domínio (0–5) |
| `practice_count` | int | Número de práticas |
| `last_practiced_at` | timestamp | Última prática |

---

## 4. Fluxo de Sincronização Implementado

### 4.1 Sincronização Automática Diária (18h — Brasília)

**Arquivo:** `server/jobs/daily-sync.ts`

O job roda automaticamente às 18h (America/Sao_Paulo) e executa:

```
1. Busca TODOS os alunos da tabela `students` com email preenchido
2. Para cada aluno:
   a. Se NÃO tem usuário → cria usuário (apenas se status = 'Ativo')
      - Gera openId único (SHA256)
      - Senha padrão: PrimeiroNome@2026
      - Envia email de boas-vindas
   b. Se JÁ tem usuário → atualiza nome e student_id
3. Retorna relatório: criados, atualizados, erros
```

**Mapeamento de `book_level` → nível inFlux:**

| book_level (Dashboard) | Nível (inFlux) |
|---|---|
| FLUXIE_1A, FLUXIE_1B, BOOK_1, JUNIOR_A/B/1 | `iniciante` |
| FLUXIE_2A, FLUXIE_2B, BOOK_2, JUNIOR_2/3 | `elementar` |
| BOOK_3, BOOK_4, CAMINO_1/2, TRAVEL_1 | `intermediario` |
| BOOK_5, CAMINO_3/4, SUMMIT, ON_BUSINESS_*, TRAVEL_2, COMUNICACAO_AVANCADA | `avancado` |

### 4.2 Sincronização Manual (AdminDashboard)

**Arquivo:** `server/routers/bulk-student-sync.ts`  
**Procedure:** `adminStudents.syncAllStudents`

Botão "Sincronizar com Dashboard (X ativos)" no AdminDashboard executa a mesma lógica do job diário sob demanda.

### 4.3 Sincronização da Elie → Dashboard Central

**Arquivo:** `server/routers/elie-sync.ts`

Após cada sessão de tutoria, a Elie sincroniza automaticamente:

| Procedure | Destino | Dados |
|---|---|---|
| `elieSync.syncStudentIntelligence` | `student_intelligence` | Perfil, estilo, tópicos, score |
| `elieSync.logTutorConversation` | `tutor_conversations` | Resumo da sessão, tópicos, duração |
| `elieSync.getStudentIntelligence` | — | Leitura do perfil para personalizar sessões |

**Integração no tutor:** `server/routers/tutor.ts` chama `elieSync` automaticamente após cada chat, registrando `last_tutor_sync` no banco central.

---

## 5. Fluxo Completo de Acesso de um Aluno

```
Dashboard Central (influxmind)
    ↓ Aluno cadastrado com status 'Ativo'
    ↓
Job Diário 18h (ou Sync Manual)
    ↓ Cria usuário em `users` com student_id vinculado
    ↓ Envia email: "Seu acesso: email + PrimeiroNome@2026"
    ↓
Aluno acessa influxassist-2anfqga4.manus.space
    ↓ Login com email + senha temporária
    ↓
StudentDashboard (inFlux)
    ↓ Exercícios, Badges, Passaporte, Tutor Elie
    ↓
Sessão com Elie
    ↓ Sincroniza student_intelligence → banco central
    ↓ Dashboard Central vê: learning_style, mastered_topics, confidence_score
```

---

## 6. O que Falta Implementar no Dashboard Central

Para que o Dashboard Central (influxmind) **exiba os dados gerados pelo inFlux**, é necessário criar uma seção/aba de "Dados Pedagógicos" que leia as tabelas:

### 6.1 Tela de Perfil do Aluno no Dashboard Central

Adicionar ao perfil do aluno no influxmind uma aba **"inFlux AI"** com:

```sql
-- Dados da Elie para exibir no Dashboard Central
SELECT 
  si.interest_profile,
  si.pain_points,
  si.learning_style,
  si.current_level,
  si.mastered_topics,
  si.struggling_topics,
  si.confidence_score,
  si.last_tutor_sync,
  COUNT(tc.id) as total_sessions,
  MAX(tc.created_at) as last_session
FROM student_intelligence si
LEFT JOIN tutor_conversations tc ON tc.student_id = si.student_id
WHERE si.student_id = :student_id
GROUP BY si.id
```

### 6.2 Dashboard de Métricas de Engajamento

Adicionar ao painel administrativo do influxmind:

```sql
-- Alunos com sessões ativas na Elie
SELECT 
  s.name,
  s.email,
  s.book_level,
  si.confidence_score,
  si.learning_style,
  si.last_tutor_sync,
  COUNT(tc.id) as sessions_count
FROM students s
JOIN student_intelligence si ON si.student_id = s.id
LEFT JOIN tutor_conversations tc ON tc.student_id = s.id
WHERE s.status = 'Ativo'
GROUP BY s.id, si.id
ORDER BY si.last_tutor_sync DESC
```

### 6.3 Alerta de Alunos em Risco

```sql
-- Alunos ativos que não usaram a Elie nos últimos 7 dias
SELECT s.name, s.email, s.phone, s.health_score
FROM students s
LEFT JOIN student_intelligence si ON si.student_id = s.id
WHERE s.status = 'Ativo'
AND (si.last_tutor_sync IS NULL OR si.last_tutor_sync < DATE_SUB(NOW(), INTERVAL 7 DAY))
ORDER BY s.health_score ASC
```

---

## 7. Problemas Conhecidos e Pendências

| Problema | Impacto | Solução Recomendada |
|---|---|---|
| **10 usuários sem vínculo** (`student_id = NULL`) | Esses alunos não têm dados sincronizados com o Dashboard Central | Criar tela de reconciliação manual no AdminDashboard |
| **`student_intelligence` usa `contact_phone` como UNIQUE** | Alunos sem telefone não podem ter registro de inteligência | Alterar para usar `student_id` como chave alternativa |
| **Senha temporária exposta no email** | Segurança: aluno deve trocar na primeira entrada | Implementar tela de "primeiro acesso" com troca obrigatória de senha |
| **Sem notificação ao owner após sync** | Admin não sabe quantos alunos foram criados | Adicionar `notifyOwner()` no final do job diário |
| **Dashboard Central não exibe dados da Elie** | Gestores não veem progresso pedagógico | Implementar aba "inFlux AI" no perfil do aluno no influxmind |

---

## 8. Routers do inFlux Relacionados à Sincronização

| Arquivo | Router | Procedures Relevantes |
|---|---|---|
| `server/jobs/daily-sync.ts` | — (job cron) | `syncStudents()`, `getSyncStats()`, `runDailySyncNow()` |
| `server/routers/bulk-student-sync.ts` | `adminStudents` | `syncAllStudents`, `getSyncStats` |
| `server/routers/elie-sync.ts` | `elieSync` | `syncStudentIntelligence`, `logTutorConversation`, `getStudentIntelligence`, `getSyncStats` |
| `server/routers/admin-students.ts` | `adminStudents` | `getStudents`, `createStudent`, `updateStudent` |
| `server/routers/tutor.ts` | `tutor` | `chat` (chama elieSync automaticamente) |

---

## 9. Variáveis de Ambiente Necessárias

| Variável | Uso |
|---|---|
| `CENTRAL_DATABASE_URL` | Conexão MySQL com banco compartilhado (já configurada) |
| `JWT_SECRET` | Assinatura de cookies de sessão |
| `VITE_APP_ID` | OAuth App ID do Manus |
| `OAUTH_SERVER_URL` | Backend OAuth do Manus |
| `ELEVENLABS_API_KEY` | TTS para voz da Elie |
| `OPENAI_API_KEY` | LLM para respostas da Elie |

---

## 10. Próximas Ações Recomendadas

As ações estão ordenadas por prioridade e impacto:

**Alta Prioridade:**

1. **Implementar aba "inFlux AI" no Dashboard Central** — Exibir `student_intelligence`, `tutor_conversations` e `confidence_score` no perfil do aluno no influxmind. Requer desenvolvimento no projeto influxmind.

2. **Reconciliar 10 usuários sem vínculo** — Criar tela no AdminDashboard que lista usuários com `student_id = NULL` e permite associação manual ao registro correto do Dashboard Central.

3. **Notificação pós-sync** — Adicionar `notifyOwner({ title: 'Sync Diário', content: 'X criados, Y atualizados' })` no final do job `daily-sync.ts`.

**Média Prioridade:**

4. **Tela de primeiro acesso** — Detectar se é o primeiro login do aluno e forçar troca de senha (atualmente a senha padrão `PrimeiroNome@2026` nunca expira).

5. **Dashboard de engajamento** — Painel no influxmind mostrando quais alunos ativos estão usando a Elie, com `confidence_score` e última sessão.

6. **Alerta de churn pedagógico** — Notificação automática para alunos ativos que não usaram a Elie em 7+ dias.

**Baixa Prioridade:**

7. **Corrigir `student_intelligence` UNIQUE** — Alterar a constraint de `contact_phone` para `student_id` para suportar alunos sem telefone cadastrado.

8. **Sincronização de progresso de exercícios** — Gravar `student_exercise_progress` do inFlux na tabela `tutor_student_progress` do banco central para visibilidade no Dashboard.

---

## 11. Resumo Executivo

O inFlux Personal Assistants e o Dashboard Central (influxmind) compartilham o mesmo banco MySQL, o que elimina a necessidade de APIs REST para sincronização. A sincronização já está **funcionando em produção**:

- **Job automático às 18h** cria contas para novos alunos ativos e atualiza vínculos
- **Botão de sync manual** no AdminDashboard permite sincronização sob demanda
- **Elie sincroniza automaticamente** após cada sessão, gravando perfil de aprendizado no banco central
- **198 de 208 usuários** já estão vinculados ao cadastro do Dashboard Central

O principal gap é que o **Dashboard Central ainda não exibe os dados pedagógicos gerados pela Elie**. A próxima etapa crítica é implementar a aba "inFlux AI" no perfil do aluno no projeto influxmind, consumindo as tabelas `student_intelligence` e `tutor_conversations` que já estão sendo populadas.
