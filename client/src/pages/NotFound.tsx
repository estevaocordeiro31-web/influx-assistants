import { useLocation } from "wouter";
import { Home, Compass, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(180deg, #06090f 0%, #0c1222 40%, #111827 100%)",
      fontFamily: "'DM Sans', sans-serif",
      padding: 20,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(26,111,219,0.08) 0%, transparent 70%)",
        top: "10%",
        left: "20%",
        filter: "blur(80px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
        bottom: "10%",
        right: "20%",
        filter: "blur(80px)",
        pointerEvents: "none",
      }} />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 2,
          height: 2,
          borderRadius: "50%",
          background: "rgba(77,168,255,0.3)",
          left: `${10 + Math.random() * 80}%`,
          top: `${10 + Math.random() * 80}%`,
          animation: `notfound-float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite alternate`,
          pointerEvents: "none",
        }} />
      ))}

      <div style={{
        textAlign: "center",
        maxWidth: 440,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {/* Elie avatar */}
        <div style={{
          position: "relative",
          width: 120,
          height: 120,
          margin: "0 auto 28px",
        }}>
          <div style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(26,111,219,0.15) 0%, transparent 70%)",
            animation: "notfound-pulse 3s ease-in-out infinite",
          }} />
          <img
            src="/miss-elie-uniform-waving.png"
            alt="Elie"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(255,255,255,0.08)",
              position: "relative",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* 404 number */}
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "5rem",
          lineHeight: 1,
          background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 8,
          letterSpacing: -2,
        }}>
          404
        </h1>

        {/* Elie speech */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 20px",
          borderRadius: 16,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
          marginBottom: 16,
        }}>
          <Compass size={16} style={{ color: "#4da8ff" }} />
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            fontSize: "1rem",
            color: "#fff",
            margin: 0,
          }}>
            Oops! Essa pagina nao existe
          </p>
        </div>

        <p style={{
          color: "rgba(255,255,255,0.35)",
          fontSize: "0.9rem",
          lineHeight: 1.7,
          marginBottom: 32,
        }}>
          A Elie nao encontrou o que voce estava procurando.
          <br />
          Vamos voltar para o inicio?
        </p>

        {/* Action buttons */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
        }}>
          <button
            onClick={() => setLocation("/")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: 14,
              background: "rgba(26,111,219,0.12)",
              border: "1px solid rgba(26,111,219,0.2)",
              color: "#4da8ff",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(26,111,219,0.2)";
              e.currentTarget.style.borderColor = "rgba(26,111,219,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(26,111,219,0.12)";
              e.currentTarget.style.borderColor = "rgba(26,111,219,0.2)";
            }}
          >
            <Home size={16} /> Ir para o Inicio
          </button>

          <button
            onClick={() => window.history.back()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 20px",
              borderRadius: 10,
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
          >
            <ArrowLeft size={14} /> Voltar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes notfound-float {
          from { transform: translateY(0) scale(1); opacity: 0.3; }
          to { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }
        @keyframes notfound-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
