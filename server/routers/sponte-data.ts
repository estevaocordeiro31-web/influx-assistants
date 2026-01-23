import { router, protectedProcedure } from '../_core/trpc';
import { getSponteStudentData, formatSponteData } from '../helpers/sponte-data';
import { TRPCError } from '@trpc/server';

export const sponteDataRouter = router({
  /**
   * Obter dados do Sponte para o aluno autenticado
   */
  getMyData: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Usuário não autenticado',
      });
    }

    try {
      const email = ctx.user.email || 'unknown@example.com';
      const data = await getSponteStudentData(email);
      return {
        success: true,
        data: formatSponteData(data),
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Erro ao obter dados do Sponte: ${error}`,
      });
    }
  }),

  /**
   * Obter dados do Sponte para um aluno específico (admin only)
   */
  getStudentData: protectedProcedure
    .input((input: any) => {
      if (typeof input.email !== 'string') {
        throw new Error('Email inválido');
      }
      return input;
    })
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem acessar dados de outros alunos',
        });
      }

      try {
        const data = await getSponteStudentData(input.email);
        return {
          success: true,
          data: formatSponteData(data),
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao obter dados do Sponte: ${error}`,
        });
      }
    }),
});
