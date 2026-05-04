/**
 * PresenceAvatar — Elie's animated avatar with presence states
 *
 * The avatar reacts BEFORE Elie speaks. Micro-animations create
 * the feeling that Elie is truly present, not just responding.
 */

import { useMemo } from "react";

export type AvatarState = "idle" | "listening" | "thinking" | "speaking" | "reacting" | "encouraging";

interface PresenceAvatarProps {
  state: AvatarState;
  emotion: string;
  size?: "sm" | "md" | "lg" | "xl";
  showRings?: boolean;
  showWave?: boolean;
  themeAccent?: string;
  onClick?: () => void;
  studentName?: string;
}

const SIZES = { sm: 40, md: 80, lg: 110, xl: 160 } as const;

export default function PresenceAvatar({
  state = "idle",
  emotion = "neutral",
  size = "md",
  showRings = true,
  showWave = false,
  themeAccent = "#6b3fa0",
  onClick,
}: PresenceAvatarProps) {
  const px = SIZES[size];
  const ringCount = size === "sm" ? 2 : 3;

  const stateStyles = useMemo(() => {
    switch (state) {
      case "idle":
        return { animation: "elie-float 5s ease-in-out infinite", scale: 1 };
      case "listening":
        return { animation: "elie-listen 2s ease-in-out infinite", scale: 1.02 };
      case "thinking":
        return { animation: "elie-think 3s ease-in-out infinite", scale: 1 };
      case "speaking":
        return { animation: "elie-speak 0.8s ease-in-out infinite", scale: 1.03 };
      case "reacting":
        return { animation: "elie-react 0.3s ease-out", scale: 1 };
      case "encouraging":
        return { animation: "elie-encourage 2s ease-in-out infinite", scale: 1.05 };
      default:
        return { animation: "elie-float 5s ease-in-out infinite", scale: 1 };
    }
  }, [state]);

  const glowIntensity = state === "encouraging" ? 0.6 : state === "speaking" ? 0.4 : 0.2;

  return (
    <>
      {/* Keyframes — injected once */}
      <style>{`
        @keyframes elie-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes elie-listen {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes elie-think {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        @keyframes elie-speak {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes elie-react {
          0% { transform: scale(1); }
          40% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes elie-encourage {
          0%, 100% { transform: scale(1.05); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.15); }
        }
        @keyframes elie-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes elie-wave-bar {
          0%, 100% { height: 20%; }
          50% { height: 80%; }
        }
      `}</style>

      <div
        className="relative flex items-center justify-center cursor-pointer select-none"
        style={{ width: px, height: px }}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${themeAccent}${Math.round(glowIntensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
            filter: "blur(12px)",
            transform: `scale(${1.4 + glowIntensity * 0.3})`,
          }}
        />

        {/* Animated rings */}
        {showRings && Array.from({ length: ringCount }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: px,
              height: px,
              border: `1.5px solid ${themeAccent}`,
              opacity: 0.3,
              animation: `elie-ring 3s ease-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}

        {/* Main avatar orb */}
        <div
          className="relative rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: px * 0.75,
            height: px * 0.75,
            background: `linear-gradient(135deg, #6b3fa0, #2e8b7a)`,
            boxShadow: `0 0 ${px * 0.3}px ${themeAccent}40, inset 0 -${px * 0.05}px ${px * 0.1}px rgba(0,0,0,0.2)`,
            animation: stateStyles.animation,
            transform: `scale(${stateStyles.scale})`,
          }}
        >
          {/* Inner shimmer */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
            }}
          />

          {/* Elie emoji/icon */}
          <span style={{ fontSize: px * 0.3, position: "relative", zIndex: 1 }}>
            {state === "thinking" ? "🤔" : state === "encouraging" || state === "reacting" ? "✨" : "💜"}
          </span>
        </div>

        {/* Speaking wave bars */}
        {(showWave || state === "speaking") && (
          <div
            className="absolute flex items-end gap-[2px]"
            style={{ bottom: -px * 0.1, height: px * 0.18 }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: Math.max(2, px * 0.03),
                  background: themeAccent,
                  animation: `elie-wave-bar 0.6s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  height: "40%",
                }}
              />
            ))}
          </div>
        )}

        {/* State indicator dot */}
        <div
          className="absolute rounded-full"
          style={{
            width: px * 0.12,
            height: px * 0.12,
            bottom: px * 0.05,
            right: px * 0.05,
            background: state === "idle" ? "#94a3b8"
              : state === "listening" ? "#22c55e"
              : state === "thinking" ? "#f59e0b"
              : state === "speaking" ? "#3b82f6"
              : state === "encouraging" ? "#ec4899"
              : "#ef4444",
            boxShadow: `0 0 6px ${state === "idle" ? "#94a3b8" : themeAccent}`,
            border: "2px solid rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </>
  );
}
