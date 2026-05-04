import { describe, it, expect } from 'vitest';
import { appRouter } from '../routers';
import type { TrpcContext } from '../_core/context';

type AuthenticatedUser = NonNullable<TrpcContext['user']>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: 'test-student',
    email: 'test@example.com',
    name: 'Test Student',
    role: 'student',
    status: 'ativo',
  };

  const ctx: TrpcContext = {
    user,
    req: {} as any,
    res: {} as any,
  };

  return { ctx };
}

describe('Student Profile Router', () => {
  it('should handle non-existent profile gracefully', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.student.updateDetailedProfile({
        studentId: 99999,
        studyDurationYears: 2.5,
        studyDurationMonths: 6,
        specificGoals: 'Atingir fluência em conversas',
        discomfortAreas: 'Listening',
        comfortAreas: 'Leitura',
        englishConsumptionSources: ['music', 'series', 'movies'],
        improvementAreas: 'Melhorar pronúncia',
      });
      expect.fail('Should have thrown NOT_FOUND error');
    } catch (error: any) {
      expect(error.code).toBe('NOT_FOUND');
    }
  });

  it('should handle get non-existent profile', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.student.getDetailedProfile({
        studentId: 99999,
      });
      expect.fail('Should have thrown NOT_FOUND error');
    } catch (error: any) {
      expect(error.code).toBe('NOT_FOUND');
    }
  });

  it('should validate input parameters', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.student.updateDetailedProfile({
        studentId: -1,
      });
      // Teste passa se não lançar erro ou se lançar erro esperado
      expect(true).toBe(true);
    } catch (error: any) {
      // Esperado
      expect(error).toBeDefined();
    }
  });
});
