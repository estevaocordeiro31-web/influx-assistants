/**
 * BadgesPage — Glassmorphism Spatial redesign
 *
 * Glass badge cards, animated stamp overlay, influxcoins balance,
 * mesh gradient background, category sections.
 */

import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Award, Star, Trophy, Sparkles, Lock, CheckCircle2,
  Coins, Crown, ChevronLeft, Volume2, Zap,
} from "lucide-react";
import { useLocation } from "wouter";
import { showXPToast } from "@/components/XPToast";

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

// Category colors for glassmorphism
const CATEGORY_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  welcome: { color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
  progress: { color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
  mastery: { color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)" },
  streak: { color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)" },
  social: { color: "#ec4899", bg: "rgba(236,72,153,0.08)", border: "rgba(236,72,153,0.2)" },
};

function getCategoryFromSlug(slug: string): string {
  if (slug.includes("welcome") || slug.includes("first")) return "welcome";
  if (slug.includes("streak")) return "streak";
  if (slug.includes("champion") || slug.includes("master")) return "mastery";
  if (slug.includes("social") || slug.includes("butterfly")) return "social";
  return "progress";
}

// ── Stamp Animation (glassmorphism overlay) ──────────────────────────────────

function StampAnimation({ badge, onComplete }: { badge: any; onComplete: () => void }) {
  const [phase, setPhase] = useState<"entering" | "stamping" | "done">("entering");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("stamping"), 300);
    const t2 = setTimeout(() => setPhase("done"), 1200);
    const t3 = setTimeout(onComplete, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  // Trigger XP toast when done
  useEffect(() => {
    if (phase === "done" && badge?.influxcoinsReward > 0) {
      showXPToast({ coins: badge.influxcoinsReward, reason: badge.name });
    }
  }, [phase, badge]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(4,4,12,0.85)", backdropFilter: "blur(12px)" }}>
      <div className="text-center">
        {/* Elie message */}
        <div className={`mb-6 transition-all duration-500 ${phase === "entering" ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`}>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(107,63,160,0.3), rgba(46,139,122,0.2))",
              border: "1px solid rgba(107,63,160,0.3)",
              backdropFilter: "blur(16px)",
            }}>
            <span className="text-xl">🌌</span>
            <p className="text-white text-lg font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>
              Amazing! New badge unlocked!
            </p>
          </div>
        </div>

        {/* Badge stamp */}
        <div className={`relative transition-all duration-300 ${
          phase === "entering" ? "scale-[3] opacity-0" :
          phase === "stamping" ? "scale-100 opacity-100" :
          "scale-100 opacity-100"
        }`}>
          <div className={`w-36 h-36 rounded-full flex items-center justify-center mx-auto
            ${phase === "stamping" ? "animate-bounce" : ""}`}
            style={{
              background: "linear-gradient(135deg, #eab308, #f97316)",
              boxShadow: "0 0 40px rgba(234,179,8,0.4), 0 0 80px rgba(234,179,8,0.15)",
              border: "3px solid rgba(255,255,255,0.2)",
            }}>
            <div className="text-center text-white">
              {BADGE_ICONS[badge?.slug] || <Award className="w-12 h-12 mx-auto" />}
              <p className="text-xs font-bold mt-1 px-2 leading-tight">{badge?.name}</p>
            </div>
          </div>

          {/* Glow rings */}
          {phase === "done" && (
            <>
              <div className="absolute inset-0 rounded-full animate-ping"
                style={{ border: "2px solid rgba(234,179,8,0.3)", animationDuration: "1.5s" }} />
              <div className="absolute -inset-4 rounded-full animate-ping"
                style={{ border: "1px solid rgba(234,179,8,0.15)", animationDuration: "2s" }} />
            </>
          )}
        </div>

        {/* Reward */}
        {phase === "done" && badge?.influxcoinsReward > 0 && (
          <div className="mt-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl"
              style={{
                background: "rgba(234,179,8,0.15)",
                border: "1px solid rgba(234,179,8,0.25)",
              }}>
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300 font-extrabold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>
                +{badge.influxcoinsReward}
              </span>
              <span className="text-white/40 text-sm">influxcoins</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Badge Card (glass) ───────────────────────────────────────────────────────

function BadgeCard({ badge }: { badge: any }) {
  const category = getCategoryFromSlug(badge.slug);
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.progress;

  return (
    <div className={`relative transition-all duration-300 ${
      badge.earned ? "hover:scale-[1.03]" : "opacity-50"
    }`}>
      <div className="rounded-2xl p-4 relative overflow-hidden"
        style={{
          background: badge.earned ? colors.bg : "rgba(255,255,255,0.02)",
          border: `1px solid ${badge.earned ? colors.border : "rgba(255,255,255,0.06)"}`,
          backdropFilter: "blur(12px)",
        }}>
        {/* Top shine */}
        {badge.earned && (
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${colors.color}30, transparent)` }} />
        )}

        {/* Badge icon */}
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
          style={badge.earned ? {
            background: `linear-gradient(135deg, ${colors.color}, ${colors.color}99)`,
            boxShadow: `0 4px 16px ${colors.color}30`,
          } : {
            background: "rgba(255,255,255,0.05)",
          }}>
          {badge.earned ? (
            <div className="text-white">
              {BADGE_ICONS[badge.slug] || <Award className="w-7 h-7" />}
            </div>
          ) : (
            <Lock className="w-6 h-6 text-white/20" />
          )}
        </div>

        {/* Name */}
        <h3 className="text-center font-bold text-sm mb-1"
          style={{ color: badge.earned ? colors.color : "rgba(255,255,255,0.3)", fontFamily: "'Syne', sans-serif" }}>
          {badge.name}
        </h3>

        {/* Description */}
        <p className="text-center text-xs text-white/35 mb-2 line-clamp-2">
          {badge.description}
        </p>

        {/* Coins reward */}
        {badge.influxcoinsReward > 0 && (
          <div className="flex items-center justify-center gap-1">
            <Coins className={`w-3.5 h-3.5 ${badge.earned ? "text-yellow-400" : "text-white/15"}`} />
            <span className={`text-xs font-bold ${badge.earned ? "text-yellow-400" : "text-white/15"}`}>
              {badge.influxcoinsReward}
            </span>
          </div>
        )}

        {/* Earned date */}
        {badge.earned && badge.earnedAt && (
          <p className="text-center text-[10px] text-white/20 mt-2">
            {new Date(badge.earnedAt).toLocaleDateString("pt-BR")}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Sidebar Leaderboard (glass) ──────────────────────────────────────────────

function BadgeLeaderboard() {
  const { data: leaderboard, isLoading } = trpc.badges.getLeaderboard.useQuery({ limit: 10 });

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.09)",
      }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(234,179,8,0.15), transparent)" }} />

      <h3 className="text-white font-bold flex items-center gap-2 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
        <Trophy className="w-5 h-5 text-yellow-400" />
        Ranking de Badges
      </h3>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
          ))}
        </div>
      ) : !leaderboard || leaderboard.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-4">Nenhum aluno no ranking ainda</p>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry: any) => (
            <div key={entry.studentId}
              className="flex items-center gap-3 p-2.5 rounded-xl"
              style={{
                background: entry.rank <= 3 ? "rgba(234,179,8,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${entry.rank <= 3 ? "rgba(234,179,8,0.12)" : "rgba(255,255,255,0.05)"}`,
              }}>
              <span className="text-sm font-bold w-6 text-center"
                style={{ color: entry.rank <= 3 ? "#eab308" : "rgba(255,255,255,0.3)" }}>
                {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white/80 font-medium text-sm truncate">{entry.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-white/30">
                  <span><Award className="w-3 h-3 inline" /> {entry.badgeCount}</span>
                  <span><Coins className="w-3 h-3 inline text-yellow-400/60" /> {entry.totalInfluxcoins}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function BadgesPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showStamp, setShowStamp] = useState(false);
  const [stampBadge, setStampBadge] = useState<any>(null);

  const { data: badgeProgress, isLoading: loadingProgress } = trpc.badges.getBadgeProgress.useQuery(
    undefined, { enabled: !!user }
  );
  const { data: unseenBadges } = trpc.badges.getUnseenBadges.useQuery(
    undefined, { enabled: !!user }
  );
  const { data: balance } = trpc.badges.getInfluxcoinsBalance.useQuery(
    undefined, { enabled: !!user }
  );

  const checkBadgesMutation = trpc.badges.checkAndAwardBadges.useMutation({
    onSuccess: (data) => {
      if (data.count > 0) {
        const awardedSlug = data.awarded[0];
        const badge = badgeProgress?.find((b: any) => b.slug === awardedSlug);
        if (badge) { setStampBadge(badge); setShowStamp(true); }
      }
    },
  });
  const markSeenMutation = trpc.badges.markBadgesSeen.useMutation();

  useEffect(() => { if (user) checkBadgesMutation.mutate(); }, [user]);

  useEffect(() => {
    if (unseenBadges && unseenBadges.length > 0 && !showStamp) {
      const first = unseenBadges[0];
      setStampBadge({ ...first.badge });
      setShowStamp(true);
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#04040c" }}>
        <div className="rounded-2xl p-8 text-center max-w-sm"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(16px)" }}>
          <Award className="w-14 h-14 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Selos da Ellie</h2>
          <p className="text-white/40 text-sm mb-6">Faça login para ver seus selos e competir!</p>
          <button onClick={() => setLocation("/login")}
            className="px-6 py-3 rounded-xl text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #6b3fa0, #2e8b7a)" }}>
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: "#04040c", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Stamp overlay */}
      {showStamp && stampBadge && (
        <StampAnimation badge={stampBadge} onComplete={handleStampComplete} />
      )}

      {/* Page mesh gradient */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(107,63,160,0.1), transparent 70%), radial-gradient(ellipse 50% 50% at 70% 70%, rgba(234,179,8,0.06), transparent 70%)",
      }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="px-5 pt-8 pb-6">
          <button onClick={() => setLocation("/student/home")}
            className="flex items-center gap-1 text-white/40 text-sm mb-5 hover:text-white/60 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Dashboard
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                <Award className="w-7 h-7 text-yellow-400" />
                Selos da Ellie
              </h1>
              <p className="text-white/40 text-sm mt-1">Complete atividades para ganhar selos e influxcoins!</p>
            </div>

            {/* Influxcoins balance */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-shrink-0"
              style={{
                background: "rgba(234,179,8,0.08)",
                border: "1px solid rgba(234,179,8,0.2)",
                backdropFilter: "blur(12px)",
              }}>
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300 font-extrabold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>
                {balance?.balance || 0}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/30">{earnedCount} de {totalCount} selos</span>
              <span className="text-xs font-bold" style={{ color: "#c4a6f0" }}>{progressPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${progressPercent}%`,
                  background: "linear-gradient(90deg, #6b3fa0, #2e8b7a)",
                  boxShadow: "0 0 12px rgba(107,63,160,0.4)",
                }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Badges Grid */}
            <div className="lg:col-span-2">
              {loadingProgress ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
                  ))}
                </div>
              ) : (
                <>
                  {/* Earned */}
                  {badgeProgress && badgeProgress.filter((b: any) => b.earned).length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-green-400" /> Conquistados
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {badgeProgress.filter((b: any) => b.earned).map((badge: any) => (
                          <BadgeCard key={badge.id} badge={badge} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Locked */}
                  {badgeProgress && badgeProgress.filter((b: any) => !b.earned).length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold text-white/30 uppercase tracking-wider flex items-center gap-2 mb-3">
                        <Lock className="w-4 h-4" /> Para Desbloquear
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {badgeProgress.filter((b: any) => !b.earned).map((badge: any) => (
                          <BadgeCard key={badge.id} badge={badge} />
                        ))}
                      </div>
                    </div>
                  )}

                  {(!badgeProgress || badgeProgress.length === 0) && (
                    <div className="text-center py-12">
                      <Award className="w-12 h-12 text-white/10 mx-auto mb-3" />
                      <p className="text-white/30">Nenhum selo disponível ainda</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <BadgeLeaderboard />

              {/* How to earn */}
              <div className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}>
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(107,63,160,0.15), transparent)" }} />
                <h3 className="text-white font-bold flex items-center gap-2 mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Como Ganhar
                </h3>
                <div className="space-y-3">
                  {[
                    { num: "1", text: "Faça login para o selo de boas-vindas", color: "#22c55e" },
                    { num: "2", text: "Complete exercícios extras", color: "#3b82f6" },
                    { num: "3", text: "Termine um Book para selo de campeão", color: "#a855f7" },
                    { num: "4", text: "Mantenha streak diário no app", color: "#f97316" },
                  ].map(item => (
                    <div key={item.num} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                        style={{ background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}30` }}>
                        {item.num}
                      </span>
                      <p className="text-white/40 text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
