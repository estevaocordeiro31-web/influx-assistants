import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";
import * as blogEngagement from "../blog-engagement";

// Mock the blog engagement functions
vi.mock("../blog-engagement", {
  checkAndUnlockBadges: vi.fn(),
  addTipToFavorites: vi.fn(),
  removeTipFromFavorites: vi.fn(),
  getStudentFavoriteTips: vi.fn(),
  saveTipFeedback: vi.fn(),
  getStudentBadges: vi.fn(),
  getTipFeedbackStats: vi.fn(),
});

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createBlogEngagementContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "student-001",
    email: "student@example.com",
    name: "Test Student",
    loginMethod: "manus",
    role: "student",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Blog Engagement Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve adicionar uma dica aos favoritos", async () => {
    const { ctx } = createBlogEngagementContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(blogEngagement.addTipToFavorites).mockResolvedValue({
      success: true,
      message: "Tip added to favorites",
    });

    const result = await caller.blogEngagement.addFavorite({
      tipId: "tip-1",
      tipTitle: "Test Tip",
      tipCategory: "phrasal-verbs",
    });

    expect(result.success).toBe(true);
    expect(blogEngagement.addTipToFavorites).toHaveBeenCalledWith(
      1,
      "tip-1",
      "Test Tip",
      "phrasal-verbs"
    );
  });

  it("deve remover uma dica dos favoritos", async () => {
    const { ctx } = createBlogEngagementContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(blogEngagement.removeTipFromFavorites).mockResolvedValue({
      success: true,
      message: "Tip removed from favorites",
    });

    const result = await caller.blogEngagement.removeFavorite({
      tipId: "tip-1",
    });

    expect(result.success).toBe(true);
    expect(blogEngagement.removeTipFromFavorites).toHaveBeenCalledWith(1, "tip-1");
  });

  it("deve obter os favoritos do aluno", async () => {
    const { ctx } = createBlogEngagementContext();
    const caller = appRouter.createCaller(ctx);

    const mockFavorites = [
      {
        id: 1,
        studentId: 1,
        tipId: "tip-1",
        tipTitle: "Test Tip",
        tipCategory: "phrasal-verbs",
        savedAt: new Date(),
        createdAt: new Date(),
      },
    ];

    vi.mocked(blogEngagement.getStudentFavoriteTips).mockResolvedValue(
      mockFavorites as any
    );

    const result = await caller.blogEngagement.getFavorites();

    expect(result.success).toBe(true);
    expect(result.total).toBe(1);
    expect(blogEngagement.getStudentFavoriteTips).toHaveBeenCalledWith(1);
  });

  it("deve salvar feedback de uma dica", async () => {
    const { ctx } = createBlogEngagementContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(blogEngagement.saveTipFeedback).mockResolvedValue({
      success: true,
      message: "Feedback saved",
    });

    const result = await caller.blogEngagement.saveFeedback({
      tipId: "tip-1",
      tipTitle: "Test Tip",
      feedback: "useful",
      notes: "Very helpful",
    });

    expect(result.success).toBe(true);
    expect(blogEngagement.saveTipFeedback).toHaveBeenCalledWith(
      1,
      "tip-1",
      "Test Tip",
      "useful",
      "Very helpful"
    );
  });

  it("deve obter os badges do aluno", async () => {
    const { ctx } = createBlogEngagementContext();
    const caller = appRouter.createCaller(ctx);

    const mockBadges = [
      {
        id: 1,
        studentId: 1,
        badgeName: "Primeiro Passo",
        badgeDescription: "Leu a primeira dica do blog",
        badgeIcon: "🌱",
        tipsCompleted: 1,
        unlockedAt: new Date(),
        createdAt: new Date(),
      },
    ];

    vi.mocked(blogEngagement.getStudentBadges).mockResolvedValue(
      mockBadges as any
    );

    const result = await caller.blogEngagement.getBadges();

    expect(result.success).toBe(true);
    expect(result.total).toBe(1);
    expect(blogEngagement.getStudentBadges).toHaveBeenCalledWith(1);
  });

  it("deve obter estatísticas de feedback de uma dica", async () => {
    const { ctx } = createBlogEngagementContext();
    const caller = appRouter.createCaller(ctx);

    const mockStats = {
      tipId: "tip-1",
      totalFeedback: 10,
      useful: 8,
      notUseful: 2,
      usefulPercentage: 80,
    };

    vi.mocked(blogEngagement.getTipFeedbackStats).mockResolvedValue(mockStats);

    const result = await caller.blogEngagement.getTipStats({
      tipId: "tip-1",
    });

    expect(result.success).toBe(true);
    expect(result.stats.usefulPercentage).toBe(80);
    expect(blogEngagement.getTipFeedbackStats).toHaveBeenCalledWith("tip-1");
  });
});
