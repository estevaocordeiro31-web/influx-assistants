/**
 * usePresence — React hook for the ImAInd Presence System
 *
 * Manages Elie's presence state for a given student.
 * Polls the backend every 30s, handles transitions,
 * and auto-idles after 3 minutes of inactivity.
 */

import { useState, useEffect, useCallback, useRef } from "react";

const BRAIN_API = "https://brain.imaind.tech";
const POLL_INTERVAL = 30_000;       // 30 seconds
const IDLE_TIMEOUT = 3 * 60_000;    // 3 minutes

export type AvatarState = "idle" | "listening" | "thinking" | "speaking" | "reacting" | "encouraging";
export type AmbientAnimation = "breathe" | "pulse" | "wave" | "celebrate";

export interface PresenceData {
  avatarState: AvatarState;
  emotion: string;
  microReactionDelay: number;
  speechBubbleText: string;
  ctaButtons: Array<{
    label: string;
    type: "primary" | "secondary" | "tertiary";
    action: string;
  }>;
  voiceParams: {
    stability: number;
    similarity_boost: number;
    style: number;
    speed?: number;
  };
  themeAccent: string;
  ambientAnimation: AmbientAnimation;
}

interface UsePresenceReturn {
  presence: PresenceData;
  isTransitioning: boolean;
  isConnected: boolean;
  sessionDuration: number;
  todayInteractions: number;
  triggerTransition: (toState: AvatarState, reason: string) => Promise<void>;
  sendInteraction: (type: string, content?: string) => Promise<void>;
  computePresence: (input: {
    intent: string;
    emotion: string;
    context: string;
    user_state: string;
    student?: any;
  }) => Promise<PresenceData | null>;
  resetIdle: () => void;
}

const DEFAULT_PRESENCE: PresenceData = {
  avatarState: "idle",
  emotion: "neutral",
  microReactionDelay: 0,
  speechBubbleText: "Hi! How can I help you today?",
  ctaButtons: [
    { label: "Start Learning", type: "primary", action: "start_lesson" },
    { label: "Just Chat", type: "secondary", action: "free_chat" },
  ],
  voiceParams: { stability: 0.8, similarity_boost: 0.75, style: 0.2 },
  themeAccent: "#6b3fa0",
  ambientAnimation: "breathe",
};

export function usePresence(studentId: string | number | undefined): UsePresenceReturn {
  const [presence, setPresence] = useState<PresenceData>(DEFAULT_PRESENCE);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [todayInteractions, setTodayInteractions] = useState(0);

  const lastActivityRef = useRef(Date.now());
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // ── Reset idle timer ───────────────────────────────────────────────────────

  const resetIdle = useCallback(() => {
    lastActivityRef.current = Date.now();

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setPresence((p) => ({
        ...p,
        avatarState: "idle",
        ambientAnimation: "breathe",
        speechBubbleText: "Still here whenever you need me!",
      }));
    }, IDLE_TIMEOUT);
  }, []);

  // ── Poll backend for current presence ──────────────────────────────────────

  useEffect(() => {
    if (!studentId) return;

    let active = true;

    const poll = async () => {
      try {
        const res = await fetch(`${BRAIN_API}/api/presence/student/${studentId}`);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();

        if (active && data.presence) {
          setPresence(data.presence);
          setSessionDuration(data.sessionDuration || 0);
          setTodayInteractions(data.todayInteractions || 0);
          setIsConnected(true);
        }
      } catch {
        // Backend not available — use local defaults
        if (active) setIsConnected(false);
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => { active = false; clearInterval(interval); };
  }, [studentId]);

  // ── Initialize idle timer ──────────────────────────────────────────────────

  useEffect(() => {
    resetIdle();
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [resetIdle]);

  // ── Trigger state transition ───────────────────────────────────────────────

  const triggerTransition = useCallback(async (toState: AvatarState, reason: string) => {
    if (!studentId) return;
    resetIdle();
    setIsTransitioning(true);

    const fromState = presence.avatarState;

    try {
      const res = await fetch(`${BRAIN_API}/api/presence/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, fromState, toState, reason }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.newPresence) {
          setPresence(data.newPresence);
        }
      }
    } catch {
      // Fallback: apply transition locally
      setPresence((p) => ({ ...p, avatarState: toState }));
    } finally {
      setIsTransitioning(false);
    }
  }, [studentId, presence.avatarState, resetIdle]);

  // ── Send interaction ───────────────────────────────────────────────────────

  const sendInteraction = useCallback(async (type: string, content?: string) => {
    if (!studentId) return;
    resetIdle();
    setTodayInteractions((n) => n + 1);

    try {
      await fetch(`${BRAIN_API}/api/presence/interaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          type,
          content,
          xpEarned: type === "message" ? 5 : type === "voice" ? 10 : 2,
          responseLatency: Date.now() - lastActivityRef.current,
        }),
      });
    } catch {
      // Silent fail — interaction logging is non-critical
    }
  }, [studentId, resetIdle]);

  // ── Compute presence (call engine) ─────────────────────────────────────────

  const computePresenceFn = useCallback(async (input: {
    intent: string;
    emotion: string;
    context: string;
    user_state: string;
    student?: any;
  }): Promise<PresenceData | null> => {
    resetIdle();

    try {
      const res = await fetch(`${BRAIN_API}/api/presence/compute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const data = await res.json();
        setPresence(data);
        return data;
      }
    } catch {
      // silent
    }
    return null;
  }, [resetIdle]);

  return {
    presence,
    isTransitioning,
    isConnected,
    sessionDuration,
    todayInteractions,
    triggerTransition,
    sendInteraction,
    computePresence: computePresenceFn,
    resetIdle,
  };
}
