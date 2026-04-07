import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { KIDS_SONGS, KIDS_FORFEITS, type KidsSong } from "@/data/stpatricks/drinking-games";
import { trpc } from "@/lib/trpc";

const DIFFICULTY_CONFIG = {
  easy:   { label: "⭐ Easy",   color: "#06d6a0", points: 50 },
  medium: { label: "⭐⭐ Medium", color: "#ffd166", points: 100 },
};

function randomForfeit() {
  return KIDS_FORFEITS[Math.floor(Math.random() * KIDS_FORFEITS.length)];
}

export default function KidsSingAlong() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"select" | "playing" | "result">("select");
  const [difficulty, setDifficulty] = useState<"easy" | "medium">("easy");
  const [current, setCurrent] = useState<KidsSong | null>(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{ correct: boolean; points: number; feedback: string } | null>(null);
  const [forfeit, setForfeit] = useState(KIDS_FORFEITS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  const ttsMutation = trpc.tts.speak.useMutation();
  const checkMutation = trpc.culturalEvents.checkLyrics.useMutation();

  const pickSong = () => {
    const pool = KIDS_SONGS.filter(s => s.difficulty === difficulty);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(pick);
    setAnswer("");
    setResult(null);
    setForfeit(randomForfeit());
    setStep("playing");
  };

  const playTTS = async () => {
    if (!current || isPlayingTTS) return;
    setIsPlayingTTS(true);
    const textToSpeak = current.verse.replace("___", "... [blank] ...");
    try {
      const res = await ttsMutation.mutateAsync({ text: textToSpeak, character: "emily" });
      if (res.audioUrl) {
        const audio = new Audio(res.audioUrl);
        audio.onended = () => setIsPlayingTTS(false);
        audio.play();
      }
    } catch { setIsPlayingTTS(false); }
  };

  const checkAnswer = async () => {
    if (!current || !answer.trim()) return;
    setIsLoading(true);
    try {
      const res = await checkMutation.mutateAsync({
        song: current.title,
        artist: current.artist,
        correctAnswer: current.answer,
        playerAnswer: answer.trim(),
      });
      setResult({ correct: res.correct, points: res.correct ? DIFFICULTY_CONFIG[current.difficulty].points : 0, feedback: res.feedback });
      setStep("result");
    } catch {
      const correct = answer.trim().toLowerCase().includes(current.answer.toLowerCase());
      setResult({ correct, points: correct ? DIFFICULTY_CONFIG[current.difficulty].points : 0, feedback: correct ? "Great job! 🌟" : `The answer was: "${current.answer}"` });
      setStep("result");
    } finally {
      setIsLoading(false);
    }
  };

  const config = difficulty ? DIFFICULTY_CONFIG[difficulty] : DIFFICULTY_CONFIG.easy;

  return (
    <div className="min-h-screen pb-10" style={{ background: "linear-gradient(180deg, #0a1628 0%, #1a0a2e 100%)" }}>
      <div className="max-w-lg mx-auto px-4 pt-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/events/kids")} className="text-white/50 hover:text-white text-2xl">←</button>
          <div>
            <h1 className="text-white font-black text-xl">🎵 Sing Along!</h1>
            <p className="text-white/40 text-xs">Kids Edition · St. Patrick's Night</p>
          </div>
        </div>

        {/* SELECT DIFFICULTY */}
        {step === "select" && (
          <div>
            <p className="text-white/70 text-center mb-6 text-sm">Fill in the missing word from the song! 🎤</p>
            <div className="space-y-3 mb-6">
              {(Object.entries(DIFFICULTY_CONFIG) as ["easy" | "medium", typeof DIFFICULTY_CONFIG.easy][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className="w-full rounded-2xl p-4 text-left transition-all"
                  style={{
                    background: difficulty === key ? `${cfg.color}22` : "rgba(255,255,255,0.04)",
                    border: `2px solid ${difficulty === key ? cfg.color : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-base">{cfg.label}</span>
                    <span className="font-bold text-sm" style={{ color: cfg.color }}>+{cfg.points} pts</span>
                  </div>
                </button>
              ))}
            </div>
            <Button
              onClick={pickSong}
              className="w-full h-14 rounded-2xl font-black text-lg"
              style={{ background: "linear-gradient(135deg, #f72585, #7209b7)" }}
            >
              Pick a Song! 🎵
            </Button>
          </div>
        )}

        {/* PLAYING */}
        {step === "playing" && current && (
          <div>
            {/* Song info */}
            <div
              className="rounded-2xl p-4 mb-4 flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <span className="text-4xl">{current.emoji}</span>
              <div>
                <p className="text-white font-black text-base">{current.title}</p>
                <p className="text-white/50 text-sm">{current.artist}</p>
              </div>
            </div>

            {/* Verse */}
            <div
              className="rounded-2xl p-5 mb-4"
              style={{ background: "rgba(247,37,133,0.08)", border: "2px solid rgba(247,37,133,0.3)" }}
            >
              {current.verse.split("\n").map((line, i) => (
                <p key={i} className="text-white text-lg font-bold leading-relaxed">
                  {line.includes("___")
                    ? line.split("___").map((part, j) => (
                        <span key={j}>
                          {part}
                          {j === 0 && (
                            <span
                              className="inline-block px-3 rounded-lg mx-1"
                              style={{ background: "rgba(247,37,133,0.3)", color: "#f72585", minWidth: "60px" }}
                            >
                              ___
                            </span>
                          )}
                        </span>
                      ))
                    : line}
                </p>
              ))}
            </div>

            {/* TTS */}
            <button
              onClick={playTTS}
              disabled={isPlayingTTS}
              className="w-full rounded-2xl p-3 mb-4 flex items-center justify-center gap-2 font-bold text-sm"
              style={{ background: "rgba(76,201,240,0.1)", border: "1px solid rgba(76,201,240,0.3)", color: "#4cc9f0" }}
            >
              {isPlayingTTS ? "🔊 Playing..." : "🔊 Hear it with Emily 🇬🇧"}
            </button>

            <input
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => e.key === "Enter" && checkAnswer()}
              placeholder="Type the missing word..."
              className="w-full rounded-2xl px-4 py-4 text-white text-lg text-center outline-none mb-4"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)" }}
            />
            <Button
              onClick={checkAnswer}
              disabled={!answer.trim() || isLoading}
              className="w-full h-14 rounded-2xl font-black text-lg"
              style={{ background: "linear-gradient(135deg, #f72585, #7209b7)" }}
            >
              {isLoading ? "Checking... 🎵" : "That's my answer! 🎤"}
            </Button>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && current && result && (
          <div className="text-center">
            <div className="text-7xl mb-3">{result.correct ? "🏆" : "😅"}</div>
            <h2 className="text-white font-black text-2xl mb-1">
              {result.correct ? "You got it! 🎉" : "Not quite! 😄"}
            </h2>
            {result.correct && (
              <p className="font-bold text-lg mb-3" style={{ color: "#ffd166" }}>+{result.points} points! ⭐</p>
            )}
            <div
              className="rounded-2xl p-4 mb-4"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <p className="text-white/50 text-xs mb-1">The full line:</p>
              <p className="text-white font-bold text-base">{current.fullLine}</p>
              <p className="text-white/60 text-sm mt-2">{result.feedback}</p>
            </div>

            {!result.correct && (
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
                onClick={pickSong}
                className="flex-1 h-12 rounded-2xl font-bold"
                style={{ background: "linear-gradient(135deg, #f72585, #7209b7)" }}
              >
                Next Song! 🎵
              </Button>
              <Button onClick={() => setStep("select")} variant="outline" className="h-12 px-5 rounded-2xl border-white/20 text-white/70 font-bold">
                Levels
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
