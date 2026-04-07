import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { sdk } from '../_core/sdk';
import { eq } from 'drizzle-orm';
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
import { exclusiveMaterials, users } from '../../drizzle/schema';
import { COOKIE_NAME } from '@shared/const';

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
        
        // Construir URL base dinamicamente a partir do host da requisição
        // Isso garante que o link funcione tanto em desenvolvimento quanto em produção
        const host = ctx.req?.headers?.host || 'localhost:3000';
        const protocol = ctx.req?.headers?.['x-forwarded-proto'] || 
                        (host.includes('localhost') ? 'http' : 'https');
        const baseUrl = `${protocol}://${host}`;
        
        return {
          success: true,
          link,
          fullUrl: `${baseUrl}/access/${link.linkHash}`,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao criar link: ${error}`,
        });
      }
    }),

  // Validar um link e obter dados do aluno (apenas validação, sem criar sessão)
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

  // Autenticar via link personalizado (cria sessão para o aluno)
  authenticateViaLink: publicProcedure
    .input(z.object({ linkHash: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Validar o link
        const linkValidation = await validatePersonalizedLink(input.linkHash);
        
        if (!linkValidation.isValid || linkValidation.studentId === 0) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: linkValidation.message || 'Link inválido ou expirado',
          });
        }

        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database not available',
          });
        }

        // Obter dados do aluno
        const studentResult = await db
          .select()
          .from(users)
          .where(eq(users.id, linkValidation.studentId))
          .limit(1);

        if (!studentResult || studentResult.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Aluno não encontrado',
          });
        }

        const student = studentResult[0];

        // CRÍTICO: Limpar completamente o cookie de sessão anterior
        // Isso força o navegador a descartar qualquer sessão existente (admin ou outro aluno)
        ctx.res.setHeader('Set-Cookie', [
          // Primeiro: Expirar o cookie antigo imediatamente
          `${COOKIE_NAME}=deleted; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        ]);

        // Criar token de sessão para o aluno
        const sessionToken = await sdk.createSessionToken(student.openId, {
          name: student.name || 'Student',
        });

        // Segundo: Definir novo cookie de sessão para o aluno
        // Usar array para garantir que ambos os cookies sejam enviados
        ctx.res.setHeader('Set-Cookie', [
          `${COOKIE_NAME}=deleted; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          `${COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
        ]);

        console.log(`[Auth] Sessão criada para aluno: ${student.name} (ID: ${student.id})`);

        return {
          success: true,
          studentId: student.id,
          studentName: student.name,
          message: 'Autenticação via link bem-sucedida',
        };
      } catch (error) {
        console.error('Error authenticating via link:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao autenticar via link: ${error}`,
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
