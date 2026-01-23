/**
 * Reports Router
 * Handles PDF report generation for students and classes
 */

import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { generateStudentReportData, generateStudentReportHTML, generateClassReportData } from "../pdf-reports";

export const reportsRouter = router({
  /**
   * Generate student progress report
   * Returns HTML that can be converted to PDF on the client
   */
  getStudentReport: protectedProcedure
    .input(z.object({
      studentId: z.number().optional() // If not provided, uses current user
    }))
    .query(async ({ ctx, input }) => {
      const userId = input.studentId || ctx.user.id;
      
      // Only allow users to view their own report unless admin
      if (input.studentId && input.studentId !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new Error('Você não tem permissão para ver este relatório');
      }
      
      const reportData = await generateStudentReportData(userId);
      
      if (!reportData) {
        throw new Error('Dados do aluno não encontrados');
      }
      
      const html = generateStudentReportHTML(reportData);
      
      return {
        data: reportData,
        html,
        generatedAt: new Date()
      };
    }),

  /**
   * Generate class report (admin only)
   */
  getClassReport: adminProcedure
    .input(z.object({
      className: z.string()
    }))
    .query(async ({ input }) => {
      const reportData = await generateClassReportData(input.className);
      
      if (!reportData) {
        throw new Error('Dados da turma não encontrados');
      }
      
      return {
        data: reportData,
        generatedAt: new Date()
      };
    }),

  /**
   * Get report data only (without HTML)
   */
  getStudentReportData: protectedProcedure
    .input(z.object({
      studentId: z.number().optional()
    }))
    .query(async ({ ctx, input }) => {
      const userId = input.studentId || ctx.user.id;
      
      if (input.studentId && input.studentId !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new Error('Você não tem permissão para ver este relatório');
      }
      
      const reportData = await generateStudentReportData(userId);
      
      if (!reportData) {
        throw new Error('Dados do aluno não encontrados');
      }
      
      return reportData;
    }),
});
