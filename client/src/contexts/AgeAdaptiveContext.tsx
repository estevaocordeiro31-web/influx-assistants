/**
 * AgeAdaptiveContext — Adapts UI based on student age
 *
 * child  (6-12):  "Cosmic Explorer" — colorful nebula, gamified, Elie expressive
 * teen   (13-17): "Neon Pulse" — cyberpunk dark, neon accents, clean lines
 * adult  (18+):   "Midnight Studio" — professional, metrics-focused, Linear polish
 */
import { createContext, useContext, useMemo, type ReactNode } from "react";

export type AgeGroup = "child" | "teen" | "adult";

/** Visual theme tokens that define the entire look and feel */
export interface ThemeVisuals {
  /** Theme display name */
  name: string;
  /** Short description */
  description: string;
  /** Emoji identifier */
  emoji: string;

  // ── Background ──
  bgGradient: string;
  bgMesh: string;

  // ── Cards / Glass ──
  cardBg: string;
  cardBorder: string;
  cardRadius: number;
  cardBlur: number;
  cardShine: string;

  // ── Accent colors ──
  primary: string;
  secondary: string;
  accent: string;

  // ── Text ──
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // ── Elie ──
  elieGlow: string;
  elieRingColor: string;
  elieSize: number;

  // ── Header ──
  headerBg: string;
  headerBorder: string;
  logoPrimary: string;
  logoAccent: string;

  // ── Rings ──
  ringFrequency: string;
  ringEngagement: string;
  ringStreak: string;

  // ── Buttons / Actions ──
  actionBg: string;
  actionBorder: string;
  actionHover: string;

  // ── Special effects ──
  glowIntensity: number;
  particleColor: string;
  ambientOpacity: number;
}

interface AgeAdaptiveConfig {
  ageGroup: AgeGroup;
  /** More colorful and animated */
  playful: boolean;
  /** Show gamification prominently */
  showGamification: boolean;
  /** Show detailed metrics */
  showMetrics: boolean;
  /** Elie's tone preset */
  elieTone: "fun" | "casual" | "professional";
  /** Preferred theme */
  preferredTheme: "light" | "dark" | "auto";
  /** Greeting style */
  greetingStyle: "excited" | "casual" | "warm";
  /** Font scale multiplier */
  fontScale: number;
  /** Border radius scale (1 = default, 1.5 = more rounded) */
  radiusScale: number;
  /** Animation intensity (0-1) */
  animationIntensity: number;
  /** Visual theme tokens */
  visuals: ThemeVisuals;
}

/* ════════════════════════════════════════════════════════
   THEME DEFINITIONS
   ════════════════════════════════════════════════════════ */

const COSMIC_EXPLORER: ThemeVisuals = {
  name: "Cosmic Explorer",
  description: "Aventura espacial colorida",
  emoji: "🚀",

  bgGradient: "linear-gradient(180deg, #0f0520 0%, #1a0a3e 25%, #0d1b4a 50%, #12063a 75%, #0a0420 100%)",
  bgMesh: `
    radial-gradient(ellipse 50% 40% at 15% 20%, rgba(255,107,157,0.18), transparent 60%),
    radial-gradient(ellipse 40% 35% at 80% 30%, rgba(0,229,255,0.14), transparent 55%),
    radial-gradient(ellipse 35% 30% at 50% 80%, rgba(132,255,87,0.10), transparent 50%),
    radial-gradient(ellipse 25% 25% at 30% 60%, rgba(255,215,0,0.08), transparent 45%)
  `,

  cardBg: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.12)",
  cardRadius: 24,
  cardBlur: 24,
  cardShine: "linear-gradient(90deg, transparent 5%, rgba(255,107,157,0.15) 30%, rgba(0,229,255,0.15) 70%, transparent 95%)",

  primary: "#ff6b9d",
  secondary: "#00e5ff",
  accent: "#84ff57",

  textPrimary: "#ffffff",
  textSecondary: "rgba(255,255,255,0.55)",
  textMuted: "rgba(255,255,255,0.25)",

  elieGlow: "radial-gradient(circle, rgba(255,107,157,0.35), rgba(0,229,255,0.15), transparent 70%)",
  elieRingColor: "#ff6b9d",
  elieSize: 160,

  headerBg: "rgba(15,5,32,0.85)",
  headerBorder: "rgba(255,107,157,0.12)",
  logoPrimary: "#ff6b9d",
  logoAccent: "#00e5ff",

  ringFrequency: "#00e5ff",
  ringEngagement: "#84ff57",
  ringStreak: "#ff6b9d",

  actionBg: "rgba(255,107,157,0.12)",
  actionBorder: "rgba(255,107,157,0.2)",
  actionHover: "rgba(255,107,157,0.22)",

  glowIntensity: 1.0,
  particleColor: "#ff6b9d",
  ambientOpacity: 0.5,
};

const NEON_PULSE: ThemeVisuals = {
  name: "Neon Pulse",
  description: "Cyberpunk com neon",
  emoji: "⚡",

  bgGradient: "linear-gradient(180deg, #000000 0%, #050510 30%, #0a0a1a 50%, #050510 80%, #000000 100%)",
  bgMesh: `
    radial-gradient(ellipse 45% 35% at 20% 15%, rgba(0,255,255,0.08), transparent 55%),
    radial-gradient(ellipse 35% 30% at 75% 50%, rgba(255,0,255,0.06), transparent 50%),
    radial-gradient(ellipse 30% 25% at 50% 85%, rgba(57,255,20,0.05), transparent 45%)
  `,

  cardBg: "rgba(255,255,255,0.02)",
  cardBorder: "rgba(0,255,255,0.12)",
  cardRadius: 12,
  cardBlur: 16,
  cardShine: "linear-gradient(90deg, transparent 10%, rgba(0,255,255,0.08) 50%, transparent 90%)",

  primary: "#00ffff",
  secondary: "#ff00ff",
  accent: "#39ff14",

  textPrimary: "#e0e0e0",
  textSecondary: "rgba(224,224,224,0.5)",
  textMuted: "rgba(224,224,224,0.2)",

  elieGlow: "radial-gradient(circle, rgba(0,255,255,0.25), rgba(255,0,255,0.10), transparent 70%)",
  elieRingColor: "#00ffff",
  elieSize: 140,

  headerBg: "rgba(0,0,0,0.9)",
  headerBorder: "rgba(0,255,255,0.08)",
  logoPrimary: "#00ffff",
  logoAccent: "#ff00ff",

  ringFrequency: "#00ffff",
  ringEngagement: "#39ff14",
  ringStreak: "#ff00ff",

  actionBg: "rgba(0,255,255,0.06)",
  actionBorder: "rgba(0,255,255,0.15)",
  actionHover: "rgba(0,255,255,0.14)",

  glowIntensity: 0.8,
  particleColor: "#00ffff",
  ambientOpacity: 0.3,
};

const MIDNIGHT_STUDIO: ThemeVisuals = {
  name: "Midnight Studio",
  description: "Profissional e elegante",
  emoji: "🌙",

  bgGradient: "linear-gradient(180deg, #06090f 0%, #0c1222 30%, #111827 60%, #0f172a 100%)",
  bgMesh: `
    radial-gradient(ellipse 60% 40% at 20% 10%, rgba(26,111,219,0.08), transparent 60%),
    radial-gradient(ellipse 40% 40% at 80% 60%, rgba(26,111,219,0.06), transparent 60%),
    radial-gradient(ellipse 30% 30% at 50% 90%, rgba(168,85,247,0.04), transparent 50%)
  `,

  cardBg: "rgba(255,255,255,0.03)",
  cardBorder: "rgba(255,255,255,0.07)",
  cardRadius: 20,
  cardBlur: 20,
  cardShine: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 50%, transparent 90%)",

  primary: "#4da8ff",
  secondary: "#6abf4b",
  accent: "#a78bfa",

  textPrimary: "#ffffff",
  textSecondary: "rgba(255,255,255,0.4)",
  textMuted: "rgba(255,255,255,0.15)",

  elieGlow: "radial-gradient(circle, rgba(26,111,219,0.20), transparent 70%)",
  elieRingColor: "#4da8ff",
  elieSize: 140,

  headerBg: "rgba(6,9,15,0.6)",
  headerBorder: "rgba(255,255,255,0.04)",
  logoPrimary: "#ffffff",
  logoAccent: "#4da8ff",

  ringFrequency: "#4da8ff",
  ringEngagement: "#6abf4b",
  ringStreak: "#f59e0b",

  actionBg: "rgba(255,255,255,0.04)",
  actionBorder: "rgba(255,255,255,0.08)",
  actionHover: "rgba(255,255,255,0.08)",

  glowIntensity: 0.5,
  particleColor: "#4da8ff",
  ambientOpacity: 0.4,
};

export const THEME_MAP: Record<AgeGroup, ThemeVisuals> = {
  child: COSMIC_EXPLORER,
  teen: NEON_PULSE,
  adult: MIDNIGHT_STUDIO,
};

const AGE_CONFIGS: Record<AgeGroup, AgeAdaptiveConfig> = {
  child: {
    ageGroup: "child",
    playful: true,
    showGamification: true,
    showMetrics: false,
    elieTone: "fun",
    preferredTheme: "light",
    greetingStyle: "excited",
    fontScale: 1.15,
    radiusScale: 1.5,
    animationIntensity: 1,
    visuals: COSMIC_EXPLORER,
  },
  teen: {
    ageGroup: "teen",
    playful: false,
    showGamification: true,
    showMetrics: true,
    elieTone: "casual",
    preferredTheme: "dark",
    greetingStyle: "casual",
    fontScale: 1,
    radiusScale: 1,
    animationIntensity: 0.7,
    visuals: NEON_PULSE,
  },
  adult: {
    ageGroup: "adult",
    playful: false,
    showGamification: false,
    showMetrics: true,
    elieTone: "professional",
    preferredTheme: "auto",
    greetingStyle: "warm",
    fontScale: 0.95,
    radiusScale: 0.8,
    animationIntensity: 0.5,
    visuals: MIDNIGHT_STUDIO,
  },
};

function resolveAgeGroup(age: number | null | undefined): AgeGroup {
  if (!age || age < 6) return "child";
  if (age <= 12) return "child";
  if (age <= 17) return "teen";
  return "adult";
}

const AgeAdaptiveContext = createContext<AgeAdaptiveConfig>(AGE_CONFIGS.adult);

interface AgeAdaptiveProviderProps {
  age?: number | null;
  ageGroup?: AgeGroup;
  children: ReactNode;
}

export function AgeAdaptiveProvider({ age, ageGroup, children }: AgeAdaptiveProviderProps) {
  const config = useMemo(() => {
    const group = ageGroup ?? resolveAgeGroup(age);
    return AGE_CONFIGS[group];
  }, [age, ageGroup]);

  return (
    <AgeAdaptiveContext.Provider value={config}>
      {children}
    </AgeAdaptiveContext.Provider>
  );
}

export function useAgeAdaptive(): AgeAdaptiveConfig {
  return useContext(AgeAdaptiveContext);
}

/** Utility: Returns Elie system prompt modifier based on age group */
export function getEliePromptModifier(ageGroup: AgeGroup): string {
  switch (ageGroup) {
    case "child":
      return `
IMPORTANTE: O aluno e uma crianca (6-12 anos).
- Use linguagem simples e divertida
- Inclua emojis com frequencia
- Celebre cada pequena conquista com entusiasmo
- Use analogias com jogos, desenhos e coisas do dia-a-dia
- Seja encorajadora e paciente — nunca critique
- Frases curtas, no maximo 2 linhas por vez
- Se comunique como uma amiga mais velha legal`;
    case "teen":
      return `
IMPORTANTE: O aluno e um adolescente (13-17 anos).
- Use linguagem informal e atual (mas sem forcar)
- Seja direta e objetiva — adolescentes nao gostam de enrolacao
- Use referencias a cultura pop quando natural
- Motive sem ser piegas — respeite a inteligencia deles
- Pode usar girias moderadas e humor
- Desafie-os — adolescentes gostam de competicao`;
    case "adult":
      return `
IMPORTANTE: O aluno e um adulto (18+ anos).
- Seja profissional mas acolhedora
- Foque em resultados e progresso mensuravel
- Respeite o tempo limitado — va direto ao ponto
- Relacione o ingles com a carreira e objetivos profissionais
- Use dados e metricas quando relevante
- Tom de parceira de aprendizado, nao de professora`;
  }
}

export default AgeAdaptiveContext;
