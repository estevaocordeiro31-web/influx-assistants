import { router, protectedProcedure, publicProcedure, adminProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getDb } from '../db';
import { studentImportedData, users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const studentImportRouter = router({
  // Import student data
  importStudentData: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        matricula: z.string(),
        book: z.string().optional(),
        className: z.string().optional(),
        schedule: z.string().optional(),
        teacher: z.string().optional(),
        gradesData: z.array(z.object({
          semester: z.number(),
          grade: z.number(),
          period: z.string(),
        })).optional(),
        attendanceData: z.array(z.object({
          semester: z.number(),
          rate: z.number(),
          absences: z.number(),
          period: z.string(),
        })).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify admin role
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem importar dados de alunos',
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Banco de dados não disponível',
        });
      }

      // Calculate average grade
      let averageGrade = null;
      if (input.gradesData && input.gradesData.length > 0) {
        const sum = input.gradesData.reduce((acc, g) => acc + g.grade, 0);
        averageGrade = parseFloat((sum / input.gradesData.length).toFixed(2));
      }

      // Calculate overall attendance rate
      let overallAttendanceRate = null;
      if (input.attendanceData && input.attendanceData.length > 0) {
        const sum = input.attendanceData.reduce((acc, a) => acc + a.rate, 0);
        overallAttendanceRate = parseFloat((sum / input.attendanceData.length).toFixed(2));
      }

      try {
        // Check if student exists
        const [student] = await db
          .select()
          .from(users)
          .where(eq(users.id, input.studentId))
          .limit(1);

        if (!student) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Aluno não encontrado',
          });
        }

        // Delete existing imported data for this student
        await db
          .delete(studentImportedData)
          .where(eq(studentImportedData.studentId, input.studentId));

        // Insert new imported data
        const result = await db.insert(studentImportedData).values({
          studentId: input.studentId,
          matricula: input.matricula,
          book: input.book,
          className: input.className,
          schedule: input.schedule,
          teacher: input.teacher,
          gradesData: input.gradesData ? JSON.stringify(input.gradesData) : null,
          attendanceData: input.attendanceData ? JSON.stringify(input.attendanceData) : null,
          averageGrade: averageGrade,
          overallAttendanceRate: overallAttendanceRate,
          notes: input.notes,
          importedBy: ctx.user.id,
        });

        const id = (result[0] as any).insertId as number;

        return {
          success: true,
          message: 'Dados importados com sucesso',
          id,
        };
      } catch (error) {
        console.error('[StudentImport] Erro ao importar dados:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao importar dados do aluno',
        });
      }
    }),

  // Get imported student data
  getImportedData: publicProcedure
    .input(z.object({ studentId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Banco de dados não disponível',
        });
      }

      try {
        const [data] = await db
          .select()
          .from(studentImportedData)
          .where(eq(studentImportedData.studentId, input.studentId))
          .limit(1);

        if (!data) {
          return null;
        }

        return {
          ...data,
          gradesData: data.gradesData ? JSON.parse(data.gradesData as any) : [],
          attendanceData: data.attendanceData ? JSON.parse(data.attendanceData as any) : [],
        };
      } catch (error) {
        console.error('[StudentImport] Erro ao buscar dados:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar dados do aluno',
        });
      }
    }),

  // Get all imported students
  getAllImported: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Apenas administradores podem listar dados importados',
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Banco de dados não disponível',
      });
    }

    try {
      const data = await db
        .select({
          id: studentImportedData.id,
          studentId: studentImportedData.studentId,
          matricula: studentImportedData.matricula,
          book: studentImportedData.book,
          className: studentImportedData.className,
          averageGrade: studentImportedData.averageGrade,
          overallAttendanceRate: studentImportedData.overallAttendanceRate,
          importedAt: studentImportedData.importedAt,
          studentName: users.name,
          studentEmail: users.email,
        })
        .from(studentImportedData)
        .innerJoin(users, eq(studentImportedData.studentId, users.id));

      return data;
    } catch (error) {
      console.error('[StudentImport] Erro ao listar dados:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao listar dados importados',
      });
    }
  }),
});
