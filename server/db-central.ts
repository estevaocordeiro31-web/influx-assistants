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