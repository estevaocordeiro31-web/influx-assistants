import { router, adminProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { runDailySyncNow, getSyncStats } from "../jobs/daily-sync";

/**
 * Router para sincronização de alunos com o Dashboard Central
 * Usa CENTRAL_DATABASE_URL para buscar dados reais
 */
export const bulkStudentSyncRouter = router({
  /**
   * Sincronizar todos os alunos do Dashboard Central
   * Apenas admins podem executar
   */
  syncAllStudents: adminProcedure
    .input(z.object({
      dryRun: z.boolean().default(false),
    }).optional())
    .mutation(async () => {
      try {
        const result = await runDailySyncNow();
        return {
          success: true,
          message: `Sincronização concluída: ${result.created} criados, ${result.updated} atualizados, ${result.errors} erros`,
          total: result.total,
          created: result.created,
          updated: result.updated,
          failed: result.errors,
          errors: [],
          students: result.details.map(d => ({ status: d })),
        };
      } catch (error) {
        throw new Error(
          `Erro ao sincronizar alunos: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    }),

  /**
   * Obter estatísticas de sincronização com o Dashboard Central
   */
  getSyncStatus: adminProcedure.query(async () => {
    try {
      const stats = await getSyncStats();
      return {
        totalStudents: stats.localTotal,
        centralTotal: stats.centralTotal,
        centralAtivos: stats.centralAtivos,
        linkedTotal: stats.linkedTotal,
        unlinked: stats.unlinked,
        lastSync: new Date(stats.lastSync),
        status: "synced",
      };
    } catch (error) {
      throw new Error(`Erro ao obter status: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  }),

  /**
   * Obter aluno por email (para verificação)
   */
  getStudentByEmail: protectedProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .query(async ({ input }) => {
      try {
        const mysql = await import('mysql2/promise');
        const connection = await mysql.default.createConnection(process.env.CENTRAL_DATABASE_URL!);
        try {
          const [rows] = await connection.execute(
            'SELECT id, name, email, phone, status, book_level FROM students WHERE email = ? LIMIT 1',
            [input.email]
          );
          const students = rows as any[];
          return students.length > 0 ? students[0] : null;
        } finally {
          await connection.end();
        }
      } catch (error) {
        throw new Error(`Erro ao obter aluno: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
      }
    }),
});
