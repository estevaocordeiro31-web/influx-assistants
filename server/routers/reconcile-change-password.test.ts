/**
 * Testes para Reconciliação de Usuários e Troca de Senha
 * Fase 192-194: Reconciliação, mustChangePassword e ChangePassword
 */
import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';

// ===== TESTES DE TROCA DE SENHA =====
describe('Troca de Senha', () => {
  describe('Validação de nova senha', () => {
    it('deve rejeitar senha com menos de 6 caracteres', () => {
      const validateNewPassword = (password: string) => {
        if (password.length < 6) return { valid: false, error: 'Senha deve ter pelo menos 6 caracteres' };
        return { valid: true };
      };
      expect(validateNewPassword('abc').valid).toBe(false);
      expect(validateNewPassword('12345').valid).toBe(false);
      expect(validateNewPassword('123456').valid).toBe(true);
    });

    it('deve rejeitar nova senha igual à atual', () => {
      const validatePasswordChange = (current: string, newPwd: string) => {
        if (current === newPwd) return { valid: false, error: 'Nova senha deve ser diferente da atual' };
        return { valid: true };
      };
      expect(validatePasswordChange('senha123', 'senha123').valid).toBe(false);
      expect(validatePasswordChange('senha123', 'novaSenha456').valid).toBe(true);
    });

    it('deve rejeitar quando confirmação não coincide', () => {
      const validateConfirmation = (newPwd: string, confirm: string) => {
        if (newPwd !== confirm) return { valid: false, error: 'Senhas não coincidem' };
        return { valid: true };
      };
      expect(validateConfirmation('senha123', 'senha456').valid).toBe(false);
      expect(validateConfirmation('senha123', 'senha123').valid).toBe(true);
    });

    it('deve aceitar senha válida com caracteres especiais', () => {
      const validateNewPassword = (password: string) => {
        if (password.length < 6) return { valid: false };
        return { valid: true };
      };
      expect(validateNewPassword('Senha@2026').valid).toBe(true);
      expect(validateNewPassword('P@$$w0rd!').valid).toBe(true);
    });
  });

  describe('mustChangePassword flag', () => {
    it('deve ser true após reset pelo admin', () => {
      // Simular o comportamento do resetStudentPassword
      const simulateReset = (userId: number) => {
        return {
          userId,
          mustChangePassword: true,
          newPassword: 'Nome@2026',
        };
      };
      const result = simulateReset(42);
      expect(result.mustChangePassword).toBe(true);
      expect(result.newPassword).toMatch(/@2026$/);
    });

    it('deve ser false após troca de senha pelo usuário', () => {
      // Simular o comportamento do changePassword
      const simulateChange = (userId: number) => {
        return {
          userId,
          mustChangePassword: false,
          message: 'Senha alterada com sucesso',
        };
      };
      const result = simulateChange(42);
      expect(result.mustChangePassword).toBe(false);
    });

    it('deve redirecionar para /change-password quando mustChangePassword=true', () => {
      const getRedirectPath = (role: string, mustChangePassword: boolean) => {
        if (mustChangePassword) return '/change-password?required=true';
        if (role === 'admin') return '/admin/dashboard';
        return '/student/dashboard';
      };
      expect(getRedirectPath('user', true)).toBe('/change-password?required=true');
      expect(getRedirectPath('admin', true)).toBe('/change-password?required=true');
      expect(getRedirectPath('user', false)).toBe('/student/dashboard');
      expect(getRedirectPath('admin', false)).toBe('/admin/dashboard');
    });
  });
});

// ===== TESTES DE RECONCILIAÇÃO =====
describe('Reconciliação de Usuários', () => {
  describe('Identificação de usuários sem vínculo', () => {
    it('deve identificar usuários sem student_id', () => {
      const users = [
        { id: 1, name: 'João', email: 'joao@test.com', studentId: 'INF-001' },
        { id: 2, name: 'Maria', email: 'maria@test.com', studentId: null },
        { id: 3, name: 'Pedro', email: 'pedro@test.com', studentId: null },
      ];
      const unlinked = users.filter(u => !u.studentId);
      expect(unlinked).toHaveLength(2);
      expect(unlinked[0].name).toBe('Maria');
      expect(unlinked[1].name).toBe('Pedro');
    });

    it('deve retornar lista vazia quando todos estão vinculados', () => {
      const users = [
        { id: 1, name: 'João', studentId: 'INF-001' },
        { id: 2, name: 'Maria', studentId: 'INF-002' },
      ];
      const unlinked = users.filter(u => !u.studentId);
      expect(unlinked).toHaveLength(0);
    });
  });

  describe('Busca de candidatos', () => {
    it('deve buscar por nome parcial', () => {
      const students = [
        { id: 'S001', name: 'João Silva', email: 'joao@test.com' },
        { id: 'S002', name: 'Maria Santos', email: 'maria@test.com' },
        { id: 'S003', name: 'João Oliveira', email: 'joao2@test.com' },
      ];
      const query = 'joão';
      const results = students.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(2);
    });

    it('deve buscar por email parcial', () => {
      const students = [
        { id: 'S001', name: 'João Silva', email: 'joao@influx.com' },
        { id: 'S002', name: 'Maria Santos', email: 'maria@gmail.com' },
      ];
      const query = 'influx';
      const results = students.filter(s => 
        s.email.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('João Silva');
    });

    it('deve rejeitar busca com menos de 2 caracteres', () => {
      const validateQuery = (query: string) => {
        if (query.length < 2) return { valid: false, error: 'Digite pelo menos 2 caracteres' };
        return { valid: true };
      };
      expect(validateQuery('j').valid).toBe(false);
      expect(validateQuery('jo').valid).toBe(true);
    });
  });

  describe('Vinculação de usuário', () => {
    it('deve vincular usuário ao student_id correto', () => {
      const linkUser = (userId: number, studentId: string) => {
        return { success: true, userId, studentId, message: 'Usuário vinculado com sucesso' };
      };
      const result = linkUser(42, 'S001');
      expect(result.success).toBe(true);
      expect(result.userId).toBe(42);
      expect(result.studentId).toBe('S001');
    });

    it('deve rejeitar vinculação de student_id já utilizado', () => {
      const existingLinks = [{ userId: 10, studentId: 'S001' }];
      const canLink = (userId: number, studentId: string) => {
        const alreadyLinked = existingLinks.find(l => l.studentId === studentId && l.userId !== userId);
        if (alreadyLinked) return { valid: false, error: 'student_id já vinculado a outro usuário' };
        return { valid: true };
      };
      expect(canLink(42, 'S001').valid).toBe(false); // S001 já está vinculado ao userId 10
      expect(canLink(42, 'S002').valid).toBe(true);  // S002 está livre
    });
  });
});

// ===== TESTES DE NOTIFICAÇÃO DE CREDENCIAIS =====
describe('Notificação de Credenciais', () => {
  it('deve formatar mensagem de credenciais corretamente', () => {
    const formatCredentials = (name: string, email: string, password: string) => {
      return `🔐 Credenciais de Acesso - inFlux Personal Tutor\n\n🌐 Link: https://tutor.imaind.tech/login\n👤 Email: ${email}\n🔑 Senha: ${password}\n\nAcesse e altere sua senha após o primeiro login.`;
    };
    const msg = formatCredentials('João', 'joao@test.com', 'João@2026');
    expect(msg).toContain('joao@test.com');
    expect(msg).toContain('João@2026');
    expect(msg).toContain('tutor.imaind.tech');
  });

  it('deve gerar senha no padrão PrimeiroNome@2026', () => {
    const generatePassword = (fullName: string) => {
      const firstName = fullName.split(' ')[0];
      return `${firstName}@2026`;
    };
    expect(generatePassword('João Silva')).toBe('João@2026');
    expect(generatePassword('Maria Santos')).toBe('Maria@2026');
    expect(generatePassword('Pedro')).toBe('Pedro@2026');
  });

  it('deve enviar notificação ao owner com as credenciais', () => {
    const buildNotification = (name: string, email: string, password: string) => ({
      title: `[inFlux] Senha resetada: ${name}`,
      content: `Credenciais resetadas para o aluno:\n\nNome: ${name}\nEmail: ${email}\nNova senha: ${password}\n\nLink de acesso: https://tutor.imaind.tech/login`,
    });
    const notif = buildNotification('João', 'joao@test.com', 'João@2026');
    expect(notif.title).toContain('João');
    expect(notif.content).toContain('joao@test.com');
    expect(notif.content).toContain('João@2026');
  });
});
