import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import {
  saveEventParticipantScore,
  getEventLeaderboard,
  getParticipantRank,
} from "../db";

export const leaderboardRouter = router({
  saveScore: publicProcedure
    .input(
      z.object({
        participantId: z.number().positive(),
        missionId: z.string(),
        score: z.number().min(0),
        timeSpentSeconds: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const success = await saveEventParticipantScore(
        input.participantId,
        input.missionId,
        input.score,
        input.timeSpentSeconds
      );

      return {
        success,
        message: success ? "Score saved successfully" : "Failed to save score",
      };
    }),

  getLeaderboard: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        limit: z.number().optional().default(100),
      })
    )
    .query(async ({ input }) => {
      const leaderboard = await getEventLeaderboard(input.eventId, input.limit);
      return leaderboard;
    }),

  getParticipantRank: publicProcedure
    .input(
      z.object({
        participantId: z.number().positive(),
        eventId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const rank = await getParticipantRank(input.participantId, input.eventId);
      return rank;
    }),
});
