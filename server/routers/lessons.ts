import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { lessons, lessonVocabulary, lessonChunks, lessonExamples } from "../../drizzle/schema";
import { eq, asc } from "drizzle-orm";

export const lessonsRouter = router({
  // Get all lessons for a book
  getByBook: publicProcedure
    .input(z.object({ bookId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const result = await db
        .select()
        .from(lessons)
        .where(eq(lessons.bookId, input.bookId))
        .orderBy(asc(lessons.lessonNumber));
      return result;
    }),

  // Get a single lesson with all content
  getLesson: publicProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [lesson] = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, input.lessonId));

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      const vocabulary = await db
        .select()
        .from(lessonVocabulary)
        .where(eq(lessonVocabulary.lessonId, input.lessonId));

      const chunks = await db
        .select()
        .from(lessonChunks)
        .where(eq(lessonChunks.lessonId, input.lessonId));

      const examples = await db
        .select()
        .from(lessonExamples)
        .where(eq(lessonExamples.lessonId, input.lessonId));

      return {
        lesson,
        vocabulary,
        chunks,
        examples,
      };
    }),

  // Get lessons by unit
  getByUnit: publicProcedure
    .input(z.object({ unitId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(lessons)
        .where(eq(lessons.unitId, input.unitId))
        .orderBy(asc(lessons.lessonNumber));
      return result;
    }),

  // Get vocabulary for a lesson
  getVocabulary: publicProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(lessonVocabulary)
        .where(eq(lessonVocabulary.lessonId, input.lessonId));
    }),

  // Get chunks for a lesson
  getChunks: publicProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(lessonChunks)
        .where(eq(lessonChunks.lessonId, input.lessonId));
    }),

  // Get examples for a lesson
  getExamples: publicProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(lessonExamples)
        .where(eq(lessonExamples.lessonId, input.lessonId));
    }),

  // Get summary stats for Book 5
  getBook5Stats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const lessonsData = await db
      .select()
      .from(lessons)
      .where(eq(lessons.bookId, 5));

    const vocabData = await db.select().from(lessonVocabulary);
    const chunksData = await db.select().from(lessonChunks);
    const examplesData = await db.select().from(lessonExamples);

    // Group lessons by unit
    const units: Record<number, { title: string; lessons: number[] }> = {};
    for (const lesson of lessonsData) {
      if (!units[lesson.unitId]) {
        units[lesson.unitId] = { title: getUnitTitle(lesson.unitId), lessons: [] };
      }
      units[lesson.unitId].lessons.push(lesson.lessonNumber);
    }

    return {
      totalLessons: lessonsData.length,
      totalVocabulary: vocabData.length,
      totalChunks: chunksData.length,
      totalExamples: examplesData.length,
      units: Object.entries(units).map(([id, data]) => ({
        id: parseInt(id),
        title: data.title,
        lessonCount: data.lessons.length,
        lessons: data.lessons.sort((a, b) => a - b),
      })),
    };
  }),
});

function getUnitTitle(unitId: number): string {
  const titles: Record<number, string> = {
    1: "Friends, Family & Relationships",
    2: "Shapes and Colors",
    3: "Crime and Punishment",
    4: "Permission and Prohibition",
    5: "Arguing and Making up",
    6: "Storytelling",
    7: "Advanced Topics",
  };
  return titles[unitId] || `Unit ${unitId}`;
}
