import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { studentTopicProgress } from "../../drizzle/schema";
import { and, eq } from "drizzle-orm";
import crypto from "crypto";

/**
 * Webhook Sync Router
 * Recebe eventos do Dashboard e sincroniza progresso
 */

// Validar assinatura do webhook
function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return hash === signature;
}

export const webhookSyncRouter = router({
  /**
   * Receber evento de aluno adicionado
   */
  onStudentAdded: publicProcedure
    .input(
      z.object({
        studentId: z.number(),
        studentName: z.string(),
        email: z.string().email(),
        book: z.number().min(1).max(5),
        signature: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Validar assinatura (se fornecida)
        if (input.signature) {
          const secret = process.env.WEBHOOK_SECRET || "default-secret";
          const payload = JSON.stringify({
            studentId: input.studentId,
            studentName: input.studentName,
            email: input.email,
            book: input.book,
          });

          if (!validateWebhookSignature(payload, input.signature, secret)) {
            throw new Error("Assinatura de webhook inválida");
          }
        }

        return {
          success: true,
          message: `Aluno ${input.studentName} registrado com sucesso`,
          studentId: input.studentId,
        };
      } catch (error) {
        throw new Error(
          `Erro ao processar aluno adicionado: ${
            error instanceof Error ? error.message : "Desconhecido"
          }`
        );
      }
    }),

  /**
   * Receber evento de nota atualizada
   */
  onGradeUpdated: publicProcedure
    .input(
      z.object({
        studentId: z.number(),
        topicId: z.string(),
        topicName: z.string(),
        grade: z.number().min(0).max(100),
        category: z.enum(["professional", "traveller", "general"]),
        signature: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database não disponível");

        // Validar assinatura
        if (input.signature) {
          const secret = process.env.WEBHOOK_SECRET || "default-secret";
          const payload = JSON.stringify({
            studentId: input.studentId,
            topicId: input.topicId,
            grade: input.grade,
          });

          if (!validateWebhookSignature(payload, input.signature, secret)) {
            throw new Error("Assinatura de webhook inválida");
          }
        }

        // Registrar progresso do tópico
        const progressPercentage = Math.round(input.grade);

        // Verificar se já existe
        const existing = await db
          .select()
          .from(studentTopicProgress)
          .where(
            and(
              eq(studentTopicProgress.studentId, input.studentId),
              eq(studentTopicProgress.topicId, input.topicId)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(studentTopicProgress)
            .set({
              progressPercentage,
              completed: progressPercentage === 100,
              completedAt: progressPercentage === 100 ? new Date() : null,
              lastAccessedAt: new Date(),
            })
            .where(
              and(
                eq(studentTopicProgress.studentId, input.studentId),
                eq(studentTopicProgress.topicId, input.topicId)
              )
            );
        } else {
          await db.insert(studentTopicProgress).values({
            studentId: input.studentId,
            topicId: input.topicId,
            topicName: input.topicName,
            category: input.category,
            progressPercentage,
            completed: progressPercentage === 100,
            completedAt: progressPercentage === 100 ? new Date() : null,
          });
        }

        return {
          success: true,
          message: `Progresso atualizado: ${input.topicName} - ${progressPercentage}%`,
          progressPercentage,
        };
      } catch (error) {
        throw new Error(
          `Erro ao processar nota atualizada: ${
            error instanceof Error ? error.message : "Desconhecido"
          }`
        );
      }
    }),

  /**
   * Receber evento de presença registrada
   */
  onAttendanceRecorded: publicProcedure
    .input(
      z.object({
        studentId: z.number(),
        date: z.string(),
        present: z.boolean(),
        signature: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Validar assinatura
        if (input.signature) {
          const secret = process.env.WEBHOOK_SECRET || "default-secret";
          const payload = JSON.stringify({
            studentId: input.studentId,
            date: input.date,
            present: input.present,
          });

          if (!validateWebhookSignature(payload, input.signature, secret)) {
            throw new Error("Assinatura de webhook inválida");
          }
        }

        return {
          success: true,
          message: `Presença registrada para ${input.date}: ${
            input.present ? "Presente" : "Ausente"
          }`,
          studentId: input.studentId,
          present: input.present,
        };
      } catch (error) {
        throw new Error(
          `Erro ao processar presença: ${
            error instanceof Error ? error.message : "Desconhecido"
          }`
        );
      }
    }),

  /**
   * Verificar saúde do webhook
   */
  healthCheck: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return {
          status: "error",
          message: "Database não disponível",
        };
      }

      return {
        status: "healthy",
        message: "Webhook sincronizado e pronto para receber eventos",
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: "error",
        message: `Erro ao verificar saúde: ${
          error instanceof Error ? error.message : "Desconhecido"
        }`,
      };
    }
  }),

  /**
   * Obter estatísticas de sincronização
   */
  getSyncStats: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database não disponível");

      const allProgress = await db
        .select()
        .from(studentTopicProgress);

      const completed = allProgress.filter((p) => p.completed).length;
      const inProgress = allProgress.filter(
        (p) => !p.completed && p.progressPercentage > 0
      ).length;
      const notStarted = allProgress.filter(
        (p) => p.progressPercentage === 0
      ).length;

      return {
        totalTopics: allProgress.length,
        completed,
        inProgress,
        notStarted,
        completionRate: allProgress.length > 0
          ? Math.round((completed / allProgress.length) * 100)
          : 0,
        lastSync: new Date(),
      };
    } catch (error) {
      throw new Error(
        `Erro ao obter estatísticas: ${
          error instanceof Error ? error.message : "Desconhecido"
        }`
      );
    }
  }),
});
