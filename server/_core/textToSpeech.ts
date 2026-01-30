/**
 * Módulo de Text-to-Speech para os personagens do Vacation Plus 2
 * 
 * PROVEDOR: ElevenLabs (para todos os personagens)
 * 
 * VOZES DOS PERSONAGENS:
 * 
 * LUCAS - Nova York, EUA 🇺🇸
 *    - Voz: "Adam - Dominant, Firm" (pNInz6obpgDQGcFmaJgB)
 *    - Velocidade: 1.0 (normal, ritmo nova-iorquino)
 *    - Sotaque: American English (General American)
 *    - Estilo: Direto, prático, entusiasmado
 * 
 * EMILY - Londres, Inglaterra 🇬🇧
 *    - Voz: "Charlotte" (XB0fDUnXU5powFXDhCwa)
 *    - Velocidade: 0.95 (ligeiramente mais lenta, formal)
 *    - Sotaque: British English (Received Pronunciation)
 *    - Estilo: Educada, formal, gentil
 * 
 * AIKO - Sydney, Australia 🇦🇺
 *    - Voz: "Jessica - Playful, Bright, Warm" (cgSgspJ2msm6clMCkdW9)
 *    - Velocidade: 1.05 (ligeiramente mais rápida, casual)
 *    - Sotaque: Australian English (simulado com voz calorosa)
 *    - Estilo: Descontraída, casual, acolhedora
 */

import { ENV } from "./env";

export type TTSProvider = "openai" | "elevenlabs" | "google";

export interface CharacterVoice {
  id: "lucas" | "emily" | "aiko";
  name: string;
  nationality: string;
  city: string;
  country: string;
  flag: string;
  // Vozes por provedor
  openaiVoice: "echo" | "nova" | "shimmer";
  elevenlabsVoice: string;
  googleVoice: string;
  speed: number;
  accent: string;
  style: string;
  characteristics: string[];
  expressions: string[];
  // Provedor preferido para este personagem
  preferredProvider: TTSProvider;
}

export interface SpeechOptions {
  text: string;
  character: "lucas" | "emily" | "aiko";
  situation?: "greeting" | "explaining" | "excited" | "casual" | "formal";
  preferredProvider?: TTSProvider;
}

export interface SpeechResult {
  audioBuffer: Buffer;
  audioBase64: string;
  character: CharacterVoice;
  provider: TTSProvider;
  mimeType: string;
}

export interface SpeechError {
  error: string;
  code: string;
  provider?: TTSProvider;
}

export const CHARACTER_VOICES: Record<string, CharacterVoice> = {
  lucas: {
    id: "lucas",
    name: "Lucas",
    nationality: "American",
    city: "New York",
    country: "United States",
    flag: "🇺🇸",
    openaiVoice: "echo",
    elevenlabsVoice: "pNInz6obpgDQGcFmaJgB", // Adam - American male
    googleVoice: "en-US-Wavenet-D",
    speed: 1.0,
    accent: "American English (General American)",
    style: "Direct, practical, enthusiastic",
    characteristics: [
      "Rhotic (pronounces R clearly)",
      "T-flapping: water → wader",
      "Contractions: gonna, wanna, gotta",
      "Fast-paced speech typical of New Yorkers",
    ],
    expressions: ["You got this!", "Awesome!", "Cool!", "Let's do this!"],
    preferredProvider: "elevenlabs", // ElevenLabs para melhor qualidade
  },
  emily: {
    id: "emily",
    name: "Emily",
    nationality: "British",
    city: "London",
    country: "United Kingdom",
    flag: "🇬🇧",
    openaiVoice: "nova",
    elevenlabsVoice: "XB0fDUnXU5powFXDhCwa", // Charlotte - British female
    googleVoice: "en-GB-Wavenet-A",
    speed: 0.95,
    accent: "British English (Received Pronunciation)",
    style: "Polite, formal, gentle",
    characteristics: [
      "Non-rhotic (doesn't pronounce final R)",
      "T-glottalization: bottle → bo'le",
      "Long vowels: bath, grass, dance",
      "Measured, articulate speech",
    ],
    expressions: ["Lovely!", "Brilliant!", "Quite right!", "How delightful!"],
    preferredProvider: "elevenlabs", // ElevenLabs para melhor qualidade
  },
  aiko: {
    id: "aiko",
    name: "Aiko",
    nationality: "Australian",
    city: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
    openaiVoice: "shimmer",
    elevenlabsVoice: "cgSgspJ2msm6clMCkdW9", // Jessica - Playful, Bright, Warm
    googleVoice: "en-AU-Wavenet-C", // Voz feminina australiana de alta qualidade
    speed: 1.05,
    accent: "Australian English (General Australian)",
    style: "Laid-back, casual, warm",
    characteristics: [
      "Australian Question Intonation (rising intonation)",
      "Vowel shifts: day → die, mate → mite",
      "Word shortening: afternoon → arvo",
      "Relaxed, friendly tone",
    ],
    expressions: ["No worries, mate!", "She'll be right!", "Heaps good!", "G'day!"],
    preferredProvider: "elevenlabs", // ElevenLabs - Jessica (Playful, Bright, Warm)
  },
};

// ============================================
// OPENAI TTS
// ============================================
async function generateWithOpenAI(
  text: string,
  voice: CharacterVoice,
  speed: number
): Promise<SpeechResult | SpeechError> {
  if (!ENV.openaiApiKey) {
    return { error: "OpenAI API key not configured", code: "NO_API_KEY", provider: "openai" };
  }

  try {
    console.log("[TTS-OpenAI] Gerando áudio para:", voice.name, "- Texto:", text.substring(0, 50) + "...");
    
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ENV.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: voice.openaiVoice,
        speed: speed,
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[TTS-OpenAI] Erro:", response.status, errorText);
      return {
        error: `OpenAI API error: ${response.status} - ${errorText}`,
        code: "API_ERROR",
        provider: "openai",
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    const audioBase64 = audioBuffer.toString("base64");

    console.log("[TTS-OpenAI] ✅ Áudio gerado com sucesso! Tamanho:", audioBuffer.length, "bytes");

    return {
      audioBuffer,
      audioBase64,
      character: voice,
      provider: "openai",
      mimeType: "audio/mpeg",
    };
  } catch (error) {
    console.error("[TTS-OpenAI] Erro:", error);
    return {
      error: `OpenAI error: ${error instanceof Error ? error.message : "Unknown error"}`,
      code: "GENERATION_ERROR",
      provider: "openai",
    };
  }
}

// ============================================
// ELEVENLABS TTS
// ============================================
// Helper function para fetch com timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 15000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Helper function para retry com backoff exponencial
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`[TTS] Tentativa ${attempt + 1}/${maxRetries} falhou: ${lastError.message}`);
      
      if (attempt < maxRetries - 1) {
        const delay = initialDelayMs * Math.pow(2, attempt);
        console.log(`[TTS] Aguardando ${delay}ms antes de tentar novamente...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

async function generateWithElevenLabs(
  text: string,
  voice: CharacterVoice,
  speed: number
): Promise<SpeechResult | SpeechError> {
  if (!ENV.elevenlabsApiKey) {
    return { error: "ElevenLabs API key not configured", code: "NO_API_KEY", provider: "elevenlabs" };
  }

  try {
    console.log("[TTS-ElevenLabs] Gerando áudio para:", voice.name, "- Texto:", text.substring(0, 50) + "...");
    
    // ElevenLabs usa stability e similarity_boost ao invés de speed
    // Convertemos speed para esses parâmetros
    const stability = speed < 1 ? 0.7 : 0.5; // Mais lento = mais estável
    const similarityBoost = 0.75;

    // Usar retry com backoff para lidar com timeouts intermitentes
    const response = await retryWithBackoff(async () => {
      return await fetchWithTimeout(
        `https://api.elevenlabs.io/v1/text-to-speech/${voice.elevenlabsVoice}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ENV.elevenlabsApiKey!,
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: stability,
              similarity_boost: similarityBoost,
            },
          }),
        },
        20000 // 20 segundos de timeout
      );
    }, 3, 1000); // 3 tentativas, começando com 1 segundo de delay

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[TTS-ElevenLabs] Erro:", response.status, errorText);
      return {
        error: `ElevenLabs API error: ${response.status} - ${errorText}`,
        code: "API_ERROR",
        provider: "elevenlabs",
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    const audioBase64 = audioBuffer.toString("base64");

    console.log("[TTS-ElevenLabs] ✅ Áudio gerado com sucesso! Tamanho:", audioBuffer.length, "bytes");

    return {
      audioBuffer,
      audioBase64,
      character: voice,
      provider: "elevenlabs",
      mimeType: "audio/mpeg",
    };
  } catch (error) {
    console.error("[TTS-ElevenLabs] Erro:", error);
    return {
      error: `ElevenLabs error: ${error instanceof Error ? error.message : "Unknown error"}`,
      code: "GENERATION_ERROR",
      provider: "elevenlabs",
    };
  }
}

// ============================================
// GOOGLE CLOUD TTS
// ============================================
async function generateWithGoogle(
  text: string,
  voice: CharacterVoice,
  speed: number
): Promise<SpeechResult | SpeechError> {
  if (!ENV.googleCloudTtsApiKey) {
    return { error: "Google Cloud TTS API key not configured", code: "NO_API_KEY", provider: "google" };
  }

  try {
    console.log("[TTS-Google] Gerando áudio para:", voice.name, "- Texto:", text.substring(0, 50) + "...");
    
    // Extrair o código de idioma da voz (ex: en-US-Wavenet-D -> en-US)
    const languageCode = voice.googleVoice.split("-").slice(0, 2).join("-");

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${ENV.googleCloudTtsApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text: text },
          voice: {
            languageCode: languageCode,
            name: voice.googleVoice,
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: speed,
            pitch: 0,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[TTS-Google] Erro:", response.status, errorText);
      return {
        error: `Google Cloud TTS API error: ${response.status} - ${errorText}`,
        code: "API_ERROR",
        provider: "google",
      };
    }

    const data = await response.json();
    const audioBase64 = data.audioContent;
    const audioBuffer = Buffer.from(audioBase64, "base64");

    console.log("[TTS-Google] ✅ Áudio gerado com sucesso! Tamanho:", audioBuffer.length, "bytes");

    return {
      audioBuffer,
      audioBase64,
      character: voice,
      provider: "google",
      mimeType: "audio/mpeg",
    };
  } catch (error) {
    console.error("[TTS-Google] Erro:", error);
    return {
      error: `Google Cloud TTS error: ${error instanceof Error ? error.message : "Unknown error"}`,
      code: "GENERATION_ERROR",
      provider: "google",
    };
  }
}

// ============================================
// FUNÇÃO PRINCIPAL COM FALLBACK AUTOMÁTICO
// ============================================
export async function generateSpeech(
  options: SpeechOptions
): Promise<SpeechResult | SpeechError> {
  const { text, character, situation, preferredProvider } = options;

  const voice = CHARACTER_VOICES[character];
  if (!voice) {
    return {
      error: "Personagem não encontrado: " + character,
      code: "CHARACTER_NOT_FOUND",
    };
  }

  if (!text || text.trim().length === 0) {
    return {
      error: "Texto não pode estar vazio",
      code: "EMPTY_TEXT",
    };
  }

  if (text.length > 5000) {
    return {
      error: "Texto muito longo (máximo 5000 caracteres)",
      code: "TEXT_TOO_LONG",
    };
  }

  // Ajustar velocidade baseado na situação
  let speed = voice.speed;
  if (situation === "excited") {
    speed = Math.min(speed * 1.1, 1.25);
  } else if (situation === "formal") {
    speed = Math.max(speed * 0.9, 0.75);
  }

  // Ordem de provedores:
  // 1. Se preferredProvider foi passado na chamada, usa esse primeiro
  // 2. Senão, usa o provedor preferido do personagem
  // 3. Fallback para outros provedores se o preferido falhar
  const characterPreferred = voice.preferredProvider;
  const primaryProvider = preferredProvider || characterPreferred;
  
  const providers: TTSProvider[] = [
    primaryProvider,
    ...(["elevenlabs", "google", "openai"] as TTSProvider[]).filter(p => p !== primaryProvider)
  ];

  const errors: string[] = [];

  for (const provider of providers) {
    console.log(`[TTS] Tentando provedor: ${provider}`);
    
    let result: SpeechResult | SpeechError;

    switch (provider) {
      case "openai":
        result = await generateWithOpenAI(text, voice, speed);
        break;
      case "elevenlabs":
        result = await generateWithElevenLabs(text, voice, speed);
        break;
      case "google":
        result = await generateWithGoogle(text, voice, speed);
        break;
      default:
        continue;
    }

    if ("audioBuffer" in result) {
      console.log(`[TTS] ✅ Sucesso com provedor: ${provider}`);
      return result;
    }

    errors.push(`${provider}: ${result.error}`);
    console.log(`[TTS] ❌ Falha com provedor: ${provider} - ${result.error}`);
  }

  return {
    error: "Todos os provedores de TTS falharam: " + errors.join("; "),
    code: "ALL_PROVIDERS_FAILED",
  };
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================
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

// Verificar quais provedores estão configurados
export function getAvailableProviders(): TTSProvider[] {
  const providers: TTSProvider[] = [];
  if (ENV.openaiApiKey) providers.push("openai");
  if (ENV.elevenlabsApiKey) providers.push("elevenlabs");
  if (ENV.googleCloudTtsApiKey) providers.push("google");
  return providers;
}

// Testar um provedor específico
export async function testProvider(provider: TTSProvider): Promise<boolean> {
  const testResult = await generateSpeech({
    text: "Hello, this is a test.",
    character: "lucas",
    preferredProvider: provider,
  });
  return "audioBuffer" in testResult;
}
