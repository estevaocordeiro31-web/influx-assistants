/**
 * SessionSummary — End-of-voice-session card
 *
 * Shows duration, XP, pronunciation score, words practiced,
 * top errors, and Elie's personalized closing message.
 */

import { useEffect, useState } from "react";
import { Clock, Zap, Mic, BookOpen, AlertCircle, ChevronRight, X } from "lucide-react";

interface SessionSummaryData {
  sessionId: string;
  duration: number;
  totalExchanges: number;
  avgPronunciationScore: number;
  xpEarned: number;
  wordsLearned: string[];
  topErrors: Array<{ expected: string; heard: string; tip: string }>;
  elieClosingMessage: string;
}

interface SessionSummaryProps {
  data: SessionSummaryData;
  onContinue: () => void;
  onViewProgress?: () => void;
  themeColor?: string;
}

export default function SessionSummary({
  data,
  onContinue,
  onViewProgress,
  themeColor = "#6b3fa0",
}: SessionSummaryProps) {
  const [animXp, setAnimXp] = useState(0);
  const [animScore, setAnimScore] = useState(0);
  const [visible, setVisible] = useState(false);

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Animate counters
  useEffect(() => {
    const frames = 40;
    let i = 0;
    const xpStep = data.xpEarned / frames;
    const scoreStep = data.avgPronunciationScore / frames;

    const timer = setInterval(() => {
      i++;
      setAnimXp(Math.min(data.xpEarned, Math.round(xpStep * i)));
      setAnimScore(Math.min(data.avgPronunciationScore, Math.round(scoreStep * i)));
      if (i >= frames) clearInterval(timer);
    }, 25);

    return () => clearInterval(timer);
  }, [data.xpEarned, data.avgPronunciationScore]);

  // Gradient based on score
  const score = data.avgPronunciationScore;
  const gradient =
    score >= 80
      ? "linear-gradient(135deg, rgba(234,179,8,0.12), rgba(249,115,22,0.08))"
      : score >= 60
        ? "linear-gradient(135deg, rgba(107,63,160,0.12), rgba(46,139,122,0.08))"
        : "linear-gradient(135deg, rgba(46,139,122,0.12), rgba(6,182,212,0.08))";

  const accentColor = score >= 80 ? "#eab308" : score >= 60 ? "#a855f7" : "#2e8b7a";

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        background: gradient,
        border: `1px solid ${accentColor}25`,
        backdropFilter: "blur(16px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
      }}
    >
      {/* Top bar */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${themeColor}, ${accentColor})` }} />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
              Session Complete!
            </h2>
            <p className="text-white/40 text-xs mt-0.5">Voice practice with Miss Elie</p>
          </div>
          <button onClick={onContinue} className="text-white/30 hover:text-white/60 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatBox icon={Clock} label="Duration" value={`${data.duration}min`} color="#38bdf8" />
          <StatBox icon={Zap} label="XP Earned" value={`+${animXp}`} color="#eab308" />
          <StatBox icon={Mic} label="Score" value={`${animScore}%`} color={accentColor} />
          <StatBox icon={BookOpen} label="Words" value={`${data.wordsLearned.length}`} color="#22c55e" />
        </div>

        {/* Words learned */}
        {data.wordsLearned.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-2">Words Practiced</p>
            <div className="flex flex-wrap gap-1.5">
              {data.wordsLearned.slice(0, 12).map((word, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-lg text-xs font-medium"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#86efac", border: "1px solid rgba(34,197,94,0.15)" }}
                >
                  {word}
                </span>
              ))}
              {data.wordsLearned.length > 12 && (
                <span className="px-2 py-1 text-xs text-white/30">+{data.wordsLearned.length - 12} more</span>
              )}
            </div>
          </div>
        )}

        {/* Top errors */}
        {data.topErrors.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-2">Focus Next Time</p>
            <div className="space-y-1.5">
              {data.topErrors.slice(0, 2).map((err, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400/60 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/60">
                      <span className="text-red-400">"{err.heard}"</span> → <span className="text-green-400">"{err.expected}"</span>
                    </p>
                    <p className="text-[10px] text-white/30 mt-0.5">{err.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Elie's closing message */}
        <div
          className="rounded-xl p-4 mb-4"
          style={{
            background: `linear-gradient(135deg, ${themeColor}10, rgba(46,139,122,0.06))`,
            border: `1px solid ${themeColor}15`,
          }}
        >
          <p className="text-sm text-white/80 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {data.elieClosingMessage}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onContinue}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
            style={{ background: `linear-gradient(135deg, ${themeColor}, #2e8b7a)`, boxShadow: `0 4px 16px ${themeColor}30` }}
          >
            Continue
          </button>
          {onViewProgress && (
            <button
              onClick={onViewProgress}
              className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Progress <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── StatBox sub-component ────────────────────────────────────────────────────

function StatBox({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ background: `${color}10`, border: `1px solid ${color}15` }}
    >
      <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
      <p className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
        {value}
      </p>
      <p className="text-[10px] text-white/40 uppercase">{label}</p>
    </div>
  );
}
