# Sistema TTS - Status Atual e Documentação Completa

**Projeto:** inFlux Personal Tutor  
**Data:** 30 de Janeiro de 2026  
**Versão:** caf88d35

---

## 1. Resumo Executivo

O sistema de Text-to-Speech (TTS) do inFlux Personal Tutor foi configurado para gerar áudios dos três personagens pedagógicos: Lucas (americano), Emily (britânica) e Aiko (australiana). O provedor principal é o **ElevenLabs** com plano Starter, que oferece vozes de alta qualidade e naturalidade.

### Status Geral

| Componente | Status | Observação |
|------------|--------|------------|
| API ElevenLabs | ✅ Funcionando | Testado com sucesso (HTTP 200) |
| Variável de Ambiente | ✅ Configurada | ELEVENLABS_API_KEY presente |
| Backend (Router TTS) | ✅ Implementado | Endpoints funcionais |
| Frontend (VacationPlus2) | ⚠️ Verificar | Possível erro de integração |

---

## 2. Configuração das Vozes dos Personagens

### 2.1 Lucas - Nova York, EUA 🇺🇸

| Parâmetro | Valor |
|-----------|-------|
| **Provedor** | ElevenLabs |
| **Voz** | Adam - Dominant, Firm |
| **Voice ID** | `pNInz6obpgDQGcFmaJgB` |
| **Velocidade** | 1.0 (normal) |
| **Sotaque** | American English (General American) |
| **Estilo** | Direto, prático, entusiasmado |
| **Características** | Rhotic (R claro), T-flapping, Contrações (gonna, wanna) |
| **Expressões típicas** | "You got this!", "Awesome!", "Cool!", "Let's do this!" |

### 2.2 Emily - Londres, Inglaterra 🇬🇧

| Parâmetro | Valor |
|-----------|-------|
| **Provedor** | ElevenLabs |
| **Voz** | Charlotte |
| **Voice ID** | `XB0fDUnXU5powFXDhCwa` |
| **Velocidade** | 0.95 (ligeiramente mais lenta) |
| **Sotaque** | British English (Received Pronunciation) |
| **Estilo** | Educada, formal, gentil |
| **Características** | Non-rhotic, T-glottalization, Vogais longas |
| **Expressões típicas** | "Lovely!", "Brilliant!", "Quite right!", "How delightful!" |

### 2.3 Aiko - Sydney, Austrália 🇦🇺

| Parâmetro | Valor |
|-----------|-------|
| **Provedor** | ElevenLabs |
| **Voz** | Jessica - Playful, Bright, Warm |
| **Voice ID** | `cgSgspJ2msm6clMCkdW9` |
| **Velocidade** | 1.05 (ligeiramente mais rápida) |
| **Sotaque** | Australian English (simulado com voz calorosa) |
| **Estilo** | Descontraída, casual, acolhedora |
| **Características** | Rising intonation, Vowel shifts, Word shortening |
| **Expressões típicas** | "No worries, mate!", "She'll be right!", "Heaps good!", "G'day!" |

---

## 3. Arquitetura do Sistema TTS

### 3.1 Arquivos Principais

```
server/
├── _core/
│   ├── textToSpeech.ts    # Módulo principal de TTS (geração de áudio)
│   └── env.ts             # Variáveis de ambiente (API keys)
├── routers/
│   ├── tts.ts             # Router tRPC com endpoints
│   └── tts.test.ts        # Testes do sistema TTS
└── storage.ts             # Upload de áudios para S3

client/src/components/
├── VacationPlus2Content.tsx   # Usa TTS para diálogos e vocabulário
└── VacationQuiz.tsx           # Usa TTS para perguntas do quiz
```

### 3.2 Fluxo de Geração de Áudio

```
1. Frontend chama trpc.tts.speak.useMutation()
2. Router TTS recebe requisição com texto e personagem
3. textToSpeech.ts seleciona voz do personagem
4. API ElevenLabs gera áudio MP3
5. Áudio é salvo no S3 (storagePut)
6. URL do áudio é retornada ao frontend
7. Frontend reproduz áudio via new Audio(url)
```

### 3.3 Endpoints Disponíveis

| Endpoint | Tipo | Descrição |
|----------|------|-----------|
| `tts.speak` | Mutation | Gera áudio para um texto específico |
| `tts.dialogue` | Mutation | Gera áudio para diálogo completo |
| `tts.compareAccents` | Mutation | Compara pronúncia entre os 3 personagens |
| `tts.getCharacterInfo` | Query | Retorna informações de um personagem |
| `tts.getAllCharacters` | Query | Lista todos os personagens |
| `tts.getProviders` | Query | Lista provedores disponíveis |
| `tts.testProvider` | Mutation | Testa um provedor específico |

---

## 4. Provedores de TTS Configurados

O sistema suporta três provedores com fallback automático:

| Provedor | Status | API Key | Uso |
|----------|--------|---------|-----|
| **ElevenLabs** | ✅ Ativo | Configurada | Principal (todos os personagens) |
| **OpenAI** | ⚠️ Sem créditos | Configurada | Fallback |
| **Google Cloud** | ❌ Incompatível | Configurada | Requer OAuth2 |

### 4.1 ElevenLabs (Principal)

- **Plano:** Starter
- **Limite:** 30.000 caracteres/mês
- **Qualidade:** Alta (vozes naturais)
- **Email da conta:** estevao_orei@yahoo.com.br

### 4.2 Sistema de Fallback

Se o provedor preferido falhar, o sistema tenta automaticamente os outros na ordem:
1. ElevenLabs (preferido)
2. Google Cloud TTS
3. OpenAI TTS

---

## 5. Teste de Funcionamento da API

### 5.1 Teste Direto (curl)

```bash
# Comando executado:
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is Lucas from New York!", "model_id": "eleven_monolingual_v1"}'

# Resultado:
HTTP Status: 200
Arquivo gerado: 27.629 bytes (MP3 válido)
```

### 5.2 Verificação de Ambiente

```bash
# Variável de ambiente:
ELEVENLABS_API_KEY: sk_1ef9d5a... (configurada)

# Provedores disponíveis:
- elevenlabs: ✅ Funcionando
- openai: ⚠️ Configurado (sem créditos)
- google: ❌ Requer OAuth2
```

---

## 6. Possíveis Causas do Erro no Frontend

Com base na análise, o erro de áudio no frontend pode ser causado por:

### 6.1 Hipóteses

1. **Erro de CORS no S3** - O áudio é gerado mas não pode ser reproduzido devido a restrições de CORS
2. **URL expirada** - A URL do S3 pode ter expirado antes da reprodução
3. **Erro de autenticação** - O usuário pode não estar autenticado corretamente
4. **Timeout na geração** - A geração pode estar demorando mais que o esperado
5. **Erro no componente Audio** - O elemento `<audio>` pode não estar carregando corretamente

### 6.2 Logs para Investigar

Para identificar o erro exato, verificar:
- Console do navegador (F12 > Console)
- Network tab (F12 > Network) - verificar requisições para `/api/trpc/tts.speak`
- Logs do servidor (procurar por `[TTS-ElevenLabs]`)

---

## 7. Código do Frontend (VacationPlus2Content.tsx)

```typescript
// Mutation para gerar áudio
const speakMutation = trpc.tts.speak.useMutation({
  onError: (error) => {
    toast.error("Erro ao gerar audio: " + error.message);
    setLoadingAudio(null);
  },
});

// Reprodução do áudio
const audio = new Audio(result.audioUrl);
audioRef.current = audio;

audio.onended = () => {
  setPlayingAudio(null);
};

audio.onerror = (e) => {
  console.error("Erro ao reproduzir audio:", e);
  toast.error("Erro ao reproduzir audio");
  setPlayingAudio(null);
};

await audio.play();
```

---

## 8. Código do Backend (tts.ts)

```typescript
// Endpoint speak
speak: protectedProcedure
  .input(z.object({
    text: z.string().min(1).max(5000),
    character: characterSchema,
    situation: situationSchema,
    preferredProvider: providerSchema,
  }))
  .mutation(async ({ input }) => {
    const result = await generateSpeech({
      text: input.text,
      character: input.character,
      situation: input.situation,
      preferredProvider: input.preferredProvider,
    });

    if ('error' in result) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: result.error,
      });
    }

    // Upload para S3
    const filename = `tts/${input.character}-${Date.now()}-${randomSuffix}.mp3`;
    const { url } = await storagePut(filename, result.audioBuffer, "audio/mpeg");

    return {
      audioUrl: url,
      character: result.character,
      text: input.text,
    };
  }),
```

---

## 9. Próximos Passos Recomendados

### 9.1 Para Corrigir o Erro de Áudio

1. **Verificar logs do console** no navegador ao clicar no botão de áudio
2. **Verificar Network tab** para ver se a requisição está sendo feita
3. **Testar endpoint diretamente** via Postman ou curl
4. **Verificar permissões de CORS** no S3

### 9.2 Melhorias Futuras

1. **Implementar contador de uso** - Monitorar caracteres usados no ElevenLabs
2. **Cache de áudios** - Evitar regenerar áudios repetidos
3. **Pré-carregar áudios** - Melhorar tempo de resposta
4. **Ajustar parâmetros de voz** - Fine-tuning de stability e similarity_boost

---

## 10. Credenciais e Acessos

### 10.1 ElevenLabs

| Campo | Valor |
|-------|-------|
| Email | estevao_orei@yahoo.com.br |
| Plano | Starter |
| API Key | sk_1ef9d5adc37ce1b4673909d50a9bd690a8c2cdc42c63e06f |
| Limite | 30.000 caracteres/mês |

### 10.2 Sistema inFlux

| Campo | Valor |
|-------|-------|
| URL Preview | https://3000-iwrnmlo3dnabdld8nn5z8-a3d293a5.us2.manus.computer |
| URL Produção | https://influx-assistants.manus.space |
| Usuário Teste | estevao.teste.aluno@influx.com.br |
| Senha Teste | Estevão@2026 |

---

## 11. Referências

- [ElevenLabs API Documentation](https://docs.elevenlabs.io/api-reference)
- [tRPC Documentation](https://trpc.io/docs)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

**Documento gerado por:** Manus AI  
**Data:** 30/01/2026
