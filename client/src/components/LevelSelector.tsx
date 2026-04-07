import { useState } from "react";
import { Button } from "@/components/ui/button";

export type AudienceType = "kids" | "teens" | "adults";
export type LevelType = "beginner" | "intermediate" | "advanced" | "master";

export interface LevelConfig {
  audience: AudienceType;
  level: LevelType;
}

interface LevelSelectorProps {
  onSelect: (config: LevelConfig) => void;
  title?: string;
  subtitle?: string;
}

const AUDIENCES = [
  {
    id: "kids" as AudienceType,
    label: "Kids",
    emoji: "🧒",
    age: "7–12 anos",
    color: "#f59e0b",
    bg: "from-yellow-800 to-yellow-600",
  },
  {
    id: "teens" as AudienceType,
    label: "Teens",
    emoji: "🧑",
    age: "13–17 anos",
    color: "#3b82f6",
    bg: "from-blue-800 to-blue-600",
  },
  {
    id: "adults" as AudienceType,
    label: "Adults",
    emoji: "🧑‍💼",
    age: "18+ anos",
    color: "#22c55e",
    bg: "from-green-800 to-green-600",
  },
];

const LEVELS = [
  {
    id: "beginner" as LevelType,
    label: "Beginner",
    emoji: "🌱",
    desc: "Simple words, basic sentences",
    color: "#22c55e",
    stars: 1,
  },
  {
    id: "intermediate" as LevelType,
    label: "Intermediate",
    emoji: "🌿",
    desc: "More vocabulary, longer phrases",
    color: "#3b82f6",
    stars: 2,
  },
  {
    id: "advanced" as LevelType,
    label: "Advanced",
    emoji: "🌳",
    desc: "Complex sounds, fast speech",
    color: "#f59e0b",
    stars: 3,
  },
  {
    id: "master" as LevelType,
    label: "Master",
    emoji: "🔥",
    desc: "Native-level challenge!",
    color: "#ef4444",
    stars: 4,
  },
];

export default function LevelSelector({ onSelect, title, subtitle }: LevelSelectorProps) {
  const [selectedAudience, setSelectedAudience] = useState<AudienceType | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelType | null>(null);

  const handleStart = () => {
    if (selectedAudience && selectedLevel) {
      onSelect({ audience: selectedAudience, level: selectedLevel });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 to-green-800 flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">☘️</div>
        <h1 className="text-2xl font-black text-yellow-400 tracking-wide">
          {title || "Choose Your Level"}
        </h1>
        <p className="text-white/70 text-sm mt-1">
          {subtitle || "Select your audience and difficulty"}
        </p>
      </div>

      {/* Audience selection */}
      <div className="w-full max-w-sm mb-6">
        <p className="text-white/60 text-xs uppercase tracking-widest mb-3 text-center">Who's playing?</p>
        <div className="grid grid-cols-3 gap-2">
          {AUDIENCES.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedAudience(a.id)}
              className={`rounded-xl p-3 flex flex-col items-center gap-1 border-2 transition-all ${
                selectedAudience === a.id
                  ? "border-yellow-400 bg-white/20 scale-105"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-white font-bold text-sm">{a.label}</span>
              <span className="text-white/50 text-xs">{a.age}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Level selection */}
      <div className="w-full max-w-sm mb-6">
        <p className="text-white/60 text-xs uppercase tracking-widest mb-3 text-center">Difficulty</p>
        <div className="flex flex-col gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedLevel(l.id)}
              className={`rounded-xl px-4 py-3 flex items-center gap-3 border-2 transition-all text-left ${
                selectedLevel === l.id
                  ? "border-yellow-400 bg-white/20"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
            >
              <span className="text-2xl">{l.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">{l.label}</span>
                  <span className="text-xs">
                    {"⭐".repeat(l.stars)}
                  </span>
                </div>
                <p className="text-white/50 text-xs">{l.desc}</p>
              </div>
              {selectedLevel === l.id && (
                <span className="text-yellow-400 text-lg">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <Button
        onClick={handleStart}
        disabled={!selectedAudience || !selectedLevel}
        className="w-full max-w-sm h-14 text-lg font-black bg-yellow-500 hover:bg-yellow-400 text-green-950 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl"
      >
        {selectedAudience && selectedLevel
          ? `🍀 Start as ${AUDIENCES.find(a => a.id === selectedAudience)?.label} — ${LEVELS.find(l => l.id === selectedLevel)?.label}!`
          : "Select audience & level to start"}
      </Button>
    </div>
  );
}
