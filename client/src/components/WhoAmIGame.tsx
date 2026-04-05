import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, HelpCircle, Loader2, RefreshCw, Beer, Send, UserSearch } from "lucide-react";
import { WHO_AM_I_CHARACTERS, WHO_AM_I_CATEGORIES_EXTENDED, type WhoAmICharacter } from "@/data/stpatricks/drinking-games";

type GameStep = "select-category" | "playing" | "guessing" | "result";

const CATEGORIES = WHO_AM_I_CATEGORIES_EXTENDED;

const MAX_QUESTIONS = 10;

export default function WhoAmIGame() {
  const [, navigate] = useLocation();
  const [character, setCharacter] = useState<WhoAmICharacter | null>(null);
  const [step, setStep] = useState<GameStep>("select-category");
  const [question, setQuestion] = useState("");
  const [guessInput, setGuessInput] = useState("");
  const [conversation, setConversation] = useState<Array<{ q: string; a: string; isHint?: boolean }>>([]);
  const [loading, setLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [won, setWon] = useState(false);
  const [wrongGuess, setWrongGuess] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const participantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");
  const askQuestion = trpc.culturalEvents.whoAmIAnswer.useMutation();
  const saveMission = trpc.culturalEvents.saveMissionProgress.useMutation();

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, loading]);

  const questionCount = conversation.filter(c => !c.isHint).length;
  const questionsLeft = MAX_QUESTIONS - questionCount;
  const outOfQuestions = questionsLeft <= 0;

  const pickCharacter = (categoryId: string) => {
    const pool = categoryId === "all"
      ? WHO_AM_I_CHARACTERS
      : WHO_AM_I_CHARACTERS.filter(c => c.category === categoryId);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setCharacter(picked);
    setConversation([]);
    setHintsUsed(0);
    setWon(false);
    setWrongGuess(false);
    setQuestion("");
    setGuessInput("");
    setStep("playing");
  };

  const handleAsk = async () => {
    if (!question.trim() || !character || loading || outOfQuestions) return;
    const q = question.trim();
    setQuestion("");
    setLoading(true);
    try {
      const result = await askQuestion.mutateAsync({
        characterName: character.name,
        question: q,
        history: conversation.filter(c => !c.isHint).map(c => ({ q: c.q, a: c.a })),
      });
      const newConv = [...conversation, { q, a: result.answer }];
      setConversation(newConv);
      // After last question, force guess phase
      const newQCount = newConv.filter(c => !c.isHint).length;
      if (newQCount >= MAX_QUESTIONS) {
        setTimeout(() => setStep("guessing"), 600);
      }
    } catch {
      setConversation(prev => [...prev, { q, a: "Hmm, I can't answer that!" }]);
    } finally {
      setLoading(false);
    }
  };

  const useHint = () => {
    if (!character || hintsUsed >= character.hints.length) return;
    const hint = character.hints[hintsUsed];
    setConversation(prev => [...prev, { q: "💡 Dica solicitada", a: `Hint: ${hint}`, isHint: true }]);
    setHintsUsed(h => h + 1);
  };

  const handleGuess = async () => {
    if (!guessInput.trim() || !character) return;
    const guess = guessInput.trim().toLowerCase();
    const correct = character.name.toLowerCase();
    // Accept partial match (e.g. "Taylor" matches "Taylor Swift")
    const isCorrect = correct.includes(guess) || guess.includes(correct.split(" ")[0].toLowerCase());
    if (isCorrect) {
      setWon(true);
      if (participantId) {
        const score = questionCount <= 4 ? 150 : questionCount <= 7 ? 100 : 60;
        await saveMission.mutateAsync({
          participantId,
          missionId: "who-am-i",
          score,
          completed: true,
          answers: { character: character.name, questions: questionCount, hintsUsed },
        });
      }
      setStep("result");
    } else {
      setWrongGuess(true);
      setTimeout(() => setWrongGuess(false), 1500);
      setGuessInput("");
    }
  };

  const handleGiveUp = () => {
    setWon(false);
    setStep("result");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a1f0e 0%, #1a3a1e 100%)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-3">
        <button onClick={() => navigate("/events/hub")} className="text-gray-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">🕵️ Who Am I?</h1>
          <p className="text-xs text-gray-400">Drinking Game · St. Patrick's Night</p>
        </div>
        {step === "playing" && (
          <div className="text-right">
            <span className={`text-sm font-bold ${questionsLeft <= 3 ? "text-red-400" : "text-yellow-400"}`}>
              {questionsLeft} perguntas
            </span>
            <p className="text-xs text-gray-500">restantes</p>
          </div>
        )}
      </div>

      <div className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full flex flex-col">

        {/* ── SELECT CATEGORY ── */}
        {step === "select-category" && (
          <div className="space-y-4 mt-4">
            {/* Regras */}
            <div className="rounded-2xl p-4" style={{ background: "rgba(64,145,108,0.15)", border: "1px solid #40916c44" }}>
              <p className="text-sm font-bold text-green-300 mb-2 text-center">Como jogar</p>
              <div className="space-y-1 text-sm text-gray-300">
                <p>🕵️ A IA "vira" um personagem famoso secreto</p>
                <p>❓ Você faz até <strong className="text-white">10 perguntas</strong> em inglês (Yes/No)</p>
                <p>🎯 Quando achar que sabe, tente adivinhar o nome</p>
                <p>🍺 Não acertou? <strong className="text-red-400">Você bebe!</strong></p>
                <p>🏆 Acertou rápido? <strong className="text-green-400">Escolhe quem bebe!</strong></p>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 uppercase tracking-widest">Escolha a categoria</p>
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

        {/* ── PLAYING ── */}
        {step === "playing" && character && (
          <div className="flex flex-col flex-1 mt-2 gap-3">
            {/* Category badge + hint button */}
            <div className="flex items-center justify-between rounded-xl px-4 py-2"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #ffffff15" }}>
              <span className="text-xs text-gray-400">{character.categoryLabel} · {character.difficulty}</span>
              <button
                onClick={useHint}
                disabled={hintsUsed >= character.hints.length || loading}
                className="text-xs text-blue-400 disabled:text-gray-600 flex items-center gap-1 transition-opacity"
              >
                <HelpCircle size={12} />
                Hint ({character.hints.length - hintsUsed} restante{character.hints.length - hintsUsed !== 1 ? "s" : ""})
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-gray-800">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${(questionCount / MAX_QUESTIONS) * 100}%`,
                  background: questionsLeft <= 3 ? "#e76f51" : "#40916c"
                }}
              />
            </div>

            {/* Chat area */}
            <div
              className="flex-1 rounded-2xl p-4 space-y-2 overflow-y-auto"
              style={{ minHeight: 220, maxHeight: 340, background: "rgba(0,0,0,0.35)", border: "1px solid #ffffff12" }}
            >
              {conversation.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-2 py-6">
                  <UserSearch size={36} className="text-green-700" />
                  <p className="text-gray-400 text-sm text-center">
                    I'm thinking of someone famous...<br />
                    <span className="text-xs text-gray-500">Ask me yes/no questions in English! 😏</span>
                  </p>
                </div>
              )}
              {conversation.map((item, i) => (
                <div key={i} className="space-y-1">
                  {item.isHint ? (
                    <div className="flex justify-center">
                      <span className="text-xs px-3 py-1 rounded-full text-blue-300"
                        style={{ background: "rgba(76,201,240,0.12)", border: "1px solid #4cc9f044" }}>
                        {item.a}
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Player question */}
                      <div className="flex justify-end">
                        <span className="text-sm px-3 py-2 rounded-2xl rounded-tr-sm max-w-[80%] text-white"
                          style={{ background: "#2d6a4f" }}>
                          {item.q}
                        </span>
                      </div>
                      {/* AI answer */}
                      <div className="flex justify-start items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                          style={{ background: "#1a3a1e", border: "1px solid #40916c44" }}>🕵️</div>
                        <span
                          className="text-base font-bold px-4 py-2 rounded-2xl rounded-tl-sm"
                          style={{
                            background: item.a === "Yes!" ? "rgba(64,145,108,0.25)" : item.a === "No!" ? "rgba(231,111,81,0.25)" : "rgba(233,196,106,0.2)",
                            color: item.a === "Yes!" ? "#74c69d" : item.a === "No!" ? "#f4a261" : "#e9c46a",
                            border: `1px solid ${item.a === "Yes!" ? "#40916c55" : item.a === "No!" ? "#e76f5155" : "#e9c46a44"}`
                          }}>
                          {item.a}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    style={{ background: "#1a3a1e", border: "1px solid #40916c44" }}>🕵️</div>
                  <span className="px-4 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <Loader2 size={14} className="animate-spin text-gray-400" />
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Warning when running low */}
            {questionsLeft <= 3 && questionsLeft > 0 && (
              <div className="text-center rounded-xl py-2 px-3 text-xs font-semibold text-orange-300"
                style={{ background: "rgba(231,111,81,0.15)", border: "1px solid #e76f5144" }}>
                ⚠️ Só {questionsLeft} pergunta{questionsLeft !== 1 ? "s" : ""} restante{questionsLeft !== 1 ? "s" : ""}! Já sabe quem é?
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAsk()}
                placeholder="Are you a musician? Are you alive?"
                className="flex-1 bg-gray-800/80 border-gray-600 text-white rounded-xl placeholder:text-gray-500"
                disabled={loading || outOfQuestions}
              />
              <Button
                onClick={handleAsk}
                disabled={!question.trim() || loading || outOfQuestions}
                className="rounded-xl px-4"
                style={{ background: "#40916c" }}
              >
                <Send size={16} />
              </Button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => setStep("guessing")}
                className="flex-1 h-11 rounded-xl font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
              >
                🎯 Já sei quem é!
              </Button>
              <Button
                onClick={handleGiveUp}
                variant="outline"
                className="h-11 rounded-xl border-red-800/60 text-red-400 text-sm px-4"
              >
                Desistir
              </Button>
            </div>
          </div>
        )}

        {/* ── GUESSING ── */}
        {step === "guessing" && character && (
          <div className="mt-6 space-y-5">
            <div className="text-center">
              <div className="text-5xl mb-3">🎯</div>
              <h2 className="text-xl font-bold text-white">Quem é o personagem?</h2>
              <p className="text-sm text-gray-400 mt-1">
                {outOfQuestions
                  ? "Acabaram as perguntas! Última chance..."
                  : `Você usou ${questionCount} pergunta${questionCount !== 1 ? "s" : ""}. Arrisque!`}
              </p>
            </div>

            {/* Recap das respostas Yes */}
            {conversation.filter(c => !c.isHint && c.a === "Yes!").length > 0 && (
              <div className="rounded-xl p-3" style={{ background: "rgba(64,145,108,0.1)", border: "1px solid #40916c33" }}>
                <p className="text-xs text-gray-500 mb-2">✅ O que sabemos (Yes!):</p>
                <div className="flex flex-wrap gap-1">
                  {conversation.filter(c => !c.isHint && c.a === "Yes!").map((c, i) => (
                    <span key={i} className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded-full border border-green-800/40">
                      {c.q}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Input
                value={guessInput}
                onChange={e => setGuessInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGuess()}
                placeholder="Digite o nome do personagem..."
                className={`w-full h-14 text-base text-center font-semibold rounded-xl transition-all ${
                  wrongGuess
                    ? "bg-red-900/40 border-red-500 text-red-300"
                    : "bg-gray-800 border-gray-600 text-white"
                }`}
                autoFocus
              />
              {wrongGuess && (
                <p className="text-center text-sm text-red-400 font-semibold animate-pulse">
                  ❌ Errou! Tente de novo...
                </p>
              )}
              <Button
                onClick={handleGuess}
                disabled={!guessInput.trim()}
                className="w-full h-14 rounded-xl font-black text-base"
                style={{ background: "linear-gradient(135deg, #e9c46a, #f4a261)" }}
              >
                🎯 Confirmar Resposta
              </Button>
              <Button
                onClick={handleGiveUp}
                variant="ghost"
                className="w-full text-gray-500 text-sm"
              >
                Revelar e desistir 🍺
              </Button>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && character && (
          <div className="mt-4 space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-3">{won ? "🏆" : "😅"}</div>
              <p className="text-gray-400 text-sm mb-1">O personagem era...</p>
              <h2 className="text-3xl font-black text-white">{character.name}</h2>
              <p className="text-sm text-gray-400 mt-1">{character.categoryLabel}</p>
            </div>

            <div
              className="rounded-2xl p-5 text-center"
              style={{
                background: won ? "rgba(64,145,108,0.2)" : "rgba(231,111,81,0.2)",
                border: `1.5px solid ${won ? "#40916c" : "#e76f51"}55`
              }}
            >
              {won ? (
                <>
                  <p className="text-xl font-black text-green-300 mb-1">🎉 Acertou!</p>
                  <p className="text-sm text-gray-300">
                    {questionCount <= 4
                      ? `Em apenas ${questionCount} perguntas! Você é incrível — escolha 2 pessoas para beber! 🍺🍺`
                      : questionCount <= 7
                      ? `Em ${questionCount} perguntas. Boa! Escolha alguém para beber! 🍺`
                      : `Em ${questionCount} perguntas. Conseguiu! Escolha alguém para beber! 🍺`}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl font-black text-red-300 mb-1">😅 Não acertou!</p>
                  <p className="text-sm text-gray-300">
                    Você bebe! 🍺 Tente de novo com um personagem diferente!
                  </p>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl py-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-lg font-bold text-white">{questionCount}</p>
                <p className="text-xs text-gray-500">perguntas</p>
              </div>
              <div className="rounded-xl py-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-lg font-bold text-white">{hintsUsed}</p>
                <p className="text-xs text-gray-500">hints usados</p>
              </div>
              <div className="rounded-xl py-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-lg font-bold text-white">{won ? (questionCount <= 4 ? "150" : questionCount <= 7 ? "100" : "60") : "0"}</p>
                <p className="text-xs text-gray-500">pontos</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep("select-category")}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-gray-600 text-gray-300"
              >
                <RefreshCw size={16} className="mr-2" /> Nova Categoria
              </Button>
              <Button
                onClick={() => pickCharacter(character.category)}
                className="flex-1 h-12 rounded-xl"
                style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
              >
                <Beer size={16} className="mr-2" /> Jogar Novamente
              </Button>
            </div>
            <Button
              onClick={() => navigate("/events/hub")}
              variant="ghost"
              className="w-full text-gray-500 text-sm"
            >
              Voltar ao Hub
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
