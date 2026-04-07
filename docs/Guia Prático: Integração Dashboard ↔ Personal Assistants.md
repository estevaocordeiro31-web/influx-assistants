# Guia Prático: Integração Dashboard ↔ Personal Assistants

## 📋 Pré-requisitos

- ✅ Acesso ao Management UI do Dashboard (Manus)
- ✅ Acesso ao banco de dados (DATABASE_URL)
- ✅ Acesso ao código-fonte do Dashboard
- ✅ Acesso ao código-fonte do Personal Assistants

## 🚀 Fase 1: Obter Informações de Conexão

### Passo 1.1: Acessar o Management UI

1. Acesse: https://manus.im (ou seu painel Manus)
2. Procure pelo projeto "Dashboard" na lista
3. Clique em "Settings" (engrenagem)
4. Vá para a aba "Secrets"

### Passo 1.2: Copiar DATABASE_URL

Na aba Secrets, procure por `DATABASE_URL` e copie o valor completo:

```
Formato esperado:
mysql://user:password@host:port/database?ssl=true
```

**Importante**: Habilitar SSL na conexão (adicionar `?ssl=true` se não estiver presente)

### Passo 1.3: Anotar Informações

Salve em um arquivo seguro:

```
DATABASE_URL: [cole aqui]
API_URL: https://influxdash-cacyggwz.manus.space
WEBHOOK_SECRET: [você vai gerar isso depois]
```

---

## 🛠️ Fase 2: Executar SQL Schema

### Passo 2.1: Preparar o SQL

1. Copie o conteúdo de `integration_sync_tables.sql`
2. Abra um cliente MySQL (DBeaver, MySQL Workbench, etc)
3. Conecte usando o DATABASE_URL

### Passo 2.2: Executar as Tabelas

Execute o SQL em 3 partes:

**Parte 1: Tabelas de Sincronização**
```sql
-- Copie e execute a primeira seção do integration_sync_tables.sql
-- Até a linha que cria: integration_sync_log
```

**Parte 2: Tabelas de Status e Fila**
```sql
-- Execute a segunda seção
-- Até a linha que cria: integration_queue
```

**Parte 3: Views e Stored Procedures**
```sql
-- Execute a terceira seção
-- Views e Stored Procedures
```

### Passo 2.3: Validar Criação

Execute para verificar:

```sql
-- Verificar tabelas criadas
SHOW TABLES LIKE 'integration_%';
SHOW TABLES LIKE 'student_%';

-- Resultado esperado: 8 tabelas
-- - integration_sync_log
-- - student_learning_profile
-- - student_tracking_events
-- - integration_api_keys
-- - integration_webhooks
-- - integration_queue
-- - integration_metrics
-- - student_sync_status
```

---

## 🔌 Fase 3: Integrar API Gateway no Dashboard

### Passo 3.1: Copiar Router

1. Copie o conteúdo de `integration_sync_router.ts`
2. No projeto Dashboard, crie o arquivo:
   ```
   server/routers/integration-sync.ts
   ```
3. Cole o conteúdo

### Passo 3.2: Integrar no tRPC

No arquivo `server/routers.ts` (ou similar), adicione:

```typescript
import { integrationSyncRouter } from './routers/integration-sync';

export const appRouter = router({
  // ... outros routers existentes
  integration: integrationSyncRouter,  // ← Adicione esta linha
});
```

### Passo 3.3: Gerar API Keys

Execute este SQL no banco de dados:

```sql
INSERT INTO integration_api_keys (
  key_name,
  api_key,
  api_secret,
  source_system,
  permissions,
  rate_limit,
  is_active,
  created_at
) VALUES (
  'Personal Assistants Production',
  'pa_prod_' || UUID(),
  'pa_secret_' || UUID(),
  'personal_assistants',
  '["read:students", "read:calendar", "read:grades", "read:news", "write:events", "write:tracking"]',
  10000,
  TRUE,
  NOW()
);

-- Copie os valores de api_key e api_secret gerados
SELECT api_key, api_secret FROM integration_api_keys 
WHERE key_name = 'Personal Assistants Production';
```

**Salve esses valores** - você vai precisar deles no Personal Assistants!

### Passo 3.4: Testar API Gateway

1. Reinicie o servidor do Dashboard
2. Teste o endpoint:

```bash
curl -X GET "https://influxdash-cacyggwz.manus.space/api/trpc/integration.getStudents" \
  -H "Authorization: Bearer {seu_jwt_token}" \
  -H "X-API-Key: {api_key_gerado}"
```

Resposta esperada:
```json
{
  "result": {
    "data": {
      "students": [...],
      "total": 171,
      "page": 1,
      "pageSize": 100
    }
  }
}
```

---

## 🎯 Fase 4: Integrar Webhook Receiver no Personal Assistants

### Passo 4.1: Copiar Router

1. Copie o conteúdo de `webhook_receiver_router.ts`
2. No projeto Personal Assistants, crie o arquivo:
   ```
   server/routers/webhook-receiver.ts
   ```
3. Cole o conteúdo

### Passo 4.2: Integrar no tRPC

No arquivo `server/routers.ts`, adicione:

```typescript
import { webhookReceiverRouter } from './routers/webhook-receiver';

export const appRouter = router({
  // ... outros routers existentes
  webhooks: webhookReceiverRouter,  // ← Adicione esta linha
});
```

### Passo 4.3: Criar Tabelas de Recebimento

Execute no banco de dados do Personal Assistants:

```sql
-- Tabelas de recebimento de webhooks
CREATE TABLE webhook_events_received (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_type VARCHAR(50) NOT NULL,
  student_id INT NOT NULL,
  payload JSON NOT NULL,
  signature_valid BOOLEAN DEFAULT FALSE,
  processed BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  INDEX idx_student_id (student_id),
  INDEX idx_event_type (event_type),
  INDEX idx_processed (processed)
);

CREATE TABLE webhook_processing_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  webhook_event_id INT NOT NULL,
  status VARCHAR(20) NOT NULL,
  retry_count INT DEFAULT 0,
  next_retry_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (webhook_event_id) REFERENCES webhook_events_received(id)
);
```

### Passo 4.4: Configurar Variáveis de Ambiente

Adicione no `.env` do Personal Assistants:

```env
# Dashboard Integration
DASHBOARD_API_URL=https://influxdash-cacyggwz.manus.space/api/trpc
DASHBOARD_API_KEY=pa_prod_[valor_gerado]
DASHBOARD_API_SECRET=pa_secret_[valor_gerado]
WEBHOOK_SECRET=webhook_secret_[gere_uma_string_aleatoria]
WEBHOOK_URL=https://personal-assistants.influx.com/api/trpc/webhooks.receiveEvent
```

### Passo 4.5: Testar Webhook Receiver

1. Reinicie o servidor do Personal Assistants
2. Envie um webhook de teste:

```bash
curl -X POST "https://personal-assistants.influx.com/api/trpc/webhooks.receiveEvent" \
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
```

---

## 🔄 Fase 5: Implementar Sincronização Inicial

### Passo 5.1: Criar Script de Sincronização

No Personal Assistants, crie `scripts/sync-students.mjs`:

```typescript
import { DashboardIntegrationClient } from '../server/integration-client.js';

const client = new DashboardIntegrationClient({
  baseUrl: process.env.DASHBOARD_API_URL,
  apiKey: process.env.DASHBOARD_API_KEY,
  apiSecret: process.env.DASHBOARD_API_SECRET
});

async function syncStudents() {
  console.log('🔄 Iniciando sincronização de alunos...');
  
  let page = 1;
  let totalSynced = 0;
  
  while (true) {
    const response = await client.getStudents({ page, pageSize: 100 });
    
    if (!response.students.length) break;
    
    // Armazenar alunos localmente
    for (const student of response.students) {
      await db.insert(synced_students).values({
        student_id: student.id,
        name: student.name,
        email: student.email,
        level: student.level,
        class: student.class,
        status: student.status,
        data: JSON.stringify(student),
        synced_at: new Date()
      });
    }
    
    totalSynced += response.students.length;
    console.log(`✅ Sincronizados ${totalSynced} alunos...`);
    
    if (!response.hasMore) break;
    page++;
  }
  
  console.log(`✅ Sincronização concluída! Total: ${totalSynced} alunos`);
}

syncStudents().catch(console.error);
```

### Passo 5.2: Executar Sincronização

```bash
cd personal-assistants
node scripts/sync-students.mjs
```

### Passo 5.3: Validar Sincronização

```sql
-- No banco do Personal Assistants
SELECT COUNT(*) as total_synced FROM synced_students;
-- Resultado esperado: 171 alunos
```

---

## ✅ Fase 6: Testar Fluxo Completo

### Teste 1: Sincronização de Alunos

```bash
# 1. Verificar que alunos foram sincronizados
curl -X GET "https://personal-assistants.influx.com/api/trpc/students.getSynced" \
  -H "Authorization: Bearer {token}"

# Resposta esperada: 171 alunos
```

### Teste 2: Webhook de Quiz Completado

```bash
# 1. Completar um quiz no Personal Assistants
# (Isso vai disparar um webhook automaticamente)

# 2. Verificar webhook recebido no Dashboard
curl -X GET "https://influxdash-cacyggwz.manus.space/api/trpc/integration.getSyncStatus" \
  -H "Authorization: Bearer {token}" \
  -H "X-API-Key: {api_key}"

# Resposta esperada: status = "healthy", recent_events > 0
```

### Teste 3: Dados Enriquecidos

```sql
-- No banco do Dashboard
SELECT * FROM student_tracking_events 
WHERE student_id = 1 
ORDER BY created_at DESC 
LIMIT 5;

-- Resultado esperado: eventos de quiz completado
```

---

## 🔧 Troubleshooting

### Problema: "Connection refused" ao conectar ao banco

**Solução**:
- Verificar se SSL está habilitado: `?ssl=true`
- Verificar firewall
- Testar conexão com: `mysql -u user -p -h host`

### Problema: "Invalid API Key" ao chamar endpoints

**Solução**:
- Verificar se api_key está correto
- Verificar se é o mesmo valor gerado no SQL
- Verificar se está no header correto: `X-API-Key`

### Problema: "Invalid webhook signature"

**Solução**:
- Verificar se WEBHOOK_SECRET está correto
- Verificar se está assinando corretamente com HMAC SHA256
- Verificar se payload não foi modificado

### Problema: Webhooks não chegando

**Solução**:
- Verificar se URL do webhook está acessível
- Verificar logs do Personal Assistants
- Verificar se firewall permite conexão de entrada
- Testar com curl manual

---

## 📊 Checklist de Implementação

- [ ] **Fase 1**: Obter DATABASE_URL
- [ ] **Fase 2**: Executar SQL schema (8 tabelas criadas)
- [ ] **Fase 3**: Integrar API Gateway no Dashboard
- [ ] **Fase 3**: Gerar API keys
- [ ] **Fase 3**: Testar endpoint `/api/trpc/integration.getStudents`
- [ ] **Fase 4**: Integrar Webhook Receiver no Personal Assistants
- [ ] **Fase 4**: Criar tabelas de recebimento
- [ ] **Fase 4**: Configurar variáveis de ambiente
- [ ] **Fase 5**: Executar sincronização inicial (171 alunos)
- [ ] **Fase 6**: Testar fluxo completo
- [ ] **Fase 6**: Validar dados enriquecidos no Dashboard

---

## 🎯 Próximos Passos

Após completar este guia:

1. **Monitoramento**: Configurar alertas para falhas de sincronização
2. **Automação**: Agendar sincronização diária
3. **Documentação**: Documentar operação e runbooks
4. **Treinamento**: Treinar equipe técnica

---

## 📞 Suporte

Se tiver dúvidas:
1. Consulte o INTEGRATION_IMPLEMENTATION_GUIDE.md
2. Verifique os logs do servidor
3. Teste endpoints com Postman
4. Consulte o troubleshooting acima

---

**Versão**: 1.0
**Data**: 2026-02-10
**Status**: Pronto para Implementação
