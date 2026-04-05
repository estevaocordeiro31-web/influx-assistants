import type { Character } from './chunks';

export interface QuizQuestion {
  id: string;
  character: Character;
  question: string;
  options: string[];
  correct: number;
  feedback: { correct: string; wrong: string };
  chunk: string;
  points: number;
}

export const STPATRICKS_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    character: 'emily',
    question: 'Emily diz: "The craic was mighty last night!" O que ela quer dizer?',
    options: [
      'Algo quebrou na festa',
      'A festa estava incrível',
      'A comida estava péssima',
      'A festa foi tranquila'
    ],
    correct: 1,
    feedback: {
      correct: "Exato! 'Craic' é expressão irlandesa para diversão e energia boa. Emily aprendeu com os amigos irlandeses em Londres e usa toda vez que quer impressionar!",
      wrong: "'Craic' (pronuncia 'crack') é expressão irlandesa adotada pelos britânicos. Significa diversão, energia boa, bagunça saudável. Nada de negativo!"
    },
    chunk: 'craic',
    points: 15
  },
  {
    id: 'q2',
    character: 'lucas',
    question: "Lucas quer dizer 'Feliz Dia de São Patrício' em inglês autêntico. Qual forma é mais correta?",
    options: [
      "Happy St. Patty's Day!",
      "Happy St. Patrick's Day!",
      "Happy St. Paddy's Day!",
      'Todas são igualmente corretas'
    ],
    correct: 2,
    feedback: {
      correct: "Certo! 'Paddy' vem de Pádraig, o nome irlandês de São Patrício. É a forma autêntica. 'Patty' é considerado erro por irlandeses — é nome feminino!",
      wrong: "'Paddy' é a forma correta — vem de Pádraig, o nome irlandês. 'Patty' é erro comum (é nome feminino em inglês). Lucas aprendeu isso da forma mais constrangedora possível."
    },
    chunk: 'st_paddy',
    points: 15
  },
  {
    id: 'q3',
    character: 'emily',
    question: 'Emily convida você para uma "fancy dress party". Ela quer dizer:',
    options: [
      'Festa com traje social elegante',
      'Festa à fantasia',
      'Festa com entrada cara',
      'Festa só para adultos'
    ],
    correct: 1,
    feedback: {
      correct: "Isso! Em inglês britânico, 'fancy dress' = fantasia. Lucas chegou de terno porque nos EUA 'fancy dress' é traje elegante. Emily nunca esqueceu.",
      wrong: "Pegadinha cultural! Em inglês britânico, 'fancy dress' = fantasia para festa. Em inglês americano = roupa elegante. Lucas aprendeu do jeito mais constrangedor possível."
    },
    chunk: 'fancy_dress',
    points: 15
  },
  {
    id: 'q4',
    character: 'aiko',
    question: 'Aiko diz: "The festival was heaps of fun!" O que significa "heaps"?',
    options: [
      'Pilhas de',
      'Muito / bastante',
      'Pouco / quase nada',
      'Talvez / mais ou menos'
    ],
    correct: 1,
    feedback: {
      correct: "Perfeito! 'Heaps' é o superlativo informal australiano — equivalente ao 'a lot' americano e 'loads' britânico. Aiko usa em tudo: heaps good, heaps tired, heaps fun!",
      wrong: "'Heaps' em australiano informal = muito, bastante. É o 'a lot' deles. 'That was heaps good!' = 'Isso foi muito bom!'"
    },
    chunk: 'heaps',
    points: 15
  },
  {
    id: 'q5',
    character: 'lucas',
    question: "Lucas diz: \"We're doing a pub crawl tonight!\" O que o grupo vai fazer?",
    options: [
      'Arrastar bêbados para casa',
      'Ir a um único bar irlandês',
      'Visitar vários bares na mesma noite',
      "Assistir ao desfile de St. Patrick's"
    ],
    correct: 2,
    feedback: {
      correct: "Exatamente! Pub crawl = roteiro de bares, visitar vários bares na mesma noite. Tradição clássica do St. Patrick's em NY. Lucas organiza um todo ano!",
      wrong: "Pub crawl = ir de bar em bar numa mesma noite. É uma tradição do St. Patrick's em Nova York. Lucas tem um roteiro favorito no East Village!"
    },
    chunk: 'pub_crawl',
    points: 15
  },
  {
    id: 'q6',
    character: 'aiko',
    question: 'Alguém pede desculpa para Aiko. Ela responde: "No worries!" O que ela quer dizer?',
    options: [
      'Isso é um problema sim',
      'Sem problema / tudo bem',
      'Não me preocupo com isso',
      'Você deveria se preocupar'
    ],
    correct: 1,
    feedback: {
      correct: "Isso! 'No worries' é a expressão mais australiana do mundo. Serve pra tudo: você está bem?, sim; obrigado, imagina; desculpa, sem problema. Aiko usa umas 20 vezes por dia.",
      wrong: "'No worries' é o 'tranquilo' australiano — serve para responder obrigado, desculpa, está bem? Tudo vira 'no worries' pra Aiko!"
    },
    chunk: 'no_worries',
    points: 15
  },
  {
    id: 'q7',
    character: 'emily',
    question: "Emily recebe uma boa notícia e grita: \"That's brilliant!\" Em inglês britânico, \"brilliant\" significa:",
    options: [
      'Inteligente / brilhante',
      'Brilhante (luz forte)',
      'Incrível / ótimo / demais',
      'Exagerado / dramático'
    ],
    correct: 2,
    feedback: {
      correct: "Perfeito! Em inglês britânico, 'brilliant' é o elogio genérico para tudo que é bom — equivale ao 'awesome' americano e ao 'ripper' australiano. Emily usa 30 vezes por dia.",
      wrong: "Em inglês britânico, 'brilliant' = incrível, ótimo, demais — não necessariamente inteligente. É o 'awesome' britânico. Emily usa pra absolutamente tudo que gosta."
    },
    chunk: 'brilliant',
    points: 15
  },
  {
    id: 'q8',
    character: 'lucas',
    question: 'Quando alguém tem muita sorte sem explicação, Lucas diz:',
    options: [
      '"You\'re so lucky!"',
      '"Luck of the Irish!"',
      '"Lucky charm!"',
      '"That\'s fortunate!"'
    ],
    correct: 1,
    feedback: {
      correct: "Exato! 'Luck of the Irish' é expressão cultural americana para sorte inexplicável. Lucas usa toda vez que pega táxi na hora certa em NY — o que é praticamente um milagre.",
      wrong: "'Luck of the Irish' é a expressão cultural americana para alguém com sorte incomum. Vem da tradição irlandesa associada aos trevos de quatro folhas."
    },
    chunk: 'luck_of_the_irish',
    points: 15
  }
];
