# Guia de Implementação: Integração Dashboard ↔ Personal Assistants

## 📋 Resumo Executivo

Criamos uma **arquitetura completa de integração bidirecional** entre o inFlux Dashboard (fonte de dados de alunos) e o inFlux Personal Assistants (consumidor e enriquecedor de dados de acompanhamento).

**Objetivo**: Permitir que o Dashboard seja a **fonte única de verdade** para dados de alunos, enquanto o Personal Assistants enriquece esses dados com informações de acompanhamento pedagógico em tempo real.

## 🏗️ Arquitetura

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
│  │         Integration Layer (Sincronização)              │    │
│  │                                                         │    │
│  │ • API Gateway (Dashboard)                             │    │
│  │ • Webhook Receiver (Personal Assistants)              │    │
│  │ • Fila de Sincronização (Redis/RabbitMQ)            │    │
│  │ • Retry Automático com Backoff Exponencial           │    │
│  │ • Audit Log Completo                                 │    │
│  │ • OAuth2 + HMAC SHA256                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Deliverables

### 1. Arquitetura de Integração
**Arquivo**: `integration_architecture.md`

Documento completo com:
- Visão geral da arquitetura
- Fluxo de dados (6 tipos)
- Componentes técnicos
- Tabelas de sincronização
- Tratamento de erros
- Segurança e auditoria

### 2. SQL Schema
**Arquivo**: `integration_sync_tables.sql`

8 tabelas de sincronização:
- `integration_sync_log` - Auditoria de sincronizações
- `student_learning_profile` - Perfil de aprendizado
- `student_tracking_events` - Eventos de acompanhamento
- `integration_api_keys` - Autenticação
- `integration_webhooks` - Configuração de webhooks
- `integration_queue` - Fila com retry
- `integration_metrics` - Métricas
- `student_sync_status` - Status por aluno

**Bonus**: 2 Views + 2 Stored Procedures

### 3. API Gateway (Dashboard)
**Arquivo**: `integration_sync_router.ts`

7 grupos de endpoints:
- **Student Sync**: `getStudents`, `getStudent`, `syncStudent`
- **Tracking Events**: `recordTrackingEvent`, `getTrackingEvents`
- **Learning Profile**: `getLearningProfile`, `updateLearningProfile`
- **Sync Status**: `getSyncStatus`, `getHealthMetrics`
- **Webhooks**: `validateWebhookSignature`

### 4. Client SDK
**Arquivo**: `integration_client_sdk.ts`

SDK TypeScript para Personal Assistants com:
- Autenticação automática (HMAC SHA256)
- Retry com backoff exponencial
- Validação de webhooks
- Streaming de dados em lote
- Batch sync para múltiplos alunos

### 5. Webhook Receiver (Personal Assistants)
**Arquivo**: `webhook_receiver_router.ts`

6 tipos de webhooks:
- **Quiz Completed** - Score, pontos, tempo
- **Calendar Event** - Aula, prova, evento
- **Message** - Mensagem do pedagógico
- **News/Event** - Notícia da instituição
- **Grade Posted** - Nota de disciplina
- **Attendance** - Presença em aula

### 6. Skill Reutilizável
**Arquivo**: `skills/multi-project-integration/SKILL.md`

Skill completo com:
- Arquitetura genérica
- 4 componentes reutilizáveis
- 4 fases de implementação
- 3 casos de uso
- Troubleshooting

## 🚀 Plano de Implementação

### Fase 1: Setup Básico (1-2 dias)

**Dashboard**:
1. Executar `integration_sync_tables.sql`
2. Integrar `integration_sync_router.ts` no tRPC
3. Gerar API keys no `integration_api_keys`
4. Testar endpoints com Postman

**Personal Assistants**:
1. Criar tabelas de recebimento (webhook_events_received, etc)
2. Integrar `webhook_receiver_router.ts` no tRPC
3. Configurar validação de assinatura HMAC

### Fase 2: Sincronização Inicial (1-2 dias)

**Personal Assistants**:
1. Implementar batch job para sincronização inicial
2. Usar `DashboardIntegrationClient` para puxar alunos
3. Armazenar localmente em tabelas
4. Atualizar `student_sync_status`

**Testes**:
- Sincronizar 10 alunos de teste
- Verificar dados armazenados
- Validar timestamps

### Fase 3: Feedback em Tempo Real (2-3 dias)

**Personal Assistants**:
1. Quando quiz é completado, enviar webhook
2. Incluir assinatura HMAC
3. Implementar retry com backoff

**Dashboard**:
1. Receber webhook em `/api/webhooks/events`
2. Validar assinatura
3. Armazenar em `student_tracking_events`
4. Processar conforme prioridade

**Testes**:
- Completar quiz no Personal Assistants
- Verificar webhook recebido no Dashboard
- Validar dados armazenados

### Fase 4: Monitoramento (1 dia)

**Dashboard**:
1. Criar dashboard de métricas
2. Implementar alertas
3. Configurar logs estruturados

**Testes**:
- Simular falhas
- Verificar retry logic
- Validar dead letter queue

## 📊 Fluxo de Dados

### 1. Sincronização de Alunos (Dashboard → Personal Assistants)

```
Personal Assistants
    ↓
GET /api/integration/students?updated_since=timestamp
    ↓
Dashboard API Gateway
    ↓
Busca alunos ativos
    ↓
Enriquece com perfil de aprendizado
    ↓
Retorna JSON com paginação
    ↓
Personal Assistants armazena
    ↓
Atualiza student_sync_status
```

### 2. Feedback de Acompanhamento (Personal Assistants → Dashboard)

```
Personal Assistants (quiz completado)
    ↓
Cria payload com dados
    ↓
Assina com HMAC SHA256
    ↓
POST /api/webhooks/events
    ↓
Dashboard valida assinatura
    ↓
Armazena em student_tracking_events
    ↓
Adiciona à fila
    ↓
Processa conforme prioridade
    ↓
Atualiza student_learning_profile
    ↓
Retorna sucesso
```

## 🔐 Segurança

### Autenticação
- **OAuth2** para autenticação de usuários
- **API Keys** para autenticação de serviços
- **JWT Tokens** com expiração de 15 minutos

### Assinatura de Webhooks
```typescript
// Header
X-Signature: hmac_sha256_signature

// Validação
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(JSON.stringify(payload))
  .digest('hex');

if (signature !== headers['x-signature']) {
  throw new Error('Invalid webhook signature');
}
```

### Rate Limiting
- Dashboard → Personal Assistants: 1000 req/min
- Personal Assistants → Dashboard: 10000 eventos/min

### Auditoria
- Todas as sincronizações registradas em `integration_sync_log`
- Quem fez, quando, o quê, resultado
- Retenção de 1 ano

## 🛠️ Instruções de Implementação

### Passo 1: Executar SQL Schema

```bash
# No Dashboard (MySQL)
mysql -u root -p < integration_sync_tables.sql
```

### Passo 2: Integrar API Gateway no Dashboard

```typescript
// server/routers.ts
import { integrationSyncRouter } from './routers/integration-sync';

export const appRouter = router({
  // ... outros routers
  integration: integrationSyncRouter,
});
```

### Passo 3: Integrar Webhook Receiver no Personal Assistants

```typescript
// server/routers.ts
import { webhookReceiverRouter } from './routers/webhook-receiver';

export const appRouter = router({
  // ... outros routers
  webhooks: webhookReceiverRouter,
});
```

### Passo 4: Gerar API Keys

```sql
-- No Dashboard
INSERT INTO integration_api_keys (
  key_name,
  api_key,
  api_secret,
  source_system,
  permissions,
  rate_limit,
  is_active
) VALUES (
  'Personal Assistants Prod',
  'pa_key_prod_2026',
  'pa_secret_prod_2026',
  'personal_assistants',
  '["read:students", "read:calendar", "read:grades", "read:news", "write:events", "write:tracking"]',
  10000,
  TRUE
);
```

### Passo 5: Configurar Webhook no Personal Assistants

```typescript
// Ao iniciar, registrar webhook no Dashboard
const client = new DashboardIntegrationClient({
  baseUrl: 'https://dashboard.influx.com',
  apiKey: 'pa_key_prod_2026',
  apiSecret: 'pa_secret_prod_2026'
});

// Registrar webhook
await client.registerWebhook({
  url: 'https://personal-assistants.influx.com/api/webhooks/events',
  eventTypes: ['quiz_completed', 'calendar_event', 'message'],
  secret: 'webhook_secret_2026'
});
```

### Passo 6: Testar Fluxo Completo

```bash
# 1. Sincronizar alunos
curl -X GET https://personal-assistants.influx.com/api/integration/students \
  -H "Authorization: Bearer {token}" \
  -H "X-API-Key: pa_key_prod_2026"

# 2. Completar quiz
curl -X POST https://personal-assistants.influx.com/api/webhooks/events \
  -H "Content-Type: application/json" \
  -H "X-Signature: {hmac_signature}" \
  -d '{
    "event_type": "quiz_completed",
    "student_id": 1,
    "timestamp": "2026-02-10T14:30:00Z",
    "data": {
      "quiz_id": "vp1-unit-1",
      "score": 85,
      "points_earned": 10
    }
  }'

# 3. Verificar webhook recebido no Dashboard
curl -X GET https://dashboard.influx.com/api/integration/webhooks/events \
  -H "Authorization: Bearer {token}"
```

## 📈 Métricas de Sucesso

### Fase 1: Setup
- ✅ Tabelas criadas
- ✅ API endpoints funcionando
- ✅ Autenticação validada

### Fase 2: Sincronização Inicial
- ✅ 171 alunos sincronizados
- ✅ Taxa de sucesso > 99%
- ✅ Latência < 500ms

### Fase 3: Feedback em Tempo Real
- ✅ Webhooks recebidos < 1s
- ✅ Taxa de sucesso > 99%
- ✅ Retry automático funcionando

### Fase 4: Monitoramento
- ✅ Dashboard de métricas
- ✅ Alertas configurados
- ✅ Logs estruturados

## 🐛 Troubleshooting

### Problema: Sincronização Lenta

**Causa**: Muitos dados ou rede lenta
**Solução**:
- Aumentar tamanho do lote (até 1000)
- Usar streaming para datasets grandes
- Implementar compressão GZIP

### Problema: Webhooks Falhando

**Causa**: URL inválida ou timeout
**Solução**:
- Validar URL do webhook
- Aumentar timeout (até 60s)
- Verificar firewall/VPN

### Problema: Fila Crescendo

**Causa**: Consumer não processando eventos
**Solução**:
- Verificar logs do Consumer
- Aumentar workers de processamento
- Verificar banco de dados

## 📚 Referências

- [Arquitetura de Integração](./integration_architecture.md)
- [SQL Schema](./integration_sync_tables.sql)
- [API Gateway](./integration_sync_router.ts)
- [Client SDK](./integration_client_sdk.ts)
- [Webhook Receiver](./webhook_receiver_router.ts)
- [Skill Multi-Project](./skills/multi-project-integration/SKILL.md)

## 📞 Suporte

Para dúvidas ou problemas:
1. Consultar troubleshooting acima
2. Verificar logs em `integration_sync_log`
3. Validar assinatura HMAC
4. Testar endpoints com Postman

## ✅ Checklist de Implementação

- [ ] Executar SQL schema no Dashboard
- [ ] Integrar API Gateway no Dashboard
- [ ] Integrar Webhook Receiver no Personal Assistants
- [ ] Gerar API keys
- [ ] Configurar webhook
- [ ] Testar sincronização de alunos
- [ ] Testar webhook de quiz completado
- [ ] Testar retry logic
- [ ] Configurar monitoramento
- [ ] Documentar operação
- [ ] Treinar equipe
- [ ] Deploy em produção

---

**Versão**: 1.0
**Data**: 2026-02-10
**Status**: Pronto para Implementação
