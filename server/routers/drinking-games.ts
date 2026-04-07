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
  // EASY — novos
  {
    id: "tt13",
    text: "Betty Botter bought some butter, but the butter was bitter.",
    level: "easy",
    tip: "Focus on the 'b' and 'tt' sounds — don't rush!",
    irishTheme: false,
  },
  {
    id: "tt14",
    text: "I saw Susie sitting in a shoeshine shop.",
    level: "easy",
    tip: "'sh' vs 's' again — classic English trap!",
    irishTheme: false,
  },
  {
    id: "tt15",
    text: "Shamrocks shimmer, shamrocks shine, seven shiny shamrocks shine.",
    level: "easy",
    tip: "Pure St. Patrick's! Keep the 'sh' crisp and bright.",
    irishTheme: true,
  },
  // MEDIUM — novos
  {
    id: "tt16",
    text: "A proper copper coffee pot.",
    level: "medium",
    tip: "Short but deadly. Say it 5 times fast!",
    irishTheme: false,
  },
  {
    id: "tt17",
    text: "Can you can a can as a canner can can a can?",
    level: "medium",
    tip: "The word 'can' has 3 different meanings here. Mind = blown!",
    irishTheme: false,
  },
  {
    id: "tt18",
    text: "Eleven benevolent elephants.",
    level: "medium",
    tip: "Sounds easy? Try it 3x fast. The 'el' and 'en' will get you!",
    irishTheme: false,
  },
  {
    id: "tt19",
    text: "Clancy's fancy dancing in County Clare.",
    level: "medium",
    tip: "Irish county name! The 'cl', 'fl' and 'nc' blend is tricky.",
    irishTheme: true,
  },
  // HARD — novos
  {
    id: "tt20",
    text: "Whether the weather is warm, whether the weather is hot, we have to put up with the weather, whether we like it or not.",
    level: "hard",
    tip: "'Whether' vs 'weather' — sounds identical but means different things!",
    irishTheme: false,
  },
  {
    id: "tt21",
    text: "Unique New York, unique New York, you know you need unique New York.",
    level: "hard",
    tip: "The 'ny' and 'un' sounds will trip you up at speed!",
    irishTheme: false,
  },
  {
    id: "tt22",
    text: "The great Greek grape growers grow great Greek grapes.",
    level: "hard",
    tip: "'Gr' cluster overload! Keep each word distinct.",
    irishTheme: false,
  },
  {
    id: "tt23",
    text: "Galway girls giggle gleefully, giving green gifts generously.",
    level: "hard",
    tip: "All 'G' sounds — very Irish! Say it like you're at a Galway pub.",
    irishTheme: true,
  },
  // INSANE — novos
  {
    id: "tt24",
    text: "Brisk brave brigadiers brandished broad bright blades, blunderbusses, and bludgeons.",
    level: "insane",
    tip: "'Br' and 'bl' clusters back to back. This is a tongue workout!",
    irishTheme: false,
  },
  {
    id: "tt25",
    text: "Through three cheese trees three free fleas flew.",
    level: "insane",
    tip: "'Thr', 'fr', 'fl' — three different clusters in one sentence. Brutal!",
    irishTheme: false,
  },
  {
    id: "tt26",
    text: "Six sick hicks nick six slick bricks with picks and sticks.",
    level: "insane",
    tip: "Short vowels + consonant clusters. Say it 3x fast if you dare! ☠️",
    irishTheme: false,
  },
  {
    id: "tt27",
    text: "St. Patrick's prickly shamrocks pricked Patrick's thick wrist thrice.",
    level: "insane",
    tip: "'Pr', 'thr', 'ck' — and it's Irish themed! The ultimate St. Patrick's challenge! ☘️☠️",
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

  // MEDIUM — novos
  { id: "w19", name: "Lady Gaga", category: "celebrity", categoryLabel: "🎤 Celebrity", difficulty: "medium",
    hints: ["I'm a singer", "I'm American", "I wore a dress made of meat and starred in A Star Is Born"] },
  { id: "w20", name: "Kylian Mbappé", category: "sports", categoryLabel: "⚽ Sports", difficulty: "medium",
    hints: ["I'm an athlete", "I play football", "I'm French and one of the fastest players in the world"] },
  { id: "w21", name: "Kim Kardashian", category: "celebrity", categoryLabel: "🎤 Celebrity", difficulty: "medium",
    hints: ["I'm American", "I'm a woman", "I'm famous for reality TV and my family has a show called Keeping Up with the Kardashians"] },
  { id: "w22", name: "Dwayne Johnson", category: "celebrity", categoryLabel: "🎥 Actor", difficulty: "medium",
    hints: ["I'm American", "I'm an actor", "I was a wrestler called The Rock before becoming a movie star"] },
  { id: "w23", name: "Billie Eilish", category: "celebrity", categoryLabel: "🎤 Celebrity", difficulty: "medium",
    hints: ["I'm a singer", "I'm American", "I sang the James Bond theme 'No Time to Die' and I'm known for my green hair"] },
  { id: "w24", name: "Serena Williams", category: "sports", categoryLabel: "🎾 Sports", difficulty: "medium",
    hints: ["I'm an athlete", "I play tennis", "I'm considered the greatest female tennis player of all time"] },
  // HARD — novos
  { id: "w25", name: "Nelson Mandela", category: "celebrity", categoryLabel: "🏦 History", difficulty: "hard",
    hints: ["I'm no longer alive", "I was a political leader", "I was imprisoned for 27 years and became president of South Africa"] },
  { id: "w26", name: "Albert Einstein", category: "celebrity", categoryLabel: "🔬 Science", difficulty: "hard",
    hints: ["I'm no longer alive", "I was a scientist", "I created the theory of relativity and the formula E=mc²"] },
  { id: "w27", name: "Marilyn Monroe", category: "celebrity", categoryLabel: "🎥 Actor", difficulty: "hard",
    hints: ["I'm no longer alive", "I was an actress", "I sang 'Happy Birthday' to President Kennedy and was married to Joe DiMaggio"] },
  { id: "w28", name: "Steve Jobs", category: "celebrity", categoryLabel: "💻 Tech", difficulty: "hard",
    hints: ["I'm no longer alive", "I was a businessman", "I co-founded Apple and introduced the iPhone to the world"] },

  // 🇮🇪 IRISH — especiais para a noite
  { id: "i1", name: "Bono", category: "irish", categoryLabel: "☘️ Irish", difficulty: "medium",
    hints: ["I'm Irish", "I'm a singer", "I'm the lead singer of U2 and known for my sunglasses"] },
  { id: "i2", name: "Cillian Murphy", category: "irish", categoryLabel: "☘️ Irish", difficulty: "hard",
    hints: ["I'm Irish", "I'm an actor", "I play Tommy Shelby in Peaky Blinders"] },
  { id: "i3", name: "Colin Farrell", category: "irish", categoryLabel: "☘️ Irish", difficulty: "hard",
    hints: ["I'm Irish", "I'm an actor", "I starred in The Banshees of Inisherin and won a Golden Globe"] },
  { id: "i4", name: "Ed Sheeran", category: "irish", categoryLabel: "☘️ Irish", difficulty: "easy",
    hints: ["I'm a singer", "I'm British but love Ireland", "I sang Galway Girl and Shape of You"] },

  // 🇮🇪 BRASILEIROS — novos
  { id: "b9", name: "Robinho", category: "brazilian", categoryLabel: "🇮🇪🇧🇷 Brasileiro", difficulty: "hard",
    hints: ["I'm Brazilian", "I played football", "I was once the most expensive player in the world when I moved to Manchester City"] },
  { id: "b10", name: "Gugu Liberato", category: "brazilian", categoryLabel: "🇮🇪🇧🇷 Brasileiro", difficulty: "hard",
    hints: ["I'm Brazilian", "I'm no longer alive", "I was a famous TV presenter known for crazy stunts and games"] },
  { id: "b11", name: "Caetano Veloso", category: "brazilian", categoryLabel: "🇮🇪🇧🇷 Brasileiro", difficulty: "hard",
    hints: ["I'm Brazilian", "I'm a musician", "I'm one of the founders of Tropicália movement in Brazilian music"] },
  { id: "b12", name: "Ivete Sangalo", category: "brazilian", categoryLabel: "🇮🇪🇧🇷 Brasileiro", difficulty: "medium",
    hints: ["I'm Brazilian", "I'm a singer", "I'm from Bahia and famous for axé music and my energy on stage"] },

  // 🎥 SÉRIES & FILMES — novos
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
  { id: "f8", name: "Forrest Gump", category: "fiction", categoryLabel: "🎥 Série/Filme", difficulty: "medium",
    hints: ["I'm a fictional character", "I'm American", "I ran across America and said 'Life is like a box of chocolates'"] },
  // Séries & Filmes — novos
  { id: "f9", name: "Jon Snow", category: "fiction", categoryLabel: "🎥 Série/Filme", difficulty: "medium",
    hints: ["I'm a fictional character", "I'm in a fantasy series", "I know nothing, according to a famous line in Game of Thrones"] },
  { id: "f10", name: "Homer Simpson", category: "fiction", categoryLabel: "🎥 Série/Filme", difficulty: "easy",
    hints: ["I'm a fictional character", "I'm a cartoon", "I love donuts and beer and say 'D'oh!'"] },
  { id: "f11", name: "James Bond", category: "fiction", categoryLabel: "🎥 Série/Filme", difficulty: "easy",
    hints: ["I'm a fictional character", "I'm a British spy", "I introduce myself as 'Bond, James Bond'"] },
  { id: "f12", name: "Elsa", category: "fiction", categoryLabel: "🎥 Série/Filme", difficulty: "easy",
    hints: ["I'm a fictional character", "I'm a princess", "I have ice powers and sang 'Let It Go' in Frozen"] },
  { id: "f13", name: "Tyrion Lannister", category: "fiction", categoryLabel: "🎥 Série/Filme", difficulty: "hard",
    hints: ["I'm a fictional character", "I'm in Game of Thrones", "I'm a dwarf known for drinking wine and being very clever"] },
  { id: "f14", name: "Michael Scott", category: "fiction", categoryLabel: "🎥 Série/Filme", difficulty: "hard",
    hints: ["I'm a fictional character", "I'm the boss of a paper company", "I'm from The Office and I say 'That's what she said'"] },
  { id: "f15", name: "SpongeBob", category: "fiction", categoryLabel: "🎥 Série/Filme", difficulty: "easy",
    hints: ["I'm a fictional character", "I'm a cartoon", "I live under the sea in Bikini Bottom and work at the Krusty Krab"] },
  { id: "f16", name: "Indiana Jones", category: "fiction", categoryLabel: "🎥 Série/Filme", difficulty: "medium",
    hints: ["I'm a fictional character", "I'm an archaeologist and adventurer", "I'm afraid of snakes and wear a famous hat"] },
];

export const WHO_AM_I_CATEGORIES_EXTENDED = [
  { id: "all",       label: "🎲 Aleatório",        color: "#6c757d" },
  { id: "celebrity", label: "🎤 Celebrity",        color: "#e9c46a" },
  { id: "sports",    label: "⚽ Sports",           color: "#e76f51" },
  { id: "brazilian", label: "🇧🇷 Brasileiros",     color: "#009c3b" },
  { id: "fiction",   label: "🎥 Séries & Filmes",  color: "#4cc9f0" },
  { id: "irish",     label: "☘️ Irish Special",   color: "#40916c" },
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
  difficulty: "easy" | "medium" | "hard" | "insane";
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
  // IRISH — novos
  {
    id: "l13", song: "Sunday Bloody Sunday", artist: "U2",
    category: "irish", categoryLabel: "🍀 Irish Hits", difficulty: "hard", points: 130,
    verse: "I can't believe the news today\nOh, I can't close my ___ and make it go away",
    answer: "eyes",
    fullLine: "Oh, I can't close my eyes and make it go away",
  },
  {
    id: "l14", song: "Zombie", artist: "The Cranberries",
    category: "irish", categoryLabel: "🍀 Irish Hits", difficulty: "hard", points: 130,
    verse: "Another head hangs lowly\nChild is slowly ___",
    answer: "taken",
    fullLine: "Child is slowly taken",
  },
  {
    id: "l15", song: "Fairytale of New York", artist: "The Pogues ft. Kirsty MacColl",
    category: "irish", categoryLabel: "🍀 Irish Hits", difficulty: "insane", points: 200,
    verse: "It was Christmas Eve babe\nIn the ___ on Broadway",
    answer: "drunk tank",
    fullLine: "In the drunk tank on Broadway",
  },
  // POP — novos
  {
    id: "l16", song: "Bad Guy", artist: "Billie Eilish",
    category: "pop", categoryLabel: "🎤 Pop Hits", difficulty: "medium", points: 80,
    verse: "White shirt now red, my bloody nose\n___ on your tippy toes",
    answer: "Sleeping",
    fullLine: "Sleeping on your tippy toes",
  },
  {
    id: "l17", song: "Shape of You", artist: "Ed Sheeran",
    category: "pop", categoryLabel: "🎤 Pop Hits", difficulty: "easy", points: 50,
    verse: "I'm in love with the shape of ___\nWe push and pull like a magnet do",
    answer: "you",
    fullLine: "I'm in love with the shape of you",
  },
  {
    id: "l18", song: "Flowers", artist: "Miley Cyrus",
    category: "pop", categoryLabel: "🎤 Pop Hits", difficulty: "easy", points: 50,
    verse: "I can buy myself ___\nI can hold my own hand",
    answer: "flowers",
    fullLine: "I can buy myself flowers",
  },
  {
    id: "l19", song: "As It Was", artist: "Harry Styles",
    category: "pop", categoryLabel: "🎤 Pop Hits", difficulty: "medium", points: 75,
    verse: "Holdin' me back\nGravity's holdin' me back\nI want you to hold ___ tonight",
    answer: "out",
    fullLine: "I want you to hold out tonight",
  },
  // 80s — novos
  {
    id: "l20", song: "Take On Me", artist: "a-ha",
    category: "80s", categoryLabel: "🎸 80s Classics", difficulty: "easy", points: 60,
    verse: "Take on me, take me on\nI'll be ___ in a day or two",
    answer: "gone",
    fullLine: "I'll be gone in a day or two",
  },
  {
    id: "l21", song: "Girls Just Want to Have Fun", artist: "Cyndi Lauper",
    category: "80s", categoryLabel: "🎸 80s Classics", difficulty: "easy", points: 60,
    verse: "I come home in the morning light\nMy mother says when you gonna live your life ___",
    answer: "right",
    fullLine: "My mother says when you gonna live your life right",
  },
  {
    id: "l22", song: "Africa", artist: "Toto",
    category: "80s", categoryLabel: "🎸 80s Classics", difficulty: "hard", points: 110,
    verse: "I stopped an old man along the way\nHoping to find some long ___ words",
    answer: "forgotten",
    fullLine: "Hoping to find some long forgotten words",
  },
  // ROCK — novos
  {
    id: "l23", song: "Smells Like Teen Spirit", artist: "Nirvana",
    category: "rock", categoryLabel: "🤘 Rock", difficulty: "medium", points: 90,
    verse: "Load up on guns, bring your ___\nIt's fun to lose and to pretend",
    answer: "friends",
    fullLine: "Load up on guns, bring your friends",
  },
  {
    id: "l24", song: "We Will Rock You", artist: "Queen",
    category: "rock", categoryLabel: "🤘 Rock", difficulty: "easy", points: 50,
    verse: "Buddy you're a boy make a big ___\nShouting in the street gonna be a big man someday",
    answer: "noise",
    fullLine: "Buddy you're a boy make a big noise",
  },
  {
    id: "l25", song: "Highway to Hell", artist: "AC/DC",
    category: "rock", categoryLabel: "🤘 Rock", difficulty: "easy", points: 60,
    verse: "Living easy, living free\nSeason ticket on a ___ ride",
    answer: "one-way",
    fullLine: "Season ticket on a one-way ride",
  },
  {
    id: "l26", song: "November Rain", artist: "Guns N' Roses",
    category: "rock", categoryLabel: "🤘 Rock", difficulty: "hard", points: 120,
    verse: "When I look into your eyes\nI can see a love ___ by time",
    answer: "restrained",
    fullLine: "I can see a love restrained by time",
  },
];

// ─── FORFAITS EM INGLÊS ─────────────────────────────────────
// Alternativa para quem não bebe — desafios em inglês
export const ENGLISH_FORFEITS = [
  { id: "f1", text: "Say 'She sells seashells by the seashore' 3 times fast!", emoji: "🌊" },
  { id: "f2", text: "Sing the first verse of 'Happy Birthday' in an Irish accent!", emoji: "🎂" },
  { id: "f3", text: "Say 'I love Irish music and green beer!' with your best Irish accent!", emoji: "🍀" },
  { id: "f4", text: "Introduce yourself as if you're from Dublin — full Irish accent!", emoji: "🏰" },
  { id: "f5", text: "Say 5 words that rhyme with 'green' as fast as you can!", emoji: "🟢" },
  { id: "f6", text: "Do your best impression of a leprechaun saying 'You'll never catch me lucky charms!'", emoji: "☘️" },
  { id: "f7", text: "Say the alphabet backwards — you have 30 seconds!", emoji: "🔤" },
  { id: "f8", text: "Tell us one thing you love about learning English — in English!", emoji: "💚" },
  { id: "f9", text: "Describe your day in English using only 10 words!", emoji: "📅" },
  { id: "f10", text: "Say 'Irish wristwatch, Swiss wristwatch' 5 times without stopping!", emoji: "⌚" },
];

export const LYRICS_CATEGORIES = [
  { id: "all",     label: "🎲 Aleatório",     color: "#6c757d" },
  { id: "irish",   label: "🍀 Irish Hits",    color: "#40916c" },
  { id: "pop",     label: "🎤 Pop Hits",      color: "#e9c46a" },
  { id: "80s",     label: "🎸 80s Classics",  color: "#e76f51" },
  { id: "rock",    label: "🤘 Rock",          color: "#9b2226" },
];

// ─── KIDS CONTENT ───────────────────────────────────────────
// Versão Kids — sem álcool, forfaits divertidos, personagens de desenho

export interface KidsTongueTwister {
  id: string;
  text: string;
  level: "super_easy" | "easy" | "medium";
  tip: string;
  emoji: string;
}

export const KIDS_TONGUE_TWISTERS: KidsTongueTwister[] = [
  // SUPER EASY
  { id: "k1", text: "Big black bug.", level: "super_easy", tip: "Say it 3 times fast!", emoji: "🐛" },
  { id: "k2", text: "Toy boat. Toy boat. Toy boat.", level: "super_easy", tip: "Don't say 'toy vote'!", emoji: "⛵" },
  { id: "k3", text: "Red bed. Red bed. Red bed.", level: "super_easy", tip: "Speed it up each time!", emoji: "🛏️" },
  { id: "k4", text: "Six sick sheep.", level: "super_easy", tip: "Focus on the 's' sound!", emoji: "🐑" },
  { id: "k5", text: "Unique New York.", level: "super_easy", tip: "Say it 5 times — harder than it looks!", emoji: "🗽" },
  // EASY
  { id: "k6", text: "I saw a kitten eating chicken in the kitchen.", level: "easy", tip: "Listen for the 'k' sounds!", emoji: "🐱" },
  { id: "k7", text: "A proper copper coffee pot.", level: "easy", tip: "The 'p' and 'c' sounds are tricky!", emoji: "☕" },
  { id: "k8", text: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.", level: "easy", tip: "Say it as fast as you can!", emoji: "🐻" },
  { id: "k9", text: "A big black bear sat on a big black rug.", level: "easy", tip: "All the 'b' sounds — don't mix them up!", emoji: "🐾" },
  { id: "k10", text: "Green glass globes glow greenly.", level: "easy", tip: "St. Patrick's green! Keep the 'gl' crisp.", emoji: "🟢" },
  // MEDIUM
  { id: "k11", text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?", level: "medium", tip: "The 'w' and 'ch' sounds — say it slowly first!", emoji: "🪵" },
  { id: "k12", text: "She sells seashells by the seashore.", level: "medium", tip: "Focus on 'sh' vs 's' — they're different!", emoji: "🐚" },
  { id: "k13", text: "Peter Piper picked a peck of pickled peppers.", level: "medium", tip: "Explosive 'p' sounds — don't spray anyone! 😄", emoji: "🌶️" },
  { id: "k14", text: "I scream, you scream, we all scream for ice cream!", level: "medium", tip: "Say it like you really want ice cream!", emoji: "🍦" },
  { id: "k15", text: "Betty Botter bought some butter, but the butter was bitter.", level: "medium", tip: "All the 'b' sounds — go slow then fast!", emoji: "🧈" },
];

export interface KidsCharacter {
  id: string;
  name: string;
  category: "cartoon" | "superhero" | "animal" | "movie";
  difficulty: "easy" | "medium";
  hints: string[];
  emoji: string;
}

export const KIDS_CHARACTERS: KidsCharacter[] = [
  // CARTOON
  { id: "kc1", name: "SpongeBob", category: "cartoon", difficulty: "easy", emoji: "🧽",
    hints: ["I live under the sea", "I work at a restaurant", "My best friend is a pink starfish"] },
  { id: "kc2", name: "Mickey Mouse", category: "cartoon", difficulty: "easy", emoji: "🐭",
    hints: ["I have big round ears", "I live in a magical place", "I wear white gloves"] },
  { id: "kc3", name: "Peppa Pig", category: "cartoon", difficulty: "easy", emoji: "🐷",
    hints: ["I love jumping in muddy puddles", "I have a little brother named George", "I am a pink pig"] },
  { id: "kc4", name: "Bluey", category: "cartoon", difficulty: "easy", emoji: "🐕",
    hints: ["I am a blue dog from Australia", "I love playing games with my family", "My sister is called Bingo"] },
  { id: "kc5", name: "Paw Patrol — Chase", category: "cartoon", difficulty: "easy", emoji: "🚔",
    hints: ["I am a police dog", "I wear a blue uniform", "I am part of a rescue team"] },
  { id: "kc6", name: "Elsa", category: "movie", difficulty: "easy", emoji: "❄️",
    hints: ["I can make ice and snow", "I have a sister named Anna", "I sing 'Let It Go'"] },
  { id: "kc7", name: "Moana", category: "movie", difficulty: "easy", emoji: "🌊",
    hints: ["I love the ocean", "I am a princess from a Pacific island", "I go on a big adventure"] },
  { id: "kc8", name: "Simba", category: "movie", difficulty: "easy", emoji: "🦁",
    hints: ["I am a lion cub", "My dad is the king", "I grow up to be king of the Pride Lands"] },
  // SUPERHERO
  { id: "kc9", name: "Spider-Man", category: "superhero", difficulty: "easy", emoji: "🕷️",
    hints: ["I shoot webs", "I swing between buildings", "I was bitten by a spider"] },
  { id: "kc10", name: "Batman", category: "superhero", difficulty: "easy", emoji: "🦇",
    hints: ["I wear a black cape", "I live in a cave", "I don't have superpowers — just gadgets"] },
  { id: "kc11", name: "Wonder Woman", category: "superhero", difficulty: "easy", emoji: "⭐",
    hints: ["I have a golden lasso", "I am a princess from an island of warriors", "I fight for truth and justice"] },
  { id: "kc12", name: "Iron Man", category: "superhero", difficulty: "medium", emoji: "🤖",
    hints: ["I wear a red and gold suit", "I am a genius inventor", "My real name is Tony"] },
  // ANIMAL CHARACTERS
  { id: "kc13", name: "Dumbo", category: "animal", difficulty: "easy", emoji: "🐘",
    hints: ["I am an elephant", "I can fly", "My big ears are my superpower"] },
  { id: "kc14", name: "Nemo", category: "movie", difficulty: "easy", emoji: "🐠",
    hints: ["I am a little orange fish", "My dad travels across the ocean to find me", "I live in a coral reef"] },
  { id: "kc15", name: "Pikachu", category: "cartoon", difficulty: "easy", emoji: "⚡",
    hints: ["I am yellow and small", "I can produce electricity", "I say my own name when I talk"] },
  { id: "kc16", name: "Shrek", category: "movie", difficulty: "medium", emoji: "🟢",
    hints: ["I am a big green creature", "I live in a swamp", "I have a donkey as my best friend"] },
  { id: "kc17", name: "Woody", category: "movie", difficulty: "medium", emoji: "🤠",
    hints: ["I am a cowboy toy", "I have a pull-string on my back", "My best friend is a space ranger"] },
  { id: "kc18", name: "Buzz Lightyear", category: "movie", difficulty: "medium", emoji: "🚀",
    hints: ["I am a space ranger toy", "My catchphrase is 'To infinity and beyond!'", "I have wings that pop out"] },
];

export interface KidsSong {
  id: string;
  title: string;
  artist: string;
  verse: string;
  answer: string;
  fullLine: string;
  difficulty: "easy" | "medium";
  emoji: string;
}

export const KIDS_SONGS: KidsSong[] = [
  { id: "ks1", title: "Let It Go", artist: "Frozen", emoji: "❄️", difficulty: "easy",
    verse: "Let it go, let it go\nCan't hold it ___ anymore",
    answer: "back", fullLine: "Can't hold it back anymore" },
  { id: "ks2", title: "Happy", artist: "Pharrell Williams", emoji: "😊", difficulty: "easy",
    verse: "Because I'm happy\nClap along if you feel like a ___ without a roof",
    answer: "room", fullLine: "Clap along if you feel like a room without a roof" },
  { id: "ks3", title: "You've Got a Friend in Me", artist: "Toy Story", emoji: "🤠", difficulty: "easy",
    verse: "You've got a friend in me\nYou've got a friend in ___",
    answer: "me", fullLine: "You've got a friend in me" },
  { id: "ks4", title: "Under the Sea", artist: "The Little Mermaid", emoji: "🐠", difficulty: "easy",
    verse: "Under the sea\nUnder the sea\nDarling it's ___, down where it's wet",
    answer: "better", fullLine: "Darling it's better, down where it's wet" },
  { id: "ks5", title: "Can't Stop the Feeling", artist: "Justin Timberlake", emoji: "🕺", difficulty: "easy",
    verse: "I got that sunshine in my pocket\nGot that good soul in my ___",
    answer: "feet", fullLine: "Got that good soul in my feet" },
  { id: "ks6", title: "Roar", artist: "Katy Perry", emoji: "🦁", difficulty: "easy",
    verse: "I used to bite my tongue and hold my breath\nScared to rock the boat and make a ___",
    answer: "mess", fullLine: "Scared to rock the boat and make a mess" },
  { id: "ks7", title: "What Does the Fox Say?", artist: "Ylvis", emoji: "🦊", difficulty: "easy",
    verse: "Dog goes woof, cat goes meow\nBird goes tweet and mouse goes ___",
    answer: "squeak", fullLine: "Bird goes tweet and mouse goes squeak" },
  { id: "ks8", title: "Baby Shark", artist: "Pinkfong", emoji: "🦈", difficulty: "easy",
    verse: "Baby shark, doo doo doo\nMommy shark, doo doo ___",
    answer: "doo", fullLine: "Mommy shark, doo doo doo" },
  { id: "ks9", title: "Surface Pressure", artist: "Encanto", emoji: "💪", difficulty: "medium",
    verse: "Under the surface\nI hide my ___ and I grin",
    answer: "nerves", fullLine: "I hide my nerves and I grin" },
  { id: "ks10", title: "We Don't Talk About Bruno", artist: "Encanto", emoji: "🎭", difficulty: "medium",
    verse: "We don't talk about Bruno, no, no, no\nWe don't talk about ___",
    answer: "Bruno", fullLine: "We don't talk about Bruno" },
  { id: "ks11", title: "Into the Unknown", artist: "Frozen 2", emoji: "🌌", difficulty: "medium",
    verse: "Into the unknown\nInto the ___",
    answer: "unknown", fullLine: "Into the unknown" },
  { id: "ks12", title: "How Far I'll Go", artist: "Moana", emoji: "🌊", difficulty: "medium",
    verse: "I've been staring at the edge of the water\n'Long as I can remember, never really ___",
    answer: "knowing", fullLine: "'Long as I can remember, never really knowing why" },
];

export const KIDS_FORFEITS = [
  { id: "kf1", text: "Jump 10 times while saying 'I love English!'", emoji: "🦘" },
  { id: "kf2", text: "Make a funny face for 10 seconds!", emoji: "😜" },
  { id: "kf3", text: "Do your best animal impression — the group guesses what animal!", emoji: "🐾" },
  { id: "kf4", text: "Spin around 3 times and say 'Shamrock!' without falling!", emoji: "☘️" },
  { id: "kf5", text: "Say 'I am a lucky leprechaun!' in your silliest voice!", emoji: "🎩" },
  { id: "kf6", text: "Do 5 star jumps while counting in English: one, two, three, four, five!", emoji: "⭐" },
  { id: "kf7", text: "Teach everyone one word in English that you know!", emoji: "📚" },
  { id: "kf8", text: "Roar like a lion 3 times — louder each time!", emoji: "🦁" },
  { id: "kf9", text: "Do a silly dance for 10 seconds!", emoji: "🕺" },
  { id: "kf10", text: "Say the colors of the rainbow in English as fast as you can!", emoji: "🌈" },
];

export const KIDS_CHARACTER_CATEGORIES = [
  { id: "all", label: "🎲 All Characters", color: "#6c757d" },
  { id: "cartoon", label: "📺 Cartoons", color: "#4cc9f0" },
  { id: "superhero", label: "🦸 Superheroes", color: "#f72585" },
  { id: "movie", label: "🎬 Movies", color: "#7209b7" },
  { id: "animal", label: "🐾 Animals", color: "#06d6a0" },
];
