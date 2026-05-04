/**
 * TotemMode — Physical totem interface at inFlux schools
 *
 * URL: /totem/:totemId
 * No authentication required — uses QR scan to identify students.
 *
 * States: IDLE → SCANNING → GREETING → SESSION → IDLE
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "wouter";
import { QrCode, Clock, Zap, Flame, ChevronRight, Wifi, WifiOff } from "lucide-react";

const BRAIN_API = "https://brain.imaind.tech";

// ── Types ────────────────────────────────────────────────────────────────────

interface Environment {
  id: string;
  name: string;
  type: string;
  eliePersona: {
    tone: string;
    idleMessage: string;
    greetingTemplate: string;
    allowVoice: boolean;
    showProgress: boolean;
    showLeaderboard: boolean;
  };
  sessionTimeout: number;
}

interface CheckinResult {
  success: boolean;
  studentId?: string;
  environment: Environment;
  greeting: string;
  xpBonus?: number;
  streakUpdate?: boolean;
  nextAction: string;
  checkinReward?: {
    xpEarned: number;
    influxDollarsEarned: number;
    streakUpdated: boolean;
    badgeUnlocked?: string;
    elieMessage: string;
    animation: string;
  };
}

type TotemState = "idle" | "scanning" | "greeting" | "session";

// ── Elie SVG Avatar (large totem version) ────────────────────────────────────

function TotemElieAvatar({ state, size = 200 }: { state: string; size?: number }) {
  const [blinkOpen, setBlinkOpen] = useState(true);
  const [floatY, setFloatY] = useState(0);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkOpen(false);
      setTimeout(() => setBlinkOpen(true), 150);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.02;
      setFloatY(Math.sin(t) * 8);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const mouthOpen = state === "speaking" || state === "greeting";
  const eyeScale = blinkOpen ? 1 : 0.1;
  const glowColor = state === "greeting" ? "#a855f7" : state === "session" ? "#2e8b7a" : "#6b3fa0";

  return (
    <div style={{ transform: `translateY(${floatY}px)`, transition: "transform 0.3s ease" }}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        {/* Glow */}
        <defs>
          <radialGradient id="tglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glowColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="tface" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#f5e6d3" />
            <stop offset="100%" stopColor="#e8d5c0" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="95" fill="url(#tglow)" />

        {/* Hair back */}
        <ellipse cx="100" cy="78" rx="62" ry="60" fill="#2d1b4e" />

        {/* Face */}
        <ellipse cx="100" cy="95" rx="48" ry="52" fill="url(#tface)" />

        {/* Eyes */}
        <g transform={`translate(78, 85) scale(1, ${eyeScale})`}>
          <ellipse cx="0" cy="0" rx="7" ry="7" fill="white" />
          <circle cx="1" cy="0" r="4.5" fill="#6b3fa0" />
          <circle cx="2" cy="-1" r="2" fill="#1a0a2e" />
          <circle cx="3.5" cy="-2.5" r="1" fill="white" opacity="0.8" />
        </g>
        <g transform={`translate(122, 85) scale(1, ${eyeScale})`}>
          <ellipse cx="0" cy="0" rx="7" ry="7" fill="white" />
          <circle cx="1" cy="0" r="4.5" fill="#6b3fa0" />
          <circle cx="2" cy="-1" r="2" fill="#1a0a2e" />
          <circle cx="3.5" cy="-2.5" r="1" fill="white" opacity="0.8" />
        </g>

        {/* Eyebrows */}
        <path d="M68 74 Q78 68 88 72" stroke="#2d1b4e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M112 72 Q122 68 132 74" stroke="#2d1b4e" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <path d="M97 97 Q100 102 103 97" stroke="#d4b5a0" strokeWidth="1.5" fill="none" />

        {/* Mouth */}
        {mouthOpen ? (
          <ellipse cx="100" cy="115" rx="10" ry="7" fill="#c0392b" opacity="0.8" />
        ) : (
          <path d="M88 112 Q100 122 112 112" stroke="#c0392b" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Hair front */}
        <path d="M52 78 Q55 45 75 38 Q90 34 100 36 Q110 34 125 38 Q145 45 148 78 Q145 65 135 58 Q120 50 100 48 Q80 50 65 58 Q55 65 52 78Z" fill="#2d1b4e" />

        {/* Blush */}
        <ellipse cx="72" cy="105" rx="8" ry="4" fill="#ff9999" opacity="0.2" />
        <ellipse cx="128" cy="105" rx="8" ry="4" fill="#ff9999" opacity="0.2" />
      </svg>
    </div>
  );
}

// ── Idle Screen ──────────────────────────────────────────────────────────────

function TotemIdleScreen({
  environment,
  onScanClick,
}: {
  environment: Environment | null;
  onScanClick: () => void;
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      {/* Clock */}
      <div className="absolute top-8 right-8 text-white/40 text-xl font-mono">
        {time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
      </div>

      {/* Environment badge */}
      {environment && (
        <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: "rgba(107,63,160,0.15)", border: "1px solid rgba(107,63,160,0.3)" }}>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/60 text-sm font-medium">{environment.name}</span>
        </div>
      )}

      {/* Avatar */}
      <div className="mb-8">
        <TotemElieAvatar state="idle" size={220} />
      </div>

      {/* Idle message */}
      <p className="text-white/50 text-2xl font-light mb-12 max-w-md leading-relaxed"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {environment?.eliePersona.idleMessage || "Scan your QR to check in"}
      </p>

      {/* Scan button */}
      <button
        onClick={onScanClick}
        className="flex items-center gap-4 px-12 py-6 rounded-2xl text-white text-xl font-semibold transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #6b3fa0, #2e8b7a)",
          boxShadow: "0 8px 32px rgba(107,63,160,0.3)",
          minHeight: "80px",
        }}
      >
        <QrCode className="w-8 h-8" />
        Scan QR Code
      </button>

      {/* Powered by */}
      <p className="absolute bottom-6 text-white/20 text-xs">
        Powered by ImAInd Presence System
      </p>
    </div>
  );
}

// ── QR Scanner Overlay ───────────────────────────────────────────────────────

function TotemQRScanner({
  onScan,
  onCancel,
}: {
  onScan: (data: string) => void;
  onCancel: () => void;
}) {
  const [manualInput, setManualInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // In production, this would use @zxing/browser for camera scanning.
  // For now, accept manual QR data input (USB barcode scanner sends keystrokes).
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && manualInput.trim()) {
      onScan(manualInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.9)" }}>

      {/* Scanning frame */}
      <div className="relative w-72 h-72 mb-8">
        <div className="absolute inset-0 border-2 border-white/20 rounded-2xl" />
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-green-400 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-green-400 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-green-400 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-green-400 rounded-br-2xl" />

        {/* Scanning line */}
        <div className="absolute left-4 right-4 h-0.5 bg-green-400 rounded-full animate-scan-line"
          style={{ animation: "totem-scan 2s ease-in-out infinite" }} />

        <div className="absolute inset-0 flex items-center justify-center">
          <QrCode className="w-16 h-16 text-white/20" />
        </div>
      </div>

      <p className="text-white/60 text-xl mb-6">Point your QR code at the scanner</p>

      {/* Hidden input for USB barcode scanner */}
      <input
        ref={inputRef}
        type="text"
        value={manualInput}
        onChange={(e) => setManualInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-80 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 text-center text-lg focus:outline-none focus:border-green-400"
        placeholder="Or type QR data..."
      />

      <button
        onClick={onCancel}
        className="mt-8 px-8 py-4 rounded-xl text-white/50 text-lg hover:text-white/80 transition-colors"
        style={{ background: "rgba(255,255,255,0.05)", minHeight: "60px" }}
      >
        Cancel
      </button>

      <style>{`
        @keyframes totem-scan {
          0%, 100% { top: 10%; }
          50% { top: 85%; }
        }
      `}</style>
    </div>
  );
}

// ── Greeting Screen ──────────────────────────────────────────────────────────

function TotemGreetingScreen({
  result,
  onContinue,
}: {
  result: CheckinResult;
  onContinue: () => void;
}) {
  const [showXP, setShowXP] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowXP(true), 500);
    if (result.checkinReward?.badgeUnlocked) {
      setTimeout(() => setShowBadge(true), 1200);
    }
    // Auto-continue after 5s
    const timer = setTimeout(onContinue, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center"
      onClick={onContinue}>

      <TotemElieAvatar state="greeting" size={180} />

      {/* Greeting */}
      <div className="mt-6 mb-8 max-w-lg">
        <p className="text-white text-3xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
          {result.greeting}
        </p>
      </div>

      {/* XP animation */}
      {showXP && result.xpBonus && result.xpBonus > 0 && (
        <div className="mb-4 flex items-center gap-3 px-6 py-3 rounded-xl animate-bounce"
          style={{ background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.3)" }}>
          <Zap className="w-6 h-6 text-yellow-400" />
          <span className="text-yellow-400 text-2xl font-bold">+{result.xpBonus} XP</span>
        </div>
      )}

      {/* Badge unlock */}
      {showBadge && result.checkinReward?.badgeUnlocked && (
        <div className="mb-4 px-6 py-3 rounded-xl"
          style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <span className="text-purple-400 text-lg font-bold">
            Badge Unlocked: {result.checkinReward.badgeUnlocked}!
          </span>
        </div>
      )}

      {/* Elie message */}
      {result.checkinReward?.elieMessage && (
        <p className="text-white/50 text-lg mt-2">{result.checkinReward.elieMessage}</p>
      )}

      <p className="mt-8 text-white/30 text-sm">Tap anywhere to continue</p>
    </div>
  );
}

// ── Student Session Screen ───────────────────────────────────────────────────

function TotemStudentSession({
  result,
  environment,
  onEnd,
}: {
  result: CheckinResult;
  environment: Environment;
  onEnd: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(environment.sessionTimeout * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const progressPct = (timeLeft / (environment.sessionTimeout * 60)) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col min-h-screen p-6">
      {/* Timer bar */}
      <div className="w-full h-2 rounded-full bg-white/10 mb-6 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${progressPct}%`,
            background: progressPct > 30 ? "linear-gradient(90deg, #6b3fa0, #2e8b7a)" : "#ef4444",
          }} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/40 text-sm">{environment.name}</span>
        </div>
        <span className="text-white/40 text-sm font-mono">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Avatar + greeting */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <TotemElieAvatar state="session" size={160} />

        <div className="mt-4 mb-8 text-center">
          <p className="text-white text-xl font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {result.checkinReward?.elieMessage || result.greeting}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-8">
          <div className="rounded-xl p-4 text-center"
            style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.15)" }}>
            <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
            <p className="text-white text-lg font-bold">+{result.xpBonus || 0}</p>
            <p className="text-white/40 text-xs">XP Today</p>
          </div>
          <div className="rounded-xl p-4 text-center"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <Flame className="w-5 h-5 mx-auto mb-1 text-red-400" />
            <p className="text-white text-lg font-bold">{result.checkinReward?.streakUpdated ? "+" : ""}1</p>
            <p className="text-white/40 text-xs">Streak</p>
          </div>
          <div className="rounded-xl p-4 text-center"
            style={{ background: "rgba(46,139,122,0.1)", border: "1px solid rgba(46,139,122,0.15)" }}>
            <Clock className="w-5 h-5 mx-auto mb-1 text-teal-400" />
            <p className="text-white text-lg font-bold">{minutes}m</p>
            <p className="text-white/40 text-xs">Left</p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-4 w-full max-w-md">
          <button className="flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl text-white text-lg font-semibold transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #6b3fa0, #2e8b7a)",
              boxShadow: "0 4px 16px rgba(107,63,160,0.3)",
              minHeight: "80px",
            }}>
            Quick Challenge
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl text-white/60 text-lg font-semibold transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              minHeight: "80px",
            }}>
            My Progress
          </button>
        </div>
      </div>

      {/* End session */}
      <button onClick={onEnd}
        className="mt-6 py-4 text-white/30 text-sm hover:text-white/50 transition-colors">
        End Session
      </button>
    </div>
  );
}

// ── Main TotemMode ───────────────────────────────────────────────────────────

export default function TotemMode() {
  const params = useParams<{ totemId: string }>();
  const totemId = params.totemId || "totem-reception-jundiai";

  const [state, setState] = useState<TotemState>("idle");
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [checkinResult, setCheckinResult] = useState<CheckinResult | null>(null);
  const [online, setOnline] = useState(true);

  // Load environment config
  useEffect(() => {
    async function loadEnv() {
      try {
        const res = await fetch(`${BRAIN_API}/api/presence/totem/${totemId}/environment`);
        if (res.ok) {
          const env = await res.json();
          setEnvironment(env);
          setOnline(true);
        }
      } catch {
        setOnline(false);
      }
    }
    loadEnv();
  }, [totemId]);

  const handleScan = useCallback(async (qrData: string) => {
    try {
      const res = await fetch(`${BRAIN_API}/api/presence/qr/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData, totemId }),
      });
      const result: CheckinResult = await res.json();
      setCheckinResult(result);
      setState(result.success ? "greeting" : "idle");
    } catch {
      setState("idle");
    }
  }, [totemId]);

  const handleGreetingDone = useCallback(() => {
    setState("session");
  }, []);

  const handleSessionEnd = useCallback(() => {
    setCheckinResult(null);
    setState("idle");
  }, []);

  return (
    <div className="min-h-screen relative"
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 30%, #0d1117 70%, #0a1a15 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

      {/* Online indicator */}
      <div className="absolute top-4 right-4 z-50">
        {online ? (
          <Wifi className="w-4 h-4 text-green-400/50" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-400/50" />
        )}
      </div>

      {state === "idle" && (
        <TotemIdleScreen
          environment={environment}
          onScanClick={() => setState("scanning")}
        />
      )}

      {state === "scanning" && (
        <TotemQRScanner
          onScan={handleScan}
          onCancel={() => setState("idle")}
        />
      )}

      {state === "greeting" && checkinResult && (
        <TotemGreetingScreen
          result={checkinResult}
          onContinue={handleGreetingDone}
        />
      )}

      {state === "session" && checkinResult && environment && (
        <TotemStudentSession
          result={checkinResult}
          environment={environment}
          onEnd={handleSessionEnd}
        />
      )}
    </div>
  );
}
