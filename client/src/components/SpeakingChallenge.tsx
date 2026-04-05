import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { CharacterBubble } from "@/components/events/CharacterBubble";
import { InfluxCoinsDisplay } from "@/components/events/EventUI";
import { STPATRICKS_SPEAKING } from "@/data/stpatricks/speaking";
import { CHARACTER_COLORS, CHARACTER_INFO } from "@/data/stpatricks/chunks";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mic, MicOff, CheckCircle2, Loader2, Star, Volume2 } from "lucide-react";

type StepState = "intro" | "recording" | "transcribing" | "evaluating" | "result";

export default function SpeakingChallenge() {
  const [, navigate] = useLocation();
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [step, setStep] = useState<StepState>("intro");
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [evaluation, setEvaluation] = useState<any>(null);
  const [allScores, setAllScores] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [useTextFallback, setUseTextFallback] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const participantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");
  const saveMission = trpc.culturalEvents.saveMissionProgress.useMutation();
  const evaluateSpeaking = trpc.culturalEvents.evaluateSpeaking.useMutation();
  const uploadAudio = trpc.culturalEvents.uploadEventAudio.useMutation();
  const transcribeAudio = trpc.culturalEvents.transcribeEventAudio.useMutation();

  const scenario = STPATRICKS_SPEAKING[scenarioIdx];
  const totalScenarios = STPATRICKS_SPEAKING.length;
  const color = CHARACTER_COLORS[scenario.character];
  const info = CHARACTER_INFO[scenario.character];

  const startRecording = async () => {
    setErrorMsg("");
    setUseTextFallback(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setUseTextFallback(true);
      setStep("recording");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Prefer webm/opus for best Whisper compatibility
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const mr = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      mr.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        await processAudio(mimeType);
      };
      mr.start(250); // collect chunks every 250ms
      mediaRecorderRef.current = mr;
      setRecording(true);
      setStep("recording");
    } catch (e: any) {
      // Mic permission denied — show text fallback
      setUseTextFallback(true);
      setStep("recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setStep("transcribing");
    }
  };

  const processAudio = async (mimeType: string) => {
    setStep("transcribing");
    try {
      // Convert blobs to base64
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      // Upload to S3
      const { url } = await uploadAudio.mutateAsync({
        audioBase64: base64,
        mimeType: mimeType.split(";")[0], // strip codec params
      });

      // Transcribe with Whisper (optimized for Brazilian accent)
      const { text } = await transcribeAudio.mutateAsync({ audioUrl: url });

      if (!text || text.trim().length < 2) {
        // Couldn't transcribe — fall back to text input
        setUseTextFallback(true);
        setTranscript("");
        setStep("recording");
        setErrorMsg("Não consegui entender o áudio. Tente falar mais perto do microfone ou use o modo texto.");
        return;
      }

      setTranscript(text);
      await handleEvaluate(text);
    } catch (e: any) {
      console.error("Audio processing error:", e);
      setUseTextFallback(true);
      setTranscript("");
      setStep("recording");
      setErrorMsg("Erro ao processar o áudio. Use o modo texto abaixo.");
    }
  };

  const handleEvaluate = async (text: string) => {
    setStep("evaluating");
    try {
      const result = await evaluateSpeaking.mutateAsync({
        transcription: text || transcript,
        scenarioId: scenario.id,
        character: scenario.character,
      });
      setEvaluation(result);
      setAllScores(prev => [...prev, result.total_score]);
      setStep("result");
    } catch (e) {
      console.error(e);
      setEvaluation({
        total_score: 70,
        feedback_pt: "Boa tentativa! Continue praticando.",
        chunks_used: [],
        suggestion: "Tente usar mais expressões do St. Patrick's.",
      });
      setAllScores(prev => [...prev, 70]);
      setStep("result");
    }
  };

  const handleNext = async () => {
    if (scenarioIdx < totalScenarios - 1) {
      setScenarioIdx(i => i + 1);
      setStep("intro");
      setTranscript("");
      setEvaluation(null);
      setErrorMsg("");
      setUseTextFallback(false);
    } else {
      const avgScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
      const finalScore = Math.round((avgScore / 100) * 120);
      setSaving(true);
      try {
        await saveMission.mutateAsync({
          participantId,
          missionId: "speaking-challenge",
          score: finalScore,
          completed: true,
        });
        setCompleted(true);
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    }
  };

  if (completed) {
    const avgScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-10"
        style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
        <div className="text-5xl mb-4">🎤</div>
        <h2 className="text-2xl font-black text-white mb-2">Speaking Completo!</h2>
        <p className="text-gray-300 text-sm text-center mb-4">
          Score médio: <span className="text-yellow-400 font-bold">{avgScore}/100</span>
        </p>
        <InfluxCoinsDisplay points={Math.round((avgScore / 100) * 120)} label="pontos ganhos" size="lg" />
        <Button onClick={() => navigate("/events/hub")} className="mt-8 w-full max-w-xs h-12 rounded-xl font-bold"
          style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}>
          Próxima Missão →
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate("/events/hub")} className="text-gray-400 flex items-center gap-1 text-sm">
            <ChevronLeft size={16} /> Hub
          </button>
          <div className="flex items-center gap-2">
            <Mic size={16} className="text-red-400" />
            <span className="text-white text-sm font-bold">Speaking Challenge</span>
          </div>
          <span className="text-gray-400 text-sm">{scenarioIdx + 1}/{totalScenarios}</span>
        </div>
        <div className="h-2 rounded-full bg-gray-800">
          <div className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${((scenarioIdx + 1) / totalScenarios) * 100}%`, background: "linear-gradient(90deg, #e53935, #f4a923)" }} />
        </div>
      </div>

      <div className="flex-1 px-4 flex flex-col gap-4">
        {/* Scenario card */}
        <div className="rounded-2xl p-4" style={{ background: `${color}22`, border: `2px solid ${color}44` }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold" style={{ color }}>{info.name} {info.flag} diz:</span>
          </div>
          <p className="text-white text-sm font-medium">"{scenario.prompt}"</p>
        </div>

        {/* Instructions */}
        <CharacterBubble character={scenario.character} message={scenario.context} animate={false} />

        {/* Chunks hint */}
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs text-gray-400 mb-2">💡 Use estes chunks:</p>
          <div className="flex flex-wrap gap-2">
            {scenario.idealElements.map((chunk: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ background: `${color}33`, border: `1px solid ${color}66` }}>
                {chunk}
              </span>
            ))}
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="rounded-xl p-3" style={{ background: "rgba(229,57,53,0.1)", border: "1px solid #e5393544" }}>
            <p className="text-red-400 text-xs">⚠️ {errorMsg}</p>
          </div>
        )}

        {/* Recording / Transcribing / Evaluating / Result */}
        {step === "intro" && (
          <div className="flex flex-col gap-3">
            <Button onClick={startRecording} className="w-full h-14 rounded-xl font-bold text-base"
              style={{ background: "linear-gradient(135deg, #e53935, #c62828)" }}>
              <Mic size={20} className="mr-2" /> 🎤 Gravar Resposta
            </Button>
            <button
              onClick={() => { setUseTextFallback(true); setStep("recording"); }}
              className="text-gray-500 text-xs text-center underline"
            >
              Prefiro digitar minha resposta
            </button>
          </div>
        )}

        {step === "recording" && (
          <div className="flex flex-col items-center gap-4">
            {recording && !useTextFallback ? (
              <>
                <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse"
                  style={{ background: "rgba(229,57,53,0.3)", border: "3px solid #e53935" }}>
                  <Mic size={32} className="text-red-400" />
                </div>
                <p className="text-red-400 text-sm font-bold animate-pulse">🔴 Gravando... fale em inglês!</p>
                <p className="text-gray-500 text-xs text-center">Fale perto do microfone com clareza</p>
                <Button onClick={stopRecording} variant="outline" className="border-red-400 text-red-400">
                  <MicOff size={16} className="mr-2" /> Parar Gravação
                </Button>
              </>
            ) : (
              <div className="w-full">
                <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(244,169,35,0.1)", border: "1px solid #f4a92344" }}>
                  <p className="text-yellow-400 text-xs font-bold mb-1">✍️ Digite sua resposta em inglês</p>
                  <p className="text-gray-400 text-xs">Use os chunks que você aprendeu! A IA vai avaliar seu vocabulário e conteúdo.</p>
                </div>
                <textarea
                  value={transcript}
                  onChange={e => setTranscript(e.target.value)}
                  placeholder="Type your answer in English... (use the chunks you learned!)"
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl p-3 text-white text-sm resize-none"
                  rows={4}
                  autoFocus
                />
                <div className="flex gap-2 mt-3">
                  <Button onClick={() => { setStep("intro"); setUseTextFallback(false); setErrorMsg(""); }} variant="outline"
                    className="flex-1 h-12 rounded-xl border-gray-600 text-gray-300">
                    Voltar
                  </Button>
                  <Button onClick={() => handleEvaluate(transcript)} disabled={!transcript.trim()}
                    className="flex-[2] h-12 rounded-xl font-bold"
                    style={{ background: "linear-gradient(135deg, #e53935, #c62828)" }}>
                    <Star size={16} className="mr-2" /> Avaliar Resposta
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === "transcribing" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 size={32} className="text-blue-400 animate-spin" />
            <p className="text-gray-300 text-sm font-bold">Transcrevendo seu áudio...</p>
            <p className="text-gray-500 text-xs text-center">Usando IA para entender seu inglês 🎧</p>
          </div>
        )}

        {step === "evaluating" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 size={32} className="text-yellow-400 animate-spin" />
            <p className="text-gray-300 text-sm font-bold">Avaliando sua resposta...</p>
            {transcript && (
              <div className="rounded-xl p-3 w-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="text-xs text-gray-400 mb-1">📝 O que a IA entendeu:</p>
                <p className="text-white text-sm italic">"{transcript}"</p>
              </div>
            )}
          </div>
        )}

        {step === "result" && evaluation && (
          <div className="flex flex-col gap-3">
            {/* Transcript shown */}
            {transcript && (
              <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-xs text-gray-400 mb-1">📝 Sua resposta:</p>
                <p className="text-white text-sm italic">"{transcript}"</p>
              </div>
            )}

            {/* Score */}
            <div className="rounded-2xl p-4 text-center"
              style={{ background: "rgba(45,106,79,0.2)", border: "1px solid #40916c44" }}>
              <div className="text-3xl font-black mb-1"
                style={{ color: evaluation.total_score >= 70 ? "#40916c" : "#f4a923" }}>
                {evaluation.total_score}/100
              </div>
              <p className="text-gray-300 text-sm">{evaluation.feedback_pt}</p>
            </div>

            {/* Chunks used */}
            {evaluation.chunks_used?.length > 0 && (
              <div className="rounded-xl p-3" style={{ background: "rgba(244,169,35,0.1)", border: "1px solid #f4a92344" }}>
                <p className="text-xs text-yellow-400 font-bold mb-1">✓ Chunks usados:</p>
                <div className="flex flex-wrap gap-1">
                  {evaluation.chunks_used.map((c: string, i: number) => (
                    <span key={i} className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestion */}
            <p className="text-xs text-gray-400 italic">💡 {evaluation.suggestion}</p>

            {/* Try again with voice */}
            {useTextFallback && (
              <button
                onClick={() => { setStep("intro"); setTranscript(""); setEvaluation(null); setUseTextFallback(false); setErrorMsg(""); }}
                className="text-blue-400 text-xs text-center underline"
              >
                🎤 Tentar com microfone
              </button>
            )}

            <Button onClick={handleNext} disabled={saving} className="w-full h-12 rounded-xl font-bold"
              style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}>
              {scenarioIdx === totalScenarios - 1
                ? saving ? "Salvando..." : "Concluir Missão ✓"
                : "Próximo Cenário →"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
