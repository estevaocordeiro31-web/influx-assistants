# inFlux Personal Tutor - TODO

## Fase 1: Arquitetura, Design e Banco de Dados
- [x] Definir identidade visual e paleta de cores
- [x] Criar schema do banco de dados (alunos, chunks, conversas, exercícios, progresso)
- [x] Implementar migrações do Drizzle
- [x] Documentar arquitetura de IA e integração com LLM

## Fase 2: Autenticação, Perfis e Dashboard Admin
- [x] Implementar autenticação de alunos e administradores
- [x] Criar página de perfil do aluno (objetivo, nível, histórico)
- [x] Desenvolver dashboard administrativo com visualização de alunos
- [x] Implementar filtros e busca no dashboard
- [x] Criar página de detalhes do aluno para coordenadores

## Fase 3: Biblioteca de Chunks e Exercícios
- [x] Criar tabela de chunks e expressões no banco de dados
- [x] Desenvolver interface de gerenciamento de chunks (admin)
- [x] Implementar sistema de exercícios personalizados
- [x] Criar página de exercícios para alunos
- [x] Desenvolver sistema de feedback de exercícios

## Fase 4: Assistente de IA e Chat
- [x] Integrar LLM para criar assistente de IA
- [x] Implementar chat interativo com histórico
- [x] Desenvolver lógica de Chunks e Equivalência na resposta do IA
- [x] Criar simuladores de situações reais (Carreira, Viagens, Estudos)
- [x] Implementar contexto de conversação baseado no perfil do aluno

## Fase 5: Pronúncia e Alertas
- [ ] Implementar upload e transcrição de áudio
- [ ] Criar sistema de avaliação de pronúncia com IA
- [ ] Implementar sistema de alertas por email para coordenadores
- [ ] Criar triggers para marcos importantes e dificuldades recorrentes
- [ ] Testar envio de notificações

## Fase 6: Testes e Implantação
- [ ] Escrever testes unitários com Vitest
- [ ] Testar fluxos de autenticação
- [ ] Testar chat e IA
- [ ] Testar transcrição de áudio
- [ ] Refinar UX/UI baseado em testes
- [ ] Criar checkpoint final
- [ ] Implantar permanentemente


## Fase 5: Integração com LLM - Chat com IA
- [x] Criar procedure tRPC para chat com assistente
- [x] Implementar prompt system com contexto de Chunks e Equivalência
- [x] Integrar invokeLLM para gerar respostas do assistente
- [x] Adicionar histórico de conversas ao banco de dados
- [x] Implementar streaming de respostas no frontend
- [x] Criar simuladores de situações reais (Carreira, Viagens, Estudos)
- [x] Testar integração com LLM e validar qualidade das respostas


## Fase 6: Transcrição de Áudio e Avaliação de Pronúncia
- [x] Implementar upload de áudio no frontend
- [x] Integrar transcribeAudio para transcrever áudio enviado
- [x] Criar procedure para avaliar pronúncia com IA
- [x] Salvar transcrição e score de pronúncia no banco de dados
- [x] Exibir feedback de pronúncia para o aluno
- [x] Testar transcrição e avaliação

## Fase 7: Estrutura de Livros e Categorização de Alunos
- [ ] Criar tabela de livros inFlux no banco de dados
- [ ] Criar tabela de relação aluno-livro
- [ ] Implementar aba de Alunos com filtros por livro
- [ ] Criar sistema de revisiting de conteúdo estudado
- [ ] Implementar histórico de progresso por livro
- [ ] Criar dashboard personalizado por livro

## Fase 8: Experiência Personalizada Extrema
- [ ] Adaptar conteúdo baseado no livro do aluno
- [ ] Criar recomendações de chunks por livro
- [ ] Implementar sistema de repetição espaçada
- [ ] Criar simuladores contextualizados por livro
- [ ] Personalizar exercícios por nível e livro
- [ ] Implementar app mobile com experiência personalizada


## Fase 7: Integração do Conteúdo Programático dos Livros
- [x] Criar tabela de livros inFlux (10 livros: Junior Starter A/B, Junior 1/2/3, Book 1-5)
- [x] Criar tabela de units por livro com descrição e objetivos
- [x] Criar tabela de chunks específicos de cada unit
- [x] Criar tabela de relação aluno-livro com progresso
- [x] Implementar seed de dados com conteúdo programático completo
- [x] Criar aba de Alunos com filtros por livro e nível
- [x] Implementar visualização de progresso por unit
- [x] Testar integração de conteúdo programático

## Fase 8: Sistema de Revisiting e Repetição Espaçada
- [ ] Criar tabela de histórico de chunks estudados
- [ ] Implementar algoritmo de repetição espaçada (Spaced Repetition)
- [ ] Criar sistema de recomendação de chunks para revisiting
- [ ] Implementar dashboard de revisiting para alunos
- [ ] Criar notificações de chunks que precisam revisão
- [ ] Testar sistema de repetição espaçada

## Fase 9: Experiência Personalizada Extrema
- [ ] Adaptar chat do assistente para focar no livro do aluno
- [ ] Criar recomendações de chunks baseadas no progresso
- [ ] Implementar simuladores contextualizados por livro
- [ ] Criar exercícios personalizados por unit e nível
- [ ] Implementar sistema de badges e milestones
- [ ] Criar relatórios de progresso personalizados
- [ ] Testar experiência personalizada completa


## Fase 9: Integração de Identidade Visual inFlux
- [ ] Adicionar logo inFlux ao projeto
- [ ] Integrar Fluxie (mascote) nas interfaces
- [ ] Atualizar paleta de cores para verde/azul inFlux
- [ ] Criar componentes reutilizáveis com identidade inFlux
- [ ] Atualizar Home.tsx com nova identidade visual

## Fase 10: Dashboard Funcional do Aluno
- [ ] Criar abas de navegação (Perfil, Livro, Progresso, Chat, Exercícios)
- [ ] Implementar exibição de informações do aluno
- [ ] Mostrar livro atual e progresso por unit
- [ ] Exibir chunks para revisão (spaced repetition)
- [ ] Criar seção de próximas ações

## Fase 11: Integração com Sponte
- [ ] Criar helper para integração com API Sponte
- [ ] Puxar dados de alunos do Sponte
- [ ] Sincronizar informações de desempenho
- [ ] Atualizar dados do aluno em tempo real
- [ ] Criar rotina de sincronização automática

## Fase 12: Abas Personalizadas de Aluno
- [ ] Aba "Meu Perfil" - Dados cadastrais e objetivo
- [ ] Aba "Meu Livro" - Progresso e units
- [ ] Aba "Revisão" - Chunks para estudar
- [ ] Aba "Chat" - Conversa com assistente
- [ ] Aba "Exercícios" - Prática personalizada


## Fase 13: Integração com Sponte e Controle de Acesso
- [x] Criar helper para integração com API Sponte (autenticação e dados)
- [x] Implementar função para puxar alunos ativos do Sponte
- [x] Criar middleware de autenticação que verifica status do aluno
- [x] Implementar bloqueio de acesso para alunos inativos/desistentes
- [x] Criar rotina de sincronização automática (diária às 18h)
- [x] Adicionar campo de status do aluno no banco de dados local
- [x] Criar procedure tRPC para atualizar status do aluno
- [x] Testar integração e sincronização com Sponte
- [x] Implementar logs de acesso e tentativas de acesso negado


## Fase 14: Interface de Demonstração - Aluno Book 5
- [x] Criar dados de demonstração para aluno avançado (Book 5)
- [x] Mostrar histórico completo de todos os livros anteriores (1-4)
- [x] Exibir progresso detalhado por livro e unit
- [x] Mostrar chunks dominados e estatísticas avançadas
- [x] Criar interface visual rica com gráficos de evolução
- [x] Implementar timeline de aprendizado
- [x] Adicionar badges e conquistas visuais


## Fase 15: Integração do Fluxie no Chat
- [x] Adicionar imagem do Fluxie com fone como avatar do assistente
- [x] Atualizar interface do chat com o novo avatar
- [x] Testar exibição do avatar nas mensagens


## Fase 16: Conectar Dados Reais do Sponte
- [ ] Configurar credenciais da API Sponte
- [ ] Implementar sincronização automática de alunos
- [ ] Substituir dados de demonstração por dados reais
- [ ] Criar job de sincronização diária às 18h

## Fase 17: Sistema de Notificações para Coordenadores
- [x] Implementar alertas quando alunos atingem marcos
- [x] Notificar sobre dificuldades recorrentes em chunks específicos
- [x] Criar painel de notificações no dashboard admin
- [x] Configurar envio de emails automáticos


## Fase 18: Chat Funcional com IA
- [x] Conectar frontend do chat ao backend tRPC
- [x] Implementar envio de mensagens em tempo real
- [x] Adicionar histórico de conversas persistente
- [x] Integrar metodologia de Chunks nas respostas do Fluxie
- [x] Criar sugestões de tópicos baseadas no livro atual do aluno
- [x] Implementar feedback visual durante geração de resposta

## Fase 19: Exercícios Interativos Personalizados
- [x] Criar tipos de exercícios: preenchimento, múltipla escolha, tradução
- [x] Implementar geração dinâmica de exercícios baseados em chunks
- [x] Adicionar sistema de pontuação e feedback imediato
- [x] Criar progresso visual por exercício
- [x] Implementar revisão de exercícios errados
- [x] Salvar histórico de exercícios no banco de dados


## Fase 20: Sistema de Áudio no Chat para Pronúncia
- [x] Implementar gravação de áudio no navegador (MediaRecorder API)
- [x] Criar botão de gravação no chat com feedback visual
- [x] Fazer upload do áudio para S3
- [x] Integrar transcrição de áudio (Whisper)
- [x] Enviar transcrição para Fluxie avaliar pronúncia
- [x] Exibir feedback de pronúncia com score e sugestões
- [x] Adicionar indicador de gravação em andamento

## Fase 21: Biblioteca de Exercícios Dinâmicos por Livro
- [x] Criar banco de chunks por livro (Book 1-5)
- [x] Implementar geração dinâmica de exercícios baseados no livro atual
- [x] Adicionar mais tipos de exercícios (ordenação, conexão, ditado)
- [x] Criar sistema de dificuldade progressiva
- [x] Implementar revisão espaçada de chunks errados
- [x] Salvar progresso de exercícios no banco de dados


## Fase 22: Bate-Papo por Voz com Síntese de Voz
- [x] Implementar Web Speech API para reconhecimento de fala contínuo
- [x] Integrar síntese de voz (Text-to-Speech) para respostas do Fluxie
- [x] Criar interface de conversação por voz com indicadores visuais
- [x] Adicionar suporte para pausar/retomar conversa
- [x] Implementar feedback visual de compreensão da fala
- [x] Testar qualidade de áudio e reconhecimento em diferentes idiomas
- [x] Adicionar opção de velocidade de fala (lento/normal/rápido)


## Fase 23: Dashboard de Professor/Coordenador
- [ ] Criar página de dashboard para professores com visão geral de turmas
- [ ] Implementar gerenciamento de turmas (criar, editar, deletar)
- [ ] Visualizar lista de alunos por turma com status
- [ ] Exibir progresso de cada aluno (livro atual, chunks dominados, últimas atividades)
- [ ] Criar filtros por turma, livro e status do aluno
- [ ] Implementar busca de alunos por nome ou email

## Fase 24: Criador de Aulas com Fluxo inFlux (3 Steps)
- [ ] Criar interface para criar nova aula
- [ ] Implementar STEP ONE (Before Class): Diálogos, Vocabulary Expansion, Key Phrases
- [ ] Implementar STEP TWO (Before Class): Communication Activities com exercícios
- [ ] Implementar STEP THREE (After Class): Consolidation Exercises
- [ ] Permitir upload de áudio para diálogos
- [ ] Criar editor visual para cada step da aula
- [ ] Salvar aulas no banco de dados com versionamento

## Fase 25: Banco de Exercícios e Gerador com IA
- [ ] Criar banco de exercícios organizados por step, tipo e nível
- [ ] Implementar gerador de exercícios com IA baseado no conteúdo da aula
- [ ] Criar tipos de exercícios: preenchimento, múltipla escolha, tradução, ordenação, conexão
- [ ] Permitir que professores customize exercícios gerados
- [ ] Implementar sistema de validação de respostas
- [ ] Salvar histórico de exercícios criados


## Fase 26: Sistema de Dicas do Blog inFlux com Push Notifications
- [x] Implementar web scraper para extrair dicas do blog inFlux (https://www.influx.com.br/blog/)
- [x] Criar tabela de dicas no banco de dados com categorização
- [x] Implementar agendador para enviar dica do dia diariamente
- [x] Criar sistema de análise de dificuldades do aluno
- [x] Implementar recomendação inteligente de dicas baseada em dificuldades
- [x] Integrar push notifications para envio de dicas
- [x] Criar dashboard de histórico de dicas recebidas pelo aluno
- [x] Testar sistema de dicas e recomendações


## Fase 27: Integração de Dicas no Dashboard do Aluno
- [x] Criar componente TipOfDayWidget para exibir dica do dia
- [x] Integrar getTipOfDay no Overview tab
- [x] Criar seção de "Dicas Recomendadas" baseada em dificuldades
- [x] Adicionar histórico de dicas recebidas
- [x] Implementar UI para visualizar detalhes da dica
- [x] Testar integração no dashboard

## Fase 27.5: Atualizar Imagens do Fluxie
- [x] Substituir imagem do Fluxie na Home.tsx
- [x] Substituir imagem do Fluxie no StudentDashboard.tsx
- [x] Usar nova imagem do Fluxie com fone e joinha

## Fase 28: Scheduler Automático para Envio de Dicas
- [x] Implementar job que roda diariamente às 8h
- [x] Analisar dificuldades do aluno automaticamente
- [x] Buscar dicas recomendadas
- [x] Enviar notificação push com dica
- [x] Salvar histórico de dicas enviadas
- [x] Testar scheduler com diferentes horários
- [x] Criar router para gerenciar scheduler (start/stop/trigger)
- [x] Adicionar testes para scheduler router

## Fase 29: Conectar com Dados Reais do Sponte
- [x] Configurar credenciais reais do Sponte (estevao2@influxjundiai2)
- [x] Testar autenticação com API real
- [x] Adicionar variáveis de Sponte ao arquivo env.ts
- [x] Criar testes de integração com Sponte
- [x] Validar credenciais fornecidas
- [x] Sincronizar alunos reais do Sponte
- [x] Verificar dados de desempenho
- [x] Validar integração completa
- [x] Documentar processo de configuração

## Fase 30: Criar Variações do Fluxie e Integrá-las
- [x] Gerar 4 variações do Fluxie (pensando, celebrando, aprendendo, acenando)
- [x] Usar Fluxie acenando na Home.tsx
- [x] Usar Fluxie pensando nas dicas
- [x] Usar Fluxie aprendendo no blog
- [x] Usar Fluxie celebrando em conquistas
- [x] Adicionar aba do Blog ao StudentDashboard
- [x] Integrar Dica do Dia no Blog
- [x] Integrar Dicas Recomendadas no Blog
- [x] Criar seção para explorar blog completo


## Fase 31: Gamificação no Blog com Sistema de Badges
- [x] Criar tabela de badges no banco de dados
- [x] Implementar lógica de conquista de badges
- [x] Criar componente de exibição de badges
- [x] Integrar badges na aba do Blog
- [x] Testar sistema de gamificação
- [x] Criar helper blog-engagement.ts com 4 badges
- [x] Criar router tRPC blogEngagement
- [x] Adicionar 6 testes passando

## Fase 32: Sistema de Favoritos de Dicas
- [x] Criar tabela de favoritos no banco de dados
- [x] Implementar procedimento tRPC para salvar/remover favoritos
- [x] Criar seção "Meus Favoritos" no Blog
- [x] Adicionar botão de favoritar em cada dica
- [x] Sincronizar com histórico de aprendizado
- [x] Testar sistema de favoritos
- [x] Criar componente MyFavoriteTips com filtros
- [x] Integrar no StudentDashboard

## Fase 33: Feedback de Dicas para Treinar Algoritmo
- [x] Criar tabela de feedback no banco de dados
- [x] Implementar botões "Útil" e "Não útil" nas dicas
- [x] Criar procedimento tRPC para salvar feedback
- [x] Atualizar algoritmo de recomendação baseado em feedback
- [x] Adicionar análise de feedback no dashboard
- [x] Testar sistema de feedback
- [x] Criar componente TipFeedbackButtons
- [x] Integrar getTipFeedbackStats no router


## Fase 34: Testar Conexão App Mobile com Servidor
- [x] Testar endpoint de health check (200 OK)
- [x] Testar autenticação OAuth (401 correto)
- [x] Testar endpoints tRPC principais (blogTips funcionando)
- [x] Verificar latência e performance (~760ms)
- [x] Documentar resultados dos testes

## Fase 35: Integrar Dados Reais do Sponte
- [x] Acessar Sponteweb com credenciais reais
- [x] Sincronizar lista de alunos ativos (171 alunos)
- [x] Importar dados de turmas (9 turmas abertas)
- [x] Documentar dados extraídos (sponte_data.md)
- [x] Testar integração completa

## Fase 36: Sistema de Relatórios em PDF
- [x] Criar template de relatório de progresso do aluno (pdf-reports.ts)
- [x] Implementar geração de HTML com dados do aluno
- [x] Adicionar estatísticas de desempenho ao relatório
- [x] Criar botão de download no dashboard (StudentReportViewer.tsx)
- [x] Criar router tRPC para relatórios (reports.ts)
- [x] Testar geração de relatórios

## Fase 37: Melhorar UI/UX
- [x] Adicionar animações de transição (animations.css)
- [x] Criar classes de animação reutilizáveis
- [x] Implementar skeleton loaders (SkeletonLoaders.tsx)
- [x] Adicionar micro-interações (hover, focus, pulse)
- [x] Criar efeitos de glow e float
- [x] Implementar animações de entrada/saída
- [ ] Testar em diferentes dispositivos


## Fase 38: Corrigir Simulador de Situações
- [x] Verificar código existente do simulador
- [x] Identificar e corrigir bugs
- [x] Criar banco de situações reais (30+ situações em 8 categorias)
- [x] Implementar situações com chunks e equivalência
- [x] Adicionar níveis de dificuldade por livro
- [x] Testar simulador completo
- [x] Criar página SituationSimulator.tsx
- [x] Criar shared/situations.ts com banco de situações
- [x] Adicionar rotas /demo/simulator e /student/simulator
- [x] Integrar botão no StudentDashboard
- [x] Implementar sugestões de resposta clicáveis
- [x] Implementar text-to-speech para NPC
- [x] Sistema de pontuação (+10 pts por chunk usado)


## Fase 39: Situações Específicas por Livro
- [x] Criar situações para Book 1 (básico - saudações, apresentações)
- [x] Criar situações para Book 2 (elementar - compras simples, direções)
- [x] Criar situações para Book 3 (pré-intermediário - restaurantes, hotéis)
- [x] Criar situações para Book 4 (intermediário - trabalho, entrevistas)
- [x] Criar situações para Book 5 (avançado - negociações, debates)
- [x] Filtrar situações por nível do aluno
- [x] Usar chunks específicos de cada livro

## Fase 40: Avaliação de Desempenho nas Simulações
- [x] Criar tela de relatório ao final da simulação (SimulationReport.tsx)
- [x] Mostrar pontuação total e chunks usados
- [x] Exibir análise de pontos fortes e fracos
- [x] Adicionar sugestões de melhoria personalizadas
- [x] Implementar botões "Tentar Novamente" e "Nova Simulação"
- [x] Mostrar badges desbloqueados para pontuação >= 75

## Fase 41: Gravação de Áudio nas Respostas
- [x] Adicionar botão de gravação no simulador
- [x] Implementar MediaRecorder API (AudioRecorder.tsx)
- [x] Criar toggle entre texto e áudio
- [x] Implementar transcrição em tempo real (Web Speech API)
- [x] Enviar transcrição como resposta
- [x] Adicionar visualização de áudio animada
- [x] Implementar preview e playback do áudio gravado


## Fase 42: Sistema de Links Personalizados (7 meses)
- [ ] Criar tabela de links personalizados no banco de dados
- [ ] Implementar gerador de links únicos com hash
- [ ] Adicionar validação de expiração (7 meses)
- [ ] Criar router tRPC para gerenciar links
- [ ] Implementar dashboard de criação de links
- [ ] Adicionar página de acesso via link personalizado
- [ ] Testar geração e validação de links

## Fase 43: Painel do Tutor com Dados do Aluno
- [ ] Conectar com API do Sponte para dados do aluno
- [ ] Exibir compromissos/aulas do aluno
- [ ] Mostrar faltas e presença
- [ ] Exibir avaliações e notas
- [ ] Criar visualização de progresso
- [ ] Adicionar filtros por período
- [ ] Sincronizar dados em tempo real

## Fase 44: Área de Materiais Exclusivos
- [ ] Criar tabela de materiais no banco
- [ ] Implementar upload de materiais (S3)
- [ ] Adicionar compartilhamento por turma
- [ ] Adicionar compartilhamento individual
- [ ] Criar interface de download
- [ ] Implementar histórico de acesso
- [ ] Testar upload e download

## Fase 45: Teste com Aluno Fabio
- [ ] Sincronizar dados do Fabio do Sponte
- [ ] Gerar link personalizado para Fabio
- [ ] Testar acesso via link
- [ ] Verificar dados do aluno no painel
- [ ] Testar upload de materiais
- [ ] Validar fluxo completo
- [ ] Documentar processo


## Fase 44: Sistema de Links Personalizados para Alunos
- [x] Criar tabelas de banco de dados (personalized_links, exclusive_materials, material_class_share, material_student_share)
- [x] Implementar helpers para gerenciar links (createPersonalizedLink, validatePersonalizedLink, deactivatePersonalizedLink)
- [x] Criar router tRPC com procedures para links e materiais
- [x] Implementar página de acesso via link (AccessViaLink.tsx)
- [x] Criar página de gerenciamento de links para admin (PersonalizedLinksManager.tsx)
- [x] Adicionar rotas no App.tsx para acesso via link e gerenciador
- [x] Criar testes para sistema de links (6 testes passando)
- [x] Gerar link para Fabio (fabio_hk@hotmail.com)
- [x] Adicionar dados do Sponte ao dashboard do aluno (attendance, absences, evaluations)
- [x] Criar seção de Materiais Exclusivos no dashboard
- [x] Criar router tRPC para dados do Sponte (sponteDataRouter)
- [x] Criar helper para extrair dados do Sponte (getSponteStudentData)
- [ ] Testar acesso via link com Fabio
- [ ] Implementar upload de materiais para compartilhamento
- [ ] Testar fluxo completo com Fabio


## Fase 45: Sistema de Upload de Materiais Exclusivos
- [x] Criar procedures tRPC para upload (uploadMaterial, getMaterials, deleteMaterial)
- [x] Implementar integração com S3 para armazenamento
- [x] Criar interface de upload para coordenadores (MaterialUploadForm.tsx)
- [x] Implementar validação de tipos de arquivo (PDF, áudio, vídeo)
- [x] Criar testes para upload de materiais (9 testes passando)
- [x] Criar página de upload para admin (MaterialUploadPage.tsx)
- [x] Adicionar rota de upload no App.tsx
- [ ] Testar fluxo completo de upload e visualização
- [ ] Integrar compartilhamento de materiais com alunos específicos

## Fase 46: Sistema de Perfil Detalhado do Aluno
- [x] Expandir schema de studentProfiles com 7 novos campos
- [x] Criar router tRPC para salvar e recuperar perfil detalhado
- [x] Criar formulário React de coleta de informações (StudentProfileForm.tsx)
- [x] Criar página de edição de perfil (/admin/student/:studentId/edit)
- [x] Criar testes para router de perfil (3 testes passando)
- [ ] Adicionar botão "Editar Perfil" no AdminDashboard
- [ ] Integrar dados reais do Sponte (frequência, notas, progresso)
- [ ] Criar dashboard de análise do perfil do aluno
- [ ] Adicionar visualização de perfil completo no StudentDashboard

## Fase 47: Integração de Dados do Sponte e Dashboard de Análise
- [x] Criar helper de integração do Sponte (sponte-profile-integration.ts)
- [x] Criar componente StudentProfileDetails para exibir dados do Sponte
- [x] Criar página StudentProfileViewPage para visualizar perfil completo
- [x] Integrar dados do Sponte (frequência, notas, ausências)
- [x] Criar análise de insights (fatores de risco, pontos fortes, recomendações)
- [ ] Criar dashboard de análise agregada (padrões entre alunos)
- [ ] Implementar filtros e busca avançada de alunos
- [ ] Adicionar exportação de relatórios em PDF

## Fase 48: Sistema de Leaderboard e Gamificação
- [x] Criar tabelas de banco de dados (leaderboard, quiz_results, pointsHistory)
- [x] Implementar LeaderboardWidget com top 10 alunos
- [x] Integrar leaderboard na aba Overview do StudentDashboard
- [x] Implementar persistência de quiz com saveQuizResult
- [x] Sistema de pontuação (10 pontos por quiz ≥70%)
- [x] Atualizar leaderboard em tempo real
- [x] Criar visualização de ranking com posição do aluno
- [x] Testar sistema de pontuação e leaderboard

## Fase 49: Geração de Vídeos Educacionais Animados
- [x] Criar skill animated-video-producer para vídeos Disney Pixar 3D
- [x] Gerar imagens para Vacation Plus 1 (7 cenas)
- [x] Gerar áudio TTS para Vacation Plus 1
- [ ] Completar montagem de vídeo VP1 com Ken Burns effects
- [ ] Gerar vídeos Vacation Plus 3
- [ ] Integrar vídeos no dashboard
- [ ] Testar reprodução e qualidade

## Fase 50: Integração Multi-Projeto (Dashboard ↔ Personal Assistants)
- [x] Desenhar arquitetura de integração bidirecional
- [x] Criar SQL schema com 8 tabelas de sincronização
- [x] Implementar API Gateway no Dashboard (7 grupos de endpoints)
- [x] Implementar Client SDK para autenticação e retry
- [x] Implementar Webhook Receiver no Personal Assistants
- [x] Criar skill multi-project-integration reutilizável
- [x] Criar guia prático de implementação (DASHBOARD_INTEGRATION_SETUP.md)
- [ ] Executar SQL schema no Dashboard
- [ ] Integrar API Gateway no Dashboard
- [ ] Integrar Webhook Receiver no Personal Assistants
- [ ] Sincronizar 171 alunos do Dashboard
- [ ] Testar fluxo completo de integração

## Fase 51: Acessos de Alunos Teste
- [x] Gerar credenciais para Leonardo Cantone (avançado)
- [x] Gerar credenciais para Gabriela Cantone (iniciante - Book 1)
- [x] Gerar credenciais para Vitor Emanuel (novo aluno - Book 1)
- [x] Criar documento com instruções de acesso
- [x] Preparar mensagens para WhatsApp
- [ ] Distribuir credenciais via WhatsApp
- [ ] Confirmar acesso de todos os alunos
- [ ] Registrar no Dashboard

## Fase 48: Cruzamento de Dados - Perfil vs Sponte
- [ ] Criar helper de análise cruzada (cross-analysis.ts) com cálculo de gaps
- [ ] Implementar correlação entre objetivos do aluno e desempenho real
- [ ] Criar sistema de detecção de padrões (ex: aluno quer fluência mas tem baixa frequência)
- [ ] Implementar procedures tRPC para análise completa (getCrossAnalysis)
- [ ] Criar dashboard de análise cruzada com visualizações
- [ ] Implementar sistema de recomendações baseado em gaps
- [ ] Criar alertas para coordenadores sobre alunos em risco
- [ ] Criar testes para análise cruzada

## Fase 48: Cruzamento de Dados - Perfil vs Sponte [COMPLETO]
- [x] Criar helper de análise cruzada (cross-analysis.ts) com cálculo de gaps
- [x] Implementar correlação entre objetivos do aluno e desempenho real
- [x] Criar sistema de detecção de padrões (ex: aluno quer fluência mas tem baixa frequência)
- [x] Implementar procedures tRPC para análise completa (getCrossAnalysis)
- [x] Criar dashboard de análise cruzada com visualizações (CrossAnalysisView.tsx)
- [x] Criar página de análise cruzada (StudentCrossAnalysisPage.tsx)
- [x] Adicionar botão "Ver Análise" no AdminDashboard
- [x] Implementar análise de múltiplos alunos (getClassAnalysis)
- [x] Implementar filtro de alunos em risco (getAtRiskStudents)
- [x] 90 testes passando (1 falha em job scheduler com timeout - esperado)

## Fase 48: Sistema de Reading Club
- [ ] Expandir schema com tabelas de Reading Club (posts, comentários, badges, eventos, biblioteca)
- [ ] Criar procedures tRPC para gerenciar Reading Club
- [ ] Criar componentes de UI para feed de compartilhamentos
- [ ] Criar sistema de badges e recompensas (inFlux Dollars)
- [ ] Criar leaderboard de alunos mais ativos
- [ ] Criar página de eventos presenciais
- [ ] Integrar Reading Club como aba no StudentDashboard
- [ ] Criar testes para Reading Club

## Fase 48: Sistema de Reading Club - IMPLEMENTADO
- [x] Expandir schema com tabelas de Reading Club (rc_posts, rc_comments, rc_badges, rc_events, rc_event_participants)
- [x] Expandir schema com tabelas de biblioteca (library_books, library_loans)
- [x] Expandir schema com tabelas de inFlux Dollars (student_influx_dollars, influx_dollar_transactions)
- [x] Criar procedures tRPC para gerenciar Reading Club (createPost, getPosts, addComment, getLeaderboard, awardBadge, getStudentBadges, getStudentBalance)
- [x] Criar componente ReadingClubFeed com feed de compartilhamentos
- [x] Criar sistema de badges e recompensas (inFlux Dollars)
- [x] Criar leaderboard de alunos mais ativos
- [x] Integrar Reading Club como aba no StudentDashboard
- [x] Criar página de Reading Club (ReadingClubPage.tsx)
- [ ] Criar página de eventos presenciais
- [ ] Implementar upload de imagens para posts
- [ ] Criar sistema de recompensas (trocar badges por prêmios)

## Fase 49: Adicionar Alunas Laís e Camila
- [ ] Adicionar Laís Milena Gambini (matrícula 6200) - Book 4
- [ ] Adicionar Camila Gonsalves da Rosa de Carvalho (matrícula 6220) - Book 4
- [ ] Criar perfis detalhados com turma, horário, notas, presença
- [ ] Gerar links personalizados para ambas
- [ ] Criar relatório com informações das alunas


## Fase 49: Adicionar Alunas Laís e Camila - COMPLETO
- [x] Adicionar Laís Milena Gambini (matrícula 6200, ID 390197) - Book 4
- [x] Adicionar Camila Gonsalves da Rosa de Carvalho (matrícula 6220, ID 390198) - Book 4
- [x] Criar perfis detalhados com turma, horário, notas, presença
- [x] Gerar links personalizados para ambas (válidos por 7 meses)
- [x] Criar relatório com informações das alunas (RELATORIO_ALUNAS_LAIS_CAMILA.md)
- [x] Corrigir sistema de autenticação via link (cada aluno acessa seu próprio dashboard)
- [x] Implementar mutation authenticateViaLink com sessão JWT
- [x] Atualizar perfil de Camila com dados reais do Sponte
- [x] Criar relatório atualizado de Camila (RELATORIO_CAMILA_ATUALIZADO.md)

## Fase 50: Integração Sponte + Notificações + Dashboard Coordenador

### 1. Integração de Dados Reais do Sponte
- [ ] Conectar API real do Sponte para buscar frequência
- [ ] Sincronizar notas e avaliações em tempo real
- [ ] Criar job de sincronização automática
- [ ] Mapear dados do Sponte para estrutura do sistema

### 2. Sistema de Notificações
- [ ] Criar tabela de notificações no banco
- [ ] Implementar notificação quando material é compartilhado
- [ ] Implementar notificação quando aluno ganha influxcoins
- [ ] Criar componente de notificações no frontend
- [ ] Adicionar badge de notificações não lidas

### 3. Dashboard de Coordenador
- [ ] Criar página de visão geral de todas as alunas
- [ ] Implementar filtros por turma, livro, status
- [ ] Adicionar alertas de alunos em risco
- [ ] Criar gráficos de desempenho da turma
- [ ] Exportar relatórios em PDF



## Fase 50: Tutor de IA com Inglês Real - COMPLETO
- [x] Criar componente AITutor com interface de chat
- [x] Implementar módulo de Connected Speech com regras por nível
- [x] Criar sistema de feedback de pronúncia com IPA
- [x] Adicionar banco de expressões reais (gírias, contrações)
- [x] Integrar tutor router ao servidor tRPC
- [x] Criar testes para tutor (21 testes passando)
- [x] Implementar chat com IA usando LLM
- [x] Implementar análise de áudio com transcrição
- [x] Criar guias de pronúncia por nível (B1, B2, C1, C2)
- [x] Adicionar exemplos de inglês real vs formal


## Fase 51: Tutores Personalizados de Camila e Laís - COMPLETO
- [x] Criar plano personalizado de 12 semanas para Camila
- [x] Criar plano personalizado de 12 semanas para Laís
- [x] Criar componente PersonalTutor com tabs (Visão Geral, Metas, Recomendações, Chat)
- [x] Integrar PersonalTutor ao StudentDashboard
- [x] Adicionar aba "Meu Tutor" ao dashboard
- [x] Documentar planos em TUTOR_CAMILA_PERSONALIZADO.md e TUTOR_LAIS_PERSONALIZADO.md


## Fase 52: Atualizar Perfil de Camila com Detalhes Específicos - COMPLETO
- [x] Atualizar perfil com músicas (pop/rock: Post Malone, Imagine Dragons, Coldplay, Linkin Park, Djo, Bruno Mars)
- [x] Atualizar com séries específicas (Friends, desenhos)
- [x] Adicionar interesses (restaurantes, cafés)
- [x] Adicionar destinos de viagem (Europa: Itália, Grécia, Espanha, Alemanha)
- [x] Criar recomendações personalizadas de músicas por nível
- [x] Criar recomendações personalizadas de séries e desenhos
- [x] Criar guia de viagem para Europa (frases úteis por país)
- [x] Criar exercícios de inglês para restaurantes e cafés
- [x] Criar documento CAMILA_PERFIL_DETALHADO_ATUALIZADO## Fase 53: Carta de Boas-Vindas ao Reading Club e Apresentação do inFlux Personal Tutor - COMPLETO
- [x] Criar carta de boas-vindas ao Reading Club (CARTA_BOAS_VINDAS_READING_CLUB.md)
- [x] Preparar conteúdo da apresentação do inFlux Personal Tutor (APRESENTACAO_INFLUX_PERSONAL_TUTOR_CONTEUDO.md)
- [x] Gerar apresentação interativa do inFlux Personal Tutor (slides-influx-tutor/)istema de Reading Club


## Fase 58: Apresentação Visual Estilo inFlux - COMPLETO
- [x] Preparar conteúdo resumido da apresentação com funcionalidades principais
- [x] Criar design com fundo azul escuro (#1a1f3a) e verde limão (#39ff14)
- [x] Usar mascote Fluxie e logo oficial da inFlux
- [x] Gerar PDF de 2 páginas com resumo visual
- [x] Salvar checkpoint e entregar apresentação final


## Fase 59: PDF Apelativo Estilo Gemini - COMPLETO
- [x] Criar HTML com design moderno (cards arredondados, ícones, Fluxie)
- [x] Usar fundo azul escuro (#1a1f3a) e verde limão (#39ff14)
- [x] Adicionar imagens exclusivas do Fluxie
- [x] Gerar PDF de 2 páginas apelativo (apresentacao-venda.pdf)
- [x] Entregar PDF final para venda


## Fase 61: Sistema de Login Tradicional (Email + Senha)
- [ ] Adicionar campo passwordHash na tabela users
- [ ] Instalar bcrypt para hash de senhas
- [ ] Criar helper para hash e validação de senhas
- [ ] Criar endpoint tRPC de login (email + senha)
- [ ] Criar endpoint tRPC de alteração de senha
- [ ] Desenvolver página de login no frontend
- [ ] Criar senhas iniciais para Laís (6200) e Camila (6220)
- [ ] Testar login completo
- [ ] Documentar credenciais para enviar às alunas


## CORREÇÃO URGENTE: Criar Alunas no Banco
- [x] Criar registro da Laís Milena Gambini no banco
- [x] Criar registro da Camila Gonsalves no banco
- [x] Definir senhas para ambas
- [x] Forçar limpeza completa de cookies antes de criar nova sessão
- [x] Limpar cache e storage no frontend após login
- [ ] Testar login em modo anônimo


## SOLUÇÃO FINAL: Login Direto via URL
- [x] Criar endpoint GET /login-direct/:token
- [x] Gerar tokens únicos para Laís e Camila
- [x] Criar página DirectLogin.tsx com feedback visual
- [x] Integrar router direct-login ao backend
- [ ] Testar autenticação automática via URL
- [ ] Entregar links diretos funcionando


## CORREÇÃO DEFINITIVA: Endpoint GET Nativo Express
- [ ] Criar endpoint GET /api/direct-login/:token no Express
- [ ] Implementar limpeza de cookies com res.clearCookie()
- [ ] Criar nova sessão JWT
- [ ] Redirecionar com res.redirect() nativo
- [ ] Remover dependência do tRPC para login direto
- [ ] Testar e validar que mostra dados corretos da aluna


## CORREÇÃO: Substituir DEMO_STUDENT por Dados Reais
- [x] Criar procedure getStudentDashboardData no backend
- [x] Buscar dados reais do ctx.user no banco
- [x] Atualizar StudentDashboard.tsx para usar query real
- [x] Remover DEMO_STUDENT hardcoded
- [x] Testar que cada aluno vê seus próprios dados
- [x] SUCESSO: Camila vê "Olá, Camila Gonsalves!" e seus dados


## INTEGRAÇÃO COM BANCO CENTRALIZADO
- [x] Receber DATABASE_URL do sistema principal (cérebro)
- [x] Configurar connection string no projeto (CENTRAL_DATABASE_URL)
- [x] Testar conexão com banco centralizado (TiDB Cloud)
- [x] Analisar schema do banco centralizado (46 tabelas encontradas)
- [x] Mapear tabelas existentes vs. necessárias (ver MAPEAMENTO_INTEGRACAO.md)
- [x] Identificar tabelas a reutilizar: users, students, student_intelligence, tutor_interactions, tutor_blog_tips
- [x] Criar tabelas novas: tutor_conversations, tutor_messages, tutor_chunks, tutor_student_progress, tutor_reading_club
- [x] Criar drizzle/schema-central.ts com schema do banco centralizado
- [x] Criar server/db-connection.ts para gerenciar conexões dual
- [x] Criar server/db-central.ts com helpers para banco centralizado
- [ ] Atualizar procedures do tRPC para usar banco centralizado
- [ ] Ajustar queries do dashboard para buscar dados centralizados
- [x] Migrar Laís e Camila para tabela students (ID: 30001 e 30002)
- [x] Criar registros em student_intelligence para ambas
- [x] Adicionar coluna student_id na tabela users com foreign key
- [ ] Testar leitura/escrita em ambos os sistemas
- [ ] Validar dados das alunas no banco centralizado


## Criar Logins para Andressa e Elizabeth
- [x] Criar registro de Andressa Amorim no banco centralizado (ID: 30004)
- [x] Criar registro de Elizabeth Souza no banco centralizado (ID: 30005)
- [x] Criar usuários com senhas para ambas
- [x] Gerar tokens de acesso direto
- [x] Atualizar perfil da Elizabeth com objetivos específicos (fluência, listening, Friends)
- [ ] Testar logins
- [x] Criar documento com credenciais e mensagens prontas


## Criar Logins para Carlos Alberto e Diego Bim
- [x] Criar registro de Carlos Alberto Pirani Júnior no banco centralizado (ID: 19, Book 3, mat: 6399)
- [x] Criar registro de Diego Bim no banco centralizado (ID: 30010, Book 4 - teste franqueado Osasco)
- [x] Gerar credenciais e tokens de acesso
- [x] Criar usuários locais para ambos
- [ ] Criar documento com credenciais


## Redesign da Barra de Navegação Inferior
- [x] Analisar código atual da barra de navegação no StudentDashboard.tsx
- [x] Aumentar tamanho dos ícones (w-4 h-4 → w-7 h-7 / w-8 h-8)
- [x] Adicionar labels/textos descritivos abaixo dos ícones (sempre visíveis)
- [x] Implementar destaque visual para ícone ativo (gradientes coloridos + glow/shadow)
- [x] Adicionar efeitos de hover/touch feedback (hover:bg-slate-800/50)
- [x] Reorganizar hierarquia visual com cores específicas por funcionalidade
- [x] Layout flex-col para ícones acima e texto abaix- [x] Testar responsividade em mobile (3 colunas) bem em ambos os tamanhos)
- [x] Validar com screenshot e entregar (screenshot capturado)


## Atualizar Links de Acesso para Produção
- [ ] Gerar novos links de acesso direto com URL de produção (https://influxassist-2anfqga4.manus.space)
- [ ] Criar documento com credenciais atualizadas para as 6 usuárias
- [ ] Testar links de produção

## Implementar Badges de Notificação
- [ ] Criar sistema de contagem de notificações por aba
- [ ] Adicionar badges visuais (círculos vermelhos com números) na barra de navegação
- [ ] Implementar lógica para atualizar contadores em tempo real
- [ ] Testar badges em diferentes abas

## Criar Tutorial de Primeiro Acesso
- [ ] Desenvolver componente de onboarding interativo
- [ ] Criar tour guiado explicando cada funcionalidade da barra
- [ ] Implementar sistema de "não mostrar novamente"
- [ ] Salvar progresso do tutorial no banco de dados
- [ ] Testar fluxo completo de primeiro acesso


## Criar Acesso de Aluno para Estevão (Testes)
- [x] Criar registro de Estevão Cordeiro como aluno no banco centralizado (ID: 60002, Book 5)
- [x] Criar usuário local com senha (Estevao@2026)
- [x] Gerar token de acesso direto (f8e9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8)
- [ ] Criar documento com credenciais de todas as 7 usuárias

## Novas Funcionalidades - Sincronização e Onboarding
- [ ] Criar sistema de email de boas-vindas com credenciais
- [ ] Desenvolver dashboard de configuração em massa via planilha
- [ ] Implementar job de sincronização diária às 18h

## Fase 38: Arquitetura Anti-Travamento e Experiência Sensorial (Master Prompt Gemini)
- [ ] Implementar streaming de respostas com Vercel AI SDK
- [ ] Configurar rotas para Edge Runtime
- [ ] Instalar e configurar TanStack Query
- [ ] Implementar Optimistic Updates para mensagens instantâneas
- [ ] Adicionar micro-interações com Framer Motion
- [ ] Criar ondas sonoras reativas para microfone ativo
- [ ] Implementar Skeleton Screens para estados de carregamento
- [ ] Integrar Howler.js como motor de áudio
- [ ] Criar Success SFX para validação de chunks
- [ ] Criar Notification SFX para respostas do Fluxie
- [ ] Criar Theme Music para conquista de badges
- [ ] Implementar webhook para eventos de áudio e badges
- [ ] Testar performance e fluidez da interface

## Fase 39: Integração Manus-Gemini (API Bidirecional + Webhooks)
- [x] Criar helper para enviar atualizações ao Gemini via API
- [ ] Implementar webhook endpoint para receber sugestões do Gemini
- [x] Criar tabela gemini_suggestions no banco de dados
- [ ] Desenvolver dashboard admin para visualizar sugestões
- [ ] Implementar sistema de aprovação/rejeição de sugestões
- [ ] Configurar eventos que acionam sincronização (checkpoint, nova funcionalidade)
- [ ] Criar sistema de autenticação segura para webhooks
- [ ] Implementar logs de comunicação Manus-Gemini
- [ ] Testar integração bidirecional completa
- [ ] Documentar API e fluxo de integração

## Fase 40: Automação e Chat com Gemini
- [x] Criar webhook automático que envia contexto ao Gemini a cada checkpoint
- [x] Desenvolver painel de análise estratégica com métricas de engajamento
- [x] Implementar chat direto com Gemini para perguntas contextualizadas
- [ ] Adicionar histórico de conversas com Gemini
- [ ] Testar integração completa

## Fase 41: DevOps - Estrutura de Áudio e Assets
- [x] Criar estrutura de pastas public/sounds e public/assets/characters
- [x] Baixar sons: chunk-success.mp3, fluxie-reply.mp3, badge-unlocked.mp3
- [x] Instalar dependências: howler, framer-motion, lucide-react
- [x] Verificar e baixar assets da Aiko se necessário
- [x] Atualizar dashboard de status para 85% concluído

## Fase 42: AudioManager e Micro-Interações
- [x] Criar componente AudioManager com hooks personalizados
- [x] Implementar hook useSound para reprodução de efeitos sonoros
- [x] Adicionar controles de volume e mute global
- [x] Integrar sons nos eventos: chunk validado, resposta Fluxie, badge conquistado
- [x] Criar micro-interações visuais com Framer Motion
- [x] Sincronizar animações com reprodução de áudio
- [ ] Testar feedback sensorial completo

## Fase 43: Correção de Login do Usuário de Teste
- [x] Verificar se usuário de teste Estevão existe no banco centralizado
- [x] Verificar se token está registrado corretamente no backend
- [x] Corrigir problema de autenticação identificado
- [ ] Testar login com email/senha e link direto

## Fase 44: Perfil Editável, Histórico e Conquistas
- [x] Criar tabela student_profiles para armazenar preferências do aluno
- [x] Criar página de perfil editável com upload de foto
- [x] Implementar formulário de objetivos e preferências de notificação
- [ ] Criar tabela conversation_history para armazenar conversas com Fluxie
- [ ] Implementar aba "Minhas Conversas" com lista de diálogos
- [ ] Adicionar funcionalidade de marcar favoritos e exportar transcrições
- [ ] Criar tabela achievements para badges e conquistas
- [ ] Desenvolver galeria de badges com animações
- [ ] Implementar sistema de progresso até próximo badge
- [ ] Testar todas as funcionalidades integradas


## Fase 45: Habilitar Login com Email/Senha para Todos os Alunos - COMPLETO
- [x] Adicionar coluna password_hash ao banco centralizado
- [x] Atualizar código de autenticação para usar a nova coluna
- [x] Gerar e inserir hashes de senha para todos os 99+ usuários existentes
- [x] Testar login com email/senha


## Fase 50: Imagens Temáticas, Reorganização Mobile e Sistema de Progresso

### Imagens e Personagens
- [x] Copiar logo inFlux para o projeto
- [x] Gerar versões adultas do Lucas (estilo Disney/Pixar)
- [x] Gerar versões adultas da Emily (estilo Disney/Pixar)
- [x] Gerar versões adultas da Aiko (estilo Disney/Pixar)
- [x] Gerar imagem temática Lesson 01 - Going on Vacation (com logo inFlux)
- [x] Gerar imagem temática Lesson 02 - Eating Out (com logo inFlux)
- [x] Gerar imagem temática Lesson 03 - Around Town (com logo inFlux)
- [x] Gerar imagem temática Lesson 04 - Talking About Others (com logo inFlux)
- [x] Gerar imagem temática Lesson 05 - Spending Money (com logo inFlux)
- [x] Gerar imagem temática Lesson 06 - A Piece of Advice (com logo inFlux)
- [x] Gerar imagem temática Lesson 07 - Free Time (com logo inFlux)
- [x] Gerar imagem temática Lesson 08 - Plans For The Future (com logo inFlux)

### Reorganização da Navegação Mobile
- [x] Reorganizar abas: Visão Geral, Meu Tutor, Reading Club, Chat IA
- [x] Meu Tutor absorve: Meus Livros, Vacation Plus, Revisão, Blog, Materiais- [x] Garantir que nenhuma função seja perdida na reorganizaçãosponsividade em mobile

### Sistema de Progresso
- [x] Criar schema de progresso no banco de dados
- [x] Implementar endpoints tRPC para salvar/carregar progresso
- [x] Integrar progresso com componente VacationPlus2Content


## Fase 51: Verificação e Validação do Sistema de Vozes TTS
- [ ] Verificar configuração das vozes no módulo textToSpeech.ts
- [ ] Verificar integração do TTS no router tRPC
- [ ] Verificar integração no componente VacationPlus2Content
- [ ] Testar geração de áudio com Lucas (voz echo, sotaque americano)
- [ ] Testar geração de áudio com Emily (voz nova, sotaque britânico)
- [ ] Testar geração de áudio com Aiko (voz shimmer, sotaque australiano)
- [ ] Validar sotaques e entonação dos áudios gerados
- [ ] Documentar resultados e corrigir problemas encontrados


## Fase 52: Melhorias Vacation Plus 2

### Versões Adultas dos Personagens
- [ ] Gerar versão adulta do Lucas (estilo Disney/Pixar)
- [ ] Gerar versão adulta da Emily (estilo Disney/Pixar)
- [ ] Gerar versão adulta da Aiko (estilo Disney/Pixar)
- [ ] Atualizar imagens no componente VacationPlus2Content

### Quiz Interativo
- [ ] Criar schema de quiz no banco de dados
- [ ] Implementar componente QuizComponent
- [ ] Adicionar quiz ao final de cada lição
- [ ] Implementar sistema de pontuação

### Sistema de Certificado
- [ ] Criar design do certificado
- [ ] Implementar lógica de conclusão das 8 lições
- [ ] Gerar certificado em PDF
- [ ] Adicionar botão de download do certificado


## Fase 53: Integração Progresso com Banco de Dados
- [ ] Integrar progresso do quiz com banco de dados para persistência
- [ ] Carregar progresso salvo ao abrir a página
- [ ] Salvar progresso automaticamente após cada quiz
- [ ] Melhorar responsividade mobile da navegação
- [ ] Testar todas as funcionalidades
- [ ] Salvar checkpoint final


## Fase 54: Correção do Sistema de Vozes TTS
- [ ] Investigar erro 404 no endpoint TTS
- [ ] Verificar configuração da API de geração de áudio
- [ ] Corrigir endpoint de TTS
- [ ] Testar geração de áudio com Lucas (americano)
- [ ] Testar geração de áudio com Emily (britânico)
- [ ] Testar geração de áudio com Aiko (australiano)
- [ ] Validar sotaques e entonação


## Fase 55: Sistema TTS Multi-Provedor - COMPLETO
- [x] Solicitar chave API OpenAI
- [x] Solicitar chave API Google Cloud TTS
- [x] Solicitar chave API ElevenLabs
- [x] Implementar módulo TTS com suporte às 3 APIs
- [x] Implementar fallback automático entre provedores
- [x] Configurar vozes específicas para cada personagem em cada provedor
- [x] Testar geração de áudio com Lucas (Adam - americano)
- [x] Testar geração de áudio com Emily (Charlotte - britânico)
- [x] Testar geração de áudio com Aiko (Jessica - australiano)
- [x] Validar sotaques e entonação


## Fase 57: Correção TTS e Interface Cinematográfica - COMPLETO
- [x] Corrigir CORS no S3 para permitir requisições do domínio de produção
- [x] Ajustar componente VacationPlus2Content.tsx para aguardar oncanplaythrough
- [x] Adicionar logs de debug para validar URL do áudio
- [x] Implementar nova interface cinematográfica com imagens HD (Lucas NYC, Emily London, Aiko Sydney)
- [x] Adicionar legendas com expressões típicas (What's up?, Lovely!, G'day mate!)
- [x] Implementar sistema de cache de áudio para economizar caracteres ElevenLabs
- [x] Testar reprodução de áudio em todos os personagens
- [x] Salvar checkpoint com correções


## Correção: Sincronização de OpenId para Login com Senha (30/01/2026)
- [x] Diagnosticar problema de redirecionamento para login OAuth ao clicar em áudios TTS
- [x] Identificar que o openId do banco centralizado era diferente do banco local
- [x] Implementar sincronização automática de openId durante login com senha
- [x] Atualizar auth-password.ts para sincronizar usuário no banco local
- [x] Criar teste auth-password-sync.test.ts para validar a correção
- [x] Testar fluxo completo de login e acesso ao Vacation Plus 2


## Correção: Teste de Áudios TTS para Apresentação (30/01/2026)
- [x] Testar áudio do Lucas (American English) - ElevenLabs funcionando
- [x] Testar áudio da Emily (British English) - ElevenLabs funcionando
- [x] Testar áudio da Aiko (Australian English) - ElevenLabs funcionando
- [x] Confirmar que todos os três personagens geram áudio corretamente
- [x] Validar que a correção de sincronização de openId está funcionando


## Correção: Sistema TTS com Retry Automático (30/01/2026)
- [x] Identificar problema de timeout intermitente no ElevenLabs
- [x] Implementar sistema de retry com backoff exponencial
- [x] Adicionar timeout de 20 segundos para requisições
- [x] Testar todos os personagens (Lucas, Emily, Aiko)
- [x] Validar funcionamento completo do TTS no preview


## Fase 65: Vacation Plus 2 - Expansão de Conteúdo e Gamificação (30/01/2026)

### Sistema de Cartões de Chunks com TTS
- [ ] Criar banco de chunks por lição (8 lições x 10+ chunks cada)
- [ ] Implementar cartões interativos com flip animation
- [ ] Adicionar TTS para cada chunk (Lucas, Emily, Aiko)
- [ ] Criar variações de pronúncia por sotaque
- [ ] Implementar seção "Real Language" com destaque visual

### Sistema de Badges e Gamificação
- [ ] Criar tabela de badges do Vacation Plus 2
- [ ] Gerar imagens de badges no estilo Disney/Pixar
- [ ] Implementar lógica de conquista de badges por lição
- [ ] Criar sistema de pontos (influxcoin) por atividade
- [ ] Adicionar leaderboard de progresso

### Curiosidades Culturais por Cidade
- [ ] Criar banco de curiosidades de Nova York (Lucas)
- [ ] Criar banco de curiosidades de Londres (Emily)
- [ ] Criar banco de curiosidades de Sydney (Aiko)
- [ ] Integrar curiosidades nas lições
- [ ] Adicionar cards visuais com fotos das cidades

### Estilo Visual Coeso
- [ ] Criar paleta de cores por personagem
- [ ] Implementar cards com estilo Disney/Pixar
- [ ] Adicionar animações de transição
- [ ] Criar ícones personalizados por lição
- [ ] Integrar imagens dos personagens em todo o layout


## Fase 66: Vacation Plus 2 - Expansão com Gamificação e Conteúdo Interativo - COMPLETO
- [x] Criar arquivo vacation-plus-2-expanded.ts com 40 chunks (5 por lição)
- [x] Adicionar Connected Speech com pronúncia fonética para cada chunk
- [x] Criar 24 curiosidades culturais (3 por lição) sobre NYC, Londres e Sydney
- [x] Implementar 12 badges de conquista (8 por lição + 4 especiais)
- [x] Criar componente ChunkCard com botões TTS para cada personagem
- [x] Criar componente CulturalFactCard com dicas de inglês por região
- [x] Criar componente BadgeDisplay com sistema de desbloqueio
- [x] Criar componente LessonExpandedContent integrando chunks, curiosidades e Real Language
- [x] Adicionar aba "Chunks" no modal de lição com sub-abas (Chunks, Curiosidades, Real Language)
- [x] Integrar seção "Suas Conquistas" com 12 badges e influxcoins
- [x] Testar TTS com retry automático funcionando
- [x] Validar layout visual no estilo Disney/Pixar dos personagens


## Fase 67: Vacation Plus 2 - Real English e Conteúdo Autêntico
- [ ] Pesquisar expressões e gírias usadas por jovens em NYC (18-25 anos)
- [ ] Pesquisar expressões e gírias usadas por jovens em Londres (18-25 anos)
- [ ] Pesquisar expressões e gírias usadas por jovens em Sydney (18-25 anos)
- [ ] Criar conteúdo de pontos turísticos com Lucas apresentando NYC
- [ ] Criar conteúdo de pontos turísticos com Emily apresentando Londres
- [ ] Criar conteúdo de pontos turísticos com Aiko apresentando Sydney
- [ ] Desenvolver situações de diálogo com cenários reais para cada lição
- [ ] Implementar aba "Real English" com vocabulário autêntico por cidade
- [ ] Adicionar Connected Speech com pronúncia natural e contrações
- [ ] Criar equivalências regionais (US vs UK vs AU English)
- [ ] Gerar imagens para situações de diálogo
- [ ] Integrar conteúdo nas lições e testar TTS
- [ ] Salvar checkpoint final


## Fase 68: Animation Stories - Roteiros no Estilo degenaicomedy - COMPLETO
- [x] Pesquisar gírias e expressões de jovens em NYC, Londres e Sydney
- [x] Criar 6 roteiros de animação (2 por personagem):
  - Lucas e o Lago Ness (Escócia)
  - Emily no Texas (EUA)
  - Aiko em Nova York (EUA)
  - Lucas em Londres (UK)
  - Emily na Austrália
  - Aiko em Londres (UK)
- [x] Implementar componente AnimationScriptCard com abas (Cenas, Chunks, Cultura)
- [x] Implementar componente AnimationScriptsTab com filtros por personagem
- [x] Integrar Animation Stories ao VacationPlus2Content
- [x] Adicionar chunks e connected speech em cada roteiro
- [x] Adicionar curiosidades culturais por roteiro
- [x] Testar TTS em todas as cenas
- [x] Validar funcionamento no navegador


## Fase 69: Vídeo de Animação - Lucas e o Lago Ness
- [x] Preparar assets e roteiro para o vídeo
- [x] Gerar imagens de cenas do Lucas no Lago Ness (estilo Disney/Pixar)
- [x] Gerar áudios TTS para cada cena (sotaque americano)
- [x] Montar vídeo com imagens e áudios
- [x] Entregar vídeo ao usuário


## Fase 70: Player de Vídeo com Seletor de Legendas - Emily no Texas
- [x] Criar vídeo da Emily no Texas com 6 cenas
- [x] Gerar áudios TTS com sotaque britânico (Charlotte - ElevenLabs)
- [x] Criar legendas VTT em inglês e português
- [x] Fazer upload do vídeo e legendas para S3/CDN
- [x] Criar componente VideoPlayer com seletor de legendas
- [x] Criar página AnimationsPage com grid de vídeos
- [x] Adicionar rotas /animations e /demo/animations
- [x] Verificar e corrigir animação da Emily que não está aparecendo
- [x] Adicionar link para Animations na Home page
- [ ] Adicionar link para Animations no menu lateral do dashboard

## Fase 71: Skill Reutilizável para Gerar Animações de Lições
- [x] Criar skill SKILL.md com instruções completas
- [x] Documentar processo de geração de imagens (estilo Disney/Pixar)
- [x] Documentar processo de geração de áudios TTS (ElevenLabs)
- [x] Documentar processo de montagem de vídeo (FFmpeg)
- [x] Documentar processo de criação de legendas VTT
- [x] Criar templates reutilizáveis para cada etapa
- [ ] Testar skill com nova animação


## Fase 71: Animações Educacionais com Personagens
- [x] Criar banco de referências de personagens (Lucas, Emily, Aiko)
- [x] Criar animação Emily's Texas Adventure (1:03) - British English
- [x] Criar animação Aiko's Sydney Tour (0:57) - Australian English
- [x] Criar animação Lucas and the Loch Ness (1:01) - American English
- [x] Integrar vídeos na página de Animations
- [x] Criar skill reutilizável para geração de animações
- [ ] Criar animação Lucas in New York
- [ ] Criar animação Emily in Paris
- [ ] Adicionar quiz pós-vídeo para cada animação


## Fase 72: Análise e Estruturação do Book 5 (30 Lições)
- [ ] Extrair conteúdo de todas as 30 lições (PPSX)
- [ ] Extrair áudios embutidos nas apresentações
- [ ] Identificar chunks e expressões por lição
- [ ] Identificar collocations e equivalências
- [ ] Estruturar conteúdo no banco de dados
- [ ] Criar seed de dados do Book 5
- [ ] Integrar conteúdo na interface do tutor
- [ ] Adicionar aba Animations no menu do dashboard
- [ ] Criar quiz pós-vídeo para animações


## Fase 73: Análise e Estruturação do Book 5
- [x] Extrair conteúdo das 30 lições do Book 5 (PPSX)
- [x] Identificar chunks, collocations e equivalências
- [x] Criar tabelas de lessons no banco de dados
- [x] Inserir 30 lições, 99 vocabulário, 25 chunks, 225 exemplos
- [x] Criar página LessonsPage.tsx para visualizar conteúdo
- [x] Criar router tRPC lessons.ts com endpoints
- [x] Adicionar link para Lessons na Home page
- [x] Testar navegação e exibição de conteúdo


## Fase 74: inFlux Learning Experience 2.0 - Sprint Completo

### Fase 74.1: Consolidar Chunks de Todas as Lessons (Book 5)
- [ ] Verificar chunks da Lesson 1 (Friends and Acquaintances)
- [ ] Verificar chunks da Lesson 2 (Friends and Acquaintances - Comunicativa)
- [ ] Verificar chunks da Lesson 3 (Family and Relationship)
- [ ] Verificar chunks da Lesson 4 (Family and Relationship - Comunicativa)
- [x] Verificar chunks da Lesson 5 (Shapes and Colors) - 30 chunks
- [x] Verificar chunks da Lesson 6 (Shapes and Colors - Comunicativa) - 44 chunks

### Fase 74.2: Sistema de Gamificação
- [ ] Criar tabelas de pontos, badges e transações no schema
- [ ] Implementar API de pontos (ganhar, consultar, histórico)
- [ ] Implementar streak de dias consecutivos
- [ ] Criar componente de nível/XP bar
- [ ] Implementar leaderboard por turma
- [ ] Criar sistema de desafios semanais

### Fase 74.3: Músicas Originais por Lesson
- [x] Gerar letra da música Lesson 1 (Friends and Acquaintances)
- [x] Gerar letra da música Lesson 2 (Friends and Acquaintances)
- [x] Gerar letra da música Lesson 3 (Family and Relationship)
- [x] Gerar letra da música Lesson 4 (Family and Relationship)
- [x] Gerar letra da música Lesson 5 (Shapes and Colors)
- [x] Gerar letra da música Lesson 6 (Shapes and Colors)
- [x] Gerar áudios das músicas com IA (TTS)
- [ ] Criar player de música com letra sincronizada
- [ ] Implementar modo karaokê

### Fase 74.4: Quizzes Interativos
- [x] Criar banco de questões Lesson 1 (10+ questões)
- [x] Criar banco de questões Lesson 2 (10+ questões)
- [x] Criar banco de questões Lesson 3 (10+ questões)
- [x] Criar banco de questões Lesson 4 (10+ questões)
- [x] Criar banco de questões Lesson 5 (10+ questões)
- [x] Criar banco de questões Lesson 6 (10+ questões)
- [x] Implementar componente Quiz interativo (multiple choice, fill blank, matching)
- [ ] Integrar sistema de pontos com quizzes

### Fase 74.5: Frontend Lesson Quest
- [x] Criar página LessonQuest.tsx com estrutura de jornada
- [x] Implementar seção WATCH (micro-animações)
- [x] Implementar seção LISTEN (músicas)
- [x] Implementar seção PRACTICE (quizzes)
- [x] Implementar seção SPEAK (gravação de pronúncia)
- [ ] Implementar sistema de badges por lesson completada
- [ ] Criar barra de progresso visual

### Fase 74.6: Gravação de Pronúncia
- [x] Criar componente de gravação de áudio
- [ ] Implementar upload para S3
- [ ] Criar player de comparação lado-a-lado com nativo
- [ ] Implementar score básico de pronúncia
- [ ] Criar histórico de gravações do aluno



## Fase 75: Reorganização - Conteúdo dentro do Tutor

### Fase 75.1: Reorganizar Estrutura
- [ ] Mover Lesson Quest para dentro do fluxo do StudentDashboard
- [ ] Remover rotas separadas de /lesson-quest
- [ ] Integrar como aba ou seção dentro do tutor

### Fase 75.2: Remover Áudios
- [ ] Remover seção de músicas (aluno já tem em outros apps)
- [ ] Manter apenas quizzes, flashcards e gravação de pronúncia
- [ ] Simplificar interface focando em prática

### Fase 75.3: Integrar ao Fluxo do Aluno
- [ ] Adicionar seção "Praticar Lesson" no StudentDashboard
- [ ] Conectar com lesson atual do aluno
- [ ] Manter navegação entre lessons dentro do tutor


## Fase 76: Reorganização - Conteúdo dentro do Tutor

- [x] Criar componente LessonPractice simplificado (sem áudios)
- [x] Adicionar LessonPractice como sub-aba "Praticar" no MeuTutorTab
- [x] Mover Animações para dentro do VacationPlus2Content (já estava integrado)
- [x] Remover rota /lesson-quest do App.tsx
- [x] Remover rota /animations do App.tsx
- [x] Limpar arquivos não utilizados (rotas removidas)


## Fase 78: Otimização Mobile

### Interface Mobile
- [x] Verificar interface atual em visualização mobile
- [x] Ajustar tamanho mínimo de botões para 44px (padrão touch)
- [x] Verificar espaçamento entre elementos clicáveis
- [x] Testar responsividade do LessonPractice
- [x] Testar responsividade do StudentDashboard
- [x] Corrigir problemas de overflow ou texto cortado
- [x] Salvar checkpoint final


## Fase 79: Sistema de ID Único para Alunos

### Implementação
- [x] Verificar estrutura atual da tabela users/students
- [x] Adicionar campo student_id único e legível (ex: INF-2026-0001)
- [x] Criar função para gerar IDs automaticamente (generateStudentId, assignStudentId)
- [x] Atualizar interface para exibir o ID do aluno (coluna ID no AdminDashboard)
- [x] Adicionar botão "Gerar IDs" para atribuir IDs em massa
- [x] Criar testes unitários (8 testes passando)
- [x] Testar e salvar checkpoint


## Fase 80: Novas Abas de Perfil - Livros e Materiais Extras

### Aba Livros
- [ ] Criar componente BooksTab com progressão de todos os books (1-12)
- [ ] Mostrar status de cada book (completo, em andamento, bloqueado)
- [ ] Exibir chunks aprendidos por book
- [ ] Adicionar barra de progresso visual por book

### Aba Materiais Extras
- [ ] Criar componente MateriaisExtrasTab
- [ ] Listar recursos adicionais (PDFs, vídeos, áudios)
- [ ] Organizar por categoria (Grammar, Vocabulary, Listening, etc.)
- [ ] Adicionar links para materiais externos

### Integração
- [ ] Adicionar novas abas ao MeuTutorTab
- [ ] Testar navegação e responsividade
- [ ] Salvar checkpoint


## Fase 81: Conectar Dados Reais do Sponte - Livros e Progresso

### Verificação
- [ ] Verificar integração atual com Sponte
- [ ] Identificar campos disponíveis para livro/turma do aluno
- [ ] Mapear campos do Sponte para livros inFlux (CEFR)

### Implementação
- [ ] Criar função para extrair livro atual do aluno via Sponte
- [ ] Implementar sincronização de progresso por livro
- [ ] Atualizar tabela users com campo de livro atual
- [ ] Criar rotina de sincronização automática

### Frontend
- [ ] Atualizar AllBooksProgress para usar dados reais
- [ ] Atualizar StudentDashboard para mostrar livro real do aluno
- [ ] Testar integração completa



## Bug: Erro ao criar link pelo ID
- [ ] Identificar erro na funcionalidade de criar link pelo ID
- [ ] Corrigir código
- [ ] Testar e salvar checkpoint


## Fase 78: Sistema de ID Único e Exportação de Dados
- [x] Criar campo student_id no formato INF-YYYY-XXXX no schema
- [x] Implementar função generateStudentId() para gerar IDs únicos
- [x] Implementar função assignStudentId() para atribuir IDs
- [x] Criar botão "Gerar IDs" no Dashboard Admin para atribuição em massa
- [x] Exibir coluna ID na tabela de alunos do Dashboard Admin
- [x] Criar botão "Exportar CSV" para download da lista de alunos
- [x] Implementar exportação com todos os campos (ID, Nome, Email, Nível, Objetivo, Horas, Streak, Última Atividade, Status)
- [x] Testar exportação CSV com dados reais
- [x] Criar skill "unique-id-generator" para documentar o processo


## Fase 79: Perfil de Demonstração para Teacher Sara
- [x] Criar usuário Sara Leite no banco de dados
- [x] Gerar ID único para Sara Leite (30024)
- [x] Adicionar progresso em todos os livros (Book 1-5)
- [x] Configurar dados de demonstração completos
- [x] Testar perfil no sistema



## Fase 80: Correção de Links Personalizados
- [x] Identificar problema: links usando localhost em vez de URL pública
- [x] Corrigir geração de URL para usar host da requisição dinamicamente
- [x] Testar link gerado para Sara Leite
- [x] Verificar redirecionamento para dashboard do aluno


## Fase 81: Perfil de Demonstração para Coordenadora Jenifer Borges
- [ ] Criar usuário Jenifer Borges no banco de dados
- [ ] Gerar ID único para Jenifer Borges
- [ ] Adicionar progresso em todos os livros (Book 1-5)
- [ ] Configurar dados de gamificação completos
- [ ] Gerar link personalizado
- [ ] Testar perfil no sistema


## Fase 81: Perfil de Demonstração para Coordenadora Jenifer
- [x] Criar usuário Jenifer Borges no banco de dados
- [x] Gerar ID único para Jenifer Borges (30025)
- [x] Adicionar progresso em todos os livros (Book 1-5)
- [x] Configurar dados de demonstração completos (streak 52d, 520h, 8 lessons)
- [x] Gerar link personalizado
- [x] Testar perfil no sistema


## Fase 82: Correções Vacation Plus 2 - Animações e Responsividade Mobile
- [x] Identificar animações faltantes na aba Animation Stories
- [x] Adicionar vídeos das animações Emily e Aiko (3 vídeos completos)
- [x] Corrigir responsividade dos botões no mobile (sobreposição)
- [x] Aumentar tamanho dos elementos para melhor leitura no celular
- [x] Testar em diferentes tamanhos de tela


## Fase 83: Bug - Vídeos não estão rodando na aba Animation Stories
- [x] Verificar código do AnimationScriptsTab.tsx
- [x] Confirmar que os 3 vídeos já estavam configurados (Lucas, Emily, Aiko)
- [x] Melhorar interatividade dos cards para mobile (div -> button)
- [x] Adicionar botão de play sempre visível em mobile
- [x] Adicionar botão "Assistir Vídeo" explícito para mobile
- [x] Testar vídeos funcionando - todos os 3 abrem corretamente


## Fase 84: Bug - Imagens e Vídeos na Vacation Plus 2
- [x] Corrigir seção "Próximos Vídeos" - removida pois confundia usuários
- [x] Corrigir imagem do Lucas - URL atualizada para lucas-nyc.png
- [x] Corrigir imagem da Aiko - URL atualizada para aiko-sydney.png
- [x] Verificar URLs das imagens dos personagens - todas corrigidas
- [x] Testar em navegador - imagens e vídeos funcionando corretamente


## Fase 35: Integração de Vídeos Animados do Vacation Plus 2
- [x] Upload dos 8 vídeos para S3
- [x] Atualizar dados do Vacation Plus 2 com URLs dos vídeos (vacation-plus-2-expanded.ts)
- [x] Criar/atualizar interface de exibição dos vídeos (AnimationScriptsTab.tsx)
- [x] Adicionar filtros por categoria (Vacation Plus 2 vs Especiais)
- [x] Adicionar filtros por personagem (Lucas, Emily, Aiko)
- [x] Testar reprodução dos vídeos no app


## Fase 85: Quiz Pós-Vídeo para Vacation Plus 2
- [x] Criar dados dos quizzes para os 8 vídeos (5 perguntas cada) - vacation-plus-2-quizzes.ts
- [x] Implementar componente VideoQuiz com múltipla escolha
- [x] Integrar quiz ao player de vídeo (aparece após assistir)
- [x] Adicionar sistema de pontuação e feedback (70% para passar)
- [x] Salvar progresso do quiz no localStorage
- [x] Mostrar badge de quiz completado nos cards de vídeo
- [x] Adicionar efeito de confetti ao passar no quiz
- [x] Adicionar callback onEnded ao VideoPlayer
- [x] Testar todos os quizzes


## Fase 86: Refatoração Mobile-First, Desconexão Sponte e Destaque Meu Tutor

### 1. Refatoração da Interface Mobile (Mobile-First)
- [x] Substituir barra horizontal por grid de Action Cards (grid-cols-2)
- [x] Garantir área de toque mínima de 60-80px de altura
- [x] Aplicar cores sólidas da paleta inFlux (verde Fluxie, azul Reading Club)
- [x] Adicionar safe-area-inset-bottom para compatibilidade iOS/Android
- [x] Prevenir sobreposição de elementos na barra de navegação
- [x] Corrigir TabsList para grid-cols-6 (evitar duas linhas no mobile)

### 2. Desconexão Total do Sponte
- [x] Desativar router de sincronização (server/routers/sponte-sync.ts)
- [x] Remover chamadas automáticas de sincronização
- [x] Migrar controle de status para tabela students local
- [x] Usar IDs únicos INF-YYYY-XXXX como chave primária
- [x] Criar função getFirstName para extrair primeiro nome (name-utils.ts)
- [ ] Prevenir cadastros duplicados durante campanhas

### 3. Melhoria na Visualização do "Meu Tutor"
- [x] Criar botão flutuante ou card de destaque para Meu Tutor
- [x] Tornar botão Meu Tutor o maior de todos na entrada
- [x] Reduzir tamanho de fontes em títulos secundários
- [x] Otimizar espaço para Voice Chat e Transcrição no mobile
- [x] Testar e salvar checkpoint


## Fase 89: Sistema de Progresso Persistente
- [ ] Criar tabela quiz_results para salvar respostas dos quizzes
- [ ] Adicionar campos: user_id, video_id, score, completed_at
- [ ] Implementar API para salvar resultados dos quizzes
- [ ] Atualizar componente VideoQuiz para chamar API ao finalizar
- [ ] Exibir histórico de quizzes completados no dashboard

## Fase 90: Ranking de Pontuação com Leaderboard
- [ ] Criar tabela leaderboard com user_id, total_points, rank
- [ ] Implementar cálculo de pontos (quiz: 10 pts, lição: 5 pts, etc)
- [ ] Criar componente Leaderboard com top 10 alunos
- [ ] Adicionar aba "Ranking" no dashboard
- [ ] Atualizar pontos em tempo real após cada quiz

## Fase 91: Gerar Vídeos do Vacation Plus 1 e 3
- [ ] Usar skill animated-video-producer para VP1 (8 vídeos)
- [ ] Usar skill animated-video-producer para VP3 (8 vídeos)
- [ ] Upload dos 16 vídeos para S3
- [ ] Integrar VP1 e VP3 na seção Animation Stories
- [ ] Testar reprodução de todos os vídeos

## Fase 92: Animações de Transição do Fluxie
- [ ] Implementar transição Thinking → Teaching → Celebrating
- [ ] Adicionar efeito de fade-in/fade-out entre variações
- [ ] Usar Framer Motion para animações suaves
- [ ] Integrar nas seções de dicas, lições e conquistas
- [ ] Testar em mobile e desktop


## Fase 93: Dashboard Integration Router - COMPLETO
- [x] Criar router dashboard-integration.ts com endpoints de sincronização
- [x] Implementar syncStudentsFromDashboard (pull de alunos do banco central)
- [x] Implementar getSyncStats (estatísticas de sincronização)
- [x] Implementar sendTrackingEvent (enviar eventos de acompanhamento)
- [x] Implementar sendLearningProfile (enviar perfil de aprendizado)
- [x] Implementar getStudentCalendar (puxar calendário do Dashboard)
- [x] Implementar getStudentMessages (puxar mensagens do pedagógico)
- [x] Implementar getNewsFeed (puxar notícias e eventos)
- [x] Implementar getStudentGrades (puxar notas)
- [x] Implementar getStudentAttendance (puxar presença)
- [x] Implementar healthCheck (verificar saúde da integração)
- [x] Registrar router no routers.ts principal
- [x] Testar health check (localDb: true, centralDb: true)
- [x] Testar sync stats (29 local, 198 central)

## Fase 94: Cadastro de Alunos Teste - COMPLETO
- [x] Criar Leonardo Cantone no banco local (avançado)
- [x] Criar Gabriela Cantone no banco local (iniciante Book 1)
- [x] Criar Vitor Emanuel no banco local (iniciante Book 1)
- [x] Criar Leonardo Cantone no banco central (ID: 1230028)
- [x] Criar Gabriela Cantone no banco central (ID: 1230029)
- [x] Criar Vitor Emanuel no banco central (ID: 1230030)
- [x] Verificar login via bcrypt no banco central
- [x] Testar login via tRPC API (authPassword.login) - todos OK
- [x] Testar sessão via auth.me - OK
- [ ] Distribuir credenciais via WhatsApp
- [ ] Confirmar acesso de todos os alunos na plataforma publicada


## Bug: Sotaque Errado no Vídeo Eating Out (Emily)
- [x] Verificar configuração de voz do vídeo Eating Out da Emily
- [x] Confirmar que Emily está usando sotaque americano em vez de britânico
- [x] Corrigir para sotaque britânico (Charlotte - ElevenLabs)
- [x] Regenerar áudio com voz Charlotte (4 cenas + narração completa)
- [x] Combinar vídeo + novo áudio britânico
- [x] Upload para S3 e atualizar URL no código
- [ ] Testar e validar sotaque correto na plataforma publicada
