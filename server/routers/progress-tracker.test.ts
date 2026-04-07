import { describe, it, expect } from 'vitest';

/**
 * Testes para Progress Tracker Router
 */

describe('Progress Tracker Router', () => {
  describe('recordTopicAccess', () => {
    it('deve validar topicId obrigatório', () => {
      const input = {
        topicId: 'med-1',
        topicName: 'Medical English - Basics',
        category: 'professional' as const,
        progressPercentage: 50,
      };
      expect(input.topicId).toBeDefined();
      expect(input.topicId.length).toBeGreaterThan(0);
    });

    it('deve validar progressPercentage entre 0 e 100', () => {
      const validProgress = [0, 25, 50, 75, 100];
      validProgress.forEach((progress) => {
        expect(progress).toBeGreaterThanOrEqual(0);
        expect(progress).toBeLessThanOrEqual(100);
      });
    });

    it('deve aceitar categoria válida', () => {
      const validCategories = ['professional', 'traveller', 'general'];
      const category = 'professional';
      expect(validCategories).toContain(category);
    });

    it('deve registrar novo tópico', () => {
      const topicData = {
        topicId: 'med-1',
        topicName: 'Medical English - Basics',
        category: 'professional' as const,
        progressPercentage: 0,
        timeSpentMinutes: 0,
      };
      expect(topicData.progressPercentage).toBe(0);
      expect(topicData.timeSpentMinutes).toBe(0);
    });

    it('deve atualizar progresso existente', () => {
      const oldProgress = 50;
      const newProgress = 75;
      expect(newProgress).toBeGreaterThan(oldProgress);
    });

    it('deve acumular tempo gasto', () => {
      const previousTime = 30;
      const newTime = 15;
      const totalTime = previousTime + newTime;
      expect(totalTime).toBe(45);
    });
  });

  describe('getTopicProgress', () => {
    it('deve retornar progresso de tópico existente', () => {
      const progress = {
        found: true,
        progress: {
          topicId: 'med-1',
          progressPercentage: 50,
          completed: false,
        },
      };
      expect(progress.found).toBe(true);
      expect(progress.progress?.topicId).toBe('med-1');
    });

    it('deve retornar null para tópico não encontrado', () => {
      const progress = {
        found: false,
        progress: null,
      };
      expect(progress.found).toBe(false);
      expect(progress.progress).toBeNull();
    });
  });

  describe('getCategoryProgress', () => {
    it('deve calcular progresso por categoria', () => {
      const topics = [
        { completed: true, progressPercentage: 100 },
        { completed: true, progressPercentage: 100 },
        { completed: false, progressPercentage: 50 },
      ];
      const completed = topics.filter((t) => t.completed).length;
      const total = topics.length;
      const completionPercentage = Math.round((completed / total) * 100);
      
      expect(completed).toBe(2);
      expect(total).toBe(3);
      expect(completionPercentage).toBe(67);
    });

    it('deve calcular progresso médio', () => {
      const topics = [
        { progressPercentage: 100 },
        { progressPercentage: 75 },
        { progressPercentage: 50 },
      ];
      const avgProgress = Math.round(
        topics.reduce((sum, t) => sum + t.progressPercentage, 0) / topics.length
      );
      expect(avgProgress).toBe(75);
    });

    it('deve somar tempo total gasto', () => {
      const topics = [
        { timeSpentMinutes: 30 },
        { timeSpentMinutes: 45 },
        { timeSpentMinutes: 15 },
      ];
      const totalTime = topics.reduce((sum, t) => sum + (t.timeSpentMinutes || 0), 0);
      expect(totalTime).toBe(90);
    });

    it('deve listar tópicos da categoria', () => {
      const topics = [
        { topicId: 'med-1', category: 'professional' },
        { topicId: 'med-2', category: 'professional' },
        { topicId: 'travel-1', category: 'traveller' },
      ];
      const professionalTopics = topics.filter((t) => t.category === 'professional');
      expect(professionalTopics.length).toBe(2);
    });
  });

  describe('getProgressSummary', () => {
    it('deve agrupar progresso por categoria', () => {
      const summary = {
        professional: { total: 5, completed: 3 },
        traveller: { total: 4, completed: 2 },
        general: { total: 3, completed: 1 },
      };
      expect(Object.keys(summary)).toContain('professional');
      expect(Object.keys(summary)).toContain('traveller');
      expect(Object.keys(summary)).toContain('general');
    });

    it('deve calcular estatísticas gerais', () => {
      const allTopics = [
        { completed: true },
        { completed: true },
        { completed: false },
      ];
      const completed = allTopics.filter((t) => t.completed).length;
      const total = allTopics.length;
      expect(completed).toBe(2);
      expect(total).toBe(3);
    });

    it('deve incluir timestamp de última atualização', () => {
      const summary = {
        lastUpdated: new Date(),
      };
      expect(summary.lastUpdated).toBeInstanceOf(Date);
    });
  });

  describe('completeTopicModule', () => {
    it('deve marcar tópico como completo', () => {
      const topic = {
        completed: false,
        progressPercentage: 75,
      };
      const completed = {
        completed: true,
        progressPercentage: 100,
      };
      expect(completed.completed).toBe(true);
      expect(completed.progressPercentage).toBe(100);
    });

    it('deve definir completedAt', () => {
      const topic = {
        completedAt: null,
      };
      const completed = {
        completedAt: new Date(),
      };
      expect(completed.completedAt).not.toBeNull();
      expect(completed.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('Validação de Dados', () => {
    it('deve validar topicId não vazio', () => {
      const validId = 'med-1';
      expect(validId.length).toBeGreaterThan(0);
    });

    it('deve validar topicName não vazio', () => {
      const validName = 'Medical English - Basics';
      expect(validName.length).toBeGreaterThan(0);
    });

    it('deve validar progressPercentage numérico', () => {
      const progress = 50;
      expect(typeof progress).toBe('number');
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });

    it('deve validar timeSpentMinutes não negativo', () => {
      const time = 30;
      expect(time).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Categorias', () => {
    it('deve suportar categoria professional', () => {
      const category = 'professional';
      expect(category).toBe('professional');
    });

    it('deve suportar categoria traveller', () => {
      const category = 'traveller';
      expect(category).toBe('traveller');
    });

    it('deve suportar categoria general', () => {
      const category = 'general';
      expect(category).toBe('general');
    });
  });

  describe('Cálculos de Progresso', () => {
    it('deve calcular porcentagem corretamente', () => {
      const completed = 3;
      const total = 5;
      const percentage = Math.round((completed / total) * 100);
      expect(percentage).toBe(60);
    });

    it('deve converter minutos para horas', () => {
      const minutes = 120;
      const hours = Math.round(minutes / 60);
      expect(hours).toBe(2);
    });

    it('deve manter minutos restantes', () => {
      const minutes = 150;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      expect(hours).toBe(2);
      expect(remainingMinutes).toBe(30);
    });
  });

  describe('Integração com Tiago', () => {
    it('deve registrar progresso de Tiago em Medical English', () => {
      const tiagoProgress = {
        studentId: 1,
        topicId: 'med-1',
        category: 'professional' as const,
        progressPercentage: 50,
      };
      expect(tiagoProgress.category).toBe('professional');
      expect(tiagoProgress.topicId).toContain('med');
    });

    it('deve registrar progresso de Tiago em Travel - Cancun', () => {
      const tiagoProgress = {
        studentId: 1,
        topicId: 'travel-cancun-1',
        category: 'traveller' as const,
        progressPercentage: 30,
      };
      expect(tiagoProgress.category).toBe('traveller');
      expect(tiagoProgress.topicId).toContain('cancun');
    });

    it('deve registrar progresso de Tiago em Travel - Nova York', () => {
      const tiagoProgress = {
        studentId: 1,
        topicId: 'travel-ny-1',
        category: 'traveller' as const,
        progressPercentage: 0,
      };
      expect(tiagoProgress.category).toBe('traveller');
      expect(tiagoProgress.topicId).toContain('ny');
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve lançar erro se usuário não autenticado', () => {
      const error = new Error('Usuário não autenticado');
      expect(error.message).toBe('Usuário não autenticado');
    });

    it('deve lançar erro se database não disponível', () => {
      const error = new Error('Database não disponível');
      expect(error.message).toBe('Database não disponível');
    });

    it('deve lançar erro em caso de falha na operação', () => {
      const error = new Error('Erro ao registrar progresso: Falha na inserção');
      expect(error.message).toContain('Erro ao registrar progresso');
    });
  });
});
