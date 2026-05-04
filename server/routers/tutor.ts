import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { invokeLLM } from '../_core/llm';
import { transcribeAudio } from '../_core/voiceTranscription';

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
  level: 'B1' | 'B2' | 'C1' | 'C2';
}

interface TutorResponse {
  message: string;
  pronunciation?: PronunciationFeedback;
  connectedSpeech?: ConnectedSpeechTip;
  realEnglishNote?: RealEnglishNote;
}

// Banco de dados de connected speech por nível
const CONNECTED_SPEECH_RULES = {
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

// Banco de dados de pronúncia por nível
const PRONUNCIATION_GUIDE = {
  B1: {
    'want': { ipa: 'wɑːnt', tips: ['Open mouth for /ɑː/', 'Tongue at back of throat'] },
    'think': { ipa: 'θɪŋk', tips: ['Tongue between teeth for /θ/', 'Not /t/ sound'] },
    'this': { ipa: 'ðɪs', tips: ['Voiced /ð/ - tongue between teeth', 'Vibrate vocal cords'] },
  },
  B2: {
    'embarrassed': {
      ipa: 'ɪmˈbærəst',
      tips: ['Stress on second syllable', 'Schwa /ə/ in middle syllables'],
    },
    'pronunciation': {
      ipa: 'prəˌnʌnsiˈeɪʃən',
      tips: ['Multiple syllables - /ə/ in unstressed ones', 'Stress on third syllable'],
    },
  },
};

// Banco de dados de inglês real vs formal
const REAL_ENGLISH_EXAMPLES = {
  B1: [
    {
      formal: 'I am going to go',
      colloquial: "I'm gonna go",
      explanation: 'Contraction + reduction of "going to"',
      level: 'B1' as const,
    },
    {
      formal: 'Do you want to',
      colloquial: "D'you wanna",
      explanation: 'Reduction of "do you" + "want to"',
      level: 'B1' as const,
    },
  ],
  B2: [
    {
      formal: 'I could not have done that',
      colloquial: "I couldn't've done that",
      explanation: 'Multiple contractions in casual speech',
      level: 'B2' as const,
    },
    {
      formal: 'What do you think about this?',
      colloquial: 'Whaddya think about this?',
      explanation: 'Reduction of "what do you"',
      level: 'B2' as const,
    },
  ],
};

// Função para gerar prompt do tutor
function generateTutorPrompt(
  message: string,
  studentLevel: string,
  context: string
): string {
  return `You are an expert English tutor specializing in REAL ENGLISH, connected speech, and authentic pronunciation.

Student Level: ${studentLevel}
Student Message: "${message}"

Your response should:
1. Respond naturally to the student's message
2. Identify opportunities to teach connected speech (linking, elision, assimilation)
3. Highlight pronunciation challenges relevant to their level
4. Show the difference between formal and colloquial English
5. Use IPA notation for pronunciation guidance

Format your response as JSON with these fields:
{
  "message": "Your natural response to the student",
  "pronunciation": {
    "word": "The key word to focus on",
    "ipa": "IPA transcription",
    "tips": ["Tip 1", "Tip 2", "Tip 3"]
  },
  "connectedSpeech": {
    "rule": "Name of the connected speech rule",
    "example": "Example from the student's message or similar",
    "explanation": "Why this rule applies"
  },
  "realEnglishNote": {
    "formal": "Formal way to say it",
    "colloquial": "How native speakers really say it",
    "explanation": "Why the difference exists",
    "level": "${studentLevel}"
  }
}

Context: ${context}

Remember: Focus on REAL ENGLISH that native speakers actually use, not textbook English.`;
}

export const tutorRouter = router({
  // Chat com o tutor
  chat: protectedProcedure
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
        // Chamar LLM para gerar resposta do tutor
        const systemPrompt = generateTutorPrompt(
          message,
          studentLevel,
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
              name: 'tutor_response',
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

        // Parse da resposta
        const content = response.choices[0].message.content;
        const parsedResponse = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content)) as TutorResponse;

        return parsedResponse;
      } catch (error) {
        console.error('Error in tutor chat:', error);
        throw error;
      }
    }),

  // Análise de áudio
  analyzeAudio: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        audio: z.instanceof(Blob),
        studentLevel: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { studentId, audio, studentLevel } = input;

      // Verificar se o aluno tem acesso
      if (ctx.user?.id !== studentId && ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      try {
        // Transcrever áudio
        const transcription = await transcribeAudio({
          audioUrl: audio as any, // Será convertido para URL em produção
          language: 'en',
        });

        // Verificar se a transcrição foi bem-sucedida
        if (!('text' in transcription)) {
          throw new Error('Failed to transcribe audio');
        }

        const transcriptionText = transcription.text;

        // Analisar transcrição com tutor
        const tutorSystemPrompt = `You are an expert English pronunciation tutor. The student just spoke in English.

Transcription: "${transcriptionText}"
Student Level: ${studentLevel}

Provide feedback on:
1. Pronunciation accuracy
2. Connected speech usage
3. Real English patterns
4. Areas for improvement

Format as JSON with fields: message, pronunciation, connectedSpeech, realEnglishNote`;

        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: tutorSystemPrompt,
            },
            {
              role: 'user',
              content: `Analyze my pronunciation: "${transcriptionText}"`,
            },
          ] as any,
        });

        const content = response.choices[0].message.content;
        const parsedResponse = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content)) as TutorResponse;

        return {
          feedback: parsedResponse.message,
          transcription: transcriptionText,
          ...parsedResponse,
        };
      } catch (error) {
        console.error('Error analyzing audio:', error);
        throw error;
      }
    }),

  // Obter dicas de connected speech por nível
  getConnectedSpeechTips: publicProcedure
    .input(z.object({ level: z.string() }))
    .query(({ input }) => {
      const rules = CONNECTED_SPEECH_RULES[input.level as keyof typeof CONNECTED_SPEECH_RULES] || [];
      return rules;
    }),

  // Obter guia de pronúncia por nível
  getPronunciationGuide: publicProcedure
    .input(z.object({ level: z.string() }))
    .query(({ input }) => {
      const guide = PRONUNCIATION_GUIDE[input.level as keyof typeof PRONUNCIATION_GUIDE] || {};
      return guide;
    }),

  // Obter exemplos de inglês real por nível
  getRealEnglishExamples: publicProcedure
    .input(z.object({ level: z.string() }))
    .query(({ input }) => {
      const examples = REAL_ENGLISH_EXAMPLES[input.level as keyof typeof REAL_ENGLISH_EXAMPLES] || [];
      return examples;
    }),

  // Salvar feedback de pronúncia
  savePronunciationFeedback: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        word: z.string(),
        ipa: z.string(),
        feedback: z.string(),
        score: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { studentId, word, ipa, feedback, score } = input;

      // Verificar se o aluno tem acesso
      if (ctx.user?.id !== studentId && ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      // Salvar no banco de dados (implementar conforme necessário)
      return {
        success: true,
        message: `Pronunciation feedback saved for "${word}"`,
        data: {
          word,
          ipa,
          feedback,
          score,
          savedAt: new Date(),
        },
      };
    }),
});
