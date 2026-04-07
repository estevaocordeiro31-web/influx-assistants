import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { invokeLLM } from '../_core/llm';
import { getDb } from '../db';
import { chunks, studentChunkProgress } from '../../drizzle/schema';
import { eq, inArray } from 'drizzle-orm';

// Tipos de resposta
interface PronunciationFeedback {
  word: string;
  ipa: string;
  tips: string[];
}

interface ConnectedSpeechTip {
  rule: string;
  example: string;
  explanation: string;
}

interface RealEnglishNote {
  formal: string;
  colloquial: string;
  explanation: string;
  level: string;
}

interface PersonalizedTutorResponse {
  message: string;
  pronunciation?: PronunciationFeedback;
  connectedSpeech?: ConnectedSpeechTip;
  realEnglishNote?: RealEnglishNote;
  usedChunks?: string[];
}

// Mapeamento de níveis para CEFR
const LEVEL_TO_CEFR: Record<string, string> = {
  beginner: 'A1',
  elementary: 'A2',
  intermediate: 'B1',
  upper_intermediate: 'B2',
  advanced: 'C1',
  proficient: 'C2',
};

// Connected speech rules por nível CEFR
const CONNECTED_SPEECH_RULES = {
  A1: [],
  A2: [
    {
      rule: 'Linking',
      example: 'I want to → I wanna',
      explanation: 'When a word ends with a consonant and the next starts with a vowel, they blend.',
    },
  ],
  B1: [
    {
      rule: 'Linking',
      example: 'I want to → I wanna',
      explanation: 'When a word ends with a consonant and the next starts with a vowel, they blend.',
    },
    {
      rule: 'Elision',
      example: 'next day → nex day',
      explanation: 'Sounds are dropped when difficult to pronounce together.',
    },
  ],
  B2: [
    {
      rule: 'Assimilation',
      example: 'that girl → thag girl',
      explanation: 'A sound changes to become more like the sound that follows it.',
    },
    {
      rule: 'Intrusion',
      example: 'law and order → law-r-and order',
      explanation: 'A sound is inserted between two vowels.',
    },
  ],
  C1: [
    {
      rule: 'Palatalization',
      example: 'did you → didja',
      explanation: 'Sounds change due to the influence of nearby sounds.',
    },
  ],
  C2: [
    {
      rule: 'Weakening',
      example: 'probably → prob\'ly',
      explanation: 'Sounds become weaker or disappear in connected speech.',
    },
  ],
};

// Função para gerar prompt personalizado
function generatePersonalizedTutorPrompt(
  studentMessage: string,
  studentLevel: string,
  studentChunks: string[],
  context: string
): string {
  const cefr = LEVEL_TO_CEFR[studentLevel] || 'B1';
  const connectedSpeechRules = CONNECTED_SPEECH_RULES[cefr as keyof typeof CONNECTED_SPEECH_RULES] || [];

  return `You are an English tutor for a student at level ${cefr} (${studentLevel}).

IMPORTANT: Only use vocabulary and grammar from the student's current level and chunks they have studied:
${studentChunks.slice(0, 20).map((chunk) => `- ${chunk}`).join('\n')}

Student's message: "${studentMessage}"

Respond with JSON containing:
{
  "message": "Your personalized response using ONLY vocabulary from the student's chunks",
  "pronunciation": {
    "word": "A word from the student's message to focus on",
    "ipa": "IPA transcription",
    "tips": ["Pronunciation tip 1", "Pronunciation tip 2"]
  },
  "connectedSpeech": {
    "rule": "Connected speech rule (if applicable)",
    "example": "Example from the student's message or similar",
    "explanation": "Why this rule applies"
  },
  "realEnglishNote": {
    "formal": "Formal way to say it",
    "colloquial": "How native speakers really say it",
    "explanation": "Why the difference exists",
    "level": "${cefr}"
  }
}

Connected Speech Rules for this level:
${connectedSpeechRules.map((rule) => `- ${rule.rule}: ${rule.example} (${rule.explanation})`).join('\n')}

Context: ${context}

Remember: 
1. ONLY use vocabulary from the student's chunks
2. Focus on REAL ENGLISH that native speakers actually use
3. Adapt complexity to ${cefr} level
4. If the student uses words outside their level, gently correct and provide the simpler version`;
}

export const tutorPersonalizedV2Router = router({
  // Chat personalizado com o tutor
  chatPersonalized: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        message: z.string(),
        studentLevel: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { studentId, message, studentLevel } = input;

      // Verificar se o aluno tem acesso
      if (ctx.user?.id !== studentId && ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      try {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        // Buscar chunks do aluno
        const studentChunksData = await db
          .select()
          .from(studentChunkProgress)
          .where(eq(studentChunkProgress.studentId, studentId));

        const chunkIds = studentChunksData.map((sc: any) => sc.chunkId);
        let chunkTexts: string[] = [];

        if (chunkIds.length > 0) {
          const chunkContents = await db
            .select()
            .from(chunks)
            .where(inArray(chunks.id, chunkIds));
          chunkTexts = chunkContents.map((c: any) => c.englishChunk).filter(Boolean);
        }

        // Gerar prompt personalizado com chunks do aluno
        const systemPrompt = generatePersonalizedTutorPrompt(
          message,
          studentLevel,
          chunkTexts,
          'Student is learning English with focus on real speech patterns'
        );

        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: message,
            },
          ] as any,
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'personalized_tutor_response',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  pronunciation: {
                    type: 'object',
                    properties: {
                      word: { type: 'string' },
                      ipa: { type: 'string' },
                      tips: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                    },
                  },
                  connectedSpeech: {
                    type: 'object',
                    properties: {
                      rule: { type: 'string' },
                      example: { type: 'string' },
                      explanation: { type: 'string' },
                    },
                  },
                  realEnglishNote: {
                    type: 'object',
                    properties: {
                      formal: { type: 'string' },
                      colloquial: { type: 'string' },
                      explanation: { type: 'string' },
                      level: { type: 'string' },
                    },
                  },
                },
                required: ['message'],
              },
            },
          },
        });

        const content = response.choices[0].message.content;
        const parsedResponse = typeof content === 'string' ? JSON.parse(content) : content;

        return {
          ...parsedResponse,
          usedChunks: chunkTexts.slice(0, 5),
        } as PersonalizedTutorResponse;
      } catch (error) {
        console.error('Error in personalized tutor chat:', error);
        throw error;
      }
    }),

  // Obter chunks do aluno para contexto
  getStudentChunks: protectedProcedure
    .input(z.object({ studentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { studentId } = input;

      // Verificar se o aluno tem acesso
      if (ctx.user?.id !== studentId && ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const studentChunksData = await db
        .select()
        .from(studentChunkProgress)
        .where(eq(studentChunkProgress.studentId, studentId));

      const chunkIds = studentChunksData.map((sc: any) => sc.chunkId);
      let chunkContents: any[] = [];

      if (chunkIds.length > 0) {
        chunkContents = await db
          .select()
          .from(chunks)
          .where(inArray(chunks.id, chunkIds));
      }

      return {
        count: chunkContents.length,
        chunks: chunkContents.map((c: any) => ({
          id: c.id,
          content: c.englishChunk,
        })),
      };
    }),

  // Validar se mensagem usa vocabulário apropriado
  validateVocabulary: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        message: z.string(),
        studentLevel: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { studentId, message, studentLevel } = input;

      // Verificar se o aluno tem acesso
      if (ctx.user?.id !== studentId && ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      try {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        // Buscar chunks do aluno
        const studentChunksData = await db
          .select()
          .from(studentChunkProgress)
          .where(eq(studentChunkProgress.studentId, studentId));

        const chunkIds = studentChunksData.map((sc: any) => sc.chunkId);
        let chunkTexts: string[] = [];

        if (chunkIds.length > 0) {
          const chunkContents = await db
            .select()
            .from(chunks)
            .where(inArray(chunks.id, chunkIds));
          chunkTexts = chunkContents.map((c: any) => c.englishChunk).filter(Boolean);
        }

        const cefr = LEVEL_TO_CEFR[studentLevel] || 'B1';

        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `You are an English vocabulary validator. Analyze if the student's message uses vocabulary appropriate for their level (${cefr}).

Student's allowed vocabulary:
${chunkTexts.slice(0, 20).join('\n')}

Respond with JSON:
{
  "isAppropriate": true/false,
  "level": "${cefr}",
  "unknownWords": ["word1", "word2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`,
            },
            {
              role: 'user',
              content: `Validate this message: "${message}"`,
            },
          ] as any,
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'vocabulary_validation',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  isAppropriate: { type: 'boolean' },
                  level: { type: 'string' },
                  unknownWords: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  suggestions: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
                required: ['isAppropriate', 'level'],
              },
            },
          },
        });

        const content = response.choices[0].message.content;
        return typeof content === 'string' ? JSON.parse(content) : content;
      } catch (error) {
        console.error('Error validating vocabulary:', error);
        throw error;
      }
    }),
});
