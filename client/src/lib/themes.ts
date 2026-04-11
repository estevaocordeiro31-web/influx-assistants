// Full theme system for ImAInd TUTOR
// 5 book themes (unlocked by starting the book) + 11 special themes (unlocked by achievements)

export interface AppTheme {
  id: string;
  name: string;
  category: 'book' | 'special';
  gradient: string;
  primary: string;
  secondary: string;
  accent: string;
  unlockCondition: string;
  unlockDescription: string;
  icon: string;
}

export const ALL_THEMES: AppTheme[] = [
  // === Book themes (unlocked by starting the book) ===
  {
    id: 'book-1',
    name: 'Beginner Green',
    category: 'book',
    gradient: 'linear-gradient(135deg, #365314, #4d7c0f, #65a30d)',
    primary: '#84cc16',
    secondary: '#a3e635',
    accent: '#ecfccb',
    unlockCondition: 'book:1',
    unlockDescription: 'Comece o Book 1',
    icon: '🌱',
  },
  {
    id: 'book-2',
    name: 'Elementary Sky',
    category: 'book',
    gradient: 'linear-gradient(135deg, #0c4a6e, #0369a1, #0284c7)',
    primary: '#38bdf8',
    secondary: '#7dd3fc',
    accent: '#e0f2fe',
    unlockCondition: 'book:2',
    unlockDescription: 'Comece o Book 2',
    icon: '💧',
  },
  {
    id: 'book-3',
    name: 'Intermediate Purple',
    category: 'book',
    gradient: 'linear-gradient(135deg, #581c87, #7e22ce, #9333ea)',
    primary: '#a855f7',
    secondary: '#c084fc',
    accent: '#f3e8ff',
    unlockCondition: 'book:3',
    unlockDescription: 'Comece o Book 3',
    icon: '🔮',
  },
  {
    id: 'book-4',
    name: 'Upper Fire',
    category: 'book',
    gradient: 'linear-gradient(135deg, #7c2d12, #c2410c, #ea580c)',
    primary: '#f97316',
    secondary: '#fb923c',
    accent: '#fff7ed',
    unlockCondition: 'book:4',
    unlockDescription: 'Comece o Book 4',
    icon: '🔥',
  },
  {
    id: 'book-5',
    name: 'Advanced Red',
    category: 'book',
    gradient: 'linear-gradient(135deg, #7f1d1d, #991b1b, #dc2626)',
    primary: '#dc2626',
    secondary: '#f87171',
    accent: '#fef2f2',
    unlockCondition: 'book:5',
    unlockDescription: 'Comece o Book 5',
    icon: '🏆',
  },

  // === Special themes (unlocked by achievements) ===
  {
    id: 'streak-7',
    name: 'Sunrise Streak',
    category: 'special',
    gradient: 'linear-gradient(135deg, #92400e, #d97706, #fbbf24)',
    primary: '#f59e0b',
    secondary: '#fbbf24',
    accent: '#fef3c7',
    unlockCondition: 'streak:7',
    unlockDescription: '7 dias de streak',
    icon: '🌅',
  },
  {
    id: 'streak-30',
    name: 'Golden Flame',
    category: 'special',
    gradient: 'linear-gradient(135deg, #78350f, #b45309, #f59e0b)',
    primary: '#eab308',
    secondary: '#facc15',
    accent: '#fef9c3',
    unlockCondition: 'streak:30',
    unlockDescription: '30 dias de streak',
    icon: '🔥',
  },
  {
    id: 'hours-50',
    name: 'Ocean Deep',
    category: 'special',
    gradient: 'linear-gradient(135deg, #164e63, #0e7490, #06b6d4)',
    primary: '#06b6d4',
    secondary: '#22d3ee',
    accent: '#cffafe',
    unlockCondition: 'hours:50',
    unlockDescription: '50 horas de estudo',
    icon: '🌊',
  },
  {
    id: 'hours-100',
    name: 'Aurora Borealis',
    category: 'special',
    gradient: 'linear-gradient(135deg, #134e4a, #0d9488, #2dd4bf)',
    primary: '#14b8a6',
    secondary: '#5eead4',
    accent: '#ccfbf1',
    unlockCondition: 'hours:100',
    unlockDescription: '100 horas de estudo',
    icon: '🌌',
  },
  {
    id: 'quiz-perfect',
    name: 'Diamond',
    category: 'special',
    gradient: 'linear-gradient(135deg, #e0e7ff, #818cf8, #4f46e5)',
    primary: '#6366f1',
    secondary: '#818cf8',
    accent: '#e0e7ff',
    unlockCondition: 'quiz:perfect',
    unlockDescription: '100% em 5 quizzes',
    icon: '💎',
  },
  {
    id: 'vocabulary-500',
    name: 'Emerald Scholar',
    category: 'special',
    gradient: 'linear-gradient(135deg, #064e3b, #059669, #34d399)',
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#d1fae5',
    unlockCondition: 'vocabulary:500',
    unlockDescription: '500 palavras aprendidas',
    icon: '📚',
  },
  {
    id: 'all-books',
    name: 'Master Gold',
    category: 'special',
    gradient: 'linear-gradient(135deg, #713f12, #ca8a04, #facc15)',
    primary: '#eab308',
    secondary: '#fde047',
    accent: '#fefce8',
    unlockCondition: 'books:all',
    unlockDescription: 'Complete todos os 5 livros',
    icon: '👑',
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    category: 'special',
    gradient: 'linear-gradient(135deg, #1e1b4b, #3730a3, #4f46e5)',
    primary: '#6366f1',
    secondary: '#a78bfa',
    accent: '#ede9fe',
    unlockCondition: 'study:night',
    unlockDescription: 'Estude 10x após 22h',
    icon: '🦉',
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    category: 'special',
    gradient: 'linear-gradient(135deg, #fef3c7, #fbbf24, #f59e0b)',
    primary: '#f59e0b',
    secondary: '#fcd34d',
    accent: '#fffbeb',
    unlockCondition: 'study:morning',
    unlockDescription: 'Estude 10x antes das 7h',
    icon: '🐦',
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    category: 'special',
    gradient: 'linear-gradient(135deg, #831843, #db2777, #f472b6)',
    primary: '#ec4899',
    secondary: '#f472b6',
    accent: '#fce7f3',
    unlockCondition: 'voice:20',
    unlockDescription: '20 sessões de Voice Chat',
    icon: '🦋',
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    category: 'special',
    gradient: 'linear-gradient(135deg, #0f0a1e, #7c3aed, #06b6d4)',
    primary: '#7c3aed',
    secondary: '#06b6d4',
    accent: '#f5f3ff',
    unlockCondition: 'level:10',
    unlockDescription: 'Alcance nível 10',
    icon: '⚡',
  },
];

export function getThemeById(id: string): AppTheme | undefined {
  return ALL_THEMES.find(t => t.id === id);
}

export function getDefaultTheme(): AppTheme {
  return ALL_THEMES[0];
}
