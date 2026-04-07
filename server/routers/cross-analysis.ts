import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getDb } from '../db';
import { users, studentProfiles } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { getSponteStudentData } from '../helpers/sponte-data';
import { performCrossAnalysis } from '../helpers/cross-analysis';

export const crossAnalysisRouter = router({
  /**
   * Obter análise cruzada completa de um aluno
   * Combina perfil detalhado + dados do Sponte
   */
  getStudentAnalysis: protectedProcedure
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

        // Buscar dados do aluno
        const [student] = await database
          .select()
          .from(users)
          .where(eq(users.id, input.studentId));

        if (!student) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Aluno não encontrado',
          });
        }

        // Buscar perfil detalhado
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

        // Buscar dados do Sponte
        const sponteData = await getSponteStudentData(student.email || '');

        // Preparar dados do perfil
        const profileData = {
          studyDurationYears: profile.studyDurationYears ? parseInt(String(profile.studyDurationYears), 10) : null,
          studyDurationMonths: profile.studyDurationMonths,
          specificGoals: profile.specificGoals,
          discomfortAreas: profile.discomfortAreas,
          comfortAreas: profile.comfortAreas,
          englishConsumptionSources: profile.englishConsumptionSources
            ? JSON.parse(String(profile.englishConsumptionSources))
            : null,
          improvementAreas: profile.improvementAreas,
        };

        // Realizar análise cruzada
        const analysis = performCrossAnalysis(
          student.id,
          student.name || 'Aluno',
          profileData,
          sponteData
        );

        return {
          success: true,
          analysis,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao buscar análise: ${error}`,
        });
      }
    }),

  /**
   * Obter análise cruzada para múltiplos alunos
   * Útil para dashboard de coordenadores
   */
  getClassAnalysis: protectedProcedure
    .input(z.object({ studentIds: z.array(z.number()) }))
    .query(async ({ input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados não disponível',
          });
        }

        const analyses = [];

        for (const studentId of input.studentIds) {
          // Buscar dados do aluno
          const [student] = await database
            .select()
            .from(users)
            .where(eq(users.id, studentId));

          if (!student) continue;

          // Buscar perfil detalhado
          const [profile] = await database
            .select()
            .from(studentProfiles)
            .where(eq(studentProfiles.userId, studentId));

          if (!profile) continue;

          // Buscar dados do Sponte
          const sponteData = await getSponteStudentData(student.email || '');

          // Preparar dados do perfil
          const profileData = {
            studyDurationYears: profile.studyDurationYears ? parseInt(String(profile.studyDurationYears), 10) : null,
            studyDurationMonths: profile.studyDurationMonths,
            specificGoals: profile.specificGoals,
            discomfortAreas: profile.discomfortAreas,
            comfortAreas: profile.comfortAreas,
            englishConsumptionSources: profile.englishConsumptionSources
              ? JSON.parse(String(profile.englishConsumptionSources))
              : null,
            improvementAreas: profile.improvementAreas,
          };

          // Realizar análise cruzada
          const analysis = performCrossAnalysis(
            student.id,
            student.name || 'Aluno',
            profileData,
            sponteData
          );

          analyses.push(analysis);
        }

        // Ordenar por health score (alunos em risco primeiro)
        analyses.sort((a, b) => a.overallHealthScore - b.overallHealthScore);

        return {
          success: true,
          analyses,
          summary: {
            totalStudents: analyses.length,
            atRisk: analyses.filter(a => a.overallHealthScore < 50).length,
            needsAttention: analyses.filter(a => a.overallHealthScore >= 50 && a.overallHealthScore < 75).length,
            healthy: analyses.filter(a => a.overallHealthScore >= 75).length,
            averageHealthScore: analyses.length > 0
              ? Math.round(analyses.reduce((sum, a) => sum + a.overallHealthScore, 0) / analyses.length)
              : 0,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao buscar análise da turma: ${error}`,
        });
      }
    }),

  /**
   * Obter alunos em risco
   * Filtro rápido para coordenadores
   */
  getAtRiskStudents: protectedProcedure
    .input(z.object({ 
      threshold: z.number().default(50),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados não disponível',
          });
        }

        // Buscar todos os alunos ativos
        const allStudents = await database
          .select()
          .from(users)
          .where(eq(users.role, 'user'));

        const atRiskStudents = [];

        for (const student of allStudents) {
          // Buscar perfil detalhado
          const [profile] = await database
            .select()
            .from(studentProfiles)
            .where(eq(studentProfiles.userId, student.id));

          if (!profile) continue;

          // Buscar dados do Sponte
          const sponteData = await getSponteStudentData(student.email || '');

          // Preparar dados do perfil
          const profileData = {
            studyDurationYears: profile.studyDurationYears ? parseInt(String(profile.studyDurationYears), 10) : null,
            studyDurationMonths: profile.studyDurationMonths,
            specificGoals: profile.specificGoals,
            discomfortAreas: profile.discomfortAreas,
            comfortAreas: profile.comfortAreas,
            englishConsumptionSources: profile.englishConsumptionSources
              ? JSON.parse(String(profile.englishConsumptionSources))
              : null,
            improvementAreas: profile.improvementAreas,
          };

          // Realizar análise cruzada
          const analysis = performCrossAnalysis(
            student.id,
            student.name || 'Aluno',
            profileData,
            sponteData
          );

          if (analysis.overallHealthScore < input.threshold) {
            atRiskStudents.push({
              ...analysis,
              topRiskFactors: analysis.riskFactors.slice(0, 3),
            });
          }
        }

        // Ordenar por health score e limitar resultados
        atRiskStudents.sort((a, b) => a.overallHealthScore - b.overallHealthScore);
        const limited = atRiskStudents.slice(0, input.limit);

        return {
          success: true,
          students: limited,
          total: atRiskStudents.length,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao buscar alunos em risco: ${error}`,
        });
      }
    }),
});
