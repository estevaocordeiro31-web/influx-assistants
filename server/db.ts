import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertUser, users, studentProfiles, InsertStudentProfile, chunks, conversations, InsertConversation, messages, InsertMessage, studentChunkProgress, alerts, InsertAlert } from "../drizzle/schema";
import { ENV } from './_core/env';
import { buildConnectionConfig } from './db-connection';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const connection = await mysql.createConnection(buildConnectionConfig(process.env.DATABASE_URL));
      _db = drizzle(connection);
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


// Student ID generation and management
export async function generateStudentId(): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const year = new Date().getFullYear();
  const prefix = `INF-${year}-`;
  
  // Get the highest existing student_id for this year
  const result = await db.execute<{ student_id: string | null }[]>(
    `SELECT student_id FROM users WHERE student_id LIKE '${prefix}%' ORDER BY student_id DESC LIMIT 1`
  );
  
  let nextNumber = 1;
  const rows = (result as unknown as any[][])[0];
  if (rows && rows.length > 0 && rows[0].student_id) {
    const lastId = rows[0].student_id as string;
    const lastNumber = parseInt(lastId.split('-')[2], 10);
    nextNumber = lastNumber + 1;
  }
  
  return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
}

export async function assignStudentId(userId: number): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  
  // Check if user already has a student_id
  const existingResult = await db.select({ studentId: users.studentId }).from(users).where(eq(users.id, userId)).limit(1);
  if (existingResult.length > 0 && existingResult[0].studentId) {
    return existingResult[0].studentId;
  }
  
  // Generate new student_id
  const newStudentId = await generateStudentId();
  
  // Update user with new student_id
  await db.update(users).set({ studentId: newStudentId }).where(eq(users.id, userId));
  
  return newStudentId;
}

export async function getStudentById(studentId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.studentId, studentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function assignStudentIdsToAllUsers(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  // Get all users without student_id
  const usersWithoutId = await db.select({ id: users.id }).from(users).where(eq(users.studentId, null as any));
  
  let count = 0;
  for (const user of usersWithoutId) {
    await assignStudentId(user.id);
    count++;
  }
  
  return count;
}


// Cache helpers for Deezer previews
export async function getCachedPreview(deezerId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { deezerPreviewCache } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    
    const cached = await db
      .select()
      .from(deezerPreviewCache)
      .where(eq(deezerPreviewCache.deezerId, deezerId))
      .limit(1);

    if (cached.length > 0) {
      const cache = cached[0];
      // Check if cache is still valid
      if (cache.expiresAt && new Date(cache.expiresAt) > new Date()) {
        return cache;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting cached preview:', error);
    return null;
  }
}

export async function cachePreview(
  deezerId: number,
  title: string,
  artist: string,
  previewUrl: string | null,
  albumCover: string | null,
  duration?: number
) {
  const db = await getDb();
  if (!db) return false;

  try {
    const { deezerPreviewCache } = await import("../drizzle/schema");
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour TTL

    await db
      .insert(deezerPreviewCache)
      .values({
        deezerId,
        title,
        artist,
        previewUrl,
        albumCover,
        duration: duration || null,
        isAvailable: !!previewUrl,
        expiresAt,
      })
      .onDuplicateKeyUpdate({
        set: {
          title,
          artist,
          previewUrl,
          albumCover,
          isAvailable: !!previewUrl,
          expiresAt,
        },
      });

    return true;
  } catch (error) {
    console.error('Error caching preview:', error);
    return false;
  }
}

export async function getFallbackAudio(deezerId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { karaokeAudioFallback } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    
    const fallback = await db
      .select()
      .from(karaokeAudioFallback)
      .where(eq(karaokeAudioFallback.deezerId, deezerId))
      .limit(1);

    return fallback.length > 0 ? fallback[0] : null;
  } catch (error) {
    console.error('Error getting fallback audio:', error);
    return null;
  }
}

export async function getCacheStats() {
  const db = await getDb();
  if (!db) return null;

  try {
    const { deezerPreviewCache } = await import("../drizzle/schema");
    
    const total = await db.select().from(deezerPreviewCache);
    const available = total.filter((c) => c.isAvailable).length;
    const expired = total.filter((c) => c.expiresAt && new Date(c.expiresAt) < new Date()).length;

    return {
      totalCached: total.length,
      availablePreviews: available,
      expiredEntries: expired,
      cacheHitRate: total.length > 0 ? ((available / total.length) * 100).toFixed(2) : '0',
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
}


// Leaderboard and scoring helpers
export async function saveEventParticipantScore(
  participantId: number,
  missionId: string,
  score: number,
  timeSpentSeconds: number = 0
) {
  const db = await getDb();
  if (!db) return false;

  try {
    const { eventMissionProgress } = await import("../drizzle/schema");
    const { eq, and } = await import("drizzle-orm");

    // Check if mission progress exists
    const existing = await db
      .select()
      .from(eventMissionProgress)
      .where(
        and(
          eq(eventMissionProgress.participantId, participantId),
          eq(eventMissionProgress.missionId, missionId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing score
      await db
        .update(eventMissionProgress)
        .set({
          score,
          completed: score > 0,
          timeSpentSeconds,
          completedAt: new Date(),
        })
        .where(
          and(
            eq(eventMissionProgress.participantId, participantId),
            eq(eventMissionProgress.missionId, missionId)
          )
        );
    } else {
      // Insert new score
      await db.insert(eventMissionProgress).values({
        participantId,
        missionId,
        score,
        completed: score > 0,
        timeSpentSeconds,
        completedAt: new Date(),
      });
    }

    // Update total points in eventParticipants
    const { eventParticipants } = await import("../drizzle/schema");
    const { eq: eqOp } = await import("drizzle-orm");

    const allMissions = await db
      .select()
      .from(eventMissionProgress)
      .where(eqOp(eventMissionProgress.participantId, participantId));

    const totalPoints = allMissions.reduce((sum, m) => sum + (m.score || 0), 0);

    await db
      .update(eventParticipants)
      .set({ totalPoints })
      .where(eqOp(eventParticipants.id, participantId));

    return true;
  } catch (error) {
    console.error("Error saving event participant score:", error);
    return false;
  }
}

export async function getEventLeaderboard(eventId: string, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { eventParticipants } = await import("../drizzle/schema");
    const { desc, eq } = await import("drizzle-orm");

    const leaderboard = await db
      .select()
      .from(eventParticipants)
      .where(eq(eventParticipants.eventId, eventId))
      .orderBy(desc(eventParticipants.totalPoints))
      .limit(limit);

    return leaderboard;
  } catch (error) {
    console.error("Error getting event leaderboard:", error);
    return [];
  }
}

export async function getParticipantRank(participantId: number, eventId: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { eventParticipants } = await import("../drizzle/schema");
    const { desc, eq } = await import("drizzle-orm");

    const allParticipants = await db
      .select()
      .from(eventParticipants)
      .where(eq(eventParticipants.eventId, eventId))
      .orderBy(desc(eventParticipants.totalPoints));

    const rank = allParticipants.findIndex((p) => p.id === participantId) + 1;
    const participant = allParticipants.find((p) => p.id === participantId);

    return {
      rank,
      totalPoints: participant?.totalPoints || 0,
      totalParticipants: allParticipants.length,
    };
  } catch (error) {
    console.error("Error getting participant rank:", error);
    return null;
  }
}
