/**
 * Tutor Personalized Router
 * 
 * Integra o tutor IA com filtros de conteúdo por nível do aluno
 * Adapta respostas, sugestões e exemplos baseado no Book do aluno (1-5)
 */

import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { invokeLLM } from '../_core/llm';
import { getDb } from '../db';
import { users, studentProfiles, chunks } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

// ============================================================================
// LEVEL MAPPING
// ============================================================================

const BOOK_TO_LEVEL = {
  1: 'beginner',
  2: 'elementary',
  3: 'intermediate',
  4: 'upper_intermediate',
  5: 'advanced',
} as const;

const LEVEL_DESCRIPTIONS = {
  beginner: 'Book 1 - Iniciante: Vocabulário básico, estruturas simples',
  elementary: 'Book 2 - Elementar: Presente/Passado simples, conversas básicas',
  intermediate: 'Book 3 - Intermediário: Tempos compostos, conversas cotidianas',
  upper_intermediate: 'Book 4 - Intermediário Superior: Estruturas complexas, discussões',
  advanced: 'Book 5 - Avançado: Nuances, idiomas, discussões profundas',
} as const;

// ============================================================================
// CONTENT FILTERS BY LEVEL
// ============================================================================

const VOCABULARY_RESTRICTIONS = {
  beginner: {
    maxWords: 500,
    topics: ['greetings', 'numbers', 'basic_objects', 'family', 'colors'],
    excludeTopics: ['idioms', 'slang', 'technical_terms'],
  },
  elementary: {
    maxWords: 1500,
    topics: ['daily_routines', 'shopping', 'food', 'travel_basics', 'work'],
    excludeTopics: ['advanced_idioms', 'business_jargon'],
  },
  intermediate: {
    maxWords: 3000,
    topics: ['current_events', 'culture', 'relationships', 'career', 'hobbies'],
    excludeTopics: ['highly_technical', 'rare_idioms'],
  },
  upper_intermediate: {
    maxWords: 5000,
    topics: ['politics', 'technology', 'philosophy', 'business', 'media'],
    excludeTopics: [],
  },
  advanced: {
    maxWords: 10000,
    topics: ['all'],
    excludeTopics: [],
  },
} as const;

// ============================================================================
// PROMPT GENERATION WITH LEVEL ADAPTATION
// ============================================================================

function generatePersonalizedTutorPrompt(
  message: string,
  studentLevel: string,
  bookNumber: number,
  studentChunks: any[]
): string {
  const levelDesc = LEVEL_DESCRIPTIONS[studentLevel as keyof typeof LEVEL_DESCRIPTIONS] || '';
  const vocabRestrictions = VOCABULARY_RESTRICTIONS[studentLevel as keyof typeof VOCABULARY_RESTRICTIONS];
  
  const chunkExamples = studentChunks
    .slice(0, 5)
    .map(c => `- "${c.englishChunk}" → "${c.portugueseEquivalent}"`)
    .join('\n');

  return `You are an expert English tutor specializing in personalized learning based on student level.

STUDENT PROFILE:
${levelDesc}
Current Level: ${studentLevel}
Book Number: ${bookNumber}

VOCABULARY CONSTRAINTS:
- Maximum vocabulary complexity: ${vocabRestrictions.maxWords} most common words
- Recommended topics: ${vocabRestrictions.topics.join(', ')}
- Avoid: ${vocabRestrictions.excludeTopics.join(', ') || 'none'}

STUDENT'S CURRENT CHUNKS (expressions they're learning):
${chunkExamples}

STUDENT MESSAGE: "${message}"

INSTRUCTIONS FOR THIS LEVEL:
${getLevelSpecificInstructions(studentLevel)}

Your response should:
1. Use vocabulary and grammar appropriate for ${studentLevel}
2. Reference chunks from their current study material when relevant
3. Provide examples at their level
4. Adapt pronunciation guidance to their needs
5. Suggest next steps for progression

Format your response as JSON:
{
  "message": "Your personalized response",
  "levelAppropriate": true/false,
  "suggestedChunks": ["chunk1", "chunk2"],
  "nextSteps": ["suggestion1", "suggestion2"],
  "pronunciation": {
    "word": "key word",
    "tips": ["tip1", "tip2"]
  }
}

Remember: Keep responses at the student's level. Don't introduce concepts beyond ${studentLevel}.`;
}

function getLevelSpecificInstructions(level: string): string {
  const instructions: Record<string, string> = {
    beginner: `
- Use simple present tense primarily
- Keep sentences short (under 10 words)
- Use concrete examples with pictures/objects
- Avoid phrasal verbs
- Focus on pronunciation of individual words`,
    elementary: `
- Mix present and past simple
- Introduce basic phrasal verbs
- Use common idioms (not slang)
- Include connected speech for common phrases
- Focus on natural rhythm`,
    intermediate: `
- Use various tenses (present perfect, past continuous)
- Introduce more phrasal verbs and idioms
- Explain connected speech patterns
- Discuss cultural context
- Encourage natural conversation flow`,
    upper_intermediate: `
- Use complex structures (conditionals, passive voice)
- Explain nuances between similar expressions
- Teach advanced connected speech
- Discuss register and formality
- Encourage critical thinking about language`,
    advanced: `
- Use sophisticated structures
- Discuss linguistic nuances and regional variations
- Teach advanced pronunciation patterns
- Analyze language from native speaker perspective
- Encourage mastery and refinement`,
  };
  
  return instructions[level] || instructions.intermediate;
}

// ============================================================================
// PERSONALIZED TUTOR ROUTER
// ============================================================================

export const tutorPersonalizedRouter = router({
  /**
   * Chat com tutor adaptado ao nível do aluno
   */
  chatPersonalized: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        message: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verificar acesso
        if (ctx.user?.id !== input.studentId && ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }

        const db = await getDb();
        if (!db) throw new Error('Database não disponível');

        // Obter perfil do aluno
        const student = await db
          .select()
          .from(users)
          .where(eq(users.id, input.studentId))
          .limit(1);

        if (!student.length) {
          throw new Error('Aluno não encontrado');
        }

        const profile = await db
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, input.studentId))
          .limit(1);

        if (!profile.length) {
          throw new Error('Perfil do aluno não encontrado');
        }

        // Determinar Book e Level
        const studentLevel = profile[0].currentLevel || 'beginner';
        const bookNumber = Object.entries(BOOK_TO_LEVEL).find(
          ([_, level]) => level === studentLevel
        )?.[0] || '1';

        // Obter chunks do aluno para contexto
        const studentChunks = await db
          .select()
          .from(chunks)
          .where(eq(chunks.level, studentLevel as any))
          .limit(10);

        // Gerar prompt personalizado
        const systemPrompt = generatePersonalizedTutorPrompt(
          input.message,
          studentLevel,
          parseInt(bookNumber),
          studentChunks
        );

        // Chamar LLM
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: input.message,
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
                  levelAppropriate: { type: 'boolean' },
                  suggestedChunks: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  nextSteps: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  pronunciation: {
                    type: 'object',
                    properties: {
                      word: { type: 'string' },
                      tips: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                    },
                  },
                },
                required: ['message'],
              },
            },
          },
        });

        const content = response.choices?.[0]?.message?.content;
        const parsedResponse = typeof content === 'string' ? JSON.parse(content) : content;

        return {
          success: true,
          studentLevel,
          bookNumber: parseInt(bookNumber),
          response: parsedResponse,
          studentName: student[0].name,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erro ao processar mensagem',
        };
      }
    }),

  /**
   * Obter sugestões de chunks para o nível do aluno
   */
  getChunkSuggestions: protectedProcedure
    .input(z.object({ studentId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error('Database não disponível');

        const profile = await db
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, input.studentId))
          .limit(1);

        if (!profile.length) {
          throw new Error('Perfil não encontrado');
        }

        const level = profile[0].currentLevel || 'beginner';

        // Obter chunks apropriados
        const suggestions = await db
          .select()
          .from(chunks)
          .where(eq(chunks.level, level as any))
          .limit(5);

        return {
          level,
          suggestions: suggestions.map(c => ({
            english: c.englishChunk,
            portuguese: c.portugueseEquivalent,
            context: c.context,
            frequency: c.nativeUsageFrequency,
          })),
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Erro ao obter sugestões');
      }
    }),

  /**
   * Validar se conteúdo é apropriado para o nível
   */
  validateContentLevel: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        content: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error('Database não disponível');

        const profile = await db
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, input.studentId))
          .limit(1);

        if (!profile.length) {
          throw new Error('Perfil não encontrado');
        }

        const level = profile[0].currentLevel || 'beginner';
        const vocabRestrictions = VOCABULARY_RESTRICTIONS[level as keyof typeof VOCABULARY_RESTRICTIONS];

        // Análise simples de complexidade
        const wordCount = input.content.split(/\s+/).length;
        const isAppropriate = wordCount <= vocabRestrictions.maxWords;

        return {
          level,
          wordCount,
          maxWords: vocabRestrictions.maxWords,
          isAppropriate,
          message: isAppropriate
            ? `Conteúdo apropriado para ${level}`
            : `Conteúdo muito complexo para ${level}. Máximo: ${vocabRestrictions.maxWords} palavras`,
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Erro ao validar conteúdo');
      }
    }),
});
