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