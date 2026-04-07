// Book-level theme system for inFlux Personal Assistants
// Each book has its own color identity that changes the student dashboard

export interface BookTheme {
  book: number;
  name: string;
  level: string;
  primary: string;        // Main accent color (hex)
  primaryLight: string;   // Light variant for backgrounds
  primaryDark: string;    // Dark variant for text/emphasis
  gradient: string;       // CSS gradient for headers
  bgClass: string;        // Tailwind bg class
  textClass: string;      // Tailwind text class
  borderClass: string;    // Tailwind border class
  badgeClass: string;     // Tailwind badge class
  headerBg: string;       // CSS background for header
  accentRing: string;     // Ring color for focus states
  emoji: string;          // Fun emoji for the level
}

export const BOOK_THEMES: Record<number, BookTheme> = {
  1: {
    book: 1,
    name: "Book 1",
    level: "Beginner",
    primary: "#84cc16",
    primaryLight: "#ecfccb",
    primaryDark: "#365314",
    gradient: "linear-gradient(135deg, #84cc16 0%, #a3e635 50%, #bef264 100%)",
    bgClass: "bg-lime-50",
    textClass: "text-lime-700",
    borderClass: "border-lime-300",
    badgeClass: "bg-lime-100 text-lime-800 border-lime-300",
    headerBg: "linear-gradient(135deg, #365314 0%, #4d7c0f 50%, #65a30d 100%)",
    accentRing: "ring-lime-400",
    emoji: "🌱",
  },
  2: {
    book: 2,
    name: "Book 2",
    level: "Elementary",
    primary: "#38bdf8",
    primaryLight: "#e0f2fe",
    primaryDark: "#0c4a6e",
    gradient: "linear-gradient(135deg, #38bdf8 0%, #7dd3fc 50%, #bae6fd 100%)",
    bgClass: "bg-sky-50",
    textClass: "text-sky-700",
    borderClass: "border-sky-300",
    badgeClass: "bg-sky-100 text-sky-800 border-sky-300",
    headerBg: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)",
    accentRing: "ring-sky-400",
    emoji: "💧",
  },
  3: {
    book: 3,
    name: "Book 3",
    level: "Intermediate",
    primary: "#a855f7",
    primaryLight: "#f3e8ff",
    primaryDark: "#581c87",
    gradient: "linear-gradient(135deg, #a855f7 0%, #c084fc 50%, #d8b4fe 100%)",
    bgClass: "bg-purple-50",
    textClass: "text-purple-700",
    borderClass: "border-purple-300",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-300",
    headerBg: "linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #9333ea 100%)",
    accentRing: "ring-purple-400",
    emoji: "🔮",
  },
  4: {
    book: 4,
    name: "Book 4",
    level: "Upper Intermediate",
    primary: "#f97316",
    primaryLight: "#fff7ed",
    primaryDark: "#7c2d12",
    gradient: "linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)",
    bgClass: "bg-orange-50",
    textClass: "text-orange-700",
    borderClass: "border-orange-300",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
    headerBg: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)",
    accentRing: "ring-orange-400",
    emoji: "🔥",
  },
  5: {
    book: 5,
    name: "Book 5",
    level: "Advanced",
    primary: "#dc2626",
    primaryLight: "#fef2f2",
    primaryDark: "#7f1d1d",
    gradient: "linear-gradient(135deg, #991b1b 0%, #b91c1c 50%, #dc2626 100%)",
    bgClass: "bg-red-50",
    textClass: "text-red-700",
    borderClass: "border-red-300",
    badgeClass: "bg-red-100 text-red-800 border-red-300",
    headerBg: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%)",
    accentRing: "ring-red-400",
    emoji: "🏆",
  },
};

// Default theme for unknown book levels
export const DEFAULT_THEME: BookTheme = BOOK_THEMES[1];

// Get theme by book number
export function getBookTheme(bookNumber: number | undefined | null): BookTheme {
  if (!bookNumber || !BOOK_THEMES[bookNumber]) {
    return DEFAULT_THEME;
  }
  return BOOK_THEMES[bookNumber];
}

// Get book number from level string (e.g., "Book 1", "beginner", etc.)
export function getBookNumberFromLevel(level: string | undefined | null): number {
  if (!level) return 1;
  
  const lower = level.toLowerCase().trim();
  
  // Direct book number
  const bookMatch = lower.match(/book\s*(\d)/);
  if (bookMatch) return parseInt(bookMatch[1]);
  
  // Level name mapping
  if (lower.includes("beginner") || lower.includes("iniciante") || lower === "a1") return 1;
  if (lower.includes("elementary") || lower.includes("elementar") || lower === "a2") return 2;
  if (lower.includes("intermediate") && !lower.includes("upper")) return 3;
  if (lower.includes("upper") || lower.includes("b2")) return 4;
  if (lower.includes("advanced") || lower.includes("avançado") || lower.includes("c1") || lower.includes("c2")) return 5;
  
  return 1;
}

// Apply theme CSS variables to a container element
export function getThemeCSSVars(theme: BookTheme): React.CSSProperties {
  return {
    '--theme-primary': theme.primary,
    '--theme-primary-light': theme.primaryLight,
    '--theme-primary-dark': theme.primaryDark,
    '--theme-gradient': theme.gradient,
    '--theme-header-bg': theme.headerBg,
  } as React.CSSProperties;
}
