import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { karaokePronunciationAnalysis } from "../../drizzle/schema";
import { transcribeAudio } from "../_core/voiceTranscription";

export const pronunciationAnalysisRouter = router({
  // Analyze pronunciation from audio file
  analyzePronunciation: publicProcedure
    .input(
      z.object({
        audioUrl: z.string().url(),
        songId: z.string(),
        participantId: z.number().optional(),
        songTitle: z.string().optional(),
        expectedLyrics: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log(`[Pronunciation] Analyzing audio for song: ${input.songId}`);

        // Transcribe audio using Whisper
        const transcriptionResult = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: "en",
          prompt: `Transcribe the lyrics being sung. Song: ${input.songTitle || "Unknown"}`,
        });

        if (!transcriptionResult || !transcriptionResult.text) {
          return {
            success: false,
            error: "Failed to transcribe audio",
            analysis: null,
          };
        }

        const transcription = transcriptionResult.text;

        // Calculate pronunciation metrics
        const metrics = calculatePronunciationMetrics(
          transcription,
          input.expectedLyrics || ""
        );

        // Save analysis to database if participantId provided
        if (input.participantId) {
          const db = await getDb();
          if (db) {
            try {
              await db.insert(karaokePronunciationAnalysis).values({
                participantId: input.participantId,
                songId: input.songId,
                audioUrl: input.audioUrl,
                transcription,
                pronunciationScore: metrics.pronunciationScore,
                accuracy: metrics.accuracy,
                fluency: metrics.fluency,
                completeness: metrics.completeness,
                feedback: metrics.feedback,
                analysisData: {
                  segments: transcriptionResult.segments || [],
                  language: transcriptionResult.language,
                  duration: transcriptionResult.duration,
                },
              });
              console.log(
                `[Pronunciation] Analysis saved for participant ${input.participantId}`
              );
            } catch (dbError) {
              console.warn("Failed to save pronunciation analysis:", dbError);
            }
          }
        }

        return {
          success: true,
          analysis: {
            transcription,
            ...metrics,
            language: transcriptionResult.language,
          },
        };
      } catch (error) {
        console.error("Pronunciation analysis error:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          analysis: null,
        };
      }
    }),

  // Get analysis history for a participant
  getAnalysisHistory: publicProcedure
    .input(z.object({ participantId: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const { eq } = await import("drizzle-orm");
        const history = await db
          .select()
          .from(karaokePronunciationAnalysis)
          .where(eq(karaokePronunciationAnalysis.participantId, input.participantId))
          .orderBy((t) => t.createdAt);

        return history;
      } catch (error) {
        console.error("Error fetching analysis history:", error);
        return [];
      }
    }),

  // Get average pronunciation score for a participant
  getAverageScore: publicProcedure
    .input(z.object({ participantId: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return null;

        const { eq, avg } = await import("drizzle-orm");
        const result = await db
          .select({
            avgPronunciation: avg(
              karaokePronunciationAnalysis.pronunciationScore
            ),
            avgAccuracy: avg(karaokePronunciationAnalysis.accuracy),
            avgFluency: avg(karaokePronunciationAnalysis.fluency),
            avgCompleteness: avg(karaokePronunciationAnalysis.completeness),
            totalAnalyses: () => 1,
          })
          .from(karaokePronunciationAnalysis)
          .where(
            eq(karaokePronunciationAnalysis.participantId, input.participantId)
          );

        return result[0] || null;
      } catch (error) {
        console.error("Error calculating average score:", error);
        return null;
      }
    }),
});

// Helper function to calculate pronunciation metrics
function calculatePronunciationMetrics(
  transcription: string,
  expectedLyrics: string
) {
  const normalizeText = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");

  const normalized = normalizeText(transcription);
  const normalizedExpected = normalizeText(expectedLyrics);

  // Calculate accuracy (word-level matching)
  const transcribedWords = normalized.split(/\s+/).filter((w) => w);
  const expectedWords = normalizedExpected.split(/\s+/).filter((w) => w);

  let matchedWords = 0;
  for (const word of transcribedWords) {
    if (expectedWords.some((w) => w.includes(word) || word.includes(w))) {
      matchedWords++;
    }
  }

  const accuracy =
    expectedWords.length > 0
      ? Math.round((matchedWords / expectedWords.length) * 100)
      : 0;

  // Calculate completeness (coverage of expected lyrics)
  const completeness =
    transcribedWords.length > 0
      ? Math.round((transcribedWords.length / expectedWords.length) * 100)
      : 0;

  // Estimate fluency based on transcription length and smoothness
  // Longer, continuous transcriptions indicate better fluency
  const fluency = Math.min(
    100,
    Math.round(
      (transcribedWords.length / Math.max(expectedWords.length, 5)) * 80
    )
  );

  // Overall pronunciation score (weighted average)
  const pronunciationScore = Math.round(
    (accuracy * 0.4 + fluency * 0.3 + completeness * 0.3) / 100 * 100
  );

  // Generate feedback
  let feedback = "";
  if (accuracy >= 80) {
    feedback = "🌟 Excelente pronúncia! Você acertou a maioria das palavras.";
  } else if (accuracy >= 60) {
    feedback =
      "👍 Bom trabalho! Tente focar nas palavras que não acertou.";
  } else if (accuracy >= 40) {
    feedback =
      "💪 Você está no caminho certo! Pratique mais para melhorar.";
  } else {
    feedback =
      "🎯 Continua tentando! Escuta a música novamente e tente de novo.";
  }

  if (completeness < 50) {
    feedback += " Tente cantar a música inteira!";
  }

  return {
    pronunciationScore,
    accuracy,
    fluency,
    completeness,
    feedback,
  };
}
