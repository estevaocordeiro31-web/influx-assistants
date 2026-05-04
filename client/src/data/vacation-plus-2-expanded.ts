// Vacation Plus 2 - Conteúdo Expandido
// Chunks, Curiosidades Culturais e Badges

export interface Chunk {
  id: string;
  expression: string;
  meaning: string;
  examples: {
    us: string;
    uk: string;
    au: string;
  };
  connectedSpeech?: string; // Como soa na fala rápida
  audioText: {
    lucas: string;
    emily: string;
    aiko: string;
  };
}

export interface CulturalFact {
  id: string;
  city: "nyc" | "london" | "sydney";
  character: "lucas" | "emily" | "aiko";
  title: string;
  fact: string;
  funFact: string;
  image?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  influxcoins: number;
}

// ============================================
// LESSON 1: Going on Vacation
// ============================================
export const LESSON_1_CHUNKS: Chunk[] = [
  {
    id: "l1-c1",
    expression: "I'm so pumped!",
    meaning: "Estou muito animado/empolgado",
    examples: {
      us: "I'm so pumped for this trip!",
      uk: "I'm rather excited about this journey!",
      au: "I'm stoked for this trip, mate!",
    },
    connectedSpeech: "I'm so pumped → /aɪm soʊ pʌmpt/",
    audioText: {
      lucas: "I'm so pumped for this vacation! Can't wait to hit the beach!",
      emily: "I'm rather excited about our holiday. It shall be lovely!",
      aiko: "I'm so stoked for this trip, mate! It's gonna be epic!",
    },
  },
  {
    id: "l1-c2",
    expression: "Let's hit the road!",
    meaning: "Vamos pegar a estrada / Vamos nessa!",
    examples: {
      us: "Bags are packed, let's hit the road!",
      uk: "Right then, shall we be off?",
      au: "Chuck your bags in, let's hit the road!",
    },
    connectedSpeech: "Let's hit the road → /lɛts hɪt ðə roʊd/",
    audioText: {
      lucas: "Come on guys, let's hit the road! The adventure awaits!",
      emily: "Right then, shall we be off? The taxi's waiting.",
      aiko: "Chuck your stuff in the car, let's hit the road!",
    },
  },
  {
    id: "l1-c3",
    expression: "I've got my bags packed",
    meaning: "Já fiz minhas malas",
    examples: {
      us: "I've got my bags packed and I'm ready to go!",
      uk: "I've sorted out my luggage for the trip.",
      au: "I've chucked everything in my backpack!",
    },
    connectedSpeech: "I've got → /aɪv gɑt/",
    audioText: {
      lucas: "I've got my bags packed with all my essentials. Sunscreen, check!",
      emily: "I've sorted out my luggage. Passport, tickets, everything's in order.",
      aiko: "I've chucked everything in my backpack. Thongs, sunnies, good to go!",
    },
  },
  {
    id: "l1-c4",
    expression: "Can't wait!",
    meaning: "Mal posso esperar!",
    examples: {
      us: "Can't wait to see the Statue of Liberty!",
      uk: "I simply can't wait to visit Big Ben!",
      au: "Can't wait to hit Bondi Beach!",
    },
    connectedSpeech: "Can't wait → /kænt weɪt/",
    audioText: {
      lucas: "Can't wait to explore Times Square! It's gonna be awesome!",
      emily: "I simply can't wait to see the Tower of London. How exciting!",
      aiko: "Can't wait to see the Opera House, mate! It's gonna be unreal!",
    },
  },
  {
    id: "l1-c5",
    expression: "What time does our flight leave?",
    meaning: "Que horas sai nosso voo?",
    examples: {
      us: "What time does our flight leave? We gotta hustle!",
      uk: "What time does our flight depart? We mustn't be late.",
      au: "What time's our flight? We better get a move on!",
    },
    connectedSpeech: "What time does → /wʌt taɪm dʌz/",
    audioText: {
      lucas: "What time does our flight leave? We gotta get to JFK soon!",
      emily: "What time does our flight depart from Heathrow? We mustn't be late.",
      aiko: "What time's our flight from Sydney Airport? We better get a move on!",
    },
  },
];

export const LESSON_1_CULTURAL_FACTS: CulturalFact[] = [
  {
    id: "l1-cf1",
    city: "nyc",
    character: "lucas",
    title: "JFK Airport",
    fact: "O Aeroporto JFK é o maior aeroporto internacional dos EUA, com mais de 60 milhões de passageiros por ano.",
    funFact: "Americanos dizem 'carry-on' para bagagem de mão, enquanto britânicos dizem 'hand luggage'!",
  },
  {
    id: "l1-cf2",
    city: "london",
    character: "emily",
    title: "Heathrow Airport",
    fact: "Heathrow é o aeroporto mais movimentado da Europa, com voos para mais de 180 destinos.",
    funFact: "Britânicos dizem 'queue' para fila, enquanto americanos dizem 'line'. No aeroporto você vai ouvir muito 'Please queue here'!",
  },
  {
    id: "l1-cf3",
    city: "sydney",
    character: "aiko",
    title: "Sydney Airport",
    fact: "O aeroporto de Sydney fica a apenas 8km do centro da cidade, um dos mais próximos do mundo!",
    funFact: "Australianos adoram abreviar tudo! 'Arvo' = afternoon, 'servo' = service station, 'avo' = avocado!",
  },
];

// ============================================
// LESSON 2: Eating Out
// ============================================
export const LESSON_2_CHUNKS: Chunk[] = [
  {
    id: "l2-c1",
    expression: "I'm starving!",
    meaning: "Estou morrendo de fome!",
    examples: {
      us: "I'm starving! Let's grab some pizza!",
      uk: "I'm absolutely famished! Shall we get some food?",
      au: "I'm starving! Let's get some tucker!",
    },
    connectedSpeech: "I'm starving → /aɪm stɑrvɪŋ/",
    audioText: {
      lucas: "Dude, I'm starving! Let's hit up that burger joint!",
      emily: "I'm absolutely famished! Shall we pop into that lovely cafe?",
      aiko: "I'm starving, mate! Let's grab some brekkie!",
    },
  },
  {
    id: "l2-c2",
    expression: "Can I get the check?",
    meaning: "Pode trazer a conta?",
    examples: {
      us: "Excuse me, can I get the check?",
      uk: "Could we have the bill, please?",
      au: "Can we get the bill, mate?",
    },
    connectedSpeech: "Can I get → /kən aɪ gɛt/",
    audioText: {
      lucas: "Excuse me, can I get the check? We're ready to bounce.",
      emily: "Could we have the bill, please? That was a lovely meal.",
      aiko: "Can we get the bill, mate? Gotta head off soon.",
    },
  },
  {
    id: "l2-c3",
    expression: "This place is awesome!",
    meaning: "Esse lugar é incrível!",
    examples: {
      us: "This place is awesome! Best pizza in the city!",
      uk: "This place is brilliant! The food is simply divine!",
      au: "This place is sick! Best feed I've had in ages!",
    },
    connectedSpeech: "This place is → /ðɪs pleɪs ɪz/",
    audioText: {
      lucas: "This place is awesome! You gotta try their cheesecake!",
      emily: "This place is absolutely brilliant! The scones are divine!",
      aiko: "This place is sick, mate! Best smashed avo in Sydney!",
    },
  },
  {
    id: "l2-c4",
    expression: "I'll have...",
    meaning: "Eu vou querer...",
    examples: {
      us: "I'll have the cheeseburger with fries.",
      uk: "I'll have the fish and chips, please.",
      au: "I'll have the meat pie with sauce.",
    },
    connectedSpeech: "I'll have → /aɪl hæv/",
    audioText: {
      lucas: "I'll have the double bacon cheeseburger with extra pickles!",
      emily: "I'll have the afternoon tea set with scones, please.",
      aiko: "I'll have the chicken parma with chips, thanks mate!",
    },
  },
  {
    id: "l2-c5",
    expression: "It's on me!",
    meaning: "Eu pago! / É por minha conta!",
    examples: {
      us: "Don't worry about it, it's on me!",
      uk: "Please, allow me. It's my treat!",
      au: "No worries, I'll shout you!",
    },
    connectedSpeech: "It's on me → /ɪts ɑn mi/",
    audioText: {
      lucas: "Put your wallet away, dude. It's on me tonight!",
      emily: "Please, allow me to get this. It's my treat!",
      aiko: "No worries, mate! I'll shout you this round!",
    },
  },
];

export const LESSON_2_CULTURAL_FACTS: CulturalFact[] = [
  {
    id: "l2-cf1",
    city: "nyc",
    character: "lucas",
    title: "Tipping Culture",
    fact: "Nos EUA, a gorjeta de 15-20% é praticamente obrigatória em restaurantes. Garçons dependem das gorjetas!",
    funFact: "Americanos pedem 'check' no final da refeição, mas britânicos pedem 'bill'. Cuidado para não confundir!",
  },
  {
    id: "l2-cf2",
    city: "london",
    character: "emily",
    title: "Afternoon Tea",
    fact: "O tradicional 'Afternoon Tea' britânico inclui scones, sandwiches de pepino e chá Earl Grey.",
    funFact: "Britânicos dizem 'chips' para batata frita e 'crisps' para chips de pacote. O contrário dos americanos!",
  },
  {
    id: "l2-cf3",
    city: "sydney",
    character: "aiko",
    title: "Café Culture",
    fact: "Sydney tem uma das melhores culturas de café do mundo. Australianos inventaram o 'flat white'!",
    funFact: "Australianos dizem 'brekkie' para café da manhã e 'arvo' para afternoon. Abreviam tudo!",
  },
];

// ============================================
// LESSON 3: Around Town
// ============================================
export const LESSON_3_CHUNKS: Chunk[] = [
  {
    id: "l3-c1",
    expression: "How do I get to...?",
    meaning: "Como eu chego em...?",
    examples: {
      us: "Excuse me, how do I get to Times Square?",
      uk: "Pardon me, how do I get to Buckingham Palace?",
      au: "Hey mate, how do I get to the Opera House?",
    },
    connectedSpeech: "How do I get to → /haʊ du aɪ gɛt tu/",
    audioText: {
      lucas: "Excuse me, how do I get to Central Park from here?",
      emily: "Pardon me, how do I get to the British Museum?",
      aiko: "Hey mate, how do I get to Circular Quay?",
    },
  },
  {
    id: "l3-c2",
    expression: "It's just around the corner",
    meaning: "É logo ali na esquina",
    examples: {
      us: "The coffee shop? It's just around the corner.",
      uk: "The chemist? It's just round the corner.",
      au: "The bottle-o? It's just around the corner, mate.",
    },
    connectedSpeech: "around the corner → /əraʊnd ðə kɔrnər/",
    audioText: {
      lucas: "The subway station? It's just around the corner, can't miss it!",
      emily: "The Tube station? It's just round the corner, past the newsagent.",
      aiko: "The train station? It's just around the corner, mate. Easy as!",
    },
  },
  {
    id: "l3-c3",
    expression: "Take the first left",
    meaning: "Vire na primeira à esquerda",
    examples: {
      us: "Take the first left, then go straight for two blocks.",
      uk: "Take the first left, then carry on for about 100 metres.",
      au: "Take the first left, then it's about 50 metres down.",
    },
    connectedSpeech: "Take the first → /teɪk ðə fɜrst/",
    audioText: {
      lucas: "Take the first left on Broadway, then you'll see it on your right.",
      emily: "Take the first left past the pub, then carry on straight.",
      aiko: "Take the first left at the servo, then it's right there, mate.",
    },
  },
  {
    id: "l3-c4",
    expression: "You can't miss it!",
    meaning: "Você não tem como errar!",
    examples: {
      us: "It's the big red building. You can't miss it!",
      uk: "It's the grand building with columns. You can't miss it!",
      au: "It's the massive white building. You can't miss it, mate!",
    },
    connectedSpeech: "You can't miss it → /ju kænt mɪs ɪt/",
    audioText: {
      lucas: "Look for the Empire State Building. You can't miss it!",
      emily: "Look for Big Ben. You simply can't miss it!",
      aiko: "Look for the Harbour Bridge. You can't miss it, mate!",
    },
  },
  {
    id: "l3-c5",
    expression: "Is it far from here?",
    meaning: "É longe daqui?",
    examples: {
      us: "Is it far from here? Should I take an Uber?",
      uk: "Is it far from here? Shall I take a taxi?",
      au: "Is it far from here? Should I grab a cab?",
    },
    connectedSpeech: "Is it far → /ɪz ɪt fɑr/",
    audioText: {
      lucas: "Is it far from here? Maybe I should take the subway.",
      emily: "Is it far from here? Perhaps I should take the Tube.",
      aiko: "Is it far from here? Reckon I should grab a ferry?",
    },
  },
];

export const LESSON_3_CULTURAL_FACTS: CulturalFact[] = [
  {
    id: "l3-cf1",
    city: "nyc",
    character: "lucas",
    title: "NYC Subway",
    fact: "O metrô de Nova York funciona 24 horas por dia, 7 dias por semana - um dos poucos do mundo!",
    funFact: "Americanos dizem 'subway', britânicos dizem 'tube' ou 'underground', e australianos dizem 'train'!",
  },
  {
    id: "l3-cf2",
    city: "london",
    character: "emily",
    title: "The Tube",
    fact: "O metrô de Londres (The Tube) é o mais antigo do mundo, inaugurado em 1863!",
    funFact: "Britânicos dizem 'pavement' para calçada, enquanto americanos dizem 'sidewalk'!",
  },
  {
    id: "l3-cf3",
    city: "sydney",
    character: "aiko",
    title: "Sydney Ferries",
    fact: "As balsas de Sydney são uma das formas mais bonitas de transporte público do mundo!",
    funFact: "Australianos dizem 'CBD' (Central Business District) para centro da cidade, não 'downtown'!",
  },
];

// ============================================
// LESSON 4: Talking About Others
// ============================================
export const LESSON_4_CHUNKS: Chunk[] = [
  {
    id: "l4-c1",
    expression: "She's super chill",
    meaning: "Ela é muito tranquila/de boa",
    examples: {
      us: "My roommate is super chill. We get along great!",
      uk: "My flatmate is ever so lovely. We get on brilliantly!",
      au: "My housemate is heaps chill. We're good mates!",
    },
    connectedSpeech: "super chill → /supər tʃɪl/",
    audioText: {
      lucas: "My girlfriend is super chill. She never stresses about anything!",
      emily: "My partner is ever so lovely. She's always so calm and collected.",
      aiko: "My girlfriend is heaps chill, mate. Never gets worked up about stuff!",
    },
  },
  {
    id: "l4-c2",
    expression: "He's a great guy",
    meaning: "Ele é um cara muito legal",
    examples: {
      us: "My boss is a great guy. Super supportive!",
      uk: "My manager is a lovely chap. Ever so helpful!",
      au: "My boss is a legend. Top bloke!",
    },
    connectedSpeech: "He's a great → /hiz ə greɪt/",
    audioText: {
      lucas: "My buddy Jake is a great guy. Always has my back!",
      emily: "My colleague James is a lovely chap. Ever so professional!",
      aiko: "My mate Dave is a legend. Absolute top bloke!",
    },
  },
  {
    id: "l4-c3",
    expression: "We get along really well",
    meaning: "A gente se dá muito bem",
    examples: {
      us: "We get along really well. We hang out all the time!",
      uk: "We get on rather well. We meet up quite often!",
      au: "We get along heaps well. Always catching up!",
    },
    connectedSpeech: "get along → /gɛt əlɔŋ/",
    audioText: {
      lucas: "Me and my coworkers get along really well. We grab lunch together every day!",
      emily: "My colleagues and I get on rather well. We often have tea together.",
      aiko: "Me and my workmates get along heaps well. Always having a yarn!",
    },
  },
  {
    id: "l4-c4",
    expression: "She's kind of annoying",
    meaning: "Ela é meio chata",
    examples: {
      us: "My neighbor is kind of annoying. Always playing loud music!",
      uk: "My neighbour is rather tiresome. Always making a racket!",
      au: "My neighbour is a bit dodgy. Always making heaps of noise!",
    },
    connectedSpeech: "kind of → /kaɪndə/",
    audioText: {
      lucas: "My upstairs neighbor is kind of annoying. Parties every weekend!",
      emily: "My neighbour is rather tiresome. Always playing music at odd hours!",
      aiko: "My neighbour is a bit dodgy, mate. Heaps loud all the time!",
    },
  },
  {
    id: "l4-c5",
    expression: "He's really smart",
    meaning: "Ele é muito inteligente",
    examples: {
      us: "My professor is really smart. Knows everything about physics!",
      uk: "My lecturer is frightfully clever. Brilliant mind!",
      au: "My teacher is really brainy. Knows heaps about everything!",
    },
    connectedSpeech: "really smart → /rɪli smɑrt/",
    audioText: {
      lucas: "My professor is really smart. Like, genius level smart!",
      emily: "My lecturer is frightfully clever. Absolutely brilliant!",
      aiko: "My teacher is really brainy, mate. Knows everything!",
    },
  },
];

export const LESSON_4_CULTURAL_FACTS: CulturalFact[] = [
  {
    id: "l4-cf1",
    city: "nyc",
    character: "lucas",
    title: "Roommates",
    fact: "Em NYC, é muito comum dividir apartamento com 'roommates' devido aos aluguéis altíssimos!",
    funFact: "Americanos dizem 'roommate', britânicos dizem 'flatmate', e australianos dizem 'housemate'!",
  },
  {
    id: "l4-cf2",
    city: "london",
    character: "emily",
    title: "British Understatement",
    fact: "Britânicos são famosos por 'understatement' - dizer menos do que realmente sentem!",
    funFact: "'Not bad' em inglês britânico geralmente significa 'muito bom'! É o famoso understatement!",
  },
  {
    id: "l4-cf3",
    city: "sydney",
    character: "aiko",
    title: "Aussie Slang",
    fact: "Australianos adoram usar gírias! 'Legend' e 'top bloke' são elogios muito comuns!",
    funFact: "Australianos chamam amigos de 'mate', mas também usam 'mate' com estranhos de forma amigável!",
  },
];

// ============================================
// LESSON 5: Spending Money
// ============================================
export const LESSON_5_CHUNKS: Chunk[] = [
  {
    id: "l5-c1",
    expression: "Can I borrow...?",
    meaning: "Posso pegar emprestado...?",
    examples: {
      us: "Can I borrow twenty bucks? I'll pay you back!",
      uk: "Could I borrow a tenner? I'll return it tomorrow!",
      au: "Can I borrow fifty? I'll shout you later!",
    },
    connectedSpeech: "Can I borrow → /kən aɪ bɑroʊ/",
    audioText: {
      lucas: "Hey, can I borrow twenty bucks? I forgot my wallet at home!",
      emily: "Could I possibly borrow a tenner? I seem to have left my purse.",
      aiko: "Can I borrow fifty, mate? I'll shout you a coffee later!",
    },
  },
  {
    id: "l5-c2",
    expression: "It's a great deal!",
    meaning: "É uma ótima oferta!",
    examples: {
      us: "This jacket is 50% off! It's a great deal!",
      uk: "This coat is half price! What a bargain!",
      au: "This jumper is on special! Heaps good deal!",
    },
    connectedSpeech: "It's a great → /ɪts ə greɪt/",
    audioText: {
      lucas: "Check out these sneakers! 40% off! It's a great deal!",
      emily: "Look at this lovely dress! Half price! What an absolute bargain!",
      aiko: "Check out these thongs! Only five bucks! Heaps good deal, mate!",
    },
  },
  {
    id: "l5-c3",
    expression: "I'm broke",
    meaning: "Estou sem dinheiro / Estou duro",
    examples: {
      us: "Can't go out tonight. I'm totally broke!",
      uk: "I'm afraid I'm rather skint at the moment.",
      au: "Can't come out, mate. I'm flat broke!",
    },
    connectedSpeech: "I'm broke → /aɪm broʊk/",
    audioText: {
      lucas: "Sorry guys, can't do dinner tonight. I'm totally broke until payday!",
      emily: "I'm afraid I'm rather skint at the moment. Perhaps next week?",
      aiko: "Can't come to the pub, mate. I'm flat broke until Friday!",
    },
  },
  {
    id: "l5-c4",
    expression: "How much is this?",
    meaning: "Quanto custa isso?",
    examples: {
      us: "Excuse me, how much is this t-shirt?",
      uk: "Pardon me, how much is this jumper?",
      au: "Hey, how much is this singlet?",
    },
    connectedSpeech: "How much is → /haʊ mʌtʃ ɪz/",
    audioText: {
      lucas: "Excuse me, how much is this hoodie? Is it on sale?",
      emily: "Pardon me, how much is this cardigan? It's lovely!",
      aiko: "Hey mate, how much is this singlet? Is it on special?",
    },
  },
  {
    id: "l5-c5",
    expression: "I'll pay you back",
    meaning: "Eu te pago de volta",
    examples: {
      us: "Thanks for covering me! I'll pay you back tomorrow!",
      uk: "Cheers for that! I'll pay you back straightaway!",
      au: "Thanks mate! I'll pay you back next week!",
    },
    connectedSpeech: "I'll pay you back → /aɪl peɪ ju bæk/",
    audioText: {
      lucas: "Thanks for spotting me, dude! I'll pay you back as soon as I get paid!",
      emily: "Cheers for that! I'll pay you back first thing tomorrow!",
      aiko: "Thanks for that, mate! I'll pay you back next arvo, no worries!",
    },
  },
];

export const LESSON_5_CULTURAL_FACTS: CulturalFact[] = [
  {
    id: "l5-cf1",
    city: "nyc",
    character: "lucas",
    title: "Black Friday",
    fact: "A Black Friday nos EUA é o maior dia de compras do ano, com filas enormes desde a madrugada!",
    funFact: "Americanos dizem 'bucks' para dólares de forma informal. '20 bucks' = 20 dólares!",
  },
  {
    id: "l5-cf2",
    city: "london",
    character: "emily",
    title: "Boxing Day Sales",
    fact: "No Reino Unido, o 'Boxing Day' (26 de dezembro) é o maior dia de promoções do ano!",
    funFact: "Britânicos dizem 'quid' para libras. '10 quid' = 10 libras. Também usam 'tenner' para £10!",
  },
  {
    id: "l5-cf3",
    city: "sydney",
    character: "aiko",
    title: "Aussie Sales",
    fact: "Na Austrália, as maiores promoções acontecem no 'End of Financial Year' (junho)!",
    funFact: "Australianos dizem 'shout' quando vão pagar algo para alguém. 'I'll shout you a beer!'",
  },
];

// ============================================
// LESSON 6: A Piece of Advice
// ============================================
export const LESSON_6_CHUNKS: Chunk[] = [
  {
    id: "l6-c1",
    expression: "You should definitely...",
    meaning: "Você definitivamente deveria...",
    examples: {
      us: "You should definitely try the pizza here!",
      uk: "You really ought to visit the museum!",
      au: "You should definitely check out the beach!",
    },
    connectedSpeech: "You should → /ju ʃʊd/",
    audioText: {
      lucas: "You should definitely check out Central Park! It's amazing in the fall!",
      emily: "You really ought to visit the National Gallery. It's absolutely free!",
      aiko: "You should definitely hit up Bondi Beach! Best waves in Sydney!",
    },
  },
  {
    id: "l6-c2",
    expression: "If I were you...",
    meaning: "Se eu fosse você...",
    examples: {
      us: "If I were you, I'd take the subway. It's faster!",
      uk: "If I were you, I'd take the Tube. Much quicker!",
      au: "If I were you, I'd catch the ferry. Way more scenic!",
    },
    connectedSpeech: "If I were you → /ɪf aɪ wɜr ju/",
    audioText: {
      lucas: "If I were you, I'd grab a hot dog from that cart. Best in the city!",
      emily: "If I were you, I'd pop into that tea room. Lovely scones!",
      aiko: "If I were you, I'd try the fish and chips at the wharf. Heaps good!",
    },
  },
  {
    id: "l6-c3",
    expression: "Trust me on this",
    meaning: "Confia em mim nisso",
    examples: {
      us: "Trust me on this, you won't regret it!",
      uk: "Take my word for it, you shan't be disappointed!",
      au: "Trust me on this, mate. It's gonna be epic!",
    },
    connectedSpeech: "Trust me → /trʌst mi/",
    audioText: {
      lucas: "Trust me on this, the Brooklyn Bridge at sunset is incredible!",
      emily: "Take my word for it, the view from the Shard is simply breathtaking!",
      aiko: "Trust me on this, mate. The sunrise at Uluru is unreal!",
    },
  },
  {
    id: "l6-c4",
    expression: "I'd recommend...",
    meaning: "Eu recomendaria...",
    examples: {
      us: "I'd recommend the steak. It's their specialty!",
      uk: "I'd suggest the fish. It's rather good here!",
      au: "I'd reckon you should try the barramundi!",
    },
    connectedSpeech: "I'd recommend → /aɪd rɛkəmɛnd/",
    audioText: {
      lucas: "I'd recommend the cheesecake at Junior's. Best in New York!",
      emily: "I'd suggest the afternoon tea at The Ritz. Absolutely divine!",
      aiko: "I'd reckon you should try the meat pie at Harry's. Legendary!",
    },
  },
  {
    id: "l6-c5",
    expression: "Watch out for...",
    meaning: "Cuidado com...",
    examples: {
      us: "Watch out for pickpockets in Times Square!",
      uk: "Mind the gap when getting off the Tube!",
      au: "Watch out for the jellyfish at the beach!",
    },
    connectedSpeech: "Watch out for → /wɑtʃ aʊt fɔr/",
    audioText: {
      lucas: "Watch out for the traffic in Manhattan! Drivers are crazy here!",
      emily: "Mind the gap when getting off the Tube! It can be quite wide!",
      aiko: "Watch out for the bluebottles at the beach, mate! They sting!",
    },
  },
];

export const LESSON_6_CULTURAL_FACTS: CulturalFact[] = [
  {
    id: "l6-cf1",
    city: "nyc",
    character: "lucas",
    title: "NYC Tips",
    fact: "Nova-iorquinos são conhecidos por dar conselhos diretos e honestos, mesmo para estranhos!",
    funFact: "Americanos usam 'you guys' para se referir a grupos, enquanto australianos usam 'you lot' ou 'youse'!",
  },
  {
    id: "l6-cf2",
    city: "london",
    character: "emily",
    title: "British Politeness",
    fact: "Britânicos são famosos por serem extremamente educados ao dar conselhos, usando 'perhaps' e 'might'!",
    funFact: "'Mind the gap' é a frase mais famosa do metrô de Londres! Você vai ouvir em toda estação!",
  },
  {
    id: "l6-cf3",
    city: "sydney",
    character: "aiko",
    title: "Aussie Advice",
    fact: "Australianos são muito diretos e informais ao dar conselhos, sempre com um 'mate' no final!",
    funFact: "Australianos usam 'reckon' em vez de 'think'. 'I reckon you should...' é muito comum!",
  },
];

// ============================================
// LESSON 7: Free Time
// ============================================
export const LESSON_7_CHUNKS: Chunk[] = [
  {
    id: "l7-c1",
    expression: "What do you do for fun?",
    meaning: "O que você faz para se divertir?",
    examples: {
      us: "So, what do you do for fun around here?",
      uk: "What do you get up to in your spare time?",
      au: "What do you do for fun on the weekends?",
    },
    connectedSpeech: "What do you do → /wʌt du ju du/",
    audioText: {
      lucas: "So, what do you do for fun? I'm always looking for new spots!",
      emily: "What do you get up to in your spare time? Any hobbies?",
      aiko: "What do you do for fun on the weekends, mate?",
    },
  },
  {
    id: "l7-c2",
    expression: "I'm really into...",
    meaning: "Eu curto muito... / Sou muito fã de...",
    examples: {
      us: "I'm really into basketball. Go Lakers!",
      uk: "I'm rather keen on football. Up the Arsenal!",
      au: "I'm really into surfing. Best waves at Bondi!",
    },
    connectedSpeech: "I'm really into → /aɪm rɪli ɪntu/",
    audioText: {
      lucas: "I'm really into basketball. I play every weekend at the park!",
      emily: "I'm rather keen on theatre. The West End has brilliant shows!",
      aiko: "I'm really into surfing, mate. Nothing beats catching waves at dawn!",
    },
  },
  {
    id: "l7-c3",
    expression: "Let's hang out!",
    meaning: "Vamos sair! / Vamos nos encontrar!",
    examples: {
      us: "Hey, let's hang out this weekend!",
      uk: "Shall we meet up this weekend?",
      au: "Let's catch up this weekend, mate!",
    },
    connectedSpeech: "Let's hang out → /lɛts hæŋ aʊt/",
    audioText: {
      lucas: "Hey, let's hang out this weekend! There's a cool rooftop bar downtown!",
      emily: "Shall we meet up this weekend? There's a lovely market in Camden!",
      aiko: "Let's catch up this weekend, mate! We could hit the beach!",
    },
  },
  {
    id: "l7-c4",
    expression: "I'm not really a fan of...",
    meaning: "Não sou muito fã de...",
    examples: {
      us: "I'm not really a fan of horror movies.",
      uk: "I'm not terribly keen on horror films.",
      au: "I'm not really into scary movies, mate.",
    },
    connectedSpeech: "I'm not really → /aɪm nɑt rɪli/",
    audioText: {
      lucas: "I'm not really a fan of country music. More of a hip-hop guy!",
      emily: "I'm not terribly keen on loud clubs. I prefer a quiet pub.",
      aiko: "I'm not really into camping, mate. Give me a hotel any day!",
    },
  },
  {
    id: "l7-c5",
    expression: "That sounds awesome!",
    meaning: "Isso parece incrível!",
    examples: {
      us: "A concert in Central Park? That sounds awesome!",
      uk: "A show in the West End? That sounds brilliant!",
      au: "A barbie at the beach? That sounds sick!",
    },
    connectedSpeech: "That sounds → /ðæt saʊndz/",
    audioText: {
      lucas: "A Yankees game? That sounds awesome! Count me in!",
      emily: "Afternoon tea at Harrods? That sounds absolutely lovely!",
      aiko: "A surf trip to Byron Bay? That sounds sick, mate! I'm in!",
    },
  },
];

export const LESSON_7_CULTURAL_FACTS: CulturalFact[] = [
  {
    id: "l7-cf1",
    city: "nyc",
    character: "lucas",
    title: "NYC Entertainment",
    fact: "Nova York é conhecida como 'a cidade que nunca dorme' - sempre tem algo acontecendo 24/7!",
    funFact: "Americanos dizem 'movie' enquanto britânicos dizem 'film'. Ambos são corretos!",
  },
  {
    id: "l7-cf2",
    city: "london",
    character: "emily",
    title: "British Pubs",
    fact: "Os pubs britânicos são o centro da vida social! 'Going to the pub' é um programa clássico!",
    funFact: "Britânicos dizem 'football' para futebol, mas americanos usam 'soccer'. Cuidado para não confundir!",
  },
  {
    id: "l7-cf3",
    city: "sydney",
    character: "aiko",
    title: "Aussie BBQ",
    fact: "O 'barbie' (churrasco) é uma tradição sagrada na Austrália! Praias têm churrasqueiras públicas gratuitas!",
    funFact: "Australianos usam 'arvo' para afternoon. 'See you this arvo!' = Te vejo hoje à tarde!",
  },
];

// ============================================
// LESSON 8: Plans For The Future
// ============================================
export const LESSON_8_CHUNKS: Chunk[] = [
  {
    id: "l8-c1",
    expression: "I'm gonna...",
    meaning: "Eu vou... (informal para 'going to')",
    examples: {
      us: "I'm gonna start my own business someday!",
      uk: "I'm going to pursue my Master's degree.",
      au: "I'm gonna travel around Asia next year!",
    },
    connectedSpeech: "I'm gonna → /aɪm gɑnə/",
    audioText: {
      lucas: "I'm gonna start my own tech company! Silicon Valley, here I come!",
      emily: "I'm going to pursue my Master's at Cambridge. Quite exciting!",
      aiko: "I'm gonna backpack through Southeast Asia! Gonna be epic, mate!",
    },
  },
  {
    id: "l8-c2",
    expression: "I've always wanted to...",
    meaning: "Eu sempre quis...",
    examples: {
      us: "I've always wanted to visit Japan!",
      uk: "I've always wanted to see the Northern Lights!",
      au: "I've always wanted to dive the Great Barrier Reef!",
    },
    connectedSpeech: "I've always wanted → /aɪv ɔlweɪz wɑntɪd/",
    audioText: {
      lucas: "I've always wanted to visit Tokyo! The food looks amazing!",
      emily: "I've always wanted to see the Northern Lights in Iceland!",
      aiko: "I've always wanted to dive the Great Barrier Reef! Bucket list!",
    },
  },
  {
    id: "l8-c3",
    expression: "My dream is to...",
    meaning: "Meu sonho é...",
    examples: {
      us: "My dream is to live in California!",
      uk: "My dream is to own a cottage in the Cotswolds!",
      au: "My dream is to surf every beach in Australia!",
    },
    connectedSpeech: "My dream is → /maɪ drim ɪz/",
    audioText: {
      lucas: "My dream is to make it big on Broadway! I've got the talent!",
      emily: "My dream is to own a lovely cottage in the countryside!",
      aiko: "My dream is to surf every famous beach in the world, mate!",
    },
  },
  {
    id: "l8-c4",
    expression: "Hopefully...",
    meaning: "Espero que... / Com sorte...",
    examples: {
      us: "Hopefully, I'll get promoted next year!",
      uk: "Hopefully, I shall secure a position at the firm!",
      au: "Hopefully, I'll land that job next month!",
    },
    connectedSpeech: "Hopefully → /hoʊpfəli/",
    audioText: {
      lucas: "Hopefully, I'll get that promotion by the end of the year!",
      emily: "Hopefully, I shall secure a position at a prestigious firm!",
      aiko: "Hopefully, I'll land that dream job in Melbourne, mate!",
    },
  },
  {
    id: "l8-c5",
    expression: "I'm planning to...",
    meaning: "Estou planejando...",
    examples: {
      us: "I'm planning to move to LA next summer!",
      uk: "I'm planning to relocate to Edinburgh next year!",
      au: "I'm planning to move to the Gold Coast soon!",
    },
    connectedSpeech: "I'm planning to → /aɪm plænɪŋ tu/",
    audioText: {
      lucas: "I'm planning to move to Austin next year. Tech scene is booming!",
      emily: "I'm planning to relocate to Edinburgh. Such a beautiful city!",
      aiko: "I'm planning to move to the Gold Coast, mate. Better surf there!",
    },
  },
];

export const LESSON_8_CULTURAL_FACTS: CulturalFact[] = [
  {
    id: "l8-cf1",
    city: "nyc",
    character: "lucas",
    title: "American Dream",
    fact: "O 'American Dream' ainda é muito forte! Muitos americanos sonham em abrir seu próprio negócio!",
    funFact: "Americanos usam 'gonna' na fala informal. É a contração de 'going to'. Muito comum!",
  },
  {
    id: "l8-cf2",
    city: "london",
    character: "emily",
    title: "Gap Year",
    fact: "O 'gap year' é muito popular no Reino Unido - um ano de viagens antes da universidade!",
    funFact: "Britânicos ainda usam 'shall' para futuro formal. 'I shall return!' soa muito elegante!",
  },
  {
    id: "l8-cf3",
    city: "sydney",
    character: "aiko",
    title: "Working Holiday",
    fact: "A Austrália oferece 'Working Holiday Visa' para jovens de vários países explorarem o país!",
    funFact: "Australianos usam 'reckon' para expressar opinião. 'I reckon it'll be great!' = Acho que vai ser ótimo!",
  },
];

// ============================================
// BADGES DO VACATION PLUS 2
// ============================================
export const VACATION_BADGES: Badge[] = [
  {
    id: "vp2-badge-1",
    name: "Viajante Iniciante",
    description: "Completou a primeira lição do Vacation Plus 2",
    icon: "✈️",
    color: "from-cyan-500 to-blue-600",
    requirement: "Completar Lesson 1: Going on Vacation",
    influxcoins: 50,
  },
  {
    id: "vp2-badge-2",
    name: "Foodie Internacional",
    description: "Dominou o vocabulário de restaurantes em 3 países",
    icon: "🍽️",
    color: "from-orange-500 to-red-600",
    requirement: "Completar Lesson 2: Eating Out",
    influxcoins: 50,
  },
  {
    id: "vp2-badge-3",
    name: "Explorador Urbano",
    description: "Sabe se locomover em qualquer cidade do mundo",
    icon: "🗺️",
    color: "from-green-500 to-emerald-600",
    requirement: "Completar Lesson 3: Around Town",
    influxcoins: 50,
  },
  {
    id: "vp2-badge-4",
    name: "Comunicador Social",
    description: "Mestre em descrever pessoas em inglês",
    icon: "👥",
    color: "from-pink-500 to-rose-600",
    requirement: "Completar Lesson 4: Talking About Others",
    influxcoins: 50,
  },
  {
    id: "vp2-badge-5",
    name: "Comprador Esperto",
    description: "Sabe negociar e fazer compras em qualquer país",
    icon: "🛍️",
    color: "from-yellow-500 to-amber-600",
    requirement: "Completar Lesson 5: Spending Money",
    influxcoins: 50,
  },
  {
    id: "vp2-badge-6",
    name: "Conselheiro Sábio",
    description: "Mestre em dar conselhos em inglês",
    icon: "💡",
    color: "from-purple-500 to-violet-600",
    requirement: "Completar Lesson 6: A Piece of Advice",
    influxcoins: 50,
  },
  {
    id: "vp2-badge-7",
    name: "Vida Social",
    description: "Sabe falar sobre hobbies e tempo livre",
    icon: "🎮",
    color: "from-indigo-500 to-blue-600",
    requirement: "Completar Lesson 7: Free Time",
    influxcoins: 50,
  },
  {
    id: "vp2-badge-8",
    name: "Visionário",
    description: "Mestre em falar sobre planos futuros",
    icon: "🚀",
    color: "from-teal-500 to-cyan-600",
    requirement: "Completar Lesson 8: Plans For The Future",
    influxcoins: 50,
  },
  {
    id: "vp2-badge-master",
    name: "Mestre do Vacation Plus 2",
    description: "Completou todas as 8 lições com sucesso!",
    icon: "🏆",
    color: "from-yellow-400 to-orange-500",
    requirement: "Completar todas as 8 lições",
    influxcoins: 200,
  },
  {
    id: "vp2-badge-polyglot",
    name: "Poliglota Cultural",
    description: "Dominou as diferenças entre US, UK e AU English",
    icon: "🌍",
    color: "from-emerald-400 to-teal-500",
    requirement: "Acertar 90%+ em todos os quizzes",
    influxcoins: 150,
  },
  {
    id: "vp2-badge-speaker",
    name: "Falante Nativo",
    description: "Ouviu todos os áudios TTS dos personagens",
    icon: "🎙️",
    color: "from-blue-400 to-purple-500",
    requirement: "Ouvir todos os áudios de Lucas, Emily e Aiko",
    influxcoins: 100,
  },
  {
    id: "vp2-badge-curious",
    name: "Curioso Cultural",
    description: "Leu todas as curiosidades sobre NYC, Londres e Sydney",
    icon: "📚",
    color: "from-rose-400 to-pink-500",
    requirement: "Visualizar todas as curiosidades culturais",
    influxcoins: 75,
  },
];

// Exportar todos os chunks por lição
export const ALL_CHUNKS = {
  1: LESSON_1_CHUNKS,
  2: LESSON_2_CHUNKS,
  3: LESSON_3_CHUNKS,
  4: LESSON_4_CHUNKS,
  5: LESSON_5_CHUNKS,
  6: LESSON_6_CHUNKS,
  7: LESSON_7_CHUNKS,
  8: LESSON_8_CHUNKS,
};

// Exportar todas as curiosidades por lição
export const ALL_CULTURAL_FACTS = {
  1: LESSON_1_CULTURAL_FACTS,
  2: LESSON_2_CULTURAL_FACTS,
  3: LESSON_3_CULTURAL_FACTS,
  4: LESSON_4_CULTURAL_FACTS,
  5: LESSON_5_CULTURAL_FACTS,
  6: LESSON_6_CULTURAL_FACTS,
  7: LESSON_7_CULTURAL_FACTS,
  8: LESSON_8_CULTURAL_FACTS,
};


// ============================================
// VÍDEOS ANIMADOS - Vacation Plus 2
// ============================================
export interface LessonVideo {
  unit: number;
  title: string;
  titlePt: string;
  description: string;
  character: "lucas" | "emily" | "aiko";
  city: "nyc" | "london" | "sydney";
  duration: string;
  videoUrl: string;
  thumbnail?: string;
}

export const LESSON_VIDEOS: LessonVideo[] = [
  {
    unit: 1,
    title: "Going on Vacation",
    titlePt: "Indo de Férias",
    description: "Lucas at the Airport - JFK, New York",
    character: "lucas",
    city: "nyc",
    duration: "0:24",
    videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/piTUCJwoKFdiNDBe.mp4",
  },
  {
    unit: 2,
    title: "Eating Out",
    titlePt: "Comendo Fora",
    description: "Emily's Restaurant Adventure - London",
    character: "emily",
    city: "london",
    duration: "0:32",
    videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/HwBJKwPamFtdwVgZ.mp4",
  },
  {
    unit: 3,
    title: "Around Town",
    titlePt: "Pela Cidade",
    description: "Aiko Explores Downtown Sydney",
    character: "aiko",
    city: "sydney",
    duration: "0:21",
    videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/cySzjbcxjUfJZjeX.mp4",
  },
  {
    unit: 4,
    title: "Describing People",
    titlePt: "Descrevendo Pessoas",
    description: "Lucas Describes His Squad - Central Park",
    character: "lucas",
    city: "nyc",
    duration: "0:20",
    videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/DYPngVTUBQUwczrA.mp4",
  },
  {
    unit: 5,
    title: "Shopping",
    titlePt: "Fazendo Compras",
    description: "Emily Goes Shopping - Oxford Street",
    character: "emily",
    city: "london",
    duration: "0:22",
    videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/VJDacYcjbYTWtBYb.mp4",
  },
  {
    unit: 6,
    title: "Giving Advice",
    titlePt: "Dando Conselhos",
    description: "Aiko's Life Advice - Bondi Beach",
    character: "aiko",
    city: "sydney",
    duration: "0:20",
    videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/QdQKKZWJNuVOAFBg.mp4",
  },
  {
    unit: 7,
    title: "Talking About Hobbies",
    titlePt: "Falando Sobre Hobbies",
    description: "Lucas and His Hobbies - NYC",
    character: "lucas",
    city: "nyc",
    duration: "0:25",
    videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/qbPwqyDsMgIMsVpl.mp4",
  },
  {
    unit: 8,
    title: "Future Plans",
    titlePt: "Planos Futuros",
    description: "Emily's Future Plans - London Eye",
    character: "emily",
    city: "london",
    duration: "0:32",
    videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/fVZgNMSTwgFCOrml.mp4",
  },
];

// Exportar vídeos por unidade
export const VIDEO_BY_UNIT: Record<number, LessonVideo> = LESSON_VIDEOS.reduce(
  (acc, video) => ({ ...acc, [video.unit]: video }),
  {}
);
