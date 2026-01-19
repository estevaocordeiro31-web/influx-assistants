import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { fetchBlogTips, recommendTipsForStudent, analyzeDifficulties } from "../blog-tips";
import { z } from "zod";

export const blogTipsRouter = router({
  /**
   * Obter todas as dicas do blog
   */
  getAllTips: publicProcedure.query(async () => {
    const tips = await fetchBlogTips();
    return {
      success: true,
      tips,
      total: tips.length,
    };
  }),

  /**
   * Obter dica do dia
   */
  getTipOfDay: publicProcedure.query(async () => {
    const tips = await fetchBlogTips();
    if (tips.length === 0) {
      return { success: false, tip: null };
    }

    // Usar data para selecionar dica consistentemente
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const tipIndex = dayOfYear % tips.length;

    return {
      success: true,
      tip: tips[tipIndex],
    };
  }),

  /**
   * Recomendar dicas baseado em dificuldades do aluno
   */
  getRecommendedTips: protectedProcedure
    .input(
      z.object({
        difficulties: z.array(z.string()).optional(),
      })
    )
    .query(async ({ input }) => {
      const tips = await fetchBlogTips();

      if (!input.difficulties || input.difficulties.length === 0) {
        return {
          success: false,
          tips: [],
          message: "Nenhuma dificuldade fornecida",
        };
      }

      const recommendedTips = await recommendTipsForStudent(input.difficulties, tips);

      return {
        success: true,
        tips: recommendedTips,
        total: recommendedTips.length,
      };
    }),

  /**
   * Analisar dificuldades do aluno baseado em histórico
   */
  analyzeDifficultiesForStudent: protectedProcedure
    .input(
      z.object({
        exerciseHistory: z.array(
          z.object({
            category: z.string(),
            correct: z.boolean(),
          })
        ),
      })
    )
    .query(async ({ input }) => {
      const difficulties = await analyzeDifficulties(input.exerciseHistory);

      return {
        success: true,
        difficulties,
        total: difficulties.length,
      };
    }),

  /**
   * Enviar push notification com dica
   */
  sendTipNotification: protectedProcedure
    .input(
      z.object({
        tipId: z.string(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        return { success: false, message: "Usuário não autenticado" };
      }

      try {
        // Aqui você integraria com seu sistema de push notifications
        // Por enquanto, apenas registramos no console
        console.log(`[Blog Tips] Enviando notificação para ${ctx.user.email}:`, {
          tipId: input.tipId,
          message: input.message,
          timestamp: new Date(),
        });

        return {
          success: true,
          message: "Notificação enviada com sucesso",
        };
      } catch (error) {
        console.error("[Blog Tips] Erro ao enviar notificação:", error);
        return {
          success: false,
          message: "Erro ao enviar notificação",
        };
      }
    }),
});
