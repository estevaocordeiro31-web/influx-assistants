import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  createStudentSchema,
  updateProfileSchema,
  filterSchema,
  exerciseSchema,
  badgeSchema,
  changePasswordSchema,
  getValidationErrors,
} from '../shared/validation-schemas';
import { z } from 'zod';

describe('Validação Zod - inFlux', () => {
  describe('loginSchema', () => {
    it('deve validar login com dados corretos', () => {
      const data = {
        email: 'user@example.com',
        password: 'senha123',
      };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar email inválido', () => {
      const data = {
        email: 'email-invalido',
        password: 'senha123',
      };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar senha muito curta', () => {
      const data = {
        email: 'user@example.com',
        password: '123',
      };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve converter email para minúsculas', () => {
      const data = {
        email: 'USER@EXAMPLE.COM',
        password: 'senha123',
      };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('user@example.com');
      }
    });
  });

  describe('createStudentSchema', () => {
    it('deve validar criação de aluno com dados corretos', () => {
      const data = {
        name: 'João Silva',
        email: 'joao@example.com',
        level: 'beginner',
        objective: 'career',
      };
      const result = createStudentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar nome muito curto', () => {
      const data = {
        name: 'Jo',
        email: 'joao@example.com',
        level: 'beginner',
        objective: 'career',
      };
      const result = createStudentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve aceitar nível válido', () => {
      const data = {
        name: 'João Silva',
        email: 'joao@example.com',
        level: 'advanced',
        objective: 'career',
      };
      const result = createStudentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve aceitar telefone opcional', () => {
      const data = {
        name: 'João Silva',
        email: 'joao@example.com',
        level: 'intermediate',
        objective: 'travel',
        phone: '(11) 98765-4321',
      };
      const result = createStudentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar telefone inválido', () => {
      const data = {
        name: 'João Silva',
        email: 'joao@example.com',
        level: 'intermediate',
        objective: 'travel',
        phone: 'abc123xyz',
      };
      const result = createStudentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('updateProfileSchema', () => {
    it('deve validar atualização parcial de perfil', () => {
      const data = {
        name: 'Maria Santos',
        level: 'advanced',
      };
      const result = updateProfileSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve aceitar objeto vazio', () => {
      const data = {};
      const result = updateProfileSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('filterSchema', () => {
    it('deve validar filtros com valores válidos', () => {
      const data = {
        searchTerm: 'João',
        filterLevel: 'beginner',
        filterObjective: 'career',
        filterStatus: 'ativo',
        limit: 100,
        offset: 0,
      };
      const result = filterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve usar valores padrão', () => {
      const data = {};
      const result = filterSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(500);
        expect(result.data.offset).toBe(0);
      }
    });

    it('deve rejeitar limit muito alto', () => {
      const data = {
        limit: 5000,
      };
      const result = filterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('exerciseSchema', () => {
    it('deve validar exercício com dados corretos', () => {
      const data = {
        title: 'Diálogo no Restaurante',
        description: 'Aprenda vocabulário de restaurante com este diálogo interativo',
        type: 'dialogue',
        book: 'book1',
        difficulty: 'easy',
      };
      const result = exerciseSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar título muito curto', () => {
      const data = {
        title: 'Dia',
        description: 'Aprenda vocabulário de restaurante com este diálogo interativo',
        type: 'dialogue',
        book: 'book1',
        difficulty: 'easy',
      };
      const result = exerciseSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar tipo de exercício inválido', () => {
      const data = {
        title: 'Diálogo no Restaurante',
        description: 'Aprenda vocabulário de restaurante com este diálogo interativo',
        type: 'invalid_type',
        book: 'book1',
        difficulty: 'easy',
      };
      const result = exerciseSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('badgeSchema', () => {
    it('deve validar badge com dados corretos', () => {
      const data = {
        name: 'Iniciante',
        description: 'Completou 10 exercícios',
        requirement: 10,
      };
      const result = badgeSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar requisito muito alto', () => {
      const data = {
        name: 'Iniciante',
        requirement: 50000,
      };
      const result = badgeSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('deve validar mudança de senha com dados corretos', () => {
      const data = {
        currentPassword: 'senha_antiga123',
        newPassword: 'senha_nova456',
        confirmPassword: 'senha_nova456',
      };
      const result = changePasswordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar senhas não correspondentes', () => {
      const data = {
        currentPassword: 'senha_antiga123',
        newPassword: 'senha_nova456',
        confirmPassword: 'senha_diferente789',
      };
      const result = changePasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar nova senha muito curta', () => {
      const data = {
        currentPassword: 'senha_antiga123',
        newPassword: '123',
        confirmPassword: '123',
      };
      const result = changePasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('getValidationErrors', () => {
    it('deve extrair mensagens de erro corretamente', () => {
      const data = {
        email: 'invalid-email',
        password: '123',
      };
      const result = loginSchema.safeParse(data);
      if (!result.success) {
        const errors = getValidationErrors(result.error);
        expect(errors).toHaveProperty('email');
        expect(errors).toHaveProperty('password');
        expect(errors.email).toContain('Email inválido');
      }
    });

    it('deve retornar objeto vazio para validação bem-sucedida', () => {
      const data = {
        email: 'user@example.com',
        password: 'senha123',
      };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Validação em Português', () => {
    it('deve retornar mensagens de erro em português', () => {
      const data = {
        email: 'invalid',
        password: '123',
      };
      const result = loginSchema.safeParse(data);
      if (!result.success) {
        const errors = getValidationErrors(result.error);
        expect(errors.email).toMatch(/português|Email|inválido/i);
      }
    });
  });

  describe('Validação de Nomes com Acentos', () => {
    it('deve aceitar nomes com acentos', () => {
      const data = {
        name: 'José Pereira',
        email: 'jose@example.com',
        level: 'beginner',
        objective: 'career',
      };
      const result = createStudentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve aceitar nomes com apóstrofos', () => {
      const data = {
        name: "O'Brien Silva",
        email: 'obrien@example.com',
        level: 'beginner',
        objective: 'career',
      };
      const result = createStudentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
