# TTS Debug Findings

## Problema Identificado

O áudio TTS não está tocando quando o usuário clica nos personagens.

## Análise

1. **API ElevenLabs**: ✅ Funcionando (testado via curl - retorna HTTP 200 e gera MP3 válido)

2. **Backend tRPC**: O endpoint `tts.speak` usa `protectedProcedure`, requer autenticação

3. **Frontend**: O componente `VacationPlus2Content.tsx` usa `speakMutation.mutateAsync()` corretamente

4. **Problema**: Os logs do console não mostram nenhuma resposta das chamadas fetch/tRPC

## Possíveis Causas

1. A chamada TTS pode estar demorando muito (timeout)
2. O servidor pode não estar processando a requisição
3. Pode haver um problema de CORS ou autenticação

## Próximos Passos

1. Verificar logs do servidor em tempo real
2. Adicionar mais logs de debug no frontend
3. Verificar se a variável ELEVENLABS_API_KEY está disponível no servidor

## Teste Direto da API

```bash
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB" \
  -H "xi-api-key: sk_1ef9d5adc37ce1b4673909d50a9bd690a8c2cdc42c63e06f" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, what is up?", "model_id": "eleven_multilingual_v2"}' \
  -o /tmp/test-lucas.mp3 -w "%{http_code}"
```

Resultado: 200 OK, arquivo MP3 válido de 18KB
