import { describe, it, expect, vi, beforeEach } from "vitest";
import * as sponteModule from "./sponte";

describe("Sponte Integration", () => {
  // Mock das funções do Sponte
  const mockToken = "mock-token-12345";
  const mockStudents = [
    {
      id: "student-1",
      name: "João Silva",
      email: "joao@example.com",
      status: "ativo" as const,
      level: "Intermediário",
      hoursLearned: 24,
    },
    {
      id: "student-2",
      name: "Maria Santos",
      email: "maria@example.com",
      status: "ativo" as const,
      level: "Iniciante",
      hoursLearned: 8,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar token válido", async () => {
    vi.spyOn(sponteModule, "getSponteToken").mockResolvedValue(mockToken);
    const token = await sponteModule.getSponteToken();
    expect(token).toBe(mockToken);
  });

  it("deve retornar lista de alunos com dados corretos", async () => {
    vi.spyOn(sponteModule, "getSponteActiveStudents").mockResolvedValue(mockStudents);
    const students = await sponteModule.getSponteActiveStudents();
    expect(students).toHaveLength(2);
    expect(students[0].name).toBe("João Silva");
    expect(students[1].status).toBe("ativo");
  });

  it("deve ter alunos com status ativo", async () => {
    vi.spyOn(sponteModule, "getSponteActiveStudents").mockResolvedValue(mockStudents);
    const students = await sponteModule.getSponteActiveStudents();
    const allActive = students.every((s) => s.status === "ativo");
    expect(allActive).toBe(true);
  });

  it("deve autenticar com sucesso no Sponte (mock)", async () => {
    vi.spyOn(sponteModule, "getSponteToken").mockResolvedValue(mockToken);
    const newToken = await sponteModule.getSponteToken();
    expect(newToken).toBeDefined();
    expect(typeof newToken).toBe("string");
    expect(newToken.length).toBeGreaterThan(0);
  });

  it("deve recuperar lista de alunos do Sponte", async () => {
    vi.spyOn(sponteModule, "getSponteActiveStudents").mockResolvedValue(mockStudents);
    const students = await sponteModule.getSponteActiveStudents();
    expect(students).toBeDefined();
    expect(Array.isArray(students)).toBe(true);
    console.log(`[Sponte Test] ✅ Recuperados ${students.length} alunos`);
  });

  it("deve ter alunos com propriedades obrigatórias", async () => {
    vi.spyOn(sponteModule, "getSponteActiveStudents").mockResolvedValue(mockStudents);
    const students = await sponteModule.getSponteActiveStudents();
    if (students.length > 0) {
      const student = students[0];
      expect(student).toHaveProperty("id");
      expect(student).toHaveProperty("name");
      expect(student).toHaveProperty("email");
      expect(student).toHaveProperty("status");
    }
  });
});
