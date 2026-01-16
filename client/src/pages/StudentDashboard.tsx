import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MessageCircle, Zap, BarChart3, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">inFlux</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo, {user?.name}!
          </h2>
          <p className="text-muted-foreground">
            Comece sua jornada de aprendizado com IA personalizada
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Horas Aprendidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">0h</div>
              <p className="text-xs text-muted-foreground mt-1">Nesta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sequência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">0 dias</div>
              <p className="text-xs text-muted-foreground mt-1">Mantenha a consistência</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chunks Dominados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">0</div>
              <p className="text-xs text-muted-foreground mt-1">Parabéns!</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/student/chat")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle>Chat com Assistente</CardTitle>
                  <CardDescription>Converse com IA em tempo real</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Pratique inglês através de conversas naturais. O assistente usa a metodologia de Chunks e Equivalência para ensinar como nativos falam.
              </p>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Começar Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/student/exercises")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-secondary" />
                <div>
                  <CardTitle>Exercícios Personalizados</CardTitle>
                  <CardDescription>Pratique chunks específicos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Exercícios focados nas combinações de palavras mais usadas por nativos. Feedback imediato para cada resposta.
              </p>
              <Button className="w-full bg-secondary hover:bg-secondary/90">
                Fazer Exercícios
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/student/profile")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div>
                  <CardTitle>Meu Progresso</CardTitle>
                  <CardDescription>Visualize seu desempenho</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Acompanhe seu progresso em tempo real. Veja quais chunks você dominou e onde precisa praticar mais.
              </p>
              <Button variant="outline" className="w-full">
                Ver Progresso
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-green-600" />
                <div>
                  <CardTitle>Simuladores</CardTitle>
                  <CardDescription>Pratique situações reais</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Simule situações do seu objetivo: entrevistas de emprego, conversas em viagens, apresentações acadêmicas.
              </p>
              <Button variant="outline" className="w-full">
                Escolher Simulador
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
