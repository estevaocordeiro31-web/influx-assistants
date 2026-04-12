/**
 * PronunciationFeedback — Visual feedback on student pronunciation
 *
 * Highlights correct (green) and incorrect (red) phonemes,
 * shows score, and displays Elie's contextual tip.
 */

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Volume2, RotateCcw } from "lucide-react";

interface PhonemeError {
  expected: string;
  heard: string;
  position: number;
  tip: string;
}

interface PronunciationFeedbackProps {
  expectedText: string;
  score: number;
  phonemeErrors: PhonemeError[];
  elieResponse: string;
  xpEarned: number;
  onRetry?: () => void;
  onDismiss?: () => void;
  themeColor?: string;
}

export default function PronunciationFeedback({
  expectedText,
  score,
  phonemeErrors,
  elieResponse,
  xpEarned,
  onRetry,
  onDismiss,
  themeColor = "#6b3fa0",
}: PronunciationFeedbackProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showXp, setShowXp] = useState(false);

  // Animate score counting up
  useEffect(() => {
    let frame = 0;
    const targetFrames = 30;
    const step = score / targetFrames;

    const timer = setInterval(() => {
      frame++;
      setAnimatedScore(Math.min(score, Math.round(step * frame)));
      if (frame >= targetFrames) {
        clearInterval(timer);
        setShowXp(true);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [score]);

  // Color based on score
  const scoreColor = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  const scoreBg = score >= 80 ? "rgba(34,197,94,0.12)" : score >= 60 ? "rgba(234,179,8,0.12)" : "rgba(239,68,68,0.12)";

  // Highlight words
  const words = expectedText.split(/\s+/);
  const errorPositions = new Set(phonemeErrors.map((e) => e.position));

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(15,10,30,0.95)",
        border: `1px solid ${scoreColor}30`,
        backdropFilter: "blur(16px)",
        animation: "pf-slide-in 0.3s ease-out",
      }}
    >
      {/* Score bar */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${scoreColor}, ${themeColor})` }} />

      <div className="p-4 sm:p-5">
        {/* Score + XP */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-xl flex flex-col items-center justify-center"
              style={{ background: scoreBg }}
            >
              <span className="text-xl font-bold" style={{ color: scoreColor, fontFamily: "'Syne', sans-serif" }}>
                {animatedScore}
              </span>
              <span className="text-[8px] uppercase font-bold" style={{ color: `${scoreColor}99` }}>
                score
              </span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">
                {score >= 80 ? "Excellent!" : score >= 60 ? "Good try!" : "Keep practicing!"}
              </p>
              <p className="text-white/40 text-xs">Pronunciation check</p>
            </div>
          </div>

          {showXp && xpEarned > 0 && (
            <div
              className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: "rgba(234,179,8,0.15)",
                color: "#eab308",
                animation: "pf-xp-pop 0.4s ease-out",
              }}
            >
              +{xpEarned} XP
            </div>
          )}
        </div>

        {/* Highlighted words */}
        <div
          className="rounded-xl p-4 mb-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs text-white/40 mb-2 uppercase font-bold tracking-wider">Expected phrase</p>
          <div className="flex flex-wrap gap-1.5">
            {words.map((word, i) => {
              const isError = errorPositions.has(i);
              return (
                <span
                  key={i}
                  className="px-2 py-1 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: isError ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.12)",
                    color: isError ? "#fca5a5" : "#86efac",
                    border: `1px solid ${isError ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.2)"}`,
                  }}
                >
                  {isError ? <XCircle className="w-3 h-3 inline mr-1 opacity-60" /> : <CheckCircle className="w-3 h-3 inline mr-1 opacity-60" />}
                  {word}
                </span>
              );
            })}
          </div>
        </div>

        {/* Error details */}
        {phonemeErrors.length > 0 && (
          <div className="space-y-2 mb-3">
            {phonemeErrors.slice(0, 3).map((err, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-lg"
                style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.1)" }}
              >
                <Volume2 className="w-3.5 h-3.5 text-red-400/60 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/70">
                    <span className="text-red-400 font-semibold">"{err.heard}"</span>
                    {" → "}
                    <span className="text-green-400 font-semibold">"{err.expected}"</span>
                  </p>
                  <p className="text-[11px] text-white/40 mt-0.5">{err.tip}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Elie's response */}
        <div
          className="rounded-xl p-3 mb-3"
          style={{
            background: `linear-gradient(135deg, ${themeColor}10, rgba(46,139,122,0.08))`,
            border: `1px solid ${themeColor}20`,
          }}
        >
          <p className="text-xs text-white/50 mb-1 font-semibold">Miss Elie says:</p>
          <p className="text-sm text-white/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {elieResponse}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ background: `${themeColor}20`, color: themeColor, border: `1px solid ${themeColor}30` }}
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/50 transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Continue
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pf-slide-in {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pf-xp-pop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
