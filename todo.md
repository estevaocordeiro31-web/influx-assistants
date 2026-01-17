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
