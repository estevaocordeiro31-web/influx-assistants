/**
 * HeroBookCard — Glassmorphism Spatial hero with frosted glass, mesh bg,
 * animated progress ring, Elie mini-message with typing indicator.
 *
 * Design: Trend 1 (Glassmorphism Spatial) from imaind_tutor_ui_trends.html
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

// Elie messages based on progress
function getElieMessage(progress: number, name: string): string {
  if (progress >= 80) return `Almost there, ${name}! You're crushing it — let's finish this book! 🔥`;
  if (progress >= 50) return `Great progress, ${name}! Keep pushing — you're over halfway! 💪`;
  if (progress >= 20) return `Hey ${name}! Ready to continue? Your journey is looking awesome! ✨`;
  return `Welcome back, ${name}! Let's start today's practice session! 🚀`;
}

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
  const secondary = appTheme.id !== "spatial-glossy" ? appTheme.valueColor : "#2e8b7a";
  const gradient = appTheme.id !== "spatial-glossy"
    ? `linear-gradient(135deg, ${appTheme.accentColor}, ${appTheme.valueColor})`
    : bookTheme.gradient;

  const [animPct, setAnimPct] = useState(0);
  const [showTyping, setShowTyping] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimPct(progressPercentage), 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  // Typing indicator → message animation
  useEffect(() => {
    const t1 = setTimeout(() => { setShowTyping(false); setShowMessage(true); }, 2200);
    return () => clearTimeout(t1);
  }, []);

  // SVG progress ring
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animPct / 100) * circumference;

  const firstName = studentName?.split(" ")[0] || "Aluno";

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="relative rounded-3xl overflow-hidden"
      style={{
        background: `rgba(255,255,255,0.04)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid rgba(255,255,255,0.09)`,
      }}>

      {/* Mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 70% 60% at 30% 40%, ${primary}25, transparent 70%),
                     radial-gradient(ellipse 50% 50% at 70% 60%, ${secondary}18, transparent 70%)`,
      }} />

      {/* Top shine line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)` }} />

      {/* Decorative orbit circles */}
      <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full"
        style={{ border: `1px solid ${primary}10` }} />
      <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full"
        style={{ border: `1px solid ${primary}08` }} />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-5">
          {/* Animated Progress ring with book emoji */}
          <div className="flex-shrink-0 relative">
            <svg width="104" height="104" viewBox="0 0 104 104" className="transform -rotate-90">
              <circle cx="52" cy="52" r={radius} fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <circle cx="52" cy="52" r={radius} fill="none"
                stroke={primary} strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)", filter: `drop-shadow(0 0 8px ${primary}60)` }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl">{cover.emoji}</span>
              <span className="text-[9px] font-bold text-white/50 mt-0.5">Book {bookNumber}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Greeting */}
            <p className="text-white/35 text-xs mb-0.5">{greeting},</p>
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

            {/* Progress bar with gradient */}
            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full"
                style={{
                  width: `${animPct}%`,
                  background: gradient,
                  transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: `0 0 12px ${primary}40`,
                }} />
            </div>
          </div>
        </div>

        {/* Elie mini-message (Glassmorphism Spatial pattern) */}
        <div className="flex items-center gap-3 mt-5 p-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
            style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
            🌌
          </div>
          <div className="flex-1 min-w-0">
            {showTyping && !showMessage && (
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/30"
                    style={{
                      animation: "elie-type-bounce 0.8s ease-in-out infinite",
                      animationDelay: `${i * 0.15}s`,
                    }} />
                ))}
              </div>
            )}
            {showMessage && (
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed truncate">
                "{getElieMessage(progressPercentage, firstName)}"
              </p>
            )}
          </div>
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-3 mt-4">
          <button onClick={onContinue}
            className="liquid-glass liquid-glass-purple flex-1 flex items-center justify-center gap-2 py-3.5 text-white text-sm font-bold relative z-10">
            <Zap className="w-4 h-4" /> Continuar Estudando
          </button>
          <button onClick={onContinue}
            className="liquid-glass w-12 h-12 flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-white/40" />
          </button>
        </div>
      </div>

      {/* CSS for typing animation */}
      <style>{`
        @keyframes elie-type-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
