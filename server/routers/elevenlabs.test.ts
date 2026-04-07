import { describe, it, expect } from "vitest";

describe("ElevenLabs API Key Validation", () => {
  it("should validate ElevenLabs API key by fetching available voices", async () => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe("");
    expect(apiKey?.startsWith("sk_")).toBe(true);

    // Test the API key by fetching voices list (lightweight endpoint)
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      method: "GET",
      headers: {
        "xi-api-key": apiKey!,
      },
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.voices).toBeDefined();
    expect(Array.isArray(data.voices)).toBe(true);
    expect(data.voices.length).toBeGreaterThan(0);

    console.log(`✅ ElevenLabs API Key válida! ${data.voices.length} vozes disponíveis.`);
  });

  it("should have access to Adam voice (Lucas)", async () => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const adamVoiceId = "pNInz6obpgDQGcFmaJgB";

    const response = await fetch(`https://api.elevenlabs.io/v1/voices/${adamVoiceId}`, {
      method: "GET",
      headers: {
        "xi-api-key": apiKey!,
      },
    });

    expect(response.ok).toBe(true);
    const voice = await response.json();
    expect(voice.name).toContain("Adam");
    console.log(`✅ Voz Adam (Lucas) disponível: ${voice.name}`);
  });

  it("should have access to Charlotte voice (Emily)", async () => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const charlotteVoiceId = "XB0fDUnXU5powFXDhCwa";

    const response = await fetch(`https://api.elevenlabs.io/v1/voices/${charlotteVoiceId}`, {
      method: "GET",
      headers: {
        "xi-api-key": apiKey!,
      },
    });

    expect(response.ok).toBe(true);
    const voice = await response.json();
    expect(voice.name).toBe("Charlotte");
    console.log(`✅ Voz Charlotte (Emily) disponível: ${voice.name}`);
  });
});
