/**
 * StatsGrid — Redesigned 4-stat row with animated counters and colored icons
 */

import { useEffect, useState } from "react";
import { Flame, Clock, BookOpen, Trophy } from "lucide-react";
import type { AppTheme } from "@/lib/themes";

interface StatsGridProps {
  appTheme: AppTheme;
  streakDays: number;
  hoursLearned: number;
  chunksLearned: number;
  completedBooks: number;
}

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let frame = 0;
    const total = 30;
    const step = target / total;
    const timer = setInterval(() => {
      frame++;
      setValue(Math.min(target, Math.round(step * frame)));
      if (frame >= total) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [target]);
  return <>{value}{suffix}</>;
}

const STATS_CONFIG = [
  { key: "streak" as const, icon: Flame, color: "#ef4444", bgColor: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.12)", label: "Streak" },
  { key: "hours" as const, icon: Clock, color: "#3b82f6", bgColor: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.12)", label: "Horas" },
  { key: "chunks" as const, icon: BookOpen, color: "#22c55e", bgColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.12)", label: "Chunks" },
  { key: "books" as const, icon: Trophy, color: "#eab308", bgColor: "rgba(234,179,8,0.08)", borderColor: "rgba(234,179,8,0.12)", label: "Livros" },
];

export default function StatsGrid({ appTheme, streakDays, hoursLearned, chunksLearned, completedBooks }: StatsGridProps) {
  const values = {
    streak: streakDays,
    hours: hoursLearned,
    chunks: chunksLearned,
    books: completedBooks,
  };
  const suffixes: Record<string, string> = { streak: "d", hours: "h", chunks: "", books: "" };

  return (
    <div className="grid grid-cols-4 gap-2">
      {STATS_CONFIG.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.key}
            className="rounded-2xl p-3 text-center transition-all"
            style={{ background: stat.bgColor, border: `1px solid ${stat.borderColor}` }}>
            <div className="w-8 h-8 rounded-xl mx-auto mb-1.5 flex items-center justify-center"
              style={{ background: `${stat.color}15` }}>
              <Icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <p className="text-white text-lg font-extrabold leading-none"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              <AnimatedNumber target={values[stat.key]} suffix={suffixes[stat.key]} />
            </p>
            <p className="text-white/30 text-[9px] uppercase tracking-wider mt-1 font-bold">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
