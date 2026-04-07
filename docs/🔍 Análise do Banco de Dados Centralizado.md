# 🔍 Análise do Banco de Dados Centralizado

**Data:** 24 de janeiro de 2026  
**Banco:** TiDB Cloud (MySQL compatível)  
**Total de Tabelas:** 46

---

## 📊 Tabelas Principais Identificadas

### 1. **users** (Usuários do Sistema)
- `id` (PK, auto_increment)
- `openId` (UNIQUE) - ID do OAuth Manus
- `name`, `email`
- `passwordHash` - Para login tradicional
- `loginMethod` - Método de autenticação
- `role` - enum: user, admin, student
- `status` - enum: ativo, inativo, desistente, trancado
- `sponteId` (UNIQUE) - Integração com Sponte
- `createdAt`, `updatedAt`, `lastSignedIn`

**✅ COMPATÍVEL** - Mesma estrutura que criamos no Personal Tutor

---

### 2. **students** (Dados dos Alunos)
Schema não disponível no output (precisa investigar)

---

### 3. **student_intelligence** (Inteligência sobre Alunos)
Schema não disponível no output (precisa investigar)

---

### 4. **tutor_blog_tips** (Dicas do Blog para o Tutor)
Schema não disponível no output (precisa investigar)

---

### 5. **tutor_interactions** (Interações do Tutor com Alunos)
Schema não disponível no output (precisa investigar)

---

### 6. **pedagogical_reports** (Relatórios Pedagógicos)
Schema não disponível no output (precisa investigar)

---

### 7. **conversation_metrics** (Métricas de Conversas)
- `id` (PK)
- `contactPhone` (UNIQUE)
- `clientName`
- `currentStep` - enum: greeting, protagonist, problem, solution, result, closed
- `targetLanguage`
- `pain`, `futureVision`
- `closingPreference` - enum: presencial, digital
- `firstContactAt`, `lastContactAt`, `closedAt`
- `totalConversationMinutes`, `totalMessages`
- `clientMessages`, `botMessages`
- `converted`, `conversionValue`
- `leadSource`, `campaign`
- `metadata` (JSON)
- `createdAt`, `updatedAt`

**📝 Nota:** Parece ser para tracking de conversas de vendas/marketing

---

## 🎯 Estratégia de Integração

### Opção A: Usar Tabelas Existentes
- Adaptar código do Personal Tutor para usar `users` e `students` do banco centralizado
- Criar novas tabelas específicas do tutor (conversations, messages, chunks, etc.)
- Manter compatibilidade com sistema principal

### Opção B: Criar Namespace Separado
- Prefixar todas as tabelas do Personal Tutor com `tutor_`
- Exemplo: `tutor_conversations`, `tutor_messages`, `tutor_student_profiles`
- Relacionar com `users` através de foreign keys

---

## ✅ Próximos Passos

1. **Investigar schema completo de:**
   - `students`
   - `student_intelligence`
   - `tutor_blog_tips`
   - `tutor_interactions`

2. **Decidir estratégia:**
   - Reutilizar tabelas existentes?
   - Criar tabelas novas com prefixo `tutor_`?

3. **Migrar dados:**
   - Laís e Camila para tabela `users` centralizada
   - Criar perfis em `students` ou `tutor_student_profiles`

4. **Atualizar código:**
   - Apontar `db.ts` para `CENTRAL_DATABASE_URL`
   - Ajustar queries para novo schema
   - Testar integração end-to-end

---

*Análise gerada em 24/01/2026 às 08:25*
