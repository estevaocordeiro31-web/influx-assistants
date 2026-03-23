import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Send, Mic, MicOff, Sparkles, BookOpen, History,
  Zap, Square, Loader2, CheckCircle2, AlertCircle, Lightbulb,
  Volume2, TrendingUp, Target, ChevronDown, ChevronUp, ToggleLeft, ToggleRight,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EvaluationResult {
  overallScore: number;
  fluencyLevel: "needs_work" | "developing" | "good" | "very_good" | "excellent";
  isCorrect: boolean;
  correctedVersion: string;
  grammarErrors: Array<{ original: string; correction: string; explanation: string }>;
  suggestedChunk: { chunk: string; equivalencia: string; example: string; reason: string };
  connectedSpeechTip: { tip: string; example: string };
  encouragement: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  isAudio?: boolean;
  audioUrl?: string;
  transcription?: string;
  pronunciationScore?: number;
  evaluation?: EvaluationResult;
  evaluating?: boolean;
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_STUDENT = {
  name: "Estevão",
  level: "advanced",
  currentBook: "Book 5",
  currentUnit: "Unit 8",
  objective: "career",
  chunksLearned: 1847,
};

const DEMO_CHUNKS_BOOK5 = [
  { chunk: "I've been meaning to", equivalent: "Eu tenho querido / Eu estava querendo", context: "Expressar intenção adiada" },
  { chunk: "It goes without saying", equivalent: "É óbvio / Nem precisa dizer", context: "Enfatizar algo evidente" },
  { chunk: "As far as I'm concerned", equivalent: "Na minha opinião / Para mim", context: "Expressar opinião pessoal" },
  { chunk: "I couldn't agree more", equivalent: "Concordo plenamente", context: "Concordância enfática" },
  { chunk: "That being said", equivalent: "Dito isso / Mesmo assim", context: "Transição de ideias" },
];

const TOPIC_SUGGESTIONS = {
  career: [
    { icon: "💼", label: "Reunião de negócios", prompt: "How do I lead a business meeting in English?" },
    { icon: "📊", label: "Apresentação", prompt: "Teach me phrases for giving a professional presentation" },
    { icon: "🤝", label: "Negociação", prompt: "What are key phrases for negotiating in English?" },
    { icon: "📧", label: "Email profissional", prompt: "Help me write professional emails in English" },
  ],
  travel: [
    { icon: "✈️", label: "Aeroporto", prompt: "What phrases do I need at the airport?" },
    { icon: "🏨", label: "Hotel", prompt: "Teach me hotel check-in vocabulary" },
    { icon: "🍽️", label: "Restaurante", prompt: "How do I order food at a restaurant?" },
    { icon: "🚕", label: "Transporte", prompt: "What phrases do I need for transportation?" },
  ],
  studies: [
    { icon: "📚", label: "Vocabulário acadêmico", prompt: "Teach me academic vocabulary" },
    { icon: "✍️", label: "Redação", prompt: "Help me improve my essay writing" },
    { icon: "🎓", label: "Entrevista", prompt: "Prepare me for a university interview" },
    { icon: "📖", label: "Leitura", prompt: "How do I improve my reading comprehension?" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FLUENCY_CONFIG = {
  needs_work:  { label: "Precisa melhorar", color: "text-red-400",    bg: "bg-red-500/10 border-red-500/30",    bar: "bg-red-500" },
  developing:  { label: "Desenvolvendo",    color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", bar: "bg-orange-500" },
  good:        { label: "Bom",              color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", bar: "bg-yellow-500" },
  very_good:   { label: "Muito bom",        color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/30",   bar: "bg-blue-500" },
  excellent:   { label: "Excelente!",       color: "text-green-400",  bg: "bg-green-500/10 border-green-500/30", bar: "bg-green-500" },
};

// ─── Feedback Panel Component ─────────────────────────────────────────────────

function FeedbackPanel({ evaluation, isLoading }: { evaluation?: EvaluationResult; isLoading?: boolean }) {
  const [expanded, setExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="mt-2 ml-11 bg-slate-800/60 border border-slate-600/50 rounded-xl p-3 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-green-400 flex-shrink-0" />
        <span className="text-xs text-slate-400">Avaliando sua resposta com IA...</span>
      </div>
    );
  }

  if (!evaluation) return null;

  const cfg = FLUENCY_CONFIG[evaluation.fluencyLevel];

  return (
    <div className={`mt-2 ml-11 border rounded-xl overflow-hidden ${cfg.bg}`}>
      {/* Header compacto */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-xs font-semibold text-slate-200">Avaliação Fluxie</span>
          {/* Score badge */}
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-slate-700 ${cfg.color}`}>
            {evaluation.overallScore}/100
          </span>
          <span className={`text-xs ${cfg.color}`}>{cfg.label}</span>
          {evaluation.isCorrect && (
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
          )}
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-slate-400" />
          : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Score bar */}
          <div className="w-full bg-slate-700/50 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ${cfg.bar}`}
              style={{ width: `${evaluation.overallScore}%` }}
            />
          </div>

          {/* Encorajamento */}
          <p className="text-xs text-slate-300 italic">{evaluation.encouragement}</p>

          {/* Erros gramaticais */}
          {evaluation.grammarErrors.length > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-semibold text-orange-400">Correções</span>
              </div>
              {evaluation.grammarErrors.map((err, i) => (
                <div key={i} className="bg-slate-900/40 rounded-lg px-2.5 py-1.5 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="line-through text-red-400">"{err.original}"</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-green-400 font-medium">"{err.correction}"</span>
                  </div>
                  <p className="text-slate-400 mt-0.5">{err.explanation}</p>
                </div>
              ))}
              {/* Versão corrigida */}
              {!evaluation.isCorrect && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-2.5 py-1.5">
                  <p className="text-xs text-slate-400">Versão melhorada:</p>
                  <p className="text-xs text-green-300 font-medium">"{evaluation.correctedVersion}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-green-400">Sem erros gramaticais!</span>
            </div>
          )}

          {/* Chunk sugerido */}
          <div className="bg-slate-900/40 rounded-lg px-2.5 py-2 space-y-1">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400">Chunk sugerido</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-white bg-blue-500/20 px-2 py-0.5 rounded-full">
                {evaluation.suggestedChunk.chunk}
              </span>
              <span className="text-xs text-slate-400">=</span>
              <span className="text-xs text-slate-300">{evaluation.suggestedChunk.equivalencia}</span>
            </div>
            <p className="text-xs text-slate-400 italic">"{evaluation.suggestedChunk.example}"</p>
            <p className="text-xs text-slate-500">{evaluation.suggestedChunk.reason}</p>
          </div>

          {/* Connected Speech */}
          <div className="bg-slate-900/40 rounded-lg px-2.5 py-2 space-y-1">
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-semibold text-purple-400">Connected Speech</span>
            </div>
            <p className="text-xs text-slate-300">{evaluation.connectedSpeechTip.tip}</p>
            <p className="text-xs text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded">
              {evaluation.connectedSpeechTip.example}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [guidedMode, setGuidedMode] = useState(true); // Modo Prática Guiada ativo por padrão
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioProcessing, setAudioProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isDemo = location.startsWith("/demo");
  const studentData = isDemo ? DEMO_STUDENT : {
    name: user?.name || "Aluno",
    level: "intermediate",
    currentBook: "Book 3",
    currentUnit: "Unit 5",
    objective: "career",
    chunksLearned: 450,
  };

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const evaluateResponseMutation = trpc.chat.evaluateResponse.useMutation();
  const uploadAudioMutation = trpc.pronunciation.uploadAudio.useMutation();
  const transcribeAndEvaluateMutation = trpc.pronunciation.transcribeAndEvaluate.useMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      if (mediaRecorderRef.current && isRecording) mediaRecorderRef.current.stop();
    };
  }, [isRecording]);

  // ── Audio recording ────────────────────────────────────────────────────────

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudio(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
      toast.success("Gravação iniciada! Fale em inglês...");
    } catch {
      toast.error("Não foi possível acessar o microfone. Verifique as permissões.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setAudioProcessing(true);
    const audioUrl = URL.createObjectURL(audioBlob);
    const userMessage: Message = {
      role: "user",
      content: "🎤 Áudio enviado para avaliação de pronúncia...",
      timestamp: new Date(),
      isAudio: true,
      audioUrl,
    };
    setMessages(prev => [...prev, userMessage]);

    if (isDemo) {
      await simulateAudioProcessing(audioUrl);
      return;
    }

    try {
      // 1. Converter blob para base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        try {
          const base64Data = (reader.result as string).split(",")[1];
          if (!base64Data) throw new Error("Falha ao converter áudio");

          // 2. Upload para S3
          toast.loading("Enviando áudio...", { id: "audio-upload" });
          const { url: s3Url } = await uploadAudioMutation.mutateAsync({
            audioBase64: base64Data,
            mimeType: audioBlob.type || "audio/webm",
          });
          toast.dismiss("audio-upload");

          // 3. Transcrever + avaliar pronúncia
          toast.loading("Transcrevendo e avaliando pronúncia...", { id: "audio-transcribe" });
          const result = await transcribeAndEvaluateMutation.mutateAsync({
            audioUrl: s3Url,
            conversationId: conversationId || 0,
            language: "en",
          });
          toast.dismiss("audio-transcribe");

          const { transcribedText, evaluation, feedbackMessage } = result;

          // 4. Atualizar mensagem do usuário com transcrição real
          setMessages(prev => {
            const updated = [...prev];
            const idx = updated.findLastIndex(m => m.role === "user" && m.isAudio);
            if (idx !== -1) {
              updated[idx] = {
                ...updated[idx],
                content: `🎤 "${transcribedText}"`,
                transcription: transcribedText,
                pronunciationScore: evaluation?.score,
              };
            }
            return updated;
          });

          // 5. Exibir feedback do assistente
          const assistantMessage: Message = {
            role: "assistant",
            content: feedbackMessage,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          toast.success(`Pronúncia avaliada: ${evaluation?.score || 0}/100`);
        } catch (err: any) {
          toast.dismiss("audio-upload");
          toast.dismiss("audio-transcribe");
          toast.error(err?.message || "Erro ao processar áudio. Tente novamente.");
        } finally {
          setAudioProcessing(false);
        }
      };
    } catch {
      toast.error("Erro ao processar áudio");
      setAudioProcessing(false);
    }
  };

  const simulateAudioProcessing = async (audioUrl: string) => {
    await new Promise(r => setTimeout(r, 2000));
    const randomChunk = DEMO_CHUNKS_BOOK5[Math.floor(Math.random() * DEMO_CHUNKS_BOOK5.length)];
    const score = Math.floor(Math.random() * 30) + 70;

    setMessages(prev => {
      const updated = [...prev];
      const idx = updated.findLastIndex(m => m.role === "user" && m.isAudio);
      if (idx !== -1) {
        updated[idx] = {
          ...updated[idx],
          content: `🎤 "I've been meaning to call you about the project"`,
          transcription: "I've been meaning to call you about the project",
          pronunciationScore: score,
        };
      }
      return updated;
    });

    const assistantMessage: Message = {
      role: "assistant",
      content: `Great pronunciation, ${studentData.name}! 🎯\n\n**Score de Pronúncia:** ${score}/100 ${score >= 85 ? "⭐" : ""}\n\n**Chunk detectado:** "${randomChunk.chunk}"\n**Equivalência:** ${randomChunk.equivalent}\n\n**Dica:** ${score >= 85 ? "Continue praticando assim!" : "Tente conectar as palavras de forma mais fluida."} 💪`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMessage]);
    setAudioProcessing(false);
    toast.success(`Pronúncia avaliada: ${score}/100`);
  };

  // ── Evaluate user message ──────────────────────────────────────────────────

  const evaluateUserMessage = useCallback(async (msgIndex: number, messageText: string) => {
    if (isDemo) return; // No evaluation in demo mode

    // Mark message as evaluating
    setMessages(prev => {
      const updated = [...prev];
      if (updated[msgIndex]) updated[msgIndex] = { ...updated[msgIndex], evaluating: true };
      return updated;
    });

    try {
      // Build context from last 3 exchanges
      const contextMessages = messages.slice(-6).map(m =>
        `${m.role === "user" ? "Student" : "Tutor"}: ${m.content.substring(0, 100)}`
      ).join("\n");

      const result = await evaluateResponseMutation.mutateAsync({
        studentMessage: messageText,
        conversationContext: contextMessages || undefined,
        studentLevel: studentData.level,
        studentBook: studentData.currentBook,
      });

      setMessages(prev => {
        const updated = [...prev];
        if (updated[msgIndex]) {
          updated[msgIndex] = { ...updated[msgIndex], evaluating: false, evaluation: result };
        }
        return updated;
      });
    } catch (err) {
      console.error("Evaluation error:", err);
      setMessages(prev => {
        const updated = [...prev];
        if (updated[msgIndex]) updated[msgIndex] = { ...updated[msgIndex], evaluating: false };
        return updated;
      });
    }
  }, [isDemo, messages, evaluateResponseMutation, studentData]);

  // ── Send message ───────────────────────────────────────────────────────────

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const messageText = input.trim();
    const msgIndex = messages.length; // index this message will have
    const userMessage: Message = { role: "user", content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Trigger evaluation in parallel if guided mode is on (only for English messages)
    const looksLikeEnglish = /[a-zA-Z]{3,}/.test(messageText) && messageText.length > 5;
    if (guidedMode && looksLikeEnglish) {
      // Start evaluation after a tiny delay so the message is rendered first
      setTimeout(() => evaluateUserMessage(msgIndex, messageText), 200);
    }

    if (isDemo) {
      await simulateDemoResponse(messageText);
      return;
    }

    try {
      const eventBook = localStorage.getItem('event_book') || undefined;
      const result = await sendMessageMutation.mutateAsync({
        conversationId: conversationId || undefined,
        message: messageText,
        objective: studentData.objective,
        level: studentData.level,
        book: eventBook,
      });

      setConversationId(result.conversationId);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: result.message,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
      }]);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setLoading(false);
    }
  };

  const simulateDemoResponse = async (userInput: string) => {
    await new Promise(r => setTimeout(r, 1500));
    const randomChunk = DEMO_CHUNKS_BOOK5[Math.floor(Math.random() * DEMO_CHUNKS_BOOK5.length)];
    const responses = [
      `Great question, ${studentData.name}! 🎯\n\nLet me teach you a powerful chunk for this:\n\n**CHUNK:** "${randomChunk.chunk}"\n**EQUIVALÊNCIA:** ${randomChunk.equivalent}\n**CONTEXTO:** ${randomChunk.context}\n\n**EXEMPLO:**\n> "${randomChunk.chunk} talk to you about this project."\n\nThis is a very natural expression used by native speakers. Try using it in your next conversation! 💪`,
      `Excellent! Let's work on that, ${studentData.name}! 📚\n\nHere's a chunk that will help you sound more natural:\n\n**CHUNK:** "${randomChunk.chunk}"\n**EQUIVALÊNCIA:** ${randomChunk.equivalent}\n\n**QUANDO USAR:**\n${randomChunk.context}\n\nRemember: Chunks are the secret to fluency! 🌟`,
    ];
    setMessages(prev => [...prev, {
      role: "assistant",
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
    }]);
    setLoading(false);
  };

  const handleTopicClick = (prompt: string) => setInput(prompt);
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const suggestions = TOPIC_SUGGESTIONS[studentData.objective as keyof typeof TOPIC_SUGGESTIONS] || TOPIC_SUGGESTIONS.career;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost" size="sm"
            onClick={() => setLocation(isDemo ? "/demo" : "/student/dashboard")}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="relative">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/miss-elie-uniform-avatar_17347370.jpg" alt="Miss Elie"
              className="w-12 h-12 rounded-full border-2 border-green-500 shadow-lg shadow-green-500/20 object-cover" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>

          <div className="flex-1">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Miss Elie
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">AI Tutor</span>
            </h1>
            <p className="text-sm text-slate-400">{studentData.currentBook} • {studentData.currentUnit}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Modo Prática Guiada toggle */}
            <button
              onClick={() => setGuidedMode(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                guidedMode
                  ? "bg-green-500/20 border-green-500/40 text-green-400"
                  : "bg-slate-700/50 border-slate-600 text-slate-400"
              }`}
              title={guidedMode ? "Desativar avaliação automática" : "Ativar avaliação automática"}
            >
              {guidedMode
                ? <ToggleRight className="w-4 h-4" />
                : <ToggleLeft className="w-4 h-4" />}
              <span className="hidden sm:inline">Prática Guiada</span>
            </button>

            <Button variant="ghost" size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <History className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1 bg-slate-700/50 px-3 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-slate-300 font-medium">{studentData.chunksLearned}</span>
            </div>
          </div>
        </div>

        {/* Guided mode banner */}
        {guidedMode && (
          <div className="max-w-4xl mx-auto px-4 pb-2">
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <p className="text-xs text-green-300">
                <strong>Prática Guiada ativa</strong> — cada mensagem em inglês será avaliada automaticamente com feedback de gramática, chunks e connected speech.
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Messages area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 flex flex-col overflow-hidden">
        <Card className="flex-1 flex flex-col bg-slate-800/50 border-slate-700 overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              /* Welcome screen */
              <div className="flex flex-col items-center justify-center h-full text-center">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/miss-elie-uniform-teaching-2_17347370.jpg" alt="Miss Elie" className="w-32 h-32 mb-6 drop-shadow-2xl rounded-2xl object-cover border-2 border-green-500/40 shadow-xl shadow-green-500/20" />
                <h2 className="text-2xl font-bold text-white mb-2">Hey, {studentData.name}! 👋</h2>
                <p className="text-slate-400 mb-2 max-w-md">
                  Sou seu tutor pessoal de inglês. Vou te ajudar a aprender usando
                  <span className="text-green-400 font-semibold"> chunks </span>e
                  <span className="text-blue-400 font-semibold"> equivalências</span>!
                </p>
                <p className="text-sm text-slate-500 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Você está no {studentData.currentBook} - {studentData.currentUnit}
                </p>
                {guidedMode && (
                  <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 mb-6">
                    <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs text-green-400">Prática Guiada ativa — suas respostas serão avaliadas em tempo real</span>
                  </div>
                )}

                <div className="w-full max-w-lg">
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Sugestões para você</p>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestions.map((topic, idx) => (
                      <Button key={idx} variant="outline" size="sm"
                        className="justify-start border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500"
                        onClick={() => handleTopicClick(topic.prompt)}
                      >
                        <span className="text-lg mr-2">{topic.icon}</span>
                        <span className="text-left">{topic.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 w-full max-w-lg">
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Chunks do seu nível</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {DEMO_CHUNKS_BOOK5.slice(0, 3).map((chunk, idx) => (
                      <button key={idx}
                        onClick={() => setInput(`Teach me how to use "${chunk.chunk}"`)}
                        className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-sm hover:from-green-500/20 hover:to-blue-500/20 transition-all"
                      >
                        {chunk.chunk}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 max-w-lg">
                  <p className="text-sm text-purple-300">
                    <Mic className="w-4 h-4 inline mr-2" />
                    <strong>Novo!</strong> Clique no microfone para praticar sua pronúncia com feedback personalizado!
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx}>
                    <div className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {/* Fluxie avatar */}
                      {msg.role === "assistant" && (
                        <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/miss-elie-uniform-avatar_17347370.jpg" alt="Miss Elie"
                          className="w-8 h-8 rounded-full border border-green-500/50 flex-shrink-0 mt-1 object-cover" />
                      )}

                      <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                        msg.role === "user"
                          ? msg.isAudio
                            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-br-md"
                            : "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md"
                          : "bg-slate-700/80 text-slate-100 rounded-bl-md border border-slate-600"
                      }`}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <Streamdown>{msg.content}</Streamdown>
                          </div>
                        ) : (
                          <div>
                            {msg.isAudio && (
                              <div className="flex items-center gap-2 mb-2">
                                <Mic className="w-4 h-4" />
                                <span className="text-xs opacity-75">Áudio</span>
                                {msg.pronunciationScore && (
                                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                    Score: {msg.pronunciationScore}/100
                                  </span>
                                )}
                              </div>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            {msg.audioUrl && (
                              <audio src={msg.audioUrl} controls className="mt-2 w-full h-8 opacity-75" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* User avatar */}
                      {msg.role === "user" && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-white text-sm font-bold ${
                          msg.isAudio
                            ? "bg-gradient-to-br from-purple-500 to-pink-600"
                            : "bg-gradient-to-br from-blue-500 to-purple-600"
                        }`}>
                          {studentData.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Feedback panel for user messages */}
                    {msg.role === "user" && !msg.isAudio && (msg.evaluating || msg.evaluation) && (
                      <FeedbackPanel evaluation={msg.evaluation} isLoading={msg.evaluating} />
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {(loading || audioProcessing) && (
                  <div className="flex gap-3 justify-start">
                    <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/miss-elie-uniform-avatar_17347370.jpg" alt="Miss Elie"
                      className="w-8 h-8 rounded-full border border-green-500/50 flex-shrink-0 mt-1 animate-pulse object-cover" />
                    <div className="bg-slate-700/80 text-slate-100 px-4 py-3 rounded-2xl rounded-bl-md border border-slate-600">
                      <div className="flex items-center gap-2">
                        {audioProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                            <span className="text-sm text-slate-400">Analisando pronúncia...</span>
                          </>
                        ) : (
                          <div className="flex gap-1.5">
                            {[0, 0.15, 0.3].map((delay, i) => (
                              <div key={i} className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                                style={{ animationDelay: `${delay}s` }} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Input area */}
        <div className="mt-4 space-y-2">
          {isRecording && (
            <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl p-3 animate-pulse">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-medium">Gravando... {formatTime(recordingTime)}</span>
              <Button onClick={stopRecording} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                <Square className="w-4 h-4 mr-1" />
                Parar
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message in English..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={loading || isRecording || audioProcessing}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 pr-12 h-12 rounded-xl focus:border-green-500 focus:ring-green-500/20"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim() || isRecording || audioProcessing}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-12 w-12 rounded-xl shadow-lg shadow-green-500/20"
            >
              <Send className="w-5 h-5" />
            </Button>
            <Button
              variant="outline" size="icon"
              disabled={loading || audioProcessing}
              onClick={isRecording ? stopRecording : startRecording}
              className={`h-12 w-12 rounded-xl transition-all ${
                isRecording
                  ? "bg-red-500 border-red-500 text-white hover:bg-red-600 animate-pulse"
                  : "border-slate-600 bg-slate-800 text-slate-300 hover:bg-purple-500/20 hover:border-purple-500 hover:text-purple-400"
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
          </div>
          <p className="text-xs text-slate-500 text-center">
            {guidedMode
              ? "💡 Modo Prática Guiada ativo — suas respostas em inglês serão avaliadas automaticamente"
              : "💡 Digite ou grave áudio para praticar com o Fluxie"}
          </p>
        </div>
      </main>
    </div>
  );
}
