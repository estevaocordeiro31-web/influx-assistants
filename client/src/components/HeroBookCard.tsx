/**
 * HeroBookCard — Redesigned hero with bold visual identity
 *
 * Full-width gradient card with orbit decoration, animated progress ring,
 * and prominent student greeting.
 */

import { useEffect, useState } from "react";
import { Zap, ChevronRight } from "lucide-react";
import type { BookTheme } from "@/lib/book-themes";
import type { AppTheme } from "@/lib/themes";

interface HeroBookCardProps {
  studentName: string;
  bookNumber: number;
  bookTheme: BookTheme;
  appTheme: AppTheme;
  currentUnit: number;
  totalUnits: number;
  progressPercentage: number;
  level: string;
  onContinue: () => void;
}

const BOOK_COVERS: Record<number, { emoji: string; label: string }> = {
  1: { emoji: "🌱", label: "Beginner" },
  2: { emoji: "💧", label: "Elementary" },
  3: { emoji: "🔮", label: "Intermediate" },
  4: { emoji: "🔥", label: "Upper Int." },
  5: { emoji: "🏆", label: "Advanced" },
};

export default function HeroBookCard({
  studentName,
  bookNumber,
  bookTheme,
  appTheme,
  currentUnit,
  totalUnits,
  progressPercentage,
  level,
  onContinue,
}: HeroBookCardProps) {
  const cover = BOOK_COVERS[bookNumber] || BOOK_COVERS[1];
  const primary = appTheme.id !== "spatial-glossy" ? appTheme.accentColor : bookTheme.primary;
  const gradient = appTheme.id !== "spatial-glossy"
    ? `linear-gradient(135deg, ${appTheme.accentColor}, ${appTheme.valueColor})`
    : bookTheme.gradient;

  const [animPct, setAnimPct] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setAnimPct(progressPercentage), 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  // SVG progress ring
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animPct / 100) * circumference;

  const firstName = studentName?.split(" ")[0] || "Aluno";

  return (
    <div className="relative rounded-3xl overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${primary}18 0%, rgba(10,10,26,0.9) 50%, ${primary}08 100%)`,
        border: `1px solid ${primary}20`,
      }}>

      {/* Decorative orbit circles */}
      <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full"
        style={{ border: `1px solid ${primary}10` }} />
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full"
        style={{ border: `1px solid ${primary}08` }} />
      <div className="absolute -left-20 -bottom-20 w-56 h-56 rounded-full"
        style={{ background: `radial-gradient(circle, ${primary}06, transparent 70%)` }} />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-6">
          {/* Progress ring with book emoji */}
          <div className="flex-shrink-0 relative">
            <svg width="96" height="96" viewBox="0 0 96 96" className="transform -rotate-90">
              <circle cx="48" cy="48" r={radius} fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <circle cx="48" cy="48" r={radius} fill="none"
                stroke={primary} strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 1.2s ease-out" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl">{cover.emoji}</span>
              <span className="text-[9px] font-bold text-white/50 mt-0.5">Book {bookNumber}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Greeting */}
            <p className="text-white/35 text-xs mb-0.5">Boa noite,</p>
            <h1 className="text-white text-2xl sm:text-3xl font-extrabold truncate leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              {firstName}
            </h1>

            {/* Pills row */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ background: `${primary}20`, color: primary, border: `1px solid ${primary}30` }}>
                {level}
              </span>
              <span className="text-white/25 text-xs">
                Unit {currentUnit}/{totalUnits}
              </span>
              <span className="text-xs font-bold" style={{ color: primary }}>
                {animPct}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${animPct}%`, background: gradient }} />
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-3 mt-5">
          <button onClick={onContinue}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-bold transition-all active:scale-[0.97]"
            style={{ background: gradient, boxShadow: `0 6px 24px ${primary}25` }}>
            <Zap className="w-4 h-4" /> Continuar Estudando
          </button>
          <button onClick={onContinue}
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <ChevronRight className="w-5 h-5 text-white/30" />
          </button>
        </div>
      </div>
    </div>
  );
}
