import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { CharacterBubble } from "@/components/events/CharacterBubble";
import { InfluxCoinsDisplay } from "@/components/events/EventUI";
import { STPATRICKS_QUIZ as QUIZ_QUESTIONS } from "@/data/stpatricks/quiz";
import { Button } from "@/components/ui/button";
import { ChevronLeft, HelpCircle, CheckCircle2, XCircle } from "lucide-react";

export default function CultureQuiz() {
  const [, navigate] = useLocation();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  const participantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");
  const saveMission = trpc.culturalEvents.saveMissionProgress.useMutation();

  const question = QUIZ_QUESTIONS[currentIdx];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const progress = ((currentIdx + 1) / totalQuestions) * 100;

  const handleSelect = (optionIdx: number) => {
    if (selected !== null) return;
    setSelected(optionIdx);
  };

  const handleNext = async () => {
    const isCorrect = selected === question.correct;
    const newAnswers = [...answers, isCorrect];

    if (currentIdx < totalQuestions - 1) {
      setAnswers(newAnswers);
      setSelected(null);
      setCurrentIdx(i => i + 1);
    } else {
      // Complete
      const correctCount = newAnswers.filter(Boolean).length;
      const score = Math.round((correctCount / totalQuestions) * 80);
      setSaving(true);
      try {
        await saveMission.mutateAsync({
          participantId,
          missionId: "culture-quiz",
          score,
          completed: true,
          answers: newAnswers,
        });
        setAnswers(newAnswers);
        setCompleted(true);
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    }
  };

  if (completed) {
    const correctCount = answers.filter(Boolean).length;
    const score = Math.round((correctCount / totalQuestions) * 80);
    const pct = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-10"
        style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
        <div className="text-5xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "🎉" : "📚"}</div>
        <h2 className="text-2xl font-black text-white mb-2">Quiz Completo!</h2>
        <p className="text-gray-300 text-sm text-center mb-2">
          Você acertou <span className="text-yellow-400 font-bold">{correctCount}/{totalQuestions}</span> perguntas
        </p>
        <InfluxCoinsDisplay points={score} label="pontos ganhos" size="lg" />

        <div className="mt-6 w-full max-w-xs flex flex-col gap-2">
          {QUIZ_QUESTIONS.map((q: typeof QUIZ_QUESTIONS[0], i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {answers[i]
                ? <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                : <XCircle size={16} className="text-red-400 flex-shrink-0" />}
              <span className={answers[i] ? "text-gray-300" : "text-gray-500"}>{q.question.slice(0, 50)}...</span>
            </div>
          ))}
        </div>

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

  const isAnswered = selected !== null;
  const isCorrect = selected === question.correct;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate("/events/hub")} className="text-gray-400 flex items-center gap-1 text-sm">
            <ChevronLeft size={16} /> Hub
          </button>
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-yellow-400" />
            <span className="text-white text-sm font-bold">Culture Quiz</span>
          </div>
          <span className="text-gray-400 text-sm">{currentIdx + 1}/{totalQuestions}</span>
        </div>
        <div className="h-2 rounded-full bg-gray-800">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #f4a923, #e8890c)" }}
          />
        </div>
      </div>

      {/* Character */}
      <div className="px-4 mb-4">
        <CharacterBubble character={question.character} message={question.question} animate={false} />
      </div>

      {/* Options */}
      <div className="flex-1 px-4 flex flex-col gap-3">
        {question.options.map((option: string, idx: number) => {
          let bg = "rgba(255,255,255,0.05)";
          let border = "rgba(255,255,255,0.1)";
          let textColor = "text-white";

          if (isAnswered) {
            if (idx === question.correct) {
              bg = "rgba(45,106,79,0.3)";
              border = "#40916c";
              textColor = "text-green-300";
            } else if (idx === selected && !isCorrect) {
              bg = "rgba(229,57,53,0.2)";
              border = "#e53935";
              textColor = "text-red-300";
            }
          } else if (selected === idx) {
            bg = "rgba(244,169,35,0.2)";
            border = "#f4a923";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full text-left rounded-xl p-4 transition-all duration-200 ${textColor}`}
              style={{ background: bg, border: `2px solid ${border}` }}
            >
              <span className="font-semibold mr-2 text-gray-400">{String.fromCharCode(65 + idx)}.</span>
              {option}
            </button>
          );
        })}

        {/* Explanation */}
        {isAnswered && (
          <div
            className="rounded-xl p-4 mt-1"
            style={{
              background: isCorrect ? "rgba(45,106,79,0.2)" : "rgba(229,57,53,0.15)",
              border: `1px solid ${isCorrect ? "#40916c44" : "#e5393544"}`,
            }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: isCorrect ? "#40916c" : "#e53935" }}>
              {isCorrect ? "✓ Correto!" : "✗ Incorreto"}
            </p>
            <p className="text-xs text-gray-300">{isCorrect ? question.feedback.correct : question.feedback.wrong}</p>
          </div>
        )}
      </div>

      {/* Next button */}
      <div className="px-4 pb-8 pt-4">
        <Button
          onClick={handleNext}
          disabled={!isAnswered || saving}
          className="w-full h-12 rounded-xl font-bold"
          style={{ background: "linear-gradient(135deg, #f4a923, #e8890c)" }}
        >
          {currentIdx === totalQuestions - 1
            ? saving ? "Salvando..." : "Ver Resultado ✓"
            : "Próxima →"}
        </Button>
      </div>
    </div>
  );
}
