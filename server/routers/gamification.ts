import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { invokeLLM } from "../_core/llm";
import { sql } from "drizzle-orm";
export const gamificationRouter = router({
  getProgress: protectedProcedure
    .input(z.object({ lessonId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { progress: [], streak: { current_streak: 0, longest_streak: 0 }, totalPoints: 0 };
      const userId = ctx.user.openId;
      
      const progressQuery = input.lessonId
        ? sql`SELECT * FROM student_practice_progress WHERE user_id = ${userId} AND lesson_id = ${input.lessonId}`
        : sql`SELECT * FROM student_practice_progress WHERE user_id = ${userId}`;
      
      const progressResult = await db.execute(progressQuery);
      const progressRows = Array.isArray(progressResult) ? progressResult[0] : [];
      
      const streakResult = await db.execute(sql`SELECT * FROM daily_streaks WHERE user_id = ${userId}`);
      const streakRows = Array.isArray(streakResult) ? streakResult[0] : [];
      
      const totalPointsResult = await db.execute(
        sql`SELECT COALESCE(SUM(total_points), 0) as total FROM student_practice_progress WHERE user_id = ${userId}`
      );
      const totalRows = Array.isArray(totalPointsResult) ? totalPointsResult[0] : [];
      
      return {
        progress: progressRows || [],
        streak: (streakRows as unknown[])?.[0] || { current_streak: 0, longest_streak: 0 },
        totalPoints: ((totalRows as unknown[])?.[0] as { total: number })?.total || 0,
      };
    }),

  saveQuizAttempt: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      chunkExpression: z.string(),
      userAnswer: z.string(),
      correctAnswer: z.string(),
      isCorrect: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { pointsEarned: 0, isCorrect: input.isCorrect };
      const userId = ctx.user.openId;
      const pointsEarned = input.isCorrect ? 20 : 0;
      
      await db.execute(sql`
        INSERT INTO quiz_attempts (user_id, lesson_id, chunk_expression, user_answer, correct_answer, is_correct, points_earned)
        VALUES (${userId}, ${input.lessonId}, ${input.chunkExpression}, ${input.userAnswer}, ${input.correctAnswer}, ${input.isCorrect}, ${pointsEarned})
      `);
      
      await db.execute(sql`
        INSERT INTO student_practice_progress (user_id, lesson_id, total_points, quizzes_completed)
        VALUES (${userId}, ${input.lessonId}, ${pointsEarned}, 1)
        ON DUPLICATE KEY UPDATE 
          total_points = total_points + ${pointsEarned},
          quizzes_completed = quizzes_completed + 1,
          updated_at = CURRENT_TIMESTAMP
      `);
      
      await updateStreak(db, userId);
      
      await db.execute(sql`
        INSERT INTO practice_activity_log (user_id, activity_type, lesson_id, chunk_expression, points_earned)
        VALUES (${userId}, 'quiz', ${input.lessonId}, ${input.chunkExpression}, ${pointsEarned})
      `);

      // Hook: propagar exercício e streak para o banco central (fire-and-forget)
      if (input.isCorrect) {
        import('../utils/sync').then(async ({ getStudentId, onExerciseCompleted }) => {
          const studentId = await getStudentId(ctx.user.id);
          if (studentId) await onExerciseCompleted(studentId, 100);
        }).catch(() => {});
      }
      
      return { pointsEarned, isCorrect: input.isCorrect };
    }),

  generateFeedback: protectedProcedure
    .input(z.object({
      chunkExpression: z.string(),
      correctMeaning: z.string(),
      userAnswer: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: `Você é o Fluxie, um tutor de inglês amigável. Quando o aluno erra, explique o chunk de forma clara. Seja breve (máximo 2 frases), use emojis. Responda em português.` },
            { role: "user", content: `O aluno errou "${input.chunkExpression}". Respondeu: "${input.userAnswer}". Correto: "${input.correctMeaning}". Explique brevemente.` },
          ],
        });
        return { feedback: response.choices?.[0]?.message?.content || `A expressão "${input.chunkExpression}" significa "${input.correctMeaning}". 💪` };
      } catch {
        return { feedback: `A expressão "${input.chunkExpression}" significa "${input.correctMeaning}". Continue praticando! 💪` };
      }
    }),

  logFlashcardPractice: protectedProcedure
    .input(z.object({ lessonId: z.number(), chunkExpression: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { pointsEarned: 0 };
      const userId = ctx.user.openId;
      const pointsEarned = 5;
      
      await db.execute(sql`
        INSERT INTO student_practice_progress (user_id, lesson_id, total_points, flashcards_completed)
        VALUES (${userId}, ${input.lessonId}, ${pointsEarned}, 1)
        ON DUPLICATE KEY UPDATE 
          total_points = total_points + ${pointsEarned},
          flashcards_completed = flashcards_completed + 1,
          updated_at = CURRENT_TIMESTAMP
      `);
      
      await updateStreak(db, userId);
      
      await db.execute(sql`
        INSERT INTO practice_activity_log (user_id, activity_type, lesson_id, chunk_expression, points_earned)
        VALUES (${userId}, 'flashcard', ${input.lessonId}, ${input.chunkExpression}, ${pointsEarned})
      `);

      // Hook: propagar streak para o banco central (fire-and-forget)
      import('../utils/sync').then(async ({ getStudentId, onStreakUpdated }) => {
        const studentId = await getStudentId(ctx.user.id);
        if (studentId) {
          const streakResult2 = await db!.execute(sql`SELECT current_streak FROM daily_streaks WHERE user_id = ${userId}`);
          const sRows = Array.isArray(streakResult2) ? streakResult2[0] : [];
          const streak = (sRows as any[])?.[0]?.current_streak || 0;
          await onStreakUpdated(studentId, streak);
        }
      }).catch(() => {});
      
      return { pointsEarned };
    }),

  logPronunciationPractice: protectedProcedure
    .input(z.object({ lessonId: z.number(), chunkExpression: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { pointsEarned: 0 };
      const userId = ctx.user.openId;
      const pointsEarned = 10;
      
      await db.execute(sql`
        INSERT INTO student_practice_progress (user_id, lesson_id, total_points, pronunciation_practiced)
        VALUES (${userId}, ${input.lessonId}, ${pointsEarned}, 1)
        ON DUPLICATE KEY UPDATE 
          total_points = total_points + ${pointsEarned},
          pronunciation_practiced = pronunciation_practiced + 1,
          updated_at = CURRENT_TIMESTAMP
      `);
      
      await updateStreak(db, userId);
      
      await db.execute(sql`
        INSERT INTO practice_activity_log (user_id, activity_type, lesson_id, chunk_expression, points_earned)
        VALUES (${userId}, 'pronunciation', ${input.lessonId}, ${input.chunkExpression}, ${pointsEarned})
      `);

      // Hook: propagar streak para o banco central (fire-and-forget)
      import('../utils/sync').then(async ({ getStudentId, onStreakUpdated }) => {
        const studentId = await getStudentId(ctx.user.id);
        if (studentId) {
          const streakResult2 = await db!.execute(sql`SELECT current_streak FROM daily_streaks WHERE user_id = ${userId}`);
          const sRows = Array.isArray(streakResult2) ? streakResult2[0] : [];
          const streak = (sRows as any[])?.[0]?.current_streak || 0;
          await onStreakUpdated(studentId, streak);
        }
      }).catch(() => {});
      
      return { pointsEarned };
    }),

  getStreak: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { currentStreak: 0, longestStreak: 0, lastPracticeDate: null, totalPracticeDays: 0 };
    const userId = ctx.user.openId;
    
    const result = await db.execute(sql`SELECT * FROM daily_streaks WHERE user_id = ${userId}`);
    const rows = Array.isArray(result) ? result[0] : [];
    
    const streak = (rows as unknown[])?.[0] as {
      current_streak: number;
      longest_streak: number;
      last_practice_date: string;
      total_practice_days: number;
    } | undefined;
    
    return {
      currentStreak: streak?.current_streak || 0,
      longestStreak: streak?.longest_streak || 0,
      lastPracticeDate: streak?.last_practice_date || null,
      totalPracticeDays: streak?.total_practice_days || 0,
    };
  }),
});

async function updateStreak(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const existingResult = await db.execute(sql`SELECT * FROM daily_streaks WHERE user_id = ${userId}`);
  const rows = Array.isArray(existingResult) ? existingResult[0] : [];
  const existing = (rows as unknown[])?.[0] as { current_streak: number; longest_streak: number; last_practice_date: string; } | undefined;
  
  if (!existing) {
    await db.execute(sql`INSERT INTO daily_streaks (user_id, current_streak, longest_streak, last_practice_date, total_practice_days) VALUES (${userId}, 1, 1, ${today}, 1)`);
    return;
  }
  
  if (existing.last_practice_date === today) return;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const newStreak = existing.last_practice_date === yesterdayStr ? existing.current_streak + 1 : 1;
  const newLongest = Math.max(newStreak, existing.longest_streak);
  
  await db.execute(sql`
    UPDATE daily_streaks SET current_streak = ${newStreak}, longest_streak = ${newLongest}, last_practice_date = ${today}, total_practice_days = total_practice_days + 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ${userId}
  `);
}
