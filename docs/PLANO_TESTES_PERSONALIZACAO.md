# Plano de Testes de Personalização - inFlux Personal Tutor

## Objetivo
Validar que cada um dos 5 alunos de teste recebe uma experiência completamente personalizada e isolada dos outros alunos.

---

## Alunos de Teste

### 1. Ana Silva (Book 1 - A1)
- **Email**: ana.silva@test.com
- **Telefone**: 11999999001
- **Nível**: Book 1 (A1)
- **Objetivo**: Travel (Viagem)
- **Livros Cursados**: Nenhum
- **Cursos Inscritos**: TRAVEL
- **Esperado**: 
  - Dashboard mostra Book 1
  - Tutor responde com vocabulário A1
  - Materiais mostram apenas Travel
  - Progresso começa em 0%

### 2. Bruno Costa (Book 2 - A2)
- **Email**: bruno.costa@test.com
- **Telefone**: 11999999002
- **Nível**: Book 2 (A2)
- **Objetivo**: Career (Carreira)
- **Livros Cursados**: Book 1
- **Cursos Inscritos**: BUSINESS
- **Esperado**:
  - Dashboard mostra Book 2
  - Tutor responde com vocabulário A2
  - Materiais mostram apenas Business
  - Progresso mostra Book 1 completo

### 3. Carla Oliveira (Book 3 - B1)
- **Email**: carla.oliveira@test.com
- **Telefone**: 11999999003
- **Nível**: Book 3 (B1)
- **Objetivo**: Studies (Estudos)
- **Livros Cursados**: Books 1-2
- **Cursos Inscritos**: MEDICAL, IELTS
- **Esperado**:
  - Dashboard mostra Book 3
  - Tutor responde com vocabulário B1
  - Materiais mostram Medical e IELTS
  - Progresso mostra Books 1-2 completos

### 4. Diego Martins (Book 4 - B2)
- **Email**: diego.martins@test.com
- **Telefone**: 11999999004
- **Nível**: Book 4 (B2)
- **Objetivo**: Career (Carreira)
- **Livros Cursados**: Books 1-3
- **Cursos Inscritos**: BUSINESS, CONVERSATIONAL
- **Esperado**:
  - Dashboard mostra Book 4
  - Tutor responde com vocabulário B2
  - Materiais mostram Business e Conversational
  - Progresso mostra Books 1-3 completos

### 5. Eduarda Santos (Book 5 - C1)
- **Email**: eduarda.santos@test.com
- **Telefone**: 11999999005
- **Nível**: Book 5 (C1)
- **Objetivo**: Travel (Viagem)
- **Livros Cursados**: Books 1-4
- **Cursos Inscritos**: TRAVEL, MOVIE_SERIES
- **Esperado**:
  - Dashboard mostra Book 5
  - Tutor responde com vocabulário C1
  - Materiais mostram Travel e Movie & Series
  - Progresso mostra Books 1-4 completos

---

## Matriz de Testes

| Teste | Ana (A1) | Bruno (A2) | Carla (B1) | Diego (B2) | Eduarda (C1) |
|-------|----------|-----------|-----------|-----------|------------|
| **Dashboard** | Book 1 | Book 2 | Book 3 | Book 4 | Book 5 |
| **Tutor Nível** | A1 | A2 | B1 | B2 | C1 |
| **Objetivo** | Travel | Career | Studies | Career | Travel |
| **Cursos** | TRAVEL | BUSINESS | MEDICAL, IELTS | BUSINESS, CONV | TRAVEL, MOVIE |
| **Livros Cursados** | 0 | 1 | 2 | 3 | 4 |
| **Progresso %** | 0% | 20% | 40% | 60% | 80% |

---

## Testes de Isolamento de Dados

### Teste 1: Ana não vê dados de Bruno
```
1. Login como Ana (ana.silva@test.com)
2. Verificar que dashboard mostra "Book 1"
3. Verificar que não há referência a "Book 2"
4. Verificar que cursos mostram apenas "TRAVEL"
5. Verificar que não há "BUSINESS" visível
```

### Teste 2: Bruno não vê dados de Carla
```
1. Login como Bruno (bruno.costa@test.com)
2. Verificar que dashboard mostra "Book 2"
3. Verificar que não há referência a "Book 3"
4. Verificar que cursos mostram apenas "BUSINESS"
5. Verificar que não há "MEDICAL" ou "IELTS" visível
```

### Teste 3: Progresso é isolado
```
1. Login como Ana
2. Registrar progresso em "Travel"
3. Logout
4. Login como Bruno
5. Verificar que progresso de Ana não aparece
6. Registrar progresso diferente em "Business"
7. Logout
8. Login como Ana
9. Verificar que progresso de Bruno não aparece
```

---

## Testes de Personalização de Conteúdo

### Teste 4: Tutor responde com nível correto
```
1. Login como Ana (A1)
2. Enviar mensagem: "Como você está?"
3. Verificar que resposta usa vocabulário simples (A1)
4. Logout
5. Login como Eduarda (C1)
6. Enviar mensagem: "Como você está?"
7. Verificar que resposta usa vocabulário avançado (C1)
```

### Teste 5: Materiais respeitam inscrição
```
1. Login como Ana
2. Verificar que "BUSINESS" não aparece em cursos
3. Verificar que "TRAVEL" aparece
4. Logout
5. Login como Bruno
6. Verificar que "TRAVEL" não aparece em cursos
7. Verificar que "BUSINESS" aparece
```

### Teste 6: Chunks são filtrados por nível
```
1. Login como Ana (Book 1)
2. Acessar chunks
3. Verificar que todos são Book 1
4. Logout
5. Login como Eduarda (Book 5)
6. Acessar chunks
7. Verificar que todos são Book 5
```

---

## Testes de Segurança

### Teste 7: Aluno não consegue acessar dados de outro
```
1. Login como Ana
2. Tentar acessar /student/dashboard?userId=bruno
3. Verificar que recebe erro ou dados de Ana
4. Tentar chamar API com userId de Bruno
5. Verificar que recebe erro 403 ou dados de Ana
```

### Teste 8: Senhas são hasheadas
```
1. Verificar banco de dados
2. Confirmar que senhas não estão em texto plano
3. Confirmar que senhas têm hash válido
```

---

## Testes de Performance

### Teste 9: Dados carregam rapidamente
```
1. Login como aluno
2. Medir tempo de carregamento do dashboard
3. Verificar que < 2 segundos
4. Medir tempo de resposta do tutor
5. Verificar que < 3 segundos
```

### Teste 10: Polling não causa lag
```
1. Login como aluno
2. Deixar página aberta por 5 minutos
3. Verificar que polling a cada 30s não causa lag
4. Verificar que CPU/memória não aumenta muito
```

---

## Checklist de Execução

- [ ] Criar 5 alunos de teste no banco
- [ ] Testar login de cada aluno
- [ ] Testar dashboard de cada aluno
- [ ] Testar tutor de cada aluno
- [ ] Testar materiais de cada aluno
- [ ] Testar progresso de cada aluno
- [ ] Testar isolamento entre alunos
- [ ] Testar segurança de dados
- [ ] Testar performance
- [ ] Documentar resultados
- [ ] Corrigir bugs encontrados
- [ ] Re-testar após correções

---

## Resultado Esperado

✅ Cada aluno recebe experiência completamente personalizada
✅ Dados são isolados entre alunos
✅ Conteúdo é filtrado por nível
✅ Cursos respeitam inscrição
✅ Progresso é rastreado individualmente
✅ Segurança é mantida
✅ Performance é aceitável

---

## Próximos Passos

1. Criar 5 alunos de teste no banco
2. Executar testes acima
3. Documentar resultados
4. Corrigir bugs encontrados
5. Sincronizar 182 alunos do Dashboard
6. Testar com alunos reais
