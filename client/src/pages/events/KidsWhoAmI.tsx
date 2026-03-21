import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { KIDS_CHARACTERS, KIDS_FORFEITS, KIDS_CHARACTER_CATEGORIES, type KidsCharacter } from "@/data/stpatricks/drinking-games";
import { trpc } from "@/lib/trpc";

interface Message { role: "user" | "ai"; text: string; }

function randomForfeit() {
  return KIDS_FORFEITS[Math.floor(Math.random() * KIDS_FORFEITS.length)];
}

export default function KidsWhoAmI() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"select" | "playing" | "guess" | "result">("select");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [current, setCurrent] = useState<KidsCharacter | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [questionsLeft, setQuestionsLeft] = useState(10);
  const [guess, setGuess] = useState("");
  const [won, setWon] = useState<boolean | null>(null);
  const [forfeit, setForfeit] = useState(KIDS_FORFEITS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const askMutation = trpc.culturalEvents.whoAmIAnswer.useMutation();

  const startGame = () => {
    const pool = selectedCategory === "all"
      ? KIDS_CHARACTERS
      : KIDS_CHARACTERS.filter(c => c.category === selectedCategory);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(pick);
    setMessages([{ role: "ai", text: `I'm thinking of a character... 🤔 Ask me Yes/No questions to find out who I am! You have 10 questions. Good luck! 🍀` }]);
    setQuestionsLeft(10);
    setGuess("");
    setWon(null);
    setForfeit(randomForfeit());
    setStep("playing");
  };

  const askQuestion = async () => {
    if (!question.trim() || !current || isLoading) return;
    const q = question.trim();
    setQuestion("");
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setIsLoading(true);
    const newLeft = questionsLeft - 1;
    setQuestionsLeft(newLeft);
    try {
      const res = await askMutation.mutateAsync({
        characterName: current.name,
        question: q,
        history: messages.filter(m => m.role === "user").map(m => ({ q: m.text, a: "" })),
      });
      setMessages(prev => [...prev, { role: "ai", text: res.answer }]);
      if (newLeft === 0) setStep("guess");
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Hmm... I'm not sure! Try another question! 🤔" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitGuess = () => {
    if (!guess.trim() || !current) return;
    const correct = guess.trim().toLowerCase().includes(current.name.toLowerCase()) ||
      current.name.toLowerCase().includes(guess.trim().toLowerCase());
    setWon(correct);
    setStep("result");
  };

  const reset = () => {
    setStep("select");
    setCurrent(null);
    setMessages([]);
    setQuestionsLeft(10);
    setGuess("");
    setWon(null);
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: "linear-gradient(180deg, #0a1628 0%, #1a0a2e 100%)" }}>
      <div className="max-w-lg mx-auto px-4 pt-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/events/kids")} className="text-white/50 hover:text-white text-2xl">←</button>
          <div>
            <h1 className="text-white font-black text-xl">🕵️ Who Am I?</h1>
            <p className="text-white/40 text-xs">Kids Edition · St. Patrick's Night</p>
          </div>
        </div>

        {/* SELECT CATEGORY */}
        {step === "select" && (
          <div>
            <p className="text-white/70 text-center mb-5 text-sm">Ask Yes/No questions to discover who I am! 🎭</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {KIDS_CHARACTER_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="rounded-2xl p-4 text-center font-bold text-sm transition-all"
                  style={{
                    background: selectedCategory === cat.id ? `${cat.color}22` : "rgba(255,255,255,0.04)",
                    border: `2px solid ${selectedCategory === cat.id ? cat.color : "rgba(255,255,255,0.1)"}`,
                    color: selectedCategory === cat.id ? cat.color : "rgba(255,255,255,0.6)",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <Button
              onClick={startGame}
              className="w-full h-14 rounded-2xl font-black text-lg"
              style={{ background: "linear-gradient(135deg, #f72585, #7209b7)" }}
            >
              Start Game! 🎮
            </Button>
          </div>
        )}

        {/* PLAYING */}
        {step === "playing" && current && (
          <div>
            {/* Questions counter */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/50 text-sm">Questions left:</span>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full"
                    style={{ background: i < questionsLeft ? "#f72585" : "rgba(255,255,255,0.1)" }}
                  />
                ))}
              </div>
            </div>

            {/* Messages */}
            <div
              className="rounded-2xl p-4 mb-4 space-y-3 overflow-y-auto"
              style={{ maxHeight: "320px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="rounded-2xl px-4 py-2 text-sm max-w-xs"
                    style={{
                      background: msg.role === "user" ? "rgba(247,37,133,0.3)" : "rgba(114,9,183,0.3)",
                      color: "white",
                    }}
                  >
                    {msg.role === "ai" && <span className="mr-1">🤖</span>}
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-2 text-sm" style={{ background: "rgba(114,9,183,0.3)", color: "white" }}>
                    🤖 Thinking... ⏳
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 mb-3">
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && askQuestion()}
                placeholder="Ask a Yes/No question..."
                className="flex-1 rounded-2xl px-4 py-3 text-white text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
                disabled={isLoading}
              />
              <button
                onClick={askQuestion}
                disabled={!question.trim() || isLoading}
                className="rounded-2xl px-5 font-black text-white"
                style={{ background: "linear-gradient(135deg, #f72585, #7209b7)" }}
              >
                Ask!
              </button>
            </div>

            <Button
              onClick={() => setStep("guess")}
              variant="outline"
              className="w-full h-11 rounded-2xl border-green-500/40 text-green-400 font-bold"
            >
              🎯 I know who it is!
            </Button>
          </div>
        )}

        {/* GUESS */}
        {step === "guess" && current && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-white font-black text-xl mb-2">Who is it?</h2>
            <p className="text-white/50 text-sm mb-5">Type your answer below!</p>
            <input
              value={guess}
              onChange={e => setGuess(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitGuess()}
              placeholder="Type the character's name..."
              className="w-full rounded-2xl px-4 py-4 text-white text-lg text-center outline-none mb-4"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)" }}
            />
            <Button
              onClick={submitGuess}
              disabled={!guess.trim()}
              className="w-full h-14 rounded-2xl font-black text-lg"
              style={{ background: "linear-gradient(135deg, #06d6a0, #0077b6)" }}
            >
              That's my answer! 🎉
            </Button>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && current && won !== null && (
          <div className="text-center">
            <div className="text-7xl mb-3">{won ? "🏆" : "😅"}</div>
            <h2 className="text-white font-black text-2xl mb-1">
              {won ? "You got it! 🎉" : "Not quite! 😄"}
            </h2>
            <p className="text-white/60 text-sm mb-4">
              The character was: <span className="text-white font-black">{current.emoji} {current.name}</span>
            </p>

            {/* Hints reveal */}
            <div
              className="rounded-2xl p-4 mb-4 text-left"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <p className="text-white/50 text-xs mb-2">Clues about {current.name}:</p>
              {current.hints.map((h, i) => (
                <p key={i} className="text-white/70 text-sm">• {h}</p>
              ))}
            </div>

            {!won && (
              <div
                className="rounded-2xl p-4 mb-4"
                style={{ background: "rgba(255,209,102,0.1)", border: "2px solid rgba(255,209,102,0.4)" }}
              >
                <p className="text-yellow-300 font-black text-base mb-1">🎯 Fun Challenge!</p>
                <p className="text-white/80 text-sm">{forfeit.emoji} {forfeit.text}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={startGame}
                className="flex-1 h-12 rounded-2xl font-bold"
                style={{ background: "linear-gradient(135deg, #f72585, #7209b7)" }}
              >
                Play Again! 🔄
              </Button>
              <Button onClick={reset} variant="outline" className="h-12 px-5 rounded-2xl border-white/20 text-white/70 font-bold">
                Categories
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
