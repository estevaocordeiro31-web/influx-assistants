import { useLocation } from "wouter";

const GAMES = [
  {
    id: "tongue",
    emoji: "🌀",
    title: "Tongue Twister",
    subtitle: "Say it fast — without mistakes!",
    color: "#4cc9f0",
    bg: "rgba(76,201,240,0.12)",
    path: "/events/kids/tongue-twister",
    badge: "15 twisters",
  },
  {
    id: "whoami",
    emoji: "🕵️",
    title: "Who Am I?",
    subtitle: "Ask Yes/No questions to discover the character!",
    color: "#f72585",
    bg: "rgba(247,37,133,0.12)",
    path: "/events/kids/who-am-i",
    badge: "18 characters",
  },
  {
    id: "singalong",
    emoji: "🎵",
    title: "Sing Along!",
    subtitle: "Fill in the missing word from the song!",
    color: "#06d6a0",
    bg: "rgba(6,214,160,0.12)",
    path: "/events/kids/sing-along",
    badge: "12 songs",
  },
];

export default function KidsHub() {
  const [, navigate] = useLocation();

  return (
    <div
      className="min-h-screen pb-10"
      style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d1f3c 50%, #1a0a2e 100%)" }}
    >
      {/* Floating shamrocks */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {["☘️", "⭐", "🌈", "☘️", "🎉", "⭐"].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${10 + i * 16}%`,
              top: `${5 + (i % 3) * 12}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float { from { transform: translateY(0px); } to { transform: translateY(-15px); } }
        @keyframes pulse-glow { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
      `}</style>

      <div className="max-w-lg mx-auto px-4 pt-6 relative z-10">

        {/* Back button */}
        <button
          onClick={() => navigate("/events")}
          className="text-white/40 hover:text-white text-sm mb-4 flex items-center gap-1"
        >
          ← Back to Event Hub
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🧒</div>
          <h1 className="text-white font-black text-3xl mb-1">
            <span style={{ color: "#4cc9f0" }}>Kids</span> Zone
          </h1>
          <p className="text-white/50 text-sm">St. Patrick's Night · inFlux Jundiaí</p>
          <div
            className="inline-block mt-3 px-4 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(6,214,160,0.15)", color: "#06d6a0", border: "1px solid rgba(6,214,160,0.3)" }}
          >
            ☘️ No drinking — just fun challenges!
          </div>
        </div>

        {/* Characters */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { flag: "🇺🇸", name: "Lucas", color: "#4cc9f0" },
            { flag: "🇬🇧", name: "Emily", color: "#f72585" },
            { flag: "🇦🇺", name: "Aiko", color: "#06d6a0" },
          ].map(c => (
            <div key={c.name} className="text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-1"
                style={{ background: `${c.color}22`, border: `2px solid ${c.color}` }}
              >
                {c.flag}
              </div>
              <p className="text-white/60 text-xs font-bold">{c.name}</p>
            </div>
          ))}
        </div>

        {/* Games */}
        <div className="space-y-4 mb-8">
          {GAMES.map(game => (
            <button
              key={game.id}
              onClick={() => navigate(game.path)}
              className="w-full rounded-3xl p-5 text-left transition-all active:scale-95"
              style={{ background: game.bg, border: `2px solid ${game.color}44` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                  style={{ background: `${game.color}22` }}
                >
                  {game.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-black text-lg">{game.title}</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: `${game.color}22`, color: game.color }}
                    >
                      {game.badge}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm">{game.subtitle}</p>
                </div>
                <span className="text-white/30 text-xl">›</span>
              </div>
            </button>
          ))}
        </div>

        {/* How to play */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-white/60 font-bold text-sm mb-3">🎯 How to play:</p>
          <div className="space-y-2">
            <p className="text-white/40 text-xs">• Answer correctly → earn points! ⭐</p>
            <p className="text-white/40 text-xs">• Wrong answer → do a fun challenge! 😄</p>
            <p className="text-white/40 text-xs">• Use English — that's the magic! 🪄</p>
            <p className="text-white/40 text-xs">• Have fun and learn! 🍀</p>
          </div>
        </div>
      </div>
    </div>
  );
}
