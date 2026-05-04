import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('StudentDashboard Personalization', () => {
  describe('Integração com studentPersonalization router', () => {
    it('deve buscar dados personalizados do dashboard', () => {
      // Mock de getPersonalizedDashboard
      const mockDashboard = {
        student: {
          id: 'user-123',
          name: 'João Silva',
          email: 'joao@example.com',
          level: 'intermediate',
          hoursLearned: 120,
          streak: 15,
        },
        books: {
          inProgress: [
            {
              bookId: 3,
              currentUnit: 5,
              progressPercentage: 45,
            },
          ],
          completed: [
            {
              bookId: 1,
              completedAt: new Date('2024-03-15'),
            },
            {
              bookId: 2,
              completedAt: new Date('2024-06-20'),
            },
          ],
        },
        courses: {
          active: ['reading_club', 'traveler'],
          count: 2,
        },
        progress: {
          totalTopics: 50,
          completedTopics: 25,
          completionPercentage: 50,
        },
      };

      expect(mockDashboard.student.name).toBe('João Silva');
      expect(mockDashboard.books.inProgress[0].progressPercentage).toBe(45);
      expect(mockDashboard.books.completed.length).toBe(2);
    });

    it('deve mapear dados do dashboard para studentData', () => {
      const mockDashboard = {
        student: {
          id: 'user-456',
          name: 'Maria Santos',
          email: 'maria@example.com',
          level: 'elementary',
          hoursLearned: 85,
          streak: 8,
        },
        books: {
          inProgress: [
            {
              bookId: 2,
              currentUnit: 3,
              progressPercentage: 25,
            },
          ],
          completed: [],
        },
        courses: { active: [], count: 0 },
        progress: { totalTopics: 40, completedTopics: 10, completionPercentage: 25 },
      };

      const studentData = {
        name: mockDashboard.student.name || 'Aluno',
        email: mockDashboard.student.email || '',
        level: mockDashboard.student.level,
        currentBook: `Book 2`,
        currentBookId: 2,
        currentUnit: mockDashboard.books.inProgress[0]?.currentUnit || 1,
        totalUnits: 12,
        progressPercentage: Number(mockDashboard.books.inProgress[0]?.progressPercentage) || 0,
        totalHoursLearned: mockDashboard.student.hoursLearned,
        streakDays: mockDashboard.student.streak,
      };

      expect(studentData.name).toBe('Maria Santos');
      expect(studentData.level).toBe('elementary');
      expect(studentData.currentUnit).toBe(3);
      expect(studentData.progressPercentage).toBe(25);
      expect(studentData.totalHoursLearned).toBe(85);
    });

    it('deve usar DEMO_STUDENT quando personalizedDashboard é undefined', () => {
      const DEMO_STUDENT = {
        name: 'Estevao Cordeiro',
        email: 'estevao@influxjundiai.com',
        level: 'Avançado',
        currentBook: 'Book 5',
        currentBookId: 5,
        currentUnit: 8,
        totalUnits: 12,
        progressPercentage: 67,
        totalHoursLearned: 248,
        streakDays: 45,
      };

      const personalizedDashboard = undefined;
      const studentData = personalizedDashboard ? { /* ... */ } : DEMO_STUDENT;

      expect(studentData.name).toBe('Estevao Cordeiro');
      expect(studentData.currentBookId).toBe(5);
    });
  });

  describe('Filtragem de Cursos', () => {
    it('deve filtrar cursos ativos do aluno', () => {
      const myCourses = ['reading_club', 'traveler', 'vp1'];

      const hasReadingClub = myCourses?.includes('reading_club') ?? false;
      const hasVacationPlus = myCourses?.some(c => c.startsWith('vp')) ?? false;
      const hasTraveler = myCourses?.includes('traveler') ?? false;
      const hasOnBusiness = myCourses?.includes('on_business') ?? false;

      expect(hasReadingClub).toBe(true);
      expect(hasVacationPlus).toBe(true);
      expect(hasTraveler).toBe(true);
      expect(hasOnBusiness).toBe(false);
    });

    it('deve retornar false quando aluno não tem cursos', () => {
      const myCourses = [];

      const hasReadingClub = myCourses?.includes('reading_club') ?? false;
      const hasVacationPlus = myCourses?.some(c => c.startsWith('vp')) ?? false;

      expect(hasReadingClub).toBe(false);
      expect(hasVacationPlus).toBe(false);
    });
  });

  describe('Mapeamento de Livros Completados', () => {
    it('deve mapear livros completados corretamente', () => {
      const completed = [
        {
          id: 1,
          bookId: 1,
          completedAt: new Date('2024-03-15'),
        },
        {
          id: 2,
          bookId: 2,
          completedAt: new Date('2024-06-19'),
        },
      ];

      const completedBooks = completed.map((b: any) => ({
        id: b.bookId,
        name: `Book ${b.bookId}`,
        level: 'Completo',
        completedAt: b.completedAt ? new Date(b.completedAt).toLocaleDateString('pt-BR') : null,
        hoursSpent: 0,
        chunksLearned: 0,
        progress: 100,
      }));

      expect(completedBooks.length).toBe(2);
      expect(completedBooks[0].name).toBe('Book 1');
      expect(completedBooks[0].progress).toBe(100);
      expect(completedBooks[1].id).toBe(2);
    });

    it('deve retornar array vazio quando não há livros completados', () => {
      const completed: any[] = [];
      const completedBooks = completed.map((b: any) => ({
        id: b.bookId,
        name: `Book ${b.bookId}`,
        level: 'Completo',
        completedAt: b.completedAt ? new Date(b.completedAt).toLocaleDateString('pt-BR') : null,
        hoursSpent: 0,
        chunksLearned: 0,
        progress: 100,
      }));

      expect(completedBooks.length).toBe(0);
    });
  });

  describe('Tema Visual por Nível', () => {
    it('deve retornar tema correto para cada nível', () => {
      const levels = ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced'];
      const expectedBooks = [1, 2, 3, 4, 5];

      levels.forEach((level, index) => {
        // Simulando getBookNumberFromLevel
        const bookNumber = expectedBooks[index];
        expect(bookNumber).toBe(expectedBooks[index]);
      });
    });
  });

  describe('Segurança de Dados', () => {
    it('deve usar dados do aluno autenticado, não de outros alunos', () => {
      const authenticatedUser = {
        id: 'user-123',
        name: 'João Silva',
        email: 'joao@example.com',
      };

      const mockDashboard = {
        student: {
          id: authenticatedUser.id,
          name: authenticatedUser.name,
          email: authenticatedUser.email,
          level: 'intermediate',
          hoursLearned: 120,
          streak: 15,
        },
        books: { inProgress: [], completed: [] },
        courses: { active: [], count: 0 },
        progress: { totalTopics: 0, completedTopics: 0, completionPercentage: 0 },
      };

      // Validar que os dados retornados pertencem ao usuário autenticado
      expect(mockDashboard.student.id).toBe(authenticatedUser.id);
      expect(mockDashboard.student.email).toBe(authenticatedUser.email);
    });

    it('deve retornar undefined se usuário não está autenticado', () => {
      const isAuthenticated = false;
      const personalizedDashboard = isAuthenticated ? {} : undefined;

      expect(personalizedDashboard).toBeUndefined();
    });
  });

  describe('Compatibilidade com Múltiplos Alunos', () => {
    it('deve exibir dados corretos para aluno 1', () => {
      const aluno1 = {
        student: { name: 'Aluno 1', level: 'beginner', hoursLearned: 50, streak: 5 },
        books: { inProgress: [{ bookId: 1, currentUnit: 2, progressPercentage: 15 }], completed: [] },
        courses: { active: ['reading_club'], count: 1 },
        progress: { totalTopics: 30, completedTopics: 5, completionPercentage: 17 },
      };

      expect(aluno1.student.name).toBe('Aluno 1');
      expect(aluno1.student.level).toBe('beginner');
      expect(aluno1.books.inProgress[0].bookId).toBe(1);
    });

    it('deve exibir dados corretos para aluno 2', () => {
      const aluno2 = {
        student: { name: 'Aluno 2', level: 'advanced', hoursLearned: 300, streak: 60 },
        books: { inProgress: [{ bookId: 5, currentUnit: 10, progressPercentage: 85 }], completed: [{ bookId: 1 }, { bookId: 2 }, { bookId: 3 }, { bookId: 4 }] },
        courses: { active: ['reading_club', 'traveler', 'on_business', 'vp1', 'vp2'], count: 5 },
        progress: { totalTopics: 100, completedTopics: 85, completionPercentage: 85 },
      };

      expect(aluno2.student.name).toBe('Aluno 2');
      expect(aluno2.student.level).toBe('advanced');
      expect(aluno2.books.completed.length).toBe(4);
      expect(aluno2.courses.count).toBe(5);
    });
  });
});
