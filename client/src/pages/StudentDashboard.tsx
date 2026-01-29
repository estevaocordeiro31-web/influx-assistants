import { useAuth } from "@/_core/hooks/useAuth";
import InfluxHeader from "@/components/InfluxHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, MessageCircle, Zap, TrendingUp, Award, RotateCcw, 
  Trophy, Star, Target, Clock, CheckCircle2, Flame, Medal, Mic, GraduationCap
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

  // Buscar dados do dashboard do aluno autenticado
  const { data: dashboardData, isLoading: dashboardLoading } = trpc.student.getDashboardData.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Usar dados do dashboard ou dados de demonstração
  const studentData = dashboardData || DEMO_STUDENT;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <InfluxHeader />
      
      {/* Tutorial de Onboarding */}
      {showOnboarding && (
        <OnboardingTutorial onComplete={handleOnboardingComplete} />
      )}
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header do Aluno */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Olá, {user?.name || studentData.name}! 🎉
              </h1>
              <p className="text-slate-400 mt-1">
                Nível <span className="text-green-400 font-semibold">{studentData.level}</span> • 
                Você está no <span className="text-blue-400 font-semibold">{studentData.currentBook} - Unit {studentData.currentUnit}</span>
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {studentData.badges.slice(0, 3).map((badge, index) => (
                <Badge key={index} variant="outline" className="bg-slate-800/50 border-slate-600 text-white">
                  <span className="mr-1">{badge.icon}</span> {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <BookOpen className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{studentData.totalChunksLearned}</p>
                  <p className="text-xs text-slate-400">Chunks Aprendidos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{studentData.totalHoursLearned}h</p>
                  <p className="text-xs text-slate-400">Horas de Estudo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{studentData.streakDays}</p>
                  <p className="text-xs text-slate-400">Dias Seguidos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Medal className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4</p>
                  <p className="text-xs text-slate-400">Livros Completos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Abas Principais - Reorganizadas para Mobile */}
        <Tabs defaultValue="overview" className="w-full">
          {/* Navegação Principal - 6 abas otimizadas para mobile */}
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-slate-900/80 backdrop-blur-sm border-2 border-slate-700/50 rounded-2xl p-2 gap-1 shadow-lg">
            <TabsTrigger 
              value="overview" 
              className="flex flex-col items-center justify-center gap-1 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Visão Geral</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="tutor" 
              className="flex flex-col items-center justify-center gap-1 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-400 data-[state=active]:to-amber-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Meu Tutor</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="reading-club" 
              className="flex flex-col items-center justify-center gap-1 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-400 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200 relative"
              onClick={() => clearNotification('readingClub')}
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Reading Club</span>
              <NotificationBadge count={notifications.readingClub} />
            </TabsTrigger>
            
            <TabsTrigger 
              value="chat" 
              className="flex flex-col items-center justify-center gap-1 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-400 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200 relative"
              onClick={() => clearNotification('chat')}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Chat IA</span>
              <NotificationBadge count={notifications.chat} />
            </TabsTrigger>
            
            <TabsTrigger 
              value="exercises" 
              className="flex flex-col items-center justify-center gap-1 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-yellow-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200 relative"
              onClick={() => clearNotification('exercises')}
            >
              <Zap className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Exercícios</span>
              <NotificationBadge count={notifications.exercises} />
            </TabsTrigger>
            
            <TabsTrigger 
              value="sponte" 
              className="flex flex-col items-center justify-center gap-1 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:to-cyan-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Dados</span>
            </TabsTrigger>
          </TabsList>

          {/* Aba: Visão Geral */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Progresso Atual */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-400" />
                    {studentData.currentBook} - Progresso Atual
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Unit {studentData.currentUnit} de {studentData.totalUnits}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-300">Progresso do Livro</span>
                      <span className="text-sm font-bold text-green-400">{studentData.progressPercentage}%</span>
                    </div>
                    <Progress value={studentData.progressPercentage} className="h-3 bg-slate-700" />
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-slate-900 font-bold">
                    <Zap className="w-4 h-4 mr-2" />
                    Continuar Estudando
                  </Button>
                </CardContent>
              </Card>

              {/* Chunks Recentes */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Chunks Recentes
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Últimas expressões aprendidas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {studentData.recentChunks.slice(0, 3).map((chunk, index) => (
                      <div key={index} className="p-2 bg-slate-700/50 rounded-lg">
                        <p className="text-white font-medium text-sm">{chunk.text}</p>
                        <p className="text-green-400 text-xs">{chunk.meaning}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-3 border-slate-600 text-slate-300 hover:bg-slate-700">
                    Ver Todos os Chunks
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Progresso Semanal */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Progresso Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {studentData.weeklyProgress.map((day, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="h-20 bg-gradient-to-t from-green-500/20 to-green-500/80 rounded-lg mb-1 flex items-end justify-center"
                        style={{ height: `${Math.max(20, day.hours * 30)}px` }}
                      >
                        <span className="text-xs text-white font-bold pb-1">{day.hours}h</span>
                      </div>
                      <span className="text-xs text-slate-400">{day.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button 
                onClick={() => setLocation("/student/chat")}
                className="h-auto py-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400"
              >
                <div className="flex flex-col items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-xs">Chat com Fluxie</span>
                </div>
              </Button>
              <Button 
                onClick={() => setLocation("/student/exercises")}
                className="h-auto py-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400"
              >
                <div className="flex flex-col items-center gap-2">
                  <Zap className="w-6 h-6" />
                  <span className="text-xs">Exercícios</span>
                </div>
              </Button>
              <Button 
                onClick={() => setLocation("/student/voice-chat")}
                className="h-auto py-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400"
              >
                <div className="flex flex-col items-center gap-2">
                  <Mic className="w-6 h-6" />
                  <span className="text-xs">Voice Chat</span>
                </div>
              </Button>
              <Button 
                onClick={() => setLocation("/student/simulator")}
                className="h-auto py-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400"
              >
                <div className="flex flex-col items-center gap-2">
                  <Target className="w-6 h-6" />
                  <span className="text-xs">Simulador</span>
                </div>
              </Button>
            </div>
          </TabsContent>

          {/* Aba: Meu Tutor (absorve Meus Livros, Vacation Plus, Revisão, Blog, Materiais) */}
          <TabsContent value="tutor" className="space-y-4 mt-4">
            <MeuTutorTab studentData={studentData} />
          </TabsContent>

          {/* Aba: Reading Club */}
          <TabsContent value="reading-club" className="space-y-4 mt-4">
            <ReadingClubIntegrated />
          </TabsContent>

          {/* Aba: Chat IA */}
          <TabsContent value="chat" className="space-y-4 mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                  Chat com Fluxie
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Seu assistente pessoal de inglês
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                  <img src="/fluxie-waving.png" alt="Fluxie" className="w-16 h-16 object-contain" />
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Olá! Sou o Fluxie! 👋</h3>
                    <p className="text-slate-300 text-sm">
                      Como você está no Book 5, posso ajudar com expressões avançadas, 
                      simulações de situações reais e prática de conversação fluente!
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => setLocation("/student/chat")}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 text-lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat
                  </Button>
                  <Button 
                    onClick={() => setLocation("/student/voice-chat")}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-6 text-lg"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Voice Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Exercícios */}
          <TabsContent value="exercises" className="space-y-4 mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Exercícios Personalizados
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Prática focada no seu nível atual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                    <h3 className="text-white font-bold mb-2">Chunks do Book 5</h3>
                    <p className="text-slate-400 text-sm mb-3">Pratique as expressões da sua unit atual</p>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-slate-900">
                      Iniciar
                    </Button>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                    <h3 className="text-white font-bold mb-2">Simulador de Situações</h3>
                    <p className="text-slate-400 text-sm mb-3">Pratique em contextos reais</p>
                    <Button 
                      onClick={() => setLocation("/student/simulator")}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      Iniciar
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={() => setLocation("/student/exercises")}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-6 text-lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Ver Todos os Exercícios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Dados do Sponte */}
          <TabsContent value="sponte" className="space-y-4 mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Seus Dados Escolares
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Frequência, faltas e avaliações do Sponte
                </CardDescription>
              </CardHeader>
              <CardContent>
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
