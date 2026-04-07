import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Home, Share2, Loader2 } from "lucide-react";

// Confetti particle
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

type LeaderboardEntry = {
  rank: number;
  name: string;
  totalPoints: number;
  missionsCompleted: Record<string, boolean>;
  isGuest: boolean;
};

const COLORS = ["#FFD700", "#00C851", "#FF6B35", "#4FC3F7", "#CE93D8", "#FFFFFF", "#FF4081"];

function useConfetti(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Spawn particles
    for (let i = 0; i < 200; i++) {
      particlesRef.current.push({
        id: i,
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.y < canvas.height + 20);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (particlesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return canvasRef;
}

export default function ClosingCeremony() {
  const [, navigate] = useLocation();
  const [showPodium, setShowPodium] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const canvasRef = useConfetti(confettiActive);

  const { data: rawLeaderboard, isLoading } = trpc.culturalEvents.getLeaderboard.useQuery(
    { eventId: "stpatricks-2026" },
    { refetchOnWindowFocus: false }
  );

  const leaderboard = rawLeaderboard as LeaderboardEntry[] | undefined;

  useEffect(() => {
    if (!leaderboard) return;
    setTimeout(() => setShowPodium(true), 500);
    setTimeout(() => setConfettiActive(true), 800);
    setTimeout(() => setShowRest(true), 1800);
  }, [leaderboard]);

  const top3: (LeaderboardEntry | undefined)[] = leaderboard ? leaderboard.slice(0, 3) : [];
  const rest: LeaderboardEntry[] = leaderboard ? leaderboard.slice(3) : [];

  // Podium order: 2nd (left), 1st (center), 3rd (right)
  const podiumOrder: (LeaderboardEntry | undefined)[] = [top3[1], top3[0], top3[2]];
  const podiumHeights = ["h-28", "h-40", "h-20"];
  const podiumColors = ["bg-gray-400", "bg-yellow-400", "bg-amber-600"];
  const medals = ["🥈", "🥇", "🥉"];
  const positions = [2, 1, 3];

  const totalMissions = leaderboard
    ? leaderboard.reduce((s, p) => s + Object.values(p.missionsCompleted).filter(Boolean).length, 0)
    : 0;
  const totalPoints = leaderboard
    ? leaderboard.reduce((s, p) => s + p.totalPoints, 0)
    : 0;

  const myName = localStorage.getItem("event_name") ?? "";
  const myRank = leaderboard ? leaderboard.findIndex(p => p.name === myName) + 1 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a2a0a] via-[#0d3d0d] to-[#0a1a0a] flex flex-col items-center justify-start pb-16 relative overflow-hidden">
      {/* Confetti canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* Floating shamrocks */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="fixed text-2xl pointer-events-none select-none opacity-20"
          style={{
            left: `${(i * 8.5) % 100}%`,
            top: `${(i * 13) % 100}%`,
            animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        >
          ☘️
        </div>
      ))}

      {/* Header */}
      <div className="w-full text-center pt-10 px-4">
        <div className="text-5xl mb-2">🏆</div>
        <h1 className="text-3xl font-black text-yellow-400 drop-shadow-lg">
          St. Patrick's Night
        </h1>
        <p className="text-green-300 font-semibold text-lg mt-1">Final Results</p>
        <p className="text-gray-400 text-sm mt-1">inFlux Jundiaí • 20 de Março de 2026</p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center mt-20 gap-3">
          <Loader2 size={40} className="animate-spin text-green-400" />
          <p className="text-gray-400">Calculando resultados finais...</p>
        </div>
      )}

      {!isLoading && leaderboard && (
        <>
          {/* Podium */}
          <div
            className={`w-full max-w-sm mx-auto mt-10 px-4 transition-all duration-1000 ${
              showPodium ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-end justify-center gap-2">
              {podiumOrder.map((player, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  {player ? (
                    <>
                      <div className="text-2xl mb-1">{medals[idx]}</div>
                      <div className="text-center mb-2">
                        <p className="text-white font-bold text-sm truncate max-w-[80px]">
                          {player.name}
                        </p>
                        <p className="text-yellow-400 font-black text-lg">{player.totalPoints}</p>
                        <p className="text-gray-400 text-xs">pts</p>
                      </div>
                      <div
                        className={`w-full ${podiumHeights[idx]} ${podiumColors[idx]} rounded-t-lg flex items-center justify-center`}
                      >
                        <span className="text-white font-black text-2xl">{positions[idx]}</span>
                      </div>
                    </>
                  ) : (
                    <div className={`w-full ${podiumHeights[idx]} bg-gray-700/30 rounded-t-lg`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rest of ranking */}
          {showRest && rest.length > 0 && (
            <div className="w-full max-w-sm mx-auto mt-6 px-4 space-y-2">
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest text-center mb-3">
                Outros participantes
              </h3>
              {rest.map((player, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10"
                  style={{
                    animation: `slideIn 0.4s ease forwards`,
                    animationDelay: `${idx * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  <span className="text-gray-400 font-bold w-6 text-center">{idx + 4}</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{player.name}</p>
                    <p className="text-gray-500 text-xs">
                      {Object.values(player.missionsCompleted).filter(Boolean).length} missões
                    </p>
                  </div>
                  <span className="text-yellow-400 font-bold">{player.totalPoints} pts</span>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {showRest && (
            <div className="w-full max-w-sm mx-auto mt-6 px-4">
              <div className="bg-green-900/30 border border-green-700/40 rounded-2xl p-4 text-center">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-black text-white">{leaderboard.length}</p>
                    <p className="text-xs text-gray-400">Participantes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-yellow-400">{totalMissions}</p>
                    <p className="text-xs text-gray-400">Missões</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-green-400">{totalPoints}</p>
                    <p className="text-xs text-gray-400">Pontos totais</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {showRest && (
            <div className="w-full max-w-sm mx-auto mt-6 px-4 text-center">
              <div className="bg-gradient-to-r from-green-900/40 to-yellow-900/40 border border-yellow-700/30 rounded-2xl p-5">
                <p className="text-yellow-300 font-bold text-lg mb-2">
                  🍀 Sláinte! What a night!
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Você acabou de viver o futuro do aprendizado de inglês.
                  Em breve, o <strong className="text-green-300">inFlux AITutor</strong> estará
                  desbloqueado para você com uma experiência ainda mais incrível!
                </p>
                <p className="text-gray-400 text-xs mt-3 italic">
                  "The craic was mighty!" 🇮🇪
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          {showRest && (
            <div className="w-full max-w-sm mx-auto mt-6 px-4 flex gap-3">
              <button
                onClick={() => navigate("/events")}
                className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                <Home size={18} />
                Hub
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "St. Patrick's Night by inFlux",
                      text: `Participei do St. Patrick's Night da inFlux${myRank > 0 ? ` e fiquei em ${myRank}º lugar` : ""}! 🍀`,
                      url: window.location.origin + "/events/welcome-screen",
                    });
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-xl transition-colors"
              >
                <Share2 size={18} />
                Compartilhar
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
