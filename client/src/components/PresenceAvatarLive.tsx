/**
 * PresenceAvatarLive — 2.5D SVG avatar with real-time lipsync
 *
 * Semi-realistic face with CSS animations + SVG mouth driven by MouthShape.
 * States: idle, listening, thinking, speaking, reacting, encouraging
 */

import { useEffect, useRef, useState, useCallback } from "react";
import type { MouthShape } from "@/lib/lipsync-engine";

type AvatarState = "idle" | "listening" | "thinking" | "speaking" | "reacting" | "encouraging";

interface PresenceAvatarLiveProps {
  state: AvatarState;
  mouthShape: MouthShape;
  emotion: string;
  size: number;
  themeColor: string;
  isListening: boolean;
  isSpeaking: boolean;
  onClick?: () => void;
}

// ── Blink logic ──────────────────────────────────────────────────────────────

function useRandomBlink() {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
      timeout = setTimeout(blink, 3000 + Math.random() * 4000);
    };

    timeout = setTimeout(blink, 2000 + Math.random() * 3000);
    return () => clearTimeout(timeout);
  }, []);

  return isBlinking;
}

// ── Pupil tracking ───────────────────────────────────────────────────────────

function usePupilDrift(state: AvatarState) {
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (state === "thinking") {
      // Look up-right when thinking
      setPupilOffset({ x: 2.5, y: -3 });
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    const drift = () => {
      setPupilOffset({
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 2,
      });
      timeout = setTimeout(drift, 2000 + Math.random() * 3000);
    };

    drift();
    return () => clearTimeout(timeout);
  }, [state]);

  return pupilOffset;
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function PresenceAvatarLive({
  state,
  mouthShape,
  emotion,
  size,
  themeColor,
  isListening,
  isSpeaking,
  onClick,
}: PresenceAvatarLiveProps) {
  const isBlinking = useRandomBlink();
  const pupilOffset = usePupilDrift(state);

  // ── Derived values ─────────────────────────────────────────────────────

  const glowColor = (() => {
    if (isSpeaking) return themeColor;
    if (isListening) return "#2e8b7a";
    switch (state) {
      case "reacting": return "#eab308";
      case "encouraging": return "#f59e0b";
      case "thinking": return "#7c3aed";
      default: return themeColor;
    }
  })();

  const glowIntensity = isSpeaking || isListening ? 0.6 : state === "idle" ? 0.2 : 0.4;

  const headRotation = (() => {
    switch (state) {
      case "listening": return -3;
      case "encouraging": return 5;
      case "reacting": return 0;
      default: return 0;
    }
  })();

  const browY = (() => {
    switch (state) {
      case "listening": return -2;
      case "reacting": return -3;
      case "thinking": return 1;
      case "encouraging": return -1;
      default: return 0;
    }
  })();

  const eyeOpenness = (() => {
    if (isBlinking) return 0.1;
    switch (state) {
      case "listening": return 1.15;
      case "reacting": return 1.3;
      default: return 1;
    }
  })();

  // ── Mouth SVG path from MouthShape ─────────────────────────────────────

  const mouthPath = (() => {
    const o = mouthShape.openness;
    const r = mouthShape.roundness;
    const s = mouthShape.stretch;

    // Base mouth at center of SVG face (cx=50, cy=68)
    const width = 12 + s * 6 - r * 4;
    const height = Math.max(0.5, o * 10);
    const cx = 50;
    const cy = 68;

    if (o < 0.05) {
      // Closed mouth — just a line, smile if encouraging
      const smileY = state === "encouraging" ? -2 : 0;
      return `M ${cx - width} ${cy + smileY} Q ${cx} ${cy + 2 + smileY} ${cx + width} ${cy + smileY}`;
    }

    // Open mouth with shape variation
    const topLip = cy - height * 0.3;
    const botLip = cy + height;
    const roundW = r > 0.5 ? width * 0.7 : width;

    return `M ${cx - roundW} ${cy}
            Q ${cx - roundW * 0.5} ${topLip} ${cx} ${topLip}
            Q ${cx + roundW * 0.5} ${topLip} ${cx + roundW} ${cy}
            Q ${cx + roundW * 0.5} ${botLip} ${cx} ${botLip}
            Q ${cx - roundW * 0.5} ${botLip} ${cx - roundW} ${cy} Z`;
  })();

  // Teeth hint for open mouth
  const showTeeth = mouthShape.openness > 0.3 || mouthShape.lipShape === "teeth";

  // ── CSS animation class ────────────────────────────────────────────────

  const floatAnim = state === "idle" ? "elie-float" : "";
  const reactAnim = state === "reacting" ? "elie-react-burst" : "";
  const bobAnim = isSpeaking ? "elie-speak-bob" : "";

  return (
    <div
      className={`relative cursor-pointer select-none ${floatAnim} ${reactAnim}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-500"
        style={{
          background: `radial-gradient(circle, ${glowColor}${Math.round(glowIntensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          animation: isSpeaking ? "elie-glow-pulse 1.5s ease-in-out infinite" : undefined,
        }}
      />

      {/* Listening ring */}
      {isListening && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid #2e8b7a`,
            animation: "elie-listen-ring 2s ease-in-out infinite",
            opacity: 0.5,
          }}
        />
      )}

      {/* SVG Avatar */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${bobAnim}`}
        style={{
          transform: `rotate(${headRotation}deg)`,
          transition: "transform 0.5s ease-out",
        }}
      >
        <defs>
          {/* Face gradient */}
          <radialGradient id="faceGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#fde8d8" />
            <stop offset="80%" stopColor="#f0c9a8" />
            <stop offset="100%" stopColor="#e5b694" />
          </radialGradient>

          {/* Hair gradient */}
          <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d1b4e" />
            <stop offset="100%" stopColor="#1a0e30" />
          </linearGradient>

          {/* Lip color */}
          <linearGradient id="lipGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e88090" />
            <stop offset="100%" stopColor="#d4607a" />
          </linearGradient>

          {/* Eye gradient */}
          <radialGradient id="irisGrad" cx="50%" cy="40%" r="45%">
            <stop offset="0%" stopColor="#7c5cbf" />
            <stop offset="100%" stopColor="#4a2d7a" />
          </radialGradient>
        </defs>

        {/* Hair (back) */}
        <ellipse cx="50" cy="38" rx="34" ry="32" fill="url(#hairGrad)" />

        {/* Face */}
        <ellipse cx="50" cy="50" rx="28" ry="32" fill="url(#faceGrad)" />

        {/* Hair (front bangs) */}
        <path
          d="M 22 38 Q 30 18 50 20 Q 70 18 78 38 Q 70 28 50 30 Q 30 28 22 38"
          fill="url(#hairGrad)"
        />

        {/* Eyebrows */}
        <g style={{ transform: `translateY(${browY}px)`, transition: "transform 0.3s ease-out" }}>
          <path d="M 34 38 Q 38 35 42 37" stroke="#3d2a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 58 37 Q 62 35 66 38" stroke="#3d2a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>

        {/* Eyes */}
        <g style={{ transform: `scaleY(${eyeOpenness})`, transformOrigin: "50px 44px", transition: "transform 0.1s ease" }}>
          {/* Left eye */}
          <ellipse cx="39" cy="44" rx="5.5" ry="4.5" fill="white" />
          <circle cx={39 + pupilOffset.x} cy={44 + pupilOffset.y} r="2.8" fill="url(#irisGrad)" />
          <circle cx={39 + pupilOffset.x - 0.5} cy={43 + pupilOffset.y} r="1" fill="white" opacity="0.8" />

          {/* Right eye */}
          <ellipse cx="61" cy="44" rx="5.5" ry="4.5" fill="white" />
          <circle cx={61 + pupilOffset.x} cy={44 + pupilOffset.y} r="2.8" fill="url(#irisGrad)" />
          <circle cx={61 + pupilOffset.x - 0.5} cy={43 + pupilOffset.y} r="1" fill="white" opacity="0.8" />
        </g>

        {/* Eyelashes */}
        <path d="M 33 42 Q 34 40 36 41" stroke="#2a1a0e" strokeWidth="0.6" fill="none" />
        <path d="M 42 41 Q 44 40 43 42" stroke="#2a1a0e" strokeWidth="0.6" fill="none" />
        <path d="M 57 42 Q 56 40 58 41" stroke="#2a1a0e" strokeWidth="0.6" fill="none" />
        <path d="M 67 41 Q 66 40 65 42" stroke="#2a1a0e" strokeWidth="0.6" fill="none" />

        {/* Nose */}
        <path d="M 49 52 Q 50 55 51 52" stroke="#d4a683" strokeWidth="0.8" fill="none" />

        {/* Blush */}
        <ellipse cx="34" cy="54" rx="5" ry="2.5" fill="#f5a0a0" opacity="0.25" />
        <ellipse cx="66" cy="54" rx="5" ry="2.5" fill="#f5a0a0" opacity="0.25" />

        {/* Mouth */}
        <g>
          {/* Teeth (visible when mouth open) */}
          {showTeeth && mouthShape.openness > 0.2 && (
            <rect
              x={50 - 6}
              y={67}
              width={12}
              height={Math.min(3, mouthShape.openness * 4)}
              rx="1"
              fill="white"
              opacity="0.85"
            />
          )}

          {/* Lips */}
          <path
            d={mouthPath}
            fill={mouthShape.openness > 0.05 ? "url(#lipGrad)" : "none"}
            stroke={mouthShape.openness <= 0.05 ? "#d4607a" : "none"}
            strokeWidth="1.2"
            strokeLinecap="round"
            style={{ transition: "d 0.08s ease-out" }}
          />
        </g>

        {/* Earrings */}
        <circle cx="22" cy="50" r="1.5" fill={themeColor} opacity="0.7" />
        <circle cx="78" cy="50" r="1.5" fill={themeColor} opacity="0.7" />
      </svg>

      {/* Speaking wave bars */}
      {isSpeaking && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
          {[0.6, 1, 0.8, 1, 0.6].map((h, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: size * 0.02,
                height: size * 0.04 * h,
                background: themeColor,
                animation: `elie-wave-bar 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      )}

      {/* State indicator dot */}
      <div
        className="absolute top-1 right-1 rounded-full"
        style={{
          width: size * 0.08,
          height: size * 0.08,
          background: isSpeaking ? "#22c55e" : isListening ? "#2e8b7a" : glowColor,
          boxShadow: `0 0 ${size * 0.04}px ${glowColor}`,
          animation: state !== "idle" ? "elie-dot-pulse 1.5s infinite" : undefined,
        }}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes elie-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .elie-float { animation: elie-float 5s ease-in-out infinite; }

        @keyframes elie-react-burst {
          0% { transform: scale(1); }
          20% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .elie-react-burst { animation: elie-react-burst 0.4s ease-out; }

        @keyframes elie-speak-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .elie-speak-bob { animation: elie-speak-bob 0.4s ease-in-out infinite; }

        @keyframes elie-glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes elie-listen-ring {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.5; }
        }

        @keyframes elie-wave-bar {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1); }
        }

        @keyframes elie-dot-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
