import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { 
  vacationPlus2Progress, 
  vacationPlus2VocabularyProgress, 
  vacationPlus2DialogueProgress,
  quizResults,
  leaderboard,
  pointsHistory
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const vacationPlus2Router = router({
  // Get progress for all lessons
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return {};
    
    const progress = await db
      .select()
      .from(vacationPlus2Progress)
      .where(eq(vacationPlus2Progress.studentId, ctx.user.id));
    
    // Create a map of lesson progress
    const progressMap: Record<number, typeof progress[0]> = {};
    progress.forEach((p: typeof progress[0]) => {
      progressMap[p.lessonNumber] = p;
    });
    
    return progressMap;
  }),

  // Get progress for a specific lesson
  getLessonProgress: protectedProcedure
    .input(z.object({ lessonNumber: z.number().min(1).max(8) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const [progress] = await db
        .select()
        .from(vacationPlus2Progress)
        .where(
          and(
            eq(vacationPlus2Progress.studentId, ctx.user.id),
            eq(vacationPlus2Progress.lessonNumber, input.lessonNumber)
          )
        );
      
      return progress || null;
    }),

  // Start a lesson (create progress record)
  startLesson: protectedProcedure
    .input(z.object({ lessonNumber: z.number().min(1).max(8) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      
      // Check if already started
      const [existing] = await db
        .select()
        .from(vacationPlus2Progress)
        .where(
          and(
            eq(vacationPlus2Progress.studentId, ctx.user.id),
            eq(vacationPlus2Progress.lessonNumber, input.lessonNumber)
          )
        );
      
      if (existing) {
        return existing;
      }
      
      // Create new progress record
      const [result] = await db.insert(vacationPlus2Progress).values({
        studentId: ctx.user.id,
        lessonNumber: input.lessonNumber,
        progressPercentage: "0",
      });
      
      return { id: result.insertId, lessonNumber: input.lessonNumber };
    }),

  // Update section completion
  updateSection: protectedProcedure
    .input(z.object({
      lessonNumber: z.number().min(1).max(8),
      section: z.enum(["overview", "vocabulary", "dialogues", "cultural_tips", "exercises"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      
      const [existing] = await db
        .select()
        .from(vacationPlus2Progress)
        .where(
          and(
            eq(vacationPlus2Progress.studentId, ctx.user.id),
            eq(vacationPlus2Progress.lessonNumber, input.lessonNumber)
          )
        );
      
      if (!existing) {
        // Create new progress record
        await db.insert(vacationPlus2Progress).values({
          studentId: ctx.user.id,
          lessonNumber: input.lessonNumber,
          sectionCompleted: input.section,
          lastActivityAt: new Date(),
        });
      } else {
        // Update existing
        await db
          .update(vacationPlus2Progress)
          .set({
            sectionCompleted: input.section,
            lastActivityAt: new Date(),
          })
          .where(eq(vacationPlus2Progress.id, existing.id));
      }
      
      return { success: true };
    }),

  // Track dialogue listened
  trackDialogue: protectedProcedure
    .input(z.object({
      lessonNumber: z.number().min(1).max(8),
      dialogueId: z.string(),
      character: z.enum(["lucas", "emily", "aiko"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      
      // Check if already tracked
      const [existing] = await db
        .select()
        .from(vacationPlus2DialogueProgress)
        .where(
          and(
            eq(vacationPlus2DialogueProgress.studentId, ctx.user.id),
            eq(vacationPlus2DialogueProgress.lessonNumber, input.lessonNumber),
            eq(vacationPlus2DialogueProgress.dialogueId, input.dialogueId)
          )
        );
      
      if (existing) {
        // Increment listen count
        await db
          .update(vacationPlus2DialogueProgress)
          .set({
            listenedCount: existing.listenedCount + 1,
            lastListenedAt: new Date(),
          })
          .where(eq(vacationPlus2DialogueProgress.id, existing.id));
      } else {
        // Create new record
        await db.insert(vacationPlus2DialogueProgress).values({
          studentId: ctx.user.id,
          lessonNumber: input.lessonNumber,
          dialogueId: input.dialogueId,
          character: input.character,
          listenedCount: 1,
          lastListenedAt: new Date(),
        });
      }
      
      // Update main progress
      const [progress] = await db
        .select()
        .from(vacationPlus2Progress)
        .where(
          and(
            eq(vacationPlus2Progress.studentId, ctx.user.id),
            eq(vacationPlus2Progress.lessonNumber, input.lessonNumber)
          )
        );
      
      if (progress) {
        await db
          .update(vacationPlus2Progress)
          .set({
            dialoguesListened: progress.dialoguesListened + 1,
            lastActivityAt: new Date(),
          })
          .where(eq(vacationPlus2Progress.id, progress.id));
      }
      
      return { success: true };
    }),

  // Track vocabulary item
  trackVocabulary: protectedProcedure
    .input(z.object({
      lessonNumber: z.number().min(1).max(8),
      vocabularyItem: z.string(),
      character: z.enum(["lucas", "emily", "aiko"]),
      audioListened: z.boolean().optional(),
      markedAsLearned: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      
      const [existing] = await db
        .select()
        .from(vacationPlus2VocabularyProgress)
        .where(
          and(
            eq(vacationPlus2VocabularyProgress.studentId, ctx.user.id),
            eq(vacationPlus2VocabularyProgress.lessonNumber, input.lessonNumber),
            eq(vacationPlus2VocabularyProgress.vocabularyItem, input.vocabularyItem)
          )
        );
      
      if (existing) {
        await db
          .update(vacationPlus2VocabularyProgress)
          .set({
            audioListened: input.audioListened ?? existing.audioListened,
            markedAsLearned: input.markedAsLearned ?? existing.markedAsLearned,
            practiceCount: existing.practiceCount + 1,
          })
          .where(eq(vacationPlus2VocabularyProgress.id, existing.id));
      } else {
        await db.insert(vacationPlus2VocabularyProgress).values({
          studentId: ctx.user.id,
          lessonNumber: input.lessonNumber,
          vocabularyItem: input.vocabularyItem,
          character: input.character,
          audioListened: input.audioListened ?? false,
          markedAsLearned: input.markedAsLearned ?? false,
          practiceCount: 1,
        });
      }
      
      return { success: true };
    }),

  // Save quiz result
  saveQuizResult: protectedProcedure
    .input(z.object({
      lessonNumber: z.number().min(1).max(8),
      score: z.number().min(0),
      totalQuestions: z.number().min(1),
      passed: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      
      const [existing] = await db
        .select()
        .from(vacationPlus2Progress)
        .where(
          and(
            eq(vacationPlus2Progress.studentId, ctx.user.id),
            eq(vacationPlus2Progress.lessonNumber, input.lessonNumber)
          )
        );
      
      const percentage = Math.round((input.score / input.totalQuestions) * 100);
      
      if (existing) {
        await db
          .update(vacationPlus2Progress)
          .set({
            quizScore: input.score,
            quizTotal: input.totalQuestions,
            quizPassed: input.passed,
            progressPercentage: input.passed ? "100" : String(percentage),
            completedAt: input.passed ? new Date() : null,
            lastActivityAt: new Date(),
          })
          .where(eq(vacationPlus2Progress.id, existing.id));
      } else {
        await db.insert(vacationPlus2Progress).values({
          studentId: ctx.user.id,
          lessonNumber: input.lessonNumber,
          quizScore: input.score,
          quizTotal: input.totalQuestions,
          quizPassed: input.passed,
          progressPercentage: input.passed ? "100" : String(percentage),
          completedAt: input.passed ? new Date() : null,
        });
      }
      
      // Tambem salvar no quiz_results para o leaderboard
      const videoTitle = `Vacation Plus 2 - Unit ${input.lessonNumber}`;
      const correctAnswers = Math.round((input.score / 100) * input.totalQuestions);
      const pointsEarned = input.passed ? 10 : 0;
      
      await db.insert(quizResults).values({
        studentId: ctx.user.id,
        videoId: `vp2-unit-${input.lessonNumber}`,
        videoTitle,
        score: percentage,
        totalQuestions: input.totalQuestions,
        correctAnswers,
        passed: input.passed,
        pointsEarned,
      });
      
      return { success: true, passed: input.passed, percentage };
    }),

  // Get all quiz results
  getQuizResults: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return {};
    
    const progress = await db
      .select()
      .from(vacationPlus2Progress)
      .where(eq(vacationPlus2Progress.studentId, ctx.user.id));
    
    const results: Record<number, { score: number; total: number; passed: boolean }> = {};
    progress.forEach((p: typeof progress[0]) => {
      if (p.quizScore !== null && p.quizTotal !== null) {
        results[p.lessonNumber] = {
          score: p.quizScore,
          total: p.quizTotal,
          passed: p.quizPassed ?? false,
        };
      }
    });
    
    return results;
  }),

  // Complete a lesson
  completeLesson: protectedProcedure
    .input(z.object({ lessonNumber: z.number().min(1).max(8) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      
      const [existing] = await db
        .select()
        .from(vacationPlus2Progress)
        .where(
          and(
            eq(vacationPlus2Progress.studentId, ctx.user.id),
            eq(vacationPlus2Progress.lessonNumber, input.lessonNumber)
          )
        );
      
      if (existing) {
        await db
          .update(vacationPlus2Progress)
          .set({
            progressPercentage: "100",
            completedAt: new Date(),
            lastActivityAt: new Date(),
          })
          .where(eq(vacationPlus2Progress.id, existing.id));
      }
      
      return { success: true };
    }),
});
