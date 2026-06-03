import { protectedProcedure } from '../_core/trpc';
import { z } from 'zod';

export const karaokeFavoritesRouter = {
  // Adicionar música aos favoritos
  addFavorite: protectedProcedure
    .input(z.object({ songId: z.string(), title: z.string(), artist: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        message: `Added ${input.title} to favorites`,
        userId: ctx.user.id,
        songId: input.songId,
      };
    }),

  // Remover música dos favoritos
  removeFavorite: protectedProcedure
    .input(z.object({ songId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        message: `Removed from favorites`,
        songId: input.songId,
      };
    }),

  // Obter lista de favoritos
  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    return {
      userId: ctx.user.id,
      favorites: [],
      count: 0,
    };
  }),

  // Verificar se música é favorita
  isFavorite: protectedProcedure
    .input(z.object({ songId: z.string() }))
    .query(async ({ ctx, input }) => {
      return {
        songId: input.songId,
        isFavorite: false,
      };
    }),
};
