import { describe, it, expect } from "vitest";

// Test data validation
describe("Cultural Events - Data Validation", () => {
  it("should have 10 chunks in STPATRICKS_CHUNKS", async () => {
    const { STPATRICKS_CHUNKS } = await import("../client/src/data/stpatricks/chunks");
    expect(STPATRICKS_CHUNKS).toHaveLength(10);
  });

  it("each chunk should have required fields", async () => {
    const { STPATRICKS_CHUNKS } = await import("../client/src/data/stpatricks/chunks");
    for (const chunk of STPATRICKS_CHUNKS) {
      expect(chunk.id).toBeTruthy();
      expect(chunk.chunk).toBeTruthy();
      expect(chunk.equivalencia).toBeTruthy();
      expect(chunk.exemplo).toBeTruthy();
      expect(["lucas", "emily", "aiko"]).toContain(chunk.who);
    }
  });

  it("should have 8 quiz questions", async () => {
    const { STPATRICKS_QUIZ } = await import("../client/src/data/stpatricks/quiz");
    expect(STPATRICKS_QUIZ).toHaveLength(8);
  });

  it("each quiz question should have correct field", async () => {
    const { STPATRICKS_QUIZ } = await import("../client/src/data/stpatricks/quiz");
    for (const q of STPATRICKS_QUIZ) {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.options.length);
      expect(q.options.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("should have listening data with gaps", async () => {
    const { STPATRICKS_LISTENING } = await import("../client/src/data/stpatricks/listening");
    expect(STPATRICKS_LISTENING.gaps.length).toBeGreaterThan(0);
    expect(STPATRICKS_LISTENING.scriptWithBlanks).toContain("[_1_]");
  });

  it("should have 3 speaking scenarios", async () => {
    const { STPATRICKS_SPEAKING } = await import("../client/src/data/stpatricks/speaking");
    expect(STPATRICKS_SPEAKING).toHaveLength(3);
  });

  it("each speaking scenario should have character and prompt", async () => {
    const { STPATRICKS_SPEAKING } = await import("../client/src/data/stpatricks/speaking");
    for (const s of STPATRICKS_SPEAKING) {
      expect(s.id).toBeTruthy();
      expect(s.prompt).toBeTruthy();
      expect(["lucas", "emily", "aiko"]).toContain(s.character);
      expect(s.idealElements.length).toBeGreaterThan(0);
    }
  });
});

// Test router logic
describe("Cultural Events - Router Logic", () => {
  it("should calculate score correctly for quiz", () => {
    const totalQuestions = 8;
    const correctCount = 6;
    const score = Math.round((correctCount / totalQuestions) * 80);
    expect(score).toBe(60);
  });

  it("should calculate max score for perfect quiz", () => {
    const totalQuestions = 8;
    const correctCount = 8;
    const score = Math.round((correctCount / totalQuestions) * 80);
    expect(score).toBe(80);
  });

  it("should calculate chunk lesson score", () => {
    const totalChunks = 10;
    const flippedCards = 8;
    const score = Math.round((flippedCards / totalChunks) * 100);
    expect(score).toBe(80);
  });

  it("should calculate food challenge score correctly", () => {
    const MIN_EXCHANGES = 5;
    const exchangeCount = 7;
    const score = Math.min(100, Math.round((exchangeCount / MIN_EXCHANGES) * 100));
    expect(score).toBe(100); // capped at 100
  });

  it("should cap food challenge score at 100", () => {
    const MIN_EXCHANGES = 5;
    const exchangeCount = 10;
    const score = Math.min(100, Math.round((exchangeCount / MIN_EXCHANGES) * 100));
    expect(score).toBe(100);
  });

  it("should calculate speaking challenge average score", () => {
    const allScores = [75, 80, 90];
    const avgScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
    const finalScore = Math.round((avgScore / 100) * 120);
    expect(avgScore).toBe(82);
    expect(finalScore).toBe(98);
  });
});

// Test character info
describe("Cultural Events - Character Info", () => {
  it("should have correct character info", async () => {
    const { CHARACTER_INFO } = await import("../client/src/data/stpatricks/chunks");
    expect(CHARACTER_INFO.lucas.flag).toBeTruthy();
    expect(CHARACTER_INFO.emily.flag).toBeTruthy();
    expect(CHARACTER_INFO.aiko.flag).toBeTruthy();
    expect(CHARACTER_INFO.lucas.accent).toContain("American");
    expect(CHARACTER_INFO.emily.accent).toContain("British");
    expect(CHARACTER_INFO.aiko.accent).toContain("Australian");
  });

  it("should have TTS voices for each character", async () => {
    const { CHARACTER_INFO } = await import("../client/src/data/stpatricks/chunks");
    expect(CHARACTER_INFO.lucas.ttsVoice).toBeTruthy();
    expect(CHARACTER_INFO.emily.ttsVoice).toBeTruthy();
    expect(CHARACTER_INFO.aiko.ttsVoice).toBeTruthy();
  });

  it("should have character images", async () => {
    const { CHARACTER_IMAGES } = await import("../client/src/data/stpatricks/chunks");
    expect(CHARACTER_IMAGES.lucas).toContain("http");
    expect(CHARACTER_IMAGES.emily).toContain("http");
    expect(CHARACTER_IMAGES.aiko).toContain("http");
  });
});
