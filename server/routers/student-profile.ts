import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getDb } from '../db';
import { studentProfiles } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const studentProfileRouter = router({
  /**
   * Obter perfil editável do aluno logado
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
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
      .where(eq(studentProfiles.userId, ctx.user.id));

    if (!profile) {
      // Criar perfil padrão se não existir
      await database.insert(studentProfiles).values({
        userId: ctx.user.id,
        objective: 'other',
        englishConsumptionSources: JSON.stringify([]),
      });

      return {
        id: 0,
        user_id: ctx.user.id,
        photo_url: null,
        learning_goal: null,
        notification_preferences: { daily: true, badges: true, tips: true },
      };
    }

    return {
      id: profile.id,
      user_id: profile.userId,
      photo_url: null, // TODO: adicionar campo photo_url na tabela
      learning_goal: profile.specificGoals,
      notification_preferences: { daily: true, badges: true, tips: true }, // TODO: adicionar campo
    };
  }),

  /**
   * Atualizar perfil editável do aluno logado
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        photo_url: z.string().optional(),
        learning_goal: z.string().optional(),
        notification_preferences: z.object({
          daily: z.boolean(),
          badges: z.boolean(),
          tips: z.boolean(),
        }).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Banco de dados não disponível',
        });
      }

      // Verificar se perfil existe
      const [profile] = await database
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, ctx.user.id));

      if (!profile) {
        // Criar novo perfil
        await database.insert(studentProfiles).values({
          userId: ctx.user.id,
          objective: 'other',
          specificGoals: input.learning_goal,
          englishConsumptionSources: JSON.stringify([]),
        });
      } else {
        // Atualizar perfil existente
        await database
          .update(studentProfiles)
          .set({
            specificGoals: input.learning_goal,
            updatedAt: new Date(),
          })
          .where(eq(studentProfiles.userId, ctx.user.id));
      }

      return { success: true };
    }),

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
