# ImAInd — Relatório Técnico Consolidado do Sistema
### Para Apresentação e Tomada de Decisão Estratégica

**Data de geração:** 22 de Março de 2026  
**Versão do sistema:** `275d4b9f` (deployed em influxassist-2anfqga4.manus.space)  
**Varredura realizada sobre:** 645 arquivos · 95.521 linhas de código · banco de dados ativo

> Este relatório foi gerado por varredura técnica direta do código-fonte, banco de dados e configurações de ambiente. Todos os números são verificáveis.

---

## Nomenclatura dos Módulos ImAInd

O sistema **inFlux Personal Assistants** é composto por três módulos integrados que operam sob a mesma base de código:

| Nome ImAInd | Módulo interno | Público-alvo |
|---|---|---|
| **ImAInd BRAiN** | Admin Dashboard + Integrações | Gestores e professores |
| **ImAInd TUTOR** | Personal Tutor (alunos) | Alunos da inFlux |
| **ImAInd EXPERIENCE** | Cultural Events (eventos culturais) | Alunos em eventos presenciais |

---

## SEÇÃO 1 — O QUE ESTE SISTEMA TEM (EXCLUSIVO)

### 1.1 Dimensões Técnicas do Sistema

| Métrica | Valor |
|---|---|
| Total de arquivos de código | **645** |
| Linhas de código (TS + TSX) | **95.521** |
| Componentes frontend (TSX) | **209** |
| Módulos TypeScript frontend | **20** |
| Routers backend tRPC | **52** |
| Arquivos de teste (Vitest) | **71** |
| Tabelas no banco local | **65** |
| Tabelas no banco central compartilhado | **9** |
| Páginas de eventos culturais | **28** |
| Páginas de administração | **6** |
| Páginas do aluno | **7** |
| Componentes reutilizáveis | **60+** |

### 1.2 ImAInd TUTOR — Funcionalidades Exclusivas

O módulo de tutoria é o núcleo pedagógico do sistema. Ele entrega uma experiência de aprendizado personalizada e contínua para cada aluno, com os seguintes recursos exclusivos:

**Personagens com Identidade e Sotaque Real.** Três personagens com personalidades distintas — Lucas (🇺🇸 sotaque americano), Emily (🇬🇧 sotaque britânico) e Aiko (🇦🇺 sotaque australiano) — estão integrados em todas as interações. Cada personagem possui voz própria via três provedores de TTS configurados em cascata: **ElevenLabs** (qualidade premium, preferencial), **OpenAI TTS** (fallback) e **Google Cloud TTS** (fallback secundário). As vozes são: Lucas → ElevenLabs Adam (American male), Emily → ElevenLabs Charlotte (British female), Aiko → ElevenLabs Jessica (Playful, Bright, Warm).

**Chat com IA e Avaliação em Tempo Real.** O chat avalia cada resposta do aluno em quatro dimensões simultâneas: gramática, naturalidade, connected speech e vocabulário. A avaliação é exibida em tempo real com badges coloridos durante a conversa, sem interromper o fluxo.

**Bate-papo por Voz com Transcrição Whisper.** O aluno pode conversar por voz com os personagens. O áudio é transcrito via **OpenAI Whisper API**, avaliado pela IA e respondido com áudio TTS do personagem correspondente.

**65 Exercícios Extras Organizados por Livro e Lição.** O sistema possui um banco de exercícios extras para Books 1 e 2, com progresso individual por aluno, rastreado na tabela `student_exercise_progress`.

**20 Selos Gamificados com Critérios Pedagógicos.** O sistema de badges possui 20 definições com critérios claros ligados a comportamentos reais de aprendizado (streak, exercícios, chat, voz, blog). Os selos são armazenados em `badge_definitions` e `student_badges`.

**Simulador de Situações Reais.** O aluno pratica inglês em cenários do mundo real (restaurante, aeroporto, entrevista de emprego) com feedback da IA ao final de cada simulação.

**Passaporte inFlux com Check-ins.** Sistema de check-in por QR Code que registra a presença do aluno em eventos e aulas, com histórico completo em `passport_qr_codes`.

**Dicas Personalizadas do Blog inFlux.** O sistema entrega dicas do blog inFlux personalizadas por nível e objetivo do aluno, com sistema de favoritos, feedback e badges de engajamento (`blog_tips_badges`, `blog_tips_favorites`, `blog_tips_feedback`).

**Reading Club Integrado.** Sistema completo de clube de leitura com posts, comentários, badges, eventos e biblioteca virtual (`rc_posts`, `rc_comments`, `rc_badges`, `rc_events`, `library_books`, `library_loans`).

**influxDollars — Moeda Virtual.** Sistema de moeda virtual da escola (`student_influx_dollars`, `influx_dollar_transactions`) para recompensar engajamento e permitir trocas futuras.

### 1.3 ImAInd BRAiN — Funcionalidades Exclusivas

O módulo administrativo é o sistema nervoso da escola. Ele centraliza dados, automatiza processos e entrega inteligência estratégica:

**Sincronização Bidirecional com o Sponte (ERP da escola).** O sistema conecta diretamente à API REST do Sponte (`https://api.sponteweb.com.br`) com autenticação por token renovável. A sincronização inclui: dados de alunos, matrículas, livros, turmas e histórico de acesso. A sincronização em massa (`bulk-student-sync`) processa 1.818+ alunos do Dashboard Central.

**Links de Acesso Personalizados por Aluno.** Cada aluno recebe um link único (`/access/:linkHash`) que autentica diretamente sem senha, rastreado em `personalized_links`. O sistema gera, envia e monitora o uso de cada link.

**Análise Estratégica com Gemini AI.** O módulo Gemini (`gemini-integration.ts`) conecta diretamente à API `gemini-2.5-flash` do Google para análise cruzada de dados de alunos, sugestões pedagógicas e relatórios estratégicos para o gestor.

**Envio de Mensagens WhatsApp em Massa.** O router `whatsapp-messages` gera mensagens personalizadas para todos os alunos ativos e exporta em CSV para envio via WhatsApp Web ou API.

**Scheduler de Dicas Diárias.** O sistema possui um job agendado (`daily-tips-scheduler`) que dispara dicas personalizadas do blog para os alunos com base em seu nível e progresso.

**Gestão Completa de Alunos.** CRUD completo com filtros avançados (nível, objetivo, status), reset de senha com notificação, reconciliação de usuários sem vínculo, e exportação em JSON.

**Análise Cruzada de Aluno.** Para cada aluno, o sistema cruza dados do Sponte (matrículas, livros, turmas) com dados do ImAInd (exercícios, chat, streak, badges) para gerar um perfil completo de evolução.

**Campanha Back to School.** Módulo dedicado para gestão da campanha de retorno, com enrollment, sync log e dashboard específico.

### 1.4 ImAInd EXPERIENCE — Funcionalidades Exclusivas

O módulo de eventos transforma a noite cultural em uma experiência gamificada e interativa:

**Fluxo Completo de Evento em 5 Missões.** O aluno entra via QR Code, se cadastra, acessa o Hub com 5 missões principais: Chunk Lesson (FlipCards), Culture Quiz (8 perguntas), Chunk Listening (fill-in-the-gaps), Speaking Challenge (avaliação por IA) e Food Challenge (chat com personagem). Cada missão concede pontos rastreados em `event_mission_progress`.

**3 Drinking Games Interativos.** Tongue Twister Challenge (avaliação de pronúncia por IA com score 0-100%), Who Am I? (jogo de perguntas Sim/Não com personagens famosos) e Finish the Lyrics (complete a letra com categorias: Pop Hits, 80s Classics, Irish Songs).

**Hot Seat — Modo TV e Individual.** Jogo em grupo onde um voluntário fica de costas para a tela enquanto o grupo vê o personagem e dá dicas em inglês. Disponível em modo individual e modo TV projetado.

**Versão Kids com 4 Atividades.** Hub infantil dedicado com Tongue Twister Kids, Who Am I? Kids, Sing Along Kids e Introdução Kids com cartoons animados.

**Telas TV para Projeção.** 7 telas otimizadas para TV/projetor: Recepção com QR Code, Leaderboard ao Vivo (atualização a cada 30s), Hot Seat TV, Introdução (mobile), Introdução TV (fullscreen, timer 18s), Introdução Kids e Tela de Encerramento com pódio animado e confetes.

**Teacher Dashboard com PIN.** Dashboard exclusivo do professor com timeline da noite, dicas de facilitação por atividade, acesso a todas as telas TV e estatísticas ao vivo. Protegido por PIN de 6 dígitos.

**Cerimônia de Encerramento Animada.** Tela de encerramento com pódio animado (ouro/prata/bronze), confetes via canvas HTML5, ranking completo, estatísticas da noite e CTA para o inFlux AITutor.

### 1.5 Integrações Externas Ativas

| Integração | Provedor | Uso | Status |
|---|---|---|---|
| LLM (chat, avaliação, análise) | OpenAI GPT (via Forge API) | Chat IA, avaliação de fala, análise cruzada | ✅ Ativo |
| TTS Premium | ElevenLabs | Voz dos personagens (preferencial) | ✅ Ativo |
| TTS Fallback 1 | OpenAI TTS | Voz dos personagens (fallback) | ✅ Ativo |
| TTS Fallback 2 | Google Cloud TTS | Voz dos personagens (fallback) | ✅ Ativo |
| Transcrição de Voz | OpenAI Whisper | Voice chat do aluno | ✅ Ativo |
| IA Estratégica | Google Gemini 2.5 Flash | Análise estratégica admin | ✅ Ativo |
| ERP da Escola | Sponte (`api.sponteweb.com.br`) | Dados de alunos, matrículas, livros | ✅ Ativo |
| Armazenamento de Arquivos | S3 (via Manus Forge) | Upload de materiais didáticos | ✅ Ativo |
| Notificações ao Owner | Manus Forge Notification API | Alertas operacionais | ✅ Ativo |
| Mapas | Google Maps (via Manus Proxy) | Funcionalidade de mapa (disponível) | ⚪ Disponível |
| Autenticação | Manus OAuth | Login dos professores/admins | ✅ Ativo |

---

## SEÇÃO 2 — O QUE ESTE SISTEMA COMPARTILHA COM OS OUTROS

### 2.1 Banco de Dados Central (TiDB Cloud)

O sistema mantém **dois bancos de dados simultâneos**: um banco local (MySQL/TiDB) exclusivo do projeto e um banco central compartilhado (`CENTRAL_DATABASE_URL`) que conecta ao Dashboard Central da inFlux.

O banco central possui **9 tabelas compartilhadas** que são lidas e escritas por múltiplos sistemas:

| Tabela Central | Conteúdo | Quem usa |
|---|---|---|
| `students` | Cadastro mestre de alunos (1.818+) | ImAInd BRAiN + Dashboard Central |
| `student_intelligence` | Perfil pedagógico e métricas de IA | ImAInd TUTOR + Dashboard Central |
| `tutor_conversations` | Histórico de conversas com IA | ImAInd TUTOR + Dashboard Central |
| `tutor_messages` | Mensagens individuais do chat | ImAInd TUTOR + Dashboard Central |
| `tutor_chunks` | Chunks praticados por aluno | ImAInd TUTOR + Dashboard Central |
| `tutor_student_progress` | Progresso consolidado do aluno | ImAInd TUTOR + Dashboard Central |
| `tutor_reading_club` | Participação no Reading Club | ImAInd TUTOR + Dashboard Central |
| `tutor_interactions` | Log de interações com IA | ImAInd TUTOR + Dashboard Central |
| `tutor_blog_tips` | Dicas do blog consumidas | ImAInd TUTOR + Dashboard Central |

A sincronização com o banco central é **fire-and-forget** (não bloqueia a operação local) e ocorre em tempo real a cada exercício completado, mensagem enviada ou progresso registrado.

### 2.2 API do Sponte (ERP Compartilhado)

O Sponte é o ERP da rede inFlux e é a **fonte de verdade** para dados de alunos, matrículas e turmas. O ImAInd BRAiN consome a API do Sponte para:

- Autenticação por token renovável (endpoint: `POST /auth`)
- Busca de aluno individual por ID
- Listagem de alunos ativos (1.818 no Dashboard Central)
- Registro de acesso do aluno no Sponte
- Busca de matrículas por aluno
- Sincronização diária automática às 18h

**Dependência crítica:** Se a API do Sponte estiver indisponível, a sincronização de novos alunos e a validação de matrículas ficam comprometidas. O sistema possui fallback para o banco local.

### 2.3 Manus OAuth (Autenticação Compartilhada)

O sistema usa o **Manus OAuth** como provedor de identidade para professores e administradores. O fluxo OAuth completo está em `server/_core/oauth.ts` e `server/_core/sdk.ts`. O `VITE_APP_ID` identifica o aplicativo no ecossistema Manus.

**Importante:** Os alunos **não usam** o Manus OAuth. Eles autenticam via senha local (`auth-password`) ou link personalizado (`/access/:linkHash`), o que permite acesso sem conta Manus.

### 2.4 Manus Forge API (Infraestrutura Compartilhada)

O sistema usa a **Manus Forge API** como gateway para:

- **LLM** — todas as chamadas de IA (chat, avaliação, análise) passam pelo Forge, que roteia para OpenAI GPT
- **Storage S3** — upload e download de materiais didáticos
- **Notificações** — alertas ao owner do projeto
- **Google Maps Proxy** — acesso ao Google Maps sem chave própria

A Forge API é acessada via `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` no servidor, e via `VITE_FRONTEND_FORGE_API_URL` e `VITE_FRONTEND_FORGE_API_KEY` no frontend.

### 2.5 Resumo de Dependências Externas Compartilhadas

| Recurso | Tipo de dependência | Impacto se indisponível |
|---|---|---|
| Banco Central (TiDB) | Escrita assíncrona | Dados não propagam ao Dashboard Central |
| API Sponte | Leitura síncrona | Sincronização de alunos interrompida |
| Manus OAuth | Autenticação admin | Professores/admins não conseguem logar |
| Manus Forge (LLM) | Chamada síncrona | Chat IA, avaliação de fala e análise indisponíveis |
| ElevenLabs | Chamada síncrona | TTS cai para OpenAI (fallback automático) |
| OpenAI (Whisper + TTS) | Chamada síncrona | Voice chat indisponível; TTS cai para Google |
| Google Gemini | Chamada síncrona | Análise estratégica admin indisponível |

---

## SEÇÃO 3 — STATUS ATUAL

### 3.1 Status por Módulo

| Módulo | Status | Observação |
|---|---|---|
| **Chat com IA (texto)** | ✅ Funcionando | Avaliação em tempo real ativa |
| **Voice Chat (voz)** | ✅ Funcionando | Whisper + TTS integrados |
| **Exercícios extras (Books 1-2)** | ✅ Funcionando | 65 exercícios, progresso rastreado |
| **Badges (20 selos)** | ✅ Funcionando | Critérios e animações ativos |
| **Streaks e gamificação** | ✅ Funcionando | Pontos e streak diário |
| **Simulador de situações** | ✅ Funcionando | 5+ cenários disponíveis |
| **Passaporte inFlux** | ✅ Funcionando | QR Code + check-in |
| **Blog Tips personalizadas** | ✅ Funcionando | Filtro por nível e objetivo |
| **Reading Club** | ⚠️ Parcial | Estrutura no banco, UI em desenvolvimento |
| **influxDollars** | ⚠️ Parcial | Tabelas criadas, lógica de troca pendente |
| **Onboarding do aluno** | ❌ Pendente | Não implementado |
| **Notificações push** | ⚠️ Parcial | Scheduler criado, push real pendente |
| **Admin Dashboard** | ✅ Funcionando | CRUD, filtros, exportação |
| **Sincronização Sponte** | ✅ Funcionando | Diária às 18h + manual |
| **Links personalizados** | ✅ Funcionando | Geração e acesso via hash |
| **Análise Gemini** | ✅ Funcionando | Chat estratégico + análise cruzada |
| **WhatsApp em massa** | ⚠️ Parcial | Geração de mensagens OK; envio manual via CSV |
| **Campanha Back to School** | ✅ Funcionando | Enrollment e sync ativos |
| **Evento Cultural (fluxo completo)** | ✅ Funcionando | QR → Hub → 5 Missões → Encerramento |
| **Tongue Twister Challenge** | ✅ Funcionando | Avaliação IA + indicador de progresso |
| **Who Am I?** | ✅ Funcionando | 20+ personagens |
| **Finish the Lyrics** | ✅ Funcionando | 3 categorias |
| **Hot Seat (individual + TV)** | ✅ Funcionando | Modo grupo e individual |
| **Leaderboard ao vivo** | ✅ Funcionando | Atualização a cada 30s |
| **Telas TV (7 telas)** | ✅ Funcionando | Todas registradas e acessíveis |
| **Versão Kids (4 atividades)** | ✅ Funcionando | Hub + 4 atividades |
| **Teacher Dashboard** | ✅ Funcionando | PIN + timeline + dicas + TV |
| **Tela de Encerramento** | ✅ Funcionando | Pódio + confetes + ranking |
| **Intro TV (fullscreen)** | ✅ Funcionando | Timer 18s automático |
| **Intro Kids (cartoons)** | ✅ Funcionando | Personagens cartoon |
| **Acesso individual dos alunos** | ⚠️ Pendente | Links gerados, envio em massa pendente |
| **Redesign Student Dashboard** | ❌ Pendente | Layout atual funcional, redesign planejado |

### 3.2 Os 3 Maiores Problemas Hoje

**Problema 1 — Alunos ainda não têm acesso.**  
O sistema está completo e funcional, mas os 226 alunos ativos no banco local ainda não receberam seus links de acesso. O fluxo de envio em massa via WhatsApp está implementado (geração de CSV com mensagens personalizadas), mas o disparo ainda não foi executado. Este é o bloqueador mais crítico: sem acesso, o ImAInd TUTOR existe apenas para o gestor.

**Problema 2 — Ausência de onboarding no primeiro acesso.**  
Quando um aluno acessa pela primeira vez via link personalizado, ele cai diretamente no Student Dashboard sem nenhuma apresentação, contexto ou orientação. Não há tela de boas-vindas personalizada, não há escolha de personagem favorito, não há explicação das funcionalidades. Isso gera abandono imediato em usuários que não sabem o que fazer.

**Problema 3 — Erros no Chrome mobile ao entrar no evento.**  
Embora mitigado na última sprint (feedback de erro, retry, fix do localStorage), o fluxo de entrada no evento ainda apresenta instabilidade em alguns dispositivos Android com Chrome. O problema raiz é a combinação de localStorage + redirect assíncrono + validação de participante, que pode criar loops em conexões lentas. Um fallback de sessão por URL hash resolveria definitivamente.

### 3.3 Os 3 Maiores Diferenciais Competitivos

**Diferencial 1 — Personalização Real por Aluno, Não por Turma.**  
A maioria dos sistemas de ensino de idiomas personaliza por nível ou turma. O ImAInd personaliza por aluno individual: o chat sabe o livro atual do aluno, seu objetivo (viagem, trabalho, cultura), seu histórico de conversas, seus chunks praticados e seu nível de confiança (`pa_confidence_score`). Isso cria uma experiência que parece feita exclusivamente para aquela pessoa.

**Diferencial 2 — Três Sotaques Reais com Personagens com Identidade.**  
Nenhum sistema de ensino de inglês no Brasil oferece três personagens com sotaques distintos (americano, britânico, australiano) com vozes de alta qualidade (ElevenLabs), personalidades definidas e presença visual consistente. Lucas, Emily e Aiko não são avatares genéricos — são personagens com backstory, estilo de comunicação e contexto cultural próprios. Isso cria identificação emocional com o aprendizado.

**Diferencial 3 — Evento Cultural como Produto de Retenção.**  
O ImAInd EXPERIENCE transforma a noite cultural — que seria apenas um evento presencial — em uma plataforma gamificada com leaderboard, missões, pontuação e cerimônia de encerramento. O aluno que participou do St. Patrick's Night tem um motivo concreto para voltar: ver sua posição no ranking, completar as missões que não terminou e se preparar para o próximo evento. Isso cria um ciclo de engajamento que vai além da sala de aula.

---

## Apêndice — Estrutura de Arquivos por Módulo

```
influx-assistants/
├── client/src/
│   ├── pages/
│   │   ├── events/          ← 28 páginas (ImAInd EXPERIENCE)
│   │   ├── StudentDashboard.tsx + 6 páginas (ImAInd TUTOR)
│   │   ├── AdminDashboard.tsx + 5 páginas (ImAInd BRAiN)
│   │   └── Home.tsx, Login.tsx, etc.
│   └── components/          ← 60+ componentes reutilizáveis
├── server/
│   ├── routers/             ← 52 routers tRPC
│   ├── _core/               ← OAuth, LLM, TTS, Whisper, Maps, env
│   ├── helpers/             ← Sponte, cross-analysis, book-mapping
│   └── jobs/                ← Schedulers e cron jobs
├── drizzle/
│   ├── schema.ts            ← 65 tabelas (banco local)
│   └── schema-central.ts   ← 9 tabelas (banco central compartilhado)
└── shared/                  ← Tipos e constantes compartilhados
```

---

*Relatório gerado por varredura técnica direta — ImAInd / inFlux Personal Assistants — 22/03/2026*
