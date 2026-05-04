import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import {
  createPersonalizedLink,
  validatePersonalizedLink,
  deactivatePersonalizedLink,
  generateLinkHash,
  calculateExpirationDate,
} from '../personalized-access';

describe('Personalized Links System', () => {
  describe('generateLinkHash', () => {
    it('deve gerar um hash único', () => {
      const hash1 = generateLinkHash();
      const hash2 = generateLinkHash();
      
      expect(hash1).toBeDefined();
      expect(hash2).toBeDefined();
      expect(hash1).not.toBe(hash2);
      expect(hash1.length).toBe(64); // 32 bytes em hex = 64 caracteres
    });
  });

  describe('calculateExpirationDate', () => {
    it('deve calcular data de expiração com 7 meses', () => {
      const now = new Date();
      const expirationDate = calculateExpirationDate();
      
      expect(expirationDate).toBeDefined();
      expect(expirationDate.getTime()).toBeGreaterThan(now.getTime());
      
      // Verificar se é aproximadamente 7 meses
      const monthsDiff = (expirationDate.getFullYear() - now.getFullYear()) * 12 + 
                        (expirationDate.getMonth() - now.getMonth());
      expect(monthsDiff).toBe(7);
    });
  });

  describe('createPersonalizedLink', () => {
    it('deve criar um link personalizado para um aluno', async () => {
      const studentId = 1;
      const link = await createPersonalizedLink(studentId);
      
      expect(link).toBeDefined();
      expect(link.linkHash).toBeDefined();
      expect(link.expiresAt).toBeDefined();
      expect(link.accessUrl).toContain('/access/');
      expect(link.accessUrl).toContain(link.linkHash);
    });
  });

  describe('validatePersonalizedLink', () => {
    it('deve validar um link válido', async () => {
      const studentId = 1;
      const link = await createPersonalizedLink(studentId);
      const result = await validatePersonalizedLink(link.linkHash);
      
      expect(result).toBeDefined();
      expect(result.isValid).toBe(true);
      expect(result.studentId).toBe(studentId);
      expect(result.studentName).toBeDefined();
    });

    it('deve retornar inválido para um link inexistente', async () => {
      const result = await validatePersonalizedLink('invalid-hash-12345');
      
      expect(result).toBeDefined();
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('não encontrado');
    });
  });

  describe('deactivatePersonalizedLink', () => {
    it('deve desativar um link', async () => {
      const studentId = 1;
      const link = await createPersonalizedLink(studentId);
      
      // Validar antes de desativar
      const beforeDeactivate = await validatePersonalizedLink(link.linkHash);
      expect(beforeDeactivate.isValid).toBe(true);
      
      // Desativar
      await deactivatePersonalizedLink(link.linkHash);
      
      // Validar depois de desativar
      const afterDeactivate = await validatePersonalizedLink(link.linkHash);
      expect(afterDeactivate.isValid).toBe(false);
      expect(afterDeactivate.message).toContain('desativado');
    });
  });
});
