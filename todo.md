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
