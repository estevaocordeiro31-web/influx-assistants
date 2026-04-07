import { z } from "zod";
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
    .input(z.object({ studentId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            message: "Banco de dados não disponível",
          };
        }

        // Registrar acesso localmente (atualizar lastAccess se houver campo)
        console.log(`[Students] Acesso registrado para aluno: ${input.studentId}`);

        return {
          success: true,
          message: "Acesso registrado com sucesso",
        };
      } catch (error) {
        console.error("[Students] Erro ao registrar acesso:", error);
        return {
          success: false,
          message: "Erro ao registrar acesso",
        };
      }
    }),

  /**
   * Verificar status do aluno (local)
   * Todos os alunos cadastrados são considerados ativos por padrão
   */
  checkStudentStatus: publicProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Banco de dados não disponível",
          });
        }

        // Buscar aluno pelo studentId (INF-YYYY-XXXX) ou pelo id numérico
        let student;
        
        if (input.studentId.startsWith("INF-")) {
          const result = await db
            .select()
            .from(users)
            .where(eq(users.studentId, input.studentId))
            .limit(1);
          student = result[0];
        } else {
          const numericId = parseInt(input.studentId, 10);
          if (!isNaN(numericId)) {
            const result = await db
              .select()
              .from(users)
              .where(eq(users.id, numericId))
              .limit(1);
            student = result[0];
          }
        }

        if (!student) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Aluno não encontrado",
          });
        }

        return {
          success: true,
          isActive: true, // Todos os alunos cadastrados são ativos por padrão
          status: "ativo",
          name: student.name || "Sem nome",
          email: student.email || "Sem email",
          studentId: student.studentId || `USR-${student.id}`,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Students] Erro ao verificar status:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao verificar status do aluno",
        });
      }
    }),

  /**
   * Obter livro atual do aluno (do banco local)
   */
  getStudentCurrentBook: protectedProcedure
    .input(z.object({ studentId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Banco de dados não disponível",
          });
        }

        // Usar ID do usuário logado se não fornecido
        const userId = input.studentId ? parseInt(input.studentId, 10) : ctx.user?.id;
        
        if (!userId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ID do aluno não fornecido",
          });
        }

        // Buscar progresso do aluno no banco local
        const progress = await db
          .select()
          .from(studentBookProgress)
          .where(eq(studentBookProgress.studentId, userId))
          .limit(1);

        if (!progress || progress.length === 0) {
          // Retornar dados padrão se não encontrar progresso
          const defaultBook = getBookById(1); // Book 1 como padrão
          return {
            success: true,
            hasMatricula: false,
            book: defaultBook ? {
              id: defaultBook.id,
              name: defaultBook.name,
              level: defaultBook.level,
              cefrLevel: defaultBook.cefrLevel,
              series: defaultBook.series,
              totalUnits: defaultBook.totalUnits,
              totalChunks: defaultBook.totalChunks,
            } : null,
            turma: null,
            unit: 1,
            message: "Progresso não encontrado. Usando Book 1 como padrão.",
          };
        }

        const studentProgress = progress[0];
        const book = getBookById(studentProgress.bookId);

        return {
          success: true,
          hasMatricula: true,
          book: book ? {
            id: book.id,
            name: book.name,
            level: book.level,
            cefrLevel: book.cefrLevel,
            series: book.series,
            totalUnits: book.totalUnits,
            totalChunks: book.totalChunks,
          } : null,
          turma: null, // Não há mais turma do Sponte
          unit: studentProgress.currentUnit || 1,
          dataInicio: studentProgress.startedAt?.toISOString(),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Students] Erro ao obter livro atual:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao obter livro atual do aluno",
        });
      }
    }),

  /**
   * Obter lista de todos os livros inFlux disponíveis
   */
  getAllBooks: publicProcedure.query(async () => {
    return {
      success: true,
      books: INFLUX_BOOKS.map(book => ({
        id: book.id,
        name: book.name,
        level: book.level,
        cefrLevel: book.cefrLevel,
        series: book.series,
        totalUnits: book.totalUnits,
        totalChunks: book.totalChunks,
      })),
    };
  }),

  /**
   * Sincronizar/atualizar livro do aluno no banco de dados local
   */
  syncStudentBook: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      bookId: z.number(),
      currentUnit: z.number().min(1).max(12),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Banco de dados não disponível",
          });
        }

        const userId = parseInt(input.studentId, 10);
        
        // Verifica se o usuário é admin ou o próprio aluno
        if (ctx.user?.role !== "admin" && ctx.user?.id !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Sem permissão para atualizar dados do aluno",
          });
        }

        const book = getBookById(input.bookId);
        if (!book) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Livro não encontrado",
          });
        }

        // Verificar se já existe progresso
        const existingProgress = await db
          .select()
          .from(studentBookProgress)
          .where(eq(studentBookProgress.studentId, userId))
          .limit(1);

        if (existingProgress.length > 0) {
          // Atualizar progresso existente
          await db
            .update(studentBookProgress)
            .set({
              bookId: input.bookId,
              currentUnit: input.currentUnit,
              updatedAt: new Date(),
            })
            .where(eq(studentBookProgress.studentId, userId));
        } else {
          // Criar novo progresso
          await db.insert(studentBookProgress).values({
            studentId: userId,
            bookId: input.bookId,
            currentUnit: input.currentUnit,
            startedAt: new Date(),
          });
        }

        return {
          success: true,
          message: `Livro ${book.name} (Unit ${input.currentUnit}) atualizado para o aluno`,
          book: {
            id: book.id,
            name: book.name,
            level: book.level,
            cefrLevel: book.cefrLevel,
          },
          currentUnit: input.currentUnit,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Students] Erro ao sincronizar livro:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao sincronizar livro do aluno",
        });
      }
    }),
});
