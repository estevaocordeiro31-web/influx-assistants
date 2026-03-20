import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mic, MicOff, Loader2, RefreshCw, Trophy, Beer } from "lucide-react";
import { TONGUE_TWISTERS, LEVEL_CONFIG, type TongueTwister } from "@/data/stpatricks/drinking-games";

type GameStep = "select-level" | "ready" | "recording" | "evaluating" | "result";

const LEVEL_ORDER: Array<keyof typeof LEVEL_CONFIG> = ["easy", "medium", "hard", "insane"];

export default function TongueTwisterChallenge() {
  const [, navigate] = useLocation();
  const [level, setLevel] = useState<keyof typeof LEVEL_CONFIG | null>(null);
  const [twister, setTwister] = useState<TongueTwister | null>(null);
  const [step, setStep] = useState<GameStep>("select-level");
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [drinkVerdict, setDrinkVerdict] = useState("");
  const [textInput, setTextInput] = useState("");
  const [useTextMode, setUseTextMode] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const participantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");
  const evaluateTwister = trpc.culturalEvents.evaluateTongueTwister.useMutation();
  const saveMission = trpc.culturalEvents.saveMissionProgress.useMutation();

  const pickTwister = (lvl: keyof typeof LEVEL_CONFIG) => {
    const options = TONGUE_TWISTERS.filter(t => t.level === lvl);
    const picked = options[Math.floor(Math.random() * options.length)];
    setLevel(lvl);
    setTwister(picked);
    setStep("ready");
    setScore(null);
    setFeedback("");
    setDrinkVerdict("");
    setTranscript("");
    setTextInput("");
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setUseTextMode(true);
      setStep("recording");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        // For live event: use text fallback with self-assessment
        setStep("evaluating");
        await handleEvaluate(twister?.text ?? "");
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setStep("recording");
    } catch {
      setUseTextMode(true);
      setStep("recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleEvaluate = async (text: string) => {
    if (!twister || !text.trim()) return;
    setStep("evaluating");
    try {
      const result = await evaluateTwister.mutateAsync({
        twister: twister.text,
        attempt: text,
        level: twister.level,
      });
      const s = result.score ?? 50;
      setScore(s);
      setFeedback(result.feedback ?? "");
      const cfg = LEVEL_CONFIG[twister.level];
      const thresholds: Record<string, number> = { easy: 60, medium: 70, hard: 75, insane: 80 };
      const threshold = thresholds[twister.level];
      if (s < threshold) {
        setDrinkVerdict(`😅 Score: ${s}% — ${cfg.drinkRule}`);
      } else {
        setDrinkVerdict(`🎉 Score: ${s}% — Você arrasou! Escolha quem bebe! 🍺`);
      }
      // Save mission progress
      if (participantId && s >= threshold) {
        await saveMission.mutateAsync({
          participantId,
          missionId: "tongue-twister",
          score: cfg.points,
          completed: true,
          answers: { twister: twister.id, score: s, level: twister.level },
        });
      }
      setStep("result");
    } catch {
      setFeedback("Erro ao avaliar. Tente novamente!");
      setStep("result");
    }
  };

  const cfg = level ? LEVEL_CONFIG[level] : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a1f0e 0%, #1a3a1e 100%)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button onClick={() => navigate("/events/hub")} className="text-gray-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">🌀 Tongue Twister Challenge</h1>
          <p className="text-xs text-gray-400">Drinking Game · St. Patrick's Night</p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full">

        {/* SELECT LEVEL */}
        {step === "select-level" && (
          <div className="space-y-4 mt-4">
            <div className="rounded-2xl p-4 mb-2" style={{ background: "rgba(64,145,108,0.15)", border: "1px solid #40916c44" }}>
              <p className="text-sm text-gray-300 text-center">
                Escolha um nível, grave sua voz dizendo o trava-língua, e a IA avalia sua pronúncia.<br />
                <span className="text-green-400 font-semibold">Errou? Bebe! Acertou? Escolhe quem bebe! 🍺</span>
              </p>
            </div>
            {LEVEL_ORDER.map(lvl => {
              const c = LEVEL_CONFIG[lvl];
              return (
                <button
                  key={lvl}
                  onClick={() => pickTwister(lvl)}
                  className="w-full rounded-2xl p-4 text-left transition-all active:scale-95"
                  style={{ background: `${c.color}22`, border: `1.5px solid ${c.color}66` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">{c.label}</span>
                    <span className="text-xs font-semibold" style={{ color: c.color }}>+{c.points} pts</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{c.drinkRule}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* READY */}
        {step === "ready" && twister && cfg && (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl p-5 text-center" style={{ background: `${cfg.color}18`, border: `1.5px solid ${cfg.color}55` }}>
              <p className="text-xs font-semibold mb-3" style={{ color: cfg.color }}>{cfg.label}</p>
              <p className="text-2xl font-bold text-white leading-relaxed mb-3">"{twister.text}"</p>
              <p className="text-xs text-gray-400">💡 {twister.tip}</p>
              {twister.irishTheme && <p className="text-xs text-green-400 mt-1">🍀 Tema irlandês!</p>}
            </div>
            <p className="text-center text-sm text-gray-400">Leia em voz alta 3 vezes e depois grave!</p>
            <Button
              onClick={startRecording}
              className="w-full h-14 text-base font-bold rounded-xl"
              style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)` }}
            >
              <Mic size={20} className="mr-2" /> Gravar Agora!
            </Button>
            <Button variant="outline" onClick={() => { setUseTextMode(true); setStep("recording"); }}
              className="w-full h-10 text-sm rounded-xl border-gray-600 text-gray-400">
              Sem microfone? Digite sua tentativa
            </Button>
            <button onClick={() => pickTwister(level!)} className="w-full text-center text-xs text-gray-500 flex items-center justify-center gap-1">
              <RefreshCw size={12} /> Sortear outro trava-língua
            </button>
          </div>
        )}

        {/* RECORDING */}
        {step === "recording" && twister && cfg && (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl p-5 text-center" style={{ background: `${cfg.color}18`, border: `1.5px solid ${cfg.color}55` }}>
              <p className="text-xl font-bold text-white leading-relaxed">"{twister.text}"</p>
            </div>
            {!useTextMode ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 font-semibold">Gravando...</span>
                </div>
                <Button onClick={stopRecording} className="w-full h-14 text-base font-bold rounded-xl bg-red-600 hover:bg-red-700">
                  <MicOff size={20} className="mr-2" /> Parar e Avaliar
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 text-center">Digite o trava-língua como você falaria:</p>
                <textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder="Digite aqui..."
                  className="w-full rounded-xl p-3 bg-gray-800 text-white border border-gray-600 text-sm resize-none"
                  rows={3}
                />
                <Button
                  onClick={() => handleEvaluate(textInput)}
                  disabled={!textInput.trim()}
                  className="w-full h-12 font-bold rounded-xl"
                  style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)` }}
                >
                  Avaliar!
                </Button>
              </div>
            )}
          </div>
        )}

        {/* EVALUATING */}
        {step === "evaluating" && (
          <div className="flex flex-col items-center justify-center mt-16 gap-4">
            <Loader2 size={48} className="animate-spin text-green-400" />
            <p className="text-white font-semibold">A IA está avaliando sua pronúncia...</p>
            <p className="text-xs text-gray-400">Aguenta firme! 🍀</p>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && twister && cfg && score !== null && (
          <div className="mt-4 space-y-4">
            {/* Score circle */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 mb-2"
                style={{ borderColor: score >= 75 ? "#40916c" : "#e76f51", background: "rgba(0,0,0,0.3)" }}>
                <div>
                  <div className="text-3xl font-black text-white">{score}%</div>
                  <div className="text-xs text-gray-400">score</div>
                </div>
              </div>
            </div>

            {/* Drink verdict */}
            <div className="rounded-2xl p-4 text-center" style={{
              background: score >= 75 ? "rgba(64,145,108,0.2)" : "rgba(231,111,81,0.2)",
              border: `1.5px solid ${score >= 75 ? "#40916c" : "#e76f51"}55`
            }}>
              <p className="text-base font-bold text-white">{drinkVerdict}</p>
            </div>

            {/* AI Feedback */}
            {feedback && (
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #ffffff22" }}>
                <p className="text-xs text-gray-400 mb-1">🤖 Feedback da IA:</p>
                <p className="text-sm text-gray-200">{feedback}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={() => setStep("select-level")} variant="outline"
                className="flex-1 h-12 rounded-xl border-gray-600 text-gray-300">
                <RefreshCw size={16} className="mr-2" /> Novo Nível
              </Button>
              <Button onClick={() => pickTwister(level!)}
                className="flex-1 h-12 rounded-xl"
                style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)` }}>
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
