import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock, Coins } from "lucide-react";
import { VACATION_BADGES } from "@/data/vacation-plus-2-expanded";

interface BadgeDisplayProps {
  completedLessons: number[];
  totalQuizScore?: number;
  audioListened?: number;
  factsRead?: number;
}

export function BadgeDisplay({ 
  completedLessons, 
  totalQuizScore = 0,
  audioListened = 0,
  factsRead = 0,
}: BadgeDisplayProps) {
  
  const isBadgeUnlocked = (badge: typeof VACATION_BADGES[0]) => {
    switch (badge.id) {
      case "vp2-badge-1":
        return completedLessons.includes(1);
      case "vp2-badge-2":
        return completedLessons.includes(2);
      case "vp2-badge-3":
        return completedLessons.includes(3);
      case "vp2-badge-4":
        return completedLessons.includes(4);
      case "vp2-badge-5":
        return completedLessons.includes(5);
      case "vp2-badge-6":
        return completedLessons.includes(6);
      case "vp2-badge-7":
        return completedLessons.includes(7);
      case "vp2-badge-8":
        return completedLessons.includes(8);
      case "vp2-badge-master":
        return completedLessons.length === 8;
      case "vp2-badge-polyglot":
        return totalQuizScore >= 90;
      case "vp2-badge-speaker":
        return audioListened >= 24; // 3 personagens x 8 lições
      case "vp2-badge-curious":
        return factsRead >= 24; // 3 fatos x 8 lições
      default:
        return false;
    }
  };

  const unlockedBadges = VACATION_BADGES.filter(isBadgeUnlocked);
  const lockedBadges = VACATION_BADGES.filter(b => !isBadgeUnlocked(b));
  const totalInfluxcoins = unlockedBadges.reduce((sum, b) => sum + b.influxcoins, 0);

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Suas Conquistas
          </CardTitle>
          <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black">
            <Coins className="h-3 w-3 mr-1" />
            {totalInfluxcoins} influxcoins
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          {unlockedBadges.length} de {VACATION_BADGES.length} badges conquistados
        </p>
      </CardHeader>
      <CardContent>
        {/* Badges Desbloqueados */}
        {unlockedBadges.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-green-400 mb-2">✨ Conquistados</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {unlockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`relative p-3 rounded-xl bg-gradient-to-br ${badge.color} flex flex-col items-center justify-center text-center transition-all hover:scale-105 cursor-pointer group`}
                  title={badge.description}
                >
                  <span className="text-2xl mb-1">{badge.icon}</span>
                  <span className="text-xs font-medium text-white leading-tight">
                    {badge.name}
                  </span>
                  <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    +{badge.influxcoins}
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-48">
                    <p className="text-xs text-slate-300">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges Bloqueados */}
        {lockedBadges.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">🔒 A Conquistar</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="relative p-3 rounded-xl bg-slate-700/50 border border-slate-600 flex flex-col items-center justify-center text-center opacity-60 cursor-not-allowed group"
                  title={badge.requirement}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-slate-500" />
                  </div>
                  <span className="text-2xl mb-1 blur-sm">{badge.icon}</span>
                  <span className="text-xs font-medium text-slate-400 leading-tight blur-sm">
                    {badge.name}
                  </span>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-48">
                    <p className="text-xs text-yellow-400 font-medium mb-1">Como desbloquear:</p>
                    <p className="text-xs text-slate-300">{badge.requirement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
