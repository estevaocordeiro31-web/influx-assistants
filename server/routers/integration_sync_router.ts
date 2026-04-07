import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, desc, and, gte, lte, isNull } from "drizzle-orm";
import crypto from "crypto";

// Schemas de validação
const StudentSyncSchema = z.object({
  student_id: z.number().positive(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  level: z.string(),
  class: z.string(),
  status: z.enum(["ativo", "inativo", "desistente", "trancado"]),
  enrollment_date: z.string().datetime().optional(),
  birth_date: z.string().optional(),
  interests: z.array(z.string()).optional(),
  learning_style: z.string().optional(),
  goals: z.array(z.string()).optional(),
  difficulties: z.array(z.string()).optional(),
});

const TrackingEventSchema = z.object({
  student_id: z.number().positive(),
  event_type: z.enum([
    "quiz_completed",
    "interaction",
    "difficulty_identified",
    "pattern_detected",
    "ai_adaptation",
  ]),
  event_data: z.record(z.any()),
  source: z.string(),
});

const WebhookPayloadSchema = z.object({
  event_type: z.string(),
  student_id: z.number().positive().optional(),
  data: z.record(z.any()),
  timestamp: z.string().datetime(),
});

export const integrationSyncRouter = router({
  // ============================================
  // STUDENT SYNCHRONIZATION
  // ============================================

  /**
   * Get all active students for synchronization
   * Used by Personal Assistants to fetch student data
   */
  getStudents: publicProcedure
    .input(
      z.object({
        updated_since: z.string().datetime().optional(),
        limit: z.number().min(1).max(1000).default(100),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Buscar estudantes ativos
        let query = db.query.students.findMany({
          where: eq("status", "ativo"),
          limit: input.limit,
          offset: input.offset,
        });

        // Filtrar por data de atualização se fornecida
        if (input.updated_since) {
          const sinceDate = new Date(input.updated_since);
          query = db.query.students.findMany({
            where: and(
              eq("status", "ativo"),
              gte("updated_at", sinceDate)
            ),
            limit: input.limit,
            offset: input.offset,
          });
        }

        const students = await query;

        // Enriquecer com dados de perfil de aprendizado
        const enrichedStudents = await Promise.all(
          students.map(async (student: any) => {
            const profile = await db.query.student_learning_profile.findFirst({
              where: eq("student_id", student.id),
            });

            return {
              student_id: student.id,
              name: student.name,
              email: student.email,
              phone: student.phone,
              level: student.level,
              class: student.class,
              status: student.status,
              enrollment_date: student.enrollment_date,
              birth_date: student.birth_date,
              interests: student.interests || [],
              learning_style: profile?.learning_style || "mixed",
              goals: student.goals || [],
              difficulties: student.difficulties || [],
              learning_profile: profile,
            };
          })
        );

        return {
          students: enrichedStudents,
          total: enrichedStudents.length,
          limit: input.limit,
          offset: input.offset,
        };
      } catch (error) {
        console.error("Error fetching students:", error);
        throw new Error("Failed to fetch students");
      }
    }),

  /**
   * Get specific student data
   */
  getStudent: publicProcedure
    .input(z.object({ student_id: z.number().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const student = await db.query.students.findFirst({
          where: eq("id", input.student_id),
        });

        if (!student) {
          throw new Error("Student not found");
        }

        // Buscar perfil de aprendizado
        const profile = await db.query.student_learning_profile.findFirst({
          where: eq("student_id", input.student_id),
        });

        // Buscar eventos de rastreamento
        const events = await db.query.student_tracking_events.findMany({
          where: eq("student_id", input.student_id),
          orderBy: desc("created_at"),
          limit: 50,
        });

        return {
          ...student,
          learning_profile: profile,
          recent_events: events,
        };
      } catch (error) {
        console.error("Error fetching student:", error);
        throw new Error("Failed to fetch student");
      }
    }),

  /**
   * Sync student data (webhook endpoint)
   */
  syncStudent: publicProcedure
    .input(StudentSyncSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Registrar no sync log
        await db.insert("integration_sync_log").values({
          source: "personal_assistants",
          destination: "dashboard",
          event_type: "student_sync",
          student_id: input.student_id,
          data: JSON.stringify(input),
          status: "success",
        });

        // Atualizar status de sincronização
        await db
          .insert("student_sync_status")
          .values({
            student_id: input.student_id,
            sync_status: "synced",
            last_synced_at: new Date(),
            sync_count: 1,
          })
          .onConflictDoUpdate({
            target: "student_id",
            set: {
              last_synced_at: new Date(),
              sync_count: db.raw("sync_count + 1"),
              sync_status: "synced",
            },
          });

        return {
          success: true,
          message: "Student synced successfully",
          student_id: input.student_id,
        };
      } catch (error) {
        console.error("Error syncing student:", error);

        // Registrar erro
        await db.insert("integration_sync_log").values({
          source: "personal_assistants",
          destination: "dashboard",
          event_type: "student_sync",
          student_id: input.student_id,
          data: JSON.stringify(input),
          status: "failed",
          error_message: error instanceof Error ? error.message : "Unknown error",
        });

        throw new Error("Failed to sync student");
      }
    }),

  // ============================================
  // TRACKING EVENTS
  // ============================================

  /**
   * Record a tracking event (quiz completed, interaction, etc)
   */
  recordTrackingEvent: publicProcedure
    .input(TrackingEventSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Inserir evento de rastreamento
        const event = await db.insert("student_tracking_events").values({
          student_id: input.student_id,
          event_type: input.event_type,
          event_data: JSON.stringify(input.event_data),
          source: input.source,
          processed: false,
        });

        // Adicionar à fila de sincronização
        await db.insert("integration_queue").values({
          event_type: input.event_type,
          payload: JSON.stringify({
            student_id: input.student_id,
            ...input.event_data,
          }),
          destination: "dashboard",
          status: "pending",
          priority: input.event_type === "quiz_completed" ? 10 : 5,
        });

        // Registrar no sync log
        await db.insert("integration_sync_log").values({
          source: input.source,
          destination: "dashboard",
          event_type: input.event_type,
          student_id: input.student_id,
          data: JSON.stringify(input.event_data),
          status: "pending",
        });

        // Atualizar perfil de aprendizado se necessário
        if (input.event_type === "pattern_detected") {
          await updateLearningProfile(db, input.student_id, input.event_data);
        }

        return {
          success: true,
          message: "Event recorded successfully",
          event_id: event.insertId,
        };
      } catch (error) {
        console.error("Error recording tracking event:", error);
        throw new Error("Failed to record tracking event");
      }
    }),

  /**
   * Get tracking events for a student
   */
  getTrackingEvents: publicProcedure
    .input(
      z.object({
        student_id: z.number().positive(),
        event_type: z.string().optional(),
        limit: z.number().min(1).max(1000).default(100),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        let query = db.query.student_tracking_events.findMany({
          where: eq("student_id", input.student_id),
          orderBy: desc("created_at"),
          limit: input.limit,
          offset: input.offset,
        });

        if (input.event_type) {
          query = db.query.student_tracking_events.findMany({
            where: and(
              eq("student_id", input.student_id),
              eq("event_type", input.event_type)
            ),
            orderBy: desc("created_at"),
            limit: input.limit,
            offset: input.offset,
          });
        }

        const events = await query;

        return {
          events,
          total: events.length,
          limit: input.limit,
          offset: input.offset,
        };
      } catch (error) {
        console.error("Error fetching tracking events:", error);
        throw new Error("Failed to fetch tracking events");
      }
    }),

  // ============================================
  // LEARNING PROFILE
  // ============================================

  /**
   * Get student learning profile
   */
  getLearningProfile: publicProcedure
    .input(z.object({ student_id: z.number().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        let profile = await db.query.student_learning_profile.findFirst({
          where: eq("student_id", input.student_id),
        });

        if (!profile) {
          // Criar perfil padrão se não existir
          await db.insert("student_learning_profile").values({
            student_id: input.student_id,
            learning_style: "mixed",
            learning_pace: "normal",
            engagement_level: "medium",
            ai_adaptation_level: 1,
          });

          profile = await db.query.student_learning_profile.findFirst({
            where: eq("student_id", input.student_id),
          });
        }

        return profile;
      } catch (error) {
        console.error("Error fetching learning profile:", error);
        throw new Error("Failed to fetch learning profile");
      }
    }),

  /**
   * Update student learning profile
   */
  updateLearningProfile: publicProcedure
    .input(
      z.object({
        student_id: z.number().positive(),
        learning_style: z.string().optional(),
        learning_pace: z.string().optional(),
        engagement_level: z.string().optional(),
        strengths: z.array(z.string()).optional(),
        weaknesses: z.array(z.string()).optional(),
        ai_adaptation_level: z.number().min(1).max(10).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .update("student_learning_profile")
          .set({
            learning_style: input.learning_style,
            learning_pace: input.learning_pace,
            engagement_level: input.engagement_level,
            strengths: input.strengths ? JSON.stringify(input.strengths) : undefined,
            weaknesses: input.weaknesses ? JSON.stringify(input.weaknesses) : undefined,
            ai_adaptation_level: input.ai_adaptation_level,
            last_updated: new Date(),
          })
          .where(eq("student_id", input.student_id));

        return {
          success: true,
          message: "Learning profile updated successfully",
        };
      } catch (error) {
        console.error("Error updating learning profile:", error);
        throw new Error("Failed to update learning profile");
      }
    }),

  // ============================================
  // SYNC STATUS & HEALTH
  // ============================================

  /**
   * Get sync status for a student
   */
  getSyncStatus: publicProcedure
    .input(z.object({ student_id: z.number().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const status = await db.query.student_sync_status.findFirst({
          where: eq("student_id", input.student_id),
        });

        return (
          status || {
            student_id: input.student_id,
            sync_status: "pending",
            sync_count: 0,
            failed_sync_count: 0,
          }
        );
      } catch (error) {
        console.error("Error fetching sync status:", error);
        throw new Error("Failed to fetch sync status");
      }
    }),

  /**
   * Get integration health metrics
   */
  getHealthMetrics: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    try {
      // Buscar métricas do último dia
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const metrics = await db.raw(
        `
        SELECT 
          COUNT(*) as total_events,
          SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful_events,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_events,
          ROUND(SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as success_rate,
          event_type,
          source
        FROM integration_sync_log
        WHERE created_at >= ?
        GROUP BY event_type, source
        `,
        [oneDayAgo]
      );

      // Buscar fila pendente
      const queueStats = await db.raw(
        `
        SELECT 
          COUNT(*) as pending_count,
          AVG(retry_count) as avg_retries,
          MAX(created_at) as oldest_event
        FROM integration_queue
        WHERE status IN ('pending', 'processing')
        `
      );

      return {
        metrics,
        queue_stats: queueStats[0],
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      throw new Error("Failed to fetch health metrics");
    }
  }),

  // ============================================
  // WEBHOOK MANAGEMENT
  // ============================================

  /**
   * Validate webhook signature
   */
  validateWebhookSignature: publicProcedure
    .input(
      z.object({
        payload: z.string(),
        signature: z.string(),
        webhook_id: z.number().positive(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const webhook = await db.query.integration_webhooks.findFirst({
          where: eq("id", input.webhook_id),
        });

        if (!webhook) {
          throw new Error("Webhook not found");
        }

        // Validar assinatura HMAC
        const computedSignature = crypto
          .createHmac("sha256", webhook.secret_key)
          .update(input.payload)
          .digest("hex");

        const isValid = computedSignature === input.signature;

        return {
          valid: isValid,
          webhook_id: input.webhook_id,
        };
      } catch (error) {
        console.error("Error validating webhook signature:", error);
        throw new Error("Failed to validate webhook signature");
      }
    }),
});

// ============================================
// HELPER FUNCTIONS
// ============================================

async function updateLearningProfile(
  db: any,
  studentId: number,
  eventData: any
) {
  try {
    const profile = await db.query.student_learning_profile.findFirst({
      where: eq("student_id", studentId),
    });

    if (!profile) {
      return;
    }

    // Atualizar perfil com dados do evento
    const updates: any = {};

    if (eventData.learning_pace) {
      updates.learning_pace = eventData.learning_pace;
    }

    if (eventData.engagement_level) {
      updates.engagement_level = eventData.engagement_level;
    }

    if (eventData.ai_adaptation_level) {
      updates.ai_adaptation_level = eventData.ai_adaptation_level;
    }

    if (eventData.strengths) {
      updates.strengths = JSON.stringify(eventData.strengths);
    }

    if (eventData.weaknesses) {
      updates.weaknesses = JSON.stringify(eventData.weaknesses);
    }

    if (Object.keys(updates).length > 0) {
      updates.last_updated = new Date();
      await db
        .update("student_learning_profile")
        .set(updates)
        .where(eq("student_id", studentId));
    }
  } catch (error) {
    console.error("Error updating learning profile:", error);
  }
}
