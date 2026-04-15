/**
 * ElieCompanion — Animated avatar with 5 presence states
 * Pure CSS animations, no external libs.
 *
 * States: idle | greeting | talking | thinking | listening
 * Sizes:  mini (40px) | medium (80px) | full (200px)
 */
import { useEffect, useState } from "react";

export type ElieState = "idle" | "greeting" | "talking" | "thinking" | "listening";
export type ElieSize = "mini" | "medium" | "full";

interface ElieCompanionProps {
  state?: ElieState;
  size?: ElieSize;
  className?: string;
  onClick?: () => void;
}

const SIZES: Record<ElieSize, number> = { mini: 40, medium: 80, full: 200 };

const AURA_COLORS: Record<ElieState, string> = {
  idle: "var(--elie-aura-idle, rgba(26,111,219,0.15))",
  greeting: "var(--elie-aura-greeting, rgba(106,191,75,0.2))",
  talking: "var(--elie-aura-talking, rgba(26,111,219,0.25))",
  thinking: "var(--elie-aura-thinking, rgba(251,191,36,0.2))",
  listening: "var(--elie-aura-listening, rgba(168,85,247,0.2))",
};

export function ElieCompanion({
  state = "idle",
  size = "medium",
  className = "",
  onClick,
}: ElieCompanionProps) {
  const px = SIZES[size];
  const showSparkles = state === "greeting";
  const showDots = state === "thinking";
  const showWaves = state === "talking";
  const showRing = state === "listening";

  return (
    <div
      className={`elie-companion elie-companion--${size} ${className}`}
      onClick={onClick}
      style={{
        position: "relative",
        width: px,
        height: px,
        cursor: onClick ? "pointer" : "default",
        flexShrink: 0,
      }}
    >
      {/* Aura */}
      <div
        style={{
          position: "absolute",
          inset: size === "mini" ? -4 : size === "medium" ? -8 : -16,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${AURA_COLORS[state]} 0%, transparent 70%)`,
          animation: "elie-aura-pulse 2.5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Listening ring */}
      {showRing && (
        <>
          <ListeningRing size={px} delay={0} />
          <ListeningRing size={px} delay={0.6} />
        </>
      )}

      {/* Main avatar body */}
      <div
        style={{
          position: "relative",
          width: px,
          height: px,
          borderRadius: "50%",
          overflow: "hidden",
          animation:
            state === "idle"
              ? "elie-breathe 4s ease-in-out infinite, elie-float 6s ease-in-out infinite"
              : state === "greeting"
              ? "elie-bounce 1s ease-in-out"
              : state === "talking"
              ? "elie-breathe 2s ease-in-out infinite"
              : state === "thinking"
              ? "elie-thinking-tilt 2s ease-in-out infinite"
              : "elie-breathe 3s ease-in-out infinite",
          zIndex: 2,
        }}
      >
        <ElieAvatar size={px} state={state} />
      </div>

      {/* Sparkles (greeting) */}
      {showSparkles && size !== "mini" && (
        <Sparkles count={size === "full" ? 6 : 3} containerSize={px} />
      )}

      {/* Thinking dots */}
      {showDots && size !== "mini" && (
        <ThinkingDots size={size} containerSize={px} />
      )}

      {/* Sound waves (talking) */}
      {showWaves && size !== "mini" && (
        <SoundWaves containerSize={px} />
      )}
    </div>
  );
}

/* ==============================
   Sub-components
   ============================== */

function ElieAvatar({ size, state }: { size: number; state: ElieState }) {
  const eyeSize = size * 0.06;
  const pupilSize = size * 0.03;
  const smileWidth = size * 0.25;

  const eyeOpenness = state === "thinking" ? 0.7 : state === "listening" ? 1.2 : 1;
  const mouthCurve = state === "greeting" ? 8 : state === "talking" ? 4 : state === "thinking" ? 0 : 5;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: "block" }}
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="50" fill="#e8f4fd" />

      {/* Hair */}
      <ellipse cx="50" cy="30" rx="38" ry="28" fill="#5a3825" />
      <ellipse cx="50" cy="22" rx="34" ry="22" fill="#6b4430" />

      {/* Face */}
      <ellipse cx="50" cy="52" rx="30" ry="32" fill="#fce4c8" />

      {/* Eyes */}
      <g>
        {/* Left eye */}
        <ellipse
          cx="39"
          cy="48"
          rx={eyeSize}
          ry={eyeSize * eyeOpenness}
          fill="white"
          stroke="#d4a574"
          strokeWidth="0.5"
        />
        <circle cx="39" cy="48" r={pupilSize} fill="#2d3a5c" />
        <circle cx="38" cy="47" r={pupilSize * 0.4} fill="white" />

        {/* Right eye */}
        <ellipse
          cx="61"
          cy="48"
          rx={eyeSize}
          ry={eyeSize * eyeOpenness}
          fill="white"
          stroke="#d4a574"
          strokeWidth="0.5"
        />
        <circle cx="61" cy="48" r={pupilSize} fill="#2d3a5c" />
        <circle cx="60" cy="47" r={pupilSize * 0.4} fill="white" />
      </g>

      {/* Blush */}
      <ellipse cx="33" cy="56" rx="5" ry="3" fill="rgba(255,150,150,0.3)" />
      <ellipse cx="67" cy="56" rx="5" ry="3" fill="rgba(255,150,150,0.3)" />

      {/* Mouth */}
      {state === "talking" ? (
        <ellipse cx="50" cy="62" rx="6" ry="4" fill="#e87a7a" />
      ) : (
        <path
          d={`M ${50 - smileWidth / 2} 60 Q 50 ${60 + mouthCurve} ${50 + smileWidth / 2} 60`}
          fill="none"
          stroke="#c47a6a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}

      {/* Elie's headband (blue — ImAInd brand) */}
      <path
        d="M 16 38 Q 50 28 84 38"
        fill="none"
        stroke="#1a6fdb"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="72" cy="35" r="3.5" fill="#1a6fdb" />
      <circle cx="72" cy="35" r="1.5" fill="#4da8ff" />
    </svg>
  );
}

function Sparkles({ count, containerSize }: { count: number; containerSize: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i - 90;
        const rad = (angle * Math.PI) / 180;
        const dist = containerSize * 0.55;
        const x = containerSize / 2 + Math.cos(rad) * dist - 4;
        const y = containerSize / 2 + Math.sin(rad) * dist - 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--imaind-green, #6abf4b)",
              animation: `elie-sparkle 1.2s ease-in-out ${i * 0.15}s infinite`,
              zIndex: 3,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
}

function ThinkingDots({ size, containerSize }: { size: ElieSize; containerSize: number }) {
  const dotSize = size === "full" ? 8 : 6;
  const bottom = size === "full" ? -20 : -14;
  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: dotSize * 0.6,
        zIndex: 3,
        pointerEvents: "none",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: "var(--xp-gold, #f59e0b)",
            animation: `elie-dots 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function SoundWaves({ containerSize }: { containerSize: number }) {
  const barCount = 4;
  const barWidth = 3;
  const bottom = -16;
  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "flex-end",
        gap: 2,
        height: 20,
        zIndex: 3,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          style={{
            width: barWidth,
            borderRadius: barWidth / 2,
            background: "var(--imaind-blue, #1a6fdb)",
            animation: `elie-soundwave 0.8s ease-in-out ${i * 0.1}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function ListeningRing({ size, delay }: { size: number; delay: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        border: "2px solid rgba(168, 85, 247, 0.4)",
        animation: `elie-listening-ring 1.5s ease-out ${delay}s infinite`,
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}

/* ==============================
   Floating Companion (fixed overlay)
   ============================== */

interface ElieFloatingProps {
  state?: ElieState;
  onClick?: () => void;
  visible?: boolean;
}

export function ElieFloating({ state = "idle", onClick, visible = true }: ElieFloatingProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setMounted(true), 100);
      return () => clearTimeout(t);
    }
    setMounted(false);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 50,
        transition: "opacity 0.3s, transform 0.3s",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "scale(1)" : "scale(0.8)",
      }}
    >
      <ElieCompanion state={state} size="medium" onClick={onClick} />
    </div>
  );
}

export default ElieCompanion;
