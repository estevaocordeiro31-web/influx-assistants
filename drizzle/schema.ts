import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "student"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Student profiles table
export const studentProfiles = mysqlTable("student_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  objective: mysqlEnum("objective", ["career", "travel", "studies", "other"]).notNull(),
  currentLevel: mysqlEnum("current_level", ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced", "proficient"]).default("beginner").notNull(),
  totalHoursLearned: int("total_hours_learned").default(0).notNull(),
  streakDays: int("streak_days").default(0).notNull(),
  lastActivityAt: timestamp("last_activity_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertStudentProfile = typeof studentProfiles.$inferInsert;

// Chunks library table
export const chunks = mysqlTable("chunks", {
  id: int("id").autoincrement().primaryKey(),
  englishChunk: text("english_chunk").notNull(),
  portugueseEquivalent: text("portuguese_equivalent").notNull(),
  level: mysqlEnum("level", ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"]).notNull(),
  context: mysqlEnum("context", ["career", "travel", "studies", "daily_life", "general"]).notNull(),
  example: text("example"),
  nativeUsageFrequency: mysqlEnum("native_usage_frequency", ["very_common", "common", "occasional", "rare"]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Chunk = typeof chunks.$inferSelect;
export type InsertChunk = typeof chunks.$inferInsert;

// Conversations table
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  simulationType: mysqlEnum("simulation_type", ["career", "travel", "studies", "free_chat", "pronunciation_practice"]).notNull(),
  title: varchar("title", { length: 255 }),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

// Messages table
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversation_id").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  chunksUsed: json("chunks_used"),
  audioUrl: varchar("audio_url", { length: 512 }),
  audioTranscription: text("audio_transcription"),
  pronunciationScore: decimal("pronunciation_score", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Student progress on chunks
export const studentChunkProgress = mysqlTable("student_chunk_progress", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  chunkId: int("chunk_id").notNull(),
  masteryLevel: mysqlEnum("mastery_level", ["not_started", "learning", "practicing", "mastered"]).default("not_started").notNull(),
  correctAnswers: int("correct_answers").default(0).notNull(),
  totalAttempts: int("total_attempts").default(0).notNull(),
  lastPracticedAt: timestamp("last_practiced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentChunkProgress = typeof studentChunkProgress.$inferSelect;
export type InsertStudentChunkProgress = typeof studentChunkProgress.$inferInsert;

// Exercises table
export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  chunkId: int("chunk_id").notNull(),
  level: mysqlEnum("level", ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"]).notNull(),
  exerciseType: mysqlEnum("exercise_type", ["fill_blank", "multiple_choice", "translation", "sentence_building", "conversation"]).notNull(),
  question: text("question").notNull(),
  options: json("options"),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

// Student exercise results
export const exerciseResults = mysqlTable("exercise_results", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  exerciseId: int("exercise_id").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  studentAnswer: text("student_answer"),
  timeSpentSeconds: int("time_spent_seconds"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ExerciseResult = typeof exerciseResults.$inferSelect;
export type InsertExerciseResult = typeof exerciseResults.$inferInsert;

// Alerts for coordinators
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  coordinatorId: int("coordinator_id").notNull(),
  studentId: int("student_id").notNull(),
  alertType: mysqlEnum("alert_type", ["milestone_reached", "recurring_difficulty", "low_engagement", "high_progress"]).notNull(),
  chunkId: int("chunk_id"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;