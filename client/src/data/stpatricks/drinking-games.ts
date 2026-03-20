// ============================================================
// ST. PATRICK'S NIGHT — DRINKING GAMES DATA
// ============================================================

// ─── TONGUE TWISTERS ────────────────────────────────────────
export interface TongueTwister {
  id: string;
  text: string;
  level: "easy" | "medium" | "hard" | "insane";
  tip: string;
  irishTheme: boolean;
}

export const TONGUE_TWISTERS: TongueTwister[] = [
  // EASY
  {
    id: "tt1",
    text: "She sells seashells by the seashore.",
    level: "easy",
    tip: "Focus on the 'sh' vs 's' sounds!",
    irishTheme: false,
  },
  {
    id: "tt2",
    text: "Red lorry, yellow lorry.",
    level: "easy",
    tip: "Try to speed it up each time!",
    irishTheme: false,
  },
  {
    id: "tt3",
    text: "Green glass globes glow greenly.",
    level: "easy",
    tip: "St. Patrick's green! Keep the 'gl' crisp.",
    irishTheme: true,
  },
  // MEDIUM
  {
    id: "tt4",
    text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    level: "medium",
    tip: "The 'w' and 'ch' sounds are the tricky part!",
    irishTheme: false,
  },
  {
    id: "tt5",
    text: "Peter Piper picked a peck of pickled peppers.",
    level: "medium",
    tip: "Explosive 'p' sounds — don't spray the person next to you! 😄",
    irishTheme: false,
  },
  {
    id: "tt6",
    text: "Lucky leprechauns leap lightly, leaving laughter lingering long.",
    level: "medium",
    tip: "All 'L' sounds — very Irish! Keep your tongue light.",
    irishTheme: true,
  },
  // HARD
  {
    id: "tt7",
    text: "The thirty-three thieves thought that they thrilled the throne throughout Thursday.",
    level: "hard",
    tip: "The 'th' sound is the enemy here. Bite your tongue gently!",
    irishTheme: false,
  },
  {
    id: "tt8",
    text: "Irish wristwatch, Swiss wristwatch.",
    level: "hard",
    tip: "This one is deceptively short. Try saying it 3 times fast!",
    irishTheme: true,
  },
  {
    id: "tt9",
    text: "Six slippery snails slid slowly seaward.",
    level: "hard",
    tip: "The 's' and 'sl' blend is brutal at speed!",
    irishTheme: false,
  },
  // INSANE
  {
    id: "tt10",
    text: "The seething sea ceaseth and thus the seething sea sufficeth us.",
    level: "insane",
    tip: "You'll need a pint after this one. 'th', 'ss', 'ea' — all at once!",
    irishTheme: false,
  },
  {
    id: "tt11",
    text: "Pad kid poured curd pulled cod.",
    level: "insane",
    tip: "MIT scientists say this is the hardest tongue twister in English. Good luck! 🔥",
    irishTheme: false,
  },
  {
    id: "tt12",
    text: "Crispy, crunchy, crackling, crumbling Celtic crosses carved carefully.",
    level: "insane",
    tip: "Pure Celtic chaos. Say it 3x fast without stopping!",
    irishTheme: true,
  },
];

export const LEVEL_CONFIG = {
  easy:   { label: "Easy 🍀",   color: "#40916c", drinkRule: "Abaixo de 60%? Dê um gole!", points: 50  },
  medium: { label: "Medium 🍺", color: "#e9c46a", drinkRule: "Abaixo de 70%? Dois goles!",  points: 80  },
  hard:   { label: "Hard 🔥",   color: "#e76f51", drinkRule: "Abaixo de 75%? Três goles!",  points: 120 },
  insane: { label: "Insane ☠️", color: "#9b2226", drinkRule: "Abaixo de 80%? ESCOLHA QUEM BEBE!", points: 200 },
};

// ─── WHO AM I — CHARACTERS ──────────────────────────────────
export interface WhoAmICharacter {
  id: string;
  name: string;
  category: "celebrity" | "movie" | "history" | "irish" | "sports" | "brazilian" | "fiction";
  categoryLabel: string;
  hints: string[]; // progressive hints if player is stuck
  difficulty: "easy" | "medium" | "hard";
}

export const WHO_AM_I_CHARACTERS: WhoAmICharacter[] = [
  // EASY — todo mundo conhece
  { id: "w1", name: "Donald Trump", category: "celebrity", categoryLabel: "🏛️ Politics", difficulty: "easy",
    hints: ["I'm American", "I was a president", "I'm known for my orange tan and golden hair"] },
  { id: "w2", name: "Cristiano Ronaldo", category: "sports", categoryLabel: "⚽ Sports", difficulty: "easy",
    hints: ["I'm an athlete", "I play football", "I'm from Portugal and known for my celebrations"] },
  { id: "w3", name: "Taylor Swift", category: "celebrity", categoryLabel: "🎤 Celebrity", difficulty: "easy",
    hints: ["I'm a singer", "I'm American", "I have many albums named after eras"] },
  { id: "w4", name: "Barack Obama", category: "celebrity", categoryLabel: "🏛️ Politics", difficulty: "easy",
    hints: ["I'm American", "I was a president", "I was the first Black president of the USA"] },
  { id: "w5", name: "Lionel Messi", category: "sports", categoryLabel: "⚽ Sports", difficulty: "easy",
    hints: ["I'm an athlete", "I play football", "I'm from Argentina and won the World Cup"] },
  { id: "w6", name: "Beyoncé", category: "celebrity", categoryLabel: "🎤 Celebrity", difficulty: "easy",
    hints: ["I'm a singer", "I'm American", "My husband is Jay-Z"] },
  { id: "w7", name: "Elon Musk", category: "celebrity", categoryLabel: "💼 Business", difficulty: "easy",
    hints: ["I'm a businessman", "I own X (formerly Twitter)", "I also make electric cars and rockets"] },
  { id: "w8", name: "Shakira", category: "celebrity", categoryLabel: "🎤 Celebrity", difficulty: "easy",
    hints: ["I'm a singer", "I'm Colombian", "I'm famous for my hips and belly dancing"] },
  // MEDIUM
  { id: "w9", name: "LeBron James", category: "sports", categoryLabel: "🏀 Sports", difficulty: "medium",
    hints: ["I'm an athlete", "I play basketball", "I'm considered one of the greatest NBA players ever"] },
  { id: "w10", name: "Neymar", category: "sports", categoryLabel: "⚽ Sports", difficulty: "medium",
    hints: ["I'm Brazilian", "I play football", "I'm known for my dribbling and... falling"] },
  { id: "w11", name: "Adele", category: "celebrity", categoryLabel: "🎤 Celebrity", difficulty: "medium",
    hints: ["I'm a singer", "I'm British", "I'm famous for powerful ballads like Hello and Someone Like You"] },
  { id: "w12", name: "Jeff Bezos", category: "celebrity", categoryLabel: "💼 Business", difficulty: "medium",
    hints: ["I'm a businessman", "I founded a huge online store", "I also have a space company called Blue Origin"] },
  { id: "w13", name: "Rihanna", category: "celebrity", categoryLabel: "🎤 Celebrity", difficulty: "medium",
    hints: ["I'm a singer", "I'm from Barbados", "I also have a famous makeup brand called Fenty"] },
  { id: "w14", name: "Nicki Minaj", category: "celebrity", categoryLabel: "🎤 Celebrity", difficulty: "medium",
    hints: ["I'm a rapper", "I'm from Trinidad", "I'm known for my colorful wigs and alter ego Roman"] },
  // HARD
  { id: "w15", name: "Freddie Mercury", category: "celebrity", categoryLabel: "🎤 Celebrity", difficulty: "hard",
    hints: ["I was a singer", "I'm no longer alive", "I was the lead singer of Queen"] },
  { id: "w16", name: "Michael Jackson", category: "celebrity", categoryLabel: "🎤 Celebrity", difficulty: "hard",
    hints: ["I was a singer", "I'm no longer alive", "I'm known as the King of Pop and for the moonwalk"] },
  { id: "w17", name: "Vladimir Putin", category: "celebrity", categoryLabel: "🏛️ Politics", difficulty: "hard",
    hints: ["I'm a political leader", "I'm from Russia", "I'm known for being in power for a very long time"] },
  { id: "w18", name: "Oprah Winfrey", category: "celebrity", categoryLabel: "📺 TV/Media", difficulty: "hard",
    hints: ["I'm American", "I'm a woman", "I had one of the most famous talk shows in history"] },

  // 🇧🇷 BRASILEIROS
  { id: "b1", name: "Pelé", category: "brazilian", categoryLabel: "🇧🇷 Brasileiro", difficulty: "easy",
    hints: ["I'm Brazilian", "I played football", "I'm considered the greatest footballer of all time"] },
  { id: "b2", name: "Xuxa", category: "brazilian", categoryLabel: "🇧🇷 Brasileiro", difficulty: "easy",
    hints: ["I'm Brazilian", "I'm a woman", "I was a famous TV presenter for children in the 80s and 90s"] },
  { id: "b3", name: "Lula", category: "brazilian", categoryLabel: "🇧🇷 Brasileiro", difficulty: "easy",
    hints: ["I'm Brazilian", "I'm a politician", "I've been president of Brazil more than once"] },
  { id: "b4", name: "Bolsonaro", category: "brazilian", categoryLabel: "🇧🇷 Brasileiro", difficulty: "easy",
    hints: ["I'm Brazilian", "I'm a politician", "I was president of Brazil and known for controversial statements"] },
  { id: "b5", name: "Silvio Santos", category: "brazilian", categoryLabel: "🇧🇷 Brasileiro", difficulty: "medium",
    hints: ["I'm Brazilian", "I'm a man", "I had a very long-running TV show on Sundays and said 'Vem pra cá!'"] },
  { id: "b6", name: "Ayrton Senna", category: "brazilian", categoryLabel: "🇧🇷 Brasileiro", difficulty: "medium",
    hints: ["I'm Brazilian", "I'm no longer alive", "I was a racing driver and Formula 1 world champion"] },
  { id: "b7", name: "Anitta", category: "brazilian", categoryLabel: "🇧🇷 Brasileiro", difficulty: "easy",
    hints: ["I'm Brazilian", "I'm a singer", "I'm known internationally for funk and pop music"] },
  { id: "b8", name: "Galvão Bueno", category: "brazilian", categoryLabel: "🇧🇷 Brasileiro", difficulty: "hard",
    hints: ["I'm Brazilian", "I'm a man", "I'm a sports commentator known for talking too much during broadcasts"] },

  // 🎬 SÉRIES & FILMES
  { id: "f1", name: "Walter White", category: "fiction", categoryLabel: "🎬 Série/Filme", difficulty: "easy",
    hints: ["I'm a fictional character", "I'm a chemistry teacher turned criminal", "My show is called Breaking Bad"] },
  { id: "f2", name: "Tony Stark", category: "fiction", categoryLabel: "🎬 Série/Filme", difficulty: "easy",
    hints: ["I'm a fictional character", "I'm a superhero", "I wear an iron suit and say 'I am Iron Man'"] },
  { id: "f3", name: "Hermione Granger", category: "fiction", categoryLabel: "🎬 Série/Filme", difficulty: "easy",
    hints: ["I'm a fictional character", "I'm a witch", "I'm the smartest friend of Harry Potter"] },
  { id: "f4", name: "Jack Sparrow", category: "fiction", categoryLabel: "🎬 Série/Filme", difficulty: "easy",
    hints: ["I'm a fictional character", "I'm a pirate", "I sail the seas in Pirates of the Caribbean"] },
  { id: "f5", name: "Darth Vader", category: "fiction", categoryLabel: "🎬 Série/Filme", difficulty: "easy",
    hints: ["I'm a fictional character", "I breathe very loudly", "I'm from Star Wars and I'm Luke's father"] },
  { id: "f6", name: "The Joker", category: "fiction", categoryLabel: "🎬 Série/Filme", difficulty: "medium",
    hints: ["I'm a fictional character", "I'm a villain", "I'm Batman's most famous enemy and I love chaos"] },
  { id: "f7", name: "Sherlock Holmes", category: "fiction", categoryLabel: "🎬 Série/Filme", difficulty: "medium",
    hints: ["I'm a fictional character", "I'm British", "I solve impossible mysteries with pure logic"] },
  { id: "f8", name: "Forrest Gump", category: "fiction", categoryLabel: "🎬 Série/Filme", difficulty: "medium",
    hints: ["I'm a fictional character", "I'm American", "I ran across America and said 'Life is like a box of chocolates'"] },
];

export const WHO_AM_I_CATEGORIES_EXTENDED = [
  { id: "all",       label: "🎲 Aleatório",      color: "#6c757d" },
  { id: "celebrity", label: "🎤 Celebrity",      color: "#e9c46a" },
  { id: "sports",    label: "⚽ Sports",         color: "#e76f51" },
  { id: "brazilian", label: "🇧🇷 Brasileiros",   color: "#009c3b" },
  { id: "fiction",   label: "🎬 Séries & Filmes", color: "#4cc9f0" },
];

export const WHO_AM_I_DRINK_RULES = [
  "Acertou em menos de 5 perguntas? Escolha alguém para beber! 🍺",
  "Usou mais de 8 perguntas? Você bebe! 😅",
  "Não acertou? Bebe e tenta de novo! 🍻",
  "Acertou em 3 perguntas ou menos? Todo mundo bebe! 🥂",
];

// ─── FINISH THE LYRICS ──────────────────────────────────────
export interface LyricsChallenge {
  id: string;
  song: string;
  artist: string;
  category: "80s" | "pop" | "irish" | "rock" | "classics";
  categoryLabel: string;
  verse: string;       // shown to player (with blank)
  answer: string;      // correct answer for the blank
  fullLine: string;    // full line for reveal
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

export const LYRICS_CHALLENGES: LyricsChallenge[] = [
  // IRISH / ST. PATRICK'S THEME
  {
    id: "l1", song: "Galway Girl", artist: "Ed Sheeran",
    category: "irish", categoryLabel: "🍀 Irish Hits", difficulty: "easy", points: 60,
    verse: "She played the fiddle in an Irish band\nBut she fell in love with an ___ man",
    answer: "English",
    fullLine: "She played the fiddle in an Irish band / But she fell in love with an English man",
  },
  {
    id: "l2", song: "Whiskey in the Jar", artist: "Thin Lizzy",
    category: "irish", categoryLabel: "🍀 Irish Hits", difficulty: "medium", points: 80,
    verse: "As I was going over the far-famous Kerry mountains\nI met with Captain Farrell and his ___ were shining",
    answer: "money",
    fullLine: "I met with Captain Farrell and his money was shining",
  },
  {
    id: "l3", song: "The Irish Rover", artist: "The Pogues & The Dubliners",
    category: "irish", categoryLabel: "🍀 Irish Hits", difficulty: "hard", points: 120,
    verse: "In the year of our Lord, eighteen hundred and six\nWe set sail from the ___ quay",
    answer: "Cobh",
    fullLine: "We set sail from the Cobh quay",
  },
  // POP
  {
    id: "l4", song: "Shake It Off", artist: "Taylor Swift",
    category: "pop", categoryLabel: "🎤 Pop Hits", difficulty: "easy", points: 50,
    verse: "I stay out too late\nGot nothing in my ___\nI go on too many dates",
    answer: "brain",
    fullLine: "Got nothing in my brain",
  },
  {
    id: "l5", song: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars",
    category: "pop", categoryLabel: "🎤 Pop Hits", difficulty: "easy", points: 50,
    verse: "Don't believe me, just ___\nDon't believe me, just watch",
    answer: "watch",
    fullLine: "Don't believe me, just watch",
  },
  {
    id: "l6", song: "Blinding Lights", artist: "The Weeknd",
    category: "pop", categoryLabel: "🎤 Pop Hits", difficulty: "medium", points: 70,
    verse: "I've been running through the night\nAnd I just can't stop calling your ___",
    answer: "name",
    fullLine: "And I just can't stop calling your name",
  },
  // 80s CLASSICS
  {
    id: "l7", song: "Don't Stop Believin'", artist: "Journey",
    category: "80s", categoryLabel: "🎸 80s Classics", difficulty: "easy", points: 60,
    verse: "Just a small town girl\nLiving in a ___ world",
    answer: "lonely",
    fullLine: "Living in a lonely world",
  },
  {
    id: "l8", song: "Sweet Child O' Mine", artist: "Guns N' Roses",
    category: "80s", categoryLabel: "🎸 80s Classics", difficulty: "medium", points: 80,
    verse: "She's got a smile that it seems to me\nReminds me of ___ memories",
    answer: "childhood",
    fullLine: "Reminds me of childhood memories",
  },
  {
    id: "l9", song: "Livin' on a Prayer", artist: "Bon Jovi",
    category: "80s", categoryLabel: "🎸 80s Classics", difficulty: "easy", points: 60,
    verse: "Whoa, we're halfway there\nWhoa, livin' on a ___",
    answer: "prayer",
    fullLine: "Whoa, livin' on a prayer",
  },
  // ROCK
  {
    id: "l10", song: "Bohemian Rhapsody", artist: "Queen",
    category: "rock", categoryLabel: "🤘 Rock", difficulty: "medium", points: 80,
    verse: "Is this the real life?\nIs this just ___?",
    answer: "fantasy",
    fullLine: "Is this just fantasy?",
  },
  {
    id: "l11", song: "Mr. Brightside", artist: "The Killers",
    category: "rock", categoryLabel: "🤘 Rock", difficulty: "hard", points: 100,
    verse: "Coming out of my cage\nAnd I've been doing just ___",
    answer: "fine",
    fullLine: "And I've been doing just fine",
  },
  {
    id: "l12", song: "With or Without You", artist: "U2",
    category: "irish", categoryLabel: "🍀 Irish Hits", difficulty: "medium", points: 80,
    verse: "See the stone set in your eyes\nSee the thorn twist in your ___",
    answer: "side",
    fullLine: "See the thorn twist in your side",
  },
];

export const LYRICS_CATEGORIES = [
  { id: "all",     label: "🎲 Aleatório",     color: "#6c757d" },
  { id: "irish",   label: "🍀 Irish Hits",    color: "#40916c" },
  { id: "pop",     label: "🎤 Pop Hits",      color: "#e9c46a" },
  { id: "80s",     label: "🎸 80s Classics",  color: "#e76f51" },
  { id: "rock",    label: "🤘 Rock",          color: "#9b2226" },
];
