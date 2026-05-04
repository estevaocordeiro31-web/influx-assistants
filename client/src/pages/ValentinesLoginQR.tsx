import { QRCodeSVG } from "qrcode.react";
import { Heart, LogIn, Smartphone } from "lucide-react";

const LOGIN_URL = "https://influxassist-2anfqga4.manus.space/login";

export default function ValentinesLoginQR() {
  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(160deg, #1a0011 0%, #2d0a1e 30%, #1a0011 60%, #0d0008 100%)",
      }}
    >
      {/* Falling hearts background */}
      <FallingHeartsLogin />

      {/* Ambient glow */}
      <div
        className="fixed top-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(233,30,99,0.12) 0%, transparent 70%)",
          animation: "breatheLogin 6s ease-in-out infinite",
        }}
      />
      <div
        className="fixed bottom-[-150px] right-[-150px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(136,14,79,0.12) 0%, transparent 70%)",
          animation: "breatheLogin 6s 3s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 max-w-md w-full px-5">
        {/* Logo */}
        <div className="text-center mb-6" style={{ animation: "fadeInLogin 0.6s ease both" }}>
          <img
            src="/logo-influx.png"
            alt="inFlux"
            className="h-10 mx-auto mb-3 object-contain"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))" }}
          />
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(233,30,99,0.12)",
              border: "1px solid rgba(233,30,99,0.25)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Heart size={14} className="text-pink-400" fill="currentColor" />
            <span className="text-[0.65rem] font-bold text-pink-300 tracking-widest uppercase">
              Valentine's Day
            </span>
            <Heart size={14} className="text-pink-400" fill="currentColor" />
          </div>
        </div>

        {/* Main Glass Card */}
        <div
          className="rounded-3xl p-7 text-center"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 40px rgba(233,30,99,0.15), 0 20px 60px rgba(0,0,0,0.3)",
            animation: "fadeInLogin 0.7s 0.2s ease both",
          }}
        >
          {/* Icon */}
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{
              background: "linear-gradient(135deg, rgba(233,30,99,0.2), rgba(136,14,79,0.2))",
              border: "1px solid rgba(233,30,99,0.3)",
              animation: "floatLogin 3s ease-in-out infinite",
            }}
          >
            <LogIn size={24} className="text-pink-300" />
          </div>

          <h1
            className="text-xl font-black text-white mb-1"
            style={{
              background: "linear-gradient(90deg, #f48fb1, #fff, #f48fb1)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmerLogin 3s linear infinite",
            }}
          >
            Faça seu Login
          </h1>
          <p className="text-pink-300/60 text-xs mb-5">
            Escaneie o QR Code para entrar e participar da competição
          </p>

          {/* QR Code */}
          <div
            className="inline-block p-4 rounded-2xl mb-4"
            style={{
              background: "white",
              boxShadow: "0 0 30px rgba(233,30,99,0.25), 0 0 60px rgba(233,30,99,0.08)",
              animation: "pulseGlowLogin 4s ease-in-out infinite",
            }}
          >
            <QRCodeSVG
              value={LOGIN_URL}
              size={180}
              level="H"
              bgColor="#ffffff"
              fgColor="#1a0011"
              imageSettings={{
                src: "/logo-influx.png",
                x: undefined,
                y: undefined,
                height: 32,
                width: 32,
                excavate: true,
              }}
            />
          </div>

          {/* Instructions */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Smartphone size={14} className="text-pink-400/60" />
            <p className="text-pink-300/50 text-[0.6rem]">
              Aponte a câmera do celular para o QR Code
            </p>
          </div>

          {/* Steps */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex flex-col gap-3">
              {[
                { step: "1", text: "Escaneie o QR Code com seu celular" },
                { step: "2", text: "Faça login com seu email e senha" },
                { step: "3", text: "Volte para a atividade e ganhe pontos!" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                  style={{ animation: `fadeInLogin 0.4s ${0.5 + i * 0.15}s ease both` }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] font-black text-white flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #e91e63, #880E4F)",
                    }}
                  >
                    {item.step}
                  </div>
                  <p className="text-white/60 text-xs text-left">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trophy badge */}
        <div
          className="mt-5 text-center"
          style={{ animation: "fadeInLogin 0.7s 0.8s ease both" }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,215,0,0.06)",
              border: "1px solid rgba(255,215,0,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span className="text-lg">🏆</span>
            <span className="text-amber-200/70 text-xs font-medium">
              Seus pontos contam para o ranking!
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/10 text-[0.5rem] mt-6 tracking-wider">
          powered by inFlux English School
        </p>
      </div>

      <style>{`
        @keyframes breatheLogin {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes fadeInLogin {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatLogin {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes shimmerLogin {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseGlowLogin {
          0%, 100% { box-shadow: 0 0 20px rgba(233,30,99,0.2), 0 0 50px rgba(233,30,99,0.05); }
          50% { box-shadow: 0 0 30px rgba(233,30,99,0.35), 0 0 70px rgba(233,30,99,0.1); }
        }
        @keyframes heartFallLogin {
          0% { transform: translateY(-60px) translateX(0) rotate(0deg) scale(0.5); opacity: 0; }
          5% { opacity: 0.5; }
          50% { transform: translateY(50vh) translateX(var(--sway)) rotate(180deg); }
          95% { opacity: 0.4; }
          100% { transform: translateY(108vh) translateX(0) rotate(360deg) scale(0.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function FallingHeartsLogin() {
  const items = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${10 + Math.random() * 8}s`,
    size: `${0.7 + Math.random() * 1.2}rem`,
    emoji: ["❤️", "💕", "💗", "🩷", "♥️"][Math.floor(Math.random() * 5)],
    sway: 15 + Math.random() * 30,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: h.left,
            top: "-3rem",
            fontSize: h.size,
            animation: `heartFallLogin ${h.duration} ${h.delay} linear infinite`,
            ["--sway" as string]: `${h.sway}px`,
            opacity: 0.4,
          }}
        >
          {h.emoji}
        </div>
      ))}
    </div>
  );
}
