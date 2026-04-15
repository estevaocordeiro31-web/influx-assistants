/**
 * StudentHomeNew — Conversational-first home screen
 *
 * Elie companion center-top with contextual greeting.
 * Health Rings below with REAL data from gamification router.
 * Gamification bar. Quick action chips.
 * No menus — Elie IS the interface.
 */
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { ElieCompanion, type ElieState } from "@/components/tutor/ElieCompanion";
import { HealthRings } from "@/components/tutor/HealthRings";
import { Confetti } from "@/components/tutor/Confetti";
import { AgeAdaptiveProvider, useAgeAdaptive, type AgeGroup } from "@/contexts/AgeAdaptiveContext";
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
} from "lucide-react";
import "@/styles/tutor-theme.css";

function StudentHomeInner() {
  const config = useAgeAdaptive();
  const [elieState, setElieState] = useState<ElieState>("greeting");
  const [, navigate] = useLocation();

  const studentName = localStorage.getItem("imaind_student_name") || "Aluno";
  const studentAge = Number(localStorage.getItem("imaind_student_age")) || 18;

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
  const streakNormalized = Math.min(100, Math.round((streakDays / 30) * 100));
  const engagementScore = Math.min(100, Math.round((totalPoints / 5000) * 100));
  // Frequency: based on streak consistency
  const frequencyScore = Math.min(100, Math.round((streakDays / 7) * 100));

  // Greeting based on time of day + age
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

    if (config.ageGroup === "child") {
      const greetings = [
        `Oi, ${studentName}! 🌟 Bora aprender ingles hoje?`,
        `${timeGreeting}, ${studentName}! 🎉 Que bom te ver!`,
        `Hey ${studentName}! 🚀 Pronta pra mais uma aventura?`,
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    if (config.ageGroup === "teen") {
      const greetings = [
        `E ai, ${studentName}! 🔥`,
        `Fala, ${studentName}! Bora estudar?`,
        `${timeGreeting}, ${studentName}! Ready?`,
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    return `${timeGreeting}, ${studentName}! Como posso ajudar hoje?`;
  }, [studentName, config.ageGroup]);

  // After greeting animation, go to idle
  useEffect(() => {
    const t = setTimeout(() => setElieState("idle"), 2000);
    return () => clearTimeout(t);
  }, []);

  // Quick actions
  const actions = useMemo(() => {
    const base = [
      { icon: MessageCircle, label: config.ageGroup === "child" ? "Falar com a Elie 💬" : "Conversar com Elie", route: "/student/chat" },
      { icon: BookOpen, label: config.ageGroup === "child" ? "Praticar ingles 📚" : "Praticar", route: "/student/exercises" },
      { icon: TrendingUp, label: config.ageGroup === "child" ? "Meu progresso 📊" : "Meu progresso", route: "/student/passport" },
    ];
    if (config.showGamification) {
      base.push({ icon: Trophy, label: config.ageGroup === "child" ? "Conquistas 🏆" : "Conquistas", route: "/student/badges" });
    }
    return base;
  }, [config]);

  const isDark = config.ageGroup === "teen";

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

  // Streak fire animation on gamif card
  const [streakFire, setStreakFire] = useState(false);
  useEffect(() => {
    if (config.showGamification && streakDays > 0) {
      setTimeout(() => setStreakFire(true), 2000);
      const t = setTimeout(() => setStreakFire(false), 2800);
      return () => clearTimeout(t);
    }
  }, [config.showGamification, streakDays]);

  return (
    <div
      className={`tutor-app ${isDark ? "dark" : ""}`}
      data-age={config.ageGroup}
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background:
          isDark
            ? "linear-gradient(180deg, #0c1222 0%, #111827 100%)"
            : config.ageGroup === "child"
            ? "linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 30%, #ffffff 100%)"
            : "var(--tutor-bg)",
        fontFamily: "'Outfit', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Confetti (child mode first visit) */}
      <Confetti active={showConfetti} />

      {/* Header bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          background: "transparent",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: "var(--tutor-text-lg)",
              fontWeight: 700,
              color: "var(--tutor-text)",
            }}
          >
            Im<span style={{ color: "var(--imaind-blue)" }}>AI</span>nd
          </span>
          <span
            className="tutor-badge tutor-badge-blue"
            style={{ fontSize: "0.6rem" }}
          >
            TUTOR
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="tutor-btn tutor-btn-ghost"
            style={{ padding: 8, borderRadius: "50%" }}
            onClick={() => navigate("/student/profile")}
          >
            <Settings size={18} style={{ color: "var(--tutor-text-muted)" }} />
          </button>
        </div>
      </header>

      {/* Main content — scrollable */}
      <main
        className="tutor-page-enter"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 20px 100px",
          gap: 24,
        }}
      >
        {/* Elie + Greeting */}
        <section style={{ textAlign: "center", marginTop: 16 }}>
          <ElieCompanion state={elieState} size="full" />
          <p
            style={{
              marginTop: 16,
              fontSize: "var(--tutor-text-lg)",
              fontWeight: 500,
              color: "var(--tutor-text)",
              lineHeight: 1.5,
              maxWidth: 320,
              animation: "imaind-text-reveal 0.6s ease-out 0.3s both",
            }}
          >
            {greeting}
          </p>
        </section>

        {/* Health Rings — real data */}
        <section
          className="tutor-card"
          style={{
            width: "100%",
            maxWidth: 380,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1.25rem",
            animation: "imaind-text-reveal 0.6s ease-out 0.5s both",
          }}
        >
          <HealthRings
            frequency={frequencyScore}
            engagement={engagementScore}
            streak={streakNormalized}
            size={160}
          />
        </section>

        {/* Gamification bar */}
        {config.showGamification && (
          <section
            style={{
              width: "100%",
              maxWidth: 380,
              display: "flex",
              gap: 8,
              animation: "imaind-text-reveal 0.6s ease-out 0.7s both",
            }}
          >
            <GamifCard
              icon={<Flame size={16} color="#f97316" />}
              label="Streak"
              value={`${streakDays} dias`}
              className={streakFire ? "tutor-streak-fire" : ""}
            />
            <GamifCard
              icon={<Zap size={16} color="#f59e0b" />}
              label="XP"
              value={totalPoints.toLocaleString("pt-BR")}
            />
            <GamifCard
              icon={<Star size={16} color="#8b5cf6" />}
              label="Nivel"
              value={String(Math.floor(totalPoints / 1000) + 1)}
            />
          </section>
        )}

        {/* Quick actions */}
        <section
          style={{
            width: "100%",
            maxWidth: 380,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            animation: "imaind-text-reveal 0.6s ease-out 0.9s both",
          }}
        >
          <p
            style={{
              fontSize: "var(--tutor-text-sm)",
              fontWeight: 600,
              color: "var(--tutor-text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 4,
            }}
          >
            {config.ageGroup === "child" ? "O que quer fazer? 🤔" : "Acoes rapidas"}
          </p>
          {actions.map((action) => (
            <button
              key={action.route}
              className="tutor-card"
              onClick={() => navigate(action.route)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                textAlign: "left",
                border: "1px solid var(--tutor-border)",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--tutor-radius-md)",
                  background: "rgba(26,111,219,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <action.icon size={20} style={{ color: "var(--imaind-blue)" }} />
              </div>
              <span
                style={{
                  fontSize: "var(--tutor-text-base)",
                  fontWeight: 500,
                  color: "var(--tutor-text)",
                }}
              >
                {action.label}
              </span>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}

function GamifCard({ icon, label, value, className = "" }: { icon: React.ReactNode; label: string; value: string; className?: string }) {
  return (
    <div
      className={`tutor-card ${className}`}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "0.75rem 0.5rem",
      }}
    >
      {icon}
      <span
        style={{
          fontSize: "var(--tutor-text-lg)",
          fontWeight: 700,
          color: "var(--tutor-text)",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: "0.65rem",
          color: "var(--tutor-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
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
