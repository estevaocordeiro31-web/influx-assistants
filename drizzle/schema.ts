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
  status: mysqlEnum("status", ["ativo", "inativo", "desistente", "trancado"]).default("ativo").notNull(),
  sponteId: varchar("sponteId", { length: 64 }).unique(),
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
// Books table (inFlux curriculum)
export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  bookId: varchar("book_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  level: mysqlEnum("level", ["starter", "beginner", "elementary", "pre_intermediate", "intermediate", "upper_intermediate", "advanced"]).notNull(),
  category: mysqlEnum("category", ["junior", "regular"]).notNull(),
  stages: int("stages").default(2).notNull(),
  totalUnits: int("total_units").notNull(),
  description: text("description"),
  order: int("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

// Units table (units within each book)
export const units = mysqlTable("units", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("book_id").notNull(),
  unitNumber: int("unit_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  stage: int("stage").notNull(),
  lessons: int("lessons").notNull(),
  description: text("description"),
  learningObjectives: json("learning_objectives"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Unit = typeof units.$inferSelect;
export type InsertUnit = typeof units.$inferInsert;

// Chunks by unit table (chunks specific to each unit)
export const chunksByUnit = mysqlTable("chunks_by_unit", {
  id: int("id").autoincrement().primaryKey(),
  unitId: int("unit_id").notNull(),
  chunkId: int("chunk_id").notNull(),
  chunkType: mysqlEnum("chunk_type", ["phrasal_verb", "collocation", "expression", "grammar_structure", "vocabulary_set", "conversational_pattern"]).notNull(),
  order: int("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ChunkByUnit = typeof chunksByUnit.$inferSelect;
export type InsertChunkByUnit = typeof chunksByUnit.$inferInsert;

// Student book progress table
export const studentBookProgress = mysqlTable("student_book_progress", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  bookId: int("book_id").notNull(),
  currentUnit: int("current_unit").default(1).notNull(),
  completedUnits: int("completed_units").default(0).notNull(),
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentBookProgress = typeof studentBookProgress.$inferSelect;
export type InsertStudentBookProgress = typeof studentBookProgress.$inferInsert;

// Spaced repetition schedule table
export const spacedRepetitionSchedule = mysqlTable("spaced_repetition_schedule", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  chunkId: int("chunk_id").notNull(),
  nextReviewAt: timestamp("next_review_at").notNull(),
  interval: int("interval").default(1).notNull(),
  easeFactor: decimal("ease_factor", { precision: 3, scale: 2 }).default("2.5").notNull(),
  repetitions: int("repetitions").default(0).notNull(),
  lastReviewAt: timestamp("last_review_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SpacedRepetitionSchedule = typeof spacedRepetitionSchedule.$inferSelect;
export type InsertSpacedRepetitionSchedule = typeof spacedRepetitionSchedule.$inferInsert;

// Blog tips badges table
export const blogTipsBadges = mysqlTable("blog_tips_badges", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  badgeName: varchar("badge_name", { length: 100 }).notNull(),
  badgeDescription: text("badge_description").notNull(),
  badgeIcon: varchar("badge_icon", { length: 255 }),
  tipsCompleted: int("tips_completed").default(0).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlogTipsBadge = typeof blogTipsBadges.$inferSelect;
export type InsertBlogTipsBadge = typeof blogTipsBadges.$inferInsert;

// Blog tips favorites table
export const blogTipsFavorites = mysqlTable("blog_tips_favorites", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  tipId: varchar("tip_id", { length: 255 }).notNull(),
  tipTitle: varchar("tip_title", { length: 255 }).notNull(),
  tipCategory: varchar("tip_category", { length: 100 }).notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlogTipsFavorite = typeof blogTipsFavorites.$inferSelect;
export type InsertBlogTipsFavorite = typeof blogTipsFavorites.$inferInsert;

// Blog tips feedback table
export const blogTipsFeedback = mysqlTable("blog_tips_feedback", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  tipId: varchar("tip_id", { length: 255 }).notNull(),
  tipTitle: varchar("tip_title", { length: 255 }).notNull(),
  feedback: mysqlEnum("feedback", ["useful", "not_useful"]).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlogTipsFeedback = typeof blogTipsFeedback.$inferSelect;
export type InsertBlogTipsFeedback = typeof blogTipsFeedback.$inferInsert;


// ==================== LINKS PERSONALIZADOS E MATERIAIS ====================
// Personalized links for student access
export const personalizedLinks = mysqlTable("personalized_links", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  linkHash: varchar("link_hash", { length: 64 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  accessedAt: timestamp("accessed_at"),
  accessCount: int("access_count").default(0),
  isActive: boolean("is_active").default(true),
});

export type PersonalizedLink = typeof personalizedLinks.$inferSelect;
export type InsertPersonalizedLink = typeof personalizedLinks.$inferInsert;

// Exclusive materials table
export const exclusiveMaterials = mysqlTable("exclusive_materials", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: varchar("file_url", { length: 512 }).notNull(),
  fileKey: varchar("file_key", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 50 }),
  fileSize: int("file_size"),
  createdBy: int("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().onUpdateNow(),
  isActive: boolean("is_active").default(true),
});

export type ExclusiveMaterial = typeof exclusiveMaterials.$inferSelect;
export type InsertExclusiveMaterial = typeof exclusiveMaterials.$inferInsert;

// Material sharing by class
export const materialClassShare = mysqlTable("material_class_share", {
  id: int("id").autoincrement().primaryKey(),
  materialId: int("material_id").notNull().references(() => exclusiveMaterials.id),
  classId: int("class_id").notNull(),
  sharedAt: timestamp("shared_at").defaultNow().notNull(),
});

export type MaterialClassShare = typeof materialClassShare.$inferSelect;
export type InsertMaterialClassShare = typeof materialClassShare.$inferInsert;

// Material sharing by individual student
export const materialStudentShare = mysqlTable("material_student_share", {
  id: int("id").autoincrement().primaryKey(),
  materialId: int("material_id").notNull().references(() => exclusiveMaterials.id),
  studentId: int("student_id").notNull().references(() => users.id),
  sharedAt: timestamp("shared_at").defaultNow().notNull(),
  accessedAt: timestamp("accessed_at"),
});

export type MaterialStudentShare = typeof materialStudentShare.$inferSelect;
export type InsertMaterialStudentShare = typeof materialStudentShare.$inferInsert;
