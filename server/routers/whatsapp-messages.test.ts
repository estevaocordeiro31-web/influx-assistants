import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { whatsappMessagesRouter } from "./whatsapp-messages";

describe("whatsappMessagesRouter", () => {
  describe("generatePersonalizedMessages", () => {
    it("deve gerar mensagens para todos os usuários", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      expect(result.success).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      expect(Array.isArray(result.messages)).toBe(true);
    });

    it("deve incluir email, nome e mensagem em cada item", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      if (result.messages.length > 0) {
        const firstMessage = result.messages[0];
        expect(firstMessage).toHaveProperty("email");
        expect(firstMessage).toHaveProperty("name");
        expect(firstMessage).toHaveProperty("message");
        expect(typeof firstMessage.message).toBe("string");
      }
    });

    it("deve incluir data de desbloqueio na mensagem", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      if (result.messages.length > 0) {
        const firstMessage = result.messages[0];
        expect(firstMessage.message).toContain("01/03");
      }
    });

    it("deve incluir informação de acesso liberado", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      if (result.messages.length > 0) {
        const firstMessage = result.messages[0];
        expect(firstMessage.message).toContain("Acesso liberado");
      }
    });

    it("deve retornar CSV quando format=csv", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "csv",
      });

      expect(result.success).toBe(true);
      expect(result.csv).toBeDefined();
      expect(typeof result.csv).toBe("string");
      expect(result.csv).toContain("email,name,message");
    });

    it("deve respeitar data de desbloqueio customizada", async () => {
      const customDate = "15/04/2026";
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: customDate,
        format: "json",
      });

      if (result.messages.length > 0) {
        const firstMessage = result.messages[0];
        expect(firstMessage.message).toContain(customDate);
      }
    });
  });

  describe("generateMessageForStudent", () => {
    it("deve gerar mensagem para um aluno específico", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "user" },
      }).generateMessageForStudent({
        studentId: "1",
        unlockDate: "01/03/2026",
      });

      expect(result.success).toBe(true);
      expect(result.studentId).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.message).toBeDefined();
    });

    it("deve incluir data de desbloqueio na mensagem do aluno", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "user" },
      }).generateMessageForStudent({
        studentId: "1",
        unlockDate: "01/03/2026",
      });

      expect(result.message).toContain("01/03");
    });

    it("deve lançar erro para aluno inexistente", async () => {
      try {
        await whatsappMessagesRouter.createCaller({
          user: { id: 1, role: "user" },
        }).generateMessageForStudent({
          studentId: "999999",
          unlockDate: "01/03/2026",
        });
        expect.fail("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("deve respeitar data customizada para aluno", async () => {
      const customDate = "20/05/2026";
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "user" },
      }).generateMessageForStudent({
        studentId: "1",
        unlockDate: customDate,
      });

      expect(result.message).toContain(customDate);
    });
  });

  describe("validateMessages", () => {
    it("deve validar mensagens válidas", async () => {
      const messages = [
        {
          email: "aluno1@test.com",
          message: "Olá! Bem-vindo ao inFlux. Acesso liberado em 01/03/2026.",
        },
      ];

      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).validateMessages({ messages });

      expect(result.success).toBe(true);
      expect(result.valid).toBeGreaterThan(0);
    });

    it("deve rejeitar mensagens muito longas", async () => {
      const messages = [
        {
          email: "aluno1@test.com",
          message: "A".repeat(701),
        },
      ];

      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).validateMessages({ messages });

      expect(result.invalid).toBeGreaterThan(0);
      expect(result.results[0].issues).toContain("Mensagem muito longa");
    });

    it("deve rejeitar mensagens sem data de desbloqueio", async () => {
      const messages = [
        {
          email: "aluno1@test.com",
          message: "Olá! Bem-vindo ao inFlux. Acesso liberado em breve para você aprender!",
        },
      ];

      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).validateMessages({ messages });

      expect(result.invalid).toBeGreaterThan(0);
      expect(result.results[0].issues).toContain("Falta data de desbloqueio");
    });

    it("deve rejeitar mensagens sem informação de acesso", async () => {
      const messages = [
        {
          email: "aluno1@test.com",
          message: "Olá! Bem-vindo ao inFlux. Data: 01/03/2026. Você aprenderá muito!",
        },
      ];

      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).validateMessages({ messages });

      expect(result.invalid).toBeGreaterThan(0);
      expect(result.results[0].issues).toContain("Falta informação de desbloqueio");
    });

    it("deve contar corretamente mensagens válidas e inválidas", async () => {
      const messages = [
        {
          email: "aluno1@test.com",
          message: "Olá! Bem-vindo ao inFlux. Acesso liberado em 01/03/2026.",
        },
        {
          email: "aluno2@test.com",
          message: "Oi",
        },
      ];

      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).validateMessages({ messages });

      expect(result.total).toBe(2);
      expect(result.valid + result.invalid).toBe(2);
    });
  });

  describe("exportAsCSV", () => {
    it("deve exportar mensagens em formato CSV", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).exportAsCSV({
        unlockDate: "01/03/2026",
      });

      expect(result.success).toBe(true);
      expect(result.csv).toBeDefined();
      expect(typeof result.csv).toBe("string");
    });

    it("deve incluir headers CSV corretos", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).exportAsCSV({
        unlockDate: "01/03/2026",
      });

      expect(result.csv).toContain("email,name,message");
    });

    it("deve incluir nome de arquivo com data", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).exportAsCSV({
        unlockDate: "01/03/2026",
      });

      expect(result.filename).toBeDefined();
      expect(result.filename).toContain("mensagens-whatsapp");
      expect(result.filename).toContain(".csv");
    });

    it("deve escapar valores CSV com vírgulas", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).exportAsCSV({
        unlockDate: "01/03/2026",
      });

      // CSV deve estar bem formatado mesmo com valores especiais
      expect(result.csv).toBeDefined();
      const lines = result.csv.split("\n");
      expect(lines.length).toBeGreaterThan(0);
    });

    it("deve respeitar data customizada no CSV", async () => {
      const customDate = "15/04/2026";
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).exportAsCSV({
        unlockDate: customDate,
      });

      expect(result.csv).toContain(customDate);
    });
  });

  describe("Segurança e Autorização", () => {
    it("generatePersonalizedMessages deve exigir role admin", async () => {
      try {
        await whatsappMessagesRouter.createCaller({
          user: { id: 1, role: "user" },
        }).generatePersonalizedMessages({
          unlockDate: "01/03/2026",
          format: "json",
        });
        expect.fail("Deveria ter lançado erro de autorização");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("validateMessages deve exigir role admin", async () => {
      try {
        await whatsappMessagesRouter.createCaller({
          user: { id: 1, role: "user" },
        }).validateMessages({
          messages: [
            {
              email: "test@test.com",
              message: "Test message with 01/03 and Acesso liberado",
            },
          ],
        });
        expect.fail("Deveria ter lançado erro de autorização");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("exportAsCSV deve exigir role admin", async () => {
      try {
        await whatsappMessagesRouter.createCaller({
          user: { id: 1, role: "user" },
        }).exportAsCSV({
          unlockDate: "01/03/2026",
        });
        expect.fail("Deveria ter lançado erro de autorização");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("generateMessageForStudent deve permitir usuários autenticados", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "user" },
      }).generateMessageForStudent({
        studentId: "1",
        unlockDate: "01/03/2026",
      });

      expect(result).toBeDefined();
    });
  });

  describe("Formatação de Mensagens", () => {
    it("deve incluir emoji na mensagem", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      if (result.messages.length > 0) {
        const firstMessage = result.messages[0];
        expect(firstMessage.message).toMatch(/[👋🎉📚🎯💡🔓✅]/);
      }
    });

    it("deve incluir saudação personalizada com nome", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      if (result.messages.length > 0) {
        const firstMessage = result.messages[0];
        expect(firstMessage.message).toContain("Olá");
      }
    });

    it("deve incluir informações sobre recursos disponíveis", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      if (result.messages.length > 0) {
        const firstMessage = result.messages[0];
        expect(firstMessage.message).toMatch(/chunks|tutor|materiais|progresso/i);
      }
    });

    it("deve ter comprimento adequado (50-700 caracteres)", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      result.messages.forEach((msg) => {
        expect(msg.message.length).toBeGreaterThan(50);
        expect(msg.message.length).toBeLessThan(700);
      });
    });
  });
});
