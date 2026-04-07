import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";
import * as schedulerModule from "../jobs/daily-tips-scheduler";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-001",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
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

function createStudentContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "student-001",
    email: "student@example.com",
    name: "Student User",
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

describe("Scheduler Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve iniciar o scheduler como admin", async () => {
    vi.spyOn(schedulerModule, "startDailyTipsScheduler").mockResolvedValue(undefined);

    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.scheduler.startDailyTips();

    expect(result.success).toBe(true);
    expect(result.message).toContain("sucesso");
  });

  it("deve rejeitar iniciar o scheduler como student", async () => {
    const { ctx } = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.scheduler.startDailyTips();
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("deve parar o scheduler como admin", async () => {
    vi.spyOn(schedulerModule, "stopDailyTipsScheduler").mockImplementation(() => {});

    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.scheduler.stopDailyTips();

    expect(result.success).toBe(true);
    expect(result.message).toContain("sucesso");
  });

  it("deve rejeitar parar o scheduler como student", async () => {
    const { ctx } = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.scheduler.stopDailyTips();
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("deve disparar o job manualmente como admin", async () => {
    vi.spyOn(schedulerModule, "triggerDailyTipsJob").mockResolvedValue(undefined);

    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.scheduler.triggerDailyTips();

    expect(result.success).toBe(true);
    expect(result.message).toContain("sucesso");
  });

  it("deve rejeitar disparar o job como student", async () => {
    const { ctx } = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.scheduler.triggerDailyTips();
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});
