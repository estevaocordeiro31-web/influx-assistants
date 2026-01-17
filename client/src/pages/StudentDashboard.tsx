import { useAuth } from "@/_core/hooks/useAuth";
import InfluxHeader from "@/components/InfluxHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, MessageCircle, Zap, TrendingUp, Award, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated || !user) {
    setLocation("/");
    return null;
  }

  // Mock data - será substituído por dados reais do Sponte
  const studentData = {
    name: user.name || "Aluno",
    email: user.email || "aluno@example.com",
    level: "Intermediário",
    currentBook: "Book 3",
    currentUnit: 7,
    totalUnits: 12,
    progressPercentage: 58,
    hoursLearned: 24,
    chunksLearned: 156,
    nextReview: 12, // chunks para revisar
    recentChunks: [
      { text: "look forward to", meaning: "esperar por" },
      { text: "come up with", meaning: "inventar/criar" },
      { text: "get along with", meaning: "dar bem com" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <InfluxHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Boas-vindas com Fluxie */}
        <div className="mb-8 bg-gradient-to-r from-green-400 to-blue-900 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Bem-vindo, {studentData.name}! 👋</h2>
              <p className="text-lg opacity-90">
                Você está no caminho certo! Continue praticando chunks e equivalências.
              </p>
            </div>
            <img
              src="/fluxie.png"
              alt="Fluxie Mascote"
              className="w-24 h-24 hidden md:block"
            />
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-t-4 border-t-green-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Horas Aprendidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.hoursLearned}h</div>
              <p className="text-xs text-muted-foreground mt-1">+2h esta semana</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-blue-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chunks Aprendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.chunksLearned}</div>
              <p className="text-xs text-muted-foreground mt-1">+12 este mês</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-orange-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Para Revisar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{studentData.nextReview}</div>
              <p className="text-xs text-muted-foreground mt-1">Chunks vencidos</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nível Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.level}</div>
              <p className="text-xs text-muted-foreground mt-1">Book 3</p>
            </CardContent>
          </Card>
        </div>

        {/* Abas Principais */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white border-b">
            <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-green-400">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="book" className="data-[state=active]:border-b-2 data-[state=active]:border-green-400">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Meu Livro</span>
            </TabsTrigger>
            <TabsTrigger value="review" className="data-[state=active]:border-b-2 data-[state=active]:border-green-400">
              <RotateCcw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Revisão</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:border-b-2 data-[state=active]:border-green-400">
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="exercises" className="data-[state=active]:border-b-2 data-[state=active]:border-green-400">
              <Zap className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Exercícios</span>
            </TabsTrigger>
          </TabsList>

          {/* Aba: Visão Geral */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Progresso do Livro Atual</CardTitle>
                <CardDescription>
                  {studentData.currentBook} - Unit {studentData.currentUnit} de {studentData.totalUnits}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progresso Geral</span>
                    <span className="text-sm font-bold text-green-600">{studentData.progressPercentage}%</span>
                  </div>
                  <Progress value={studentData.progressPercentage} className="h-3" />
                </div>
                <Button className="w-full bg-green-400 hover:bg-green-500 text-blue-900 font-bold">
                  Continuar Estudando
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chunks Recentes</CardTitle>
                <CardDescription>Últimos chunks que você aprendeu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentData.recentChunks.map((chunk, idx) => (
                    <div key={idx} className="flex items-start justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-l-green-400">
                      <div>
                        <p className="font-semibold text-blue-900">{chunk.text}</p>
                        <p className="text-sm text-muted-foreground">{chunk.meaning}</p>
                      </div>
                      <Award className="w-5 h-5 text-green-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Meu Livro */}
          <TabsContent value="book" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{studentData.currentBook}</CardTitle>
                <CardDescription>Nível: {studentData.level}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Você está na Unit {studentData.currentUnit} de {studentData.totalUnits}. Continue praticando para avançar!
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg text-center font-semibold cursor-pointer transition ${
                        idx + 1 <= studentData.currentUnit
                          ? "bg-green-100 text-green-700 border-2 border-green-400"
                          : idx + 1 === studentData.currentUnit + 1
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-400"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      Unit {idx + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Revisão */}
          <TabsContent value="review" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Chunks para Revisar</CardTitle>
                <CardDescription>
                  Você tem {studentData.nextReview} chunks vencidos para revisar hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold">
                  Começar Revisão de Spaced Repetition
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Chat */}
          <TabsContent value="chat" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Chat com Assistente</CardTitle>
                <CardDescription>Converse com seu tutor de IA personalizado</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setLocation("/student/chat")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Abrir Chat
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Exercícios */}
          <TabsContent value="exercises" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Exercícios Personalizados</CardTitle>
                <CardDescription>Praticar com exercícios adaptados ao seu nível</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setLocation("/student/exercises")}
                  className="w-full bg-green-400 hover:bg-green-500 text-blue-900 font-bold"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Começar Exercícios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
