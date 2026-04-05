import { router, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sdk } from '../_core/sdk';
import { COOKIE_NAME } from '@shared/const';
import { getSessionCookieOptions } from '../_core/cookies';
import crypto from 'crypto';

/**
 * Tokens de acesso direto (gerados manualmente)
 * Formato: email -> token hash
 */
const DIRECT_LOGIN_TOKENS: Record<string, string> = {
  // Laís Milena Gambini
  'lais.gambini@example.com': crypto.createHash('sha256').update('lais_direct_2026').digest('hex'),
  // Camila Gonsalves
  'camiladarosa@outlook.com': crypto.createHash('sha256').update('camila_direct_2026').digest('hex'),
  // Estevão (teste)
  'estevao.teste.aluno@influx.com.br': '6ad492015f0016276cad0278bc6aeaedbba9d0dc00bc8e91f9b569f4bf631fbb',
};

export const directLoginRouter = router({
  /**
   * Login direto via token na URL
   * Uso: GET /api/trpc/directLogin.loginViaToken?input={"token":"XXXXX"}
   */
  loginViaToken: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, 'Token obrigatório'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database not available',
        });
      }

      // Buscar email correspondente ao token
      let userEmail: string | null = null;
      for (const [email, tokenHash] of Object.entries(DIRECT_LOGIN_TOKENS)) {
        if (tokenHash === input.token) {
          userEmail = email;
          break;
        }
      }

      if (!userEmail) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Token inválido ou expirado',
        });
      }

      // Buscar usuário por email (apenas campos que existem no banco centralizado)
      const userResult = await db
        .select({
          id: users.id,
          openId: users.openId,
          name: users.name,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .where(eq(users.email, userEmail))
        .limit(1);

      if (!userResult || userResult.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuário não encontrado',
        });
      }

      const user = userResult[0];

      // Verificar status do aluno
      // Comentado - campo status não existe no banco centralizado
      // Todos os usuários são considerados ativos por padrão

      // LIMPAR COMPLETAMENTE qualquer sessão anterior
      ctx.res.setHeader(
        'Set-Cookie',
        [
          // Deletar cookie antigo
          `${COOKIE_NAME}=deleted; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        ]
      );

      // Aguardar um pouco para garantir que o cookie foi limpo
      await new Promise(resolve => setTimeout(resolve, 100));

      // Criar token de sessão NOVO
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || 'Student',
      });

      // Definir cookie de sessão NOVA
      ctx.res.setHeader(
        'Set-Cookie',
        `${COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
      );

      console.log(`[DirectLogin] Login bem-sucedido: ${user.name} (${user.email})`);

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        redirectTo: user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard',
      };
    }),
});
