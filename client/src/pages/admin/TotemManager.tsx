/**
 * TotemManager — Admin page to manage physical totems
 *
 * URL: /admin/totems
 * Lists all totems, their status, today's check-ins,
 * environment config, and QR codes for printing.
 */

import { useState, useEffect } from "react";
import {
  Monitor, MapPin, Users, QrCode, Clock, Wifi, WifiOff,
  Settings, RefreshCw, ExternalLink, Copy, CheckCircle,
} from "lucide-react";

const BRAIN_API = "https://brain.imaind.tech";
const TUTOR_URL = "https://tutor.imaind.tech";

interface TotemData {
  id: string;
  name: string;
  type: string;
  locationId: string;
  isActive: boolean;
  todayCheckins: number;
  lastCheckin: string | null;
  persona: {
    tone: string;
    idleMessage: string;
    allowVoice: boolean;
    showProgress: boolean;
    showLeaderboard: boolean;
  };
  sessionTimeout: number;
  allowedFeatures: string[];
}

const TOTEM_IDS: Record<string, string> = {
  reception: "totem-reception-jundiai",
  game_room: "totem-game-jundiai",
  cafe: "totem-cafe-jundiai",
  classroom: "totem-sala1-jundiai",
  garden: "totem-garden-jundiai",
};

const ENV_ICONS: Record<string, string> = {
  reception: "door-open",
  game_room: "gamepad-2",
  cafe: "coffee",
  classroom: "book-open",
  garden: "trees",
};

const ENV_COLORS: Record<string, string> = {
  reception: "#6b3fa0",
  game_room: "#ec4899",
  cafe: "#f59e0b",
  classroom: "#3b82f6",
  garden: "#10b981",
};

export default function TotemManager() {
  const [totems, setTotems] = useState<TotemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [sseStats, setSSEStats] = useState<{ activeConnections: number; connectedStudents: string[] } | null>(null);

  useEffect(() => {
    loadTotems();
    loadSSEStats();
    const interval = setInterval(() => {
      loadTotems();
      loadSSEStats();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadTotems() {
    try {
      const res = await fetch(`${BRAIN_API}/api/presence/admin/totems`);
      const data = await res.json();
      setTotems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load totems:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadSSEStats() {
    try {
      const res = await fetch(`${BRAIN_API}/api/presence/sync-stats`);
      const data = await res.json();
      setSSEStats(data);
    } catch {
      // ignore
    }
  }

  function getTotemURL(totemId: string) {
    return `${TUTOR_URL}/totem/${totemId}`;
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a1a" }}>
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6"
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 30%, #0d1117 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
            Totem Manager
          </h1>
          <p className="text-white/40 text-sm mt-1">Manage physical totems at inFlux Jundiai</p>
        </div>
        <button onClick={loadTotems}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/60 text-sm hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* SSE Stats */}
      {sseStats && (
        <div className="mb-6 flex items-center gap-4 px-4 py-3 rounded-xl"
          style={{ background: "rgba(46,139,122,0.08)", border: "1px solid rgba(46,139,122,0.15)" }}>
          <Wifi className="w-4 h-4 text-teal-400" />
          <span className="text-white/60 text-sm">
            <span className="text-teal-400 font-bold">{sseStats.activeConnections}</span> active SSE connections
            · <span className="text-teal-400 font-bold">{sseStats.connectedStudents.length}</span> students online
          </span>
        </div>
      )}

      {/* Totems grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {totems.map((totem) => {
          const color = ENV_COLORS[totem.id] || "#6b3fa0";
          const totemId = TOTEM_IDS[totem.id] || `totem-${totem.id}-jundiai`;
          const url = getTotemURL(totemId);

          return (
            <div key={totem.id} className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}20` }}>

              {/* Color bar */}
              <div className="h-1.5" style={{ background: color }} />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${color}15` }}>
                      <Monitor className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{totem.name}</h3>
                      <p className="text-white/30 text-xs">{totem.type}</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${totem.isActive ? "bg-green-400" : "bg-red-400"}`} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg p-3"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-3 h-3 text-white/30" />
                      <span className="text-white/30 text-[10px] uppercase">Today</span>
                    </div>
                    <p className="text-white text-lg font-bold">{totem.todayCheckins}</p>
                  </div>
                  <div className="rounded-lg p-3"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3 text-white/30" />
                      <span className="text-white/30 text-[10px] uppercase">Last</span>
                    </div>
                    <p className="text-white/60 text-sm">
                      {totem.lastCheckin
                        ? new Date(totem.lastCheckin).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                        : "—"
                      }
                    </p>
                  </div>
                </div>

                {/* Persona info */}
                <div className="mb-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white/20 text-[10px] uppercase w-16">Tone</span>
                    <span className="text-white/50 text-xs">{totem.persona.tone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/20 text-[10px] uppercase w-16">Voice</span>
                    <span className="text-white/50 text-xs">{totem.persona.allowVoice ? "Enabled" : "Disabled"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/20 text-[10px] uppercase w-16">Timeout</span>
                    <span className="text-white/50 text-xs">{totem.sessionTimeout} min</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a href={url} target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-95"
                    style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
                    <ExternalLink className="w-3.5 h-3.5" /> Preview
                  </a>
                  <button
                    onClick={() => copyToClipboard(url, totem.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium text-white/50 transition-all active:scale-95"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {copied === totem.id ? (
                      <><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Copied!</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy URL</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totems.length === 0 && (
        <div className="text-center py-20">
          <Monitor className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30">No totems configured yet</p>
        </div>
      )}
    </div>
  );
}
