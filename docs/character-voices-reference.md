# 🎙️ Referência de Vozes dos Personagens - inFlux Personal Tutor

> **IMPORTANTE**: Este documento define as vozes oficiais dos personagens Lucas, Emily e Aiko.
> Estas configurações devem ser usadas em TODOS os áudios do sistema.

---

## 🇺🇸 LUCAS - Nova York, Estados Unidos

### Configuração de Voz
| Parâmetro | Valor |
|-----------|-------|
| **Voz OpenAI** | `echo` |
| **Velocidade** | `1.0` (normal) |
| **Sotaque** | American English (General American) |
| **Estilo** | Direto, prático, entusiasmado |
| **Expressão típica** | "You got this!" |

### Características de Pronúncia
- **Rhotic**: Pronuncia o "R" claramente no final das palavras (car, water, better)
- **T-flapping**: "water" → "wader", "better" → "bedder", "butter" → "budder"
- **Contrações casuais**: gonna, wanna, gotta, kinda, sorta
- **Entonação**: Ascendente para demonstrar entusiasmo
- **Ritmo**: Rápido mas claro, típico de nova-iorquinos

### Expressões Típicas
- "Awesome!"
- "Cool!"
- "No problem!"
- "You got it!"
- "That's what I'm talking about!"
- "Let's do this!"

### Exemplo de Diálogo
```
"Hey! So you wanna grab some pizza? There's this awesome place 
on Fifth Avenue - best slice in the city, I'm telling ya!"
```

---

## 🇬🇧 EMILY - Londres, Inglaterra

### Configuração de Voz
| Parâmetro | Valor |
|-----------|-------|
| **Voz OpenAI** | `nova` |
| **Velocidade** | `0.95` (ligeiramente mais lenta) |
| **Sotaque** | British English (Received Pronunciation) |
| **Estilo** | Educada, formal, gentil |
| **Expressão típica** | "Lovely!" |

### Características de Pronúncia
- **Non-rhotic**: Não pronuncia o "R" no final das palavras (car → "cah", water → "watah")
- **T-glottalization**: "bottle" → "bo'le", "butter" → "bu'er"
- **Vogais longas**: "bath" com A longo, "grass", "dance"
- **Entonação**: Mais suave, reservada
- **Ritmo**: Mais pausado e articulado

### Expressões Típicas
- "Lovely!"
- "Brilliant!"
- "Quite right!"
- "Rather!"
- "Cheers!"
- "I beg your pardon?"
- "How delightful!"

### Exemplo de Diálogo
```
"Oh, how lovely! Shall we pop round to that little café 
near the British Museum? They do a rather splendid afternoon tea."
```

---

## 🇦🇺 AIKO - Sydney, Austrália

### Configuração de Voz
| Parâmetro | Valor |
|-----------|-------|
| **Voz OpenAI** | `shimmer` |
| **Velocidade** | `1.05` (ligeiramente mais rápida) |
| **Sotaque** | Australian English (General Australian) |
| **Estilo** | Descontraída, casual, acolhedora |
| **Expressão típica** | "No worries, mate!" |

### Características de Pronúncia
- **Non-rhotic**: Similar ao britânico, mas com mudanças vocálicas distintas
- **Australian Question Intonation (AQI)**: Entonação ascendente no final de afirmações
- **Mudanças vocálicas**: "day" → "die", "mate" → "mite", "no" → "naow"
- **Palavras encurtadas**: afternoon → "arvo", breakfast → "brekkie", barbecue → "barbie"
- **Ritmo**: Casual e relaxado

### Expressões Típicas
- "No worries, mate!"
- "She'll be right!"
- "Heaps good!"
- "Reckon so!"
- "Good on ya!"
- "Fair dinkum!"
- "How ya going?"

### Exemplo de Diálogo
```
"G'day! Reckon we should head down to Bondi for a swim? 
The weather's heaps good today. We could grab some brekkie 
at that café near the beach - no worries if you're not keen though!"
```

---

## 📊 Tabela Comparativa de Vozes

| Aspecto | Lucas 🇺🇸 | Emily 🇬🇧 | Aiko 🇦🇺 |
|---------|-----------|-----------|----------|
| **Voz** | echo | nova | shimmer |
| **Velocidade** | 1.0 | 0.95 | 1.05 |
| **Pronúncia do R** | Rhotic (pronuncia) | Non-rhotic | Non-rhotic |
| **Tom** | Energético | Formal | Casual |
| **Entonação** | Ascendente (entusiasmo) | Suave | AQI (questão) |

---

## 🎯 Regras de Uso

### 1. Consistência
- **SEMPRE** usar a mesma voz para cada personagem
- **NUNCA** misturar sotaques dentro de um mesmo personagem

### 2. Contexto Situacional
Ajustar a velocidade baseado no contexto:
- **Saudações**: Velocidade normal
- **Explicações**: Ligeiramente mais lento (-0.05)
- **Entusiasmo**: Ligeiramente mais rápido (+0.05)
- **Formal**: Mais lento (-0.1)

### 3. Diálogos
Em diálogos entre personagens:
- Manter pausa de 0.5s entre falas
- Cada personagem mantém seu sotaque consistente
- Usar expressões típicas de cada nacionalidade

### 4. Vocabulário
Usar vocabulário apropriado para cada região:

| Conceito | Lucas 🇺🇸 | Emily 🇬🇧 | Aiko 🇦🇺 |
|----------|-----------|-----------|----------|
| Apartamento | apartment | flat | unit |
| Lixo | trash/garbage | rubbish | rubbish |
| Banheiro | bathroom/restroom | loo/toilet | dunny/toilet |
| Biscoito | cookie | biscuit | bikkie |
| Batata frita | fries | chips | chips |
| Refrigerante | soda | fizzy drink | soft drink |
| Calçada | sidewalk | pavement | footpath |
| Metrô | subway | tube/underground | train |

---

## 🔧 Implementação Técnica

```typescript
// Importar configurações
import { CHARACTER_VOICES, generateSpeech } from "@/_core/textToSpeech";

// Gerar áudio para Lucas
const lucasAudio = await generateSpeech({
  text: "Hey! Let's grab some pizza!",
  character: "lucas",
  situation: "casual"
});

// Gerar áudio para Emily
const emilyAudio = await generateSpeech({
  text: "Oh, how lovely! Shall we have some tea?",
  character: "emily",
  situation: "formal"
});

// Gerar áudio para Aiko
const aikoAudio = await generateSpeech({
  text: "No worries, mate! Let's hit the beach!",
  character: "aiko",
  situation: "excited"
});
```

---

## 📝 Checklist de QA para Áudios

- [ ] Voz correta para o personagem?
- [ ] Sotaque consistente com a nacionalidade?
- [ ] Velocidade apropriada para o contexto?
- [ ] Expressões típicas da região?
- [ ] Vocabulário regional correto?
- [ ] Entonação natural e situacional?

---

*Última atualização: Janeiro 2026*
*Versão: 1.0*
