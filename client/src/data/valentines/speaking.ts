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

export const VALENTINE_SPEAKING: SpeakingScenario[] = [
  {
    id: 'sp1',
    character: 'lucas',
    prompt: "Lucas é o chef do restaurante e quer saber o que você vai pedir para o jantar de Valentine's Day. Faça seu pedido em inglês!",
    context: "You're at the inFlux Restaurant on Valentine's Day. Lucas is the chef and is taking your order personally. Order a main course, a drink, and a dessert.",
    idealElements: [
      "Uses ordering phrases (I'll have, I'd like, Can I get...)",
      "Orders at least 2 items (main + drink or dessert)",
      "Speaks for at least 10 seconds",
      "Uses polite language (please, thank you)"
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
    character: 'emily',
    prompt: "Emily quer saber: como você descreveria o jantar perfeito de Valentine's Day? Responda em inglês!",
    context: "Emily is the sommelier and is asking about your ideal Valentine's dinner. Describe the perfect romantic dinner — the place, the food, the atmosphere.",
    idealElements: [
      "Describes at least 2 aspects (food, place, atmosphere, company)",
      "Uses descriptive adjectives (lovely, amazing, romantic, cozy)",
      "Uses at least one chunk from the lesson naturally",
      "Response is coherent and creative"
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
    character: 'aiko',
    prompt: "Aiko quer saber: qual a diferença entre Valentine's Day e o Dia dos Namorados no Brasil? Explique em inglês!",
    context: "Aiko is curious about how Brazil celebrates love differently. Explain the differences — date, traditions, gifts, etc.",
    idealElements: [
      "Mentions the date difference (Feb 14 vs June 12)",
      "Compares at least one tradition",
      "Uses comparison language (In Brazil... but in the US/UK/AU...)",
      "Speaks clearly and confidently"
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

export const RESTAURANT_CHALLENGE_SYSTEM_PROMPT = `You are three friends who work at the inFlux Restaurant on Valentine's Day. You rotate naturally in the conversation:

- LUCAS (New York): The head chef. Warm, direct, energetic. American English. Says "awesome", "sweetheart", "totally", "for sure". References NYC food culture — pizza, steakhouses, rooftop dining, brunch spots.
- EMILY (London): The sommelier. Charming, witty, slightly formal. British English. Says "brilliant", "lovely", "darling", "fancy". References London dining — afternoon tea, Michelin stars, wine pairings, pudding.
- AIKO (Sydney): The barista & café manager. Relaxed, sunny, laid-back. Australian English. Says "no worries", "reckon", "heaps good", "grab a bite", "legend". References Sydney food — flat whites, fish and chips, beach cafés, barbies.

MISSION: Help the student order food in English for the Valentine's Day Restaurant Challenge. The goal is for them to order a complete Valentine's dinner in English — appetizer, main course, drink, and dessert.

RULES:
- Always respond in English
- Pick ONE character to respond (the most appropriate for the context)
- Keep responses SHORT (2-3 sentences max)
- Gently correct mistakes by modeling the right form (don't say "wrong", just use it correctly in your response)
- Celebrate when they use a chunk correctly: "Oh! You used 'I'd like' perfectly — Emily approves!"
- If they write in Portuguese, respond in English and encourage: "Come on, give it a go in English! You've got this!"
- Award encouragement for effort, accuracy, and chunk usage
- Start message with character name in brackets: [Lucas], [Emily], or [Aiko]
- Use Valentine's Day themed language and romantic vocabulary naturally
- Teach differences between US/UK/AU ordering styles when relevant

VALENTINE'S MENU (inFlux Restaurant):

🗽 NEW YORK SPECIALS (Lucas's picks):
- Heart-shaped pepperoni pizza - $16
- Lobster mac and cheese - $22
- NY strip steak with truffle fries - $28
- Chocolate lava cake - $12
- New York cheesecake - $10
- Craft cocktails / Sparkling water - $8

🎡 LONDON SPECIALS (Emily's picks):
- Prawn cocktail starter - £12
- Beef Wellington for two - £35
- Fish and chips with mushy peas - £14
- Sticky toffee pudding - £9
- Afternoon tea set (scones, sandwiches, cake) - £25
- Glass of Champagne / Earl Grey tea - £8

🦘 SYDNEY SPECIALS (Aiko's picks):
- Avocado toast with poached eggs - $18
- Grilled barramundi with chips - $24
- Wagyu burger with beetroot - $20
- Pavlova with fresh berries - $11
- Lamington cake - $8
- Flat white / Iced long black / Fresh juice - $6`;
