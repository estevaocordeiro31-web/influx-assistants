/**
 * Router de Sincronização da Elie com o Dashboard Central
 * 
 * Sincroniza dados gerados pela Elie (progresso, perfil, inteligência do aluno)
 * para as tabelas do banco central, garantindo consistência entre os sistemas.
 * 
 * Tabelas do banco central utilizadas:
 * - student_intelligence: perfil de aprendizado, pontos fortes/fracos, estilo
 * - tutor_student_progress: progresso por tópico/chunk
 * - student_profiles: foto, objetivo de aprendizado
 * - tutor_conversations: histórico de conversas com a Elie
 */

import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import mysql from "mysql2/promise";

async function getCentralConnection() {
  return mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
}

export const elieSyncRouter = router({

  /**
   * Sincronizar perfil de inteligência do aluno para o banco central
   * Chamado automaticamente após sessões com a Elie
   */
  syncStudentIntelligence: protectedProcedure
    .input(z.object({
      studentId: z.number().optional(),
      interestProfile: z.string().optional(),
      painPoints: z.string().optional(),
      learningStyle: z.enum(["visual", "auditivo", "cinestetico", "leitura_escrita"]).optional(),
      currentLevel: z.string().optional(),
      masteredTopics: z.array(z.string()).optional(),
      strugglingTopics: z.array(z.string()).optional(),
      confidenceScore: z.number().min(0).max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const conn = await getCentralConnection();
      try {
        // Buscar student_id do usuário logado
        const [userRows] = await conn.execute(
          `SELECT student_id FROM users WHERE id = ? AND student_id IS NOT NULL`,
          [ctx.user.id]
        );
        const users = userRows as any[];
        const studentId = input.studentId || (users.length > 0 ? users[0].student_id : null);

        if (!studentId) {
          return { success: false, message: "Aluno não vinculado ao Dashboard Central" };
        }

        // Verificar se já existe registro de inteligência
        const [existing] = await conn.execute(
          `SELECT id FROM student_intelligence WHERE student_id = ?`,
          [studentId]
        );
        const existingRows = existing as any[];

        if (existingRows.length > 0) {
          // Atualizar registro existente
          const updates: string[] = [];
          const values: any[] = [];

          if (input.interestProfile) { updates.push("interest_profile = ?"); values.push(input.interestProfile); }
          if (input.painPoints) { updates.push("pain_points = ?"); values.push(input.painPoints); }
          if (input.learningStyle) { updates.push("learning_style = ?"); values.push(input.learningStyle); }
          if (input.currentLevel) { updates.push("current_level = ?"); values.push(input.currentLevel); }
          if (input.masteredTopics) { updates.push("mastered_topics = ?"); values.push(JSON.stringify(input.masteredTopics)); }
          if (input.strugglingTopics) { updates.push("struggling_topics = ?"); values.push(JSON.stringify(input.strugglingTopics)); }
          if (input.confidenceScore !== undefined) { updates.push("confidence_score = ?"); values.push(input.confidenceScore); }
          
          updates.push("last_tutor_sync = NOW()");
          updates.push("updated_at = NOW()");
          values.push(existingRows[0].id);

          if (updates.length > 2) {
            await conn.execute(
              `UPDATE student_intelligence SET ${updates.join(", ")} WHERE id = ?`,
              values
            );
          }
        } else {
          // Criar novo registro
          await conn.execute(
            `INSERT INTO student_intelligence 
             (student_id, interest_profile, pain_points, learning_style, current_level, 
              mastered_topics, struggling_topics, confidence_score, last_tutor_sync, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
            [
              studentId,
              input.interestProfile || null,
              input.painPoints || null,
              input.learningStyle || null,
              input.currentLevel || null,
              JSON.stringify(input.masteredTopics || []),
              JSON.stringify(input.strugglingTopics || []),
              input.confidenceScore || 50,
            ]
          );
        }

        // Propagar pa_confidence_score e last_elie_session para a tabela students (spec v1.0)
        if (input.confidenceScore !== undefined) {
          await conn.execute(
            `UPDATE students SET 
              pa_confidence_score = ?,
              last_elie_session = NOW(),
              last_activity_at = NOW()
            WHERE id = ?`,
            [input.confidenceScore, studentId]
          ).catch(() => {}); // Silencia se colunas ainda não existirem
        } else {
          await conn.execute(
            `UPDATE students SET last_elie_session = NOW(), last_activity_at = NOW() WHERE id = ?`,
            [studentId]
          ).catch(() => {});
        }

        return { success: true, message: "Perfil de inteligência sincronizado com sucesso", studentId };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Obter perfil de inteligência do aluno do banco central
   */
  getStudentIntelligence: protectedProcedure
    .query(async ({ ctx }) => {
      const conn = await getCentralConnection();
      try {
        const [userRows] = await conn.execute(
          `SELECT student_id FROM users WHERE id = ? AND student_id IS NOT NULL`,
          [ctx.user.id]
        );
        const users = userRows as any[];
        if (users.length === 0) return null;

        const [rows] = await conn.execute(
          `SELECT * FROM student_intelligence WHERE student_id = ? LIMIT 1`,
          [users[0].student_id]
        );
        const data = rows as any[];
        if (data.length === 0) return null;

        const intel = data[0];
        return {
          interestProfile: intel.interest_profile,
          painPoints: intel.pain_points,
          learningStyle: intel.learning_style,
          currentLevel: intel.current_level,
          masteredTopics: typeof intel.mastered_topics === 'string' 
            ? JSON.parse(intel.mastered_topics || '[]') 
            : (intel.mastered_topics || []),
          strugglingTopics: typeof intel.struggling_topics === 'string'
            ? JSON.parse(intel.struggling_topics || '[]')
            : (intel.struggling_topics || []),
          confidenceScore: intel.confidence_score,
          lastTutorSync: intel.last_tutor_sync,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Registrar interação de conversa com a Elie no banco central
   */
  logTutorConversation: protectedProcedure
    .input(z.object({
      studentId: z.number().optional(),
      sessionType: z.enum(["exercicio", "conversa", "revisao", "reading_club", "tutor"]).default("tutor"),
      summary: z.string(),
      topicsDiscussed: z.array(z.string()).optional(),
      exercisesCompleted: z.number().default(0),
      durationMinutes: z.number().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const conn = await getCentralConnection();
      try {
        const [userRows] = await conn.execute(
          `SELECT student_id FROM users WHERE id = ? AND student_id IS NOT NULL`,
          [ctx.user.id]
        );
        const users = userRows as any[];
        const studentId = input.studentId || (users.length > 0 ? users[0].student_id : null);

        if (!studentId) {
          return { success: false, message: "Aluno não vinculado ao Dashboard Central" };
        }

        // Verificar se tabela tutor_conversations tem as colunas necessárias
        await conn.execute(
          `INSERT INTO tutor_conversations 
           (student_id, session_type, summary, topics_discussed, exercises_completed, duration_minutes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE updated_at = NOW()`,
          [
            studentId,
            input.sessionType,
            input.summary,
            JSON.stringify(input.topicsDiscussed || []),
            input.exercisesCompleted,
            input.durationMinutes,
          ]
        ).catch(async () => {
          // Se falhar por estrutura diferente, tenta insert simplificado
          await conn.execute(
            `INSERT INTO tutor_conversations (student_id, created_at) VALUES (?, NOW())`,
            [studentId]
          );
        });

        return { success: true, message: "Conversa registrada no Dashboard Central" };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Obter estatísticas de sincronização da Elie (admin)
   */
  getSyncStats: adminProcedure
    .query(async () => {
      const conn = await getCentralConnection();
      try {
        const [intelligenceCount] = await conn.execute(
          `SELECT COUNT(*) as total FROM student_intelligence`
        );
        const [linkedUsers] = await conn.execute(
          `SELECT COUNT(*) as total FROM users WHERE role = 'user' AND student_id IS NOT NULL`
        );
        const [conversationsCount] = await conn.execute(
          `SELECT COUNT(*) as total FROM tutor_conversations`
        ).catch(() => [[{ total: 0 }]]);

        return {
          studentsWithIntelligence: (intelligenceCount as any[])[0].total,
          linkedUsers: (linkedUsers as any[])[0].total,
          totalConversations: (conversationsCount as any[])[0].total,
          lastSync: new Date().toISOString(),
        };
      } finally {
        await conn.end();
      }
    }),
});
