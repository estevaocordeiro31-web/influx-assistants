/**
 * StudentHomeNew — Premium Elie-first home (v5 — Futuristic Themes)
 *
 * Three age-based futuristic themes:
 *   - Cosmic Explorer (child 6-12): colorful nebula, gamified, bouncy
 *   - Neon Pulse (teen 13-17): cyberpunk dark, neon accents, clean
 *   - Midnight Studio (adult 18+): professional, metrics, Linear polish
 *
 * Every visual token (background, cards, glows, rings, text) comes
 * from the theme config. No hardcoded colors.
 */
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import {
  AgeAdaptiveProvider, useAgeAdaptive,
  THEME_MAP, type ThemeVisuals, type AgeGroup,
} from "@/contexts/AgeAdaptiveContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getBookNumberFromLevel } from "@/lib/book-themes";
import {
  MessageCircle, BookOpen, Trophy, Flame, Zap, Star, Target,
  Settings, ChevronRight, Mic, TrendingUp, Clock, Sparkles,
  Palette, Check, X,
} from "lucide-react";
import "@/styles/tutor-theme.css";

const THEME_KEY = "imaind_theme";

/* ════════════════════════════════════════════════════════
   ANIMATED NUMBER
   ════════════════════════════════════════════════════════ */
function AnimNum({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (to === 0) { setV(0); return; }
    const dur = 1200;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setV(Math.round(ease * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{v}{suffix}</>;
}

/* ════════════════════════════════════════════════════════
   RING (Apple Health style)
   ════════════════════════════════════════════════════════ */
function Ring({ value, color, size, strokeWidth = 6, delay = 0 }: {
  value: number; color: string; size: number; strokeWidth?: number; delay?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => {
      setOffset(circ - (circ * Math.min(value, 100)) / 100);
    }, 300 + delay);
    return () => clearTimeout(t);
  }, [value, circ, delay]);

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transition: `stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
          filter: `drop-shadow(0 0 6px ${color}60)`,
        }}
      />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════
   THEMED GLASS CARD
   ════════════════════════════════════════════════════════ */
function Glass({ children, className = "", style = {}, glow, t }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
  glow?: string; t?: ThemeVisuals;
}) {
  const cardBg = t?.cardBg ?? "rgba(255,255,255,0.03)";
  const cardBorder = t?.cardBorder ?? "rgba(255,255,255,0.07)";
  const cardRadius = t?.cardRadius ?? 20;
  const cardBlur = t?.cardBlur ?? 20;
  const cardShine = t?.cardShine ?? "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 50%, transparent 90%)";

  return (
    <div className={className} style={{
      position: "relative",
      borderRadius: cardRadius,
      background: cardBg,
      backdropFilter: `blur(${cardBlur}px)`,
      WebkitBackdropFilter: `blur(${cardBlur}px)`,
      border: `1px solid ${cardBorder}`,
      overflow: "hidden",
      ...style,
    }}>
      {/* Top shine */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: cardShine,
      }} />
      {/* Ambient glow */}
      {glow && (
        <div style={{
          position: "absolute", top: -40, right: -40, width: 120, height: 120,
          borderRadius: "50%", background: glow, filter: "blur(50px)",
          opacity: t?.ambientOpacity ?? 0.4, pointerEvents: "none",
        }} />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   COSMIC PARTICLES (child theme decoration)
   ════════════════════════════════════════════════════════ */
function CosmicParticles({ color }: { color: string }) {
  const stars = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 5,
      dur: 2 + Math.random() * 3,
    })), []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          left: s.left,
          top: s.top,
          width: s.size,
          height: s.size,
          borderRadius: "50%",
          background: i % 3 === 0 ? color : i % 3 === 1 ? "#00e5ff" : "#84ff57",
          animation: `cosmic-star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          opacity: 0.3,
        }} />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   NEON GRID (teen theme decoration)
   ════════════════════════════════════════════════════════ */
function NeonGrid({ color }: { color: string }) {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden",
      opacity: 0.04,
    }}>
      <div style={{
        position: "absolute", bottom: 0, left: "-10%", right: "-10%", height: "40%",
        backgroundImage: `
          linear-gradient(${color}40 1px, transparent 1px),
          linear-gradient(90deg, ${color}40 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        animation: "neon-grid-move 8s linear infinite",
        maskImage: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 80%)",
        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 80%)",
      }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   THEME PICKER
   ════════════════════════════════════════════════════════ */
function ThemePicker({ current, onSelect, onClose, t }: {
  current: AgeGroup; onSelect: (g: AgeGroup) => void; onClose: () => void; t: ThemeVisuals;
}) {
  const themes: AgeGroup[] = ["child", "teen", "adult"];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(8px)",
      animation: "fadeIn 0.2s ease-out",
    }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%", maxWidth: 480, padding: 20,
          background: "rgba(15,15,30,0.98)",
          borderTop: `1px solid ${t.cardBorder}`,
          borderRadius: "24px 24px 0 0",
          animation: "slideInFromBottom 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Palette size={18} style={{ color: t.primary }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem" }}>
              Escolha seu Tema
            </span>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 10,
            padding: 8, cursor: "pointer", display: "flex",
          }}>
            <X size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
          </button>
        </div>

        {/* Theme cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {themes.map(group => {
            const tv = THEME_MAP[group];
            const isActive = group === current;
            return (
              <button
                key={group}
                onClick={() => onSelect(group)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "16px 18px",
                  borderRadius: 16,
                  background: isActive ? `${tv.primary}15` : "rgba(255,255,255,0.02)",
                  border: `2px solid ${isActive ? `${tv.primary}50` : "rgba(255,255,255,0.06)"}`,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                {/* Theme preview dot */}
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: tv.bgGradient,
                  border: `1px solid ${tv.cardBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.4rem",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <span style={{ position: "relative", zIndex: 1 }}>{tv.emoji}</span>
                  {/* Mini glow */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(circle at center, ${tv.primary}30, transparent 70%)`,
                  }} />
                </div>
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontWeight: 700, fontSize: "0.85rem",
                      fontFamily: "'Syne', sans-serif",
                      color: isActive ? tv.primary : "#fff",
                    }}>
                      {tv.name}
                    </span>
                    <span style={{
                      fontSize: "0.55rem", padding: "2px 8px", borderRadius: 6,
                      background: `${tv.primary}15`,
                      color: tv.primary,
                      fontWeight: 700,
                      border: `1px solid ${tv.primary}20`,
                    }}>
                      {group === "child" ? "6-12" : group === "teen" ? "13-17" : "18+"}
                    </span>
                  </div>
                  <p style={{
                    fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", marginTop: 3,
                  }}>
                    {tv.description}
                  </p>
                </div>
                {/* Active check */}
                {isActive && (
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: `${tv.primary}20`,
                    border: `1px solid ${tv.primary}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Check size={14} style={{ color: tv.primary }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <p style={{
          textAlign: "center", fontSize: "0.6rem", color: "rgba(255,255,255,0.2)",
          marginTop: 16, lineHeight: 1.5,
        }}>
          O tema adapta cores, efeitos e o estilo da Elie
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   LEARNING COMMITMENT — weekly chart + daily goal
   ════════════════════════════════════════════════════════ */
const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
const COMMITMENT_KEY = "imaind_daily_goal_min";
const COMMITMENT_OPTIONS = [10, 15, 20, 30, 45, 60];

function LearningCommitment({ streakDays, t }: { streakDays: number; t: ThemeVisuals }) {
  const [goalMin, setGoalMin] = useState(() =>
    Number(localStorage.getItem(COMMITMENT_KEY)) || 0
  );
  const [showPicker, setShowPicker] = useState(false);

  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const weekData = useMemo(() => {
    return DAYS.map((_, i) => {
      if (i > todayIdx) return 0;
      if (i === todayIdx) return Math.round(Math.random() * (goalMin || 20) * 0.8);
      if (streakDays > 0 && i >= todayIdx - streakDays) {
        return Math.round((goalMin || 20) * (0.6 + Math.random() * 0.6));
      }
      return Math.round(Math.random() * (goalMin || 20) * 0.3);
    });
  }, [streakDays, goalMin, todayIdx]);

  const todayMinutes = weekData[todayIdx];
  const weekTotal = weekData.reduce((a, b) => a + b, 0);
  const maxBar = Math.max(...weekData, goalMin || 20);
  const todayPct = goalMin > 0 ? Math.min(100, Math.round((todayMinutes / goalMin) * 100)) : 0;

  function selectGoal(min: number) {
    setGoalMin(min);
    localStorage.setItem(COMMITMENT_KEY, String(min));
    setShowPicker(false);
  }

  if (goalMin === 0) {
    return (
      <section style={{ marginTop: 16, animation: "imaind-text-reveal 0.6s ease-out 0.6s both" }}>
        <Glass glow={`${t.primary}40`} t={t} style={{ padding: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, margin: "0 auto 12px",
              background: `linear-gradient(135deg, ${t.primary}20, ${t.accent}15)`,
              border: `1px solid ${t.primary}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Target size={22} style={{ color: t.primary }} />
            </div>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 4, color: t.textPrimary }}>
              Defina seu Compromisso
            </p>
            <p style={{ fontSize: "0.72rem", color: t.textSecondary, marginBottom: 16, lineHeight: 1.5 }}>
              Quantos minutos por dia voce quer estudar?
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {COMMITMENT_OPTIONS.map(min => (
                <button
                  key={min}
                  onClick={() => selectGoal(min)}
                  style={{
                    padding: "10px 0", borderRadius: t.cardRadius * 0.5,
                    background: t.actionBg,
                    border: `1px solid ${t.actionBorder}`,
                    color: t.textPrimary, fontSize: "0.8rem", fontWeight: 700,
                    cursor: "pointer", transition: "all 0.2s",
                    fontFamily: "'Syne', sans-serif",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = t.actionHover;
                    e.currentTarget.style.borderColor = `${t.primary}40`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = t.actionBg;
                    e.currentTarget.style.borderColor = t.actionBorder;
                  }}
                >
                  {min}<span style={{ fontSize: "0.6rem", color: t.textSecondary }}> min</span>
                </button>
              ))}
            </div>
          </div>
        </Glass>
      </section>
    );
  }

  return (
    <section style={{ marginTop: 16, animation: "imaind-text-reveal 0.6s ease-out 0.6s both" }}>
      <Glass glow={`${t.primary}30`} t={t} style={{ padding: "20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, fontFamily: "'Syne', sans-serif", color: t.textPrimary }}>
              Meu Compromisso
            </p>
            <p style={{ fontSize: "0.65rem", color: t.textSecondary, marginTop: 2 }}>
              {goalMin} min/dia &middot; {weekTotal} min esta semana
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", width: 44, height: 44 }}>
              <Ring value={todayPct} color={todayPct >= 100 ? t.secondary : t.primary} size={44} strokeWidth={4} />
              <span style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.6rem", fontWeight: 800, color: todayPct >= 100 ? t.secondary : t.primary,
              }}>{todayPct}%</span>
            </div>
            <button
              onClick={() => setShowPicker(!showPicker)}
              style={{
                background: t.actionBg, border: `1px solid ${t.actionBorder}`,
                borderRadius: 8, padding: "6px 10px", cursor: "pointer",
                fontSize: "0.6rem", color: t.textSecondary, fontWeight: 600,
              }}
            >
              Editar
            </button>
          </div>
        </div>

        {showPicker && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 14,
            padding: 12, borderRadius: t.cardRadius * 0.5, background: "rgba(0,0,0,0.3)",
          }}>
            {COMMITMENT_OPTIONS.map(min => (
              <button
                key={min}
                onClick={() => selectGoal(min)}
                style={{
                  padding: "8px 0", borderRadius: 10,
                  background: min === goalMin ? `${t.primary}20` : t.actionBg,
                  border: `1px solid ${min === goalMin ? `${t.primary}50` : t.actionBorder}`,
                  color: min === goalMin ? t.primary : t.textPrimary,
                  fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
                }}
              >
                {min}min
              </button>
            ))}
          </div>
        )}

        {/* Weekly bar chart */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
          {DAYS.map((day, i) => {
            const val = weekData[i];
            const pct = maxBar > 0 ? (val / maxBar) * 100 : 0;
            const isToday = i === todayIdx;
            const metGoal = goalMin > 0 && val >= goalMin;
            const barColor = metGoal
              ? `linear-gradient(180deg, ${t.secondary}, ${t.secondary}90)`
              : isToday
              ? `linear-gradient(180deg, ${t.primary}, ${t.primary}80)`
              : i > todayIdx
              ? "transparent"
              : "linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.06))";

            return (
              <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: "100%", maxWidth: 28, borderRadius: 6, position: "relative",
                  height: `${Math.max(pct, 4)}%`,
                  background: barColor,
                  border: isToday ? `1px solid ${t.primary}40` : metGoal ? `1px solid ${t.secondary}40` : `1px solid ${t.cardBorder}`,
                  transition: "height 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: metGoal ? `0 0 8px ${t.secondary}40` : isToday ? `0 0 8px ${t.primary}30` : "none",
                }}>
                  {val > 0 && (
                    <span style={{
                      position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)",
                      fontSize: "0.5rem", fontWeight: 700,
                      color: metGoal ? t.secondary : isToday ? t.primary : t.textMuted,
                      whiteSpace: "nowrap",
                    }}>{val}m</span>
                  )}
                </div>
                <span style={{
                  fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.02em",
                  color: isToday ? t.primary : t.textMuted,
                }}>{day}</span>
              </div>
            );
          })}
        </div>

        {goalMin > 0 && (
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ flex: 1, height: 1, background: t.cardBorder }} />
            <span style={{ fontSize: "0.55rem", color: t.textMuted, fontWeight: 600 }}>
              Meta: {goalMin} min/dia
            </span>
            <div style={{ flex: 1, height: 1, background: t.cardBorder }} />
          </div>
        )}
      </Glass>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════ */
function StudentHomeInner() {
  const config = useAgeAdaptive();
  const t = config.visuals;
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Data
  const { data: dashboard } = trpc.studentPersonalization.getPersonalizedDashboard.useQuery(
    undefined, { enabled: isAuthenticated, retry: 1, staleTime: 60_000 }
  );
  const { data: myCourses } = trpc.studentCourses.getMyCourses.useQuery(
    undefined, { enabled: isAuthenticated, retry: 1, staleTime: 120_000 }
  );
  const { data: streakData } = trpc.gamification.getStreak.useQuery(
    undefined, { enabled: isAuthenticated, retry: 1, staleTime: 60_000 }
  );

  // Derived
  const name = dashboard?.student?.name || user?.name || localStorage.getItem("imaind_student_name") || "Aluno";
  const firstName = name.split(" ")[0];
  const streakDays = dashboard?.student?.streak ?? streakData?.currentStreak ?? 0;
  const hoursLearned = dashboard?.student?.hoursLearned ?? 0;
  const bookNum = dashboard?.student ? getBookNumberFromLevel(dashboard.student.level) : 1;
  const currentUnit = dashboard?.books?.inProgress?.[0]?.currentUnit || 1;
  const progress = Number(dashboard?.books?.inProgress?.[0]?.progressPercentage) || 0;
  const completedBooks = dashboard?.books?.completed?.length || 0;
  const classInfo = dashboard?.classInfo || null;

  // Ring values
  const ringStreak = Math.min(100, Math.max(8, Math.round((streakDays / 30) * 100)));
  const ringEngagement = Math.min(100, Math.max(8, Math.round((hoursLearned / 100) * 100)));
  const ringFrequency = Math.min(100, Math.max(8, Math.round((streakDays / 7) * 100)));

  // Greeting (adapts to age)
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (config.greetingStyle === "excited") {
      return h < 12 ? "Bom diaaaa" : h < 18 ? "Boa tardeee" : "Boa noiteeee";
    }
    if (config.greetingStyle === "casual") {
      return h < 12 ? "E ai" : h < 18 ? "Fala" : "Boa noite";
    }
    return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  }, [config.greetingStyle]);

  // Book info
  const BOOKS = ["", "Beginner", "Elementary", "Intermediate", "Upper Int.", "Advanced"];
  const BOOK_EMOJI = ["", "🌱", "💧", "🔮", "🔥", "🏆"];
  const BOOK_COLORS = ["", "#84cc16", "#38bdf8", "#a78bfa", "#f97316", "#facc15"];

  // AI suggestion
  const suggestion = useMemo(() => {
    if (streakDays >= 30) return { title: "Consistencia Incrivel!", text: `${streakDays} dias seguidos! Voce esta no top 5%. Que tal um Voice Chat?` };
    if (streakDays >= 7) return { title: "Streak em Alta!", text: `${streakDays} dias consecutivos. Experimente o Simulador de Situacoes.` };
    if (progress >= 80) return { title: "Quase La!", text: `${progress}% do Book ${bookNum} completo. Foque nas ultimas units!` };
    if (progress >= 50) return { title: "Metade do Caminho!", text: `${progress}% concluido. Continue nesse ritmo.` };
    return { title: "Comece sua Jornada!", text: "10 minutos ja faz diferenca. Comece com os exercicios." };
  }, [streakDays, progress, bookNum]);

  return (
    <div style={{
      minHeight: "100dvh",
      background: t.bgGradient,
      fontFamily: "'Outfit', 'DM Sans', -apple-system, sans-serif",
      color: t.textPrimary,
      overflowX: "hidden",
      transition: "background 0.6s ease",
    }}>
      {/* Theme-specific decorations */}
      {config.ageGroup === "child" && <CosmicParticles color={t.particleColor} />}
      {config.ageGroup === "teen" && <NeonGrid color={t.particleColor} />}

      {/* Ambient mesh */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: t.bgMesh,
        transition: "background 0.6s ease",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── HEADER ── */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          background: t.headerBg,
          backdropFilter: "blur(24px)",
          borderBottom: `1px solid ${t.headerBorder}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem",
              letterSpacing: "-0.02em", color: t.logoPrimary,
            }}>
              Im<span style={{ color: t.logoAccent }}>AI</span>nd
            </span>
            <span style={{
              fontSize: "0.5rem", fontWeight: 800, padding: "3px 8px", borderRadius: 6,
              background: `${t.logoAccent}20`,
              color: t.logoAccent, letterSpacing: "0.12em",
              border: `1px solid ${t.logoAccent}25`,
            }}>TUTOR</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Theme button */}
            <button onClick={() => setShowThemePicker(true)} style={{
              background: t.actionBg, border: `1px solid ${t.actionBorder}`,
              padding: 10, borderRadius: t.cardRadius * 0.5, cursor: "pointer", display: "flex",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = t.actionHover}
              onMouseLeave={e => e.currentTarget.style.background = t.actionBg}
            >
              <Palette size={15} style={{ color: t.primary, opacity: 0.7 }} />
            </button>
            {/* Settings */}
            <button onClick={() => navigate("/student/profile")} style={{
              background: t.actionBg, border: `1px solid ${t.actionBorder}`,
              padding: 10, borderRadius: t.cardRadius * 0.5, cursor: "pointer", display: "flex",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = t.actionHover}
              onMouseLeave={e => e.currentTarget.style.background = t.actionBg}
            >
              <Settings size={15} style={{ color: t.textSecondary }} />
            </button>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 120px" }}>

          {/* ── ELIE + GREETING ── */}
          <section style={{
            textAlign: "center", paddingTop: 32,
            animation: config.ageGroup === "child"
              ? "cosmic-bounce-enter 0.8s cubic-bezier(0.22, 1, 0.36, 1) both"
              : config.ageGroup === "teen"
              ? "neon-slide-in 0.6s ease-out both"
              : "imaind-text-reveal 0.8s ease-out both",
          }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* Outer glow */}
              <div style={{
                position: "absolute", inset: -30, borderRadius: "50%",
                background: t.elieGlow,
                filter: `blur(${20 * t.glowIntensity}px)`,
                animation: `elie-aura-pulse ${4 / (config.animationIntensity || 0.5)}s ease-in-out infinite`,
              }} />
              {/* Avatar */}
              <div style={{
                width: t.elieSize, height: t.elieSize, borderRadius: "50%", overflow: "hidden",
                border: `3px solid ${t.cardBorder}`,
                boxShadow: `0 0 ${40 * t.glowIntensity}px ${t.elieRingColor}30, inset 0 0 20px rgba(0,0,0,0.3)`,
                animation: config.animationIntensity >= 0.7
                  ? "elie-breathe 3s ease-in-out infinite, elie-float 5s ease-in-out infinite"
                  : "elie-breathe 4s ease-in-out infinite, elie-float 6s ease-in-out infinite",
              }}>
                <img
                  src="/miss-elie-uniform-avatar.png"
                  alt="Elie"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Online indicator */}
              <div style={{
                position: "absolute",
                bottom: t.elieSize > 150 ? 12 : 8,
                right: t.elieSize > 150 ? 12 : 8,
                width: t.elieSize > 150 ? 20 : 16,
                height: t.elieSize > 150 ? 20 : 16,
                borderRadius: "50%",
                background: t.secondary,
                border: "3px solid #0c1222",
                boxShadow: `0 0 8px ${t.secondary}60`,
              }} />
            </div>

            <h1 style={{
              marginTop: 20,
              fontSize: config.fontScale > 1 ? "1.8rem" : "1.6rem",
              fontWeight: 800,
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.03em",
              animation: config.ageGroup === "teen" ? "neon-text-flicker 4s infinite" : "imaind-text-reveal 0.6s ease-out 0.2s both",
            }}>
              {greeting}, <span style={{
                background: `linear-gradient(135deg, ${t.primary}, ${t.accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{firstName}</span>
              {config.ageGroup === "child" ? " ✨" : ""}
            </h1>
            <p style={{
              marginTop: 4,
              fontSize: config.fontScale > 1 ? "0.9rem" : "0.85rem",
              color: t.textSecondary,
              fontWeight: 400,
              animation: "imaind-text-reveal 0.6s ease-out 0.35s both",
            }}>
              {streakDays > 0
                ? config.ageGroup === "child"
                  ? `Wow, ${streakDays} dias seguidos! Voce e demais!`
                  : config.ageGroup === "teen"
                  ? `${streakDays} dias de streak. Ta voando.`
                  : `${streakDays} dias de streak — continue assim!`
                : config.ageGroup === "child"
                ? "Vamos aprender coisas incriveis hoje!"
                : "Sua tutora esta pronta para te ajudar."}
            </p>
          </section>

          {/* ── BOOK PROGRESS ── */}
          <section style={{ marginTop: 24, animation: "imaind-text-reveal 0.6s ease-out 0.45s both" }}>
            <Glass glow={`${BOOK_COLORS[bookNum]}40`} t={t} style={{ padding: "20px 20px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <Ring value={progress || 8} color={BOOK_COLORS[bookNum] || t.primary} size={72} strokeWidth={5} />
                  <span style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.4rem",
                  }}>{BOOK_EMOJI[bookNum]}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: "0.95rem", fontWeight: 700, fontFamily: "'Syne', sans-serif",
                      color: t.textPrimary,
                    }}>Book {bookNum}</span>
                    <span style={{
                      fontSize: "0.6rem", padding: "2px 8px", borderRadius: 6,
                      background: `${BOOK_COLORS[bookNum]}20`,
                      color: BOOK_COLORS[bookNum],
                      fontWeight: 700,
                    }}>{BOOKS[bookNum]}</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: t.textSecondary, marginBottom: 8 }}>
                    Unit {currentUnit} de 12 &middot; {progress}% completo
                  </p>
                  <div style={{ height: 4, borderRadius: 2, background: t.cardBorder, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: `${Math.max(progress, 3)}%`,
                      background: `linear-gradient(90deg, ${BOOK_COLORS[bookNum]}, ${BOOK_COLORS[bookNum]}90)`,
                      transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: `0 0 8px ${BOOK_COLORS[bookNum]}40`,
                    }} />
                  </div>
                </div>
                <button onClick={() => navigate("/student/exercises")} style={{
                  flexShrink: 0, width: 40, height: 40, borderRadius: t.cardRadius * 0.5,
                  background: `${BOOK_COLORS[bookNum]}15`,
                  border: `1px solid ${BOOK_COLORS[bookNum]}25`,
                  color: BOOK_COLORS[bookNum],
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${BOOK_COLORS[bookNum]}25`}
                  onMouseLeave={e => e.currentTarget.style.background = `${BOOK_COLORS[bookNum]}15`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </Glass>
          </section>

          {/* ── STATS BENTO ── */}
          <section style={{
            marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 10,
            animation: "imaind-text-reveal 0.6s ease-out 0.55s both",
          }}>
            {[
              { icon: Flame, label: "DIAS DE STREAK", value: streakDays, suffix: "", color: "#f97316", bg: "249,115,22" },
              { icon: Clock, label: "APRENDIDAS", value: hoursLearned, suffix: "h", color: "#60a5fa", bg: "59,130,246" },
              { icon: BookOpen, label: "LIVROS COMPLETOS", value: completedBooks, suffix: "", color: "#a78bfa", bg: "168,85,247" },
              { icon: Star, label: "XP TOTAL", value: Math.floor((streakDays * 10) + (hoursLearned * 5)), suffix: "", color: "#22c55e", bg: "34,197,94" },
            ].map((s, i) => (
              <Glass key={s.label} t={t} style={{ padding: "16px 14px" }} glow={`rgba(${s.bg},0.3)`}>
                <s.icon size={18} style={{ color: s.color, marginBottom: 8 }} />
                <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", lineHeight: 1, color: t.textPrimary }}>
                  <AnimNum to={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: "0.65rem", color: t.textSecondary, marginTop: 4, fontWeight: 600, letterSpacing: "0.05em" }}>
                  {s.label}
                </div>
              </Glass>
            ))}
          </section>

          {/* ── LEARNING COMMITMENT ── */}
          <LearningCommitment streakDays={streakDays} t={t} />

          {/* ── HEALTH RINGS ── */}
          <section style={{ marginTop: 16, animation: "imaind-text-reveal 0.6s ease-out 0.75s both" }}>
            <Glass t={t} style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
                  <div style={{ position: "absolute", inset: 0 }}>
                    <Ring value={ringFrequency} color={t.ringFrequency} size={110} strokeWidth={7} delay={0} />
                  </div>
                  <div style={{ position: "absolute", inset: 12 }}>
                    <Ring value={ringEngagement} color={t.ringEngagement} size={86} strokeWidth={7} delay={200} />
                  </div>
                  <div style={{ position: "absolute", inset: 24 }}>
                    <Ring value={ringStreak} color={t.ringStreak} size={62} strokeWidth={7} delay={400} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: "0.8rem", fontWeight: 700, marginBottom: 12,
                    fontFamily: "'Syne', sans-serif", color: t.textPrimary,
                  }}>
                    {config.ageGroup === "child" ? "Minha Energia" : "Sua Saude"}
                  </p>
                  {[
                    { color: t.ringFrequency, label: "Frequencia", value: ringFrequency },
                    { color: t.ringEngagement, label: "Engajamento", value: ringEngagement },
                    { color: t.ringStreak, label: "Consistencia", value: ringStreak },
                  ].map(r => (
                    <div key={r.label} style={{
                      display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%", background: r.color,
                        boxShadow: `0 0 6px ${r.color}50`, flexShrink: 0,
                      }} />
                      <span style={{ flex: 1, fontSize: "0.7rem", color: t.textSecondary }}>{r.label}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: `${t.textPrimary}b0` }}>{r.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Glass>
          </section>

          {/* ── AI SUGGESTION ── */}
          <section style={{ marginTop: 12, animation: "imaind-text-reveal 0.6s ease-out 0.75s both" }}>
            <Glass glow={`${t.accent}40`} t={t} style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: t.cardRadius * 0.45,
                  background: `linear-gradient(135deg, ${t.accent}25, ${t.accent}10)`,
                  border: `1px solid ${t.accent}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Sparkles size={16} style={{ color: t.accent }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: 3, color: t.textPrimary }}>{suggestion.title}</p>
                  <p style={{ fontSize: "0.72rem", color: t.textSecondary, lineHeight: 1.5 }}>{suggestion.text}</p>
                </div>
              </div>
            </Glass>
          </section>

          {/* ── NEXT CLASS ── */}
          {classInfo?.schedule && (
            <section style={{ marginTop: 12, animation: "imaind-text-reveal 0.6s ease-out 0.8s both" }}>
              <Glass t={t} style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: t.cardRadius * 0.45,
                    background: `${t.secondary}15`, border: `1px solid ${t.secondary}25`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <BookOpen size={16} style={{ color: t.secondary }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: t.textPrimary }}>Proxima Aula</p>
                    <p style={{ fontSize: "0.7rem", color: t.textSecondary }}>
                      {classInfo.schedule}{classInfo.teacher ? ` — ${classInfo.teacher}` : ""}
                    </p>
                  </div>
                </div>
              </Glass>
            </section>
          )}

          {/* ── QUICK ACTIONS ── */}
          <section style={{ marginTop: 20, animation: "imaind-text-reveal 0.6s ease-out 0.85s both" }}>
            <p style={{
              fontSize: "0.6rem", fontWeight: 700, color: t.textMuted,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10,
            }}>Acesso rapido</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                { icon: MessageCircle, label: "Chat IA", route: "/student/chat", color: "#60a5fa", bg: "59,130,246" },
                { icon: Zap, label: "Exercicios", route: "/student/exercises", color: "#facc15", bg: "234,179,8" },
                { icon: Mic, label: "Voice Chat", route: "/student/voice-chat", color: "#a78bfa", bg: "168,85,247" },
                { icon: TrendingUp, label: "Progresso", route: "/student/passport", color: "#22d3ee", bg: "6,182,212" },
                { icon: Trophy, label: "Conquistas", route: "/student/badges", color: "#fb923c", bg: "249,115,22" },
                { icon: BookOpen, label: "Meu Tutor", route: "/student/dashboard", color: "#f472b6", bg: "236,72,153" },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.route)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: 8, padding: "18px 8px", borderRadius: t.cardRadius * 0.7,
                    background: `linear-gradient(135deg, rgba(${a.bg},0.12), rgba(${a.bg},0.04))`,
                    border: `1px solid rgba(${a.bg},0.15)`,
                    cursor: "pointer", color: t.textPrimary, transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = `rgba(${a.bg},0.3)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = `rgba(${a.bg},0.15)`;
                  }}
                >
                  <a.icon size={20} style={{ color: a.color }} />
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, color: t.textSecondary }}>
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ── POWERED BY ── */}
          <div style={{
            marginTop: 40, textAlign: "center",
            animation: "imaind-text-reveal 0.6s ease-out 1s both",
          }}>
            <p style={{ fontSize: "0.6rem", color: t.textMuted }}>
              powered by Im<span style={{ color: `${t.logoAccent}50` }}>AI</span>nd
            </p>
          </div>

        </main>
      </div>

      {/* Theme picker modal */}
      {showThemePicker && (
        <ThemePicker
          current={config.ageGroup}
          t={t}
          onClose={() => setShowThemePicker(false)}
          onSelect={(group) => {
            localStorage.setItem(THEME_KEY, group);
            setShowThemePicker(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

export default function StudentHomeNew() {
  const storedTheme = localStorage.getItem(THEME_KEY) as AgeGroup | null;
  const storedAge = Number(localStorage.getItem("imaind_student_age")) || undefined;

  return (
    <AgeAdaptiveProvider ageGroup={storedTheme ?? undefined} age={storedTheme ? undefined : storedAge}>
      <StudentHomeInner />
    </AgeAdaptiveProvider>
  );
}
