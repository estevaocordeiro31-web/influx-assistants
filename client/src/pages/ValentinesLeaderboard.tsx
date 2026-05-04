import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Trophy, Medal, Crown, Flame, Star, Users } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

type LeaderboardEntry = {
  rank: number;
  name: string;
  totalPoints: number;
  missionsCompleted: Record<string, boolean>;
  isGuest: boolean;
};

const EVENT_ID = "valentines-2026";

export default function ValentinesLeaderboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [showPodium, setShowPodium] = useState(false);
  const [showRest, setShowRest] = useState(false);

  const { data: rawLeaderboard, isLoading } = trpc.culturalEvents.getLeaderboard.useQuery(
    { eventId: EVENT_ID, limit: 50 }
  );
  const leaderboard = rawLeaderboard as LeaderboardEntry[] | undefined;

  useEffect(() => {
    if (!leaderboard) return;
    setTimeout(() => setShowPodium(true), 300);
    setTimeout(() => setShowRest(true), 800);
  }, [leaderboard]);

  const top3 = leaderboard ? leaderboard.slice(0, 3) : [];
  const rest = leaderboard ? leaderboard.slice(3) : [];

  // Find current user rank
  const myName = user?.name || "";
  const myRank = leaderboard ? leaderboard.findIndex(p => p.name === myName) + 1 : 0;

  // Stats
  const totalParticipants = leaderboard?.length ?? 0;
  const totalPoints = leaderboard?.reduce((s, p) => s + p.totalPoints, 0) ?? 0;
  const totalMissions = leaderboard?.reduce((s, p) => s + Object.values(p.missionsCompleted).filter(Boolean).length, 0) ?? 0;

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumHeights = ["h-24", "h-32", "h-20"];
  const podiumColors = [
    "bg-gradient-to-t from-gray-400 to-gray-300",
    "bg-gradient-to-t from-yellow-500 to-yellow-300",
    "bg-gradient-to-t from-amber-700 to-amber-500",
  ];
  const medals = ["🥈", "🥇", "🥉"];
  const positions = ["2", "1", "3"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a1e] via-[#2d0a2e] to-[#0f0515] relative overflow-hidden">
      {/* Animated hearts background */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
          50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.6); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes podiumGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes crownBounce {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-5px) rotate(5deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #ec4899, #f59e0b, #ec4899);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Floating hearts */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="fixed pointer-events-none select-none text-pink-500/20"
          style={{
            left: `${(i * 5.3) % 100}%`,
            fontSize: `${12 + (i % 4) * 6}px`,
            animation: `floatUp ${8 + (i % 5) * 2}s linear infinite`,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          ♥
        </div>
      ))}

      {/* Header */}
      <div className="relative z-10 pt-4 px-4">
        <button
          onClick={() => navigate("/events/valentines")}
          className="flex items-center gap-2 text-pink-300 hover:text-pink-200 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Voltar</span>
        </button>
      </div>

      {/* Title */}
      <div className="relative z-10 text-center pt-6 px-4">
        <div className="text-4xl mb-2">🏆</div>
        <h1 className="text-3xl font-black shimmer-text">
          Valentine's Ranking
        </h1>
        <p className="text-pink-300/80 font-medium text-sm mt-2">
          inFlux Jundiaí • 12 de Junho de 2026
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center mt-20 gap-3">
          <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-pink-300/60 text-sm">Carregando ranking...</p>
        </div>
      )}

      {/* My rank banner */}
      {!isLoading && myRank > 0 && (
        <div className="relative z-10 mx-4 mt-6">
          <div className="bg-pink-500/10 backdrop-blur-md border border-pink-500/30 rounded-2xl p-4 flex items-center gap-3"
            style={{ animation: "pulse-glow 2s ease-in-out infinite" }}>
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
              <Star size={20} className="text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Sua posição</p>
              <p className="text-pink-300 text-xs">Você está em #{myRank} de {totalParticipants}</p>
            </div>
            <div className="text-2xl font-black text-yellow-400">#{myRank}</div>
          </div>
        </div>
      )}

      {/* Podium */}
      {!isLoading && leaderboard && (
        <div
          className={`relative z-10 w-full max-w-sm mx-auto mt-8 px-4 transition-all duration-1000 ${
            showPodium ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-end justify-center gap-3">
            {podiumOrder.map((player, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                {player ? (
                  <>
                    <div className="text-2xl mb-1" style={idx === 1 ? { animation: "crownBounce 2s ease-in-out infinite" } : {}}>
                      {medals[idx]}
                    </div>
                    <div className="text-center mb-2">
                      <p className="text-white font-bold text-xs truncate max-w-[80px]">
                        {player.name}
                      </p>
                      <p className="text-yellow-400 font-black text-lg">{player.totalPoints}</p>
                      <p className="text-pink-300/60 text-[10px]">pts</p>
                    </div>
                    <div
                      className={`w-full ${podiumHeights[idx]} ${podiumColors[idx]} rounded-t-xl flex items-center justify-center shadow-lg`}
                      style={{
                        transformOrigin: "bottom",
                        animation: showPodium ? `podiumGrow 0.6s ease-out forwards` : "none",
                        animationDelay: `${idx * 0.2}s`,
                      }}
                    >
                      <span className="text-white font-black text-2xl drop-shadow-lg">{positions[idx]}</span>
                    </div>
                  </>
                ) : (
                  <div className={`w-full ${podiumHeights[idx]} bg-white/5 rounded-t-xl border border-white/10`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rest of ranking */}
      {!isLoading && showRest && rest.length > 0 && (
        <div className="relative z-10 w-full max-w-sm mx-auto mt-8 px-4 space-y-2 pb-6">
          <h3 className="text-pink-300/50 text-xs font-semibold uppercase tracking-widest text-center mb-3">
            Outros participantes
          </h3>
          {rest.map((player, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
              style={{
                animation: `slideUp 0.4s ease forwards`,
                animationDelay: `${idx * 0.08}s`,
                opacity: 0,
              }}
            >
              <span className="text-pink-300/60 font-bold w-6 text-center text-sm">{idx + 4}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{player.name}</p>
                <p className="text-pink-300/40 text-xs">
                  {Object.values(player.missionsCompleted).filter(Boolean).length} missões
                </p>
              </div>
              <span className="text-yellow-400 font-bold text-sm">{player.totalPoints} pts</span>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && leaderboard && leaderboard.length === 0 && (
        <div className="relative z-10 text-center mt-16 px-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
            <Users size={32} className="text-pink-400" />
          </div>
          <h2 className="text-white font-bold text-lg">Nenhum participante ainda</h2>
          <p className="text-pink-300/60 text-sm mt-2">
            Seja o primeiro a participar! Faça login e complete as missões.
          </p>
          <button
            onClick={() => navigate("/events/valentines")}
            className="mt-6 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-colors"
          >
            Participar agora
          </button>
        </div>
      )}

      {/* Stats */}
      {!isLoading && showRest && leaderboard && leaderboard.length > 0 && (
        <div className="relative z-10 w-full max-w-sm mx-auto mt-4 px-4 pb-10">
          <div className="bg-pink-500/10 backdrop-blur-md border border-pink-500/20 rounded-2xl p-4 text-center">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-black text-white">{totalParticipants}</p>
                <p className="text-[10px] text-pink-300/60 uppercase">Participantes</p>
              </div>
              <div>
                <p className="text-2xl font-black text-yellow-400">{totalMissions}</p>
                <p className="text-[10px] text-pink-300/60 uppercase">Missões</p>
              </div>
              <div>
                <p className="text-2xl font-black text-pink-400">{totalPoints}</p>
                <p className="text-[10px] text-pink-300/60 uppercase">Pontos totais</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
