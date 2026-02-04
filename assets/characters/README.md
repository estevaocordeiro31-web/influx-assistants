# Character References

Pasta com imagens de referência dos personagens para geração de animações.

## Estrutura

```
characters/
├── lucas/          # 🇺🇸 American English
│   ├── kids/       # 7-9 anos - Camiseta listrada azul/branca
│   ├── transition/ # 10-12 anos - Moletom vermelho
│   ├── teens/      # 13-15 anos - Jaqueta escura com gola de pelo
│   ├── adult/      # 16+ anos - Moletom azul marinho
│   └── scenes/     # Cenas prontas (Loch Ness)
├── emily/          # 🇬🇧 British English
│   ├── kids/       # 7-9 anos
│   ├── transition/ # 10-12 anos
│   ├── teens/      # 13-15 anos - Moletom coral/rosa com corações, laços azuis
│   ├── adult/      # 16+ anos
│   └── scenes/     # Cenas prontas (Texas)
└── aiko/           # 🇦🇺 Australian English
    ├── kids/       # 7-9 anos
    ├── transition/ # 10-12 anos
    ├── teens/      # 13-15 anos
    ├── adult/      # 16+ anos
    └── scenes/     # Cenas prontas
```

## Lucas 🇺🇸

**Características:**
- Cabelo castanho ondulado
- Olhos castanhos/âmbar
- Estilo Disney/Pixar 3D

**Roupas por faixa etária:**
| Faixa | Roupa | Arquivo de Referência |
|-------|-------|----------------------|
| Kids (7-9) | Camiseta listrada azul/branca | `kids/lucas_cartoon.png` |
| Transition (10-12) | Moletom vermelho | `transition/lucas-transition-amongus-v2.png` |
| Teens (13-15) | Jaqueta escura com gola de pelo | `teens/lucas-front-final.png` |
| Adult (16+) | Moletom azul marinho com bandeira EUA | `adult/lucas-adult.png` |

**Voz ElevenLabs:** Adam (pNInz6obpgDQGcFmaJgB)

## Emily 🇬🇧

**Características:**
- Cabelo loiro ondulado com laços azuis
- Olhos azuis
- Estilo Disney/Pixar 3D

**Roupas por faixa etária:**
| Faixa | Roupa | Arquivo de Referência |
|-------|-------|----------------------|
| Teens (13-15) | Moletom coral/rosa com corações | `teens/emily-front.jpg` |

**Voz ElevenLabs:** Charlotte (XB0fDUnXU5powFXDhCwa)

## Aiko 🇦🇺

**Características:**
- Cabelo preto liso com franja
- Olhos castanhos
- Camiseta/suéter lilás/roxo claro
- Estilo Disney/Pixar 3D

**Roupas por faixa etária:**
| Faixa | Roupa | Arquivo de Referência |
|-------|-------|----------------------|
| Kids (7-9) | Camiseta lilás | `kids/aiko_cartoon.png` |
| Teens (13-15) | Suéter lilás/roxo | `teens/aiko-front.jpg` |

**Voz ElevenLabs:** Jessica (cgSgspJ2msm6clMCkdW9)

---

## Como Usar

Ao gerar novas cenas, sempre use as imagens desta pasta como referência para manter consistência visual:

```
# Exemplo de prompt para geração
"Disney Pixar 3D animation style. Lucas, a young American boy with wavy brown hair, 
amber eyes, wearing a dark jacket with fur collar (reference: teens/lucas-front-final.png)..."
```

## Animações Concluídas

| Personagem | Animação | Status |
|------------|----------|--------|
| Lucas | Lucas and the Loch Ness | ✅ Cenas prontas |
| Emily | Emily's Texas Adventure | ✅ Completo |
| Aiko | Aiko's Sydney Tour | ⏳ Próxima |
