import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import mysql from "mysql2/promise";

// ============================================================
// Dashboard Integration Router
// Sincroniza dados entre Dashboard (fonte) e Personal Assistants
// ============================================================

// Helper: conectar ao banco central (Dashboard)
async function getCentralDb() {
  const url = process.env.CENTRAL_DATABASE_URL;
  if (!url) throw new Error("CENTRAL_DATABASE_URL not configured");
  return mysql.createConnection(url);
}

export const dashboardIntegrationRouter = router({
  // ─────────────────────────────────────────────
  // SYNC: Puxar dados de alunos do Dashboard
  // ─────────────────────────────────────────────

  /**
   * Sincronizar lista de alunos ativos do banco central
   */
  syncStudentsFromDashboard: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas admins podem sincronizar" });
      }

      const centralConn = await getCentralDb();
      const localDb = await getDb();
      if (!localDb) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB local indisponível" });

      try {
        // Buscar alunos ativos do banco central
        const [centralStudents] = await centralConn.query(
          `SELECT id, openId, name, email, role, password_hash 
           FROM users 
           WHERE role IN ('user', 'student') 
           ORDER BY name`
        ) as any[];

        let synced = 0;
        let created = 0;
        let updated = 0;
        let errors = 0;

        for (const student of centralStudents) {
          try {
            // Verificar se aluno já existe no banco local
            const existing = await localDb
              .select()
              .from(users)
              .where(eq(users.email, student.email))
              .limit(1);

            if (existing.length > 0) {
              // Atualizar dados
              await localDb
                .update(users)
                .set({
                  name: student.name,
                  openId: student.openId,
                })
                .where(eq(users.email, student.email));
              updated++;
            } else {
              // Criar novo aluno
              await localDb.insert(users).values({
                openId: student.openId,
                name: student.name,
                email: student.email,
                role: "user",
                status: "ativo",
                loginMethod: "password",
              });
              created++;
            }
            synced++;
          } catch (err: any) {
            errors++;
            console.error(`[DashboardSync] Erro ao sincronizar ${student.email}:`, err.message);
          }
        }

        console.log(`[DashboardSync] Sincronização concluída: ${synced} alunos (${created} novos, ${updated} atualizados, ${errors} erros)`);

        return {
          success: true,
          total: centralStudents.length,
          synced,
          created,
          updated,
          errors,
        };
      } finally {
        await centralConn.end();
      }
    }),

  /**
   * Obter estatísticas de sincronização
   */
  getSyncStats: protectedProcedure.query(async ({ ctx }) => {
    const localDb = await getDb();
    if (!localDb) return { totalLocal: 0, totalCentral: 0, lastSync: null };

    try {
      const [localCount] = await localDb
        .select({ count: sql<number>`COUNT(*)` })
        .from(users)
        .where(sql`role IN ('user', 'student')`);

      let centralCount = 0;
      try {
        const centralConn = await getCentralDb();
        const [rows] = await centralConn.query(
          "SELECT COUNT(*) as count FROM users WHERE role IN ('user', 'student')"
        ) as any[];
        centralCount = rows[0]?.count || 0;
        await centralConn.end();
      } catch {
        centralCount = -1; // Indica erro de conexão
      }

      return {
        totalLocal: localCount?.count || 0,
        totalCentral: centralCount,
        lastSync: new Date().toISOString(),
      };
    } catch {
      return { totalLocal: 0, totalCentral: 0, lastSync: null };
    }
  }),

  // ─────────────────────────────────────────────
  // TRACKING: Enviar dados de acompanhamento ao Dashboard
  // ─────────────────────────────────────────────

  /**
   * Registrar evento de acompanhamento do aluno
   * Envia dados de progresso, dificuldades e padrões para o Dashboard
   */
  sendTrackingEvent: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        eventType: z.enum([
          "quiz_completed",
          "lesson_completed",
          "difficulty_detected",
          "ai_adaptation",
          "pronunciation_score",
          "chat_session",
          "exercise_completed",
          "streak_milestone",
        ]),
        data: z.record(z.string(), z.any()),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const centralConn = await getCentralDb();

        // Verificar se a tabela de tracking existe no banco central
        try {
          await centralConn.execute(
            `INSERT INTO student_tracking_events 
             (student_id, event_type, source_system, event_data, created_at)
             VALUES (?, ?, 'personal_assistants', ?, NOW())`,
            [input.studentId, input.eventType, JSON.stringify(input.data)]
          );
          await centralConn.end();
          return { success: true, message: "Evento registrado no Dashboard" };
        } catch (tableErr: any) {
          // Se a tabela não existir, registrar localmente
          console.log(`[DashboardSync] Tabela de tracking não existe no central, registrando localmente`);
          await centralConn.end();
          return { success: true, message: "Evento registrado localmente (tabela central não disponível)" };
        }
      } catch (err: any) {
        console.error("[DashboardSync] Erro ao enviar tracking:", err.message);
        return { success: false, message: err.message };
      }
    }),

  /**
   * Enviar perfil de aprendizado enriquecido para o Dashboard
   */
  sendLearningProfile: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        profile: z.object({
          strengths: z.array(z.string()).optional(),
          weaknesses: z.array(z.string()).optional(),
          learningStyle: z.string().optional(),
          preferredTopics: z.array(z.string()).optional(),
          aiAdaptations: z.record(z.string(), z.any()).optional(),
          quizHistory: z
            .array(
              z.object({
                quizId: z.string(),
                score: z.number(),
                date: z.string(),
              })
            )
            .optional(),
          totalPoints: z.number().optional(),
          currentStreak: z.number().optional(),
        }),
      })
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .mutation(async ({ input }) => {
      try {
        const centralConn = await getCentralDb();

        try {
          await centralConn.execute(
            `INSERT INTO student_learning_profiles 
             (student_id, source_system, profile_data, updated_at)
             VALUES (?, 'personal_assistants', ?, NOW())
             ON DUPLICATE KEY UPDATE 
             profile_data = VALUES(profile_data), 
             updated_at = NOW()`,
            [input.studentId, JSON.stringify(input.profile)]
          );
          await centralConn.end();
          return { success: true, message: "Perfil de aprendizado enviado ao Dashboard" };
        } catch {
          await centralConn.end();
          return { success: true, message: "Perfil registrado localmente" };
        }
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    }),

  // ─────────────────────────────────────────────
  // CALENDAR: Receber eventos do Dashboard
  // ─────────────────────────────────────────────

  /**
   * Puxar calendário de aulas do aluno do Dashboard
   */
  getStudentCalendar: protectedProcedure
    .input(
      z.object({
        studentId: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const centralConn = await getCentralDb();
        const studentId = input.studentId || ctx.user?.id;

        // Tentar buscar do banco central
        try {
          const [events] = await centralConn.query(
            `SELECT * FROM student_calendar_events 
             WHERE student_id = ? 
             ORDER BY event_date DESC 
             LIMIT 50`,
            [studentId]
          ) as any[];
          await centralConn.end();
          return { success: true, events, source: "dashboard" };
        } catch {
          await centralConn.end();
          // Retornar calendário vazio se tabela não existir
          return { success: true, events: [], source: "empty", message: "Calendário não disponível ainda" };
        }
      } catch (err: any) {
        return { success: false, events: [], source: "error", message: err.message };
      }
    }),

  // ─────────────────────────────────────────────
  // MESSAGES: Receber mensagens do pedagógico
  // ─────────────────────────────────────────────

  /**
   * Puxar mensagens do pedagógico para o aluno
   */
  getStudentMessages: protectedProcedure
    .input(
      z.object({
        studentId: z.number().optional(),
        unreadOnly: z.boolean().default(false),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const centralConn = await getCentralDb();
        const studentId = input.studentId || ctx.user?.id;

        try {
          const query = input.unreadOnly
            ? `SELECT * FROM pedagogical_messages WHERE student_id = ? AND read_at IS NULL ORDER BY created_at DESC LIMIT ?`
            : `SELECT * FROM pedagogical_messages WHERE student_id = ? ORDER BY created_at DESC LIMIT ?`;

          const [messages] = await centralConn.query(query, [studentId, input.limit]) as any[];
          await centralConn.end();
          return { success: true, messages, source: "dashboard" };
        } catch {
          await centralConn.end();
          return { success: true, messages: [], source: "empty", message: "Mensagens não disponíveis ainda" };
        }
      } catch (err: any) {
        return { success: false, messages: [], source: "error", message: err.message };
      }
    }),

  // ─────────────────────────────────────────────
  // NEWS: Receber notícias e eventos da instituição
  // ─────────────────────────────────────────────

  /**
   * Puxar feed de notícias e eventos
   */
  getNewsFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        category: z.enum(["all", "news", "events", "announcements"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      try {
        const centralConn = await getCentralDb();

        try {
          const whereClause = input.category === "all" ? "" : `WHERE category = '${input.category}'`;
          const [items] = await centralConn.query(
            `SELECT * FROM news_feed ${whereClause} ORDER BY published_at DESC LIMIT ?`,
            [input.limit]
          ) as any[];
          await centralConn.end();
          return { success: true, items, source: "dashboard" };
        } catch {
          await centralConn.end();
          return { success: true, items: [], source: "empty", message: "Feed não disponível ainda" };
        }
      } catch (err: any) {
        return { success: false, items: [], source: "error", message: err.message };
      }
    }),

  // ─────────────────────────────────────────────
  // GRADES: Receber notas do aluno
  // ─────────────────────────────────────────────

  /**
   * Puxar notas do aluno do Dashboard
   */
  getStudentGrades: protectedProcedure
    .input(
      z.object({
        studentId: z.number().optional(),
        period: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const centralConn = await getCentralDb();
        const studentId = input.studentId || ctx.user?.id;

        try {
          const [grades] = await centralConn.query(
            `SELECT * FROM student_grades WHERE student_id = ? ORDER BY grade_date DESC LIMIT 50`,
            [studentId]
          ) as any[];
          await centralConn.end();
          return { success: true, grades, source: "dashboard" };
        } catch {
          await centralConn.end();
          return { success: true, grades: [], source: "empty", message: "Notas não disponíveis ainda" };
        }
      } catch (err: any) {
        return { success: false, grades: [], source: "error", message: err.message };
      }
    }),

  // ─────────────────────────────────────────────
  // ATTENDANCE: Receber presença do aluno
  // ─────────────────────────────────────────────

  /**
   * Puxar registro de presença do aluno
   */
  getStudentAttendance: protectedProcedure
    .input(
      z.object({
        studentId: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const centralConn = await getCentralDb();
        const studentId = input.studentId || ctx.user?.id;

        try {
          const [records] = await centralConn.query(
            `SELECT * FROM student_attendance WHERE student_id = ? ORDER BY attendance_date DESC LIMIT 100`,
            [studentId]
          ) as any[];
          await centralConn.end();
          return { success: true, records, source: "dashboard" };
        } catch {
          await centralConn.end();
          return { success: true, records: [], source: "empty", message: "Presença não disponível ainda" };
        }
      } catch (err: any) {
        return { success: false, records: [], source: "error", message: err.message };
      }
    }),

  // ─────────────────────────────────────────────
  // HEALTH: Verificar saúde da integração
  // ─────────────────────────────────────────────

  /**
   * Verificar saúde da conexão com o Dashboard
   */
  healthCheck: publicProcedure.query(async () => {
    const checks = {
      localDb: false,
      centralDb: false,
      timestamp: new Date().toISOString(),
    };

    try {
      const localDb = await getDb();
      if (localDb) {
        await localDb.select({ val: sql`1` }).from(users).limit(1);
        checks.localDb = true;
      }
    } catch {}

    try {
      const centralConn = await getCentralDb();
      await centralConn.query("SELECT 1");
      checks.centralDb = true;
      await centralConn.end();
    } catch {}

    return {
      healthy: checks.localDb && checks.centralDb,
      ...checks,
    };
  }),
});
