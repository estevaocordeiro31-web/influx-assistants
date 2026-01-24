import { useAuth } from "@/_core/hooks/useAuth";
import InfluxHeader from "@/components/InfluxHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, MessageCircle, Zap, TrendingUp, Award, RotateCcw, 
  Trophy, Star, Target, Clock, CheckCircle2, Flame, Medal, Mic
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import TipOfDayWidget from "@/components/TipOfDayWidget";
import RecommendedTipsSection from "@/components/RecommendedTipsSection";
import MyFavoriteTips from "@/components/MyFavoriteTips";
import BadgesDisplay from "@/components/BadgesDisplay";
import { SponteDataSection } from "@/components/SponteDataSection";
import { ExclusiveMaterialsSection } from "@/components/ExclusiveMaterialsSection";
import { ReadingClubIntegrated } from "@/components/ReadingClubIntegrated";
import { PersonalTutor } from "@/components/PersonalTutor";
import { trpc } from "@/lib/trpc";

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
  const [selectedTip, setSelectedTip] = useState<any>(null);

  // Buscar dados do dashboard do aluno autenticado
  const { data: dashboardData, isLoading: dashboardLoading } = trpc.student.getDashboardData.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Buscar dica do dia
  const { data: tipOfDayData, isLoading: tipLoading } = trpc.blogTips.getTipOfDay.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Buscar dicas recomendadas (simulando dificuldades do aluno)
  const { data: recommendedTipsData, isLoading: recommendedLoading } =
    trpc.blogTips.getRecommendedTips.useQuery(
      { difficulties: ["phrasal-verbs", "chunks", "vocabulary"] },
      { enabled: isAuthenticated }
    );

  // Usar dados reais do backend ou fallback para DEMO_STUDENT
  const studentData = dashboardData || DEMO_STUDENT;

  // Mostrar loading enquanto carrega dados
  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando seu dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <InfluxHeader />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section com Fluxie */}
        <div className="mb-6 bg-gradient-to-r from-green-500 via-green-400 to-emerald-400 rounded-2xl p-6 text-slate-900 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-20">
            <div className="w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">Olá, {studentData.name}! 🎉</h2>
                <Badge className="bg-yellow-400 text-slate-900 font-bold">
                  <Trophy className="w-3 h-3 mr-1" />
                  Nível Avançado
                </Badge>
              </div>
              <p className="text-lg opacity-90 mb-4">
                Você está arrasando! {studentData.streakDays} dias de sequência e {studentData.totalChunksLearned} chunks dominados!
              </p>
              <div className="flex gap-2 flex-wrap">
                {studentData.badges.map((badge, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-white/90 text-slate-800">
                    <span className="mr-1">{badge.icon}</span>
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </div>
            <img
              src="/fluxie-headphones.png"
              alt="Fluxie Mascote"
              className="w-32 h-32 hidden lg:block drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{studentData.totalHoursLearned}h</p>
                  <p className="text-xs text-slate-400">Horas Totais</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{studentData.totalChunksLearned}</p>
                  <p className="text-xs text-slate-400">Chunks Dominados</p>
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

        {/* Abas Principais */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-9 bg-slate-900/80 backdrop-blur-sm border-2 border-slate-700/50 rounded-2xl p-2 gap-1 shadow-lg">
            <TabsTrigger 
              value="overview" 
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[10px] sm:text-xs font-semibold">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger 
              value="books" 
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[10px] sm:text-xs font-semibold">Meus Livros</span>
            </TabsTrigger>
            <TabsTrigger 
              value="review" 
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <RotateCcw className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[10px] sm:text-xs font-semibold">Revisão</span>
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-400 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[10px] sm:text-xs font-semibold">Chat IA</span>
            </TabsTrigger>
            <TabsTrigger 
              value="exercises" 
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-yellow-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <Zap className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[10px] sm:text-xs font-semibold">Exercícios</span>
            </TabsTrigger>
            <TabsTrigger 
              value="blog" 
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-400 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[10px] sm:text-xs font-semibold">Blog</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sponte" 
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:to-cyan-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[10px] sm:text-xs font-semibold">Dados</span>
            </TabsTrigger>
            <TabsTrigger 
              value="materials" 
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-400 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[10px] sm:text-xs font-semibold">Materiais</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reading-club" 
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-400 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[10px] sm:text-xs font-semibold">Reading Club</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tutor" 
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-400 data-[state=active]:to-amber-500 data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <Star className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[10px] sm:text-xs font-semibold">Meu Tutor</span>
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

              {/* Atividade Semanal */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Atividade Semanal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-32 gap-2">
                    {studentData.weeklyProgress.map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                          style={{ height: `${(day.hours / 2.5) * 100}%`, minHeight: '8px' }}
                        ></div>
                        <span className="text-xs text-slate-400 mt-2">{day.day}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm text-slate-400 mt-4">
                    Total: {studentData.weeklyProgress.reduce((a, b) => a + b.hours, 0)}h esta semana
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Dica do Dia */}
            <TipOfDayWidget
              tip={tipOfDayData?.tip || undefined}
              isLoading={tipLoading}
              onViewMore={setSelectedTip}
            />

            {/* Dicas Recomendadas */}
            <RecommendedTipsSection
              tips={recommendedTipsData?.tips || []}
              isLoading={recommendedLoading}
              onViewMore={setSelectedTip}
            />

            {/* Chunks Recentes */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Chunks Recentes - Nível Avançado
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Últimas expressões que você dominou
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {studentData.recentChunks.map((chunk, idx) => (
                    <div key={idx} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600 hover:border-green-500/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-bold text-green-400 text-lg">{chunk.text}</p>
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      </div>
                      <p className="text-slate-300 text-sm mb-2">= {chunk.meaning}</p>
                      <p className="text-slate-500 text-xs italic">"{chunk.context}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Meus Livros */}
          <TabsContent value="books" className="space-y-4 mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Sua Jornada de Aprendizado
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Histórico completo de todos os livros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.completedBooks.map((book, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-xl border transition-all ${
                        book.progress === 100 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-blue-500/10 border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {book.progress === 100 ? (
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-white text-lg">{book.name}</h3>
                            <p className="text-sm text-slate-400">{book.level}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {book.progress === 100 ? (
                            <Badge className="bg-green-500 text-white">
                              <Trophy className="w-3 h-3 mr-1" />
                              Completo
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-500 text-white">
                              Em Progresso
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center p-2 bg-slate-700/50 rounded-lg">
                          <p className="text-lg font-bold text-white">{book.hoursSpent}h</p>
                          <p className="text-xs text-slate-400">Horas</p>
                        </div>
                        <div className="text-center p-2 bg-slate-700/50 rounded-lg">
                          <p className="text-lg font-bold text-white">{book.chunksLearned}</p>
                          <p className="text-xs text-slate-400">Chunks</p>
                        </div>
                        <div className="text-center p-2 bg-slate-700/50 rounded-lg">
                          <p className="text-lg font-bold text-white">{book.progress}%</p>
                          <p className="text-xs text-slate-400">Progresso</p>
                        </div>
                      </div>
                      
                      <Progress value={book.progress} className="h-2 bg-slate-700" />
                      
                      {book.completedAt && (
                        <p className="text-xs text-slate-500 mt-2">
                          Concluído em {new Date(book.completedAt).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Revisão */}
          <TabsContent value="review" className="space-y-4 mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-orange-400" />
                  Spaced Repetition
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Você tem {studentData.nextReview} chunks para revisar hoje
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl border border-orange-500/30 text-center">
                  <div className="text-5xl font-bold text-orange-400 mb-2">{studentData.nextReview}</div>
                  <p className="text-slate-300">Chunks aguardando revisão</p>
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 text-lg">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Iniciar Sessão de Revisão
                </Button>
                <p className="text-center text-sm text-slate-500">
                  Revisões regulares aumentam sua retenção em até 80%!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Chat */}
          <TabsContent value="chat" className="space-y-4 mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                  Chat com Assistente IA
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Pratique conversação com seu tutor personalizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                  <div className="flex items-center gap-4 mb-4">
                    <img src="/fluxie-chat.png" alt="Fluxie" className="w-16 h-16 rounded-full" />
                    <div>
                      <h3 className="text-white font-bold text-lg">Fluxie - Seu Tutor Pessoal</h3>
                      <p className="text-slate-400 text-sm">Especializado em Chunks e Equivalência</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-4">
                    Como você está no Book 5, posso ajudar com expressões avançadas, 
                    simulações de situações reais e prática de conversação fluente!
                  </p>
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

          {/* Aba: Blog */}
          <TabsContent value="blog" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Dica do Dia */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  Dica do Dia
                </h3>
                <TipOfDayWidget 
                  tip={tipOfDayData?.tip || undefined} 
                  isLoading={tipLoading}
                  onViewMore={setSelectedTip}
                />
              </div>

              {/* Dicas Recomendadas */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Dicas Recomendadas para Você
                </h3>
                <RecommendedTipsSection 
                  tips={recommendedTipsData?.tips || []} 
                  isLoading={recommendedLoading}
                  onViewMore={setSelectedTip}
                />
              </div>

              {/* Meus Favoritos */}
              <div>
                <MyFavoriteTips />
              </div>

              {/* Minhas Conquistas */}
              <div>
                <BadgesDisplay />
              </div>

              {/* Todas as Dicas do Blog */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-400" />
                    Todas as Dicas do Blog inFlux
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Explore dicas e artigos do blog da inFlux para melhorar seu inglês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <img src="/fluxie-learning.png" alt="Fluxie" className="w-24 h-24 mx-auto mb-4" />
                    <p className="text-slate-300 mb-4">Explore dicas do blog para complementar seus estudos</p>
                    <Button className="bg-green-500 hover:bg-green-600 text-slate-900 font-bold">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Visitar Blog inFlux
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba: Materiais Exclusivos */}
          <TabsContent value="materials" className="space-y-4 mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  Materiais Exclusivos
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Materiais compartilhados especialmente para você
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExclusiveMaterialsSection />
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

          {/* Aba: Reading Club (com Boogeyman integrado) */}
          <TabsContent value="reading-club" className="space-y-4 mt-4">
            <ReadingClubIntegrated />
          </TabsContent>

          {/* Aba: Meu Tutor Personalizado */}
          <TabsContent value="tutor" className="space-y-4 mt-4">
            <PersonalTutor 
              studentId={user?.id || 0}
              studentName={user?.name || "Aluno"}
              studentLevel="B4"
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
