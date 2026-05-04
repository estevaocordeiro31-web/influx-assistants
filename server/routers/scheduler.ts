import { protectedProcedure, router } from "../_core/trpc";
import { startDailyTipsScheduler, stopDailyTipsScheduler, triggerDailyTipsJob } from "../jobs/daily-tips-scheduler";
import { TRPCError } from "@trpc/server";

export const schedulerRouter = router({
  /**
   * Inicia o scheduler de dicas diárias
   * Apenas admin pode iniciar
   */
  startDailyTips: protectedProcedure
    .meta({ description: "Inicia o scheduler de dicas diárias" })
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem iniciar o scheduler",
        });
      }

      try {
        await startDailyTipsScheduler();
        return {
          success: true,
          message: "Scheduler de dicas iniciado com sucesso",
        };
      } catch (error) {
        console.error("[Scheduler Router] Erro ao iniciar scheduler:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao iniciar scheduler de dicas",
        });
      }
    }),

  /**
   * Para o scheduler de dicas diárias
   * Apenas admin pode parar
   */
  stopDailyTips: protectedProcedure
    .meta({ description: "Para o scheduler de dicas diárias" })
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem parar o scheduler",
        });
      }

      try {
        stopDailyTipsScheduler();
        return {
          success: true,
          message: "Scheduler de dicas parado com sucesso",
        };
      } catch (error) {
        console.error("[Scheduler Router] Erro ao parar scheduler:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao parar scheduler de dicas",
        });
      }
    }),

  /**
   * Dispara o job de dicas manualmente (para testes)
   * Apenas admin pode disparar
   */
  triggerDailyTips: protectedProcedure
    .meta({ description: "Dispara o job de dicas manualmente" })
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem disparar o scheduler",
        });
      }

      try {
        await triggerDailyTipsJob();
        return {
          success: true,
          message: "Job de dicas disparado com sucesso",
        };
      } catch (error) {
        console.error("[Scheduler Router] Erro ao disparar job:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao disparar job de dicas",
        });
      }
    }),
});
