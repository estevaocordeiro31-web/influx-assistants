import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { EventHeader, MissionCard } from "@/components/events/EventUI";
import { Loader2, BookOpen, HelpCircle, Headphones, Mic, Utensils, Trophy } from "lucide-react";
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

export default function EventHub() {
  const [, navigate] = useLocation();
  const participantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");
  const eventId = localStorage.getItem("event_id") ?? "";
  const guestToken = localStorage.getItem("event_guest_token") ?? undefined;

  const { data: participant, isLoading } = trpc.culturalEvents.getParticipant.useQuery(
    { eventId, token: guestToken, userId: guestToken ? undefined : undefined },
    { enabled: !!eventId && !!participantId }
  );

  const { data: event } = trpc.culturalEvents.getActive.useQuery();

  useEffect(() => {
    if (!participantId || !eventId) {
      navigate("/events");
    }
  }, [participantId, eventId]);

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

        {/* Missions */}
        <h2 className="text-white font-bold text-base mb-3">Missões</h2>
        <div className="flex flex-col gap-3 mb-6">
          {MISSIONS.map((mission, idx) => {
            const completed = !!missionsCompleted[mission.id];
            // First mission always unlocked, others unlock after previous
            const locked = idx > 0 && !missionsCompleted[MISSIONS[idx - 1].id];

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

        {/* Leaderboard button */}
        <Button
          onClick={() => navigate("/events/leaderboard")}
          variant="outline"
          className="w-full h-12 rounded-xl border-yellow-400/30 text-yellow-400 font-bold"
          style={{ background: "rgba(244,169,35,0.08)" }}
        >
          <Trophy size={18} className="mr-2" />
          Ver Ranking
        </Button>

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
