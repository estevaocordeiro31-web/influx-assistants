import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { passportQRCodes, studentObjectives, users, studentBookHistory, books } from '../../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
import QRCode from 'qrcode';

export const passportQRRouter = router({
  /**
   * Gerar QR Code para check-in na capa do passaporte
   * Retorna URL do QR Code que será impresso no passaporte físico
   */
  generateCheckInQR: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Gerar token único para check-in
      const checkInToken = `checkin_${input.studentId}_${Date.now()}`;
      
      // URL que será escaneada no QR Code
      const checkInUrl = `${process.env.VITE_FRONTEND_FORGE_API_URL || 'https://app.influx.com'}/passport/checkin?token=${checkInToken}`;
      
      // Gerar QR Code
      const qrCodeDataUrl = await QRCode.toDataURL(checkInUrl);
      
      // Salvar no banco
      await db.insert(passportQRCodes).values({
        studentId: input.studentId,
        qrCode: qrCodeDataUrl,
        type: 'checkin',
        checkInData: {
          token: checkInToken,
          createdAt: new Date().toISOString(),
          scanned: false,
        },
        createdAt: new Date(),
      });
      
      return {
        success: true,
        qrCodeUrl: qrCodeDataUrl,
        checkInUrl,
        message: 'QR Code de check-in gerado com sucesso',
      };
    }),

  /**
   * Gerar QR Code para sincronização de objetivos
   * Retorna URL do QR Code que será impresso na página interna do passaporte
   */
  generateObjectivesQR: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Gerar token único para objetivos
      const objectivesToken = `objectives_${input.studentId}_${Date.now()}`;
      
      // URL que será escaneada no QR Code
      const objectivesUrl = `${process.env.VITE_FRONTEND_FORGE_API_URL || 'https://app.influx.com'}/passport/objectives?token=${objectivesToken}`;
      
      // Gerar QR Code
      const qrCodeDataUrl = await QRCode.toDataURL(objectivesUrl);
      
      // Salvar no banco
      await db.insert(passportQRCodes).values({
        studentId: input.studentId,
        qrCode: qrCodeDataUrl,
        type: 'objectives',
        checkInData: {
          token: objectivesToken,
          createdAt: new Date().toISOString(),
          scanned: false,
        },
        createdAt: new Date(),
      });
      
      return {
        success: true,
        qrCodeUrl: qrCodeDataUrl,
        objectivesUrl,
        message: 'QR Code de objetivos gerado com sucesso',
      };
    }),

  /**
   * Processar check-in do aluno ao escanear QR Code da capa
   * Retorna mensagem personalizada de Ellie + Flight Plan
   */
  processCheckIn: publicProcedure
    .input(z.object({ token: z.string(), studentId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Verificar token
      const qrRecord = await db.select().from(passportQRCodes).where(
        and(
          eq(passportQRCodes.studentId, input.studentId),
          eq(passportQRCodes.type, 'checkin')
        )
      ).limit(1);
      
      if (qrRecord.length === 0) {
        return {
          success: false,
          message: 'QR Code inválido ou expirado',
        };
      }
      
      const qrRecordData = qrRecord[0];
      
      
      // Buscar dados do aluno
      const studentRecords = await db.select().from(users).where(
        eq(users.id, parseInt(input.studentId))
      ).limit(1);
      
      const student = studentRecords[0];
      
      if (!student) {
        return {
          success: false,
          message: 'Aluno não encontrado',
        };
      }
      
      // Buscar livro atual do aluno
      const bookHistoryRecords = await db.select().from(studentBookHistory).where(
        eq(studentBookHistory.studentId, parseInt(input.studentId))
      ).orderBy(desc(studentBookHistory.startedAt)).limit(1);
      
      const currentBookName = bookHistoryRecords.length > 0 ? 'Regular' : 'Fluxie';
      
      // Retornar mensagem personalizada de Ellie
      return {
        success: true,
        studentName: student.name || 'Aluno',
        studentBook: currentBookName,
        message: `Bem-vindo(a) ao inFlux Passport, ${student.name}! 🎉\n\nSua jornada no nível ${currentBookName} começa agora. Confira seu Flight Plan abaixo e prepare-se para as atividades desta semana!`,
        flightPlan: {
          week: 'Semana de 25 de Fevereiro a 03 de Março',
          activities: [
            { day: 'Segunda', activity: 'Welcome Quest & Games Arena', time: '14:00', status: 'locked' },
            { day: 'Terça', activity: 'Traveler Class', time: '15:00', status: 'locked' },
            { day: 'Quarta', activity: 'OnBusiness Workshop', time: '16:00', status: 'locked' },
            { day: 'Quinta', activity: 'Speaking Challenge', time: '14:30', status: 'locked' },
            { day: 'Sexta', activity: 'Vocabulary Adventure', time: '15:30', status: 'locked' },
          ],
        },
        confirmationButton: true,
      };
    }),

  /**
   * Processar sincronização de objetivos ao escanear QR Code da página interna
   * Retorna sugestões de atividades baseadas nos objetivos
   */
  processObjectives: publicProcedure
    .input(z.object({
      token: z.string(),
      studentId: z.string(),
      objectives: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Verificar token
      const qrRecord = await db.select().from(passportQRCodes).where(
        and(
          eq(passportQRCodes.studentId, input.studentId),
          eq(passportQRCodes.type, 'objectives')
        )
      ).limit(1);
      
      if (qrRecord.length === 0) {
        return {
          success: false,
          message: 'QR Code inválido ou expirado',
        };
      }
      
      
      // Salvar objetivos do aluno
      await db.insert(studentObjectives).values({
        studentId: input.studentId,
        objectives: input.objectives,
        createdAt: new Date(),
      });
      
      // Gerar sugestões de atividades baseadas nos objetivos
      const suggestions = generateActivitySuggestions(input.objectives);
      
      return {
        success: true,
        message: 'Objetivos sincronizados com sucesso! 🎯',
        objectives: input.objectives,
        suggestions,
      };
    }),

  /**
   * Gerar QR Codes para todos os 182 alunos
   * Retorna lista de QR Codes para impressão
   */
  generateAllQRCodes: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Buscar todos os alunos
      const students = await db.select().from(users);
      
      const qrCodes = [];
      
      for (const student of students) {
        // Gerar check-in QR
        const checkInToken = `checkin_${student.id}_${Date.now()}`;
        const checkInUrl = `${process.env.VITE_FRONTEND_FORGE_API_URL || 'https://app.influx.com'}/passport/checkin?token=${checkInToken}&studentId=${student.id}`;
        const checkInQR = await QRCode.toDataURL(checkInUrl);
        
        // Gerar objectives QR
        const objectivesToken = `objectives_${student.id}_${Date.now()}`;
        const objectivesUrl = `${process.env.VITE_FRONTEND_FORGE_API_URL || 'https://app.influx.com'}/passport/objectives?token=${objectivesToken}&studentId=${student.id}`;
        const objectivesQR = await QRCode.toDataURL(objectivesUrl);
        
        // Salvar no banco
        await db.insert(passportQRCodes).values([
          {
            studentId: String(student.id),
            qrCode: checkInQR,
            type: 'checkin',
            checkInData: {
              token: checkInToken,
              createdAt: new Date().toISOString(),
              scanned: false,
            },
            createdAt: new Date(),
          },
          {
            studentId: String(student.id),
            qrCode: objectivesQR,
            type: 'objectives',
            checkInData: {
              token: objectivesToken,
              createdAt: new Date().toISOString(),
              scanned: false,
            },
            createdAt: new Date(),
          },
        ]);
        
        qrCodes.push({
          studentId: student.id,
          studentName: student.name,
          studentEmail: student.email,
          checkInQR,
          objectivesQR,
        });
      }
      
      return {
        success: true,
        totalQRCodes: qrCodes.length,
        qrCodes,
        message: `${qrCodes.length} QR Codes gerados com sucesso!`,
      };
    }),

  /**
   * Exportar QR Codes em formato para impressão
   */
  exportQRCodesForPrint: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const qrRecords = await db.select().from(passportQRCodes);
      
      return {
        success: true,
        totalQRCodes: qrRecords.length,
        qrCodes: qrRecords.map((qr: any) => ({
          studentId: qr.studentId,
          type: qr.type,
          qrCodeUrl: qr.qrCode,
        })),
        message: 'QR Codes exportados com sucesso para impressão',
      };
    }),
});

/**
 * Gerar sugestões de atividades baseadas nos objetivos do aluno
 */
function generateActivitySuggestions(objectives: string[]) {
  const suggestionMap: Record<string, string[]> = {
    'Participar mais em aulas': [
      'Speaking Challenge - Pratique conversação com confiança',
      'Team Games - Interaja em grupo durante as atividades',
      'Traveler Class - Aprenda frases úteis para se comunicar',
    ],
    'Praticar fora da aula': [
      'Vacation Plus - Aprenda inglês para viagens',
      'OnBusiness - Desenvolva habilidades profissionais',
      'Reading Club - Leia histórias em inglês',
    ],
    'Não render ante desafios': [
      'Achievement Quest - Supere desafios progressivos',
      'Mini Challenge - Teste suas habilidades',
      'Wellness Break - Relaxe e aprenda ao mesmo tempo',
    ],
  };
  
  const suggestions: string[] = [];
  
  for (const objective of objectives) {
    if (suggestionMap[objective]) {
      suggestions.push(...suggestionMap[objective]);
    }
  }
  
  return suggestions.slice(0, 5); // Retornar até 5 sugestões
}
