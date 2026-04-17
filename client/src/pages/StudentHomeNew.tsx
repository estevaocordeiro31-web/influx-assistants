/**
 * StudentHomeNew — Full-content Elie-first home (v3)
 *
 * Combines the premium dark design with ALL dashboard content:
 * HeroBookCard, StatsGrid, NextClassCard, AISuggestionCard,
 * Quick Actions, and Elie companion.
 */
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { ElieCompanion, type ElieState } from "@/components/tutor/ElieCompanion";
import { HealthRings } from "@/components/tutor/HealthRings";
import { Confetti } from "@/components/tutor/Confetti";
import { AgeAdaptiveProvider, useAgeAdaptive } from "@/contexts/AgeAdaptiveContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getBookTheme, getBookNumberFromLevel } from "@/lib/book-themes";
import { getDefaultTheme } from "@/lib/themes";
import HeroBookCard from "@/components/HeroBookCard";
import StatsGrid from "@/components/StatsGrid";
import NextClassCard from "@/components/NextClassCard";
import AISuggestionCard from "@/components/AISuggestionCard";
import { LeaderboardWidget } from "@/components/LeaderboardWidget";
import {
  MessageCircle,
  BookOpen,
  Trophy,
  Flame,
  Zap,
  Star,
  Settings,
  ChevronRight,
  Mic,
  GraduationCap,
  TrendingUp,
  Calendar,
} from "lucide-react";
import "@/styles/tutor-theme.css";

// Default dark theme for the premium home
const DARK_THEME = {
  ...getDefaultTheme(),
  background: "linear-gradient(180deg, #0a0f1e 0%, #111827 40%, #0f172a 100%)",
  cardBg: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.08)",
  cardText: "#fff",
};

function StudentHomeInner() {
  const config = useAgeAdaptive();
  const [elieState, setElieState] = useState<ElieState>("greeting");
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Fetch personalized dashboard data (same as old dashboard)
  const { data: dashboard, isLoading } = trpc.studentPersonalization.getPersonalizedDashboard.useQuery(
    undefined,
    { enabled: isAuthenticated, retry: 1, staleTime: 60_000 }
  );

  const { data: myCourses } = trpc.studentCourses.getMyCourses.useQuery(
    undefined,
    { enabled: isAuthenticated, retry: 1, staleTime: 120_000 }
  );

  const streakQuery = trpc.gamification.getStreak.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 60_000,
  });

  // Derived data
  const studentName = dashboard?.student?.name || user?.name || localStorage.getItem("imaind_student_name") || "Aluno";
  const firstName = studentName.split(" ")[0];
  const streakDays = dashboard?.student?.streak ?? streakQuery.data?.currentStreak ?? 0;
  const hoursLearned = dashboard?.student?.hoursLearned ?? 0;
  const bookNum = dashboard?.student ? getBookNumberFromLevel(dashboard.student.level) : 1;
  const bookTheme = getBookTheme(bookNum);
  const currentUnit = dashboard?.books?.inProgress?.[0]?.currentUnit || 1;
  const progressPercentage = Number(dashboard?.books?.inProgress?.[0]?.progressPercentage) || 0;
  const completedBooksCount = dashboard?.books?.completed?.length || 0;
  const classInfo = dashboard?.classInfo || null;
  const hasReadingClub = myCourses?.includes("reading_club") ?? false;

  // Health ring values
  const streakNormalized = Math.min(100, Math.max(5, Math.round((streakDays / 30) * 100)));
  const engagementScore = Math.min(100, Math.max(5, Math.round((hoursLearned / 100) * 100)));
  const frequencyScore = Math.min(100, Math.max(5, Math.round((streakDays / 7) * 100)));

  // Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const time = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
    return `${time}, ${firstName}!`;
  }, [firstName]);

  const subtitle = useMemo(() => {
    if (streakDays > 7) return `${streakDays} dias seguidos — incrivel!`;
    if (streakDays > 0) return `${streakDays} dias de streak. Continue assim!`;
    if (hoursLearned > 0) return `${hoursLearned}h aprendidas. Bora continuar?`;
    return "Que bom te ver por aqui.";
  }, [streakDays, hoursLearned]);

  // Elie states
  useEffect(() => {
    const t = setTimeout(() => setElieState("idle"), 2500);
    return () => clearTimeout(t);
  }, []);

  // Confetti for child mode
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

  // Quick action grid
  const quickActions = useMemo(() => {
    const actions = [
      { icon: MessageCircle, label: "Chat IA", route: "/student/chat", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.25)", color: "#60a5fa" },
      { icon: Zap, label: "Exercicios", route: "/student/exercises", bg: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.25)", color: "#facc15" },
      { icon: Mic, label: "Voice Chat", route: "/student/voice-chat", bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.25)", color: "#a78bfa" },
      { icon: TrendingUp, label: "Progresso", route: "/student/passport", bg: "rgba(6,182,212,0.15)", border: "rgba(6,182,212,0.25)", color: "#22d3ee" },
      { icon: Trophy, label: "Conquistas", route: "/student/badges", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.25)", color: "#fb923c" },
      { icon: Calendar, label: "Agenda", route: "/student/dashboard", bg: "rgba(236,72,153,0.15)", border: "rgba(236,72,153,0.25)", color: "#f472b6" },
    ];
    if (hasReadingClub) {
      actions.splice(3, 0, {
        icon: BookOpen,
        label: "Reading Club",
        route: "/student/dashboard",
        bg: "rgba(249,115,22,0.15)",
        border: "rgba(249,115,22,0.25)",
        color: "#fb923c",
      });
    }
    return actions;
  }, [hasReadingClub]);

  return (
    <div
      className="tutor-app dark"
      data-age={config.ageGroup}
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(180deg, #0a0f1e 0%, #111827 40%, #0f172a 100%)",
        fontFamily: "'Outfit', 'DM Sans', sans-serif",
        color: "#fff",
      }}
    >
      <Confetti active={showConfetti} />

      {/* Mesh gradient overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(ellipse 70% 60% at 30% 20%, ${bookTheme.primary}12, transparent 70%),
                       radial-gradient(ellipse 50% 50% at 70% 70%, rgba(26,111,219,0.06), transparent 70%)`,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: "rgba(10,15,30,0.7)",
            backdropFilter: "blur(16px)",
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

        {/* Main scrollable */}
        <main
          style={{
            overflowY: "auto",
            padding: "0 16px 100px",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          {/* === Elie + Greeting === */}
          <section
            style={{
              textAlign: "center",
              marginTop: 20,
              animation: "imaind-text-reveal 0.8s ease-out both",
            }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{
                  position: "absolute",
                  inset: -20,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${bookTheme.primary}25, transparent 70%)`,
                  filter: "blur(16px)",
                  animation: "elie-aura-pulse 3s ease-in-out infinite",
                }}
              />
              <ElieCompanion state={elieState} size="full" />
            </div>
            <h2
              style={{
                marginTop: 12,
                fontSize: "1.25rem",
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                animation: "imaind-text-reveal 0.6s ease-out 0.3s both",
              }}
            >
              {greeting}
            </h2>
            <p
              style={{
                marginTop: 2,
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.4)",
                animation: "imaind-text-reveal 0.6s ease-out 0.4s both",
              }}
            >
              {subtitle}
            </p>
          </section>

          {/* === Hero Book Card === */}
          {!isLoading && (
            <section style={{ marginTop: 20, animation: "imaind-text-reveal 0.6s ease-out 0.5s both" }}>
              <HeroBookCard
                studentName={firstName}
                bookNumber={bookNum}
                bookTheme={bookTheme}
                appTheme={DARK_THEME}
                currentUnit={currentUnit}
                totalUnits={12}
                progressPercentage={progressPercentage}
                level={dashboard?.student?.level || "beginner"}
                onContinue={() => navigate("/student/exercises")}
              />
            </section>
          )}

          {/* === Stats Grid === */}
          <section style={{ marginTop: 12, animation: "imaind-text-reveal 0.6s ease-out 0.6s both" }}>
            <StatsGrid
              appTheme={DARK_THEME}
              streakDays={streakDays}
              hoursLearned={hoursLearned}
              chunksLearned={0}
              completedBooks={completedBooksCount}
            />
          </section>

          {/* === Next Class + AI Suggestion === */}
          <section
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              animation: "imaind-text-reveal 0.6s ease-out 0.7s both",
            }}
          >
            <NextClassCard
              appTheme={DARK_THEME}
              schedule={classInfo?.schedule || null}
              teacher={classInfo?.teacher || null}
              className={classInfo?.className || null}
            />
            <AISuggestionCard
              appTheme={DARK_THEME}
              streakDays={streakDays}
              progressPercentage={progressPercentage}
              hoursLearned={hoursLearned}
              currentBook={`Book ${bookNum}`}
              objective={dashboard?.student?.objective}
            />
          </section>

          {/* === Health Rings (compact) === */}
          <section
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 20px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              animation: "imaind-text-reveal 0.6s ease-out 0.8s both",
            }}
          >
            <HealthRings
              frequency={frequencyScore}
              engagement={engagementScore}
              streak={streakNormalized}
              size={100}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: 6 }}>Sua Saude</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <RingLabel color="#4da8ff" label="Frequencia" value={`${frequencyScore}%`} />
                <RingLabel color="#6abf4b" label="Engajamento" value={`${engagementScore}%`} />
                <RingLabel color="#f59e0b" label="Consistencia" value={`${streakNormalized}%`} />
              </div>
            </div>
          </section>

          {/* === Quick Actions Grid === */}
          <section style={{ marginTop: 16, animation: "imaind-text-reveal 0.6s ease-out 0.9s both" }}>
            <p
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              Acesso rapido
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
              }}
            >
              {quickActions.map((action) => (
                <button
                  key={action.route + action.label}
                  onClick={() => navigate(action.route)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "16px 8px",
                    borderRadius: 16,
                    background: action.bg,
                    border: `1px solid ${action.border}`,
                    cursor: "pointer",
                    color: "#fff",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <action.icon size={22} style={{ color: action.color }} />
                  <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* === Leaderboard (compact) === */}
          {isAuthenticated && (
            <section style={{ marginTop: 16, animation: "imaind-text-reveal 0.6s ease-out 1s both" }}>
              <LeaderboardWidget />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function RingLabel({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", flex: 1 }}>{label}</span>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{value}</span>
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
