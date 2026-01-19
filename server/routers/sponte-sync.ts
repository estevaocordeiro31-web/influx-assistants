import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { mockGetAllSponteStudents, mockLogSponteStudentAccess } from "../sponte-mock";
import { TRPCError } from "@trpc/server";

/**
 * Router para sincronização com Sponte
 */
export const sponteSyncRouter = router({
  /**
   * Sincronizar dados de alunos do Sponte
   */
  syncStudents: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Verifica se o usuário é admin
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem sincronizar dados do Sponte",
        });
      }

      // Simula sincronização com Sponte
      const students = await mockGetAllSponteStudents();

      return {
        success: true,
        synced: students.length,
        message: `${students.length} alunos sincronizados com sucesso`,
      };
    } catch (error) {
      console.error("[Sponte Sync] Erro ao sincronizar:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao sincronizar dados do Sponte",
      });
    }
  }),

  /**
   * Obter lista de alunos do Sponte
   */
  getStudents: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Verifica se o usuário é admin
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem visualizar dados do Sponte",
        });
      }

      const students = await mockGetAllSponteStudents();

      return {
        success: true,
        students: students.map((s) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          status: s.status,
          level: s.level,
          hoursLearned: s.hoursLearned,
          lastAccess: s.lastAccess.toISOString(),
        })),
      };
    } catch (error) {
      console.error("[Sponte Sync] Erro ao obter alunos:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter dados dos alunos",
      });
    }
  }),

  /**
   * Registrar acesso do aluno
   */
  logAccess: publicProcedure
    .input(z.object({ studentId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const success = await mockLogSponteStudentAccess(input.studentId);

        if (!success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Aluno não encontrado",
          });
        }

        return {
          success: true,
          message: "Acesso registrado com sucesso",
        };
      } catch (error) {
        console.error("[Sponte Sync] Erro ao registrar acesso:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao registrar acesso",
        });
      }
    }),

  /**
   * Verificar status do aluno (ativo/inativo)
   */
  checkStudentStatus: publicProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ input }) => {
      try {
        const students = await mockGetAllSponteStudents();
        const student = students.find((s) => s.id === input.studentId);

        if (!student) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Aluno não encontrado",
          });
        }

        const isActive = student.status === "ativo";

        return {
          success: true,
          isActive,
          status: student.status,
          name: student.name,
          email: student.email,
        };
      } catch (error) {
        console.error("[Sponte Sync] Erro ao verificar status:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao verificar status do aluno",
        });
      }
    }),
});
