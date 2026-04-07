import { describe, it, expect, vi, beforeEach } from "vitest";
import * as blogTipsModule from "../blog-tips";

describe("Blog Tips Module", { timeout: 10000 }, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch blog tips successfully", async () => {
    const tips = await blogTipsModule.fetchBlogTips();

    expect(tips).toBeDefined();
    expect(Array.isArray(tips)).toBe(true);
    expect(tips.length).toBeGreaterThan(0);
  });

  it("should have required fields in tips", async () => {
    const tips = await blogTipsModule.fetchBlogTips();

    if (tips.length > 0) {
      const tip = tips[0];
      expect(tip).toHaveProperty("id");
      expect(tip).toHaveProperty("title");
      expect(tip).toHaveProperty("category");
      expect(tip).toHaveProperty("date");
      expect(tip).toHaveProperty("description");
      expect(tip).toHaveProperty("url");
      expect(tip).toHaveProperty("keywords");
    }
  });

  it("should analyze difficulties from exercise history", async () => {
    const exerciseHistory = [
      { category: "phrasal-verbs", correct: false },
      { category: "phrasal-verbs", correct: false },
      { category: "chunks", correct: false },
      { category: "vocabulary", correct: true },
    ];

    const difficulties = await blogTipsModule.analyzeDifficulties(exerciseHistory);

    expect(Array.isArray(difficulties)).toBe(true);
    expect(difficulties.length).toBeGreaterThan(0);
    expect(difficulties).toContain("phrasal-verbs");
  });

  it("should handle empty exercise history", async () => {
    const difficulties = await blogTipsModule.analyzeDifficulties([]);

    expect(Array.isArray(difficulties)).toBe(true);
    expect(difficulties.length).toBe(0);
  });

  it("should handle all correct exercises", async () => {
    const exerciseHistory = [
      { category: "phrasal-verbs", correct: true },
      { category: "chunks", correct: true },
      { category: "vocabulary", correct: true },
    ];

    const difficulties = await blogTipsModule.analyzeDifficulties(exerciseHistory);

    expect(Array.isArray(difficulties)).toBe(true);
    expect(difficulties.length).toBe(0);
  });

  it("should recommend tips for student difficulties", async () => {
    const mockTips = [
      {
        id: "tip-001",
        title: "Phrasal Verbs Essenciais",
        description: "Aprenda os phrasal verbs mais comuns",
        category: "Phrasal Verbs",
        keywords: ["phrasal-verbs"],
        url: "https://influx.com.br/blog/phrasal-verbs",
        date: "2026-01-19",
      },
      {
        id: "tip-002",
        title: "Chunks Úteis",
        description: "Chunks para melhorar sua fluência",
        category: "Chunks",
        keywords: ["chunks"],
        url: "https://influx.com.br/blog/chunks",
        date: "2026-01-18",
      },
    ];

    const recommended = await blogTipsModule.recommendTipsForStudent(
      ["phrasal-verbs"],
      mockTips
    );

    expect(Array.isArray(recommended)).toBe(true);
  });
});
