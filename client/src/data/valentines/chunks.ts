export type Character = 'lucas' | 'emily' | 'aiko';

export interface ValentineChunk {
  id: string;
  chunk: string;
  who: Character;
  city: string;
  flag: string;
  equivalencia: string;
  contexto: string;
  exemplo: { en: string; pt: string };
  nota?: string;
}

export const VALENTINE_CHUNKS: ValentineChunk[] = [
  {
    id: 'be_my_valentine',
    chunk: "Be my Valentine!",
    who: 'lucas',
    city: 'Nova York',
    flag: '🇺🇸',
    equivalencia: "Seja meu namorado(a)! / Quer ser meu par?",
    contexto: "A frase mais clássica do Valentine's Day nos EUA. Lucas diz que em NY todo mundo troca cartõezinhos com essa frase desde a escola.",
    exemplo: {
      en: "I got you flowers and chocolates... Will you be my Valentine?",
      pt: "Trouxe flores e chocolates pra você... Quer ser meu par no Valentine's?"
    },
    nota: "Nos EUA, crianças trocam valentines (cartõezinhos) na escola com TODOS os colegas — não é só romântico!"
  },
  {
    id: 'fancy_a_date',
    chunk: "Fancy a date?",
    who: 'emily',
    city: 'Londres',
    flag: '🇬🇧',
    equivalencia: "Quer sair comigo? / Topa um encontro?",
    contexto: "Jeito britânico de convidar alguém para sair. 'Fancy' em inglês britânico = querer/ter vontade. Emily usa com aquele charme britânico típico.",
    exemplo: {
      en: "It's Valentine's Day... Fancy a date? I know a lovely restaurant near the Thames.",
      pt: "É Dia dos Namorados... Topa sair? Conheço um restaurante lindo perto do Tâmisa."
    },
    nota: "⚠️ 'Fancy' no UK = querer. 'I fancy you' = Eu gosto de você (romanticamente). Nos EUA, 'fancy' = chique/elegante."
  },
  {
    id: 'keen_on_you',
    chunk: "I'm keen on you!",
    who: 'aiko',
    city: 'Sydney',
    flag: '🇦🇺',
    equivalencia: "Eu tô a fim de você! / Eu curto você!",
    contexto: "Jeito australiano de dizer que gosta de alguém. 'Keen' na Austrália é usado para tudo: keen on food, keen on a movie, keen on someone.",
    exemplo: {
      en: "Look, I've been meaning to tell you... I'm really keen on you. Wanna grab dinner?",
      pt: "Olha, eu queria te falar... Eu tô muito a fim de você. Quer jantar comigo?"
    },
    nota: "Aiko diz que australianos são mais diretos que britânicos mas menos intensos que americanos."
  },
  {
    id: 'check_please',
    chunk: "Can I get the check?",
    who: 'lucas',
    city: 'Nova York',
    flag: '🇺🇸',
    equivalencia: "Pode trazer a conta?",
    contexto: "Nos EUA, a conta é 'check'. Lucas sempre lembra: nos EUA a gorjeta de 15-20% é OBRIGATÓRIA, não é opcional!",
    exemplo: {
      en: "That was an amazing dinner! Excuse me, can I get the check, please?",
      pt: "O jantar foi incrível! Com licença, pode trazer a conta, por favor?"
    },
    nota: "⚠️ UK/AU dizem 'bill', não 'check'. Se você pedir 'check' em Londres, Emily vai te corrigir na hora!"
  },
  {
    id: 'bill_please',
    chunk: "Could I have the bill?",
    who: 'emily',
    city: 'Londres',
    flag: '🇬🇧',
    equivalencia: "Poderia trazer a conta?",
    contexto: "No UK, a conta é 'bill' e o pedido é mais formal com 'could'. Emily diz que pedir 'the check' em Londres é o jeito mais rápido de se identificar como americano.",
    exemplo: {
      en: "That pudding was absolutely divine! Could I have the bill, please?",
      pt: "A sobremesa estava divina! Poderia trazer a conta, por favor?"
    },
    nota: "No UK, 'pudding' = sobremesa (qualquer uma!). Não é só pudim. Emily pede 'pudding' e recebe o menu de sobremesas."
  },
  {
    id: 'grab_another',
    chunk: "Can I grab another one?",
    who: 'aiko',
    city: 'Sydney',
    flag: '🇦🇺',
    equivalencia: "Posso pegar mais um?",
    contexto: "Australianos usam 'grab' para tudo: grab a coffee, grab a bite, grab another drink. É o verbo mais casual que existe.",
    exemplo: {
      en: "This flat white is amazing! Can I grab another one, mate?",
      pt: "Esse flat white é incrível! Posso pegar mais um?"
    },
    nota: "O 'flat white' nasceu na Austrália/Nova Zelândia. Aiko fica ofendida quando dizem que é invenção do Starbucks."
  },
  {
    id: 'sweetheart',
    chunk: "You're my sweetheart",
    who: 'lucas',
    city: 'Nova York',
    flag: '🇺🇸',
    equivalencia: "Você é meu amor / meu bem",
    contexto: "Nos EUA, 'sweetheart' é o apelido carinhoso clássico. Lucas diz que em NY os docinhos em formato de coração com mensagens ('conversation hearts') são tradição.",
    exemplo: {
      en: "Happy Valentine's Day, sweetheart! I made reservations at that Italian place you love.",
      pt: "Feliz Dia dos Namorados, meu amor! Fiz reserva naquele italiano que você adora."
    },
    nota: "Os 'conversation hearts' (docinhos com frases) existem desde 1866! Frases: 'Be Mine', 'Kiss Me', 'XOXO'."
  },
  {
    id: 'lovely',
    chunk: "You look lovely tonight!",
    who: 'emily',
    city: 'Londres',
    flag: '🇬🇧',
    equivalencia: "Você está linda/lindo hoje!",
    contexto: "'Lovely' é a palavra mais britânica que existe. Emily usa para tudo: lovely weather, lovely meal, lovely person. No Valentine's, ganha um significado especial.",
    exemplo: {
      en: "Oh my... You look absolutely lovely tonight! Shall we go in?",
      pt: "Nossa... Você está absolutamente linda hoje! Vamos entrar?"
    },
    nota: "Equivalentes: US = 'beautiful/gorgeous', UK = 'lovely', AU = 'stunning'. Cada país tem seu elogio favorito."
  },
  {
    id: 'legend',
    chunk: "You're an absolute legend!",
    who: 'aiko',
    city: 'Sydney',
    flag: '🇦🇺',
    equivalencia: "Você é demais! / Você é incrível!",
    contexto: "Na Austrália, chamar alguém de 'legend' é o maior elogio. Aiko usa quando alguém faz algo especial — como preparar um jantar surpresa no Valentine's.",
    exemplo: {
      en: "You organized a sunset picnic at Bondi Beach? You're an absolute legend!",
      pt: "Você organizou um piquenique no pôr do sol em Bondi Beach? Você é demais!"
    },
    nota: "Escala de elogios australianos: good → great → legend → absolute legend (nível máximo)."
  },
  {
    id: 'ill_have',
    chunk: "I'll have the...",
    who: 'lucas',
    city: 'Nova York',
    flag: '🇺🇸',
    equivalencia: "Eu vou querer o/a...",
    contexto: "A forma mais comum de pedir comida nos EUA. Direto e sem rodeios — do jeito americano.",
    exemplo: {
      en: "I'll have the lobster risotto and a glass of red wine, please.",
      pt: "Eu vou querer o risoto de lagosta e uma taça de vinho tinto, por favor."
    },
    nota: "Variações: US 'I'll have...' / UK 'I'd like...' / AU 'I'll grab...' — mesmo significado, sotaques diferentes!"
  },
  {
    id: 'id_like',
    chunk: "I'd like the...",
    who: 'emily',
    city: 'Londres',
    flag: '🇬🇧',
    equivalencia: "Eu gostaria de...",
    contexto: "Forma mais educada e formal de pedir — típico britânico. Emily diz que 'I'll have' soa um pouco direto demais para o UK.",
    exemplo: {
      en: "I'd like the afternoon tea set for two, please. With extra scones!",
      pt: "Eu gostaria do conjunto de chá da tarde para dois, por favor. Com scones extras!"
    },
    nota: "Afternoon tea no Valentine's Day é tradição britânica: scones, finger sandwiches, e chá Earl Grey."
  },
  {
    id: 'ill_grab',
    chunk: "I'll grab the...",
    who: 'aiko',
    city: 'Sydney',
    flag: '🇦🇺',
    equivalencia: "Vou pegar o/a...",
    contexto: "Jeito australiano super casual de pedir. 'Grab' é o verbo favorito dos australianos — tudo é 'grab'.",
    exemplo: {
      en: "I'll grab the fish and chips and a flat white, thanks mate!",
      pt: "Vou pegar o fish and chips e um flat white, valeu!"
    },
    nota: "Na Austrália, fish and chips na praia é date de Valentine's totalmente aceitável. Aiko aprova!"
  }
];

export const CHARACTER_IMAGES: Record<Character, { teen: string; adult: string }> = {
  lucas: {
    teen: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/lucas-teen-chef-QHaXXJ8h4HT2c6xtihpHNG.webp',
    adult: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/lucas-adult-chef-MD4irrxDW3kA45F3UgwgVw.webp',
  },
  emily: {
    teen: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/emily-teen-hostess-bCDxmQLFV8VKRoo4AE2iUe.webp',
    adult: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/emily-adult-sommelier-bGSaqGi28cwLWEcXtxuUBS.webp',
  },
  aiko: {
    teen: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/aiko-teen-barista-bVWs6rRiBCjNkdniCTWpN7.webp',
    adult: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/aiko-adult-barista-hBW6UyUK9N8GMdQfJ7P5sj.webp',
  },
};

export const HERO_BANNER = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/valentine-hero-banner-83Naj53ctNZuracQWbCGxx.webp';

export const CHARACTER_COLORS: Record<Character, string> = {
  lucas: '#e53935',
  emily: '#880E4F',
  aiko: '#FF6F00',
};

export const CHARACTER_INFO: Record<Character, {
  name: string;
  city: string;
  cityEn: string;
  flag: string;
  accent: string;
  catchphrase: string;
  ttsVoice: string;
  role: string;
  roleEmoji: string;
}> = {
  lucas: {
    name: 'Lucas',
    city: 'Nova York',
    cityEn: 'New York City',
    flag: '🗽',
    accent: 'American English',
    catchphrase: "Hey! What's up?",
    ttsVoice: 'en-US',
    role: 'Chef',
    roleEmoji: '👨‍🍳',
  },
  emily: {
    name: 'Emily',
    city: 'Londres',
    cityEn: 'London',
    flag: '🎡',
    accent: 'British English',
    catchphrase: "Lovely to meet you!",
    ttsVoice: 'en-GB',
    role: 'Sommelier',
    roleEmoji: '🍷',
  },
  aiko: {
    name: 'Aiko',
    city: 'Sydney',
    cityEn: 'Sydney',
    flag: '🦘',
    accent: 'Australian English',
    catchphrase: "G'day mate!",
    ttsVoice: 'en-AU',
    role: 'Barista',
    roleEmoji: '☕',
  },
};

export interface ValentineCuriosity {
  id: string;
  city: string;
  character: Character;
  titleEn: string;
  titlePt: string;
  factEn: string;
  factPt: string;
  emoji: string;
}

export const VALENTINE_CURIOSITIES: ValentineCuriosity[] = [
  {
    id: 'nyc1',
    city: 'New York',
    character: 'lucas',
    titleEn: "Empire State of Love",
    titlePt: "Empire State do Amor",
    factEn: "Every Valentine's Day, the Empire State Building hosts a special event where couples can renew their vows at the top! The building lights up red and pink for the occasion.",
    factPt: "Todo Valentine's Day, o Empire State Building faz um evento especial onde casais podem renovar seus votos no topo! O prédio fica iluminado de vermelho e rosa.",
    emoji: '🏙️'
  },
  {
    id: 'nyc2',
    city: 'New York',
    character: 'lucas',
    titleEn: "Heart-Shaped Pizza",
    titlePt: "Pizza em Formato de Coração",
    factEn: "NYC pizzerias sell thousands of heart-shaped pizzas on Valentine's Day. It's a New York tradition — because nothing says 'I love you' like a New York slice!",
    factPt: "Pizzarias de NYC vendem milhares de pizzas em formato de coração no Valentine's Day. É tradição nova-iorquina — porque nada diz 'eu te amo' como uma fatia de pizza!",
    emoji: '🍕'
  },
  {
    id: 'london1',
    city: 'London',
    character: 'emily',
    titleEn: "The First Love Letter",
    titlePt: "A Primeira Carta de Amor",
    factEn: "The oldest known Valentine's letter was written in 1415 by the Duke of Orleans while imprisoned in the Tower of London! He wrote it to his wife. How romantic... and dramatic!",
    factPt: "A carta de Valentine's mais antiga conhecida foi escrita em 1415 pelo Duque de Orleans enquanto preso na Torre de Londres! Ele escreveu para sua esposa. Romântico... e dramático!",
    emoji: '💌'
  },
  {
    id: 'london2',
    city: 'London',
    character: 'emily',
    titleEn: "25 Million Cards!",
    titlePt: "25 Milhões de Cartões!",
    factEn: "The UK sends over 25 million Valentine's cards every year! The Victorian tradition of handmade cards with lace, ribbons, and dried flowers started right here in Britain.",
    factPt: "O UK envia mais de 25 milhões de cartões de Valentine's por ano! A tradição vitoriana de cartões feitos à mão com renda, fitas e flores secas começou aqui na Grã-Bretanha.",
    emoji: '💝'
  },
  {
    id: 'sydney1',
    city: 'Sydney',
    character: 'aiko',
    titleEn: "Summer Valentine's!",
    titlePt: "Valentine's no Verão!",
    factEn: "Valentine's Day in Australia is in SUMMER! While New York is freezing, Aussies celebrate with beach picnics, sunset surfing, and barbies (BBQs) at Bondi Beach!",
    factPt: "O Valentine's Day na Austrália é no VERÃO! Enquanto Nova York está congelando, os australianos celebram com piqueniques na praia, surf no pôr do sol e churrascos em Bondi Beach!",
    emoji: '🏖️'
  },
  {
    id: 'sydney2',
    city: 'Sydney',
    character: 'aiko',
    titleEn: "Anti-Valentine's Parties",
    titlePt: "Festas Anti-Valentine's",
    factEn: "Australia is famous for 'Anti-Valentine's Day' parties! Singles celebrate their freedom with friends, good food, and lots of laughs. Aiko says: 'No worries if you're single, mate!'",
    factPt: "A Austrália é famosa pelas festas 'Anti-Valentine's Day'! Solteiros celebram sua liberdade com amigos, boa comida e muitas risadas. Aiko diz: 'Sem stress se você é solteiro!'",
    emoji: '🎉'
  }
];

export interface VocabComparison {
  id: string;
  item: string;
  itemPt: string;
  us: string;
  uk: string;
  au: string;
  emoji: string;
  category: 'food' | 'restaurant' | 'romantic';
}

export const VOCAB_COMPARISONS: VocabComparison[] = [
  { id: 'v1', item: 'French fries', itemPt: 'Batata frita', us: 'Fries', uk: 'Chips', au: 'Hot chips', emoji: '🍟', category: 'food' },
  { id: 'v2', item: 'Dessert', itemPt: 'Sobremesa', us: 'Dessert', uk: 'Pudding', au: 'Dessert', emoji: '🍰', category: 'food' },
  { id: 'v3', item: 'Soda', itemPt: 'Refrigerante', us: 'Soda', uk: 'Fizzy drink', au: 'Soft drink', emoji: '🥤', category: 'food' },
  { id: 'v4', item: 'Cookie', itemPt: 'Biscoito', us: 'Cookie', uk: 'Biscuit', au: 'Bikkie', emoji: '🍪', category: 'food' },
  { id: 'v5', item: 'Takeout', itemPt: 'Comida para viagem', us: 'Takeout', uk: 'Takeaway', au: 'Takeaway', emoji: '📦', category: 'food' },
  { id: 'v6', item: 'Candy', itemPt: 'Doces', us: 'Candy', uk: 'Sweets', au: 'Lollies', emoji: '🍬', category: 'food' },
  { id: 'v7', item: 'Shrimp', itemPt: 'Camarão', us: 'Shrimp', uk: 'Prawn', au: 'Prawn', emoji: '🦐', category: 'food' },
  { id: 'v8', item: 'The bill', itemPt: 'A conta', us: 'The check', uk: 'The bill', au: 'The bill', emoji: '🧾', category: 'restaurant' },
  { id: 'v9', item: 'Tip', itemPt: 'Gorjeta', us: 'Tip (15-20%)', uk: 'Service charge (12.5%)', au: 'Tip (10% optional)', emoji: '💰', category: 'restaurant' },
  { id: 'v10', item: 'Ordering food', itemPt: 'Pedir comida', us: "I'll have...", uk: "I'd like...", au: "I'll grab...", emoji: '📋', category: 'restaurant' },
  { id: 'v11', item: 'Compliment food', itemPt: 'Elogiar comida', us: 'This is awesome!', uk: 'This is lovely!', au: 'This is ripper!', emoji: '😋', category: 'restaurant' },
  { id: 'v12', item: 'Split bill', itemPt: 'Dividir conta', us: 'Split the check', uk: 'Split the bill', au: 'Go halves', emoji: '✂️', category: 'restaurant' },
  { id: 'v13', item: 'Sweetheart', itemPt: 'Amor/Querido(a)', us: 'Sweetheart', uk: 'Darling', au: 'Babe', emoji: '💕', category: 'romantic' },
  { id: 'v14', item: 'I like you', itemPt: 'Eu gosto de você', us: "I'm into you", uk: 'I fancy you', au: "I'm keen on you", emoji: '❤️', category: 'romantic' },
  { id: 'v15', item: 'Beautiful', itemPt: 'Bonito(a)', us: 'Gorgeous', uk: 'Lovely', au: 'Stunning', emoji: '✨', category: 'romantic' },
];
