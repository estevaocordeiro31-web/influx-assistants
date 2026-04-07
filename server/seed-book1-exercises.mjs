/**
 * Seed Script: Exercícios Extras do Book 1 com Contexto dos Personagens
 * Lucas (USA), Emily (UK), Aiko (Australia)
 * 
 * Cada exercício é um JSON stringificado no campo "content"
 * Tipos: vocabulary, grammar, communicative, reading, writing
 */

// Exercícios organizados por lição
export const book1Exercises = [

  // ============================================================
  // LESSON 1: First Day of Class - Greetings & Introductions
  // ============================================================

  {
    bookId: 1,
    lessonNumber: 1,
    title: "🇺🇸 Lucas's First Day at School in New York",
    description: "Lucas chega na escola em Nova York e se apresenta. Pratique saudações no estilo americano.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Lucas acaba de chegar na Lincoln High School em Nova York. É o primeiro dia de aula e ele precisa se apresentar para o professor e os colegas.",
      dialogue: [
        { speaker: "Teacher", text: "Good morning, everyone! Welcome to Lincoln High School!" },
        { speaker: "Lucas", text: "Hey! Good morning!" },
        { speaker: "Teacher", text: "What's your name?" },
        { speaker: "Lucas", text: "I'm Lucas. Lucas Santos." },
        { speaker: "Teacher", text: "Nice to meet you, Lucas. Where are you from?" },
        { speaker: "Lucas", text: "I'm from Brazil, but I live here in New York now." },
        { speaker: "Teacher", text: "Great! Welcome to the class!" },
        { speaker: "Lucas", text: "Thanks! Nice to meet you too!" }
      ],
      culturalNote: "Nos EUA, as pessoas costumam dizer 'Hey!' ou 'Hi!' de forma bem casual. É comum usar o primeiro nome logo de cara, mesmo com professores em escolas mais informais.",
      accentTip: "Lucas fala com sotaque americano: 'morning' soa como 'mornin', e o 'r' é bem pronunciado em 'York'.",
      questions: [
        {
          question: "Como Lucas se apresenta?",
          options: ["I'm Lucas", "My name's Lucas Santos", "I am Lucas Santos", "Hey, Lucas here"],
          correctIndex: 0,
          explanation: "Nos EUA, é muito comum usar 'I'm + nome' de forma direta e casual."
        },
        {
          question: "Qual saudação Lucas usa?",
          options: ["Good morning", "Hello there", "How do you do?", "Hey! Good morning!"],
          correctIndex: 3,
          explanation: "'Hey!' é uma saudação muito americana e casual, seguida de 'Good morning' para ser educado."
        },
        {
          question: "O que o professor diz para dar boas-vindas?",
          options: ["Welcome to the class!", "Pleased to meet you!", "How are you?", "Take a seat!"],
          correctIndex: 0,
          explanation: "'Welcome to the class!' é a forma mais comum de dar boas-vindas em escolas americanas."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 1,
    title: "🇬🇧 Emily's First Day at School in London",
    description: "Emily chega na escola em Londres. Pratique saudações no estilo britânico, mais formal e educado.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Emily chega na Westminster Academy em Londres. É o primeiro dia e ela se apresenta de forma educada ao professor e aos colegas.",
      dialogue: [
        { speaker: "Teacher", text: "Good morning, class. Welcome to Westminster Academy." },
        { speaker: "Emily", text: "Good morning, sir." },
        { speaker: "Teacher", text: "And what's your name, please?" },
        { speaker: "Emily", text: "My name's Emily. Emily Clarke." },
        { speaker: "Teacher", text: "Pleased to meet you, Emily." },
        { speaker: "Emily", text: "Pleased to meet you too, sir." },
        { speaker: "Teacher", text: "Lovely. Please take a seat." },
        { speaker: "Emily", text: "Thank you very much." }
      ],
      culturalNote: "No Reino Unido, as escolas são mais formais. Os alunos chamam o professor de 'sir' (homem) ou 'miss' (mulher). 'Pleased to meet you' é mais formal que 'Nice to meet you'.",
      accentTip: "Emily fala com sotaque britânico: 'morning' soa como 'moh-ning' (sem o 'r' forte), e 'please' tem um 'ee' mais longo.",
      questions: [
        {
          question: "Como Emily se apresenta?",
          options: ["I'm Emily", "My name's Emily", "Hey, I'm Emily", "Emily here"],
          correctIndex: 1,
          explanation: "No Reino Unido, 'My name's...' é mais formal e educado que 'I'm...'"
        },
        {
          question: "Como Emily chama o professor?",
          options: ["Teacher", "Mr.", "Sir", "Mate"],
          correctIndex: 2,
          explanation: "No Reino Unido, é muito comum chamar o professor de 'sir' (homem) ou 'miss' (mulher)."
        },
        {
          question: "Qual expressão Emily usa para se despedir?",
          options: ["See ya!", "Thank you very much", "Bye!", "Cheers!"],
          correctIndex: 1,
          explanation: "'Thank you very much' é uma resposta educada e formal, típica do estilo britânico."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 1,
    title: "🇦🇺 Aiko's First Day at School in Sydney",
    description: "Aiko chega na escola em Sydney. Pratique saudações no estilo australiano, descontraído e amigável.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Aiko",
      country: "Australia",
      flag: "🇦🇺",
      scenario: "Aiko chega na Bondi Beach High School em Sydney. É o primeiro dia e ela se apresenta de forma descontraída ao professor e aos colegas.",
      dialogue: [
        { speaker: "Teacher", text: "G'day, everyone! Welcome to Bondi Beach High!" },
        { speaker: "Aiko", text: "G'day!" },
        { speaker: "Teacher", text: "What's your name?" },
        { speaker: "Aiko", text: "I'm Aiko. Nice to meet you!" },
        { speaker: "Teacher", text: "Aiko! Great name. Where are you from?" },
        { speaker: "Aiko", text: "I'm from Japan, but I live in Sydney now." },
        { speaker: "Teacher", text: "Awesome! Welcome to the class, mate!" },
        { speaker: "Aiko", text: "Thanks! No worries!" }
      ],
      culturalNote: "Na Austrália, 'G'day' (Good day) é a saudação mais típica. 'Mate' é usado para qualquer pessoa, mesmo desconhecidos. 'No worries' significa 'de nada' ou 'sem problemas'.",
      accentTip: "Na Austrália, 'day' soa como 'die', 'mate' soa como 'mite', e as vogais são mais abertas. O ritmo é mais lento e relaxado.",
      questions: [
        {
          question: "Qual saudação típica australiana o professor usa?",
          options: ["Hello!", "Good morning!", "G'day!", "Hey there!"],
          correctIndex: 2,
          explanation: "'G'day' (abreviação de 'Good day') é a saudação mais típica da Austrália."
        },
        {
          question: "O que 'No worries' significa?",
          options: ["Estou preocupado", "De nada / Sem problemas", "Não sei", "Tchau"],
          correctIndex: 1,
          explanation: "'No worries' é uma expressão australiana que significa 'de nada' ou 'sem problemas'. É usada o tempo todo!"
        },
        {
          question: "Como o professor chama Aiko de forma amigável?",
          options: ["Buddy", "Mate", "Friend", "Pal"],
          correctIndex: 1,
          explanation: "'Mate' é a palavra mais usada na Austrália para se referir a qualquer pessoa de forma amigável."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 1,
    title: "Vocabulary Match: Greetings Around the World",
    description: "Conecte as saudações com o país correto. Pratique o vocabulário da Lesson 1.",
    type: "vocabulary",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "matching",
      instruction: "Conecte cada expressão ao país onde ela é mais usada:",
      pairs: [
        { expression: "Hey! What's up?", country: "🇺🇸 USA", explanation: "Saudação casual americana" },
        { expression: "How do you do?", country: "🇬🇧 UK", explanation: "Saudação formal britânica" },
        { expression: "G'day, mate!", country: "🇦🇺 Australia", explanation: "Saudação típica australiana" },
        { expression: "Nice to meet ya!", country: "🇺🇸 USA", explanation: "'Ya' é forma casual de 'you' nos EUA" },
        { expression: "Pleased to meet you", country: "🇬🇧 UK", explanation: "Forma educada britânica" },
        { expression: "No worries!", country: "🇦🇺 Australia", explanation: "Expressão australiana para 'de nada'" }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 1,
    title: "Grammar Practice: Verb to Be - Introductions",
    description: "Complete as frases usando I'm, You're, He's, She's corretamente.",
    type: "grammar",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "fill_in_the_blank",
      instruction: "Complete as frases com a forma correta do Verb to Be (I'm, You're, He's, She's):",
      sentences: [
        { text: "___ Lucas. I'm from New York.", answer: "I'm", hint: "Lucas falando de si mesmo" },
        { text: "___ Emily. She's from London.", answer: "She's", hint: "Falando sobre Emily (ela)" },
        { text: "___ Aiko. Nice to meet you!", answer: "I'm", hint: "Aiko se apresentando" },
        { text: "___ the new student? Welcome!", answer: "You're", hint: "Professor falando com o aluno (você)" },
        { text: "___ Mr. Richard. He's the teacher.", answer: "He's", hint: "Falando sobre o professor (ele)" },
        { text: "My name's Julie. ___ from Brazil.", answer: "I'm", hint: "Julie falando de si mesma" }
      ]
    })
  },

  // ============================================================
  // LESSON 2: A Few Days Later - Professions & Jobs
  // ============================================================

  {
    bookId: 1,
    lessonNumber: 2,
    title: "🇺🇸 Lucas Works Two Jobs in New York",
    description: "Lucas trabalha em dois empregos em Nova York. Descubra como é o mercado de trabalho para jovens nos EUA.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Lucas conversa com Mike sobre seus dois empregos em Nova York. Nos EUA, é muito comum jovens trabalharem em mais de um emprego (side hustle).",
      dialogue: [
        { speaker: "Mike", text: "Hey Lucas, what do you do?" },
        { speaker: "Lucas", text: "I work as a sales clerk at a department store." },
        { speaker: "Mike", text: "Cool! Full-time?" },
        { speaker: "Lucas", text: "No, part-time. I also work at a fast food restaurant." },
        { speaker: "Mike", text: "Two jobs? That's a lot!" },
        { speaker: "Lucas", text: "Yeah, it's my side hustle. I work part-time in both." },
        { speaker: "Mike", text: "How much do you make?" },
        { speaker: "Lucas", text: "About $15 an hour at the store and $12 at the restaurant." }
      ],
      culturalNote: "Nos EUA, o salário mínimo federal é $7.25/hora, mas em Nova York é $16/hora (2024). Muitos jovens trabalham em dois empregos ('side hustle') para pagar as contas. Não existe sistema público de saúde - o seguro de saúde geralmente vem do empregador.",
      accentTip: "Lucas usa gírias americanas: 'Cool!' (legal), 'side hustle' (bico/trabalho extra), 'That's a lot!' (é muito!). O 'r' é bem pronunciado em 'work' e 'store'.",
      questions: [
        {
          question: "Quantos empregos Lucas tem?",
          options: ["Um", "Dois", "Três", "Nenhum"],
          correctIndex: 1,
          explanation: "Lucas trabalha em dois empregos: vendedor numa loja de departamento e num restaurante fast food."
        },
        {
          question: "O que significa 'side hustle'?",
          options: ["Emprego principal", "Trabalho extra / bico", "Férias", "Promoção"],
          correctIndex: 1,
          explanation: "'Side hustle' é uma expressão americana para trabalho extra ou bico."
        },
        {
          question: "Lucas trabalha full-time ou part-time?",
          options: ["Full-time nos dois", "Part-time nos dois", "Full-time em um e part-time no outro", "Não trabalha"],
          correctIndex: 1,
          explanation: "Lucas trabalha part-time (meio período) nos dois empregos."
        },
        {
          question: "Complete: 'I work ___ a sales clerk.'",
          options: ["like", "as", "for", "in"],
          correctIndex: 1,
          explanation: "A estrutura correta é 'I work AS a + profissão'. Não confunda com 'I work FOR a company' ou 'I work IN a store'."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 2,
    title: "🇬🇧 Emily's Placement in London",
    description: "Emily faz estágio em Londres. Descubra como funciona o mercado de trabalho para jovens no Reino Unido.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Emily conversa com Kelly sobre seu estágio (placement) em Londres. No Reino Unido, estágios são muito valorizados e há um sistema de saúde público (NHS).",
      dialogue: [
        { speaker: "Kelly", text: "Emily, what do you do?" },
        { speaker: "Emily", text: "I'm a student, but I also work part-time." },
        { speaker: "Kelly", text: "Oh, really? Where do you work?" },
        { speaker: "Emily", text: "I work as a receptionist at a doctor's office." },
        { speaker: "Kelly", text: "That's brilliant! Do you like it?" },
        { speaker: "Emily", text: "Yes, it's quite nice. The pay is £10.42 an hour." },
        { speaker: "Kelly", text: "Not bad! And you get NHS, right?" },
        { speaker: "Emily", text: "Of course! Everyone gets NHS in the UK. It's free." }
      ],
      culturalNote: "No Reino Unido, o salário mínimo para maiores de 21 anos é £10.42/hora (2024). O NHS (National Health Service) é o sistema de saúde público gratuito. Estágios ('placements') são muito comuns e valorizados. A cultura de trabalho é mais formal que nos EUA.",
      accentTip: "Emily usa expressões britânicas: 'That's brilliant!' (Que legal!), 'Quite nice' (bastante bom), 'Not bad!' (nada mal). O 'r' no final de palavras como 'doctor' quase não é pronunciado.",
      questions: [
        {
          question: "Onde Emily trabalha?",
          options: ["Num hospital", "Num consultório médico", "Numa escola", "Num restaurante"],
          correctIndex: 1,
          explanation: "Emily trabalha como recepcionista num consultório médico (doctor's office)."
        },
        {
          question: "O que é o NHS?",
          options: ["Um banco", "Um sistema de saúde público gratuito", "Uma escola", "Um restaurante"],
          correctIndex: 1,
          explanation: "NHS (National Health Service) é o sistema de saúde público e gratuito do Reino Unido."
        },
        {
          question: "O que 'That's brilliant!' significa?",
          options: ["Que horror!", "Que legal! / Incrível!", "Que chato!", "Que estranho!"],
          correctIndex: 1,
          explanation: "'Brilliant' no Reino Unido é usado como 'legal' ou 'incrível'. É uma expressão muito britânica."
        },
        {
          question: "Complete: 'I work ___ a receptionist ___ a doctor's office.'",
          options: ["as / at", "like / in", "for / at", "as / in"],
          correctIndex: 0,
          explanation: "'I work AS a + profissão' e 'AT a + local específico'. 'I work as a receptionist at a doctor's office.'"
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 2,
    title: "🇦🇺 Aiko Works at a Café in Sydney",
    description: "Aiko trabalha num café em Sydney. Descubra como funciona o mercado de trabalho na Austrália.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Aiko",
      country: "Australia",
      flag: "🇦🇺",
      scenario: "Aiko conversa com Peter sobre seu trabalho num café em Sydney. A Austrália tem o salário mínimo mais alto do mundo e um sistema de aposentadoria obrigatório.",
      dialogue: [
        { speaker: "Peter", text: "Hey Aiko, what do you do?" },
        { speaker: "Aiko", text: "I work as a waitress at a café near Bondi Beach." },
        { speaker: "Peter", text: "Awesome! Do you like it?" },
        { speaker: "Aiko", text: "Yeah, it's great! The pay is really good here." },
        { speaker: "Peter", text: "How much do you make?" },
        { speaker: "Aiko", text: "About $23 an hour. Australia has the highest minimum wage!" },
        { speaker: "Peter", text: "No way! That's amazing!" },
        { speaker: "Aiko", text: "Yeah, and we also get superannuation. It's like a retirement fund." }
      ],
      culturalNote: "A Austrália tem o salário mínimo mais alto do mundo: AUD$23.23/hora (2024). 'Superannuation' (super) é o sistema de aposentadoria obrigatório onde o empregador deposita ~11% do salário. A cultura de trabalho é relaxada e equilibrada (work-life balance é muito valorizado).",
      accentTip: "Aiko usa expressões australianas: 'Awesome!' (incrível), 'No way!' (não acredito!). Na Austrália, 'café' é pronunciado 'caf-AY' e 'mate' soa como 'mite'.",
      questions: [
        {
          question: "Onde Aiko trabalha?",
          options: ["Num restaurante", "Num café perto de Bondi Beach", "Numa escola", "Num hospital"],
          correctIndex: 1,
          explanation: "Aiko trabalha como garçonete num café perto de Bondi Beach em Sydney."
        },
        {
          question: "Quanto Aiko ganha por hora?",
          options: ["$7.25", "$10.42", "$15", "$23"],
          correctIndex: 3,
          explanation: "O salário mínimo na Austrália é AUD$23.23/hora, o mais alto do mundo!"
        },
        {
          question: "O que é 'superannuation'?",
          options: ["Um tipo de comida", "Um fundo de aposentadoria obrigatório", "Um seguro de saúde", "Um bônus salarial"],
          correctIndex: 1,
          explanation: "'Superannuation' (ou 'super') é o sistema de aposentadoria obrigatório da Austrália. O empregador deposita ~11% do salário."
        },
        {
          question: "Complete: 'I work ___ a waitress ___ a café.'",
          options: ["as / at", "like / in", "for / at", "as / in"],
          correctIndex: 0,
          explanation: "'I work AS a + profissão' e 'AT a + local'. Mesma estrutura da Lesson 2!"
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 2,
    title: "Grammar Practice: Simple Present - Jobs",
    description: "Pratique o Simple Present descrevendo profissões e locais de trabalho.",
    type: "grammar",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "fill_in_the_blank",
      instruction: "Complete as frases com a forma correta do verbo e a preposição adequada:",
      sentences: [
        { text: "Lucas ___ as a sales clerk at a department store.", answer: "works", hint: "He/She/It → works (3ª pessoa)" },
        { text: "Emily ___ as a receptionist at a doctor's office.", answer: "works", hint: "She → works" },
        { text: "I ___ part-time in a restaurant.", answer: "work", hint: "I → work (sem 's')" },
        { text: "They ___ at a hospital. They're nurses.", answer: "work", hint: "They → work (sem 's')" },
        { text: "Aiko ___ as a waitress at a café.", answer: "works", hint: "She → works" },
        { text: "We ___ full-time in an office.", answer: "work", hint: "We → work (sem 's')" },
        { text: "Kelly ___ in a department store.", answer: "works", hint: "She → works" },
        { text: "I ___ a student. I don't ___.", answer: "'m / work", hint: "Verb to Be + Simple Present negativo" }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 2,
    title: "Vocabulary: Professions & Workplaces",
    description: "Conecte cada profissão ao local de trabalho correto.",
    type: "vocabulary",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "matching",
      instruction: "Conecte cada profissão ao local de trabalho correto:",
      pairs: [
        { expression: "doctor", country: "hospital", explanation: "Médico trabalha no hospital" },
        { expression: "teacher", country: "school", explanation: "Professor trabalha na escola" },
        { expression: "bank teller", country: "bank", explanation: "Caixa de banco trabalha no banco" },
        { expression: "waitress", country: "restaurant / café", explanation: "Garçonete trabalha no restaurante ou café" },
        { expression: "sales clerk", country: "department store", explanation: "Vendedor trabalha na loja de departamento" },
        { expression: "nurse", country: "hospital", explanation: "Enfermeiro(a) trabalha no hospital" },
        { expression: "secretary", country: "office", explanation: "Secretário(a) trabalha no escritório" },
        { expression: "receptionist", country: "doctor's office", explanation: "Recepcionista trabalha no consultório" }
      ]
    })
  },

  // ============================================================
  // LESSON 3: At Break - Food, Drinks & Meals
  // ============================================================

  {
    bookId: 1,
    lessonNumber: 3,
    title: "🇺🇸 Lucas Orders Lunch in New York",
    description: "Lucas pede almoço numa lanchonete em Nova York. Pratique como pedir comida no estilo americano.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Lucas está no intervalo da escola e vai a uma lanchonete perto de Times Square pedir almoço. Nos EUA, fast food é muito popular e as porções são enormes!",
      dialogue: [
        { speaker: "Waiter", text: "Hi! What can I get you?" },
        { speaker: "Lucas", text: "I wanna have a cheeseburger and fries, please." },
        { speaker: "Waiter", text: "Sure! Something to drink?" },
        { speaker: "Lucas", text: "Yeah, I want a large soda." },
        { speaker: "Waiter", text: "What kind? We have Coke, Sprite, Fanta..." },
        { speaker: "Lucas", text: "I'll have a Coke, please." },
        { speaker: "Waiter", text: "For here or to go?" },
        { speaker: "Lucas", text: "To go, please. Thanks!" }
      ],
      culturalNote: "Nos EUA, 'soda' é o nome mais usado para refrigerante (em algumas regiões dizem 'pop' ou 'coke' para qualquer refrigerante). As porções são muito maiores que no Brasil. 'For here or to go?' significa 'para comer aqui ou para levar?'. 'Wanna' = want to (forma oral).",
      accentTip: "'Wanna' é a forma falada de 'want to'. 'I'll have' é mais educado que 'I want'. 'To go' é a expressão americana para 'para levar'.",
      questions: [
        {
          question: "O que Lucas pede para comer?",
          options: ["Sandwich and salad", "Cheeseburger and fries", "Pizza and soda", "Hot dog and juice"],
          correctIndex: 1,
          explanation: "Lucas pede um cheeseburger com batatas fritas (fries)."
        },
        {
          question: "O que 'wanna' significa?",
          options: ["Want", "Want to", "Will", "Would"],
          correctIndex: 1,
          explanation: "'Wanna' é a forma oral/informal de 'want to'. Ex: 'I wanna have' = 'I want to have'."
        },
        {
          question: "O que 'For here or to go?' significa?",
          options: ["Quer mais?", "Para comer aqui ou levar?", "Quer sobremesa?", "Pagar agora ou depois?"],
          correctIndex: 1,
          explanation: "'For here or to go?' é a pergunta padrão nos EUA para saber se o cliente quer comer no local ou levar."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 3,
    title: "🇬🇧 Emily Has Tea Time in London",
    description: "Emily toma chá da tarde em Londres. Pratique como pedir comida no estilo britânico.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Emily está no intervalo e vai a um café tradicional em Londres para o 'tea time'. No Reino Unido, o chá é uma tradição sagrada!",
      dialogue: [
        { speaker: "Waiter", text: "Good afternoon. What would you like?" },
        { speaker: "Emily", text: "I'd like a cup of tea, please." },
        { speaker: "Waiter", text: "Of course. Milk and sugar?" },
        { speaker: "Emily", text: "Just milk, please. No sugar." },
        { speaker: "Waiter", text: "And something to eat?" },
        { speaker: "Emily", text: "Yes, I'd like a ham and cheese sandwich, please." },
        { speaker: "Waiter", text: "Lovely. Anything else?" },
        { speaker: "Emily", text: "No, that's all. Thank you." }
      ],
      culturalNote: "No Reino Unido, o chá (tea) é uma tradição cultural. Os britânicos bebem em média 3-4 xícaras por dia! O 'afternoon tea' (chá da tarde) geralmente inclui sanduíches pequenos, scones e bolos. 'I'd like' é mais educado que 'I want'.",
      accentTip: "'I'd like' (I would like) é a forma educada de pedir algo no Reino Unido. 'Lovely' é uma palavra muito britânica que significa 'ótimo' ou 'que bom'. 'That's all' = 'é só isso'.",
      questions: [
        {
          question: "O que Emily pede para beber?",
          options: ["Coffee", "A cup of tea with milk", "Orange juice", "Water"],
          correctIndex: 1,
          explanation: "Emily pede uma xícara de chá com leite (sem açúcar), muito típico do Reino Unido."
        },
        {
          question: "Qual é a forma mais educada de pedir algo?",
          options: ["I want a tea", "Give me a tea", "I'd like a cup of tea, please", "I wanna tea"],
          correctIndex: 2,
          explanation: "'I'd like' (I would like) + 'please' é a forma mais educada e formal de pedir algo."
        },
        {
          question: "Quantas xícaras de chá os britânicos bebem por dia em média?",
          options: ["1", "2", "3-4", "10"],
          correctIndex: 2,
          explanation: "Os britânicos bebem em média 3-4 xícaras de chá por dia. É uma tradição cultural!"
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 3,
    title: "🇦🇺 Aiko Orders at a Café in Sydney",
    description: "Aiko pede café e comida num café em Sydney. Pratique como pedir comida no estilo australiano.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Aiko",
      country: "Australia",
      flag: "🇦🇺",
      scenario: "Aiko está no intervalo e vai ao café onde trabalha perto de Bondi Beach. A Austrália é famosa pela cultura de café e brunch!",
      dialogue: [
        { speaker: "Waiter", text: "Hey! What'll it be?" },
        { speaker: "Aiko", text: "I'll have a flat white, please." },
        { speaker: "Waiter", text: "Good choice! Anything to eat?" },
        { speaker: "Aiko", text: "Yeah, I want to have some avocado toast." },
        { speaker: "Waiter", text: "Classic! With eggs?" },
        { speaker: "Aiko", text: "Yes, please. And a glass of orange juice." },
        { speaker: "Waiter", text: "No worries! Coming right up." },
        { speaker: "Aiko", text: "Cheers, mate!" }
      ],
      culturalNote: "A Austrália é famosa pela cultura de café. O 'flat white' é um café com leite inventado na Austrália (ou Nova Zelândia - eles disputam!). 'Avocado toast' (torrada com abacate) é o prato mais popular nos cafés australianos. 'Cheers' pode significar 'obrigado' ou 'saúde'.",
      accentTip: "'Cheers, mate!' é uma forma casual australiana de dizer 'obrigado'. 'No worries' = 'sem problemas'. 'Coming right up' = 'já vai sair'.",
      questions: [
        {
          question: "O que é um 'flat white'?",
          options: ["Um chá branco", "Um café com leite australiano", "Um suco", "Uma água com gás"],
          correctIndex: 1,
          explanation: "O 'flat white' é um tipo de café com leite inventado na Austrália. É mais forte que um latte."
        },
        {
          question: "O que 'Cheers, mate!' significa na Austrália?",
          options: ["Saúde!", "Obrigado, amigo!", "Tchau!", "Oi!"],
          correctIndex: 1,
          explanation: "'Cheers' na Austrália é usado como 'obrigado', e 'mate' significa 'amigo'."
        },
        {
          question: "Qual prato é muito popular nos cafés australianos?",
          options: ["Fish and chips", "Avocado toast", "Hamburger", "Pasta"],
          correctIndex: 1,
          explanation: "Avocado toast (torrada com abacate) é o prato mais icônico dos cafés australianos."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 3,
    title: "Grammar Practice: To Have, To Want, To Like - Food",
    description: "Pratique os verbos to have, to want e to like com vocabulário de comida.",
    type: "grammar",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "fill_in_the_blank",
      instruction: "Complete as frases com o verbo correto (have, want, like, drink):",
      sentences: [
        { text: "I usually ___ breakfast at 7 AM.", answer: "have", hint: "to have breakfast = tomar café da manhã" },
        { text: "I ___ to drink a cup of coffee, please.", answer: "want", hint: "to want = querer" },
        { text: "Do you ___ meat? No, I don't. I like fish.", answer: "like", hint: "to like = gostar" },
        { text: "They always ___ lunch at school.", answer: "have", hint: "to have lunch = almoçar" },
        { text: "I never ___ dinner after 9 PM.", answer: "have", hint: "to have dinner = jantar" },
        { text: "She ___ to have a ham and cheese sandwich.", answer: "wants", hint: "She → wants (3ª pessoa)" },
        { text: "What do you usually ___ for breakfast?", answer: "have", hint: "to have = comer/beber (refeições)" },
        { text: "I don't ___ soda. I prefer juice.", answer: "like", hint: "to like = gostar" }
      ]
    })
  },

  // ============================================================
  // LESSON 4: At the End of the Class - Classroom Objects & To Be
  // ============================================================

  {
    bookId: 1,
    lessonNumber: 4,
    title: "🇺🇸 Lucas Loses His Stuff at School",
    description: "Lucas perde seus objetos na escola em Nova York. Pratique possessivos e identificação de objetos.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Lucas perdeu seu estojo e está procurando no final da aula. Ele precisa perguntar aos colegas se os objetos são deles.",
      dialogue: [
        { speaker: "Lucas", text: "Hey, is this your pencil case?" },
        { speaker: "Mike", text: "No, it's not mine. Maybe it's Kelly's." },
        { speaker: "Lucas", text: "Kelly, is this your pencil case?" },
        { speaker: "Kelly", text: "No, that's not my pencil case. Mine is blue." },
        { speaker: "Lucas", text: "Hmm... What about this notebook? Is it yours?" },
        { speaker: "Kelly", text: "Yes! That's my notebook! Thanks, Lucas!" },
        { speaker: "Lucas", text: "No problem! But where's my pencil case?" },
        { speaker: "Mike", text: "Dude, it's in your backpack!" }
      ],
      culturalNote: "Nos EUA, 'Dude' é uma gíria muito usada entre amigos (principalmente entre meninos). 'No problem' é a forma casual de dizer 'de nada'. 'Mine' = 'meu/minha' (pronome possessivo).",
      accentTip: "'Dude' é pronunciado 'duud' com o 'u' longo. 'Mine' rima com 'fine'. 'Yours' rima com 'doors'.",
      questions: [
        {
          question: "De quem é o notebook?",
          options: ["De Lucas", "De Mike", "De Kelly", "Do professor"],
          correctIndex: 2,
          explanation: "O notebook é de Kelly. Ela diz 'That's my notebook!'"
        },
        {
          question: "Onde está o estojo de Lucas?",
          options: ["Na mesa", "No chão", "Na mochila dele", "Com Kelly"],
          correctIndex: 2,
          explanation: "O estojo de Lucas está na mochila dele! Mike diz 'It's in your backpack!'"
        },
        {
          question: "Complete: 'Is this ___ pencil case?' 'No, it's not ___.'",
          options: ["your / mine", "you / my", "yours / me", "your / my"],
          correctIndex: 0,
          explanation: "'Is this YOUR pencil case?' (adjetivo possessivo) / 'No, it's not MINE' (pronome possessivo)."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 4,
    title: "🇬🇧 Emily's School Supplies in London",
    description: "Emily organiza seus materiais escolares em Londres. Pratique Verb to Be e possessivos.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Emily",
      country: "UK",
      flag: "🇬🇧",
      scenario: "Emily está no final da aula e ajuda o professor a identificar objetos esquecidos na sala. No Reino Unido, alguns objetos escolares têm nomes diferentes!",
      dialogue: [
        { speaker: "Teacher", text: "Right, class. Is this anyone's rubber?" },
        { speaker: "Emily", text: "Excuse me, sir. I think that's Julie's rubber." },
        { speaker: "Teacher", text: "Julie, is this yours?" },
        { speaker: "Julie", text: "Yes, it is! Thank you, sir." },
        { speaker: "Teacher", text: "And what about this? Whose calculator is this?" },
        { speaker: "Emily", text: "I think it's Peter's. His calculator is black." },
        { speaker: "Teacher", text: "Peter, is this your calculator?" },
        { speaker: "Peter", text: "Yes, that's mine. Cheers!" }
      ],
      culturalNote: "No Reino Unido, 'rubber' = borracha (nos EUA é 'eraser'). 'Cheers' pode significar 'obrigado' de forma casual. 'Whose' = 'de quem'. 'Right, class' é como professores britânicos chamam atenção da turma.",
      accentTip: "No inglês britânico, 'rubber' é borracha escolar (cuidado: nos EUA 'rubber' pode significar camisinha!). 'Right' no início da frase é como 'Então' ou 'Bom'.",
      questions: [
        {
          question: "O que 'rubber' significa no inglês britânico?",
          options: ["Borracha (escolar)", "Régua", "Lápis", "Caderno"],
          correctIndex: 0,
          explanation: "No inglês britânico, 'rubber' = borracha escolar. Nos EUA, a palavra é 'eraser'."
        },
        {
          question: "De quem é a calculadora?",
          options: ["De Emily", "De Julie", "De Peter", "Do professor"],
          correctIndex: 2,
          explanation: "A calculadora é de Peter. Emily diz 'I think it's Peter's.'"
        },
        {
          question: "Complete: '___ calculator is this?' 'It's ___.'",
          options: ["Whose / Peter's", "Who / Peter", "What / Peter's", "Which / Peter"],
          correctIndex: 0,
          explanation: "'WHOSE' = 'de quem' (possessivo). 'It's Peter's' = 'É do Peter' (genitivo com 's)."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 4,
    title: "🇦🇺 Aiko at the End of Class in Sydney",
    description: "Aiko no final da aula em Sydney. Pratique Verb to Be e demonstrativos (this/that).",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Aiko",
      country: "Australia",
      flag: "🇦🇺",
      scenario: "Aiko está no final da aula em Sydney e encontra objetos esquecidos. Na Austrália, as escolas são mais descontraídas!",
      dialogue: [
        { speaker: "Aiko", text: "Hey, is this your pen?" },
        { speaker: "Steve", text: "Nah, that's not mine. Check with Julie." },
        { speaker: "Aiko", text: "Julie! Is this your pen?" },
        { speaker: "Julie", text: "Yeah, it is! Thanks heaps, Aiko!" },
        { speaker: "Aiko", text: "No worries! And what's that over there?" },
        { speaker: "Steve", text: "That's my notebook. I always forget my stuff!" },
        { speaker: "Aiko", text: "Ha! You're hopeless, mate!" },
        { speaker: "Steve", text: "Yeah, I know. See ya!" }
      ],
      culturalNote: "'Thanks heaps' é uma expressão australiana que significa 'muito obrigado'. 'Nah' = 'não' (informal). 'See ya' = 'até logo'. 'Hopeless' = 'sem jeito/caso perdido' (de forma carinhosa).",
      accentTip: "'Nah' é pronunciado como 'naa'. 'See ya' soa como 'see-ya'. 'Heaps' significa 'muito' na Austrália.",
      questions: [
        {
          question: "O que 'Thanks heaps' significa?",
          options: ["Obrigado um pouco", "Muito obrigado", "De nada", "Sem problemas"],
          correctIndex: 1,
          explanation: "'Thanks heaps' é australiano para 'muito obrigado'. 'Heaps' = 'muito/bastante'."
        },
        {
          question: "Qual a diferença entre 'this' e 'that'?",
          options: ["Não há diferença", "This = perto, That = longe", "This = grande, That = pequeno", "This = meu, That = seu"],
          correctIndex: 1,
          explanation: "'This' = isto/este (perto de quem fala). 'That' = aquilo/aquele (longe de quem fala)."
        },
        {
          question: "Complete: '___ is my pen (aqui perto). ___ is my notebook (lá longe).'",
          options: ["This / That", "That / This", "These / Those", "It / That"],
          correctIndex: 0,
          explanation: "'THIS' para objetos perto. 'THAT' para objetos longe."
        }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 4,
    title: "Grammar Practice: Verb to Be - Complete Forms",
    description: "Pratique todas as formas do Verb to Be (afirmativa, negativa, interrogativa).",
    type: "grammar",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "fill_in_the_blank",
      instruction: "Complete as frases com a forma correta do Verb to Be (is, are, am, isn't, aren't):",
      sentences: [
        { text: "He ___ Peter. He's Steve.", answer: "isn't", hint: "Negativa: He is not = He isn't" },
        { text: "___ she right? No, she ___ wrong.", answer: "Is / is", hint: "Interrogativa e afirmativa" },
        { text: "This ___ my pencil. That ___ your pencil.", answer: "is / is", hint: "This/That + is" },
        { text: "We ___ students. We ___ teachers.", answer: "are / aren't", hint: "We are / We are not" },
        { text: "___ this your notebook? Yes, it ___.", answer: "Is / is", hint: "Interrogativa + resposta curta" },
        { text: "They ___ in the classroom. They ___ in the library.", answer: "aren't / are", hint: "Negativa + afirmativa" },
        { text: "I ___ a student. I ___ a teacher.", answer: "am / 'm not", hint: "I am / I am not (I'm not)" },
        { text: "___ you Julie? No, I ___ not. She ___ over there.", answer: "Are / am / is", hint: "Interrogativa + negativa + afirmativa" }
      ]
    })
  },

  // ============================================================
  // LESSON 5: Communicative - Full Story with All Characters
  // ============================================================

  {
    bookId: 1,
    lessonNumber: 5,
    title: "🌍 The Three Friends Meet Online",
    description: "Lucas, Emily e Aiko se conhecem numa videochamada. Uma história que reúne tudo o que foi aprendido nas Lessons 1-4.",
    type: "communicative",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "story_reading",
      title: "The Three Friends Meet Online",
      characters: [
        { name: "Lucas", country: "USA", flag: "🇺🇸", city: "New York" },
        { name: "Emily", country: "UK", flag: "🇬🇧", city: "London" },
        { name: "Aiko", country: "Australia", flag: "🇦🇺", city: "Sydney" }
      ],
      story: [
        { speaker: "narrator", text: "Lucas, Emily e Aiko são estudantes de inglês em países diferentes. Hoje eles se encontram pela primeira vez numa videochamada internacional." },
        { speaker: "Lucas", text: "Hey! What's up? I'm Lucas, from New York! 🇺🇸", accent: "casual, fast" },
        { speaker: "Emily", text: "Hello! My name's Emily. I'm from London. Pleased to meet you! 🇬🇧", accent: "formal, polite" },
        { speaker: "Aiko", text: "G'day, mates! I'm Aiko, from Sydney! 🇦🇺", accent: "relaxed, friendly" },
        { speaker: "narrator", text: "Eles começam a conversar sobre suas vidas..." },
        { speaker: "Emily", text: "So, what do you do, Lucas?" },
        { speaker: "Lucas", text: "I work as a sales clerk at a department store. Part-time. I also have a side hustle at a fast food place." },
        { speaker: "Aiko", text: "Awesome! I work as a waitress at a café near Bondi Beach." },
        { speaker: "Emily", text: "I work as a receptionist at a doctor's office. It's quite nice." },
        { speaker: "narrator", text: "Na hora do almoço, cada um conta o que está comendo..." },
        { speaker: "Lucas", text: "I'm having a cheeseburger and a large Coke. Classic American lunch!" },
        { speaker: "Emily", text: "I'm having a cup of tea and a ham sandwich. Very British, I know!" },
        { speaker: "Aiko", text: "I'm having a flat white and avocado toast. So Aussie!" },
        { speaker: "narrator", text: "No final da conversa, eles mostram seus materiais escolares..." },
        { speaker: "Lucas", text: "Check this out! This is my new notebook." },
        { speaker: "Emily", text: "That's lovely! And this is my pencil case. It's blue." },
        { speaker: "Aiko", text: "Nice! And that's my calculator over there. I always forget my stuff!" },
        { speaker: "Lucas", text: "Ha! See you guys later!" },
        { speaker: "Emily", text: "Cheerio! It was lovely meeting you!" },
        { speaker: "Aiko", text: "See ya, mates! No worries!" }
      ],
      comprehensionQuestions: [
        {
          question: "Onde cada personagem mora?",
          options: [
            "Lucas: London, Emily: Sydney, Aiko: New York",
            "Lucas: New York, Emily: London, Aiko: Sydney",
            "Lucas: Sydney, Emily: New York, Aiko: London",
            "Todos moram em New York"
          ],
          correctIndex: 1
        },
        {
          question: "Quem trabalha como garçonete?",
          options: ["Lucas", "Emily", "Aiko", "Ninguém"],
          correctIndex: 2
        },
        {
          question: "O que Emily está comendo?",
          options: ["Cheeseburger", "Avocado toast", "Ham sandwich and tea", "Pizza"],
          correctIndex: 2
        },
        {
          question: "Quem sempre esquece as coisas?",
          options: ["Lucas", "Emily", "Aiko", "O professor"],
          correctIndex: 2
        },
        {
          question: "Qual expressão é australiana?",
          options: ["See you guys!", "Cheerio!", "No worries!", "What's up?"],
          correctIndex: 2
        }
      ],
      expressionComparison: [
        { meaning: "Oi!", usa: "Hey! What's up?", uk: "Hello!", australia: "G'day!" },
        { meaning: "Tchau!", usa: "See you guys!", uk: "Cheerio!", australia: "See ya, mates!" },
        { meaning: "Legal!", usa: "Cool!", uk: "Lovely!", australia: "Awesome!" },
        { meaning: "Obrigado", usa: "Thanks!", uk: "Thank you very much", australia: "Cheers!" },
        { meaning: "De nada", usa: "No problem!", uk: "You're welcome", australia: "No worries!" }
      ]
    })
  },

  {
    bookId: 1,
    lessonNumber: 5,
    title: "🌍 Compare: Expressions in USA, UK & Australia",
    description: "Compare como as mesmas expressões são ditas nos três países. Teste seus conhecimentos!",
    type: "vocabulary",
    difficulty: "beginner",
    content: JSON.stringify({
      exerciseType: "matching",
      instruction: "Identifique de qual país é cada expressão:",
      pairs: [
        { expression: "Wanna grab some lunch?", country: "🇺🇸 USA", explanation: "'Wanna' e 'grab' são muito americanos" },
        { expression: "Shall we have some tea?", country: "🇬🇧 UK", explanation: "'Shall we' é formal e britânico" },
        { expression: "Wanna get some brekkie?", country: "🇦🇺 Australia", explanation: "'Brekkie' = breakfast (gíria australiana)" },
        { expression: "That's awesome, dude!", country: "🇺🇸 USA", explanation: "'Dude' é muito americano" },
        { expression: "That's brilliant!", country: "🇬🇧 UK", explanation: "'Brilliant' é muito britânico" },
        { expression: "Thanks heaps, mate!", country: "🇦🇺 Australia", explanation: "'Heaps' e 'mate' são australianos" },
        { expression: "Check this out!", country: "🇺🇸 USA", explanation: "'Check this out' é expressão americana" },
        { expression: "Have a look at this!", country: "🇬🇧 UK", explanation: "'Have a look' é expressão britânica" }
      ]
    })
  }
];

console.log(`Total de exercícios criados: ${book1Exercises.length}`);
console.log(`Lesson 1: ${book1Exercises.filter(e => e.lessonNumber === 1).length} exercícios`);
console.log(`Lesson 2: ${book1Exercises.filter(e => e.lessonNumber === 2).length} exercícios`);
console.log(`Lesson 3: ${book1Exercises.filter(e => e.lessonNumber === 3).length} exercícios`);
console.log(`Lesson 4: ${book1Exercises.filter(e => e.lessonNumber === 4).length} exercícios`);
console.log(`Lesson 5: ${book1Exercises.filter(e => e.lessonNumber === 5).length} exercícios`);
