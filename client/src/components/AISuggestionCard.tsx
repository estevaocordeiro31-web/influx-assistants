/**
 * AISuggestionCard — Glassmorphism card with Elie-style suggestion
 * Frosted glass surface with purple mesh background and animated sparkle.
 */

import { Sparkles } from "lucide-react";
import type { AppTheme } from "@/lib/themes";

interface AISuggestionCardProps {
  appTheme: AppTheme;
  streakDays: number;
  progressPercentage: number;
  hoursLearned: number;
  currentBook: string;
  objective?: string | null;
}

function getSuggestion(props: AISuggestionCardProps): { title: string; text: string } {
  const { streakDays, progressPercentage, hoursLearned, currentBook, objective } = props;

  if (streakDays >= 30) {
    return {
      title: "Consistência Incrível!",
      text: `${streakDays} dias seguidos! Você está no grupo dos 5% mais dedicados. Que tal um Voice Chat para testar sua fluência?`,
    };
  }
  if (streakDays >= 7) {
    return {
      title: "Streak em Alta!",
      text: `${streakDays} dias consecutivos — excelente! Experimente o Simulador de Situações para manter a motivação.`,
    };
  }
  if (progressPercentage >= 80) {
    return {
      title: "Quase Lá!",
      text: `${progressPercentage}% do ${currentBook} completo! Foque nos exercícios das últimas units.`,
    };
  }
  if (progressPercentage >= 50) {
    return {
      title: "Na Metade do Caminho!",
      text: `${progressPercentage}% do ${currentBook}. Continue com os chunks diariamente!`,
    };
  }
  if (objective === "career") {
    return {
      title: "Dica para sua Carreira",
      text: `Peça ao Fluxie para simular uma reunião de trabalho em inglês!`,
    };
  }
  if (objective === "travel") {
    return {
      title: "Prepare-se para Viajar!",
      text: `Use o Simulador para praticar cenários de viagem: aeroporto, hotel, restaurante.`,
    };
  }
  if (streakDays <= 1) {
    return {
      title: "Comece sua Jornada!",
      text: `10 minutos já faz diferença. Comece com os exercícios do ${currentBook}!`,
    };
  }
  return {
    title: "Continue Evoluindo!",
    text: `Já dedicou ${hoursLearned} horas ao inglês. Mantenha o ritmo com uma sessão hoje!`,
  };
}

export default function AISuggestionCard(props: AISuggestionCardProps) {
  const suggestion = getSuggestion(props);

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden transition-all hover:scale-[1.01]"
      style={{
        background: "rgba(107,63,160,0.08)",
        border: "1px solid rgba(107,63,160,0.2)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}>
      {/* Top shine */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(107,63,160,0.25), transparent)" }} />

      {/* Mesh blob */}
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(107,63,160,0.15), transparent 70%)" }} />

      <div className="relative flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(107,63,160,0.15)", border: "1px solid rgba(107,63,160,0.25)" }}>
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-sm text-white mb-1"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            {suggestion.title}
          </h3>
          <p className="text-sm text-white/50 leading-relaxed">
            {suggestion.text}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mt-3 flex-wrap">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: "rgba(107,63,160,0.12)", color: "#c4a6f0", border: "1px solid rgba(107,63,160,0.25)" }}>
          Dica IA
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: "rgba(46,139,122,0.12)", color: "#7dd3c0", border: "1px solid rgba(46,139,122,0.25)" }}>
          Personalizada
        </span>
      </div>
    </div>
  );
}
