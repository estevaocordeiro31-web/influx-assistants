# Arquitetura de Integração: Dashboard ↔ inFlux Personal Assistants

## Visão Geral

Criar um **sistema de integração bidirecional** onde o Dashboard é a **fonte única de verdade** para dados de alunos, e o inFlux Personal Assistants é um **consumidor inteligente** que enriquece esses dados com informações de acompanhamento pedagógico.

```
┌─────────────────────────────────────────────────────────────────┐
│                    inFlux IAfirst Ecosystem                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────────┐  │
│  │   DASHBOARD          │         │  PERSONAL ASSISTANTS     │  │
│  │  (Fonte de Dados)    │         │  (Consumidor + Enriquecedor)
│  │                      │         │                          │  │
│  │ • Alunos (171)       │◄───────►│ • Quizzes               │  │
│  │ • Turmas             │  Sync   │ • Dificuldades         │  │
│  │ • Níveis             │  API    │ • Padrões de Aprendizado
│  │ • Cadastros          │         │ • Adaptação da IA      │  │
│  │ • Status             │         │ • Progresso            │  │
│  │                      │         │                          │  │
│  └──────────────────────┘         └──────────────────────────┘  │
│           ▲                                    ▲                  │
│           │                                    │                  │
│           │ Dados de Cadastro                  │ Dados de         │
│           │ (Fonte Única)                      │ Acompanhamento   │
│           │                                    │ (Feedback Loop)  │
│           │                                    │                  │
│  ┌────────┴─────────────────────────────────────┴──────────┐    │
│  │         Shared Data Layer (Sincronização)              │    │
│  │                                                         │    │
│  │ • Fila de Sincronização (Redis/RabbitMQ)             │    │
│  │ • Webhook para Eventos                                │    │
│  │ • API REST para Queries                               │    │
│  │ • Audit Log de Sincronizações                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Fluxo de Dados

### 1️⃣ Sincronização de Alunos (Dashboard → Personal Assistants)

**Quando**: 
- Novo aluno criado no Dashboard
- Aluno atualizado (nível, turma, status)
- Diariamente (sincronização em lote)

**O que é sincronizado**:
```json
{
  "student_id": "STU-2026-0001",
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "+55 11 98765-4321",
  "level": "A1",
  "class": "Turma A - Manhã",
  "status": "ativo",
  "enrollment_date": "2026-01-15",
  "birth_date": "2015-06-20",
  "interests": ["games", "music", "sports"],
  "learning_style": "visual",
  "goals": ["conversação", "listening"],
  "difficulties": ["pronunciation", "listening"],
  "sponte_profile": { /* dados cirúrgicos do Sponte */ }
}
```

**Mecanismo**:
- **API REST**: `GET /api/dashboard/students?updated_since=timestamp`
- **Webhook**: POST ao Personal Assistants quando aluno é criado/atualizado
- **Batch Job**: Sincronização diária às 02:00 (off-peak)

---

### 2️⃣ Feedback de Acompanhamento (Personal Assistants → Dashboard)

**Quando**:
- Aluno completa um quiz
- Aluno interage com o tutor
- Dificuldade identificada
- Padrão de aprendizado detectado

**O que é enviado**:
```json
{
  "student_id": "STU-2026-0001",
  "timestamp": "2026-02-10T14:30:00Z",
  "event_type": "quiz_completed",
  "data": {
    "quiz_id": "vp1-unit-1",
    "quiz_title": "Meeting New People",
    "score": 85,
    "total_questions": 5,
    "correct_answers": 4,
    "time_spent": 300,
    "passed": true,
    "points_earned": 10
  },
  "learning_insights": {
    "strengths": ["vocabulary", "listening"],
    "weaknesses": ["pronunciation"],
    "learning_pace": "fast",
    "engagement_level": "high",
    "ai_adaptation": "increased_difficulty"
  }
}
```

**Mecanismo**:
- **Webhook**: POST para `https://dashboard.influx.com/api/student-tracking/events`
- **Retry Logic**: 3 tentativas com backoff exponencial
- **Queue**: Fila local se Dashboard estiver indisponível
- **Audit Log**: Todos os eventos registrados para auditoria

---

### 3️⃣ Calendário e Agenda (Dashboard → Personal Assistants)

**Dados compartilhados**:
- Calendário de aulas (horários, salas, professores)
- Prazos de tarefas e projetos
- Eventos especiais (provas, apresentações, férias)
- Integração com Outlook

**Mecanismo**:
- **iCalendar Feed**: `GET /api/dashboard/students/{id}/calendar.ics`
- **Webhook**: Notificação quando evento é criado/modificado
- **Sincronização**: Diária ou em tempo real

---

### 4️⃣ Mensagens do Pedagógico (Dashboard → Personal Assistants)

**Tipos de mensagens**:
- Avisos gerais da instituição
- Mensagens personalizadas do pedagógico
- Recomendações de curso
- Alertas de desempenho

**Mecanismo**:
- **Webhook**: POST com conteúdo da mensagem
- **Notificação Push**: Entregue ao aluno no Personal Assistants
- **Histórico**: Armazenado no Personal Assistants para referência

---

### 5️⃣ Eventos e Notícias (Dashboard → Personal Assistants)

**Dados compartilhados**:
- Feed de notícias da plataforma
- Eventos da instituição
- Anúncios importantes

**Mecanismo**:
- **RSS Feed**: `GET /api/dashboard/news/feed.xml`
- **Webhook**: Notificação de novo evento/notícia
- **Filtros**: Por interesse, nível, turma

---

### 6️⃣ Notas e Presença (Dashboard → Personal Assistants)

**Dados compartilhados**:
- Notas por disciplina/unidade
- Histórico de notas
- Presença por aula
- Relatórios de desempenho

**Mecanismo**:
- **API REST**: `GET /api/dashboard/students/{id}/grades`
- **Webhook**: Notificação quando nota é lançada
- **Sincronização**: Semanal ou em tempo real

---

## Arquitetura Técnica

### Componentes

#### 1. API Gateway (Dashboard)
```typescript
// Endpoints para sincronização
GET    /api/integration/students              // Listar alunos
GET    /api/integration/students/:id          // Detalhe do aluno
GET    /api/integration/students/:id/calendar // Calendário
GET    /api/integration/students/:id/grades   // Notas
GET    /api/integration/news                  // Notícias
POST   /api/integration/validate-token        // Validar token
```

#### 2. Webhook Receiver (Personal Assistants)
```typescript
// Endpoints para receber dados
POST   /api/webhooks/student-sync             // Sincronização de aluno
POST   /api/webhooks/tracking-event           // Evento de acompanhamento
POST   /api/webhooks/message                  // Mensagem do pedagógico
POST   /api/webhooks/calendar-event           // Evento de calendário
POST   /api/webhooks/news                     // Notícia/evento
```

#### 3. Sync Queue (Redis/RabbitMQ)
- Fila de sincronização de alunos
- Fila de eventos de acompanhamento
- Retry automático com backoff exponencial
- Dead letter queue para falhas

#### 4. Audit Log
- Todas as sincronizações registradas
- Timestamp, origem, destino, status
- Rastreabilidade completa

### Autenticação e Segurança

**Método**: OAuth2 + API Keys

```typescript
// Header de autenticação
Authorization: Bearer {jwt_token}
X-API-Key: {api_key}
X-Signature: {hmac_sha256_signature}

// Validação de webhook
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(JSON.stringify(payload))
  .digest('hex');

if (signature !== headers['x-signature']) {
  throw new Error('Invalid webhook signature');
}
```

### Rate Limiting

```
Dashboard → Personal Assistants:
- 1000 requisições/minuto por API key
- Burst: 100 requisições/segundo

Personal Assistants → Dashboard:
- 10000 eventos/minuto
- Fila com prioridade para eventos críticos
```

---

## Tabelas de Sincronização

### Dashboard (Novas Tabelas)

#### `integration_sync_log`
```sql
CREATE TABLE integration_sync_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source VARCHAR(50) NOT NULL,           -- 'dashboard' ou 'personal_assistants'
  destination VARCHAR(50) NOT NULL,
  event_type VARCHAR(100) NOT NULL,      -- 'student_sync', 'quiz_completed', etc
  student_id INT,
  data JSON NOT NULL,
  status VARCHAR(20) NOT NULL,           -- 'success', 'failed', 'pending'
  error_message TEXT,
  retry_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_student_id (student_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

#### `student_learning_profile`
```sql
CREATE TABLE student_learning_profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL UNIQUE,
  learning_style VARCHAR(50),            -- 'visual', 'auditory', 'kinesthetic'
  learning_pace VARCHAR(50),             -- 'slow', 'normal', 'fast'
  engagement_level VARCHAR(50),          -- 'low', 'medium', 'high'
  strengths JSON,                        -- ["vocabulary", "listening"]
  weaknesses JSON,                       -- ["pronunciation"]
  ai_adaptation_level INT DEFAULT 1,     -- 1-10
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id)
);
```

#### `student_tracking_events`
```sql
CREATE TABLE student_tracking_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  event_type VARCHAR(100) NOT NULL,      -- 'quiz_completed', 'interaction', etc
  event_data JSON NOT NULL,
  source VARCHAR(50) NOT NULL,           -- 'personal_assistants'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  INDEX idx_student_id (student_id),
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at)
);
```

---

## Fluxo de Implementação

### Fase 1: Setup Básico
1. Criar tabelas de sincronização no Dashboard
2. Implementar API Gateway no Dashboard
3. Implementar Webhook Receiver no Personal Assistants
4. Configurar autenticação OAuth2

### Fase 2: Sincronização de Alunos
1. Implementar `GET /api/integration/students`
2. Implementar batch job de sincronização
3. Testar com 10 alunos
4. Escalar para todos os 171 alunos

### Fase 3: Feedback de Acompanhamento
1. Implementar webhook receiver no Dashboard
2. Implementar envio de eventos do Personal Assistants
3. Armazenar eventos em `student_tracking_events`
4. Criar relatórios pedagógicos baseados em eventos

### Fase 4: Calendários e Agenda
1. Implementar `GET /api/integration/students/:id/calendar`
2. Integrar com Outlook
3. Sincronizar com Personal Assistants

### Fase 5: Mensagens, Eventos, Notas
1. Implementar endpoints para cada tipo de dados
2. Criar webhooks correspondentes
3. Testar fluxo completo

---

## Tratamento de Erros e Recuperação

### Retry Logic
```typescript
async function sendWithRetry(
  url: string,
  payload: any,
  maxRetries: number = 3
) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) return response;
      
      // Retry em 5xx
      if (response.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Backoff exponencial
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      
      // Não retry em 4xx
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
    }
  }
}
```

### Dead Letter Queue
- Eventos que falharam 3 vezes vão para DLQ
- Alertas enviados para administradores
- Possibilidade de reprocessamento manual

---

## Monitoramento e Observabilidade

### Métricas
- Taxa de sucesso de sincronizações
- Latência de eventos
- Tamanho da fila
- Erros por tipo

### Alertas
- Sincronização falhando por > 5 minutos
- Fila crescendo indefinidamente
- Taxa de erro > 5%

### Logs
- Todos os eventos de sincronização
- Erros com stack trace completo
- Timestamps precisos para debugging

---

## Segurança

### Validação
- Validar schema de todos os payloads
- Validar assinatura HMAC de webhooks
- Rate limiting por API key

### Encriptação
- HTTPS obrigatório
- Dados sensíveis encriptados em repouso
- Tokens com expiração

### Auditoria
- Audit log de todas as sincronizações
- Quem fez, quando, o quê, resultado
- Retenção de 1 ano

---

## Próximos Passos

1. ✅ Desenhar arquitetura (CONCLUÍDO)
2. ⏳ Criar API Gateway no Dashboard
3. ⏳ Implementar Webhook Receiver no Personal Assistants
4. ⏳ Criar tabelas de sincronização
5. ⏳ Implementar sistema de fila
6. ⏳ Testar fluxo completo
7. ⏳ Criar skill de integração multi-projeto
