/**
 * PresenceDashboard — Conversational Action Dashboard
 *
 * Elie's presence-driven interface:
 * 1. TopStatusBar — streak, XP, book progress, state pill
 * 2. HeroPanel — PresenceAvatar + SpeechBubble + CTAs
 * 3. ContextCards — NextGoal + DailyMission
 * 4. BottomInputBar — mic + chat input + send
 */

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import PresenceAvatar from "./PresenceAvatar";
import { usePresence, type PresenceData } from "@/hooks/usePresence";
import {
  Flame, BookOpen, Star, Mic, MicOff, Send,
  ChevronRight, Sparkles, Target, Zap
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

// ── Speech Bubble ────────────────────────────────────────────────────────────

function SpeechBubble({ text, accent }: { text: string; accent: string }) {
  return (
    <div
      className="relative rounded-2xl px-5 py-3 max-w-sm"
      style={{
        background: `${accent}15`,
        border: `1px solid ${accent}30`,
        color: "#fff",
      }}
    >
      <p className="text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {text}
      </p>
      {/* Arrow pointing to avatar */}
      <div
        className="absolute -top-2 left-8 w-4 h-4 rotate-45"
        style={{ background: `${accent}15`, borderTop: `1px solid ${accent}30`, borderLeft: `1px solid ${accent}30` }}
      />
    </div>
  );
}

// ── CTA Button Group ─────────────────────────────────────────────────────────

function CTAGroup({
  buttons,
  accent,
  onAction,
}: {
  buttons: PresenceData["ctaButtons"];
  accent: string;
  onAction: (action: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {buttons.map((btn, i) => (
        <button
          key={i}
          onClick={() => onAction(btn.action)}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
          style={{
            background: btn.type === "primary" ? `linear-gradient(135deg, #6b3fa0, #2e8b7a)` : btn.type === "secondary" ? `${accent}20` : "transparent",
            color: btn.type === "primary" ? "#fff" : accent,
            border: btn.type === "tertiary" ? `1px solid ${accent}30` : "none",
          }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

// ── Status Pill ──────────────────────────────────────────────────────────────

function StatePill({ state, accent }: { state: string; accent: string }) {
  const labels: Record<string, string> = {
    idle: "Online",
    listening: "Listening...",
    thinking: "Thinking...",
    speaking: "Speaking",
    reacting: "Reacting",
    encouraging: "Cheering!",
  };

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{
        background: `${accent}20`,
        color: accent,
        border: `1px solid ${accent}30`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: accent,
          animation: state !== "idle" ? "elie-react 1.5s infinite" : undefined,
        }}
      />
      {labels[state] || "Online"}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function PresenceDashboard() {
  const { user } = useAuth();
  const {
    presence,
    isConnected,
    todayInteractions,
    triggerTransition,
    sendInteraction,
    computePresence,
    resetIdle,
  } = usePresence(user?.id);

  const [inputText, setInputText] = useState("");
  const [isMicActive, setIsMicActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accent = presence.themeAccent || "#6b3fa0";

  // ── Handle send message ────────────────────────────────────────────────────

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    setInputText("");
    resetIdle();

    // Transition to listening → thinking → speaking
    await triggerTransition("listening", "user_message");

    // Small delay for the "thinking" effect
    setTimeout(async () => {
      await triggerTransition("thinking", "processing_message");
    }, presence.microReactionDelay || 200);

    // Send interaction
    await sendInteraction("message", text);

    // Compute new presence based on message
    await computePresence({
      intent: "engage_student",
      emotion: "neutral",
      context: "idle",
      user_state: "focused",
      student: { name: user?.name || "Student" },
    });

    toast.success("+5 XP", { duration: 2000, position: "top-center" });
  };

  // ── Handle CTA action ─────────────────────────────────────────────────────

  const handleAction = (action: string) => {
    resetIdle();
    sendInteraction("cta_click", action);

    switch (action) {
      case "voice_practice":
        toast("Opening Voice Chat...");
        break;
      case "start_lesson":
      case "continue_lesson":
        toast("Loading your lesson...");
        break;
      case "free_chat":
        inputRef.current?.focus();
        break;
      default:
        toast(`Action: ${action}`);
    }
  };

  // ── Handle mic toggle ─────────────────────────────────────────────────────

  const handleMicToggle = () => {
    const next = !isMicActive;
    setIsMicActive(next);
    resetIdle();

    if (next) {
      triggerTransition("listening", "mic_activated");
      sendInteraction("voice");
    } else {
      triggerTransition("idle", "mic_deactivated");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: "linear-gradient(135deg, #0f0a1e 0%, #1a1145 30%, #0d2137 60%, #0a1628 100%)",
    }}>

      {/* ═══ TOP STATUS BAR ═══ */}
      <div className="px-4 py-3 flex items-center justify-between" style={{
        background: "rgba(15,10,30,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div className="flex items-center gap-3">
          {/* Mini avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6b3fa0, #2e8b7a)" }}>
            <span className="text-xs">💜</span>
          </div>
          <div>
            <p className="text-white text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
              Miss Elie
            </p>
            <p className="text-white/30 text-[10px]">
              {isConnected ? "Presence active" : "Connecting..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
            style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>
            <Flame className="w-3 h-3" /> 12
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
            style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>
            <Star className="w-3 h-3" /> 850 XP
          </div>
          <StatePill state={presence.avatarState} accent={accent} />
        </div>
      </div>

      {/* ═══ HERO PANEL ═══ */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-lg mx-auto w-full">

        {/* Avatar */}
        <div className="mb-4">
          <PresenceAvatar
            state={presence.avatarState}
            emotion={presence.emotion}
            size="lg"
            themeAccent={accent}
            onClick={() => triggerTransition("encouraging", "avatar_tapped")}
          />
        </div>

        {/* Speech bubble */}
        <SpeechBubble text={presence.speechBubbleText} accent={accent} />

        {/* CTAs */}
        <CTAGroup buttons={presence.ctaButtons} accent={accent} onAction={handleAction} />

        {/* ═══ CONTEXT CARDS ═══ */}
        <div className="grid grid-cols-2 gap-3 mt-6 w-full">
          {/* Next Goal */}
          <div className="rounded-2xl p-4" style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4" style={{ color: accent }} />
              <span className="text-white/50 text-xs font-bold uppercase">Next Goal</span>
            </div>
            <p className="text-white text-sm font-semibold">Complete Unit 8</p>
            <p className="text-white/30 text-[10px] mt-1">3 sections remaining</p>
            <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full" style={{ width: "60%", background: `linear-gradient(90deg, #6b3fa0, ${accent})` }} />
            </div>
          </div>

          {/* Daily Mission */}
          <div className="rounded-2xl p-4" style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white/50 text-xs font-bold uppercase">Daily Mission</span>
            </div>
            <p className="text-white text-sm font-semibold">Learn 5 Chunks</p>
            <p className="text-white/30 text-[10px] mt-1">+50 XP reward</p>
            <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full" style={{ width: "40%", background: "linear-gradient(90deg, #eab308, #f97316)" }} />
            </div>
          </div>
        </div>

        {/* Interactions counter */}
        <p className="text-white/20 text-[10px] mt-4">
          {todayInteractions} interactions today
        </p>
      </div>

      {/* ═══ BOTTOM INPUT BAR ═══ */}
      <div className="px-4 py-3 flex items-center gap-2" style={{
        background: "rgba(15,10,30,0.9)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Mic button */}
        <button
          onClick={handleMicToggle}
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
          style={{
            background: isMicActive ? "linear-gradient(135deg, #22c55e, #16a34a)" : "rgba(255,255,255,0.06)",
            border: isMicActive ? "none" : "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {isMicActive ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white/40" />}
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          onFocus={resetIdle}
          placeholder="Talk to Elie..."
          className="flex-1 h-11 rounded-xl px-4 text-sm text-white placeholder:text-white/20 outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90 disabled:opacity-30"
          style={{
            background: inputText.trim() ? `linear-gradient(135deg, #6b3fa0, #2e8b7a)` : "rgba(255,255,255,0.06)",
          }}
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
