import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { extraExercises, studentExerciseProgress, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Router para gerenciar exercícios extras
 * Exercícios adicionais baseados no conteúdo do Book 1 e outros livros
 */
export const extraExercisesRouter = router({
  /**
   * Obter exercícios por lição
   */
  getExercisesByLesson: publicProcedure
    .input(
      z.object({
        bookId: z.number(),
        lessonNumber: z.number(),
        type: z.enum(["vocabulary", "grammar", "listening", "reading", "writing", "speaking", "communicative"]).optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const query = db
          .select()
          .from(extraExercises)
          .where(
            and(
              eq(extraExercises.bookId, input.bookId),
              eq(extraExercises.lessonNumber, input.lessonNumber),
              input.type ? eq(extraExercises.type, input.type) : undefined
            )
          );

        const exercises = await query;
        return {
          success: true,
          exercises,
          count: exercises.length,
        };
      } catch (error) {
        console.error("[Extra Exercises] Error fetching exercises:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar exercícios",
        });
      }
    }),

  /**
   * Obter todos os exercícios de um livro
   */
  getExercisesByBook: publicProcedure
    .input(
      z.object({
        bookId: z.number(),
        difficulty: z.enum(["beginner", "elementary", "intermediate", "upper_intermediate", "advanced", "proficient"]).optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const query = db
          .select()
          .from(extraExercises)
          .where(
            and(
              eq(extraExercises.bookId, input.bookId),
              input.difficulty ? eq(extraExercises.difficulty, input.difficulty) : undefined
            )
          );

        const exercises = await query;
        return {
          success: true,
          exercises,
          count: exercises.length,
        };
      } catch (error) {
        console.error("[Extra Exercises] Error fetching book exercises:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar exercícios do livro",
        });
      }
    }),

  /**
   * Obter progresso do aluno em exercícios
   */
  getStudentProgress: protectedProcedure
    .input(
      z.object({
        bookId: z.number(),
        lessonNumber: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Usuário não autenticado",
          });
        }

        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Buscar exercícios
        const exercisesQuery = db
          .select()
          .from(extraExercises)
          .where(
            and(
              eq(extraExercises.bookId, input.bookId),
              input.lessonNumber ? eq(extraExercises.lessonNumber, input.lessonNumber) : undefined
            )
          );

        const exercises = await exercisesQuery;

        // Buscar progresso do aluno
        const progressQuery = db
          .select()
          .from(studentExerciseProgress)
          .where(eq(studentExerciseProgress.studentId, ctx.user.id));

        const progress = await progressQuery;

        // Mapear progresso para cada exercício
        const exercisesWithProgress = exercises.map((exercise) => {
          const studentProgress = progress.find((p) => p.exerciseId === exercise.id);
          return {
            ...exercise,
            progress: studentProgress || null,
          };
        });

        return {
          success: true,
          exercises: exercisesWithProgress,
          stats: {
            total: exercises.length,
            completed: progress.filter((p) => p.status === "completed").length,
            inProgress: progress.filter((p) => p.status === "in_progress").length,
            notStarted: exercises.length - progress.length,
          },
        };
      } catch (error) {
        console.error("[Extra Exercises] Error fetching student progress:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar progresso do aluno",
        });
      }
    }),

  /**
   * Atualizar progresso do aluno em um exercício
   */
  updateProgress: protectedProcedure
    .input(
      z.object({
        exerciseId: z.number(),
        status: z.enum(["not_started", "in_progress", "completed", "reviewed"]),
        score: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Usuário não autenticado",
          });
        }

        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Verificar se exercício existe
        const exercise = await db
          .select()
          .from(extraExercises)
          .where(eq(extraExercises.id, input.exerciseId))
          .limit(1);

        if (!exercise || exercise.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Exercício não encontrado",
          });
        }

        // Buscar ou criar progresso
        const existingProgress = await db
          .select()
          .from(studentExerciseProgress)
          .where(
            and(
              eq(studentExerciseProgress.studentId, ctx.user.id),
              eq(studentExerciseProgress.exerciseId, input.exerciseId)
            )
          )
          .limit(1);

        if (existingProgress && existingProgress.length > 0) {
          // Atualizar progresso existente
          const updated = await db
            .update(studentExerciseProgress)
            .set({
              status: input.status,
              score: input.score ? String(input.score) : existingProgress[0].score,
              attempts: existingProgress[0].attempts + 1,
              completedAt: input.status === "completed" ? new Date() : existingProgress[0].completedAt,
              updatedAt: new Date(),
            })
            .where(eq(studentExerciseProgress.id, existingProgress[0].id));

          return {
            success: true,
            message: "Progresso atualizado",
            progress: updated,
          };
        } else {
          // Criar novo progresso
          const created = await db.insert(studentExerciseProgress).values({
            studentId: ctx.user.id,
            exerciseId: input.exerciseId,
            status: input.status,
            score: input.score ? String(input.score) : "0",
            attempts: 1,
            completedAt: input.status === "completed" ? new Date() : null,
          });

          return {
            success: true,
            message: "Progresso criado",
            progress: created,
          };
        }
      } catch (error) {
        console.error("[Extra Exercises] Error updating progress:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao atualizar progresso",
        });
      }
    }),

  /**
   * Criar novo exercício (admin only)
   */
  createExercise: protectedProcedure
    .input(
      z.object({
        bookId: z.number(),
        lessonNumber: z.number(),
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        type: z.enum(["vocabulary", "grammar", "listening", "reading", "writing", "speaking", "communicative"]),
        content: z.string().min(1),
        imageUrl: z.string().optional(),
        difficulty: z.enum(["beginner", "elementary", "intermediate", "upper_intermediate", "advanced", "proficient"]).default("beginner"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Apenas administradores podem criar exercícios",
          });
        }

        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const created = await db.insert(extraExercises).values({
          bookId: input.bookId,
          lessonNumber: input.lessonNumber,
          title: input.title,
          description: input.description || null,
          type: input.type,
          content: input.content,
          imageUrl: input.imageUrl || null,
          difficulty: input.difficulty,
        });

        return {
          success: true,
          message: "Exercício criado com sucesso",
          exercise: created,
        };
      } catch (error) {
        console.error("[Extra Exercises] Error creating exercise:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar exercício",
        });
      }
    }),

  /**
   * Atualizar exercício (admin only)
   */
  updateExercise: protectedProcedure
    .input(
      z.object({
        exerciseId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        difficulty: z.enum(["beginner", "elementary", "intermediate", "upper_intermediate", "advanced", "proficient"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Apenas administradores podem atualizar exercícios",
          });
        }

        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const updated = await db
          .update(extraExercises)
          .set({
            title: input.title,
            description: input.description,
            content: input.content,
            imageUrl: input.imageUrl,
            difficulty: input.difficulty,
            updatedAt: new Date(),
          })
          .where(eq(extraExercises.id, input.exerciseId));

        return {
          success: true,
          message: "Exercício atualizado com sucesso",
          exercise: updated,
        };
      } catch (error) {
        console.error("[Extra Exercises] Error updating exercise:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao atualizar exercício",
        });
      }
    }),

  /**
   * Deletar exercício (admin only)
   */
  deleteExercise: protectedProcedure
    .input(z.object({ exerciseId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Apenas administradores podem deletar exercícios",
          });
        }

        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        await db.delete(extraExercises).where(eq(extraExercises.id, input.exerciseId));

        return {
          success: true,
          message: "Exercício deletado com sucesso",
        };
      } catch (error) {
        console.error("[Extra Exercises] Error deleting exercise:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao deletar exercício",
        });
      }
    }),
});
