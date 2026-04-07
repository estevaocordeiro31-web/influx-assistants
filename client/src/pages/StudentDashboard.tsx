import { useAuth } from "@/_core/hooks/useAuth";
import InfluxHeader from "@/components/InfluxHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, MessageCircle, Zap, TrendingUp, Award, RotateCcw, 
  Trophy, Star, Target, Clock, CheckCircle2, Flame, Medal, Mic, GraduationCap,
  Calendar, Bell, BarChart3
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

// Dados de demonstração - Aluno avançado Book 5
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

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { notifications, clearNotification } = useNotifications();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { status, message, setSyncing, setSyncSuccess, setSyncError } = useSyncStatus();

  // Verificar se é o primeiro acesso do usuário
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

  // Buscar dados personalizados do dashboard do aluno autenticado
  const { data: personalizedDashboard, isLoading: personalizedLoading } = trpc.studentPersonalization.getPersonalizedDashboard.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Buscar cursos extras do aluno logado
  const { data: myCourses } = trpc.studentCourses.getMyCourses.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Controle de acesso por cursos
  const hasReadingClub = myCourses?.includes('reading_club') ?? false;
  const hasVacationPlus = myCourses?.some(c => c.startsWith('vp')) ?? false;
  const hasTraveler = myCourses?.includes('traveler') ?? false;
  const hasOnBusiness = myCourses?.includes('on_business') ?? false;

  // Usar dados personalizados do dashboard ou dados de demonstração
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

  // Get book theme based on student level
  const bookNumber = getBookNumberFromLevel(studentData.level);
  const theme = getBookTheme(bookNumber);

  return (
    <div className="min-h-screen safe-area-bottom" style={{ background: theme.headerBg }}>
      <InfluxHeader />
      
      {/* Tutorial de Onboarding */}
      {showOnboarding && (
        <OnboardingTutorial onComplete={handleOnboardingComplete} />
      )}
      
      <main className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
        {/* Sync Indicator */}
        <div className="mb-4">
          <SyncIndicator status={status} message={message} showBadge={true} />
        </div>
        {/* Header do Aluno - Compacto no Mobile */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-white">
                Olá, {user?.name || studentData.name}! 🎉
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-1">
                <span className="font-semibold" style={{ color: theme.primary }}>{theme.emoji} {studentData.level}</span> • 
                <span className="font-semibold" style={{ color: theme.primary }}> {studentData.currentBook} - Unit {studentData.currentUnit}</span>
              </p>
            </div>
            <div className="hidden sm:flex gap-2 flex-wrap">
              {studentData.badges.slice(0, 3).map((badge, index) => (
                <Badge key={index} variant="outline" className="bg-slate-800/50 border-slate-600 text-white">
                  <span className="mr-1">{badge.icon}</span> {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards - Grid 2x2 no Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-white">{studentData.totalChunksLearned}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400">Chunks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-white">{studentData.totalHoursLearned}h</p>
                  <p className="text-[10px] sm:text-xs text-slate-400">Horas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-white">{studentData.streakDays}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400">Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
                  <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-white">4</p>
                  <p className="text-[10px] sm:text-xs text-slate-400">Livros</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards - Grid 2x3 no Mobile com Meu Tutor em Destaque */}
        <div className="mb-4 sm:mb-6">
          {/* Meu Tutor - Card de Destaque (Maior) com Fluxie Tech */}
          <button 
            onClick={() => {
              const tutorTab = document.querySelector('[value="tutor"]') as HTMLButtonElement;
              if (tutorTab) tutorTab.click();
            }}
            className="w-full mb-3 p-4 sm:p-6 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 rounded-2xl shadow-lg shadow-green-500/20 border border-green-500/30 transition-all duration-200 active:scale-[0.98] overflow-hidden relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-green-500/10 animate-pulse" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/UpLMiMaLftZmSfqa.png" 
                    alt="Fluxie Tech Tutor" 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl"
                  />
                  {/* Neon glow around image */}
                  <div className="absolute inset-0 rounded-xl bg-green-500/20 blur-md -z-10" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
                    Meu Tutor
                    <span className="text-xs sm:text-sm bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">AI</span>
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm">Fluxie • Vacation Plus • Materiais</p>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-green-400 text-sm font-medium">Acesse agora →</span>
              </div>
            </div>
          </button>

          {/* Grid de Action Cards - 2 colunas no mobile, 3 no tablet, 5 no desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {/* Reading Club - só aparece se aluno tem acesso */}
            {hasReadingClub && (
              <button 
                onClick={() => {
                  clearNotification('readingClub');
                  const tab = document.querySelector('[value="reading-club"]') as HTMLButtonElement;
                  if (tab) tab.click();
                }}
                className="action-card bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-lg shadow-orange-500/20 relative"
              >
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                <span className="text-white font-semibold text-xs sm:text-sm">Reading Club</span>
                <NotificationBadge count={notifications.readingClub} />
              </button>
            )}

            {/* Chat IA */}
            <button 
              onClick={() => {
                clearNotification('chat');
                const tab = document.querySelector('[value="chat"]') as HTMLButtonElement;
                if (tab) tab.click();
              }}
              className="action-card bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 shadow-lg shadow-blue-500/20 relative"
            >
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              <span className="text-white font-semibold text-xs sm:text-sm">Chat IA</span>
              <NotificationBadge count={notifications.chat} />
            </button>

            {/* Exercícios */}
            <button 
              onClick={() => {
                clearNotification('exercises');
                const tab = document.querySelector('[value="exercises"]') as HTMLButtonElement;
                if (tab) tab.click();
              }}
              className="action-card bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 shadow-lg shadow-yellow-500/20 relative"
            >
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-slate-900" />
              <span className="text-slate-900 font-semibold text-xs sm:text-sm">Exercícios</span>
              <NotificationBadge count={notifications.exercises} />
            </button>

            {/* Voice Chat */}
            <button 
              onClick={() => setLocation("/student/voice-chat")}
              className="action-card bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 shadow-lg shadow-purple-500/20"
            >
              <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              <span className="text-white font-semibold text-xs sm:text-sm">Voice Chat</span>
            </button>

            {/* Dados */}
            <button 
              onClick={() => {
                const tab = document.querySelector('[value="sponte"]') as HTMLButtonElement;
                if (tab) tab.click();
              }}
              className="action-card bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 shadow-lg shadow-cyan-500/20"
            >
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              <span className="text-white font-semibold text-xs sm:text-sm">Meus Dados</span>
            </button>
          </div>
        </div>

        {/* Abas Principais - Escondidas visualmente mas funcionais */}
        <Tabs defaultValue="overview" className="w-full">
          {/* Navegação Principal - Compacta no Mobile */}
          <TabsList className="flex w-full overflow-x-auto bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-1 gap-0.5 sm:gap-1 shadow-lg scrollbar-hide">
            <TabsTrigger 
              value="overview" 
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[8px] sm:text-[10px] font-semibold">Visão Geral</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="tutor" 
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
            >
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[8px] sm:text-[10px] font-semibold">Meu Tutor</span>
            </TabsTrigger>
            
            {hasReadingClub && (
              <TabsTrigger 
                value="reading-club" 
                className="flex flex-col items-center justify-center gap-0.5 py-2 px-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-400 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200 relative"
                onClick={() => clearNotification('readingClub')}
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[8px] sm:text-[10px] font-semibold">Reading</span>
                <NotificationBadge count={notifications.readingClub} />
              </TabsTrigger>
            )}
            
            <TabsTrigger 
              value="chat" 
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-400 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200 relative"
              onClick={() => clearNotification('chat')}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[8px] sm:text-[10px] font-semibold">Chat</span>
              <NotificationBadge count={notifications.chat} />
            </TabsTrigger>
            
            <TabsTrigger 
              value="exercises" 
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200 relative"
              onClick={() => clearNotification('exercises')}
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[8px] sm:text-[10px] font-semibold">Exercícios</span>
              <NotificationBadge count={notifications.exercises} />
            </TabsTrigger>
            
            <TabsTrigger 
              value="calendar" 
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-2 shrink-0 data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal-400 data-[state=active]:to-teal-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[8px] sm:text-[10px] font-semibold">Agenda</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="messages" 
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-2 shrink-0 data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-400 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200 relative"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[8px] sm:text-[10px] font-semibold">Avisos</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="grades" 
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-2 shrink-0 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-400 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[8px] sm:text-[10px] font-semibold">Notas</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="sponte" 
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-2 shrink-0 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:to-cyan-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
            >
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[8px] sm:text-[10px] font-semibold">Dados</span>
            </TabsTrigger>
          </TabsList>

          {/* Aba: Visão Geral */}
          <TabsContent value="overview" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
              {/* Progresso Atual */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    {studentData.currentBook} - Progresso
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs sm:text-sm">
                    Unit {studentData.currentUnit} de {studentData.totalUnits}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs sm:text-sm text-slate-300">Progresso do Livro</span>
                      <span className="text-xs sm:text-sm font-bold text-green-400">{studentData.progressPercentage}%</span>
                    </div>
                    <Progress value={studentData.progressPercentage} className="h-2 sm:h-3 bg-slate-700" />
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-slate-900 font-bold h-10 sm:h-11">
                    <Zap className="w-4 h-4 mr-2" />
                    Continuar Estudando
                  </Button>
                </CardContent>
              </Card>

              {/* Chunks Recentes */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    Chunks Recentes
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs sm:text-sm">
                    Últimas expressões aprendidas
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="space-y-2">
                    {studentData.recentChunks.slice(0, 3).map((chunk, index) => (
                      <div key={index} className="p-2 bg-slate-700/50 rounded-lg">
                        <p className="text-white font-medium text-xs sm:text-sm">{chunk.text}</p>
                        <p className="text-green-400 text-[10px] sm:text-xs">{chunk.meaning}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-3 border-slate-600 text-slate-300 hover:bg-slate-700 h-9 sm:h-10 text-xs sm:text-sm">
                    Ver Todos os Chunks
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Progresso Semanal */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  Progresso Semanal
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {studentData.weeklyProgress.map((day, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="bg-gradient-to-t from-green-500/20 to-green-500/80 rounded-lg mb-1 flex items-end justify-center"
                        style={{ height: `${Math.max(20, day.hours * 25)}px` }}
                      >
                        <span className="text-[9px] sm:text-xs text-white font-bold pb-0.5">{day.hours}h</span>
                      </div>
                      <span className="text-[9px] sm:text-xs text-slate-400">{day.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <LeaderboardWidget />
          </TabsContent>

          {/* Aba: Meu Tutor (absorve Meus Livros, Vacation Plus, Revisão, Blog, Materiais) */}
          <TabsContent value="tutor" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <MeuTutorTab studentData={studentData} />
          </TabsContent>

          {/* Aba: Reading Club */}
          {hasReadingClub && (
            <TabsContent value="reading-club" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              <ReadingClubIntegrated />
            </TabsContent>
          )}

          {/* Aba: Chat IA */}
          <TabsContent value="chat" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  Chat com Fluxie
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs sm:text-sm">
                  Seu assistente pessoal de inglês
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                  <img src="/fluxie-waving.png" alt="Fluxie" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-lg mb-1">Olá! Sou o Fluxie! 👋</h3>
                    <p className="text-slate-300 text-xs sm:text-sm">
                      Como você está no Book 5, posso ajudar com expressões avançadas e prática de conversação!
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button 
                    onClick={() => setLocation("/student/chat")}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-14 sm:h-16 text-sm sm:text-lg"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Chat
                  </Button>
                  <Button 
                    onClick={() => setLocation("/student/voice-chat")}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold h-14 sm:h-16 text-sm sm:text-lg"
                  >
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Voice Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Exercícios */}
          <TabsContent value="exercises" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  Exercícios Personalizados
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs sm:text-sm">
                  Prática focada no seu nível atual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                    <h3 className="text-white font-bold mb-1 sm:mb-2 text-sm sm:text-base">Chunks do Book 5</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3">Pratique as expressões da sua unit atual</p>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-slate-900 h-9 sm:h-10">
                      Iniciar
                    </Button>
                  </div>
                  <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                    <h3 className="text-white font-bold mb-1 sm:mb-2 text-sm sm:text-base">Simulador de Situações</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3">Pratique em contextos reais</p>
                    <Button 
                      onClick={() => setLocation("/student/simulator")}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white h-9 sm:h-10"
                    >
                      Iniciar
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={() => setLocation("/student/exercises")}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold h-12 sm:h-14 text-sm sm:text-lg"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Ver Todos os Exercícios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Agenda */}
          <TabsContent value="calendar" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <StudentCalendar studentName={(user?.name || studentData.name) as string} />
          </TabsContent>

          {/* Aba: Mensagens do Pedagógico */}
          <TabsContent value="messages" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <StudentMessages studentName={(user?.name || studentData.name) as string} />
          </TabsContent>

          {/* Aba: Notas e Presença */}
          <TabsContent value="grades" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <StudentGrades studentName={(user?.name || studentData.name) as string} />
          </TabsContent>

          {/* Aba: Dados do Aluno (sem Sponte) */}
          <TabsContent value="sponte" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  Seus Dados Escolares
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs sm:text-sm">
                  Frequência, faltas e avaliações
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <SponteDataSection 
                  data={{
                    attendance: {
                      total: 20,
                      present: 18,
                      absent: 2,
                      percentage: 90,
                    },
                    absences: {
                      total: 2,
                      justified: 1,
                      unjustified: 1,
                    },
                    evaluations: {
                      average: 8.5,
                      lastScore: 9.0,
                      trend: 'up',
                    },
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
