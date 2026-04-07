import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Users, ArrowRight, Loader2 } from "lucide-react";
import { CHARACTER_IMAGES } from "@/data/stpatricks/chunks";

const MISSIONS = [
  { id: "chunk-lesson", label: "Chunk Lesson", icon: "📚", maxScore: 100 },
  { id: "culture-quiz", label: "Culture Quiz", icon: "🍀", maxScore: 80 },
  { id: "chunk-listening", label: "Chunk Listening", icon: "🎧", maxScore: 100 },
  { id: "speaking-challenge", label: "Speaking Challenge", icon: "🎤", maxScore: 120 },
  { id: "food-challenge", label: "Food Challenge", icon: "🍺", maxScore: 100 },
];

const TOTAL_MAX = MISSIONS.reduce((s, m) => s + m.maxScore, 0);

export default function EventScore() {
  const [, navigate] = useLocation();
  const participantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");
  const guestToken = localStorage.getItem("event_guest_token") ?? undefined;
  const userId = parseInt(localStorage.getItem("event_user_id") ?? "0") || undefined;

  const { data: participant, isLoading } = trpc.culturalEvents.getParticipant.useQuery(
    { eventId: "stpatricks_2026", token: guestToken, userId },
    { enabled: !!(guestToken || userId) }
  );

  const { data: leaderboard } = trpc.culturalEvents.getLeaderboard.useQuery(
    { eventId: "stpatricks_2026", limit: 100 },
    { refetchInterval: 30000 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
        <Loader2 size={32} className="text-yellow-400 animate-spin" />
      </div>
    );
  }

  const totalScore = participant?.totalPoints ?? 0;
  const pct = Math.round((totalScore / TOTAL_MAX) * 100);
  const isGuest = !participant?.userId;

  // Find rank
  const myRank = leaderboard
    ? leaderboard.findIndex((p: any) => p.id === participantId) + 1
    : null;

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getScoreMessage = () => {
    if (pct >= 90) return { title: "Incrível! Você é um expert em cultura irlandesa! 🏆", color: "#f4a923" };
    if (pct >= 70) return { title: "Muito bem! Você dominou os chunks do St. Patrick's! 🎉", color: "#40916c" };
    if (pct >= 50) return { title: "Bom trabalho! Continue praticando seu inglês! 🍀", color: "#7b2d8b" };
    return { title: "Boa tentativa! O inglês melhora com prática! 📚", color: "#e53935" };
  };

  const msg = getScoreMessage();

  return (
    <div className="min-h-screen flex flex-col pb-10"
      style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>

      {/* Hero */}
      <div className="flex flex-col items-center pt-10 pb-6 px-6 text-center">
        <div className="text-6xl mb-3">🍀</div>
        <h1 className="text-2xl font-black text-white mb-1">St. Patrick's Night</h1>
        <p className="text-gray-400 text-sm mb-6">Resultado Final</p>

        {/* Score circle */}
        <div className="relative w-36 h-36 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={msg.color}
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - pct / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white">{pct}%</span>
            <span className="text-xs text-gray-400">{totalScore}/{TOTAL_MAX} pts</span>
          </div>
        </div>

        <p className="text-sm font-bold mb-1" style={{ color: msg.color }}>{msg.title}</p>

        {myRank && myRank > 0 && (
          <div className="flex items-center gap-2 mt-2 px-4 py-2 rounded-full"
            style={{ background: "rgba(244,169,35,0.15)", border: "1px solid #f4a92344" }}>
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-yellow-400 text-sm font-bold">
              {getRankEmoji(myRank)} {myRank <= 3 ? "Pódio!" : `${myRank}º lugar`}
            </span>
          </div>
        )}
      </div>

      {/* Mission breakdown */}
      <div className="px-4 mb-6">
        <h3 className="text-white text-sm font-bold mb-3">📊 Suas Missões</h3>
        <div className="flex flex-col gap-2">
          {MISSIONS.map(m => {
            const progress = participant?.missionsCompleted as any;
            const missionScore = progress?.[m.id]?.score ?? 0;
            const completed = progress?.[m.id]?.completed ?? false;
            const pctMission = Math.round((missionScore / m.maxScore) * 100);
            return (
              <div key={m.id} className="rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-white">{m.icon} {m.label}</span>
                  <span className="text-xs font-bold" style={{ color: completed ? "#40916c" : "#9ca3af" }}>
                    {completed ? `${missionScore} pts` : "Não completada"}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-800">
                  <div className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${pctMission}%`, background: completed ? "linear-gradient(90deg, #2d6a4f, #40916c)" : "rgba(255,255,255,0.1)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Characters */}
      <div className="px-4 mb-6">
        <div className="flex justify-center gap-3">
          {(["lucas", "emily", "aiko"] as const).map(char => (
            <div key={char} className="flex flex-col items-center">
              <img
                src={CHARACTER_IMAGES[char]}
                alt={char}
                className="w-16 h-16 rounded-full object-cover"
                style={{ border: "2px solid rgba(255,255,255,0.2)" }}
              />
            </div>
          ))}
        </div>
        <p className="text-center text-gray-400 text-xs mt-2">
          Lucas, Emily e Aiko adoraram praticar com você! 🎉
        </p>
      </div>

      {/* CTA */}
      {isGuest && (
        <div className="px-4 mb-4">
          <div className="rounded-2xl p-5 text-center"
            style={{ background: "linear-gradient(135deg, rgba(45,106,79,0.3), rgba(64,145,108,0.2))", border: "2px solid #40916c66" }}>
            <div className="text-3xl mb-2">🎓</div>
            <h3 className="text-white font-black text-lg mb-1">Quer continuar aprendendo?</h3>
            <p className="text-gray-300 text-sm mb-4">
              Na inFlux você aprende inglês com os mesmos personagens, em aulas ao vivo com professores nativos.
              <span className="text-yellow-400 font-bold"> Primeira aula grátis!</span>
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/5511913162024?text=Oi!%20Participei%20do%20St.%20Patrick's%20Night%20e%20quero%20saber%20mais%20sobre%20as%20aulas%20da%20inFlux!"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full h-12 rounded-xl font-bold text-base"
                  style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}>
                  💬 Falar com a inFlux no WhatsApp
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </a>
              <Button
                onClick={() => navigate("/events/leaderboard")}
                variant="outline"
                className="w-full h-11 rounded-xl border-gray-600 text-gray-300"
              >
                <Users size={16} className="mr-2" /> Ver Ranking Completo
              </Button>
            </div>
          </div>
        </div>
      )}

      {!isGuest && (
        <div className="px-4 mb-4">
          <div className="rounded-2xl p-4 text-center"
            style={{ background: "rgba(244,169,35,0.1)", border: "1px solid #f4a92344" }}>
            <Star size={24} className="text-yellow-400 mx-auto mb-2" />
            <p className="text-white font-bold">Parabéns, aluno inFlux!</p>
            <p className="text-gray-400 text-xs mt-1">
              Seus pontos foram adicionados ao seu perfil. Continue praticando no app!
            </p>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              onClick={() => navigate("/events/leaderboard")}
              variant="outline"
              className="flex-1 h-11 rounded-xl border-gray-600 text-gray-300"
            >
              <Trophy size={16} className="mr-2" /> Ranking
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="flex-1 h-11 rounded-xl font-bold"
              style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
            >
              Meu Dashboard →
            </Button>
          </div>
        </div>
      )}

      {/* Replay */}
      <div className="px-4">
        <Button
          onClick={() => navigate("/events/hub")}
          variant="outline"
          className="w-full h-11 rounded-xl border-gray-700 text-gray-500 text-sm"
        >
          🔄 Refazer Missões
        </Button>
      </div>
    </div>
  );
}
