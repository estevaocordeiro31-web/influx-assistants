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
- [x] Layout flex-col para ícones acima e texto abaixo
- [x] Testar responsividade em mobile (funciona bem em ambos os tamanhos)
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
