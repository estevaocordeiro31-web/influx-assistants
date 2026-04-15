import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '../auth-password';
import { sdk } from '../_core/sdk';
import { COOKIE_NAME } from '@shared/const';
import { getSessionCookieOptions } from '../_core/cookies';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { buildConnectionConfig } from '../db-connection';

export const authPasswordRouter = router({
  /**
   * Login com email e senha
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(1, 'Senha obrigatória'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Conectar ao banco centralizado
      const connection = await mysql.createConnection(buildConnectionConfig(process.env.CENTRAL_DATABASE_URL!));
      const db = drizzle(connection);

      try {
        // Buscar usuário por email - apenas campos que existem no banco centralizado
        const userResult = await db
          .select({
            id: users.id,
            openId: users.openId,
            name: users.name,
            email: users.email,
            passwordHash: users.passwordHash,
            role: users.role,
          })
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (!userResult || userResult.length === 0) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Email ou senha incorretos',
          });
        }

        const user = userResult[0];

        // Verificar se usuário tem senha cadastrada
        if (!user.passwordHash) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Usuário não possui senha cadastrada. Entre em contato com o coordenador.',
          });
        }

        // Verificar senha
        const isPasswordValid = await verifyPassword(input.password, user.passwordHash);
        
        if (!isPasswordValid) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Email ou senha incorretos',
          });
        }

        // Sincronizar usuário no banco local (garantir que o openId está correto)
        const localDb = await getDb();
        if (localDb) {
          try {
            // Verificar se usuário já existe no banco local
            const existingUser = await localDb
              .select()
              .from(users)
              .where(eq(users.email, input.email))
              .limit(1);

            if (existingUser.length > 0) {
              // Atualizar openId se diferente
              if (existingUser[0].openId !== user.openId) {
                await localDb
                  .update(users)
                  .set({ 
                    openId: user.openId,
                    name: user.name,
                    role: user.role,
                    lastSignedIn: new Date()
                  })
                  .where(eq(users.email, input.email));
                console.log(`[Auth] OpenId sincronizado para: ${user.email}`);
              } else {
                // Apenas atualizar lastSignedIn
                await localDb
                  .update(users)
                  .set({ lastSignedIn: new Date() })
                  .where(eq(users.email, input.email));
              }
            } else {
              // Criar usuário no banco local
              await localDb.insert(users).values({
                id: user.id,
                openId: user.openId,
                name: user.name,
                email: user.email,
                role: user.role,
                loginMethod: 'password',
                lastSignedIn: new Date()
              });
              console.log(`[Auth] Usuário criado no banco local: ${user.email}`);
            }
          } catch (syncError) {
            console.error('[Auth] Erro ao sincronizar usuário local:', syncError);
            // Não falhar o login se a sincronização falhar
          }
        }

        // LIMPAR COMPLETAMENTE qualquer sessão anterior
        ctx.res.setHeader(
          'Set-Cookie',
          `${COOKIE_NAME}=deleted; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
        );

        // Criar token de sessão NOVO
        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || 'Student',
        });

        // Definir cookie de sessão NOVA
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.setHeader(
          'Set-Cookie',
          [
            // Primeiro: deletar cookie antigo
            `${COOKIE_NAME}=deleted; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
            // Segundo: criar cookie novo
            `${COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
          ]
        );

        console.log(`[Auth] Login bem-sucedido: ${user.name} (${user.email})`);

        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      } finally {
        await connection.end();
      }
    }),

  /**
   * Alterar senha (usuário autenticado)
   */
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, 'Senha atual obrigatória'),
        newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database not available',
        });
      }

      // Buscar usuário atual
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (!userResult || userResult.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuário não encontrado',
        });
      }

      const user = userResult[0];

      // Verificar senha atual
      if (!user.passwordHash) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Usuário não possui senha cadastrada',
        });
      }

      const isCurrentPasswordValid = await verifyPassword(
        input.currentPassword,
        user.passwordHash
      );

      if (!isCurrentPasswordValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Senha atual incorreta',
        });
      }

      // Gerar hash da nova senha
      const newPasswordHash = await hashPassword(input.newPassword);

      // Atualizar senha no banco
      await db
        .update(users)
        .set({ passwordHash: newPasswordHash })
        .where(eq(users.id, ctx.user.id));

      console.log(`[Auth] Senha alterada: ${user.name} (${user.email})`);

      return {
        success: true,
        message: 'Senha alterada com sucesso',
      };
    }),

  /**
   * Definir senha inicial (apenas admin)
   */
  setInitialPassword: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Apenas admins podem definir senha inicial
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem definir senhas iniciais',
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database not available',
        });
      }

      // Gerar hash da senha
      const passwordHash = await hashPassword(input.password);

      // Atualizar senha no banco
      await db
        .update(users)
        .set({ passwordHash })
        .where(eq(users.id, input.userId));

      console.log(`[Auth] Senha inicial definida para userId: ${input.userId}`);

      return {
        success: true,
        message: 'Senha inicial definida com sucesso',
      };
    }),
});
