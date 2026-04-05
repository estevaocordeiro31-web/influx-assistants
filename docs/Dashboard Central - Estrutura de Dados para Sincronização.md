# Dashboard Central - Estrutura de Dados para Sincronização

## URL
https://influxmind.manus.space

## Dados dos Alunos

### Campos Visíveis na Tabela
- **Nome**: Nome completo do aluno
- **Nível**: (Mostrado como N/A na tabela, mas deve estar no banco)
- **Objetivo**: (Mostrado como N/A na tabela, mas deve estar no banco)
- **Status**: Ativo/Inativo
- **Telefone**: Formato variado (com/sem formatação)
- **Situação Financeira**: Quitado/Pendente/Outros

### Dados Pessoais (Vistos no Detalhe)
- **Email**: naiaragiovana6@gmail.com
- **CPF**: 51126266825
- **RG**: N/A
- **Gênero**: N/A
- **Data de Nascimento**: 16/12/2003
- **Estado Civil**: N/A

### Dados de Endereço
- **Endereço**: N/A
- **Cidade**: N/A
- **Estado**: N/A
- **CEP**: N/A

### Dados de Curso
- **Curso Atual**: N/A
- **Nível**: N/A
- **Turma**: N/A
- **Data de Matrícula**: N/A
- **Data de Início**: N/A

### Dados Financeiros
- **Mensalidade**: R$ 0,00
- **Parcelas em Aberto**: 0
- **Total Devido**: R$ 0,00

## Total de Alunos
- **Dashboard Central**: 50 de 50 alunos (mostra 50 por página)
- **inFlux**: 226 alunos (banco local)

## Discrepância
- Dashboard Central: ~50 alunos
- inFlux: 226 alunos
- **Diferença**: 176 alunos a mais no inFlux

## Campos para Sincronização Bidirecional

### Do Dashboard Central → inFlux
1. Nome
2. Email
3. CPF
4. Telefone
5. Status (Ativo/Inativo)
6. Nível (quando disponível)
7. Objetivo (quando disponível)
8. Data de Nascimento
9. Situação Financeira

### Do inFlux → Dashboard Central
1. Progresso do aluno (horas estudadas)
2. Badges conquistadas
3. Exercícios completos
4. Nível atual
5. Objetivo atual
6. Status de atividade

## Próximos Passos
1. Verificar se há API disponível no Dashboard Central
2. Implementar sincronização bidirecional
3. Criar webhooks para atualizações em tempo real
4. Testar sincronização end-to-end
