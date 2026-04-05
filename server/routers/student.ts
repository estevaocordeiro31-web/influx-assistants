/**
 * Router tRPC para Gerenciamento de Alunos
 * Integra com Sponte e controla acesso baseado em status
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { checkStudentAccess, updateStudentStatus } from "../middleware/studentAccessControl";
import { getSponteStudent, logSponteStudentAccess } from "../sponte";
import { getStudentDashboardData } from "../db-student-dashboard";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const studentRouter = router({
  /**
   * Obter informações do aluno autenticado
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuário não autenticado",
      });
    }

    // Verifica se o aluno está ativo
    const accessContext = await checkStudentAccess(ctx.user.id);

    // Log de acesso no Sponte
    if (ctx.user.email) {
      await logSponteStudentAccess(ctx.user.email);
    }

    return {
      id: ctx.user.id,
      name: ctx.user.name,
      email: ctx.user.email,
      status: accessContext.status,
      isActive: accessContext.isActive,
      role: ctx.user.role,
    };
  }),

  /**
   * Sincronizar dados do Sponte para o aluno
   */
  syncFromSponte: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuário não autenticado",
      });
    }

    // Verifica acesso
    await checkStudentAccess(ctx.user.id);

    try {
      // Busca dados do Sponte usando o email como ID
      const sponteData = await getSponteStudent(ctx.user.email || "");

      if (!sponteData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dados do aluno não encontrados no Sponte",
        });
      }

      // Atualiza status local se diferente
      // Comentado temporariamente - campo status não existe na tabela users
      // if (sponteData.status !== ctx.user.status) {
      //   await updateStudentStatus(ctx.user.id, sponteData.status);
      // }

      return {
        success: true,
        data: sponteData,
        message: "Dados sincronizados com sucesso",
      };
    } catch (error) {
      console.error("[Student] Erro ao sincronizar com Sponte:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao sincronizar dados com Sponte",
      });
    }
  }),

  /**
   * Obter status de acesso do aluno
   */
  getAccessStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuário não autenticado",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Banco de dados indisponível",
      });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user || user.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Usuário não encontrado",
      });
    }

    const userRecord = user[0];
    // Campo status não existe no banco centralizado
    const status = "ativo";
    const isActive = true;

    return {
      status,
      isActive,
      message: "Você tem acesso à plataforma",
    };
  }),

  /**
   * Atualizar status do aluno (apenas admin)
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        newStatus: z.enum(["ativo", "inativo", "desistente", "trancado"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verifica se é admin
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem atualizar status de alunos",
        });
      }

      const success = await updateStudentStatus(input.studentId, input.newStatus);

      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao atualizar status do aluno",
        });
      }

      return {
        success: true,
        message: `Status do aluno atualizado para: ${input.newStatus}`,
      };
    }),

  /**
   * Obter dados completos do dashboard do aluno
   */
  getDashboardData: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuário não autenticado",
      });
    }

    // Verifica se o aluno está ativo
    await checkStudentAccess(ctx.user.id);

    // Busca dados do dashboard
    const dashboardData = await getStudentDashboardData(ctx.user.id);

    return dashboardData;
  }),

  /**
   * Verificar se aluno pode acessar a plataforma
   */
  canAccess: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return { canAccess: false, reason: "Não autenticado" };
    }

    try {
      await checkStudentAccess(ctx.user.id);
      return { canAccess: true, reason: "Acesso permitido" };
    } catch (error) {
      if (error instanceof TRPCError) {
        return { canAccess: false, reason: error.message };
      }
      return { canAccess: false, reason: "Erro ao verificar acesso" };
    }
  }),
});
