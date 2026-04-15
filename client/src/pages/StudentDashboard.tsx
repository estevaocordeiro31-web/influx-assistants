import { useAuth } from "@/_core/hooks/useAuth";
import InfluxHeader from "@/components/InfluxHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, MessageCircle, Zap, TrendingUp, Award,
  Trophy, Star, Target, Clock, Flame, Medal, Mic, GraduationCap,
  Calendar, Bell, BarChart3, ChevronRight, Sparkles, Palette, Bot
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { SponteDataSection } from "@/components/SponteDataSection";
import { ReadingClubIntegrated } from "@/components/ReadingClubIntegrated";
import { MeuTutorTab } from "@/components/MeuTutorTab";
import { trpc } from "@/lib/trpc";
import { NotificationBadge } from "@/components/NotificationBadge";
import { useNotifications } from "@/hooks/useNotifications";
import { OnboardingTutorial } from "@/components/OnboardingTutorial";
import { LeaderboardWidget } from "@/components/LeaderboardWidget";
import { StudentCalendar } from "@/components/StudentCalendar";
import { StudentMessages } from "@/components/StudentMessages";
import { StudentGrades } from "@/components/StudentGrades";
import { SyncIndicator, useSyncStatus } from "@/components/SyncIndicator";
import { getBookTheme, getBookNumberFromLevel } from "@/lib/book-themes";
import { getThemeById, getDefaultTheme, type AppTheme, type LayoutType } from "@/lib/themes";
import HeroBookCard from "@/components/HeroBookCard";
import StatsGrid from "@/components/StatsGrid";
import NextClassCard from "@/components/NextClassCard";
import AISuggestionCard from "@/components/AISuggestionCard";

// Hook to read selected app theme from localStorage
// Listens for custom 'tutor-theme-change' event + storage + focus
function useAppTheme() {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('tutor_theme') || 'spatial-glossy');

  useEffect(() => {
    const handler = () => {
      const newTheme = localStorage.getItem('tutor_theme') || 'spatial-glossy';
      setThemeId(newTheme);
    };
    window.addEventListener('storage', handler);
    window.addEventListener('focus', handler);
    window.addEventListener('tutor-theme-change', handler);
    // Re-read on mount (covers navigation back from ThemeSelector)
    handler();
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('focus', handler);
      window.removeEventListener('tutor-theme-change', handler);
    };
  }, []);

  return getThemeById(themeId) || getDefaultTheme();
}

// Hook to read selected layout from localStorage
// Listens for custom 'tutor-layout-change' event + storage + focus
function useLayout(): LayoutType {
  const [layout, setLayout] = useState<LayoutType>(() => (localStorage.getItem('tutor_layout') as LayoutType) || 'scroll');

  useEffect(() => {
    const handler = () => {
      const newLayout = (localStorage.getItem('tutor_layout') as LayoutType) || 'scroll';
      setLayout(newLayout);
    };
    window.addEventListener('storage', handler);
    window.addEventListener('focus', handler);
    window.addEventListener('tutor-layout-change', handler);
    // Also re-read on mount (covers navigation back from ThemeSelector)
    handler();
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('focus', handler);
      window.removeEventListener('tutor-layout-change', handler);
    };
  }, []);

  return layout;
}

// Demo data for unauthenticated/demo mode
const DEMO_STUDENT = {
  name: "Estevao Cordeiro",
  email: "estevao@influxjundiai.com",
  level: "Avançado",
  currentBook: "Book 5",
  currentBookId: 5,
  currentUnit: 8,
  totalUnits: 12,
  progressPercentage: 67,
  totalHoursLearned: 248,
  totalChunksLearned: 1847,
  streakDays: 45,
  nextReview: 23,
  badges: [
    { name: "Maratonista", icon: "🏃", description: "45 dias seguidos" },
    { name: "Poliglota", icon: "🌍", description: "1000+ chunks" },
    { name: "Dedicado", icon: "⭐", description: "200+ horas" },
    { name: "Mestre", icon: "👑", description: "4 livros completos" },
  ],
  completedBooks: [
    { id: 1, name: "Book 1", level: "Elementar", completedAt: "2024-03-15", hoursSpent: 42, chunksLearned: 312, progress: 100 },
    { id: 2, name: "Book 2", level: "Básico", completedAt: "2024-06-20", hoursSpent: 48, chunksLearned: 385, progress: 100 },
    { id: 3, name: "Book 3", level: "Intermediário", completedAt: "2024-09-10", hoursSpent: 56, chunksLearned: 428, progress: 100 },
    { id: 4, name: "Book 4", level: "Intermediário+", completedAt: "2024-12-05", hoursSpent: 62, chunksLearned: 456, progress: 100 },
    { id: 5, name: "Book 5", level: "Avançado", completedAt: null, hoursSpent: 40, chunksLearned: 266, progress: 67 },
  ],
  recentChunks: [
    { text: "take it for granted", meaning: "dar como certo", context: "Don't take your health for granted." },
    { text: "on the verge of", meaning: "à beira de", context: "She was on the verge of tears." },
    { text: "make ends meet", meaning: "fechar as contas", context: "It's hard to make ends meet these days." },
    { text: "once in a blue moon", meaning: "muito raramente", context: "I only see him once in a blue moon." },
    { text: "hit the nail on the head", meaning: "acertar em cheio", context: "You hit the nail on the head with that comment." },
  ],
  weeklyProgress: [
    { day: "Seg", hours: 1.5, chunks: 12 },
    { day: "Ter", hours: 2.0, chunks: 18 },
    { day: "Qua", hours: 1.0, chunks: 8 },
    { day: "Qui", hours: 2.5, chunks: 22 },
    { day: "Sex", hours: 1.5, chunks: 14 },
    { day: "Sáb", hours: 0.5, chunks: 5 },
    { day: "Dom", hours: 1.0, chunks: 9 },
  ],
};

// Glassmorphism card wrapper with frosted glass + top shine line
function GlassCard({ children, className = "", style = {}, appTheme }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; appTheme?: AppTheme }) {
  return (
    <div
      className={`rounded-2xl relative overflow-hidden transition-all hover:scale-[1.005] ${className}`}
      style={{
        background: appTheme?.cardBg || 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${appTheme?.cardBorder || 'rgba(255, 255, 255, 0.09)'}`,
        color: appTheme?.cardText || undefined,
        ...style,
      }}
    >
      {/* Top shine line (Glassmorphism Spatial pattern) */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
      {children}
    </div>
  );
}

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { notifications, clearNotification } = useNotifications();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { status, message } = useSyncStatus();

  useEffect(() => {
    if (isAuthenticated && user) {
      const hasSeenOnboarding = localStorage.getItem(`onboarding_completed_${user.id}`);
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [isAuthenticated, user]);

  const handleOnboardingComplete = () => {
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
    }
    setShowOnboarding(false);
  };

  const { data: personalizedDashboard, isLoading: personalizedLoading } = trpc.studentPersonalization.getPersonalizedDashboard.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: myCourses } = trpc.studentCourses.getMyCourses.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const hasReadingClub = myCourses?.includes('reading_club') ?? false;

  const bookNum = personalizedDashboard?.student ? getBookNumberFromLevel(personalizedDashboard.student.level) : 5;
  const studentData = personalizedDashboard?.student && personalizedDashboard?.books ? {
    name: personalizedDashboard.student.name || 'Aluno',
    email: personalizedDashboard.student.email || '',
    level: personalizedDashboard.student.level,
    currentBook: `Book ${bookNum}`,
    currentBookId: bookNum,
    currentUnit: personalizedDashboard.books.inProgress[0]?.currentUnit || 1,
    totalUnits: 12,
    progressPercentage: Number(personalizedDashboard.books.inProgress[0]?.progressPercentage) || 0,
    totalHoursLearned: personalizedDashboard.student.hoursLearned,
    totalChunksLearned: 0,
    streakDays: personalizedDashboard.student.streak,
    nextReview: 0,
    badges: [],
    completedBooks: personalizedDashboard.books.completed.map((b: any) => ({
      id: b.bookId,
      name: `Book ${b.bookId}`,
      level: 'Completo',
      completedAt: b.completedAt ? new Date(b.completedAt).toLocaleDateString('pt-BR') : null,
      hoursSpent: 0,
      chunksLearned: 0,
      progress: 100,
    })),
    recentChunks: [],
    weeklyProgress: [],
  } : DEMO_STUDENT;

  const bookNumber = getBookNumberFromLevel(studentData.level);
  const bookTheme = getBookTheme(bookNumber);
  const appTheme = useAppTheme();
  const dashLayout = useLayout();

  // Extract classInfo from personalized dashboard
  const classInfo = personalizedDashboard?.classInfo || null;

  // Use app theme for global styling, book theme for book-specific accents
  const theme = {
    ...bookTheme,
    // Override primary accent with app theme if not default
    primary: appTheme.id !== 'spatial-glossy' ? appTheme.accentColor : bookTheme.primary,
    gradient: appTheme.id !== 'spatial-glossy'
      ? (appTheme.buttonBg.includes('gradient') ? appTheme.buttonBg : `linear-gradient(135deg, ${appTheme.accentColor}, ${appTheme.valueColor})`)
      : bookTheme.gradient,
  };

  return (
    <div className="min-h-screen safe-area-bottom relative"
      style={{ background: appTheme.background }}>

      {/* Page-level mesh gradient (Glassmorphism Spatial) */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(ellipse 70% 60% at 30% 20%, ${appTheme.accentColor}12, transparent 70%),
                     radial-gradient(ellipse 50% 50% at 70% 70%, ${appTheme.valueColor || '#2e8b7a'}0d, transparent 70%)`,
      }} />

      <div className="relative z-10">
      <InfluxHeader />

      {showOnboarding && (
        <OnboardingTutorial onComplete={handleOnboardingComplete} />
      )}

      <main className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
        {/* XP Progress Bar (Conversational AI-First pattern) */}
        <div className="h-1 rounded-full bg-white/5 overflow-hidden mb-4 animate-fade-in">
          <div className="h-full rounded-full progress-animate"
            style={{
              width: `${Math.min(100, studentData.progressPercentage)}%`,
              background: `linear-gradient(90deg, ${appTheme.accentColor || '#6b3fa0'}, ${appTheme.valueColor || '#2e8b7a'})`,
              transition: "width 2s ease-out",
            }} />
        </div>

        {/* Sync Indicator */}
        <div className="mb-4 animate-fade-in">
          <SyncIndicator status={status} message={message} showBadge={true} />
        </div>

        {/* ===== LAYOUT-DEPENDENT DASHBOARD SECTION ===== */}
        {dashLayout === 'orbit' && (
          /* ORBIT: Hero centered, stats orbit around it */
          <div className="mb-5 space-y-4 animate-fade-in-up">
            <HeroBookCard
              studentName={user?.name || studentData.name} bookNumber={bookNumber}
              bookTheme={bookTheme} appTheme={appTheme}
              currentUnit={studentData.currentUnit} totalUnits={studentData.totalUnits}
              progressPercentage={studentData.progressPercentage} level={studentData.level}
              onContinue={() => { const t = document.querySelector('[value="tutor"]') as HTMLButtonElement; if (t) t.click(); }}
            />
            {/* Orbit-style: 2x2 stat cards with NextClass & AI filling remaining */}
            <div className="grid grid-cols-2 gap-3">
              <StatsGrid appTheme={appTheme} streakDays={studentData.streakDays}
                hoursLearned={studentData.totalHoursLearned}
                chunksLearned={studentData.totalChunksLearned}
                completedBooks={studentData.completedBooks.filter(b => b.progress === 100).length} />
              <div className="space-y-3">
                <NextClassCard appTheme={appTheme}
                  schedule={classInfo?.schedule || null}
                  teacher={classInfo?.teacher || null}
                  className={classInfo?.className || null} />
                <AISuggestionCard appTheme={appTheme}
                  streakDays={studentData.streakDays}
                  progressPercentage={studentData.progressPercentage}
                  hoursLearned={studentData.totalHoursLearned}
                  currentBook={studentData.currentBook}
                  objective={personalizedDashboard?.student?.objective} />
              </div>
            </div>
          </div>
        )}

        {dashLayout === 'scroll' && (
          /* SCROLL (default): Vertical stack — Hero, Stats, side-by-side cards */
          <div className="mb-5 space-y-4 animate-fade-in-up">
            <HeroBookCard
              studentName={user?.name || studentData.name} bookNumber={bookNumber}
              bookTheme={bookTheme} appTheme={appTheme}
              currentUnit={studentData.currentUnit} totalUnits={studentData.totalUnits}
              progressPercentage={studentData.progressPercentage} level={studentData.level}
              onContinue={() => { const t = document.querySelector('[value="tutor"]') as HTMLButtonElement; if (t) t.click(); }}
            />
            <StatsGrid appTheme={appTheme} streakDays={studentData.streakDays}
              hoursLearned={studentData.totalHoursLearned}
              chunksLearned={studentData.totalChunksLearned}
              completedBooks={studentData.completedBooks.filter(b => b.progress === 100).length} />
            <div className="grid md:grid-cols-2 gap-3">
              <NextClassCard appTheme={appTheme}
                schedule={classInfo?.schedule || null}
                teacher={classInfo?.teacher || null}
                className={classInfo?.className || null} />
              <AISuggestionCard appTheme={appTheme}
                streakDays={studentData.streakDays}
                progressPercentage={studentData.progressPercentage}
                hoursLearned={studentData.totalHoursLearned}
                currentBook={studentData.currentBook}
                objective={personalizedDashboard?.student?.objective} />
            </div>
          </div>
        )}

        {dashLayout === 'split' && (
          /* SPLIT: Sidebar left (Hero compact + stats) | Content right (cards stacked) */
          <div className="mb-5 flex flex-col md:flex-row gap-4 animate-fade-in-up">
            {/* Left sidebar */}
            <div className="md:w-1/3 space-y-3">
              <HeroBookCard
                studentName={user?.name || studentData.name} bookNumber={bookNumber}
                bookTheme={bookTheme} appTheme={appTheme}
                currentUnit={studentData.currentUnit} totalUnits={studentData.totalUnits}
                progressPercentage={studentData.progressPercentage} level={studentData.level}
                onContinue={() => { const t = document.querySelector('[value="tutor"]') as HTMLButtonElement; if (t) t.click(); }}
              />
              <StatsGrid appTheme={appTheme} streakDays={studentData.streakDays}
                hoursLearned={studentData.totalHoursLearned}
                chunksLearned={studentData.totalChunksLearned}
                completedBooks={studentData.completedBooks.filter(b => b.progress === 100).length} />
            </div>
            {/* Right content */}
            <div className="md:w-2/3 space-y-3">
              <NextClassCard appTheme={appTheme}
                schedule={classInfo?.schedule || null}
                teacher={classInfo?.teacher || null}
                className={classInfo?.className || null} />
              <AISuggestionCard appTheme={appTheme}
                streakDays={studentData.streakDays}
                progressPercentage={studentData.progressPercentage}
                hoursLearned={studentData.totalHoursLearned}
                currentBook={studentData.currentBook}
                objective={personalizedDashboard?.student?.objective} />
            </div>
          </div>
        )}

        {dashLayout === 'narrative' && (
          /* NARRATIVE: Feed-style vertical cards, each section is a "story" */
          <div className="mb-5 space-y-3 max-w-lg mx-auto animate-fade-in-up">
            <HeroBookCard
              studentName={user?.name || studentData.name} bookNumber={bookNumber}
              bookTheme={bookTheme} appTheme={appTheme}
              currentUnit={studentData.currentUnit} totalUnits={studentData.totalUnits}
              progressPercentage={studentData.progressPercentage} level={studentData.level}
              onContinue={() => { const t = document.querySelector('[value="tutor"]') as HTMLButtonElement; if (t) t.click(); }}
            />
            <AISuggestionCard appTheme={appTheme}
              streakDays={studentData.streakDays}
              progressPercentage={studentData.progressPercentage}
              hoursLearned={studentData.totalHoursLearned}
              currentBook={studentData.currentBook}
              objective={personalizedDashboard?.student?.objective} />
            <StatsGrid appTheme={appTheme} streakDays={studentData.streakDays}
              hoursLearned={studentData.totalHoursLearned}
              chunksLearned={studentData.totalChunksLearned}
              completedBooks={studentData.completedBooks.filter(b => b.progress === 100).length} />
            <NextClassCard appTheme={appTheme}
              schedule={classInfo?.schedule || null}
              teacher={classInfo?.teacher || null}
              className={classInfo?.className || null} />
          </div>
        )}

        {/* ===== QUICK ACTIONS ===== */}
        <div className="mb-5 animate-fade-in-up stagger-3" style={{ animationFillMode: 'both' }}>
          {/* Meu Tutor highlight card (Liquid Glass) */}
          <button
            onClick={() => {
              const tutorTab = document.querySelector('[value="tutor"]') as HTMLButtonElement;
              if (tutorTab) tutorTab.click();
            }}
            className="liquid-glass liquid-glass-purple w-full mb-3 p-4 sm:p-5 !rounded-2xl relative group"
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <img
                    src="/miss-elie-uniform-avatar.png"
                    alt="Miss Elie"
                    className="w-14 h-14 sm:w-18 sm:h-18 object-contain rounded-xl animate-float-slow"
                  />
                  <div className="absolute inset-0 rounded-xl blur-md -z-10"
                    style={{ background: 'rgba(124,58,237,0.3)' }} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2"
                    style={{ fontFamily: "'Syne', sans-serif" }}>
                    Meu Tutor
                    <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(124,58,237,0.3)', color: '#c084fc', border: '1px solid rgba(124,58,237,0.4)' }}>
                      AI
                    </span>
                  </h3>
                  <p className="text-white/40 text-xs sm:text-sm">Elie, Vacation Plus, Materiais</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
            </div>
          </button>

          {/* Action grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {hasReadingClub && (
              <button
                onClick={() => {
                  clearNotification('readingClub');
                  const tab = document.querySelector('[value="reading-club"]') as HTMLButtonElement;
                  if (tab) tab.click();
                }}
                className="liquid-glass action-card relative"
                style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.18), rgba(234,88,12,0.08))', borderColor: 'rgba(249,115,22,0.25)' }}
              >
                <BookOpen className="w-6 h-6 text-orange-400" />
                <span className="text-white/80 font-semibold text-xs sm:text-sm">Reading Club</span>
                <NotificationBadge count={notifications.readingClub} />
              </button>
            )}
            <button
              onClick={() => {
                clearNotification('chat');
                const tab = document.querySelector('[value="chat"]') as HTMLButtonElement;
                if (tab) tab.click();
              }}
              className="liquid-glass action-card relative"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(37,99,235,0.08))', borderColor: 'rgba(59,130,246,0.25)' }}
            >
              <MessageCircle className="w-6 h-6 text-blue-400" />
              <span className="text-white/80 font-semibold text-xs sm:text-sm">Chat IA</span>
              <NotificationBadge count={notifications.chat} />
            </button>
            <button
              onClick={() => {
                clearNotification('exercises');
                const tab = document.querySelector('[value="exercises"]') as HTMLButtonElement;
                if (tab) tab.click();
              }}
              className="liquid-glass action-card relative"
              style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.18), rgba(202,138,4,0.08))', borderColor: 'rgba(234,179,8,0.25)' }}
            >
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-white/80 font-semibold text-xs sm:text-sm">Exercícios</span>
              <NotificationBadge count={notifications.exercises} />
            </button>
            <button
              onClick={() => setLocation("/student/voice-chat")}
              className="liquid-glass action-card"
              style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(126,34,206,0.08))', borderColor: 'rgba(168,85,247,0.25)' }}
            >
              <Mic className="w-6 h-6 text-purple-400" />
              <span className="text-white/80 font-semibold text-xs sm:text-sm">Voice Chat</span>
            </button>
            <button
              onClick={() => {
                const tab = document.querySelector('[value="sponte"]') as HTMLButtonElement;
                if (tab) tab.click();
              }}
              className="liquid-glass action-card"
              style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(8,145,178,0.08))', borderColor: 'rgba(6,182,212,0.25)' }}
            >
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              <span className="text-white/80 font-semibold text-xs sm:text-sm">Meus Dados</span>
            </button>
            <button
              onClick={() => setLocation("/student/elie")}
              className="liquid-glass action-card"
              style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(219,39,119,0.08))', borderColor: 'rgba(236,72,153,0.25)' }}
            >
              <Bot className="w-6 h-6 text-pink-400" />
              <span className="text-white/80 font-semibold text-xs sm:text-sm">Miss Elie</span>
            </button>
            <button
              onClick={() => setLocation("/student/themes")}
              className="liquid-glass action-card"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(109,40,217,0.08))', borderColor: 'rgba(124,58,237,0.25)' }}
            >
              <Palette className="w-6 h-6 text-violet-400" />
              <span className="text-white/80 font-semibold text-xs sm:text-sm">Temas</span>
            </button>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex w-full overflow-x-auto rounded-2xl p-1 gap-0.5 sm:gap-1 shadow-lg scrollbar-hide"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}>
            {[
              { value: 'overview', icon: BookOpen, label: 'Visão Geral' },
              { value: 'tutor', icon: GraduationCap, label: 'Meu Tutor' },
              ...(hasReadingClub ? [{ value: 'reading-club', icon: BookOpen, label: 'Reading' }] : []),
              { value: 'chat', icon: MessageCircle, label: 'Chat' },
              { value: 'exercises', icon: Zap, label: 'Exercícios' },
              { value: 'calendar', icon: Calendar, label: 'Agenda' },
              { value: 'messages', icon: Bell, label: 'Avisos' },
              { value: 'grades', icon: BarChart3, label: 'Notas' },
              { value: 'sponte', icon: TrendingUp, label: 'Dados' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex flex-col items-center justify-center gap-0.5 py-2 px-1 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/30 hover:text-white/60 rounded-lg transition-all duration-200"
                style={{}}
                onClick={() => {
                  if (tab.value === 'reading-club') clearNotification('readingClub');
                  if (tab.value === 'chat') clearNotification('chat');
                  if (tab.value === 'exercises') clearNotification('exercises');
                }}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[8px] sm:text-[10px] font-semibold">{tab.label}</span>
                {tab.value === 'reading-club' && <NotificationBadge count={notifications.readingClub} />}
                {tab.value === 'chat' && <NotificationBadge count={notifications.chat} />}
                {tab.value === 'exercises' && <NotificationBadge count={notifications.exercises} />}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* === Tab: Overview === */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Completed Books */}
            {studentData.completedBooks.filter(b => b.progress === 100).length > 0 && (
              <GlassCard appTheme={appTheme} className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Livros Completos</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {studentData.completedBooks.filter(b => b.progress === 100).map((book) => {
                    const bt = getBookTheme(book.id);
                    return (
                      <div key={book.id} className="text-center p-3 rounded-xl" style={{ background: `${bt.primary}12`, border: `1px solid ${bt.primary}20` }}>
                        <span className="text-2xl">{bt.emoji}</span>
                        <p className="text-xs font-bold mt-1" style={{ color: bt.primary }}>{book.name}</p>
                        <p className="text-[10px] text-white/40">{book.completedAt}</p>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {/* Recent Chunks */}
              <GlassCard appTheme={appTheme} className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Chunks Recentes</h3>
                </div>
                <p className="text-white/40 text-sm mb-4">Últimas expressões aprendidas</p>
                <div className="space-y-2">
                  {studentData.recentChunks.slice(0, 3).map((chunk, index) => (
                    <div key={index} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <p className="text-white font-medium text-sm">{chunk.text}</p>
                      <p className="text-xs mt-0.5" style={{ color: theme.primary }}>{chunk.meaning}</p>
                    </div>
                  ))}
                  {studentData.recentChunks.length === 0 && (
                    <p className="text-white/30 text-sm">Nenhum chunk aprendido ainda. Comece a praticar!</p>
                  )}
                </div>
              </GlassCard>

              {/* Weekly Progress */}
              <GlassCard appTheme={appTheme} className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Progresso Semanal</h3>
                </div>
                {studentData.weeklyProgress.length > 0 ? (
                  <div className="grid grid-cols-7 gap-2">
                    {studentData.weeklyProgress.map((day, index) => (
                      <div key={index} className="text-center">
                        <div
                          className="rounded-lg mb-1 flex items-end justify-center"
                          style={{
                            height: `${Math.max(24, day.hours * 28)}px`,
                            background: `linear-gradient(to top, ${theme.primary}20, ${theme.primary}80)`,
                          }}
                        >
                          <span className="text-[9px] sm:text-xs text-white font-bold pb-0.5">{day.hours}h</span>
                        </div>
                        <span className="text-[9px] sm:text-xs text-white/40">{day.day}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/30 text-sm">Dados semanais serão exibidos conforme você estuda.</p>
                )}
              </GlassCard>
            </div>

            <LeaderboardWidget />
          </TabsContent>

          {/* === Tab: Meu Tutor === */}
          <TabsContent value="tutor" className="space-y-4 mt-4">
            <MeuTutorTab studentData={studentData} />
          </TabsContent>

          {/* === Tab: Reading Club === */}
          {hasReadingClub && (
            <TabsContent value="reading-club" className="space-y-4 mt-4">
              <ReadingClubIntegrated />
            </TabsContent>
          )}

          {/* === Tab: Chat === */}
          <TabsContent value="chat" className="space-y-4 mt-4">
            <GlassCard appTheme={appTheme} className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Chat com Fluxie</h3>
              </div>
              <p className="text-white/40 text-sm mb-4">Seu assistente pessoal de inglês</p>
              <div className="flex items-start gap-4 p-4 rounded-xl mb-4" style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(168,85,247,0.08))',
                border: '1px solid rgba(59,130,246,0.15)',
              }}>
                <img src="/fluxie-waving.png" alt="Fluxie" className="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base mb-1">Olá! Sou o Fluxie!</h3>
                  <p className="text-white/50 text-xs sm:text-sm">
                    Como você está no {studentData.currentBook}, posso ajudar com expressões e prática de conversação!
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setLocation("/student/chat")}
                  className="h-14 rounded-xl font-bold"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  <MessageCircle className="w-5 h-5 mr-2" /> Chat
                </Button>
                <Button
                  onClick={() => setLocation("/student/voice-chat")}
                  className="h-14 rounded-xl font-bold"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
                  <Mic className="w-5 h-5 mr-2" /> Voice Chat
                </Button>
              </div>
            </GlassCard>
          </TabsContent>

          {/* === Tab: Exercises === */}
          <TabsContent value="exercises" className="space-y-4 mt-4">
            <GlassCard appTheme={appTheme} className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Exercícios Personalizados</h3>
              </div>
              <p className="text-white/40 text-sm mb-4">Prática focada no seu nível atual</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="p-4 rounded-xl" style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.08))',
                  border: '1px solid rgba(34,197,94,0.15)',
                }}>
                  <h3 className="text-white font-bold mb-1 text-sm">Chunks do {studentData.currentBook}</h3>
                  <p className="text-white/40 text-xs mb-3">Pratique as expressões da sua unit atual</p>
                  <Button className="w-full h-10 rounded-xl" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff' }}>
                    Iniciar
                  </Button>
                </div>
                <div className="p-4 rounded-xl" style={{
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(236,72,153,0.08))',
                  border: '1px solid rgba(168,85,247,0.15)',
                }}>
                  <h3 className="text-white font-bold mb-1 text-sm">Simulador de Situações</h3>
                  <p className="text-white/40 text-xs mb-3">Pratique em contextos reais</p>
                  <Button
                    onClick={() => setLocation("/student/simulator")}
                    className="w-full h-10 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: '#fff' }}>
                    Iniciar
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => setLocation("/student/exercises")}
                className="w-full h-12 rounded-xl font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)', color: '#1a1145' }}>
                <Zap className="w-5 h-5 mr-2" /> Ver Todos os Exercícios
              </Button>
            </GlassCard>
          </TabsContent>

          {/* === Tab: Calendar === */}
          <TabsContent value="calendar" className="space-y-4 mt-4">
            <StudentCalendar studentName={(user?.name || studentData.name) as string} />
          </TabsContent>

          {/* === Tab: Messages === */}
          <TabsContent value="messages" className="space-y-4 mt-4">
            <StudentMessages studentName={(user?.name || studentData.name) as string} />
          </TabsContent>

          {/* === Tab: Grades === */}
          <TabsContent value="grades" className="space-y-4 mt-4">
            <StudentGrades studentName={(user?.name || studentData.name) as string} />
          </TabsContent>

          {/* === Tab: Student Data === */}
          <TabsContent value="sponte" className="space-y-4 mt-4">
            <GlassCard appTheme={appTheme} className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Seus Dados Escolares</h3>
              </div>
              <p className="text-white/40 text-sm mb-4">Frequência, faltas e avaliações</p>
              <SponteDataSection
                data={{
                  attendance: { total: 20, present: 18, absent: 2, percentage: 90 },
                  absences: { total: 2, justified: 1, unjustified: 1 },
                  evaluations: { average: 8.5, lastScore: 9.0, trend: 'up' },
                }}
              />
            </GlassCard>
          </TabsContent>
        </Tabs>
      </main>
      </div>
    </div>
  );
}
