import type { Character } from './chunks';

export interface QuizQuestion {
  id: string;
  character: Character;
  question: string;
  questionPt: string;
  options: { id: string; text: string; correct: boolean }[];
  explanation: string;
  explanationPt: string;
  points: number;
  category: 'vocabulary' | 'culture' | 'ordering' | 'expressions';
}

export const VALENTINE_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    character: 'lucas',
    question: "You're at a restaurant in New York. How do you ask for the bill?",
    questionPt: "Você está num restaurante em Nova York. Como pede a conta?",
    options: [
      { id: 'a', text: "Can I get the check, please?", correct: true },
      { id: 'b', text: "Could I have the bill, please?", correct: false },
      { id: 'c', text: "Can I grab the bill, mate?", correct: false },
      { id: 'd', text: "La cuenta, por favor!", correct: false }
    ],
    explanation: "In the US, we say 'check', not 'bill'! 'Bill' is British/Australian English.",
    explanationPt: "Nos EUA, dizemos 'check', não 'bill'! 'Bill' é inglês britânico/australiano.",
    points: 10,
    category: 'vocabulary'
  },
  {
    id: 'q2',
    character: 'emily',
    question: "Emily says 'That pudding was divine!' What does 'pudding' mean in British English?",
    questionPt: "Emily diz 'That pudding was divine!' O que 'pudding' significa em inglês britânico?",
    options: [
      { id: 'a', text: "Only the dessert called pudding (pudim)", correct: false },
      { id: 'b', text: "Any dessert at all", correct: true },
      { id: 'c', text: "A type of cake", correct: false },
      { id: 'd', text: "A main course dish", correct: false }
    ],
    explanation: "In British English, 'pudding' means ANY dessert! Not just the specific dessert called pudding.",
    explanationPt: "Em inglês britânico, 'pudding' significa QUALQUER sobremesa! Não só o pudim específico.",
    points: 10,
    category: 'vocabulary'
  },
  {
    id: 'q3',
    character: 'aiko',
    question: "Aiko says 'I'll grab a flat white.' What is she ordering?",
    questionPt: "Aiko diz 'I'll grab a flat white.' O que ela está pedindo?",
    options: [
      { id: 'a', text: "A white wine", correct: false },
      { id: 'b', text: "A type of coffee (espresso + steamed milk)", correct: true },
      { id: 'c', text: "A vanilla milkshake", correct: false },
      { id: 'd', text: "A white chocolate dessert", correct: false }
    ],
    explanation: "A flat white is an Australian/NZ coffee drink — espresso with silky steamed milk. It's Aiko's favorite!",
    explanationPt: "Flat white é um café australiano/neozelandês — espresso com leite vaporizado sedoso. É o favorito da Aiko!",
    points: 10,
    category: 'culture'
  },
  {
    id: 'q4',
    character: 'emily',
    question: "How would Emily invite someone on a Valentine's date?",
    questionPt: "Como Emily convidaria alguém para um encontro de Valentine's?",
    options: [
      { id: 'a', text: "Wanna go out?", correct: false },
      { id: 'b', text: "Fancy a date?", correct: true },
      { id: 'c', text: "You keen?", correct: false },
      { id: 'd', text: "Let's hang out!", correct: false }
    ],
    explanation: "'Fancy' in British English means 'to want' or 'to like'. 'Fancy a date?' is the classic British way to ask someone out!",
    explanationPt: "'Fancy' em inglês britânico significa 'querer' ou 'gostar'. 'Fancy a date?' é o jeito clássico britânico de convidar alguém!",
    points: 10,
    category: 'expressions'
  },
  {
    id: 'q5',
    character: 'lucas',
    question: "What are 'conversation hearts'?",
    questionPt: "O que são 'conversation hearts'?",
    options: [
      { id: 'a', text: "Heart-shaped chocolates", correct: false },
      { id: 'b', text: "Love songs played at restaurants", correct: false },
      { id: 'c', text: "Small candy hearts with short messages printed on them", correct: true },
      { id: 'd', text: "Valentine's Day cards", correct: false }
    ],
    explanation: "Conversation hearts are tiny candy hearts with messages like 'Be Mine', 'Kiss Me', 'XOXO'. They've been a Valentine's tradition since 1866!",
    explanationPt: "Conversation hearts são docinhos em formato de coração com mensagens como 'Be Mine', 'Kiss Me', 'XOXO'. São tradição desde 1866!",
    points: 10,
    category: 'culture'
  },
  {
    id: 'q6',
    character: 'aiko',
    question: "Valentine's Day in Australia is special because...",
    questionPt: "O Valentine's Day na Austrália é especial porque...",
    options: [
      { id: 'a', text: "They celebrate on a different date", correct: false },
      { id: 'b', text: "It's in the middle of SUMMER!", correct: true },
      { id: 'c', text: "They don't celebrate it at all", correct: false },
      { id: 'd', text: "They celebrate for a whole week", correct: false }
    ],
    explanation: "February is SUMMER in Australia! So while NYC is freezing, Aussies celebrate Valentine's with beach picnics and BBQs!",
    explanationPt: "Fevereiro é VERÃO na Austrália! Então enquanto NYC está congelando, australianos celebram Valentine's com piqueniques na praia e churrascos!",
    points: 10,
    category: 'culture'
  },
  {
    id: 'q7',
    character: 'lucas',
    question: "How do you order food in American English?",
    questionPt: "Como você pede comida em inglês americano?",
    options: [
      { id: 'a', text: "I'd like the...", correct: false },
      { id: 'b', text: "I'll grab the...", correct: false },
      { id: 'c', text: "I'll have the...", correct: true },
      { id: 'd', text: "Give me the...", correct: false }
    ],
    explanation: "'I'll have the...' is the most common way Americans order food. Direct and friendly — that's the American way!",
    explanationPt: "'I'll have the...' é a forma mais comum de pedir comida nos EUA. Direto e amigável — do jeito americano!",
    points: 10,
    category: 'ordering'
  },
  {
    id: 'q8',
    character: 'emily',
    question: "The oldest Valentine's love letter was written in...",
    questionPt: "A carta de amor de Valentine's mais antiga foi escrita em...",
    options: [
      { id: 'a', text: "Paris, France", correct: false },
      { id: 'b', text: "The Tower of London, England", correct: true },
      { id: 'c', text: "Rome, Italy", correct: false },
      { id: 'd', text: "New York, USA", correct: false }
    ],
    explanation: "The Duke of Orleans wrote the first known Valentine's letter in 1415 while imprisoned in the Tower of London! Talk about dramatic romance!",
    explanationPt: "O Duque de Orleans escreveu a primeira carta de Valentine's conhecida em 1415 enquanto preso na Torre de Londres! Que romance dramático!",
    points: 10,
    category: 'culture'
  },
  {
    id: 'q9',
    character: 'aiko',
    question: "How do Australians say 'I like you' romantically?",
    questionPt: "Como australianos dizem 'eu gosto de você' romanticamente?",
    options: [
      { id: 'a', text: "I fancy you", correct: false },
      { id: 'b', text: "I'm into you", correct: false },
      { id: 'c', text: "I'm keen on you", correct: true },
      { id: 'd', text: "I dig you", correct: false }
    ],
    explanation: "'I'm keen on you' is the Australian way! 'Keen' means enthusiastic or interested. US says 'I'm into you', UK says 'I fancy you'.",
    explanationPt: "'I'm keen on you' é o jeito australiano! 'Keen' significa entusiasmado ou interessado. EUA diz 'I'm into you', UK diz 'I fancy you'.",
    points: 10,
    category: 'expressions'
  },
  {
    id: 'q10',
    character: 'lucas',
    question: "In the US, tipping at restaurants is...",
    questionPt: "Nos EUA, gorjeta em restaurantes é...",
    options: [
      { id: 'a', text: "Optional (10%)", correct: false },
      { id: 'b', text: "Expected (15-20%)", correct: true },
      { id: 'c', text: "Already included in the bill", correct: false },
      { id: 'd', text: "Not common", correct: false }
    ],
    explanation: "In the US, tipping 15-20% is EXPECTED — it's not optional! Servers depend on tips. In the UK it's usually 12.5% service charge, and in Australia it's 10% and truly optional.",
    explanationPt: "Nos EUA, gorjeta de 15-20% é ESPERADA — não é opcional! Garçons dependem das gorjetas. No UK geralmente é 12.5% de taxa de serviço, e na Austrália é 10% e realmente opcional.",
    points: 10,
    category: 'culture'
  }
];
