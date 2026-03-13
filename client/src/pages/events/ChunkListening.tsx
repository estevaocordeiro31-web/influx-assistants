import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { CharacterBubble } from "@/components/events/CharacterBubble";
import { InfluxCoinsDisplay } from "@/components/events/EventUI";
import { STPATRICKS_LISTENING, type ListeningGap } from "@/data/stpatricks/listening";
const LISTENING_GAPS = STPATRICKS_LISTENING.gaps;
const LISTENING_SCRIPT = STPATRICKS_LISTENING.scriptWithBlanks.replace(/\[_(\d+)_\]/g, '[GAP]');
import { Button } from "@/components/ui/button";
import { ChevronLeft, Headphones, CheckCircle2 } from "lucide-react";

export default function ChunkListening() {
  const [, navigate] = useLocation();
  const [answers, setAnswers] = useState<string[]>(new Array(LISTENING_GAPS.length).fill(""));
  const [checked, setChecked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  const participantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");
  const saveMission = trpc.culturalEvents.saveMissionProgress.useMutation();

  const handleCheck = async () => {
    if (checked) return;
    setChecked(true);
    const correctCount = answers.filter((a, i) =>
      a.trim().toLowerCase() === LISTENING_GAPS[i].answer.toLowerCase()
    ).length;
    const score = Math.round((correctCount / LISTENING_GAPS.length) * 100);
    setSaving(true);
    try {
      await saveMission.mutateAsync({
        participantId,
        missionId: "chunk-listening",
        score,
        completed: true,
        answers,
      });
      setCompleted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const correctCount = checked
    ? answers.filter((a, i) => a.trim().toLowerCase() === LISTENING_GAPS[i].answer.toLowerCase()).length
    : 0;
  const score = checked ? Math.round((correctCount / LISTENING_GAPS.length) * 100) : 0;

  // Build the script with blanks
  let gapIdx = 0;
  const parts = LISTENING_SCRIPT.split(/\[GAP\]/g);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate("/events/hub")} className="text-gray-400 flex items-center gap-1 text-sm">
            <ChevronLeft size={16} /> Hub
          </button>
          <div className="flex items-center gap-2">
            <Headphones size={16} className="text-purple-400" />
            <span className="text-white text-sm font-bold">Chunk Listening</span>
          </div>
          <span className="text-xs text-gray-400">{LISTENING_GAPS.length} lacunas</span>
        </div>
      </div>

      {/* Intro */}
      <div className="px-4 mb-4">
        <CharacterBubble
          character="emily"
          message="Read this conversation and fill in the blanks with the chunks you learned. Brilliant, isn't it?"
          animate={false}
        />
      </div>

      {/* Script with gaps */}
      <div className="flex-1 px-4 overflow-y-auto">
        <div
          className="rounded-2xl p-4 text-sm leading-8 text-gray-200"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {parts.map((part: string, i: number) => {
            const currentGap = gapIdx;
            if (i < parts.length - 1) {
              gapIdx++;
              const isCorrect = checked && answers[currentGap]?.trim().toLowerCase() === LISTENING_GAPS[currentGap].answer.toLowerCase();
              const isWrong = checked && !isCorrect;

              return (
                <span key={i}>
                  <span dangerouslySetInnerHTML={{ __html: part }} />
                  <span className="inline-flex items-center mx-1">
                    {checked ? (
                      <span
                        className="px-2 py-0.5 rounded font-bold text-xs"
                        style={{
                          background: isCorrect ? "rgba(45,106,79,0.4)" : "rgba(229,57,53,0.3)",
                          color: isCorrect ? "#40916c" : "#e53935",
                          border: `1px solid ${isCorrect ? "#40916c" : "#e53935"}`,
                          minWidth: "80px",
                          display: "inline-block",
                          textAlign: "center",
                        }}
                      >
                        {isCorrect ? answers[currentGap] : `${answers[currentGap] || "—"} → ${LISTENING_GAPS[currentGap].answer}`}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={answers[currentGap]}
                        onChange={e => {
                          const newAnswers = [...answers];
                          newAnswers[currentGap] = e.target.value;
                          setAnswers(newAnswers);
                        }}
                        placeholder={`_${currentGap + 1}_`}
                        className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-white text-xs focus:outline-none focus:border-purple-400"
                        style={{ width: "90px" }}
                      />
                    )}
                  </span>
                </span>
              );
            }
            return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
          })}
        </div>

        {/* Word bank */}
        {!checked && (
          <div className="mt-4 mb-4">
            <p className="text-xs text-gray-400 mb-2">💡 Banco de palavras:</p>
            <div className="flex flex-wrap gap-2">
              {LISTENING_GAPS.map((gap: ListeningGap, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    const emptyIdx = answers.findIndex(a => !a);
                    if (emptyIdx !== -1) {
                      const newAnswers = [...answers];
                      newAnswers[emptyIdx] = gap.answer;
                      setAnswers(newAnswers);
                    }
                  }}
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: "rgba(124,45,139,0.4)", border: "1px solid #7b2d8b66" }}
                >
                  {gap.answer}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {checked && (
          <div className="mt-4 mb-4 rounded-xl p-4 text-center"
            style={{ background: "rgba(45,106,79,0.2)", border: "1px solid #40916c44" }}>
            <CheckCircle2 size={32} className="text-green-400 mx-auto mb-2" />
            <p className="text-white font-bold">{correctCount}/{LISTENING_GAPS.length} corretas</p>
            <div className="mt-2">
              <InfluxCoinsDisplay points={score} label="pontos" size="md" />
            </div>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="px-4 pb-8 pt-4">
        {!checked ? (
          <Button
            onClick={handleCheck}
            disabled={answers.some(a => !a) || saving}
            className="w-full h-12 rounded-xl font-bold"
            style={{ background: "linear-gradient(135deg, #7b2d8b, #9c27b0)" }}
          >
            Verificar Respostas
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/events/hub")}
            className="w-full h-12 rounded-xl font-bold"
            style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
          >
            Próxima Missão →
          </Button>
        )}
      </div>
    </div>
  );
}
