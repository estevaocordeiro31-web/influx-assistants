import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Star,
  Trophy,
  Sparkles,
  Lock,
  CheckCircle2,
  Coins,
  Crown,
  ArrowLeft,
  Volume2,
} from "lucide-react";
import { Link } from "wouter";

// Badge icon mapping
const BADGE_ICONS: Record<string, React.ReactNode> = {
  welcome_explorer: <Star className="w-8 h-8" />,
  first_steps: <CheckCircle2 className="w-8 h-8" />,
  vocabulary_hunter: <Sparkles className="w-8 h-8" />,
  dialogue_master: <Volume2 className="w-8 h-8" />,
  streak_warrior_3: <Trophy className="w-8 h-8" />,
  streak_warrior_7: <Trophy className="w-8 h-8" />,
  book1_champion: <Crown className="w-8 h-8" />,
  book2_champion: <Crown className="w-8 h-8" />,
  exercise_machine_10: <Award className="w-8 h-8" />,
  exercise_machine_25: <Award className="w-8 h-8" />,
  exercise_machine_50: <Award className="w-8 h-8" />,
  social_butterfly: <Star className="w-8 h-8" />,
};

// Badge category colors
const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  welcome: { bg: "bg-emerald-500/20", border: "border-emerald-500", text: "text-emerald-400", glow: "shadow-emerald-500/50" },
  progress: { bg: "bg-blue-500/20", border: "border-blue-500", text: "text-blue-400", glow: "shadow-blue-500/50" },
  mastery: { bg: "bg-purple-500/20", border: "border-purple-500", text: "text-purple-400", glow: "shadow-purple-500/50" },
  streak: { bg: "bg-orange-500/20", border: "border-orange-500", text: "text-orange-400", glow: "shadow-orange-500/50" },
  social: { bg: "bg-pink-500/20", border: "border-pink-500", text: "text-pink-400", glow: "shadow-pink-500/50" },
};

function getCategoryFromSlug(slug: string): string {
  if (slug.includes("welcome") || slug.includes("first")) return "welcome";
  if (slug.includes("streak")) return "streak";
  if (slug.includes("champion") || slug.includes("master")) return "mastery";
  if (slug.includes("social") || slug.includes("butterfly")) return "social";
  return "progress";
}

// Stamp animation component
function StampAnimation({ badge, onComplete }: { badge: any; onComplete: () => void }) {
  const [phase, setPhase] = useState<"entering" | "stamping" | "done">("entering");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("stamping"), 300);
    const t2 = setTimeout(() => setPhase("done"), 1200);
    const t3 = setTimeout(onComplete, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="text-center">
        {/* Ellie message */}
        <div className={`mb-6 transition-all duration-500 ${phase === "entering" ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`}>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl px-6 py-3 inline-block shadow-lg shadow-purple-500/30">
            <p className="text-white text-lg font-semibold">
              🎉 Ellie says: "Amazing job! You earned a new badge!"
            </p>
          </div>
        </div>

        {/* Badge stamp */}
        <div className={`relative transition-all duration-300 ${
          phase === "entering" ? "scale-[3] opacity-0" :
          phase === "stamping" ? "scale-100 opacity-100" :
          "scale-100 opacity-100"
        }`}>
          <div className={`w-40 h-40 rounded-full flex items-center justify-center mx-auto
            ${phase === "stamping" ? "animate-bounce" : ""}
            bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600
            shadow-2xl shadow-amber-500/50 border-4 border-yellow-300`}>
            <div className="text-center">
              <div className="text-white mb-1">
                {BADGE_ICONS[badge?.slug] || <Award className="w-12 h-12 mx-auto" />}
              </div>
              <p className="text-white text-xs font-bold px-2 leading-tight">
                {badge?.name}
              </p>
            </div>
          </div>

          {/* Sparkle effects */}
          {phase === "done" && (
            <>
              <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 animate-ping" />
              <Sparkles className="absolute -top-2 -right-6 w-6 h-6 text-amber-400 animate-ping" style={{ animationDelay: "0.2s" }} />
              <Sparkles className="absolute -bottom-4 left-2 w-7 h-7 text-orange-400 animate-ping" style={{ animationDelay: "0.4s" }} />
              <Star className="absolute -bottom-2 -right-4 w-6 h-6 text-yellow-300 animate-ping" style={{ animationDelay: "0.3s" }} />
            </>
          )}
        </div>

        {/* Influxcoins reward */}
        {phase === "done" && badge?.influxcoinsReward > 0 && (
          <div className="mt-6 animate-fade-in">
            <div className="bg-gradient-to-r from-amber-600 to-yellow-500 rounded-xl px-6 py-3 inline-flex items-center gap-2 shadow-lg">
              <Coins className="w-6 h-6 text-white" />
              <span className="text-white font-bold text-xl">+{badge.influxcoinsReward}</span>
              <span className="text-white/80 text-sm">influxcoins</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual badge card
function BadgeCard({ badge }: { badge: any }) {
  const category = getCategoryFromSlug(badge.slug);
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.progress;

  return (
    <div className={`relative group transition-all duration-300 ${
      badge.earned ? "hover:scale-105" : "opacity-60 hover:opacity-80"
    }`}>
      <div className={`rounded-2xl p-4 border-2 ${
        badge.earned
          ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
          : "bg-gray-800/50 border-gray-700"
      }`}>
        {/* Badge icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
          badge.earned
            ? "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 shadow-md"
            : "bg-gray-700"
        }`}>
          {badge.earned ? (
            <div className="text-white">
              {BADGE_ICONS[badge.slug] || <Award className="w-8 h-8" />}
            </div>
          ) : (
            <Lock className="w-8 h-8 text-gray-500" />
          )}
        </div>

        {/* Badge name */}
        <h3 className={`text-center font-bold text-sm mb-1 ${
          badge.earned ? colors.text : "text-gray-500"
        }`}>
          {badge.name}
        </h3>

        {/* Badge description */}
        <p className="text-center text-xs text-gray-400 mb-2 line-clamp-2">
          {badge.description}
        </p>

        {/* Influxcoins reward */}
        {badge.influxcoinsReward > 0 && (
          <div className="flex items-center justify-center gap-1">
            <Coins className={`w-4 h-4 ${badge.earned ? "text-amber-400" : "text-gray-600"}`} />
            <span className={`text-xs font-semibold ${badge.earned ? "text-amber-400" : "text-gray-600"}`}>
              {badge.influxcoinsReward}
            </span>
          </div>
        )}

        {/* Earned date */}
        {badge.earned && badge.earnedAt && (
          <p className="text-center text-xs text-gray-500 mt-2">
            {new Date(badge.earnedAt).toLocaleDateString("pt-BR")}
          </p>
        )}
      </div>
    </div>
  );
}

// Leaderboard component
function Leaderboard() {
  const { data: leaderboard, isLoading } = trpc.badges.getLeaderboard.useQuery({ limit: 10 });

  if (isLoading) {
    return (
      <Card className="bg-gray-900/80 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <Card className="bg-gray-900/80 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-4">
            Nenhum aluno no ranking ainda. Seja o primeiro!
          </p>
        </CardContent>
      </Card>
    );
  }

  const rankColors = ["text-yellow-400", "text-gray-300", "text-amber-600"];

  return (
    <Card className="bg-gray-900/80 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Ranking de Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.map((entry: any) => (
            <div
              key={entry.studentId}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                entry.rank <= 3 ? "bg-gray-800/80" : "bg-gray-800/40"
              }`}
            >
              <span className={`font-bold text-lg w-8 text-center ${
                rankColors[entry.rank - 1] || "text-gray-400"
              }`}>
                {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{entry.name}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" /> {entry.badgeCount} badges
                  </span>
                  <span className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-400" /> {entry.totalInfluxcoins}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function BadgesPage() {
  const { user } = useAuth();
  const [showStamp, setShowStamp] = useState(false);
  const [stampBadge, setStampBadge] = useState<any>(null);

  const { data: badgeProgress, isLoading: loadingProgress } = trpc.badges.getBadgeProgress.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: unseenBadges } = trpc.badges.getUnseenBadges.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: balance } = trpc.badges.getInfluxcoinsBalance.useQuery(
    undefined,
    { enabled: !!user }
  );

  const checkBadgesMutation = trpc.badges.checkAndAwardBadges.useMutation({
    onSuccess: (data) => {
      if (data.count > 0) {
        // Trigger stamp animation for first awarded badge
        const awardedSlug = data.awarded[0];
        const badge = badgeProgress?.find((b: any) => b.slug === awardedSlug);
        if (badge) {
          setStampBadge(badge);
          setShowStamp(true);
        }
      }
    },
  });

  const markSeenMutation = trpc.badges.markBadgesSeen.useMutation();

  // Check for new badges on mount
  useEffect(() => {
    if (user) {
      checkBadgesMutation.mutate();
    }
  }, [user]);

  // Show stamp animation for unseen badges
  useEffect(() => {
    if (unseenBadges && unseenBadges.length > 0 && !showStamp) {
      const firstUnseen = unseenBadges[0];
      setStampBadge({
        ...firstUnseen.badge,
        slug: firstUnseen.badge.slug,
        name: firstUnseen.badge.name,
        influxcoinsReward: firstUnseen.badge.influxcoinsReward,
      });
      setShowStamp(true);
      // Mark as seen
      markSeenMutation.mutate({ badgeIds: unseenBadges.map((b: any) => b.id) });
    }
  }, [unseenBadges]);

  const handleStampComplete = useCallback(() => {
    setShowStamp(false);
    setStampBadge(null);
  }, []);

  const earnedCount = badgeProgress?.filter((b: any) => b.earned).length || 0;
  const totalCount = badgeProgress?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center p-4">
        <Card className="bg-gray-900/80 border-gray-700 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Award className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Selos da Ellie</h2>
            <p className="text-gray-400 mb-6">
              Faça login para ver seus selos conquistados e competir no ranking!
            </p>
            <Link href="/login">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Fazer Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      {/* Stamp Animation Overlay */}
      {showStamp && stampBadge && (
        <StampAnimation badge={stampBadge} onComplete={handleStampComplete} />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-b border-purple-700/50">
        <div className="container max-w-6xl py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/student/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-400" />
                Selos da Ellie
              </h1>
              <p className="text-gray-300 mt-1">
                Complete atividades para ganhar selos e influxcoins!
              </p>
            </div>

            {/* Influxcoins balance */}
            <div className="bg-gradient-to-r from-amber-600/30 to-yellow-600/30 border border-amber-500/50 rounded-xl px-6 py-3 flex items-center gap-3">
              <Coins className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-amber-400 font-bold text-2xl">{balance?.balance || 0}</p>
                <p className="text-amber-300/70 text-xs">influxcoins</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">
                {earnedCount} de {totalCount} selos conquistados
              </span>
              <span className="text-sm text-purple-300 font-semibold">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-3 bg-gray-800" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-6xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Badges Grid */}
          <div className="lg:col-span-2">
            {loadingProgress ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-48 bg-gray-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* Earned badges first */}
                {badgeProgress && badgeProgress.filter((b: any) => b.earned).length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Selos Conquistados
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {badgeProgress
                        .filter((b: any) => b.earned)
                        .map((badge: any) => (
                          <BadgeCard key={badge.id} badge={badge} />
                        ))}
                    </div>
                  </div>
                )}

                {/* Locked badges */}
                {badgeProgress && badgeProgress.filter((b: any) => !b.earned).length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-400 mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Selos para Desbloquear
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {badgeProgress
                        .filter((b: any) => !b.earned)
                        .map((badge: any) => (
                          <BadgeCard key={badge.id} badge={badge} />
                        ))}
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {(!badgeProgress || badgeProgress.length === 0) && (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">
                      Nenhum selo disponível ainda
                    </h3>
                    <p className="text-gray-500">
                      Em breve novos selos serão adicionados!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar - Leaderboard */}
          <div className="space-y-6">
            <Leaderboard />

            {/* How to earn badges */}
            <Card className="bg-gray-900/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Como Ganhar Selos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shrink-0">1</Badge>
                  <p className="text-gray-300 text-sm">Faça login no app para ganhar o selo de boas-vindas</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 shrink-0">2</Badge>
                  <p className="text-gray-300 text-sm">Complete exercícios extras para desbloquear selos de progresso</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 shrink-0">3</Badge>
                  <p className="text-gray-300 text-sm">Termine todos os exercícios de um Book para ganhar o selo de campeão</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 shrink-0">4</Badge>
                  <p className="text-gray-300 text-sm">Mantenha uma sequência de dias acessando o app</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
