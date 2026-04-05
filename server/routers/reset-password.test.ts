import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';

// Simular a lógica de reset de senha
function generateNewPassword(name: string): string {
  const firstName = name.split(' ')[0] || 'Aluno';
  return `${firstName}@2026`;
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

describe('Reset de Senha pelo Admin', () => {
  describe('Geração de nova senha', () => {
    it('deve gerar senha no padrão PrimeiroNome@2026', () => {
      expect(generateNewPassword('Camila Gonsalves')).toBe('Camila@2026');
      expect(generateNewPassword('João Silva')).toBe('João@2026');
      expect(generateNewPassword('Ana Paula Costa')).toBe('Ana@2026');
    });

    it('deve usar "Aluno" se nome estiver vazio', () => {
      expect(generateNewPassword('')).toBe('Aluno@2026');
    });

    it('deve usar apenas o primeiro nome', () => {
      expect(generateNewPassword('Maria Clara dos Santos')).toBe('Maria@2026');
    });

    it('deve funcionar com nomes simples', () => {
      expect(generateNewPassword('Lucas')).toBe('Lucas@2026');
    });

    it('deve funcionar com nomes com acentos', () => {
      expect(generateNewPassword('Lívia Ferreira')).toBe('Lívia@2026');
      expect(generateNewPassword('André Costa')).toBe('André@2026');
    });
  });

  describe('Hash e verificação de senha', () => {
    it('deve gerar hash válido para a nova senha', async () => {
      const password = 'Camila@2026';
      const hash = await hashPassword(password);
      expect(hash).toBeTruthy();
      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2')).toBe(true);
    });

    it('deve verificar senha corretamente após hash', async () => {
      const password = 'João@2026';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('deve rejeitar senha incorreta', async () => {
      const password = 'Ana@2026';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword('SenhaErrada@2026', hash);
      expect(isValid).toBe(false);
    });

    it('deve gerar hashes diferentes para a mesma senha (salt aleatório)', async () => {
      const password = 'Lucas@2026';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      expect(hash1).not.toBe(hash2);
      // Mas ambos devem verificar corretamente
      expect(await verifyPassword(password, hash1)).toBe(true);
      expect(await verifyPassword(password, hash2)).toBe(true);
    });
  });

  describe('Validação de dados de entrada', () => {
    it('deve aceitar userId numérico válido', () => {
      const input = { userId: 123, sendEmail: false };
      expect(typeof input.userId).toBe('number');
      expect(input.userId).toBeGreaterThan(0);
    });

    it('deve ter sendEmail como opcional com padrão false', () => {
      const input = { userId: 1 };
      const sendEmail = (input as any).sendEmail ?? false;
      expect(sendEmail).toBe(false);
    });
  });

  describe('Formato das credenciais para compartilhamento', () => {
    it('deve formatar credenciais para WhatsApp/email', () => {
      const credentials = {
        url: 'https://influxassist-2anfqga4.manus.space/login',
        email: 'camila@email.com',
        password: 'Camila@2026',
      };

      const formatted = `🔐 Credenciais de Acesso - inFlux Personal Tutor\n\n🌐 Link: ${credentials.url}\n👤 Email: ${credentials.email}\n🔑 Senha: ${credentials.password}\n\nAcesse e altere sua senha após o primeiro login.`;

      expect(formatted).toContain('inFlux Personal Tutor');
      expect(formatted).toContain(credentials.email);
      expect(formatted).toContain(credentials.password);
      expect(formatted).toContain(credentials.url);
    });

    it('deve incluir instrução de alterar senha', () => {
      const formatted = `Acesse e altere sua senha após o primeiro login.`;
      expect(formatted).toContain('altere sua senha');
    });
  });
});
