import { describe, it, expect } from "vitest";
import { 
  CHARACTER_VOICES, 
  getCharacterVoiceInfo, 
  getAllCharacters 
} from "../_core/textToSpeech";

describe("TTS Router", () => {
  describe("getCharacterInfo", () => {
    it("deve retornar informacoes do Lucas", () => {
      const info = getCharacterVoiceInfo("lucas");
      expect(info).not.toBeNull();
      expect(info?.name).toBe("Lucas");
      expect(info?.voiceId).toBe("echo");
      expect(info?.accent).toContain("American");
    });

    it("deve retornar informacoes da Emily", () => {
      const info = getCharacterVoiceInfo("emily");
      expect(info).not.toBeNull();
      expect(info?.name).toBe("Emily");
      expect(info?.voiceId).toBe("nova");
      expect(info?.accent).toContain("British");
    });

    it("deve retornar informacoes da Aiko", () => {
      const info = getCharacterVoiceInfo("aiko");
      expect(info).not.toBeNull();
      expect(info?.name).toBe("Aiko");
      expect(info?.voiceId).toBe("shimmer");
      expect(info?.accent).toContain("Australian");
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

  describe("Character Voice Configuration", () => {
    it("Lucas deve ter configuracao de voz americana", () => {
      const lucas = CHARACTER_VOICES.lucas;
      expect(lucas.voiceId).toBe("echo");
      expect(lucas.speed).toBe(1.0);
      expect(lucas.nationality).toBe("American");
      expect(lucas.city).toBe("New York");
    });

    it("Emily deve ter configuracao de voz britanica", () => {
      const emily = CHARACTER_VOICES.emily;
      expect(emily.voiceId).toBe("nova");
      expect(emily.speed).toBe(0.95);
      expect(emily.nationality).toBe("British");
      expect(emily.city).toBe("London");
    });

    it("Aiko deve ter configuracao de voz australiana", () => {
      const aiko = CHARACTER_VOICES.aiko;
      expect(aiko.voiceId).toBe("shimmer");
      expect(aiko.speed).toBe(1.05);
      expect(aiko.nationality).toBe("Australian");
      expect(aiko.city).toBe("Sydney");
    });
  });

  describe("Voice characteristics validation", () => {
    it("Lucas deve ter caracteristicas de fala americana", () => {
      const lucas = CHARACTER_VOICES.lucas;
      expect(lucas.characteristics.length).toBeGreaterThan(0);
      expect(lucas.expressions.length).toBeGreaterThan(0);
      expect(lucas.expressions).toContain("You got this!");
    });

    it("Emily deve ter caracteristicas de fala britanica", () => {
      const emily = CHARACTER_VOICES.emily;
      expect(emily.characteristics.length).toBeGreaterThan(0);
      expect(emily.expressions.length).toBeGreaterThan(0);
      expect(emily.expressions).toContain("Lovely!");
    });

    it("Aiko deve ter caracteristicas de fala australiana", () => {
      const aiko = CHARACTER_VOICES.aiko;
      expect(aiko.characteristics.length).toBeGreaterThan(0);
      expect(aiko.expressions.length).toBeGreaterThan(0);
      expect(aiko.expressions).toContain("No worries, mate!");
    });
  });
});
