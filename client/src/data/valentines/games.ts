// ============================================================
// VALENTINE'S DAY — GAMES DATA
// ============================================================

// ─── LOVE LETTER WORD SCRAMBLE ──────────────────────────────
export interface WordScramble {
  id: string;
  word: string;
  scrambled: string;
  hint: string;
  category: "food" | "romantic" | "restaurant";
  points: number;
}

export const WORD_SCRAMBLES: WordScramble[] = [
  { id: "ws1", word: "RESERVATION", scrambled: "VRETOASINRE", hint: "You need one for a fancy dinner", category: "restaurant", points: 10 },
  { id: "ws2", word: "CHOCOLATE", scrambled: "HOCCOALET", hint: "Sweet treat on Valentine's Day", category: "romantic", points: 10 },
  { id: "ws3", word: "APPETIZER", scrambled: "PPAEIZERT", hint: "First course at a restaurant", category: "food", points: 10 },
  { id: "ws4", word: "BOUQUET", scrambled: "UOBQTUE", hint: "A bunch of flowers", category: "romantic", points: 10 },
  { id: "ws5", word: "DESSERT", scrambled: "SSDRETE", hint: "Sweet course after the main meal", category: "food", points: 10 },
  { id: "ws6", word: "CANDLELIGHT", scrambled: "DCLNAEGLITH", hint: "Romantic dinner ambiance", category: "romantic", points: 15 },
  { id: "ws7", word: "SOMMELIER", scrambled: "MMSOEILER", hint: "Wine expert at a restaurant", category: "restaurant", points: 15 },
  { id: "ws8", word: "SERENADE", scrambled: "EESRNDAE", hint: "Singing a love song to someone", category: "romantic", points: 15 },
  { id: "ws9", word: "ENTREE", scrambled: "REEENT", hint: "Main course in American English", category: "food", points: 10 },
  { id: "ws10", word: "PROPOSAL", scrambled: "ROOPSLAP", hint: "Will you marry me?", category: "romantic", points: 15 },
  { id: "ws11", word: "WAITER", scrambled: "EIARTW", hint: "Person who serves your food", category: "restaurant", points: 10 },
  { id: "ws12", word: "CHAMPAGNE", scrambled: "HCMPGNAAE", hint: "Bubbly drink for celebrations", category: "food", points: 15 },
];

// ─── LOVE MATCH (Connect expressions to meanings) ───────────
export interface LoveMatch {
  id: string;
  expression: string;
  meaning: string;
  character: "lucas" | "emily" | "aiko";
  difficulty: "easy" | "medium" | "hard";
}

export const LOVE_MATCHES: LoveMatch[] = [
  { id: "lm1", expression: "Be my Valentine!", meaning: "Seja meu par!", character: "lucas", difficulty: "easy" },
  { id: "lm2", expression: "Fancy a date?", meaning: "Quer sair comigo?", character: "emily", difficulty: "easy" },
  { id: "lm3", expression: "I'm keen on you!", meaning: "Eu tô a fim de você!", character: "aiko", difficulty: "easy" },
  { id: "lm4", expression: "You stole my heart!", meaning: "Você roubou meu coração!", character: "lucas", difficulty: "easy" },
  { id: "lm5", expression: "I'm head over heels!", meaning: "Estou perdidamente apaixonado!", character: "emily", difficulty: "medium" },
  { id: "lm6", expression: "She's drop-dead gorgeous!", meaning: "Ela é linda de morrer!", character: "aiko", difficulty: "medium" },
  { id: "lm7", expression: "We hit it off!", meaning: "A gente se deu super bem!", character: "lucas", difficulty: "medium" },
  { id: "lm8", expression: "I've got butterflies!", meaning: "Estou com frio na barriga!", character: "emily", difficulty: "medium" },
  { id: "lm9", expression: "You're my better half!", meaning: "Você é minha cara-metade!", character: "aiko", difficulty: "hard" },
  { id: "lm10", expression: "Love at first sight!", meaning: "Amor à primeira vista!", character: "lucas", difficulty: "easy" },
  { id: "lm11", expression: "He swept me off my feet!", meaning: "Ele me conquistou completamente!", character: "emily", difficulty: "hard" },
  { id: "lm12", expression: "We're going steady!", meaning: "Estamos namorando firme!", character: "aiko", difficulty: "hard" },
];

// ─── TONGUE TWISTERS (Valentine's themed) ───────────────────
export interface TongueTwister {
  id: string;
  text: string;
  level: "easy" | "medium" | "hard" | "insane";
  tip: string;
  valentineTheme: boolean;
}

export const TONGUE_TWISTERS: TongueTwister[] = [
  {
    id: "tt1",
    text: "She sells seashells by the seashore.",
    level: "easy",
    tip: "Focus on the 'sh' vs 's' sounds!",
    valentineTheme: false,
  },
  {
    id: "tt2",
    text: "Red roses rarely grow right.",
    level: "easy",
    tip: "Valentine's roses! Keep the 'r' sounds rolling.",
    valentineTheme: true,
  },
  {
    id: "tt3",
    text: "Love's labour's lost last long lonely nights.",
    level: "easy",
    tip: "All 'L' sounds — keep your tongue light!",
    valentineTheme: true,
  },
  {
    id: "tt4",
    text: "Peter Piper picked a peck of pickled peppers.",
    level: "medium",
    tip: "Explosive 'p' sounds — don't spray!",
    valentineTheme: false,
  },
  {
    id: "tt5",
    text: "Cupid's cute cousin couldn't catch the couple's kiss.",
    level: "medium",
    tip: "Valentine's Cupid! The 'c' and 'k' sounds are tricky.",
    valentineTheme: true,
  },
  {
    id: "tt6",
    text: "Valentine's vivid violets vanished very vaguely.",
    level: "medium",
    tip: "All 'V' sounds — bite your lower lip gently!",
    valentineTheme: true,
  },
  {
    id: "tt7",
    text: "The thirty-three thieves thought that they thrilled the throne throughout Thursday.",
    level: "hard",
    tip: "The 'th' sound is the enemy here!",
    valentineTheme: false,
  },
  {
    id: "tt8",
    text: "She shared her sweet chocolate chip cheesecake with her charming champion.",
    level: "hard",
    tip: "The 'sh' vs 'ch' battle! Valentine's dessert edition.",
    valentineTheme: true,
  },
  {
    id: "tt9",
    text: "Romantic restaurants rarely reserve round rooms for raucous revelers.",
    level: "hard",
    tip: "Restaurant romance! All those 'r' sounds...",
    valentineTheme: true,
  },
  {
    id: "tt10",
    text: "Whether the weather is warm, whether the weather is hot, we have to put up with the weather whether we like it or not.",
    level: "insane",
    tip: "The 'w' and 'wh' sounds will destroy you!",
    valentineTheme: false,
  },
  {
    id: "tt11",
    text: "Six sweet Swedish sweethearts swiftly swam, switching strokes, swooning, and swaying in the sunset.",
    level: "insane",
    tip: "Valentine's swim date! The 'sw' cluster is brutal.",
    valentineTheme: true,
  },
];

// ─── SPEED DATING QUESTIONS (Ice-breaker game) ──────────────
export interface SpeedDatingQuestion {
  id: string;
  question: string;
  questionPt: string;
  category: "fun" | "deep" | "creative" | "spicy";
  forTeens: boolean;
}

export const SPEED_DATING_QUESTIONS: SpeedDatingQuestion[] = [
  // FUN
  { id: "sd1", question: "If you could have dinner with anyone, dead or alive, who would it be?", questionPt: "Se pudesse jantar com qualquer pessoa, viva ou morta, quem seria?", category: "fun", forTeens: true },
  { id: "sd2", question: "What's the most romantic movie you've ever watched?", questionPt: "Qual o filme mais romântico que você já assistiu?", category: "fun", forTeens: true },
  { id: "sd3", question: "If love had a flavor, what would it taste like?", questionPt: "Se o amor tivesse um sabor, qual seria?", category: "fun", forTeens: true },
  { id: "sd4", question: "What's your idea of a perfect date?", questionPt: "Qual sua ideia de encontro perfeito?", category: "fun", forTeens: true },
  { id: "sd5", question: "Would you rather receive flowers or chocolate?", questionPt: "Você prefere receber flores ou chocolate?", category: "fun", forTeens: true },
  // DEEP
  { id: "sd6", question: "What does love mean to you in three words?", questionPt: "O que amor significa pra você em três palavras?", category: "deep", forTeens: true },
  { id: "sd7", question: "What's the kindest thing someone has ever done for you?", questionPt: "Qual a coisa mais gentil que alguém já fez por você?", category: "deep", forTeens: true },
  { id: "sd8", question: "Do you believe in love at first sight?", questionPt: "Você acredita em amor à primeira vista?", category: "deep", forTeens: true },
  { id: "sd9", question: "What's more important: being loved or being understood?", questionPt: "O que é mais importante: ser amado ou ser compreendido?", category: "deep", forTeens: false },
  { id: "sd10", question: "What lesson has love taught you?", questionPt: "Que lição o amor te ensinou?", category: "deep", forTeens: false },
  // CREATIVE
  { id: "sd11", question: "Describe your soulmate using only food comparisons.", questionPt: "Descreva sua alma gêmea usando apenas comparações com comida.", category: "creative", forTeens: true },
  { id: "sd12", question: "If your love life was a song, what would the title be?", questionPt: "Se sua vida amorosa fosse uma música, qual seria o título?", category: "creative", forTeens: true },
  { id: "sd13", question: "Write a Valentine's card message in 10 words or less.", questionPt: "Escreva uma mensagem de Valentine's em 10 palavras ou menos.", category: "creative", forTeens: true },
  { id: "sd14", question: "If you opened a restaurant for couples, what would you name it?", questionPt: "Se abrisse um restaurante para casais, qual nome daria?", category: "creative", forTeens: true },
  // SPICY (adults only)
  { id: "sd15", question: "What's your biggest turn-off on a first date?", questionPt: "Qual seu maior 'brochante' num primeiro encontro?", category: "spicy", forTeens: false },
  { id: "sd16", question: "Have you ever been on a blind date? How did it go?", questionPt: "Já foi num encontro às cegas? Como foi?", category: "spicy", forTeens: false },
  { id: "sd17", question: "What's the cheesiest pickup line you've ever heard?", questionPt: "Qual a cantada mais brega que já ouviu?", category: "spicy", forTeens: false },
  { id: "sd18", question: "Would you date someone who doesn't like your favorite food?", questionPt: "Namoraria alguém que não gosta da sua comida favorita?", category: "spicy", forTeens: true },
];

// ─── EMOJI DECODER (Guess the expression from emojis) ───────
export interface EmojiPuzzle {
  id: string;
  emojis: string;
  answer: string;
  answerPt: string;
  hint: string;
  points: number;
}

export const EMOJI_PUZZLES: EmojiPuzzle[] = [
  { id: "ep1", emojis: "❤️👀1️⃣", answer: "Love at first sight", answerPt: "Amor à primeira vista", hint: "A classic romantic expression", points: 10 },
  { id: "ep2", emojis: "🦋🦋🦋🫃", answer: "Butterflies in my stomach", answerPt: "Frio na barriga", hint: "How you feel when you're nervous about someone", points: 10 },
  { id: "ep3", emojis: "💔🧊", answer: "Break the ice", answerPt: "Quebrar o gelo", hint: "Starting a conversation with a stranger", points: 10 },
  { id: "ep4", emojis: "🌹🥂🕯️", answer: "Candlelight dinner", answerPt: "Jantar à luz de velas", hint: "A romantic evening meal", points: 10 },
  { id: "ep5", emojis: "👫💍💒", answer: "Tie the knot", answerPt: "Casar / Dar o nó", hint: "Getting married", points: 15 },
  { id: "ep6", emojis: "☁️9️⃣", answer: "On cloud nine", answerPt: "Nas nuvens / Super feliz", hint: "Extremely happy", points: 15 },
  { id: "ep7", emojis: "🍰🍫🧁🍨", answer: "Sweet tooth", answerPt: "Formiguinha / Gostar de doces", hint: "Someone who loves desserts", points: 10 },
  { id: "ep8", emojis: "👞👠💃🕺", answer: "Sweep someone off their feet", answerPt: "Conquistar alguém completamente", hint: "Impress someone romantically", points: 15 },
  { id: "ep9", emojis: "💘🏹👼", answer: "Cupid's arrow", answerPt: "Flecha do Cupido", hint: "The symbol of falling in love", points: 10 },
  { id: "ep10", emojis: "🫕🧀🥖🍷", answer: "Wine and dine", answerPt: "Levar para jantar fora", hint: "Treat someone to a fancy meal", points: 15 },
  { id: "ep11", emojis: "💑🌅🏖️", answer: "Romantic getaway", answerPt: "Escapada romântica", hint: "A trip for two", points: 15 },
  { id: "ep12", emojis: "🗣️❤️🎵", answer: "Serenade", answerPt: "Serenata", hint: "Singing a love song to someone", points: 10 },
];
