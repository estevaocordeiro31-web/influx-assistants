import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
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

  // Buscar leaderboard
  const { data: leaderboardData, isLoading: leaderboardLoading } = trpc.quizLeaderboard.getLeaderboard.useQuery(
    undefined,
    { enabled: true }
  );

  // Buscar ranking do aluno atual
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
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-300" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-slate-400 font-bold text-sm">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-slate-400/20 to-slate-500/20 border-slate-400/30";
      case 3:
        return "bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30";
      default:
        return "bg-slate-800/30 border-slate-700/50";
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Ranking
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              Top 10 Alunos
            </CardDescription>
          </div>
          {studentRank && (
            <Badge variant="outline" className="bg-green-500/20 border-green-500/50 text-green-400">
              Você: #{studentRank}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading || leaderboardLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-700/30 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {leaderboard.map((entry, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:bg-slate-700/40 ${getRankColor(entry.rank)}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-6">
                    {getMedalIcon(entry.rank)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm truncate">{entry.studentName}</p>
                    <p className="text-slate-400 text-xs">
                      {entry.quizzesCompleted} quiz{entry.quizzesCompleted !== 1 ? "zes" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm sm:text-base">
                    {entry.totalPoints}
                  </p>
                  <p className="text-slate-400 text-xs">pontos</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">Nenhum resultado ainda</p>
            <p className="text-slate-500 text-xs mt-1">Complete quizzes para aparecer no ranking!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
