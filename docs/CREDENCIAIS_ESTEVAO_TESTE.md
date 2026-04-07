# 🔑 Credenciais de Teste - Estevão Cordeiro

**Data:** 24/01/2026  
**URL de Produção:** https://influxassist-2anfqga4.manus.space

---

## 👨‍💼 ACESSO ADMIN (Estevão)

**Perfil:** Administrador  
**Função:** Gerenciar alunos, materiais, notificações

**Credenciais:**
- **ID:** 570010
- **Email:** direcaojundiairetiro@influx.com.br
- **Role:** admin

**Link de Acesso Direto:**
```
https://influxassist-2anfqga4.manus.space/api/direct-login/f8e9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8
```

---

## 👨‍🎓 ACESSO ALUNO (Estevão - Teste)

**Perfil:** Book 5 - Avançado | Matrícula 9999  
**Função:** Testar funcionalidades do Personal Tutor como aluno

**Credenciais:**
- **ID:** 570011
- **Student ID:** 60003
- **Email:** estevao.teste.aluno@influx.com.br
- **Role:** user (aluno)
- **Matrícula:** 9999
- **Status:** Ativo
- **Book:** 5 (Avançado)

**Link de Acesso Direto:**
```
https://influxassist-2anfqga4.manus.space/api/direct-login/6ad492015f0016276cad0278bc6aeaedbba9d0dc00bc8e91f9b569f4bf631fbb
```

---

## 📱 Como Usar

### Acesso Admin:
1. Clique no link de acesso direto do **Admin**
2. Você verá o **Dashboard Administrativo** com:
   - Lista de todos os alunos
   - Estatísticas gerais
   - Botões para gerar links e compartilhar materiais

### Acesso Aluno:
1. Clique no link de acesso direto do **Aluno**
2. Você verá o **Dashboard do Aluno** com:
   - Tutorial de primeiro acesso (6 passos interativos)
   - Badges de notificação nas abas
   - Chat IA, Exercícios, Blog, Reading Club
   - Progresso personalizado (Book 5)
   - Tutor personalizado

---

## 🎯 Funcionalidades para Testar (Acesso Aluno)

### ✅ Tutorial de Onboarding
- Aparece automaticamente no primeiro acesso
- 6 passos explicando cada funcionalidade
- Pode ser pulado ou navegado livremente
- Botão no header (ícone ?) para reabrir

### ✅ Badges de Notificação
- Círculos vermelhos com números nas abas
- Chat IA: 3 mensagens não lidas
- Exercícios: 5 exercícios pendentes
- Blog: 2 novas dicas
- Materiais: 1 novo material
- Reading Club: 4 novos posts
- Desaparecem ao clicar na aba

### ✅ Abas Principais
1. **Visão Geral** - Dashboard com progresso e estatísticas
2. **Meus Livros** - Histórico de livros completados
3. **Revisão** - Chunks para revisar
4. **Chat IA** - Conversação com tutor
5. **Exercícios** - Prática personalizada
6. **Blog** - Dicas do blog inFlux
7. **Dados** - Informações do Sponte
8. **Materiais** - Materiais exclusivos compartilhados
9. **Reading Club** - Clube de leitura com gamificação

---

## 🔐 Observações

- **Links diretos** não expiram e não precisam de senha
- **Tokens** são únicos e criptografados (SHA-256)
- **Banco centralizado** compartilhado com sistema principal (TiDB Cloud)
- **Servidor reiniciado** com os novos tokens registrados
- **Tutorial** detecta primeiro acesso via localStorage
- **Badges** usam contadores mockados (preparado para backend real)

---

## 🚀 Próximos Testes Sugeridos

1. **Tutorial completo** - Navegue pelos 6 passos do onboarding
2. **Badges** - Clique nas abas com badges e veja desaparecerem
3. **Chat IA** - Teste conversação com o tutor personalizado
4. **Reading Club** - Explore a funcionalidade de clube de leitura
5. **Reabrir tutorial** - Clique no ícone ? no header para ver o tutorial novamente
6. **Troca de perfil** - Alterne entre acesso admin e aluno para comparar experiências
