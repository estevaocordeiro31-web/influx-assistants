import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getDb } from '../db';
import { studentProfiles } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const studentProfileRouter = router({
  /**
   * Atualizar perfil detalhado do aluno
   */
  updateDetailedProfile: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        studyDurationYears: z.number().optional(),
        studyDurationMonths: z.number().optional(),
        specificGoals: z.string().optional(),
        discomfortAreas: z.string().optional(),
        comfortAreas: z.string().optional(),
        englishConsumptionSources: z.array(z.string()).optional(),
        improvementAreas: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados não disponível',
          });
        }

        // Verificar se o aluno existe
        const [profile] = await database
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, input.studentId));

        if (!profile) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Perfil do aluno não encontrado',
          });
        }

        // Atualizar perfil
        const result = await database
          .update(studentProfiles)
          .set({
            studyDurationYears: input.studyDurationYears
              ? String(input.studyDurationYears)
              : undefined,
            studyDurationMonths: input.studyDurationMonths,
            specificGoals: input.specificGoals,
            discomfortAreas: input.discomfortAreas,
            comfortAreas: input.comfortAreas,
            englishConsumptionSources: input.englishConsumptionSources
              ? JSON.stringify(input.englishConsumptionSources)
              : undefined,
            improvementAreas: input.improvementAreas,
            updatedAt: new Date(),
          })
          .where(eq(studentProfiles.userId, input.studentId));

        return {
          success: true,
          message: 'Perfil atualizado com sucesso',
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao atualizar perfil: ${error}`,
        });
      }
    }),

  /**
   * Obter perfil detalhado do aluno
   */
  getDetailedProfile: protectedProcedure
    .input(z.object({ studentId: z.number() }))
    .query(async ({ input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados não disponível',
          });
        }

        const [profile] = await database
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, input.studentId));

        if (!profile) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Perfil do aluno não encontrado',
          });
        }

        return {
          success: true,
          profile: {
            ...profile,
            englishConsumptionSources: profile.englishConsumptionSources
              ? JSON.parse(String(profile.englishConsumptionSources))
              : [],
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao buscar perfil: ${error}`,
        });
      }
    }),
});
