import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, HelpCircle, Loader2, RefreshCw, Beer, Eye } from "lucide-react";
import { WHO_AM_I_CHARACTERS, WHO_AM_I_DRINK_RULES, type WhoAmICharacter } from "@/data/stpatricks/drinking-games";

type GameStep = "select-category" | "playing" | "result";

const CATEGORIES = [
  { id: "all",       label: "🎲 Aleatório",     color: "#6c757d" },
  { id: "celebrity", label: "🎤 Celebrity",     color: "#e9c46a" },
  { id: "movie",     label: "🎬 Movie/Series",  color: "#4cc9f0" },
  { id: "irish",     label: "🍀 Irish Icons",   color: "#40916c" },
  { id: "sports",    label: "⚽ Sports",        color: "#e76f51" },
];

export default function WhoAmIGame() {
  const [, navigate] = useLocation();
  const [character, setCharacter] = useState<WhoAmICharacter | null>(null);
  const [step, setStep] = useState<GameStep>("select-category");
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Array<{ q: string; a: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [won, setWon] = useState(false);

  const participantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");
  const askQuestion = trpc.culturalEvents.whoAmIAnswer.useMutation();
  const saveMission = trpc.culturalEvents.saveMissionProgress.useMutation();

  const pickCharacter = (categoryId: string) => {
    const pool = categoryId === "all"
      ? WHO_AM_I_CHARACTERS
      : WHO_AM_I_CHARACTERS.filter(c => c.category === categoryId);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setCharacter(picked);
    setConversation([]);
    setHintsUsed(0);
    setRevealed(false);
    setWon(false);
    setQuestion("");
    setStep("playing");
  };

  const handleAsk = async () => {
    if (!question.trim() || !character || loading) return;
    const q = question.trim();
    setQuestion("");
    setLoading(true);
    try {
      const result = await askQuestion.mutateAsync({
        characterName: character.name,
        question: q,
        history: conversation.map(c => ({ q: c.q, a: c.a })),
      });
      setConversation(prev => [...prev, { q, a: result.answer }]);
    } catch {
      setConversation(prev => [...prev, { q, a: "I cannot answer that right now!" }]);
    } finally {
      setLoading(false);
    }
  };

  const useHint = () => {
    if (!character || hintsUsed >= character.hints.length) return;
    const hint = character.hints[hintsUsed];
    setConversation(prev => [...prev, { q: "💡 Hint", a: hint }]);
    setHintsUsed(h => h + 1);
  };

  const handleGuessCorrect = async () => {
    setWon(true);
    setRevealed(true);
    if (participantId) {
      await saveMission.mutateAsync({
        participantId,
        missionId: "who-am-i",
        score: conversation.length <= 5 ? 150 : conversation.length <= 8 ? 100 : 60,
        completed: true,
        answers: { character: character?.name, questions: conversation.length },
      });
    }
    setStep("result");
  };

  const handleGiveUp = () => {
    setRevealed(true);
    setWon(false);
    setStep("result");
  };

  const drinkRule = WHO_AM_I_DRINK_RULES[Math.floor(Math.random() * WHO_AM_I_DRINK_RULES.length)];
  const questionCount = conversation.filter(c => c.q !== "💡 Hint").length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a1f0e 0%, #1a3a1e 100%)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button onClick={() => navigate("/events/hub")} className="text-gray-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">🕵️ Who Am I?</h1>
          <p className="text-xs text-gray-400">Drinking Game · St. Patrick's Night</p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full">

        {/* SELECT CATEGORY */}
        {step === "select-category" && (
          <div className="space-y-4 mt-4">
            <div className="rounded-2xl p-4 mb-2" style={{ background: "rgba(64,145,108,0.15)", border: "1px solid #40916c44" }}>
              <p className="text-sm text-gray-300 text-center">
                A IA "vira" um personagem famoso. Faça perguntas em inglês — ela só responde <strong className="text-white">Yes</strong> ou <strong className="text-white">No</strong>.<br />
                <span className="text-green-400 font-semibold">Máximo 10 perguntas. Não acertou? Bebe! 🍺</span>
              </p>
            </div>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => pickCharacter(cat.id)}
                className="w-full rounded-2xl p-4 text-left transition-all active:scale-95"
                style={{ background: `${cat.color}22`, border: `1.5px solid ${cat.color}66` }}
              >
                <span className="text-base font-bold text-white">{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* PLAYING */}
        {step === "playing" && character && (
          <div className="mt-2 space-y-3">
            {/* Stats bar */}
            <div className="flex items-center justify-between rounded-xl px-4 py-2"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #ffffff15" }}>
              <span className="text-xs text-gray-400">{character.categoryLabel}</span>
              <span className="text-xs font-semibold text-yellow-400">
                {questionCount}/10 perguntas
              </span>
              <button onClick={useHint} disabled={hintsUsed >= character.hints.length}
                className="text-xs text-blue-400 disabled:text-gray-600 flex items-center gap-1">
                <HelpCircle size={12} /> Hint ({character.hints.length - hintsUsed})
              </button>
            </div>

            {/* Conversation */}
            <div className="rounded-2xl p-4 space-y-2 min-h-[200px] max-h-[320px] overflow-y-auto"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid #ffffff15" }}>
              {conversation.length === 0 && (
                <p className="text-gray-500 text-sm text-center pt-4">
                  Ask me anything in English!<br />
                  <span className="text-xs">I'll only say Yes or No 😏</span>
                </p>
              )}
              {conversation.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-end">
                    <span className="bg-green-800 text-white text-sm px-3 py-1 rounded-2xl rounded-tr-sm max-w-[80%]">
                      {item.q}
                    </span>
                  </div>
                  <div className="flex justify-start">
                    <span className="text-sm px-3 py-1 rounded-2xl rounded-tl-sm max-w-[80%]"
                      style={{ background: "rgba(255,255,255,0.1)", color: item.a === "Yes!" ? "#40916c" : item.a === "No!" ? "#e76f51" : "#e9c46a" }}>
                      {item.a}
                    </span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <span className="text-sm px-3 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <Loader2 size={14} className="animate-spin text-gray-400" />
                  </span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAsk()}
                placeholder="Are you a musician?"
                className="flex-1 bg-gray-800 border-gray-600 text-white rounded-xl"
                disabled={loading || questionCount >= 10}
              />
              <Button onClick={handleAsk} disabled={!question.trim() || loading || questionCount >= 10}
                className="rounded-xl px-4" style={{ background: "#40916c" }}>
                Ask
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleGuessCorrect}
                className="flex-1 h-11 rounded-xl font-bold"
                style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}>
                ✅ Acertei!
              </Button>
              <Button onClick={handleGiveUp} variant="outline"
                className="flex-1 h-11 rounded-xl border-red-800 text-red-400">
                <Eye size={16} className="mr-1" /> Revelar
              </Button>
            </div>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && character && (
          <div className="mt-4 space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-2">{won ? "🏆" : "😅"}</div>
              <h2 className="text-2xl font-black text-white">{character.name}</h2>
              <p className="text-sm text-gray-400 mt-1">{character.categoryLabel}</p>
            </div>

            <div className="rounded-2xl p-4 text-center" style={{
              background: won ? "rgba(64,145,108,0.2)" : "rgba(231,111,81,0.2)",
              border: `1.5px solid ${won ? "#40916c" : "#e76f51"}55`
            }}>
              <p className="text-base font-bold text-white">
                {won
                  ? `🎉 Acertou em ${questionCount} pergunta${questionCount !== 1 ? "s" : ""}! Escolha quem bebe! 🍺`
                  : `😅 Não acertou! ${drinkRule}`}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep("select-category")} variant="outline"
                className="flex-1 h-12 rounded-xl border-gray-600 text-gray-300">
                <RefreshCw size={16} className="mr-2" /> Nova Categoria
              </Button>
              <Button onClick={() => pickCharacter(character.category)}
                className="flex-1 h-12 rounded-xl"
                style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}>
                <Beer size={16} className="mr-2" /> Jogar Novamente
              </Button>
            </div>
            <Button onClick={() => navigate("/events/hub")} variant="ghost"
              className="w-full text-gray-500 text-sm">
              Voltar ao Hub
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
