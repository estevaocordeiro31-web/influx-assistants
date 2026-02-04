import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { mockGetAllSponteStudents, mockLogSponteStudentAccess } from "../sponte-mock";
import { TRPCError } from "@trpc/server";
import { getSponteStudentCurrentBook, getSponteActiveMatricula } from "../sponte";
import { mapSponteTurmaToBook, getBookById, INFLUX_BOOKS } from "../helpers/sponte-book-mapping";

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

  /**
   * Obter livro atual do aluno baseado na matrícula do Sponte
   */
  getStudentCurrentBook: protectedProcedure
    .input(z.object({ studentId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      try {
        // Usar ID do usuário logado se não fornecido
        const studentId = input.studentId || (ctx.user?.id ? String(ctx.user.id) : undefined);
        
        if (!studentId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ID do aluno não fornecido",
          });
        }

        // Buscar matrícula ativa do Sponte
        const matricula = await getSponteActiveMatricula(studentId);
        
        if (!matricula) {
          // Retornar dados padrão se não encontrar matrícula
          return {
            success: true,
            hasMatricula: false,
            book: null,
            turma: null,
            unit: 1,
            message: "Nenhuma matrícula ativa encontrada no Sponte",
          };
        }

        // Mapear turma do Sponte para livro inFlux
        const bookInfo = mapSponteTurmaToBook(matricula.turmaNome || matricula.cursoNome);
        
        return {
          success: true,
          hasMatricula: true,
          book: bookInfo ? {
            id: bookInfo.id,
            name: bookInfo.name,
            level: bookInfo.level,
            cefrLevel: bookInfo.cefrLevel,
            series: bookInfo.series,
            totalUnits: bookInfo.totalUnits,
            totalChunks: bookInfo.totalChunks,
          } : null,
          turma: {
            id: matricula.turmaId,
            nome: matricula.turmaNome,
            curso: matricula.cursoNome,
          },
          unit: matricula.unitAtual || 1,
          dataInicio: matricula.dataInicio,
        };
      } catch (error) {
        console.error("[Sponte Sync] Erro ao obter livro atual:", error);
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
   * Sincronizar livro do aluno com banco de dados local
   */
  syncStudentBook: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      bookId: z.number(),
      currentUnit: z.number().min(1).max(12),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verifica se o usuário é admin ou o próprio aluno
        if (ctx.user?.role !== "admin" && String(ctx.user?.id) !== input.studentId) {
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

        // Aqui você atualizaria o banco de dados local
        // Por enquanto, apenas retornamos sucesso
        return {
          success: true,
          message: `Livro ${book.name} (Unit ${input.currentUnit}) sincronizado para o aluno`,
          book: {
            id: book.id,
            name: book.name,
            level: book.level,
            cefrLevel: book.cefrLevel,
          },
          currentUnit: input.currentUnit,
        };
      } catch (error) {
        console.error("[Sponte Sync] Erro ao sincronizar livro:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao sincronizar livro do aluno",
        });
      }
    }),
});
