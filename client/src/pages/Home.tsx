import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageCircle, Zap, TrendingUp, Award, Users, Play, ArrowRight, Sparkles, Film, GraduationCap } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated && user) {
    if (user.role === "user") {
      setLocation("/student/dashboard");
      return null;
    } else if (user.role === "admin") {
      setLocation("/admin/dashboard");
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/influx-logo_17347370.jpeg" alt="inFlux" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <h1 className="text-xl font-bold text-white">inFlux <span className="text-green-400">Personal Tutor</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setLocation("/lessons")}
              variant="ghost" 
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Lessons
            </Button>
            <Button 
              onClick={() => setLocation("/animations")}
              variant="ghost" 
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Film className="w-4 h-4 mr-2" />
              Animations
            </Button>
            <Button 
              onClick={() => setLocation("/demo")}
              variant="ghost" 
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Play className="w-4 h-4 mr-2" />
              Ver Demo
            </Button>
            <Button asChild className="bg-green-500 hover:bg-green-600 text-slate-900 font-bold">
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Metodologia Exclusiva inFlux
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Aprenda Inglês como os 
              <span className="text-green-400"> Nativos Falam</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Seu tutor pessoal de IA que ensina usando <strong className="text-white">Chunks e Equivalência</strong>. 
              Pratique expressões reais, não frases de livro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setLocation("/demo")}
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-slate-900 font-bold text-lg px-8 py-6"
              >
                <Play className="w-5 h-5 mr-2" />
                Experimentar Agora
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white text-lg px-8 py-6"
              >
                <a href={getLoginUrl()}>
                  Fazer Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/miss-elie-uniform-avatar_17347370.jpg" alt="Miss Elie" className="w-20 h-20 rounded-full object-cover border-2 border-green-500 shadow-lg shadow-green-500/30" />
                <div>
                  <h3 className="text-white font-bold text-xl">Olá! Eu sou a Elie 👋</h3>
                  <p className="text-slate-400">Sua tutora pessoal de inglês</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <p className="text-green-400 font-bold mb-1">"take it for granted"</p>
                  <p className="text-slate-300 text-sm">= dar como certo</p>
                  <p className="text-slate-500 text-xs mt-2 italic">"Don't take your health for granted."</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <p className="text-green-400 font-bold mb-1">"once in a blue moon"</p>
                  <p className="text-slate-300 text-sm">= muito raramente</p>
                  <p className="text-slate-500 text-xs mt-2 italic">"I only see him once in a blue moon."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Por que escolher o inFlux Personal Tutor?
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Combinamos inteligência artificial com a metodologia comprovada da inFlux
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Chat com IA</h4>
              <p className="text-slate-400 text-sm">
                Converse em tempo real com um assistente que entende seu nível e objetivos.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Chunks e Equivalência</h4>
              <p className="text-slate-400 text-sm">
                Aprenda combinações de palavras reais usadas por nativos, com equivalências em português.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Spaced Repetition</h4>
              <p className="text-slate-400 text-sm">
                Sistema inteligente de revisão que garante que você nunca esqueça o que aprendeu.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-yellow-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Exercícios Adaptativos</h4>
              <p className="text-slate-400 text-sm">
                Prática focada no seu nível atual, com feedback imediato e personalizado.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Simuladores Reais</h4>
              <p className="text-slate-400 text-sm">
                Pratique situações reais: entrevistas, viagens, reuniões e muito mais.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-pink-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-pink-400" />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">10 Livros Completos</h4>
              <p className="text-slate-400 text-sm">
                Do Junior ao Avançado, todo o conteúdo programático da inFlux integrado.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-green-500 via-green-400 to-emerald-400 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-20">
              <div className="w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Pronto para transformar seu inglês?
              </h3>
              <p className="text-lg text-slate-800 mb-8 max-w-2xl mx-auto">
                Experimente agora mesmo a versão de demonstração e veja como é aprender com o Fluxie!
              </p>
              <Button 
                onClick={() => setLocation("/demo")}
                size="lg" 
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg px-10 py-6"
              >
                <Play className="w-5 h-5 mr-2" />
                Ver Demonstração Completa
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/influx-logo_17347370.jpeg" alt="inFlux" className="w-8 h-8 rounded-md object-cover" />
            <span className="text-white font-bold">inFlux Personal Tutor</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2025 inFlux. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
