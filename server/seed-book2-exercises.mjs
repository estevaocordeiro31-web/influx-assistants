/**
 * Seed Script: Exercícios Extras do Book 2
 * Todas as Units com Contexto dos Personagens Lucas, Emily, Aiko
 * Baseado no conteúdo REAL das imagens do livro
 */

export const book2Exercises = [

  // ============================================================
  // UNIT 1 - VACATION AND WEATHER - LESSON 1 (Lexical)
  // ============================================================

  {
    bookId: 2,
    lessonNumber: 1,
    title: "🇺🇸 Lucas's Vacation in California",
    description: "Lucas conta sobre suas férias na Califórnia. Pratique Simple Past e vocabulário de viagem e clima.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Lucas voltou de férias na Califórnia e está contando para um amigo. Nos EUA, road trips são muito populares!",
      dialogue: [
        { speaker: "Jake", text: "Hey Lucas, how are you doing?" },
        { speaker: "Lucas", text: "Pretty well! I just got back from vacation." },
        { speaker: "Jake", text: "No kidding? Where did you go?" },
        { speaker: "Lucas", text: "I took a trip to California. I traveled from New York to LA by car!" },
        { speaker: "Jake", text: "A road trip? That's awesome! How long were you away?" },
        { speaker: "Lucas", text: "I was away for about two weeks." },
        { speaker: "Jake", text: "And what was the weather like?" },
        { speaker: "Lucas", text: "It was warm and sunny most of the time. Completely different from New York!" },
        { speaker: "Jake", text: "Did you take any pictures?" },
        { speaker: "Lucas", text: "You bet! I took a lot of pictures at the Grand Canyon and at the beach." },
        { speaker: "Jake", text: "Did you enjoy it?" },
        { speaker: "Lucas", text: "I enjoyed every single day. It was terrific!" }
      ],
      culturalNote: "Road trips são uma tradição americana. Muitos jovens fazem road trips durante o verão. 'You bet!' é uma expressão americana que significa 'Com certeza!' ou 'Pode apostar!'. A Califórnia tem clima quente e ensolarado quase o ano todo, diferente de Nova York que tem invernos rigorosos.",
      accentTip: "Lucas pronuncia 'California' como 'Cal-uh-FORN-yuh'. 'Awesome' soa como 'AW-sum'. 'Got back' com connected speech soa como 'gah-BACK'.",
      questions: [
        { question: "Para onde Lucas viajou?", options: ["Florida", "Califórnia", "Texas", "Hawaii"], correctIndex: 1, explanation: "Lucas fez uma road trip para a Califórnia." },
        { question: "Quanto tempo Lucas ficou fora?", options: ["Uma semana", "Duas semanas", "Três semanas", "Um mês"], correctIndex: 1, explanation: "Lucas diz 'I was away for about two weeks.'" },
        { question: "Como estava o clima?", options: ["Frio e com neve", "Quente e ensolarado", "Nublado e chuvoso", "Com neblina"], correctIndex: 1, explanation: "Lucas diz 'It was warm and sunny most of the time.'" }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 1,
    title: "🇬🇧 Emily's Holiday in Scotland",
    description: "Emily conta sobre suas férias na Escócia. Pratique Simple Past e vocabulário de clima britânico.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Emily voltou de férias na Escócia e conta para uma amiga. No Reino Unido, 'holiday' é a palavra para férias (não 'vacation')!",
      dialogue: [
        { speaker: "Sophie", text: "Emily! How was your holiday?" },
        { speaker: "Emily", text: "It was fantastic! I traveled to Scotland." },
        { speaker: "Sophie", text: "Brilliant! How long were you there?" },
        { speaker: "Emily", text: "I was there for about ten days." },
        { speaker: "Sophie", text: "And what was the weather like?" },
        { speaker: "Emily", text: "It was foggy early in the morning and cool during the day, but at least it wasn't cold as usual." },
        { speaker: "Sophie", text: "Were you in Edinburgh the whole time?" },
        { speaker: "Emily", text: "Most of the time. I also took a day trip to Glasgow." },
        { speaker: "Sophie", text: "Did you visit any castles?" },
        { speaker: "Emily", text: "Of course! Edinburgh Castle is absolutely stunning. I took loads of photos." },
        { speaker: "Sophie", text: "Lovely! I'd love to see them." }
      ],
      culturalNote: "No Reino Unido, usam 'holiday' em vez de 'vacation'. 'Brilliant' e 'Lovely' são elogios típicos britânicos. 'Loads of' = 'muito/muitos' (informal britânico). A Escócia é famosa por seus castelos, neblina e paisagens verdes. Edinburgh Castle é um dos mais visitados do mundo.",
      accentTip: "Emily pronuncia 'Edinburgh' como 'ED-in-bruh' (NÃO 'Ed-in-burg'). 'Castle' soa como 'CAH-sul' (sem o T). 'Lovely' é 'LUV-lee'. 'Foggy' é 'FOG-ee'.",
      questions: [
        { question: "Quanto tempo Emily ficou na Escócia?", options: ["Uma semana", "Dez dias", "Duas semanas", "Um mês"], correctIndex: 1, explanation: "Emily diz 'I was there for about ten days.'" },
        { question: "Como estava o clima?", options: ["Quente e ensolarado", "Neblina de manhã e fresco de dia", "Nevando", "Muito frio"], correctIndex: 1, explanation: "Emily diz 'foggy early in the morning and cool during the day'." },
        { question: "O que 'holiday' significa no inglês britânico?", options: ["Feriado apenas", "Férias", "Dia santo", "Final de semana"], correctIndex: 1, explanation: "No UK, 'holiday' = férias. Nos EUA usam 'vacation'." }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 1,
    title: "🇦🇺 Aiko's Trip to the Outback",
    description: "Aiko conta sobre sua viagem ao Outback australiano. Pratique Simple Past e vocabulário de viagem.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Aiko",
      country: "Australia",
      flag: "🇦🇺",
      scenario: "Aiko voltou de uma viagem ao Outback australiano e conta para um amigo. O Outback é o interior desértico da Austrália!",
      dialogue: [
        { speaker: "Tom", text: "G'day Aiko! How was your trip?" },
        { speaker: "Aiko", text: "It was unreal! I went to the Outback." },
        { speaker: "Tom", text: "Fair dinkum? How long were you away?" },
        { speaker: "Aiko", text: "About a week. I went camping with some mates." },
        { speaker: "Tom", text: "What was the weather like out there?" },
        { speaker: "Aiko", text: "It was hot during the day — like, really hot — and cool at night." },
        { speaker: "Tom", text: "Did you see Uluru?" },
        { speaker: "Aiko", text: "Yeah! It was absolutely stunning at sunset. I took heaps of photos." },
        { speaker: "Tom", text: "Did you enjoy it?" },
        { speaker: "Aiko", text: "I enjoyed every minute. The stars at night were incredible. No worries about going back!" }
      ],
      culturalNote: "'G'day' = 'Good day' (saudação australiana). 'Unreal' = 'incrível' (gíria australiana). 'Fair dinkum' = 'sério?' ou 'de verdade'. 'Mates' = amigos. 'Heaps of' = 'muitos' (equivalente australiano de 'loads of' britânico). Uluru (Ayers Rock) é uma formação rochosa sagrada para os aborígenes australianos.",
      accentTip: "'G'day' soa como 'guh-DAI'. 'Unreal' soa como 'un-REEL'. 'Heaps' soa como 'heeps'. No sotaque australiano, 'day' soa mais como 'dai' e 'mate' como 'mait'.",
      questions: [
        { question: "Para onde Aiko viajou?", options: ["Sydney", "Melbourne", "O Outback", "Gold Coast"], correctIndex: 2, explanation: "Aiko foi ao Outback, o interior desértico da Austrália." },
        { question: "O que 'unreal' significa na gíria australiana?", options: ["Irreal/falso", "Incrível", "Estranho", "Normal"], correctIndex: 1, explanation: "'Unreal' na Austrália significa 'incrível' ou 'fantástico'." },
        { question: "Como estava o clima no Outback?", options: ["Frio o dia todo", "Quente de dia e fresco à noite", "Chuvoso", "Com neve"], correctIndex: 1, explanation: "Aiko diz 'hot during the day and cool at night' — típico do deserto." }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 1,
    title: "Vocabulary: Vacation and Weather",
    description: "Pratique o vocabulário de férias e clima da Lesson 1 do Book 2.",
    type: "vocabulary",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "matching",
      instruction: "Conecte cada palavra/expressão à sua tradução correta:",
      pairs: [
        { expression: "fog / foggy", country: "nevoeiro / com neblina", explanation: "Comum na Escócia e São Francisco" },
        { expression: "snow / snowy", country: "neve / com neve", explanation: "Comum no inverno de Nova York e Londres" },
        { expression: "cool", country: "fresco", explanation: "Temperatura entre frio e morno" },
        { expression: "warm", country: "morno, quente (agradável)", explanation: "Temperatura agradável" },
        { expression: "hot", country: "quente (forte)", explanation: "Temperatura alta" },
        { expression: "terrific / fantastic", country: "magnífico / fantástico", explanation: "Adjetivos muito positivos" },
        { expression: "to take a picture", country: "tirar uma foto", explanation: "= to take a photo = to take a photograph" },
        { expression: "to take a trip", country: "fazer uma viagem", explanation: "= to go on a trip" },
        { expression: "to go camping", country: "ir acampar", explanation: "go + -ing para atividades ao ar livre" },
        { expression: "the whole time", country: "o tempo todo", explanation: "= all the time" },
        { expression: "at least", country: "ao menos, pelo menos", explanation: "Expressão de consolação" },
        { expression: "as usual", country: "como de costume", explanation: "Algo que acontece normalmente" }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 1,
    title: "Grammar: Simple Past - Vacation Questions",
    description: "Pratique perguntas no Simple Past sobre férias e viagens.",
    type: "grammar",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "fill_in_the_blank",
      instruction: "Complete as perguntas e respostas no Simple Past:",
      sentences: [
        { text: "How ___ your vacation?", answer: "was", hint: "Verbo to be no passado" },
        { text: "Where did you ___ to?", answer: "travel", hint: "Verbo viajar" },
        { text: "I ___ to London last summer.", answer: "traveled", hint: "Passado de 'travel'" },
        { text: "What ___ the weather like?", answer: "was", hint: "Verbo to be no passado" },
        { text: "It was foggy ___ the morning.", answer: "in", hint: "Preposição de tempo" },
        { text: "Did you ___ any pictures?", answer: "take", hint: "Tirar (fotos)" },
        { text: "I ___ every single day of my trip.", answer: "enjoyed", hint: "Passado de 'enjoy'" },
        { text: "How long ___ you away?", answer: "were", hint: "Verbo to be no passado (you)" },
        { text: "I was away ___ about two weeks.", answer: "for", hint: "Preposição de duração" },
        { text: "Did you enjoy ___?", answer: "it", hint: "Pronome objeto" }
      ]
    })
  },

  // ============================================================
  // UNIT 1 - VACATION AND WEATHER - LESSON 2 (Communicative)
  // ============================================================

  {
    bookId: 2,
    lessonNumber: 2,
    title: "🌍 Trip Stories: Lucas, Emily & Aiko Share Their Adventures",
    description: "Os três personagens compartilham histórias de viagem. Compare expressões de cada país!",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "story_comparison",
      instruction: "Leia as três histórias de viagem e compare como cada personagem se expressa:",
      stories: [
        {
          character: "Lucas",
          flag: "🇺🇸",
          title: "Spring Break in Miami",
          text: "Hey guys! So I went to Miami for Spring Break. It was awesome! The weather was hot and sunny the whole time. I went to the beach every day, took a lot of pictures, and the food was amazing. I had the best time ever! You gotta go there someday!",
          expressions: ["awesome", "the whole time", "a lot of", "the best time ever", "you gotta"]
        },
        {
          character: "Emily",
          flag: "🇬🇧",
          title: "Bank Holiday in Cornwall",
          text: "Hello everyone! I spent the bank holiday weekend in Cornwall. It was lovely! The weather was quite nice, actually — warm and sunny, which is rather unusual for England. I visited some beautiful castles and had cream tea by the sea. It was absolutely brilliant!",
          expressions: ["lovely", "quite nice", "rather unusual", "cream tea", "absolutely brilliant"]
        },
        {
          character: "Aiko",
          flag: "🇦🇺",
          title: "Long Weekend at the Great Barrier Reef",
          text: "G'day everyone! I went to the Great Barrier Reef for the long weekend. It was unreal! The water was warm and crystal clear. I went snorkelling and saw heaps of tropical fish. The weather was perfect — not too hot, not too cool. Reckon it was the best trip I've ever had!",
          expressions: ["G'day", "unreal", "heaps of", "reckon", "not too hot, not too cool"]
        }
      ],
      comparisonNotes: [
        { topic: "Férias", usa: "vacation / Spring Break", uk: "holiday / bank holiday", aus: "holiday / long weekend" },
        { topic: "Muito bom", usa: "awesome / amazing", uk: "lovely / brilliant", aus: "unreal / sick" },
        { topic: "Muitos", usa: "a lot of / tons of", uk: "loads of / quite a few", aus: "heaps of" },
        { topic: "Eu acho", usa: "I think / I guess", uk: "I think / I suppose", aus: "I reckon" }
      ],
      questions: [
        { question: "Qual expressão é tipicamente australiana para 'muitos'?", options: ["a lot of", "loads of", "heaps of", "tons of"], correctIndex: 2, explanation: "'Heaps of' é a expressão australiana equivalente a 'a lot of'." },
        { question: "O que 'bank holiday' significa no inglês britânico?", options: ["Feriado bancário", "Feriado nacional", "Férias de banco", "Dia de pagamento"], correctIndex: 1, explanation: "'Bank holiday' no UK = feriado nacional (quando os bancos fecham)." },
        { question: "O que 'reckon' significa no inglês australiano?", options: ["Reconhecer", "Acho/Penso", "Contar", "Lembrar"], correctIndex: 1, explanation: "'Reckon' = 'I think' / 'Eu acho'. Muito usado na Austrália e no sul dos EUA." }
      ]
    })
  },

  // ============================================================
  // UNIT 2 - LOCATION AND DIRECTIONS - LESSON 3 (Lexical)
  // ============================================================

  {
    bookId: 2,
    lessonNumber: 3,
    title: "🇺🇸 Lucas Gives Directions in Manhattan",
    description: "Lucas dá direções em Manhattan. Pratique vocabulário de localização e preposições de lugar.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Um turista pede direções a Lucas em Manhattan. Nova York tem um sistema de ruas em grade (grid) que facilita dar direções!",
      dialogue: [
        { speaker: "Tourist", text: "Excuse me. How do I get to the Empire State Building from here?" },
        { speaker: "Lucas", text: "Oh, it's not far. Go down this street two blocks." },
        { speaker: "Tourist", text: "Two blocks. OK." },
        { speaker: "Lucas", text: "Then turn right on 5th Avenue." },
        { speaker: "Tourist", text: "Right on 5th Avenue?" },
        { speaker: "Lucas", text: "Yeah, and go up the street about three more blocks. You'll see it on your left." },
        { speaker: "Tourist", text: "How long does it take to walk there?" },
        { speaker: "Lucas", text: "It takes around fifteen minutes on foot." },
        { speaker: "Tourist", text: "Great, thank you so much!" },
        { speaker: "Lucas", text: "No problem! You can't miss it — it's a huge building!" }
      ],
      culturalNote: "Em Nova York, as ruas são organizadas em 'grid' (grade): Streets vão de leste a oeste, Avenues vão de norte a sul. 'Blocks' são quarteirões — a unidade básica de distância em cidades americanas. 'You can't miss it' = 'Você não tem como errar/perder'.",
      accentTip: "'Avenue' soa como 'AV-uh-noo'. 'Fifteen' com ênfase: 'fif-TEEN'. 'Block' soa como 'blahk'. No connected speech: 'You can't miss it' → 'ya-CAN'T-miss-it'.",
      questions: [
        { question: "Quantos quarteirões o turista precisa andar na primeira rua?", options: ["Um", "Dois", "Três", "Quatro"], correctIndex: 1, explanation: "Lucas diz 'Go down this street two blocks.'" },
        { question: "Quanto tempo leva para chegar andando?", options: ["5 minutos", "10 minutos", "15 minutos", "30 minutos"], correctIndex: 2, explanation: "Lucas diz 'It takes around fifteen minutes on foot.'" },
        { question: "O que 'You can't miss it' significa?", options: ["Você vai sentir falta", "Você não pode errar", "Você vai se perder", "É muito longe"], correctIndex: 1, explanation: "'You can't miss it' = 'Você não tem como errar' — é tão óbvio que é impossível não ver." }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 3,
    title: "🇬🇧 Emily Gives Directions in London",
    description: "Emily dá direções em Londres. Pratique vocabulário de localização no estilo britânico.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Um turista pede direções a Emily em Londres. As ruas de Londres são antigas e não seguem um padrão de grade como Nova York!",
      dialogue: [
        { speaker: "Tourist", text: "Excuse me. Do you know where the nearest chemist is?" },
        { speaker: "Emily", text: "Yes, there's one just around the corner." },
        { speaker: "Tourist", text: "And is there a post office near here?" },
        { speaker: "Emily", text: "Actually, there's one across from the museum, on the high street." },
        { speaker: "Tourist", text: "How do I get there from here?" },
        { speaker: "Emily", text: "Go up the street and then turn left at the traffic lights." },
        { speaker: "Tourist", text: "Left at the traffic lights. Right." },
        { speaker: "Emily", text: "Then carry on for about two minutes and you'll see it on your right." },
        { speaker: "Tourist", text: "How long does it take?" },
        { speaker: "Emily", text: "It takes about five minutes on foot. It's not far at all." }
      ],
      culturalNote: "No UK, 'chemist' = farmácia (nos EUA é 'drugstore' ou 'pharmacy'). 'High street' = rua principal de comércio (nos EUA é 'main street'). 'Carry on' = continuar (expressão britânica). As ruas de Londres são antigas e curvas, diferente do sistema de grade americano.",
      accentTip: "'Chemist' soa como 'KEM-ist'. 'Carry on' soa como 'KAIR-ee on'. 'Traffic lights' — no UK é plural, nos EUA pode ser 'traffic light' (singular). 'Not far at all' com sotaque britânico: 'not FAH at ALL'.",
      questions: [
        { question: "O que 'chemist' significa no inglês britânico?", options: ["Químico", "Farmácia", "Laboratório", "Hospital"], correctIndex: 1, explanation: "No UK, 'chemist' = farmácia. Nos EUA é 'drugstore' ou 'pharmacy'." },
        { question: "Onde fica o correio?", options: ["Na esquina", "Em frente ao museu", "Ao lado do banco", "Perto do hospital"], correctIndex: 1, explanation: "Emily diz 'there's one across from the museum' — em frente ao museu." },
        { question: "O que 'carry on' significa?", options: ["Carregar algo", "Continuar", "Voltar", "Parar"], correctIndex: 1, explanation: "'Carry on' = continuar. Expressão muito britânica!" }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 3,
    title: "🇦🇺 Aiko Gives Directions in Sydney",
    description: "Aiko dá direções em Sydney. Pratique vocabulário de localização no estilo australiano.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Aiko",
      country: "Australia",
      flag: "🇦🇺",
      scenario: "Um turista pede direções a Aiko em Sydney. A Austrália tem uma mistura de vocabulário britânico e expressões próprias!",
      dialogue: [
        { speaker: "Tourist", text: "Excuse me. I'm looking for a servo around here." },
        { speaker: "Aiko", text: "A servo? Yeah, there's one near the next bus stop." },
        { speaker: "Tourist", text: "And can you help me find the bottle-o?" },
        { speaker: "Aiko", text: "Sure! It's two blocks from here, next to the newsagent." },
        { speaker: "Tourist", text: "How do I get to Circular Quay from here?" },
        { speaker: "Aiko", text: "Easy! Go down this street and turn right at the traffic lights." },
        { speaker: "Tourist", text: "Right at the traffic lights." },
        { speaker: "Aiko", text: "Then just keep going straight and you'll see the harbour on your left." },
        { speaker: "Tourist", text: "How long does it take?" },
        { speaker: "Aiko", text: "About ten minutes. You can't miss it — the Opera House is right there!" }
      ],
      culturalNote: "'Servo' = posto de gasolina (abreviação australiana de 'service station'). 'Bottle-o' = loja de bebidas alcoólicas (abreviação de 'bottle shop'). Os australianos adoram abreviar palavras! 'Newsagent' = banca de jornal (UK/AUS). Circular Quay é o porto principal de Sydney, perto da Opera House.",
      accentTip: "'Servo' soa como 'SER-voh'. 'Bottle-o' soa como 'BOT-ul-oh'. 'Harbour' (grafia britânica/australiana) soa como 'HAH-buh'. 'Circular Quay' é pronunciado 'SIR-kyoo-luh KEE'.",
      questions: [
        { question: "O que 'servo' significa na gíria australiana?", options: ["Servidor", "Posto de gasolina", "Restaurante", "Supermercado"], correctIndex: 1, explanation: "'Servo' = service station = posto de gasolina. Australianos adoram abreviar!" },
        { question: "O que 'bottle-o' significa?", options: ["Garrafa", "Loja de bebidas", "Bar", "Farmácia"], correctIndex: 1, explanation: "'Bottle-o' = bottle shop = loja de bebidas alcoólicas." },
        { question: "Quanto tempo leva para chegar a Circular Quay?", options: ["5 minutos", "10 minutos", "15 minutos", "20 minutos"], correctIndex: 1, explanation: "Aiko diz 'About ten minutes.'" }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 3,
    title: "Vocabulary: Location and Directions",
    description: "Pratique o vocabulário de localização e direções da Lesson 3 do Book 2.",
    type: "vocabulary",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "matching",
      instruction: "Conecte cada palavra/expressão à sua tradução:",
      pairs: [
        { expression: "on the corner", country: "na esquina", explanation: "= at the corner" },
        { expression: "at the traffic lights", country: "no semáforo", explanation: "UK/AUS: traffic lights (plural)" },
        { expression: "on the left / on the right", country: "na esquerda / na direita", explanation: "Preposição 'on' + lado" },
        { expression: "to turn left / right", country: "virar à esquerda / direita", explanation: "Instrução de direção" },
        { expression: "to go down the street", country: "descer a rua", explanation: "Ir para baixo/adiante na rua" },
        { expression: "to go up the street", country: "subir a rua", explanation: "Ir para cima na rua" },
        { expression: "opposite / across from", country: "em frente de, do outro lado", explanation: "Preposição de posição" },
        { expression: "next to", country: "ao lado de", explanation: "Preposição de proximidade" },
        { expression: "near", country: "perto de", explanation: "Preposição de proximidade" },
        { expression: "around", country: "ao redor, por aqui", explanation: "'Is there a bank around here?'" },
        { expression: "how do I get to...?", country: "como eu chego até...?", explanation: "Pergunta de direção" },
        { expression: "how long does it take?", country: "quanto tempo leva?", explanation: "Pergunta de duração" }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 3,
    title: "Grammar: Prepositions of Place + Giving Directions",
    description: "Pratique preposições de lugar e como dar direções.",
    type: "grammar",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "fill_in_the_blank",
      instruction: "Complete com a preposição ou expressão correta:",
      sentences: [
        { text: "The bank is ___ the corner of Main Street.", answer: "on", hint: "on/at the corner" },
        { text: "Is there a drugstore ___ here?", answer: "around", hint: "por aqui" },
        { text: "The museum is ___ from the post office.", answer: "across", hint: "do outro lado" },
        { text: "Go ___ the street two blocks.", answer: "down", hint: "descer a rua" },
        { text: "Turn ___ at the traffic lights.", answer: "left", hint: "virar (esquerda ou direita)" },
        { text: "You'll see it ___ your right.", answer: "on", hint: "na sua (direita)" },
        { text: "The bookstore is ___ to the library.", answer: "next", hint: "ao lado de" },
        { text: "How long does it ___ to get there?", answer: "take", hint: "quanto tempo leva" },
        { text: "It ___ about fifteen minutes on foot.", answer: "takes", hint: "leva (3ª pessoa)" },
        { text: "There's a gas station ___ front of the supermarket.", answer: "in", hint: "em frente de" }
      ]
    })
  },

  // ============================================================
  // UNIT 2 - LOCATION AND DIRECTIONS - LESSON 4 (Communicative)
  // ============================================================

  {
    bookId: 2,
    lessonNumber: 4,
    title: "🌍 Getting Around: NYC vs London vs Sydney",
    description: "Compare como pedir direções em Nova York, Londres e Sydney. Diferenças culturais e de vocabulário!",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "story_comparison",
      instruction: "Compare como cada personagem pede e dá direções na sua cidade:",
      stories: [
        {
          character: "Lucas",
          flag: "🇺🇸",
          title: "Getting Around in New York",
          text: "In New York, it's pretty easy to get around. The streets are numbered — like 42nd Street, 5th Avenue. I usually say 'Go three blocks north' or 'Take the subway to Times Square.' If someone asks me for directions, I say 'It's on the corner of Broadway and 7th.' We use 'blocks' a lot — everything is measured in blocks!",
          expressions: ["blocks", "subway", "on the corner of", "go north/south"]
        },
        {
          character: "Emily",
          flag: "🇬🇧",
          title: "Getting Around in London",
          text: "London streets can be quite confusing because they're not in a grid. I usually say 'Carry on past the chemist' or 'It's just round the corner.' We use the Tube a lot — that's our underground railway. If someone's lost, I might say 'Pop into the newsagent and ask.' We don't really use 'blocks' — we say 'a five-minute walk' instead.",
          expressions: ["carry on", "round the corner", "the Tube", "pop into", "a five-minute walk"]
        },
        {
          character: "Aiko",
          flag: "🇦🇺",
          title: "Getting Around in Sydney",
          text: "Sydney's pretty easy to navigate. I usually say 'Head down to the harbour' or 'It's near the servo on the main road.' We use ferries a lot because of the harbour. If someone asks me, I say 'It's about a ten-minute walk, mate' or 'Just keep going straight, you can't miss it.' We're pretty laid-back about directions!",
          expressions: ["head down to", "servo", "mate", "laid-back", "ferries"]
        }
      ],
      comparisonNotes: [
        { topic: "Metrô", usa: "subway", uk: "the Tube / underground", aus: "train / metro" },
        { topic: "Farmácia", usa: "drugstore / pharmacy", uk: "chemist", aus: "chemist / pharmacy" },
        { topic: "Distância", usa: "blocks", uk: "a X-minute walk", aus: "about X minutes" },
        { topic: "Continuar", usa: "keep going", uk: "carry on", aus: "keep going / head down" }
      ],
      questions: [
        { question: "Como os britânicos chamam o metrô?", options: ["Subway", "The Tube", "Metro", "Train"], correctIndex: 1, explanation: "No UK, o metrô de Londres é chamado 'the Tube' ou 'underground'." },
        { question: "Os americanos medem distância em cidades usando:", options: ["Minutos", "Metros", "Blocks (quarteirões)", "Milhas"], correctIndex: 2, explanation: "Nos EUA, 'blocks' (quarteirões) são a unidade básica de distância em cidades." },
        { question: "O que 'pop into' significa no inglês britânico?", options: ["Pular dentro", "Entrar rapidamente", "Sair correndo", "Explodir"], correctIndex: 1, explanation: "'Pop into' = entrar rapidamente em um lugar. Expressão informal britânica." }
      ]
    })
  },

  // ============================================================
  // UNIT 3 - SPORTS AND WORKOUT - LESSON 5 (Lexical)
  // ============================================================

  {
    bookId: 2,
    lessonNumber: 5,
    title: "🇺🇸 Lucas's Workout Routine in NYC",
    description: "Lucas fala sobre sua rotina de exercícios em Nova York. Pratique go/do/play e frequência.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Lucas fala sobre sua rotina de exercícios. Nos EUA, academias (gyms) são muito populares e muitos jovens fazem exercícios ao ar livre em parques como o Central Park!",
      dialogue: [
        { speaker: "Jake", text: "Hey Lucas, how often do you work out?" },
        { speaker: "Lucas", text: "I work out at least three times a week." },
        { speaker: "Jake", text: "What do you usually do?" },
        { speaker: "Lucas", text: "I go running in Central Park almost every morning. And I play basketball on weekends." },
        { speaker: "Jake", text: "How good are you at basketball?" },
        { speaker: "Lucas", text: "I'm pretty good! I play for the school team." },
        { speaker: "Jake", text: "Do you do any other exercise?" },
        { speaker: "Lucas", text: "Yeah, I do some stretching after running. And sometimes I go swimming at the gym." },
        { speaker: "Jake", text: "Wow, you exercise a lot!" },
        { speaker: "Lucas", text: "Yeah, I try to stay in shape. Why don't we go jogging together sometime?" },
        { speaker: "Jake", text: "That's a great idea!" }
      ],
      culturalNote: "Nos EUA, 'to work out' = fazer exercícios (na academia ou ao ar livre). Central Park em Manhattan é um dos lugares mais populares para correr. Basketball é o esporte mais popular entre jovens americanos. 'To stay in shape' = manter a forma. 'Why don't we...?' = sugestão.",
      accentTip: "'Work out' com connected speech: 'WORK-out'. 'Basketball' soa como 'BAS-kit-ball'. 'Pretty good' → 'PRIH-dee good'. 'Sometime' vs 'sometimes': 'sometime' = em algum momento, 'sometimes' = às vezes.",
      questions: [
        { question: "Quantas vezes por semana Lucas se exercita?", options: ["Uma vez", "Duas vezes", "Pelo menos três vezes", "Todo dia"], correctIndex: 2, explanation: "Lucas diz 'at least three times a week'." },
        { question: "Qual a regra: GO, DO ou PLAY basketball?", options: ["GO basketball", "DO basketball", "PLAY basketball", "MAKE basketball"], correctIndex: 2, explanation: "PLAY + esportes com bola/competitivos: play basketball, play soccer, play tennis." },
        { question: "O que 'to stay in shape' significa?", options: ["Ficar em forma", "Ficar parado", "Mudar de forma", "Perder peso"], correctIndex: 0, explanation: "'To stay in shape' = manter a forma física." }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 5,
    title: "🇬🇧 Emily's Fitness Routine in London",
    description: "Emily fala sobre sua rotina de exercícios em Londres. Pratique go/do/play e vocabulário de esportes.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Emily fala sobre exercícios. No Reino Unido, 'football' = futebol (não football americano!) e 'sport' é singular ('do you do any sport?').",
      dialogue: [
        { speaker: "Sophie", text: "Emily, do you do any sport?" },
        { speaker: "Emily", text: "Yes! I do yoga three times a week and I go swimming on Saturdays." },
        { speaker: "Sophie", text: "How good are you at swimming?" },
        { speaker: "Emily", text: "I'm not bad, actually. I'm on the school swimming team." },
        { speaker: "Sophie", text: "Brilliant! Do you play any team sports?" },
        { speaker: "Emily", text: "I play netball sometimes. And I go running in Hyde Park when the weather's nice." },
        { speaker: "Sophie", text: "How often do you exercise?" },
        { speaker: "Emily", text: "Almost every day, really. I like to take a walk after dinner as well." },
        { speaker: "Sophie", text: "That's lovely. I rarely exercise, to be honest." },
        { speaker: "Emily", text: "Why don't we go for a jog together? It's quite fun!" }
      ],
      culturalNote: "No UK, 'sport' é singular: 'do you do any sport?' (nos EUA: 'do you play any sports?'). 'Netball' é um esporte popular entre mulheres no UK (parecido com basketball). 'Not bad' = understatement britânico para 'bom'. 'To be honest' = 'para ser honesta' — expressão muito britânica.",
      accentTip: "'Yoga' soa como 'YOH-guh' (não 'IO-ga'). 'Swimming' → 'SWIM-in' (g mudo no final). 'Quite fun' → 'kwait FUN'. 'Jog' soa como 'JOG' (com O curto).",
      questions: [
        { question: "Qual esporte Emily pratica que é típico do UK?", options: ["Basketball", "Netball", "Baseball", "Football americano"], correctIndex: 1, explanation: "Netball é um esporte popular entre mulheres no Reino Unido." },
        { question: "Qual a regra: GO, DO ou PLAY yoga?", options: ["GO yoga", "DO yoga", "PLAY yoga", "MAKE yoga"], correctIndex: 1, explanation: "DO + exercícios individuais/artes marciais: do yoga, do aerobics, do judo." },
        { question: "O que 'not bad' realmente significa no inglês britânico?", options: ["Ruim", "Mais ou menos", "Bom (understatement)", "Péssimo"], correctIndex: 2, explanation: "'Not bad' é um understatement britânico — geralmente significa 'bom' ou até 'muito bom'!" }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 5,
    title: "🇦🇺 Aiko's Active Life in Sydney",
    description: "Aiko fala sobre esportes na Austrália. Pratique go/do/play e vocabulário de esportes aquáticos.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Aiko",
      country: "Australia",
      flag: "🇦🇺",
      scenario: "Aiko fala sobre esportes. A Austrália é famosa por esportes aquáticos e ao ar livre! O clima quente favorece atividades na praia.",
      dialogue: [
        { speaker: "Tom", text: "Aiko, how often do you work out?" },
        { speaker: "Aiko", text: "Heaps! I go surfing almost every day before school." },
        { speaker: "Tom", text: "Every day? That's mad!" },
        { speaker: "Aiko", text: "Yeah, Bondi Beach is right near my house. I also go swimming and do some stretching." },
        { speaker: "Tom", text: "How good are you at surfing?" },
        { speaker: "Aiko", text: "I'm pretty good, I reckon. I've been surfing since I was a kid." },
        { speaker: "Tom", text: "Do you play any team sports?" },
        { speaker: "Aiko", text: "Yeah, I play footy on weekends with my mates." },
        { speaker: "Tom", text: "Do you know how to play cricket?" },
        { speaker: "Aiko", text: "Of course! Every Aussie knows how to play cricket. It's our national sport!" },
        { speaker: "Tom", text: "Why don't we go for a surf this arvo?" },
        { speaker: "Aiko", text: "Sounds good, mate!" }
      ],
      culturalNote: "'Footy' na Austrália = Australian Rules Football (AFL), diferente do soccer e do football americano. 'Mad' = incrível/louco (gíria). 'Arvo' = afternoon (abreviação australiana). Cricket é o esporte nacional da Austrália. 'Aussie' = australiano. Surfing é quase um estilo de vida na Austrália.",
      accentTip: "'Surfing' soa como 'SURF-in'. 'Footy' soa como 'FOO-tee'. 'Arvo' soa como 'AH-voh'. 'Cricket' soa como 'KRIK-it'. No sotaque australiano, 'mate' soa como 'mait'.",
      questions: [
        { question: "O que 'footy' significa na Austrália?", options: ["Futebol (soccer)", "Football americano", "Australian Rules Football", "Rugby"], correctIndex: 2, explanation: "'Footy' na Austrália = Australian Rules Football (AFL), um esporte único australiano." },
        { question: "O que 'arvo' significa?", options: ["Manhã", "Tarde", "Noite", "Madrugada"], correctIndex: 1, explanation: "'Arvo' = afternoon. Australianos adoram abreviar palavras!" },
        { question: "Qual a regra: GO, DO ou PLAY surfing?", options: ["PLAY surfing", "DO surfing", "GO surfing", "MAKE surfing"], correctIndex: 2, explanation: "GO + -ing para atividades individuais/ao ar livre: go surfing, go swimming, go running." }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 5,
    title: "Vocabulary: Sports and Workout",
    description: "Pratique o vocabulário de esportes e exercícios da Lesson 5 do Book 2.",
    type: "vocabulary",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "matching",
      instruction: "Conecte cada palavra/expressão à sua tradução:",
      pairs: [
        { expression: "swimming / running / jogging", country: "natação / corrida / cooper", explanation: "GO + -ing" },
        { expression: "bowling / boxing", country: "boliche / boxe", explanation: "GO bowling / DO boxing" },
        { expression: "judo / aerobics / yoga", country: "judô / aeróbica / ioga", explanation: "DO + exercícios individuais" },
        { expression: "pool (billiards)", country: "sinuca", explanation: "PLAY pool" },
        { expression: "to work out", country: "fazer exercícios", explanation: "Exercitar-se (academia ou ao ar livre)" },
        { expression: "to stretch", country: "alongar(-se)", explanation: "Exercício de flexibilidade" },
        { expression: "to try", country: "tentar, experimentar", explanation: "to try / tried / tried" },
        { expression: "to win", country: "ganhar, vencer", explanation: "to win / won / won" },
        { expression: "how often...?", country: "com que frequência...?", explanation: "Pergunta de frequência" },
        { expression: "how good are you at...?", country: "como você é em...?", explanation: "Pergunta de habilidade" },
        { expression: "to take a walk", country: "dar uma caminhada", explanation: "= to go for a walk" },
        { expression: "to take a nap", country: "tirar uma soneca", explanation: "= to have a nap (UK)" }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 5,
    title: "Grammar: GO / DO / PLAY + Sports",
    description: "Pratique as regras de GO, DO e PLAY com esportes e exercícios.",
    type: "grammar",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "fill_in_the_blank",
      instruction: "Complete com GO, DO ou PLAY:",
      sentences: [
        { text: "I ___ swimming twice a week.", answer: "go", hint: "GO + -ing (atividades individuais)" },
        { text: "She ___ yoga every morning.", answer: "does", hint: "DO + exercícios individuais" },
        { text: "They ___ basketball on weekends.", answer: "play", hint: "PLAY + esportes com bola" },
        { text: "He ___ jogging in the park.", answer: "goes", hint: "GO + -ing" },
        { text: "We ___ aerobics at the gym.", answer: "do", hint: "DO + exercícios" },
        { text: "Do you ___ pool?", answer: "play", hint: "PLAY + jogos" },
        { text: "I ___ bowling with my friends.", answer: "go", hint: "GO + -ing" },
        { text: "She ___ boxing in her free time.", answer: "does", hint: "DO + artes marciais/luta" },
        { text: "How often do you ___ out?", answer: "work", hint: "work out = exercitar-se" },
        { text: "How good are you ___ playing tennis?", answer: "at", hint: "good AT + gerúndio" }
      ]
    })
  },

  // ============================================================
  // UNIT 3 - SPORTS AND WORKOUT - LESSON 6 (Communicative)
  // ============================================================

  {
    bookId: 2,
    lessonNumber: 6,
    title: "🌍 Sports Culture: USA vs UK vs Australia",
    description: "Compare a cultura esportiva dos três países. Expressões e esportes populares em cada um!",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "story_comparison",
      instruction: "Compare a cultura esportiva de cada país:",
      stories: [
        {
          character: "Lucas",
          flag: "🇺🇸",
          title: "Sports in America",
          text: "In the US, the big four sports are football (American football), basketball, baseball, and hockey. I play basketball for my school team — we practice at least three times a week. A lot of kids play sports in school — it's a big part of American culture. On weekends, I like to go running in Central Park or play some pickup basketball with my buddies.",
          expressions: ["the big four", "pickup basketball", "buddies", "practice"]
        },
        {
          character: "Emily",
          flag: "🇬🇧",
          title: "Sports in Britain",
          text: "In Britain, football (that's soccer to Americans!) is the most popular sport by far. I'm not brilliant at football, but I play netball for the school team. Cricket is also very popular in summer. I quite enjoy going for a run in the park, and I do yoga to relax. We say 'sport' not 'sports' — 'Do you do any sport?'",
          expressions: ["football (soccer)", "netball", "cricket", "quite enjoy", "do any sport"]
        },
        {
          character: "Aiko",
          flag: "🇦🇺",
          title: "Sports in Australia",
          text: "Aussies are mad about sport! Our big ones are cricket, AFL (footy), rugby, and swimming. I go surfing almost every day — it's part of life here. We also love going to the beach for a swim or a game of beach volleyball. On weekends, I play footy with my mates. Sport is massive in Australia — we even get a public holiday for a horse race (Melbourne Cup)!",
          expressions: ["mad about", "footy", "mates", "massive", "a game of"]
        }
      ],
      comparisonNotes: [
        { topic: "Futebol", usa: "soccer (football = americano)", uk: "football", aus: "soccer / football" },
        { topic: "Esporte popular", usa: "basketball, baseball", uk: "football, cricket", aus: "cricket, AFL, rugby" },
        { topic: "Amigos", usa: "buddies / friends", uk: "mates / friends", aus: "mates" },
        { topic: "Muito popular", usa: "huge / big", uk: "very popular / big", aus: "massive / mad about" }
      ],
      questions: [
        { question: "O que 'football' significa nos EUA vs UK?", options: ["Mesmo esporte", "EUA=americano, UK=soccer", "EUA=soccer, UK=americano", "Nenhum dos dois"], correctIndex: 1, explanation: "Nos EUA, 'football' = football americano. No UK, 'football' = soccer." },
        { question: "Qual esporte é exclusivo da Austrália?", options: ["Cricket", "AFL (footy)", "Rugby", "Swimming"], correctIndex: 1, explanation: "AFL (Australian Football League) é um esporte exclusivamente australiano." },
        { question: "O que 'mad about' significa?", options: ["Bravo com", "Louco por/apaixonado por", "Triste sobre", "Confuso com"], correctIndex: 1, explanation: "'Mad about' = apaixonado por, louco por. 'Aussies are mad about sport!'" }
      ]
    })
  },

  // ============================================================
  // UNIT 4 - FOOD AND DRINK - LESSON 7 (Lexical)
  // ============================================================

  {
    bookId: 2,
    lessonNumber: 7,
    title: "🇺🇸 Lucas Orders Food at a Diner",
    description: "Lucas pede comida em um diner americano. Pratique vocabulário de comida e expressões de restaurante.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Lucas está num diner típico americano em Nova York. Diners são restaurantes casuais com comida clássica americana!",
      dialogue: [
        { speaker: "Waitress", text: "Hi there! What can I get you?" },
        { speaker: "Lucas", text: "Can I have a cheeseburger with fries, please?" },
        { speaker: "Waitress", text: "Sure! What would you like to drink?" },
        { speaker: "Lucas", text: "I'll have a large soda, please." },
        { speaker: "Waitress", text: "Anything else?" },
        { speaker: "Lucas", text: "Yeah, can I get some ketchup and mustard on the side?" },
        { speaker: "Waitress", text: "Of course! Would you like to try our apple pie for dessert?" },
        { speaker: "Lucas", text: "Sounds great! I'll take a slice." },
        { speaker: "Waitress", text: "Coming right up!" }
      ],
      culturalNote: "Diners são restaurantes casuais típicos americanos, abertos 24h. 'Fries' = batatas fritas (UK: 'chips'). 'Soda' = refrigerante (em outras regiões dos EUA: 'pop' ou 'coke'). 'On the side' = separado. 'Coming right up!' = 'Saindo!' (expressão de garçom). Gorjeta (tip) de 15-20% é esperada nos EUA!",
      accentTip: "'Cheeseburger' soa como 'CHEEZ-bur-gur'. 'Fries' soa como 'fraiz'. 'Ketchup' soa como 'KETCH-up'. 'Coming right up' com connected speech: 'COMIN-rait-UP'.",
      questions: [
        { question: "O que 'fries' significa nos EUA?", options: ["Frituras em geral", "Batatas fritas", "Frango frito", "Peixe frito"], correctIndex: 1, explanation: "'Fries' (ou 'French fries') = batatas fritas. No UK são 'chips'." },
        { question: "O que 'on the side' significa?", options: ["Do lado de fora", "Separado", "Na lateral", "Extra"], correctIndex: 1, explanation: "'On the side' = servido separado do prato principal." },
        { question: "O que 'Coming right up!' significa?", options: ["Subindo!", "Saindo/Já vem!", "Chegando atrasado", "Vou verificar"], correctIndex: 1, explanation: "'Coming right up!' é expressão de garçom que significa 'Já vai sair!' ou 'Saindo!'" }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 7,
    title: "🇬🇧 Emily Orders at a Café in London",
    description: "Emily pede comida em um café londrino. Pratique vocabulário de comida britânico.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Emily está num café típico em Londres. A cultura de chá e café é muito forte no Reino Unido!",
      dialogue: [
        { speaker: "Waiter", text: "Good afternoon. What would you like?" },
        { speaker: "Emily", text: "Could I have a cup of tea, please? With milk, no sugar." },
        { speaker: "Waiter", text: "Of course. Would you like anything to eat?" },
        { speaker: "Emily", text: "Yes, I'd like a jacket potato with cheese and beans, please." },
        { speaker: "Waiter", text: "Lovely. Anything else?" },
        { speaker: "Emily", text: "Actually, could I also have a scone with clotted cream and jam?" },
        { speaker: "Waiter", text: "Certainly! That'll be ready in a few minutes." },
        { speaker: "Emily", text: "Brilliant, thank you." }
      ],
      culturalNote: "'Jacket potato' = batata assada com recheio (UK). 'Beans' = baked beans (feijão em molho de tomate, muito popular no UK). 'Scone' com 'clotted cream' e 'jam' = cream tea, tradição britânica. No UK, chá com leite é a bebida nacional! 'Certainly' é mais formal que 'sure'.",
      accentTip: "'Scone' tem duas pronúncias no UK: 'SKON' (norte) ou 'SKOHN' (sul). 'Jacket potato' soa como 'JAK-it puh-TAY-toh'. 'Certainly' soa como 'SER-tin-lee'.",
      questions: [
        { question: "O que é 'jacket potato'?", options: ["Batata frita", "Batata assada com recheio", "Purê de batata", "Batata chips"], correctIndex: 1, explanation: "'Jacket potato' = batata assada com recheio. Muito popular no UK." },
        { question: "O que é 'cream tea'?", options: ["Chá com creme", "Scone com clotted cream e jam", "Café com leite", "Chá gelado"], correctIndex: 1, explanation: "'Cream tea' = scone servido com clotted cream e jam, acompanhado de chá." },
        { question: "Como Emily pede chá?", options: ["Com açúcar", "Sem leite", "Com leite, sem açúcar", "Preto"], correctIndex: 2, explanation: "Emily pede 'a cup of tea with milk, no sugar' — típico britânico!" }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 7,
    title: "🇦🇺 Aiko Orders at a Café in Sydney",
    description: "Aiko pede comida em um café australiano. Pratique vocabulário de comida australiano.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Aiko",
      country: "Australia",
      flag: "🇦🇺",
      scenario: "Aiko está num café em Bondi Beach. A Austrália tem uma cultura de café muito forte, influenciada pela imigração italiana!",
      dialogue: [
        { speaker: "Barista", text: "Hey! What can I get ya?" },
        { speaker: "Aiko", text: "Can I grab a flat white, please?" },
        { speaker: "Barista", text: "Sure thing! Anything to eat?" },
        { speaker: "Aiko", text: "Yeah, I'll have some avo toast, thanks." },
        { speaker: "Barista", text: "Good choice! Want some brekkie as well?" },
        { speaker: "Aiko", text: "Nah, just the avo toast is sweet. Oh, and a lamington for later!" },
        { speaker: "Barista", text: "No worries! That'll be $18.50." },
        { speaker: "Aiko", text: "Cheers, mate!" }
      ],
      culturalNote: "'Flat white' = café com leite vaporizado (inventado na Austrália/Nova Zelândia). 'Avo toast' = torrada com abacate (abreviação de 'avocado'). 'Brekkie' = café da manhã (abreviação de 'breakfast'). 'Lamington' = bolo australiano coberto de chocolate e coco. 'Sweet' = legal/tranquilo (gíria). 'Cheers' = obrigado (informal).",
      accentTip: "'Flat white' soa como 'flat WAIT'. 'Avo' soa como 'AV-oh'. 'Brekkie' soa como 'BREK-ee'. 'Lamington' soa como 'LAM-ing-tun'. 'Cheers' soa como 'chee-uhz'.",
      questions: [
        { question: "O que é 'flat white'?", options: ["Chá branco", "Café com leite vaporizado", "Leite puro", "Chocolate quente"], correctIndex: 1, explanation: "'Flat white' é um café com leite vaporizado, inventado na Austrália/Nova Zelândia." },
        { question: "O que 'brekkie' significa?", options: ["Almoço", "Café da manhã", "Lanche", "Jantar"], correctIndex: 1, explanation: "'Brekkie' = breakfast = café da manhã. Mais uma abreviação australiana!" },
        { question: "O que é um 'lamington'?", options: ["Sanduíche", "Bolo com chocolate e coco", "Biscoito", "Torta"], correctIndex: 1, explanation: "'Lamington' é um bolo australiano coberto de chocolate e coco ralado." }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 7,
    title: "Vocabulary: Food and Drink",
    description: "Pratique o vocabulário de comida e bebida da Lesson 7 do Book 2.",
    type: "vocabulary",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "matching",
      instruction: "Conecte cada termo ao seu equivalente nos diferentes países:",
      pairs: [
        { expression: "fries (USA) / chips (UK)", country: "batatas fritas", explanation: "Cuidado: 'chips' nos EUA = salgadinho de pacote!" },
        { expression: "soda (USA) / fizzy drink (UK)", country: "refrigerante", explanation: "AUS: soft drink" },
        { expression: "cookie (USA) / biscuit (UK/AUS)", country: "biscoito", explanation: "'Biscuit' nos EUA = pãozinho!" },
        { expression: "candy (USA) / sweets (UK)", country: "doces/balas", explanation: "AUS: lollies" },
        { expression: "check (USA) / bill (UK/AUS)", country: "conta (restaurante)", explanation: "'Can I have the check/bill?'" },
        { expression: "appetizer (USA) / starter (UK)", country: "entrada", explanation: "AUS: entrée" },
        { expression: "main course", country: "prato principal", explanation: "Igual nos três países" },
        { expression: "dessert", country: "sobremesa", explanation: "AUS: 'pudding' (informal)" },
        { expression: "waiter / waitress", country: "garçom / garçonete", explanation: "AUS: 'server' (neutro)" },
        { expression: "tip (USA)", country: "gorjeta", explanation: "15-20% nos EUA, opcional no UK/AUS" }
      ]
    })
  },

  // ============================================================
  // UNIT 4 - FOOD AND DRINK - LESSON 8 (Communicative)
  // ============================================================

  {
    bookId: 2,
    lessonNumber: 8,
    title: "🌍 Food Culture: American Diner vs British Pub vs Aussie BBQ",
    description: "Compare a cultura gastronômica dos três países com os personagens!",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "story_comparison",
      instruction: "Compare como cada personagem descreve a cultura de comida do seu país:",
      stories: [
        {
          character: "Lucas",
          flag: "🇺🇸",
          title: "American Food Culture",
          text: "In America, we love our diners and fast food! A typical American meal might be a burger with fries and a soda. But we also have amazing food from all over the world — New York has the best pizza and Chinese food! Portion sizes are huge here. We usually leave a tip of 15-20% at restaurants. Brunch on weekends is a big thing too!",
          expressions: ["diner", "portion sizes", "tip", "brunch", "a big thing"]
        },
        {
          character: "Emily",
          flag: "🇬🇧",
          title: "British Food Culture",
          text: "British food gets a bad reputation, but it's actually quite good! We love our Sunday roast, fish and chips, and of course, a proper cup of tea. Pub food is brilliant — you can get a lovely shepherd's pie or bangers and mash. We don't usually tip as much as Americans — 10% is fine. And afternoon tea is a lovely tradition!",
          expressions: ["Sunday roast", "fish and chips", "pub food", "bangers and mash", "afternoon tea"]
        },
        {
          character: "Aiko",
          flag: "🇦🇺",
          title: "Australian Food Culture",
          text: "Aussie food is all about the BBQ — or 'barbie' as we call it! We love throwing some snags on the barbie on weekends. Our café culture is massive — we take our coffee very seriously. Vegemite on toast is a classic brekkie. We also have amazing seafood because we're surrounded by ocean. And meat pies are an Aussie staple!",
          expressions: ["barbie (BBQ)", "snags (sausages)", "café culture", "Vegemite", "meat pies"]
        }
      ],
      comparisonNotes: [
        { topic: "Refeição típica", usa: "burger + fries", uk: "fish and chips", aus: "BBQ snags" },
        { topic: "Bebida nacional", usa: "coffee / soda", uk: "tea", aus: "flat white" },
        { topic: "Gorjeta", usa: "15-20% (obrigatória)", uk: "10% (opcional)", aus: "não esperada" },
        { topic: "Café da manhã", usa: "pancakes / eggs", uk: "full English", aus: "avo toast / Vegemite" }
      ],
      questions: [
        { question: "O que são 'snags' na gíria australiana?", options: ["Problemas", "Salsichas", "Peixes", "Bifes"], correctIndex: 1, explanation: "'Snags' = sausages = salsichas. 'Throw some snags on the barbie' = fazer churrasco de salsicha." },
        { question: "O que é 'bangers and mash' no UK?", options: ["Bateria e guitarra", "Salsichas com purê", "Peixe com batata", "Carne com arroz"], correctIndex: 1, explanation: "'Bangers and mash' = salsichas com purê de batata. Prato clássico de pub britânico." },
        { question: "Quanto de gorjeta é esperado nos EUA?", options: ["Nenhuma", "5%", "10%", "15-20%"], correctIndex: 3, explanation: "Nos EUA, gorjeta de 15-20% é praticamente obrigatória em restaurantes." }
      ]
    })
  },

  // ============================================================
  // UNIT 5 - SHOPPING - LESSON 9 (Lexical)
  // ============================================================

  {
    bookId: 2,
    lessonNumber: 9,
    title: "🇺🇸 Lucas Goes Shopping at the Mall",
    description: "Lucas faz compras num shopping americano. Pratique vocabulário de compras e roupas.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Lucas está fazendo compras num mall (shopping) em Nova York. Nos EUA, malls são enormes e têm de tudo!",
      dialogue: [
        { speaker: "Sales clerk", text: "Hi! Can I help you find something?" },
        { speaker: "Lucas", text: "Yeah, I'm looking for a pair of sneakers." },
        { speaker: "Sales clerk", text: "What size do you wear?" },
        { speaker: "Lucas", text: "I'm a size 10." },
        { speaker: "Sales clerk", text: "How about these? They're on sale — 30% off!" },
        { speaker: "Lucas", text: "Cool! How much are they?" },
        { speaker: "Sales clerk", text: "They're $89.99." },
        { speaker: "Lucas", text: "That's a good deal! I'll take them." },
        { speaker: "Sales clerk", text: "Great! Cash or card?" },
        { speaker: "Lucas", text: "Card, please." }
      ],
      culturalNote: "'Sneakers' = tênis (UK: 'trainers', AUS: 'runners/joggers'). 'On sale' = em promoção. 'A good deal' = um bom negócio. Nos EUA, o preço na etiqueta NÃO inclui imposto (tax) — é adicionado no caixa! 'Cash or card?' = 'Dinheiro ou cartão?'",
      accentTip: "'Sneakers' soa como 'SNEE-kurz'. 'Size' soa como 'saiz'. '30% off' → 'THIR-dee per-CENT off'. 'I'll take them' com connected speech: 'all-TAKE-um'.",
      questions: [
        { question: "O que 'sneakers' significa nos EUA?", options: ["Sandálias", "Tênis", "Botas", "Sapatos sociais"], correctIndex: 1, explanation: "'Sneakers' (EUA) = 'trainers' (UK) = 'runners' (AUS) = tênis." },
        { question: "O que 'on sale' significa?", options: ["À venda", "Em promoção", "Esgotado", "Novo"], correctIndex: 1, explanation: "'On sale' = em promoção/com desconto." },
        { question: "Nos EUA, o preço na etiqueta inclui imposto?", options: ["Sim, sempre", "Não, o imposto é adicionado no caixa", "Depende do estado", "Não existe imposto"], correctIndex: 1, explanation: "Nos EUA, o 'sales tax' é adicionado no caixa — o preço na etiqueta é sem imposto!" }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 9,
    title: "🇬🇧 Emily Goes Shopping on the High Street",
    description: "Emily faz compras na high street de Londres. Pratique vocabulário de compras britânico.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Emily está fazendo compras na high street (rua principal de comércio) em Londres. No UK, as lojas são diferentes dos EUA!",
      dialogue: [
        { speaker: "Shop assistant", text: "Good afternoon. Can I help you?" },
        { speaker: "Emily", text: "Yes, I'm looking for a jumper, please." },
        { speaker: "Shop assistant", text: "What size are you?" },
        { speaker: "Emily", text: "I'm a size 10, I think." },
        { speaker: "Shop assistant", text: "How about this one? It's in the sale — half price!" },
        { speaker: "Emily", text: "Oh, that's lovely! How much is it?" },
        { speaker: "Shop assistant", text: "It's £35." },
        { speaker: "Emily", text: "Brilliant! I'll take it." },
        { speaker: "Shop assistant", text: "Would you like a bag?" },
        { speaker: "Emily", text: "Yes, please. Do you take contactless?" }
      ],
      culturalNote: "'Jumper' (UK) = suéter/moletom (EUA: 'sweater'). 'Shop assistant' (UK) = 'sales clerk' (EUA). 'In the sale' (UK) = 'on sale' (EUA). No UK, o preço JÁ inclui o imposto (VAT). 'Contactless' = pagamento por aproximação. No UK, cobram pela sacola plástica (5-10p).",
      accentTip: "'Jumper' soa como 'JUMP-uh'. 'Half price' soa como 'HAHF prais'. 'Lovely' soa como 'LUV-lee'. 'Contactless' soa como 'KON-takt-less'.",
      questions: [
        { question: "O que 'jumper' significa no inglês britânico?", options: ["Pessoa que pula", "Suéter/moletom", "Calça jeans", "Jaqueta"], correctIndex: 1, explanation: "'Jumper' (UK) = sweater (EUA) = suéter/moletom." },
        { question: "No UK, o preço inclui imposto?", options: ["Não, é adicionado depois", "Sim, o VAT já está incluído", "Não existe imposto", "Depende da loja"], correctIndex: 1, explanation: "No UK, o VAT (imposto) já está incluído no preço da etiqueta." },
        { question: "O que 'contactless' significa?", options: ["Sem contato visual", "Pagamento por aproximação", "Compra online", "Sem atendente"], correctIndex: 1, explanation: "'Contactless' = pagamento por aproximação (tap to pay)." }
      ]
    })
  },

  {
    bookId: 2,
    lessonNumber: 9,
    title: "🇦🇺 Aiko Goes Shopping in Sydney",
    description: "Aiko faz compras em Sydney. Pratique vocabulário de compras australiano.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Aiko",
      country: "Australia",
      flag: "🇦🇺",
      scenario: "Aiko está fazendo compras em Bondi Junction, Sydney. A Austrália tem uma mistura de vocabulário britânico com gírias próprias!",
      dialogue: [
        { speaker: "Sales assistant", text: "G'day! Need any help?" },
        { speaker: "Aiko", text: "Yeah, I'm after some new thongs and a pair of sunnies." },
        { speaker: "Sales assistant", text: "Thongs are over there, and sunnies are near the counter." },
        { speaker: "Aiko", text: "Sweet! How much are these thongs?" },
        { speaker: "Sales assistant", text: "They're $25. And the sunnies are $40." },
        { speaker: "Aiko", text: "Are they on special?" },
        { speaker: "Sales assistant", text: "Actually, if you buy both, you get 20% off!" },
        { speaker: "Aiko", text: "Ripper! I'll grab both then." },
        { speaker: "Sales assistant", text: "No worries! Cash or card?" },
        { speaker: "Aiko", text: "Card, thanks!" }
      ],
      culturalNote: "'Thongs' na Austrália = chinelos/sandálias de dedo (NÃO lingerie como nos EUA!). 'Sunnies' = óculos de sol (sunglasses). 'On special' (AUS) = 'on sale' (EUA) = em promoção. 'Ripper!' = incrível/ótimo (gíria australiana). 'I'll grab' = 'vou pegar/levar' (informal).",
      accentTip: "'Thongs' soa como 'thongs' (cuidado com o significado diferente!). 'Sunnies' soa como 'SUN-eez'. 'Ripper' soa como 'RIP-uh'. 'No worries' → 'noh-WUH-reez'.",
      questions: [
        { question: "O que 'thongs' significa na Austrália?", options: ["Lingerie", "Chinelos de dedo", "Calças", "Camisetas"], correctIndex: 1, explanation: "'Thongs' na Austrália = chinelos/sandálias de dedo. Nos EUA, 'thongs' = lingerie!" },
        { question: "O que 'sunnies' significa?", options: ["Dias ensolarados", "Óculos de sol", "Protetor solar", "Chapéu"], correctIndex: 1, explanation: "'Sunnies' = sunglasses = óculos de sol. Mais uma abreviação australiana!" },
        { question: "O que 'ripper' significa na gíria australiana?", options: ["Rasgado", "Incrível/Ótimo", "Caro", "Barato"], correctIndex: 1, explanation: "'Ripper!' = incrível, ótimo, fantástico. Gíria australiana de entusiasmo." }
      ]
    })
  },

  // ============================================================
  // UNIT 5 - SHOPPING - LESSON 10 (Communicative)
  // ============================================================

  {
    bookId: 2,
    lessonNumber: 10,
    title: "🌍 Shopping Expressions: USA vs UK vs Australia",
    description: "Compare expressões de compras nos três países. Vocabulário essencial para fazer compras!",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "story_comparison",
      instruction: "Compare as expressões de compras em cada país:",
      stories: [
        {
          character: "Lucas",
          flag: "🇺🇸",
          title: "Shopping in America",
          text: "Shopping in America is an experience! We have huge malls with hundreds of stores. Black Friday is the biggest shopping day — everything is on sale! I usually pay with my debit card. Sales tax is added at the register, so the price you see isn't what you pay. Returns are easy — most stores have a 30-day return policy. And don't forget to check for coupons!",
          expressions: ["mall", "on sale", "sales tax", "register", "return policy", "coupons"]
        },
        {
          character: "Emily",
          flag: "🇬🇧",
          title: "Shopping in Britain",
          text: "In Britain, we love the high street and charity shops! Boxing Day (26th December) is our big sale day. The price you see includes VAT, so no surprises at the till. We use contactless for almost everything now. Charity shops are brilliant for finding bargains — you can get lovely things for next to nothing. And we always bring our own bags!",
          expressions: ["high street", "charity shops", "Boxing Day", "till", "bargains", "next to nothing"]
        },
        {
          character: "Aiko",
          flag: "🇦🇺",
          title: "Shopping in Australia",
          text: "Shopping in Oz is pretty chill! We have big shopping centres and lots of op shops (second-hand shops). EOFY sales (End of Financial Year in June) are massive! GST is included in the price, so what you see is what you pay. We love our markets too — Bondi Markets on Sundays are the best for finding unique stuff. And everything's getting more expensive, so we love a good bargain!",
          expressions: ["shopping centres", "op shops", "EOFY sales", "GST", "markets", "bargain"]
        }
      ],
      comparisonNotes: [
        { topic: "Shopping center", usa: "mall", uk: "shopping centre", aus: "shopping centre" },
        { topic: "Promoção", usa: "on sale / Black Friday", uk: "in the sale / Boxing Day", aus: "on special / EOFY" },
        { topic: "Imposto", usa: "sales tax (não incluído)", uk: "VAT (incluído)", aus: "GST (incluído)" },
        { topic: "Caixa", usa: "register / checkout", uk: "till / checkout", aus: "checkout / counter" },
        { topic: "Brechó", usa: "thrift store", uk: "charity shop", aus: "op shop" }
      ],
      questions: [
        { question: "Quando é o maior dia de compras nos EUA?", options: ["Boxing Day", "Black Friday", "EOFY", "Natal"], correctIndex: 1, explanation: "Black Friday (dia após Thanksgiving) é o maior dia de compras nos EUA." },
        { question: "O que é 'op shop' na Austrália?", options: ["Loja de óptica", "Brechó/loja de segunda mão", "Loja de eletrônicos", "Supermercado"], correctIndex: 1, explanation: "'Op shop' (opportunity shop) = brechó/loja de segunda mão na Austrália." },
        { question: "Em qual país o imposto NÃO está incluído no preço?", options: ["UK", "Austrália", "EUA", "Todos incluem"], correctIndex: 2, explanation: "Nos EUA, o 'sales tax' é adicionado no caixa — o preço na etiqueta é sem imposto!" }
      ]
    })
  }

];
