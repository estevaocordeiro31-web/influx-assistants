import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getBookById, INFLUX_BOOKS } from "../helpers/sponte-book-mapping";
import { getDb } from "../db";
import { users, studentBookProgress } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Router para gestão de alunos - DESCONECTADO DO SPONTE
 * 
 * O sistema agora opera de forma autônoma, sem sincronização com o Sponte.
 * Os dados dos alunos são gerenciados internamente usando IDs únicos no formato INF-YYYY-XXXX.
 * 
 * Mudanças:
 * - Removida dependência do Sponte API
 * - Status dos alunos gerenciado localmente
 * - IDs únicos no formato INF-YYYY-XXXX são a chave primária
 */
export const sponteSyncRouter = router({
  /**
   * [DESATIVADO] Sincronização com Sponte
   * Retorna mensagem informando que a sincronização foi desativada
   */
  syncStudents: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem acessar esta função",
      });
    }

    return {
      success: true,
      synced: 0,
      message: "Sincronização com Sponte desativada. O sistema opera de forma autônoma.",
      info: "Use o painel de administração para gerenciar alunos diretamente.",
    };
  }),

  /**
   * Obter lista de alunos do banco de dados local
   */
  getStudents: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem visualizar dados dos alunos",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      // Buscar alunos do banco local
      const students = await db
        .select({
          id: users.id,
          studentId: users.studentId,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.role, "user"));

      return {
        success: true,
        source: "local",
        students: students.map((s) => ({
          id: s.studentId || `USR-${s.id}`,
          internalId: s.id,
          name: s.name || "Sem nome",
          email: s.email || "Sem email",
          status: "ativo", // Status gerenciado localmente
          level: "A definir",
          hoursLearned: 0,
          lastAccess: s.createdAt?.toISOString() || new Date().toISOString(),
        })),
      };
    } catch (error) {
      console.error("[Students] Erro ao obter alunos:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter dados dos alunos",
      });
    }
  }),

  /**
   * Registrar acesso do aluno (local)
   */
  logAccess: publicProcedure