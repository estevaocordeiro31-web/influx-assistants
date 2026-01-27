import { router, protectedProcedure } from '../_core/trpc';
import { TRPCError } from '@trpc/server';
import { startDailySyncJob, stopDailySyncJob, runDailySyncNow } from '../jobs/daily-sync';

export const dailySyncRouter = router({
  /**
   * Iniciar job de sincronização diária
   */
  start: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Apenas administradores podem iniciar o job',
      });
    }

    try {
      startDailySyncJob();
      return {
        success: true,
        message: 'Job de sincronização diária iniciado (18:00)',
      };
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
  }),

  /**
   * Parar job de sincronização diária
   */
  stop: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Apenas administradores podem parar o job',
      });
    }

    try {
      stopDailySyncJob();
      return {
        success: true,
        message: 'Job de sincronização diária parado',
      };
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
  }),

  /**
   * Executar sincronização manualmente
   */
  runNow: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Apenas administradores podem executar sincronização manual',
      });
    }

    try {
      const result = await runDailySyncNow();
      return {
        success: true,
        ...result,
        message: `Sincronização concluída: ${result.created} criados, ${result.errors} erros`,
      };
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
  }),
});
