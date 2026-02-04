import { router, adminProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getDb, assignStudentId, assignStudentIdsToAllUsers } from '../db';
import { users, studentProfiles } from '../../drizzle/schema';
import { eq, isNull } from 'drizzle-orm';

export const adminStudentsRouter = router({
  /**
   * Obter lista de alunos (admin only)
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
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados não disponível',
          });
        }

        // Buscar todos os usuários com role 'user' (alunos)
        let query = database
          .select({
            id: users.id,
            studentId: users.studentId,
            name: users.name,
            email: users.email,
            createdAt: users.createdAt,
            lastSignedIn: users.lastSignedIn,
          })
          .from(users)
          .where(eq(users.role, 'user'));

        // Aplicar filtro de busca se fornecido
        if (input.search) {
          const searchTerm = `%${input.search}%`;
          // Nota: Drizzle não suporta LIKE diretamente, então fazemos a filtragem em memória
        }

        const allStudents = await query;

        // Filtrar em memória se necessário
        let filteredStudents = allStudents;
        if (input.search) {
          const searchLower = input.search.toLowerCase();
          filteredStudents = allStudents.filter(
            (s) =>
              s.name?.toLowerCase().includes(searchLower) ||
              s.email?.toLowerCase().includes(searchLower)
          );
        }

        // Aplicar paginação
        const students = filteredStudents.slice(input.offset, input.offset + input.limit);

        // Enriquecer com dados de perfil
        const enrichedStudents = await Promise.all(
          students.map(async (student) => {
            const profile = await database
              .select()
              .from(studentProfiles)
              .where(eq(studentProfiles.userId, student.id))
              .then((rows) => rows[0] || null);

            return {
              id: student.id,
              studentId: student.studentId || null,
              name: student.name || 'Sem nome',
              email: student.email || 'Sem email',
              level: profile?.currentLevel || 'beginner',
              objective: profile?.objective || 'other',
              hoursLearned: profile?.totalHoursLearned || 0,
              streakDays: profile?.streakDays || 0,
              lastActivity: student.lastSignedIn
                ? new Date(student.lastSignedIn).toLocaleDateString('pt-BR')
                : 'Nunca',
              status: 'active', // Todos os usuários são considerados ativos por padrão
              createdAt: student.createdAt,
            };
          })
        );

        return {
          success: true,
          students: enrichedStudents,
          total: filteredStudents.length,
          hasMore: input.offset + input.limit < filteredStudents.length,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
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
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados não disponível',
          });
        }

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

        const [profile] = await database
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, input.studentId));

        return {
          success: true,
          student: {
            id: student.id,
            studentId: (student as any).studentId || null,
            name: student.name,
            email: student.email,
            createdAt: student.createdAt,
            lastSignedIn: student.lastSignedIn,
            profile: profile || null,
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
