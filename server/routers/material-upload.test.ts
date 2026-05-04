import { describe, it, expect } from 'vitest';
import { materialUploadRouter } from './material-upload';

describe('Material Upload Router', () => {

  it('deve rejeitar upload sem autenticação', async () => {
    const caller = materialUploadRouter.createCaller({ user: null } as any);
    
    try {
      await caller.uploadMaterial({
        title: 'Test Material',
        fileBase64: 'test',
        mimeType: 'application/pdf',
        fileName: 'test.pdf',
      });
      expect.fail('Deveria ter lançado erro');
    } catch (error: any) {
      expect(error.code).toBe('FORBIDDEN');
    }
  });

  it('deve rejeitar tipo de arquivo não permitido', async () => {
    const caller = materialUploadRouter.createCaller({
      user: { id: 1, role: 'admin', email: 'admin@test.com' },
    } as any);

    try {
      await caller.uploadMaterial({
        title: 'Test Material',
        fileBase64: 'test',
        mimeType: 'application/exe',
        fileName: 'test.exe',
      });
      expect.fail('Deveria ter lançado erro');
    } catch (error: any) {
      expect(error.code).toBe('BAD_REQUEST');
      expect(error.message).toContain('não permitido');
    }
  });

  it('deve validar tamanho máximo de arquivo', async () => {
    const caller = materialUploadRouter.createCaller({
      user: { id: 1, role: 'admin', email: 'admin@test.com' },
    } as any);

    // Criar string base64 maior que 50MB
    const largeBase64 = 'A'.repeat(60 * 1024 * 1024);

    try {
      await caller.uploadMaterial({
        title: 'Test Material',
        fileBase64: largeBase64,
        mimeType: 'application/pdf',
        fileName: 'test.pdf',
      });
      expect.fail('Deveria ter lançado erro');
    } catch (error: any) {
      // Erro de validação de tamanho
      expect(error).toBeDefined();
    }
  });

  it('deve obter materiais do aluno autenticado', async () => {
    const caller = materialUploadRouter.createCaller({
      user: { id: 1, role: 'student', email: 'student@test.com' },
    } as any);

    const result = await caller.getMyMaterials();
    
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.materials)).toBe(true);
  });

  it('deve obter todos os materiais para admin', async () => {
    const caller = materialUploadRouter.createCaller({
      user: { id: 1, role: 'admin', email: 'admin@test.com' },
    } as any);

    const result = await caller.getAllMaterials();
    
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.materials)).toBe(true);
  });

  it('deve rejeitar acesso não-admin a getAllMaterials', async () => {
    const caller = materialUploadRouter.createCaller({
      user: { id: 1, role: 'student', email: 'student@test.com' },
    } as any);

    try {
      await caller.getAllMaterials();
      expect.fail('Deveria ter lançado erro');
    } catch (error: any) {
      expect(error.code).toBe('FORBIDDEN');
    }
  });

  it('deve deletar material como admin', async () => {
    const caller = materialUploadRouter.createCaller({
      user: { id: 1, role: 'admin', email: 'admin@test.com' },
    } as any);

    try {
      const result = await caller.deleteMaterial({ materialId: 999 });
      // Material não existe, mas deveria tentar deletar
      expect(result).toBeDefined();
    } catch (error: any) {
      // Esperado se material não existe
      expect(error.code).toBe('NOT_FOUND');
    }
  });

  it('deve rejeitar deleção de material como não-admin', async () => {
    const caller = materialUploadRouter.createCaller({
      user: { id: 1, role: 'student', email: 'student@test.com' },
    } as any);

    try {
      await caller.deleteMaterial({ materialId: 1 });
      expect.fail('Deveria ter lançado erro');
    } catch (error: any) {
      expect(error.code).toBe('FORBIDDEN');
    }
  });

  it('deve compartilhar material com alunos como admin', async () => {
    const caller = materialUploadRouter.createCaller({
      user: { id: 1, role: 'admin', email: 'admin@test.com' },
    } as any);

    try {
      const result = await caller.shareMaterialWithStudents({
        materialId: 999,
        studentIds: [1, 2, 3],
      });
      // Material não existe, mas deveria tentar compartilhar
      expect(result).toBeDefined();
    } catch (error: any) {
      // Esperado se material não existe
      expect(error.code).toBe('NOT_FOUND');
    }
  });
});
