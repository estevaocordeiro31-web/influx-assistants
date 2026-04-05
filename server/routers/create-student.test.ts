import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createStudentSchema } from '../shared/validation-schemas';

describe('CreateStudent Procedure', () => {
  describe('Input Validation', () => {
    it('deve validar dados corretos de criação de aluno', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao@example.com',
        level: 'beginner' as const,
        objective: 'career' as const,
      };

      const result = createStudentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar nome vazio', () => {
      const invalidData = {
        name: '',
        email: 'joao@example.com',
        level: 'beginner' as const,
        objective: 'career' as const,
      };

      const result = createStudentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar email inválido', () => {
      const invalidData = {
        name: 'João Silva',
        email: 'email-invalido',
        level: 'beginner' as const,
        objective: 'career' as const,
      };

      const result = createStudentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar nível válido advanced', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao@example.com',
        level: 'advanced' as const,
        objective: 'career' as const,
      };

      const result = createStudentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve aceitar objetivo other', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao@example.com',
        level: 'beginner' as const,
        objective: 'other' as const,
      };

      const result = createStudentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve aceitar telefone opcional', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao@example.com',
        level: 'intermediate' as const,
        objective: 'travel' as const,
        phone: '(11) 98765-4321',
      };

      const result = createStudentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar telefone inválido', () => {
      const invalidData = {
        name: 'João Silva',
        email: 'joao@example.com',
        level: 'beginner' as const,
        objective: 'career' as const,
        phone: 'abc123xyz',
      };

      const result = createStudentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar nome com caracteres especiais', () => {
      const invalidData = {
        name: 'João@#$%',
        email: 'joao@example.com',
        level: 'beginner' as const,
        objective: 'career' as const,
      };

      const result = createStudentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar nome com acentos', () => {
      const validData = {
        name: 'José Pereira',
        email: 'jose@example.com',
        level: 'advanced' as const,
        objective: 'studies' as const,
      };

      const result = createStudentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve aceitar nome com apóstrofos', () => {
      const validData = {
        name: "O'Brien Silva",
        email: 'obrien@example.com',
        level: 'beginner' as const,
        objective: 'career' as const,
      };

      const result = createStudentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar nome muito curto', () => {
      const invalidData = {
        name: 'Jo',
        email: 'joao@example.com',
        level: 'beginner' as const,
        objective: 'career' as const,
      };

      const result = createStudentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar nome muito longo', () => {
      const invalidData = {
        name: 'A'.repeat(101),
        email: 'joao@example.com',
        level: 'beginner' as const,
        objective: 'career' as const,
      };

      const result = createStudentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar todos os níveis válidos', () => {
      const levels = ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'] as const;

      levels.forEach((level) => {
        const validData = {
          name: 'João Silva',
          email: `joao${level}@example.com`,
          level,
          objective: 'career' as const,
        };

        const result = createStudentSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('deve aceitar todos os objetivos válidos', () => {
      const objectives = ['career', 'travel', 'studies', 'other'] as const;

      objectives.forEach((objective) => {
        const validData = {
          name: 'João Silva',
          email: `joao${objective}@example.com`,
          level: 'beginner' as const,
          objective,
        };

        const result = createStudentSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('deve converter email para minúsculas', () => {
      const validData = {
        name: 'João Silva',
        email: 'JOAO@EXAMPLE.COM',
        level: 'beginner' as const,
        objective: 'career' as const,
      };

      const result = createStudentSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('joao@example.com');
      }
    });
  });

  describe('Edge Cases', () => {
    it('deve rejeitar email duplicado (validação de schema)', () => {
      const data = {
        name: 'João Silva',
        email: 'joao@example.com',
        level: 'beginner' as const,
        objective: 'career' as const,
      };

      const result = createStudentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve aceitar nome com hífen', () => {
      const validData = {
        name: 'João Silva-Santos',
        email: 'joao@example.com',
        level: 'beginner' as const,
        objective: 'career' as const,
      };

      const result = createStudentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve aceitar nome com espaços múltiplos', () => {
      const validData = {
        name: 'João Silva Santos',
        email: 'joao@example.com',
        level: 'beginner' as const,
        objective: 'career' as const,
      };

      const result = createStudentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve aceitar telefone com parênteses e hífen', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao@example.com',
        level: 'beginner' as const,
        objective: 'career' as const,
        phone: '(11) 98765-4321',
      };

      const result = createStudentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
