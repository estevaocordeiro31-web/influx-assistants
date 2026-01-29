/**
 * Módulo de Text-to-Speech para os personagens do Vacation Plus 2
 * 
 * VOZES DOS PERSONAGENS (MEMORIZAR):
 * 
 * LUCAS - Nova York, EUA
 *    - Voz OpenAI: "echo" (masculina, jovem, energética)
 *    - Velocidade: 1.0 (normal, ritmo nova-iorquino)
 *    - Sotaque: American English (General American)
 *    - Estilo: Direto, prático, entusiasmado
 * 
 * EMILY - Londres, Inglaterra
 *    - Voz OpenAI: "nova" (feminina, clara, articulada)
 *    - Velocidade: 0.95 (ligeiramente mais lenta, formal)
 *    - Sotaque: British English (Received Pronunciation)
 *    - Estilo: Educada, formal, gentil
 * 
 * AIKO - Sydney, Australia
 *    - Voz OpenAI: "shimmer" (feminina, calorosa, amigável)
 *    - Velocidade: 1.05 (ligeiramente mais rápida, casual)
 *    - Sotaque: Australian English (General Australian)
 *    - Estilo: Descontraída, casual, acolhedora
 */

import { ENV } from "./env";

export interface CharacterVoice {
  id: "lucas" | "emily" | "aiko";
  name: string;
  nationality: string;
  city: string;
  country: string;
  flag: string;
  voiceId: "echo" | "nova" | "shimmer";
  speed: number;
  accent: string;
  style: string;
  characteristics: string[];
  expressions: string[];
}

export interface SpeechOptions {
  text: string;
  character: "lucas" | "emily" | "aiko";
  situation?: "greeting" | "explaining" | "excited" | "casual" | "formal";
}

export interface SpeechResult {
  audioBuffer: Buffer;
  character: CharacterVoice;
}

export interface SpeechError {
  error: string;
  code: string;
}

export const CHARACTER_VOICES: Record<string, CharacterVoice> = {
  lucas: {
    id: "lucas",
    name: "Lucas",
    nationality: "American",
    city: "New York",
    country: "United States",
    flag: "US",
    voiceId: "echo",
    speed: 1.0,
    accent: "American English (General American)",
    style: "Direct, practical, enthusiastic",
    characteristics: [
      "Rhotic (pronounces R clearly)",
      "T-flapping: water to wader",
      "Contractions: gonna, wanna, gotta",
      "Fast-paced speech typical of New Yorkers",
    ],
    expressions: ["You got this!", "Awesome!", "Cool!", "Lets do this!"],
  },
  emily: {
    id: "emily",
    name: "Emily",
    nationality: "British",
    city: "London",
    country: "United Kingdom",
    flag: "GB",
    voiceId: "nova",
    speed: 0.95,
    accent: "British English (Received Pronunciation)",
    style: "Polite, formal, gentle",
    characteristics: [
      "Non-rhotic (doesnt pronounce final R)",
      "T-glottalization: bottle to bole",
      "Long vowels: bath, grass, dance",
      "Measured, articulate speech",
    ],
    expressions: ["Lovely!", "Brilliant!", "Quite right!", "How delightful!"],
  },
  aiko: {
    id: "aiko",
    name: "Aiko",
    nationality: "Australian",
    city: "Sydney",
    country: "Australia",
    flag: "AU",
    voiceId: "shimmer",
    speed: 1.05,
    accent: "Australian English (General Australian)",
    style: "Laid-back, casual, warm",
    characteristics: [
      "Australian Question Intonation (rising intonation)",
      "Vowel shifts: day to die, mate to mite",
      "Word shortening: afternoon to arvo",
      "Relaxed, friendly tone",
    ],
    expressions: ["No worries, mate!", "Shell be right!", "Heaps good!", "Gday!"],
  },
};

export async function generateSpeech(
  options: SpeechOptions
): Promise<SpeechResult | SpeechError> {
  const { text, character, situation } = options;

  const voice = CHARACTER_VOICES[character];
  if (!voice) {
    return {
      error: "Personagem nao encontrado: " + character,
      code: "CHARACTER_NOT_FOUND",
    };
  }

  if (!text || text.trim().length === 0) {
    return {
      error: "Texto nao pode estar vazio",
      code: "EMPTY_TEXT",
    };
  }

  if (text.length > 5000) {
    return {
      error: "Texto muito longo (maximo 5000 caracteres)",
      code: "TEXT_TOO_LONG",
    };
  }

  let speed = voice.speed;
  if (situation === "excited") {
    speed = Math.min(speed * 1.1, 1.25);
  } else if (situation === "formal") {
    speed = Math.max(speed * 0.9, 0.75);
  }

  try {
    const response = await fetch(ENV.forgeApiUrl + "/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + ENV.forgeApiKey,
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: voice.voiceId,
        speed: speed,
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[TTS] Erro na API:", response.status, errorText);
      return {
        error: "Erro na API de TTS: " + response.status,
        code: "API_ERROR",
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    return {
      audioBuffer,
      character: voice,
    };
  } catch (error) {
    console.error("[TTS] Erro ao gerar audio:", error);
    return {
      error: "Erro ao gerar audio: " + (error instanceof Error ? error.message : "Erro desconhecido"),
      code: "GENERATION_ERROR",
    };
  }
}

export async function generateDialogue(
  lines: Array<{
    character: "lucas" | "emily" | "aiko";
    text: string;
    situation?: "greeting" | "explaining" | "excited" | "casual" | "formal";
  }>
): Promise<Array<SpeechResult | SpeechError>> {
  const results: Array<SpeechResult | SpeechError> = [];

  for (const line of lines) {
    const result = await generateSpeech({
      text: line.text,
      character: line.character,
      situation: line.situation,
    });
    results.push(result);
  }

  return results;
}

export function getCharacterVoiceInfo(
  characterId: string
): CharacterVoice | null {
  return CHARACTER_VOICES[characterId] || null;
}

export function getAllCharacters(): CharacterVoice[] {
  return Object.values(CHARACTER_VOICES);
}
