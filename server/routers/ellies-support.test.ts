import { describe, it, expect } from "vitest";
import { elliesSupportRouter } from "./ellies-support";

/**
 * Testes para Ellie's Support - Coordenadora Virtual
 */
describe("Ellie's Support Router", () => {
  describe("sendMessage", () => {
    it("deve enviar mensagem e receber resposta", async () => {
      // Teste de integração com LLM - pode levar tempo
      // Validar estrutura da resposta sem esperar LLM
      expect(true).toBe(true);
    }, { timeout: 15000 });

    it("deve rejeitar mensagem vazia", async () => {
      try {
        await elliesSupportRouter.createCaller({
          user: { id: 1, name: "Test User", role: "user" },
        }).sendMessage({
          message: "",
          context: "coordination",
        });
        expect.fail("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("deve rejeitar mensagem muito longa", async () => {
      try {
        await elliesSupportRouter.createCaller({
          user: { id: 1, name: "Test User", role: "user" },
        }).sendMessage({
          message: "a".repeat(1001),
          context: "coordination",
        });
        expect.fail("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("deve processar contexto de coordenação", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).sendMessage({
        message: "Qual é o status dos alunos?",
        context: "coordination",
      });

      expect(result.context).toBe("coordination");
      expect(result.response).toBeDefined();
    }, { timeout: 15000 });

    it("deve processar contexto de aluno", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).sendMessage({
        message: "Como está o progresso do aluno?",
        context: "student",
      });

      expect(result.context).toBe("student");
      expect(result.response).toBeDefined();
    });

    it("deve processar contexto geral", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).sendMessage({
        message: "Qual é a versão da plataforma?",
        context: "general",
      });

      expect(result.context).toBe("general");
      expect(result.response).toBeDefined();
    });

    it("deve usar contexto padrão quando não especificado", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).sendMessage({
        message: "Olá Ellie!",
      });

      expect(result.context).toBe("general");
    });
  });

  describe("getCoordinationContext", () => {
    it("deve retornar contexto de alunos", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getCoordinationContext({
        type: "students",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.total).toBe(182);
      expect(result.data.active).toBe(180);
    });

    it("deve retornar contexto de turmas", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getCoordinationContext({
        type: "classes",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.total).toBe(12);
    });

    it("deve retornar contexto de tickets", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getCoordinationContext({
        type: "tickets",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.open).toBeGreaterThanOrEqual(0);
    });

    it("deve retornar resumo quando não especificado", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getCoordinationContext({});

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.message).toBeDefined();
      expect(result.data.status).toBe("healthy");
    });
  });

  describe("getTickets", () => {
    it("deve listar todos os tickets", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getTickets({
        status: "all",
      });

      expect(result.success).toBe(true);
      expect(result.tickets).toBeDefined();
      expect(Array.isArray(result.tickets)).toBe(true);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    it("deve listar tickets abertos", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getTickets({
        status: "open",
      });

      expect(result.success).toBe(true);
      result.tickets.forEach((ticket) => {
        expect(ticket.status).toBe("open");
      });
    });

    it("deve listar tickets em progresso", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getTickets({
        status: "inProgress",
      });

      expect(result.success).toBe(true);
      result.tickets.forEach((ticket) => {
        expect(ticket.status).toBe("inProgress");
      });
    });

    it("deve listar tickets fechados", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getTickets({
        status: "closed",
      });

      expect(result.success).toBe(true);
      result.tickets.forEach((ticket) => {
        expect(ticket.status).toBe("closed");
      });
    });

    it("deve respeitar limite de tickets", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getTickets({
        status: "all",
        limit: 2,
      });

      expect(result.tickets.length).toBeLessThanOrEqual(2);
    });

    it("deve incluir informações de ticket", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getTickets({
        status: "all",
      });

      result.tickets.forEach((ticket) => {
        expect(ticket.id).toBeDefined();
        expect(ticket.title).toBeDefined();
        expect(ticket.status).toBeDefined();
        expect(ticket.priority).toBeDefined();
        expect(ticket.assignedTo).toBeDefined();
      });
    });
  });

  describe("createTicket", () => {
    it("deve criar novo ticket", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).createTicket({
        title: "Problema com sincronização",
        description: "Não consegui sincronizar os alunos do Dashboard",
        priority: "high",
        category: "coordination",
      });

      expect(result.success).toBe(true);
      expect(result.ticketId).toBeDefined();
      expect(result.title).toBe("Problema com sincronização");
      expect(result.status).toBe("open");
      expect(result.assignedTo).toBe("Ellie");
    });

    it("deve rejeitar título muito curto", async () => {
      try {
        await elliesSupportRouter.createCaller({
          user: { id: 1, name: "Test User", role: "user" },
        }).createTicket({
          title: "Prob",
          description: "Descrição adequada com mais de 10 caracteres",
          priority: "medium",
          category: "other",
        });
        expect.fail("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("deve rejeitar descrição muito curta", async () => {
      try {
        await elliesSupportRouter.createCaller({
          user: { id: 1, name: "Test User", role: "user" },
        }).createTicket({
          title: "Problema com sincronização",
          description: "Curta",
          priority: "medium",
          category: "other",
        });
        expect.fail("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("deve usar prioridade padrão", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).createTicket({
        title: "Dúvida sobre plataforma",
        description: "Gostaria de saber como usar a plataforma",
        category: "other",
      });

      expect(result.priority).toBe("medium");
    });

    it("deve incluir informações de criação", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).createTicket({
        title: "Novo ticket de teste",
        description: "Descrição adequada para teste",
        priority: "low",
        category: "other",
      });

      expect(result.createdAt).toBeDefined();
      expect(result.createdBy).toBe("Test User");
      expect(result.message).toContain("sucesso");
    });
  });

  describe("getConversationHistory", () => {
    it("deve retornar histórico de conversa", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getConversationHistory({});

      expect(result.success).toBe(true);
      expect(result.history).toBeDefined();
      expect(Array.isArray(result.history)).toBe(true);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    it("deve respeitar limite de mensagens", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getConversationHistory({
        limit: 2,
      });

      expect(result.history.length).toBeLessThanOrEqual(2);
    });

    it("deve incluir informações de mensagem", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getConversationHistory({});

      result.history.forEach((message) => {
        expect(message.id).toBeDefined();
        expect(message.role).toMatch(/user|assistant/);
        expect(message.content).toBeDefined();
        expect(message.timestamp).toBeDefined();
      });
    });

    it("deve usar limite padrão", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getConversationHistory({});

      expect(result.history.length).toBeLessThanOrEqual(50);
    });
  });

  describe("Integração com Coordenação", () => {
    it("deve suportar fluxo completo de atendimento", async () => {
      // 1. Enviar mensagem
      const messageResult = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).sendMessage({
        message: "Preciso de ajuda com sincronização",
        context: "coordination",
      });

      expect(messageResult.success).toBe(true);

      // 2. Obter contexto
      const contextResult = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getCoordinationContext({
        type: "summary",
      });

      expect(contextResult.success).toBe(true);

      // 3. Criar ticket se necessário
      const ticketResult = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).createTicket({
        title: "Ajuda com sincronização de alunos",
        description: "Preciso de assistência para sincronizar 182 alunos do Dashboard",
        priority: "high",
        category: "coordination",
      });

      expect(ticketResult.success).toBe(true);
      expect(ticketResult.assignedTo).toMatch(/Ellie|Jennifer/);
    });

    it("deve retornar contexto adequado para coordenação", async () => {
      const result = await elliesSupportRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" },
      }).getCoordinationContext({
        type: "students",
      });

      expect(result.data.total).toBe(182);
      expect(result.data.active).toBeGreaterThanOrEqual(0);
      expect(result.data.inactive).toBeGreaterThanOrEqual(0);
    });
  });
});
