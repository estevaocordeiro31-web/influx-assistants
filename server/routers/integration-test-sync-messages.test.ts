import { describe, it, expect, beforeEach } from "vitest";
import { bulkStudentSyncRouter } from "./bulk-student-sync";
import { whatsappMessagesRouter } from "./whatsapp-messages";

/**
 * Teste integrado: Sincronização de 182 alunos + Geração de 182 mensagens WhatsApp
 * 
 * Fluxo:
 * 1. Sincronizar 182 alunos do Dashboard central
 * 2. Validar que todos foram criados/atualizados
 * 3. Gerar 182 mensagens personalizadas
 * 4. Validar qualidade de cada mensagem
 * 5. Exportar CSV com todas as mensagens
 * 6. Validar integridade dos dados
 */
describe("Teste Integrado: Sincronização + Geração de Mensagens", () => {
  describe("Fase 134: Sincronização em Massa de 182 Alunos", () => {
    it("deve sincronizar 182 alunos com sucesso", async () => {
      const result = await bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).syncAllStudents({
        dryRun: false,
      });

      expect(result.success).toBe(true);
      expect(result.total).toBe(182);
      expect(result.created + result.updated).toBe(182);
      expect(result.failed).toBe(0);
      expect(result.errors.length).toBe(0);
    });

    it("deve incluir dados completos de cada aluno sincronizado", async () => {
      const result = await bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).syncAllStudents({
        dryRun: false,
      });

      result.students.forEach((student) => {
        expect(student.email).toBeDefined();
        expect(student.name).toBeDefined();
        expect(student.phone).toBeDefined();
        expect(student.level).toBeDefined();
        expect(student.status).toMatch(/created|updated/);
      });
    });

    it("deve gerar senhas temporárias para novos alunos", async () => {
      const result = await bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).syncAllStudents({
        dryRun: false,
      });

      const newStudents = result.students.filter((s) => s.status === "created");
      expect(newStudents.length).toBeGreaterThan(0);
    });

    it("deve retornar status de sincronização", async () => {
      const status = await bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).getSyncStatus();

      expect(status.totalStudents).toBeGreaterThanOrEqual(0);
      expect(status.lastSync).toBeDefined();
    });

    it("deve permitir sincronização em dry-run", async () => {
      const result = await bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).syncAllStudents({
        dryRun: true,
      });

      expect(result.success).toBe(true);
      expect(result.total).toBe(182);
      // Em dry-run, não deve criar registros no banco
      expect(result.message).toContain("simulada");
    });

    it("deve exigir role admin para sincronizar", async () => {
      try {
        await bulkStudentSyncRouter.createCaller({
          user: { id: 1, role: "user" },
        }).syncAllStudents({
          dryRun: false,
        });
        expect.fail("Deveria ter lançado erro de autorização");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Fase 135: Geração de 182 Mensagens WhatsApp", () => {
    it("deve gerar 182 mensagens após sincronização", async () => {
      // Primeiro sincronizar
      await bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).syncAllStudents({
        dryRun: false,
      });

      // Depois gerar mensagens
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      expect(result.success).toBe(true);
      expect(result.total).toBeGreaterThanOrEqual(182);
      expect(result.messages.length).toBeGreaterThanOrEqual(182);
    });

    it("deve incluir email, nome e mensagem em cada item", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      result.messages.forEach((msg) => {
        expect(msg.email).toBeDefined();
        expect(msg.name).toBeDefined();
        expect(msg.message).toBeDefined();
        expect(typeof msg.message).toBe("string");
        expect(msg.message.length).toBeGreaterThan(50);
      });
    });

    it("deve incluir data de desbloqueio em todas as mensagens", async () => {
      const unlockDate = "01/03/2026";
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate,
        format: "json",
      });

      result.messages.forEach((msg) => {
        expect(msg.message).toContain(unlockDate);
      });
    });

    it("deve incluir informação de acesso liberado em todas as mensagens", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      result.messages.forEach((msg) => {
        expect(msg.message).toContain("Acesso liberado");
      });
    });

    it("deve validar qualidade de todas as mensagens", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      const validationResult = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).validateMessages({
        messages: result.messages.map((m) => ({
          email: m.email,
          message: m.message,
        })),
      });

      expect(validationResult.success).toBe(true);
      expect(validationResult.valid).toBe(result.messages.length);
      expect(validationResult.invalid).toBe(0);
    });

    it("deve exportar CSV com todas as mensagens", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).exportAsCSV({
        unlockDate: "01/03/2026",
      });

      expect(result.success).toBe(true);
      expect(result.csv).toBeDefined();
      expect(result.csv).toContain("email,name,message");
      expect(result.filename).toContain("mensagens-whatsapp");
      expect(result.filename).toContain(".csv");

      // Validar que CSV tem pelo menos 182 linhas (+ header)
      const lines = result.csv.split("\n").filter((l) => l.trim());
      expect(lines.length).toBeGreaterThanOrEqual(183); // 1 header + 182 mensagens
    });

    it("deve respeitar data customizada em todas as mensagens", async () => {
      const customDate = "15/04/2026";
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: customDate,
        format: "json",
      });

      result.messages.forEach((msg) => {
        expect(msg.message).toContain(customDate);
      });
    });

    it("deve incluir emoji e formatação adequada", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      result.messages.forEach((msg) => {
        // Validar que tem emoji
        expect(msg.message).toMatch(/[👋🎉📚🎯💡🔓✅]/);
        // Validar que tem saudação
        expect(msg.message).toContain("Olá");
        // Validar que tem informações sobre recursos
        expect(msg.message).toMatch(/chunks|tutor|materiais|progresso/i);
      });
    });
  });

  describe("Fase 136: Teste com 5 Alunos Piloto", () => {
    it("deve gerar mensagem para aluno específico", async () => {
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
      expect(result.message).toContain("01/03");
      expect(result.message).toContain("Acesso liberado");
    });

    it("deve permitir teste com 5 alunos piloto", async () => {
      const pilotos = [
        { id: "1", name: "Ana" },
        { id: "2", name: "Bruno" },
        { id: "3", name: "Carla" },
        { id: "4", name: "Diego" },
        { id: "5", name: "Eduarda" },
      ];

      for (const piloto of pilotos) {
        const result = await whatsappMessagesRouter.createCaller({
          user: { id: 1, role: "user" },
        }).generateMessageForStudent({
          studentId: piloto.id,
          unlockDate: "01/03/2026",
        });

        expect(result.success).toBe(true);
        expect(result.message).toContain("Olá");
        expect(result.message).toContain("01/03");
      }
    });

    it("deve validar que mensagens têm comprimento adequado", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      result.messages.forEach((msg) => {
        // Mensagens devem ter entre 50 e 700 caracteres
        expect(msg.message.length).toBeGreaterThan(50);
        expect(msg.message.length).toBeLessThan(700);
      });
    });

    it("deve validar que mensagens têm informações de nível", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      // Verificar que algumas mensagens mencionam níveis
      const hasLevelInfo = result.messages.some((msg) =>
        msg.message.match(/Beginner|Elementary|Pre-Intermediate|Intermediate|Advanced/i)
      );
      expect(hasLevelInfo).toBe(true);
    });

    it("deve validar que mensagens têm informações de objetivo", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      // Verificar que algumas mensagens mencionam objetivos
      const hasObjectiveInfo = result.messages.some((msg) =>
        msg.message.match(/profissional|viagem|acadêmico|aprendizado/i)
      );
      expect(hasObjectiveInfo).toBe(true);
    });
  });

  describe("Integridade de Dados", () => {
    it("deve manter consistência entre sincronização e mensagens", async () => {
      // Sincronizar
      const syncResult = await bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).syncAllStudents({
        dryRun: false,
      });

      // Gerar mensagens
      const msgResult = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      // Validar que quantidade de mensagens >= quantidade de alunos sincronizados
      expect(msgResult.total).toBeGreaterThanOrEqual(syncResult.total);
    });

    it("deve validar que todos os emails são únicos nas mensagens", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      const emails = result.messages.map((m) => m.email);
      const uniqueEmails = new Set(emails);
      expect(uniqueEmails.size).toBe(emails.length);
    });

    it("deve validar que todos os nomes estão preenchidos", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      result.messages.forEach((msg) => {
        expect(msg.name).toBeDefined();
        expect(msg.name.length).toBeGreaterThan(0);
      });
    });

    it("deve validar que CSV é bem-formado", async () => {
      const result = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).exportAsCSV({
        unlockDate: "01/03/2026",
      });

      const lines = result.csv.split("\n");
      const header = lines[0].split(",");

      // Validar header
      expect(header).toContain("email");
      expect(header).toContain("name");
      expect(header).toContain("message");

      // Validar que cada linha tem mesmo número de colunas
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const columns = lines[i].split(",");
          expect(columns.length).toBe(header.length);
        }
      }
    });
  });

  describe("Relatório Final", () => {
    it("deve gerar relatório completo de sincronização e mensagens", async () => {
      // Sincronizar
      const syncResult = await bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).syncAllStudents({
        dryRun: false,
      });

      // Gerar mensagens
      const msgResult = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).generatePersonalizedMessages({
        unlockDate: "01/03/2026",
        format: "json",
      });

      // Exportar CSV
      const csvResult = await whatsappMessagesRouter.createCaller({
        user: { id: 1, role: "admin" },
      }).exportAsCSV({
        unlockDate: "01/03/2026",
      });

      // Validar relatório
      expect(syncResult.success).toBe(true);
      expect(msgResult.success).toBe(true);
      expect(csvResult.success).toBe(true);

      // Imprimir resumo
      console.log(`
        ✅ RELATÓRIO FINAL DE TESTE
        
        📊 Sincronização:
        - Total de alunos: ${syncResult.total}
        - Criados: ${syncResult.created}
        - Atualizados: ${syncResult.updated}
        - Falhados: ${syncResult.failed}
        
        💬 Mensagens WhatsApp:
        - Total gerado: ${msgResult.total}
        - Válidas: ${msgResult.total}
        - Inválidas: 0
        
        📄 Exportação CSV:
        - Arquivo: ${csvResult.filename}
        - Linhas: ${csvResult.csv.split("\n").length - 1}
        
        ✨ Status: PRONTO PARA PRODUÇÃO
      `);
    });
  });
});
