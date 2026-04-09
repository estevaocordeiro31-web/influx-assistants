import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

const EVENT_ID = "stpatricks-2026";
const REFRESH_INTERVAL = 8000; // 8 segundos

const BOOK_COLORS: Record<string, string> = {
  "Book 1": "#22c55e",
  "Book 2": "#3b82f6",
  "Book 3": "#a855f7",
  "Book 4": "#f59e0b",
  "Book 5": "#ef4444",
  "Summit": "#d4af37",
};

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

const SHAMROCKS = ["☘️", "🍀", "☘️", "🍀", "☘️", "🍀", "☘️", "🍀", "☘️", "🍀"];

export default function LeaderboardTV() {
  const [tick, setTick] = useState(0);
  const [prevRanking, setPrevRanking] = useState<string[]>([]);
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());

  const { data: leaderboard, refetch } = trpc.culturalEvents.getLeaderboard.useQuery(
    { eventId: EVENT_ID, limit: 15 },
    { refetchInterval: REFRESH_INTERVAL, staleTime: 0 }
  );

  // Detect rank changes, flash and play celebration sound
  useEffect(() => {
    if (!leaderboard) return;
    const currentIds = leaderboard.map(p => p.name);
    const changed = currentIds.filter((id, i) => prevRanking[i] !== id);
    if (changed.length > 0 && prevRanking.length > 0) {
      setFlashIds(new Set(changed));
      setTimeout(() => setFlashIds(new Set()), 1500);
      // Play fanfare using Web Audio API
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const playNote = (freq: number, start: number, dur: number, vol = 0.25) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(vol, ctx.currentTime + start);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
          osc.start(ctx.currentTime + start);
          osc.stop(ctx.currentTime + start + dur + 0.05);
        };
        // Ascending fanfare: C-E-G-C
        playNote(523, 0, 0.12);
        playNote(659, 0.13, 0.12);
        playNote(784, 0.26, 0.12);
        playNote(1047, 0.39, 0.35, 0.35);
      } catch { /* AudioContext not supported */ }
    }
    setPrevRanking(currentIds);
  }, [leaderboard]);

  // Tick for animated shamrocks
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 600);
    return () => clearInterval(id);
  }, []);

  const topThree = leaderboard?.slice(0, 3) ?? [];
  const rest = leaderboard?.slice(3) ?? [];

  return (
    <div
      className="min-h-screen w-full flex flex-col overflow-hidden select-none"
      style={{
        background: "linear-gradient(160deg, #021a06 0%, #0a2e10 40%, #0d3b14 100%)",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Floating shamrocks background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {SHAMROCKS.map((s, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-10"
            style={{
              left: `${(i * 11 + 5) % 100}%`,
              top: `${(i * 17 + 10) % 90}%`,
              transform: `rotate(${(tick * 3 + i * 36) % 360}deg)`,
              transition: "transform 0.6s linear",
              fontSize: `${2 + (i % 3)}rem`,
            }}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-8 pb-4 px-8">
        <div className="flex items-center justify-center gap-4 mb-1">
          <span className="text-5xl">☘️</span>
          <h1
            className="text-6xl font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #d4af37, #ffd700, #d4af37)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              filter: "drop-shadow(0 0 20px rgba(212,175,55,0.5))",
            }}
          >
            ST. PATRICK'S NIGHT
          </h1>
          <span className="text-5xl">☘️</span>
        </div>
        <p className="text-2xl font-bold text-green-300 tracking-widest uppercase">
          🏆 Live Leaderboard · inFlux Jundiaí
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-sm font-semibold">Atualiza automaticamente</span>
        </div>
      </div>

      {/* Top 3 podium */}
      {topThree.length > 0 && (
        <div className="relative z-10 flex items-end justify-center gap-6 px-8 mb-8 mt-2">
          {/* 2nd place */}
          {topThree[1] && (
            <div
              className="flex flex-col items-center"
              style={{
                transform: flashIds.has(topThree[1].name) ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.3s ease",
              }}
            >
              <div className="text-5xl mb-2">🥈</div>
              <div
                className="rounded-2xl px-6 py-4 text-center"
                style={{
                  background: "rgba(192,192,192,0.15)",
                  border: "2px solid rgba(192,192,192,0.4)",
                  minWidth: "180px",
                  height: "140px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <p className="text-xl font-black text-white truncate">{topThree[1].name}</p>
                <p className="text-3xl font-black text-silver mt-1" style={{ color: "#c0c0c0" }}>
                  {topThree[1].totalPoints}
                </p>
                <p className="text-xs text-gray-400">pontos</p>
              </div>
            </div>
          )}

          {/* 1st place */}
          {topThree[0] && (
            <div
              className="flex flex-col items-center"
              style={{
                transform: flashIds.has(topThree[0].name) ? "scale(1.08)" : "scale(1)",
                transition: "transform 0.3s ease",
              }}
            >
              <div className="text-6xl mb-2">🥇</div>
              <div
                className="rounded-2xl px-8 py-5 text-center"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(255,215,0,0.1))",
                  border: "2px solid rgba(212,175,55,0.6)",
                  minWidth: "220px",
                  height: "170px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "0 0 30px rgba(212,175,55,0.3)",
                }}
              >
                <p className="text-2xl font-black text-white truncate">{topThree[0].name}</p>
                <p className="text-4xl font-black mt-1" style={{ color: "#d4af37" }}>
                  {topThree[0].totalPoints}
                </p>
                <p className="text-sm text-yellow-400">pontos</p>
              </div>
            </div>
          )}

          {/* 3rd place */}
          {topThree[2] && (
            <div
              className="flex flex-col items-center"
              style={{
                transform: flashIds.has(topThree[2].name) ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.3s ease",
              }}
            >
              <div className="text-5xl mb-2">🥉</div>
              <div
                className="rounded-2xl px-6 py-4 text-center"
                style={{
                  background: "rgba(205,127,50,0.15)",
                  border: "2px solid rgba(205,127,50,0.4)",
                  minWidth: "180px",
                  height: "120px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <p className="text-xl font-black text-white truncate">{topThree[2].name}</p>
                <p className="text-3xl font-black mt-1" style={{ color: "#cd7f32" }}>
                  {topThree[2].totalPoints}
                </p>
                <p className="text-xs text-orange-400">pontos</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rest of ranking */}
      {rest.length > 0 && (
        <div className="relative z-10 px-12 pb-8 flex-1">
          <div className="grid grid-cols-2 gap-3 max-w-5xl mx-auto">
            {rest.map((player, i) => (
              <div
                key={player.name}
                className="flex items-center gap-4 rounded-xl px-5 py-3 transition-all duration-500"
                style={{
                  background: flashIds.has(player.name)
                    ? "rgba(64,145,108,0.3)"
                    : "rgba(255,255,255,0.05)",
                  border: flashIds.has(player.name)
                    ? "1.5px solid rgba(64,145,108,0.6)"
                    : "1px solid rgba(255,255,255,0.08)",
                  transform: flashIds.has(player.name) ? "scale(1.02)" : "scale(1)",
                }}
              >
                <span className="text-2xl font-black text-gray-400 w-8 text-center">
                  {i + 4}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-white truncate">{player.name}</p>
                </div>
                <span className="text-xl font-black text-green-400">
                  {player.totalPoints} <span className="text-sm text-gray-400">pts</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!leaderboard || leaderboard.length === 0) && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8">
          <div className="text-8xl mb-6 animate-bounce">☘️</div>
          <h2 className="text-4xl font-black text-white mb-3">Aguardando participantes...</h2>
          <p className="text-xl text-green-300">
            Escaneie o QR Code para entrar na experiência!
          </p>
          <div className="mt-8 text-2xl font-bold text-yellow-400 tracking-widest">
            tutor.imaind.tech/events/welcome-screen
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 text-center pb-4">
        <p className="text-green-700 text-sm font-semibold">
          ☘️ inFlux Jundiaí · 20 de Março de 2026 · Powered by mAInd
        </p>
      </div>
    </div>
  );
}
