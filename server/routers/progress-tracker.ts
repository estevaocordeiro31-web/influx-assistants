import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { studentTopicProgress } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Progress Tracker Router
 * Gerencia rastreamento de progresso de tópicos e módulos
 */
export const progressTrackerRouter = router({
  /**
   * Registrar acesso a um tópico
   */
  recordTopicAccess: protectedProcedure
    .input(
      z.object({
        topicId: z.string(),
        topicName: z.string(),
        category: z.enum(["professional", "traveller", "general"]),
        progressPercentage: z.number().min(0).max(100),
        timeSpentMinutes: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database não disponível");

        const userId = ctx.user?.id;
        if (!userId) throw new Error("Usuário não autenticado");

        // Verificar se já existe registro
        const existing = await db
          .select()
          .from(studentTopicProgress)
          .where(
            and(
              eq(studentTopicProgress.studentId, userId),
              eq(studentTopicProgress.topicId, input.topicId)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          // Atualizar registro existente
          await db
            .update(studentTopicProgress)
            .set({
              progressPercentage: input.progressPercentage,
              timeSpentMinutes:
                (existing[0].timeSpentMinutes || 0) +
                (input.timeSpentMinutes || 0),
              lastAccessedAt: new Date(),
              completed: input.progressPercentage === 100,
              completedAt:
                input.progressPercentage === 100 ? new Date() : null,
            })
            .where(
              and(
                eq(studentTopicProgress.studentId, userId),
                eq(studentTopicProgress.topicId, input.topicId)
              )
            );

          return {
            success: true,
            message: "Progresso atualizado com sucesso",
            isNew: false,
          };
        } else {
          // Criar novo registro
          await db.insert(studentTopicProgress).values({
            studentId: userId,
            topicId: input.topicId,
            topicName: input.topicName,
            category: input.category,
            progressPercentage: input.progressPercentage,
            timeSpentMinutes: input.timeSpentMinutes || 0,
            completed: input.progressPercentage === 100,
            completedAt:
              input.progressPercentage === 100 ? new Date() : null,
          });

          return {
            success: true,
            message: "Tópico registrado com sucesso",
            isNew: true,
          };
        }
      } catch (error) {
        throw new Error(
          `Erro ao registrar progresso: ${
            error instanceof Error ? error.message : "Desconhecido"
          }`
        );
      }
    }),

  /**
   * Obter progresso de um tópico específico
   */
  getTopicProgress: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database não disponível");

        const userId = ctx.user?.id;
        if (!userId) throw new Error("Usuário não autenticado");

        const progress = await db
          .select()
          .from(studentTopicProgress)
          .where(
            and(
              eq(studentTopicProgress.studentId, userId),
              eq(studentTopicProgress.topicId, input.topicId)
            )
          )
          .limit(1);

        if (progress.length === 0) {
          return {
            found: false,
            progress: null,
          };
        }

        return {
          found: true,
          progress: progress[0],
        };
      } catch (error) {
        throw new Error(
          `Erro ao obter progresso: ${
            error instanceof Error ? error.message : "Desconhecido"
          }`
        );
      }
    }),

  /**
   * Obter progresso por categoria (ex: "professional", "traveller")
   */
  getCategoryProgress: protectedProcedure
    .input(z.object({ category: z.enum(["professional", "traveller", "general"]) }))
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database não disponível");

        const userId = ctx.user?.id;
        if (!userId) throw new Error("Usuário não autenticado");

        const topics = await db
          .select()
          .from(studentTopicProgress)
          .where(
            and(
              eq(studentTopicProgress.studentId, userId),
              eq(studentTopicProgress.category, input.category)
            )
          );

        const completed = topics.filter((t) => t.completed).length;
        const total = topics.length;
        const avgProgress =
          total > 0
            ? Math.round(
                topics.reduce((sum, t) => sum + t.progressPercentage, 0) /
                  total
              )
            : 0;
        const totalTimeSpent = topics.reduce(
          (sum, t) => sum + (t.timeSpentMinutes || 0),
          0
        );

        return {
          category: input.category,
          totalTopics: total,
          completedTopics: completed,
          completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
          averageProgress: avgProgress,
          totalTimeSpentMinutes: totalTimeSpent,
          topics: topics.map((t) => ({
            id: t.id,
            topicId: t.topicId,
            topicName: t.topicName,
            progressPercentage: t.progressPercentage,
            completed: t.completed,
            timeSpentMinutes: t.timeSpentMinutes,
            lastAccessedAt: t.lastAccessedAt,
          })),
        };
      } catch (error) {
        throw new Error(
          `Erro ao obter progresso da categoria: ${
            error instanceof Error ? error.message : "Desconhecido"
          }`
        );
      }
    }),

  /**
   * Obter resumo geral de progresso
   */
  getProgressSummary: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database não disponível");

      const userId = ctx.user?.id;
      if (!userId) throw new Error("Usuário não autenticado");

      const allProgress = await db
        .select()
        .from(studentTopicProgress)
        .where(eq(studentTopicProgress.studentId, userId));

      const byCategory = {
        professional: allProgress.filter((p) => p.category === "professional"),
        traveller: allProgress.filter((p) => p.category === "traveller"),
        general: allProgress.filter((p) => p.category === "general"),
      };

      const calculateStats = (topics: typeof allProgress) => ({
        total: topics.length,
        completed: topics.filter((t) => t.completed).length,
        completionPercentage:
          topics.length > 0
            ? Math.round(
                (topics.filter((t) => t.completed).length / topics.length) *
                  100
              )
            : 0,
        averageProgress:
          topics.length > 0
            ? Math.round(
                topics.reduce((sum, t) => sum + t.progressPercentage, 0) /
                  topics.length
              )
            : 0,
        totalTimeSpent: topics.reduce((sum, t) => sum + (t.timeSpentMinutes || 0), 0),
      });

      return {
        overall: calculateStats(allProgress),
        byCategory: {
          professional: calculateStats(byCategory.professional),
          traveller: calculateStats(byCategory.traveller),
          general: calculateStats(byCategory.general),
        },
        lastUpdated: new Date(),
      };
    } catch (error) {
      throw new Error(
        `Erro ao obter resumo de progresso: ${
          error instanceof Error ? error.message : "Desconhecido"
        }`
      );
    }
  }),

  /**
   * Marcar tópico como completo
   */
  completeTopicModule: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database não disponível");

        const userId = ctx.user?.id;
        if (!userId) throw new Error("Usuário não autenticado");

        await db
          .update(studentTopicProgress)
          .set({
            completed: true,
            completedAt: new Date(),
            progressPercentage: 100,
          })
          .where(
            and(
              eq(studentTopicProgress.studentId, userId),
              eq(studentTopicProgress.topicId, input.topicId)
            )
          );

        return {
          success: true,
          message: "Tópico marcado como completo!",
        };
      } catch (error) {
        throw new Error(
          `Erro ao completar tópico: ${
            error instanceof Error ? error.message : "Desconhecido"
          }`
        );
      }
    }),
});
