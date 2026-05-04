/**
 * HealthRings — Apple Watch-style progress rings
 * Three concentric rings: Frequency, Engagement, Streak
 * SVG + CSS animations, no external libs.
 */

interface RingData {
  label: string;
  value: number; // 0-100
  color: string;
  icon: string;
}

interface HealthRingsProps {
  frequency: number;     // 0-100
  engagement: number;    // 0-100
  streak: number;        // 0-100 (streak days normalized)
  overallScore?: number; // center number
  size?: number;
  className?: string;
  compact?: boolean;
}

export function HealthRings({
  frequency,
  engagement,
  streak,
  overallScore,
  size = 180,
  className = "",
  compact = false,
}: HealthRingsProps) {
  const rings: RingData[] = [
    { label: "Frequencia", value: Math.min(100, Math.max(0, frequency)), color: "var(--ring-frequency, #1a6fdb)", icon: "📚" },
    { label: "Engajamento", value: Math.min(100, Math.max(0, engagement)), color: "var(--ring-engagement, #6abf4b)", icon: "💬" },
    { label: "Streak", value: Math.min(100, Math.max(0, streak)), color: "var(--ring-streak, #f59e0b)", icon: "🔥" },
  ];

  const center = size / 2;
  const strokeWidth = size * 0.08;
  const gap = strokeWidth * 0.6;
  const score = overallScore ?? Math.round((frequency * 0.4 + engagement * 0.3 + streak * 0.3));

  return (
    <div className={className} style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {rings.map((ring, i) => {
          const radius = center - strokeWidth - (strokeWidth + gap) * i - strokeWidth / 2;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference * (1 - ring.value / 100);

          return (
            <g key={ring.label}>
              {/* Background ring */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="var(--tutor-border, #e2e8f0)"
                strokeWidth={strokeWidth}
                opacity={0.3}
              />
              {/* Filled ring */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${center} ${center})`}
                style={{
                  transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  filter: `drop-shadow(0 0 4px ${ring.color}40)`,
                }}
              />
              {/* End cap glow */}
              {ring.value > 5 && (
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={strokeWidth * 0.5}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  transform={`rotate(-90 ${center} ${center})`}
                  opacity={0.3}
                  style={{
                    filter: `blur(3px)`,
                    transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Center score */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--tutor-font, 'Outfit')",
            fontSize: size * 0.2,
            fontWeight: 700,
            color: "var(--tutor-text, #1e293b)",
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        {!compact && (
          <span
            style={{
              fontFamily: "var(--tutor-font, 'Outfit')",
              fontSize: size * 0.07,
              color: "var(--tutor-text-muted, #94a3b8)",
              marginTop: 2,
            }}
          >
            Health Score
          </span>
        )}
      </div>

      {/* Legend (non-compact) */}
      {!compact && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 12,
            fontFamily: "var(--tutor-font, 'Outfit')",
            fontSize: "var(--tutor-text-xs, 0.75rem)",
          }}
        >
          {rings.map((ring) => (
            <div key={ring.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: ring.color,
                  boxShadow: `0 0 4px ${ring.color}60`,
                }}
              />
              <span style={{ color: "var(--tutor-text-secondary, #64748b)" }}>
                {ring.icon} {ring.value}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HealthRings;
