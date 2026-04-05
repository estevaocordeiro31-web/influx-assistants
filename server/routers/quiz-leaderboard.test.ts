import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "../db";
import { users, quizResults, leaderboard, pointsHistory } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Quiz Leaderboard Router", () => {
  let db: any;
  let testUserId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database not available");

    // Criar usuário de teste
    const result = await db.insert(users).values({
      openId: "test-user-" + Date.now(),
      name: "Test User",
      email: "test@example.com",
    });
    testUserId = result.insertId;
  });

  afterAll(async () => {
    if (!db) return;

    // Limpar dados de teste
    await db.delete(pointsHistory).where(eq(pointsHistory.studentId, testUserId));
    await db.delete(quizResults).where(eq(quizResults.studentId, testUserId));
    await db.delete(leaderboard).where(eq(leaderboard.studentId, testUserId));
    await db.delete(users).where(eq(users.id, testUserId));
  });

  it("should save quiz result with passing score", async () => {
    const result = await db.insert(quizResults).values({
      studentId: testUserId,
      videoId: "unit01",
      videoTitle: "Unit 1: Going on Vacation",
      score: 80,
      totalQuestions: 5,
      correctAnswers: 4,
      passed: true,
      pointsEarned: 10,
    });

    expect(result.insertId).toBeGreaterThan(0);

    // Verificar se foi salvo
    const saved = await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.studentId, testUserId))
      .limit(1);

    expect(saved).toHaveLength(1);
    expect(saved[0].score).toBe(80);
    expect(saved[0].passed).toBe(true);
  });

  it("should save quiz result with failing score", async () => {
    const result = await db.insert(quizResults).values({
      studentId: testUserId,
      videoId: "unit02",
      videoTitle: "Unit 2: Restaurant",
      score: 60,
      totalQuestions: 5,
      correctAnswers: 3,
      passed: false,
      pointsEarned: 0,
    });

    expect(result.insertId).toBeGreaterThan(0);

    const saved = await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.studentId, testUserId))
      .orderBy((t: any) => t.id)
      .limit(1);

    expect(saved[0].score).toBe(60);
    expect(saved[0].passed).toBe(false);
  });

  it("should create leaderboard entry", async () => {
    const result = await db.insert(leaderboard).values({
      studentId: testUserId,
      studentName: "Test User",
      totalPoints: 10,
      quizzesCompleted: 1,
      lessonsCompleted: 0,
    });

    expect(result.insertId).toBeGreaterThan(0);

    const saved = await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.studentId, testUserId))
      .limit(1);

    expect(saved).toHaveLength(1);
    expect(saved[0].totalPoints).toBe(10);
    expect(saved[0].quizzesCompleted).toBe(1);
  });

  it("should save points history", async () => {
    const result = await db.insert(pointsHistory).values({
      studentId: testUserId,
      points: 10,
      reason: "quiz_completed",
      relatedId: 0,
    });

    expect(result.insertId).toBeGreaterThan(0);

    const saved = await db
      .select()
      .from(pointsHistory)
      .where(eq(pointsHistory.studentId, testUserId))
      .limit(1);

    expect(saved).toHaveLength(1);
    expect(saved[0].points).toBe(10);
    expect(saved[0].reason).toBe("quiz_completed");
  });

  it("should track multiple quiz results", async () => {
    // Inserir 3 quizzes
    for (let i = 0; i < 3; i++) {
      await db.insert(quizResults).values({
        studentId: testUserId,
        videoId: `unit0${i + 1}`,
        videoTitle: `Unit ${i + 1}`,
        score: 75 + i * 5,
        totalQuestions: 5,
        correctAnswers: 4 + i,
        passed: true,
        pointsEarned: 10,
      });
    }

    const results = await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.studentId, testUserId));

    expect(results.length).toBeGreaterThanOrEqual(3);
  });
});
