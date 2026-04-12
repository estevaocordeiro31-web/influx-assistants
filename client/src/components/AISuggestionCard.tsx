/**
 * AISuggestionCard — Personalized AI recommendation based on student progress
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

  // Streak milestones
  if (streakDays >= 30) {
    return {
      title: "Consistência Incrível!",
      text: `${streakDays} dias seguidos estudando! Você está no grupo dos 5% mais dedicados. Que tal desafiar-se com uma sessão de Voice Chat para testar sua fluência?`,
    };
  }

  if (streakDays >= 7) {
    return {
      title: "Streak em Alta!",
      text: `${streakDays} dias consecutivos — excelente ritmo! Para manter a motivação, experimente praticar com o Simulador de Situações.`,
    };
  }

  // Progress-based
  if (progressPercentage >= 80) {
    return {
      title: "Quase Lá!",
      text: `Você está com ${progressPercentage}% do ${currentBook} completo! Foque nos exercícios das últimas units para fechar com chave de ouro.`,
    };
  }

  if (progressPercentage >= 50) {
    return {
      title: "Na Metade do Caminho!",
      text: `${progressPercentage}% do ${currentBook} concluído. Continue praticando os chunks diariamente — a repetição espaçada vai solidificar seu aprendizado.`,
    };
  }

  // Objective-based
  if (objective === "career") {
    return {
      title: "Dica para sua Carreira",
      text: `Pratique vocabulário profissional no Chat IA. Peça ao Fluxie para simular uma reunião de trabalho em inglês!`,
    };
  }

  if (objective === "travel") {
    return {
      title: "Prepare-se para Viajar!",
      text: `Use o Simulador de Situações para praticar cenários de viagem: aeroporto, hotel, restaurante. Cada sessão vale XP!`,
    };
  }

  // Default — low streak
  if (streakDays <= 1) {
    return {
      title: "Comece sua Jornada!",
      text: `Uma sessão rápida de 10 minutos já faz diferença. Comece com os exercícios do ${currentBook} para construir seu streak!`,
    };
  }

  return {
    title: "Continue Evoluindo!",
    text: `Você já dedicou ${hoursLearned} horas ao inglês. Mantenha o ritmo com uma sessão de prática hoje!`,
  };
}

export default function AISuggestionCard(props: AISuggestionCardProps) {
  const { appTheme } = props;
  const font = appTheme.fontOverride || "'Syne', sans-serif";
  const suggestion = getSuggestion(props);

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.05) 100%)",
        border: "1px solid rgba(124,58,237,0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="p-2 rounded-xl flex-shrink-0"
          style={{ background: "rgba(124,58,237,0.15)" }}
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3
            className="font-bold text-sm mb-1"
            style={{ fontFamily: font, color: appTheme.cardText || "#fff" }}
          >
            {suggestion.title}
          </h3>
          <p className="text-sm" style={{ color: `${appTheme.cardText || "#fff"}80` }}>
            {suggestion.text}
          </p>
        </div>
      </div>
    </div>
  );
}
