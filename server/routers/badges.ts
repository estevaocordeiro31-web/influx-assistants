import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { badgeDefinitions, studentBadges } from "../../drizzle/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";

export const badgesRouter = router({
  // Get all available badge definitions
  getAllBadges: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
    const badges = await db
      .select()
      .from(badgeDefinitions)
      .where(eq(badgeDefinitions.isActive, true))
      .orderBy(badgeDefinitions.sortOrder);
    return badges;
  }),

  // Get student's earned badges
  getMyBadges: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
    const earned = await db
      .select({
        id: studentBadges.id,
        badgeId: studentBadges.badgeId,
        earnedAt: studentBadges.earnedAt,
        seenByStudent: studentBadges.seenByStudent,
        influxcoinsAwarded: studentBadges.influxcoinsAwarded,
        badge: {
          slug: badgeDefinitions.slug,
          name: badgeDefinitions.name,
          nameEn: badgeDefinitions.nameEn,
          description: badgeDefinitions.description,
          descriptionEn: badgeDefinitions.descriptionEn,
          ellieMessage: badgeDefinitions.ellieMessage,
          ellieMessageEn: badgeDefinitions.ellieMessageEn,
          category: badgeDefinitions.category,
          icon: badgeDefinitions.icon,
          color: badgeDefinitions.color,
          influxcoinsReward: badgeDefinitions.influxcoinsReward,
        },
      })
      .from(studentBadges)
      .innerJoin(badgeDefinitions, eq(studentBadges.badgeId, badgeDefinitions.id))
      .where(eq(studentBadges.studentId, ctx.user.id))
      .orderBy(desc(studentBadges.earnedAt));
    return earned;
  }),

  // Get student's badge progress (all badges with earned status)
  getBadgeProgress: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
    const allBadges = await db
      .select()
      .from(badgeDefinitions)
      .where(eq(badgeDefinitions.isActive, true))
      .orderBy(badgeDefinitions.sortOrder);

    const earnedBadges = await db
      .select({
        badgeId: studentBadges.badgeId,
        earnedAt: studentBadges.earnedAt,
        seenByStudent: studentBadges.seenByStudent,
      })
      .from(studentBadges)
      .where(eq(studentBadges.studentId, ctx.user.id));

    type EarnedBadge = typeof earnedBadges[number];
    const earnedMap = new Map(earnedBadges.map((b: { badgeId: number; earnedAt: Date | null; seenByStudent: boolean }) => [b.badgeId, b]));

    return allBadges.map((badge: typeof allBadges[number]) => {
      const earned = earnedMap.get(badge.id);
      return {
        ...badge,
        earned: !!earned,
        earnedAt: earned?.earnedAt || null,
        seenByStudent: earned?.seenByStudent ?? false,
      };
    });
  }),

  // Get unseen badges (for animation trigger)
  getUnseenBadges: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
    const unseen = await db
      .select({
        id: studentBadges.id,
        badgeId: studentBadges.badgeId,
        badge: {
          slug: badgeDefinitions.slug,
          name: badgeDefinitions.name,
          nameEn: badgeDefinitions.nameEn,
          ellieMessage: badgeDefinitions.ellieMessage,
          ellieMessageEn: badgeDefinitions.ellieMessageEn,
          icon: badgeDefinitions.icon,
          color: badgeDefinitions.color,
          influxcoinsReward: badgeDefinitions.influxcoinsReward,
        },
      })
      .from(studentBadges)
      .innerJoin(badgeDefinitions, eq(studentBadges.badgeId, badgeDefinitions.id))
      .where(
        and(
          eq(studentBadges.studentId, ctx.user.id),
          eq(studentBadges.seenByStudent, false)
        )
      );
    return unseen;
  }),

  // Mark badges as seen (after animation plays)
  markBadgesSeen: protectedProcedure
    .input(z.object({ badgeIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      if (input.badgeIds.length === 0) return { success: true };
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
      await db
        .update(studentBadges)
        .set({ seenByStudent: true })
        .where(
          and(
            eq(studentBadges.studentId, ctx.user.id),
            inArray(studentBadges.id, input.badgeIds)
          )
        );
      return { success: true };
    }),

  // Award a badge to a student (internal use / admin)
  awardBadge: protectedProcedure
    .input(z.object({
      studentId: z.number().optional(), // If not provided, awards to current user
      badgeSlug: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
      const targetStudentId = input.studentId || ctx.user.id;

      // Find badge definition
      const [badge] = await db
        .select()
        .from(badgeDefinitions)
        .where(eq(badgeDefinitions.slug, input.badgeSlug))
        .limit(1);

      if (!badge) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Badge "${input.badgeSlug}" not found`,
        });
      }

      // Check if already earned
      const [existing] = await db
        .select()
        .from(studentBadges)
        .where(
          and(
            eq(studentBadges.studentId, targetStudentId),
            eq(studentBadges.badgeId, badge.id)
          )
        )
        .limit(1);

      if (existing) {
        return { success: false, message: "Badge already earned", badge };
      }

      // Award the badge
      await db.insert(studentBadges).values({
        studentId: targetStudentId,
        badgeId: badge.id,
        seenByStudent: false,
        influxcoinsAwarded: badge.influxcoinsReward,
      });

      // Hook: propagar total_badges para o banco central (fire-and-forget)
      import('../utils/sync').then(async ({ getStudentId, onBadgeAwarded }) => {
        const studentId = await getStudentId(targetStudentId);
        if (studentId) await onBadgeAwarded(studentId);
      }).catch(() => {});

      return {
        success: true,
        message: `Badge "${badge.name}" awarded!`,
        badge,
        influxcoinsEarned: badge.influxcoinsReward,
      };
    }),

  // Check and auto-award badges based on student progress
  checkAndAwardBadges: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
    const studentId = ctx.user.id;
    const awarded: string[] = [];

    // Get all badge definitions
    const allBadges = await db
      .select()
      .from(badgeDefinitions)
      .where(eq(badgeDefinitions.isActive, true));

    // Get already earned badges
    const earnedBadges = await db
      .select({ badgeId: studentBadges.badgeId })
      .from(studentBadges)
      .where(eq(studentBadges.studentId, studentId));
    const earnedSet = new Set(earnedBadges.map((b: { badgeId: number }) => b.badgeId));

    // Check each badge
    for (const badge of allBadges) {
      if (earnedSet.has(badge.id)) continue;

      const req = JSON.parse(badge.requirement);
      let shouldAward = false;

      switch (req.type) {
        case "first_login":
          // Always award on check (user is logged in)
          shouldAward = true;
          break;

        case "exercises_completed": {
          const [result] = await db.execute(
            sql`SELECT COUNT(*) as count FROM student_exercise_progress WHERE student_id = ${studentId} AND status = 'completed'`
          );
          const count = (result as any)[0]?.count || 0;
          shouldAward = count >= req.count;
          break;
        }

        case "streak_days": {
          const [result] = await db.execute(
            sql`SELECT streak_days FROM student_profiles WHERE user_id = ${studentId}`
          );
          const streak = (result as any)[0]?.streak_days || 0;
          shouldAward = streak >= req.count;
          break;
        }

        case "book_exercises_complete": {
          const [totalResult] = await db.execute(
            sql`SELECT COUNT(*) as total FROM extra_exercises WHERE book_id = ${req.bookId}`
          );
          const [completedResult] = await db.execute(
            sql`SELECT COUNT(*) as completed FROM student_exercise_progress sep
                JOIN extra_exercises ee ON sep.exercise_id = ee.id
                WHERE sep.student_id = ${studentId} AND sep.status = 'completed' AND ee.book_id = ${req.bookId}`
          );
          const total = (totalResult as any)[0]?.total || 0;
          const completed = (completedResult as any)[0]?.completed || 0;
          shouldAward = total > 0 && completed >= total;
          break;
        }

        // Other types can be checked externally
        default:
          break;
      }

      if (shouldAward) {
        await db.insert(studentBadges).values({
          studentId,
          badgeId: badge.id,
          seenByStudent: false,
          influxcoinsAwarded: badge.influxcoinsReward,
        });
        awarded.push(badge.slug);
      }
    }

    return { awarded, count: awarded.length };
  }),

  // Get total influxcoins earned by student
  getInfluxcoinsBalance: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
    const result = await db.execute(
      sql`SELECT COALESCE(SUM(influxcoins_awarded), 0) as total FROM student_badges WHERE student_id = ${ctx.user.id}`
    );
    const rows = result as any;
    return { balance: Number(rows[0]?.[0]?.total || 0) };
  }),

  // Get leaderboard (top students by badges)
  getLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
      const result = await db.execute(
        sql`SELECT 
              sb.student_id,
              u.name,
              COUNT(sb.id) as badge_count,
              COALESCE(SUM(sb.influxcoins_awarded), 0) as total_influxcoins
            FROM student_badges sb
            JOIN users u ON sb.student_id = u.id
            GROUP BY sb.student_id, u.name
            ORDER BY badge_count DESC, total_influxcoins DESC
            LIMIT ${input.limit}`
      );
      const rows = (result as any)[0] || [];
      return (rows as any[]).map((r: any, i: number) => ({
        rank: i + 1,
        studentId: r.student_id,
        name: r.name || "Aluno",
        badgeCount: Number(r.badge_count),
        totalInfluxcoins: Number(r.total_influxcoins),
      }));
    }),
});
