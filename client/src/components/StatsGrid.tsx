/**
 * StatsGrid — 4 glassmorphism stat cards
 */

import { Flame, Clock, BookOpen, Trophy } from "lucide-react";
import type { AppTheme } from "@/lib/themes";

interface StatsGridProps {
  appTheme: AppTheme;
  streakDays: number;
  hoursLearned: number;
  chunksLearned: number;
  completedBooks: number;
}

export default function StatsGrid({
  appTheme,
  streakDays,
  hoursLearned,
  chunksLearned,
  completedBooks,
}: StatsGridProps) {
  const font = appTheme.fontOverride || "'Syne', sans-serif";

  const stats = [
    {
      icon: Flame,
      label: "Streak",
      value: `${streakDays}`,
      unit: "dias",
      color: appTheme.valueColor,
      bg: `${appTheme.valueColor}18`,
    },
    {
      icon: Clock,
      label: "Horas",
      value: `${hoursLearned}`,
      unit: "horas",
      color: appTheme.accentColor,
      bg: `${appTheme.accentColor}18`,
    },
    {
      icon: BookOpen,
      label: "Chunks",
      value: `${chunksLearned}`,
      unit: "aprendidos",
      color: appTheme.valueColor,
      bg: `${appTheme.valueColor}18`,
    },
    {
      icon: Trophy,
      label: "Livros",
      value: `${completedBooks}`,
      unit: "completos",
      color: appTheme.accentColor,
      bg: `${appTheme.accentColor}18`,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="rounded-2xl p-4"
          style={{
            background: appTheme.cardBg || "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${appTheme.cardBorder || "rgba(255,255,255,0.08)"}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: stat.bg }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: font, color: appTheme.cardText }}
              >
                {stat.value}
              </p>
              <p
                className="text-[10px] sm:text-xs"
                style={{ color: `${appTheme.cardText}66` }}
              >
                {stat.unit}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
