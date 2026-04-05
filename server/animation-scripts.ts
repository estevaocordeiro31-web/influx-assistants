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