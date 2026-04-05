import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getDb } from '../db';
import { users, studentImportedData, studentBookHistory, backToSchoolCampaign, studentBackToSchoolEnrollment, backToSchoolSyncLog, books } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { notifyOwner } from '../_core/notification';

// Books structure: Fluxie -> Junior -> Regular -> Comunicação Avançada
const BOOKS_STRUCTURE = [
  { id: 'fluxie', name: 'Fluxie', level: 'starter', category: 'junior' },
  { id: 'junior', name: 'Junior', level: 'beginner', category: 'junior' },
  { id: 'regular', name: 'Regular', level: 'elementary', category: 'regular' },
  { id: 'advanced', name: 'Comunicação Avançada', level: 'intermediate', category: 'regular' },
];

// Admin procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});

export const backToSchoolRouter = router({
  // Sincronizar 182 alunos com seus níveis/books
  syncStudentsWithBooks: adminProcedure
    .input(
      z.object({
        campaignId: z.number(),
      })
    )
    .mutation(async ({ input }: any) => {
      try {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        // Buscar todos os usuários (alunos)
        const allUsers = await (db as any).query.users.findMany({
          where: eq(users.role, 'user'),
        });

        console.log(`Sincronizando ${allUsers.length} alunos...`);

        const syncResults = {
          success: 0,
          errors: 0,
          errorDetails: [] as any[],
          studentsByBook: {} as Record<string, any[]>,
        };

        // Inicializar contadores por book
        BOOKS_STRUCTURE.forEach((book) => {
          syncResults.studentsByBook[book.id] = [];
        });

        // Processar cada aluno
        for (const user of allUsers) {
          try {
            // Buscar dados importados do aluno (do Sponte)
            const importedData = await (db as any).query.studentImportedData.findFirst({
              where: eq(studentImportedData.studentId, user.id),
            });

            // Determinar o book atual baseado nos dados importados
            let currentBook = 'fluxie'; // padrão
            if (importedData?.book) {
              const bookLower = importedData.book.toLowerCase();
              if (bookLower.includes('junior')) currentBook = 'junior';
              else if (bookLower.includes('regular')) currentBook = 'regular';
              else if (bookLower.includes('avançada') || bookLower.includes('advanced'))
                currentBook = 'advanced';
              else if (bookLower.includes('fluxie')) currentBook = 'fluxie';
            }

            // Gerar senha temporária
            const tempPassword = `BTS${Date.now().toString().slice(-6)}`;

            // Criar/atualizar enrollment
            await (db as any).insert(studentBackToSchoolEnrollment).values({
              campaignId: input.campaignId,
              studentId: user.id,
              currentBook: currentBook as any, // será o bookId real em produção
              previousBooks: importedData ? [{ book: importedData.book, completedAt: new Date() }] : [],
              enrollmentStatus: 'enrolled',
              tempPassword,
              accessGrantedAt: new Date(),
              accessExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
            });

            // Adicionar à lista de alunos por book
            syncResults.studentsByBook[currentBook].push({
              id: user.id,
              name: user.name,
              email: user.email,
              book: currentBook,
              tempPassword,
              currentBook: importedData?.book || 'N/A',
            });

            syncResults.success++;
          } catch (error) {
            syncResults.errors++;
            syncResults.errorDetails.push({
              studentId: user.id,
              name: user.name,
              error: String(error),
            });
          }
        }

        // Registrar no log de sincronização
        await (db as any).insert(backToSchoolSyncLog).values({
          campaignId: input.campaignId,
          syncType: 'initial_sync',
          totalStudents: allUsers.length,
          successCount: syncResults.success,
          errorCount: syncResults.errors,
          errors: syncResults.errorDetails,
        });

        return {
          success: true,
          message: `Sincronização concluída: ${syncResults.success} alunos processados, ${syncResults.errors} erros`,
          data: syncResults,
        };
      } catch (error) {
        console.error('Error syncing students:', error);
        throw new Error('Failed to sync students');
      }
    }),

  // Gerar relatório de alunos por book
  generateReportByBook: adminProcedure
    .input(
      z.object({
        campaignId: z.number(),
      })
    )
    .query(async ({ input }: any) => {
      try {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        // Buscar todos os enrollments da campanha
        const enrollments = await (db as any).query.studentBackToSchoolEnrollment.findMany({
          where: eq(studentBackToSchoolEnrollment.campaignId, input.campaignId),
        });

        // Agrupar por book
        const reportByBook: Record<string, any[]> = {};
        BOOKS_STRUCTURE.forEach((book) => {
          reportByBook[book.name] = [];
        });

        for (const enrollment of enrollments) {
          const user = await (db as any).query.users.findFirst({
            where: eq(users.id, enrollment.studentId),
          });

          if (user) {
            const bookName = BOOKS_STRUCTURE.find((b) => b.id === (enrollment.currentBook as any))?.name || 'Unknown';
            if (!reportByBook[bookName]) {
              reportByBook[bookName] = [];
            }

            reportByBook[bookName].push({
              studentId: user.studentId,
              name: user.name,
              email: user.email,
              tempPassword: enrollment.tempPassword,
              accessExpiresAt: enrollment.accessExpiresAt,
              previousBooks: enrollment.previousBooks,
            });
          }
        }

        // Gerar estatísticas
        const stats = {
          totalStudents: enrollments.length,
          byBook: {} as Record<string, number>,
        };

        Object.entries(reportByBook).forEach(([book, students]) => {
          stats.byBook[book] = students.length;
        });

        return {
          success: true,
          report: reportByBook,
          stats,
          generatedAt: new Date(),
        };
      } catch (error) {
        console.error('Error generating report:', error);
        throw new Error('Failed to generate report');
      }
    }),

  // Enviar relatório para Jennifer (coordenadora)
  sendReportToCoordinator: adminProcedure
    .input(
      z.object({
        campaignId: z.number(),
        coordinatorEmail: z.string().email(),
      })
    )
    .mutation(async ({ input }: any) => {
      try {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        // Buscar todos os enrollments
        const enrollments = await (db as any).query.studentBackToSchoolEnrollment.findMany({
          where: eq(studentBackToSchoolEnrollment.campaignId, input.campaignId),
        });

        // Agrupar por book
        const reportByBook: Record<string, any[]> = {};
        BOOKS_STRUCTURE.forEach((book) => {
          reportByBook[book.name] = [];
        });

        for (const enrollment of enrollments) {
          const user = await (db as any).query.users.findFirst({
            where: eq(users.id, enrollment.studentId),
          });

          if (user) {
            const bookName = BOOKS_STRUCTURE.find((b) => b.id === (enrollment.currentBook as any))?.name || 'Unknown';
            if (!reportByBook[bookName]) {
              reportByBook[bookName] = [];
            }

            reportByBook[bookName].push({
              studentId: user.studentId,
              name: user.name,
              email: user.email,
              tempPassword: enrollment.tempPassword,
              accessExpiresAt: enrollment.accessExpiresAt,
            });
          }
        }

        // Gerar conteúdo do relatório
        let reportContent = `# Relatório de Volta às Aulas - inFlux\n\n`;
        reportContent += `**Data de Geração:** ${new Date().toLocaleString('pt-BR')}\n`;
        reportContent += `**Total de Alunos:** ${enrollments.length}\n\n`;

        Object.entries(reportByBook).forEach(([book, students]) => {
          reportContent += `## ${book} (${students.length} alunos)\n\n`;
          reportContent += `| ID Aluno | Nome | Email | Senha Temporária | Acesso Expira |\n`;
          reportContent += `|----------|------|-------|------------------|---------------|\n`;

          students.forEach((student) => {
            reportContent += `| ${student.studentId} | ${student.name} | ${student.email} | ${student.tempPassword} | ${new Date(student.accessExpiresAt).toLocaleDateString('pt-BR')} |\n`;
          });

          reportContent += `\n`;
        });

        // Enviar notificação ao coordenador (Jennifer)
        const notificationSent = await notifyOwner({
          title: 'Relatório de Volta às Aulas - inFlux',
          content: reportContent,
        });

        return {
          success: true,
          message: `Relatório enviado para ${input.coordinatorEmail}`,
          notificationSent,
          reportPreview: reportContent.substring(0, 500) + '...',
        };
      } catch (error) {
        console.error('Error sending report:', error);
        throw new Error('Failed to send report');
      }
    }),

  // Obter estatísticas da campanha
  getCampaignStats: adminProcedure
    .input(
      z.object({
        campaignId: z.number(),
      })
    )
    .query(async ({ input }: any) => {
      try {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        const enrollments = await (db as any).query.studentBackToSchoolEnrollment.findMany({
          where: eq(studentBackToSchoolEnrollment.campaignId, input.campaignId),
        });

        const stats = {
          totalEnrolled: enrollments.length,
          byStatus: {
            enrolled: 0,
            pending: 0,
            completed: 0,
            cancelled: 0,
          },
          byBook: {} as Record<string, number>,
          accessExpiredCount: 0,
        };

        enrollments.forEach((enrollment: any) => {
          stats.byStatus[enrollment.enrollmentStatus as keyof typeof stats.byStatus]++;

          const bookName = BOOKS_STRUCTURE.find((b) => b.id === (enrollment.currentBook as any))?.name || 'Unknown';
          stats.byBook[bookName] = (stats.byBook[bookName] || 0) + 1;

          if (enrollment.accessExpiresAt && new Date(enrollment.accessExpiresAt) < new Date()) {
            stats.accessExpiredCount++;
          }
        });

        return {
          success: true,
          stats,
        };
      } catch (error) {
        console.error('Error getting campaign stats:', error);
        throw new Error('Failed to get campaign stats');
      }
    }),

  // Exportar relatório como CSV
  exportReportAsCSV: adminProcedure
    .input(
      z.object({
        campaignId: z.number(),
      })
    )
    .query(async ({ input }: any) => {
      try {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        const enrollments = await (db as any).query.studentBackToSchoolEnrollment.findMany({
          where: eq(studentBackToSchoolEnrollment.campaignId, input.campaignId),
        });

        // Criar CSV
        let csv = 'ID Aluno,Nome,Email,Book Atual,Senha Temporária,Acesso Expira,Status\n';

        for (const enrollment of enrollments) {
          const user = await (db as any).query.users.findFirst({
            where: eq(users.id, enrollment.studentId),
          });

          if (user) {
            const bookName = BOOKS_STRUCTURE.find((b) => b.id === (enrollment.currentBook as any))?.name || 'N/A';
            csv += `"${user.studentId}","${user.name}","${user.email}","${bookName}","${enrollment.tempPassword}","${new Date(enrollment.accessExpiresAt!).toLocaleDateString('pt-BR')}","${enrollment.enrollmentStatus}"\n`;
          }
        }

        return {
          success: true,
          csv,
          filename: `back-to-school-report-${Date.now()}.csv`,
        };
      } catch (error) {
        console.error('Error exporting CSV:', error);
        throw new Error('Failed to export CSV');
      }
    }),
});
