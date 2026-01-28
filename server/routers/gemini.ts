import { router, protectedProcedure } from '../_core/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { sendUpdateToGemini, parseGeminiResponse, sendProjectContextToGemini } from '../gemini-integration';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { sql } from 'drizzle-orm';

const getCentralDb = async () => {
  const connection = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
  return { connection, db: drizzle(connection) };
};

export const geminiRouter = router({
  /**
   * Send project update to Gemini and get suggestions
   */
  sendUpdate: protectedProcedure
    .input(z.object({
      type: z.enum(['checkpoint', 'feature', 'bug_fix', 'improvement']),
      title: z.string(),
      description: z.string(),
      version: z.string().optional(),
      metadata: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem enviar atualizações para o Gemini',
        });
      }

      try {
        const result = await sendUpdateToGemini({
          ...input,
          timestamp: new Date(),
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to send update to Gemini');
        }

        // Parse suggestions and save to database
        const suggestions = parseGeminiResponse(result.response || '');
        
        if (suggestions.length > 0) {
          const { connection, db } = await getCentralDb();
          try {
            for (const suggestion of suggestions) {
              await connection.execute(
                `INSERT INTO gemini_suggestions 
                (id, category, title, description, priority, implementation_notes, status) 
                VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
                [
                  suggestion.id,
                  suggestion.category,
                  suggestion.title,
                  suggestion.description,
                  suggestion.priority,
                  suggestion.implementation_notes || null,
                ]
              );
            }
          } finally {
            await connection.end();
          }
        }

        return {
          success: true,
          suggestions_count: suggestions.length,
          raw_response: result.response,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  /**
   * Get all suggestions from Gemini
   */
  getSuggestions: protectedProcedure
    .input(z.object({
      status: z.enum(['pending', 'approved', 'rejected', 'implemented']).optional(),
      category: z.enum(['ux', 'pedagogy', 'gamification', 'data_analysis', 'strategy']).optional(),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    }).optional())
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem visualizar sugestões do Gemini',
        });
      }

      const { connection, db } = await getCentralDb();
      try {
        let query = 'SELECT * FROM gemini_suggestions WHERE 1=1';
        const params: any[] = [];

        if (input?.status) {
          query += ' AND status = ?';
          params.push(input.status);
        }

        if (input?.category) {
          query += ' AND category = ?';
          params.push(input.category);
        }

        if (input?.priority) {
          query += ' AND priority = ?';
          params.push(input.priority);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await connection.execute(query, params);
        return rows as any[];
      } finally {
        await connection.end();
      }
    }),

  /**
   * Update suggestion status (approve/reject/implement)
   */
  updateSuggestionStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['approved', 'rejected', 'implemented']),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem atualizar status de sugestões',
        });
      }

      const { connection, db } = await getCentralDb();
      try {
        await connection.execute(
          'UPDATE gemini_suggestions SET status = ? WHERE id = ?',
          [input.status, input.id]
        );

        return { success: true };
      } finally {
        await connection.end();
      }
    }),

  /**
   * Send full project context to Gemini for strategic analysis
   */
  sendProjectContext: protectedProcedure
    .input(z.object({
      version: z.string(),
      features: z.array(z.string()),
      metrics: z.record(z.string(), z.any()),
      challenges: z.array(z.string()),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem enviar contexto do projeto',
        });
      }

      try {
        const result = await sendProjectContextToGemini(input);

        if (!result.success) {
          throw new Error(result.error || 'Failed to send context to Gemini');
        }

        return {
          success: true,
          response: result.response,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  /**
   * Get statistics about Gemini suggestions
   */
  getStatistics: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem visualizar estatísticas',
        });
      }

      const { connection, db } = await getCentralDb();
      try {
        const [stats] = await connection.execute(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
            SUM(CASE WHEN status = 'implemented' THEN 1 ELSE 0 END) as implemented,
            SUM(CASE WHEN priority = 'critical' THEN 1 ELSE 0 END) as critical_count,
            SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_count
          FROM gemini_suggestions
        `);

        return (stats as any[])[0];
      } finally {
        await connection.end();
      }
    }),
});
