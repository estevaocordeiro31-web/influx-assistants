import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sendWelcomeEmail, sendBulkWelcomeEmails } from '../welcome-email';

export const welcomeEmailsRouter = router({
  /**
   * Enviar email de boas-vindas para um aluno específico
   */
  sendToStudent: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Apenas admins podem enviar emails
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem enviar emails',
        });
      }

      const connection = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
      const db = drizzle(connection);

      try {
        // Buscar dados do usuário
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, input.userId))
          .limit(1);

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Usuário não encontrado',
          });
        }

        if (!user.email) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Usuário não possui email cadastrado',
          });
        }

        // Extrair senha do hash (não é possível, então usamos padrão)
        const firstName = user.name?.split(' ')[0] || 'Aluno';
        const defaultPassword = `${firstName}@2026`;

        const success = await sendWelcomeEmail({
          studentName: user.name || 'Aluno',
          email: user.email,
          password: defaultPassword,
          loginUrl: 'https://influxassist-2anfqga4.manus.space/login',
        });

        if (!success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Falha ao enviar email',
          });
        }

        return {
          success: true,
          message: `Email enviado para ${user.email}`,
        };
      } finally {
        await connection.end();
      }
    }),

  /**
   * Enviar emails de boas-vindas para todos os alunos sem acesso
   */
  sendToAllNew: protectedProcedure.mutation(async ({ ctx }) => {
    // Apenas admins podem enviar emails em massa
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Apenas administradores podem enviar emails em massa',
      });
    }

    const connection = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
    const db = drizzle(connection);

    try {
      // Buscar todos os usuários criados recentemente (últimas 24h)
      const [recentUsers] = await connection.execute(`
        SELECT id, name, email, createdAt
        FROM users
        WHERE role = 'user'
        AND createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        AND email IS NOT NULL
      `);

      if (!Array.isArray(recentUsers) || recentUsers.length === 0) {
        return {
          success: true,
          sent: 0,
          failed: 0,
          message: 'Nenhum aluno novo encontrado nas últimas 24h',
        };
      }

      // Preparar dados para envio
      const emailData = recentUsers.map((user: any) => {
        const firstName = user.name?.split(' ')[0] || 'Aluno';
        return {
          studentName: user.name || 'Aluno',
          email: user.email,
          password: `${firstName}@2026`,
          loginUrl: 'https://influxassist-2anfqga4.manus.space/login',
        };
      });

      // Enviar emails
      const result = await sendBulkWelcomeEmails(emailData);

      return {
        success: true,
        ...result,
        message: `Emails enviados: ${result.sent} sucesso, ${result.failed} falhas`,
      };
    } finally {
      await connection.end();
    }
  }),
});
