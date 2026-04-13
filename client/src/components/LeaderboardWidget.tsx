/**
 * LeaderboardWidget — Glassmorphism Spatial leaderboard with animated podium
 * Frosted glass cards, glow effects, mesh accents.
 */

import { useEffect, useState } from "react";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface LeaderboardEntry {
  rank: number;
  studentName: string;
  totalPoints: number;
  quizzesCompleted: number;
  lessonsCompleted: number;
}

export function LeaderboardWidget() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [studentRank, setStudentRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: leaderboardData, isLoading: leaderboardLoading } = trpc.quizLeaderboard.getLeaderboard.useQuery(
    undefined,
    { enabled: true }
  );

  const { data: rankData } = trpc.quizLeaderboard.getStudentRank.useQuery(undefined, { enabled: true });

  useEffect(() => {
    if (leaderboardData) {
      setLeaderboard(leaderboardData as LeaderboardEntry[]);
      setIsLoading(false);
    }
  }, [leaderboardData]);

  useEffect(() => {
    if (rankData) {
      setStudentRank(rankData.rank);
    }
  }, [rankData]);

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-slate-300" />;
      case 3: return <Award className="w-5 h-5 text-orange-400" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-white/30 font-bold text-sm">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number): React.CSSProperties => {
    switch (rank) {
      case 1: return { background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.15)" };
      case 2: return { background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.12)" };
      case 3: return { background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.12)" };
      default: return { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" };
    }
  };

  const getAvatarStyle = (rank: number): React.CSSProperties => {
    switch (rank) {
      case 1: return { background: "rgba(234,179,8,0.2)", border: "2px solid rgba(234,179,8,0.5)", color: "#eab308", boxShadow: "0 0 16px rgba(234,179,8,0.2)" };
      case 2: return { background: "rgba(148,163,184,0.15)", border: "2px solid rgba(148,163,184,0.4)", color: "#94a3b8" };
      case 3: return { background: "rgba(249,115,22,0.15)", border: "2px solid rgba(249,115,22,0.4)", color: "#f97316" };
      default: return {};
    }
  };

  const getPodiumStyle = (rank: number): React.CSSProperties => {
    switch (rank) {
      case 1: return { background: "linear-gradient(0deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))", border: "1px solid rgba(234,179,8,0.2)", borderBottom: "none" };
      case 2: return { background: "linear-gradient(0deg, rgba(148,163,184,0.1), rgba(148,163,184,0.03))", border: "1px solid rgba(148,163,184,0.15)", borderBottom: "none" };
      case 3: return { background: "linear-gradient(0deg, rgba(249,115,22,0.1), rgba(249,115,22,0.03))", border: "1px solid rgba(249,115,22,0.15)", borderBottom: "none" };
      default: return {};
    }
  };

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.09)",
      }}>
      {/* Top shine */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(234,179,8,0.15), transparent)" }} />

      {/* Mesh accent */}
      <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(234,179,8,0.08), transparent 70%)" }} />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              <Trophy className="w-5 h-5 text-yellow-400" />
              Ranking
            </h3>
            <p className="text-white/40 text-xs mt-0.5">Top 10 Alunos</p>
          </div>
          {studentRank && (
            <span className="text-xs px-3 py-1 rounded-full font-semibold"
              style={{ background: "rgba(107,63,160,0.15)", color: "#c4a6f0", border: "1px solid rgba(107,63,160,0.25)" }}>
              Você: #{studentRank}
            </span>
          )}
        </div>

        {/* Podium for top 3 */}
        {!isLoading && !leaderboardLoading && leaderboard.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-5 pt-2">
            {/* 2nd place */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
                style={getAvatarStyle(2)}>
                {leaderboard[1]?.studentName?.charAt(0).toUpperCase()}
              </div>
              <div className="h-14 w-16 rounded-t-xl flex flex-col items-center justify-center"
                style={getPodiumStyle(2)}>
                <span className="text-xs text-slate-300 font-bold">{leaderboard[1]?.totalPoints}</span>
                <span className="text-[10px] text-white/30">pts</span>
              </div>
              <span className="text-[10px] text-white/40 text-center max-w-[60px] truncate">{leaderboard[1]?.studentName?.split(" ")[0]}</span>
            </div>
            {/* 1st place */}
            <div className="flex flex-col items-center gap-1.5">
              <Crown size={14} className="text-yellow-400" style={{ filter: "drop-shadow(0 0 6px rgba(234,179,8,0.5))" }} />
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-black"
                style={getAvatarStyle(1)}>
                {leaderboard[0]?.studentName?.charAt(0).toUpperCase()}
              </div>
              <div className="h-20 w-20 rounded-t-xl flex flex-col items-center justify-center"
                style={getPodiumStyle(1)}>
                <span className="text-sm text-yellow-300 font-black">{leaderboard[0]?.totalPoints}</span>
                <span className="text-[10px] text-white/30">pts</span>
              </div>
              <span className="text-[10px] text-yellow-300 font-bold text-center max-w-[70px] truncate">{leaderboard[0]?.studentName?.split(" ")[0]}</span>
            </div>
            {/* 3rd place */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
                style={getAvatarStyle(3)}>
                {leaderboard[2]?.studentName?.charAt(0).toUpperCase()}
              </div>
              <div className="h-10 w-16 rounded-t-xl flex flex-col items-center justify-center"
                style={getPodiumStyle(3)}>
                <span className="text-xs text-orange-300 font-bold">{leaderboard[2]?.totalPoints}</span>
                <span className="text-[10px] text-white/30">pts</span>
              </div>
              <span className="text-[10px] text-white/40 text-center max-w-[60px] truncate">{leaderboard[2]?.studentName?.split(" ")[0]}</span>
            </div>
          </div>
        )}

        {/* List */}
        {isLoading || leaderboardLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
            ))}
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {leaderboard.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/5"
                style={getRankStyle(entry.rank)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-6">
                    {getMedalIcon(entry.rank)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm truncate">{entry.studentName}</p>
                    <p className="text-white/30 text-xs">
                      {entry.quizzesCompleted} quiz{entry.quizzesCompleted !== 1 ? "zes" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>{entry.totalPoints}</p>
                  <p className="text-white/30 text-xs">pts</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-white/10" />
            <p className="text-white/40 text-sm">Nenhum resultado ainda</p>
            <p className="text-white/25 text-xs mt-1">Complete quizzes para aparecer no ranking!</p>
          </div>
        )}
      </div>
    </div>
  );
}
