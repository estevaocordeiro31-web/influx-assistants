import { useState, useEffect, useCallback } from "react";
import { WHO_AM_I_CHARACTERS, WHO_AM_I_CATEGORIES_EXTENDED, ENGLISH_FORFEITS } from "@/data/stpatricks/drinking-games";

// ─── Presenter Mode (TV Fullscreen) for Hot Seat ─────────────
// Open this on the TV/projector — the group sees the character,
// the player on the hot seat keeps their eyes closed / faces away.

export default function HotSeatPresenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentChar, setCurrentChar] = useState<typeof WHO_AM_I_CHARACTERS[0] | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [phase, setPhase] = useState<"idle" | "countdown" | "playing" | "result">("idle");
  const [won, setWon] = useState<boolean | null>(null);
  const [forfeit, setForfeit] = useState<typeof ENGLISH_FORFEITS[0] | null>(null);

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      setPhase("result");
      setWon(false);
      const randomForfeit = ENGLISH_FORFEITS[Math.floor(Math.random() * ENGLISH_FORFEITS.length)];
      setForfeit(randomForfeit);
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const pickCharacter = useCallback(() => {
    const pool = selectedCategory === "all"
      ? WHO_AM_I_CHARACTERS
      : WHO_AM_I_CHARACTERS.filter((c) => c.category === selectedCategory);
    const char = pool[Math.floor(Math.random() * pool.length)];
    setCurrentChar(char);
  }, [selectedCategory]);

  const startGame = () => {
    pickCharacter();
    setTimeLeft(60);
    setWon(null);
    setForfeit(null);
    setPhase("countdown");
    // 3-second countdown then play
    setTimeout(() => setPhase("playing"), 3000);
  };

  const handleWin = () => {
    setPhase("result");
    setWon(true);
  };

  const handleLose = () => {
    setPhase("result");
    setWon(false);
    const randomForfeit = ENGLISH_FORFEITS[Math.floor(Math.random() * ENGLISH_FORFEITS.length)];
    setForfeit(randomForfeit);
  };

  const reset = () => {
    setPhase("idle");
    setCurrentChar(null);
    setWon(null);
    setForfeit(null);
    setTimeLeft(60);
  };

  const timerColor = timeLeft > 30 ? "#40916c" : timeLeft > 15 ? "#e9c46a" : "#e76f51";
  const timerBg = timeLeft > 30 ? "rgba(64,145,108,0.15)" : timeLeft > 15 ? "rgba(233,196,106,0.15)" : "rgba(231,111,81,0.2)";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center select-none"
      style={{
        background: "linear-gradient(135deg, #0a0f1e 0%, #0d1f12 60%, #0a0f1e 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── IDLE: Category picker + Start ── */}
      {phase === "idle" && (
        <div className="flex flex-col items-center gap-8 w-full max-w-3xl px-8">
          <div className="text-center">
            <div className="text-7xl mb-4">🔥</div>
            <h1 className="text-6xl font-black text-white mb-2" style={{ textShadow: "0 0 40px rgba(231,111,81,0.6)" }}>
              HOT SEAT
            </h1>
            <p className="text-2xl text-orange-300 font-semibold">Modo Apresentador — Projete na TV</p>
            <p className="text-gray-400 mt-2 text-lg">O jogador na cadeira quente fecha os olhos. O grupo vê o personagem e dá dicas em inglês!</p>
          </div>

          {/* Category selector */}
          <div className="flex flex-wrap gap-3 justify-center">
            {WHO_AM_I_CATEGORIES_EXTENDED.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="px-5 py-3 rounded-2xl text-lg font-bold transition-all"
                style={{
                  background: selectedCategory === cat.id ? cat.color : "rgba(255,255,255,0.05)",
                  color: selectedCategory === cat.id ? "#fff" : "#aaa",
                  border: `2px solid ${selectedCategory === cat.id ? cat.color : "rgba(255,255,255,0.1)"}`,
                  transform: selectedCategory === cat.id ? "scale(1.05)" : "scale(1)",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={startGame}
            className="w-80 h-20 rounded-3xl text-3xl font-black text-white"
            style={{
              background: "linear-gradient(135deg, #e76f51, #f4a261)",
              boxShadow: "0 8px 40px rgba(231,111,81,0.5)",
            }}
          >
            🔥 INICIAR JOGO
          </button>

          <p className="text-gray-500 text-sm">
            Acesse em: <span className="text-green-400 font-mono">tutor.imaind.tech/events/hot-seat-tv</span>
          </p>
        </div>
      )}

      {/* ── COUNTDOWN ── */}
      {phase === "countdown" && (
        <div className="flex flex-col items-center gap-6">
          <p className="text-3xl text-orange-300 font-bold">Jogador, feche os olhos!</p>
          <div
            className="text-[180px] font-black leading-none"
            style={{ color: "#e76f51", textShadow: "0 0 80px rgba(231,111,81,0.8)" }}
          >
            3
          </div>
          <p className="text-2xl text-gray-400">Preparando o personagem...</p>
        </div>
      )}

      {/* ── PLAYING ── */}
      {phase === "playing" && currentChar && (
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl px-8">
          {/* Timer */}
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center"
            style={{ background: timerBg, border: `6px solid ${timerColor}`, boxShadow: `0 0 40px ${timerColor}66` }}
          >
            <span className="text-7xl font-black" style={{ color: timerColor }}>{timeLeft}</span>
          </div>

          {/* Character card — big and clear for the group to read */}
          <div
            className="w-full rounded-3xl p-10 text-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "2px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
            }}
          >
            <p className="text-2xl text-gray-400 mb-4 font-semibold uppercase tracking-widest">Personagem secreto</p>
            <h2
              className="font-black leading-none mb-4"
              style={{
                fontSize: currentChar.name.length > 15 ? "5rem" : "7rem",
                color: "#fff",
                textShadow: "0 0 60px rgba(255,255,255,0.3)",
              }}
            >
              {currentChar.name}
            </h2>
            <span
              className="inline-block px-6 py-2 rounded-full text-xl font-bold"
              style={{ background: "rgba(64,145,108,0.2)", color: "#52b788", border: "1px solid #52b78844" }}
            >
              {currentChar.categoryLabel}
            </span>

            {/* Hints */}
            <div className="mt-8 flex flex-col gap-3">
              <p className="text-gray-500 text-lg font-semibold">💡 Dicas para o grupo (se precisar):</p>
              {currentChar.hints.map((hint, i) => (
                <p key={i} className="text-gray-300 text-xl">
                  <span className="text-green-400 font-bold mr-2">#{i + 1}</span> {hint}
                </p>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-6">
            <button
              onClick={handleWin}
              className="px-10 py-5 rounded-2xl text-2xl font-black text-white"
              style={{ background: "linear-gradient(135deg, #40916c, #52b788)", boxShadow: "0 4px 20px rgba(64,145,108,0.4)" }}
            >
              ✅ ACERTOU!
            </button>
            <button
              onClick={handleLose}
              className="px-10 py-5 rounded-2xl text-2xl font-black text-white"
              style={{ background: "linear-gradient(135deg, #e76f51, #f4a261)", boxShadow: "0 4px 20px rgba(231,111,81,0.4)" }}
            >
              ❌ NÃO ACERTOU
            </button>
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {phase === "result" && (
        <div className="flex flex-col items-center gap-8 w-full max-w-3xl px-8 text-center">
          {won ? (
            <>
              <div className="text-9xl">🏆</div>
              <h2 className="text-6xl font-black text-white" style={{ textShadow: "0 0 40px rgba(64,145,108,0.8)" }}>
                ACERTOU!
              </h2>
              <p className="text-3xl text-green-300 font-bold">
                Era <span className="text-white">{currentChar?.name}</span>!
              </p>
              <p className="text-2xl text-yellow-300">🍺 O jogador pode escolher quem bebe!</p>
            </>
          ) : (
            <>
              <div className="text-9xl">😅</div>
              <h2 className="text-5xl font-black text-white">
                Era <span style={{ color: "#e76f51" }}>{currentChar?.name}</span>!
              </h2>
              <p className="text-3xl text-orange-300 font-bold">Não acertou no tempo!</p>

              {/* Forfeit */}
              {forfeit && (
                <div
                  className="w-full rounded-3xl p-8"
                  style={{ background: "rgba(231,111,81,0.1)", border: "2px solid rgba(231,111,81,0.3)" }}
                >
                  <p className="text-2xl text-orange-300 font-bold mb-3">
                    {forfeit.emoji} Desafio em inglês (alternativa a beber):
                  </p>
                  <p className="text-3xl text-white font-semibold">{forfeit.text}</p>
                </div>
              )}
            </>
          )}

          <div className="flex gap-4 mt-4">
            <button
              onClick={startGame}
              className="px-8 py-4 rounded-2xl text-xl font-black text-white"
              style={{ background: "linear-gradient(135deg, #e76f51, #f4a261)" }}
            >
              🔥 Próximo Personagem
            </button>
            <button
              onClick={reset}
              className="px-8 py-4 rounded-2xl text-xl font-bold"
              style={{ background: "rgba(255,255,255,0.05)", color: "#aaa", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              ← Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
