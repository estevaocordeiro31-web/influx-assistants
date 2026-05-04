import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  addTipToFavorites,
  removeTipFromFavorites,
  getStudentFavoriteTips,
  saveTipFeedback,
  getStudentBadges,
  getTipFeedbackStats,
} from "../blog-engagement";

export const blogEngagementRouter = router({
  /**
   * Add a tip to student's favorites
   */
  addFavorite: protectedProcedure
    .input(
      z.object({
        tipId: z.string(),
        tipTitle: z.string(),
        tipCategory: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const studentId = ctx.user.id;
      const result = await addTipToFavorites(
        studentId,
        input.tipId,
        input.tipTitle,
        input.tipCategory
      );
      return result;
    }),

  /**
   * Remove a tip from student's favorites
   */
  removeFavorite: protectedProcedure
    .input(z.object({ tipId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const studentId = ctx.user.id;
      const result = await removeTipFromFavorites(studentId, input.tipId);
      return result;
    }),

  /**
   * Get student's favorite tips
   */
  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    const studentId = ctx.user.id;
    const favorites = await getStudentFavoriteTips(studentId);
    return {
      success: true,
      favorites,
      total: favorites.length,
    };
  }),

  /**
   * Save feedback for a tip (useful/not_useful)
   */
  saveFeedback: protectedProcedure
    .input(
      z.object({
        tipId: z.string(),
        tipTitle: z.string(),
        feedback: z.enum(["useful", "not_useful"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const studentId = ctx.user.id;
      const result = await saveTipFeedback(
        studentId,
        input.tipId,
        input.tipTitle,
        input.feedback,
        input.notes
      );
      return result;
    }),

  /**
   * Get student's badges
   */
  getBadges: protectedProcedure.query(async ({ ctx }) => {
    const studentId = ctx.user.id;
    const badges = await getStudentBadges(studentId);
    return {
      success: true,
      badges,
      total: badges.length,
    };
  }),

  /**
   * Get feedback statistics for a tip
   */
  getTipStats: protectedProcedure
    .input(z.object({ tipId: z.string() }))
    .query(async ({ input }) => {
      const stats = await getTipFeedbackStats(input.tipId);
      return {
        success: true,
        stats,
      };
    }),
});
