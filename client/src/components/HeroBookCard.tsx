/**
 * HeroBookCard — Large hero card showing current book, progress, and student info
 */

import { BookOpen, Zap, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
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

// Book cover illustrations (emoji-based for MVP, can be replaced with images)
const BOOK_COVERS: Record<number, { illustration: string; subtitle: string }> = {
  1: { illustration: "🌱", subtitle: "Beginner — First Steps" },
  2: { illustration: "💧", subtitle: "Elementary — Building Blocks" },
  3: { illustration: "🔮", subtitle: "Intermediate — Expanding Horizons" },
  4: { illustration: "🔥", subtitle: "Upper Intermediate — Breaking Through" },
  5: { illustration: "🏆", subtitle: "Advanced — Mastery Path" },
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
  const font = appTheme.fontOverride || "'Syne', sans-serif";
  const primary = appTheme.id !== "spatial-glossy" ? appTheme.accentColor : bookTheme.primary;
  const gradient = appTheme.id !== "spatial-glossy"
    ? `linear-gradient(135deg, ${appTheme.accentColor}, ${appTheme.valueColor})`
    : bookTheme.gradient;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${bookTheme.primaryDark}30 0%, ${appTheme.cardBg || "rgba(255,255,255,0.05)"} 40%, ${primary}12 100%)`,
        border: `1px solid ${primary}25`,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Top gradient bar */}
      <div className="h-1.5" style={{ background: gradient }} />

      <div className="p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Book Cover */}
          <div className="flex-shrink-0 self-center sm:self-start">
            <div
              className="w-24 h-32 sm:w-28 sm:h-36 rounded-xl flex flex-col items-center justify-center relative"
              style={{
                background: `linear-gradient(160deg, ${bookTheme.primaryDark}80, ${primary}60)`,
                boxShadow: `0 12px 40px ${primary}30, inset 0 1px 0 rgba(255,255,255,0.15)`,
              }}
            >
              <span className="text-4xl sm:text-5xl mb-1">{cover.illustration}</span>
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                Book {bookNumber}
              </span>
              {/* Spine effect */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                style={{ background: `${primary}60` }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p
              className="text-sm mb-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif", color: `${appTheme.cardText || "#fff"}70` }}
            >
              Bem-vindo de volta,
            </p>
            <h1
              className="text-2xl sm:text-3xl font-extrabold truncate"
              style={{ fontFamily: font, color: appTheme.cardText || "#fff" }}
            >
              {studentName}
            </h1>

            <div className="flex items-center gap-2 mt-2 flex-wrap justify-center sm:justify-start">
              <span
                className="text-xs px-3 py-1 rounded-full font-semibold"
                style={{
                  background: `${primary}20`,
                  color: primary,
                  border: `1px solid ${primary}30`,
                }}
              >
                {level}
              </span>
              <span className="text-xs" style={{ color: `${appTheme.cardText || "#fff"}55` }}>
                Unit {currentUnit} de {totalUnits}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs" style={{ color: `${appTheme.cardText || "#fff"}60` }}>
                  Progresso do livro
                </span>
                <span className="text-xs font-bold" style={{ color: primary }}>
                  {progressPercentage}%
                </span>
              </div>
              <div
                className="h-2.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%`, background: gradient }}
                />
              </div>
            </div>

            {/* CTA */}
            <div className="mt-4 flex gap-3 justify-center sm:justify-start">
              <Button
                onClick={onContinue}
                className="h-11 px-6 rounded-xl text-sm font-semibold"
                style={{
                  background: gradient,
                  color: "#fff",
                  boxShadow: `0 4px 20px ${primary}30`,
                }}
              >
                <Zap className="w-4 h-4 mr-2" /> Continuar Estudando
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
