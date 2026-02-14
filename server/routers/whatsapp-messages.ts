import { router, protectedProcedure, adminProcedure } from "../\_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Router para gerar 182 mensagens personalizadas por WhatsApp
 * Cada mensagem inclui nome, nível, objetivo e data de desbloqueio
 */
export const whatsappMessagesRouter = router({
  /**
   * Gerar todas as 182 mensagens personalizadas
   * Apenas admins podem executar
   */
  generatePersonalizedMessages: adminProcedure
    .input(z.object({
      unlockDate: z.string().default("01/03/2026"),
      format: z.enum(["json", "csv"]).default("json"),
    }))
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Buscar todos os usuários sincronizados
        const allUsers = await db.select().from(users);

        const messages = allUsers.map((user) => {
          // Usar valores padrão para campos não disponíveis na tabela users
          const message = generateWhatsAppMessage({
            name: user.name || "Aluno",
            level: "Iniciante", // Padrão - será preenchido do Dashboard
            objective: "Aprendizado", // Padrão - será preenchido do Dashboard
            unlockDate: input.unlockDate,
            email: user.email || "",
          });

          return {
            id: user.id,
            email: user.email || "",
            name: user.name || "Aluno",
            message,
            createdAt: new Date(),
          };
        });

        // Formatar resposta conforme solicitado
        let result: any = {
          success: true,
          total: messages.length,
          messages,
        };

        if (input.format === "csv") {
          result.csv = convertToCSV(messages);
        }

        return result;
      } catch (error) {
        throw new Error(
          `Erro ao gerar mensagens: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    }),

  /**
   * Gerar mensagem personalizada para um aluno específico
   */
  generateMessageForStudent: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      unlockDate: z.string().default("01/03/2026"),
    }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const student = await db
          .select()
          .from(users)
          .where(eq(users.id, parseInt(input.studentId)))
          .limit(1);

        if (student.length === 0) {
          throw new Error("Aluno não encontrado");
        }

        const user = student[0];
        const message = generateWhatsAppMessage({
          name: user.name || "Aluno",
          level: "Iniciante", // Padrão - será preenchido do Dashboard
          objective: "Aprendizado", // Padrão - será preenchido do Dashboard
          unlockDate: input.unlockDate,
          email: user.email || "",
        });

        return {
          success: true,
          studentId: user.id,
          email: user.email || "",
          message,
        };
      } catch (error) {
        throw new Error(
          `Erro ao gerar mensagem: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    }),

  /**
   * Validar qualidade das mensagens geradas
   */
  validateMessages: adminProcedure
    .input(z.object({
      messages: z.array(z.object({
        email: z.string(),
        message: z.string(),
      })),
    }))
    .mutation(async ({ input }) => {
      const validationResults = input.messages.map((msg) => {
        const issues: string[] = [];

        // Validar comprimento da mensagem
        if (msg.message.length < 50) {
          issues.push("Mensagem muito curta");
        }
        if (msg.message.length > 500) {
          issues.push("Mensagem muito longa");
        }

        // Validar que contém informações essenciais
        if (!msg.message.includes("Acesso liberado")) {
          issues.push("Falta informação de desbloqueio");
        }
        if (!msg.message.includes("01/03")) {
          issues.push("Falta data de desbloqueio");
        }

        return {
          email: msg.email,
          isValid: issues.length === 0,
          issues,
        };
      });

      const totalValid = validationResults.filter((r) => r.isValid).length;

      return {
        success: true,
        total: input.messages.length,
        valid: totalValid,
        invalid: input.messages.length - totalValid,
        results: validationResults,
      };
    }),

  /**
   * Exportar mensagens em formato CSV
   */
  exportAsCSV: adminProcedure
    .input(z.object({
      unlockDate: z.string().default("01/03/2026"),
    }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const allUsers = await db.select().from(users);

        const messages = allUsers.map((user) => {
          const message = generateWhatsAppMessage({
            name: user.name || "Aluno",
            level: "Iniciante", // Padrão - será preenchido do Dashboard
            objective: "Aprendizado", // Padrão - será preenchido do Dashboard
            unlockDate: input.unlockDate,
            email: user.email || "",
          });

          return {
            email: user.email || "",
            name: user.name || "Aluno",
            message,
          };
        });

        const csv = convertToCSV(messages);

        return {
          success: true,
          csv,
          filename: `mensagens-whatsapp-${new Date().toISOString().split("T")[0]}.csv`,
        };
      } catch (error) {
        throw new Error(
          `Erro ao exportar CSV: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    }),
});

/**
 * Gerar mensagem WhatsApp personalizada para um aluno
 */
function generateWhatsAppMessage(params: {
  name: string;
  level: string;
  objective: string;
  unlockDate: string;
  email: string;
}): string {
  const levelMap: Record<string, string> = {
    "Iniciante": "Beginner (A1)",
    "Elementar": "Elementary (A2)",
    "Básico": "Pre-Intermediate (B1)",
    "Intermediário": "Intermediate (B2)",
    "Avançado": "Advanced (C1-C2)",
  };

  const objectiveMap: Record<string, string> = {
    "Carreira": "desenvolvimento profissional",
    "Viagem": "viagens internacionais",
    "Estudos": "estudos acadêmicos",
    "Outro": "aprendizado geral",
  };

  const mappedLevel = levelMap[params.level] || params.level;
  const mappedObjective = objectiveMap[params.objective] || params.objective;

  return `Olá ${params.name}! 👋

Bem-vindo ao inFlux Personal Tutor! 🎉

Preparamos uma experiência completamente personalizada para você:

📚 **Seu Nível**: ${mappedLevel}
🎯 **Seu Objetivo**: ${mappedObjective}
💡 **Recursos Exclusivos**: Chunks, tutor IA, materiais extras e muito mais

🔓 **Acesso liberado em**: ${params.unlockDate}

Enquanto isso, fique atento! Em breve você terá acesso a:
✅ Prática de chunks personalizados
✅ Tutor IA com respostas adaptadas ao seu nível
✅ Materiais extras de acordo com seus objetivos
✅ Rastreamento de progresso em tempo real

Dúvidas? Entre em contato com nossa equipe!

Abraços,
inFlux Personal Tutor 🚀`;
}

/**
 * Converter array de mensagens para formato CSV
 */
function convertToCSV(messages: any[]): string {
  if (messages.length === 0) {
    return "email,name,message\n";
  }

  const headers = ["email", "name", "message"];
  const rows = messages.map((msg) => [
    escapeCSV(msg.email),
    escapeCSV(msg.name),
    escapeCSV(msg.message),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Escapar valores CSV para evitar problemas com aspas e quebras de linha
 */
function escapeCSV(value: string | undefined | null): string {
  if (!value) return '""';
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
