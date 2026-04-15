import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Zap, TrendingUp, Award, Users, Play, ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import { useLocation } from "wouter";

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

  const features = [
    { icon: MessageCircle, title: "Chat com IA", desc: "Converse em tempo real com um assistente que entende seu nível e objetivos.", color: '#06b6d4' },
    { icon: Zap, title: "Chunks e Equivalência", desc: "Aprenda combinações de palavras reais usadas por nativos.", color: '#a855f7' },
    { icon: TrendingUp, title: "Spaced Repetition", desc: "Sistema inteligente de revisão que garante que você nunca esqueça.", color: '#22c55e' },
    { icon: Award, title: "Exercícios Adaptativos", desc: "Prática focada no seu nível atual, com feedback imediato.", color: '#eab308' },
    { icon: Users, title: "Simuladores Reais", desc: "Pratique situações reais: viagens, reuniões e muito mais.", color: '#f97316' },
    { icon: BookOpen, title: "Livros Completos", desc: "Todo o conteúdo programático da inFlux integrado.", color: '#ec4899' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1145 30%, #0d2137 60%, #0a1628 100%)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{
        background: 'rgba(15,10,30,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-purple-400" />
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              ImAInd <span style={{ color: '#06b6d4' }}>TUTOR</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setLocation("/demo")}
              variant="ghost"
              className="text-white/40 hover:text-white/70 hover:bg-white/5 hidden sm:flex"
            >
              <Play className="w-4 h-4 mr-2" /> Demo
            </Button>
            <Button
              onClick={() => setLocation("/login")}
              className="h-10 px-6 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff' }}
            >
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-6"
              style={{ background: 'rgba(124,58,237,0.15)', color: '#c084fc', border: '1px solid rgba(124,58,237,0.25)' }}>
              <Sparkles className="w-3 h-3" /> Metodologia Exclusiva inFlux
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              Aprenda Inglês como os{' '}
              <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Nativos Falam
              </span>
            </h2>
            <p className="text-lg text-white/50 mb-8 leading-relaxed">
              Seu tutor pessoal de IA que ensina usando <strong className="text-white/80">Chunks e Equivalência</strong>.
              Pratique expressões reais, não frases de livro.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setLocation("/demo")}
                size="lg"
                className="h-13 px-8 rounded-xl text-base font-semibold"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
              >
                <Play className="w-5 h-5 mr-2" /> Experimentar Agora
              </Button>
              <Button
                onClick={() => setLocation("/login")}
                size="lg"
                variant="outline"
                className="h-13 px-8 rounded-xl text-base border-white/10 text-white/60 hover:text-white hover:bg-white/5"
              >
                Fazer Login <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-3xl blur-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))' }} />
            <div className="relative rounded-2xl p-8" style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div className="flex items-center gap-4 mb-6">
                <img src="/elie-waving.png" alt="Elie" className="w-16 h-16" />
                <div>
                  <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>Olá! Eu sou a Elie</h3>
                  <p className="text-white/40 text-sm">Seu tutor pessoal de inglês</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { chunk: "take it for granted", meaning: "dar como certo", example: "Don't take your health for granted." },
                  { chunk: "once in a blue moon", meaning: "muito raramente", example: "I only see him once in a blue moon." },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="font-bold mb-0.5" style={{ color: '#06b6d4' }}>"{item.chunk}"</p>
                    <p className="text-white/60 text-sm">= {item.meaning}</p>
                    <p className="text-white/25 text-xs mt-1.5 italic">"{item.example}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
            Por que escolher o ImAInd TUTOR?
          </h3>
          <p className="text-white/40 max-w-2xl mx-auto">
            Inteligência artificial + metodologia comprovada da inFlux
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl p-6 transition-all duration-200 hover:bg-white/[0.03]" style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}15` }}>
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h4 className="text-white font-bold mb-2">{f.title}</h4>
              <p className="text-white/40 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.1) 100%)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              Pronto para transformar seu inglês?
            </h3>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              Experimente a versão de demonstração e veja como é aprender com a Elie!
            </p>
            <Button
              onClick={() => setLocation("/demo")}
              size="lg"
              className="h-13 px-10 rounded-xl text-base font-semibold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
            >
              <Play className="w-5 h-5 mr-2" /> Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-white/20">
            Powered by ImAInd
          </p>
        </div>
      </footer>
    </div>
  );
}
