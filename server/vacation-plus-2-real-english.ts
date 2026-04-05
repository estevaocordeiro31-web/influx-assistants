// Vacation Plus 2 - Real English Content
// Conteúdo autêntico com expressões usadas por jovens em NYC, Londres e Sydney

export interface TouristSpot {
  id: string;
  name: string;
  city: 'nyc' | 'london' | 'sydney';
  character: 'lucas' | 'emily' | 'aiko';
  image: string;
  description: string;
  localTip: string;
  slangUsed: string[];
  dialogue: {
    character: string;
    text: string;
    translation: string;
    connectedSpeech: string;
  }[];
}

export interface RealEnglishPhrase {
  id: string;
  lessonId: string;
  phrase: string;
  meaning: string;
  region: 'us' | 'uk' | 'au';
  character: 'lucas' | 'emily' | 'aiko';
  context: string;
  example: string;
  connectedSpeech: string;
  ipa: string;
  audioText: string;
}

export interface DialogueSituation {
  id: string;
  lessonId: string;
  title: string;
  titlePt: string;
  location: string;
  characters: ('lucas' | 'emily' | 'aiko')[];
  scenario: string;
  scenarioPt: string;
  lines: {
    character: 'lucas' | 'emily' | 'aiko';
    text: string;
    translation: string;
    connectedSpeech: string;
    slangHighlight?: string;
  }[];
  culturalNote: string;
}

// ============================================
// PONTOS TURÍSTICOS POR CIDADE
// ============================================

export const TOURIST_SPOTS: TouristSpot[] = [
  // NEW YORK - Lucas
  {
    id: 'nyc-times-square',
    name: 'Times Square',
    city: 'nyc',
    character: 'lucas',
    image: '/images/vacation-plus-2/nyc-times-square.png',
    description: 'The heart of NYC! Bright lights, Broadway shows, and tons of tourists.',
    localTip: 'Real New Yorkers avoid Times Square, but it\'s still worth seeing once!',
    slangUsed: ['mad', 'lit', 'tourist trap'],
    dialogue: [
      {
        character: 'lucas',
        text: "Yo, Times Square is mad lit at night! But honestly, it's kind of a tourist trap.",
        translation: "Ei, Times Square é muito animada à noite! Mas honestamente, é meio armadilha para turistas.",
        connectedSpeech: "/joʊ taɪmz skwer ɪz mæd lɪt æt naɪt/"
      },
      {
        character: 'lucas',
        text: "If you wanna see a Broadway show, cop tickets at the TKTS booth - way cheaper!",
        translation: "Se você quer ver um show da Broadway, compre ingressos na cabine TKTS - muito mais barato!",
        connectedSpeech: "/ɪf jə wɒnə siː ə brɔːdweɪ ʃoʊ kɑp tɪkɪts/"
      }
    ]
  },
  {
    id: 'nyc-central-park',
    name: 'Central Park',
    city: 'nyc',
    character: 'lucas',
    image: '/images/vacation-plus-2/nyc-central-park.png',
    description: 'An 843-acre oasis in the middle of Manhattan. Perfect for chilling!',
    localTip: 'Grab a bagel with schmear from a nearby bodega and have a picnic!',
    slangUsed: ['chill', 'bodega', 'schmear'],
    dialogue: [
      {
        character: 'lucas',
        text: "Central Park is where I go to chill when the city gets too crazy.",
        translation: "Central Park é onde eu vou relaxar quando a cidade fica muito louca.",
        connectedSpeech: "/sɛntrəl pɑrk ɪz wer aɪ goʊ tə tʃɪl/"
      },
      {
        character: 'lucas',
        text: "Pro tip: grab a baconeggandcheese from the bodega on your way. Trust me, it slaps!",
        translation: "Dica profissional: pegue um sanduíche de bacon, ovo e queijo na bodega no caminho. Confia, é muito bom!",
        connectedSpeech: "/proʊ tɪp græb ə beɪkənɛgəntʃiːz/"
      }
    ]
  },
  {
    id: 'nyc-brooklyn-bridge',
    name: 'Brooklyn Bridge',
    city: 'nyc',
    character: 'lucas',
    image: '/images/vacation-plus-2/nyc-brooklyn-bridge.png',
    description: 'Iconic bridge connecting Manhattan to Brooklyn. Amazing views!',
    localTip: 'Walk across at sunset for the best photos of the Manhattan skyline.',
    slangUsed: ['dead ass', 'fire', 'views'],
    dialogue: [
      {
        character: 'lucas',
        text: "Dead ass, the Brooklyn Bridge at sunset is fire. The views are insane!",
        translation: "Sério, a Ponte do Brooklyn no pôr do sol é incrível. As vistas são insanas!",
        connectedSpeech: "/dɛdæs ðə brʊklɪn brɪdʒ æt sʌnsɛt ɪz faɪər/"
      },
      {
        character: 'lucas',
        text: "After you cross, hit up DUMBO. There's this pizza spot that's no cap the best in the city.",
        translation: "Depois de atravessar, vá ao DUMBO. Tem uma pizzaria que sem mentira é a melhor da cidade.",
        connectedSpeech: "/æftər jə krɔs hɪt ʌp dʌmboʊ/"
      }
    ]
  },

  // LONDON - Emily
  {
    id: 'london-big-ben',
    name: 'Big Ben & Parliament',
    city: 'london',
    character: 'emily',
    image: '/images/vacation-plus-2/london-big-ben.png',
    description: 'The iconic clock tower and Houses of Parliament. Proper British!',
    localTip: 'The best photo spot is from Westminster Bridge at golden hour.',
    slangUsed: ['proper', 'iconic', 'init'],
    dialogue: [
      {
        character: 'emily',
        text: "Big Ben is proper iconic, init? Every time I see it, I still get chuffed!",
        translation: "Big Ben é muito icônico, não é? Toda vez que vejo, ainda fico feliz!",
        connectedSpeech: "/bɪg bɛn ɪz prɒpər aɪkɒnɪk ɪnɪt/"
      },
      {
        character: 'emily',
        text: "Fun fact: Big Ben is actually the name of the bell, not the tower. Most people don't know that!",
        translation: "Curiosidade: Big Ben é na verdade o nome do sino, não da torre. A maioria das pessoas não sabe!",
        connectedSpeech: "/fʌn fækt bɪg bɛn ɪz æktʃuəli ðə neɪm/"
      }
    ]
  },
  {
    id: 'london-camden',
    name: 'Camden Market',
    city: 'london',
    character: 'emily',
    image: '/images/vacation-plus-2/london-camden.png',
    description: 'Alternative market with amazing street food and vintage shops.',
    localTip: 'The food stalls are bangin\'! Try the Caribbean jerk chicken.',
    slangUsed: ['bangin', 'bare', 'sick'],
    dialogue: [
      {
        character: 'emily',
        text: "Camden is sick! There's bare food stalls and the vintage shops are wicked.",
        translation: "Camden é incrível! Tem muitas barracas de comida e as lojas vintage são fantásticas.",
        connectedSpeech: "/kæmdən ɪz sɪk ðerz beər fuːd stɔːlz/"
      },
      {
        character: 'emily',
        text: "The street food is absolutely bangin'. You've got to try the Caribbean jerk chicken!",
        translation: "A comida de rua é absolutamente incrível. Você tem que experimentar o frango jerk caribenho!",
        connectedSpeech: "/ðə striːt fuːd ɪz æbsəluːtli bæŋɪn/"
      }
    ]
  },
  {
    id: 'london-tube',
    name: 'The London Underground',
    city: 'london',
    character: 'emily',
    image: '/images/vacation-plus-2/london-tube.png',
    description: 'The oldest underground railway in the world. We call it "The Tube"!',
    localTip: 'Stand on the right side of the escalator or you\'ll get proper dirty looks!',
    slangUsed: ['tube', 'mind the gap', 'knackered'],
    dialogue: [
      {
        character: 'emily',
        text: "We call it 'The Tube', not the subway. And always mind the gap!",
        translation: "Nós chamamos de 'The Tube', não de metrô. E sempre cuidado com o vão!",
        connectedSpeech: "/wiː kɔːl ɪt ðə tjuːb nɒt ðə sʌbweɪ/"
      },
      {
        character: 'emily',
        text: "Pro tip: stand on the right of the escalator. Londoners get proper vexed if you block the left!",
        translation: "Dica: fique à direita da escada rolante. Londrinos ficam muito irritados se você bloquear a esquerda!",
        connectedSpeech: "/stænd ɒn ðə raɪt əv ði ɛskəleɪtər/"
      }
    ]
  },

  // SYDNEY - Aiko
  {
    id: 'sydney-opera-house',
    name: 'Sydney Opera House',
    city: 'sydney',
    character: 'aiko',
    image: '/images/vacation-plus-2/sydney-opera-house.png',
    description: 'The most iconic building in Australia! Absolutely stunning architecture.',
    localTip: 'Catch a show or just grab a drink at the Opera Bar with harbour views.',
    slangUsed: ['ripper', 'heaps good', 'arvo'],
    dialogue: [
      {
        character: 'aiko',
        text: "G'day! The Opera House is a ripper, mate! Heaps good for photos!",
        translation: "Olá! A Opera House é incrível, cara! Muito boa para fotos!",
        connectedSpeech: "/gəˈdaɪ ði ɒprə haʊs ɪz ə rɪpər meɪt/"
      },
      {
        character: 'aiko',
        text: "Best time to visit is late arvo when the sun hits the sails. She's a beauty!",
        translation: "Melhor hora para visitar é no final da tarde quando o sol bate nas velas. É uma beleza!",
        connectedSpeech: "/bɛst taɪm tə vɪzɪt ɪz leɪt ɑːvoʊ/"
      }
    ]
  },
  {
    id: 'sydney-bondi',
    name: 'Bondi Beach',
    city: 'sydney',
    character: 'aiko',
    image: '/images/vacation-plus-2/sydney-bondi.png',
    description: 'Australia\'s most famous beach! Perfect for surfing and sunbathing.',
    localTip: 'Walk the Bondi to Coogee coastal walk - stunning views the whole way!',
    slangUsed: ['stoked', 'no worries', 'thongs'],
    dialogue: [
      {
        character: 'aiko',
        text: "Bondi is where it's at! I'm always stoked to hit the beach on a sunny day.",
        translation: "Bondi é o lugar! Eu sempre fico animada para ir à praia em um dia ensolarado.",
        connectedSpeech: "/bɒndi ɪz wer ɪts æt aɪm ɔːlweɪz stoʊkt/"
      },
      {
        character: 'aiko',
        text: "Don't forget your thongs and sunnies! And slip, slop, slap - sunscreen is a must!",
        translation: "Não esqueça seus chinelos e óculos de sol! E passe protetor solar - é obrigatório!",
        connectedSpeech: "/doʊnt fərɡɛt jɔːr θɒŋz ənd sʌniz/"
      }
    ]
  },
  {
    id: 'sydney-rocks',
    name: 'The Rocks',
    city: 'sydney',
    character: 'aiko',
    image: '/images/vacation-plus-2/sydney-rocks.png',
    description: 'Historic neighbourhood with cobblestone streets and weekend markets.',
    localTip: 'The weekend markets are ace! Great for souvenirs and local crafts.',
    slangUsed: ['reckon', 'ace', 'fair dinkum'],
    dialogue: [
      {
        character: 'aiko',
        text: "I reckon The Rocks is one of the best spots in Sydney. Fair dinkum history here!",
        translation: "Eu acho que The Rocks é um dos melhores lugares em Sydney. História de verdade aqui!",
        connectedSpeech: "/aɪ rɛkən ðə rɒks ɪz wʌn əv ðə bɛst spɒts/"
      },
      {
        character: 'aiko',
        text: "The weekend markets are ace! You can find heaps of cool stuff from local artists.",
        translation: "Os mercados de fim de semana são ótimos! Você pode encontrar muitas coisas legais de artistas locais.",
        connectedSpeech: "/ðə wiːkɛnd mɑːkɪts ər eɪs/"
      }
    ]
  }
];

// ============================================
// REAL ENGLISH PHRASES POR LIÇÃO
// ============================================

export const REAL_ENGLISH_PHRASES: RealEnglishPhrase[] = [
  // LESSON 1: Going on Vacation
  {
    id: 'l1-us-1',
    lessonId: 'lesson01',
    phrase: "I'm so pumped for this trip!",
    meaning: "Estou muito animado para essa viagem!",
    region: 'us',
    character: 'lucas',
    context: "Quando você está muito empolgado com uma viagem",
    example: "Dude, I'm so pumped for this trip to Miami!",
    connectedSpeech: "I'm-so-pumped",
    ipa: "/aɪm soʊ pʌmpt/",
    audioText: "I'm so pumped for this trip!"
  },
  {
    id: 'l1-uk-1',
    lessonId: 'lesson01',
    phrase: "I'm absolutely chuffed about the holiday!",
    meaning: "Estou muito feliz com as férias!",
    region: 'uk',
    character: 'emily',
    context: "Expressando felicidade sobre férias planejadas",
    example: "I'm absolutely chuffed we're going to Spain!",
    connectedSpeech: "I'm-absolutely-chuffed",
    ipa: "/aɪm æbsəluːtli tʃʌft/",
    audioText: "I'm absolutely chuffed about the holiday!"
  },
  {
    id: 'l1-au-1',
    lessonId: 'lesson01',
    phrase: "I'm stoked about the trip, mate!",
    meaning: "Estou muito animado com a viagem, cara!",
    region: 'au',
    character: 'aiko',
    context: "Mostrando entusiasmo sobre uma viagem",
    example: "I'm stoked about the trip to Bali, mate!",
    connectedSpeech: "I'm-stoked-about",
    ipa: "/aɪm stoʊkt əbaʊt/",
    audioText: "I'm stoked about the trip, mate!"
  },
  
  // LESSON 2: Eating Out
  {
    id: 'l2-us-1',
    lessonId: 'lesson02',
    phrase: "This food is bussin'!",
    meaning: "Essa comida está muito boa!",
    region: 'us',
    character: 'lucas',
    context: "Quando a comida está deliciosa",
    example: "Yo, this pizza is bussin'! Best in the city!",
    connectedSpeech: "This-food-is-bussin",
    ipa: "/ðɪs fuːd ɪz bʌsɪn/",
    audioText: "This food is bussin'!"
  },
  {
    id: 'l2-uk-1',
    lessonId: 'lesson02',
    phrase: "This is absolutely bangin'!",
    meaning: "Isso está absolutamente incrível!",
    region: 'uk',
    character: 'emily',
    context: "Elogiando comida deliciosa",
    example: "This curry is absolutely bangin'!",
    connectedSpeech: "This-is-absolutely-bangin",
    ipa: "/ðɪs ɪz æbsəluːtli bæŋɪn/",
    audioText: "This is absolutely bangin'!"
  },
  {
    id: 'l2-au-1',
    lessonId: 'lesson02',
    phrase: "This is heaps good, mate!",
    meaning: "Isso está muito bom, cara!",
    region: 'au',
    character: 'aiko',
    context: "Expressando que algo está muito bom",
    example: "This barbie is heaps good, mate!",
    connectedSpeech: "This-is-heaps-good",
    ipa: "/ðɪs ɪz hiːps gʊd/",
    audioText: "This is heaps good, mate!"
  },

  // LESSON 3: Around Town
  {
    id: 'l3-us-1',
    lessonId: 'lesson03',
    phrase: "Let's link up downtown",
    meaning: "Vamos nos encontrar no centro",
    region: 'us',
    character: 'lucas',
    context: "Combinando de encontrar alguém",
    example: "Let's link up downtown around 7, bet?",
    connectedSpeech: "Let's-link-up",
    ipa: "/lɛts lɪŋk ʌp daʊntaʊn/",
    audioText: "Let's link up downtown"
  },
  {
    id: 'l3-uk-1',
    lessonId: 'lesson03',
    phrase: "Shall we have a wander?",
    meaning: "Vamos dar uma volta?",
    region: 'uk',
    character: 'emily',
    context: "Sugerindo um passeio casual",
    example: "It's lovely out. Shall we have a wander?",
    connectedSpeech: "Shall-we-have-a-wander",
    ipa: "/ʃæl wiː hæv ə wɒndər/",
    audioText: "Shall we have a wander?"
  },
  {
    id: 'l3-au-1',
    lessonId: 'lesson03',
    phrase: "Let's hit the shops this arvo",
    meaning: "Vamos às lojas hoje à tarde",
    region: 'au',
    character: 'aiko',
    context: "Planejando ir às compras à tarde",
    example: "Let's hit the shops this arvo and grab brekkie first!",
    connectedSpeech: "Let's-hit-the-shops",
    ipa: "/lɛts hɪt ðə ʃɒps ðɪs ɑːvoʊ/",
    audioText: "Let's hit the shops this arvo"
  },

  // LESSON 4: Talking About Others
  {
    id: 'l4-us-1',
    lessonId: 'lesson04',
    phrase: "She's got mad rizz",
    meaning: "Ela tem muito carisma",
    region: 'us',
    character: 'lucas',
    context: "Descrevendo alguém carismático",
    example: "Did you see her at the party? She's got mad rizz!",
    connectedSpeech: "She's-got-mad-rizz",
    ipa: "/ʃiːz gɒt mæd rɪz/",
    audioText: "She's got mad rizz"
  },
  {
    id: 'l4-uk-1',
    lessonId: 'lesson04',
    phrase: "He's proper sound",
    meaning: "Ele é muito legal/confiável",
    region: 'uk',
    character: 'emily',
    context: "Descrevendo alguém confiável e legal",
    example: "Don't worry about him, he's proper sound.",
    connectedSpeech: "He's-proper-sound",
    ipa: "/hiːz prɒpər saʊnd/",
    audioText: "He's proper sound"
  },
  {
    id: 'l4-au-1',
    lessonId: 'lesson04',
    phrase: "She's a top sheila",
    meaning: "Ela é uma mulher incrível",
    region: 'au',
    character: 'aiko',
    context: "Elogiando uma mulher",
    example: "My neighbour is a top sheila, always helps out!",
    connectedSpeech: "She's-a-top-sheila",
    ipa: "/ʃiːz ə tɒp ʃiːlə/",
    audioText: "She's a top sheila"
  },

  // LESSON 5: Spending Money
  {
    id: 'l5-us-1',
    lessonId: 'lesson05',
    phrase: "That's a total flex",
    meaning: "Isso é uma ostentação total",
    region: 'us',
    character: 'lucas',
    context: "Quando alguém está ostentando",
    example: "Buying that car was a total flex!",
    connectedSpeech: "That's-a-total-flex",
    ipa: "/ðæts ə toʊtl flɛks/",
    audioText: "That's a total flex"
  },
  {
    id: 'l5-uk-1',
    lessonId: 'lesson05',
    phrase: "That's a bit dear, init?",
    meaning: "Isso é um pouco caro, não é?",
    region: 'uk',
    character: 'emily',
    context: "Comentando sobre preços altos",
    example: "Twenty quid for a sandwich? That's a bit dear, init?",
    connectedSpeech: "That's-a-bit-dear",
    ipa: "/ðæts ə bɪt dɪər ɪnɪt/",
    audioText: "That's a bit dear, init?"
  },
  {
    id: 'l5-au-1',
    lessonId: 'lesson05',
    phrase: "That's pretty exy, mate",
    meaning: "Isso é bem caro, cara",
    region: 'au',
    character: 'aiko',
    context: "Comentando sobre algo caro",
    example: "Fifty bucks for a t-shirt? That's pretty exy, mate!",
    connectedSpeech: "That's-pretty-exy",
    ipa: "/ðæts prɪti ɛksi meɪt/",
    audioText: "That's pretty exy, mate"
  },

  // LESSON 6: A Piece of Advice
  {
    id: 'l6-us-1',
    lessonId: 'lesson06',
    phrase: "Real talk, you should...",
    meaning: "Falando sério, você deveria...",
    region: 'us',
    character: 'lucas',
    context: "Dando um conselho sincero",
    example: "Real talk, you should apply for that job.",
    connectedSpeech: "Real-talk-you-should",
    ipa: "/riːl tɔːk juː ʃʊd/",
    audioText: "Real talk, you should..."
  },
  {
    id: 'l6-uk-1',
    lessonId: 'lesson06',
    phrase: "I'd say you ought to...",
    meaning: "Eu diria que você deveria...",
    region: 'uk',
    character: 'emily',
    context: "Oferecendo um conselho educado",
    example: "I'd say you ought to speak to your manager about it.",
    connectedSpeech: "I'd-say-you-ought-to",
    ipa: "/aɪd seɪ juː ɔːt tuː/",
    audioText: "I'd say you ought to..."
  },
  {
    id: 'l6-au-1',
    lessonId: 'lesson06',
    phrase: "I reckon you should...",
    meaning: "Eu acho que você deveria...",
    region: 'au',
    character: 'aiko',
    context: "Dando uma opinião/conselho",
    example: "I reckon you should give it a go, mate!",
    connectedSpeech: "I-reckon-you-should",
    ipa: "/aɪ rɛkən juː ʃʊd/",
    audioText: "I reckon you should..."
  },

  // LESSON 7: Free Time
  {
    id: 'l7-us-1',
    lessonId: 'lesson07',
    phrase: "I'm just gonna chill",
    meaning: "Eu só vou relaxar",
    region: 'us',
    character: 'lucas',
    context: "Descrevendo planos de relaxar",
    example: "No plans tonight, I'm just gonna chill at home.",
    connectedSpeech: "I'm-just-gonna-chill",
    ipa: "/aɪm dʒʌst gɒnə tʃɪl/",
    audioText: "I'm just gonna chill"
  },
  {
    id: 'l7-uk-1',
    lessonId: 'lesson07',
    phrase: "Fancy a cuppa?",
    meaning: "Quer uma xícara de chá?",
    region: 'uk',
    character: 'emily',
    context: "Oferecendo chá (muito britânico!)",
    example: "I'm putting the kettle on. Fancy a cuppa?",
    connectedSpeech: "Fancy-a-cuppa",
    ipa: "/fænsi ə kʌpə/",
    audioText: "Fancy a cuppa?"
  },
  {
    id: 'l7-au-1',
    lessonId: 'lesson07',
    phrase: "Let's have a barbie this arvo",
    meaning: "Vamos fazer um churrasco hoje à tarde",
    region: 'au',
    character: 'aiko',
    context: "Planejando um churrasco",
    example: "Weather's beaut! Let's have a barbie this arvo!",
    connectedSpeech: "Let's-have-a-barbie",
    ipa: "/lɛts hæv ə bɑːbi ðɪs ɑːvoʊ/",
    audioText: "Let's have a barbie this arvo"
  },

  // LESSON 8: Plans For The Future
  {
    id: 'l8-us-1',
    lessonId: 'lesson08',
    phrase: "I'm finna make moves",
    meaning: "Eu vou fazer acontecer",
    region: 'us',
    character: 'lucas',
    context: "Falando sobre planos ambiciosos",
    example: "Next year, I'm finna make moves and start my own business.",
    connectedSpeech: "I'm-finna-make-moves",
    ipa: "/aɪm fɪnə meɪk muːvz/",
    audioText: "I'm finna make moves"
  },
  {
    id: 'l8-uk-1',
    lessonId: 'lesson08',
    phrase: "I'm quite keen on...",
    meaning: "Estou bastante interessado em...",
    region: 'uk',
    character: 'emily',
    context: "Expressando interesse em planos futuros",
    example: "I'm quite keen on doing a gap year after uni.",
    connectedSpeech: "I'm-quite-keen-on",
    ipa: "/aɪm kwaɪt kiːn ɒn/",
    audioText: "I'm quite keen on..."
  },
  {
    id: 'l8-au-1',
    lessonId: 'lesson08',
    phrase: "She'll be right, mate",
    meaning: "Vai ficar tudo bem, cara",
    region: 'au',
    character: 'aiko',
    context: "Tranquilizando sobre o futuro",
    example: "Don't stress about the exam. She'll be right, mate!",
    connectedSpeech: "She'll-be-right",
    ipa: "/ʃiːl biː raɪt meɪt/",
    audioText: "She'll be right, mate"
  }
];

// ============================================
// SITUAÇÕES DE DIÁLOGO
// ============================================

export const DIALOGUE_SITUATIONS: DialogueSituation[] = [
  // LESSON 1: Going on Vacation - At the Airport
  {
    id: 'situation-l1-airport',
    lessonId: 'lesson01',
    title: 'At the Airport Check-in',
    titlePt: 'No Check-in do Aeroporto',
    location: 'JFK Airport, New York',
    characters: ['lucas', 'emily'],
    scenario: 'Lucas and Emily are checking in for their flight to London.',
    scenarioPt: 'Lucas e Emily estão fazendo check-in para o voo para Londres.',
    lines: [
      {
        character: 'lucas',
        text: "Yo, I'm so pumped for this trip! London's gonna be lit!",
        translation: "Ei, estou muito animado para essa viagem! Londres vai ser incrível!",
        connectedSpeech: "/joʊ aɪm soʊ pʌmpt fɔr ðɪs trɪp/",
        slangHighlight: "pumped, lit"
      },
      {
        character: 'emily',
        text: "I'm absolutely chuffed you're coming to visit! Have you got your carry-on sorted?",
        translation: "Estou muito feliz que você está vindo visitar! Você organizou sua bagagem de mão?",
        connectedSpeech: "/aɪm æbsəluːtli tʃʌft jɔːr kʌmɪŋ/",
        slangHighlight: "chuffed, carry-on"
      },
      {
        character: 'lucas',
        text: "Yeah, I'm good. Dead ass, I can't wait to try some real fish and chips!",
        translation: "Sim, estou bem. Sério, mal posso esperar para experimentar fish and chips de verdade!",
        connectedSpeech: "/jæ aɪm gʊd dɛdæs/",
        slangHighlight: "dead ass"
      },
      {
        character: 'emily',
        text: "Brilliant! And I'll take you to Camden - the street food is absolutely bangin'!",
        translation: "Excelente! E vou te levar a Camden - a comida de rua é absolutamente incrível!",
        connectedSpeech: "/brɪljənt ænd aɪl teɪk juː/",
        slangHighlight: "brilliant, bangin'"
      }
    ],
    culturalNote: "Americans say 'carry-on' for hand luggage, while British say 'hand luggage'. Both are correct!"
  },

  // LESSON 2: Eating Out - At a Restaurant
  {
    id: 'situation-l2-restaurant',
    lessonId: 'lesson02',
    title: 'Ordering at a Restaurant',
    titlePt: 'Pedindo em um Restaurante',
    location: 'Brick Lane, London',
    characters: ['emily', 'aiko'],
    scenario: 'Emily takes Aiko to try famous curry on Brick Lane.',
    scenarioPt: 'Emily leva Aiko para experimentar o famoso curry em Brick Lane.',
    lines: [
      {
        character: 'emily',
        text: "Right, this place is proper good. The curry here is absolutely bangin'!",
        translation: "Certo, esse lugar é muito bom. O curry aqui é absolutamente incrível!",
        connectedSpeech: "/raɪt ðɪs pleɪs ɪz prɒpər gʊd/",
        slangHighlight: "proper, bangin'"
      },
      {
        character: 'aiko',
        text: "Heaps good! I reckon I'll try the chicken tikka. What do you recommend?",
        translation: "Muito bom! Acho que vou experimentar o chicken tikka. O que você recomenda?",
        connectedSpeech: "/hiːps gʊd aɪ rɛkən/",
        slangHighlight: "heaps, reckon"
      },
      {
        character: 'emily',
        text: "The lamb rogan josh is wicked! But if you fancy something milder, the korma is lovely.",
        translation: "O lamb rogan josh é fantástico! Mas se você quiser algo mais suave, o korma é adorável.",
        connectedSpeech: "/ðə læm roʊgən dʒɒʃ ɪz wɪkɪd/",
        slangHighlight: "wicked, fancy, lovely"
      },
      {
        character: 'aiko',
        text: "No worries, I'll go for the lamb! This is gonna be ripper!",
        translation: "Sem problemas, vou de cordeiro! Isso vai ser incrível!",
        connectedSpeech: "/noʊ wʌriz aɪl goʊ fɔr/",
        slangHighlight: "no worries, ripper"
      }
    ],
    culturalNote: "In the UK, 'fancy' means 'want' or 'would like'. 'Fancy a drink?' means 'Would you like a drink?'"
  },

  // LESSON 3: Around Town - Getting Directions
  {
    id: 'situation-l3-directions',
    lessonId: 'lesson03',
    title: 'Getting Directions',
    titlePt: 'Pedindo Direções',
    location: 'Sydney CBD',
    characters: ['aiko', 'lucas'],
    scenario: 'Aiko helps Lucas find his way around Sydney.',
    scenarioPt: 'Aiko ajuda Lucas a se orientar em Sydney.',
    lines: [
      {
        character: 'lucas',
        text: "Yo Aiko, I'm trying to get to the Opera House. Is it far?",
        translation: "Ei Aiko, estou tentando chegar à Opera House. É longe?",
        connectedSpeech: "/joʊ aɪkoʊ aɪm traɪɪŋ tə gɛt/",
        slangHighlight: "yo"
      },
      {
        character: 'aiko',
        text: "Nah, it's just a short walk, mate! Head down George Street and you'll see it.",
        translation: "Não, é só uma caminhada curta, cara! Vá pela George Street e você vai ver.",
        connectedSpeech: "/nɑː ɪts dʒʌst ə ʃɔrt wɔk meɪt/",
        slangHighlight: "nah, mate"
      },
      {
        character: 'lucas',
        text: "Bet! And after that, where's a good spot to grab some food?",
        translation: "Combinado! E depois disso, onde é um bom lugar para comer?",
        connectedSpeech: "/bɛt ænd æftər ðæt/",
        slangHighlight: "bet, spot"
      },
      {
        character: 'aiko',
        text: "The Rocks is heaps good for food! I reckon we should hit up a pub there this arvo.",
        translation: "The Rocks é muito bom para comida! Acho que devemos ir a um pub lá hoje à tarde.",
        connectedSpeech: "/ðə rɒks ɪz hiːps gʊd/",
        slangHighlight: "heaps, reckon, arvo"
      }
    ],
    culturalNote: "Australians abbreviate everything! 'Arvo' = afternoon, 'brekkie' = breakfast, 'servo' = service station."
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getTouristSpotsByCity(city: 'nyc' | 'london' | 'sydney'): TouristSpot[] {
  return TOURIST_SPOTS.filter(spot => spot.city === city);
}

export function getRealEnglishByLesson(lessonId: string): RealEnglishPhrase[] {
  return REAL_ENGLISH_PHRASES.filter(phrase => phrase.lessonId === lessonId);
}

export function getDialogueSituationsByLesson(lessonId: string): DialogueSituation[] {
  return DIALOGUE_SITUATIONS.filter(situation => situation.lessonId === lessonId);
}

export function getRealEnglishByRegion(region: 'us' | 'uk' | 'au'): RealEnglishPhrase[] {
  return REAL_ENGLISH_PHRASES.filter(phrase => phrase.region === region);
}
