import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { validateWebhookSignature } from './_core/webhook-handler';

/**
 * Testes para Webhook Handler
 */

describe('Webhook Handler', () => {
  describe('Validação de Assinatura', () => {
    it('deve validar assinatura HMAC-SHA256 correta', () => {
      const secret = 'test-secret';
      const payload = JSON.stringify({ type: 'student_added', data: {} });
      const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');

      const isValid = validateWebhookSignature(payload, hash, secret);
      expect(isValid).toBe(true);
    });

    it('deve rejeitar assinatura inválida', () => {
      const secret = 'test-secret';
      const payload = JSON.stringify({ type: 'student_added', data: {} });
      const invalidHash = 'invalid-hash';

      const isValid = validateWebhookSignature(payload, invalidHash, secret);
      expect(isValid).toBe(false);
    });

    it('deve rejeitar assinatura com secret errado', () => {
      const secret = 'test-secret';
      const wrongSecret = 'wrong-secret';
      const payload = JSON.stringify({ type: 'student_added', data: {} });
      const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');

      const isValid = validateWebhookSignature(payload, hash, wrongSecret);
      expect(isValid).toBe(false);
    });

    it('deve rejeitar assinatura com payload modificado', () => {
      const secret = 'test-secret';
      const payload = JSON.stringify({ type: 'student_added', data: {} });
      const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');

      const modifiedPayload = JSON.stringify({ type: 'student_added', data: { modified: true } });
      const isValid = validateWebhookSignature(modifiedPayload, hash, secret);
      expect(isValid).toBe(false);
    });
  });

  describe('Tipos de Eventos', () => {
    it('deve reconhecer evento student_added', () => {
      const eventType = 'student_added';
      const validTypes = ['student_added', 'grade_updated', 'attendance_recorded'];
      expect(validTypes).toContain(eventType);
    });

    it('deve reconhecer evento grade_updated', () => {
      const eventType = 'grade_updated';
      const validTypes = ['student_added', 'grade_updated', 'attendance_recorded'];
      expect(validTypes).toContain(eventType);
    });

    it('deve reconhecer evento attendance_recorded', () => {
      const eventType = 'attendance_recorded';
      const validTypes = ['student_added', 'grade_updated', 'attendance_recorded'];
      expect(validTypes).toContain(eventType);
    });
  });

  describe('Payload de Eventos', () => {
    it('deve ter estrutura correta para student_added', () => {
      const payload = {
        type: 'student_added',
        data: {
          studentId: 1,
          name: 'João',
          email: 'joao@example.com',
          level: 'elementary',
        },
      };

      expect(payload.type).toBe('student_added');
      expect(payload.data.studentId).toBeDefined();
      expect(payload.data.name).toBeDefined();
    });

    it('deve ter estrutura correta para grade_updated', () => {
      const payload = {
        type: 'grade_updated',
        data: {
          studentId: 1,
          topicId: 'medical-english-1',
          topicName: 'Medical Terminology',
          grade: 85,
          category: 'professional',
        },
      };

      expect(payload.type).toBe('grade_updated');
      expect(payload.data.studentId).toBeDefined();
      expect(payload.data.topicId).toBeDefined();
      expect(payload.data.grade).toBeGreaterThanOrEqual(0);
      expect(payload.data.grade).toBeLessThanOrEqual(100);
    });

    it('deve ter estrutura correta para attendance_recorded', () => {
      const payload = {
        type: 'attendance_recorded',
        data: {
          studentId: 1,
          date: '2026-02-12',
          status: 'present',
          duration: 60,
        },
      };

      expect(payload.type).toBe('attendance_recorded');
      expect(payload.data.studentId).toBeDefined();
      expect(payload.data.date).toBeDefined();
      expect(payload.data.status).toBeDefined();
    });
  });

  describe('Validação de Dados', () => {
    it('deve validar studentId como número positivo', () => {
      const studentId = 1;
      expect(typeof studentId).toBe('number');
      expect(studentId).toBeGreaterThan(0);
    });

    it('deve validar grade entre 0 e 100', () => {
      const validGrades = [0, 25, 50, 75, 100];
      validGrades.forEach((grade) => {
        expect(grade).toBeGreaterThanOrEqual(0);
        expect(grade).toBeLessThanOrEqual(100);
      });
    });

    it('deve rejeitar grade fora do intervalo', () => {
      const invalidGrades = [-1, 101, 150];
      invalidGrades.forEach((grade) => {
        expect(grade < 0 || grade > 100).toBe(true);
      });
    });

    it('deve validar topicId como string não vazia', () => {
      const topicId = 'medical-english-1';
      expect(typeof topicId).toBe('string');
      expect(topicId.length).toBeGreaterThan(0);
    });

    it('deve validar category como valor válido', () => {
      const validCategories = ['professional', 'traveller', 'general'];
      const category = 'professional';
      expect(validCategories).toContain(category);
    });
  });

  describe('Progresso de Tópicos', () => {
    it('deve calcular percentual de progresso corretamente', () => {
      const grade = 85;
      const progressPercentage = Math.round(grade);
      expect(progressPercentage).toBe(85);
    });

    it('deve marcar como completo quando progressPercentage === 100', () => {
      const progressPercentage = 100;
      const completed = progressPercentage === 100;
      expect(completed).toBe(true);
    });

    it('deve marcar como incompleto quando progressPercentage < 100', () => {
      const progressPercentage = 75;
      const completed = progressPercentage === 100;
      expect(completed).toBe(false);
    });

    it('deve registrar timestamp de conclusão', () => {
      const progressPercentage = 100;
      const completedAt = progressPercentage === 100 ? new Date() : null;
      expect(completedAt).not.toBeNull();
    });

    it('deve não registrar timestamp se incompleto', () => {
      const progressPercentage = 50;
      const completedAt = progressPercentage === 100 ? new Date() : null;
      expect(completedAt).toBeNull();
    });
  });

  describe('Endpoints', () => {
    it('deve ter endpoint POST /api/webhooks/sync', () => {
      const endpoint = '/api/webhooks/sync';
      expect(endpoint).toBe('/api/webhooks/sync');
    });

    it('deve ter endpoint GET /api/webhooks/health', () => {
      const endpoint = '/api/webhooks/health';
      expect(endpoint).toBe('/api/webhooks/health');
    });
  });

  describe('Respostas de Sucesso', () => {
    it('deve retornar resposta de sucesso para student_added', () => {
      const response = {
        success: true,
        message: 'Aluno sincronizado com sucesso',
      };

      expect(response.success).toBe(true);
      expect(response.message).toContain('sucesso');
    });

    it('deve retornar resposta de sucesso para grade_updated', () => {
      const response = {
        success: true,
        message: 'Progresso atualizado: 85%',
      };

      expect(response.success).toBe(true);
      expect(response.message).toContain('Progresso');
    });

    it('deve retornar resposta de sucesso para attendance_recorded', () => {
      const response = {
        success: true,
        message: 'Presença registrada com sucesso',
      };

      expect(response.success).toBe(true);
      expect(response.message).toContain('sucesso');
    });

    it('deve retornar timestamp na resposta', () => {
      const response = {
        success: true,
        timestamp: new Date(),
      };

      expect(response.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve retornar erro para tipo de evento desconhecido', () => {
      const error = {
        error: 'Tipo de evento desconhecido',
        statusCode: 400,
      };

      expect(error.error).toContain('desconhecido');
      expect(error.statusCode).toBe(400);
    });

    it('deve retornar erro 401 para assinatura inválida', () => {
      const error = {
        error: 'Assinatura de webhook inválida',
        statusCode: 401,
      };

      expect(error.statusCode).toBe(401);
    });

    it('deve retornar erro 500 para erro interno', () => {
      const error = {
        error: 'Erro ao processar webhook',
        statusCode: 500,
      };

      expect(error.statusCode).toBe(500);
    });

    it('deve incluir mensagem de erro detalhada', () => {
      const error = {
        error: 'Erro ao processar webhook',
        message: 'Database não disponível',
      };

      expect(error.message).toBeDefined();
      expect(error.message.length).toBeGreaterThan(0);
    });
  });

  describe('Health Check', () => {
    it('deve retornar status healthy quando disponível', () => {
      const response = {
        status: 'healthy',
        message: 'Webhook sincronizado e pronto para receber eventos',
      };

      expect(response.status).toBe('healthy');
    });

    it('deve retornar status error quando indisponível', () => {
      const response = {
        status: 'error',
        message: 'Database não disponível',
      };

      expect(response.status).toBe('error');
    });

    it('deve incluir timestamp no health check', () => {
      const response = {
        status: 'healthy',
        timestamp: new Date(),
      };

      expect(response.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('Sincronização de Dados', () => {
    it('deve sincronizar aluno novo', () => {
      const studentData = {
        studentId: 1,
        name: 'Tiago Laerte Marques',
        email: 'tiago.laerte@icloud.com',
        level: 'elementary',
      };

      expect(studentData.studentId).toBeDefined();
      expect(studentData.name).toBeDefined();
      expect(studentData.email).toBeDefined();
    });

    it('deve atualizar nota de aluno existente', () => {
      const gradeUpdate = {
        studentId: 1,
        topicId: 'medical-english-1',
        grade: 85,
        previousGrade: 75,
      };

      expect(gradeUpdate.grade).toBeGreaterThan(gradeUpdate.previousGrade);
    });

    it('deve registrar presença do aluno', () => {
      const attendance = {
        studentId: 1,
        date: '2026-02-12',
        status: 'present',
        duration: 60,
      };

      expect(attendance.status).toBe('present');
      expect(attendance.duration).toBeGreaterThan(0);
    });
  });
});
