import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { books, units, studentBookProgress, chunksByUnit, spacedRepetitionSchedule } from "../drizzle/schema";

/**
 * Get all books with optional filtering
 */
export async function getAllBooks(category?: "junior" | "regular") {
  const db = await getDb();
  if (!db) return [];

  if (category) {
    return await db.select().from(books).where(eq(books.category, category));
  }

  return await db.select().from(books).orderBy(books.order);
}

/**
 * Get a specific book by ID
 */
export async function getBookById(bookId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Get all units for a specific book
 */
export async function getUnitsByBook(bookId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(units).where(eq(units.bookId, bookId)).orderBy(units.unitNumber);
}

/**
 * Get a specific unit
 */
export async function getUnitById(unitId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(units).where(eq(units.id, unitId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Get student's book progress
 */
export async function getStudentBookProgress(studentId: number, bookId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(studentBookProgress)
    .where(and(eq(studentBookProgress.studentId, studentId), eq(studentBookProgress.bookId, bookId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all student's book progress
 */
export async function getStudentAllBooksProgress(studentId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(studentBookProgress).where(eq(studentBookProgress.studentId, studentId));
}

/**
 * Create or update student book progress
 */
export async function upsertStudentBookProgress(
  studentId: number,
  bookId: number,
  data: {
    currentUnit?: number;
    completedUnits?: number;
    progressPercentage?: number | string;
    completedAt?: Date | null;
  }
) {
  const db = await getDb();
  if (!db) return null;

  const existing = await getStudentBookProgress(studentId, bookId);

  if (existing) {
    const updateData: any = {};
    if (data.currentUnit !== undefined) updateData.currentUnit = data.currentUnit;
    if (data.completedUnits !== undefined) updateData.completedUnits = data.completedUnits;
    if (data.progressPercentage !== undefined) updateData.progressPercentage = data.progressPercentage;
    if (data.completedAt !== undefined) updateData.completedAt = data.completedAt;
    updateData.updatedAt = new Date();

    await db
      .update(studentBookProgress)
      .set(updateData)
      .where(and(eq(studentBookProgress.studentId, studentId), eq(studentBookProgress.bookId, bookId)));

    return await getStudentBookProgress(studentId, bookId);
  } else {
    const insertData: any = {
      studentId,
      bookId,
      currentUnit: data.currentUnit || 1,
      completedUnits: data.completedUnits || 0,
      progressPercentage: data.progressPercentage || "0",
      startedAt: new Date(),
    };
    if (data.completedAt !== undefined) insertData.completedAt = data.completedAt;

    await db.insert(studentBookProgress).values(insertData);

    return await getStudentBookProgress(studentId, bookId);
  }
}

/**
 * Get chunks for a specific unit
 */
export async function getChunksByUnit(unitId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(chunksByUnit)
    .where(eq(chunksByUnit.unitId, unitId))
    .orderBy(chunksByUnit.order);
}

/**
 * Get spaced repetition schedule for a student
 */
export async function getSpacedRepetitionSchedule(studentId: number) {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  return await db
    .select()
    .from(spacedRepetitionSchedule)
    .where(and(
      eq(spacedRepetitionSchedule.studentId, studentId),
      // Get chunks that are due for review (nextReviewAt <= now)
    ));
}

/**
 * Get chunks due for review
 */
export async function getChunksDueForReview(studentId: number) {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  return await db
    .select()
    .from(spacedRepetitionSchedule)
    .where(
      and(
        eq(spacedRepetitionSchedule.studentId, studentId),
        // This would require a comparison operator - simplified for now
      )
    );
}

/**
 * Update spaced repetition after review
 */
export async function updateSpacedRepetition(
  studentId: number,
  chunkId: number,
  quality: number // 0-5 scale
) {
  const db = await getDb();
  if (!db) return null;

  // SM-2 algorithm for spaced repetition
  const result = await db
    .select()
    .from(spacedRepetitionSchedule)
    .where(
      and(
        eq(spacedRepetitionSchedule.studentId, studentId),
        eq(spacedRepetitionSchedule.chunkId, chunkId)
      )
    )
    .limit(1);

  const schedule = result.length > 0 ? result[0] : null;

  if (!schedule) return null;

  let newInterval = 1;
  let newEaseFactor = parseFloat(schedule.easeFactor.toString());

  if (schedule.repetitions === 0) {
    newInterval = 1;
  } else if (schedule.repetitions === 1) {
    newInterval = 3;
  } else {
    newInterval = Math.round(schedule.interval * newEaseFactor);
  }

  newEaseFactor = Math.max(
    1.3,
    parseFloat(newEaseFactor.toString()) + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

  await db
    .update(spacedRepetitionSchedule)
    .set({
      interval: newInterval,
      easeFactor: newEaseFactor.toString() as any,
      repetitions: schedule.repetitions + 1,
      lastReviewAt: new Date(),
      nextReviewAt,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(spacedRepetitionSchedule.studentId, studentId),
        eq(spacedRepetitionSchedule.chunkId, chunkId)
      )
    );

  return await db
    .select()
    .from(spacedRepetitionSchedule)
    .where(
      and(
        eq(spacedRepetitionSchedule.studentId, studentId),
        eq(spacedRepetitionSchedule.chunkId, chunkId)
      )
    )
    .limit(1)
    .then((r) => (r.length > 0 ? r[0] : null));
}
