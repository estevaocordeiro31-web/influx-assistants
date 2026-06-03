import { protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';

export const karaokeWeeklyChallengeRouter = {
  // Obter desafio da semana
  getWeeklyChallenge: publicProcedure.query(async () => {
    const weekNumber = Math.floor((Date.now() - new Date(2024, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return {
      weekNumber,
      songId: 'blinding-lights',
      songTitle: 'Blinding Lights',
      artist: 'The Weeknd',
      description: 'Cante Blinding Lights esta semana e ganhe 50 pontos extras!',
      startDate: new Date(Date.now() - (weekNumber * 7 * 24 * 60 * 60 * 1000)),
      endDate: new Date(Date.now() + ((7 - weekNumber % 7) * 24 * 60 * 60 * 1000)),
      rewards: {
        first: { badge: 'Challenge Master', points: 100 },
        second: { badge: 'Challenge Expert', points: 75 },
        third: { badge: 'Challenge Participant', points: 50 },
      },
    };
  }),

  // Completar desafio
  completeChallenge: protectedProcedure
    .input(z.object({ weekNumber: z.number(), score: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        userId: ctx.user.id,
        weekNumber: input.weekNumber,
        score: input.score,
        badge: input.score > 80 ? 'Challenge Master' : 'Challenge Participant',
        points: input.score > 80 ? 100 : 50,
      };
    }),

  // Obter leaderboard do desafio
  getChallengeLeaderboard: publicProcedure
    .input(z.object({ weekNumber: z.number() }))
    .query(async ({ input }) => {
      return {
        weekNumber: input.weekNumber,
        leaderboard: [],
        totalParticipants: 0,
      };
    }),

  // Verificar progresso do usuário no desafio
  getUserChallengeProgress: protectedProcedure
    .input(z.object({ weekNumber: z.number() }))
    .query(async ({ ctx, input }) => {
      return {
        userId: ctx.user.id,
        weekNumber: input.weekNumber,
        completed: false,
        bestScore: 0,
        attempts: 0,
        badge: null,
      };
    }),
};
