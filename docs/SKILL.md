# Animation Generator Skill

Skill para gerar animações educacionais com os personagens Lucas, Emily e Aiko no estilo Disney/Pixar.

## Quando Usar

Use esta skill quando for solicitado a criar animações, vídeos educacionais ou histórias animadas com os personagens da inFlux (Lucas, Emily, Aiko).

## Personagens e Vozes

| Personagem | Nacionalidade | Sotaque | Voz ElevenLabs | Aparência |
|------------|---------------|---------|----------------|-----------|
| **Lucas** | Americano 🇺🇸 | American English | Charlie (IKne3meq5aSn9XLyUdCD) | Cabelo castanho ondulado, olhos âmbar, jaqueta escura com gola de pelo |
| **Emily** | Britânica 🇬🇧 | British English | Charlotte (XB0fDUnXU5powFXDhCwa) | Cabelo loiro ondulado com laços azuis, olhos azuis, moletom coral/rosa com corações |
| **Aiko** | Australiana 🇦🇺 | Australian English | Jessica (cgSgspJ2msm6clMCkdW9) | Cabelo preto liso com franja, olhos castanhos, suéter lilás/roxo claro |

## Processo de Geração

### Fase 1: Roteiro
1. Criar roteiro com 6 cenas (ideal para vídeos de 1-2 minutos)
2. Cada cena deve ter:
   - Descrição visual detalhada
   - Diálogo em inglês (máximo 2-3 frases por cena)
   - Tradução em português para legendas
   - Chunks/expressões destacadas

### Fase 2: Imagens (Cenas)
1. Criar diretório para as cenas:
   ```bash
   mkdir -p /home/ubuntu/influx-assistants/client/public/videos/{video-name}/scenes
   ```

2. Gerar imagens usando a ferramenta `generate` com:
   - Estilo: "Disney Pixar 3D animation style"
   - Usar imagens de referência do personagem (obrigatório)
   - Resolução: 1024x1024 ou 1920x1080
   - Incluir cenário detalhado na descrição

3. Prompt template para imagens:
   ```
   Disney Pixar 3D animation style. [PERSONAGEM DESCRIÇÃO COMPLETA] in [CENÁRIO].
   [AÇÃO/EXPRESSÃO FACIAL]. Warm lighting, vibrant colors, cinematic composition.
   ```

### Fase 3: Áudios TTS
1. Criar script Python para gerar áudios:
   ```python
   import requests
   import os

   ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
   
   # Voice IDs
   VOICES = {
       "Lucas": "IKne3meq5aSn9XLyUdCD",  # Charlie - American English Young Male
       "Emily": "XB0fDUnXU5powFXDhCwa",  # Charlotte - British English
       "Aiko": "cgSgspJ2msm6clMCkdW9",   # Jessica - Australian English
   }
   
   def generate_audio(text, character, output_path):
       voice_id = VOICES[character]
       url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
       
       headers = {
           "Accept": "audio/mpeg",
           "Content-Type": "application/json",
           "xi-api-key": ELEVENLABS_API_KEY
       }
       
       data = {
           "text": text,
           "model_id": "eleven_multilingual_v2",
           "voice_settings": {
               "stability": 0.5,
               "similarity_boost": 0.75
           }
       }
       
       response = requests.post(url, json=data, headers=headers)
       
       if response.status_code == 200:
           with open(output_path, "wb") as f:
               f.write(response.content)
           print(f"Audio saved: {output_path}")
       else:
           print(f"Error: {response.status_code}")
   ```

2. Gerar um áudio para cada cena:
   ```bash
   python3 scripts/generate-audio.py
   ```

### Fase 4: Montagem do Vídeo
1. Obter durações dos áudios:
   ```bash
   for f in audio/*.mp3; do
       echo "$f: $(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$f")s"
   done
   ```

2. Criar vídeos individuais com efeito Ken Burns:
   ```bash
   # Para cada cena (ajustar duração conforme áudio)
   ffmpeg -loop 1 -i scenes/scene_01.png -i audio/scene_01.mp3 \
       -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0015,1.2)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=300:s=1920x1080:fps=30[v]" \
       -map "[v]" -map 1:a -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 192k \
       -shortest -y temp/scene_01.mp4
   ```

3. Concatenar todos os vídeos:
   ```bash
   # Criar arquivo de lista
   for f in temp/scene_*.mp4; do echo "file '$f'" >> concat.txt; done
   
   # Concatenar
   ffmpeg -f concat -safe 0 -i concat.txt -c copy video-final.mp4
   ```

### Fase 5: Legendas VTT
1. Criar arquivo de legendas em inglês (`subs-english.vtt`):
   ```vtt
   WEBVTT

   00:00:00.000 --> 00:00:10.000
   [Texto em inglês da cena 1]

   00:00:10.000 --> 00:00:20.000
   [Texto em inglês da cena 2]
   ```

2. Criar arquivo de legendas em português (`subs-portuguese.vtt`):
   ```vtt
   WEBVTT

   00:00:00.000 --> 00:00:10.000
   [Tradução em português da cena 1]

   00:00:10.000 --> 00:00:20.000
   [Tradução em português da cena 2]
   ```

3. Ajustar timestamps conforme duração real dos áudios

### Fase 6: Upload para CDN
1. Fazer upload do vídeo e legendas:
   ```bash
   manus-upload-file video-final.mp4
   manus-upload-file subs-english.vtt
   manus-upload-file subs-portuguese.vtt
   manus-upload-file scenes/scene_01.png  # thumbnail
   ```

2. Salvar URLs retornadas para uso no código

### Fase 7: Integração no App
1. Adicionar animação ao array em `AnimationsPage.tsx`:
   ```typescript
   {
     id: "video-name",
     title: "Título do Vídeo",
     character: "Emily",
     flag: "🇬🇧",
     description: "Descrição do vídeo...",
     thumbnail: "URL_CDN_THUMBNAIL",
     videoUrl: "URL_CDN_VIDEO",
     subtitles: [
       { label: "English", srclang: "en", src: "URL_CDN_SUBS_EN" },
       { label: "Português", srclang: "pt", src: "URL_CDN_SUBS_PT" },
     ],
     duration: "1:03",
     accent: "British English",
   }
   ```

## Estrutura de Arquivos

```
/home/ubuntu/influx-assistants/client/public/videos/{video-name}/
├── scenes/
│   ├── scene_01.png
│   ├── scene_02.png
│   ├── scene_03.png
│   ├── scene_04.png
│   ├── scene_05.png
│   └── scene_06.png
├── audio/
│   ├── scene_01.mp3
│   ├── scene_02.mp3
│   ├── scene_03.mp3
│   ├── scene_04.mp3
│   ├── scene_05.mp3
│   └── scene_06.mp3
├── temp/
│   ├── scene_01.mp4
│   ├── scene_02.mp4
│   └── ...
├── subs-english.vtt
├── subs-portuguese.vtt
├── video-final.mp4
└── cdn-urls.txt
```

## Checklist de Qualidade

- [ ] Imagens usam referência correta do personagem
- [ ] Estilo visual consistente (Disney/Pixar 3D)
- [ ] Áudios com sotaque correto (US/UK/AU)
- [ ] Legendas sincronizadas com áudio
- [ ] Vídeo sem erros de encoding
- [ ] URLs do CDN funcionando
- [ ] Player reproduzindo corretamente
- [ ] Seletor de legendas funcionando

## Dicas Importantes

1. **Sempre use imagens de referência** do personagem para manter consistência visual
2. **Verifique o sotaque** antes de gerar todos os áudios
3. **Teste o vídeo localmente** antes de fazer upload
4. **Remova crossOrigin="anonymous"** do VideoPlayer para evitar CORS
5. **Use manus-upload-file** para fazer upload (não manuscdn direto)

## Exemplo de Roteiro

### Emily no Texas

| Cena | Visual | Diálogo (EN) | Tradução (PT) |
|------|--------|--------------|---------------|
| 1 | Emily ao lado de caminhonete gigante | "Blimey! That's not a truck, that's a small house on wheels!" | "Caramba! Isso não é uma caminhonete, é uma casa pequena sobre rodas!" |
| 2 | Emily chocada com prato de BBQ | "I asked for a snack, not a feast for the entire royal family!" | "Eu pedi um lanche, não um banquete para toda a família real!" |
| 3 | Emily conversando com cowboy | "Excuse me, do you know where I can find a proper cup of tea?" | "Com licença, você sabe onde posso encontrar uma xícara de chá decente?" |
| 4 | Emily no rodeio com chapéu rosa | "This is absolutely mental! But I must say, rather exciting!" | "Isso é completamente louco! Mas devo dizer, bastante emocionante!" |
| 5 | Emily horrorizada com iced tea | "You put ICE in your tea?! That's... that's just not cricket!" | "Vocês colocam GELO no chá?! Isso é... isso simplesmente não se faz!" |
| 6 | Emily se despedindo | "Well, Texas, you've been absolutely bonkers. Cheers!" | "Bem, Texas, você foi absolutamente maluco. Valeu!" |


## Referências de Personagens

As imagens de referência dos personagens estão salvas em:

```
/home/ubuntu/influx-assistants/assets/characters/
├── lucas/
│   ├── kids/           → Camiseta listrada azul/branca (7-9 anos)
│   ├── transition/     → Moletom vermelho (10-12 anos)
│   ├── teens/          → Jaqueta escura com gola de pelo (13-15 anos)
│   ├── adult/          → Moletom azul marinho
│   └── scenes/         → Cenas do Loch Ness
├── emily/
│   ├── kids/           → Versão cartoon
│   ├── teens/          → Moletom coral com corações, laços azuis
│   └── scenes/         → Cenas do Texas
└── aiko/
    ├── kids/           → Camiseta lilás
    └── teens/          → Suéter lilás/roxo
```

**IMPORTANTE**: Sempre use as imagens de referência ao gerar novas cenas para manter consistência visual!

## Animações Criadas

| Título | Personagem | Duração | Status |
|--------|------------|---------|--------|
| Emily's Texas Adventure | Emily 🇬🇧 | 1:03 | ✅ Completo |
| Aiko's Sydney Tour | Aiko 🇦🇺 | 0:57 | ✅ Completo |
| Lucas and the Loch Ness | Lucas 🇺🇸 | 1:01 | ✅ Completo |
| Lucas in New York | Lucas 🇺🇸 | - | 📋 Planejado |
| Emily in Paris | Emily 🇬🇧 | - | 📋 Planejado |
