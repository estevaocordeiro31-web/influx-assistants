import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { MessageCircle, Zap, TrendingUp, Award, Users, BookOpen, Play, ArrowRight, Sparkles, GraduationCap, Mic, Brain } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "user") {
        setLocation("/student/home");
      } else if (user.role === "admin") {
        setLocation("/admin/dashboard");
      }
    }
  }, [isAuthenticated, user, setLocation]);

  if (isAuthenticated && user) {
    return null;
  }

  const features = [
    { icon: MessageCircle, title: "Chat com a Elie", desc: "Converse em tempo real com uma tutora que entende seu nível e objetivos.", color: "var(--imaind-blue)" },
    { icon: Zap, title: "Chunks e Equivalência", desc: "Aprenda combinações de palavras reais usadas por nativos.", color: "var(--level-purple)" },
    { icon: TrendingUp, title: "Spaced Repetition", desc: "Sistema inteligente que garante que você nunca esqueça.", color: "var(--imaind-green)" },
    { icon: Award, title: "Exercícios Adaptativos", desc: "Prática focada no seu nível com feedback imediato.", color: "var(--xp-gold)" },
    { icon: Users, title: "Simuladores Reais", desc: "Pratique situações reais: viagens, reuniões e mais.", color: "var(--streak-orange)" },
    { icon: BookOpen, title: "Conteúdo Completo", desc: "Todo o conteúdo programático integrado ao app.", color: "var(--badge-emerald)" },
  ];

  return (
    <div className="tutor-app dark" style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0c1222 0%, #111827 50%, #0c1222 100%)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(12,18,34,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <GraduationCap size={24} style={{ color: "var(--imaind-blue-light)" }} />
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#fff",
            }}>
              ImAInd <span style={{ color: "var(--imaind-blue-light)" }}>TUTOR</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setLocation("/demo")}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Play size={14} /> Demo
            </button>
            <button
              onClick={() => setLocation("/login")}
              style={{
                background: "var(--imaind-blue)",
                color: "#fff",
                border: "none",
                padding: "8px 20px",
                borderRadius: 10,
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px 40px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
          alignItems: "center",
        }} className="lg:grid-cols-2">
          {/* Left — Text */}
          <div>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.75rem",
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(26,111,219,0.12)",
              color: "var(--imaind-blue-light)",
              border: "1px solid rgba(26,111,219,0.2)",
              marginBottom: 24,
            }}>
              <Sparkles size={12} /> Metodologia Exclusiva inFlux
            </span>

            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 20,
            }}>
              Aprenda Inglês{" "}
              <span style={{
                background: "linear-gradient(135deg, var(--imaind-blue-light), var(--imaind-green-light))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                como os Nativos Falam
              </span>
            </h1>

            <p style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              marginBottom: 32,
              maxWidth: 480,
            }}>
              Sua tutora pessoal de IA que ensina usando{" "}
              <strong style={{ color: "rgba(255,255,255,0.8)" }}>Chunks e Equivalência</strong>.
              Pratique expressões reais, não frases de livro.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button
                onClick={() => setLocation("/demo")}
                style={{
                  background: "var(--imaind-blue)",
                  color: "#fff",
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: 12,
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 4px 20px rgba(26,111,219,0.3)",
                }}
              >
                <Play size={18} /> Experimentar Agora
              </button>
              <button
                onClick={() => setLocation("/login")}
                style={{
                  background: "transparent",
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "14px 28px",
                  borderRadius: 12,
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Fazer Login <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right — Elie Chat Preview */}
          <div style={{ position: "relative" }} className="hidden lg:block">
            {/* Glow */}
            <div style={{
              position: "absolute",
              inset: -20,
              borderRadius: 32,
              background: "radial-gradient(circle at center, rgba(26,111,219,0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
            }} />

            {/* Chat card */}
            <div style={{
              position: "relative",
              borderRadius: 20,
              padding: 24,
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              {/* Elie header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ position: "relative" }}>
                  <img
                    src="/miss-elie-uniform-waving.png"
                    alt="Elie"
                    style={{ width: 56, height: 56, borderRadius: 16, objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "var(--imaind-green)",
                    border: "2px solid #0c1222",
                  }} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#fff",
                    margin: 0,
                  }}>
                    Olá! Eu sou a Elie
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>
                    Sua tutora pessoal de inglês
                  </p>
                </div>
              </div>

              {/* Chat bubbles */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <ChatBubble
                  chunk="take it for granted"
                  meaning="dar como certo"
                  example="Don't take your health for granted."
                />
                <ChatBubble
                  chunk="once in a blue moon"
                  meaning="muito raramente"
                  example="I only see him once in a blue moon."
                />
              </div>

              {/* Input preview */}
              <div style={{
                marginTop: 16,
                padding: "10px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.2)" }}>
                  Fale com a Elie...
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <Mic size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "#fff",
            marginBottom: 10,
          }}>
            Por que escolher o ImAInd TUTOR?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: 500, margin: "0 auto" }}>
            Inteligência artificial + metodologia comprovada da inFlux
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 14,
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              borderRadius: 16,
              padding: 22,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              transition: "background 0.2s",
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
                background: `color-mix(in srgb, ${f.color} 12%, transparent)`,
              }}>
                <f.icon size={18} style={{ color: f.color }} />
              </div>
              <h4 style={{ color: "#fff", fontWeight: 600, marginBottom: 6, fontSize: "0.95rem" }}>
                {f.title}
              </h4>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "20px 20px 60px" }}>
        <div style={{
          maxWidth: 800,
          margin: "0 auto",
          borderRadius: 20,
          padding: "48px 32px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background: "rgba(26,111,219,0.08)",
          border: "1px solid rgba(26,111,219,0.15)",
        }}>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
            color: "#fff",
            marginBottom: 12,
          }}>
            Pronto para transformar seu inglês?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.45)", marginBottom: 28, maxWidth: 420, margin: "0 auto 28px" }}>
            Experimente a versão de demonstração e veja como é aprender com a Elie!
          </p>
          <button
            onClick={() => setLocation("/demo")}
            style={{
              background: "var(--imaind-blue)",
              color: "#fff",
              border: "none",
              padding: "14px 32px",
              borderRadius: 12,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 20px rgba(26,111,219,0.3)",
            }}
          >
            <Play size={18} /> Ver Demonstração
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "20px 0",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.15)" }}>
          Powered by ImAInd
        </p>
      </footer>

      <style>{`
        @media (min-width: 1024px) {
          .lg\\:grid-cols-2 { grid-template-columns: 1fr 1fr; }
          .lg\\:block { display: block !important; }
        }
        .hidden { display: none; }
      `}</style>
    </div>
  );
}

function ChatBubble({ chunk, meaning, example }: { chunk: string; meaning: string; example: string }) {
  return (
    <div style={{
      padding: "14px 16px",
      borderRadius: 14,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      <p style={{
        fontWeight: 700,
        color: "var(--imaind-blue-light)",
        fontSize: "0.9rem",
        margin: "0 0 3px",
      }}>
        "{chunk}"
      </p>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", margin: "0 0 6px" }}>
        = {meaning}
      </p>
      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", fontStyle: "italic", margin: 0 }}>
        "{example}"
      </p>
    </div>
  );
}
