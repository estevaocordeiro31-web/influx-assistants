/**
 * StudentHomeNew — Premium Elie-first home (v4)
 *
 * Design: Apple Health rings + Linear polish + Vercel spatial depth
 * No external component deps — everything inline for visual consistency.
 */
import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { AgeAdaptiveProvider, useAgeAdaptive } from "@/contexts/AgeAdaptiveContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getBookNumberFromLevel } from "@/lib/book-themes";
import {
  MessageCircle, BookOpen, Trophy, Flame, Zap, Star,
  Settings, ChevronRight, Mic, TrendingUp, Clock, Sparkles,
} from "lucide-react";
import "@/styles/tutor-theme.css";

/* ════════════════════════════════════════════════════════
   ANIMATED NUMBER
   ════════════════════════════════════════════════════════ */
function AnimNum({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (to === 0) { setV(0); return; }
    let start = 0;
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
        style={{ transition: `stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`, filter: `drop-shadow(0 0 6px ${color}60)` }}
      />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════
   GLASS CARD
   ════════════════════════════════════════════════════════ */
function Glass({ children, className = "", style = {}, glow }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; glow?: string;
}) {
  return (
    <div className={className} style={{
      position: "relative",
      borderRadius: 20,
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.07)",
      overflow: "hidden",
      ...style,
    }}>
      {/* Top shine */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 50%, transparent 90%)",
      }} />
      {/* Ambient glow */}
      {glow && (
        <div style={{
          position: "absolute", top: -40, right: -40, width: 120, height: 120,
          borderRadius: "50%", background: glow, filter: "blur(50px)", opacity: 0.4,
          pointerEvents: "none",
        }} />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════ */
function StudentHomeInner() {
  const config = useAgeAdaptive();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Data
  const { data: dashboard, isLoading } = trpc.studentPersonalization.getPersonalizedDashboard.useQuery(
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
  const objective = dashboard?.student?.objective;

  // Ring values (never fully empty)
  const ringStreak = Math.min(100, Math.max(8, Math.round((streakDays / 30) * 100)));
  const ringEngagement = Math.min(100, Math.max(8, Math.round((hoursLearned / 100) * 100)));
  const ringFrequency = Math.min(100, Math.max(8, Math.round((streakDays / 7) * 100)));

  // Greeting
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  }, []);

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
      background: "linear-gradient(180deg, #06090f 0%, #0c1222 30%, #111827 60%, #0f172a 100%)",
      fontFamily: "'Outfit', 'DM Sans', -apple-system, sans-serif",
      color: "#fff",
      overflowX: "hidden",
    }}>
      {/* Ambient mesh */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 20% 10%, ${BOOK_COLORS[bookNum] || "#1a6fdb"}15, transparent 60%),
          radial-gradient(ellipse 40% 40% at 80% 60%, rgba(26,111,219,0.06), transparent 60%),
          radial-gradient(ellipse 30% 30% at 50% 90%, rgba(168,85,247,0.04), transparent 50%)
        `,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── HEADER ── */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          background: "rgba(6,9,15,0.6)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
              Im<span style={{ color: "#4da8ff" }}>AI</span>nd
            </span>
            <span style={{
              fontSize: "0.5rem", fontWeight: 800, padding: "3px 8px", borderRadius: 6,
              background: "linear-gradient(135deg, rgba(26,111,219,0.2), rgba(77,168,255,0.1))",
              color: "#4da8ff", letterSpacing: "0.12em",
              border: "1px solid rgba(77,168,255,0.15)",
            }}>TUTOR</span>
          </div>
          <button onClick={() => navigate("/student/profile")} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)",
            padding: 10, borderRadius: 12, cursor: "pointer", display: "flex",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            <Settings size={15} style={{ color: "rgba(255,255,255,0.35)" }} />
          </button>
        </header>

        {/* ── CONTENT ── */}
        <main style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 120px" }}>

          {/* ── ELIE + GREETING ── */}
          <section style={{
            textAlign: "center", paddingTop: 32,
            animation: "imaind-text-reveal 0.8s ease-out both",
          }}>
            {/* Avatar with rings */}
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* Outer glow */}
              <div style={{
                position: "absolute", inset: -30, borderRadius: "50%",
                background: `radial-gradient(circle, ${BOOK_COLORS[bookNum] || "#1a6fdb"}30, transparent 70%)`,
                filter: "blur(20px)",
                animation: "elie-aura-pulse 4s ease-in-out infinite",
              }} />
              {/* Avatar image */}
              <div style={{
                width: 140, height: 140, borderRadius: "50%", overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.1)",
                boxShadow: `0 0 40px ${BOOK_COLORS[bookNum] || "#1a6fdb"}25, inset 0 0 20px rgba(0,0,0,0.3)`,
                animation: "elie-breathe 4s ease-in-out infinite, elie-float 6s ease-in-out infinite",
              }}>
                <img
                  src="/miss-elie-uniform-avatar.png"
                  alt="Elie"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Online indicator */}
              <div style={{
                position: "absolute", bottom: 8, right: 8,
                width: 16, height: 16, borderRadius: "50%",
                background: "#22c55e",
                border: "3px solid #0c1222",
                boxShadow: "0 0 8px rgba(34,197,94,0.5)",
              }} />
            </div>

            <h1 style={{
              marginTop: 20, fontSize: "1.6rem", fontWeight: 800,
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.03em",
              animation: "imaind-text-reveal 0.6s ease-out 0.2s both",
            }}>
              {greeting}, <span style={{
                background: "linear-gradient(135deg, #4da8ff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{firstName}</span>
            </h1>
            <p style={{
              marginTop: 4, fontSize: "0.85rem", color: "rgba(255,255,255,0.35)",
              fontWeight: 400,
              animation: "imaind-text-reveal 0.6s ease-out 0.35s both",
            }}>
              {streakDays > 0
                ? `${streakDays} dias de streak — continue assim!`
                : "Sua tutora esta pronta para te ajudar."}
            </p>
          </section>

          {/* ── BOOK PROGRESS ── */}
          <section style={{ marginTop: 24, animation: "imaind-text-reveal 0.6s ease-out 0.45s both" }}>
            <Glass glow={`${BOOK_COLORS[bookNum]}40`} style={{ padding: "20px 20px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Progress ring */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <Ring value={progress || 8} color={BOOK_COLORS[bookNum] || "#4da8ff"} size={72} strokeWidth={5} />
                  <span style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.4rem",
                  }}>{BOOK_EMOJI[bookNum]}</span>
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: "0.95rem", fontWeight: 700, fontFamily: "'Syne', sans-serif",
                    }}>Book {bookNum}</span>
                    <span style={{
                      fontSize: "0.6rem", padding: "2px 8px", borderRadius: 6,
                      background: `${BOOK_COLORS[bookNum]}20`,
                      color: BOOK_COLORS[bookNum],
                      fontWeight: 700,
                    }}>{BOOKS[bookNum]}</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                    Unit {currentUnit} de 12 &middot; {progress}% completo
                  </p>
                  {/* Progress bar */}
                  <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: `${Math.max(progress, 3)}%`,
                      background: `linear-gradient(90deg, ${BOOK_COLORS[bookNum]}, ${BOOK_COLORS[bookNum]}90)`,
                      transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: `0 0 8px ${BOOK_COLORS[bookNum]}40`,
                    }} />
                  </div>
                </div>
                {/* CTA */}
                <button onClick={() => navigate("/student/exercises")} style={{
                  flexShrink: 0, width: 40, height: 40, borderRadius: 12,
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
            <Glass style={{ padding: "16px 14px" }} glow="rgba(249,115,22,0.3)">
              <Flame size={18} style={{ color: "#f97316", marginBottom: 8 }} />
              <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                <AnimNum to={streakDays} />
              </div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: 4, fontWeight: 600, letterSpacing: "0.05em" }}>
                DIAS DE STREAK
              </div>
            </Glass>
            <Glass style={{ padding: "16px 14px" }} glow="rgba(59,130,246,0.3)">
              <Clock size={18} style={{ color: "#60a5fa", marginBottom: 8 }} />
              <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                <AnimNum to={hoursLearned} suffix="h" />
              </div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: 4, fontWeight: 600, letterSpacing: "0.05em" }}>
                APRENDIDAS
              </div>
            </Glass>
            <Glass style={{ padding: "16px 14px" }} glow="rgba(168,85,247,0.3)">
              <BookOpen size={18} style={{ color: "#a78bfa", marginBottom: 8 }} />
              <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                <AnimNum to={completedBooks} />
              </div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: 4, fontWeight: 600, letterSpacing: "0.05em" }}>
                LIVROS COMPLETOS
              </div>
            </Glass>
            <Glass style={{ padding: "16px 14px" }} glow="rgba(34,197,94,0.3)">
              <Star size={18} style={{ color: "#22c55e", marginBottom: 8 }} />
              <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                <AnimNum to={Math.floor((streakDays * 10) + (hoursLearned * 5))} />
              </div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: 4, fontWeight: 600, letterSpacing: "0.05em" }}>
                XP TOTAL
              </div>
            </Glass>
          </section>

          {/* ── HEALTH RINGS ── */}
          <section style={{ marginTop: 16, animation: "imaind-text-reveal 0.6s ease-out 0.65s both" }}>
            <Glass style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {/* Rings stacked */}
                <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
                  <div style={{ position: "absolute", inset: 0 }}>
                    <Ring value={ringFrequency} color="#4da8ff" size={110} strokeWidth={7} delay={0} />
                  </div>
                  <div style={{ position: "absolute", inset: 12 }}>
                    <Ring value={ringEngagement} color="#6abf4b" size={86} strokeWidth={7} delay={200} />
                  </div>
                  <div style={{ position: "absolute", inset: 24 }}>
                    <Ring value={ringStreak} color="#f59e0b" size={62} strokeWidth={7} delay={400} />
                  </div>
                </div>
                {/* Legend */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: "0.8rem", fontWeight: 700, marginBottom: 12,
                    fontFamily: "'Syne', sans-serif",
                  }}>Sua Saude</p>
                  {[
                    { color: "#4da8ff", label: "Frequencia", value: ringFrequency },
                    { color: "#6abf4b", label: "Engajamento", value: ringEngagement },
                    { color: "#f59e0b", label: "Consistencia", value: ringStreak },
                  ].map(r => (
                    <div key={r.label} style={{
                      display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%", background: r.color,
                        boxShadow: `0 0 6px ${r.color}50`, flexShrink: 0,
                      }} />
                      <span style={{ flex: 1, fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>{r.label}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{r.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Glass>
          </section>

          {/* ── AI SUGGESTION ── */}
          <section style={{ marginTop: 12, animation: "imaind-text-reveal 0.6s ease-out 0.75s both" }}>
            <Glass glow="rgba(168,85,247,0.3)" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(124,58,237,0.1))",
                  border: "1px solid rgba(168,85,247,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Sparkles size={16} style={{ color: "#a78bfa" }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: 3 }}>{suggestion.title}</p>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{suggestion.text}</p>
                </div>
              </div>
            </Glass>
          </section>

          {/* ── NEXT CLASS ── */}
          {classInfo?.schedule && (
            <section style={{ marginTop: 12, animation: "imaind-text-reveal 0.6s ease-out 0.8s both" }}>
              <Glass style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <BookOpen size={16} style={{ color: "#22d3ee" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700 }}>Proxima Aula</p>
                    <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>
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
              fontSize: "0.6rem", fontWeight: 700, color: "rgba(255,255,255,0.2)",
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
                    gap: 8, padding: "18px 8px", borderRadius: 16,
                    background: `linear-gradient(135deg, rgba(${a.bg},0.12), rgba(${a.bg},0.04))`,
                    border: `1px solid rgba(${a.bg},0.15)`,
                    cursor: "pointer", color: "#fff", transition: "all 0.2s",
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
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
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
            <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.1)" }}>
              powered by Im<span style={{ color: "rgba(77,168,255,0.3)" }}>AI</span>nd
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}

export default function StudentHomeNew() {
  const age = Number(localStorage.getItem("imaind_student_age")) || undefined;
  return (
    <AgeAdaptiveProvider age={age}>
      <StudentHomeInner />
    </AgeAdaptiveProvider>
  );
}
