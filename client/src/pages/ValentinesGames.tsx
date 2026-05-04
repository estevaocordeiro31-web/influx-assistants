import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, Shuffle, Heart, Timer, Trophy, Star, Check, X,
  Sparkles, MessageCircle, ArrowRight, Volume2
} from "lucide-react";
import {
  WORD_SCRAMBLES, LOVE_MATCHES, TONGUE_TWISTERS,
  SPEED_DATING_QUESTIONS, EMOJI_PUZZLES,
  type WordScramble, type LoveMatch, type TongueTwister,
  type SpeedDatingQuestion, type EmojiPuzzle
} from "@/data/valentines/games";
import { CHARACTER_IMAGES } from "@/data/valentines/chunks";

type GameType = "menu" | "scramble" | "match" | "tongue" | "emoji" | "speed";

export default function ValentinesGames() {
  const [, navigate] = useLocation();
  const [game, setGame] = useState<GameType>("menu");
  const [isTeens, setIsTeens] = useState(false);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #1a0011 0%, #2d0a1e 30%, #1a0011 60%, #0d0008 100%)",
      }}
    >
      <FallingHeartsGames />

      {game === "menu" ? (
        <GamesMenu
          onSelect={setGame}
          onBack={() => navigate("/events/valentines")}
          isTeens={isTeens}
          setIsTeens={setIsTeens}
        />
      ) : game === "scramble" ? (
        <WordScrambleGame onBack={() => setGame("menu")} />
      ) : game === "match" ? (
        <LoveMatchGame onBack={() => setGame("menu")} />
      ) : game === "tongue" ? (
        <TongueTwisterGame onBack={() => setGame("menu")} />
      ) : game === "emoji" ? (
        <EmojiDecoderGame onBack={() => setGame("menu")} />
      ) : game === "speed" ? (
        <SpeedDatingGame onBack={() => setGame("menu")} isTeens={isTeens} />
      ) : null}

      <style>{`
        @keyframes fadeInGames {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(233,30,99,0.2); }
          50% { box-shadow: 0 0 25px rgba(233,30,99,0.4); }
        }
        @keyframes heartFallGames {
          0% { transform: translateY(-40px) rotate(0deg); opacity: 0; }
          5% { opacity: 0.3; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
        @keyframes shimmerGames {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

// ─── GAMES MENU ─────────────────────────────────────────────
function GamesMenu({
  onSelect,
  onBack,
  isTeens,
  setIsTeens,
}: {
  onSelect: (g: GameType) => void;
  onBack: () => void;
  isTeens: boolean;
  setIsTeens: (v: boolean) => void;
}) {
  const games = [
    { id: "scramble" as GameType, emoji: "🔤", title: "Word Scramble", desc: "Desembaralhe as letras!", points: "120pts" },
    { id: "match" as GameType, emoji: "💕", title: "Love Match", desc: "Conecte expressões ao significado!", points: "120pts" },
    { id: "emoji" as GameType, emoji: "🧩", title: "Emoji Decoder", desc: "Adivinhe a expressão pelos emojis!", points: "150pts" },
    { id: "tongue" as GameType, emoji: "👅", title: "Tongue Twisters", desc: "Trava-línguas em inglês!", points: "∞" },
    { id: "speed" as GameType, emoji: "💬", title: "Speed Dating", desc: "Perguntas para quebrar o gelo!", points: "Social" },
  ];

  return (
    <div className="relative z-10 max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6" style={{ animation: "fadeInGames 0.4s ease both" }}>
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ChevronLeft size={18} className="text-white/70" />
        </button>
        <div>
          <h1 className="text-lg font-black text-white">Games Arena</h1>
          <p className="text-pink-300/50 text-[0.6rem]">Valentine's Day Edition</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[0.55rem] text-pink-300/50">Teens</span>
          <button
            onClick={() => setIsTeens(!isTeens)}
            className="w-10 h-5 rounded-full relative transition-all"
            style={{
              background: isTeens ? "rgba(233,30,99,0.4)" : "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div
              className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
              style={{
                left: isTeens ? "22px" : "2px",
                background: isTeens ? "#e91e63" : "rgba(255,255,255,0.3)",
              }}
            />
          </button>
        </div>
      </div>

      {/* Characters */}
      <div
        className="flex justify-center gap-3 mb-5"
        style={{ animation: "fadeInGames 0.5s 0.1s ease both" }}
      >
        {(["lucas", "emily", "aiko"] as const).map((c) => (
          <img
            key={c}
            src={CHARACTER_IMAGES[c][isTeens ? "teen" : "adult"]}
            alt={c}
            className="w-14 h-14 rounded-full object-cover"
            style={{
              border: "2px solid rgba(233,30,99,0.3)",
              boxShadow: "0 0 15px rgba(233,30,99,0.15)",
            }}
          />
        ))}
      </div>

      {/* Game Cards */}
      <div className="flex flex-col gap-3">
        {games.map((g, i) => (
          <button
            key={g.id}
            onClick={() => onSelect(g.id)}
            className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.97]"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              animation: `fadeInGames 0.4s ${0.15 + i * 0.08}s ease both`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{g.emoji}</span>
              <div className="flex-1">
                <h3 className="text-white font-bold text-sm">{g.title}</h3>
                <p className="text-pink-300/50 text-[0.6rem]">{g.desc}</p>
              </div>
              <div
                className="px-2 py-1 rounded-full text-[0.55rem] font-bold"
                style={{
                  background: "rgba(233,30,99,0.15)",
                  color: "#f48fb1",
                  border: "1px solid rgba(233,30,99,0.2)",
                }}
              >
                {g.points}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── WORD SCRAMBLE GAME ─────────────────────────────────────
function WordScrambleGame({ onBack }: { onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const shuffled = useMemo(() => [...WORD_SCRAMBLES].sort(() => Math.random() - 0.5).slice(0, 8), []);
  const current = shuffled[currentIndex];

  useEffect(() => {
    if (gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleNext(false);
          return 30;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIndex, gameOver]);

  const handleSubmit = () => {
    const correct = input.toUpperCase().trim() === current.word;
    setIsCorrect(correct);
    if (correct) setScore((s) => s + current.points);
    setShowResult(true);
    setTimeout(() => handleNext(correct), 1500);
  };

  const handleNext = (wasCorrect: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowResult(false);
    setInput("");
    setTimeLeft(30);
    if (currentIndex >= shuffled.length - 1) {
      setGameOver(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (gameOver) {
    return (
      <GameOverScreen
        title="Word Scramble"
        score={score}
        maxScore={shuffled.reduce((s, w) => s + w.points, 0)}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="relative z-10 max-w-md mx-auto px-4 py-6">
      <GameHeader title="Word Scramble" onBack={onBack} score={score} progress={`${currentIndex + 1}/${shuffled.length}`} />

      <div
        className="rounded-2xl p-5 mt-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          animation: "fadeInGames 0.4s ease both",
        }}
      >
        {/* Timer */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Timer size={14} className={timeLeft <= 10 ? "text-red-400" : "text-pink-400"} />
            <span className={`text-sm font-bold ${timeLeft <= 10 ? "text-red-400" : "text-white"}`}>
              {timeLeft}s
            </span>
          </div>
          <span className="text-[0.55rem] text-pink-300/50 px-2 py-0.5 rounded-full" style={{ background: "rgba(233,30,99,0.1)" }}>
            {current.category}
          </span>
        </div>

        {/* Scrambled word */}
        <div className="text-center mb-4">
          <div
            className="text-2xl font-black text-white tracking-[0.3em] mb-2"
            style={{ fontFamily: "monospace" }}
          >
            {current.scrambled}
          </div>
          <p className="text-pink-300/60 text-xs">💡 {current.hint}</p>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Type the word..."
            className="flex-1 rounded-xl px-4 py-2.5 text-white text-sm font-bold tracking-wider"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: showResult
                ? isCorrect ? "1px solid #4caf50" : "1px solid #f44336"
                : "1px solid rgba(255,255,255,0.1)",
              outline: "none",
              animation: showResult && !isCorrect ? "shake 0.3s ease" : undefined,
            }}
          />
          <Button
            onClick={handleSubmit}
            className="rounded-xl px-4"
            style={{ background: "linear-gradient(135deg, #e91e63, #880E4F)" }}
          >
            <Check size={18} />
          </Button>
        </div>

        {/* Result feedback */}
        {showResult && (
          <div
            className="mt-3 text-center text-sm font-bold"
            style={{ animation: "bounceIn 0.3s ease" }}
          >
            {isCorrect ? (
              <span className="text-green-400">✨ Correct! +{current.points}pts</span>
            ) : (
              <span className="text-red-400">❌ Answer: {current.word}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LOVE MATCH GAME ────────────────────────────────────────
function LoveMatchGame({ onBack }: { onBack: () => void }) {
  const [pairs] = useState(() => [...LOVE_MATCHES].sort(() => Math.random() - 0.5).slice(0, 6));
  const [selectedExpr, setSelectedExpr] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const meanings = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [pairs]);

  const handleMeaningClick = (pair: LoveMatch) => {
    if (!selectedExpr) return;
    if (pair.id === selectedExpr) {
      setMatched((m) => new Set([...m, pair.id]));
      setScore((s) => s + 20);
      setSelectedExpr(null);
    } else {
      setWrong(pair.id);
      setTimeout(() => setWrong(null), 600);
      setSelectedExpr(null);
    }
  };

  if (matched.size === pairs.length) {
    return <GameOverScreen title="Love Match" score={score} maxScore={pairs.length * 20} onBack={onBack} />;
  }

  return (
    <div className="relative z-10 max-w-md mx-auto px-4 py-6">
      <GameHeader title="Love Match" onBack={onBack} score={score} progress={`${matched.size}/${pairs.length}`} />

      <p className="text-pink-300/50 text-[0.6rem] text-center mt-2 mb-4">
        Toque na expressão e depois no significado correto!
      </p>

      <div className="grid grid-cols-2 gap-2">
        {/* Expressions column */}
        <div className="flex flex-col gap-2">
          {pairs.map((p) => (
            <button
              key={`expr-${p.id}`}
              onClick={() => !matched.has(p.id) && setSelectedExpr(p.id)}
              disabled={matched.has(p.id)}
              className="rounded-xl p-3 text-left transition-all text-xs"
              style={{
                background: matched.has(p.id)
                  ? "rgba(76,175,80,0.15)"
                  : selectedExpr === p.id
                  ? "rgba(233,30,99,0.2)"
                  : "rgba(255,255,255,0.04)",
                border: matched.has(p.id)
                  ? "1px solid rgba(76,175,80,0.3)"
                  : selectedExpr === p.id
                  ? "1px solid rgba(233,30,99,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
                opacity: matched.has(p.id) ? 0.5 : 1,
              }}
            >
              <span className="text-white font-bold">{p.expression}</span>
            </button>
          ))}
        </div>

        {/* Meanings column */}
        <div className="flex flex-col gap-2">
          {meanings.map((p) => (
            <button
              key={`mean-${p.id}`}
              onClick={() => handleMeaningClick(p)}
              disabled={matched.has(p.id)}
              className="rounded-xl p-3 text-left transition-all text-xs"
              style={{
                background: matched.has(p.id)
                  ? "rgba(76,175,80,0.15)"
                  : wrong === p.id
                  ? "rgba(244,67,54,0.2)"
                  : "rgba(255,255,255,0.04)",
                border: matched.has(p.id)
                  ? "1px solid rgba(76,175,80,0.3)"
                  : wrong === p.id
                  ? "1px solid rgba(244,67,54,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
                opacity: matched.has(p.id) ? 0.5 : 1,
                animation: wrong === p.id ? "shake 0.3s ease" : undefined,
              }}
            >
              <span className="text-pink-200/80">{p.meaning}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TONGUE TWISTER GAME ────────────────────────────────────
function TongueTwisterGame({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState<TongueTwister>(TONGUE_TWISTERS[0]);
  const [level, setLevel] = useState<"easy" | "medium" | "hard" | "insane">("easy");

  const filtered = TONGUE_TWISTERS.filter((t) => t.level === level);

  const nextTwister = () => {
    const pool = filtered.filter((t) => t.id !== current.id);
    setCurrent(pool[Math.floor(Math.random() * pool.length)] || filtered[0]);
  };

  const levelColors: Record<string, string> = {
    easy: "#4caf50",
    medium: "#ff9800",
    hard: "#f44336",
    insane: "#9c27b0",
  };

  return (
    <div className="relative z-10 max-w-md mx-auto px-4 py-6">
      <GameHeader title="Tongue Twisters" onBack={onBack} score={0} progress={level} />

      {/* Level selector */}
      <div className="flex gap-2 mt-3 mb-4 justify-center">
        {(["easy", "medium", "hard", "insane"] as const).map((l) => (
          <button
            key={l}
            onClick={() => { setLevel(l); setCurrent(TONGUE_TWISTERS.filter(t => t.level === l)[0]); }}
            className="px-3 py-1 rounded-full text-[0.6rem] font-bold capitalize transition-all"
            style={{
              background: level === l ? `${levelColors[l]}30` : "rgba(255,255,255,0.04)",
              border: `1px solid ${level === l ? levelColors[l] : "rgba(255,255,255,0.1)"}`,
              color: level === l ? levelColors[l] : "rgba(255,255,255,0.5)",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Twister card */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          animation: "fadeInGames 0.4s ease both",
        }}
      >
        {current.valentineTheme && (
          <span className="text-[0.55rem] text-pink-400 mb-2 inline-block">❤️ Valentine's Edition</span>
        )}
        <p className="text-white text-lg font-bold leading-relaxed mb-4">
          "{current.text}"
        </p>
        <p className="text-pink-300/50 text-xs mb-5">💡 {current.tip}</p>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={nextTwister}
            className="rounded-xl gap-2"
            style={{ background: "linear-gradient(135deg, #e91e63, #880E4F)" }}
          >
            <Shuffle size={16} /> Next
          </Button>
        </div>
      </div>

      <p className="text-center text-pink-300/30 text-[0.55rem] mt-4">
        Dica: Tente falar 3x cada vez mais rápido! 🚀
      </p>
    </div>
  );
}

// ─── EMOJI DECODER GAME ─────────────────────────────────────
function EmojiDecoderGame({ onBack }: { onBack: () => void }) {
  const [puzzles] = useState(() => [...EMOJI_PUZZLES].sort(() => Math.random() - 0.5).slice(0, 8));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const current = puzzles[currentIndex];

  const handleSubmit = () => {
    const userAnswer = input.toLowerCase().trim();
    const correctAnswer = current.answer.toLowerCase();
    const correct = userAnswer === correctAnswer || correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + current.points);
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setInput("");
      setShowHint(false);
      if (currentIndex >= puzzles.length - 1) {
        setGameOver(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 2000);
  };

  if (gameOver) {
    return <GameOverScreen title="Emoji Decoder" score={score} maxScore={puzzles.reduce((s, p) => s + p.points, 0)} onBack={onBack} />;
  }

  return (
    <div className="relative z-10 max-w-md mx-auto px-4 py-6">
      <GameHeader title="Emoji Decoder" onBack={onBack} score={score} progress={`${currentIndex + 1}/${puzzles.length}`} />

      <div
        className="rounded-2xl p-5 mt-4 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          animation: "fadeInGames 0.4s ease both",
        }}
      >
        {/* Emojis */}
        <div className="text-4xl mb-4 tracking-wider" style={{ animation: "bounceIn 0.4s ease" }}>
          {current.emojis}
        </div>

        <p className="text-pink-300/50 text-xs mb-1">Qual expressão esses emojis representam?</p>

        {showHint && (
          <p className="text-amber-300/70 text-xs mb-3" style={{ animation: "fadeInGames 0.3s ease" }}>
            💡 {current.hint}
          </p>
        )}

        {!showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="text-[0.55rem] text-pink-400/60 underline mb-3 inline-block"
          >
            Need a hint?
          </button>
        )}

        {/* Input */}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Type the expression..."
            className="flex-1 rounded-xl px-4 py-2.5 text-white text-sm"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: showResult
                ? isCorrect ? "1px solid #4caf50" : "1px solid #f44336"
                : "1px solid rgba(255,255,255,0.1)",
              outline: "none",
            }}
          />
          <Button
            onClick={handleSubmit}
            className="rounded-xl px-4"
            style={{ background: "linear-gradient(135deg, #e91e63, #880E4F)" }}
          >
            <Check size={18} />
          </Button>
        </div>

        {showResult && (
          <div className="mt-3" style={{ animation: "bounceIn 0.3s ease" }}>
            {isCorrect ? (
              <span className="text-green-400 text-sm font-bold">✨ Correct! +{current.points}pts</span>
            ) : (
              <div>
                <span className="text-red-400 text-sm font-bold">❌ {current.answer}</span>
                <p className="text-pink-300/40 text-[0.55rem] mt-1">{current.answerPt}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SPEED DATING GAME ──────────────────────────────────────
function SpeedDatingGame({ onBack, isTeens }: { onBack: () => void; isTeens: boolean }) {
  const questions = useMemo(
    () => SPEED_DATING_QUESTIONS.filter((q) => isTeens ? q.forTeens : true).sort(() => Math.random() - 0.5),
    [isTeens]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [category, setCategory] = useState<"all" | "fun" | "deep" | "creative" | "spicy">("all");

  const filtered = category === "all" ? questions : questions.filter((q) => q.category === category);
  const current = filtered[currentIndex % filtered.length];

  const nextQuestion = () => setCurrentIndex((i) => (i + 1) % filtered.length);

  const categoryColors: Record<string, string> = {
    all: "#e91e63",
    fun: "#4caf50",
    deep: "#2196f3",
    creative: "#ff9800",
    spicy: "#f44336",
  };

  return (
    <div className="relative z-10 max-w-md mx-auto px-4 py-6">
      <GameHeader title="Speed Dating" onBack={onBack} score={0} progress="∞" />

      {/* Category selector */}
      <div className="flex gap-2 mt-3 mb-4 justify-center flex-wrap">
        {(["all", "fun", "deep", "creative", ...(isTeens ? [] : ["spicy"])] as const).map((c) => (
          <button
            key={c}
            onClick={() => { setCategory(c as any); setCurrentIndex(0); }}
            className="px-3 py-1 rounded-full text-[0.6rem] font-bold capitalize transition-all"
            style={{
              background: category === c ? `${categoryColors[c]}30` : "rgba(255,255,255,0.04)",
              border: `1px solid ${category === c ? categoryColors[c] : "rgba(255,255,255,0.1)"}`,
              color: category === c ? categoryColors[c] : "rgba(255,255,255,0.5)",
            }}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {/* Question card */}
      {current && (
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            animation: "fadeInGames 0.4s ease both",
          }}
        >
          <MessageCircle size={24} className="text-pink-400 mx-auto mb-3" />
          <p className="text-white text-base font-bold leading-relaxed mb-3">
            "{current.question}"
          </p>
          <p className="text-pink-300/40 text-xs mb-5">
            {current.questionPt}
          </p>

          <Button
            onClick={nextQuestion}
            className="rounded-xl gap-2"
            style={{ background: "linear-gradient(135deg, #e91e63, #880E4F)" }}
          >
            <ArrowRight size={16} /> Next Question
          </Button>
        </div>
      )}

      <p className="text-center text-pink-300/30 text-[0.55rem] mt-4">
        Use essas perguntas para praticar inglês em dupla! 💬
      </p>
    </div>
  );
}

// ─── SHARED COMPONENTS ──────────────────────────────────────
function GameHeader({
  title,
  onBack,
  score,
  progress,
}: {
  title: string;
  onBack: () => void;
  score: number;
  progress: string;
}) {
  return (
    <div className="flex items-center gap-3" style={{ animation: "fadeInGames 0.3s ease both" }}>
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <ChevronLeft size={18} className="text-white/70" />
      </button>
      <div className="flex-1">
        <h2 className="text-white font-bold text-sm">{title}</h2>
        <p className="text-pink-300/50 text-[0.55rem]">{progress}</p>
      </div>
      {score > 0 && (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)" }}>
          <Star size={12} className="text-amber-400" fill="currentColor" />
          <span className="text-amber-300 text-xs font-bold">{score}</span>
        </div>
      )}
    </div>
  );
}

function GameOverScreen({
  title,
  score,
  maxScore,
  onBack,
}: {
  title: string;
  score: number;
  maxScore: number;
  onBack: () => void;
}) {
  const percentage = Math.round((score / maxScore) * 100);
  const emoji = percentage >= 80 ? "🏆" : percentage >= 50 ? "⭐" : "💪";

  return (
    <div className="relative z-10 max-w-md mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[70vh]">
      <div
        className="rounded-2xl p-7 text-center w-full"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          animation: "bounceIn 0.5s ease both",
        }}
      >
        <span className="text-5xl mb-3 inline-block">{emoji}</span>
        <h2
          className="text-xl font-black text-white mb-1"
          style={{
            background: "linear-gradient(90deg, #f48fb1, #fff, #f48fb1)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmerGames 3s linear infinite",
          }}
        >
          {title} Complete!
        </h2>
        <p className="text-pink-300/50 text-xs mb-4">
          {percentage >= 80 ? "Amazing! You're a pro!" : percentage >= 50 ? "Good job! Keep practicing!" : "Nice try! You'll get better!"}
        </p>

        <div className="flex items-center justify-center gap-2 mb-5">
          <Trophy size={20} className="text-amber-400" />
          <span className="text-2xl font-black text-white">{score}</span>
          <span className="text-pink-300/40 text-sm">/ {maxScore} pts</span>
        </div>

        <div className="w-full h-2 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${percentage}%`,
              background: percentage >= 80 ? "linear-gradient(90deg, #4caf50, #8bc34a)" : percentage >= 50 ? "linear-gradient(90deg, #ff9800, #ffc107)" : "linear-gradient(90deg, #e91e63, #f48fb1)",
            }}
          />
        </div>

        <Button
          onClick={onBack}
          className="rounded-xl gap-2 w-full"
          style={{ background: "linear-gradient(135deg, #e91e63, #880E4F)" }}
        >
          <ArrowRight size={16} /> Back to Games
        </Button>
      </div>
    </div>
  );
}

function FallingHeartsGames() {
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    delay: `${Math.random() * 12}s`,
    duration: `${12 + Math.random() * 8}s`,
    size: `${0.6 + Math.random() * 1}rem`,
    emoji: ["❤️", "💕", "💗", "🩷", "♥️", "🎮"][Math.floor(Math.random() * 6)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: h.left,
            top: "-2rem",
            fontSize: h.size,
            animation: `heartFallGames ${h.duration} ${h.delay} linear infinite`,
            opacity: 0.25,
          }}
        >
          {h.emoji}
        </div>
      ))}
    </div>
  );
}
