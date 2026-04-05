export type Character = 'lucas' | 'emily' | 'aiko';

export interface StPatricksChunk {
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

export const STPATRICKS_CHUNKS: StPatricksChunk[] = [
  {
    id: 'cheers',
    chunk: "Cheers!",
    who: 'emily',
    city: 'Londres',
    flag: '🇬🇧',
    equivalencia: "Saúde! / Valeu! / Obrigado!",
    contexto: "Emily usa para brindar, agradecer e até se despedir. Em inglês britânico, 'cheers' faz tudo.",
    exemplo: {
      en: "— Thanks for coming tonight!\n— Cheers, mate!",
      pt: "— Obrigado por vir!\n— Valeu, cara!"
    },
    nota: "⚠️ Em inglês americano, Lucas só usa 'cheers' para brindar. Emily ri toda vez que ele usa errado."
  },
  {
    id: 'pub_crawl',
    chunk: "pub crawl",
    who: 'lucas',
    city: 'Nova York',
    flag: '🇺🇸',
    equivalencia: "roteiro de bares",
    contexto: "Quando o grupo vai de bar em bar numa mesma noite. Tradição do St. Patrick's em NY.",
    exemplo: {
      en: "We're doing a pub crawl through the East Village tonight!",
      pt: "A gente vai fazer um roteiro de bares no East Village hoje!"
    },
    nota: "Lucas organiza um pub crawl todo ano no St. Patrick's com os amigos irlandeses dele em NY."
  },
  {
    id: 'craic',
    chunk: "The craic was mighty!",
    who: 'emily',
    city: 'Londres',
    flag: '🇬🇧',
    equivalencia: "Foi demais! / A festa estava incrível!",
    contexto: "Expressão irlandesa que Emily aprendeu com os amigos irlandeses em Londres. 'Craic' = diversão, energia boa, bagunça saudável.",
    exemplo: {
      en: "How was the party?\n— The craic was mighty, mate!",
      pt: "Como foi a festa?\n— Foi demais, cara!"
    },
    nota: "Pronuncia-se 'crack'. Emily adora usar e ver a cara das pessoas que não conhecem."
  },
  {
    id: 'no_worries',
    chunk: "No worries!",
    who: 'aiko',
    city: 'Sydney',
    flag: '🇦🇺',
    equivalencia: "Sem problema! / Imagina! / Tudo bem!",
    contexto: "A expressão mais australiana que existe. Serve para tudo: você está bem?, tudo bem; obrigado, imagina; desculpa, sem problema.",
    exemplo: {
      en: "Sorry I'm late!\n— No worries, mate, we just started!",
      pt: "Desculpa o atraso!\n— Sem problema, acabamos de começar!"
    },
    nota: "Aiko usa 'no worries' umas 20 vezes por dia. É o 'tranquilo' australiano."
  },
  {
    id: 'st_paddy',
    chunk: "Happy St. Paddy's!",
    who: 'lucas',
    city: 'Nova York',
    flag: '🇺🇸',
    equivalencia: "Feliz Dia de São Patrício!",
    contexto: "Abreviação informal e autêntica de St. Patrick's Day. 'Paddy' vem de Pádraig, nome irlandês.",
    exemplo: {
      en: "Happy St. Paddy's, everyone! Let's get this party started!",
      pt: "Feliz Dia de São Patrício, galera! Vamos começar a festa!"
    },
    nota: "⚠️ 'St. Patty's' é considerado errado por irlandeses. Use 'Paddy' para não errar."
  },
  {
    id: 'fancy_dress',
    chunk: "fancy dress",
    who: 'emily',
    city: 'Londres',
    flag: '🇬🇧',
    equivalencia: "fantasia",
    contexto: "Em inglês britânico, 'fancy dress' = fantasia para festa. Em inglês americano, 'fancy dress' = roupa elegante. Fonte de confusão constante!",
    exemplo: {
      en: "It's a fancy dress party — come as anything Irish!",
      pt: "É festa à fantasia — venha fantasiado de algo irlandês!"
    },
    nota: "Lucas apareceu numa festa de Emily de terno e gravata. Ela tinha dito 'fancy dress party'."
  },
  {
    id: 'heaps',
    chunk: "heaps of fun",
    who: 'aiko',
    city: 'Sydney',
    flag: '🇦🇺',
    equivalencia: "um monte de diversão / super divertido",
    contexto: "Australianos usam 'heaps' onde americanos usam 'a lot' e britânicos usam 'loads'. É o superlativo informal australiano.",
    exemplo: {
      en: "St. Patrick's in Sydney is heaps of fun — everyone's in green!",
      pt: "O St. Patrick's em Sydney é super divertido — todo mundo de verde!"
    },
    nota: "Aiko usa 'heaps' para tudo: heaps good, heaps tired, heaps excited."
  },
  {
    id: 'luck_of_the_irish',
    chunk: "Luck of the Irish",
    who: 'lucas',
    city: 'Nova York',
    flag: '🇺🇸',
    equivalencia: "Sorte dos irlandeses / sortudo por natureza",
    contexto: "Expressão cultural americana para descrever alguém com sorte incomum. Lucas usa toda vez que pega táxi na hora certa em NY.",
    exemplo: {
      en: "I got the last table at the restaurant!\n— Luck of the Irish!",
      pt: "Consegui a última mesa no restaurante!\n— Sortudo demais!"
    }
  },
  {
    id: 'brilliant',
    chunk: "That's brilliant!",
    who: 'emily',
    city: 'Londres',
    flag: '🇬🇧',
    equivalencia: "Que incrível! / Que ótimo! / Demais!",
    contexto: "Em inglês britânico, 'brilliant' não é só para coisas inteligentes — é o elogio genérico para tudo que é bom.",
    exemplo: {
      en: "I got promoted!\n— That's absolutely brilliant, I'm so happy for you!",
      pt: "Fui promovido!\n— Que incrível, fico tão feliz por você!"
    },
    nota: "Equivalente britânico do 'awesome' americano e do 'ripper' australiano."
  },
  {
    id: 'gday',
    chunk: "G'day!",
    who: 'aiko',
    city: 'Sydney',
    flag: '🇦🇺',
    equivalencia: "Oi! / E aí! / Bom dia!",
    contexto: "Abreviação de 'Good day'. Cumprimento australiano informal para qualquer hora do dia. Aiko usa com todo mundo.",
    exemplo: {
      en: "G'day! First time at an Irish pub?\n— Yeah!\n— You're gonna love it, mate!",
      pt: "E aí! Primeira vez num pub irlandês?\n— Sim!\n— Vai amar, pode ter certeza!"
    }
  }
];

export const CHARACTER_IMAGES: Record<Character, string> = {
  lucas: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/lucas-nyc_a016f4f1.jpg',
  emily: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/emily-london_de6867d2.jpg',
  aiko: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/aiko-sydney_fbb013b2.jpg',
};

export const CHARACTER_COLORS: Record<Character, string> = {
  lucas: '#2196F3',
  emily: '#e53935',
  aiko: '#7b2d8b',
};

export const CHARACTER_INFO: Record<Character, { name: string; city: string; flag: string; accent: string; catchphrase: string; ttsVoice: string }> = {
  lucas: {
    name: 'Lucas',
    city: 'Nova York',
    flag: '🗽',
    accent: 'American English',
    catchphrase: "Hey! What's up?",
    ttsVoice: 'en-US',
  },
  emily: {
    name: 'Emily',
    city: 'Londres',
    flag: '🎡',
    accent: 'British English',
    catchphrase: "Lovely to meet you!",
    ttsVoice: 'en-GB',
  },
  aiko: {
    name: 'Aiko',
    city: 'Sydney',
    flag: '🦘',
    accent: 'Australian English',
    catchphrase: "G'day mate!",
    ttsVoice: 'en-AU',
  },
};
