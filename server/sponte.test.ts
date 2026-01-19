import { describe, it, expect, beforeAll } from "vitest";
import { getSponteToken, getSponteActiveStudents } from "./sponte";

describe("Sponte Integration", () => {
  let token: string;

  beforeAll(async () => {
    // Test authentication
    try {
      token = await getSponteToken();
      console.log("[Sponte Test] ✅ Autenticação bem-sucedida");
    } catch (error) {
      console.error("[Sponte Test] ❌ Falha na autenticação:", error);
      throw error;
    }
  });

  it("deve autenticar com sucesso no Sponte", async () => {
    const newToken = await getSponteToken();
    expect(newToken).toBeDefined();
    expect(typeof newToken).toBe("string");
    expect(newToken.length).toBeGreaterThan(0);
  });

  it("deve recuperar lista de alunos do Sponte", async () => {
    const students = await getSponteActiveStudents();
    expect(students).toBeDefined();
    expect(Array.isArray(students)).toBe(true);
    console.log(`[Sponte Test] ✅ Recuperados ${students.length} alunos`);
  });

  it("deve ter alunos com propriedades obrigatórias", async () => {
    const students = await getSponteActiveStudents();
    if (students.length > 0) {
      const student = students[0];
      expect(student).toHaveProperty("id");
      expect(student).toHaveProperty("name");
      expect(student).toHaveProperty("email");
      expect(student).toHaveProperty("status");
    }
  });
});
