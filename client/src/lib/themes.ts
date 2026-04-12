// Full theme system for ImAInd TUTOR
// 16 themes (4 groups) + 4 dashboard layouts
// Based on the HTML design spec: imaind_tutor_layouts_temas.html

export type LayoutType = 'orbit' | 'scroll' | 'split' | 'narrative';

export interface LayoutOption {
  id: LayoutType;
  name: string;
  number: number;
  description: string;
}

export const LAYOUTS: LayoutOption[] = [
  { id: 'orbit', number: 1, name: 'Órbita', description: 'Stats orbitam ao redor da Elie' },
  { id: 'scroll', number: 2, name: 'Scroll', description: 'Grid compacto de cards' },
  { id: 'split', number: 3, name: 'Split', description: 'Sidebar + conteúdo lateral' },
  { id: 'narrative', number: 4, name: 'Narrativa', description: 'Feed estilo stories' },
];

export type ThemeGroup = 'launch' | 'kids' | 'teens' | 'adults' | 'legendary';

export interface AppTheme {
  id: string;
  name: string;
  group: ThemeGroup;
  groupLabel: string;
  icon: string;
  // Colors
  background: string;
  accentColor: string;
  cardBg: string;
  cardBorder: string;
  cardText: string;
  valueColor: string;
  buttonBg: string;
  buttonColor: string;
  buttonBorder?: string;
  avatarBg: string;
  avatarRing: string;
  // Extra style flags
  fontOverride?: string;  // e.g. monospace for Retro Arcade
  neonGlow?: boolean;
  // Unlock
  unlockCondition: string;
  unlockDescription: string;
}

export const ALL_THEMES: AppTheme[] = [
  // ─── LANÇAMENTO ────────────────────────────────────────────
  {
    id: 'spatial-glossy',
    name: 'Spatial Glossy',
    group: 'launch',
    groupLabel: 'Lançamento',
    icon: '🌌',
    background: '#070714',
    accentColor: '#c4a6f0',
    cardBg: 'rgba(255,255,255,0.07)',
    cardBorder: 'rgba(255,255,255,0.12)',
    cardText: '#fff',
    valueColor: '#2e8b7a',
    buttonBg: 'linear-gradient(135deg,#6b3fa0,#2e8b7a)',
    buttonColor: '#fff',
    avatarBg: 'linear-gradient(135deg,#6b3fa0,#2e8b7a)',
    avatarRing: '#c4a6f0',
    unlockCondition: 'default',
    unlockDescription: 'Tema padrão',
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    group: 'launch',
    groupLabel: 'Lançamento',
    icon: '⚡',
    background: '#050508',
    accentColor: '#00fff0',
    cardBg: 'rgba(0,255,240,0.04)',
    cardBorder: 'rgba(0,255,240,0.2)',
    cardText: '#fff',
    valueColor: '#00fff0',
    buttonBg: 'transparent',
    buttonColor: '#00fff0',
    buttonBorder: '1px solid #00fff0',
    avatarBg: '#050508',
    avatarRing: '#ff00aa',
    neonGlow: true,
    unlockCondition: 'streak:7',
    unlockDescription: '7 dias de streak',
  },
  {
    id: 'classic-school',
    name: 'Classic School',
    group: 'launch',
    groupLabel: 'Lançamento',
    icon: '🏫',
    background: '#0d1a0d',
    accentColor: '#a8d5a2',
    cardBg: 'rgba(255,255,255,0.05)',
    cardBorder: 'rgba(255,255,255,0.15)',
    cardText: '#e8f5e8',
    valueColor: '#ffd966',
    buttonBg: 'rgba(255,255,255,0.1)',
    buttonColor: '#fff',
    buttonBorder: '1px solid rgba(255,255,255,0.3)',
    avatarBg: 'linear-gradient(135deg,#2d5a2d,#4a7c4a)',
    avatarRing: 'rgba(255,255,255,0.3)',
    unlockCondition: 'default',
    unlockDescription: 'Tema padrão',
  },

  // ─── KIDS ──────────────────────────────────────────────────
  {
    id: 'magic-kingdom',
    name: 'Magic Kingdom',
    group: 'kids',
    groupLabel: 'Kids',
    icon: '🦄',
    background: 'linear-gradient(160deg,#1a0a2e,#2d1054)',
    accentColor: '#f9a8d4',
    cardBg: 'rgba(255,107,184,0.1)',
    cardBorder: 'rgba(255,107,184,0.2)',
    cardText: '#fff',
    valueColor: '#ffe066',
    buttonBg: 'linear-gradient(135deg,#ff6bb8,#c084fc)',
    buttonColor: '#fff',
    avatarBg: 'linear-gradient(135deg,#ff6bb8,#c084fc)',
    avatarRing: '#ffe066',
    unlockCondition: 'level:kids',
    unlockDescription: 'Perfil Kids ativo',
  },
  {
    id: 'space-cadet',
    name: 'Space Cadet',
    group: 'kids',
    groupLabel: 'Kids',
    icon: '🚀',
    background: '#03030f',
    accentColor: '#93c5fd',
    cardBg: 'rgba(59,130,246,0.08)',
    cardBorder: 'rgba(59,130,246,0.2)',
    cardText: '#fff',
    valueColor: '#fb923c',
    buttonBg: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',
    buttonColor: '#fff',
    avatarBg: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',
    avatarRing: '#fb923c',
    unlockCondition: 'hours:10',
    unlockDescription: '10 horas de estudo',
  },
  {
    id: 'ocean-explorer',
    name: 'Ocean Explorer',
    group: 'kids',
    groupLabel: 'Kids',
    icon: '🌊',
    background: 'linear-gradient(180deg,#020d1a,#041428)',
    accentColor: '#7dd3fc',
    cardBg: 'rgba(56,189,248,0.08)',
    cardBorder: 'rgba(56,189,248,0.2)',
    cardText: '#fff',
    valueColor: '#2dd4bf',
    buttonBg: 'linear-gradient(135deg,#0369a1,#38bdf8)',
    buttonColor: '#fff',
    avatarBg: 'linear-gradient(135deg,#0369a1,#38bdf8)',
    avatarRing: '#2dd4bf',
    unlockCondition: 'vocabulary:100',
    unlockDescription: '100 palavras aprendidas',
  },
  {
    id: 'jungle-adventure',
    name: 'Jungle Adventure',
    group: 'kids',
    groupLabel: 'Kids',
    icon: '🦁',
    background: 'linear-gradient(160deg,#071a07,#0f2d0f)',
    accentColor: '#86efac',
    cardBg: 'rgba(74,222,128,0.07)',
    cardBorder: 'rgba(74,222,128,0.2)',
    cardText: '#fff',
    valueColor: '#fbbf24',
    buttonBg: 'linear-gradient(135deg,#15803d,#4ade80)',
    buttonColor: '#fff',
    avatarBg: 'linear-gradient(135deg,#15803d,#4ade80)',
    avatarRing: '#fbbf24',
    unlockCondition: 'quiz:5',
    unlockDescription: 'Complete 5 quizzes',
  },

  // ─── TEENS ─────────────────────────────────────────────────
  {
    id: 'retro-arcade',
    name: 'Retro Arcade',
    group: 'teens',
    groupLabel: 'Teens',
    icon: '🎮',
    background: '#000',
    accentColor: '#facc15',
    cardBg: 'rgba(0,0,0,0.8)',
    cardBorder: '#4ade80',
    cardText: '#fff',
    valueColor: '#4ade80',
    buttonBg: '#000',
    buttonColor: '#facc15',
    buttonBorder: '2px solid #facc15',
    avatarBg: '#000',
    avatarRing: '#facc15',
    fontOverride: "'Courier New', monospace",
    unlockCondition: 'streak:14',
    unlockDescription: '14 dias de streak',
  },
  {
    id: 'aesthetic-pastel',
    name: 'Aesthetic Pastel',
    group: 'teens',
    groupLabel: 'Teens',
    icon: '🌸',
    background: 'linear-gradient(160deg,#1a1025,#150d20)',
    accentColor: '#f9a8d4',
    cardBg: 'rgba(249,168,212,0.06)',
    cardBorder: 'rgba(249,168,212,0.15)',
    cardText: '#f3e8ff',
    valueColor: '#c4b5fd',
    buttonBg: 'linear-gradient(135deg,rgba(147,51,234,0.4),rgba(219,39,119,0.4))',
    buttonColor: '#f9a8d4',
    buttonBorder: '1px solid rgba(249,168,212,0.3)',
    avatarBg: 'linear-gradient(135deg,#9333ea,#db2777)',
    avatarRing: '#f9a8d4',
    unlockCondition: 'voice:5',
    unlockDescription: '5 sessões de Voice Chat',
  },
  {
    id: 'tokyo-nights',
    name: 'Tokyo Nights',
    group: 'teens',
    groupLabel: 'Teens',
    icon: '🏙️',
    background: '#08080f',
    accentColor: '#fca5a5',
    cardBg: 'rgba(239,68,68,0.05)',
    cardBorder: 'rgba(239,68,68,0.2)',
    cardText: '#fff',
    valueColor: '#ef4444',
    buttonBg: 'transparent',
    buttonColor: '#ef4444',
    buttonBorder: '1px solid rgba(239,68,68,0.6)',
    avatarBg: 'linear-gradient(135deg,#7f1d1d,#ef4444)',
    avatarRing: '#ef4444',
    unlockCondition: 'hours:30',
    unlockDescription: '30 horas de estudo',
  },
  {
    id: 'band-garage',
    name: 'Band Garage',
    group: 'teens',
    groupLabel: 'Teens',
    icon: '🎸',
    background: '#0a0000',
    accentColor: '#fca5a5',
    cardBg: 'rgba(220,38,38,0.06)',
    cardBorder: 'rgba(220,38,38,0.25)',
    cardText: '#fff',
    valueColor: '#dc2626',
    buttonBg: '#dc2626',
    buttonColor: '#fff',
    avatarBg: 'linear-gradient(135deg,#450a0a,#dc2626)',
    avatarRing: '#dc2626',
    unlockCondition: 'streak:30',
    unlockDescription: '30 dias de streak',
  },

  // ─── ADULTS ────────────────────────────────────────────────
  {
    id: 'future-school',
    name: 'Future School',
    group: 'adults',
    groupLabel: 'Adults',
    icon: '💫',
    background: '#f0f4ff',
    accentColor: '#3b82f6',
    cardBg: 'rgba(255,255,255,0.8)',
    cardBorder: 'rgba(59,130,246,0.15)',
    cardText: '#1e293b',
    valueColor: '#3b82f6',
    buttonBg: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    buttonColor: '#fff',
    avatarBg: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    avatarRing: 'rgba(59,130,246,0.4)',
    unlockCondition: 'hours:50',
    unlockDescription: '50 horas de estudo',
  },
  {
    id: 'business-clean',
    name: 'Business Clean',
    group: 'adults',
    groupLabel: 'Adults',
    icon: '💼',
    background: '#0d0d12',
    accentColor: '#d97706',
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.08)',
    cardText: '#e2e8f0',
    valueColor: '#d97706',
    buttonBg: 'transparent',
    buttonColor: '#d97706',
    buttonBorder: '1px solid rgba(217,119,6,0.5)',
    avatarBg: 'linear-gradient(135deg,#1c1c28,#2a2a3d)',
    avatarRing: '#d97706',
    unlockCondition: 'level:5',
    unlockDescription: 'Alcance o Book 5',
  },
  {
    id: 'zen-garden',
    name: 'Zen Garden',
    group: 'adults',
    groupLabel: 'Adults',
    icon: '🍃',
    background: 'linear-gradient(160deg,#0a100a,#0d160d)',
    accentColor: '#86efac',
    cardBg: 'rgba(212,197,169,0.04)',
    cardBorder: 'rgba(212,197,169,0.12)',
    cardText: '#d4c5a9',
    valueColor: '#86efac',
    buttonBg: 'rgba(77,124,15,0.2)',
    buttonColor: '#86efac',
    buttonBorder: '1px solid rgba(134,239,172,0.2)',
    avatarBg: 'linear-gradient(135deg,#365314,#4d7c0f)',
    avatarRing: 'rgba(212,197,169,0.4)',
    unlockCondition: 'quiz:perfect',
    unlockDescription: '100% em 5 quizzes',
  },
  {
    id: 'midnight-city',
    name: 'Midnight City',
    group: 'adults',
    groupLabel: 'Adults',
    icon: '🌆',
    background: '#08080f',
    accentColor: '#94a3b8',
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(148,163,184,0.1)',
    cardText: '#cbd5e1',
    valueColor: '#60a5fa',
    buttonBg: 'transparent',
    buttonColor: '#94a3b8',
    buttonBorder: '1px solid rgba(148,163,184,0.2)',
    avatarBg: 'linear-gradient(135deg,#0c1445,#1d4ed8)',
    avatarRing: 'rgba(148,163,184,0.4)',
    unlockCondition: 'study:night',
    unlockDescription: 'Estude 10x após 22h',
  },

  // ─── LENDÁRIO ──────────────────────────────────────────────
  {
    id: 'imaind-legacy',
    name: 'ImAInd Legacy',
    group: 'legendary',
    groupLabel: 'Lendário',
    icon: '🔮',
    background: 'radial-gradient(ellipse at 30% 20%,rgba(107,63,160,0.2) 0%,transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(46,139,122,0.15) 0%,transparent 60%),#050510',
    accentColor: '#f5c842',
    cardBg: 'rgba(245,200,66,0.05)',
    cardBorder: 'rgba(245,200,66,0.15)',
    cardText: '#fff',
    valueColor: '#f5c842',
    buttonBg: 'linear-gradient(135deg,#6b3fa0,#f5c842)',
    buttonColor: '#fff',
    avatarBg: 'linear-gradient(135deg,#6b3fa0,#f5c842,#2e8b7a)',
    avatarRing: '#f5c842',
    unlockCondition: 'books:all',
    unlockDescription: 'Complete todos os 5 livros',
  },
];

// Group themes by group
export function getThemesByGroup(): Record<string, AppTheme[]> {
  const groups: Record<string, AppTheme[]> = {};
  for (const theme of ALL_THEMES) {
    if (!groups[theme.group]) groups[theme.group] = [];
    groups[theme.group].push(theme);
  }
  return groups;
}

export function getThemeById(id: string): AppTheme | undefined {
  return ALL_THEMES.find(t => t.id === id);
}

export function getDefaultTheme(): AppTheme {
  return ALL_THEMES[0]; // Spatial Glossy
}

export function getLayoutById(id: LayoutType): LayoutOption | undefined {
  return LAYOUTS.find(l => l.id === id);
}
