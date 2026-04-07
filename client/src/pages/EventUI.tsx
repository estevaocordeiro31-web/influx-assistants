import { Trophy, Star, Zap, CheckCircle2, Lock } from "lucide-react";

// InfluxCoins display
interface InfluxCoinsDisplayProps {
  points: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function InfluxCoinsDisplay({ points, label, size = "md" }: InfluxCoinsDisplayProps) {
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-3xl" : "text-xl";
  const iconSize = size === "sm" ? 16 : size === "lg" ? 28 : 20;

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #f4a923, #e8890c)",
          width: iconSize + 8,
          height: iconSize + 8,
        }}
      >
        <Star size={iconSize - 4} className="text-white fill-white" />
      </div>
      <span className={`font-bold ${textSize}`} style={{ color: "#f4a923" }}>
        {points.toLocaleString()}
      </span>
      {label && <span className="text-xs text-gray-400">{label}</span>}
    </div>
  );
}

// Mission card for EventHub
interface MissionCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  completed: boolean;
  locked: boolean;
  score?: number;
  onClick: () => void;
}

export function MissionCard({ title, description, icon, points, completed, locked, score, onClick }: MissionCardProps) {
  return (
    <button
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className="w-full text-left rounded-2xl p-4 transition-all duration-200 relative overflow-hidden"
      style={{
        background: completed
          ? "linear-gradient(135deg, #2d6a4f22, #2d6a4f44)"
          : locked
          ? "rgba(255,255,255,0.03)"
          : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))",
        border: completed
          ? "2px solid #2d6a4f88"
          : locked
          ? "2px solid rgba(255,255,255,0.08)"
          : "2px solid rgba(244,169,35,0.3)",
        cursor: locked ? "not-allowed" : "pointer",
        opacity: locked ? 0.5 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: completed ? "#2d6a4f" : locked ? "rgba(255,255,255,0.1)" : "#f4a92333",
          }}
        >
          {locked ? <Lock size={18} className="text-gray-500" /> : icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-sm text-white truncate">{title}</h3>
            {completed ? (
              <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
            ) : (
              <span className="text-xs font-bold text-yellow-400 flex-shrink-0">+{points}pts</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{description}</p>
          {completed && score !== undefined && (
            <div className="mt-1.5 flex items-center gap-1">
              <div className="flex-1 h-1.5 rounded-full bg-gray-700">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, score)}%`, background: "#2d6a4f" }}
                />
              </div>
              <span className="text-xs text-green-400">{score}pts</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// Score badge
interface ScoreBadgeProps {
  score: number;
  maxScore: number;
  label: string;
}

export function ScoreBadge({ score, maxScore, label }: ScoreBadgeProps) {
  const pct = Math.round((score / maxScore) * 100);
  const color = pct >= 80 ? "#2d6a4f" : pct >= 60 ? "#f4a923" : "#e53935";

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg"
        style={{ background: `conic-gradient(${color} ${pct}%, rgba(255,255,255,0.1) 0)` }}
      >
        <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color }}>{pct}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

// Event header with countdown
interface EventHeaderProps {
  eventName: string;
  totalPoints: number;
  missionsCompleted: number;
  totalMissions: number;
}

export function EventHeader({ eventName, totalPoints, missionsCompleted, totalMissions }: EventHeaderProps) {
  return (
    <div
      className="rounded-2xl p-4 mb-4"
      style={{
        background: "linear-gradient(135deg, #2d6a4f, #1b4332)",
        border: "2px solid #40916c44",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">{eventName}</h1>
          <p className="text-xs text-green-300">{missionsCompleted}/{totalMissions} missões • 21 de março</p>
        </div>
        <InfluxCoinsDisplay points={totalPoints} size="lg" />
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-300 mb-1">
          <span>Progresso</span>
          <span>{Math.round((missionsCompleted / totalMissions) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-black/30">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(missionsCompleted / totalMissions) * 100}%`,
              background: "linear-gradient(90deg, #f4a923, #40916c)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
