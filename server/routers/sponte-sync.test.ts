import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createStudentContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "student-user",
    email: "student@example.com",
    name: "Student User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Students Router (Desconectado do Sponte)", () => {
  /**
   * Testes para o router de alunos após desconexão do Sponte
   * O sistema agora opera de forma autônoma com dados locais
   */

  it("deve retornar mensagem de sincronização desativada (admin)", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sponteSync.syncStudents();

    expect(result.success).toBe(true);
    expect(result.synced).toBe(0); // Sincronização desativada
    expect(result.message).toContain("desativada");
    expect(result.info).toBeDefined();
  });

  it("deve rejeitar sincronização para usuários não-admin", async () => {
    const ctx = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.sponteSync.syncStudents();
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(["FORBIDDEN", "INTERNAL_SERVER_ERROR"]).toContain(error.code);
    }
  });

  it("deve obter lista de alunos do banco local (admin)", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sponteSync.getStudents();

    expect(result.success).toBe(true);
    expect(result.source).toBe("local"); // Dados vêm do banco local
    expect(Array.isArray(result.students)).toBe(true);

    // Se houver alunos, verificar estrutura
    if (result.students.length > 0) {
      const student = result.students[0];
      expect(student).toHaveProperty("id");
      expect(student).toHaveProperty("name");
      expect(student).toHaveProperty("email");
      expect(student).toHaveProperty("status");
    }
  });

  it("deve rejeitar obtenção de alunos para usuários não-admin", async () => {
    const ctx = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.sponteSync.getStudents();
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(["FORBIDDEN", "INTERNAL_SERVER_ERROR"]).toContain(error.code);
    }
  });

  it("deve registrar acesso de um aluno", async () => {
    const caller = appRouter.createCaller(createStudentContext());

    const result = await caller.sponteSync.logAccess({
      studentId: "any-student-id",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
  });

  it("deve retornar erro para aluno não encontrado ao verificar status", async () => {
    const caller = appRouter.createCaller(createStudentContext());

    try {
      await caller.sponteSync.checkStudentStatus({
        studentId: "non-existent-student-999",
      });
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(["NOT_FOUND", "INTERNAL_SERVER_ERROR"]).toContain(error.code);
    }
  });

  it("deve retornar lista de todos os livros disponíveis", async () => {
    const caller = appRouter.createCaller(createStudentContext());

    const result = await caller.sponteSync.getAllBooks();

    expect(result.success).toBe(true);
    expect(Array.isArray(result.books)).toBe(true);
    expect(result.books.length).toBeGreaterThan(0);

    // Verificar estrutura de um livro
    const book = result.books[0];
    expect(book).toHaveProperty("id");
    expect(book).toHaveProperty("name");
    expect(book).toHaveProperty("level");
    expect(book).toHaveProperty("cefrLevel");
  });
});
