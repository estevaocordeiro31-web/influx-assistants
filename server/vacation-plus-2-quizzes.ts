// Quiz pós-vídeo para os 8 vídeos do Vacation Plus 2
// Cada quiz tem 4 perguntas focadas em chunks, compreensão e cultura

export interface QuizQuestion {
  id: string;
  question: string;
  questionPt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationPt: string;
  type: 'chunk' | 'comprehension' | 'culture' | 'grammar';
}

export interface VideoQuiz {
  videoId: string;
  unit: number;
  title: string;
  questions: QuizQuestion[];
  passingScore: number; // porcentagem mínima para passar
  reward: number; // influxcoins ganhos ao completar
}

// ============================================
// UNIT 1: Going on Vacation - Lucas at the Airport
// ============================================
export const QUIZ_UNIT_1: VideoQuiz = {
  videoId: 'vp2-unit1',
  unit: 1,
  title: 'Going on Vacation Quiz',
  passingScore: 75,
  reward: 10,
  questions: [
    {
      id: 'u1-q1',
      question: 'What does "I\'m so pumped!" mean?',
      questionPt: 'O que significa "I\'m so pumped!"?',
      options: [
        'I\'m very tired',
        'I\'m very excited',
        'I\'m very angry',
        'I\'m very hungry'
      ],
      correctIndex: 1,
      explanation: '"I\'m so pumped" is American slang meaning "I\'m very excited"',
      explanationPt: '"I\'m so pumped" é uma gíria americana que significa "Estou muito animado/empolgado"',
      type: 'chunk'
    },
    {
      id: 'u1-q2',
      question: 'Where is Lucas going on vacation?',
      questionPt: 'Para onde Lucas está indo de férias?',
      options: [
        'London',
        'Sydney',
        'He\'s at JFK Airport in New York',
        'Paris'
      ],
      correctIndex: 2,
      explanation: 'Lucas is at JFK Airport in New York, preparing for his vacation',
      explanationPt: 'Lucas está no aeroporto JFK em Nova York, se preparando para as férias',
      type: 'comprehension'
    },
    {
      id: 'u1-q3',
      question: 'What expression means "Let\'s go!" in American English?',
      questionPt: 'Qual expressão significa "Vamos nessa!" em inglês americano?',
      options: [
        'Let\'s hit the road!',
        'Let\'s hit the bed!',
        'Let\'s hit the wall!',
        'Let\'s hit the floor!'
      ],
      correctIndex: 0,
      explanation: '"Let\'s hit the road" means "Let\'s go" or "Let\'s start our journey"',
      explanationPt: '"Let\'s hit the road" significa "Vamos nessa" ou "Vamos começar nossa jornada"',
      type: 'chunk'
    },
    {
      id: 'u1-q4',
      question: 'What do Americans call "hand luggage"?',
      questionPt: 'Como os americanos chamam "bagagem de mão"?',
      options: [
        'Hand bag',
        'Carry-on',
        'Pocket bag',
        'Travel bag'
      ],
      correctIndex: 1,
      explanation: 'Americans say "carry-on" while British say "hand luggage"',
      explanationPt: 'Americanos dizem "carry-on" enquanto britânicos dizem "hand luggage"',
      type: 'culture'
    }
  ]
};

// ============================================
// UNIT 2: Eating Out - Emily's Restaurant Adventure
// ============================================
export const QUIZ_UNIT_2: VideoQuiz = {
  videoId: 'vp2-unit2',
  unit: 2,
  title: 'Eating Out Quiz',
  passingScore: 75,
  reward: 10,
  questions: [
    {
      id: 'u2-q1',
      question: 'What does "I\'m starving!" mean?',
      questionPt: 'O que significa "I\'m starving!"?',
      options: [
        'I\'m very cold',
        'I\'m very hungry',
        'I\'m very tired',
        'I\'m very thirsty'
      ],
      correctIndex: 1,
      explanation: '"I\'m starving" is a common expression meaning "I\'m very hungry"',
      explanationPt: '"I\'m starving" é uma expressão comum que significa "Estou morrendo de fome"',
      type: 'chunk'
    },
    {
      id: 'u2-q2',
      question: 'How do British people ask for the check?',
      questionPt: 'Como os britânicos pedem a conta?',
      options: [
        'Can I get the check?',
        'Could we have the bill, please?',
        'Give me the money!',
        'Pay now!'
      ],
      correctIndex: 1,
      explanation: 'British people say "the bill" while Americans say "the check"',
      explanationPt: 'Britânicos dizem "the bill" enquanto americanos dizem "the check"',
      type: 'culture'
    },
    {
      id: 'u2-q3',
      question: 'What does Emily say when the food is delicious?',
      questionPt: 'O que Emily diz quando a comida está deliciosa?',
      options: [
        'This is awesome!',
        'This is sick!',
        'This is brilliant!',
        'This is cool!'
      ],
      correctIndex: 2,
      explanation: 'British people often say "brilliant" to express that something is great',
      explanationPt: 'Britânicos frequentemente dizem "brilliant" para expressar que algo é ótimo',
      type: 'chunk'
    },
    {
      id: 'u2-q4',
      question: 'In British English, what is "tipping" culture like?',
      questionPt: 'Na Inglaterra, como é a cultura de "gorjeta"?',
      options: [
        'Always 20% like in the USA',
        'Usually 10-15%, but not mandatory',
        'Never tip in the UK',
        'Only tip in cash'
      ],
      correctIndex: 1,
      explanation: 'In the UK, tipping is usually 10-15% and not as mandatory as in the USA',
      explanationPt: 'No Reino Unido, a gorjeta é geralmente 10-15% e não é tão obrigatória quanto nos EUA',
      type: 'culture'
    }
  ]
};

// ============================================
// UNIT 3: Around Town - Aiko Explores Sydney
// ============================================
export const QUIZ_UNIT_3: VideoQuiz = {
  videoId: 'vp2-unit3',
  unit: 3,
  title: 'Around Town Quiz',
  passingScore: 75,
  reward: 10,
  questions: [
    {
      id: 'u3-q1',
      question: 'What does "G\'day, mate!" mean in Australian English?',
      questionPt: 'O que significa "G\'day, mate!" em inglês australiano?',
      options: [
        'Goodbye, friend!',
        'Good day, friend! (Hello!)',
        'Good night, friend!',
        'Go away, friend!'
      ],
      correctIndex: 1,
      explanation: '"G\'day" is short for "Good day" and is a common Australian greeting',
      explanationPt: '"G\'day" é a abreviação de "Good day" e é uma saudação comum na Austrália',
      type: 'chunk'
    },
    {
      id: 'u3-q2',
      question: 'What famous landmark does Aiko visit in Sydney?',
      questionPt: 'Qual ponto turístico famoso Aiko visita em Sydney?',
      options: [
        'Big Ben',
        'Statue of Liberty',
        'Sydney Opera House',
        'Eiffel Tower'
      ],
      correctIndex: 2,
      explanation: 'Aiko visits the iconic Sydney Opera House during her exploration',
      explanationPt: 'Aiko visita a icônica Sydney Opera House durante sua exploração',
      type: 'comprehension'
    },
    {
      id: 'u3-q3',
      question: 'How do Australians ask for directions politely?',
      questionPt: 'Como os australianos pedem direções educadamente?',
      options: [
        'Tell me where to go!',
        'Excuse me, could you point me to...?',
        'Where is it?!',
        'I need directions now!'
      ],
      correctIndex: 1,
      explanation: '"Could you point me to..." is a polite way to ask for directions',
      explanationPt: '"Could you point me to..." é uma forma educada de pedir direções',
      type: 'chunk'
    },
    {
      id: 'u3-q4',
      question: 'What is "CBD" in Australian cities?',
      questionPt: 'O que é "CBD" nas cidades australianas?',
      options: [
        'Central Business District (downtown)',
        'Central Bus Depot',
        'City Beach District',
        'Commercial Building Department'
      ],
      correctIndex: 0,
      explanation: 'CBD stands for Central Business District, the downtown area of Australian cities',
      explanationPt: 'CBD significa Central Business District, a área central/downtown das cidades australianas',
      type: 'culture'
    }
  ]
};

// ============================================
// UNIT 4: Describing People - Lucas Describes His Squad
// ============================================
export const QUIZ_UNIT_4: VideoQuiz = {
  videoId: 'vp2-unit4',
  unit: 4,
  title: 'Describing People Quiz',
  passingScore: 75,
  reward: 10,
  questions: [
    {
      id: 'u4-q1',
      question: 'What does "squad" mean in American slang?',
      questionPt: 'O que significa "squad" em gíria americana?',
      options: [
        'A sports team',
        'A group of close friends',
        'A police unit',
        'A family'
      ],
      correctIndex: 1,
      explanation: '"Squad" in slang refers to your close group of friends',
      explanationPt: '"Squad" em gíria se refere ao seu grupo de amigos próximos',
      type: 'chunk'
    },
    {
      id: 'u4-q2',
      question: 'How do you describe someone who is very friendly?',
      questionPt: 'Como você descreve alguém que é muito amigável?',
      options: [
        'He\'s a total jerk',
        'He\'s super chill and easy-going',
        'He\'s really boring',
        'He\'s very strict'
      ],
      correctIndex: 1,
      explanation: '"Chill" and "easy-going" describe someone who is relaxed and friendly',
      explanationPt: '"Chill" e "easy-going" descrevem alguém que é relaxado e amigável',
      type: 'chunk'
    },
    {
      id: 'u4-q3',
      question: 'Where is Lucas when he describes his friends?',
      questionPt: 'Onde Lucas está quando descreve seus amigos?',
      options: [
        'At school',
        'At Central Park',
        'At home',
        'At the beach'
      ],
      correctIndex: 1,
      explanation: 'Lucas is at Central Park in New York when he talks about his squad',
      explanationPt: 'Lucas está no Central Park em Nova York quando fala sobre seus amigos',
      type: 'comprehension'
    },
    {
      id: 'u4-q4',
      question: 'What does "She\'s got a great sense of humor" mean?',
      questionPt: 'O que significa "She\'s got a great sense of humor"?',
      options: [
        'She\'s very serious',
        'She\'s funny and makes people laugh',
        'She\'s very smart',
        'She\'s very quiet'
      ],
      correctIndex: 1,
      explanation: 'Having a "great sense of humor" means being funny and making others laugh',
      explanationPt: 'Ter um "great sense of humor" significa ser engraçado e fazer os outros rirem',
      type: 'chunk'
    }
  ]
};

// ============================================
// UNIT 5: Shopping - Emily Goes Shopping
// ============================================
export const QUIZ_UNIT_5: VideoQuiz = {
  videoId: 'vp2-unit5',
  unit: 5,
  title: 'Shopping Quiz',
  passingScore: 75,
  reward: 10,
  questions: [
    {
      id: 'u5-q1',
      question: 'What does "retail therapy" mean?',
      questionPt: 'O que significa "retail therapy"?',
      options: [
        'Going to a therapist',
        'Shopping to feel better/relax',
        'Returning items to stores',
        'Working in a store'
      ],
      correctIndex: 1,
      explanation: '"Retail therapy" means shopping as a way to feel better or relax',
      explanationPt: '"Retail therapy" significa fazer compras como forma de se sentir melhor ou relaxar',
      type: 'chunk'
    },
    {
      id: 'u5-q2',
      question: 'Where does Emily go shopping in London?',
      questionPt: 'Onde Emily vai fazer compras em Londres?',
      options: [
        'Times Square',
        'Oxford Street',
        'Bondi Beach',
        'Central Park'
      ],
      correctIndex: 1,
      explanation: 'Emily goes shopping on Oxford Street, a famous shopping area in London',
      explanationPt: 'Emily vai fazer compras na Oxford Street, uma famosa área de compras em Londres',
      type: 'comprehension'
    },
    {
      id: 'u5-q3',
      question: 'How do British people say "It fits perfectly"?',
      questionPt: 'Como os britânicos dizem "Serve perfeitamente"?',
      options: [
        'It\'s awesome!',
        'It fits like a glove!',
        'It\'s sick!',
        'It\'s cool!'
      ],
      correctIndex: 1,
      explanation: '"Fits like a glove" means something fits perfectly',
      explanationPt: '"Fits like a glove" significa que algo serve perfeitamente',
      type: 'chunk'
    },
    {
      id: 'u5-q4',
      question: 'What currency do they use in the UK?',
      questionPt: 'Qual moeda eles usam no Reino Unido?',
      options: [
        'Dollars',
        'Euros',
        'Pounds (£)',
        'Yen'
      ],
      correctIndex: 2,
      explanation: 'The UK uses Pounds Sterling (£) as their currency',
      explanationPt: 'O Reino Unido usa Libras Esterlinas (£) como moeda',
      type: 'culture'
    }
  ]
};

// ============================================
// UNIT 6: Giving Advice - Aiko's Life Advice
// ============================================
export const QUIZ_UNIT_6: VideoQuiz = {
  videoId: 'vp2-unit6',
  unit: 6,
  title: 'Giving Advice Quiz',
  passingScore: 75,
  reward: 10,
  questions: [
    {
      id: 'u6-q1',
      question: 'What does "You should..." express?',
      questionPt: 'O que "You should..." expressa?',
      options: [
        'An order',
        'A suggestion or advice',
        'A question',
        'A complaint'
      ],
      correctIndex: 1,
      explanation: '"Should" is used to give suggestions or advice',
      explanationPt: '"Should" é usado para dar sugestões ou conselhos',
      type: 'grammar'
    },
    {
      id: 'u6-q2',
      question: 'Where is Aiko when she gives advice?',
      questionPt: 'Onde Aiko está quando dá conselhos?',
      options: [
        'At the Opera House',
        'At Bondi Beach',
        'At a restaurant',
        'At the airport'
      ],
      correctIndex: 1,
      explanation: 'Aiko is at Bondi Beach when she shares her life advice',
      explanationPt: 'Aiko está na Bondi Beach quando compartilha seus conselhos de vida',
      type: 'comprehension'
    },
    {
      id: 'u6-q3',
      question: 'What does "No worries, mate!" mean in Australian English?',
      questionPt: 'O que significa "No worries, mate!" em inglês australiano?',
      options: [
        'I\'m very worried',
        'It\'s okay / Don\'t worry about it',
        'I have problems',
        'I\'m angry'
      ],
      correctIndex: 1,
      explanation: '"No worries" is a very common Australian expression meaning "It\'s okay"',
      explanationPt: '"No worries" é uma expressão australiana muito comum que significa "Tudo bem"',
      type: 'chunk'
    },
    {
      id: 'u6-q4',
      question: 'What dangerous animals does Aiko warn about in Australia?',
      questionPt: 'Sobre quais animais perigosos Aiko alerta na Austrália?',
      options: [
        'Bears and wolves',
        'Spiders and snakes',
        'Lions and tigers',
        'Sharks only'
      ],
      correctIndex: 1,
      explanation: 'Australia is known for its dangerous spiders and snakes',
      explanationPt: 'A Austrália é conhecida por suas aranhas e cobras perigosas',
      type: 'culture'
    }
  ]
};

// ============================================
// UNIT 7: Talking About Hobbies - Lucas and His Hobbies
// ============================================
export const QUIZ_UNIT_7: VideoQuiz = {
  videoId: 'vp2-unit7',
  unit: 7,
  title: 'Talking About Hobbies Quiz',
  passingScore: 75,
  reward: 10,
  questions: [
    {
      id: 'u7-q1',
      question: 'What does "I\'m into..." mean?',
      questionPt: 'O que significa "I\'m into..."?',
      options: [
        'I\'m inside something',
        'I like / I\'m interested in',
        'I\'m going to',
        'I\'m against'
      ],
      correctIndex: 1,
      explanation: '"I\'m into" is a casual way to say you like or are interested in something',
      explanationPt: '"I\'m into" é uma forma casual de dizer que você gosta ou está interessado em algo',
      type: 'chunk'
    },
    {
      id: 'u7-q2',
      question: 'What hobbies does Lucas mention?',
      questionPt: 'Quais hobbies Lucas menciona?',
      options: [
        'Reading and cooking',
        'Gaming, skateboarding, and watching Netflix',
        'Swimming and running',
        'Painting and singing'
      ],
      correctIndex: 1,
      explanation: 'Lucas talks about gaming, skateboarding, and watching Netflix as his hobbies',
      explanationPt: 'Lucas fala sobre jogar videogame, andar de skate e assistir Netflix como seus hobbies',
      type: 'comprehension'
    },
    {
      id: 'u7-q3',
      question: 'How do you ask someone about their hobbies?',
      questionPt: 'Como você pergunta sobre os hobbies de alguém?',
      options: [
        'What do you do for work?',
        'What do you do in your free time?',
        'What do you eat?',
        'What do you study?'
      ],
      correctIndex: 1,
      explanation: '"What do you do in your free time?" is a common way to ask about hobbies',
      explanationPt: '"What do you do in your free time?" é uma forma comum de perguntar sobre hobbies',
      type: 'chunk'
    },
    {
      id: 'u7-q4',
      question: 'What does "binge-watch" mean?',
      questionPt: 'O que significa "binge-watch"?',
      options: [
        'Watch one episode',
        'Watch many episodes in a row',
        'Watch with friends',
        'Watch on a big screen'
      ],
      correctIndex: 1,
      explanation: '"Binge-watch" means watching many episodes of a show in one sitting',
      explanationPt: '"Binge-watch" significa assistir muitos episódios de uma série de uma vez só',
      type: 'chunk'
    }
  ]
};

// ============================================
// UNIT 8: Future Plans - Emily's Future Plans
// ============================================
export const QUIZ_UNIT_8: VideoQuiz = {
  videoId: 'vp2-unit8',
  unit: 8,
  title: 'Future Plans Quiz',
  passingScore: 75,
  reward: 10,
  questions: [
    {
      id: 'u8-q1',
      question: 'What\'s the difference between "will" and "going to"?',
      questionPt: 'Qual a diferença entre "will" e "going to"?',
      options: [
        'No difference',
        '"Going to" is for plans, "will" is for decisions/predictions',
        '"Will" is past tense',
        '"Going to" is only for questions'
      ],
      correctIndex: 1,
      explanation: '"Going to" is used for planned intentions, "will" for spontaneous decisions or predictions',
      explanationPt: '"Going to" é usado para intenções planejadas, "will" para decisões espontâneas ou previsões',
      type: 'grammar'
    },
    {
      id: 'u8-q2',
      question: 'Where is Emily when she talks about her future?',
      questionPt: 'Onde Emily está quando fala sobre seu futuro?',
      options: [
        'At Big Ben',
        'At the London Eye',
        'At Buckingham Palace',
        'At Oxford Street'
      ],
      correctIndex: 1,
      explanation: 'Emily is on the London Eye, a famous observation wheel, thinking about her future',
      explanationPt: 'Emily está na London Eye, uma famosa roda de observação, pensando sobre seu futuro',
      type: 'comprehension'
    },
    {
      id: 'u8-q3',
      question: 'How do you express a dream or aspiration?',
      questionPt: 'Como você expressa um sonho ou aspiração?',
      options: [
        'I must...',
        'I dream of... / I hope to...',
        'I have to...',
        'I need to...'
      ],
      correctIndex: 1,
      explanation: '"I dream of" and "I hope to" express dreams and aspirations',
      explanationPt: '"I dream of" e "I hope to" expressam sonhos e aspirações',
      type: 'chunk'
    },
    {
      id: 'u8-q4',
      question: 'What famous university does Emily mention?',
      questionPt: 'Qual universidade famosa Emily menciona?',
      options: [
        'Harvard',
        'Cambridge',
        'Yale',
        'Stanford'
      ],
      correctIndex: 1,
      explanation: 'Emily mentions Cambridge, one of the most prestigious universities in the UK',
      explanationPt: 'Emily menciona Cambridge, uma das universidades mais prestigiadas do Reino Unido',
      type: 'comprehension'
    }
  ]
};

// Exportar todos os quizzes
export const ALL_VIDEO_QUIZZES: VideoQuiz[] = [
  QUIZ_UNIT_1,
  QUIZ_UNIT_2,
  QUIZ_UNIT_3,
  QUIZ_UNIT_4,
  QUIZ_UNIT_5,
  QUIZ_UNIT_6,
  QUIZ_UNIT_7,
  QUIZ_UNIT_8
];

// Helper para buscar quiz por videoId
export const getQuizByVideoId = (videoId: string): VideoQuiz | undefined => {
  return ALL_VIDEO_QUIZZES.find(quiz => quiz.videoId === videoId);
};

// Helper para buscar quiz por unit
export const getQuizByUnit = (unit: number): VideoQuiz | undefined => {
  return ALL_VIDEO_QUIZZES.find(quiz => quiz.unit === unit);
};
