# inFlux Personal Assistants - TODO

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
