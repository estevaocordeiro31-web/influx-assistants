# Documentação Completa: inFlux Personal Tutor

## 📋 Visão Geral do Projeto

**Nome:** inFlux Personal Tutor  
**Objetivo:** Assistente pessoal de IA para alunos de inglês da inFlux, oferecendo aprendizado personalizado 24/7  
**Tecnologias:** React 19, TypeScript, tRPC 11, Express 4, Drizzle ORM, MySQL/TiDB, Tailwind 4  
**Caminho do Projeto:** `/home/ubuntu/influx-assistants`

---

## 🎯 Funcionalidades Principais

### 1. **Sistema de Autenticação**
- OAuth via Manus (sistema proprietário)
- Links personalizados para acesso direto de alunos
- Roles: `admin` e `user` (aluno)

### 2. **Tutor Personalizado com IA**
- Chat por voz e texto
- Ensino de Connected Speech (Linking, Elision, Assimilation)
- Feedback de pronúncia com IPA
- Planos de estudo de 12 semanas personalizados

### 3. **Reading Club**
- Biblioteca curada de livros
- Sistema de badges e gamificação
- Glossário integrado

### 4. **Dashboard de Alunos**
- Progresso em tempo real
- Recomendações personalizadas (séries, músicas, livros)
- Exercícios interativos
- Dicas diárias do blog inFlux

### 5. **Sistema de Materiais Exclusivos**
- Compartilhamento de materiais por coordenador
- Acesso via links personalizados

---

## 🏗️ Arquitetura do Sistema

### **Stack Tecnológico**

**Frontend:**
- React 19 + TypeScript
- Tailwind CSS 4
- Wouter (routing)
- shadcn/ui (componentes)
- tRPC client

**Backend:**
- Express 4
- tRPC 11 (API type-safe)
- Drizzle ORM
- MySQL/TiDB (banco de dados)

**Integrações:**
- Manus OAuth (autenticação)
- Manus LLM API (IA para tutor)
- Manus Voice Transcription API (transcrição de áudio)
- Sponte Web (sistema de gestão escolar - dados de alunos)

### **Estrutura de Diretórios**

```
/home/ubuntu/influx-assistants/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas da aplicação
│   │   │   ├── Home.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── AccessViaLink.tsx
│   │   │   └── ...
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── AITutor.tsx
│   │   │   ├── PersonalTutor.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── lib/
│   │   │   └── trpc.ts       # Cliente tRPC
│   │   ├── hooks/
│   │   └── contexts/
│   └── public/               # Assets estáticos
├── server/                    # Backend Express + tRPC
│   ├── _core/                # Framework core (não editar)
│   │   ├── context.ts        # Contexto tRPC
│   │   ├── sdk.ts            # SDK Manus
│   │   ├── llm.ts            # Helper LLM
│   │   ├── voiceTranscription.ts
│   │   └── ...
│   ├── routers/              # tRPC routers
│   │   ├── auth.ts
│   │   ├── tutor.ts
│   │   ├── personalized-links.ts
│   │   └── ...
│   ├── routers.ts            # Router principal
│   ├── db.ts                 # Helpers de banco
│   └── personalized-access.ts # Lógica de links
├── drizzle/                   # Schema e migrações
│   └── schema.ts
├── shared/                    # Tipos compartilhados
└── storage/                   # Helpers S3

```

---

## 🗄️ Schema do Banco de Dados

### **Tabela: `users`**
```typescript
{
  id: number (auto-increment),
  openId: string (unique, Manus OAuth ID),
  name: string,
  email: string,
  role: 'admin' | 'user',
  studentId: number (nullable, ID do Sponte),
  enrollmentNumber: string (nullable, matrícula),
  currentBook: string (nullable, ex: "Book 4"),
  currentLesson: number (nullable),
  goals: text (nullable, JSON),
  interests: text (nullable, JSON),
  difficulties: text (nullable, JSON),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### **Tabela: `personalized_links`**
```typescript
{
  id: number (auto-increment),
  studentId: number (FK -> users.id),
  linkHash: string (unique, hash do link),
  expiresAt: timestamp,
  accessCount: number (default: 0),
  isActive: boolean (default: true),
  createdAt: timestamp,
  lastAccessedAt: timestamp (nullable)
}
```

### **Tabela: `exclusive_materials`**
```typescript
{
  id: number (auto-increment),
  title: string,
  description: text (nullable),
  fileUrl: string,
  sharedBy: number (FK -> users.id, admin),
  sharedAt: timestamp,
  targetClass: string (nullable),
  targetStudentId: number (nullable, FK -> users.id)
}
```

### **Tabela: `material_access`**
```typescript
{
  id: number (auto-increment),
  materialId: number (FK -> exclusive_materials.id),
  studentId: number (FK -> users.id),
  accessedAt: timestamp,
  linkHash: string (nullable)
}
```

---

## 🔐 Fluxo de Autenticação

### **1. Autenticação Normal (OAuth)**
1. Usuário clica em "Login"
2. Redirecionado para portal OAuth Manus
3. Após login, callback em `/api/oauth/callback`
4. Sistema cria sessão JWT via `sdk.createSessionToken(openId, { name })`
5. Cookie `__session` é definido com token
6. Contexto tRPC (`server/_core/context.ts`) valida token em cada request

### **2. Autenticação via Link Personalizado** ⚠️ **PROBLEMA ATUAL**

**Fluxo Esperado:**
1. Coordenador cria link para aluno via `trpc.personalizedLinks.createLink.useMutation()`
2. Link gerado: `https://app.com/access/{linkHash}`
3. Aluno acessa link
4. Página `AccessViaLink.tsx` chama `trpc.personalizedLinks.authenticateViaLink.useMutation({ linkHash })`
5. Mutation valida link, busca aluno no banco
6. **DEVE:** Limpar cookie existente, criar novo token para aluno, definir cookie
7. Redireciona para `/student/dashboard`
8. Dashboard mostra dados do aluno específico

**Problema Atual:**
- Quando admin acessa link de aluno, sessão de admin **não é substituída**
- Dashboard continua mostrando dados de admin, não do aluno
- Cookie de sessão não está sendo limpo corretamente

**Código Atual (`server/routers/personalized-links.ts`, linha 234-243):**
```typescript
// Limpar cookie existente primeiro (importante para substituir sessão de admin)
ctx.res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);

// Criar token de sessão para o aluno
const sessionToken = await sdk.createSessionToken(student.openId, {
  name: student.name || 'Student',
});

// Definir novo cookie de sessão
ctx.res.setHeader('Set-Cookie', `${COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);
```

**Possíveis Causas:**
1. `setHeader` sendo chamado duas vezes pode sobrescrever o primeiro header
2. Navegador pode estar cacheando cookie antigo
3. Contexto tRPC pode estar validando token antes da mutation completar
4. Cookie pode não estar sendo enviado corretamente na resposta HTTP

**Solução Sugerida:**
- Usar array de cookies: `ctx.res.setHeader('Set-Cookie', [cookie1, cookie2])`
- Ou usar biblioteca `cookie` para manipular cookies corretamente
- Ou forçar redirect com query param para limpar cache

---

## 👥 Perfis de Alunos Existentes

### **Camila Gonsalves da Rosa de Carvalho**
- **ID:** 390198
- **Matrícula:** 6220
- **Email:** camilagdarosa@outlook.com
- **CPF:** 104.113.229-82
- **Telefone:** 41 8468-9753
- **Endereço:** Av. Doutor Gilberto Luiz Pereira da Silva, 16, Cidade Nova, Jundiaí
- **Nível:** Book 4 (começando Lesson 1)
- **Tempo de estudo:** Quase 2 anos
- **Objetivos:** Comunicação, entender conversas, assistir filmes sem legenda, ler livros, viajar para Europa
- **Interesses:** Séries (Friends, desenhos), música (Post Malone, Imagine Dragons, Coldplay, Linkin Park, Djo, Bruno Mars), viagens (Itália, Grécia, Espanha, Alemanha), restaurantes e cafés
- **Dificuldades:** Formação de frases para falar, explicar coisas em detalhes, listening, pronúncia
- **Conforto:** Leitura e escrita
- **Consumo de inglês:** Música, vídeos Instagram, séries, livros
- **Link personalizado:** `e6885d84541624e283766735fc500f5731afceeae37dab49c262b5a05867ef53`

### **Laís Milena Gambini**
- **ID:** 390197
- **Matrícula:** 6200
- **Nível:** Book 4
- **Tempo de estudo:** 1 ano (a partir do Book 2)
- **Objetivos:** Falar bem para reuniões de trabalho e viagens, escrever bem para trabalho
- **Dificuldades:** Conectivos, tempos verbais (sob pressão), nervosismo para falar, plural/singular
- **Conforto:** Comunicação básica (quando calma)
- **Consumo de inglês:** Trabalho (emails, relatórios), séries, música

---

## 📚 Conteúdo Programático Book 4

### **Estrutura:**
- 30 Lições
- 15 Units (2 lições por unit)
- 2 Stages (Stage 1: Units 1-7, Stage 2: Units 8-15)

### **Units Importantes para Camila (Viagens):**
- **Unit 14: FLIGHTS AND HOTELS** (Lições 27-28)
  - Booking flights, hotels
  - Passive voice
  - Chunks: "I'd like to book a flight to...", "Can I get a room with a view?"
  
- **Unit 15: TRAVEL AND TOURISM** (Lições 29-30)
  - Recomendações, Past Perfect Continuous
  - Chunks: "Have you been to...?", "I wish I could..."

### **Connected Speech (Todos os Níveis):**
1. **Linking:** Conectar palavras (ex: "an_apple" /ənˈæpəl/)
2. **Elision:** Eliminar sons (ex: "next day" → "nex day")
3. **Assimilation:** Transformar sons (ex: "good boy" → "goob boy")

---

## 🎨 Design e UX

### **Identidade Visual:**
- **Mascote:** Fluxie (mascote inFlux)
- **Logo:** inFlux
- **Cores:** Azul (#0047AB), Laranja (#FF5F1F), Dourado (#FFD700)
- **Tipografia:** Montserrat (headings), Inter (body)

### **Componentes Principais:**
1. **DashboardLayout** - Layout com sidebar para dashboards
2. **AITutor** - Chat com IA (voz e texto)
3. **PersonalTutor** - Plano personalizado de 12 semanas
4. **AIChatBox** - Interface de chat reutilizável

---

## 📝 Documentos Criados

1. **CARTA_BOAS_VINDAS_READING_CLUB.md** - Carta de boas-vindas ao Reading Club
2. **APRESENTACAO_INFLUX_PERSONAL_TUTOR_CONTEUDO.md** - Roteiro de 18 slides da apresentação
3. **BOOK4_CONTEUDO_ESTRUTURADO.md** - Conteúdo estruturado do Book 4
4. **BOOK4_ANALISE_COMPLETA_COM_EXERCICIOS.md** - Análise completa com exercícios e diferenças culturais
5. **TUTOR_CAMILA_PERSONALIZADO.md** - Plano personalizado de Camila
6. **TUTOR_LAIS_PERSONALIZADO.md** - Plano personalizado de Laís
7. **CAMILA_PERFIL_DETALHADO_ATUALIZADO.md** - Perfil detalhado de Camila

---

## 🐛 Problemas Atuais

### **1. Autenticação via Link Personalizado (CRÍTICO)**
**Descrição:** Quando admin acessa link de aluno, sessão de admin não é substituída  
**Arquivo:** `server/routers/personalized-links.ts` (linha 234-243)  
**Status:** Tentativa de correção aplicada, mas não funcionou  
**Impacto:** Impossível testar dashboard de alunos via link

### **2. Erro de Compilação no tutor.ts**
**Descrição:** Erro de sintaxe na linha 298  
**Mensagem:** `Expected "}" but found "student"`  
**Arquivo:** `server/routers/tutor.ts` (linha 298)  
**Status:** Não resolvido  
**Impacto:** Dev server não inicia corretamente

---

## 🔧 Comandos Úteis

```bash
# Instalar dependências
cd /home/ubuntu/influx-assistants && pnpm install

# Iniciar dev server
cd /home/ubuntu/influx-assistants && pnpm dev

# Build
cd /home/ubuntu/influx-assistants && pnpm build

# Testes
cd /home/ubuntu/influx-assistants && pnpm test

# Migração do banco
cd /home/ubuntu/influx-assistants && pnpm db:push

# Executar SQL direto
cd /home/ubuntu/influx-assistants && node << 'EOF'
import { getDb } from './server/db.js';
const db = await getDb();
const result = await db.execute('SELECT * FROM users');
console.log(result);
EOF
```

---

## 📊 Estatísticas do Projeto

- **Linhas de código:** ~15,000+
- **Componentes React:** 20+
- **tRPC Procedures:** 30+
- **Testes:** 90+ (21 no tutor, 69 em outros módulos)
- **Documentos criados:** 10+
- **Checkpoints salvos:** 10+

---

## 🚀 Próximos Passos Sugeridos

1. **Resolver problema de autenticação via link** (prioridade máxima)
2. **Corrigir erro de compilação no tutor.ts**
3. **Implementar sistema de tracking de progresso**
4. **Criar exercícios interativos**
5. **Integrar blog inFlux para dicas personalizadas**
6. **Implementar simulador de viagens com IA**
7. **Criar quiz cultural Europa**
8. **Implementar sistema de notificações**

---

## 📞 Contato e Suporte

**Desenvolvedor:** Manus AI Agent  
**Cliente:** inFlux (Escola de Inglês)  
**Projeto:** inFlux Personal Tutor  
**Versão Atual:** 1.1.0

---

## 🔑 Variáveis de Ambiente (Pré-configuradas)

```env
# Banco de Dados
DATABASE_URL=mysql://...

# OAuth Manus
JWT_SECRET=...
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=...

# APIs Manus
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_KEY=...

# Sponte (Sistema Escolar)
SPONTE_API_URL=...
SPONTE_LOGIN=...
SPONTE_PASSWORD=...

# Owner
OWNER_OPEN_ID=...
OWNER_NAME=...
```

---

## 📖 Referências

- [tRPC Documentation](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [React 19 Docs](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Última Atualização:** 23 de Janeiro de 2026  
**Versão do Documento:** 1.0
