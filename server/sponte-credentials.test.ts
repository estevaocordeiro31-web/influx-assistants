import { describe, it, expect } from "vitest";
import { ENV } from "./_core/env";

describe("Sponte Credentials Validation", () => {
  it("deve ter SPONTE_LOGIN configurado", () => {
    expect(ENV.sponteLogin).toBeDefined();
    expect(ENV.sponteLogin).not.toBe("");
    expect(ENV.sponteLogin).toMatch(/@/); // Deve ser um email
  });

  it("deve ter SPONTE_PASSWORD configurado", () => {
    expect(ENV.spontePassword).toBeDefined();
    expect(ENV.spontePassword).not.toBe("");
  });

  it("deve ter credenciais válidas para Sponte", () => {
    const login = ENV.sponteLogin;
    const password = ENV.spontePassword;

    // Validações básicas
    expect(login).toMatch(/^[^\s@]+@[^\s@]+$/); // Email válido (pode ser dominio sem ponto)
    expect(password.length).toBeGreaterThan(0);
    expect(password.length).toBeLessThan(256); // Limite razoável
  });

  it("credenciais não devem estar vazias ou com valores padrão", () => {
    const login = ENV.sponteLogin;
    const password = ENV.spontePassword;

    expect(login).not.toMatch(/^(test|demo|example|placeholder)/i);
    expect(password).not.toMatch(/^(test|demo|example|placeholder|123456)/i);
  });
});
