# 📊 Guia de Sincronização com Dashboard Central

**Data:** 12 de Fevereiro de 2026  
**Versão:** 1.0  
**Status:** ✅ Implementado e Testado

---

## 🎯 Visão Geral

O **Dashboard Sync Router** permite sincronizar alunos ativos do banco de dados centralizado (Dashboard inFlux) com o Personal Tutor. O sistema implementa um modelo **Pull** onde o Personal Tutor puxa dados do Dashboard quando necessário.

---

## 🔧 Arquitetura Técnica

### Componentes

| Componente | Descrição | Localização |
|-----------|-----------|------------|
| **Dashboard Sync Router** | Router tRPC com procedures de sincronização | `server/routers/dashboard-sync.ts` |
| **Central Database** | Banco de dados centralizado (TiDB Cloud) | `CENTRAL_DATABASE_URL` |
| **Local Database** | Banco local do Personal Tutor | `DATABASE_URL` |
| **Tests** | Testes vitest para validar sincronização | `server/dashboard-sync.test.ts` |

### Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│         Dashboard Central (TiDB Cloud)                       │
│  - Tabela: students (alunos ativos)                          │
│  - Tabela: student_intelligence (inteligência do aluno)      │
│  - Status: 'Ativo'                                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ PULL (Personal Tutor puxa dados)
                 │ mysql2 connection
                 ▼
┌─────────────────────────────────────────────────────────────┐
│         Personal Tutor (Local)                              │
│  - Tabela: users (usuários sincronizados)                   │
│  - Tabela: student_profiles (perfis dos alunos)             │
│  - loginMethod: 'dashboard_sync'                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Procedures Disponíveis

### 1. **syncActiveStudents**

Sincroniza todos os alunos ativos do Dashboard com o Personal Tutor.

**Tipo:** Mutation (requer autenticação admin)

**Input:**
```typescript
{}  // Sem parâmetros
```

**Output:**
```typescript
{
  success: boolean;
  totalStudents: number;
  syncedStudents: number;
  failedSyncs: number;
  errors: Array<{ studentId: number; error: string }>;
  timestamp: Date;
}
```

**Exemplo de Uso:**
```typescript
// Frontend
const { mutate: syncStudents } = trpc.dashboardSync.syncActiveStudents.useMutation({
  onSuccess: (result) => {
    console.log(`Sincronizados ${result.syncedStudents} de ${result.totalStudents} alunos`);
    if (result.errors.length > 0) {
      console.error('Erros encontrados:', result.errors);
    }
  },
});

syncStudents({});
```

**Resposta Exemplo:**
```json
{
  "success": true,
  "totalStudents": 134,
  "syncedStudents": 130,
  "failedSyncs": 4,
  "errors": [
    { "studentId": 5, "error": "Email duplicado" },
    { "studentId": 12, "error": "Dados inválidos" }
  ],
  "timestamp": "2026-02-12T14:15:30.000Z"
}
```

---

### 2. **getSyncStats**

Obtém estatísticas de sincronização e distribuição de alunos por nível.

**Tipo:** Query (requer autenticação admin)

**Input:**
```typescript
{}  // Sem parâmetros
```

**Output:**
```typescript
{
  totalSyncedUsers: number;
  totalProfiles: number;
  levelDistribution: Record<string, number>;
  lastSync: Date;
}
```

**Exemplo de Uso:**
```typescript
const { data: stats } = trpc.dashboardSync.getSyncStats.useQuery({});

// Resultado
{
  "totalSyncedUsers": 130,
  "totalProfiles": 130,
  "levelDistribution": {
    "beginner": 25,
    "elementary": 35,
    "intermediate": 40,
    "upper_intermediate": 20,
    "advanced": 10
  },
  "lastSync": "2026-02-12T14:15:30.000Z"
}
```

---

### 3. **healthCheck**

Verifica a saúde da integração (conexões com bancos local e centralizado).

**Tipo:** Query (requer autenticação admin)

**Input:**
```typescript
{}  // Sem parâmetros
```

**Output:**
```typescript
{
  status: 'healthy' | 'unhealthy';
  localDb: 'connected' | 'error';
  centralDb: 'connected' | 'error';
  error?: string;
  timestamp: Date;
}
```

**Exemplo de Uso:**
```typescript
const { data: health } = trpc.dashboardSync.healthCheck.useQuery({});

if (health.status === 'healthy') {
  console.log('✅ Integração com Dashboard está saudável');
} else {
  console.error('❌ Problema na integração:', health.error);
}
```

---

## 🔄 Mapeamento de Dados

### Níveis (Books)

| Dashboard | Personal Tutor |
|-----------|----------------|
| Book 1 | beginner |
| Book 2 | elementary |
| Book 3 | intermediate |
| Book 4 | upper_intermediate |
| Book 5 | advanced |

### Objetivos

| Dashboard | Personal Tutor |
|-----------|----------------|
| Carreira | career |
| Viagem | travel |
| Estudos | studies |
| Outro | other |

### Status

| Dashboard | Personal Tutor |
|-----------|----------------|
| Ativo | ativo |
| Inativo | inativo |
| Desistente | desistente |
| Trancado | trancado |

---

## 🚀 Como Usar

### Passo 1: Verificar Saúde da Integração

```typescript
// Verificar se ambos os bancos estão acessíveis
const health = await trpc.dashboardSync.healthCheck.query({});
console.log(health);
```

### Passo 2: Sincronizar Alunos

```typescript
// Sincronizar todos os alunos ativos do Dashboard
const result = await trpc.dashboardSync.syncActiveStudents.mutate({});

console.log(`
  Total de alunos: ${result.totalStudents}
  Sincronizados: ${result.syncedStudents}
  Falhas: ${result.failedSyncs}
`);
```

### Passo 3: Obter Estatísticas

```typescript
// Obter distribuição de alunos por nível
const stats = await trpc.dashboardSync.getSyncStats.query({});

console.log('Distribuição por nível:');
Object.entries(stats.levelDistribution).forEach(([level, count]) => {
  console.log(`  ${level}: ${count} alunos`);
});
```

---

## 🔐 Segurança

- ✅ **Autenticação:** Apenas admins podem sincronizar
- ✅ **Validação:** Dados são validados antes de sincronizar
- ✅ **Tratamento de Erros:** Erros são capturados e reportados
- ✅ **Transações:** Operações são atômicas
- ✅ **Logging:** Todos os eventos são registrados

---

## 📊 Dados Sincronizados

### Tabela: users

| Campo | Origem | Mapeamento |
|-------|--------|-----------|
| `openId` | Gerado | `central_{id}_{timestamp}` |
| `name` | Dashboard | `students.name` |
| `email` | Dashboard | `students.email` |
| `loginMethod` | Fixo | `'dashboard_sync'` |
| `role` | Fixo | `'user'` |
| `status` | Dashboard | `students.status` |
| `studentId` | Dashboard | `students.matricula` |

### Tabela: student_profiles

| Campo | Origem | Mapeamento |
|-------|--------|-----------|
| `userId` | Referência | users.id |
| `objective` | Dashboard | `student_intelligence.interest_profile` |
| `currentLevel` | Dashboard | `student_intelligence.current_level` |
| `specificGoals` | Dashboard | `student_intelligence.interest_profile` |
| `discomfortAreas` | Dashboard | `student_intelligence.struggling_topics` (JSON) |
| `comfortAreas` | Dashboard | `student_intelligence.mastered_topics` (JSON) |
| `improvementAreas` | Dashboard | `student_intelligence.pain_points` |

---

## 🧪 Testes

Todos os testes estão em `server/dashboard-sync.test.ts` e cobrem:

- ✅ Mapeamento de níveis (Book → Level)
- ✅ Mapeamento de objetivos
- ✅ Operações de banco de dados (create, read, update)
- ✅ Validação de dados sincronizados
- ✅ Estrutura de resultado de sincronização

**Executar testes:**
```bash
pnpm test dashboard-sync.test.ts
```

**Resultado esperado:**
```
✓ server/dashboard-sync.test.ts (11 tests) 252ms
Test Files  1 passed (1)
Tests  11 passed (11)
```

---

## 🐛 Troubleshooting

### Erro: "CENTRAL_DATABASE_URL não configurada"

**Solução:** Verificar se a variável de ambiente está definida:
```bash
echo $CENTRAL_DATABASE_URL
```

### Erro: "Apenas administradores podem sincronizar"

**Solução:** Fazer login com uma conta admin antes de chamar a procedure.

### Erro: "Email duplicado"

**Solução:** O aluno já existe no sistema local. O sistema ignora duplicatas e continua.

### Conexão lenta ou timeout

**Solução:** 
- Verificar conexão com internet
- Verificar se o banco centralizado está acessível
- Aumentar timeout na configuração

---

## 📈 Próximas Etapas

1. **Agendamento Automático** - Agendar sincronização diária às 18:00
2. **Webhook Receiver** - Receber notificações de mudanças em tempo real
3. **Sincronização Incremental** - Sincronizar apenas alunos modificados
4. **Dashboard de Monitoramento** - Visualizar status de sincronização
5. **Relatórios** - Gerar relatórios de sincronização

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do servidor: `pnpm dev`
2. Executar health check: `trpc.dashboardSync.healthCheck.query()`
3. Consultar documentação da API do Dashboard
4. Contatar administrador do sistema

---

**Última Atualização:** 12 de Fevereiro de 2026  
**Versão:** 1.0  
**Status:** ✅ Pronto para Produção
