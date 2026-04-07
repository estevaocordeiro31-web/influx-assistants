// Animation Scripts - Roteiros de Animação no estilo DegenAI Comedy
// Histórias curtas e impactantes dos personagens focando em chunks e expressões

export interface AnimationScript {
  id: string;
  title: string;
  titlePt: string;
  character: 'lucas' | 'emily' | 'aiko';
  duration: string; // tempo estimado
  setting: string; // cenário
  thumbnail?: string;
  
  // Roteiro com falas e ações
  scenes: Scene[];
  
  // Chunks ensinados neste roteiro
  chunks: ChunkHighlight[];
  
  // Connected Speech destacado
  connectedSpeech: ConnectedSpeechItem[];
  
  // Curiosidade cultural relacionada
  culturalNote: string;
  culturalNotePt: string;
}

export interface Scene {
  id: number;
  action: string; // descrição da ação/cena
  dialogue: string; // fala do personagem
  dialoguePt: string; // tradução
  emotion: 'neutral' | 'excited' | 'confused' | 'scared' | 'laughing' | 'thinking' | 'surprised';
  soundEffect?: string; // efeito sonoro
  visualNote?: string; // nota para animação
}

export interface ChunkHighlight {
  chunk: string;
  meaning: string;
  example: string;
  connectedSpeech: string;
}

export interface ConnectedSpeechItem {
  original: string;
  spoken: string;
  phonetic: string;
}

// ============================================
// ROTEIRO 1: Lucas e o Lago Ness
// ============================================
export const SCRIPT_LUCAS_LOCH_NESS: AnimationScript = {
  id: 'lucas-loch-ness',
  title: "Lucas and the Loch Ness Monster",
  titlePt: "Lucas e o Monstro do Lago Ness",
  character: 'lucas',
  duration: '45s',
  setting: 'Scotland - Loch Ness',
  
  scenes: [
    {
      id: 1,
      action: "Lucas aparece com mochila de turista típico americano, câmera no pescoço, em frente ao Lago Ness",
      dialogue: "So I'm in Scotland, right? And I'm like, I gotta see this Loch Ness thing everyone's talking about.",
      dialoguePt: "Então eu tô na Escócia, né? E eu pensei, tenho que ver esse negócio do Lago Ness que todo mundo fala.",
      emotion: 'excited',
      soundEffect: 'gaita de foles ao fundo',
      visualNote: 'Lucas com roupa de turista americano estereotipado'
    },
    {
      id: 2,
      action: "Lucas olhando confuso para uma placa em escocês",
      dialogue: "The locals kept saying 'Aye, ye cannae miss it, laddie!' And I'm standing there like... what language is this?!",
      dialoguePt: "Os locais ficavam dizendo 'Aye, ye cannae miss it, laddie!' E eu lá parado tipo... que língua é essa?!",
      emotion: 'confused',
      soundEffect: 'som de interrogação cômica',
      visualNote: 'Placa com escrita em escocês incompreensível'
    },
    {
      id: 3,
      action: "Lucas no hotel à noite, deitado na cama",
      dialogue: "That night, I couldn't sleep. I kept thinking about Nessie. What if she's real?",
      dialoguePt: "Naquela noite, eu não conseguia dormir. Ficava pensando na Nessie. E se ela for real?",
      emotion: 'thinking',
      soundEffect: 'música de suspense suave'
    },
    {
      id: 4,
      action: "Sonho de Lucas - ele está em um barquinho e Nessie aparece",
      dialogue: "And then I had this crazy dream! Nessie showed up and she was like 'Yo, what's up, dude?'",
      dialoguePt: "E aí eu tive esse sonho maluco! A Nessie apareceu e falou 'E aí, cara, tudo bem?'",
      emotion: 'surprised',
      soundEffect: 'som de bolhas subindo',
      visualNote: 'Nessie com sotaque de Nova York no sonho'
    },
    {
      id: 5,
      action: "Lucas acordando assustado",
      dialogue: "I woke up freaking out! In New York, the scariest thing we got is the subway at 3 AM!",
      dialoguePt: "Acordei pirando! Em Nova York, a coisa mais assustadora que a gente tem é o metrô às 3 da manhã!",
      emotion: 'scared',
      soundEffect: 'despertador'
    },
    {
      id: 6,
      action: "Lucas de volta ao lago, tirando selfie",
      dialogue: "Anyway, I never saw Nessie for real. But I got a sick selfie with the lake! That's what matters, right?",
      dialoguePt: "Enfim, nunca vi a Nessie de verdade. Mas tirei uma selfie animal com o lago! É isso que importa, né?",
      emotion: 'laughing',
      soundEffect: 'som de câmera',
      visualNote: 'Selfie com algo suspeito no fundo da água'
    },
    {
      id: 7,
      action: "Lucas piscando para a câmera, algo se move na água atrás dele",
      dialogue: "Oh, and pro tip: if a Scottish person says 'It's a wee bit cold', bring a winter jacket. Trust me.",
      dialoguePt: "Ah, e dica: se um escocês disser 'It's a wee bit cold', leve um casaco de inverno. Confia em mim.",
      emotion: 'laughing',
      soundEffect: 'splash sutil ao fundo',
      visualNote: 'Silhueta de Nessie aparece brevemente atrás dele'
    }
  ],
  
  chunks: [
    {
      chunk: "I gotta see this",
      meaning: "Eu tenho que ver isso",
      example: "I gotta see this new movie everyone's talking about!",
      connectedSpeech: "/aɪ ˈgɑːɾə siː ðɪs/"
    },
    {
      chunk: "I'm like...",
      meaning: "Eu fico tipo... / Eu pensei...",
      example: "And I'm like, what's going on here?",
      connectedSpeech: "/aɪm laɪk/"
    },
    {
      chunk: "What if...?",
      meaning: "E se...?",
      example: "What if we miss the flight?",
      connectedSpeech: "/wʌɾɪf/"
    },
    {
      chunk: "I couldn't sleep",
      meaning: "Eu não conseguia dormir",
      example: "I couldn't sleep last night, I was too excited!",
      connectedSpeech: "/aɪ ˈkʊdnt sliːp/"
    },
    {
      chunk: "freaking out",
      meaning: "pirando / surtando",
      example: "She was freaking out about the exam!",
      connectedSpeech: "/ˈfriːkɪŋ aʊt/"
    },
    {
      chunk: "That's what matters",
      meaning: "É isso que importa",
      example: "You tried your best, that's what matters!",
      connectedSpeech: "/ðæts wʌt ˈmæɾərz/"
    }
  ],
  
  connectedSpeech: [
    {
      original: "I have got to",
      spoken: "I gotta",
      phonetic: "/aɪ ˈgɑːɾə/"
    },
    {
      original: "What if",
      spoken: "Wha-dif",
      phonetic: "/wʌɾɪf/"
    },
    {
      original: "could not",
      spoken: "couldn't",
      phonetic: "/ˈkʊdnt/"
    },
    {
      original: "What is up",
      spoken: "What's up / Wassup",
      phonetic: "/wʌts ʌp/ ou /wəˈsʌp/"
    }
  ],
  
  culturalNote: "New Yorkers are known for being direct and fast-paced. They often use phrases like 'I gotta go' instead of 'I have to go'. The Scottish accent can be challenging even for native English speakers from other regions!",
  culturalNotePt: "Novaiorquinos são conhecidos por serem diretos e acelerados. Eles frequentemente usam frases como 'I gotta go' em vez de 'I have to go'. O sotaque escocês pode ser desafiador até para falantes nativos de inglês de outras regiões!"
};

// ============================================
// ROTEIRO 2: Emily no Texas
// ============================================
export const SCRIPT_EMILY_TEXAS: AnimationScript = {
  id: 'emily-texas',
  title: "Emily's Texas Adventure",
  titlePt: "A Aventura de Emily no Texas",
  character: 'emily',
  duration: '40s',
  setting: 'Texas, USA',
  
  scenes: [
    {
      id: 1,
      action: "Emily chega no Texas, olhando para tudo enorme ao redor",
      dialogue: "Right, so I went to Texas, and everything is absolutely massive! The steaks, the trucks, the hats...",
      dialoguePt: "Então, eu fui pro Texas, e tudo é absolutamente enorme! Os bifes, as caminhonetes, os chapéus...",
      emotion: 'surprised',
      soundEffect: 'música country ao fundo',
      visualNote: 'Emily pequena ao lado de uma caminhonete gigante'
    },
    {
      id: 2,
      action: "Emily em um restaurante, olhando para um prato enorme",
      dialogue: "I asked for a 'small' portion and they brought me enough food to feed my entire street back in London!",
      dialoguePt: "Pedi uma porção 'pequena' e trouxeram comida suficiente pra alimentar minha rua inteira em Londres!",
      emotion: 'surprised',
      soundEffect: 'prato batendo na mesa',
      visualNote: 'Prato gigante de churrasco texano'
    },
    {
      id: 3,
      action: "Emily tentando falar com um texano",
      dialogue: "And when I said 'lovely weather, isn't it?', the bloke looked at me like I was speaking Martian!",
      dialoguePt: "E quando eu disse 'lovely weather, isn't it?', o cara me olhou como se eu estivesse falando marciano!",
      emotion: 'confused',
      soundEffect: 'grilo',
      visualNote: 'Texano com chapéu de cowboy confuso'
    },
    {
      id: 4,
      action: "Texano respondendo",
      dialogue: "He goes 'Y'all ain't from around here, are ya?' I'm like, what gave it away? The accent or the umbrella?",
      dialoguePt: "Ele falou 'Y'all ain't from around here, are ya?' Eu tipo, o que me entregou? O sotaque ou o guarda-chuva?",
      emotion: 'laughing',
      soundEffect: 'risada',
      visualNote: 'Emily segurando guarda-chuva no sol de 40 graus'
    },
    {
      id: 5,
      action: "Emily em um rodeio",
      dialogue: "They took me to a rodeo. Brilliant! In England, the most exciting animal event is watching the Queen's corgis!",
      dialoguePt: "Me levaram pra um rodeio. Brilhante! Na Inglaterra, o evento animal mais emocionante é assistir os corgis da Rainha!",
      emotion: 'excited',
      soundEffect: 'som de rodeio',
      visualNote: 'Emily com chapéu de cowboy rosa'
    },
    {
      id: 6,
      action: "Emily se despedindo",
      dialogue: "Anyway, Texas was proper mental! But I do miss a good cuppa. Their tea is... well, it's iced. Iced! The audacity!",
      dialoguePt: "Enfim, Texas foi uma loucura! Mas sinto falta de um bom chá. O chá deles é... bem, gelado. Gelado! Que audácia!",
      emotion: 'thinking',
      soundEffect: 'gelo tilintando',
      visualNote: 'Emily olhando horrorizada para um copo de iced tea'
    }
  ],
  
  chunks: [
    {
      chunk: "absolutely massive",
      meaning: "absolutamente enorme",
      example: "The concert was absolutely massive!",
      connectedSpeech: "/ˈæbsəluːtli ˈmæsɪv/"
    },
    {
      chunk: "isn't it?",
      meaning: "não é? (tag question britânica)",
      example: "Lovely day, isn't it?",
      connectedSpeech: "/ˈɪznt ɪt/"
    },
    {
      chunk: "What gave it away?",
      meaning: "O que me entregou?",
      example: "You knew I was nervous? What gave it away?",
      connectedSpeech: "/wʌt geɪv ɪt əˈweɪ/"
    },
    {
      chunk: "proper mental",
      meaning: "completamente louco (gíria britânica)",
      example: "That party was proper mental!",
      connectedSpeech: "/ˈprɒpə ˈmentl/"
    },
    {
      chunk: "a good cuppa",
      meaning: "uma boa xícara de chá",
      example: "I could really use a good cuppa right now.",
      connectedSpeech: "/ə gʊd ˈkʌpə/"
    }
  ],
  
  connectedSpeech: [
    {
      original: "You all are not",
      spoken: "Y'all ain't",
      phonetic: "/jɔːl eɪnt/"
    },
    {
      original: "cup of tea",
      spoken: "cuppa",
      phonetic: "/ˈkʌpə/"
    },
    {
      original: "is not it",
      spoken: "isn't it / innit",
      phonetic: "/ˈɪznt ɪt/ ou /ˈɪnɪt/"
    }
  ],
  
  culturalNote: "British people are famous for their understatement. When they say 'not bad', they often mean 'really good'. Texans, on the other hand, are known for their hospitality and saying things are 'bigger and better' in Texas!",
  culturalNotePt: "Britânicos são famosos por seu understatement (subestimação). Quando dizem 'not bad', geralmente querem dizer 'muito bom'. Texanos, por outro lado, são conhecidos pela hospitalidade e por dizer que tudo é 'maior e melhor' no Texas!"
};

// ============================================
// ROTEIRO 3: Aiko em Nova York
// ============================================
export const SCRIPT_AIKO_NYC: AnimationScript = {
  id: 'aiko-nyc',
  title: "Aiko's First Day in NYC",
  titlePt: "O Primeiro Dia de Aiko em Nova York",
  character: 'aiko',
  duration: '45s',
  setting: 'New York City, USA',
  
  scenes: [
    {
      id: 1,
      action: "Aiko chegando em Times Square, olhando para cima impressionada",
      dialogue: "G'day! So I rocked up to New York City, and mate, it's absolutely bonkers! So many people!",
      dialoguePt: "Oi! Então eu cheguei em Nova York, e cara, é completamente maluco! Tanta gente!",
      emotion: 'excited',
      soundEffect: 'buzinas de Nova York',
      visualNote: 'Aiko cercada por multidão em Times Square'
    },
    {
      id: 2,
      action: "Aiko tentando atravessar a rua",
      dialogue: "In Sydney, we wait for the little green man. Here? People just... go! It's like a real-life Frogger!",
      dialoguePt: "Em Sydney, a gente espera o bonequinho verde. Aqui? As pessoas só... vão! É tipo um Frogger da vida real!",
      emotion: 'scared',
      soundEffect: 'buzinas e freadas',
      visualNote: 'Aiko correndo entre carros'
    },
    {
      id: 3,
      action: "Aiko em uma bodega pedindo café",
      dialogue: "I walked into this tiny shop - they call it a 'bodega' - and asked for a flat white. The guy looked at me like I was speaking alien!",
      dialoguePt: "Entrei nessa lojinha - eles chamam de 'bodega' - e pedi um flat white. O cara me olhou como se eu falasse alienígena!",
      emotion: 'confused',
      soundEffect: 'sino de porta',
      visualNote: 'Bodega típica de Nova York'
    },
    {
      id: 4,
      action: "Vendedor da bodega respondendo",
      dialogue: "He goes 'You want a what? We got regular coffee, that's it!' No worries, I'll take it!",
      dialoguePt: "Ele falou 'Você quer o quê? Temos café normal, só isso!' Sem problemas, eu aceito!",
      emotion: 'laughing',
      soundEffect: 'máquina de café',
      visualNote: 'Copo de café americano gigante'
    },
    {
      id: 5,
      action: "Aiko no metrô, confusa com o mapa",
      dialogue: "Then I tried the subway. Back home we call it the train. Here it's like a maze underground! I ended up in Brooklyn when I wanted Manhattan!",
      dialoguePt: "Aí tentei o metrô. Em casa a gente chama de trem. Aqui é tipo um labirinto subterrâneo! Fui parar no Brooklyn quando queria Manhattan!",
      emotion: 'confused',
      soundEffect: 'som de metrô',
      visualNote: 'Aiko olhando mapa do metrô de cabeça para baixo'
    },
    {
      id: 6,
      action: "Aiko comendo pizza na rua",
      dialogue: "But you know what? I found the best pizza ever! You fold it in half and eat it walking. That's so not Australian, but I'm here for it!",
      dialoguePt: "Mas sabe o quê? Achei a melhor pizza de todas! Você dobra no meio e come andando. Isso não é nada australiano, mas eu tô dentro!",
      emotion: 'excited',
      soundEffect: 'mordida em pizza',
      visualNote: 'Aiko comendo pizza dobrada estilo NY'
    },
    {
      id: 7,
      action: "Aiko acenando para a câmera",
      dialogue: "New York is hectic, but it's a ripper! Can't wait to come back. But next time, I'm bringing my own flat white!",
      dialoguePt: "Nova York é agitada, mas é demais! Mal posso esperar pra voltar. Mas da próxima vez, vou trazer meu próprio flat white!",
      emotion: 'laughing',
      soundEffect: 'buzinas ao fundo',
      visualNote: 'Skyline de NY ao fundo'
    }
  ],
  
  chunks: [
    {
      chunk: "rocked up",
      meaning: "chegou / apareceu (gíria australiana)",
      example: "She just rocked up at the party without calling!",
      connectedSpeech: "/rɒkt ʌp/"
    },
    {
      chunk: "absolutely bonkers",
      meaning: "completamente maluco",
      example: "This traffic is absolutely bonkers!",
      connectedSpeech: "/ˈæbsəluːtli ˈbɒŋkəz/"
    },
    {
      chunk: "No worries",
      meaning: "Sem problemas / Tudo bem",
      example: "Sorry I'm late! - No worries, mate!",
      connectedSpeech: "/nəʊ ˈwʌriz/"
    },
    {
      chunk: "I'm here for it",
      meaning: "Eu tô dentro / Eu apoio isso",
      example: "Free pizza? I'm here for it!",
      connectedSpeech: "/aɪm hɪə fɔːr ɪt/"
    },
    {
      chunk: "a ripper",
      meaning: "algo incrível/demais (gíria australiana)",
      example: "That concert was a ripper!",
      connectedSpeech: "/ə ˈrɪpə/"
    },
    {
      chunk: "Can't wait",
      meaning: "Mal posso esperar",
      example: "Can't wait to see you!",
      connectedSpeech: "/kɑːnt weɪt/"
    }
  ],
  
  connectedSpeech: [
    {
      original: "Good day",
      spoken: "G'day",
      phonetic: "/ɡəˈdeɪ/"
    },
    {
      original: "cannot wait",
      spoken: "can't wait",
      phonetic: "/kɑːnt weɪt/"
    },
    {
      original: "want to",
      spoken: "wanna",
      phonetic: "/ˈwɒnə/"
    }
  ],
  
  culturalNote: "Australians are known for their laid-back attitude and use of slang. 'No worries' is practically the national phrase! New Yorkers, meanwhile, are famous for their fast pace and direct communication style.",
  culturalNotePt: "Australianos são conhecidos pela atitude relaxada e uso de gírias. 'No worries' é praticamente a frase nacional! Novaiorquinos, por outro lado, são famosos pelo ritmo acelerado e comunicação direta."
};

// ============================================
// ROTEIRO 4: Lucas em Londres
// ============================================
export const SCRIPT_LUCAS_LONDON: AnimationScript = {
  id: 'lucas-london',
  title: "Lucas Gets Lost in London",
  titlePt: "Lucas se Perde em Londres",
  character: 'lucas',
  duration: '40s',
  setting: 'London, UK',
  
  scenes: [
    {
      id: 1,
      action: "Lucas saindo do metrô em Londres",
      dialogue: "Yo, so I'm in London and I'm trying to find Big Ben. I ask this guy for directions and he goes 'It's just round the corner, mate!'",
      dialoguePt: "Ei, então eu tô em Londres tentando achar o Big Ben. Perguntei pro cara a direção e ele falou 'É logo ali na esquina, cara!'",
      emotion: 'neutral',
      soundEffect: 'som de metrô de Londres',
      visualNote: 'Lucas saindo da estação Westminster'
    },
    {
      id: 2,
      action: "Lucas andando por 20 minutos",
      dialogue: "Twenty minutes later, I'm still walking! In New York, 'round the corner' means like, 30 seconds. Here it means bring a snack!",
      dialoguePt: "Vinte minutos depois, ainda tô andando! Em Nova York, 'logo ali' significa tipo, 30 segundos. Aqui significa traga um lanche!",
      emotion: 'confused',
      soundEffect: 'passos',
      visualNote: 'Lucas suando, Big Ben ainda longe'
    },
    {
      id: 3,
      action: "Lucas pedindo ajuda novamente",
      dialogue: "I asked another person and she said 'Oh, you're not far, love!' NOT FAR?! I can see it but it's like a mirage!",
      dialoguePt: "Perguntei pra outra pessoa e ela disse 'Oh, você não tá longe, querido!' NÃO TÁ LONGE?! Eu vejo mas parece uma miragem!",
      emotion: 'surprised',
      soundEffect: 'som de deserto (cômico)',
      visualNote: 'Big Ben ao fundo como miragem'
    },
    {
      id: 4,
      action: "Lucas finalmente chegando",
      dialogue: "When I finally got there, I was starving! So I asked for chips. They gave me fries. I asked for fries, they gave me chips. Make it make sense!",
      dialoguePt: "Quando finalmente cheguei, tava morrendo de fome! Pedi chips. Me deram batata frita. Pedi fries, me deram chips. Faz sentido isso?!",
      emotion: 'confused',
      soundEffect: 'sino do Big Ben',
      visualNote: 'Lucas segurando pacote de chips confuso'
    },
    {
      id: 5,
      action: "Lucas tirando foto com guarda real",
      dialogue: "Oh, and I tried to make a guard laugh. Spoiler alert: they don't laugh. They don't even blink! It's like talking to a statue with a cool hat!",
      dialoguePt: "Ah, e tentei fazer um guarda rir. Spoiler: eles não riem. Nem piscam! É tipo falar com uma estátua de chapéu legal!",
      emotion: 'laughing',
      soundEffect: 'silêncio absoluto',
      visualNote: 'Lucas fazendo caretas para guarda impassível'
    },
    {
      id: 6,
      action: "Lucas se despedindo",
      dialogue: "London's amazing though! Just remember: 'round the corner' means pack a lunch, and 'not bad' means 'absolutely incredible'!",
      dialoguePt: "Londres é incrível! Só lembra: 'logo ali' significa leve um lanche, e 'not bad' significa 'absolutamente incrível'!",
      emotion: 'excited',
      soundEffect: 'música britânica',
      visualNote: 'Lucas com guarda-chuva e chapéu britânico'
    }
  ],
  
  chunks: [
    {
      chunk: "round the corner",
      meaning: "logo ali / na esquina",
      example: "The coffee shop is just round the corner.",
      connectedSpeech: "/raʊnd ðə ˈkɔːnə/"
    },
    {
      chunk: "not far",
      meaning: "não é longe",
      example: "Don't worry, it's not far from here.",
      connectedSpeech: "/nɒt fɑː/"
    },
    {
      chunk: "Make it make sense",
      meaning: "Faz sentido isso? (expressão de confusão)",
      example: "They charge extra for water? Make it make sense!",
      connectedSpeech: "/meɪk ɪt meɪk sens/"
    },
    {
      chunk: "Spoiler alert",
      meaning: "Aviso de spoiler / Adivinha só",
      example: "Spoiler alert: the movie ends badly!",
      connectedSpeech: "/ˈspɔɪlər əˈlɜːt/"
    }
  ],
  
  connectedSpeech: [
    {
      original: "around the",
      spoken: "round the",
      phonetic: "/raʊnd ðə/"
    },
    {
      original: "not bad",
      spoken: "not bad (understatement)",
      phonetic: "/nɒt bæd/"
    }
  ],
  
  culturalNote: "British understatement is famous worldwide. When a British person says 'not bad', they often mean 'really good'. And distances in London can be deceiving - always check Google Maps!",
  culturalNotePt: "O understatement britânico é famoso mundialmente. Quando um britânico diz 'not bad', geralmente quer dizer 'muito bom'. E distâncias em Londres podem enganar - sempre confira no Google Maps!"
};

// ============================================
// ROTEIRO 5: Emily na Austrália
// ============================================
export const SCRIPT_EMILY_AUSTRALIA: AnimationScript = {
  id: 'emily-australia',
  title: "Emily Discovers Australian Wildlife",
  titlePt: "Emily Descobre a Vida Selvagem Australiana",
  character: 'emily',
  duration: '45s',
  setting: 'Sydney, Australia',
  
  scenes: [
    {
      id: 1,
      action: "Emily chegando na Austrália, olhando ao redor nervosa",
      dialogue: "Right, so I've arrived in Australia and I've been warned about literally everything trying to kill you here!",
      dialoguePt: "Então, cheguei na Austrália e me avisaram que literalmente tudo aqui tenta te matar!",
      emotion: 'scared',
      soundEffect: 'som de avião pousando',
      visualNote: 'Emily com spray anti-inseto e guia de sobrevivência'
    },
    {
      id: 2,
      action: "Emily vendo uma aranha",
      dialogue: "First day, I see a spider the size of my hand! Aiko goes 'Oh, that's just a huntsman, she's harmless!' HARMLESS?!",
      dialoguePt: "Primeiro dia, vejo uma aranha do tamanho da minha mão! Aiko fala 'Ah, é só uma huntsman, ela é inofensiva!' INOFENSIVA?!",
      emotion: 'scared',
      soundEffect: 'grito abafado',
      visualNote: 'Aranha gigante na parede'
    },
    {
      id: 3,
      action: "Emily na praia",
      dialogue: "Then we went to Bondi Beach. Gorgeous! But they told me to watch out for bluebottles. I thought it was a drink!",
      dialoguePt: "Aí fomos pra Bondi Beach. Linda! Mas me disseram pra ter cuidado com bluebottles. Achei que era uma bebida!",
      emotion: 'confused',
      soundEffect: 'ondas do mar',
      visualNote: 'Emily na praia com água-viva ao fundo'
    },
    {
      id: 4,
      action: "Emily encontrando um canguru",
      dialogue: "But then I met a kangaroo! Absolutely adorable! Until it stood up and I realized it could probably beat me in a boxing match!",
      dialoguePt: "Mas aí conheci um canguru! Absolutamente adorável! Até ele ficar de pé e eu perceber que ele provavelmente me venceria no boxe!",
      emotion: 'surprised',
      soundEffect: 'som de boxe cômico',
      visualNote: 'Canguru musculoso ao lado de Emily pequena'
    },
    {
      id: 5,
      action: "Emily comendo Vegemite",
      dialogue: "And don't get me started on Vegemite! They said 'You'll love it!' I took one bite and my face did things I didn't know it could do!",
      dialoguePt: "E nem me fala do Vegemite! Disseram 'Você vai amar!' Dei uma mordida e meu rosto fez coisas que eu não sabia que podia fazer!",
      emotion: 'surprised',
      soundEffect: 'som de nojo cômico',
      visualNote: 'Emily com cara de desgosto'
    },
    {
      id: 6,
      action: "Emily abraçando um coala",
      dialogue: "But the koalas? Absolutely precious! They sleep 22 hours a day. Honestly, that's my kind of animal!",
      dialoguePt: "Mas os coalas? Absolutamente preciosos! Dormem 22 horas por dia. Sinceramente, esse é meu tipo de animal!",
      emotion: 'excited',
      soundEffect: 'ronronar de coala',
      visualNote: 'Emily abraçando coala dormindo'
    },
    {
      id: 7,
      action: "Emily se despedindo",
      dialogue: "Australia is brilliant! Just remember: everything can kill you, but the people are lovely! Cheers, mate!",
      dialoguePt: "Austrália é brilhante! Só lembra: tudo pode te matar, mas as pessoas são adoráveis! Valeu, cara!",
      emotion: 'laughing',
      soundEffect: 'música australiana',
      visualNote: 'Emily com chapéu australiano e coala'
    }
  ],
  
  chunks: [
    {
      chunk: "I've been warned",
      meaning: "Me avisaram / Fui alertado",
      example: "I've been warned about the traffic here.",
      connectedSpeech: "/aɪv biːn wɔːnd/"
    },
    {
      chunk: "watch out for",
      meaning: "ter cuidado com / ficar atento a",
      example: "Watch out for the wet floor!",
      connectedSpeech: "/wɒtʃ aʊt fɔː/"
    },
    {
      chunk: "Don't get me started",
      meaning: "Nem me fala / Não me faça começar",
      example: "Don't get me started on politics!",
      connectedSpeech: "/dəʊnt get mi ˈstɑːtɪd/"
    },
    {
      chunk: "my kind of",
      meaning: "meu tipo de / do meu jeito",
      example: "This is my kind of music!",
      connectedSpeech: "/maɪ kaɪnd əv/"
    },
    {
      chunk: "Cheers, mate!",
      meaning: "Valeu, cara! (despedida informal)",
      example: "Thanks for the help! Cheers, mate!",
      connectedSpeech: "/tʃɪəz meɪt/"
    }
  ],
  
  connectedSpeech: [
    {
      original: "I have been",
      spoken: "I've been",
      phonetic: "/aɪv biːn/"
    },
    {
      original: "kind of",
      spoken: "kinda",
      phonetic: "/ˈkaɪndə/"
    },
    {
      original: "do not get",
      spoken: "don't get",
      phonetic: "/dəʊnt get/"
    }
  ],
  
  culturalNote: "Australians are famous for their relaxed attitude towards dangerous wildlife. What seems terrifying to visitors is often 'no big deal' to locals. And yes, Vegemite is an acquired taste - spread it very thin!",
  culturalNotePt: "Australianos são famosos pela atitude relaxada com vida selvagem perigosa. O que parece aterrorizante para visitantes é 'nada demais' para os locais. E sim, Vegemite é um gosto adquirido - passe bem fininho!"
};

// ============================================
// ROTEIRO 6: Aiko em Londres
// ============================================
export const SCRIPT_AIKO_LONDON: AnimationScript = {
  id: 'aiko-london',
  title: "Aiko's Rainy London Day",
  titlePt: "O Dia Chuvoso de Aiko em Londres",
  character: 'aiko',
  duration: '40s',
  setting: 'London, UK',
  
  scenes: [
    {
      id: 1,
      action: "Aiko chegando em Londres sob chuva",
      dialogue: "G'day! So I'm in London and it's raining. Shocker, right? Back in Sydney, we get like 300 days of sunshine!",
      dialoguePt: "Oi! Então eu tô em Londres e tá chovendo. Surpresa, né? Em Sydney, a gente tem tipo 300 dias de sol!",
      emotion: 'neutral',
      soundEffect: 'som de chuva',
      visualNote: 'Aiko com guarda-chuva colorido'
    },
    {
      id: 2,
      action: "Aiko em um pub",
      dialogue: "I went to a pub to escape the rain. Asked for a beer and they go 'Would you like a pint or a half?' A half of what?!",
      dialoguePt: "Fui pra um pub fugir da chuva. Pedi uma cerveja e perguntaram 'Quer um pint ou meio?' Meio do quê?!",
      emotion: 'confused',
      soundEffect: 'barulho de pub',
      visualNote: 'Aiko segurando copo gigante'
    },
    {
      id: 3,
      action: "Aiko tentando pedir comida",
      dialogue: "Then I tried to order chips. They brought me crisps! I said 'No, chips!' They brought me more crisps! It's like a comedy sketch!",
      dialoguePt: "Aí tentei pedir chips. Trouxeram crisps! Falei 'Não, chips!' Trouxeram mais crisps! Parece um esquete de comédia!",
      emotion: 'laughing',
      soundEffect: 'pacote de batata abrindo',
      visualNote: 'Mesa cheia de pacotes de crisps'
    },
    {
      id: 4,
      action: "Aiko no metrô (Tube)",
      dialogue: "And the Tube! Everyone's so quiet! In Sydney, we chat to strangers. Here, if you make eye contact, people look away like you're a ghost!",
      dialoguePt: "E o metrô! Todo mundo tão quieto! Em Sydney, a gente conversa com estranhos. Aqui, se você faz contato visual, as pessoas desviam como se você fosse um fantasma!",
      emotion: 'surprised',
      soundEffect: 'silêncio do metrô',
      visualNote: 'Aiko sorrindo, todos ao redor sérios'
    },
    {
      id: 5,
      action: "Aiko tomando chá",
      dialogue: "But I've learned to love a proper cuppa! With milk, of course. Emily taught me. She said 'Milk first is controversial!' Who knew tea had drama?!",
      dialoguePt: "Mas aprendi a amar um bom chá! Com leite, claro. Emily me ensinou. Ela disse 'Leite primeiro é controverso!' Quem diria que chá tinha drama?!",
      emotion: 'laughing',
      soundEffect: 'xícara tilintando',
      visualNote: 'Aiko segurando xícara de chá elegante'
    },
    {
      id: 6,
      action: "Aiko se despedindo",
      dialogue: "London's a ripper! The rain, the pubs, the drama over tea... I love it! Just don't ask me to explain cricket. That's a whole other story!",
      dialoguePt: "Londres é demais! A chuva, os pubs, o drama do chá... Eu amo! Só não me peça pra explicar cricket. Isso é outra história!",
      emotion: 'excited',
      soundEffect: 'Big Ben ao fundo',
      visualNote: 'Aiko com guarda-chuva e xícara de chá'
    }
  ],
  
  chunks: [
    {
      chunk: "Shocker, right?",
      meaning: "Surpresa, né? (sarcasmo)",
      example: "He was late again. Shocker, right?",
      connectedSpeech: "/ˈʃɒkə raɪt/"
    },
    {
      chunk: "escape the rain",
      meaning: "fugir da chuva",
      example: "Let's go inside to escape the rain.",
      connectedSpeech: "/ɪˈskeɪp ðə reɪn/"
    },
    {
      chunk: "a proper cuppa",
      meaning: "um chá de verdade / um bom chá",
      example: "Nothing beats a proper cuppa in the morning!",
      connectedSpeech: "/ə ˈprɒpə ˈkʌpə/"
    },
    {
      chunk: "Who knew?",
      meaning: "Quem diria? / Quem sabia?",
      example: "She can sing! Who knew?",
      connectedSpeech: "/huː njuː/"
    },
    {
      chunk: "a whole other story",
      meaning: "outra história completamente",
      example: "My love life? That's a whole other story!",
      connectedSpeech: "/ə həʊl ˈʌðə ˈstɔːri/"
    }
  ],
  
  connectedSpeech: [
    {
      original: "Would you",
      spoken: "Would ya / Wouldja",
      phonetic: "/wʊdʒə/"
    },
    {
      original: "cup of tea",
      spoken: "cuppa",
      phonetic: "/ˈkʌpə/"
    },
    {
      original: "a whole other",
      spoken: "a whole 'nother",
      phonetic: "/ə həʊl ˈnʌðə/"
    }
  ],
  
  culturalNote: "The British are famous for their love of tea and their reserved nature in public. The 'milk first or tea first' debate is a real thing! And yes, making eye contact on the Tube is considered unusual.",
  culturalNotePt: "Os britânicos são famosos pelo amor ao chá e natureza reservada em público. O debate 'leite primeiro ou chá primeiro' é real! E sim, fazer contato visual no metrô é considerado incomum."
};

// Lista de todos os roteiros
export const ALL_ANIMATION_SCRIPTS: AnimationScript[] = [
  SCRIPT_LUCAS_LOCH_NESS,
  SCRIPT_EMILY_TEXAS,
  SCRIPT_AIKO_NYC,
  SCRIPT_LUCAS_LONDON,
  SCRIPT_EMILY_AUSTRALIA,
  SCRIPT_AIKO_LONDON
];

// Função para obter roteiros por personagem
export function getScriptsByCharacter(character: 'lucas' | 'emily' | 'aiko'): AnimationScript[] {
  return ALL_ANIMATION_SCRIPTS.filter(script => script.character === character);
}

// Função para obter roteiro por ID
export function getScriptById(id: string): AnimationScript | undefined {
  return ALL_ANIMATION_SCRIPTS.find(script => script.id === id);
}
