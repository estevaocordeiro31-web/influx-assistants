import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
  createPersonalizedLink,
  validatePersonalizedLink,
  deactivatePersonalizedLink,
  shareMaterialWithClass,
  shareMaterialWithStudent,
  getStudentMaterials,
  markMaterialAsAccessed,
  getLinkStatistics,
} from '../personalized-access';
import { getDb } from '../db';
import { exclusiveMaterials } from '../../drizzle/schema';

export const personalizedLinksRouter = router({
  // Criar um novo link personalizado para um aluno
  createLink: protectedProcedure
    .input(z.object({ studentId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Apenas admins podem criar links
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem criar links personalizados',
        });
      }

      try {
        const link = await createPersonalizedLink(input.studentId);
        return {
          success: true,
          link,
          fullUrl: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/access/${link.linkHash}`,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao criar link: ${error}`,
        });
      }
    }),

  // Validar um link e obter dados do aluno
  validateLink: publicProcedure
    .input(z.object({ linkHash: z.string() }))
    .query(async ({ input }) => {
      try {
        const result = await validatePersonalizedLink(input.linkHash);
        return result;
      } catch (error) {
        return {
          studentId: 0,
          studentName: 'Desconhecido',
          isValid: false,
          message: 'Erro ao validar link',
        };
      }
    }),

  // Obter estatísticas de um link
  getLinkStats: protectedProcedure
    .input(z.object({ linkHash: z.string() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Acesso negado',
        });
      }

      try {
        const stats = await getLinkStatistics(input.linkHash);
        return stats;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao obter estatísticas: ${error}`,
        });
      }
    }),

  // Desativar um link
  deactivateLink: protectedProcedure
    .input(z.object({ linkHash: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem desativar links',
        });
      }

      try {
        await deactivatePersonalizedLink(input.linkHash);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao desativar link: ${error}`,
        });
      }
    }),

  // Compartilhar material com um aluno individual
  shareMaterialWithStudent: protectedProcedure
    .input(z.object({ materialId: z.number(), studentId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem compartilhar materiais',
        });
      }

      try {
        await shareMaterialWithStudent(input.materialId, input.studentId);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao compartilhar material: ${error}`,
        });
      }
    }),

  // Compartilhar material com uma turma
  shareMaterialWithClass: protectedProcedure
    .input(z.object({ materialId: z.number(), classId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem compartilhar materiais',
        });
      }

      try {
        await shareMaterialWithClass(input.materialId, input.classId);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao compartilhar material com turma: ${error}`,
        });
      }
    }),

  // Obter materiais compartilhados com um aluno
  getMyMaterials: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Usuário não autenticado',
      });
    }

    try {
      const materials = await getStudentMaterials(ctx.user.id);
      return materials;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Erro ao obter materiais: ${error}`,
      });
    }
  }),

  // Marcar material como acessado
  markMaterialAccessed: protectedProcedure
    .input(z.object({ materialId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
      }

      try {
        await markMaterialAsAccessed(input.materialId, ctx.user.id);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao marcar material como acessado: ${error}`,
        });
      }
    }),

  // Upload de material exclusivo
  uploadMaterial: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        fileUrl: z.string(),
        fileKey: z.string(),
        fileType: z.string().optional(),
        fileSize: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem fazer upload de materiais',
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database not available',
        });
      }

      try {
        await db.insert(exclusiveMaterials).values({
          title: input.title,
          description: input.description,
          fileUrl: input.fileUrl,
          fileKey: input.fileKey,
          fileType: input.fileType,
          fileSize: input.fileSize,
          createdBy: ctx.user.id,
          isActive: true,
        });

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao fazer upload de material: ${error}`,
        });
      }
    }),
});
