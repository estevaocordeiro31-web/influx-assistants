# inFlux Personal Tutor - Design System

## Identidade Visual inFlux

A plataforma adota a identidade visual oficial da inFlux com o mascote Fluxie como elemento central. O design reflete a metodologia pedagógica inFlux com cores que transmitem confiança, aprendizado e progresso.

**Mascote:** Fluxie - personagem verde amigável que acompanha o aluno em toda a jornada de aprendizado.

## Paleta de Cores (inFlux)

### Cores Primárias
- **Verde inFlux:** `#7FCC39` - Cor principal da marca, energia e progresso (usada em Fluxie)
- **Azul Escuro inFlux:** `#001F4D` - Confiança, profissionalismo e estabilidade (logo inFlux)
- **Laranja Destaque:** `#FF8C00` - Chamadas à ação e elementos interativos
- **Verde Sucesso:** `#22C55E` - Conquistas e marcos atingidos

### Cores Neutras
- **Branco:** `#FFFFFF` - Fundo principal
- **Cinza Claro:** `#F3F4F6` - Fundos secundários
- **Cinza Médio:** `#9CA3AF` - Textos secundários
- **Cinza Escuro:** `#374151` - Textos principais
- **Preto:** `#111827` - Textos de alto contraste

### Cores de Estado
- **Vermelho Erro:** `#EF4444` - Erros e alertas
- **Amarelo Aviso:** `#FBBF24` - Avisos
- **Azul Info:** `#3B82F6` - Informações

## Tipografia

- **Font Family:** Inter, Segoe UI, Roboto (sans-serif)
- **Tamanho Base:** 16px
- **Heading 1:** 32px, Weight 700
- **Heading 2:** 24px, Weight 600
- **Heading 3:** 20px, Weight 600
- **Body:** 16px, Weight 400
- **Small:** 14px, Weight 400
- **Caption:** 12px, Weight 400

## Componentes Principais

### Botões
- **Primary:** Verde inFlux com texto branco
- **Secondary:** Azul escuro com texto branco
- **Success:** Verde sucesso com texto branco
- **Danger:** Vermelho erro com texto branco

### Cards
- Fundo branco com sombra suave (`box-shadow: 0 1px 3px rgba(0,0,0,0.1)`)
- Borda arredondada: 8px
- Padding: 16px
- Borda superior em verde inFlux (3px) para destaque

### Formulários
- Inputs com borda cinza claro e foco em verde inFlux
- Labels em cinza escuro
- Placeholder em cinza médio

## Espaçamento

- **XS:** 4px
- **SM:** 8px
- **MD:** 16px
- **LG:** 24px
- **XL:** 32px
- **2XL:** 48px

## Layouts

### Dashboard do Aluno
- Header com logo inFlux e informações do perfil
- Abas de navegação: Perfil, Livro, Progresso, Chat, Exercícios
- Fluxie como mascote na sidebar ou em seções de boas-vindas
- Progresso visual com barras em verde inFlux

### Chat com Assistente
- Mensagens do aluno à direita (azul escuro)
- Mensagens do assistente à esquerda com ícone de Fluxie
- Sugestões de chunks em cards com borda verde

### Página de Exercícios
- Grid de cards com exercícios
- Progresso visual em barras verde inFlux
- Feedback imediato com ícone de sucesso ou erro
- Fluxie oferecendo dicas

## Ícones

Utilizar Lucide React para ícones consistentes e acessíveis.

## Acessibilidade

- Contraste mínimo de 4.5:1 para textos
- Foco visível em todos os elementos interativos
- Suporte a navegação por teclado
- ARIA labels em componentes complexos
- Fluxie com descrição alt em todas as imagens

## Elementos Visuais Especiais

### Fluxie (Mascote)
- Usado em momentos de celebração de conquistas
- Oferece dicas e motivação
- Presente em seções de boas-vindas
- Tamanho responsivo conforme contexto

### Logo inFlux
- Exibida no header de todas as páginas
- Versão horizontal no header
- Versão ícone na sidebar
- Sempre clicável para voltar à home

### Progresso Visual
- Barras de progresso em verde inFlux
- Números e percentuais claros
- Animações suaves ao atingir marcos

