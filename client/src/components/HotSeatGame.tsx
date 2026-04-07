import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Play, RefreshCw, Beer, Users, Timer, Zap } from "lucide-react";
import { WHO_AM_I_CHARACTERS, WHO_AM_I_CATEGORIES_EXTENDED, type WhoAmICharacter } from "@/data/stpatricks/drinking-games";

type GameStep = "setup" | "countdown" | "playing" | "result";

const ROUND_SECONDS = 60;

export default function HotSeatGame() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<GameStep>("setup");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [character, setCharacter] = useState<WhoAmICharacter | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [countdown, setCountdown] = useState(3);
  const [won, setWon] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown before game starts
  useEffect(() => {
    if (step !== "countdown") return;
    if (countdown <= 0) {
      setStep("playing");
      setTimeLeft(ROUND_SECONDS);
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, countdown]);

  // Game timer
  useEffect(() => {
    if (step !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setWon(false);
          setStep("result");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [step]);

  const pickCharacter = (categoryId: string) => {
    const pool = categoryId === "all"
      ? WHO_AM_I_CHARACTERS
      : WHO_AM_I_CHARACTERS.filter(c => c.category === categoryId);
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const startGame = () => {
    if (!nameInput.trim()) return;
    setPlayerName(nameInput.trim());
    const picked = pickCharacter(selectedCategory);
    setCharacter(picked);
    setCountdown(3);
    setWon(false);
    setStep("countdown");
  };

  const handleCorrect = () => {
    clearInterval(timerRef.current!);
    setWon(true);
    setStep("result");
  };

  const handleGiveUp = () => {
    clearInterval(timerRef.current!);
    setWon(false);
    setStep("result");
  };

  const playAgain = () => {
    setNameInput("");
    setStep("setup");
  };

  const timerColor = timeLeft > 30 ? "#40916c" : timeLeft > 15 ? "#e9c46a" : "#e76f51";
  const timerPercent = (timeLeft / ROUND_SECONDS) * 100;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, #0a1f0e 0%, #1a3a1e 100%)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-3">
        <button onClick={() => navigate("/events/hub")} className="text-gray-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">🔥 Hot Seat</h1>
          <p className="text-xs text-gray-400">Modo Grupo · St. Patrick's Night</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Users size={12} /> Grupo
        </div>
      </div>

      <div className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full flex flex-col">

        {/* ── SETUP ── */}
        {step === "setup" && (
          <div className="space-y-5 mt-4">
            {/* How to play */}
            <div className="rounded-2xl p-4" style={{ background: "rgba(64,145,108,0.15)", border: "1px solid #40916c44" }}>
              <p className="text-sm font-bold text-green-300 mb-2 text-center">🔥 Como jogar em grupo</p>
              <div className="space-y-1 text-sm text-gray-300">
                <p>👤 Um jogador fica na <strong className="text-white">Hot Seat</strong> (de costas ou olhos fechados)</p>
                <p>📺 O personagem aparece na tela — <strong className="text-white">só o grupo vê!</strong></p>
                <p>💬 O grupo dá dicas em inglês por <strong className="text-white">60 segundos</strong></p>
                <p>🎯 O jogador tenta adivinhar quem é</p>
                <p>🍺 Não acertou? <strong className="text-red-400">Bebe!</strong> Acertou? <strong className="text-green-400">Escolhe quem bebe!</strong></p>
              </div>
            </div>

            {/* Player name */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Quem está na Hot Seat?</p>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && startGame()}
                placeholder="Nome do jogador..."
                className="w-full h-12 px-4 rounded-xl text-white text-base font-semibold placeholder:text-gray-600 outline-none"
                style={{ background: "rgba(255,255,255,0.07)", border: "1.5px solid #40916c55" }}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Categoria</p>
              <div className="grid grid-cols-2 gap-2">
                {WHO_AM_I_CATEGORIES_EXTENDED.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="rounded-xl p-3 text-sm font-semibold text-left transition-all active:scale-95"
                    style={{
                      background: selectedCategory === cat.id ? `${cat.color}33` : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${selectedCategory === cat.id ? cat.color : "#ffffff15"}`,
                      color: selectedCategory === cat.id ? "white" : "#9ca3af",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={startGame}
              disabled={!nameInput.trim()}
              className="w-full h-14 rounded-xl font-black text-lg"
              style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
            >
              <Play size={20} className="mr-2" /> Começar!
            </Button>
          </div>
        )}

        {/* ── COUNTDOWN ── */}
        {step === "countdown" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <p className="text-gray-400 text-lg">
              <strong className="text-white">{playerName}</strong>, feche os olhos!
            </p>
            <div
              className="w-36 h-36 rounded-full flex items-center justify-center font-black"
              style={{
                background: "rgba(64,145,108,0.2)",
                border: "3px solid #40916c",
                fontSize: "5rem",
                color: "#74c69d",
              }}
            >
              {countdown > 0 ? countdown : "🍀"}
            </div>
            <p className="text-gray-500 text-sm">Preparando o personagem...</p>
          </div>
        )}

        {/* ── PLAYING ── */}
        {step === "playing" && character && (
          <div className="flex flex-col flex-1 mt-2 gap-4">
            {/* Timer ring */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#1a3a1e" strokeWidth="8" />
                  <circle
                    cx="48" cy="48" r="40" fill="none"
                    stroke={timerColor}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - timerPercent / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black" style={{ color: timerColor }}>{timeLeft}</span>
                  <span className="text-xs text-gray-500">seg</span>
                </div>
              </div>
              {timeLeft <= 15 && (
                <p className="text-xs font-bold text-red-400 animate-pulse">⚠️ Acabando o tempo!</p>
              )}
            </div>

            {/* Character reveal — the HOT SEAT player must NOT see this */}
            <div
              className="rounded-3xl p-6 text-center"
              style={{ background: "rgba(0,0,0,0.5)", border: "2px solid #40916c55" }}
            >
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">O personagem é...</p>
              <h2 className="text-4xl font-black text-white mb-1">{character.name}</h2>
              <p className="text-sm text-gray-400">{character.categoryLabel} · {character.difficulty}</p>
            </div>

            {/* Hints for the group */}
            <div className="rounded-2xl p-4" style={{ background: "rgba(76,201,240,0.08)", border: "1px solid #4cc9f033" }}>
              <p className="text-xs text-blue-400 font-semibold mb-2">💡 Dicas para o grupo (em inglês!):</p>
              <div className="space-y-1">
                {character.hints.map((hint, i) => (
                  <p key={i} className="text-sm text-gray-300">• {hint}</p>
                ))}
              </div>
            </div>

            {/* Tip for group */}
            <div className="rounded-xl px-4 py-3 text-center text-xs text-yellow-300"
              style={{ background: "rgba(233,196,106,0.1)", border: "1px solid #e9c46a33" }}>
              <Zap size={12} className="inline mr-1" />
              Grupo: dê dicas em inglês! Não diga o nome nem aponte para fotos!
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-auto">
              <Button
                onClick={handleCorrect}
                className="flex-1 h-14 rounded-xl font-black text-base"
                style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
              >
                ✅ Acertou!
              </Button>
              <Button
                onClick={handleGiveUp}
                variant="outline"
                className="h-14 rounded-xl border-red-800/60 text-red-400 px-5"
              >
                <Beer size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && character && (
          <div className="mt-4 space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-3">{won ? "🏆" : timeLeft === 0 ? "⏰" : "😅"}</div>
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
                  <p className="text-xl font-black text-green-300 mb-1">
                    🎉 {playerName} acertou!
                  </p>
                  <p className="text-sm text-gray-300">
                    {timeLeft > 30
                      ? "Muito rápido! Escolhe 2 pessoas para beber! 🍺🍺"
                      : "Conseguiu! Escolhe alguém para beber! 🍺"}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl font-black text-red-300 mb-1">
                    {timeLeft === 0 ? "⏰ Tempo esgotado!" : `😅 ${playerName} desistiu!`}
                  </p>
                  <p className="text-sm text-gray-300">
                    {playerName} bebe! 🍺 Próximo jogador!
                  </p>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl py-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-lg font-bold text-white">{ROUND_SECONDS - timeLeft}s</p>
                <p className="text-xs text-gray-500">tempo usado</p>
              </div>
              <div className="rounded-xl py-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-lg font-bold text-white">{won ? (timeLeft > 30 ? "200" : "100") : "0"}</p>
                <p className="text-xs text-gray-500">pontos</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={playAgain}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-gray-600 text-gray-300"
              >
                <RefreshCw size={16} className="mr-2" /> Próximo Jogador
              </Button>
              <Button
                onClick={() => {
                  const picked = pickCharacter(selectedCategory);
                  setCharacter(picked);
                  setCountdown(3);
                  setWon(false);
                  setStep("countdown");
                }}
                className="flex-1 h-12 rounded-xl"
                style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
              >
                <Beer size={16} className="mr-2" /> Mesmo Jogador
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
