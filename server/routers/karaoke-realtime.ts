import { publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';

export const karaokeRealtimeRouter = {
  // Iniciar sessão multiplayer
  startMultiplayerSession: protectedProcedure
    .input(z.object({ decade: z.string(), roomId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const roomId = input.roomId || `room-${Date.now()}`;
      return {
        roomId,
        players: [{ id: ctx.user.id, name: ctx.user.name, score: 0 }],
        decade: input.decade,
        createdAt: new Date(),
      };
    }),

  // Adicionar jogador à sessão
  joinMultiplayerSession: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        message: `${ctx.user.name} joined room ${input.roomId}`,
        playerId: ctx.user.id,
      };
    }),

  // Atualizar pontuação em tempo real
  updatePlayerScore: protectedProcedure
    .input(z.object({ roomId: z.string(), score: z.number(), songId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        playerId: ctx.user.id,
        newScore: input.score,
        timestamp: new Date(),
      };
    }),

  // Obter estado da sala em tempo real
  getRoomState: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ input }) => {
      return {
        roomId: input.roomId,
        players: [],
        currentSong: null,
        status: 'waiting',
      };
    }),
};
