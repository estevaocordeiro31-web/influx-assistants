import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, Trophy, Medal, Star, Loader2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];
const MEDAL_ICONS = [Crown, Medal, Medal];

export default function Leaderboard() {
  const [, navigate] = useLocation();
  const eventId = localStorage.getItem("event_id") ?? "";
  const myParticipantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");

  const { data: leaderboard, isLoading } = trpc.culturalEvents.getLeaderboard.useQuery(
    { eventId, limit: 20 },
    { enabled: !!eventId, refetchInterval: 30000 }
  );

  const myRank = leaderboard?.findIndex((p: any) => p.id === myParticipantId);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate("/events/hub")} className="text-gray-400 flex items-center gap-1 text-sm">
            <ChevronLeft size={16} /> Hub
          </button>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-white text-sm font-bold">Ranking</span>
          </div>
          <span className="text-xs text-gray-500">ao vivo</span>
        </div>

        {/* Top 3 podium */}
        {leaderboard && leaderboard.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-4">
            {/* 2nd */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
                style={{ background: "rgba(192,192,192,0.2)", border: "2px solid #C0C0C0", color: "#C0C0C0" }}>
                {leaderboard[1]?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="h-12 w-16 rounded-t-lg flex items-center justify-center"
                style={{ background: "rgba(192,192,192,0.15)", border: "1px solid #C0C0C033" }}>
                <span className="text-xs text-gray-300 font-bold">{leaderboard[1]?.totalPoints}</span>
              </div>
              <span className="text-xs text-gray-400 text-center max-w-[60px] truncate">{leaderboard[1]?.name?.split(' ')[0]}</span>
            </div>
            {/* 1st */}
            <div className="flex flex-col items-center gap-1">
              <Crown size={16} className="text-yellow-400" />
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-black"
                style={{ background: "rgba(255,215,0,0.2)", border: "2px solid #FFD700", color: "#FFD700" }}>
                {leaderboard[0]?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="h-16 w-20 rounded-t-lg flex items-center justify-center"
                style={{ background: "rgba(255,215,0,0.15)", border: "1px solid #FFD70033" }}>
                <span className="text-sm text-yellow-300 font-black">{leaderboard[0]?.totalPoints}</span>
              </div>
              <span className="text-xs text-yellow-300 font-bold text-center max-w-[70px] truncate">{leaderboard[0]?.name?.split(' ')[0]}</span>
            </div>
            {/* 3rd */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
                style={{ background: "rgba(205,127,50,0.2)", border: "2px solid #CD7F32", color: "#CD7F32" }}>
                {leaderboard[2]?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="h-10 w-16 rounded-t-lg flex items-center justify-center"
                style={{ background: "rgba(205,127,50,0.15)", border: "1px solid #CD7F3233" }}>
                <span className="text-xs text-orange-300 font-bold">{leaderboard[2]?.totalPoints}</span>
              </div>
              <span className="text-xs text-gray-400 text-center max-w-[60px] truncate">{leaderboard[2]?.name?.split(' ')[0]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Full list */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={32} className="text-green-400 animate-spin" />
          </div>
        ) : !leaderboard?.length ? (
          <div className="text-center py-10 text-gray-400">
            <Trophy size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum participante ainda</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {leaderboard.map((participant: any, idx: number) => {
              const isMe = participant.id === myParticipantId;
              const isTop3 = idx < 3;
              const medalColor = isTop3 ? MEDAL_COLORS[idx] : undefined;

              return (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: isMe
                      ? "rgba(45,106,79,0.3)"
                      : "rgba(255,255,255,0.04)",
                    border: isMe
                      ? "1px solid #40916c66"
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Rank */}
                  <div className="w-7 text-center">
                    {isTop3 ? (
                      <span className="text-base font-black" style={{ color: medalColor }}>
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 font-bold">#{idx + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{
                      background: isMe ? "rgba(45,106,79,0.5)" : "rgba(255,255,255,0.1)",
                      color: isMe ? "#40916c" : "#9ca3af",
                    }}
                  >
                    {participant.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isMe ? "text-green-300" : "text-white"}`}>
                      {participant.name} {isMe && <span className="text-xs text-green-500">(você)</span>}
                    </p>
                    <p className="text-xs text-gray-500">
                      {participant.missionsCompleted ? Object.values(participant.missionsCompleted as Record<string, boolean>).filter(Boolean).length : 0}/5 missões
                    </p>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className={`text-base font-black ${isTop3 ? "" : "text-white"}`}
                      style={{ color: medalColor || (isMe ? "#40916c" : "white") }}>
                      {participant.totalPoints}
                    </p>
                    <p className="text-xs text-gray-500">pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My position if not in top 20 */}
      {myRank !== undefined && myRank === -1 && (
        <div className="px-4 pb-4 flex-shrink-0">
          <div className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: "rgba(45,106,79,0.2)", border: "1px solid #40916c44" }}>
            <Star size={16} className="text-green-400" />
            <p className="text-sm text-green-300">Você ainda não pontuou — complete as missões!</p>
          </div>
        </div>
      )}

      <div className="px-4 pb-6 flex-shrink-0">
        <Button onClick={() => navigate("/events/hub")} variant="outline"
          className="w-full h-12 rounded-xl border-gray-600 text-gray-300">
          Voltar ao Hub
        </Button>
      </div>
    </div>
  );
}
