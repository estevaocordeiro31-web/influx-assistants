import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import mysql from 'mysql2/promise';

export const bulkConfigRouter = router({
  /**
   * Atualizar configuração de múltiplos alunos via CSV
   */
  updateFromCSV: protectedProcedure
    .input(
      z.object({
        csvContent: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Apenas admins podem fazer configuração em massa
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem fazer configuração em massa',
        });
      }

      const connection = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);

      try {
        // Parsear CSV
        const lines = input.csvContent.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Validar headers
        const requiredHeaders = ['matricula', 'nivel', 'objetivo', 'book_atual'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Headers faltando: ${missingHeaders.join(', ')}`,
          });
        }

        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        // Processar cada linha
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          
          if (values.length !== headers.length) {
            errors.push(`Linha ${i + 1}: número de colunas incorreto`);
            failed++;
            continue;
          }

          const row: Record<string, string> = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });

          try {
            // Buscar student por matrícula
            const [students] = await connection.execute(
              'SELECT id FROM students WHERE matricula = ?',
              [row.matricula]
            );

            if (!Array.isArray(students) || students.length === 0) {
              errors.push(`Linha ${i + 1}: Aluno com matrícula ${row.matricula} não encontrado`);
              failed++;
              continue;
            }

            const student = students[0] as any;

            // Atualizar student
            await connection.execute(
              `UPDATE students 
               SET nivel = ?, objetivo = ?, book_atual = ?, updatedAt = NOW()
               WHERE id = ?`,
              [row.nivel, row.objetivo, row.book_atual, student.id]
            );

            success++;
          } catch (error: any) {
            errors.push(`Linha ${i + 1}: ${error.message}`);
            failed++;
          }
        }

        return {
          success,
          failed,
          errors,
        };
      } finally {
        await connection.end();
      }
    }),

  /**
   * Exportar configuração atual de todos os alunos para CSV
   */
  exportToCSV: protectedProcedure.query(async ({ ctx }) => {
    // Apenas admins podem exportar
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Apenas administradores podem exportar configurações',
      });
    }

    const connection = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);

    try {
      const [students] = await connection.execute(`
        SELECT matricula, name, nivel, objetivo, book_atual, status
        FROM students
        WHERE status = 'Ativo'
        ORDER BY name
      `);

      if (!Array.isArray(students) || students.length === 0) {
        return {
          csvContent: 'matricula,name,nivel,objetivo,book_atual\n',
        };
      }

      // Gerar CSV
      const headers = 'matricula,name,nivel,objetivo,book_atual';
      const rows = students.map((s: any) => {
        return `${s.matricula},${s.name},${s.nivel || ''},${s.objetivo || ''},${s.book_atual || ''}`;
      });

      const csvContent = [headers, ...rows].join('\n');

      return { csvContent };
    } finally {
      await connection.end();
    }
  }),
});
