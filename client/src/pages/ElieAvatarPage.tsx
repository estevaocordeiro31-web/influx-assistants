import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Send, Loader2, Video, Mic, MicOff, PhoneOff, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

// BRAiN API base (where HeyGen endpoints live)
const BRAIN_API = "https://brain.imaind.tech";

type SessionState = "idle" | "connecting" | "connected" | "error";

export default function ElieAvatarPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "elie"; text: string }[]>([
    { role: "elie", text: "Hi! I'm Miss Elie, your English tutor. Tap 'Connect' to start our live session! I can help you practice conversation, pronunciation, and answer any questions about your lessons." },
  ]);
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Voice input (Web Speech API) ──────────────────────────────────────────

  const toggleVoice = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setIsListening(false);
      // Auto-send after voice input
      if (sessionId && transcript.trim()) {
        setMessages((m) => [...m, { role: "user", text: transcript }]);
        fetch(`${BRAIN_API}/api/heygen/streaming/task`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, text: transcript }),
        }).then(() => {
          setMessages((m) => [...m, { role: "elie", text: "(speaking...)" }]);
          setText("");
        }).catch(() => toast.error("Failed to send voice message"));
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Could not capture audio. Try again.");
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
    toast.success("Listening... speak in English!");
  }, [isListening, sessionId]);

  // ── Start HeyGen streaming session ──────────────────────────────────────

  const startSession = useCallback(async () => {
    setSessionState("connecting");
    setIsVideoReady(false);

    try {
      const resp = await fetch(`${BRAIN_API}/api/heygen/streaming/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: "Elie" }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ?? "Failed to create session");
      }

      const { sessionId: sid, sdp, iceServers } = await resp.json();
      setSessionId(sid);

      const pc = new RTCPeerConnection({ iceServers });
      pcRef.current = pc;

      pc.ontrack = (event) => {
        if (event.track.kind === "video" && videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          setIsVideoReady(true);
          setSessionState("connected");
        }
      };

      pc.onicecandidate = async (event) => {
        if (event.candidate && sid) {
          await fetch(`${BRAIN_API}/api/heygen/streaming/ice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: sid, candidate: event.candidate }),
          });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await fetch(`${BRAIN_API}/api/heygen/streaming/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, sdp: answer }),
      });

      toast.success("Miss Elie connected!");
      setMessages((m) => [...m, { role: "elie", text: "I'm here! What would you like to practice today?" }]);
    } catch (err: any) {
      setSessionState("error");
      toast.error(err.message);
    }
  }, []);

  // ── Stop session ──────────────────────────────────────────────────────────

  const stopSession = useCallback(async () => {
    if (sessionId) {
      await fetch(`${BRAIN_API}/api/heygen/streaming/${sessionId}`, { method: "DELETE" }).catch(() => {});
    }
    pcRef.current?.close();
    pcRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setSessionId(null);
    setSessionState("idle");
    setIsVideoReady(false);
  }, [sessionId]);

  // ── Send text to avatar ───────────────────────────────────────────────────

  const sendText = useCallback(async () => {
    if (!sessionId || !text.trim() || isSending) return;
    const userText = text.trim();
    setIsSending(true);
    setText("");
    setMessages((m) => [...m, { role: "user", text: userText }]);

    try {
      const resp = await fetch(`${BRAIN_API}/api/heygen/streaming/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, text: userText }),
      });

      if (!resp.ok) throw new Error("Failed to send");
      // Avatar will speak the response visually
      setMessages((m) => [...m, { role: "elie", text: "(speaking...)" }]);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSending(false);
    }
  }, [sessionId, text, isSending]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  };

  useEffect(() => {
    return () => { stopSession(); };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1a1145 30%, #0d2137 60%, #0a1628 100%)" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{
        background: "rgba(15,10,30,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <button onClick={() => setLocation("/student/dashboard")} className="text-white/40 hover:text-white/70 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Miss Elie</h1>
            <p className="text-[10px] text-white/40">AI English Tutor</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium" style={{
          background: sessionState === "connected" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
          color: sessionState === "connected" ? "#22c55e" : "rgba(255,255,255,0.4)",
          border: `1px solid ${sessionState === "connected" ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`,
        }}>
          {sessionState === "connected" && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
          {sessionState === "connecting" && <Loader2 className="w-3 h-3 animate-spin" />}
          {sessionState === "connected" ? "LIVE" : sessionState === "connecting" ? "Connecting..." : "Offline"}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-5xl mx-auto w-full">
        {/* Video area */}
        <div className="lg:w-1/2">
          <div className="relative aspect-[3/4] sm:aspect-[9/14] rounded-2xl overflow-hidden" style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoReady ? "opacity-100" : "opacity-0"}`}
            />

            {!isVideoReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{
                  background: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.1))",
                  border: "1px solid rgba(236,72,153,0.2)",
                }}>
                  <img src="/miss-elie-uniform-neutral.png" alt="Miss Elie" className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <Video className="w-8 h-8 text-pink-400 absolute" style={{ display: 'none' }} />
                </div>
                {sessionState === "connecting" && (
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Starting avatar...
                  </div>
                )}
                {sessionState === "idle" && (
                  <p className="text-white/30 text-sm text-center px-8">
                    Tap "Start Session" to connect with Miss Elie's live avatar
                  </p>
                )}
              </div>
            )}

            {sessionState === "connected" && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </div>
            )}
          </div>

          {/* Session controls */}
          <div className="mt-3">
            {sessionState === "idle" || sessionState === "error" ? (
              <Button
                onClick={startSession}
                className="w-full h-12 rounded-xl font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #ec4899, #a855f7)", color: "#fff" }}
              >
                <Video className="w-4 h-4 mr-2" /> Start Session
              </Button>
            ) : (
              <Button
                onClick={stopSession}
                variant="outline"
                className="w-full h-10 rounded-xl text-sm border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <PhoneOff className="w-4 h-4 mr-2" /> End Session
              </Button>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="lg:w-1/2 flex flex-col rounded-2xl overflow-hidden" style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          minHeight: "400px",
        }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm" style={{
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                    : "rgba(255,255,255,0.06)",
                  color: msg.role === "user" ? "#fff" : "rgba(255,255,255,0.8)",
                  borderBottomRightRadius: msg.role === "user" ? "4px" : undefined,
                  borderBottomLeftRadius: msg.role === "elie" ? "4px" : undefined,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex gap-2">
              <Button
                onClick={toggleVoice}
                disabled={sessionState !== "connected"}
                className={`h-10 w-10 rounded-xl p-0 shrink-0 ${isListening ? "animate-pulse" : ""}`}
                style={{
                  background: isListening
                    ? "linear-gradient(135deg, #ef4444, #dc2626)"
                    : "rgba(255,255,255,0.06)",
                  border: isListening ? "none" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white/60" />}
              </Button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : sessionState === "connected" ? "Type or tap mic..." : "Connect first to chat..."}
                disabled={sessionState !== "connected" || isSending}
                className="flex-1 h-10 px-4 rounded-xl text-sm text-white placeholder:text-white/30 outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${isListening ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"}`,
                }}
              />
              <Button
                onClick={sendText}
                disabled={sessionState !== "connected" || isSending || !text.trim()}
                className="h-10 w-10 rounded-xl p-0 shrink-0"
                style={{ background: "linear-gradient(135deg, #ec4899, #a855f7)" }}
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            {isListening && (
              <p className="text-[10px] text-red-400 mt-1.5 text-center animate-pulse">
                Listening... speak in English
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
