# inFlux Personal Tutor - Documentação Completa do Projeto

**Data:** 27 de Janeiro de 2026  
**Versão:** 1.0  
**Autor:** Manus AI  
**Status:** Em Desenvolvimento Ativo

---

## 📋 Sumário Executivo

O **inFlux Personal Tutor** é um assistente pessoal de inteligência artificial desenvolvido para complementar o ensino de inglês da rede inFlux. O sistema atua como um tutor personalizado que acompanha cada aluno individualmente, oferecendo prática adicional, feedback em tempo real e conteúdo adaptado ao nível e objetivos específicos de cada estudante.

O projeto faz parte do ecossistema estratégico **inFlux IAfirst**, que visa centralizar todas as informações dos alunos em um sistema principal para criar um acompanhamento pedagógico personalizado em nível avançado. O Personal Tutor se integra a este sistema para acessar dados de desempenho, progresso e necessidades individuais de cada aluno.

**Objetivo Principal:** Criar uma experiência de aprendizado extremamente personalizada que complementa o material didático existente, focando em prática adicional, revisão espaçada e desenvolvimento de habilidades específicas identificadas como áreas de melhoria para cada aluno.

---

## 🎯 Visão Estratégica do Projeto

### Missão

Transformar o aprendizado de inglês em uma experiência individual, adaptativa e engajadora, onde cada aluno tem um tutor de IA disponível 24/7 para praticar conversação, receber feedback personalizado e revisar conteúdos de forma inteligente.

### Princípios Fundamentais

O desenvolvimento do inFlux Personal Tutor segue quatro princípios fundamentais que guiam todas as decisões de design e implementação:

**Complementaridade:** O sistema não substitui o material didático ou o professor, mas complementa o processo de ensino existente. O tutor trabalha em sinergia com as aulas presenciais, reforçando o conteúdo programático e oferecendo prática adicional nos tópicos que o aluno está estudando atualmente.

**Personalização Cirúrgica:** Cada aluno possui um perfil detalhado que inclui tempo de estudo, objetivos de fluência, áreas de desconforto, preferências de consumo do idioma e histórico de desempenho. O sistema utiliza essas informações para adaptar exercícios, conversas e recomendações de forma cirúrgica às necessidades individuais.

**Inglês Real:** O foco pedagógico está no inglês autêntico, incluindo connected speech, pronúncia natural e expressões idiomáticas usadas em contextos reais. O tutor evita ensinar inglês artificial ou excessivamente formal, priorizando a comunicação efetiva em situações cotidianas.

**Revisitação Inteligente:** O sistema implementa repetição espaçada para garantir que o aluno revise conteúdos já estudados no momento ideal para consolidação da memória de longo prazo. O tutor nunca introduz estruturas gramaticais ou vocabulário mais avançados do que o proposto no material didático atual do aluno.

### Diferencial Competitivo

O inFlux Personal Tutor se diferencia de outras soluções de ensino de idiomas por três características principais:

**Integração com Dados Reais:** Ao contrário de aplicativos genéricos, o tutor tem acesso ao histórico completo do aluno no sistema inFlux, incluindo desempenho em aulas, exercícios realizados, dificuldades identificadas pelos professores e progresso no material didático. Essa integração permite personalização baseada em dados reais, não em algoritmos genéricos.

**Metodologia Pedagógica Alinhada:** O sistema segue a metodologia de ensino da inFlux, incluindo o fluxo de aulas em três etapas (Before Class, During Class, After Class) e a abordagem de Chunks e Equivalência. O tutor reforça os mesmos conceitos ensinados em sala de aula, criando consistência pedagógica.

**Experiência Humanizada:** O mascote Fluxie atua como a "personalidade" do tutor, criando uma conexão emocional com o aluno. O sistema utiliza síntese de voz, reconhecimento de fala e feedback encorajador para simular uma conversa natural com um tutor humano.

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

O inFlux Personal Tutor utiliza uma arquitetura moderna e escalável baseada em tecnologias web de ponta:

**Frontend:** React 19 com Tailwind CSS 4 para interface responsiva e componentes reutilizáveis. A aplicação utiliza Wouter para roteamento client-side e shadcn/ui para componentes de interface consistentes e acessíveis.

**Backend:** Express 4 com tRPC 11 para comunicação type-safe entre frontend e backend. O tRPC elimina a necessidade de definir contratos REST manualmente, garantindo que tipos TypeScript fluam automaticamente do servidor para o cliente.

**Banco de Dados:** MySQL/TiDB hospedado na TiDB Cloud, com Drizzle ORM para queries type-safe e migrações versionadas. O banco centralizado armazena dados de 171 alunos ativos, incluindo perfis, progresso, conversas, exercícios e histórico de aprendizado.

**Inteligência Artificial:** Integração com modelos de linguagem via API Manus Forge, incluindo chat completion para conversação, transcrição de áudio via Whisper e síntese de voz para respostas faladas. O sistema utiliza prompts especializados que incorporam a metodologia pedagógica da inFlux.

**Autenticação:** Sistema híbrido que suporta OAuth via Manus e login tradicional com email e senha. Todos os 99 alunos ativos possuem credenciais cadastradas com senhas no padrão `PrimeiroNome@2026`.

**Armazenamento:** Amazon S3 para arquivos de áudio, imagens e documentos gerados. O sistema utiliza URLs presignadas para acesso seguro e upload direto do navegador.

### Estrutura de Dados

O banco de dados centralizado possui as seguintes tabelas principais:

**users:** Armazena informações de autenticação e perfil básico de cada usuário (aluno ou administrador). Campos incluem id, name, email, password_hash, role (admin/user) e timestamps.

**students:** Contém dados pedagógicos detalhados de cada aluno, incluindo matrícula, nível atual, livro em estudo, objetivo de fluência, áreas de desconforto, tempo de estudo semanal e status (ativo/inativo/desistente/trancado). Esta tabela está vinculada à tabela users via campo user_id.

**books:** Catálogo dos 10 livros do material didático inFlux (Junior Starter A/B, Junior 1/2/3, Book 1-5), com descrição, nível CEFR e número de units.

**units:** Unidades de cada livro, com título, objetivos de aprendizado e chunks principais. Cada unit está vinculada a um book_id.

**chunks:** Expressões, frases e estruturas gramaticais organizadas por unit. Cada chunk possui tradução, contexto de uso, nível de dificuldade e exemplos de aplicação.

**conversations:** Histórico completo de conversas entre aluno e Fluxie, incluindo mensagens, timestamps e contexto da conversa (livro, unit, objetivo).

**exercises:** Exercícios realizados pelos alunos, com tipo (múltipla escolha, preenchimento, tradução), respostas, score e feedback do sistema.

**blog_tips:** Dicas extraídas do blog da inFlux, categorizadas por tema (gramática, vocabulário, pronúncia, cultura). O sistema utiliza web scraping para manter a base atualizada.

**tip_history:** Histórico de dicas enviadas a cada aluno, incluindo data, método de envio (push notification, dashboard) e feedback (útil/não útil).

**badges:** Conquistas gamificadas que o aluno pode desbloquear ao atingir marcos de aprendizado (primeira conversa, 10 exercícios, 30 dias de streak).

### Fluxo de Dados

O sistema segue um fluxo de dados unidirecional que garante consistência e rastreabilidade:

**Sincronização Diária:** Um job automático roda às 18h para sincronizar dados do banco centralizado, criando usuários para novos alunos e atualizando status dos existentes. O job gera senhas automaticamente e pode enviar emails de boas-vindas.

**Autenticação:** O aluno faz login via email e senha. O sistema valida credenciais no banco centralizado, gera token JWT e cria sessão com cookie httpOnly. Todas as requisições subsequentes incluem o token para autenticação.

**Carregamento de Perfil:** Ao acessar o dashboard, o frontend busca dados do aluno via tRPC (student.getProfile), incluindo livro atual, progresso por unit, chunks para revisão e histórico de atividades.

**Conversação com Fluxie:** O aluno envia mensagem de texto ou áudio. O sistema transcreve áudio (se aplicável), busca contexto do aluno (livro, unit, dificuldades), constrói prompt especializado e invoca LLM. A resposta é salva no histórico e exibida com síntese de voz.

**Exercícios Personalizados:** O sistema gera exercícios baseados nos chunks da unit atual do aluno. Ao submeter resposta, o backend valida, calcula score, salva no histórico e retorna feedback detalhado.

**Dicas do Blog:** O sistema analisa dificuldades do aluno (chunks com baixo desempenho) e recomenda dicas do blog relacionadas. As dicas podem ser enviadas via push notification ou exibidas no dashboard.

---

## 🚀 Funcionalidades Implementadas

### Para Alunos

**Dashboard Personalizado:** Interface com abas de navegação (Overview, Chat IA, Exercícios, Blog, Materiais, Reading Club, Progresso) que exibe informações específicas do livro atual, progresso por unit, chunks para revisão e próximas atividades.

**Chat com Fluxie:** Conversação interativa com o mascote Fluxie, que atua como tutor pessoal. O chat suporta texto e voz, com transcrição automática de áudio e síntese de voz nas respostas. O Fluxie utiliza a metodologia de Chunks e Equivalência, oferecendo feedback em tempo real e sugerindo expressões naturais.

**Exercícios Interativos:** Biblioteca de exercícios personalizados gerados dinamicamente com base nos chunks da unit atual. Tipos incluem múltipla escolha, preenchimento de lacunas, tradução, ordenação de palavras e conexão de frases. O sistema oferece feedback imediato e salva histórico de desempenho.

**Avaliação de Pronúncia:** O aluno pode gravar áudio no chat e receber feedback sobre pronúncia. O sistema transcreve o áudio, compara com o esperado e fornece score com sugestões de melhoria.

**Dicas do Blog:** Seção dedicada com dica do dia, dicas recomendadas baseadas em dificuldades identificadas e histórico de dicas recebidas. O aluno pode favoritar dicas e fornecer feedback (útil/não útil) para treinar o algoritmo de recomendação.

**Sistema de Badges:** Gamificação com conquistas desbloqueáveis (Primeira Conversa, Explorador do Blog, Leitor Assíduo, Maratonista). As badges aparecem no perfil do aluno e incentivam engajamento contínuo.

**Reading Club:** Aba dedicada ao projeto de clube de leitura, onde alunos podem acessar materiais exclusivos, participar de discussões e compartilhar progresso de leitura.

**Tutorial Interativo:** Modal de onboarding com 6 passos que aparece no primeiro acesso, explicando cada funcionalidade do sistema. O tutorial pode ser reaberto via botão no header.

**Badges de Notificação:** Círculos vermelhos animados nas abas indicando conteúdo novo ou pendente (mensagens não lidas, exercícios pendentes, novas dicas). Os badges desaparecem ao clicar na aba correspondente.

### Para Administradores

**Dashboard Administrativo:** Visão geral com métricas de alunos ativos, em risco, total de horas de estudo e distribuição por nível. Interface com busca, filtros e ações em massa.

**Gerenciamento de Alunos:** Lista completa de alunos com informações de perfil, progresso, última atividade e status. Administradores podem editar dados, visualizar histórico detalhado e exportar relatórios em PDF.

**Configuração em Massa:** Upload de planilha CSV para atualizar nível, livro ou objetivo de múltiplos alunos simultaneamente. O sistema valida dados, aplica alterações e gera relatório de sucesso/erros.

**Envio de Emails de Boas-Vindas:** Interface para enviar emails automáticos com credenciais de acesso para novos alunos. O sistema utiliza template personalizável e registra histórico de envios.

**Gerenciamento de Materiais:** Criação e organização de materiais exclusivos (PDFs, vídeos, links) que ficam disponíveis na aba Materiais do aluno. Suporta categorização por livro e nível.

**Controle de Sincronização:** Dashboard para gerenciar o job de sincronização diária, incluindo botões para iniciar, parar e executar manualmente. Exibe estatísticas de última execução (novos usuários criados, erros).

**Sistema de Notificações:** Alertas automáticos quando alunos atingem marcos importantes ou apresentam dificuldades recorrentes. Administradores recebem notificações via sistema interno e email.

---

## 🔗 Integração com Ecossistema inFlux IAfirst

O inFlux Personal Tutor é um componente fundamental do ecossistema **inFlux IAfirst**, que representa a estratégia de digitalização e personalização do ensino na rede inFlux. O ecossistema é composto por três pilares principais:

### Sistema Central de Gestão (Cérebro da Operação)

O banco de dados centralizado armazena todas as informações dos alunos, incluindo dados cadastrais, histórico de matrículas, desempenho em aulas, exercícios realizados, dificuldades identificadas e interações com o Personal Tutor. Este sistema central atua como fonte única de verdade, garantindo consistência de dados entre todos os componentes do ecossistema.

Atualmente, o sistema está em fase de migração do Sponte (sistema de gestão escolar) para o banco centralizado. Durante a transição, o Personal Tutor acessa dados de ambas as fontes, priorizando o banco centralizado quando disponível.

### inFlux Personal Tutor (Experiência do Aluno)

O Personal Tutor consome dados do sistema central para oferecer experiência personalizada. A integração ocorre em tempo real via tRPC, permitindo que o tutor acesse perfil do aluno, progresso no material didático, histórico de dificuldades e recomendações pedagógicas geradas pelo sistema central.

O tutor também alimenta o sistema central com dados de interação, incluindo conversas com Fluxie, exercícios realizados, tempo de estudo e áreas de melhoria identificadas. Esses dados são utilizados para refinar o perfil do aluno e gerar insights para professores e coordenadores.

### Painel Pedagógico IA (Visão do Professor)

Em desenvolvimento, este componente permitirá que professores e coordenadores visualizem dados agregados de desempenho dos alunos, identifiquem padrões de dificuldade em turmas específicas e recebam recomendações de intervenções pedagógicas baseadas em IA.

O painel consumirá dados do sistema central e do Personal Tutor, oferecendo dashboards interativos com métricas de engajamento, progresso por unit, chunks com maior taxa de erro e alunos que precisam de atenção especial.

### Fluxo de Dados no Ecossistema

**Entrada de Dados:** Alunos interagem com o Personal Tutor (conversas, exercícios, avaliações de pronúncia). Professores registram observações e avaliações no sistema de gestão. O sistema Sponte sincroniza dados de matrícula e frequência.

**Processamento Central:** O sistema central agrega dados de todas as fontes, aplica algoritmos de análise de desempenho, identifica padrões de dificuldade e gera recomendações personalizadas para cada aluno.

**Saída de Dados:** O Personal Tutor recebe recomendações de chunks para revisão, exercícios personalizados e dicas do blog. O Painel Pedagógico exibe insights para professores. Relatórios automatizados são enviados para coordenadores.

---

## 📊 Status Atual do Projeto

### Versão Atual: 1.0 (27/01/2026)

O projeto está em **desenvolvimento ativo** com funcionalidades principais implementadas e em uso por 99 alunos ativos. A versão atual (checkpoint 8b5b3f17) inclui:

**Autenticação e Gestão de Usuários:**
- Sistema de login com email e senha funcionando para 99 alunos
- Senhas cadastradas no padrão `PrimeiroNome@2026`
- Sincronização automática diária às 18h que cria usuários para novos alunos
- Email de boas-vindas automático com credenciais

**Dashboard do Aluno:**
- Interface com 7 abas (Overview, Chat IA, Exercícios, Blog, Materiais, Reading Club, Progresso)
- Tutorial interativo de 6 passos no primeiro acesso
- Badges de notificação nas abas indicando conteúdo novo
- Exibição de progresso por livro e unit

**Chat com Fluxie:**
- Conversação por texto e voz
- Transcrição automática de áudio via Whisper
- Síntese de voz nas respostas do Fluxie
- Avaliação de pronúncia com feedback detalhado
- Histórico de conversas persistente

**Exercícios Personalizados:**
- 5 tipos de exercícios (múltipla escolha, preenchimento, tradução, ordenação, conexão)
- Geração dinâmica baseada nos chunks da unit atual
- Feedback imediato com explicações
- Histórico de desempenho

**Dicas do Blog:**
- Integração com blog da inFlux (web scraping)
- Dica do dia exibida no dashboard
- Recomendações personalizadas baseadas em dificuldades
- Sistema de favoritos e feedback (útil/não útil)
- 4 badges gamificadas (Primeira Leitura, Explorador, Leitor Assíduo, Maratonista)

**Dashboard Administrativo:**
- Visualização de 99 alunos ativos
- Busca e filtros por nível, livro e status
- Edição de perfil do aluno
- Configuração em massa via upload de CSV
- Envio de emails de boas-vindas

**Infraestrutura:**
- Banco centralizado com 171 alunos cadastrados (99 ativos)
- Job de sincronização diária funcionando
- Sistema de armazenamento S3 para áudios e documentos
- Logs de acesso e auditoria

### Métricas de Uso

**Alunos Cadastrados:** 99 alunos ativos com acesso ao sistema  
**Distribuição por Livro:** Junior Starter (12), Junior 1-3 (28), Book 1-5 (59)  
**Taxa de Conclusão do Tutorial:** Não medida ainda (funcionalidade recém-implementada)  
**Conversas com Fluxie:** Não medida ainda (aguardando uso real)  
**Exercícios Realizados:** Não medida ainda (aguardando uso real)

### Desafios Técnicos Resolvidos

**Conexão ao Banco Centralizado:** Inicialmente, o sistema de login estava conectado ao banco local (vazio) em vez do banco centralizado. Corrigido modificando endpoints para usar `CENTRAL_DATABASE_URL`.

**Verificação de Status Inexistente:** O código verificava campo `status` na tabela `users`, mas esse campo não existe no banco centralizado (existe apenas em `students`). Removida verificação para permitir login.

**Sincronização de Senhas:** Implementado sistema de hash bcrypt para armazenar senhas de forma segura. Criado script de sincronização que gera senhas automaticamente para alunos sem credenciais.

**Integração com Sponte:** API do Sponte apresenta instabilidade. Implementado fallback que utiliza dados do banco centralizado quando API não responde.

---

## 🛣️ Roadmap e Próximos Passos

### Curto Prazo (1-2 semanas)

**Recuperação de Senha:** Implementar fluxo "Esqueci minha senha" com envio de email contendo link temporário de reset. Aumenta autonomia dos alunos e reduz demandas de suporte.

**Dashboard de Métricas de Sincronização:** Criar painel administrativo mostrando estatísticas de sincronização diária (novos usuários criados, falhas, taxa de sucesso). Facilita monitoramento e troubleshooting.

**Página Admin de Gestão de Emails:** Interface para visualizar histórico de emails enviados, reenviar credenciais e personalizar template de boas-vindas. Melhora controle sobre comunicação com alunos.

**Testes de Usabilidade:** Realizar sessões de teste com 5-10 alunos para identificar pontos de fricção na interface e coletar feedback sobre funcionalidades. Priorizar melhorias baseadas em dados reais de uso.

### Médio Prazo (1-2 meses)

**Sistema de Repetição Espaçada:** Implementar algoritmo que calcula momento ideal para revisão de cada chunk baseado em desempenho do aluno. Cria notificações automáticas quando chunks precisam ser revisitados.

**Painel Pedagógico para Professores:** Desenvolver dashboard que permite professores visualizarem progresso de suas turmas, identificarem alunos com dificuldades e receberem recomendações de intervenções.

**Relatórios Automatizados:** Gerar relatórios semanais em PDF com resumo de atividades do aluno (tempo de estudo, conversas, exercícios, progresso) e enviar por email para aluno e responsáveis.

**Integração Completa com Sponte:** Finalizar migração de dados do Sponte para banco centralizado. Criar rotina de sincronização bidirecional que atualiza ambos os sistemas em tempo real.

**Aplicativo Mobile:** Desenvolver versão nativa para iOS e Android com funcionalidades offline, notificações push e integração com calendário do aluno.

### Longo Prazo (3-6 meses)

**Criador de Aulas com IA:** Ferramenta para professores criarem aulas seguindo o fluxo inFlux (Before Class, During Class, After Class) com auxílio de IA para gerar exercícios, diálogos e atividades de comunicação.

**Sistema de Turmas Virtuais:** Permitir que alunos formem grupos de estudo, participem de desafios colaborativos e vejam ranking de desempenho da turma. Aumenta engajamento através de gamificação social.

**Análise Preditiva de Desempenho:** Utilizar machine learning para identificar alunos em risco de desistência baseado em padrões de engajamento. Gerar alertas proativos para coordenadores intervirem antes da evasão.

**Integração com Plataformas Externas:** Conectar com YouTube, Spotify e Netflix para recomendar conteúdo autêntico em inglês baseado nos interesses do aluno. Rastrear consumo de mídia em inglês e sugerir atividades relacionadas.

**Certificações e Badges Oficiais:** Criar sistema de certificação que valida competências específicas (pronúncia, conversação, escrita) com badges digitais compartilháveis em redes sociais e LinkedIn.

---

## 🤝 Colaboração com Gemini

O projeto está sendo desenvolvido em colaboração entre **Manus AI** (responsável pela implementação técnica) e **Gemini** (responsável por melhorias de UX, conteúdo pedagógico e estratégia).

### Áreas de Foco para Gemini

**Experiência do Usuário:** Revisar fluxos de navegação, identificar pontos de fricção e sugerir melhorias de interface. Especial atenção para primeira experiência do aluno (onboarding) e engajamento contínuo.

**Conteúdo Pedagógico:** Refinar prompts do Fluxie para garantir alinhamento com metodologia inFlux. Criar banco de exemplos de conversas ideais e feedback pedagógico efetivo.

**Estratégia de Gamificação:** Propor sistema de badges, conquistas e recompensas que incentive uso contínuo sem criar dependência de recompensas extrínsecas. Balancear motivação intrínseca e extrínseca.

**Análise de Dados:** Definir métricas-chave de sucesso (KPIs) para medir efetividade do tutor. Propor dashboards e relatórios que traduzam dados em insights acionáveis para professores e coordenadores.

**Roadmap Estratégico:** Priorizar funcionalidades baseado em impacto pedagógico e viabilidade técnica. Alinhar desenvolvimento com objetivos de negócio da inFlux (retenção de alunos, satisfação, resultados de aprendizado).

### Informações Técnicas para Gemini

**Acesso ao Sistema:**
- URL de Produção: https://influxassist-2anfqga4.manus.space
- Login Admin: direcaojundiairetiro@influx.com.br / Estevao@2026
- Login Aluno Teste: estevao.teste.aluno@influx.com.br / Estevao@2026

**Repositório e Documentação:**
- Código-fonte: /home/ubuntu/influx-assistants
- Documentação técnica: README.md no diretório raiz
- TODO list: todo.md (lista de funcionalidades planejadas)
- Credenciais: CREDENCIAIS_TODOS_ALUNOS.md (99 alunos ativos)

**Stack Técnico:**
- Frontend: React 19 + Tailwind CSS 4 + shadcn/ui
- Backend: Express 4 + tRPC 11
- Banco: MySQL/TiDB com Drizzle ORM
- IA: API Manus Forge (LLM, Whisper, TTS)

**Limitações Conhecidas:**
- API do Sponte instável (implementado fallback)
- Métricas de uso ainda não coletadas (aguardando uso real)
- Sistema de notificações push não implementado (apenas dashboard)
- Aplicativo mobile não desenvolvido (apenas web responsivo)

---

## 📞 Contatos e Suporte

**Coordenação Pedagógica:**  
Estevão Cordeiro - direcaojundiairetiro@influx.com.br

**Suporte Técnico:**  
Manus AI - Documentação disponível em https://help.manus.im

**Feedback e Sugestões:**  
Enviar via dashboard administrativo ou diretamente para coordenação

---

## 📝 Histórico de Versões

**v1.0 (27/01/2026):**
- Sistema de autenticação completo com 99 alunos
- Dashboard do aluno com 7 abas funcionais
- Chat com Fluxie (texto e voz)
- Exercícios personalizados
- Dicas do blog com gamificação
- Dashboard administrativo
- Sincronização automática diária
- Tutorial interativo de onboarding

**v0.9 (20/01/2026):**
- Integração com banco centralizado
- Sistema de login por email e senha
- Dashboard básico do aluno
- Chat com Fluxie (apenas texto)

**v0.5 (10/01/2026):**
- Protótipo inicial com dados mockados
- Interface de conversação básica
- Exercícios estáticos

---

**Documento gerado por Manus AI em 27 de Janeiro de 2026**  
**Última atualização: 27/01/2026 às 23:50 GMT-3**
