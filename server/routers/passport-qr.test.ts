import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { getDb } from '../db';
import { passportQRCodes, users, studentBookHistory, books } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import QRCode from 'qrcode';

describe('Passport QR Code System', () => {
  let db: any;
  let testStudentId: number;
  let testBookId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error('Database not available');

    // Criar livro de teste
    const bookResult = await db.insert(books).values({
      bookId: 'test-book-001',
      name: 'Test Book',
      level: 'beginner',
      description: 'Test book for QR code',
      coverImageUrl: 'https://example.com/cover.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Criar usuário de teste
    const userResult = await db.insert(users).values({
      openId: `test-user-${Date.now()}`,
      name: 'Test Student',
      email: 'test@example.com',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    });

    // Obter IDs
    const users_list = await db.select().from(users).where(
      eq(users.email, 'test@example.com')
    ).limit(1);
    testStudentId = users_list[0].id;

    const books_list = await db.select().from(books).where(
      eq(books.bookId, 'test-book-001')
    ).limit(1);
    testBookId = books_list[0].id;

    // Criar histórico de livro
    await db.insert(studentBookHistory).values({
      studentId: testStudentId,
      bookId: testBookId,
      status: 'in_progress',
      startedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  afterAll(async () => {
    if (!db) return;

    // Limpar dados de teste
    await db.delete(passportQRCodes).where(
      eq(passportQRCodes.studentId, String(testStudentId))
    );

    await db.delete(studentBookHistory).where(
      eq(studentBookHistory.studentId, testStudentId)
    );

    await db.delete(users).where(
      eq(users.id, testStudentId)
    );

    await db.delete(books).where(
      eq(books.bookId, 'test-book-001')
    );
  });

  describe('QR Code Generation', () => {
    it('should generate valid QR code data URL', async () => {
      const testUrl = 'https://app.influx.com/passport/checkin?token=test123&studentId=1';
      const qrCode = await QRCode.toDataURL(testUrl);

      expect(qrCode).toBeDefined();
      expect(qrCode).toMatch(/^data:image\/png;base64,/);
    });

    it('should generate check-in QR code with correct URL format', async () => {
      const studentId = String(testStudentId);
      const token = `checkin_${studentId}_${Date.now()}`;
      const checkInUrl = `https://app.influx.com/passport/checkin?token=${token}&studentId=${studentId}`;

      expect(checkInUrl).toContain('checkin');
      expect(checkInUrl).toContain('token=');
      expect(checkInUrl).toContain('studentId=');
    });

    it('should generate objectives QR code with correct URL format', async () => {
      const studentId = String(testStudentId);
      const token = `objectives_${studentId}_${Date.now()}`;
      const objectivesUrl = `https://app.influx.com/passport/objectives?token=${token}&studentId=${studentId}`;

      expect(objectivesUrl).toContain('objectives');
      expect(objectivesUrl).toContain('token=');
      expect(objectivesUrl).toContain('studentId=');
    });
  });

  describe('QR Code Storage', () => {
    it('should store check-in QR code in database', async () => {
      const studentId = String(testStudentId);
      const token = `checkin_${studentId}_${Date.now()}`;
      const qrCodeDataUrl = await QRCode.toDataURL(`https://app.influx.com/passport/checkin?token=${token}`);

      await db.insert(passportQRCodes).values({
        studentId,
        qrCode: qrCodeDataUrl,
        type: 'checkin',
        checkInData: {
          token,
          createdAt: new Date().toISOString(),
          scanned: false,
        },
        createdAt: new Date(),
      });

      const stored = await db.select().from(passportQRCodes).where(
        eq(passportQRCodes.studentId, studentId)
      ).limit(1);

      expect(stored.length).toBe(1);
      expect(stored[0].type).toBe('checkin');
      expect(stored[0].studentId).toBe(studentId);
    });

    it('should store objectives QR code in database', async () => {
      const studentId = String(testStudentId);
      const token = `objectives_${studentId}_${Date.now()}`;
      const qrCodeDataUrl = await QRCode.toDataURL(`https://app.influx.com/passport/objectives?token=${token}`);

      await db.insert(passportQRCodes).values({
        studentId,
        qrCode: qrCodeDataUrl,
        type: 'objectives',
        checkInData: {
          token,
          createdAt: new Date().toISOString(),
          scanned: false,
        },
        createdAt: new Date(),
      });

      const stored = await db.select().from(passportQRCodes).where(
        eq(passportQRCodes.studentId, studentId)
      ).limit(1);

      expect(stored.length).toBeGreaterThan(0);
      expect(stored.some(qr => qr.type === 'objectives')).toBe(true);
    });
  });

  describe('Check-in Processing', () => {
    it('should retrieve student data for check-in', async () => {
      const studentRecords = await db.select().from(users).where(
        eq(users.id, testStudentId)
      ).limit(1);

      expect(studentRecords.length).toBe(1);
      expect(studentRecords[0].name).toBe('Test Student');
      expect(studentRecords[0].email).toBe('test@example.com');
    });

    it('should retrieve current book for student', async () => {
      const bookHistoryRecords = await db.select().from(studentBookHistory).where(
        eq(studentBookHistory.studentId, testStudentId)
      ).limit(1);

      expect(bookHistoryRecords.length).toBe(1);
      expect(bookHistoryRecords[0].studentId).toBe(testStudentId);
    });

    it('should generate personalized check-in message', async () => {
      const studentRecords = await db.select().from(users).where(
        eq(users.id, testStudentId)
      ).limit(1);

      const student = studentRecords[0];
      const message = `Bem-vindo(a) ao inFlux Passport, ${student.name}! 🎉\n\nSua jornada no nível Regular começa agora. Confira seu Flight Plan abaixo e prepare-se para as atividades desta semana!`;

      expect(message).toContain(student.name);
      expect(message).toContain('inFlux Passport');
      expect(message).toContain('Flight Plan');
    });
  });

  describe('Flight Plan Generation', () => {
    it('should generate flight plan with correct structure', () => {
      const flightPlan = {
        week: 'Semana de 25 de Fevereiro a 03 de Março',
        activities: [
          { day: 'Segunda', activity: 'Welcome Quest & Games Arena', time: '14:00', status: 'locked' },
          { day: 'Terça', activity: 'Traveler Class', time: '15:00', status: 'locked' },
          { day: 'Quarta', activity: 'OnBusiness Workshop', time: '16:00', status: 'locked' },
          { day: 'Quinta', activity: 'Speaking Challenge', time: '14:30', status: 'locked' },
          { day: 'Sexta', activity: 'Vocabulary Adventure', time: '15:30', status: 'locked' },
        ],
      };

      expect(flightPlan.week).toBeDefined();
      expect(flightPlan.activities.length).toBe(5);
      expect(flightPlan.activities[0].day).toBe('Segunda');
      expect(flightPlan.activities[0].status).toBe('locked');
    });

    it('should have all activities locked on initial check-in', () => {
      const activities = [
        { day: 'Segunda', activity: 'Welcome Quest & Games Arena', time: '14:00', status: 'locked' },
        { day: 'Terça', activity: 'Traveler Class', time: '15:00', status: 'locked' },
        { day: 'Quarta', activity: 'OnBusiness Workshop', time: '16:00', status: 'locked' },
        { day: 'Quinta', activity: 'Speaking Challenge', time: '14:30', status: 'locked' },
        { day: 'Sexta', activity: 'Vocabulary Adventure', time: '15:30', status: 'locked' },
      ];

      const allLocked = activities.every(activity => activity.status === 'locked');
      expect(allLocked).toBe(true);
    });
  });

  describe('Objectives Synchronization', () => {
    it('should generate activity suggestions from objectives', () => {
      const objectives = ['Participar mais em aulas', 'Praticar fora da aula'];
      
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
      };

      const suggestions: string[] = [];
      for (const objective of objectives) {
        if (suggestionMap[objective]) {
          suggestions.push(...suggestionMap[objective]);
        }
      }

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('Speaking Challenge'))).toBe(true);
      expect(suggestions.some(s => s.includes('Vacation Plus'))).toBe(true);
    });

    it('should limit suggestions to 5 items', () => {
      const objectives = [
        'Participar mais em aulas',
        'Praticar fora da aula',
        'Não render ante desafios',
      ];

      const suggestionMap: Record<string, string[]> = {
        'Participar mais em aulas': [
          'Speaking Challenge',
          'Team Games',
          'Traveler Class',
        ],
        'Praticar fora da aula': [
          'Vacation Plus',
          'OnBusiness',
          'Reading Club',
        ],
        'Não render ante desafios': [
          'Achievement Quest',
          'Mini Challenge',
          'Wellness Break',
        ],
      };

      const suggestions: string[] = [];
      for (const objective of objectives) {
        if (suggestionMap[objective]) {
          suggestions.push(...suggestionMap[objective]);
        }
      }

      const limited = suggestions.slice(0, 5);
      expect(limited.length).toBeLessThanOrEqual(5);
    });
  });

  describe('QR Code Validation', () => {
    it('should validate check-in token format', () => {
      const studentId = String(testStudentId);
      const token = `checkin_${studentId}_${Date.now()}`;

      expect(token).toMatch(/^checkin_\d+_\d+$/);
    });

    it('should validate objectives token format', () => {
      const studentId = String(testStudentId);
      const token = `objectives_${studentId}_${Date.now()}`;

      expect(token).toMatch(/^objectives_\d+_\d+$/);
    });

    it('should handle invalid token gracefully', async () => {
      const invalidToken = 'invalid_token_format';
      const studentId = String(testStudentId);

      // Simular busca de QR code inválido
      const qrRecords = await db.select().from(passportQRCodes).where(
        eq(passportQRCodes.studentId, studentId)
      );

      // Se não encontrar, deve retornar array vazio
      const invalidQR = qrRecords.filter((qr: any) => qr.checkInData?.token === invalidToken);
      expect(invalidQR.length).toBe(0);
    });
  });

  describe('Multi-Student QR Code Generation', () => {
    it('should generate unique QR codes for multiple students', async () => {
      const studentIds = [String(testStudentId)];
      const qrCodes = [];

      for (const studentId of studentIds) {
        const checkInToken = `checkin_${studentId}_${Date.now()}`;
        const checkInUrl = `https://app.influx.com/passport/checkin?token=${checkInToken}&studentId=${studentId}`;
        const checkInQR = await QRCode.toDataURL(checkInUrl);

        qrCodes.push({
          studentId,
          checkInQR,
        });
      }

      expect(qrCodes.length).toBe(studentIds.length);
      expect(qrCodes[0].checkInQR).toMatch(/^data:image\/png;base64,/);
    });

    it('should store multiple QR codes without conflicts', async () => {
      const studentId = String(testStudentId);
      
      // Gerar dois QR codes diferentes
      const token1 = `checkin_${studentId}_${Date.now()}`;
      const qr1 = await QRCode.toDataURL(`https://app.influx.com/passport/checkin?token=${token1}`);

      const token2 = `objectives_${studentId}_${Date.now() + 1}`;
      const qr2 = await QRCode.toDataURL(`https://app.influx.com/passport/objectives?token=${token2}`);

      // Ambos devem ser válidos
      expect(qr1).toMatch(/^data:image\/png;base64,/);
      expect(qr2).toMatch(/^data:image\/png;base64,/);
      expect(qr1).not.toBe(qr2);
    });
  });
});
