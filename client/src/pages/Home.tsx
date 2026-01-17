import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MessageCircle, Zap, Users, TrendingUp, Award } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated && user) {
    if (user.role === "student") {
      setLocation("/student/dashboard");
      return null;
    } else if (user.role === "admin") {
      setLocation("/admin/dashboard");
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">inFlux</h1>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <a href={getLoginUrl()}>Fazer Login</a>
          </Button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-foreground mb-4">
          Aprenda Inglês com IA Personalizada
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Assistentes de aprendizado baseados na metodologia inFlux de Chunks e Equivalência.
          Pratique como nativos falam, não como os livros ensinam.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <a href={getLoginUrl()}>Começar Agora</a>
          </Button>
          <Button size="lg" variant="outline">
            Saiba Mais
          </Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-foreground mb-12 text-center">
          Por que escolher inFlux?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <MessageCircle className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Chat com IA</CardTitle>
              <CardDescription>
                Converse em tempo real com um assistente inteligente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pratique inglês natural através de conversas interativas baseadas em seus objetivos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-secondary mb-2" />
              <CardTitle>Chunks e Equivalência</CardTitle>
              <CardDescription>
                Metodologia exclusiva da inFlux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aprenda combinações de palavras reais usadas por nativos, com equivalências em português.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Progresso Personalizado</CardTitle>
              <CardDescription>
                Acompanhamento em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Veja seu progresso em detalhes e receba recomendações personalizadas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Exercícios Adaptativos</CardTitle>
              <CardDescription>
                Prática focada no seu nível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Exercícios que se adaptam ao seu progresso e dificuldades.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>Simuladores Reais</CardTitle>
              <CardDescription>
                Pratique situações do dia a dia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Simule entrevistas, viagens, apresentações e muito mais.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle>Dashboard Admin</CardTitle>
              <CardDescription>
                Gestão completa para coordenadores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitore o desempenho de todos os alunos em um único lugar.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Pronto para transformar seu aprendizado?
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Junte-se a centenas de alunos que já estão aprendendo com a metodologia inFlux.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-gray-100"
          >
            <a href={getLoginUrl()}>Começar Grátis</a>
          </Button>
        </div>
      </section>

      <footer className="bg-foreground text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm opacity-75">
            © 2024 inFlux Personal Tutor. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
