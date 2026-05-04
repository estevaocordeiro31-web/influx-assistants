import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";

// Floating shamrock particle
function Shamrock({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute pointer-events-none select-none" style={style}>
      ☘️
    </div>
  );
}

// Particle data
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  animDelay: `${Math.random() * 6}s`,
  animDuration: `${5 + Math.random() * 6}s`,
  size: `${14 + Math.random() * 22}px`,
  opacity: 0.3 + Math.random() * 0.5,
}));

export default function WelcomeScreen() {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<"enter" | "qr" | "pulse">("enter");
  const [glowPulse, setGlowPulse] = useState(false);

  useEffect(() => {
    // Phase 1: entrance animation
    const t1 = setTimeout(() => setPhase("qr"), 800);
    // Phase 2: start pulse loop
    const t2 = setTimeout(() => setPhase("pulse"), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Glow pulse loop
  useEffect(() => {
    if (phase !== "pulse") return;
    const interval = setInterval(() => setGlowPulse(p => !p), 1800);
    return () => clearInterval(interval);
  }, [phase]);

  const qrUrl = `https://tutor.imaind.tech/events`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrUrl)}&bgcolor=0a1f0e&color=40e080&margin=12&qzone=2`;

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-between"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #0d3320 0%, #061409 60%, #020a04 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Animated CSS for particles */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-120px) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 30px #22c55e55, 0 0 60px #16a34a33; }
          50% { box-shadow: 0 0 60px #22c55e99, 0 0 120px #16a34a66, 0 0 180px #15803d33; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scanline {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes borderRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .float-particle { animation: floatUp linear infinite; }
        .fade-in-up { animation: fadeInUp 0.8s ease forwards; }
        .fade-in-down { animation: fadeInDown 0.6s ease forwards; }
        .glow-pulse { animation: glowPulse 2s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #22c55e, #86efac, #fbbf24, #86efac, #22c55e);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .scanline {
          position: absolute;
          left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #22c55e88, transparent);
          animation: scanline 2s linear infinite;
        }
      `}</style>

      {/* Floating shamrock particles */}
      {PARTICLES.map(p => (
        <Shamrock
          key={p.id}
          style={{
            left: p.left,
            bottom: "-40px",
            fontSize: p.size,
            opacity: p.opacity,
            animationName: "floatUp",
            animationDuration: p.animDuration,
            animationDelay: p.animDelay,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        />
      ))}

      {/* Top section */}
      <div className="w-full flex flex-col items-center pt-10 px-6 fade-in-down" style={{ animationDelay: "0.2s", opacity: 0 }}>
        {/* inFlux logo text */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="px-3 py-1 rounded-full text-xs font-black tracking-widest"
            style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #22c55e44", color: "#86efac" }}
          >
            inFlux Jundiaí
          </div>
        </div>

        {/* St. Patrick's Experience */}
        <div className="text-center mb-1">
          <p className="text-green-400 text-sm font-semibold tracking-widest uppercase mb-1" style={{ letterSpacing: "0.25em" }}>
            ☘️ St. Patrick's Experience ☘️
          </p>
          <h1
            className="shimmer-text font-black leading-none"
            style={{ fontSize: "clamp(2rem, 8vw, 3.2rem)", letterSpacing: "-0.02em" }}
          >
            Welcome to
          </h1>
          <h1
            className="shimmer-text font-black leading-none"
            style={{ fontSize: "clamp(2rem, 8vw, 3.2rem)", letterSpacing: "-0.02em" }}
          >
            the future.
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div
              className="px-4 py-1 rounded-full font-black text-black"
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                fontSize: "clamp(1.4rem, 6vw, 2.2rem)",
                letterSpacing: "0.05em",
                boxShadow: "0 0 30px #22c55e66",
              }}
            >
              ImAInd!!
            </div>
          </div>
        </div>
      </div>

      {/* QR Code section */}
      <div className="flex flex-col items-center px-6 fade-in-up" style={{ animationDelay: "0.5s", opacity: 0 }}>
        {/* QR container with glow */}
        <div
          className="relative rounded-3xl p-5 glow-pulse"
          style={{
            background: "linear-gradient(145deg, #0d3320, #061409)",
            border: "2px solid #22c55e44",
          }}
        >
          {/* Rotating border accent */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, #22c55e22, transparent, #fbbf2422, transparent)",
              animation: "borderRotate 8s linear infinite",
            }}
          />

          {/* QR Code */}
          <div className="relative rounded-2xl overflow-hidden" style={{ width: 220, height: 220 }}>
            <img
              src={qrApiUrl}
              alt="QR Code"
              width={220}
              height={220}
              className="rounded-2xl"
              style={{ display: "block" }}
            />
            {/* Scanline effect */}
            <div className="scanline" />
          </div>

          {/* Corner decorations */}
          {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-5 h-5 m-2`}
              style={{
                borderTop: i < 2 ? "3px solid #22c55e" : "none",
                borderBottom: i >= 2 ? "3px solid #22c55e" : "none",
                borderLeft: i % 2 === 0 ? "3px solid #22c55e" : "none",
                borderRight: i % 2 === 1 ? "3px solid #22c55e" : "none",
              }}
            />
          ))}
        </div>

        {/* Scan instruction */}
        <div className="mt-4 text-center">
          <p className="text-green-300 font-bold text-base">📱 Aponte a câmera para entrar</p>
          <p className="text-green-600 text-xs mt-1 font-mono tracking-wider">
            tutor.imaind.tech/events
          </p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="w-full flex flex-col items-center pb-8 px-6 fade-in-up" style={{ animationDelay: "0.9s", opacity: 0 }}>
        {/* Date & time */}
        <div
          className="rounded-2xl px-6 py-3 text-center mb-4"
          style={{ background: "rgba(34,197,94,0.08)", border: "1px solid #22c55e22" }}
        >
          <p className="text-white font-bold text-sm">Sexta-feira, 20 de Março de 2026</p>
          <p className="text-green-400 text-xs">18h30 às 22h00 · inFlux Jundiaí</p>
        </div>

        {/* Tap to enter button */}
        <button
          onClick={() => navigate("/events/register")}
          className="w-full max-w-xs rounded-2xl py-4 font-black text-base text-black transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            boxShadow: "0 0 40px #22c55e55",
            letterSpacing: "0.05em",
          }}
        >
          ☘️ TAP TO ENTER
        </button>

        <p className="text-green-800 text-xs mt-3 text-center">
          Powered by <span className="text-green-600 font-bold">inFlux AITutor</span>
        </p>
      </div>
    </div>
  );
}
