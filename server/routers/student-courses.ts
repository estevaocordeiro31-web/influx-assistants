import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { studentCourses } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

// Available extra courses
export const AVAILABLE_COURSES = [
  { code: "vp1", name: "Vacation Plus 1", category: "vacation_plus", description: "Programa de férias imersivo - Nível 1" },
  { code: "vp2", name: "Vacation Plus 2", category: "vacation_plus", description: "Programa de férias imersivo - Nível 2" },
  { code: "vp3", name: "Vacation Plus 3", category: "vacation_plus", description: "Programa de férias imersivo - Nível 3" },
  { code: "vp4", name: "Vacation Plus 4", category: "vacation_plus", description: "Programa de férias imersivo - Nível 4" },
  { code: "traveler", name: "Traveler", category: "special", description: "Inglês para viajantes" },
  { code: "on_business", name: "On Business", category: "special", description: "Inglês para negócios" },
  { code: "reading_club", name: "Reading Club", category: "club", description: "Clube de leitura em inglês" },
] as const;

export const studentCoursesRouter = router({
  // Get available courses list
  getAvailableCourses: protectedProcedure.query(() => {
    return AVAILABLE_COURSES;
  }),

  // Get student's enrolled courses
  getStudentCourses: protectedProcedure
    .input(z.object({ studentId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const courses = await db
        .select()
        .from(studentCourses)
        .where(eq(studentCourses.studentId, input.studentId));
      return courses;
    }),

  // Get my courses (for student dashboard)
  getMyCourses: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const courses = await db
      .select()
      .from(studentCourses)
      .where(
        and(
          eq(studentCourses.studentId, ctx.user.id),
          eq(studentCourses.isActive, true)
        )
      );
    return courses.map((c) => c.courseCode);
  }),

  // Enroll student in a course (admin only)
  enrollStudent: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        courseCode: z.string(),
        courseName: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      // Check if already enrolled
      const existing = await db
        .select()
        .from(studentCourses)
        .where(
          and(
            eq(studentCourses.studentId, input.studentId),
            eq(studentCourses.courseCode, input.courseCode)
          )
        );

      if (existing.length > 0) {
        // Reactivate if was deactivated
        await db
          .update(studentCourses)
          .set({ isActive: true, notes: input.notes || null })
          .where(eq(studentCourses.id, existing[0].id));
        return { success: true, action: "reactivated" };
      }

      await db.insert(studentCourses).values({
        studentId: input.studentId,
        courseCode: input.courseCode,
        courseName: input.courseName,
        isActive: true,
        enrolledBy: ctx.user.id,
        notes: input.notes || null,
      });
      return { success: true, action: "enrolled" };
    }),

  // Unenroll student from a course (admin only)
  unenrollStudent: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        courseCode: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .update(studentCourses)
        .set({ isActive: false })
        .where(
          and(
            eq(studentCourses.studentId, input.studentId),
            eq(studentCourses.courseCode, input.courseCode)
          )
        );
      return { success: true };
    }),

  // Bulk update student courses (toggle all at once)
  updateStudentCourses: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        courses: z.array(
          z.object({
            courseCode: z.string(),
            courseName: z.string(),
            isActive: z.boolean(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      for (const course of input.courses) {
        const existing = await db
          .select()
          .from(studentCourses)
          .where(
            and(
              eq(studentCourses.studentId, input.studentId),
              eq(studentCourses.courseCode, course.courseCode)
            )
          );

        if (existing.length > 0) {
          await db
            .update(studentCourses)
            .set({ isActive: course.isActive })
            .where(eq(studentCourses.id, existing[0].id));
        } else if (course.isActive) {
          await db.insert(studentCourses).values({
            studentId: input.studentId,
            courseCode: course.courseCode,
            courseName: course.courseName,
            isActive: true,
            enrolledBy: ctx.user.id,
          });
        }
      }

      return { success: true };
    }),

  // Get course enrollment stats (admin)
  getCourseStats: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const stats = await db
      .select({
        courseCode: studentCourses.courseCode,
        courseName: studentCourses.courseName,
        activeCount: sql<number>`SUM(CASE WHEN ${studentCourses.isActive} = true THEN 1 ELSE 0 END)`,
        totalCount: sql<number>`COUNT(*)`,
      })
      .from(studentCourses)
      .groupBy(studentCourses.courseCode, studentCourses.courseName);
    return stats;
  }),
});
