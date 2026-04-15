import { router, adminProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getDb, assignStudentId, assignStudentIdsToAllUsers } from '../db';
import { users, studentProfiles } from '../../drizzle/schema';
import { students as centralStudents } from '../../drizzle/schema-central';
import { eq } from 'drizzle-orm';
import { getCentralDb } from '../db-connection';

export const adminStudentsRouter = router({
  /**
   * Obter lista de alunos (admin only)
   * Busca do banco central TiDB (tabela students)
   */
  getStudents: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const centralDb = await getCentralDb();

        // Buscar alunos da tabela students do banco central
        let allStudents = await centralDb
          .select({
            id: centralStudents.id,
            matricula: centralStudents.matricula,
            name: centralStudents.name,
            email: centralStudents.email,
            phone: centralStudents.phone,
            status: centralStudents.status,
            createdAt: centralStudents.createdAt,
            updatedAt: centralStudents.updatedAt,
          })
          .from(centralStudents)
          .orderBy(centralStudents.name);

        // Filtrar em memória se necessário
        let filteredStudents = allStudents;
        if (input.search) {
          const searchLower = input.search.toLowerCase();
          filteredStudents = allStudents.filter(
            (s) =>
              s.name?.toLowerCase().includes(searchLower) ||
              s.email?.toLowerCase().includes(searchLower) ||
              s.matricula?.toLowerCase().includes(searchLower)
          );
        }

        // Aplicar paginação
        const paginatedStudents = filteredStudents.slice(input.offset, input.offset + input.limit);

        // Mapear status do Sponte para o formato do dashboard
        const mapStatus = (status: string): 'active' | 'inactive' | 'at_risk' => {
          if (['Ativo', 'Bolsista'].includes(status)) return 'active';
          if (['Desistente', 'Inativo', 'Trancado', 'Transferido'].includes(status)) return 'inactive';
          return 'active';
        };

        const enrichedStudents = paginatedStudents.map((student) => ({
          id: student.id,
          studentId: student.matricula || null,
          name: student.name || 'Sem nome',
          email: student.email || 'Sem email',
          level: 'beginner',
          objective: 'other',
          hoursLearned: 0,
          streakDays: 0,
          lastActivity: student.updatedAt
            ? new Date(student.updatedAt).toLocaleDateString('pt-BR')
            : 'Nunca',
          status: mapStatus(student.status),
          createdAt: student.createdAt,
        }));

        return {
          success: true,
          students: enrichedStudents,
          total: filteredStudents.length,
          hasMore: input.offset + input.limit < filteredStudents.length,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('[AdminStudents] Erro ao buscar alunos:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao buscar alunos: ${error}`,
        });
      }
    }),

  /**
   * Obter detalhes de um aluno específico
   */
  getStudentDetail: adminProcedure
    .input(z.object({ studentId: z.number() }))
    .query(async ({ input }) => {
      try {
        const centralDb = await getCentralDb();

        const [student] = await centralDb
          .select()
          .from(centralStudents)
          .where(eq(centralStudents.id, input.studentId));

        if (!student) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Aluno não encontrado',
          });
        }

        return {
          success: true,
          student: {
            id: student.id,
            studentId: student.matricula || null,
            name: student.name,
            email: student.email,
            createdAt: student.createdAt,
            lastSignedIn: student.updatedAt,
            profile: null,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao buscar detalhes do aluno: ${error}`,
        });
      }
    }),

  /**
   * Gerar/atribuir studentId para um aluno específico
   */
  assignStudentId: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const newStudentId = await assignStudentId(input.userId);
        if (!newStudentId) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro ao gerar ID do aluno',
          });
        }
        return {
          success: true,
          studentId: newStudentId,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao atribuir ID: ${error}`,
        });
      }
    }),

  /**
   * Gerar/atribuir studentId para todos os alunos sem ID
   */
  assignAllStudentIds: adminProcedure
    .mutation(async () => {
      try {
        const count = await assignStudentIdsToAllUsers();
        return {
          success: true,
          message: `${count} alunos receberam IDs`,
          count,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao atribuir IDs: ${error}`,
        });
      }
    }),
});
