import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { users, studentProfiles, studentBookHistory, books } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Router para exportar dados de alunos
 * Procedures para exportar informações de cadastro dos alunos ativos
 */

export const adminExportRouter = router({
  /**
   * Exportar dados de alunos ativos em formato JSON
   * Retorna: ID, Nome, Email, Nível, Livro Atual, Horas Aprendidas, Status, Data de Criação
   */
  exportActiveStudentsJSON: adminProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Buscar todos os alunos ativos (status = 'ativo')
      const activeStudents = await db
        .select({
          id: users.id,
          studentId: users.studentId,
          name: users.name,
          email: users.email,
          role: users.role,
          status: users.status,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          lastSignedIn: users.lastSignedIn,
        })
        .from(users)
        .where(eq(users.status, "ativo"))
        .orderBy(users.createdAt);

      // Enriquecer com dados de perfil e livro atual
      const enrichedStudents = await Promise.all(
        activeStudents.map(async (student) => {
          // Buscar perfil do aluno
          const profile = await db
            .select()
            .from(studentProfiles)
            .where(eq(studentProfiles.userId, student.id))
            .limit(1);

          // Buscar livro atual (último em progresso)
          const currentBookProgress = await db
            .select({
              bookId: studentBookHistory.bookId,
              status: studentBookHistory.status,
              startedAt: studentBookHistory.startedAt,
              completedAt: studentBookHistory.completedAt,
              finalGrade: studentBookHistory.finalGrade,
              bookName: books.name,
              bookLevel: books.level,
            })
            .from(studentBookHistory)
            .innerJoin(books, eq(studentBookHistory.bookId, books.id))
            .where(eq(studentBookHistory.studentId, student.id))
            .orderBy(studentBookHistory.startedAt)
            .limit(1);

          return {
            ...student,
            objective: profile[0]?.objective || null,
            currentLevel: profile[0]?.currentLevel || null,
            totalHoursLearned: profile[0]?.totalHoursLearned || 0,
            streakDays: profile[0]?.streakDays || 0,
            lastActivityAt: profile[0]?.lastActivityAt || null,
            currentBook: currentBookProgress[0]?.bookName || null,
            currentBookLevel: currentBookProgress[0]?.bookLevel || null,
            currentBookStatus: currentBookProgress[0]?.status || null,
            currentBookStartedAt: currentBookProgress[0]?.startedAt || null,
          };
        })
      );

      return {
        success: true,
        count: enrichedStudents.length,
        data: enrichedStudents,
        exportedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("[Admin Export] Error exporting active students:", error);
      return {
        success: false,
        message: error.message || "Erro ao exportar alunos ativos",
        count: 0,
        data: [],
      };
    }
  }),

  /**
   * Exportar dados de alunos ativos em formato CSV
   * Retorna string CSV com headers e dados dos alunos
   */
  exportActiveStudentsCSV: adminProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Buscar todos os alunos ativos
      const activeStudents = await db
        .select({
          id: users.id,
          studentId: users.studentId,
          name: users.name,
          email: users.email,
          role: users.role,
          status: users.status,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          lastSignedIn: users.lastSignedIn,
        })
        .from(users)
        .where(eq(users.status, "ativo"))
        .orderBy(users.createdAt);

      // Enriquecer com dados de perfil e livro atual
      const enrichedStudents = await Promise.all(
        activeStudents.map(async (student) => {
          const profile = await db
            .select()
            .from(studentProfiles)
            .where(eq(studentProfiles.userId, student.id))
            .limit(1);

          const currentBookProgress = await db
            .select({
              bookId: studentBookHistory.bookId,
              status: studentBookHistory.status,
              startedAt: studentBookHistory.startedAt,
              completedAt: studentBookHistory.completedAt,
              finalGrade: studentBookHistory.finalGrade,
              bookName: books.name,
              bookLevel: books.level,
            })
            .from(studentBookHistory)
            .innerJoin(books, eq(studentBookHistory.bookId, books.id))
            .where(eq(studentBookHistory.studentId, student.id))
            .orderBy(studentBookHistory.startedAt)
            .limit(1);

          return {
            ...student,
            objective: profile[0]?.objective || "",
            currentLevel: profile[0]?.currentLevel || "",
            totalHoursLearned: profile[0]?.totalHoursLearned || 0,
            streakDays: profile[0]?.streakDays || 0,
            lastActivityAt: profile[0]?.lastActivityAt || "",
            currentBook: currentBookProgress[0]?.bookName || "",
            currentBookLevel: currentBookProgress[0]?.bookLevel || "",
            currentBookStatus: currentBookProgress[0]?.status || "",
            currentBookStartedAt: currentBookProgress[0]?.startedAt || "",
          };
        })
      );

      // Criar CSV com headers
      const headers = [
        "ID",
        "Student ID",
        "Nome",
        "Email",
        "Role",
        "Status",
        "Objetivo",
        "Nível Atual",
        "Horas Aprendidas",
        "Dias de Streak",
        "Última Atividade",
        "Livro Atual",
        "Nível do Livro",
        "Status do Livro",
        "Início do Livro",
        "Data de Criação",
        "Último Acesso",
      ];

      const csvRows = enrichedStudents.map((student) => [
        student.id,
        student.studentId || "",
        escapeCSV(student.name || ""),
        escapeCSV(student.email || ""),
        student.role,
        student.status || "",
        student.objective,
        student.currentLevel,
        student.totalHoursLearned,
        student.streakDays,
        formatDate(student.lastActivityAt),
        escapeCSV(student.currentBook),
        student.currentBookLevel,
        student.currentBookStatus,
        formatDate(student.currentBookStartedAt),
        formatDate(student.createdAt),
        formatDate(student.lastSignedIn),
      ]);

      const csv =
        headers.join(",") +
        "\n" +
        csvRows.map((row) => row.join(",")).join("\n");

      return {
        success: true,
        count: enrichedStudents.length,
        csv: csv,
        exportedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("[Admin Export] Error exporting CSV:", error);
      return {
        success: false,
        message: error.message || "Erro ao exportar CSV",
        csv: "",
      };
    }
  }),

  /**
   * Obter estatísticas de alunos ativos
   */
  getActiveStudentsStats: adminProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Total de alunos ativos
      const totalActive = await db
        .select({ count: users.id })
        .from(users)
        .where(eq(users.status, "ativo"));

      // Alunos por nível
      const byLevel = await db
        .select({
          level: studentProfiles.currentLevel,
          count: users.id,
        })
        .from(users)
        .innerJoin(studentProfiles, eq(users.id, studentProfiles.userId))
        .where(eq(users.status, "ativo"));

      // Alunos por livro
      const byBook = await db
        .select({
          bookName: books.name,
          count: users.id,
        })
        .from(users)
        .innerJoin(studentBookHistory, eq(users.id, studentBookHistory.studentId))
        .innerJoin(books, eq(studentBookHistory.bookId, books.id))
        .where(eq(users.status, "ativo"));

      // Horas totais aprendidas
      const totalHours = await db
        .select({
          total: studentProfiles.totalHoursLearned,
        })
        .from(studentProfiles)
        .innerJoin(users, eq(studentProfiles.userId, users.id))
        .where(eq(users.status, "ativo"));

      const totalHoursSum = totalHours.reduce(
        (sum, row) => sum + (row.total || 0),
        0
      );

      return {
        success: true,
        stats: {
          totalActive: totalActive[0]?.count || 0,
          byLevel: byLevel,
          byBook: byBook,
          totalHoursLearned: totalHoursSum,
          exportedAt: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      console.error("[Admin Export] Error getting stats:", error);
      return {
        success: false,
        message: error.message || "Erro ao obter estatísticas",
        stats: null,
      };
    }
  }),
});

/**
 * Função auxiliar para escapar valores CSV
 */
function escapeCSV(value: string): string {
  if (!value) return "";
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Função auxiliar para formatar datas
 */
function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
}
