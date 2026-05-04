import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { quizResults, leaderboard, pointsHistory } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const quizLeaderboardRouter = router({
  // Salvar resultado do quiz
  saveQuizResult: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        videoTitle: z.string(),
        score: z.number().min(0).max(100),
        totalQuestions: z.number().positive(),
        correctAnswers: z.number().nonnegative(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const studentId = ctx.user.id;
      const passed = input.score >= 70;
      const pointsEarned = passed ? 10 : 0;

      // Salvar resultado do quiz
      const result = await db.insert(quizResults).values({
        studentId,
        videoId: input.videoId,
        videoTitle: input.videoTitle,
        score: input.score,
        totalQuestions: input.totalQuestions,
        correctAnswers: input.correctAnswers,
        passed,
        pointsEarned,
      });

      // Atualizar leaderboard
      const existingLeaderboard = await db
        .select()
        .from(leaderboard)
        .where(eq(leaderboard.studentId, studentId))
        .limit(1);

      if (existingLeaderboard.length > 0) {
        // Atualizar pontos existentes
        await db
          .update(leaderboard)
          .set({
            totalPoints: existingLeaderboard[0].totalPoints + pointsEarned,
            quizzesCompleted: existingLeaderboard[0].quizzesCompleted + 1,
          })
          .where(eq(leaderboard.studentId, studentId));
      } else {
        // Criar novo registro no leaderboard
        await db.insert(leaderboard).values({
          studentId,
          studentName: ctx.user.name || "Aluno",
          totalPoints: pointsEarned,
          quizzesCompleted: 1,
          lessonsCompleted: 0,
        });
      }

      // Salvar histórico de pontos
      if (pointsEarned > 0) {
        await db.insert(pointsHistory).values({
          studentId,
          points: pointsEarned,
          reason: "quiz_completed",
          relatedId: 0,
        });
      }

      // Atualizar ranking
      await updateLeaderboardRanks();

      return {
        success: true,
        passed,
        pointsEarned,
      };
    }),

  // Obter leaderboard (top 10)
  getLeaderboard: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const leaders = await db
      .select()
      .from(leaderboard)
      .orderBy(desc(leaderboard.totalPoints))
      .limit(10);

    return leaders.map((leader: any, index: number) => ({
      ...leader,
      rank: index + 1,
    }));
  }),

  // Obter posição do aluno no leaderboard
  getStudentRank: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const studentId = ctx.user.id;

    const studentLeaderboard = await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.studentId, studentId))
      .limit(1);

    if (!studentLeaderboard.length) {
      return null;
    }

    return studentLeaderboard[0];
  }),

  // Obter histórico de pontos do aluno
  getPointsHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const studentId = ctx.user.id;

    const history = await db
      .select()
      .from(pointsHistory)
      .where(eq(pointsHistory.studentId, studentId))
      .orderBy(desc(pointsHistory.createdAt))
      .limit(20);

    return history;
  }),

  // Obter resultados de quizzes do aluno
  getQuizResults: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const studentId = ctx.user.id;

    const results = await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.studentId, studentId))
      .orderBy(desc(quizResults.completedAt));

    return results;
  }),
});

// Função auxiliar para atualizar ranking
async function updateLeaderboardRanks() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const leaders = await db
    .select()
    .from(leaderboard)
    .orderBy(desc(leaderboard.totalPoints));

  for (let i = 0; i < leaders.length; i++) {
    await db
      .update(leaderboard)
      .set({ rank: i + 1 })
      .where(eq(leaderboard.id, leaders[i].id));
  }
}
