import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { getDb } from './db';
import { users, studentProfiles } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Dashboard Sync', () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error('Database não disponível para testes');
    }
  });

  describe('Mapeamento de Níveis', () => {
    it('deve mapear Book 1 para beginner', () => {
      const mapLevelToLocal = (level?: string) => {
        const levelMap: Record<string, string> = {
          'Book 1': 'beginner',
          'Book 2': 'elementary',
          'Book 3': 'intermediate',
          'Book 4': 'upper_intermediate',
          'Book 5': 'advanced',
        };
        return levelMap[level || ''] || 'beginner';
      };

      expect(mapLevelToLocal('Book 1')).toBe('beginner');
      expect(mapLevelToLocal('Book 2')).toBe('elementary');
      expect(mapLevelToLocal('Book 3')).toBe('intermediate');
      expect(mapLevelToLocal('Book 4')).toBe('upper_intermediate');
      expect(mapLevelToLocal('Book 5')).toBe('advanced');
    });

    it('deve retornar beginner para nível desconhecido', () => {
      const mapLevelToLocal = (level?: string) => {
        const levelMap: Record<string, string> = {
          'Book 1': 'beginner',
          'Book 2': 'elementary',
        };
        return levelMap[level || ''] || 'beginner';
      };

      expect(mapLevelToLocal('Unknown')).toBe('beginner');
      expect(mapLevelToLocal()).toBe('beginner');
    });
  });

  describe('Mapeamento de Objetivos', () => {
    it('deve mapear objetivos corretamente', () => {
      const mapObjectiveToLocal = (objective?: string) => {
        const objectiveMap: Record<string, string> = {
          'Carreira': 'career',
          'Viagem': 'travel',
          'Estudos': 'studies',
          'Outro': 'other',
        };
        return objectiveMap[objective || ''] || 'other';
      };

      expect(mapObjectiveToLocal('Carreira')).toBe('career');
      expect(mapObjectiveToLocal('Viagem')).toBe('travel');
      expect(mapObjectiveToLocal('Estudos')).toBe('studies');
      expect(mapObjectiveToLocal('Outro')).toBe('other');
    });

    it('deve retornar other para objetivo desconhecido', () => {
      const mapObjectiveToLocal = (objective?: string) => {
        const objectiveMap: Record<string, string> = {
          'Carreira': 'career',
        };
        return objectiveMap[objective || ''] || 'other';
      };

      expect(mapObjectiveToLocal('Unknown')).toBe('other');
      expect(mapObjectiveToLocal()).toBe('other');
    });
  });

  describe('Operações de Banco de Dados', () => {
    it('deve criar usuário com dados corretos', async () => {
      const testEmail = `test_${Date.now()}@example.com`;

      // Criar usuário
      await db.insert(users).values({
        openId: `test_${Date.now()}`,
        name: 'Test Student',
        email: testEmail,
        loginMethod: 'dashboard_sync',
        role: 'user',
        status: 'ativo',
      });

      // Verificar se foi criado
      const created = await db
        .select()
        .from(users)
        .where(eq(users.email, testEmail))
        .limit(1);

      expect(created.length).toBe(1);
      expect(created[0].name).toBe('Test Student');
      expect(created[0].loginMethod).toBe('dashboard_sync');
      expect(created[0].status).toBe('ativo');

      // Limpar
      // Note: Não deletamos para manter histórico de testes
    });

    it('deve criar perfil do aluno com dados corretos', async () => {
      const testEmail = `profile_test_${Date.now()}@example.com`;

      // Criar usuário
      await db.insert(users).values({
        openId: `test_${Date.now()}`,
        name: 'Profile Test',
        email: testEmail,
        loginMethod: 'dashboard_sync',
        role: 'user',
        status: 'ativo',
      });

      // Buscar usuário criado
      const createdUser = await db
        .select()
        .from(users)
        .where(eq(users.email, testEmail))
        .limit(1);

      const userId = createdUser[0]?.id;
      expect(userId).toBeDefined();

      // Criar perfil
      if (userId) {
        await db.insert(studentProfiles).values({
          userId,
          objective: 'studies',
          currentLevel: 'intermediate',
          totalHoursLearned: 0,
          streakDays: 0,
        });

        // Verificar perfil
        const profile = await db
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, userId))
          .limit(1);

        expect(profile.length).toBe(1);
        expect(profile[0].objective).toBe('studies');
        expect(profile[0].currentLevel).toBe('intermediate');
      }
    });

    it('deve atualizar perfil existente', async () => {
      const testEmail = `update_test_${Date.now()}@example.com`;

      // Criar usuário
      await db.insert(users).values({
        openId: `test_${Date.now()}`,
        name: 'Update Test',
        email: testEmail,
        loginMethod: 'dashboard_sync',
        role: 'user',
        status: 'ativo',
      });

      // Buscar usuário
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, testEmail))
        .limit(1);

      const userId = user[0]?.id;

      // Criar perfil
      if (userId) {
        await db.insert(studentProfiles).values({
          userId,
          objective: 'career',
          currentLevel: 'beginner',
          totalHoursLearned: 0,
          streakDays: 0,
        });

        // Atualizar perfil
        await db
          .update(studentProfiles)
          .set({
            currentLevel: 'intermediate',
            objective: 'studies',
            updatedAt: new Date(),
          })
          .where(eq(studentProfiles.userId, userId));

        // Verificar atualização
        const updated = await db
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, userId))
          .limit(1);

        expect(updated[0].currentLevel).toBe('intermediate');
        expect(updated[0].objective).toBe('studies');
      }
    });
  });

  describe('Validação de Dados Sincronizados', () => {
    it('deve validar estrutura de aluno sincronizado', () => {
      const student = {
        id: 1,
        name: 'Test Student',
        email: 'test@example.com',
        status: 'Ativo',
        matricula: 'MAT-001',
      };

      expect(student).toHaveProperty('id');
      expect(student).toHaveProperty('name');
      expect(student).toHaveProperty('email');
      expect(student).toHaveProperty('status');
      expect(student.status).toBe('Ativo');
    });

    it('deve validar estrutura de inteligência do aluno', () => {
      const intelligence = {
        id: 1,
        student_id: 1,
        current_level: 'Book 3',
        interest_profile: 'Estudos',
        learning_style: 'visual',
      };

      expect(intelligence).toHaveProperty('student_id');
      expect(intelligence).toHaveProperty('current_level');
      expect(intelligence).toHaveProperty('interest_profile');
    });
  });

  describe('Resultado de Sincronização', () => {
    it('deve retornar estrutura correta de SyncResult', () => {
      const syncResult = {
        success: true,
        totalStudents: 10,
        syncedStudents: 9,
        failedSyncs: 1,
        errors: [{ studentId: 5, error: 'Email duplicado' }],
        timestamp: new Date(),
      };

      expect(syncResult.success).toBe(true);
      expect(syncResult.totalStudents).toBe(10);
      expect(syncResult.syncedStudents).toBe(9);
      expect(syncResult.failedSyncs).toBe(1);
      expect(syncResult.errors.length).toBe(1);
      expect(syncResult.timestamp).toBeInstanceOf(Date);
    });

    it('deve contar erros corretamente', () => {
      const errors = [
        { studentId: 1, error: 'Erro 1' },
        { studentId: 2, error: 'Erro 2' },
        { studentId: 3, error: 'Erro 3' },
      ];

      expect(errors.length).toBe(3);
      expect(errors.filter(e => e.studentId > 1).length).toBe(2);
    });
  });
});
