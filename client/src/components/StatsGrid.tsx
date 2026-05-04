/**
 * StatsGrid — Bento Grid layout with varied card sizes
 *
 * Design: Trend 2 (Bento Grid) from imaind_tutor_ui_trends.html
 * Asymmetric grid, glass cards, colored accents, animated counters.
 */

import { useEffect, useState } from "react";
import { Flame, Clock, BookOpen, Trophy, TrendingUp } from "lucide-react";
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

export default function StatsGrid({ appTheme, streakDays, hoursLearned, chunksLearned, completedBooks }: StatsGridProps) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2">
      {/* Streak — Large card spanning 2 rows */}
      <div className="row-span-2 rounded-2xl p-4 relative overflow-hidden transition-all hover:scale-[1.01]"
        style={{
          background: "rgba(245,200,66,0.06)",
          border: "1px solid rgba(245,200,66,0.15)",
          backdropFilter: "blur(12px)",
        }}>
        {/* Top shine */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(245,200,66,0.2), transparent)" }} />
        <span className="text-3xl block mb-2">🔥</span>
        <p className="text-[10px] uppercase tracking-wider font-bold text-white/25 mb-1">Streak</p>
        <p className="text-4xl font-extrabold text-yellow-400 leading-none"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          <AnimatedNumber target={streakDays} />
        </p>
        <p className="text-[10px] text-white/30 mt-1">dias consecutivos</p>
        {/* Mini progress toward next milestone */}
        <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full"
            style={{
              width: `${Math.min(100, (streakDays % 7) / 7 * 100)}%`,
              background: "linear-gradient(90deg, #f5c842, #ff6bb8)",
              transition: "width 1s ease-out",
            }} />
        </div>
        <p className="text-[9px] text-white/20 mt-1">{7 - (streakDays % 7)}d até bônus</p>
      </div>

      {/* Hours — Top right */}
      <div className="rounded-2xl p-3 relative overflow-hidden transition-all hover:scale-[1.02]"
        style={{
          background: "rgba(59,130,246,0.06)",
          border: "1px solid rgba(59,130,246,0.15)",
          backdropFilter: "blur(12px)",
        }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)" }} />
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.15)" }}>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
        </div>
        <p className="text-xl font-extrabold text-blue-400 leading-none"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          <AnimatedNumber target={hoursLearned} suffix="h" />
        </p>
        <p className="text-[9px] uppercase tracking-wider font-bold text-white/25 mt-1">Horas</p>
      </div>

      {/* Books — Top far right */}
      <div className="rounded-2xl p-3 relative overflow-hidden transition-all hover:scale-[1.02]"
        style={{
          background: "rgba(168,85,247,0.06)",
          border: "1px solid rgba(168,85,247,0.15)",
          backdropFilter: "blur(12px)",
        }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)" }} />
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(168,85,247,0.15)" }}>
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
          </div>
        </div>
        <p className="text-xl font-extrabold text-purple-400 leading-none"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          <AnimatedNumber target={completedBooks} />
        </p>
        <p className="text-[9px] uppercase tracking-wider font-bold text-white/25 mt-1">Livros</p>
      </div>

      {/* Chunks — Bottom right, spanning 2 columns */}
      <div className="col-span-2 rounded-2xl p-3 relative overflow-hidden transition-all hover:scale-[1.01]"
        style={{
          background: "rgba(34,197,94,0.06)",
          border: "1px solid rgba(34,197,94,0.15)",
          backdropFilter: "blur(12px)",
        }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.2), transparent)" }} />
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(34,197,94,0.15)" }}>
                <BookOpen className="w-3.5 h-3.5 text-green-400" />
              </div>
              <p className="text-[9px] uppercase tracking-wider font-bold text-white/25">Chunks Aprendidos</p>
            </div>
            <p className="text-2xl font-extrabold text-green-400 leading-none"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              <AnimatedNumber target={chunksLearned} />
            </p>
          </div>
          {/* Mini bar chart */}
          <div className="flex gap-1 items-end h-8">
            {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
              <div key={i} className="w-1.5 rounded-full"
                style={{
                  height: `${h}%`,
                  background: i === 6 ? "linear-gradient(0deg, #22c55e, #86efac)" : "rgba(34,197,94,0.3)",
                  transition: "height 0.5s ease-out",
                  transitionDelay: `${i * 0.05}s`,
                }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
