/**
 * Seed Script: Exercícios Extras do Book 1 - UNIT 2 (AT HOME)
 * Lessons 6-10 com Contexto dos Personagens Lucas, Emily, Aiko
 * Baseado no conteúdo REAL das imagens do livro
 */

export const book1Unit2Exercises = [

  // ============================================================
  // LESSON 6: What's Your Address? - House, Rooms, Adjectives
  // ============================================================

  {
    bookId: 1,
    lessonNumber: 6,
    title: "🇺🇸 Lucas's Apartment in New York",
    description: "Lucas descreve seu apartamento em Nova York. Pratique vocabulário de casa, cômodos e adjetivos.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Lucas mostra seu apartamento em Manhattan para um amigo por videochamada. Apartamentos em Nova York são famosos por serem pequenos e caros!",
      dialogue: [
        { speaker: "Mike", text: "Hey Lucas, where do you live?" },
        { speaker: "Lucas", text: "I live in an apartment in Manhattan." },
        { speaker: "Mike", text: "Cool! What's your address?" },
        { speaker: "Lucas", text: "It's 245 West 14th Street." },
        { speaker: "Mike", text: "How do you spell that?" },
        { speaker: "Lucas", text: "W-E-S-T, 1-4-T-H Street." },
        { speaker: "Mike", text: "What's your apartment like?" },
        { speaker: "Lucas", text: "It's small but nice. There's a living room, a bedroom, a kitchen and a bathroom." },
        { speaker: "Mike", text: "Is it big?" },
        { speaker: "Lucas", text: "No way! It's tiny! But it's in a great neighborhood." }
      ],
      culturalNote: "Em Nova York, apartamentos são muito pequenos e caros. Um studio (quitinete) pode custar $2,000/mês! Os americanos usam 'Street', 'Avenue', 'Boulevard' nos endereços. 'What's your apartment like?' = 'Como é seu apartamento?'",
      accentTip: "Lucas pronuncia 'apartment' como 'a-PART-ment' (com R forte). 'Address' tem ênfase na segunda sílaba: 'a-DRESS'. 'Neighborhood' soa como 'NAY-bor-hood'.",
      questions: [
        {
          question: "Onde Lucas mora?",
          options: ["Numa casa em Brooklyn", "Num apartamento em Manhattan", "Numa fazenda", "Num hotel"],
          correctIndex: 1,
          explanation: "Lucas mora num apartamento em Manhattan, Nova York."
        },
        {
          question: "Como é o apartamento de Lucas?",
          options: ["Grande e luxuoso", "Pequeno mas legal", "Velho e feio", "Enorme"],
          correctIndex: 1,
          explanation: "Lucas diz 'It's small but nice' - pequeno mas legal, típico de Nova York!"
        },
        {
          question: "Quantos cômodos Lucas menciona?",
          options: ["2", "3", "4", "5"],
          correctIndex: 2,
          explanation: "Lucas menciona 4 cômodos: living room, bedroom, kitchen e bathroom."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 6,
    title: "🇬🇧 Emily's House in London",
    description: "Emily descreve sua casa em Londres. Pratique vocabulário de casa e adjetivos no estilo britânico.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Emily mostra sua casa típica inglesa (terraced house) em Londres para uma amiga. As casas britânicas são diferentes das americanas!",
      dialogue: [
        { speaker: "Julie", text: "Emily, where do you live?" },
        { speaker: "Emily", text: "I live in a house in Notting Hill, London." },
        { speaker: "Julie", text: "What's your address?" },
        { speaker: "Emily", text: "It's 12 Portobello Road." },
        { speaker: "Julie", text: "How do you spell Portobello?" },
        { speaker: "Emily", text: "P-O-R-T-O-B-E-L-L-O." },
        { speaker: "Julie", text: "What's your house like?" },
        { speaker: "Emily", text: "It's a lovely terraced house. There's a lounge, a dining room, a kitchen and three bedrooms upstairs." },
        { speaker: "Julie", text: "Is there a garden?" },
        { speaker: "Emily", text: "Yes, there's a small garden at the back. It's quite nice." }
      ],
      culturalNote: "No Reino Unido, 'lounge' ou 'sitting room' = sala de estar (nos EUA é 'living room'). 'Terraced house' é uma casa geminada, muito comum em Londres. 'Garden' no UK = quintal/jardim (nos EUA usam 'yard' para quintal). 'Quite nice' é um elogio típico britânico - parece fraco mas é positivo!",
      accentTip: "Emily pronuncia 'house' como 'haos' (sem R forte). 'Lovely' é uma palavra muito britânica - usada para quase tudo positivo. 'Quite' soa como 'kwait'.",
      questions: [
        {
          question: "Onde Emily mora?",
          options: ["Num apartamento", "Numa casa em Notting Hill", "Numa fazenda", "Num flat"],
          correctIndex: 1,
          explanation: "Emily mora numa terraced house em Notting Hill, Londres."
        },
        {
          question: "O que 'lounge' significa no inglês britânico?",
          options: ["Cozinha", "Banheiro", "Sala de estar", "Quarto"],
          correctIndex: 2,
          explanation: "'Lounge' (ou 'sitting room') é a palavra britânica para sala de estar. Nos EUA é 'living room'."
        },
        {
          question: "A casa de Emily tem jardim?",
          options: ["Não", "Sim, um grande na frente", "Sim, um pequeno nos fundos", "Ela não menciona"],
          correctIndex: 2,
          explanation: "Emily diz 'there's a small garden at the back' - um jardim pequeno nos fundos."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 6,
    title: "🇦🇺 Aiko's House in Sydney",
    description: "Aiko descreve sua casa em Sydney. Pratique vocabulário de casa no estilo australiano.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Aiko",
      country: "Australia",
      flag: "🇦🇺",
      scenario: "Aiko mostra sua casa perto de Bondi Beach em Sydney. As casas australianas geralmente são maiores e têm quintal!",
      dialogue: [
        { speaker: "Steve", text: "Hey Aiko, where do you live?" },
        { speaker: "Aiko", text: "I live in a house near Bondi Beach." },
        { speaker: "Steve", text: "What's your address?" },
        { speaker: "Aiko", text: "It's 8 Campbell Parade, Bondi." },
        { speaker: "Steve", text: "Sick! What's your house like?" },
        { speaker: "Aiko", text: "It's a nice house with a big backyard. There's a living room, a kitchen, two bedrooms and a bathroom." },
        { speaker: "Steve", text: "Is there a pool?" },
        { speaker: "Aiko", text: "Nah, but the beach is right there! Who needs a pool?" },
        { speaker: "Steve", text: "Fair enough, mate!" }
      ],
      culturalNote: "Na Austrália, 'sick' é gíria para 'incrível/legal' (como 'awesome'). 'Backyard' é o quintal - muito importante na cultura australiana para churrasco (BBQ/barbie). 'Fair enough' = 'faz sentido/justo'. Muitas casas australianas têm piscina por causa do clima quente.",
      accentTip: "'Bondi' é pronunciado 'BON-dai' (não 'BON-di'). 'Nah' = 'não' (informal). 'Right there' soa como 'roit theh' no sotaque australiano.",
      questions: [
        {
          question: "Onde Aiko mora?",
          options: ["Num apartamento no centro", "Numa casa perto de Bondi Beach", "Numa fazenda", "Num hotel"],
          correctIndex: 1,
          explanation: "Aiko mora numa casa perto de Bondi Beach, Sydney."
        },
        {
          question: "O que 'sick' significa na gíria australiana?",
          options: ["Doente", "Incrível/Legal", "Triste", "Cansado"],
          correctIndex: 1,
          explanation: "'Sick' na gíria australiana (e jovem) significa 'incrível' ou 'muito legal'."
        },
        {
          question: "A casa de Aiko tem piscina?",
          options: ["Sim, uma grande", "Sim, uma pequena", "Não, mas a praia é perto", "Não menciona"],
          correctIndex: 2,
          explanation: "Aiko diz 'Nah, but the beach is right there!' - não precisa de piscina com a praia tão perto!"
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 6,
    title: "Vocabulary: Rooms of the House & Adjectives",
    description: "Pratique o vocabulário de cômodos da casa e adjetivos descritivos da Lesson 6.",
    type: "vocabulary",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "matching",
      instruction: "Conecte cada cômodo/adjetivo à sua tradução correta:",
      pairs: [
        { expression: "living room", country: "sala de estar", explanation: "UK: lounge / sitting room" },
        { expression: "bedroom", country: "quarto", explanation: "bed (cama) + room (cômodo)" },
        { expression: "kitchen", country: "cozinha", explanation: "Onde preparamos as refeições" },
        { expression: "bathroom", country: "banheiro", explanation: "bath (banho) + room (cômodo)" },
        { expression: "dining room", country: "sala de jantar", explanation: "dining (jantar) + room" },
        { expression: "garage", country: "garagem", explanation: "Onde guardamos o carro" },
        { expression: "beautiful", country: "bonito/a, lindo/a", explanation: "Adjetivo para descrever algo muito bonito" },
        { expression: "comfortable", country: "confortável", explanation: "Adjetivo para descrever conforto" },
        { expression: "spacious", country: "espaçoso/a", explanation: "Adjetivo para descrever algo grande" },
        { expression: "cozy", country: "aconchegante", explanation: "Adjetivo para descrever algo quente e agradável" }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 6,
    title: "Grammar Practice: Where do you live? + How do you spell?",
    description: "Pratique perguntas com 'Where' e 'How' + vocabulário de endereço.",
    type: "grammar",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "fill_in_the_blank",
      instruction: "Complete as frases com a palavra correta (Where, How, What, live, spell, address):",
      sentences: [
        { text: "___ do you live?", answer: "Where", hint: "Pergunta sobre lugar" },
        { text: "I ___ in an apartment in Manhattan.", answer: "live", hint: "Verbo morar" },
        { text: "What's your ___?", answer: "address", hint: "Endereço" },
        { text: "___ do you spell your name?", answer: "How", hint: "Pergunta sobre modo/maneira" },
        { text: "___ your house like?", answer: "What's", hint: "Como é...?" },
        { text: "She ___ in a house near the beach.", answer: "lives", hint: "She → lives (3ª pessoa)" },
        { text: "Do you ___ in the city or in the country?", answer: "live", hint: "Verbo morar" },
        { text: "___ is your phone number?", answer: "What", hint: "Pergunta sobre informação" }
      ]
    })
  },

  // ============================================================
  // LESSON 7: At Julie's House - Routine, Time Expressions
  // ============================================================

  {
    bookId: 1,
    lessonNumber: 7,
    title: "🇺🇸 Lucas's Weekly Routine in New York",
    description: "Lucas conta sua rotina semanal em Nova York. Pratique expressões de tempo e dias da semana.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Lucas conta para Emily como é sua semana em Nova York. Ele trabalha, estuda e ainda encontra tempo para se divertir!",
      dialogue: [
        { speaker: "Emily", text: "What do you usually do during the week, Lucas?" },
        { speaker: "Lucas", text: "During the week, I go to school in the morning and work in the afternoon." },
        { speaker: "Emily", text: "And what do you do on the weekend?" },
        { speaker: "Lucas", text: "On Saturdays, I usually go out with my friends. We go to the movies or hang out at the park." },
        { speaker: "Emily", text: "What about Sundays?" },
        { speaker: "Lucas", text: "On Sundays, I prefer to stay home and play video games. Or I do my homework." },
        { speaker: "Emily", text: "Do you go out at night?" },
        { speaker: "Lucas", text: "On Friday nights, yeah! But on school nights, I stay home." }
      ],
      culturalNote: "Nos EUA, 'hang out' significa 'ficar/passar tempo junto' de forma casual. 'School nights' são as noites antes de dias de aula (domingo a quinta). Jovens americanos costumam sair nas 'Friday nights' (sextas à noite).",
      accentTip: "'Hang out' soa como 'hæng aut'. 'Usually' é pronunciado 'YOO-zhoo-uh-lee'. 'Weekend' tem ênfase na primeira sílaba: 'WEEK-end'.",
      questions: [
        {
          question: "O que Lucas faz durante a semana?",
          options: ["Só trabalha", "Escola de manhã e trabalho à tarde", "Fica em casa", "Viaja"],
          correctIndex: 1,
          explanation: "Lucas vai à escola de manhã e trabalha à tarde durante a semana."
        },
        {
          question: "O que Lucas faz nos sábados?",
          options: ["Fica em casa", "Trabalha", "Sai com amigos", "Estuda"],
          correctIndex: 2,
          explanation: "Nos sábados, Lucas sai com amigos - vão ao cinema ou ficam no parque."
        },
        {
          question: "O que 'hang out' significa?",
          options: ["Pendurar roupa", "Sair/ficar junto", "Exercitar-se", "Dormir"],
          correctIndex: 1,
          explanation: "'Hang out' é uma expressão americana que significa 'ficar junto/passar tempo' de forma casual."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 7,
    title: "🇬🇧 Emily's Weekly Routine in London",
    description: "Emily conta sua rotina semanal em Londres. Pratique expressões de tempo no estilo britânico.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Emily conta para Aiko como é sua semana em Londres. A rotina britânica tem suas particularidades!",
      dialogue: [
        { speaker: "Aiko", text: "What do you usually do during the week, Emily?" },
        { speaker: "Emily", text: "During the week, I go to school and then I usually go home and do my homework." },
        { speaker: "Aiko", text: "And on the weekend?" },
        { speaker: "Emily", text: "On Saturdays, I like to go to the theatre or visit a museum." },
        { speaker: "Aiko", text: "Lovely! What about Sundays?" },
        { speaker: "Emily", text: "On Sundays, I prefer to stay home and read a book. Sometimes I have a Sunday roast with my family." },
        { speaker: "Aiko", text: "What's a Sunday roast?" },
        { speaker: "Emily", text: "It's a traditional British meal - roast beef, potatoes, Yorkshire pudding and vegetables. It's brilliant!" }
      ],
      culturalNote: "O 'Sunday roast' é uma tradição britânica: carne assada com batatas, Yorkshire pudding e legumes, servido aos domingos em família. 'Theatre' é a grafia britânica (americano: 'theater'). 'Brilliant' é uma expressão muito britânica para 'incrível/ótimo'.",
      accentTip: "Emily pronuncia 'theatre' como 'THEE-uh-tuh' (sem R no final). 'Sunday' soa como 'SUN-dee'. 'Brilliant' é uma das palavras mais britânicas que existem!",
      questions: [
        {
          question: "O que Emily faz nos sábados?",
          options: ["Fica em casa", "Vai ao teatro ou museu", "Trabalha", "Faz esporte"],
          correctIndex: 1,
          explanation: "Emily gosta de ir ao teatro ou visitar museus nos sábados."
        },
        {
          question: "O que é um 'Sunday roast'?",
          options: ["Um café da manhã", "Uma refeição tradicional britânica de domingo", "Um churrasco", "Um sanduíche"],
          correctIndex: 1,
          explanation: "Sunday roast é uma refeição tradicional britânica servida aos domingos com carne assada, batatas e Yorkshire pudding."
        },
        {
          question: "Complete: 'I ___ to stay home and read a book on Sundays.'",
          options: ["want", "prefer", "go", "like"],
          correctIndex: 1,
          explanation: "Emily diz 'I prefer to stay home' - usar 'prefer' indica uma preferência pessoal."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 7,
    title: "🇦🇺 Aiko's Weekly Routine in Sydney",
    description: "Aiko conta sua rotina semanal em Sydney. Pratique expressões de tempo no estilo australiano.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Aiko",
      country: "Australia",
      flag: "🇦🇺",
      scenario: "Aiko conta para Lucas como é sua semana em Sydney. A vida australiana é muito ligada à praia e ao ar livre!",
      dialogue: [
        { speaker: "Lucas", text: "What do you usually do during the week, Aiko?" },
        { speaker: "Aiko", text: "During the week, I go to school in the morning. In the afternoon, I work at the café." },
        { speaker: "Lucas", text: "And on the weekend?" },
        { speaker: "Aiko", text: "On Saturdays, I usually go to the beach. I love surfing!" },
        { speaker: "Lucas", text: "Awesome! What about Sundays?" },
        { speaker: "Aiko", text: "On Sundays, we usually have a barbie with the family." },
        { speaker: "Lucas", text: "A barbie? Like the doll?" },
        { speaker: "Aiko", text: "Ha! No, mate! A barbie is a barbecue! It's an Aussie tradition. We go out to the park and have a barbie." }
      ],
      culturalNote: "'Barbie' na Austrália = churrasco (barbecue). É uma das tradições mais importantes! Muitos parques públicos na Austrália têm churrasqueiras gratuitas. 'Aussie' = australiano (pronuncia-se 'OZ-ee'). A Austrália tem uma cultura muito forte de vida ao ar livre por causa do clima.",
      accentTip: "'Barbie' soa como 'BAH-bee'. 'Aussie' é pronunciado 'OZ-ee' (não 'AW-see'). 'Beach' soa como 'beech' com o 'ea' longo.",
      questions: [
        {
          question: "O que Aiko faz nos sábados?",
          options: ["Trabalha", "Vai à praia surfar", "Fica em casa", "Vai ao cinema"],
          correctIndex: 1,
          explanation: "Nos sábados, Aiko vai à praia surfar - típico da vida em Sydney!"
        },
        {
          question: "O que é uma 'barbie' na Austrália?",
          options: ["Uma boneca", "Um churrasco", "Uma festa", "Um tipo de café"],
          correctIndex: 1,
          explanation: "'Barbie' na Austrália é a abreviação de 'barbecue' (churrasco). É uma tradição australiana!"
        },
        {
          question: "O que 'Aussie' significa?",
          options: ["Americano", "Britânico", "Australiano", "Asiático"],
          correctIndex: 2,
          explanation: "'Aussie' (pronuncia-se 'OZ-ee') é a forma informal de dizer 'australiano'."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 7,
    title: "Grammar Practice: Time Expressions & Days of the Week",
    description: "Pratique expressões de tempo (during the week, on the weekend) e dias da semana.",
    type: "grammar",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "fill_in_the_blank",
      instruction: "Complete as frases com a expressão de tempo correta (during, on, in, at):",
      sentences: [
        { text: "I go to school ___ the morning.", answer: "in", hint: "in the morning/afternoon/evening" },
        { text: "I usually go out ___ the weekend.", answer: "on", hint: "on the weekend / on weekends" },
        { text: "What do you do ___ the week?", answer: "during", hint: "during the week = durante a semana" },
        { text: "I like to go out ___ Friday nights.", answer: "on", hint: "on + dia da semana" },
        { text: "She stays home ___ night.", answer: "at", hint: "at night = à noite" },
        { text: "We have English class ___ Tuesdays and Thursdays.", answer: "on", hint: "on + dias da semana" },
        { text: "I prefer to stay home ___ the evening.", answer: "in", hint: "in the evening = à noite (início)" },
        { text: "He works ___ Monday to Friday.", answer: "from", hint: "from Monday to Friday = de segunda a sexta" }
      ]
    })
  },

  // ============================================================
  // LESSON 8: Communicative - Unit 2 Review (Lessons 6-7)
  // ============================================================

  {
    bookId: 1,
    lessonNumber: 8,
    title: "🌍 Where Do They Live? - Comparing Homes Around the World",
    description: "Compare como Lucas, Emily e Aiko vivem em seus países. Uma história que reúne Lessons 6-7.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "story_reading",
      title: "Where Do They Live? - Homes Around the World",
      characters: [
        { name: "Lucas", country: "USA", flag: "🇺🇸", city: "New York" },
        { name: "Emily", country: "UK", flag: "🇬🇧", city: "London" },
        { name: "Aiko", country: "Australia", flag: "🇦🇺", city: "Sydney" }
      ],
      story: [
        { speaker: "narrator", text: "Os três amigos fazem uma videochamada para mostrar suas casas e contar sobre suas rotinas." },
        { speaker: "Lucas", text: "Hey guys! Let me show you my apartment. It's small but it's in a great neighborhood in Manhattan. 🇺🇸" },
        { speaker: "Emily", text: "How lovely! I live in a terraced house in Notting Hill. It has three bedrooms and a small garden at the back. 🇬🇧" },
        { speaker: "Aiko", text: "Nice! I live in a house near Bondi Beach. It has a big backyard. No pool, but the beach is right there! 🇦🇺" },
        { speaker: "narrator", text: "Eles comparam suas rotinas semanais..." },
        { speaker: "Lucas", text: "During the week, I go to school in the morning and work in the afternoon. On Friday nights, I hang out with my friends." },
        { speaker: "Emily", text: "I go to school during the week too. On Saturdays, I like to go to the theatre. On Sundays, we have a Sunday roast." },
        { speaker: "Aiko", text: "I go to school and work at the café during the week. On Saturdays, I go surfing! On Sundays, we have a barbie in the park." },
        { speaker: "Lucas", text: "A barbie? You mean a barbecue?" },
        { speaker: "Aiko", text: "Yeah, mate! That's what we call it here!" },
        { speaker: "Emily", text: "That's brilliant! We should all visit each other someday!" },
        { speaker: "Lucas", text: "For sure! See you guys later!" },
        { speaker: "Aiko", text: "See ya, mates!" }
      ],
      comprehensionQuestions: [
        {
          question: "Quem mora num apartamento?",
          options: ["Emily", "Aiko", "Lucas", "Todos"],
          correctIndex: 2
        },
        {
          question: "Quem tem um jardim nos fundos?",
          options: ["Lucas", "Emily", "Aiko", "Ninguém"],
          correctIndex: 1
        },
        {
          question: "O que Aiko faz nos sábados?",
          options: ["Vai ao teatro", "Sai com amigos", "Vai surfar", "Trabalha"],
          correctIndex: 2
        },
        {
          question: "O que é um 'Sunday roast'?",
          options: ["Um churrasco australiano", "Uma refeição tradicional britânica", "Um café da manhã americano", "Um almoço japonês"],
          correctIndex: 1
        }
      ],
      expressionComparison: [
        { meaning: "Casa/Moradia", usa: "apartment, house, condo", uk: "flat, terraced house, semi-detached", australia: "house, unit, granny flat" },
        { meaning: "Sala de estar", usa: "living room", uk: "lounge, sitting room", australia: "living room, lounge room" },
        { meaning: "Quintal", usa: "backyard, yard", uk: "garden", australia: "backyard" },
        { meaning: "Fim de semana", usa: "hang out, go to the movies", uk: "go to the theatre, have a roast", australia: "go surfing, have a barbie" }
      ]
    })
  },

  // ============================================================
  // LESSON 9: Family Photos - Family, Age, Possessive 's
  // ============================================================

  {
    bookId: 1,
    lessonNumber: 9,
    title: "🇺🇸 Lucas's Family in New York",
    description: "Lucas mostra fotos da família. Pratique membros da família, idade e possessivo com 's.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Lucas mostra fotos da família no celular para seus amigos. A família dele é brasileira-americana!",
      dialogue: [
        { speaker: "Emily", text: "Lucas, do you want to show us some pictures of your family?" },
        { speaker: "Lucas", text: "Sure! Here they are. This is a picture of my parents." },
        { speaker: "Aiko", text: "Cool! How old is your dad?" },
        { speaker: "Lucas", text: "He's forty-five. And my mom is forty-two." },
        { speaker: "Emily", text: "And who's that?" },
        { speaker: "Lucas", text: "That's my little sister, Sofia. She's seven." },
        { speaker: "Aiko", text: "She's cute! And who's that man?" },
        { speaker: "Lucas", text: "That's my uncle Carlos, my dad's brother. He's a doctor." },
        { speaker: "Emily", text: "What does your dad do?" },
        { speaker: "Lucas", text: "He's a chef. He works at a Brazilian restaurant in Manhattan." }
      ],
      culturalNote: "Nos EUA, é comum famílias de imigrantes manterem tradições do país de origem. A família de Lucas é brasileira-americana. 'Little sister' = irmã mais nova. 'Uncle' = tio. Nos EUA, é normal perguntar 'What does he/she do?' para saber a profissão.",
      accentTip: "'Forty-five' é pronunciado 'FOR-dee-faiv' (o T vira D entre vogais no inglês americano). 'Picture' soa como 'PIK-cher'. 'Restaurant' soa como 'RES-tront'.",
      questions: [
        {
          question: "Quantos anos tem o pai de Lucas?",
          options: ["42", "45", "47", "50"],
          correctIndex: 1,
          explanation: "O pai de Lucas tem 45 anos (forty-five)."
        },
        {
          question: "Quem é o tio Carlos?",
          options: ["Irmão da mãe", "Irmão do pai", "Primo", "Avô"],
          correctIndex: 1,
          explanation: "Uncle Carlos é 'my dad's brother' - irmão do pai de Lucas."
        },
        {
          question: "O que o pai de Lucas faz?",
          options: ["É médico", "É professor", "É chef", "É engenheiro"],
          correctIndex: 2,
          explanation: "O pai de Lucas é chef e trabalha num restaurante brasileiro em Manhattan."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 9,
    title: "🇬🇧 Emily's Family in London",
    description: "Emily mostra fotos da família britânica. Pratique membros da família e possessivo 's.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Emily mostra fotos da família para os amigos. A família britânica de Emily tem tradições bem inglesas!",
      dialogue: [
        { speaker: "Lucas", text: "Emily, show us your family!" },
        { speaker: "Emily", text: "Right! Here they are. This is my mum and dad." },
        { speaker: "Aiko", text: "How old are they?" },
        { speaker: "Emily", text: "My mum is forty-eight and my dad is fifty-one." },
        { speaker: "Lucas", text: "And who's that girl?" },
        { speaker: "Emily", text: "That's my elder sister, Charlotte. She's twenty." },
        { speaker: "Aiko", text: "And that boy?" },
        { speaker: "Emily", text: "That's my cousin, William. He's my aunt Margaret's son." },
        { speaker: "Lucas", text: "What does your mum do?" },
        { speaker: "Emily", text: "She's a teacher. And my dad is a solicitor." }
      ],
      culturalNote: "No inglês britânico, 'mum' = mãe (americano: 'mom'). 'Elder sister' = irmã mais velha (mais formal que 'older sister'). 'Solicitor' é um tipo de advogado no Reino Unido (diferente de 'lawyer' americano). Nomes como Charlotte e William são muito tradicionais britânicos.",
      accentTip: "'Mum' é pronunciado 'mam' no inglês britânico (não 'mom' como no americano). 'Solicitor' soa como 'suh-LIS-ih-tuh'. 'Aunt' no britânico soa como 'ahnt' (no americano soa como 'ænt').",
      questions: [
        {
          question: "Qual a diferença entre 'mum' e 'mom'?",
          options: ["Não há diferença", "Mum = britânico, Mom = americano", "Mum = formal, Mom = informal", "Mom = britânico, Mum = americano"],
          correctIndex: 1,
          explanation: "'Mum' é a forma britânica e 'Mom' é a forma americana de dizer 'mãe'."
        },
        {
          question: "Quem é William?",
          options: ["Irmão de Emily", "Primo de Emily", "Tio de Emily", "Pai de Emily"],
          correctIndex: 1,
          explanation: "William é primo de Emily - 'my aunt Margaret's son' (filho da tia Margaret)."
        },
        {
          question: "O que o pai de Emily faz?",
          options: ["Professor", "Médico", "Solicitor (advogado)", "Chef"],
          correctIndex: 2,
          explanation: "O pai de Emily é solicitor - um tipo de advogado no sistema jurídico britânico."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 9,
    title: "Vocabulary: Family Members & Numbers",
    description: "Pratique vocabulário de membros da família e números de 11 a 99.",
    type: "vocabulary",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "matching",
      instruction: "Conecte cada membro da família à tradução correta:",
      pairs: [
        { expression: "father / dad", country: "pai", explanation: "Dad é informal, Father é formal" },
        { expression: "mother / mum / mom", country: "mãe", explanation: "Mum (UK) / Mom (USA) são informais" },
        { expression: "brother", country: "irmão", explanation: "Irmão" },
        { expression: "sister", country: "irmã", explanation: "Irmã" },
        { expression: "uncle", country: "tio", explanation: "Irmão do pai ou da mãe" },
        { expression: "aunt", country: "tia", explanation: "UK: 'ahnt' / USA: 'ænt'" },
        { expression: "cousin", country: "primo/prima", explanation: "Filho/a do tio/tia" },
        { expression: "nephew", country: "sobrinho", explanation: "Filho do irmão/irmã" },
        { expression: "niece", country: "sobrinha", explanation: "Filha do irmão/irmã" },
        { expression: "whose", country: "de quem", explanation: "Whose is this? = De quem é isso?" }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 9,
    title: "Grammar Practice: Possessive 's & Do/Does",
    description: "Pratique o possessivo com 's e as perguntas com Do/Does.",
    type: "grammar",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "fill_in_the_blank",
      instruction: "Complete as frases com a forma correta (possessivo 's, Do, Does, Whose):",
      sentences: [
        { text: "This is Julie___ brother.", answer: "'s", hint: "Possessivo: Julie's = de Julie" },
        { text: "___ he live in an apartment?", answer: "Does", hint: "He/She/It → Does" },
        { text: "___ is this book?", answer: "Whose", hint: "De quem? → Whose" },
        { text: "That's my father___ car.", answer: "'s", hint: "Possessivo: father's = do pai" },
        { text: "___ your parents live in the city?", answer: "Do", hint: "Your parents (they) → Do" },
        { text: "How old ___ your sister?", answer: "is", hint: "How old is...? = Quantos anos tem...?" },
        { text: "The children___ toys are in the box.", answer: "'s", hint: "Plural irregular: children's" },
        { text: "___ she work as a teacher?", answer: "Does", hint: "She → Does" }
      ]
    })
  },

  // ============================================================
  // LESSON 10: After Studying for the Test - Furniture, Clothes, There is/are
  // ============================================================

  {
    bookId: 1,
    lessonNumber: 10,
    title: "🇺🇸 Lucas Can't Find His Sneakers",
    description: "Lucas não encontra seus tênis em Nova York. Pratique There is/are, preposições de lugar e roupas.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Lucas está se arrumando para sair com amigos mas não encontra seus tênis. Sua mãe ajuda a procurar pelo apartamento.",
      dialogue: [
        { speaker: "Lucas", text: "Mom, where are my sneakers?" },
        { speaker: "Mom", text: "Are they under your bed?" },
        { speaker: "Lucas", text: "No, they're not there." },
        { speaker: "Mom", text: "How about next to the dresser?" },
        { speaker: "Lucas", text: "No... Wait, is there a box in the closet?" },
        { speaker: "Mom", text: "Yes, there is. Check inside." },
        { speaker: "Lucas", text: "Found them! They're in the box. Thanks, Mom!" },
        { speaker: "Mom", text: "You need to organize your room, Lucas!" },
        { speaker: "Lucas", text: "I know, I know... And where are my jeans?" },
        { speaker: "Mom", text: "They're on the chair in the living room!" }
      ],
      culturalNote: "Nos EUA, 'sneakers' = tênis (no UK é 'trainers'). 'Closet' é o armário embutido americano (no UK é 'wardrobe'). 'Dresser' = cômoda. 'Jeans' é sempre plural em inglês (a pair of jeans).",
      accentTip: "'Sneakers' é pronunciado 'SNEE-kerz'. 'Closet' soa como 'KLAH-zit'. 'Dresser' soa como 'DREH-ser'.",
      questions: [
        {
          question: "Onde estavam os tênis de Lucas?",
          options: ["Debaixo da cama", "No armário, dentro de uma caixa", "Na sala", "Na cozinha"],
          correctIndex: 1,
          explanation: "Os tênis estavam dentro de uma caixa no closet (armário)."
        },
        {
          question: "Onde estão as calças jeans de Lucas?",
          options: ["No quarto", "Na cadeira da sala", "No armário", "Na lavanderia"],
          correctIndex: 1,
          explanation: "As jeans estão na cadeira da sala (on the chair in the living room)."
        },
        {
          question: "Complete: 'Is ___ a box in the closet?' 'Yes, ___ is.'",
          options: ["there / there", "it / it", "this / this", "that / that"],
          correctIndex: 0,
          explanation: "'Is there...?' / 'Yes, there is.' - estrutura de There is/There are para perguntar se algo existe."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 10,
    title: "🇬🇧 Emily's Bedroom in London",
    description: "Emily descreve seu quarto em Londres. Pratique There is/are, preposições e vocabulário de móveis.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Emily mostra seu quarto para Aiko por videochamada. O quarto britânico tem alguns itens diferentes!",
      dialogue: [
        { speaker: "Aiko", text: "Show me your bedroom, Emily!" },
        { speaker: "Emily", text: "Right! There's a bed next to the window. And there's a wardrobe beside the door." },
        { speaker: "Aiko", text: "Is there a desk?" },
        { speaker: "Emily", text: "Yes, there is. It's in front of the window. And there's a lamp on the desk." },
        { speaker: "Aiko", text: "How many drawers are there?" },
        { speaker: "Emily", text: "There are three drawers in the dresser. My clothes are in the top drawer." },
        { speaker: "Aiko", text: "Where are your books?" },
        { speaker: "Emily", text: "They're on the shelf, on the wall. And there are some pictures between the shelf and the window." },
        { speaker: "Aiko", text: "It looks lovely!" },
        { speaker: "Emily", text: "Thank you! It's quite cosy." }
      ],
      culturalNote: "No inglês britânico, 'wardrobe' = guarda-roupa (americano: 'closet'). 'Cosy' é a grafia britânica de 'cozy' (aconchegante). 'Shelf' = prateleira. 'Drawer' = gaveta. 'How many' = quantos/as (para perguntar quantidade).",
      accentTip: "'Wardrobe' é pronunciado 'WOR-drohb'. 'Drawer' soa como 'DROH-er' no britânico. 'Cosy' soa como 'KOH-zee'.",
      questions: [
        {
          question: "O que 'wardrobe' significa?",
          options: ["Mesa", "Guarda-roupa", "Cômoda", "Prateleira"],
          correctIndex: 1,
          explanation: "'Wardrobe' é a palavra britânica para guarda-roupa. Nos EUA é 'closet'."
        },
        {
          question: "Onde está a mesa de Emily?",
          options: ["Ao lado da cama", "Em frente à janela", "Atrás da porta", "No meio do quarto"],
          correctIndex: 1,
          explanation: "A mesa está 'in front of the window' - em frente à janela."
        },
        {
          question: "Quantas gavetas tem a cômoda?",
          options: ["Uma", "Duas", "Três", "Quatro"],
          correctIndex: 2,
          explanation: "Emily diz 'There are three drawers in the dresser' - três gavetas."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 10,
    title: "Vocabulary: Clothes, Furniture & Prepositions",
    description: "Pratique vocabulário de roupas, móveis e preposições de lugar da Lesson 10.",
    type: "vocabulary",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "matching",
      instruction: "Conecte cada palavra à sua tradução correta:",
      pairs: [
        { expression: "sneakers (USA) / trainers (UK)", country: "tênis", explanation: "Calçado esportivo" },
        { expression: "pants (USA) / trousers (UK)", country: "calça", explanation: "Cuidado: 'pants' no UK = cueca/calcinha!" },
        { expression: "closet (USA) / wardrobe (UK)", country: "armário/guarda-roupa", explanation: "Onde guardamos roupas" },
        { expression: "dresser", country: "cômoda", explanation: "Móvel com gavetas" },
        { expression: "drawer", country: "gaveta", explanation: "Parte da cômoda que abre e fecha" },
        { expression: "in / inside", country: "dentro", explanation: "in the box = dentro da caixa" },
        { expression: "on", country: "em cima de, sobre", explanation: "on the table = em cima da mesa" },
        { expression: "under", country: "embaixo de", explanation: "under the bed = embaixo da cama" },
        { expression: "next to / beside", country: "ao lado de", explanation: "next to the door = ao lado da porta" },
        { expression: "in front of", country: "na frente de", explanation: "in front of the window = na frente da janela" },
        { expression: "behind", country: "atrás de", explanation: "behind the chair = atrás da cadeira" },
        { expression: "between", country: "entre", explanation: "between the shelf and the window = entre a prateleira e a janela" }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 10,
    title: "Grammar Practice: There is / There are + Prepositions",
    description: "Pratique There is/There are com preposições de lugar.",
    type: "grammar",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "fill_in_the_blank",
      instruction: "Complete as frases com There is, There are, Is there, Are there + preposição correta:",
      sentences: [
        { text: "___ a lamp on the desk.", answer: "There is", hint: "Singular: There is" },
        { text: "___ three bedrooms in my house.", answer: "There are", hint: "Plural: There are" },
        { text: "___ a box ___ your bed?", answer: "Is there / under", hint: "Pergunta singular + embaixo" },
        { text: "My shoes are ___ the closet.", answer: "in", hint: "Dentro do armário" },
        { text: "The picture is ___ the wall.", answer: "on", hint: "Na parede (superfície)" },
        { text: "___ any books ___ the shelf?", answer: "Are there / on", hint: "Pergunta plural + em cima" },
        { text: "The chair is ___ the desk.", answer: "in front of", hint: "Na frente da mesa" },
        { text: "___ a bank near the mall? Yes, ___ is.", answer: "Is there / there", hint: "Pergunta + resposta curta" }
      ]
    })
  }

];

console.log(`Total de exercícios Unit 2: ${book1Unit2Exercises.length}`);
console.log(`Lesson 6: ${book1Unit2Exercises.filter(e => e.lessonNumber === 6).length} exercícios`);
console.log(`Lesson 7: ${book1Unit2Exercises.filter(e => e.lessonNumber === 7).length} exercícios`);
console.log(`Lesson 8: ${book1Unit2Exercises.filter(e => e.lessonNumber === 8).length} exercícios`);
console.log(`Lesson 9: ${book1Unit2Exercises.filter(e => e.lessonNumber === 9).length} exercícios`);
console.log(`Lesson 10: ${book1Unit2Exercises.filter(e => e.lessonNumber === 10).length} exercícios`);
