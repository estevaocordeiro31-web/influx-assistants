import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, studentProfiles, InsertStudentProfile, chunks, conversations, InsertConversation, messages, InsertMessage, studentChunkProgress, alerts, InsertAlert } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Student profile queries
export async function getStudentProfile(studentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, studentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createStudentProfile(data: InsertStudentProfile) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(studentProfiles).values(data);
  return getStudentProfile(data.userId);
}

// Chunks queries
export async function getChunksByLevel(level: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chunks).where(eq(chunks.level, level as any));
}

export async function getChunksByContext(context: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chunks).where(eq(chunks.context, context as any));
}

// Conversation queries
export async function createConversation(data: InsertConversation) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(conversations).values(data);
  return result;
}

export async function getConversationsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(conversations).where(eq(conversations.studentId, studentId));
}

// Message queries
export async function addMessageToConversation(data: InsertMessage) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(messages).values(data);
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages).where(eq(messages.conversationId, conversationId));
}

// Student chunk progress
export async function getStudentChunkProgress(studentId: number, chunkId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(studentChunkProgress).where(
    and(eq(studentChunkProgress.studentId, studentId), eq(studentChunkProgress.chunkId, chunkId))
  ).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateChunkProgress(studentId: number, chunkId: number, isCorrect: boolean) {
  const db = await getDb();
  if (!db) return undefined;
  
  let progress = await getStudentChunkProgress(studentId, chunkId);
  if (!progress) {
    await db.insert(studentChunkProgress).values({
      studentId,
      chunkId,
      masteryLevel: 'learning',
      correctAnswers: isCorrect ? 1 : 0,
      totalAttempts: 1,
    });
  } else {
    const newCorrectAnswers = progress.correctAnswers + (isCorrect ? 1 : 0);
    const newTotalAttempts = progress.totalAttempts + 1;
    const masteryLevel = newCorrectAnswers / newTotalAttempts > 0.8 ? 'mastered' : 'practicing';
    
    await db.update(studentChunkProgress)
      .set({
        correctAnswers: newCorrectAnswers,
        totalAttempts: newTotalAttempts,
        masteryLevel: masteryLevel as any,
        lastPracticedAt: new Date(),
      })
      .where(and(eq(studentChunkProgress.studentId, studentId), eq(studentChunkProgress.chunkId, chunkId)));
  }
}

// Alerts
export async function createAlert(data: InsertAlert) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(alerts).values(data);
}
