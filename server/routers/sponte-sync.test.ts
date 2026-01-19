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

describe("Sponte Sync Router", () => {
  it("deve sincronizar alunos com sucesso (admin)", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sponteSync.syncStudents();

    expect(result.success).toBe(true);
    expect(result.synced).toBeGreaterThan(0);
    expect(result.message).toBeDefined();
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

  it("deve obter lista de alunos (admin)", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sponteSync.getStudents();

    expect(result.success).toBe(true);
    expect(Array.isArray(result.students)).toBe(true);
    expect(result.students.length).toBeGreaterThan(0);

    // Verificar estrutura de um aluno
    const student = result.students[0];
    expect(student).toHaveProperty("id");
    expect(student).toHaveProperty("name");
    expect(student).toHaveProperty("email");
    expect(student).toHaveProperty("status");
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

  it("deve verificar status de um aluno ativo", async () => {
    const caller = appRouter.createCaller(createStudentContext());

    const result = await caller.sponteSync.checkStudentStatus({
      studentId: "sponte-001",
    });

    expect(result.success).toBe(true);
    expect(result.isActive).toBe(true);
    expect(result.status).toBe("ativo");
    expect(result.name).toBeDefined();
  });

  it("deve retornar false para aluno inativo", async () => {
    const caller = appRouter.createCaller(createStudentContext());

    const result = await caller.sponteSync.checkStudentStatus({
      studentId: "sponte-003",
    });

    expect(result.success).toBe(true);
    expect(result.isActive).toBe(false);
    expect(result.status).toBe("inativo");
  });

  it("deve registrar acesso de um aluno", async () => {
    const caller = appRouter.createCaller(createStudentContext());

    const result = await caller.sponteSync.logAccess({
      studentId: "sponte-001",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
  });

  it("deve retornar erro para aluno não encontrado", async () => {
    const caller = appRouter.createCaller(createStudentContext());

    try {
      await caller.sponteSync.checkStudentStatus({
        studentId: "sponte-999",
      });
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(["NOT_FOUND", "INTERNAL_SERVER_ERROR"]).toContain(error.code);
    }
  });
});
