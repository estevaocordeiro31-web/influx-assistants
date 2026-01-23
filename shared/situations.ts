/**
 * Banco de Situações Reais para Simulador de Inglês
 * Baseado na metodologia inFlux de Chunks e Equivalência
 */

export interface Situation {
  id: string;
  category: 'travel' | 'work' | 'social' | 'daily' | 'emergency' | 'shopping' | 'food' | 'health';
  title: string;
  titlePt: string;
  description: string;
  descriptionPt: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  bookLevel: number[]; // Books 1-5 onde esta situação é apropriada
  icon: string;
  scenario: string;
  scenarioPt: string;
  context: string;
  objectives: string[];
  keyChunks: {
    chunk: string;
    equivalent: string;
    usage: string;
  }[];
  dialogueStarters: {
    npc: string;
    npcPt: string;
    suggestedResponses: string[];
  }[];
  vocabulary: {
    word: string;
    translation: string;
    example: string;
  }[];
  culturalTips?: string[];
}

export const SITUATIONS: Situation[] = [
  // ==================== VIAGENS ====================
  {
    id: 'airport-checkin',
    category: 'travel',
    title: 'Airport Check-in',
    titlePt: 'Check-in no Aeroporto',
    description: 'Practice checking in for your flight and handling luggage',
    descriptionPt: 'Pratique fazer check-in para seu voo e lidar com bagagem',
    difficulty: 'beginner',
    bookLevel: [1, 2],
    icon: '✈️',
    scenario: 'You arrive at the airport for your international flight. You need to check in, drop off your luggage, and get your boarding pass.',
    scenarioPt: 'Você chega ao aeroporto para seu voo internacional. Precisa fazer check-in, despachar sua bagagem e pegar seu cartão de embarque.',
    context: 'International airport, check-in counter',
    objectives: [
      'Successfully check in for your flight',
      'Handle luggage questions',
      'Get your boarding pass and gate information',
    ],
    keyChunks: [
      { chunk: "I'd like to check in", equivalent: "Eu gostaria de fazer check-in", usage: "Iniciar o processo de check-in" },
      { chunk: "Is there a window seat available?", equivalent: "Tem assento na janela disponível?", usage: "Pedir preferência de assento" },
      { chunk: "How much does it weigh?", equivalent: "Quanto pesa?", usage: "Perguntar sobre peso da bagagem" },
      { chunk: "What time does the flight board?", equivalent: "Que horas começa o embarque?", usage: "Perguntar horário de embarque" },
    ],
    dialogueStarters: [
      {
        npc: "Good morning! May I see your passport and booking confirmation, please?",
        npcPt: "Bom dia! Posso ver seu passaporte e confirmação de reserva, por favor?",
        suggestedResponses: [
          "Here you go. I'd like to check in for my flight to London.",
          "Sure, here's my passport. I have a booking for flight BA247.",
          "Of course. I'm traveling to New York today.",
        ],
      },
      {
        npc: "Would you prefer a window or aisle seat?",
        npcPt: "Você prefere assento na janela ou no corredor?",
        suggestedResponses: [
          "A window seat, please.",
          "I'd prefer an aisle seat if possible.",
          "Either is fine, thank you.",
        ],
      },
      {
        npc: "Do you have any luggage to check in?",
        npcPt: "Você tem alguma bagagem para despachar?",
        suggestedResponses: [
          "Yes, I have one suitcase to check in.",
          "Just this carry-on bag.",
          "I have two bags to check in.",
        ],
      },
    ],
    vocabulary: [
      { word: "boarding pass", translation: "cartão de embarque", example: "Here's your boarding pass." },
      { word: "carry-on", translation: "bagagem de mão", example: "You can take one carry-on bag." },
      { word: "gate", translation: "portão", example: "Your gate is B12." },
      { word: "departure", translation: "partida", example: "The departure time is 10:30 AM." },
    ],
    culturalTips: [
      "Arrive at least 2-3 hours before international flights",
      "Have your documents ready before reaching the counter",
      "Be polite and patient - 'please' and 'thank you' go a long way",
    ],
  },

  {
    id: 'hotel-checkin',
    category: 'travel',
    title: 'Hotel Check-in',
    titlePt: 'Check-in no Hotel',
    description: 'Check into your hotel and ask about amenities',
    descriptionPt: 'Faça check-in no hotel e pergunte sobre comodidades',
    difficulty: 'beginner',
    bookLevel: [1, 2],
    icon: '🏨',
    scenario: 'You arrive at your hotel after a long flight. You need to check in, ask about your room, and learn about the hotel facilities.',
    scenarioPt: 'Você chega ao hotel após um longo voo. Precisa fazer check-in, perguntar sobre seu quarto e conhecer as instalações do hotel.',
    context: 'Hotel lobby, front desk',
    objectives: [
      'Complete the check-in process',
      'Ask about room amenities',
      'Learn about hotel services',
    ],
    keyChunks: [
      { chunk: "I have a reservation under", equivalent: "Tenho uma reserva no nome de", usage: "Informar sua reserva" },
      { chunk: "What time is checkout?", equivalent: "Que horas é o checkout?", usage: "Perguntar horário de saída" },
      { chunk: "Is breakfast included?", equivalent: "O café da manhã está incluído?", usage: "Perguntar sobre refeições" },
      { chunk: "Could I get a late checkout?", equivalent: "Posso fazer checkout mais tarde?", usage: "Pedir checkout tardio" },
    ],
    dialogueStarters: [
      {
        npc: "Welcome to the Grand Hotel! Do you have a reservation?",
        npcPt: "Bem-vindo ao Grand Hotel! Você tem uma reserva?",
        suggestedResponses: [
          "Yes, I have a reservation under the name Smith.",
          "Yes, I booked online. The confirmation number is ABC123.",
          "I do. It should be under my email address.",
        ],
      },
      {
        npc: "Your room is on the 5th floor. Here's your key card. Is there anything else you need?",
        npcPt: "Seu quarto fica no 5º andar. Aqui está seu cartão-chave. Precisa de mais alguma coisa?",
        suggestedResponses: [
          "What time is breakfast served?",
          "Is there Wi-Fi in the room?",
          "Could you recommend a good restaurant nearby?",
        ],
      },
    ],
    vocabulary: [
      { word: "key card", translation: "cartão-chave", example: "Don't forget your key card." },
      { word: "amenities", translation: "comodidades", example: "The room has all modern amenities." },
      { word: "front desk", translation: "recepção", example: "Call the front desk if you need anything." },
      { word: "room service", translation: "serviço de quarto", example: "Room service is available 24/7." },
    ],
  },

  {
    id: 'restaurant-ordering',
    category: 'food',
    title: 'Ordering at a Restaurant',
    titlePt: 'Pedindo em um Restaurante',
    description: 'Order food, ask about the menu, and handle the bill',
    descriptionPt: 'Peça comida, pergunte sobre o cardápio e pague a conta',
    difficulty: 'beginner',
    bookLevel: [1, 2, 3],
    icon: '🍽️',
    scenario: 'You\'re at a nice restaurant in New York. You need to order food, ask about ingredients, and pay the bill.',
    scenarioPt: 'Você está em um restaurante legal em Nova York. Precisa pedir comida, perguntar sobre ingredientes e pagar a conta.',
    context: 'Restaurant, dining table',
    objectives: [
      'Order food and drinks',
      'Ask about menu items',
      'Request the bill and pay',
    ],
    keyChunks: [
      { chunk: "I'd like to order", equivalent: "Eu gostaria de pedir", usage: "Iniciar o pedido" },
      { chunk: "What do you recommend?", equivalent: "O que você recomenda?", usage: "Pedir sugestão" },
      { chunk: "Could I have the check, please?", equivalent: "Pode trazer a conta, por favor?", usage: "Pedir a conta" },
      { chunk: "Is this dish spicy?", equivalent: "Este prato é apimentado?", usage: "Perguntar sobre ingredientes" },
    ],
    dialogueStarters: [
      {
        npc: "Good evening! Are you ready to order, or do you need a few more minutes?",
        npcPt: "Boa noite! Estão prontos para pedir, ou precisam de mais alguns minutos?",
        suggestedResponses: [
          "I'm ready. I'd like to order the grilled salmon, please.",
          "Could you give us a few more minutes?",
          "What do you recommend as a starter?",
        ],
      },
      {
        npc: "How would you like your steak cooked?",
        npcPt: "Como você gostaria do seu bife?",
        suggestedResponses: [
          "Medium rare, please.",
          "Well done, please.",
          "Medium, please.",
        ],
      },
      {
        npc: "Would you like anything to drink?",
        npcPt: "Gostaria de algo para beber?",
        suggestedResponses: [
          "I'll have a glass of red wine, please.",
          "Just water for me, thank you.",
          "Could I see the wine list?",
        ],
      },
    ],
    vocabulary: [
      { word: "appetizer", translation: "entrada", example: "Would you like an appetizer?" },
      { word: "main course", translation: "prato principal", example: "The main course will be right out." },
      { word: "dessert", translation: "sobremesa", example: "Save room for dessert!" },
      { word: "tip", translation: "gorjeta", example: "The tip is usually 15-20%." },
    ],
    culturalTips: [
      "In the US, tipping 15-20% is expected",
      "It's common to ask for a 'doggy bag' for leftovers",
      "Splitting the bill is called 'going Dutch'",
    ],
  },

  // ==================== TRABALHO ====================
  {
    id: 'job-interview',
    category: 'work',
    title: 'Job Interview',
    titlePt: 'Entrevista de Emprego',
    description: 'Practice common job interview questions and answers',
    descriptionPt: 'Pratique perguntas e respostas comuns de entrevista de emprego',
    difficulty: 'intermediate',
    bookLevel: [3, 4, 5],
    icon: '💼',
    scenario: 'You have a job interview at a multinational company. You need to introduce yourself, answer questions about your experience, and ask about the position.',
    scenarioPt: 'Você tem uma entrevista de emprego em uma empresa multinacional. Precisa se apresentar, responder perguntas sobre sua experiência e perguntar sobre a vaga.',
    context: 'Corporate office, meeting room',
    objectives: [
      'Introduce yourself professionally',
      'Answer behavioral questions',
      'Ask thoughtful questions about the role',
    ],
    keyChunks: [
      { chunk: "I've been working as", equivalent: "Eu tenho trabalhado como", usage: "Descrever experiência atual" },
      { chunk: "My strengths include", equivalent: "Meus pontos fortes incluem", usage: "Falar sobre qualidades" },
      { chunk: "I'm looking for an opportunity to", equivalent: "Estou procurando uma oportunidade para", usage: "Expressar objetivos" },
      { chunk: "Could you tell me more about", equivalent: "Você poderia me contar mais sobre", usage: "Fazer perguntas" },
    ],
    dialogueStarters: [
      {
        npc: "Thank you for coming in today. Could you start by telling me a little about yourself?",
        npcPt: "Obrigado por vir hoje. Você poderia começar me contando um pouco sobre você?",
        suggestedResponses: [
          "Of course. I've been working as a marketing manager for the past five years...",
          "Sure. I'm a software developer with experience in web applications...",
          "Certainly. I recently graduated with a degree in Business Administration...",
        ],
      },
      {
        npc: "What would you say is your greatest strength?",
        npcPt: "Qual você diria que é seu maior ponto forte?",
        suggestedResponses: [
          "My greatest strength is my ability to work well under pressure.",
          "I'd say my communication skills are my strongest asset.",
          "I'm very detail-oriented and organized.",
        ],
      },
      {
        npc: "Where do you see yourself in five years?",
        npcPt: "Onde você se vê em cinco anos?",
        suggestedResponses: [
          "I see myself in a leadership role, managing a team.",
          "I hope to have developed expertise in this field and taken on more responsibilities.",
          "I'd like to be contributing to strategic decisions at a senior level.",
        ],
      },
    ],
    vocabulary: [
      { word: "resume/CV", translation: "currículo", example: "Please bring your resume to the interview." },
      { word: "qualifications", translation: "qualificações", example: "What are your qualifications for this role?" },
      { word: "salary expectations", translation: "expectativa salarial", example: "What are your salary expectations?" },
      { word: "references", translation: "referências", example: "Do you have professional references?" },
    ],
    culturalTips: [
      "Research the company before the interview",
      "Prepare specific examples using the STAR method",
      "Send a thank-you email within 24 hours",
    ],
  },

  {
    id: 'business-meeting',
    category: 'work',
    title: 'Business Meeting',
    titlePt: 'Reunião de Negócios',
    description: 'Participate in a professional business meeting',
    descriptionPt: 'Participe de uma reunião profissional de negócios',
    difficulty: 'advanced',
    bookLevel: [4, 5],
    icon: '📊',
    scenario: 'You\'re leading a quarterly review meeting with your international team. You need to present results, discuss challenges, and plan next steps.',
    scenarioPt: 'Você está liderando uma reunião de revisão trimestral com sua equipe internacional. Precisa apresentar resultados, discutir desafios e planejar próximos passos.',
    context: 'Conference room, video call',
    objectives: [
      'Present information clearly',
      'Facilitate discussion',
      'Summarize action items',
    ],
    keyChunks: [
      { chunk: "Let's get started", equivalent: "Vamos começar", usage: "Iniciar a reunião" },
      { chunk: "As you can see from the data", equivalent: "Como vocês podem ver pelos dados", usage: "Apresentar informações" },
      { chunk: "Does anyone have any questions?", equivalent: "Alguém tem alguma pergunta?", usage: "Abrir para perguntas" },
      { chunk: "To sum up", equivalent: "Resumindo", usage: "Concluir a apresentação" },
      { chunk: "I'd like to add that", equivalent: "Eu gostaria de acrescentar que", usage: "Contribuir com ideias" },
    ],
    dialogueStarters: [
      {
        npc: "Good morning, everyone. Shall we begin?",
        npcPt: "Bom dia a todos. Podemos começar?",
        suggestedResponses: [
          "Yes, let's get started. First, I'd like to review last quarter's results.",
          "Sure. Before we begin, does everyone have the agenda?",
          "Absolutely. Let me share my screen with the presentation.",
        ],
      },
      {
        npc: "What do you think about the proposed timeline?",
        npcPt: "O que você acha do cronograma proposto?",
        suggestedResponses: [
          "I think it's ambitious but achievable if we allocate the right resources.",
          "I have some concerns about the deadline. Could we discuss alternatives?",
          "It looks reasonable. However, I'd suggest adding a buffer for unexpected issues.",
        ],
      },
    ],
    vocabulary: [
      { word: "agenda", translation: "pauta", example: "Let's stick to the agenda." },
      { word: "action items", translation: "itens de ação", example: "I'll send the action items after the meeting." },
      { word: "stakeholders", translation: "partes interessadas", example: "We need to update the stakeholders." },
      { word: "deadline", translation: "prazo", example: "The deadline is next Friday." },
    ],
  },

  {
    id: 'presentation',
    category: 'work',
    title: 'Giving a Presentation',
    titlePt: 'Fazendo uma Apresentação',
    description: 'Deliver a professional presentation to an audience',
    descriptionPt: 'Faça uma apresentação profissional para uma audiência',
    difficulty: 'advanced',
    bookLevel: [4, 5],
    icon: '🎤',
    scenario: 'You\'re presenting your project proposal to senior management. You need to engage the audience, explain your ideas clearly, and handle questions.',
    scenarioPt: 'Você está apresentando sua proposta de projeto para a alta gerência. Precisa engajar a audiência, explicar suas ideias claramente e responder perguntas.',
    context: 'Auditorium, boardroom',
    objectives: [
      'Open with impact',
      'Present ideas clearly',
      'Handle Q&A professionally',
    ],
    keyChunks: [
      { chunk: "I'm here today to talk about", equivalent: "Estou aqui hoje para falar sobre", usage: "Introduzir o tema" },
      { chunk: "Let me walk you through", equivalent: "Deixe-me explicar passo a passo", usage: "Guiar pela apresentação" },
      { chunk: "The key takeaway is", equivalent: "O ponto principal é", usage: "Destacar informação importante" },
      { chunk: "That's a great question", equivalent: "Essa é uma ótima pergunta", usage: "Responder perguntas" },
    ],
    dialogueStarters: [
      {
        npc: "The floor is yours. Please go ahead with your presentation.",
        npcPt: "A palavra é sua. Por favor, prossiga com sua apresentação.",
        suggestedResponses: [
          "Thank you. Good morning, everyone. I'm here today to present our new marketing strategy.",
          "Thanks. I'm excited to share our findings with you today.",
          "Thank you for the opportunity. Let me start by giving you some context.",
        ],
      },
      {
        npc: "Could you elaborate on the budget requirements?",
        npcPt: "Você poderia elaborar sobre os requisitos de orçamento?",
        suggestedResponses: [
          "Certainly. The total budget we're requesting is $50,000, broken down as follows...",
          "Of course. Let me show you the detailed breakdown on the next slide.",
          "That's a great question. The budget is divided into three main categories...",
        ],
      },
    ],
    vocabulary: [
      { word: "slide deck", translation: "apresentação de slides", example: "I'll share the slide deck after." },
      { word: "key points", translation: "pontos-chave", example: "Let me highlight the key points." },
      { word: "Q&A session", translation: "sessão de perguntas", example: "We'll have a Q&A session at the end." },
      { word: "handout", translation: "material impresso", example: "There are handouts at the back." },
    ],
  },

  // ==================== SOCIAL ====================
  {
    id: 'making-friends',
    category: 'social',
    title: 'Making New Friends',
    titlePt: 'Fazendo Novos Amigos',
    description: 'Start conversations and make friends at social events',
    descriptionPt: 'Inicie conversas e faça amigos em eventos sociais',
    difficulty: 'beginner',
    bookLevel: [1, 2, 3],
    icon: '🤝',
    scenario: 'You\'re at a networking event and want to meet new people. Practice starting conversations and finding common interests.',
    scenarioPt: 'Você está em um evento de networking e quer conhecer pessoas novas. Pratique iniciar conversas e encontrar interesses em comum.',
    context: 'Social event, party',
    objectives: [
      'Start a conversation naturally',
      'Find common interests',
      'Exchange contact information',
    ],
    keyChunks: [
      { chunk: "Nice to meet you", equivalent: "Prazer em conhecê-lo", usage: "Cumprimentar alguém novo" },
      { chunk: "What do you do?", equivalent: "O que você faz?", usage: "Perguntar sobre trabalho" },
      { chunk: "How do you know", equivalent: "Como você conhece", usage: "Perguntar sobre conexões" },
      { chunk: "We should keep in touch", equivalent: "Devemos manter contato", usage: "Sugerir contato futuro" },
    ],
    dialogueStarters: [
      {
        npc: "Hi there! I don't think we've met. I'm Sarah.",
        npcPt: "Oi! Acho que não nos conhecemos. Sou Sarah.",
        suggestedResponses: [
          "Hi Sarah! Nice to meet you. I'm [your name]. How do you know the host?",
          "Hello! I'm [your name]. Great party, isn't it?",
          "Nice to meet you, Sarah! I'm [your name]. Is this your first time here?",
        ],
      },
      {
        npc: "So, what do you do for a living?",
        npcPt: "Então, o que você faz da vida?",
        suggestedResponses: [
          "I work in marketing. What about you?",
          "I'm a software developer. How about yourself?",
          "I'm currently studying business. And you?",
        ],
      },
    ],
    vocabulary: [
      { word: "small talk", translation: "conversa informal", example: "Let's make some small talk." },
      { word: "networking", translation: "networking", example: "This is a great networking opportunity." },
      { word: "common ground", translation: "interesses em comum", example: "We found common ground quickly." },
      { word: "hit it off", translation: "se dar bem", example: "We really hit it off!" },
    ],
  },

  // ==================== EMERGÊNCIAS ====================
  {
    id: 'medical-emergency',
    category: 'emergency',
    title: 'Medical Emergency',
    titlePt: 'Emergência Médica',
    description: 'Communicate in medical emergency situations',
    descriptionPt: 'Comunique-se em situações de emergência médica',
    difficulty: 'intermediate',
    bookLevel: [2, 3, 4],
    icon: '🏥',
    scenario: 'You\'re not feeling well while traveling abroad. You need to explain your symptoms to a doctor and understand their instructions.',
    scenarioPt: 'Você não está se sentindo bem enquanto viaja no exterior. Precisa explicar seus sintomas ao médico e entender as instruções.',
    context: 'Hospital, clinic, pharmacy',
    objectives: [
      'Describe symptoms clearly',
      'Understand medical instructions',
      'Ask about medication',
    ],
    keyChunks: [
      { chunk: "I'm not feeling well", equivalent: "Não estou me sentindo bem", usage: "Expressar mal-estar" },
      { chunk: "I have a pain in my", equivalent: "Estou com dor no meu/na minha", usage: "Descrever dor" },
      { chunk: "How often should I take this?", equivalent: "Com que frequência devo tomar isso?", usage: "Perguntar sobre medicação" },
      { chunk: "Is it serious?", equivalent: "É grave?", usage: "Perguntar sobre gravidade" },
    ],
    dialogueStarters: [
      {
        npc: "What seems to be the problem today?",
        npcPt: "Qual parece ser o problema hoje?",
        suggestedResponses: [
          "I've had a terrible headache for two days.",
          "I think I have food poisoning. I've been vomiting since last night.",
          "I fell and hurt my ankle. It's very swollen.",
        ],
      },
      {
        npc: "Are you allergic to any medications?",
        npcPt: "Você é alérgico a algum medicamento?",
        suggestedResponses: [
          "Yes, I'm allergic to penicillin.",
          "No, I don't have any allergies.",
          "I'm not sure, but I've never had a reaction before.",
        ],
      },
    ],
    vocabulary: [
      { word: "prescription", translation: "receita médica", example: "You'll need a prescription for this." },
      { word: "symptoms", translation: "sintomas", example: "What are your symptoms?" },
      { word: "side effects", translation: "efeitos colaterais", example: "Are there any side effects?" },
      { word: "insurance", translation: "seguro", example: "Do you have travel insurance?" },
    ],
    culturalTips: [
      "Always carry your travel insurance information",
      "Know the emergency number (911 in US, 999 in UK)",
      "Keep a list of your medications in English",
    ],
  },

  // ==================== COMPRAS ====================
  {
    id: 'shopping-clothes',
    category: 'shopping',
    title: 'Shopping for Clothes',
    titlePt: 'Comprando Roupas',
    description: 'Shop for clothes and ask for help in stores',
    descriptionPt: 'Compre roupas e peça ajuda nas lojas',
    difficulty: 'beginner',
    bookLevel: [1, 2],
    icon: '👕',
    scenario: 'You\'re shopping at a clothing store and need help finding the right size, color, and style.',
    scenarioPt: 'Você está comprando em uma loja de roupas e precisa de ajuda para encontrar o tamanho, cor e estilo certos.',
    context: 'Clothing store, mall',
    objectives: [
      'Ask for help finding items',
      'Try on clothes',
      'Ask about prices and discounts',
    ],
    keyChunks: [
      { chunk: "Do you have this in", equivalent: "Vocês têm isso em", usage: "Perguntar sobre tamanhos/cores" },
      { chunk: "Can I try this on?", equivalent: "Posso experimentar isso?", usage: "Pedir para provar" },
      { chunk: "Is this on sale?", equivalent: "Isso está em promoção?", usage: "Perguntar sobre descontos" },
      { chunk: "I'm just looking, thanks", equivalent: "Estou só olhando, obrigado", usage: "Recusar ajuda educadamente" },
    ],
    dialogueStarters: [
      {
        npc: "Hi! Can I help you find anything today?",
        npcPt: "Oi! Posso ajudá-lo a encontrar algo hoje?",
        suggestedResponses: [
          "Yes, I'm looking for a blue shirt in size medium.",
          "I'm just looking, thanks.",
          "Actually, yes. Do you have this jacket in a smaller size?",
        ],
      },
      {
        npc: "The fitting rooms are right over there. Let me know if you need a different size.",
        npcPt: "Os provadores ficam ali. Me avise se precisar de outro tamanho.",
        suggestedResponses: [
          "Thank you! Actually, could you bring me a large as well?",
          "Great, thanks for your help.",
          "Perfect. I'll try these on.",
        ],
      },
    ],
    vocabulary: [
      { word: "fitting room", translation: "provador", example: "The fitting room is over there." },
      { word: "receipt", translation: "recibo", example: "Would you like a receipt?" },
      { word: "exchange", translation: "trocar", example: "Can I exchange this?" },
      { word: "refund", translation: "reembolso", example: "I'd like a refund, please." },
    ],
  },

  // ==================== DIA A DIA ====================
  {
    id: 'asking-directions',
    category: 'daily',
    title: 'Asking for Directions',
    titlePt: 'Pedindo Informações',
    description: 'Ask for and understand directions in English',
    descriptionPt: 'Peça e entenda direções em inglês',
    difficulty: 'beginner',
    bookLevel: [1, 2],
    icon: '🗺️',
    scenario: 'You\'re lost in a new city and need to find your way to a famous landmark.',
    scenarioPt: 'Você está perdido em uma cidade nova e precisa encontrar o caminho para um ponto turístico famoso.',
    context: 'Street, tourist area',
    objectives: [
      'Ask for directions politely',
      'Understand directions given',
      'Confirm understanding',
    ],
    keyChunks: [
      { chunk: "Excuse me, could you tell me how to get to", equivalent: "Com licença, você poderia me dizer como chegar em", usage: "Pedir direções educadamente" },
      { chunk: "Is it far from here?", equivalent: "É longe daqui?", usage: "Perguntar sobre distância" },
      { chunk: "Turn left/right at", equivalent: "Vire à esquerda/direita em", usage: "Dar/entender direções" },
      { chunk: "You can't miss it", equivalent: "Você não tem como errar", usage: "Confirmar que é fácil de achar" },
    ],
    dialogueStarters: [
      {
        npc: "Sure, I can help you. Where are you trying to go?",
        npcPt: "Claro, posso ajudar. Onde você está tentando ir?",
        suggestedResponses: [
          "I'm looking for the nearest subway station.",
          "I need to get to Central Park. Is it far?",
          "Could you point me to Times Square?",
        ],
      },
      {
        npc: "Go straight for two blocks, then turn right. It's on your left.",
        npcPt: "Siga em frente por duas quadras, depois vire à direita. Fica à sua esquerda.",
        suggestedResponses: [
          "So, straight for two blocks, then right? Got it, thanks!",
          "Sorry, could you repeat that? Turn right after two blocks?",
          "Thank you so much! Is it walking distance?",
        ],
      },
    ],
    vocabulary: [
      { word: "block", translation: "quadra", example: "It's two blocks away." },
      { word: "intersection", translation: "cruzamento", example: "Turn at the intersection." },
      { word: "landmark", translation: "ponto de referência", example: "Look for the big red building as a landmark." },
      { word: "shortcut", translation: "atalho", example: "I know a shortcut." },
    ],
  },

  {
    id: 'phone-call',
    category: 'daily',
    title: 'Making a Phone Call',
    titlePt: 'Fazendo uma Ligação',
    description: 'Make and receive phone calls professionally',
    descriptionPt: 'Faça e receba ligações telefônicas profissionalmente',
    difficulty: 'intermediate',
    bookLevel: [2, 3, 4],
    icon: '📞',
    scenario: 'You need to call a company to inquire about their services or make an appointment.',
    scenarioPt: 'Você precisa ligar para uma empresa para perguntar sobre serviços ou marcar um compromisso.',
    context: 'Phone conversation',
    objectives: [
      'Introduce yourself on the phone',
      'State your purpose clearly',
      'Take notes and confirm details',
    ],
    keyChunks: [
      { chunk: "This is [name] calling from", equivalent: "Aqui é [nome] ligando de", usage: "Se identificar" },
      { chunk: "I'm calling to inquire about", equivalent: "Estou ligando para perguntar sobre", usage: "Explicar motivo da ligação" },
      { chunk: "Could you put me through to", equivalent: "Você poderia me transferir para", usage: "Pedir transferência" },
      { chunk: "Let me confirm that", equivalent: "Deixe-me confirmar isso", usage: "Confirmar informações" },
    ],
    dialogueStarters: [
      {
        npc: "Good morning, ABC Company. How may I help you?",
        npcPt: "Bom dia, Empresa ABC. Como posso ajudá-lo?",
        suggestedResponses: [
          "Hi, I'm calling to inquire about your services.",
          "Good morning. I'd like to speak with someone from the sales department.",
          "Hello, I'm calling to schedule an appointment.",
        ],
      },
      {
        npc: "May I ask who's calling?",
        npcPt: "Posso perguntar quem está ligando?",
        suggestedResponses: [
          "This is John Smith from XYZ Corporation.",
          "My name is [your name]. I'm a customer.",
          "Sure, this is [your name] calling about the job posting.",
        ],
      },
    ],
    vocabulary: [
      { word: "hold", translation: "aguardar", example: "Please hold for a moment." },
      { word: "transfer", translation: "transferir", example: "I'll transfer you now." },
      { word: "voicemail", translation: "correio de voz", example: "Please leave a voicemail." },
      { word: "callback", translation: "retorno de ligação", example: "Can I arrange a callback?" },
    ],
  },

  // ==================== SAÚDE ====================
  {
    id: 'pharmacy-visit',
    category: 'health',
    title: 'At the Pharmacy',
    titlePt: 'Na Farmácia',
    description: 'Buy medicine and ask for recommendations',
    descriptionPt: 'Compre remédios e peça recomendações',
    difficulty: 'beginner',
    bookLevel: [1, 2, 3],
    icon: '💊',
    scenario: 'You have a cold and need to buy medicine at a pharmacy. Ask the pharmacist for recommendations.',
    scenarioPt: 'Você está resfriado e precisa comprar remédio na farmácia. Peça recomendações ao farmacêutico.',
    context: 'Pharmacy, drugstore',
    objectives: [
      'Describe your symptoms',
      'Ask for medicine recommendations',
      'Understand dosage instructions',
    ],
    keyChunks: [
      { chunk: "I need something for", equivalent: "Preciso de algo para", usage: "Pedir remédio" },
      { chunk: "How often should I take this?", equivalent: "Com que frequência devo tomar?", usage: "Perguntar sobre dosagem" },
      { chunk: "Are there any side effects?", equivalent: "Há algum efeito colateral?", usage: "Perguntar sobre efeitos" },
      { chunk: "Do I need a prescription?", equivalent: "Preciso de receita?", usage: "Perguntar sobre receita" },
    ],
    dialogueStarters: [
      {
        npc: "Hi, how can I help you today?",
        npcPt: "Oi, como posso ajudá-lo hoje?",
        suggestedResponses: [
          "I have a bad cold. What do you recommend?",
          "I need something for a headache.",
          "Do you have anything for allergies?",
        ],
      },
      {
        npc: "Take two tablets every six hours with food. Don't exceed eight tablets in 24 hours.",
        npcPt: "Tome dois comprimidos a cada seis horas com comida. Não exceda oito comprimidos em 24 horas.",
        suggestedResponses: [
          "Got it. Two tablets every six hours. Thank you!",
          "Should I take it with or without food?",
          "What if the symptoms don't improve?",
        ],
      },
    ],
    vocabulary: [
      { word: "over-the-counter", translation: "sem receita", example: "This is an over-the-counter medicine." },
      { word: "dosage", translation: "dosagem", example: "Follow the dosage instructions." },
      { word: "tablet", translation: "comprimido", example: "Take one tablet twice a day." },
      { word: "syrup", translation: "xarope", example: "This cough syrup works well." },
    ],
  },
];

// Função para obter situações por categoria
export function getSituationsByCategory(category: Situation['category']): Situation[] {
  return SITUATIONS.filter(s => s.category === category);
}

// Função para obter situações por nível de livro
export function getSituationsByBookLevel(bookLevel: number): Situation[] {
  return SITUATIONS.filter(s => s.bookLevel.includes(bookLevel));
}

// Função para obter situações por dificuldade
export function getSituationsByDifficulty(difficulty: Situation['difficulty']): Situation[] {
  return SITUATIONS.filter(s => s.difficulty === difficulty);
}

// Função para obter uma situação aleatória
export function getRandomSituation(bookLevel?: number): Situation {
  const available = bookLevel 
    ? getSituationsByBookLevel(bookLevel)
    : SITUATIONS;
  return available[Math.floor(Math.random() * available.length)];
}

// Categorias disponíveis
export const SITUATION_CATEGORIES = [
  { id: 'travel', label: 'Viagens', labelEn: 'Travel', icon: '✈️' },
  { id: 'work', label: 'Trabalho', labelEn: 'Work', icon: '💼' },
  { id: 'social', label: 'Social', labelEn: 'Social', icon: '🤝' },
  { id: 'daily', label: 'Dia a Dia', labelEn: 'Daily Life', icon: '🏠' },
  { id: 'emergency', label: 'Emergências', labelEn: 'Emergency', icon: '🚨' },
  { id: 'shopping', label: 'Compras', labelEn: 'Shopping', icon: '🛒' },
  { id: 'food', label: 'Alimentação', labelEn: 'Food', icon: '🍽️' },
  { id: 'health', label: 'Saúde', labelEn: 'Health', icon: '🏥' },
];
