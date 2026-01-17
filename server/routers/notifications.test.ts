import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Notifications Router", () => {
  it("list deve retornar alertas de demonstração", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.list({ filter: "all" });

    expect(result).toHaveProperty("alerts");
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("unreadCount");
    expect(Array.isArray(result.alerts)).toBe(true);
    expect(result.alerts.length).toBeGreaterThan(0);
  });

  it("list com filtro unread deve retornar apenas alertas não lidos", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.list({ filter: "unread" });

    expect(result.alerts.every(a => !a.read)).toBe(true);
  });

  it("list com filtro warnings deve retornar apenas alertas de atenção", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.list({ filter: "warnings" });

    expect(result.alerts.every(a => a.severity === "warning")).toBe(true);
  });

  it("getStats deve retornar estatísticas de alertas", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.getStats();

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("unread");
    expect(result).toHaveProperty("warnings");
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("byType");
    expect(typeof result.total).toBe("number");
  });

  it("markAsRead deve retornar sucesso", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.markAsRead({ alertId: "1" });

    expect(result).toEqual({ success: true });
  });

  it("markAllAsRead deve retornar sucesso", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.markAllAsRead();

    expect(result).toEqual({ success: true });
  });
});
