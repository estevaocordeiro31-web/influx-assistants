import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { transcribeAudio } from "../_core/voiceTranscription";
import { addMessageToConversation, getStudentProfile, getDb } from "../db";
import { TRPCError } from "@trpc/server";
import { storagePut } from "../storage";

export const pronunciationRouter = router({
  /**
   * Upload de áudio base64 para S3 — retorna URL pública para transcrever
   */
  uploadAudio: protectedProcedure
    .input(
      z.object({
        audioBase64: z.string().min(1),
        mimeType: z.string().default("audio/webm"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const buffer = Buffer.from(input.audioBase64, "base64");
      if (buffer.length > 16 * 1024 * 1024) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Áudio muito grande. Máximo: 16MB" });
      }
      const ext = input.mimeType.includes("webm") ? "webm" : input.mimeType.includes("mp4") ? "mp4" : "mp3";
      const fileKey = `audio/${ctx.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const { url } = await storagePut(fileKey, buffer, input.mimeType);
      return { url };
    }),


  transcribeAndEvaluate: protectedProcedure
    .input(
      z.object({
        audioUrl: z.string().url(),
        conversationId: z.number(),
        originalText: z.string().optional(),
        language: z.string().default("en"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        // Transcrever áudio
        const transcriptionResult = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: input.language,
          prompt: "Transcrição de prática de inglês",
        });

        if (!transcriptionResult || !(transcriptionResult as any).text) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao transcrever áudio",
          });
        }

        const transcribedText = (transcriptionResult as any).text;

        // Avaliar pronúncia com IA
        const evaluationPrompt = `Você é um especialista em pronúncia de inglês. Analise a transcrição de áudio de um aluno e forneça feedback detalhado.

ÁUDIO TRANSCRITO: "${transcribedText}"
${input.originalText ? `TEXTO ESPERADO: "${input.originalText}"` : ""}

Forneça:
1. SCORE (0-100): Avaliação geral de pronúncia
2. ACURÁCIA: Quanto a transcrição corresponde ao esperado (se fornecido)
3. CLAREZA: Clareza da fala
4. FLUÊNCIA: Fluidez da pronúncia
5. FEEDBACK: Sugestões específicas de melhoria
6. CHUNKS_IDENTIFICADOS: Chunks ou expressões identificadas na fala

Responda em JSON estruturado.`;

        const evaluationResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em avaliação de pronúncia de inglês. Sempre responda em JSON válido.",
            },
            {
              role: "user",
              content: evaluationPrompt,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "pronunciation_evaluation",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  score: {
                    type: "number",
                    description: "Score de pronúncia de 0 a 100",
                  },
                  accuracy: {
                    type: "string",
                    description: "Nível de acurácia",
                  },
                  clarity: {
                    type: "string",
                    description: "Nível de clareza",
                  },
                  fluency: {
                    type: "string",
                    description: "Nível de fluência",
                  },
                  feedback: {
                    type: "string",
                    description: "Feedback detalhado",
                  },
                  chunks_identified: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Chunks identificados",
                  },
                },
                required: [
                  "score",
                  "accuracy",
                  "clarity",
                  "fluency",
                  "feedback",
                  "chunks_identified",
                ],
                additionalProperties: false,
              },
            },
          },
        });

        const evaluationContent = evaluationResponse.choices[0]?.message?.content;
        let evaluation;

        if (typeof evaluationContent === "string") {
          try {
            evaluation = JSON.parse(evaluationContent);
          } catch (e) {
            evaluation = {
              score: 0,
              accuracy: "Erro ao avaliar",
              clarity: "N/A",
              fluency: "N/A",
              feedback: "Não foi possível avaliar a pronúncia",
              chunks_identified: [],
            };
          }
        }

        // Salvar mensagem com áudio e transcrição
        await addMessageToConversation({
          conversationId: input.conversationId,
          role: "user",
          content: `[ÁUDIO] Pronúncia: "${transcribedText}"`,
          audioUrl: input.audioUrl,
          audioTranscription: transcribedText,
          pronunciationScore: evaluation?.score ? String(evaluation.score) : "0",
          chunksUsed: JSON.stringify(evaluation?.chunks_identified || []),
          createdAt: new Date(),
        });

        // Criar resposta do assistente com feedback
        const feedbackMessage = `
**AVALIAÇÃO DE PRONÚNCIA** 🎤

**Score:** ${evaluation?.score || 0}/100

**Análise:**
- **Acurácia:** ${evaluation?.accuracy || "N/A"}
- **Clareza:** ${evaluation?.clarity || "N/A"}
- **Fluência:** ${evaluation?.fluency || "N/A"}

**Feedback:**
${evaluation?.feedback || "Não foi possível gerar feedback"}

**Chunks Identificados:**
${
  evaluation?.chunks_identified && evaluation.chunks_identified.length > 0
    ? evaluation.chunks_identified.map((c: string) => `- ${c}`).join("\n")
    : "Nenhum chunk específico identificado"
}

Parabéns pela prática! Continue trabalhando nesses pontos para melhorar sua pronúncia.
`;

        await addMessageToConversation({
          conversationId: input.conversationId,
          role: "assistant",
          content: feedbackMessage,
          createdAt: new Date(),
        });

        return {
          transcribedText,
          evaluation,
          feedbackMessage,
        };
      } catch (error) {
        console.error("[Pronunciation] Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao processar pronúncia",
        });
      }
    }),

  getStudentPronunciationStats: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return {
      totalAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      recentScores: [],
    };
  }),
});
