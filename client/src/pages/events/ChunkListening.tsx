import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { CharacterBubble } from "@/components/events/CharacterBubble";
import { InfluxCoinsDisplay } from "@/components/events/EventUI";
import { STPATRICKS_LISTENING, type ListeningGap } from "@/data/stpatricks/listening";
const LISTENING_GAPS = STPATRICKS_LISTENING.gaps;
const LISTENING_SCRIPT = STPATRICKS_LISTENING.scriptWithBlanks.replace(/\[_(\d+)_\]/g, '[GAP]');
import { Button } from "@/components/ui/button";
import { ChevronLeft, Headphones, CheckCircle2, XCircle } from "lucide-react";

export default function ChunkListening() {
  const [, navigate] = useLocation();
  const [answers, setAnswers] = useState<string[]>(new Array(LISTENING_GAPS.length).fill(""));
  const [activeGap, setActiveGap] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);

  const participantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");
  const saveMission = trpc.culturalEvents.saveMissionProgress.useMutation();

  const handleWordClick = (word: string) => {
    if (checked) return;
    // If a gap is selected, fill it
    if (activeGap !== null) {
      const newAnswers = [...answers];
      // If already filled, swap back to empty and fill the active one
      newAnswers[activeGap] = word;
      setAnswers(newAnswers);
      // Move to next empty gap
      const nextEmpty = newAnswers.findIndex((a, i) => !a && i !== activeGap);
      setActiveGap(nextEmpty !== -1 ? nextEmpty : null);
      return;
    }
    // No gap selected: fill the first empty gap
    const emptyIdx = answers.findIndex(a => !a);
    if (emptyIdx !== -1) {
      const newAnswers = [...answers];
      newAnswers[emptyIdx] = word;
      setAnswers(newAnswers);
    }
  };

  const handleGapClick = (idx: number) => {
    if (checked) return;
    if (activeGap === idx) {
      setActiveGap(null);
    } else {
      setActiveGap(idx);
    }
  };

  const handleClearGap = (idx: number) => {
    if (checked) return;
    const newAnswers = [...answers];
    newAnswers[idx] = "";
    setAnswers(newAnswers);
    setActiveGap(idx);
  };

  const handleCheck = async () => {
    if (checked) return;
    setChecked(true);
    setActiveGap(null);
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

  // Which words are already used
  const usedWords = answers.filter(a => !!a);

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
      <div className="px-4 mb-3">
        <CharacterBubble
          character="emily"
          message="Read this conversation and fill in the blanks with the chunks you learned. Brilliant, isn't it?"
          animate={false}
        />
      </div>

      {/* Instruction */}
      {!checked && (
        <div className="px-4 mb-3">
          <div className="rounded-xl p-3" style={{ background: "rgba(124,45,139,0.15)", border: "1px solid #7b2d8b44" }}>
            <p className="text-purple-300 text-xs">
              {activeGap !== null
                ? `✨ Lacuna ${activeGap + 1} selecionada — clique na palavra certa abaixo!`
                : "👆 Toque em uma lacuna para selecioná-la, depois clique na palavra correta."}
            </p>
          </div>
        </div>
      )}

      {/* Script with gaps */}
      <div className="flex-1 px-4 overflow-y-auto">
        <div
          className="rounded-2xl p-4 text-sm leading-9 text-gray-200"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {parts.map((part: string, i: number) => {
            const currentGap = gapIdx;
            if (i < parts.length - 1) {
              gapIdx++;
              const isCorrect = checked && answers[currentGap]?.trim().toLowerCase() === LISTENING_GAPS[currentGap].answer.toLowerCase();
              const isWrong = checked && answers[currentGap] && !isCorrect;
              const isActive = !checked && activeGap === currentGap;
              const isFilled = !!answers[currentGap];

              return (
                <span key={i}>
                  <span dangerouslySetInnerHTML={{ __html: part }} />
                  <span className="inline-flex items-center mx-1 align-middle">
                    {checked ? (
                      <span
                        className="px-2 py-0.5 rounded font-bold text-xs inline-flex items-center gap-1"
                        style={{
                          background: isCorrect ? "rgba(45,106,79,0.4)" : "rgba(229,57,53,0.3)",
                          color: isCorrect ? "#52b788" : "#e53935",
                          border: `1px solid ${isCorrect ? "#40916c" : "#e53935"}`,
                          minWidth: "80px",
                        }}
                      >
                        {isCorrect
                          ? <><CheckCircle2 size={10} /> {answers[currentGap]}</>
                          : <><XCircle size={10} /> {answers[currentGap] || "—"} → {LISTENING_GAPS[currentGap].answer}</>
                        }
                      </span>
                    ) : (
                      <button
                        onClick={() => isFilled ? handleClearGap(currentGap) : handleGapClick(currentGap)}
                        className="rounded px-2 py-0.5 font-bold text-xs transition-all duration-150"
                        style={{
                          background: isActive
                            ? "rgba(124,45,139,0.6)"
                            : isFilled
                            ? "rgba(45,106,79,0.3)"
                            : "rgba(255,255,255,0.08)",
                          border: `2px solid ${isActive ? "#9c27b0" : isFilled ? "#40916c66" : "rgba(255,255,255,0.2)"}`,
                          color: isActive ? "#e040fb" : isFilled ? "#52b788" : "#9ca3af",
                          minWidth: "80px",
                        }}
                      >
                        {isFilled ? answers[currentGap] : `_${currentGap + 1}_`}
                      </button>
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
          <div className="mt-4 mb-2">
            <p className="text-xs text-gray-400 mb-2">💡 Banco de palavras — clique para preencher:</p>
            <div className="flex flex-wrap gap-2">
              {LISTENING_GAPS.map((gap: ListeningGap, i: number) => {
                const alreadyUsed = usedWords.filter(w => w === gap.answer).length;
                const totalOccurrences = LISTENING_GAPS.filter(g => g.answer === gap.answer).length;
                const isExhausted = alreadyUsed >= totalOccurrences;
                return (
                  <button
                    key={i}
                    onClick={() => !isExhausted && handleWordClick(gap.answer)}
                    disabled={isExhausted}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150"
                    style={{
                      background: isExhausted ? "rgba(255,255,255,0.05)" : activeGap !== null ? "rgba(124,45,139,0.6)" : "rgba(124,45,139,0.4)",
                      border: `1px solid ${isExhausted ? "rgba(255,255,255,0.1)" : "#7b2d8b88"}`,
                      color: isExhausted ? "#4b5563" : "#e040fb",
                      textDecoration: isExhausted ? "line-through" : "none",
                    }}
                  >
                    {gap.answer}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Result */}
        {checked && (
          <div className="mt-4 mb-4 rounded-xl p-4 text-center"
            style={{ background: correctCount >= LISTENING_GAPS.length * 0.7 ? "rgba(45,106,79,0.2)" : "rgba(244,169,35,0.1)", border: "1px solid #40916c44" }}>
            <div className="text-3xl mb-2">{correctCount === LISTENING_GAPS.length ? "🏆" : correctCount >= LISTENING_GAPS.length * 0.7 ? "🎉" : "📚"}</div>
            <p className="text-white font-bold text-lg">{correctCount}/{LISTENING_GAPS.length} corretas</p>
            <p className="text-gray-400 text-xs mb-3">{correctCount === LISTENING_GAPS.length ? "Perfeito! Você dominou os chunks!" : "Bom trabalho! Continue praticando."}</p>
            <InfluxCoinsDisplay points={score} label="pontos" size="md" />
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
            {saving ? "Salvando..." : `Verificar Respostas (${answers.filter(a => !!a).length}/${LISTENING_GAPS.length})`}
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
