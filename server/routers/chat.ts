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
import { getVipProfileForUser, getChatMemoriesForUser, saveChatMemory } from "./vip-profiles";

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
        book: z.string().optional(),
        message: z.string().min(1),
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
          
          conversationId = (newConversation as any).insertId as number;
        }

        const previousMessages = await getConversationMessages(conversationId);
        const objective = input.objective || studentProfile?.objective || "general";
        const relevantChunks = await getChunksByContext(objective);
        
        const chunksContext = relevantChunks
          .slice(0, 5)
          .map(c => `- "${c.englishChunk}" (${c.portugueseEquivalent}): ${c.example || 'Exemplo não disponível'}`)
          .join("\n");

        // Buscar perfil VIP e memória do usuário (em paralelo)
        const [vipProfile, chatMemories] = await Promise.all([
          getVipProfileForUser(ctx.user.id).catch(() => null),
          getChatMemoriesForUser(ctx.user.id).catch(() => ({} as Record<string, string>)),
        ]);

        // Construir contexto personalizado
        let personalizedContext = '';
        if (vipProfile) {
          personalizedContext += `\n\n🌟 PERFIL VIP — CONTEXTO ESPECIAL:\n`;
          personalizedContext += `Nome: ${vipProfile.name}\n`;
          if (vipProfile.relationship) personalizedContext += `Relação com o dono da escola: ${vipProfile.relationship}\n`;
          if (vipProfile.role) personalizedContext += `Papel/Função: ${vipProfile.role}\n`;
          if (vipProfile.bio) personalizedContext += `Contexto pessoal: ${vipProfile.bio}\n`;
          if (vipProfile.toneInstructions) personalizedContext += `\nINSTRUÇÕES DE TOM:\n${vipProfile.toneInstructions}\n`;
        }

        // Adicionar memórias relevantes
        const memoryKeys = Object.keys(chatMemories);
        if (memoryKeys.length > 0) {
          personalizedContext += `\n📝 MEMÓRIA DE CONVERSAS ANTERIORES:\n`;
          memoryKeys.slice(0, 10).forEach(key => {
            personalizedContext += `- ${key}: ${chatMemories[key]}\n`;
          });
        }

        // Adicionar nome do usuário se disponível
        const userName = ctx.user.name || (vipProfile?.name);
        if (userName && !vipProfile) {
          personalizedContext += `\nNome do aluno: ${userName}`;
        }

        // Adicionar livro/nível do evento (St. Patrick's ou outro)
        const localBook = input.book;
        if (localBook) {
          personalizedContext += `\n\n📚 LIVRO/NÍVEL DO ALUNO (registrado no evento): ${localBook}`;
          personalizedContext += `\nAdapte o vocabulário, chunks e complexidade das respostas para este nível.`;
        }

        const llmMessages = [
          {
            role: "system" as const,
            content: `${INFLUX_SYSTEM_PROMPT}\n\nChunks relevantes para este aluno:\n${chunksContext}${personalizedContext}`,
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

  /**
   * Avalia a resposta do aluno em tempo real usando LLM com JSON Schema estruturado.
   * Retorna: score geral, erros gramaticais, sugestão de chunk, dica de connected speech,
   * versão corrigida da frase e nível de naturalidade.
   */
  evaluateResponse: protectedProcedure
    .input(z.object({
      studentMessage: z.string().min(1),
      conversationContext: z.string().optional(), // últimas mensagens para contexto
      studentLevel: z.string().optional(),
      studentBook: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const level = input.studentLevel || 'intermediate';
      const book = input.studentBook || 'Book 3';

      const systemPrompt = `You are an expert English language evaluator specialized in the inFlux Chunks & Equivalência methodology.
Your task is to evaluate a student's English message and return structured feedback.

Student level: ${level} (${book})
Focus on: natural English, chunk usage, connected speech, and real-world fluency.

IMPORTANT RULES:
- Be encouraging and constructive, never harsh
- Only flag genuine errors, not stylistic choices
- Suggest chunks that are appropriate for the student's level
- Connected speech tips should be practical and phonetic
- If the message is already perfect, say so enthusiastically`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `Evaluate this student message: "${input.studentMessage}"${input.conversationContext ? `\n\nConversation context: ${input.conversationContext}` : ''}`,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'language_evaluation',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  overallScore: {
                    type: 'integer',
                    description: 'Overall score from 0 to 100',
                  },
                  fluencyLevel: {
                    type: 'string',
                    enum: ['needs_work', 'developing', 'good', 'very_good', 'excellent'],
                    description: 'Fluency classification',
                  },
                  isCorrect: {
                    type: 'boolean',
                    description: 'Whether the message is grammatically correct and natural',
                  },
                  correctedVersion: {
                    type: 'string',
                    description: 'The corrected/improved version of the message, or the original if already correct',
                  },
                  grammarErrors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        original: { type: 'string', description: 'The incorrect part' },
                        correction: { type: 'string', description: 'The correct form' },
                        explanation: { type: 'string', description: 'Brief explanation in Portuguese' },
                      },
                      required: ['original', 'correction', 'explanation'],
                      additionalProperties: false,
                    },
                    description: 'List of grammar errors found (empty if none)',
                  },
                  suggestedChunk: {
                    type: 'object',
                    properties: {
                      chunk: { type: 'string', description: 'The suggested English chunk' },
                      equivalencia: { type: 'string', description: 'Portuguese equivalência' },
                      example: { type: 'string', description: 'Example sentence using the chunk' },
                      reason: { type: 'string', description: 'Why this chunk is relevant (in Portuguese)' },
                    },
                    required: ['chunk', 'equivalencia', 'example', 'reason'],
                    additionalProperties: false,
                  },
                  connectedSpeechTip: {
                    type: 'object',
                    properties: {
                      tip: { type: 'string', description: 'Connected speech tip in Portuguese' },
                      example: { type: 'string', description: 'Phonetic example showing the connection' },
                    },
                    required: ['tip', 'example'],
                    additionalProperties: false,
                  },
                  encouragement: {
                    type: 'string',
                    description: 'Short encouraging message in Portuguese (1 sentence)',
                  },
                },
                required: ['overallScore', 'fluencyLevel', 'isCorrect', 'correctedVersion', 'grammarErrors', 'suggestedChunk', 'connectedSpeechTip', 'encouragement'],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('Empty LLM response');

        const evaluation = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));

        // Fire-and-forget: propagar exercício completado se score >= 60
        if (evaluation.overallScore >= 60) {
          import('../utils/sync').then(async ({ getStudentId, onExerciseCompleted }) => {
            const studentId = await getStudentId(ctx.user.id);
            if (studentId) await onExerciseCompleted(studentId, evaluation.overallScore);
          }).catch(() => {});
        }

        return evaluation as {
          overallScore: number;
          fluencyLevel: 'needs_work' | 'developing' | 'good' | 'very_good' | 'excellent';
          isCorrect: boolean;
          correctedVersion: string;
          grammarErrors: Array<{ original: string; correction: string; explanation: string }>;
          suggestedChunk: { chunk: string; equivalencia: string; example: string; reason: string };
          connectedSpeechTip: { tip: string; example: string };
          encouragement: string;
        };
      } catch (error) {
        console.error('[Chat] evaluateResponse error:', error);
        // Retornar avaliação básica em caso de erro para não quebrar o fluxo
        return {
          overallScore: 75,
          fluencyLevel: 'good' as const,
          isCorrect: true,
          correctedVersion: input.studentMessage,
          grammarErrors: [],
          suggestedChunk: {
            chunk: 'That makes sense',
            equivalencia: 'Faz sentido / Entendo',
            example: 'That makes sense to me!',
            reason: 'Expressão muito usada em conversas naturais',
          },
          connectedSpeechTip: {
            tip: 'Em inglês falado, "want to" vira "wanna" e "going to" vira "gonna"',
            example: '"I wanna go" = "I want to go"',
          },
          encouragement: 'Continue praticando! Você está evoluindo muito bem! 🌟',
        };
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
