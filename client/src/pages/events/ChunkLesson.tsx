import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { FlipCard } from "@/components/events/FlipCard";
import { CharacterBubble } from "@/components/events/CharacterBubble";
import { InfluxCoinsDisplay } from "@/components/events/EventUI";
import { STPATRICKS_CHUNKS as CHUNKS, CHARACTER_INFO } from "@/data/stpatricks/chunks";
import type { Character } from "@/data/stpatricks/chunks";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, BookOpen } from "lucide-react";

const INTRO_MESSAGES: { [key: string]: string } = {
  lucas: "Hey! I'm Lucas from New York! Let's learn some awesome St. Patrick's expressions. These chunks are gonna be super useful tonight — for real!",
  emily: "Hello there! I'm Emily from London. These expressions are absolutely brilliant for St. Patrick's Night. Shall we get started?",
  aiko: "G'day! I'm Aiko from Sydney! No worries, these chunks are heaps of fun. Let's have a crack at it, yeah?",
};

export default function ChunkLesson() {
  const [, navigate] = useLocation();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  const participantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");
  const eventId = localStorage.getItem("event_id") ?? "";

  const saveMission = trpc.culturalEvents.saveMissionProgress.useMutation();

  const chunk = CHUNKS[currentIdx];
  const totalChunks = CHUNKS.length;
  const progress = ((currentIdx + 1) / totalChunks) * 100;

  const handleFlipped = () => {
    setFlippedCards(prev => { const next = new Set(prev); next.add(currentIdx); return next; });
  };

  const handleNext = () => {
    if (currentIdx < totalChunks - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  const handleComplete = async () => {
    setSaving(true);
    const score = Math.round((flippedCards.size / totalChunks) * 100);
    try {
      await saveMission.mutateAsync({
        participantId,
        missionId: "chunk-lesson",
        score,
        completed: true,
        timeSpentSeconds: 0,
      });
      setCompleted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-10"
        style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
        <CheckCircle2 size={64} className="text-green-400 mb-4" />
        <h2 className="text-2xl font-black text-white mb-2">Missão Completa!</h2>
        <p className="text-gray-300 text-sm text-center mb-4">
          Você aprendeu {totalChunks} expressões do St. Patrick's Day!
        </p>
        <InfluxCoinsDisplay points={100} label="pontos ganhos" size="lg" />
        <Button
          onClick={() => navigate("/events/hub")}
          className="mt-8 w-full max-w-xs h-12 rounded-xl font-bold"
          style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
        >
          Próxima Missão →
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate("/events/hub")} className="text-gray-400 flex items-center gap-1 text-sm">
            <ChevronLeft size={16} /> Hub
          </button>
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-blue-400" />
            <span className="text-white text-sm font-bold">Chunk Lesson</span>
          </div>
          <span className="text-gray-400 text-sm">{currentIdx + 1}/{totalChunks}</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-gray-800">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #2196F3, #40916c)" }}
          />
        </div>
      </div>

      {/* Character intro */}
      {currentIdx === 0 && (
        <div className="px-4 mb-4">
          <CharacterBubble character={chunk.who} message={INTRO_MESSAGES[chunk.who]} animate />
        </div>
      )}

      {/* Flip card */}
      <div className="flex-1 px-4 flex flex-col justify-center">
        <FlipCard chunk={chunk} onFlipped={handleFlipped} />

        {/* Instruction */}
        {!flippedCards.has(currentIdx) && (
          <p className="text-center text-gray-500 text-xs mt-3">
            Toque no card para ver a tradução e o exemplo
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="px-4 pb-8 pt-4 flex gap-3">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="flex-1 h-12 rounded-xl border-gray-600 text-gray-300"
        >
          <ChevronLeft size={18} />
        </Button>
        <Button
          onClick={handleNext}
          disabled={saving}
          className="flex-2 h-12 rounded-xl font-bold flex-[2]"
          style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
        >
          {currentIdx === totalChunks - 1
            ? saving ? "Salvando..." : "Concluir Missão ✓"
            : "Próximo →"}
        </Button>
      </div>
    </div>
  );
}
