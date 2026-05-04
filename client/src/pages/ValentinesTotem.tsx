import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Heart, Utensils, Star, Music, Ticket, Clock, ChevronDown, Trophy } from "lucide-react";
import { CHARACTER_IMAGES, HERO_BANNER, CHARACTER_INFO, CHARACTER_COLORS } from "@/data/valentines/chunks";

const ACTIVITY_URL = "https://influxassist-2anfqga4.manus.space/events/valentines";

// ─── Falling Hearts ──────────────────────────────────────────────────────────
function FallingHearts() {
  const items = useRef(
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${3 + Math.random() * 94}%`,
      delay: `${Math.random() * 12}s`,
      duration: `${8 + Math.random() * 8}s`,
      size: `${0.9 + Math.random() * 1.6}rem`,
      emoji: ["❤️", "💕", "💗", "🩷", "♥️", "💖"][Math.floor(Math.random() * 6)],
      sway: 20 + Math.random() * 40,
    }))
  ).current;

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
            animation: `heartFall ${h.duration} ${h.delay} linear infinite`,
            ["--sway" as string]: `${h.sway}px`,
          }}
        >
          {h.emoji}
        </div>
      ))}
      <style>{`
        @keyframes heartFall {
          0%   { transform: translateY(-60px) translateX(0) rotate(0deg) scale(0.6); opacity: 0; }
          5%   { opacity: 0.8; scale: 1; }
          25%  { transform: translateY(25vh) translateX(var(--sway)) rotate(90deg); }
          50%  { transform: translateY(50vh) translateX(calc(var(--sway) * -0.5)) rotate(180deg); }
          75%  { transform: translateY(75vh) translateX(var(--sway)) rotate(270deg); }
          95%  { opacity: 0.7; }
          100% { transform: translateY(108vh) translateX(0) rotate(360deg) scale(0.4); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(233,30,99,0.3), 0 0 60px rgba(233,30,99,0.1); }
          50%      { box-shadow: 0 0 30px rgba(233,30,99,0.5), 0 0 80px rgba(233,30,99,0.2); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes borderPulse {
          0%, 100% { border-color: rgba(233,30,99,0.3); }
          50%      { border-color: rgba(233,30,99,0.6); }
        }
        @keyframes rotateHeart {
          0%   { transform: rotate(0deg) scale(1); }
          25%  { transform: rotate(5deg) scale(1.05); }
          50%  { transform: rotate(0deg) scale(1); }
          75%  { transform: rotate(-5deg) scale(1.05); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-60px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

// ─── Glass Card ──────────────────────────────────────────────────────────────
function GlassCard({
  children,
  className = "",
  delay = 0,
  glow = false,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  glow?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-3xl border ${className}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "rgba(255,255,255,0.08)",
        animation: `fadeSlideUp 0.7s ${delay}s cubic-bezier(0.16,1,0.3,1) both${glow ? ", pulseGlow 4s ease-in-out infinite" : ""}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Character Card ──────────────────────────────────────────────────────────
function CharacterCard({
  character,
  delay,
}: {
  character: "lucas" | "emily" | "aiko";
  delay: number;
}) {
  const info = CHARACTER_INFO[character];
  const color = CHARACTER_COLORS[character];
  const img = CHARACTER_IMAGES[character].adult;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      style={{
        animation: `fadeSlideUp 0.6s ${delay}s cubic-bezier(0.16,1,0.3,1) both`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: 110,
          height: 140,
          border: `3px solid ${hovered ? color : `${color}66`}`,
          boxShadow: hovered
            ? `0 0 30px ${color}55, 0 8px 32px rgba(0,0,0,0.4)`
            : `0 4px 20px rgba(0,0,0,0.3)`,
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          transform: hovered ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
        }}
      >
        <img
          src={img}
          alt={info.name}
          className="w-full h-full object-cover object-top"
          style={{
            transition: "transform 0.5s ease",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${color}dd 0%, ${color}44 30%, transparent 60%)`,
            opacity: hovered ? 1 : 0.7,
            transition: "opacity 0.4s ease",
          }}
        />
        {/* Name badge */}
        <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
          <div className="text-white font-black text-sm leading-tight">
            {info.name}
          </div>
          <div className="text-white/80 text-[0.6rem] font-medium">
            {info.roleEmoji} {info.role}
          </div>
          {hovered && (
            <div
              className="text-white/60 text-[0.55rem] italic mt-0.5"
              style={{ animation: "fadeSlideUp 0.3s ease both" }}
            >
              "{info.catchphrase}"
            </div>
          )}
        </div>
      </div>
      {/* Flag + city */}
      <div className="mt-2 text-center">
        <span className="text-lg">{info.flag}</span>
        <p className="text-white/50 text-[0.6rem] font-medium">{info.cityEn}</p>
      </div>
    </div>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────────────────
function CountdownTimer() {
  const targetDate = new Date('2026-06-12T19:00:00-03:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetDate - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: 'Dias' },
    { value: timeLeft.hours, label: 'Horas' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Seg' },
  ];

  return (
    <GlassCard
      className="mt-8 p-5 text-center"
      delay={1.15}
      style={{
        background: "linear-gradient(135deg, rgba(233,30,99,0.08), rgba(136,14,79,0.05))",
        borderColor: "rgba(233,30,99,0.2)",
      }}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock size={16} className="text-pink-400" />
        <span className="text-pink-300 text-xs font-bold uppercase tracking-widest">
          Contagem Regressiva
        </span>
      </div>
      <div className="flex justify-center gap-3">
        {units.map((u, i) => (
          <div key={i} className="text-center">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(233,30,99,0.12)",
                border: "1px solid rgba(233,30,99,0.25)",
                boxShadow: "0 0 15px rgba(233,30,99,0.1)",
              }}
            >
              <span className="text-white font-black text-xl tabular-nums">
                {String(u.value).padStart(2, '0')}
              </span>
            </div>
            <p className="text-pink-300/50 text-[0.55rem] font-semibold mt-1.5 uppercase">
              {u.label}
            </p>
          </div>
        ))}
      </div>
      <p className="text-pink-300/40 text-[0.6rem] mt-3">
        12 de Junho de 2026 • 19h
      </p>
    </GlassCard>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────────────────
export default function ValentinesTotem() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #1a0011 0%, #2d0a1e 30%, #1a0011 60%, #0d0008 100%)",
      }}
    >
      <FallingHearts />

      {/* Ambient glow orbs */}
      <div
        className="fixed top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(233,30,99,0.15) 0%, transparent 70%)",
          animation: "breathe 6s ease-in-out infinite",
        }}
      />
      <div
        className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(136,14,79,0.15) 0%, transparent 70%)",
          animation: "breathe 6s 3s ease-in-out infinite",
        }}
      />
      <div
        className="fixed top-[30%] right-[-100px] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,111,0,0.08) 0%, transparent 70%)",
          animation: "breathe 8s 1.5s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-5 pb-10">

        {/* ── HEADER ── */}
        <div
          className="text-center pt-10 pb-2"
          style={{ animation: "fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <img
            src="/logo-influx.png"
            alt="inFlux"
            className="h-10 mx-auto mb-4 object-contain"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))" }}
          />
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
            style={{
              background: "rgba(233,30,99,0.12)",
              border: "1px solid rgba(233,30,99,0.25)",
              backdropFilter: "blur(10px)",
              animation: "borderPulse 3s ease-in-out infinite",
            }}
          >
            <Heart
              size={16}
              className="text-pink-400"
              style={{ animation: "rotateHeart 2s ease-in-out infinite" }}
              fill="currentColor"
            />
            <span className="text-xs font-bold text-pink-300 tracking-widest uppercase">
              Valentine's Day Special
            </span>
            <Heart
              size={16}
              className="text-pink-400"
              style={{ animation: "rotateHeart 2s 0.5s ease-in-out infinite" }}
              fill="currentColor"
            />
          </div>
        </div>

        {/* ── HERO BANNER ── */}
        <GlassCard className="mt-6 overflow-hidden p-0" delay={0.15}>
          <div className="relative" style={{ height: 220 }}>
            <img
              src={HERO_BANNER}
              alt="Valentine's Restaurant"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(26,0,17,0.95) 0%, rgba(26,0,17,0.4) 40%, transparent 70%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h1
                className="text-3xl font-black text-white leading-tight"
                style={{
                  textShadow: "0 2px 20px rgba(233,30,99,0.5), 0 0 40px rgba(0,0,0,0.5)",
                  animation: "slideInLeft 0.7s 0.3s cubic-bezier(0.16,1,0.3,1) both",
                }}
              >
                inFlux Restaurant
              </h1>
              <p
                className="text-pink-300 text-sm font-semibold mt-1"
                style={{
                  animation: "slideInLeft 0.7s 0.45s cubic-bezier(0.16,1,0.3,1) both",
                }}
              >
                Valentine's Day Edition — 12 de Junho
              </p>
            </div>
          </div>
        </GlassCard>

        {/* ── CHARACTERS ── */}
        <div className="flex justify-center gap-5 mt-8">
          <CharacterCard character="lucas" delay={0.5} />
          <CharacterCard character="emily" delay={0.65} />
          <CharacterCard character="aiko" delay={0.8} />
        </div>

        {/* ── DESCRIPTION ── */}
        <GlassCard className="mt-8 p-5" delay={0.9}>
          <p className="text-center text-white font-bold text-sm mb-3">
            Pratique inglês no restaurante!
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { icon: <Utensils size={13} />, label: "Food Challenge com IA", color: "#e53935" },
              { icon: <Star size={13} />, label: "Quiz Cultural", color: "#880E4F" },
              { icon: <Heart size={13} />, label: "Vocabulário Romântico", color: "#FF6F00" },
              { icon: <Music size={13} />, label: "3 Sotaques Nativos", color: "#e91e63" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: `${item.color}18`,
                  border: `1px solid ${item.color}33`,
                  color: `${item.color}cc`,
                  animation: `scaleIn 0.4s ${1 + i * 0.1}s cubic-bezier(0.16,1,0.3,1) both`,
                }}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ── QR CODE ── */}
        <GlassCard className="mt-8 p-7 text-center" delay={1.1} glow>
          <div
            className="inline-flex items-center gap-2 mb-4"
            style={{ animation: "floatUp 3s ease-in-out infinite" }}
          >
            <span className="text-2xl">📱</span>
          </div>
          <h2
            className="text-lg font-black text-white uppercase tracking-wider mb-1"
            style={{
              background: "linear-gradient(90deg, #f48fb1, #fff, #f48fb1)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 3s linear infinite",
            }}
          >
            Escaneie e participe!
          </h2>
          <p className="text-pink-300/60 text-xs mb-5">
            Aponte a câmera do celular para o QR Code
          </p>

          <div
            className="inline-block p-4 rounded-2xl"
            style={{
              background: "white",
              boxShadow: "0 0 40px rgba(233,30,99,0.3), 0 0 80px rgba(233,30,99,0.1)",
              animation: "pulseGlow 4s ease-in-out infinite",
            }}
          >
            <QRCodeSVG
              value="https://influxassist-2anfqga4.manus.space/events/valentines/register"
              size={200}
              level="H"
              bgColor="#ffffff"
              fgColor="#1a0011"
              imageSettings={{
                src: "/logo-influx.png",
                x: undefined,
                y: undefined,
                height: 36,
                width: 36,
                excavate: true,
              }}
            />
          </div>

          <p className="text-pink-300/30 text-[0.55rem] mt-4 break-all">
            {ACTIVITY_URL}
          </p>
        </GlassCard>

        {/* ── COUNTDOWN TIMER ── */}
        <CountdownTimer />

        {/* ── LEADERBOARD LINK ── */}
        <GlassCard className="mt-6 p-4 text-center" delay={1.25}>
          <a
            href="/events/valentines/leaderboard"
            className="flex items-center justify-center gap-3 py-2 group"
          >
            <Trophy size={20} className="text-yellow-400" />
            <span className="text-white font-bold text-sm group-hover:text-yellow-300 transition-colors">
              Ver Ranking ao Vivo
            </span>
            <span className="text-yellow-400/60 text-xs">→</span>
          </a>
        </GlassCard>

        {/* ── COMPETITION ── */}
        <GlassCard
          className="mt-8 p-5 text-center"
          delay={1.3}
          style={{
            background: "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,152,0,0.03))",
            borderColor: "rgba(255,215,0,0.15)",
          }}
        >
          <div style={{ animation: "floatUp 2.5s ease-in-out infinite" }}>
            <span className="text-3xl">🏆</span>
          </div>
          <h3
            className="text-base font-black mt-2 uppercase tracking-wider"
            style={{
              background: "linear-gradient(90deg, #ffd700, #ffaa00, #ffd700)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}
          >
            Competição entre alunos!
          </h3>
          <p className="text-amber-200/60 text-xs mt-2 leading-relaxed max-w-xs mx-auto">
            Complete as missões, ganhe pontos e dispute o ranking com seus colegas!
          </p>
          <div className="flex justify-center gap-4 mt-4">
            {[
              { pts: "120", label: "Chunks" },
              { pts: "100", label: "Quiz" },
              { pts: "80", label: "Vocab" },
              { pts: "60", label: "Facts" },
            ].map((m, i) => (
              <div
                key={i}
                className="text-center"
                style={{ animation: `scaleIn 0.4s ${1.5 + i * 0.1}s cubic-bezier(0.16,1,0.3,1) both` }}
              >
                <div className="text-amber-300 font-black text-sm">{m.pts}</div>
                <div className="text-amber-200/40 text-[0.55rem]">{m.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ── KARAOKE MULTIPLAYER ── */}
        <GlassCard
          className="mt-8 p-5 text-center"
          delay={1.4}
          style={{
            background: "linear-gradient(135deg, rgba(156,39,176,0.08), rgba(233,30,99,0.05))",
            borderColor: "rgba(156,39,176,0.2)",
          }}
          glow
        >
          <div style={{ animation: "floatUp 2.5s ease-in-out infinite" }}>
            <span className="text-3xl">🎤🎤</span>
          </div>
          <h3
            className="text-base font-black mt-2 uppercase tracking-wider"
            style={{
              background: "linear-gradient(90deg, #ff1493, #ff69b4, #ff1493)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}
          >
            Karaoke Multiplayer
          </h3>
          <p className="text-pink-300/60 text-xs mt-2 leading-relaxed max-w-xs mx-auto">
            Desafie um amigo! Competição lado-a-lado com placar ao vivo. Adivinhe as músicas românticas!
          </p>
          <div
            className="inline-block p-4 rounded-2xl mt-4"
            style={{
              background: "white",
              boxShadow: "0 0 40px rgba(156,39,176,0.3), 0 0 80px rgba(156,39,176,0.1)",
              animation: "pulseGlow 4s ease-in-out infinite",
            }}
          >
            <QRCodeSVG
              value="https://influxassist-2anfqga4.manus.space/events/valentines/karaoke-multiplayer"
              size={160}
              level="H"
              bgColor="#ffffff"
              fgColor="#1a0011"
              imageSettings={{
                src: "/logo-influx.png",
                x: undefined,
                y: undefined,
                height: 28,
                width: 28,
                excavate: true,
              }}
            />
          </div>
          <p className="text-purple-300/40 text-[0.55rem] mt-3">600 pontos • Até 8 músicas</p>
        </GlassCard>

        {/* ── CONVITES - EM BREVE ── */}
        <GlassCard
          className="mt-8 overflow-hidden"
          delay={1.5}
          style={{
            borderColor: "rgba(233,30,99,0.15)",
            borderStyle: "dashed",
          }}
        >
          <div className="relative p-6">
            {/* Blur overlay */}
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center"
              style={{
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                background: "rgba(26,0,17,0.4)",
              }}
            >
              <div
                className="px-6 py-4 rounded-2xl text-center"
                style={{
                  background: "rgba(233,30,99,0.15)",
                  border: "1px solid rgba(233,30,99,0.3)",
                  backdropFilter: "blur(10px)",
                  animation: "floatUp 3s ease-in-out infinite",
                }}
              >
                <Clock size={24} className="text-pink-400 mx-auto mb-2" />
                <p className="text-white font-black text-lg">Em breve</p>
                <p className="text-pink-300/60 text-xs mt-1">Fique ligado!</p>
              </div>
            </div>

            {/* Content behind blur */}
            <div className="opacity-40 text-center">
              <Ticket size={36} className="text-pink-500 mx-auto mb-3" />
              <p className="text-white font-black text-lg">
                Valentine's Day Dinner
              </p>
              <p className="text-pink-300 text-sm mt-1 mb-4">
                Garanta seu convite para a noite especial!
              </p>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <p className="text-white/40 text-[0.6rem]">Data</p>
                  <p className="text-white font-bold text-sm">12 de Jun</p>
                </div>
                <div className="text-center">
                  <p className="text-white/40 text-[0.6rem]">Horário</p>
                  <p className="text-white font-bold text-sm">19h</p>
                </div>
                <div className="text-center">
                  <p className="text-white/40 text-[0.6rem]">Convite</p>
                  <p className="text-white font-bold text-sm">R$ --</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* ── SCROLL HINT ── */}
        <div
          className="flex flex-col items-center mt-6"
          style={{ animation: "floatUp 2s ease-in-out infinite" }}
        >
          <ChevronDown size={20} className="text-white/15" />
        </div>

        {/* ── FOOTER ── */}
        <div className="text-center mt-4 pb-6">
          <p className="text-white/15 text-[0.55rem] tracking-wider">
            powered by inFlux English School
          </p>
        </div>

      </div>
    </div>
  );
}
