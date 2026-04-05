/**
 * Schema for Central Database Tables
 * 
 * Defines tables that exist in the centralized database shared with the main system.
 * These tables are used for production data and sync with other inFlux IAfirst modules.
 */

import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

// ============================================================================
// SHARED TABLES (exist in central DB, used by multiple systems)
// ============================================================================

/**
 * Students table - Cadastral data from Sponte
 * Shared with main system
 */
export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  matricula: varchar("matricula", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 14 }),
  rg: varchar("rg", { length: 20 }),
  gender: mysqlEnum("gender", ["Masculino", "Feminino", "Outro"]),
  birthDate: timestamp("birthDate"),
  phone: varchar("phone", { length: 100 }),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  civilStatus: varchar("civilStatus", { length: 50 }),
  status: mysqlEnum("status", [
    "Ativo", "Bolsista", "Desistente", "Formado", "Inativo", 
    "Interessado", "OnBusiness1", "OnBusiness2", "Trancado", 
    "Transferido", "Travel"
  ]).default("Ativo").notNull(),
  responsibleName: varchar("responsibleName", { length: 255 }),
  responsiblePhone: varchar("responsiblePhone", { length: 20 }),
  responsibleEmail: varchar("responsibleEmail", { length: 320 }),
  notes: text("notes"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  unidade_id: int("unidade_id").notNull().default(1),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

/**
 * Student Intelligence - Learning profile and analytics
 * Shared with main system
 */
export const studentIntelligence = mysqlTable("student_intelligence", {
  id: int("id").autoincrement().primaryKey(),
  contact_phone: varchar("contact_phone", { length: 20 }).notNull().unique(),
  student_id: int("student_id"),
  interest_profile: text("interest_profile"),
  pain_points: text("pain_points"),
  learning_style: mysqlEnum("learning_style", ["visual", "auditivo", "cinestetico", "leitura_escrita"]),
  current_level: varchar("current_level", { length: 50 }),
  mastered_topics: json("mastered_topics"),
  struggling_topics: json("struggling_topics"),
  confidence_score: int("confidence_score"),
  last_tutor_sync: timestamp("last_tutor_sync"),
  metadata: json("metadata"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentIntelligence = typeof studentIntelligence.$inferSelect;
export type InsertStudentIntelligence = typeof studentIntelligence.$inferInsert;

// ============================================================================
// TUTOR-SPECIFIC TABLES (created for Personal Tutor, in central DB)
// ============================================================================

/**
 * Tutor Conversations - Chat sessions
 */
export const tutorConversations = mysqlTable("tutor_conversations", {
  id: int("id").autoincrement().primaryKey(),
  student_id: int("student_id").notNull(),
  intelligence_id: int("intelligence_id"),
  title: varchar("title", { length: 255 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type TutorConversation = typeof tutorConversations.$inferSelect;
export type InsertTutorConversation = typeof tutorConversations.$inferInsert;

/**
 * Tutor Messages - Individual chat messages
 */
export const tutorMessages = mysqlTable("tutor_messages", {
  id: int("id").autoincrement().primaryKey(),
  conversation_id: int("conversation_id").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type TutorMessage = typeof tutorMessages.$inferSelect;
export type InsertTutorMessage = typeof tutorMessages.$inferInsert;

/**
 * Tutor Chunks - Content chunks from curriculum
 */
export const tutorChunks = mysqlTable("tutor_chunks", {
  id: int("id").autoincrement().primaryKey(),
  book_level: varchar("book_level", { length: 50 }).notNull(),
  chunk_number: int("chunk_number").notNull(),
  content: text("content").notNull(),
  grammar_focus: varchar("grammar_focus", { length: 255 }),
  vocabulary: json("vocabulary"),
  difficulty_level: int("difficulty_level").default(1),
  metadata: json("metadata"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type TutorChunk = typeof tutorChunks.$inferSelect;
export type InsertTutorChunk = typeof tutorChunks.$inferInsert;

/**
 * Tutor Student Progress - Progress on chunks
 */
export const tutorStudentProgress = mysqlTable("tutor_student_progress", {
  id: int("id").autoincrement().primaryKey(),
  student_id: int("student_id").notNull(),
  intelligence_id: int("intelligence_id"),
  chunk_id: int("chunk_id").notNull(),
  mastery_level: int("mastery_level").default(0),
  practice_count: int("practice_count").default(0),
  last_practiced_at: timestamp("last_practiced_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type TutorStudentProgress = typeof tutorStudentProgress.$inferSelect;
export type InsertTutorStudentProgress = typeof tutorStudentProgress.$inferInsert;

/**
 * Tutor Reading Club - Reading experiences
 */
export const tutorReadingClub = mysqlTable("tutor_reading_club", {
  id: int("id").autoincrement().primaryKey(),
  student_id: int("student_id").notNull(),
  story_title: varchar("story_title", { length: 255 }).notNull(),
  story_content: text("story_content").notNull(),
  difficulty_level: varchar("difficulty_level", { length: 50 }),
  completed: boolean("completed").default(false),
  completion_date: timestamp("completion_date"),
  reading_time_minutes: int("reading_time_minutes"),
  comprehension_score: int("comprehension_score"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type TutorReadingClub = typeof tutorReadingClub.$inferSelect;
export type InsertTutorReadingClub = typeof tutorReadingClub.$inferInsert;

/**
 * Tutor Interactions - Session summaries
 */
export const tutorInteractions = mysqlTable("tutor_interactions", {
  id: int("id").autoincrement().primaryKey(),
  intelligence_id: int("intelligence_id").notNull(),
  student_id: int("student_id"),
  session_type: mysqlEnum("session_type", [
    "conversacao", "gramatica", "vocabulario", 
    "pronuncia", "revisao", "avaliacao"
  ]).default("conversacao"),
  session_summary: text("session_summary"),
  duration_minutes: int("duration_minutes"),
  mastered_chunks: json("mastered_chunks"),
  struggled_chunks: json("struggled_chunks"),
  student_rating: int("student_rating"),
  student_feedback: text("student_feedback"),
  next_recommendations: json("next_recommendations"),
  interaction_date: timestamp("interaction_date").defaultNow().notNull(),
  metadata: json("metadata"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type TutorInteraction = typeof tutorInteractions.$inferSelect;
export type InsertTutorInteraction = typeof tutorInteractions.$inferInsert;

/**
 * Tutor Blog Tips - Recommended blog posts
 */
export const tutorBlogTips = mysqlTable("tutor_blog_tips", {
  id: int("id").autoincrement().primaryKey(),
  intelligence_id: int("intelligence_id").notNull(),
  blog_post_url: varchar("blog_post_url", { length: 500 }).notNull(),
  blog_post_title: varchar("blog_post_title", { length: 255 }),
  recommendation_reason: text("recommendation_reason"),
  viewed: int("viewed").default(0),
  sent_at: timestamp("sent_at").defaultNow().notNull(),
  viewed_at: timestamp("viewed_at"),
});

export type TutorBlogTip = typeof tutorBlogTips.$inferSelect;
export type InsertTutorBlogTip = typeof tutorBlogTips.$inferInsert;
