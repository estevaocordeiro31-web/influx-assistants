import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

/**
 * Router para Ellie's Support - Coordenadora Virtual
 * Atendimento de coordenação junto com Jennifer
 */
export const elliesSupportRouter = router({
  /**
   * Enviar mensagem para Ellie
   * Processa a mensagem e retorna resposta de IA
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1).max(1000),
        context: z.enum(["coordination", "student", "general"]).default("general"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const systemPrompt = getSystemPrompt(input.context);

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: input.message,
            },
          ],
        });

        const assistantResponse =
          response.choices[0]?.message?.content || "Desculpe, não consegui processar sua pergunta.";

        return {
          success: true,
          response: assistantResponse,
          context: input.context,
          timestamp: new Date(),
        };
      } catch (error) {
        throw new Error(
          `Erro ao processar mensagem: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    }),

  /**
   * Obter contexto de coordenação
   * Retorna informações sobre alunos, turmas e atendimentos
   */
  getCoordinationContext: protectedProcedure
    .input(
      z.object({
        type: z.enum(["students", "classes", "tickets", "summary"]).default("summary"),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Simular dados de contexto
        const context = {
          students: {
            total: 182,
            active: 180,
            inactive: 2,
            lastUpdated: new Date(),
          },
          classes: {
            total: 12,
            active: 11,
            upcoming: 1,
          },
          tickets: {
            open: 5,
            inProgress: 3,
            closed: 28,
          },
          summary: {
            message: "Sistema funcionando normalmente. 182 alunos ativos, 12 turmas.",
            status: "healthy",
          },
        };

        return {
          success: true,
          data: context[input.type],
          timestamp: new Date(),
        };
      } catch (error) {
        throw new Error(
          `Erro ao obter contexto: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    }),

  /**
   * Listar tickets de atendimento
   */
  getTickets: protectedProcedure
    .input(
      z.object({
        status: z.enum(["open", "inProgress", "closed", "all"]).default("all"),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Simular tickets
        const allTickets = [
          {
            id: "1",
            title: "Dúvida sobre sincronização de alunos",
            description: "Como sincronizar 182 alunos do Dashboard?",
            status: "closed",
            priority: "high",
            createdAt: new Date(Date.now() - 86400000),
            resolvedAt: new Date(Date.now() - 43200000),
            assignedTo: "Ellie",
          },
          {
            id: "2",
            title: "Problema com geração de mensagens",
            description: "Mensagens WhatsApp não estão sendo geradas",
            status: "inProgress",
            priority: "high",
            createdAt: new Date(Date.now() - 3600000),
            resolvedAt: null,
            assignedTo: "Ellie",
          },
          {
            id: "3",
            title: "Teste com alunos piloto",
            description: "Validar fluxo com 5 alunos piloto",
            status: "open",
            priority: "medium",
            createdAt: new Date(),
            resolvedAt: null,
            assignedTo: "Jennifer",
          },
        ];

        const filtered =
          input.status === "all"
            ? allTickets
            : allTickets.filter((t) => t.status === input.status);

        return {
          success: true,
          tickets: filtered.slice(0, input.limit),
          total: filtered.length,
          timestamp: new Date(),
        };
      } catch (error) {
        throw new Error(
          `Erro ao listar tickets: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    }),

  /**
   * Criar novo ticket de atendimento
   */
  createTicket: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5).max(200),
        description: z.string().min(10).max(2000),
        priority: z.enum(["low", "medium", "high"]).default("medium"),
        category: z.enum(["coordination", "student", "technical", "other"]).default("other"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const ticketId = `ticket_${Date.now()}`;

        return {
          success: true,
          ticketId,
          title: input.title,
          description: input.description,
          priority: input.priority,
          category: input.category,
          status: "open",
          createdAt: new Date(),
          createdBy: ctx.user.name,
          assignedTo: "Ellie",
          message: `Ticket criado com sucesso! ID: ${ticketId}. Ellie ou Jennifer entrarão em contato em breve.`,
        };
      } catch (error) {
        throw new Error(
          `Erro ao criar ticket: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    }),

  /**
   * Obter histórico de conversa
   */
  getConversationHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Simular histórico
        const history = [
          {
            id: "1",
            role: "assistant",
            content: "Olá! Sou a Ellie, sua coordenadora virtual.",
            timestamp: new Date(Date.now() - 86400000),
          },
          {
            id: "2",
            role: "user",
            content: "Como sincronizar os 182 alunos?",
            timestamp: new Date(Date.now() - 86300000),
          },
          {
            id: "3",
            role: "assistant",
            content:
              "Você pode sincronizar os alunos acessando /admin/bulk-sync e clicando em 'Sincronizar 182 Alunos'.",
            timestamp: new Date(Date.now() - 86200000),
          },
        ];

        return {
          success: true,
          history: history.slice(0, input.limit),
          total: history.length,
          timestamp: new Date(),
        };
      } catch (error) {
        throw new Error(
          `Erro ao obter histórico: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    }),
});

/**
 * Obter prompt de sistema baseado no contexto
 */
function getSystemPrompt(context: "coordination" | "student" | "general"): string {
  const basePrompt = `Você é Ellie, uma coordenadora virtual amigável e profissional da inFlux School. 
Você trabalha junto com Jennifer para fornecer suporte de coordenação.
Sempre responda em português brasileiro de forma clara, concisa e útil.
Use emojis ocasionalmente para tornar a conversa mais amigável.
Mantenha um tom profissional mas acessível.`;

  const contextPrompts = {
    coordination: `${basePrompt}
Você é especialista em:
- Gestão de alunos e turmas
- Atendimento pedagógico
- Sincronização de dados
- Geração de relatórios
- Coordenação de atividades
Quando não souber algo, sugira contato com Jennifer ou ofereça criar um ticket.`,

    student: `${basePrompt}
Você está ajudando com questões relacionadas a alunos.
Forneça informações sobre:
- Status de alunos
- Progresso e desempenho
- Inscrições em cursos
- Acesso a materiais
Sempre priorize a experiência do aluno.`,

    general: `${basePrompt}
Você pode ajudar com qualquer pergunta sobre a plataforma.
Se necessário, redirecione para o departamento apropriado.`,
  };

  return contextPrompts[context];
}
