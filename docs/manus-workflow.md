# Fluxo de trabalho — Manus → Produção

> Objetivo: nunca mais a produção ficar meses atrás do `main`, e nenhuma
> atividade chegar no aluno sem ter sido vista e validada antes.

## O problema que isso resolve

Até 06/2026 o Manus commitava direto na `main` com mensagens "Checkpoint",
ninguém revisava, nada testava automaticamente e o deploy não acontecia.
Resultado: **223 commits** acumulados, produção **~2 meses** atrás, e nenhuma
das atividades novas (Valentine's, St. Patrick's, TOEIC, Karaokê...) no ar.

## O fluxo novo (5 passos)

```
Manus → branch → Pull Request → CI (verde) → Staging (você valida) → Produção
```

### 1. Manus trabalha numa branch, não na `main`
Ao iniciar uma leva de atividades, o Manus cria uma branch:
- `manus/events-<tema>`  (ex: `manus/events-halloween`)
- `manus/feature-<nome>` para features do app logado
- `fix/<nome>` para correções

A `main` é protegida: **não aceita push direto** (ver "Proteção da main").

### 2. Pull Request
Quando a leva está pronta, abre-se um PR da branch para a `main`.
O template (`.github/pull_request_template.md`) já pede o essencial:
o que muda, se mexe no banco, e como testar.

### 3. CI — o guarda-costas automático (`.github/workflows/ci.yml`)
Todo PR dispara automaticamente:
- **Typecheck** (`tsc --noEmit`) — pega erro de tipo antes da prod.
- **Testes** (`vitest run`) — roda os ~118 testes. ✅ verde = pode mesclar.

Sem verde, o botão de merge fica bloqueado.

### 4. Staging — você vê antes do aluno
Depois do merge na `main`, sobe-se para um ambiente de staging
(ex: `staging.tutor.imaind.tech`) onde dá pra abrir cada atividade e validar
de verdade (totem, QR, jogo). Nada vai pro aluno sem passar por aqui.

### 5. Produção
Com a sua aprovação no staging, promove-se a mesma versão para
`tutor.imaind.tech`. Deploy = `git pull` na VPS + build + `pm2 restart`
(detalhes em "Deploy").

## Banco de dados — migrations versionadas

**Regra:** se mexeu em `drizzle/schema.ts`, gere a migration e commite o `.sql`:

```bash
npx drizzle-kit generate          # gera o .sql revisável em drizzle/
git add drizzle/ && git commit -m "db: <descrição da mudança>"
```

Nunca usar `drizzle-kit push` cego contra o banco de produção — sem arquivo
`.sql` a mudança não é revisável nem reversível.

> ⚠️ Dívida histórica: os snapshots em `drizzle/meta/` pararam no `0019`
> (≈fev/2026), mas o `schema.ts` evoluiu muito desde então (tabelas de
> eventos, karaokê, cache do Deezer). Existe **uma reconciliação única**
> pendente: comparar o `schema.ts` atual com o banco real de produção
> (`drizzle-kit introspect` / baseline) e gerar a migration `0020` de
> referência. Isso é feito uma vez, com acesso à VPS, antes de ligar o
> enforcement de drift no CI.

## Proteção da `main`

Configurada em Settings → Branches → Branch protection rules:
- Require a pull request before merging
- Require status checks to pass: `Typecheck (tsc)` e `Tests (vitest)`
- (opcional) Require branches to be up to date before merging

## Deploy (resumo)

Na VPS (`brain.imaind.tech`), app roda via PM2 como `influx-tutor` (porta 3003,
nginx → `tutor.imaind.tech`). Ver `deploy/setup.sh`.

```bash
cd /var/www/<tutor>           # caminho real a confirmar na VPS
git pull origin main
npm ci
# aplicar migrations novas (ver seção de banco; reconciliar antes do 1º deploy)
npm run build
pm2 restart influx-tutor && pm2 save
```

## Checklist de release

- [ ] PR com CI verde, mesclado na `main`
- [ ] Backup do banco antes de qualquer migration
- [ ] Migrations aplicadas e conferidas
- [ ] Validado no staging
- [ ] Deploy em prod + smoke test (login, abrir 1 atividade)
- [ ] Rollback à mão se algo quebrar (`pm2 restart` na versão anterior)
