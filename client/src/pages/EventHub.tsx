import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { EventHeader, MissionCard } from "@/components/events/EventUI";
import { Loader2, BookOpen, HelpCircle, Headphones, Mic, Utensils, Trophy, Wind, UserSearch, Music, Beer, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const MISSIONS = [
  {
    id: "chunk-lesson",
    title: "Chunk Lesson",
    description: "Aprenda 10 expressões típicas do St. Patrick's com Lucas, Emily e Aiko",
    icon: <BookOpen size={18} className="text-blue-400" />,
    points: 100,
    path: "/events/chunk-lesson",
  },
  {
    id: "culture-quiz",
    title: "Culture Quiz",
    description: "8 perguntas sobre a cultura irlandesa e o St. Patrick's Day",
    icon: <HelpCircle size={18} className="text-yellow-400" />,
    points: 80,
    path: "/events/culture-quiz",
  },
  {
    id: "chunk-listening",
    title: "Chunk Listening",
    description: "Complete o diálogo com as expressões que você aprendeu",
    icon: <Headphones size={18} className="text-purple-400" />,
    points: 100,
    path: "/events/chunk-listening",
  },
  {
    id: "speaking-challenge",
    title: "Speaking Challenge",
    description: "Grave sua voz respondendo a 3 cenários com os personagens",
    icon: <Mic size={18} className="text-red-400" />,
    points: 120,
    path: "/events/speaking-challenge",
  },
  {
    id: "food-challenge",
    title: "Food Challenge",
    description: "Peça comida em inglês no restaurante irlandês com Lucas, Emily e Aiko",
    icon: <Utensils size={18} className="text-green-400" />,
    points: 100,
    path: "/events/food-challenge",
  },
];

const DRINKING_GAMES = [
  {
    id: "tongue-twister",
    title: "Tongue Twister 🌀",
    description: "Grave sua voz dizendo trava-línguas em inglês. A IA avalia. Errou? Bebe!",
    icon: <Wind size={18} className="text-cyan-400" />,
    points: 200,
    path: "/events/tongue-twister",
  },
  {
    id: "who-am-i",
    title: "Who Am I? 🕵️",
    description: "A IA vira um personagem famoso. Descubra quem é fazendo perguntas em inglês!",
    icon: <UserSearch size={18} className="text-purple-400" />,
    points: 150,
    path: "/events/who-am-i",
  },
  {
    id: "finish-lyrics",
    title: "Finish the Lyrics 🎵",
    description: "Complete a letra da música em inglês. Errou? Bebe! Acertou? Escolhe quem bebe!",
    icon: <Music size={18} className="text-pink-400" />,
    points: 120,
    path: "/events/finish-lyrics",
  },
  {
    id: "hot-seat",
    title: "Hot Seat 🔥",
    description: "Modo grupo! Um jogador fecha os olhos, o grupo vê o personagem e dá dicas em inglês. 60 segundos!",
    icon: <Users size={18} className="text-orange-400" />,
    points: 200,
    path: "/events/hot-seat",
  },
];

export default function EventHub() {
  const [, navigate] = useLocation();
  // Read localStorage once via useState initializer to avoid re-renders on every render
  const [participantId] = useState(() => parseInt(localStorage.getItem("event_participant_id") ?? "0"));
  const [eventId] = useState(() => localStorage.getItem("event_id") ?? "");
  const [guestToken] = useState<string | undefined>(() => localStorage.getItem("event_guest_token") ?? undefined);
  const [storedUserId] = useState<number | undefined>(() => parseInt(localStorage.getItem("event_user_id") ?? "0") || undefined);

  const { data: participant, isLoading } = trpc.culturalEvents.getParticipant.useQuery(
    { eventId: eventId || "stpatricks_2026", token: guestToken, userId: storedUserId },
    {
      enabled: !!(guestToken || storedUserId),
      refetchInterval: 15000, // Refresh every 15s to pick up mission completions
    }
  );

  const { data: event } = trpc.culturalEvents.getActive.useQuery();

  useEffect(() => {
    if (!participantId || !eventId) {
      navigate("/events");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0f1e" }}>
        <Loader2 size={32} className="text-green-400 animate-spin" />
      </div>
    );
  }

  const missionsCompleted = participant?.missionsCompleted as Record<string, boolean> ?? {};
  const totalPoints = participant?.totalPoints ?? 0;
  const completedCount = Object.values(missionsCompleted).filter(Boolean).length;

  const getMissionScore = (missionId: string) => {
    // Score is tracked in eventMissionProgress, totalPoints is sum
    return missionsCompleted[missionId] ? 1 : 0;
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Header */}
        <EventHeader
          eventName={event?.name ?? "St. Patrick's Night 🍀"}
          totalPoints={totalPoints}
          missionsCompleted={completedCount}
          totalMissions={MISSIONS.length}
        />

        {/* Intro button */}
        <button
          onClick={() => navigate("/events/intro")}
          className="w-full mb-5 rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #1a4a2e, #2d6a4f)", border: "1.5px solid #40916c66" }}
        >
          <div className="flex -space-x-2">
            <img src="/characters/lucas-usa.png" alt="Lucas" className="w-9 h-9 rounded-full border-2 border-green-700 object-cover object-top" />
            <img src="/characters/emily-uk.jpg" alt="Emily" className="w-9 h-9 rounded-full border-2 border-green-700 object-cover object-top" />
            <img src="/characters/aiko-australia.jpg" alt="Aiko" className="w-9 h-9 rounded-full border-2 border-green-700 object-cover object-top" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">☘️ What is St. Patrick's Day?</p>
            <p className="text-green-300 text-xs">Lucas, Emily & Aiko explain — with audio! 🔊</p>
          </div>
          <span className="text-green-400 text-xl">▶</span>
        </button>
        {/* Missions */}
        <h2 className="text-white font-bold text-base mb-3">Missões</h2>
        <div className="flex flex-col gap-3 mb-6">
          {MISSIONS.map((mission, idx) => {
            const completed = !!missionsCompleted[mission.id];
            // All missions are unlocked for the live event — no sequential lock
            const locked = false;

            return (
              <MissionCard
                key={mission.id}
                id={mission.id}
                title={mission.title}
                description={mission.description}
                icon={mission.icon}
                points={mission.points}
                completed={completed}
                locked={locked}
                score={completed ? mission.points : undefined}
                onClick={() => navigate(mission.path)}
              />
            );
          })}
        </div>

        {/* Drinking Games Section */}
        <div className="mt-2 mb-2 rounded-2xl p-3 flex items-center gap-2" style={{ background: "rgba(231,111,81,0.1)", border: "1px solid #e76f5133" }}>
          <Beer size={18} className="text-orange-400" />
          <div>
            <p className="text-sm font-bold text-orange-300">🍺 Drinking Games</p>
            <p className="text-xs text-gray-400">Jogos extras para a noite! Pontos bônus e muito inglês.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 mb-6">
          {DRINKING_GAMES.map((game) => {
            const completed = !!missionsCompleted[game.id];
            return (
              <MissionCard
                key={game.id}
                id={game.id}
                title={game.title}
                description={game.description}
                icon={game.icon}
                points={game.points}
                completed={completed}
                locked={false}
                score={completed ? game.points : undefined}
                onClick={() => navigate(game.path)}
              />
            );
          })}
        </div>

        {/* Leaderboard buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/events/leaderboard")}
            variant="outline"
            className="flex-1 h-12 rounded-xl border-yellow-400/30 text-yellow-400 font-bold"
            style={{ background: "rgba(244,169,35,0.08)" }}
          >
            <Trophy size={18} className="mr-2" />
            Ver Ranking
          </Button>
          <Button
            onClick={() => window.open("/events/leaderboard-tv", "_blank")}
            variant="outline"
            className="h-12 px-4 rounded-xl border-green-400/30 text-green-400 font-bold"
            style={{ background: "rgba(34,197,94,0.08)" }}
            title="Abrir Leaderboard para TV"
          >
            📺 TV
          </Button>
          <Button
            onClick={() => window.open("/events/reception-tv", "_blank")}
            variant="outline"
            className="h-12 px-4 rounded-xl border-cyan-400/30 text-cyan-400 font-bold"
            style={{ background: "rgba(6,182,212,0.08)" }}
            title="Tela de Recepção para TV"
          >
            🎯 QR
          </Button>
        </div>
        {/* Teacher Dashboard */}
        <Button
          onClick={() => navigate("/events/teacher")}
          variant="outline"
          className="w-full h-11 rounded-xl border-purple-400/30 text-purple-300 font-bold text-sm mt-2"
          style={{ background: "rgba(168,85,247,0.08)" }}
        >
          👩‍🏫 Painel do Professor — Roteiro, Dicas e Controles
        </Button>
        {/* Kids Zone */}
        <Button
          onClick={() => navigate("/events/kids")}
          variant="outline"
          className="w-full h-11 rounded-xl border-cyan-400/30 text-cyan-300 font-bold text-sm mt-2"
          style={{ background: "rgba(76,201,240,0.08)" }}
        >
          🧒 Kids Zone — Versão para Crianças
        </Button>

        {/* Final score button when all missions completed */}
        {completedCount >= MISSIONS.length && (
          <Button
            onClick={() => navigate("/events/score")}
            className="w-full h-14 rounded-xl font-black text-base mt-2"
            style={{ background: "linear-gradient(135deg, #f4a923, #e8890c)" }}
          >
            🏆 Ver Resultado Final
          </Button>
        )}

        {/* Share */}
        {completedCount >= 3 && (
          <div
            className="mt-4 rounded-2xl p-4 text-center"
            style={{ background: "rgba(45,106,79,0.2)", border: "1px solid #40916c44" }}
          >
            <p className="text-green-300 text-sm font-semibold mb-1">🎉 Você está indo muito bem!</p>
            <p className="text-gray-400 text-xs">Complete todas as missões para concorrer ao prêmio especial</p>
          </div>
        )}
      </div>
    </div>
  );
}
