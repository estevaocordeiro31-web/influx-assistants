import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { 
  createConversation, 
  getConversationMessages, 
  addMessageToConversation,
  getStudentProfile,
  getChunksByContext,
} from "../db";
import { TRPCError } from "@trpc/server";

const INFLUX_SYSTEM_PROMPT = `Você é um assistente de ensino de inglês especializado na metodologia inFlux de Chunks e Equivalência.

METODOLOGIA INFLIX:
- Chunks: Combinações naturais de palavras usadas por nativos (ex: "I would like to", "Could you help me?")
- Equivalência: Tradução natural para português que mantém o significado e uso

SUAS RESPONSABILIDADES:
1. Ensinar chunks reais usados por nativos, não regras gramaticais isoladas
2. Sempre fornecer equivalências em português para clareza
3. Corrigir erros de forma construtiva, explicando o chunk correto
4. Propor novos chunks baseado no nível e contexto do aluno
5. Usar exemplos práticos e situações reais

FORMATO DE RESPOSTA:
- Sempre que ensinar um chunk, use este formato:
  **CHUNK:** [expressão em inglês]
  **EQUIVALÊNCIA:** [tradução natural em português]
  **EXPLICAÇÃO:** [quando e como usar]
  **EXEMPLO:** [frase completa de exemplo]

- Mantenha as respostas conversacionais e encorajadoras
- Adapte o nível de complexidade ao progresso do aluno`;

export const chatRouter = router({
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number().optional(),
        objective: z.string().optional(),
        level: z.string().optional(),
        message: z.string().min(1),
        // Modo voz (ElieVoiceDemo): resposta longa/estruturada (CHUNK/
        // EQUIVALÊNCIA/EXPLICAÇÃO/EXEMPLO) é ótima pra ler na tela, péssima
        // pra ouvir — Estevao pediu latência menor; a resposta inteira
        // precisa ser gerada E falada, então respostas mais curtas ajudam
        // nos dois (menos tempo de geração, menos tempo de fala).
        voiceMode: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const studentProfile = await getStudentProfile(ctx.user.id);
        
        let conversationId = input.conversationId;
        
        if (!conversationId) {
          const newConversation = await createConversation({
            studentId: ctx.user.id,
            simulationType: (input.objective || studentProfile?.objective || "free_chat") as any,
            title: input.message.substring(0, 50),
            startedAt: new Date(),
            createdAt: new Date(),
          });
          
          if (!newConversation) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Falha ao criar conversa" });
          }
          
          // drizzle/mysql2 retorna [ResultSetHeader] (insertId em [0]); o mock de teste
          // retorna { insertId }. Cobrir os dois formatos — senão conversationId fica
          // undefined e o insert em `messages` falha (conversation_id sem default).
          conversationId = ((newConversation as any).insertId ?? (newConversation as any)[0]?.insertId) as number;
          if (!conversationId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Falha ao obter id da conversa" });
          }
        }

        const previousMessages = await getConversationMessages(conversationId);
        const objective = input.objective || studentProfile?.objective || "general";
        const relevantChunks = await getChunksByContext(objective);
        
        const chunksContext = relevantChunks
          .slice(0, 5)
          .map(c => `- "${c.englishChunk}" (${c.portugueseEquivalent}): ${c.example || 'Exemplo não disponível'}`)
          .join("\n");

        const voiceModeInstruction = input.voiceMode
          ? "\n\nMODO VOZ ATIVO: sua resposta vai ser FALADA em voz alta pra um avatar, não lida na tela. Responda de forma BREVE e conversacional — 1 a 3 frases curtas, como numa ligação de verdade. NÃO use o formato CHUNK/EQUIVALÊNCIA/EXPLICAÇÃO/EXEMPLO nem listas — fale o chunk e a equivalência dentro da própria frase, naturalmente."
          : "";

        const llmMessages = [
          {
            role: "system" as const,
            content: `${INFLUX_SYSTEM_PROMPT}\n\nChunks relevantes para este aluno:\n${chunksContext}${voiceModeInstruction}`,
          },
          ...previousMessages.map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
          {
            role: "user" as const,
            content: input.message,
          },
        ];

        const response = await invokeLLM({
          messages: llmMessages,
          ...(input.voiceMode ? { maxTokens: 220 } : {}),
        });

        const assistantMessage = typeof response.choices[0]?.message?.content === 'string' 
          ? response.choices[0].message.content 
          : "Desculpe, não consegui processar sua mensagem.";

        await addMessageToConversation({
          conversationId,
          role: "user",
          content: input.message,
          createdAt: new Date(),
        });

        await addMessageToConversation({
          conversationId,
          role: "assistant",
          content: assistantMessage,
          createdAt: new Date(),
        });

        return {
          conversationId,
          message: assistantMessage,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("[Chat] Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao processar mensagem",
        });
      }
    }),

  getConversation: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const messages = await getConversationMessages(input.conversationId);
        return messages;
      } catch (error) {
        console.error("[Chat] Error fetching conversation:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  listConversations: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const { getConversationsByStudent } = await import("../db");
      return await getConversationsByStudent(ctx.user.id);
    } catch (error) {
      console.error("[Chat] Error listing conversations:", error);
      return [];
    }
  }),
});
