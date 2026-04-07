import { describe, it, expect } from "vitest";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Configurações dos personagens conforme textToSpeech.ts
const CHARACTER_VOICES = {
  lucas: {
    name: "Lucas",
    flag: "🇺🇸",
    voiceId: "pNInz6obpgDQGcFmaJgB", // Adam
  },
  emily: {
    name: "Emily",
    flag: "🇬🇧",
    voiceId: "XB0fDUnXU5powFXDhCwa", // Charlotte
  },
  aiko: {
    name: "Aiko",
    flag: "🇦🇺",
    voiceId: "cgSgspJ2msm6clMCkdW9", // Jessica
  },
};

describe("TTS System - ElevenLabs Integration", () => {
  it("should have ElevenLabs API key configured", () => {
    expect(ELEVENLABS_API_KEY).toBeDefined();
    expect(ELEVENLABS_API_KEY).not.toBe("");
    expect(ELEVENLABS_API_KEY?.startsWith("sk_")).toBe(true);
  });

  it("should generate audio for Lucas (American accent)", async () => {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${CHARACTER_VOICES.lucas.voiceId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY!,
        },
        body: JSON.stringify({
          text: "Hey, how's it going?",
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    
    const contentType = response.headers.get("content-type");
    expect(contentType).toContain("audio");
    
    const audioBuffer = await response.arrayBuffer();
    expect(audioBuffer.byteLength).toBeGreaterThan(1000);
    
    console.log(`✅ Lucas (Adam): Audio generated - ${audioBuffer.byteLength} bytes`);
  });

  it("should generate audio for Emily (British accent)", async () => {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${CHARACTER_VOICES.emily.voiceId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY!,
        },
        body: JSON.stringify({
          text: "Lovely to meet you!",
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    
    const audioBuffer = await response.arrayBuffer();
    expect(audioBuffer.byteLength).toBeGreaterThan(1000);
    
    console.log(`✅ Emily (Charlotte): Audio generated - ${audioBuffer.byteLength} bytes`);
  });

  it("should generate audio for Aiko (Australian style)", async () => {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${CHARACTER_VOICES.aiko.voiceId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY!,
        },
        body: JSON.stringify({
          text: "G'day mate, no worries!",
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    
    const audioBuffer = await response.arrayBuffer();
    expect(audioBuffer.byteLength).toBeGreaterThan(1000);
    
    console.log(`✅ Aiko (Jessica): Audio generated - ${audioBuffer.byteLength} bytes`);
  });
});
