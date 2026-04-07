import { useState, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Music, Loader2, RefreshCw, Beer, CheckCircle2, XCircle, Volume2 } from "lucide-react";
import { LYRICS_CHALLENGES, LYRICS_CATEGORIES, ENGLISH_FORFEITS, type LyricsChallenge } from "@/data/stpatricks/drinking-games";

type GameStep = "select-category" | "playing" | "result";

export default function FinishTheLyrics() {
  const [, navigate] = useLocation();
  const [category, setCategory] = useState<string>("all");
  const [challenge, setChallenge] = useState<LyricsChallenge | null>(null);
  const [step, setStep] = useState<GameStep>("select-category");
  const [answer, setAnswer] = useState("");
  const [checking, setChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [aiFeedback, setAiFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const randomForfeit = useMemo(() => ENGLISH_FORFEITS[Math.floor(Math.random() * ENGLISH_FORFEITS.length)], [isCorrect]);

  const participantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");
  const checkLyrics = trpc.culturalEvents.checkLyrics.useMutation();
  const saveMission = trpc.culturalEvents.saveMissionProgress.useMutation();
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const ttsMutation = trpc.tts.speak.useMutation({
    onSuccess: (data: { audioUrl: string }) => {
      if (ttsAudioRef.current) {
        ttsAudioRef.current.src = data.audioUrl;
        ttsAudioRef.current.play().catch(() => {});
        ttsAudioRef.current.onended = () => setTtsPlaying(false);
        setTtsPlaying(true);
      }
    },
  });
  const handleListenVerse = () => {
    if (!challenge) return;
    const cleanVerse = challenge.verse.replace(/___/g, "...");
    ttsMutation.mutate({ text: cleanVerse, character: "emily", situation: "explaining", preferredProvider: "google" });
  };

  const pickChallenge = (cat: string) => {
    const pool = cat === "all" ? LYRICS_CHALLENGES : LYRICS_CHALLENGES.filter(l => l.category === cat);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setChallenge(picked);
    setAnswer("");
    setIsCorrect(null);
    setAiFeedback("");
    setStep("playing");
  };

  const handleCheck = async () => {
    if (!challenge || !answer.trim()) return;
    setChecking(true);
    try {
      const result = await checkLyrics.mutateAsync({
        song: challenge.song,
        artist: challenge.artist,
        correctAnswer: challenge.answer,
        playerAnswer: answer.trim(),
      });
      const correct = result.correct ?? false;
      setIsCorrect(correct);
      setAiFeedback(result.feedback ?? "");
      if (correct) {
        const pts = challenge.points + (streak >= 2 ? 20 : 0);
        setScore(s => s + pts);
        setStreak(s => s + 1);
        if (participantId && round === 0) {
          await saveMission.mutateAsync({
            participantId,
            missionId: "finish-lyrics",
            score: pts,
            completed: true,
            answers: { song: challenge.song, answer },
          });
        }
      } else {
        setStreak(0);
      }
      setRound(r => r + 1);
      setStep("result");
    } catch {
      setIsCorrect(false);
      setAiFeedback("Erro ao verificar. Tente novamente!");
      setStep("result");
    } finally {
      setChecking(false);
    }
  };

  const catConfig = LYRICS_CATEGORIES.find(c => c.id === category) ?? LYRICS_CATEGORIES[0];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a1f0e 0%, #1a3a1e 100%)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button onClick={() => navigate("/events/hub")} className="text-gray-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">🎵 Finish the Lyrics</h1>
          <p className="text-xs text-gray-400">Drinking Game · St. Patrick's Night</p>
        </div>
        {round > 0 && (
          <div className="text-right">
            <div className="text-lg font-black text-yellow-400">{score} pts</div>
            {streak >= 2 && <div className="text-xs text-orange-400">🔥 {streak}x streak!</div>}
          </div>
        )}
      </div>

      <div className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full">

        {/* SELECT CATEGORY */}
        {step === "select-category" && (
          <div className="space-y-4 mt-4">
            <div className="rounded-2xl p-4 mb-2" style={{ background: "rgba(64,145,108,0.15)", border: "1px solid #40916c44" }}>
              <p className="text-sm text-gray-300 text-center">
                Complete a letra da música em inglês!<br />
                <span className="text-green-400 font-semibold">Errou? Bebe! Acertou? Escolhe quem bebe! 🍺</span>
              </p>
            </div>
            {LYRICS_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat.id); pickChallenge(cat.id); }}
                className="w-full rounded-2xl p-4 text-left transition-all active:scale-95"
                style={{ background: `${cat.color}22`, border: `1.5px solid ${cat.color}66` }}
              >
                <span className="text-base font-bold text-white">{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* PLAYING */}
        {step === "playing" && challenge && (
          <div className="mt-4 space-y-4">
            {/* Song info */}
            <div className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #ffffff15" }}>
              <Music size={20} style={{ color: catConfig.color }} />
              <div>
                <p className="text-sm font-bold text-white">{challenge.song}</p>
                <p className="text-xs text-gray-400">{challenge.artist} · {challenge.categoryLabel}</p>
              </div>
              <span className="ml-auto text-xs font-semibold" style={{ color: catConfig.color }}>
                +{challenge.points} pts
              </span>
            </div>

            {/* Listen button */}
            <button
              onClick={handleListenVerse}
              disabled={ttsMutation.isPending || ttsPlaying}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
              style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd" }}
            >
              {ttsMutation.isPending ? (
                <><Loader2 size={14} className="animate-spin" /> Loading audio...</>
              ) : ttsPlaying ? (
                <><Volume2 size={14} className="animate-pulse" /> Playing with Emily...</>
              ) : (
                <><Volume2 size={14} /> 🇬🇧 Listen with Emily</>
              )}
            </button>
            <audio ref={ttsAudioRef} />
            {/* Lyrics with blank */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid #ffffff15" }}>
              <p className="text-lg text-white leading-relaxed font-medium italic text-center">
                {challenge.verse.split("___").map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="inline-block bg-yellow-400/20 border-b-2 border-yellow-400 px-3 text-yellow-400 font-bold not-italic">
                        ___?___
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </div>

            {/* Answer input */}
            <div className="space-y-3">
              <Input
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCheck()}
                placeholder="Complete the lyric..."
                className="w-full bg-gray-800 border-gray-600 text-white rounded-xl h-12 text-base"
                disabled={checking}
              />
              <Button
                onClick={handleCheck}
                disabled={!answer.trim() || checking}
                className="w-full h-12 font-bold rounded-xl text-base"
                style={{ background: `linear-gradient(135deg, ${catConfig.color}, ${catConfig.color}cc)` }}
              >
                {checking ? <Loader2 size={18} className="animate-spin mr-2" /> : <Music size={18} className="mr-2" />}
                {checking ? "Verificando..." : "Confirmar!"}
              </Button>
            </div>

            {/* Hint: difficulty badge */}
            <p className="text-center text-xs text-gray-500">
              Dificuldade: {challenge.difficulty === "easy" ? "🟢 Easy" : challenge.difficulty === "medium" ? "🟡 Medium" : "🔴 Hard"}
            </p>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && challenge && isCorrect !== null && (
          <div className="mt-4 space-y-4">
            {/* Verdict */}
            <div className="text-center">
              {isCorrect
                ? <CheckCircle2 size={56} className="mx-auto text-green-400 mb-2" />
                : <XCircle size={56} className="mx-auto text-red-400 mb-2" />}
              <h2 className="text-2xl font-black text-white">
                {isCorrect ? "Correct! 🎉" : "Not quite! 😅"}
              </h2>
            </div>

            {/* Full lyric reveal */}
            <div className="rounded-2xl p-4" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid #ffffff15" }}>
              <p className="text-xs text-gray-400 mb-2">🎵 Letra completa:</p>
              <p className="text-sm text-white italic">{challenge.fullLine}</p>
              <p className="text-xs text-gray-500 mt-1">— {challenge.song}, {challenge.artist}</p>
            </div>

            {/* Drink verdict */}
            <div className="rounded-2xl p-4 text-center" style={{
              background: isCorrect ? "rgba(64,145,108,0.2)" : "rgba(231,111,81,0.2)",
              border: `1.5px solid ${isCorrect ? "#40916c" : "#e76f51"}55`
            }}>
              <p className="text-base font-bold text-white">
                {isCorrect
                  ? `🍺 Você acertou! Escolha quem bebe!${streak >= 2 ? ` 🔥 ${streak}x streak!` : ""}`
                  : "😅 Errou! Você bebe! 🍺"}
              </p>
            </div>

            {/* Forfait alternativo quando errar */}
            {!isCorrect && (
              <div className="rounded-2xl p-4" style={{ background: "rgba(233,196,106,0.1)", border: "1.5px solid rgba(233,196,106,0.3)" }}>
                <p className="text-xs text-yellow-400 font-bold mb-1">✨ Alternativa a beber (desafio em inglês):</p>
                <p className="text-sm text-white">{randomForfeit.emoji} {randomForfeit.text}</p>
              </div>
            )}

            {/* AI Feedback */}
            {aiFeedback && (
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #ffffff22" }}>
                <p className="text-xs text-gray-400 mb-1">🤖 Curiosidade:</p>
                <p className="text-sm text-gray-200">{aiFeedback}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={() => setStep("select-category")} variant="outline"
                className="flex-1 h-12 rounded-xl border-gray-600 text-gray-300">
                <RefreshCw size={16} className="mr-2" /> Categoria
              </Button>
              <Button onClick={() => pickChallenge(category)}
                className="flex-1 h-12 rounded-xl font-bold"
                style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}>
                <Beer size={16} className="mr-2" /> Próxima Música!
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
