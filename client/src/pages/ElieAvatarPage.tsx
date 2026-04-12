import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, Video, Mic, MicOff, PhoneOff, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Room, RoomEvent, Track, RemoteTrack, RemoteTrackPublication, ConnectionState } from "livekit-client";

// BRAiN API base (where HeyGen/LiveAvatar endpoints live)
const BRAIN_API = "https://brain.imaind.tech";

type SessionState = "idle" | "connecting" | "connected" | "error";

export default function ElieAvatarPage() {
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const roomRef = useRef<Room | null>(null);

  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  // ── Start LiveAvatar session ──────────────────────────────────────────────

  const startSession = useCallback(async () => {
    setSessionState("connecting");
    setIsVideoReady(false);

    try {
      // Step 1: Create session via BRAiN backend
      const resp = await fetch(`${BRAIN_API}/api/heygen/streaming/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: "Elie" }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ?? "Failed to create session");
      }

      const data = await resp.json();
      setSessionId(data.sessionId);

      if (data.provider === "liveavatar" && data.livekitUrl && data.livekitToken) {
        // ── LiveAvatar + LiveKit flow ──
        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        });
        roomRef.current = room;

        // Handle remote tracks (avatar video + audio)
        room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: RemoteTrackPublication) => {
          if (track.kind === Track.Kind.Video && videoRef.current) {
            track.attach(videoRef.current);
            setIsVideoReady(true);
            setSessionState("connected");
          }
          if (track.kind === Track.Kind.Audio) {
            // Attach audio to its own element
            if (audioRef.current) {
              track.attach(audioRef.current);
              // Force play (user already clicked "Start Session" so we have interaction)
              audioRef.current.play().catch(() => {});
            }
            // Also attach to video element as fallback
            if (videoRef.current) {
              track.attach(videoRef.current);
            }
          }
        });

        room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
          track.detach();
        });

        room.on(RoomEvent.Disconnected, () => {
          setSessionState("idle");
          setIsVideoReady(false);
          setIsMicOn(false);
        });

        room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
          if (state === ConnectionState.Connected) {
            toast.success("Miss Elie connected!");
          }
        });

        // Connect to LiveKit room
        await room.connect(data.livekitUrl, data.livekitToken);

        // Enable microphone for voice conversation
        await room.localParticipant.setMicrophoneEnabled(true);
        setIsMicOn(true);

      } else {
        // ── Legacy HeyGen WebRTC flow (fallback) ──
        const pc = new RTCPeerConnection({ iceServers: data.iceServers || [] });

        pc.ontrack = (event) => {
          if (event.track.kind === "video" && videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
            setIsVideoReady(true);
            setSessionState("connected");
          }
        };

        pc.onicecandidate = async (event) => {
          if (event.candidate && data.sessionId) {
            await fetch(`${BRAIN_API}/api/heygen/streaming/ice`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: data.sessionId, candidate: event.candidate }),
            });
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        await fetch(`${BRAIN_API}/api/heygen/streaming/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: data.sessionId, sdp: answer }),
        });

        toast.success("Miss Elie connected!");
        setSessionState("connected");
      }
    } catch (err: any) {
      setSessionState("error");
      toast.error(err.message);
    }
  }, []);

  // ── Toggle microphone ────────────────────────────────────────────────────

  const toggleMic = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;

    const newState = !isMicOn;
    await room.localParticipant.setMicrophoneEnabled(newState);
    setIsMicOn(newState);
    toast(newState ? "Microphone on — speak in English!" : "Microphone muted");
  }, [isMicOn]);

  // ── Stop session ──────────────────────────────────────────────────────────

  const stopSession = useCallback(async () => {
    // Disconnect LiveKit room
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }

    // Notify backend
    if (sessionId) {
      await fetch(`${BRAIN_API}/api/heygen/streaming/${sessionId}`, { method: "DELETE" }).catch(() => {});
    }

    if (videoRef.current) videoRef.current.srcObject = null;
    setSessionId(null);
    setSessionState("idle");
    setIsVideoReady(false);
    setIsMicOn(false);
  }, [sessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      roomRef.current?.disconnect();
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1a1145 30%, #0d2137 60%, #0a1628 100%)" }}>
      {/* Hidden audio element for avatar voice */}
      <audio ref={audioRef} autoPlay playsInline style={{ display: "none" }} />

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
            <p className="text-[10px] text-white/40">AI English Tutor — Live Avatar</p>
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

      {/* Main content — full-screen video focus */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* Video area */}
        <div className="w-full">
          <div className="relative aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden" style={{
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
                  <Video className="w-8 h-8 text-pink-400" />
                </div>
                {sessionState === "connecting" && (
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Connecting to Miss Elie...
                  </div>
                )}
                {sessionState === "idle" && (
                  <p className="text-white/30 text-sm text-center px-8">
                    Tap "Start Session" to talk with Miss Elie live
                  </p>
                )}
                {sessionState === "error" && (
                  <p className="text-red-400/60 text-sm text-center px-8">
                    Connection failed. Tap "Start Session" to try again.
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

            {/* Mic indicator overlay */}
            {sessionState === "connected" && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium" style={{
                background: isMicOn ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                color: isMicOn ? "#22c55e" : "#ef4444",
                border: `1px solid ${isMicOn ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              }}>
                {isMicOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                {isMicOn ? "Listening" : "Muted"}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 flex gap-3">
            {sessionState === "idle" || sessionState === "error" ? (
              <Button
                onClick={startSession}
                className="flex-1 h-14 rounded-xl font-bold text-base"
                style={{ background: "linear-gradient(135deg, #ec4899, #a855f7)", color: "#fff" }}
              >
                <Video className="w-5 h-5 mr-2" /> Start Session
              </Button>
            ) : (
              <>
                <Button
                  onClick={toggleMic}
                  className={`h-14 w-14 rounded-xl p-0 shrink-0 ${isMicOn ? "animate-pulse" : ""}`}
                  style={{
                    background: isMicOn
                      ? "linear-gradient(135deg, #22c55e, #16a34a)"
                      : "rgba(255,255,255,0.06)",
                    border: isMicOn ? "none" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {isMicOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white/60" />}
                </Button>
                <Button
                  onClick={stopSession}
                  variant="outline"
                  className="flex-1 h-14 rounded-xl text-base border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <PhoneOff className="w-5 h-5 mr-2" /> End Session
                </Button>
              </>
            )}
          </div>

          {/* Instructions */}
          {sessionState === "connected" && (
            <div className="mt-4 text-center">
              <p className="text-white/40 text-sm">
                {isMicOn
                  ? "Speak in English — Miss Elie is listening and will respond!"
                  : "Tap the mic button to start talking with Miss Elie"}
              </p>
            </div>
          )}

          {sessionState === "idle" && (
            <div className="mt-6 px-4">
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 className="text-white/60 text-xs font-semibold mb-2 uppercase tracking-wider">How it works</h3>
                <ul className="space-y-1.5 text-white/40 text-sm">
                  <li>1. Tap "Start Session" to connect</li>
                  <li>2. Allow microphone access when prompted</li>
                  <li>3. Speak in English — Miss Elie will listen and respond</li>
                  <li>4. Practice conversation, vocabulary, pronunciation</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
