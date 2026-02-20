import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import {
  schoolActivities,
  activityTags,
  activityTagAssociations,
  studentActivityEnrollments,
} from "../../drizzle/schema";
import { eq, and, gte, lte, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const schoolActivitiesRouter = router({
  // Criar nova atividade
  createActivity: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        activityDate: z.string(), // YYYY-MM-DD format
        startTime: z.string().optional(), // HH:MM format
        endTime: z.string().optional(),
        location: z.string().optional(),
        enrollmentLink: z.string().url().optional(),
        maxParticipants: z.number().int().positive().optional(),
        tagIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Criar atividade
      const result = await db.insert(schoolActivities).values({
        title: input.title,
        description: input.description,
        activityDate: new Date(input.activityDate),
        startTime: input.startTime,
        endTime: input.endTime,
        location: input.location,
        enrollmentLink: input.enrollmentLink,
        maxParticipants: input.maxParticipants,
        createdBy: ctx.user.id,
      });

      const activityId = result[0].insertId;

      // Associar tags
      if (input.tagIds && input.tagIds.length > 0) {
        await db.insert(activityTagAssociations).values(
          input.tagIds.map((tagId) => ({
            activityId: Number(activityId),
            tagId,
          }))
        );
      }

      return { id: activityId, ...input };
    }),

  // Atualizar atividade
  updateActivity: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        activityDate: z.string().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        location: z.string().optional(),
        enrollmentLink: z.string().url().optional(),
        maxParticipants: z.number().int().positive().optional(),
        tagIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, tagIds, ...updateData } = input;

      // Atualizar atividade
      const updateValues: any = {
        ...updateData,
      };
      if (updateData.activityDate) {
        updateValues.activityDate = new Date(updateData.activityDate);
      }
      await db
        .update(schoolActivities)
        .set(updateValues)
        .where(eq(schoolActivities.id, id));

      // Atualizar tags
      if (tagIds) {
        // Remover tags antigas
        await db
          .delete(activityTagAssociations)
          .where(eq(activityTagAssociations.activityId, id));

        // Adicionar novas tags
        if (tagIds.length > 0) {
          await db.insert(activityTagAssociations).values(
            tagIds.map((tagId) => ({
              activityId: id,
              tagId,
            }))
          );
        }
      }

      return { id, ...updateData };
    }),

  // Deletar atividade
  deleteActivity: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(schoolActivities)
        .where(eq(schoolActivities.id, input.id));

      return { success: true };
    }),

  // Obter atividades por intervalo de datas
  getActivitiesByDateRange: publicProcedure
    .input(
      z.object({
        startDate: z.string(), // YYYY-MM-DD
        endDate: z.string(), // YYYY-MM-DD
        tagIds: z.array(z.number()).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db
        .select({
          id: schoolActivities.id,
          title: schoolActivities.title,
          description: schoolActivities.description,
          activityDate: schoolActivities.activityDate,
          startTime: schoolActivities.startTime,
          endTime: schoolActivities.endTime,
          location: schoolActivities.location,
          enrollmentLink: schoolActivities.enrollmentLink,
          maxParticipants: schoolActivities.maxParticipants,
          createdAt: schoolActivities.createdAt,
          tags: activityTags,
        })
        .from(schoolActivities)
        .leftJoin(
          activityTagAssociations,
          eq(activityTagAssociations.activityId, schoolActivities.id)
        )
        .leftJoin(
          activityTags,
          eq(activityTags.id, activityTagAssociations.tagId)
        )
        .where(
          and(
            gte(schoolActivities.activityDate, new Date(input.startDate)),
            lte(schoolActivities.activityDate, new Date(input.endDate))
          )
        );

      const activities = await query;

      // Agrupar por atividade
      const grouped = activities.reduce(
        (acc: any[], row: any) => {
          const existing = acc.find((a: any) => a.id === row.id);
          if (existing) {
            if (row.tags) {
              existing.tags.push(row.tags);
            }
          } else {
            acc.push({
              id: row.id,
              title: row.title,
              description: row.description,
              activityDate: row.activityDate,
              startTime: row.startTime,
              endTime: row.endTime,
              location: row.location,
              enrollmentLink: row.enrollmentLink,
              maxParticipants: row.maxParticipants,
              createdAt: row.createdAt,
              tags: row.tags ? [row.tags] : [],
            });
          }
          return acc;
        },
        [] as any[]
      );

      return grouped;
    }),

  // Inscrever aluno em atividade
  enrollStudent: protectedProcedure
    .input(
      z.object({
        activityId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verificar se já está inscrito
      const existing = await db
        .select()
        .from(studentActivityEnrollments)
        .where(
          and(
            eq(studentActivityEnrollments.studentId, ctx.user.id),
            eq(studentActivityEnrollments.activityId, input.activityId)
          )
        );

      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Você já está inscrito nesta atividade",
        });
      }

      // Verificar limite de participantes
      const activity = await db
        .select()
        .from(schoolActivities)
        .where(eq(schoolActivities.id, input.activityId));

      if (activity.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (activity[0].maxParticipants) {
        const enrolled = await db
          .select()
          .from(studentActivityEnrollments)
          .where(
            and(
              eq(studentActivityEnrollments.activityId, input.activityId),
              inArray(studentActivityEnrollments.status, ["confirmed", "attended"])
            )
          );

        if (enrolled.length >= activity[0].maxParticipants) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Limite de participantes atingido",
          });
        }
      }

      // Inscrever
      const result = await db.insert(studentActivityEnrollments).values({
        studentId: ctx.user.id,
        activityId: input.activityId,
        status: "pending",
      });

      return { id: result[0].insertId, status: "pending" };
    }),

  // Obter inscrições do aluno
  getStudentEnrollments: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const enrollments = await db
      .select({
        id: studentActivityEnrollments.id,
        status: studentActivityEnrollments.status,
        enrolledAt: studentActivityEnrollments.enrolledAt,
        confirmedAt: studentActivityEnrollments.confirmedAt,
        activity: {
          id: schoolActivities.id,
          title: schoolActivities.title,
          description: schoolActivities.description,
          activityDate: schoolActivities.activityDate,
          startTime: schoolActivities.startTime,
          endTime: schoolActivities.endTime,
          location: schoolActivities.location,
          enrollmentLink: schoolActivities.enrollmentLink,
        },
      })
      .from(studentActivityEnrollments)
      .leftJoin(
        schoolActivities,
        eq(schoolActivities.id, studentActivityEnrollments.activityId)
      )
      .where(eq(studentActivityEnrollments.studentId, ctx.user.id));

    return enrollments;
  }),

  // Obter todas as tags
  getAllTags: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db.select().from(activityTags);
  }),

  // Criar tag
  createTag: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        color: z.string().regex(/^#[0-9A-F]{6}$/i),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(activityTags).values(input);
      return { id: result[0].insertId, ...input };
    }),

  // Obter estatísticas de atividades
  getActivityStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const totalActivities = await db
      .select()
      .from(schoolActivities);

    const totalEnrollments = await db
      .select()
      .from(studentActivityEnrollments);

    const enrollmentsByStatus = totalEnrollments.reduce(
      (acc: Record<string, number>, enrollment: any) => {
        acc[enrollment.status] = (acc[enrollment.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalActivities: totalActivities.length,
      totalEnrollments: totalEnrollments.length,
      enrollmentsByStatus,
    };
  }),
});
