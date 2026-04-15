/**
 * AgeAdaptiveContext — Adapts UI based on student age
 *
 * child  (6-12):  colorful, gamified, Elie more expressive, bigger fonts
 * teen   (13-17): clean, dark mode, informal language
 * adult  (18+):   professional, metrics-focused, results-oriented
 */
import { createContext, useContext, useMemo, type ReactNode } from "react";

export type AgeGroup = "child" | "teen" | "adult";

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
}

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
