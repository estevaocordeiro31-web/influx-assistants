import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { KIDS_TONGUE_TWISTERS, KIDS_FORFEITS, type KidsTongueTwister } from "@/data/stpatricks/drinking-games";
import { trpc } from "@/lib/trpc";

const LEVEL_CONFIG = {
  super_easy: { label: "⭐ Super Easy", color: "#4cc9f0", bg: "rgba(76,201,240,0.15)", min: 70, emoji: "😊" },
  easy:       { label: "⭐⭐ Easy",       color: "#06d6a0", bg: "rgba(6,214,160,0.15)", min: 60, emoji: "😄" },
  medium:     { label: "⭐⭐⭐ Medium",   color: "#ffd166", bg: "rgba(255,209,102,0.15)", min: 50, emoji: "😅" },
};

function randomForfeit() {
  return KIDS_FORFEITS[Math.floor(Math.random() * KIDS_FORFEITS.length)];
}

export default function KidsTongueTwister() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"select" | "ready" | "result">("select");
  const [selectedLevel, setSelectedLevel] = useState<KidsTongueTwister["level"]>("super_easy");
  const [current, setCurrent] = useState<KidsTongueTwister | null>(null);
  const [attempt, setAttempt] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [forfeit, setForfeit] = useState(KIDS_FORFEITS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  const ttsMutation = trpc.tts.speak.useMutation();
  const evaluateMutation = trpc.culturalEvents.evaluateTongueTwister.useMutation();

  const pickTwister = () => {
    const pool = KIDS_TONGUE_TWISTERS.filter(t => t.level === selectedLevel);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(pick);
    setAttempt("");
    setScore(null);
    setForfeit(randomForfeit());
    setStep("ready");
  };

  const playTTS = async () => {
    if (!current || isPlayingTTS) return;
    setIsPlayingTTS(true);
    try {
      const res = await ttsMutation.mutateAsync({ text: current.text, character: "lucas" });
      if (res.audioUrl) {
        const audio = new Audio(res.audioUrl);
        audio.onended = () => setIsPlayingTTS(false);
        audio.play();
      }
    } catch { setIsPlayingTTS(false); }
  };

  const evaluate = async () => {
    if (!current || !attempt.trim()) return;
    setIsLoading(true);
    try {
      const config = LEVEL_CONFIG[current.level];
      const res = await evaluateMutation.mutateAsync({
        twister: current.text,
        attempt: attempt.trim(),
        level: current.level === "super_easy" ? "easy" : current.level,
      });
      setScore(res.score);
      setFeedback(res.feedback);
      setStep("result");
    } catch {
      setScore(75);
      setFeedback("Great try! Keep practicing! 🌟");
      setStep("result");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep("select");
    setCurrent(null);
    setAttempt("");
    setScore(null);
  };

  const config = current ? LEVEL_CONFIG[current.level] : LEVEL_CONFIG.super_easy;
  const minScore = current ? LEVEL_CONFIG[current.level].min : 60;
  const passed = score !== null && score >= minScore;

  return (
    <div className="min-h-screen pb-10" style={{ background: "linear-gradient(180deg, #0a1628 0%, #1a0a2e 100%)" }}>
      <div className="max-w-lg mx-auto px-4 pt-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/events/kids")} className="text-white/50 hover:text-white text-2xl">←</button>
          <div>
            <h1 className="text-white font-black text-xl">🌀 Tongue Twister</h1>
            <p className="text-white/40 text-xs">Kids Edition · St. Patrick's Night</p>
          </div>
        </div>

        {/* SELECT LEVEL */}
        {step === "select" && (
          <div>
            <p className="text-white/70 text-center mb-6 text-sm">Choose your level and try to say it fast! 🚀</p>
            <div className="space-y-3 mb-6">
              {(Object.entries(LEVEL_CONFIG) as [KidsTongueTwister["level"], typeof LEVEL_CONFIG.easy][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLevel(key)}
                  className="w-full rounded-2xl p-4 text-left transition-all"
                  style={{
                    background: selectedLevel === key ? cfg.bg : "rgba(255,255,255,0.04)",
                    border: `2px solid ${selectedLevel === key ? cfg.color : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cfg.emoji}</span>
                    <div>
                      <p className="font-black text-white text-base">{cfg.label}</p>
                      <p className="text-white/40 text-xs">Pass score: {cfg.min}%</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <Button
              onClick={pickTwister}
              className="w-full h-14 rounded-2xl font-black text-lg"
              style={{ background: "linear-gradient(135deg, #4cc9f0, #7209b7)" }}
            >
              Let's Go! 🚀
            </Button>
          </div>
        )}

        {/* READY */}
        {step === "ready" && current && (
          <div>
            <div
              className="rounded-3xl p-6 mb-5 text-center"
              style={{ background: config.bg, border: `2px solid ${config.color}` }}
            >
              <div className="text-5xl mb-3">{current.emoji}</div>
              <p className="text-white font-black text-xl leading-relaxed mb-3">{current.text}</p>
              <p className="text-white/50 text-sm">💡 {current.tip}</p>
            </div>

            {/* TTS Button */}
            <button
              onClick={playTTS}
              disabled={isPlayingTTS}
              className="w-full rounded-2xl p-3 mb-4 flex items-center justify-center gap-2 font-bold text-sm"
              style={{ background: "rgba(76,201,240,0.1)", border: "1px solid rgba(76,201,240,0.3)", color: "#4cc9f0" }}
            >
              {isPlayingTTS ? "🔊 Playing..." : "🔊 Hear it with Lucas 🇺🇸"}
            </button>

            <p className="text-white/60 text-sm text-center mb-3">Type what you said (or your best attempt!):</p>
            <textarea
              value={attempt}
              onChange={e => setAttempt(e.target.value)}
              placeholder="Type the tongue twister here..."
              rows={3}
              className="w-full rounded-2xl p-4 text-white text-base outline-none resize-none mb-4"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
            />
            <Button
              onClick={evaluate}
              disabled={!attempt.trim() || isLoading}
              className="w-full h-14 rounded-2xl font-black text-lg"
              style={{ background: `linear-gradient(135deg, ${config.color}, #7209b7)` }}
            >
              {isLoading ? "Checking... 🤔" : "Check My Answer! ✅"}
            </Button>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && current && score !== null && (
          <div className="text-center">
            <div className="text-7xl mb-4">{passed ? "🏆" : "😅"}</div>
            <h2 className="text-white font-black text-3xl mb-1">{score}%</h2>
            <p className="font-bold text-lg mb-4" style={{ color: passed ? "#06d6a0" : "#ffd166" }}>
              {passed ? "Amazing! You did it! 🌟" : "Good try! Keep practicing! 💪"}
            </p>
            <div
              className="rounded-2xl p-4 mb-5 text-left"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <p className="text-white/70 text-sm">{feedback}</p>
            </div>

            {!passed && (
              <div
                className="rounded-2xl p-4 mb-5"
                style={{ background: "rgba(255,209,102,0.1)", border: "2px solid rgba(255,209,102,0.4)" }}
              >
                <p className="text-yellow-300 font-black text-base mb-1">🎯 Fun Challenge!</p>
                <p className="text-white/80 text-sm">{forfeit.emoji} {forfeit.text}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={pickTwister}
                className="flex-1 h-12 rounded-2xl font-bold"
                style={{ background: "linear-gradient(135deg, #4cc9f0, #7209b7)" }}
              >
                Try Another! 🔄
              </Button>
              <Button
                onClick={reset}
                variant="outline"
                className="h-12 px-5 rounded-2xl border-white/20 text-white/70 font-bold"
              >
                Levels
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
