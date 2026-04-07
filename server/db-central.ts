/**
 * Database helpers for Central Database operations
 * 
 * Functions to interact with centralized tables (students, student_intelligence, tutor_*)
 */

import { eq, and } from "drizzle-orm";
import { getCentralDb, getConnection } from "./db-connection";
import * as centralSchema from "../drizzle/schema-central";

/**
 * Get student by ID from central database
 */
export async function getStudentById(studentId: number) {
  const db = await getCentralDb();
  const [student] = await db
    .select()
    .from(centralSchema.students)
    .where(eq(centralSchema.students.id, studentId))
    .limit(1);
  return student;
}

/**
 * Get student by email from central database
 */
export async function getStudentByEmail(email: string) {
  const db = await getCentralDb();
  const [student] = await db
    .select()
    .from(centralSchema.students)
    .where(eq(centralSchema.students.email, email))
    .limit(1);
  return student;
}

/**
 * Get or create student intelligence profile
 */
export async function getOrCreateStudentIntelligence(studentId: number, phone: string) {
  const db = await getCentralDb();
  
  // Try to find existing
  const [existing] = await db
    .select()
    .from(centralSchema.studentIntelligence)
    .where(eq(centralSchema.studentIntelligence.student_id, studentId))
    .limit(1);
  
  if (existing) return existing;
  
  // Create new
  const [newIntelligence] = await db
    .insert(centralSchema.studentIntelligence)
    .values({
      contact_phone: phone,
      student_id: studentId,
      current_level: "Book 1",
      confidence_score: 50,
    })
    .$returningId();
  
  return await db
    .select()
    .from(centralSchema.studentIntelligence)
    .where(eq(centralSchema.studentIntelligence.id, newIntelligence.id))
    .limit(1)
    .then(rows => rows[0]);
}

/**
 * Create or get tutor conversation
 */
export async function createTutorConversation(studentId: number, intelligenceId?: number, title?: string) {
  const db = await getCentralDb();
  
  const [result] = await db
    .insert(centralSchema.tutorConversations)
    .values({
      student_id: studentId,
      intelligence_id: intelligenceId,
      title: title || "Nova Conversa",
    })
    .$returningId();
  
  return result.id;
}

/**
 * Add message to tutor conversation
 */
export async function addTutorMessage(
  conversationId: number,
  role: "user" | "assistant" | "system",
  content: string
) {
  const db = await getCentralDb();
  
  await db.insert(centralSchema.tutorMessages).values({
    conversation_id: conversationId,
    role,
    content,
  });
}

/**
 * Get tutor conversation messages
 */
export async function getTutorConversationMessages(conversationId: number) {
  const db = await getCentralDb();
  
  return await db
    .select()
    .from(centralSchema.tutorMessages)
    .where(eq(centralSchema.tutorMessages.conversation_id, conversationId))
    .orderBy(centralSchema.tutorMessages.created_at);
}

/**
 * Get student's tutor conversations
 */
export async function getStudentTutorConversations(studentId: number) {
  const db = await getCentralDb();
  
  return await db
    .select()
    .from(centralSchema.tutorConversations)
    .where(eq(centralSchema.tutorConversations.student_id, studentId))
    .orderBy(centralSchema.tutorConversations.updated_at);
}

/**
 * Record tutor interaction session
 */
export async function recordTutorInteraction(data: {
  intelligenceId: number;
  studentId?: number;
  sessionType?: "conversacao" | "gramatica" | "vocabulario" | "pronuncia" | "revisao" | "avaliacao";
  sessionSummary?: string;
  durationMinutes?: number;
  masteredChunks?: any;
  struggledChunks?: any;
  studentRating?: number;
  studentFeedback?: string;
  nextRecommendations?: any;
}) {
  const db = await getCentralDb();
  
  await db.insert(centralSchema.tutorInteractions).values({
    intelligence_id: data.intelligenceId,
    student_id: data.studentId,
    session_type: data.sessionType || "conversacao",
    session_summary: data.sessionSummary,
    duration_minutes: data.durationMinutes,
    mastered_chunks: data.masteredChunks,
    struggled_chunks: data.struggledChunks,
    student_rating: data.studentRating,
    student_feedback: data.studentFeedback,
    next_recommendations: data.nextRecommendations,
  });
}

/**
 * Get student dashboard data from central database
 */
export async function getStudentDashboardData(studentId: number) {
  const db = await getCentralDb();
  
  // Get student basic info
  const student = await getStudentById(studentId);
  if (!student) return null;
  
  // Get intelligence profile
  const [intelligence] = await db
    .select()
    .from(centralSchema.studentIntelligence)
    .where(eq(centralSchema.studentIntelligence.student_id, studentId))
    .limit(1);
  
  // Get conversation count
  const conversations = await db
    .select()
    .from(centralSchema.tutorConversations)
    .where(eq(centralSchema.tutorConversations.student_id, studentId));
  
  // Get total progress
  const progress = await db
    .select()
    .from(centralSchema.tutorStudentProgress)
    .where(eq(centralSchema.tutorStudentProgress.student_id, studentId));
  
  return {
    student,
    intelligence,
    stats: {
      totalConversations: conversations.length,
      totalChunksLearned: progress.length,
      currentLevel: intelligence?.current_level || "Book 1",
    },
  };
}
