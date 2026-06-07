<!-- PR pro influx-tutor. O CI (typecheck + testes) precisa estar verde pra mesclar. -->

## O que muda
<!-- Descreva em 1-3 linhas o que esse PR entrega (ex: "Atividade de eventos: Halloween"). -->

## Tipo
- [ ] Nova atividade / evento (`/events/*`)
- [ ] Feature do app do aluno (logado)
- [ ] Correção de bug
- [ ] Infra / processo

## Banco de dados
- [ ] Não mexe no schema
- [ ] Mexe no schema **e** gerei a migration (`npx drizzle-kit generate`) e commitei o `.sql`

## Checklist
- [ ] `npm run check` passa local (0 erros TS)
- [ ] `npm test` passa local
- [ ] Testei a atividade no fluxo real (totem / QR / convidado) quando aplicável
- [ ] Sem segredos no código (chaves vão no `.env` da VPS)

## Como testar
<!-- Passos pra revisar/validar. Ex: "abrir /events/halloween/totem, escanear QR, jogar". -->
