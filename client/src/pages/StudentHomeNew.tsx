/**
 * StudentHomeNew — Conversational-first home screen (v2 premium)
 *
 * Dark-first design with Elie companion, Health Rings, gamification.
 * Staggered entrance animations. Age-adaptive.
 */
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { ElieCompanion, type ElieState } from "@/components/tutor/ElieCompanion";
import { HealthRings } from "@/components/tutor/HealthRings";
import { Confetti } from "@/components/tutor/Confetti";
import { AgeAdaptiveProvider, useAgeAdaptive } from "@/contexts/AgeAdaptiveContext";
import { trpc } from "@/lib/trpc";
import {
  MessageCircle,
  BookOpen,
  Trophy,
  TrendingUp,
  Flame,
  Zap,
  Star,
  Settings,
  ChevronRight,
} from "lucide-react";
import "@/styles/tutor-theme.css";

function StudentHomeInner() {
  const config = useAgeAdaptive();
  const [elieState, setElieState] = useState<ElieState>("greeting");
  const [, navigate] = useLocation();

  const studentName = localStorage.getItem("imaind_student_name") || "Aluno";
  const studentAge = Number(localStorage.getItem("imaind_student_age")) || 18;
  const firstName = studentName.split(" ")[0];

  // Fetch real gamification data
  const streakQuery = trpc.gamification.getStreak.useQuery(undefined, {
    retry: 1,
    staleTime: 60_000,
  });
  const progressQuery = trpc.gamification.getProgress.useQuery({}, {
    retry: 1,
    staleTime: 60_000,
  });

  // Derive ring values from real data
  const streakDays = streakQuery.data?.currentStreak ?? 0;
  const totalPoints = progressQuery.data?.totalPoints ?? 0;
  const level = Math.floor(totalPoints / 1000) + 1;
  const streakNormalized = Math.min(100, Math.round((streakDays / 30) * 100));
  const engagementScore = Math.min(100, Math.round((totalPoints / 5000) * 100));
  const frequencyScore = Math.min(100, Math.round((streakDays / 7) * 100));

  // Greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const time = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

    if (config.ageGroup === "child") {
      return `Oi, ${firstName}! Bora aprender?`;
    }
    if (config.ageGroup === "teen") {
      return `E ai, ${firstName}! Ready?`;
    }
    return `${time}, ${firstName}!`;
  }, [firstName, config.ageGroup]);

  const subtitle = useMemo(() => {
    if (streakDays > 0) return `${streakDays} dias consecutivos!`;
    return "Que bom te ver por aqui.";
  }, [streakDays]);

  // After greeting animation, go to idle
  useEffect(() => {
    const t = setTimeout(() => setElieState("idle"), 2500);
    return () => clearTimeout(t);
  }, []);

  // Quick actions
  const actions = useMemo(() => {
    const base = [
      {
        icon: MessageCircle,
        label: "Conversar com Elie",
        desc: "Pratique conversacao",
        route: "/student/chat",
        color: "#1a6fdb",
      },
      {
        icon: BookOpen,
        label: "Praticar",
        desc: "Exercicios e chunks",
        route: "/student/exercises",
        color: "#6abf4b",
      },
      {
        icon: TrendingUp,
        label: "Meu progresso",
        desc: "Acompanhe sua evolucao",
        route: "/student/passport",
        color: "#8b5cf6",
      },
    ];
    if (config.showGamification) {
      base.push({
        icon: Trophy,
        label: "Conquistas",
        desc: "Badges e desafios",
        route: "/student/badges",
        color: "#f59e0b",
      });
    }
    return base;
  }, [config]);

  // Confetti on first visit for child mode
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (config.ageGroup === "child") {
      const seen = sessionStorage.getItem("imaind_home_confetti");
      if (!seen) {
        setTimeout(() => setShowConfetti(true), 1500);
        sessionStorage.setItem("imaind_home_confetti", "1");
      }
    }
  }, [config.ageGroup]);

  return (
    <div
      className="tutor-app dark"
      data-age={config.ageGroup}
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #0a0f1e 0%, #111827 40%, #0f172a 100%)",
        fontFamily: "'Outfit', 'DM Sans', sans-serif",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      <Confetti active={showConfetti} />

      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: "rgba(10,15,30,0.6)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem" }}>
            Im<span style={{ color: "#4da8ff" }}>AI</span>nd
          </span>
          <span
            style={{
              fontSize: "0.55rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 6,
              background: "rgba(26,111,219,0.15)",
              color: "#4da8ff",
              letterSpacing: "0.08em",
            }}
          >
            TUTOR
          </span>
        </div>
        <button
          onClick={() => navigate("/student/profile")}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "none",
            padding: 8,
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
          }}
        >
          <Settings size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
        </button>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 20px 100px",
          gap: 20,
        }}
      >
        {/* Elie Section */}
        <section
          style={{
            textAlign: "center",
            marginTop: 24,
            animation: "imaind-text-reveal 0.8s ease-out both",
          }}
        >
          {/* Glow behind Elie */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                position: "absolute",
                inset: -24,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(26,111,219,0.2) 0%, transparent 70%)",
                filter: "blur(20px)",
                animation: "elie-aura-pulse 3s ease-in-out infinite",
              }}
            />
            <ElieCompanion state={elieState} size="full" />
          </div>

          <h2
            style={{
              marginTop: 16,
              fontSize: "1.3rem",
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
              lineHeight: 1.3,
              animation: "imaind-text-reveal 0.6s ease-out 0.3s both",
            }}
          >
            {greeting}
          </h2>
          <p
            style={{
              marginTop: 4,
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.4)",
              animation: "imaind-text-reveal 0.6s ease-out 0.5s both",
            }}
          >
            {subtitle}
          </p>
        </section>

        {/* Health Rings */}
        <section
          style={{
            width: "100%",
            maxWidth: 360,
            borderRadius: 20,
            padding: "20px 16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "imaind-text-reveal 0.6s ease-out 0.6s both",
          }}
        >
          <HealthRings
            frequency={Math.max(frequencyScore, 5)}
            engagement={Math.max(engagementScore, 5)}
            streak={Math.max(streakNormalized, 5)}
            size={150}
          />
          <p
            style={{
              marginTop: 8,
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.05em",
            }}
          >
            FREQUENCIA &middot; ENGAJAMENTO &middot; CONSISTENCIA
          </p>
        </section>

        {/* Gamification bar */}
        {config.showGamification && (
          <section
            style={{
              width: "100%",
              maxWidth: 360,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              animation: "imaind-text-reveal 0.6s ease-out 0.8s both",
            }}
          >
            <GamifCard
              icon={<Flame size={18} />}
              label="Streak"
              value={`${streakDays}`}
              unit="dias"
              color="#f97316"
              active={streakDays > 0}
            />
            <GamifCard
              icon={<Zap size={18} />}
              label="XP"
              value={totalPoints.toLocaleString("pt-BR")}
              color="#f59e0b"
              active={totalPoints > 0}
            />
            <GamifCard
              icon={<Star size={18} />}
              label="Nivel"
              value={String(level)}
              color="#8b5cf6"
              active
            />
          </section>
        )}

        {/* Quick actions */}
        <section
          style={{
            width: "100%",
            maxWidth: 360,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            animation: "imaind-text-reveal 0.6s ease-out 1s both",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 2,
            }}
          >
            {config.ageGroup === "child" ? "O que quer fazer?" : "Acesso rapido"}
          </p>

          {actions.map((action, i) => (
            <button
              key={action.route}
              onClick={() => navigate(action.route)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                color: "#fff",
                animation: `imaind-text-reveal 0.5s ease-out ${1.1 + i * 0.1}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: `${action.color}15`,
                }}
              >
                <action.icon size={20} style={{ color: action.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {action.label}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: 1 }}>
                  {action.desc}
                </div>
              </div>
              <ChevronRight size={16} style={{ color: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
            </button>
          ))}
        </section>
      </main>

      {/* Bottom safe area */}
      <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
    </div>
  );
}

function GamifCard({
  icon,
  label,
  value,
  unit,
  color,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  color: string;
  active?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "14px 8px",
        borderRadius: 16,
        background: active ? `${color}08` : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? `${color}20` : "rgba(255,255,255,0.04)"}`,
        transition: "all 0.3s",
      }}
    >
      <div style={{ color: active ? color : "rgba(255,255,255,0.2)" }}>{icon}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
        <span
          style={{
            fontSize: "1.3rem",
            fontWeight: 800,
            fontFamily: "'Syne', sans-serif",
            color: active ? "#fff" : "rgba(255,255,255,0.3)",
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)" }}>{unit}</span>
        )}
      </div>
      <span
        style={{
          fontSize: "0.55rem",
          color: "rgba(255,255,255,0.25)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
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
