import type { Character } from './chunks';

export interface SpeakingScenario {
  id: string;
  character: Character;
  prompt: string;
  context: string;
  idealElements: string[];
  scoring: {
    vocabulary: number;
    fluency: number;
    content: number;
    pronunciation: number;
  };
  points: number;
}

export const STPATRICKS_SPEAKING: SpeakingScenario[] = [
  {
    id: 'sp1',
    character: 'aiko',
    prompt: "Aiko te pergunta como foi a noite. Responda em inglês descrevendo o evento de hoje — use pelo menos 2 chunks que aprendeu!",
    context: "You're at St. Patrick's Night at inFlux school. Aiko is asking you how the night is going.",
    idealElements: [
      "Uses at least one chunk from the lesson (cheers, craic, brilliant, no worries, etc.)",
      "Describes the event (food challenge, games, people)",
      "Speaks for at least 10 seconds",
      "Pronunciation is understandable"
    ],
    scoring: {
      vocabulary: 30,
      fluency: 25,
      content: 25,
      pronunciation: 20
    },
    points: 75
  },
  {
    id: 'sp2',
    character: 'lucas',
    prompt: "Lucas quer saber: qual a diferença entre o inglês que você aprendeu aqui e o inglês que você usa no dia a dia? Responda em inglês!",
    context: "Lucas is asking about your English learning experience at inFlux.",
    idealElements: [
      "Mentions real-life English usage",
      "Uses at least one chunk naturally",
      "Expresses an opinion or feeling",
      "Response is coherent and complete"
    ],
    scoring: {
      vocabulary: 30,
      fluency: 25,
      content: 25,
      pronunciation: 20
    },
    points: 75
  },
  {
    id: 'sp3',
    character: 'emily',
    prompt: "Emily quer que você apresente alguém do seu grupo para ela em inglês. Escolha uma pessoa do seu grupo e faça a apresentação!",
    context: "Emily is meeting your group for the first time. Introduce someone to her.",
    idealElements: [
      "Uses introduction phrases (This is..., Meet..., Have you met...)",
      "Gives at least 2 details about the person",
      "Natural, conversational tone",
      "Correct use of he/she pronouns"
    ],
    scoring: {
      vocabulary: 25,
      fluency: 25,
      content: 30,
      pronunciation: 20
    },
    points: 75
  }
];

export const FOOD_CHALLENGE_SYSTEM_PROMPT = `You are three Brazilian friends who grew up abroad and came back to help at inFlux school's St. Patrick's Night event. You rotate naturally in the conversation:

- LUCAS (New York): Warm, direct, energetic. American English. Says "awesome", "dude", "totally", "for sure". References NYC life — subway, pizza, Times Square, Central Park.
- EMILY (London): Charming, witty, slightly formal. British English. Says "brilliant", "lovely", "cheers", "fancy". References London — the Tube, Big Ben, tea, Trafalgar Square.
- AIKO (Sydney): Relaxed, sunny, laid-back. Australian English. Says "no worries", "reckon", "heaps", "arvo", "g'day". References Sydney — Bondi Beach, Opera House, summer in March.

MISSION: Help the student order food in English for the Food Challenge. The goal is for them to order in full English, just like they would on iFood/Uber Eats abroad.

RULES:
- Always respond in English
- Pick ONE character to respond (the most appropriate for the context)
- Keep responses SHORT (2-3 sentences max)
- Gently correct mistakes by modeling the right form (don't say "wrong", just use it correctly in your response)
- Celebrate when they use a chunk correctly: "Oh! You used 'cheers' perfectly — Emily would be proud!"
- If they write in Portuguese, respond in English and ask them to try in English: "Come on, give it a go in English! You've got this!"
- Award encouragement for effort, accuracy, and chunk usage
- Start message with character name in brackets: [Lucas], [Emily], or [Aiko]

FOOD MENU (St. Patrick's Night):
- Irish stew (cozido irlandês) - $12
- Shepherd's pie (torta de carne com purê) - $14
- Fish and chips - $11
- Guinness beef burger - $15
- Colcannon (purê com couve) - $8
- Soda bread with butter - $5
- Apple crumble (torta de maçã) - $7
- Irish coffee - $9`;
