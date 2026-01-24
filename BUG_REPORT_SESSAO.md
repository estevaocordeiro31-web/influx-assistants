# 🐛 RELATÓRIO TÉCNICO DO BUG - Sessão Incorreta

**Data:** 24 de janeiro de 2026  
**Severidade:** CRÍTICA  
**Status:** BUG CONFIRMADO

---

## 📋 RESUMO DO PROBLEMA

O sistema de login direto via URL está autenticando corretamente o usuário no backend, mas o **frontend continua exibindo dados do usuário anterior** (admin Estevão Cordeiro) ao invés dos dados da aluna autenticada (Camila Gonsalves).

---

## 🧪 TESTE REALIZADO

### Passos Executados:
1. ✅ Acessei `/logout` - Logout completo realizado
2. ✅ Acessei link direto da Camila: `/login-direct/d80e078ddb9ce0e237a67b4e00f09fddc762cc5ee9eadb3e9938cd4b19b81d08`
3. ✅ Página mostrou "Login realizado com sucesso!"
4. ✅ Redirecionou para `/student/dashboard`
5. ❌ **PROBLEMA:** Dashboard mostra "Olá, Estevão Cordeiro!" ao invés de "Olá, Camila Gonsalves!"

### Evidências (Screenshot):
- **Nome exibido:** "Estevão Cordeiro"
- **Nível:** Avançado
- **Book:** Book 5 - Unit 8
- **Estatísticas:** 248h, 1847 chunks, 45 dias seguidos
- **Canto superior direito:** "Camila Gonsalves, Book 5 - Unit 8" (CORRETO!)

---

## 🔍 ANÁLISE DO BUG

### O que está FUNCIONANDO:
1. ✅ Backend autentica corretamente (token validado)
2. ✅ Cookie de sessão é criado para a Camila
3. ✅ Redirecionamento para `/student/dashboard` ocorre
4. ✅ Header mostra "Camila Gonsalves" (canto superior direito)

### O que está FALHANDO:
1. ❌ Conteúdo principal do dashboard mostra dados do Estevão
2. ❌ Saudação mostra "Olá, Estevão Cordeiro!"
3. ❌ Estatísticas são do Estevão (248h, 1847 chunks)
4. ❌ Progresso do livro é do Estevão (Book 5 - Unit 8)

---

## 💡 HIPÓTESE DO PROBLEMA

### Causa Raiz Provável:
O **contexto do tRPC** está sendo criado corretamente no backend (cookie JWT válido), mas o **frontend está usando dados em cache** ou fazendo **queries com o contexto errado**.

### Possíveis Causas:

#### 1. Cache do React Query (tRPC)
- O `useAuth()` ou queries do dashboard podem estar usando dados em cache do usuário anterior
- O React Query não está invalidando queries após mudança de sessão

#### 2. Contexto do tRPC no Frontend
- O `trpc.auth.me.useQuery()` pode estar retornando dados em cache
- O contexto não está sendo recriado após o login direto

#### 3. Problema no Middleware de Autenticação
- O backend pode estar criando o token correto, mas o middleware que valida requests subsequentes está pegando o token errado
- Pode haver dois cookies coexistindo (um do Estevão e outro da Camila)

#### 4. LocalStorage/SessionStorage
- Dados do usuário podem estar salvos localmente e sendo usados ao invés dos dados do servidor
- O `window.location.replace()` pode não estar limpando o storage corretamente

---

## 🔬 CÓDIGO SUSPEITO

### 1. `client/src/_core/hooks/useAuth.ts`
```typescript
export function useAuth() {
  const { data: user, isLoading, error } = trpc.auth.me.useQuery();
  // ⚠️ SUSPEITO: Pode estar retornando dados em cache
  
  return {
    user: user || null,
    isAuthenticated: !!user,
    loading: isLoading,
    error,
  };
}
```

**Problema Potencial:**
- `trpc.auth.me.useQuery()` pode ter dados em cache do Estevão
- Não há invalidação explícita após login direto

---

### 2. `client/src/pages/DirectLogin.tsx`
```typescript
// Redirecionar com reload completo
window.location.replace(result.redirectTo);
```

**Problema Potencial:**
- `window.location.replace()` deveria limpar tudo, mas pode não estar funcionando
- O React Query pode estar mantendo cache mesmo após reload

---

### 3. `server/_core/context.ts`
```typescript
export async function createContext({ req, res }: CreateExpressContextOptions) {
  const token = req.cookies[COOKIE_NAME];
  // ⚠️ SUSPEITO: Pode estar pegando o cookie errado
  
  if (!token) {
    return { req, res, user: null };
  }
  
  const user = await sdk.verifySessionToken(token);
  return { req, res, user };
}
```

**Problema Potencial:**
- Pode haver múltiplos cookies com o mesmo nome
- O `req.cookies[COOKIE_NAME]` pode estar pegando o cookie antigo

---

### 4. `server/routers/direct-login.ts`
```typescript
// Definir cookie de sessão NOVA
ctx.res.setHeader(
  'Set-Cookie',
  `${COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
);
```

**Problema Potencial:**
- Estamos enviando array de cookies (delete + create)
- Express pode não estar processando corretamente
- O cookie antigo pode não estar sendo deletado

---

## 🛠️ SOLUÇÕES PROPOSTAS

### Solução 1: Invalidar Cache do React Query Após Login
```typescript
// Em DirectLogin.tsx
const utils = trpc.useUtils();

const performLogin = async (token: string) => {
  const result = await loginMutation.mutateAsync({ token });
  
  // ADICIONAR: Invalidar TODAS as queries
  await utils.invalidate();
  
  // ADICIONAR: Limpar cache do React Query
  queryClient.clear();
  
  window.location.replace(result.redirectTo);
};
```

---

### Solução 2: Forçar Reload Completo com Timestamp
```typescript
// Em DirectLogin.tsx
window.location.href = `${result.redirectTo}?_t=${Date.now()}`;
```

---

### Solução 3: Deletar Cookie Corretamente no Backend
```typescript
// Em direct-login.ts
ctx.res.setHeader(
  'Set-Cookie',
  [
    // Deletar com TODOS os atributos possíveis
    `${COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
    `${COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    // Criar novo
    `${COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
  ]
);
```

---

### Solução 4: Adicionar Delay Antes do Redirect
```typescript
// Em DirectLogin.tsx
await new Promise(resolve => setTimeout(resolve, 500));
window.location.replace(result.redirectTo);
```

---

### Solução 5: Usar Endpoint GET ao invés de tRPC Mutation
```typescript
// Criar endpoint Express direto
app.get('/api/direct-login/:token', async (req, res) => {
  // Validar token
  // Limpar cookies
  // Criar sessão
  // Redirecionar com res.redirect()
});
```

---

## 🎯 RECOMENDAÇÃO FINAL

### Abordagem Mais Segura:

**Implementar Solução 5 (Endpoint GET nativo do Express)**

Por quê?
- ✅ Controle total sobre cookies (não depende do tRPC)
- ✅ Redirect nativo do Express (mais confiável)
- ✅ Não depende de React Query ou cache do frontend
- ✅ Mais simples e direto
- ✅ Padrão usado por sistemas de autenticação robustos

### Implementação:

```typescript
// server/_core/index.ts
app.get('/api/direct-login/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Validar token
    const userEmail = validateDirectLoginToken(token);
    if (!userEmail) {
      return res.status(401).send('Token inválido');
    }
    
    // Buscar usuário
    const user = await getUserByEmail(userEmail);
    if (!user || user.status !== 'ativo') {
      return res.status(403).send('Acesso negado');
    }
    
    // LIMPAR COMPLETAMENTE cookies antigos
    res.clearCookie(COOKIE_NAME, { path: '/' });
    
    // Criar nova sessão
    const sessionToken = await sdk.createSessionToken(user.openId, {
      name: user.name || 'Student',
    });
    
    // Definir novo cookie
    res.cookie(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: '/',
    });
    
    // Redirecionar
    const redirectTo = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    res.redirect(redirectTo);
    
  } catch (error) {
    console.error('[DirectLogin] Erro:', error);
    res.status(500).send('Erro no login');
  }
});
```

---

## 📊 PRÓXIMOS PASSOS

1. ✅ Bug confirmado e documentado
2. ⏳ Implementar Solução 5 (Endpoint GET nativo)
3. ⏳ Testar em modo anônimo
4. ⏳ Validar que mostra dados corretos da aluna
5. ⏳ Gerar novos links e enviar para as alunas

---

## 📸 EVIDÊNCIAS VISUAIS

### Screenshot 1: Logout Completo
- ✅ Página de logout mostra "Logout completo realizado!"
- ✅ Cache e cookies limpos

### Screenshot 2: Login Direto - Sucesso
- ✅ Página mostra "Login realizado com sucesso!"
- ✅ Redirecionando para dashboard

### Screenshot 3: Dashboard - BUG CONFIRMADO
- ❌ Saudação: "Olá, Estevão Cordeiro!" (ERRADO)
- ✅ Header: "Camila Gonsalves" (CORRETO)
- ❌ Estatísticas: 248h, 1847 chunks (do Estevão)
- ❌ Progresso: Book 5 - Unit 8 (do Estevão)

---

*Relatório gerado em 24/01/2026 às 07:45*  
*Bug confirmado via teste automatizado no navegador* 🐛
