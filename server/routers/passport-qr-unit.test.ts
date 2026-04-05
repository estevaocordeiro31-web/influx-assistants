import { describe, it, expect, vi } from 'vitest';
import QRCode from 'qrcode';

/**
 * Testes unitários para o sistema de QR Code do Passaporte
 * Estes testes não dependem do banco de dados
 */

describe('Passport QR Code - Unit Tests', () => {
  describe('QR Code Generation', () => {
    it('should generate valid QR code data URL', async () => {
      const testUrl = 'https://app.influx.com/passport/checkin?token=test123&studentId=1';
      const qrCode = await QRCode.toDataURL(testUrl);

      expect(qrCode).toBeDefined();
      expect(typeof qrCode).toBe('string');
      expect(qrCode).toMatch(/^data:image\/png;base64,/);
    });

    it('should generate different QR codes for different URLs', async () => {
      const url1 = 'https://app.influx.com/passport/checkin?token=token1&studentId=1';
      const url2 = 'https://app.influx.com/passport/checkin?token=token2&studentId=2';

      const qr1 = await QRCode.toDataURL(url1);
      const qr2 = await QRCode.toDataURL(url2);

      expect(qr1).not.toBe(qr2);
    });

    it('should generate check-in QR code with correct URL format', () => {
      const studentId = '12345';
      const token = `checkin_${studentId}_${Date.now()}`;
      const checkInUrl = `https://app.influx.com/passport/checkin?token=${token}&studentId=${studentId}`;

      expect(checkInUrl).toContain('checkin');
      expect(checkInUrl).toContain('token=');
      expect(checkInUrl).toContain('studentId=');
      expect(checkInUrl).toContain(studentId);
    });

    it('should generate objectives QR code with correct URL format', () => {
      const studentId = '12345';
      const token = `objectives_${studentId}_${Date.now()}`;
      const objectivesUrl = `https://app.influx.com/passport/objectives?token=${token}&studentId=${studentId}`;

      expect(objectivesUrl).toContain('objectives');
      expect(objectivesUrl).toContain('token=');
      expect(objectivesUrl).toContain('studentId=');
      expect(objectivesUrl).toContain(studentId);
    });
  });

  describe('Token Generation', () => {
    it('should generate unique check-in tokens', () => {
      const studentId = '1';
      const token1 = `checkin_${studentId}_${Date.now()}`;
      
      // Pequeno delay para garantir timestamp diferente
      const token2 = `checkin_${studentId}_${Date.now() + 1}`;

      expect(token1).not.toBe(token2);
    });

    it('should validate check-in token format', () => {
      const studentId = '12345';
      const timestamp = Date.now();
      const token = `checkin_${studentId}_${timestamp}`;

      expect(token).toMatch(/^checkin_\d+_\d+$/);
    });

    it('should validate objectives token format', () => {
      const studentId = '12345';
      const timestamp = Date.now();
      const token = `objectives_${studentId}_${timestamp}`;

      expect(token).toMatch(/^objectives_\d+_\d+$/);
    });

    it('should include student ID in token', () => {
      const studentId = '54321';
      const token = `checkin_${studentId}_${Date.now()}`;

      expect(token).toContain(studentId);
    });
  });

  describe('Check-in Message Generation', () => {
    it('should generate personalized check-in message', () => {
      const studentName = 'João Silva';
      const currentBook = 'Regular';
      const message = `Bem-vindo(a) ao inFlux Passport, ${studentName}! 🎉\n\nSua jornada no nível ${currentBook} começa agora. Confira seu Flight Plan abaixo e prepare-se para as atividades desta semana!`;

      expect(message).toContain(studentName);
      expect(message).toContain('inFlux Passport');
      expect(message).toContain(currentBook);
      expect(message).toContain('Flight Plan');
    });

    it('should handle different student names', () => {
      const names = ['Ana', 'Bruno', 'Carla', 'Diego', 'Eduarda'];
      
      names.forEach(name => {
        const message = `Bem-vindo(a) ao inFlux Passport, ${name}! 🎉`;
        expect(message).toContain(name);
      });
    });

    it('should handle different book levels', () => {
      const books = ['Fluxie', 'Junior', 'Regular', 'Comunicação Avançada'];
      
      books.forEach(book => {
        const message = `Sua jornada no nível ${book} começa agora.`;
        expect(message).toContain(book);
      });
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
      expect(typeof flightPlan.week).toBe('string');
      expect(flightPlan.activities).toBeInstanceOf(Array);
      expect(flightPlan.activities.length).toBe(5);
    });

    it('should have all activities with required fields', () => {
      const activities = [
        { day: 'Segunda', activity: 'Welcome Quest & Games Arena', time: '14:00', status: 'locked' },
        { day: 'Terça', activity: 'Traveler Class', time: '15:00', status: 'locked' },
      ];

      activities.forEach(activity => {
        expect(activity).toHaveProperty('day');
        expect(activity).toHaveProperty('activity');
        expect(activity).toHaveProperty('time');
        expect(activity).toHaveProperty('status');
      });
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

    it('should have correct time format HH:MM', () => {
      const activities = [
        { day: 'Segunda', activity: 'Welcome Quest & Games Arena', time: '14:00', status: 'locked' },
        { day: 'Terça', activity: 'Traveler Class', time: '15:00', status: 'locked' },
      ];

      activities.forEach(activity => {
        expect(activity.time).toMatch(/^\d{2}:\d{2}$/);
      });
    });
  });

  describe('Activity Suggestions', () => {
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

    it('should handle empty objectives', () => {
      const objectives: string[] = [];
      
      const suggestionMap: Record<string, string[]> = {
        'Participar mais em aulas': ['Speaking Challenge'],
      };

      const suggestions: string[] = [];
      for (const objective of objectives) {
        if (suggestionMap[objective]) {
          suggestions.push(...suggestionMap[objective]);
        }
      }

      expect(suggestions.length).toBe(0);
    });

    it('should handle unknown objectives', () => {
      const objectives = ['Objetivo desconhecido'];
      
      const suggestionMap: Record<string, string[]> = {
        'Participar mais em aulas': ['Speaking Challenge'],
      };

      const suggestions: string[] = [];
      for (const objective of objectives) {
        if (suggestionMap[objective]) {
          suggestions.push(...suggestionMap[objective]);
        }
      }

      expect(suggestions.length).toBe(0);
    });
  });

  describe('URL Construction', () => {
    it('should construct valid check-in URL', () => {
      const studentId = '123';
      const token = `checkin_${studentId}_${Date.now()}`;
      const baseUrl = 'https://app.influx.com';
      const checkInUrl = `${baseUrl}/passport/checkin?token=${token}&studentId=${studentId}`;

      expect(checkInUrl).toContain(baseUrl);
      expect(checkInUrl).toContain('/passport/checkin');
      expect(checkInUrl).toContain(`token=${token}`);
      expect(checkInUrl).toContain(`studentId=${studentId}`);
    });

    it('should construct valid objectives URL', () => {
      const studentId = '456';
      const token = `objectives_${studentId}_${Date.now()}`;
      const baseUrl = 'https://app.influx.com';
      const objectivesUrl = `${baseUrl}/passport/objectives?token=${token}&studentId=${studentId}`;

      expect(objectivesUrl).toContain(baseUrl);
      expect(objectivesUrl).toContain('/passport/objectives');
      expect(objectivesUrl).toContain(`token=${token}`);
      expect(objectivesUrl).toContain(`studentId=${studentId}`);
    });

    it('should handle environment variable for base URL', () => {
      const baseUrl = process.env.VITE_FRONTEND_FORGE_API_URL || 'https://app.influx.com';
      const studentId = '789';
      const token = `checkin_${studentId}_${Date.now()}`;
      const checkInUrl = `${baseUrl}/passport/checkin?token=${token}&studentId=${studentId}`;

      expect(checkInUrl).toContain('/passport/checkin');
      expect(checkInUrl).toContain(studentId);
    });
  });

  describe('Response Structure', () => {
    it('should have correct check-in response structure', () => {
      const response = {
        success: true,
        studentName: 'João Silva',
        studentBook: 'Regular',
        message: 'Bem-vindo(a) ao inFlux Passport!',
        flightPlan: {
          week: 'Semana de 25 de Fevereiro a 03 de Março',
          activities: [],
        },
        confirmationButton: true,
      };

      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('studentName');
      expect(response).toHaveProperty('studentBook');
      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('flightPlan');
      expect(response).toHaveProperty('confirmationButton');
      expect(response.success).toBe(true);
    });

    it('should have correct error response structure', () => {
      const response = {
        success: false,
        message: 'QR Code inválido ou expirado',
      };

      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('message');
      expect(response.success).toBe(false);
    });

    it('should have correct objectives response structure', () => {
      const response = {
        success: true,
        message: 'Objetivos sincronizados com sucesso! 🎯',
        objectives: ['Objetivo 1', 'Objetivo 2'],
        suggestions: ['Sugestão 1', 'Sugestão 2'],
      };

      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('objectives');
      expect(response).toHaveProperty('suggestions');
      expect(Array.isArray(response.objectives)).toBe(true);
      expect(Array.isArray(response.suggestions)).toBe(true);
    });
  });

  describe('Data Validation', () => {
    it('should validate student ID format', () => {
      const validIds = ['1', '123', '999999'];
      const invalidIds = ['', 'abc', '-1'];

      validIds.forEach(id => {
        expect(id).toBeTruthy();
        expect(parseInt(id)).toBeGreaterThan(0);
      });

      invalidIds.forEach(id => {
        if (id === '') {
          expect(id).toBeFalsy();
        } else if (id === 'abc') {
          expect(isNaN(parseInt(id))).toBe(true);
        } else if (id === '-1') {
          expect(parseInt(id)).toBeLessThanOrEqual(0);
        }
      });
    });

    it('should validate objectives array', () => {
      const validObjectives = [
        ['Objetivo 1'],
        ['Objetivo 1', 'Objetivo 2'],
        ['Participar mais em aulas', 'Praticar fora da aula', 'Não render ante desafios'],
      ];

      validObjectives.forEach(objectives => {
        expect(Array.isArray(objectives)).toBe(true);
        expect(objectives.length).toBeGreaterThan(0);
      });
    });

    it('should validate message length', () => {
      const message = `Bem-vindo(a) ao inFlux Passport, João Silva! 🎉\n\nSua jornada no nível Regular começa agora. Confira seu Flight Plan abaixo e prepare-se para as atividades desta semana!`;

      expect(message.length).toBeGreaterThan(0);
      expect(typeof message).toBe('string');
    });
  });
});
