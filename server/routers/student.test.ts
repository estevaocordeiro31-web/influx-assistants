import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createStudentContext(status: string = "ativo"): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "student-001",
    email: "student@example.com",
    name: "João Silva",
    loginMethod: "manus",
    role: "student",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Student Router", () => {
  it("getProfile deve retornar informações do aluno", async () => {
    const { ctx } = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.student.getProfile();

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("isActive");
  });

  it("canAccess deve retornar true para aluno ativo", async () => {
    const { ctx } = createStudentContext("ativo");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.student.canAccess();

    expect(result.canAccess).toBe(true);
  });

  it("getAccessStatus deve retornar status do aluno", async () => {
    const { ctx } = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.student.getAccessStatus();

    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("isActive");
    expect(result).toHaveProperty("message");
  });
});
