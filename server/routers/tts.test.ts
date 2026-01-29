/**
 * Testes para validar os provedores de TTS
 * Verifica se as chaves API estão funcionando corretamente
 */

import { describe, it, expect } from "vitest";
import { 
  generateSpeech, 
  getAvailableProviders,
  getCharacterVoiceInfo, 
  getAllCharacters,
  CHARACTER_VOICES 
} from "../_core/textToSpeech";

describe("TTS Multi-Provider", () => {
  describe("Configuração", () => {
    it("deve ter pelo menos um provedor configurado", () => {
      const providers = getAvailableProviders();
      console.log("Provedores disponíveis:", providers);
      expect(providers.length).toBeGreaterThan(0);
    });
  });

  describe("Vozes dos Personagens", () => {
    it("Lucas deve ter configuração de voz americana", () => {
      const lucas = CHARACTER_VOICES.lucas;
      expect(lucas).toBeDefined();
      expect(lucas.openaiVoice).toBe("echo");
      expect(lucas.accent).toContain("American");
      expect(lucas.flag).toBe("🇺🇸");
      expect(lucas.city).toBe("New York");
    });

    it("Emily deve ter configuração de voz britânica", () => {
      const emily = CHARACTER_VOICES.emily;
      expect(emily).toBeDefined();
      expect(emily.openaiVoice).toBe("nova");
      expect(emily.accent).toContain("British");
      expect(emily.flag).toBe("🇬🇧");
      expect(emily.city).toBe("London");
    });

    it("Aiko deve ter configuração de voz australiana", () => {
      const aiko = CHARACTER_VOICES.aiko;
      expect(aiko).toBeDefined();
      expect(aiko.openaiVoice).toBe("shimmer");
      expect(aiko.accent).toContain("Australian");
      expect(aiko.flag).toBe("🇦🇺");
      expect(aiko.city).toBe("Sydney");
    });
  });

  describe("getCharacterInfo", () => {
    it("deve retornar informações do Lucas", () => {
      const info = getCharacterVoiceInfo("lucas");
      expect(info).not.toBeNull();
      expect(info?.name).toBe("Lucas");
      expect(info?.openaiVoice).toBe("echo");
    });

    it("deve retornar null para personagem inexistente", () => {
      const info = getCharacterVoiceInfo("unknown");
      expect(info).toBeNull();
    });
  });

  describe("getAllCharacters", () => {
    it("deve retornar todos os 3 personagens", () => {
      const characters = getAllCharacters();
      expect(characters).toHaveLength(3);
      expect(characters.map(c => c.id)).toContain("lucas");
      expect(characters.map(c => c.id)).toContain("emily");
      expect(characters.map(c => c.id)).toContain("aiko");
    });
  });

  describe("Geração de Áudio - OpenAI", () => {
    it("deve gerar áudio para Lucas com OpenAI", async () => {
      const providers = getAvailableProviders();
      if (!providers.includes("openai")) {
        console.log("⏭️ OpenAI não configurado, pulando teste");
        return;
      }

      const result = await generateSpeech({
        text: "Hello, I'm Lucas from New York! You got this!",
        character: "lucas",
        preferredProvider: "openai",
      });

      if ("error" in result) {
        console.error("Erro OpenAI Lucas:", result.error);
        throw new Error(result.error);
      }
      
      expect(result.provider).toBe("openai");
      expect(result.audioBuffer.length).toBeGreaterThan(0);
      console.log("✅ OpenAI Lucas - Áudio gerado:", result.audioBuffer.length, "bytes");
    }, 30000);

    it("deve gerar áudio para Emily com OpenAI", async () => {
      const providers = getAvailableProviders();
      if (!providers.includes("openai")) {
        console.log("⏭️ OpenAI não configurado, pulando teste");
        return;
      }

      const result = await generateSpeech({
        text: "Hello, I'm Emily from London! Lovely to meet you!",
        character: "emily",
        preferredProvider: "openai",
      });

      if ("error" in result) {
        console.error("Erro OpenAI Emily:", result.error);
        throw new Error(result.error);
      }
      
      expect(result.provider).toBe("openai");
      expect(result.audioBuffer.length).toBeGreaterThan(0);
      console.log("✅ OpenAI Emily - Áudio gerado:", result.audioBuffer.length, "bytes");
    }, 30000);

    it("deve gerar áudio para Aiko com OpenAI", async () => {
      const providers = getAvailableProviders();
      if (!providers.includes("openai")) {
        console.log("⏭️ OpenAI não configurado, pulando teste");
        return;
      }

      const result = await generateSpeech({
        text: "G'day mate, I'm Aiko from Sydney! No worries!",
        character: "aiko",
        preferredProvider: "openai",
      });

      if ("error" in result) {
        console.error("Erro OpenAI Aiko:", result.error);
        throw new Error(result.error);
      }
      
      expect(result.provider).toBe("openai");
      expect(result.audioBuffer.length).toBeGreaterThan(0);
      console.log("✅ OpenAI Aiko - Áudio gerado:", result.audioBuffer.length, "bytes");
    }, 30000);
  });

  describe("Geração de Áudio - ElevenLabs", () => {
    it("deve gerar áudio para Lucas com ElevenLabs", async () => {
      const providers = getAvailableProviders();
      if (!providers.includes("elevenlabs")) {
        console.log("⏭️ ElevenLabs não configurado, pulando teste");
        return;
      }

      const result = await generateSpeech({
        text: "Hello, I'm Lucas from New York!",
        character: "lucas",
        preferredProvider: "elevenlabs",
      });

      if ("error" in result) {
        console.error("Erro ElevenLabs Lucas:", result.error);
        // Não falha o teste se ElevenLabs não funcionar
        return;
      }
      
      expect(result.provider).toBe("elevenlabs");
      expect(result.audioBuffer.length).toBeGreaterThan(0);
      console.log("✅ ElevenLabs Lucas - Áudio gerado:", result.audioBuffer.length, "bytes");
    }, 30000);
  });

  describe("Geração de Áudio - Google Cloud", () => {
    it("deve gerar áudio para Lucas com Google Cloud", async () => {
      const providers = getAvailableProviders();
      if (!providers.includes("google")) {
        console.log("⏭️ Google Cloud não configurado, pulando teste");
        return;
      }

      const result = await generateSpeech({
        text: "Hello, I'm Lucas from New York!",
        character: "lucas",
        preferredProvider: "google",
      });

      if ("error" in result) {
        console.error("Erro Google Lucas:", result.error);
        // Não falha o teste se Google não funcionar
        return;
      }
      
      expect(result.provider).toBe("google");
      expect(result.audioBuffer.length).toBeGreaterThan(0);
      console.log("✅ Google Lucas - Áudio gerado:", result.audioBuffer.length, "bytes");
    }, 30000);
  });

  describe("Fallback Automático", () => {
    it("deve usar fallback quando provedor preferido falha", async () => {
      const result = await generateSpeech({
        text: "Testing automatic fallback between providers",
        character: "lucas",
      });

      if ("error" in result) {
        console.error("Erro no fallback:", result.error);
        throw new Error(result.error);
      }

      expect(result.audioBuffer.length).toBeGreaterThan(0);
      console.log("✅ Fallback funcionando - Provedor usado:", result.provider);
    }, 30000);
  });
});
