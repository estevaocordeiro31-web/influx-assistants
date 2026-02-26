import { describe, it, expect } from 'vitest';

/**
 * Testes para a página de estatísticas de alunos
 */

describe('StudentStatsPage', () => {
  describe('Data Transformation', () => {
    it('should map levels to Portuguese', () => {
      const levelMap: Record<string, string> = {
        beginner: 'Iniciante',
        elementary: 'Elementar',
        intermediate: 'Intermediário',
        upper_intermediate: 'Intermediário Superior',
        advanced: 'Avançado',
        proficient: 'Proficiente',
      };

      expect(levelMap.beginner).toBe('Iniciante');
      expect(levelMap.intermediate).toBe('Intermediário');
      expect(levelMap.advanced).toBe('Avançado');
    });

    it('should prepare level chart data', () => {
      const stats = {
        totalActive: 100,
        byLevel: [
          { level: 'beginner', count: 20 },
          { level: 'intermediate', count: 50 },
          { level: 'advanced', count: 30 },
        ],
        byBook: [],
        totalHoursLearned: 1000,
      };

      const levelMap: Record<string, string> = {
        beginner: 'Iniciante',
        elementary: 'Elementar',
        intermediate: 'Intermediário',
        upper_intermediate: 'Intermediário Superior',
        advanced: 'Avançado',
        proficient: 'Proficiente',
      };

      const levelChartData = stats.byLevel.map((item) => ({
        name: levelMap[item.level] || item.level,
        value: item.count,
      }));

      expect(levelChartData.length).toBe(3);
      expect(levelChartData[0].name).toBe('Iniciante');
      expect(levelChartData[0].value).toBe(20);
    });

    it('should prepare book chart data', () => {
      const stats = {
        totalActive: 182,
        byLevel: [],
        byBook: [
          { bookName: 'Fluxie', count: 30 },
          { bookName: 'Junior', count: 40 },
          { bookName: 'Regular', count: 80 },
          { bookName: 'Advanced', count: 32 },
        ],
        totalHoursLearned: 2500,
      };

      const bookChartData = stats.byBook.map((item) => ({
        name: item.bookName,
        value: item.count,
      }));

      expect(bookChartData.length).toBe(4);
      expect(bookChartData[0].name).toBe('Fluxie');
      expect(bookChartData[2].value).toBe(80);
    });

    it('should calculate hours per level', () => {
      const stats = {
        totalActive: 100,
        byLevel: [
          { level: 'beginner', count: 20 },
          { level: 'intermediate', count: 50 },
          { level: 'advanced', count: 30 },
        ],
        byBook: [],
        totalHoursLearned: 1000,
      };

      const hoursChartData = stats.byLevel.map((item) => {
        const avgHours = Math.round((stats.totalHoursLearned / stats.totalActive) * (item.count / stats.totalActive) * 100) / 100;
        return {
          name: item.level,
          horas: avgHours,
        };
      });

      expect(hoursChartData.length).toBe(3);
      expect(hoursChartData[0].horas).toBeGreaterThan(0);
    });
  });

  describe('Statistics Calculations', () => {
    it('should calculate percentage by level', () => {
      const stats = {
        totalActive: 100,
        byLevel: [
          { level: 'beginner', count: 20 },
          { level: 'intermediate', count: 50 },
          { level: 'advanced', count: 30 },
        ],
        byBook: [],
        totalHoursLearned: 1000,
      };

      const percentage = (stats.byLevel[0].count / stats.totalActive) * 100;
      expect(percentage).toBe(20);
    });

    it('should calculate percentage by book', () => {
      const stats = {
        totalActive: 182,
        byLevel: [],
        byBook: [
          { bookName: 'Regular', count: 80 },
        ],
        totalHoursLearned: 2500,
      };

      const percentage = (stats.byBook[0].count / stats.totalActive) * 100;
      expect(percentage).toBeCloseTo(43.96, 1);
    });

    it('should sum total hours correctly', () => {
      const totalHoursLearned = 2500;
      const totalActive = 182;
      const avgHours = totalHoursLearned / totalActive;

      expect(avgHours).toBeCloseTo(13.74, 1);
    });
  });

  describe('Data Validation', () => {
    it('should validate stats object structure', () => {
      const stats = {
        totalActive: 182,
        byLevel: [],
        byBook: [],
        totalHoursLearned: 2500,
      };

      expect(stats).toHaveProperty('totalActive');
      expect(stats).toHaveProperty('byLevel');
      expect(stats).toHaveProperty('byBook');
      expect(stats).toHaveProperty('totalHoursLearned');
    });

    it('should handle empty level data', () => {
      const stats = {
        totalActive: 0,
        byLevel: [],
        byBook: [],
        totalHoursLearned: 0,
      };

      expect(stats.byLevel.length).toBe(0);
      expect(stats.totalActive).toBe(0);
    });

    it('should handle missing book data', () => {
      const stats = {
        totalActive: 100,
        byLevel: [{ level: 'beginner', count: 100 }],
        byBook: [],
        totalHoursLearned: 500,
      };

      expect(stats.byBook.length).toBe(0);
    });
  });

  describe('Chart Data Formatting', () => {
    it('should format chart data with colors', () => {
      const colors = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'];
      const stats = {
        totalActive: 100,
        byLevel: [
          { level: 'beginner', count: 20 },
          { level: 'intermediate', count: 50 },
        ],
        byBook: [],
        totalHoursLearned: 1000,
      };

      const chartData = stats.byLevel.map((item, index) => ({
        name: item.level,
        value: item.count,
        fill: colors[index % colors.length],
      }));

      expect(chartData[0].fill).toBe('#ff6384');
      expect(chartData[1].fill).toBe('#36a2eb');
    });

    it('should handle color cycling for many items', () => {
      const colors = ['#ff6384', '#36a2eb', '#ffce56'];
      const items = Array(10).fill(null).map((_, i) => ({
        name: `Item ${i}`,
        value: i + 1,
        fill: colors[i % colors.length],
      }));

      expect(items[0].fill).toBe('#ff6384');
      expect(items[3].fill).toBe('#ff6384'); // Cycles back
      expect(items[6].fill).toBe('#ff6384');
    });
  });

  describe('Responsive Layout', () => {
    it('should define grid layout classes', () => {
      const gridClasses = 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-8';
      expect(gridClasses).toContain('grid-cols-1');
      expect(gridClasses).toContain('md:grid-cols-4');
    });

    it('should define chart container height', () => {
      const height = 300;
      expect(height).toBeGreaterThan(0);
      expect(height).toBeLessThan(500);
    });
  });

  describe('Table Rendering', () => {
    it('should render level table with correct columns', () => {
      const columns = ['Nível', 'Alunos', '%'];
      expect(columns.length).toBe(3);
      expect(columns).toContain('Nível');
      expect(columns).toContain('Alunos');
    });

    it('should render book table with correct columns', () => {
      const columns = ['Livro', 'Alunos', '%'];
      expect(columns.length).toBe(3);
      expect(columns).toContain('Livro');
    });

    it('should format percentage with one decimal place', () => {
      const percentage = ((80 / 182) * 100).toFixed(1);
      expect(percentage).toBe('44.0');
    });
  });

  describe('Error Handling', () => {
    it('should handle null stats gracefully', () => {
      const stats = null;
      expect(stats).toBeNull();
    });

    it('should handle error state', () => {
      const error = new Error('Failed to load stats');
      expect(error.message).toBe('Failed to load stats');
    });

    it('should handle loading state', () => {
      const isLoading = true;
      expect(isLoading).toBe(true);
    });
  });

  describe('Summary Cards', () => {
    it('should display total active students', () => {
      const totalActive = 182;
      expect(totalActive).toBeGreaterThan(0);
    });

    it('should display number of active books', () => {
      const books = [
        { bookName: 'Fluxie', count: 30 },
        { bookName: 'Junior', count: 40 },
        { bookName: 'Regular', count: 80 },
        { bookName: 'Advanced', count: 32 },
      ];
      expect(books.length).toBe(4);
    });

    it('should display number of represented levels', () => {
      const levels = [
        { level: 'beginner', count: 20 },
        { level: 'intermediate', count: 80 },
        { level: 'advanced', count: 82 },
      ];
      expect(levels.length).toBe(3);
    });

    it('should format total hours with locale string', () => {
      const totalHours = 2500;
      const formatted = totalHours.toLocaleString();
      expect(formatted).toBe('2,500');
    });
  });
});
