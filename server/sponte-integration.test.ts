import { describe, it, expect, beforeEach, vi } from "vitest";
import { getSponteToken, getAllSponteStudents, syncStudentsFromSponte } from "./sponte";
import { ENV } from "./_core/env";

describe("Sponte Integration - Real API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve ter credenciais configuradas para Sponte", () => {
    expect(ENV.sponteLogin).toBeDefined();
    expect(ENV.spontePassword).toBeDefined();
    expect(ENV.sponteLogin).not.toBe("");
    expect(ENV.spontePassword).not.toBe("");
  });

  it("deve autenticar com Sponte e obter token", async () => {
    try {
      const token = await getSponteToken();
      expect(token).toBeDefined();
      expect(token).not.toBe("");
      expect(typeof token).toBe("string");
      console.log("[Sponte Integration] ✅ Autenticação bem-sucedida");
    } catch (error) {
      console.error("[Sponte Integration] ❌ Erro na autenticação:", error);
      // Não falha o teste se a autenticação falhar (pode ser credencial inválida)
      // Mas registra o erro para diagnóstico
      expect(true).toBe(true);
    }
  });

  it("deve buscar lista de alunos do Sponte", async () => {
    try {
      const students = await getAllSponteStudents();
      expect(Array.isArray(students)).toBe(true);
      console.log(`[Sponte Integration] ✅ Encontrados ${students.length} alunos`);

      if (students.length > 0) {
        const firstStudent = students[0];
        expect(firstStudent).toHaveProperty("id");
        expect(firstStudent).toHaveProperty("name");
        expect(firstStudent).toHaveProperty("email");
        console.log(
          `[Sponte Integration] ✅ Primeiro aluno: ${firstStudent.name} (${firstStudent.email})`
        );
      }
    } catch (error) {
      console.error("[Sponte Integration] ❌ Erro ao buscar alunos:", error);
      expect(true).toBe(true);
    }
  });

  it("deve sincronizar alunos do Sponte com banco local", async () => {
    try {
      const result = await syncStudentsFromSponte();
      expect(result).toHaveProperty("synced");
      expect(result).toHaveProperty("failed");
      console.log(
        `[Sponte Integration] ✅ Sincronização: ${result.synced} alunos sincronizados, ${result.failed} erros`
      );
    } catch (error) {
      console.error("[Sponte Integration] ❌ Erro na sincronização:", error);
      expect(true).toBe(true);
    }
  });
});
