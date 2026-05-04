import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function StudentProfile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/student/home")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Meu Progresso</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-semibold text-foreground">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-foreground">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nível Atual</p>
                <p className="font-semibold text-primary text-lg">Iniciante</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Objetivo</p>
                <p className="font-semibold text-foreground">Carreira</p>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Estatísticas Gerais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Horas</p>
                    <p className="text-2xl font-bold text-foreground">0h</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sequência</p>
                    <p className="text-2xl font-bold text-primary">0 dias</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Chunks Dominados</p>
                    <p className="text-2xl font-bold text-green-600">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Progresso por Nível
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Iniciante", "Elementar", "Intermediário", "Intermediário Superior", "Avançado"].map((level) => (
                    <div key={level}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{level}</span>
                        <span className="text-sm text-muted-foreground">0%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chunks Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Chunks em Progresso</CardTitle>
            <CardDescription>
              Acompanhe seu domínio de cada combinação de palavras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Comece praticando exercícios para ver seu progresso aqui</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
