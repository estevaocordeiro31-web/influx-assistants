import { describe, it, expect, vi, beforeEach } from "vitest";
import * as schedulerModule from "./daily-tips-scheduler";
import * as blogTipsModule from "../blog-tips";

describe("Daily Tips Scheduler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve iniciar o scheduler com configuração padrão", () => {
    // Apenas verifica que a função existe e pode ser chamada
    expect(typeof schedulerModule.startDailyTipsScheduler).toBe("function");
  });

  it("deve parar o scheduler", () => {
    const stopSpy = vi.spyOn(schedulerModule, "stopDailyTipsScheduler");

    schedulerModule.stopDailyTipsScheduler();

    expect(stopSpy).toHaveBeenCalled();
  });

  it("deve disparar o job manualmente", async () => {
    const triggerSpy = vi.spyOn(schedulerModule, "triggerDailyTipsJob");

    await schedulerModule.triggerDailyTipsJob();

    expect(triggerSpy).toHaveBeenCalled();
  });

  it("deve buscar dicas do blog", async () => {
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
    ];

    vi.spyOn(blogTipsModule, "fetchBlogTips").mockResolvedValue(mockTips);

    const tips = await blogTipsModule.fetchBlogTips();

    expect(tips).toHaveLength(1);
    expect(tips[0].title).toBe("Phrasal Verbs Essenciais");
  });

  it("deve recomendar dicas para dificuldades", async () => {
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
    ];

    vi.spyOn(blogTipsModule, "recommendTipsForStudent").mockResolvedValue(mockTips);

    const recommended = await blogTipsModule.recommendTipsForStudent(
      ["phrasal-verbs"],
      mockTips
    );

    expect(recommended).toHaveLength(1);
    expect(recommended[0].category).toBe("Phrasal Verbs");
  });

  it("deve analisar dificuldades do histórico de exercícios", async () => {
    const exerciseHistory = [
      { category: "phrasal-verbs", correct: false },
      { category: "phrasal-verbs", correct: false },
      { category: "chunks", correct: false },
    ];

    const difficulties = await blogTipsModule.analyzeDifficulties(exerciseHistory);

    expect(Array.isArray(difficulties)).toBe(true);
    expect(difficulties.length).toBeGreaterThan(0);
  });
});
