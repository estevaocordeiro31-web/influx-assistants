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