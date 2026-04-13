/**
 * XPToast — Animated XP/coin notification that slides in from top-right
 *
 * Usage:
 *   import { showXPToast } from "@/components/XPToast";
 *   showXPToast({ xp: 50, coins: 10, reason: "Quiz completed!" });
 *
 * Also exports <XPToastContainer /> to mount once in App.
 */

import { useState, useEffect, useCallback } from "react";
import { Zap, Coins } from "lucide-react";

interface XPToastData {
  id: number;
  xp?: number;
  coins?: number;
  reason?: string;
}

// Global event bus
let toastId = 0;
const listeners: Set<(toast: XPToastData) => void> = new Set();

export function showXPToast(data: { xp?: number; coins?: number; reason?: string }) {
  toastId++;
  const toast: XPToastData = { id: toastId, ...data };
  listeners.forEach(fn => fn(toast));
}

function XPToastItem({ toast, onDone }: { toast: XPToastData; onDone: () => void }) {
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 50);
    const t2 = setTimeout(() => setPhase("exit"), 2500);
    const t3 = setTimeout(onDone, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const translate = phase === "enter" ? "translate-x-full opacity-0"
    : phase === "exit" ? "translate-x-full opacity-0"
    : "translate-x-0 opacity-100";

  return (
    <div className={`transition-all duration-500 ease-out ${translate} mb-2`}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl relative overflow-hidden"
        style={{
          background: "rgba(10,10,20,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
        {/* Top shine */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(245,200,66,0.3), transparent)" }} />

        {/* XP badge */}
        {toast.xp != null && toast.xp > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(107,63,160,0.2)", border: "1px solid rgba(107,63,160,0.3)" }}>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-lg font-extrabold text-purple-300"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              +{toast.xp}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-white/30 font-bold">XP</span>
          </div>
        )}

        {/* Divider */}
        {toast.xp != null && toast.xp > 0 && toast.coins != null && toast.coins > 0 && (
          <div className="w-px h-6 bg-white/10" />
        )}

        {/* Coins badge */}
        {toast.coins != null && toast.coins > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.25)" }}>
              <Coins className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-lg font-extrabold text-yellow-300"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              +{toast.coins}
            </span>
          </div>
        )}

        {/* Reason */}
        {toast.reason && (
          <span className="text-xs text-white/40 ml-1 hidden sm:inline">{toast.reason}</span>
        )}
      </div>
    </div>
  );
}

export function XPToastContainer() {
  const [toasts, setToasts] = useState<XPToastData[]>([]);

  useEffect(() => {
    const handler = (toast: XPToastData) => {
      setToasts(prev => [...prev, toast]);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const handleDone = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col items-end pointer-events-none">
      {toasts.map(toast => (
        <XPToastItem key={toast.id} toast={toast} onDone={() => handleDone(toast.id)} />
      ))}
    </div>
  );
}
