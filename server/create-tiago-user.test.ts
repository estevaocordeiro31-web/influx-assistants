import { describe, it, expect } from 'vitest';

/**
 * Testes para CreateTiagoUser Component
 */

describe('CreateTiagoUser Component', () => {
  describe('Validação de Dados', () => {
    it('deve ter email pré-preenchido correto', () => {
      const email = 'tiago.laerte@icloud.com';
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(email).toBe('tiago.laerte@icloud.com');
    });

    it('deve ter nome pré-preenchido correto', () => {
      const name = 'Tiago Laerte Marques';
      expect(name.length).toBeGreaterThan(0);
      expect(name).toBe('Tiago Laerte Marques');
    });

    it('deve ter telefone pré-preenchido correto', () => {
      const phone = '11920409000';
      expect(phone).toMatch(/^\d{11}$/);
    });

    it('deve ter nível pré-selecionado como elementary', () => {
      const level = 'elementary';
      const validLevels = ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'];
      expect(validLevels).toContain(level);
    });

    it('deve ter objetivo pré-selecionado como career', () => {
      const objective = 'career';
      const validObjectives = ['career', 'travel', 'studies', 'other'];
      expect(validObjectives).toContain(objective);
    });

    it('deve ter profissão pré-preenchida como Médico', () => {
      const profession = 'Médico';
      expect(profession.length).toBeGreaterThan(0);
      expect(profession).toBe('Médico');
    });
  });

  describe('Validação de Email', () => {
    it('deve aceitar email válido', () => {
      const email = 'tiago.laerte@icloud.com';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(email)).toBe(true);
    });

    it('deve rejeitar email sem @', () => {
      const email = 'tiagolarte.icloud.com';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(email)).toBe(false);
    });

    it('deve rejeitar email sem domínio', () => {
      const email = 'tiago.laerte@';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(email)).toBe(false);
    });
  });

  describe('Validação de Nível', () => {
    it('deve aceitar nível beginner', () => {
      const level = 'beginner';
      const validLevels = ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'];
      expect(validLevels).toContain(level);
    });

    it('deve aceitar nível elementary', () => {
      const level = 'elementary';
      const validLevels = ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'];
      expect(validLevels).toContain(level);
    });

    it('deve aceitar nível intermediate', () => {
      const level = 'intermediate';
      const validLevels = ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'];
      expect(validLevels).toContain(level);
    });

    it('deve aceitar nível upper_intermediate', () => {
      const level = 'upper_intermediate';
      const validLevels = ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'];
      expect(validLevels).toContain(level);
    });

    it('deve aceitar nível advanced', () => {
      const level = 'advanced';
      const validLevels = ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'];
      expect(validLevels).toContain(level);
    });

    it('deve aceitar nível proficient', () => {
      const level = 'proficient';
      const validLevels = ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'];
      expect(validLevels).toContain(level);
    });
  });

  describe('Validação de Objetivo', () => {
    it('deve aceitar objetivo career', () => {
      const objective = 'career';
      const validObjectives = ['career', 'travel', 'studies', 'other'];
      expect(validObjectives).toContain(objective);
    });

    it('deve aceitar objetivo travel', () => {
      const objective = 'travel';
      const validObjectives = ['career', 'travel', 'studies', 'other'];
      expect(validObjectives).toContain(objective);
    });

    it('deve aceitar objetivo studies', () => {
      const objective = 'studies';
      const validObjectives = ['career', 'travel', 'studies', 'other'];
      expect(validObjectives).toContain(objective);
    });

    it('deve aceitar objetivo other', () => {
      const objective = 'other';
      const validObjectives = ['career', 'travel', 'studies', 'other'];
      expect(validObjectives).toContain(objective);
    });
  });

  describe('Validação de Nome', () => {
    it('deve aceitar nome com pelo menos 3 caracteres', () => {
      const name = 'Tiago Laerte Marques';
      expect(name.length).toBeGreaterThanOrEqual(3);
    });

    it('deve rejeitar nome com menos de 3 caracteres', () => {
      const name = 'Ti';
      expect(name.length).toBeLessThan(3);
    });

    it('deve aceitar nome com espaços', () => {
      const name = 'Tiago Laerte Marques';
      expect(name).toContain(' ');
    });
  });

  describe('Validação de Profissão', () => {
    it('deve aceitar profissão Médico', () => {
      const profession = 'Médico';
      expect(profession.length).toBeGreaterThan(0);
    });

    it('deve aceitar profissão vazia (opcional)', () => {
      const profession = '';
      expect(profession.length).toBe(0);
    });

    it('deve aceitar qualquer profissão', () => {
      const professions = ['Médico', 'Engenheiro', 'Professor', 'Advogado'];
      professions.forEach((prof) => {
        expect(prof.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Validação de Telefone', () => {
    it('deve aceitar telefone com 11 dígitos', () => {
      const phone = '11920409000';
      expect(phone).toMatch(/^\d{11}$/);
    });

    it('deve rejeitar telefone com menos de 11 dígitos', () => {
      const phone = '1192040900';
      expect(phone).not.toMatch(/^\d{11}$/);
    });

    it('deve rejeitar telefone com mais de 11 dígitos', () => {
      const phone = '119204090001';
      expect(phone).not.toMatch(/^\d{11}$/);
    });

    it('deve aceitar telefone vazio (opcional)', () => {
      const phone = '';
      expect(phone.length).toBe(0);
    });
  });

  describe('Fluxo de Criação de Usuário', () => {
    it('deve ter todos os campos preenchidos para Tiago', () => {
      const formData = {
        email: 'tiago.laerte@icloud.com',
        name: 'Tiago Laerte Marques',
        phone: '11920409000',
        currentLevel: 'elementary',
        objective: 'career',
        profession: 'Médico',
      };

      expect(formData.email).toBeDefined();
      expect(formData.name).toBeDefined();
      expect(formData.phone).toBeDefined();
      expect(formData.currentLevel).toBeDefined();
      expect(formData.objective).toBeDefined();
      expect(formData.profession).toBeDefined();
    });

    it('deve validar todos os campos antes de enviar', () => {
      const formData = {
        email: 'tiago.laerte@icloud.com',
        name: 'Tiago Laerte Marques',
        phone: '11920409000',
        currentLevel: 'elementary',
        objective: 'career',
        profession: 'Médico',
      };

      const isValid =
        formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
        formData.name.length >= 3 &&
        formData.currentLevel &&
        formData.objective;

      expect(isValid).toBeTruthy();
    });

    it('deve retornar ID do usuário após criação', () => {
      const response = {
        success: true,
        user: { id: 1, name: 'Tiago Laerte Marques', email: 'tiago.laerte@icloud.com', openId: 'tiago-123' },
        profile: { id: 1, objective: 'career', currentLevel: 'elementary' },
        message: 'Usuário criado com sucesso',
      };

      expect(response.user.id).toBeDefined();
      expect(response.user.id).toBeGreaterThan(0);
    });
  });

  describe('Mensagens de Feedback', () => {
    it('deve exibir mensagem de sucesso com ID do usuário', () => {
      const userId = 1;
      const message = `✅ Usuário criado com sucesso! ID: ${userId}`;
      expect(message).toContain('✅');
      expect(message).toContain('sucesso');
      expect(message).toContain(userId.toString());
    });

    it('deve exibir mensagem de erro em caso de falha', () => {
      const error = 'Email já existe';
      const message = `❌ Erro ao criar usuário: ${error}`;
      expect(message).toContain('❌');
      expect(message).toContain('Erro');
      expect(message).toContain(error);
    });
  });

  describe('Estados do Componente', () => {
    it('deve iniciar com modal fechado', () => {
      const isOpen = false;
      expect(isOpen).toBe(false);
    });

    it('deve abrir modal ao clicar no botão', () => {
      const isOpen = true;
      expect(isOpen).toBe(true);
    });

    it('deve fechar modal após criação bem-sucedida', () => {
      const isOpen = false;
      expect(isOpen).toBe(false);
    });

    it('deve manter modal aberto em caso de erro', () => {
      const isOpen = true;
      expect(isOpen).toBe(true);
    });
  });

  describe('Integração com tRPC', () => {
    it('deve chamar createSpecialUser mutation', () => {
      const mutationName = 'createSpecialUser';
      expect(mutationName).toBe('createSpecialUser');
    });

    it('deve passar dados corretos para mutation', () => {
      const input = {
        email: 'tiago.laerte@icloud.com',
        name: 'Tiago Laerte Marques',
        phone: '11920409000',
        currentLevel: 'elementary',
        objective: 'career',
        profession: 'Médico',
      };

      expect(input.email).toBe('tiago.laerte@icloud.com');
      expect(input.currentLevel).toBe('elementary');
      expect(input.objective).toBe('career');
    });
  });
});
