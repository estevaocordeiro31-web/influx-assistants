import { useEffect, useState } from "react";

const EVENT_URL = "https://influxassist-2anfqga4.manus.space/events/register";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(EVENT_URL)}&bgcolor=021a06&color=40e080&margin=16&qzone=2`;

const FLOATING_ITEMS = [
  { emoji: "☘️", x: 5, y: 8, size: 3.5, speed: 1.2, delay: 0 },
  { emoji: "🍀", x: 15, y: 65, size: 2.5, speed: 0.9, delay: 0.3 },
  { emoji: "☘️", x: 88, y: 20, size: 4, speed: 1.5, delay: 0.7 },
  { emoji: "🍀", x: 92, y: 75, size: 3, speed: 1.1, delay: 1.2 },
  { emoji: "☘️", x: 50, y: 5, size: 2, speed: 0.8, delay: 0.5 },
  { emoji: "🍺", x: 3, y: 45, size: 2.8, speed: 1.3, delay: 0.9 },
  { emoji: "🍺", x: 95, y: 50, size: 2.5, speed: 1.0, delay: 1.5 },
  { emoji: "☘️", x: 75, y: 90, size: 3.2, speed: 1.4, delay: 0.2 },
  { emoji: "🍀", x: 25, y: 88, size: 2.2, speed: 0.7, delay: 1.8 },
  { emoji: "⭐", x: 60, y: 92, size: 1.8, speed: 1.6, delay: 0.4 },
];

export default function ReceptionTV() {
  const [tick, setTick] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [scanY, setScanY] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setPulse(p => !p), 1400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setScanY(y => (y + 2) % 100), 80);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        background: "radial-gradient(ellipse at center, #0d3b14 0%, #061a08 50%, #020d03 100%)",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {FLOATING_ITEMS.map((item, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${item.x}%`,
              top: `${(item.y + Math.sin((tick * item.speed * 0.05) + item.delay) * 4) % 100}%`,
              fontSize: `${item.size}rem`,
              opacity: 0.25 + Math.sin((tick * 0.03) + item.delay) * 0.1,
              transform: `rotate(${(tick * item.speed * 0.8 + i * 40) % 360}deg)`,
              transition: "top 0.08s linear",
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Bokeh circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${60 + (i * 30) % 120}px`,
              height: `${60 + (i * 30) % 120}px`,
              left: `${(i * 9 + 3) % 95}%`,
              top: `${(i * 13 + 5) % 90}%`,
              background: i % 3 === 0
                ? "rgba(64,224,128,0.06)"
                : i % 3 === 1
                ? "rgba(212,175,55,0.05)"
                : "rgba(34,197,94,0.04)",
              filter: "blur(20px)",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between py-10 px-16">

        {/* Top: mAInd badge */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="px-8 py-2 rounded-full text-2xl font-black tracking-widest"
            style={{
              background: "rgba(212,175,55,0.15)",
              border: "1.5px solid rgba(212,175,55,0.4)",
              color: "#d4af37",
              letterSpacing: "0.3em",
            }}
          >
            WELCOME TO THE FUTURE
          </div>
          <div
            className="text-5xl font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #40e080, #22c55e, #16a34a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(64,224,128,0.6))",
            }}
          >
            ImAInd!!
          </div>
        </div>

        {/* Center: Title + QR */}
        <div className="flex items-center gap-20">
          {/* Left: Title */}
          <div className="flex flex-col items-start gap-4 max-w-lg">
            <div className="flex items-center gap-3">
              <span className="text-6xl">☘️</span>
              <div>
                <h1
                  className="text-8xl font-black leading-none"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #ffd700, #b8860b)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 30px rgba(212,175,55,0.5))",
                  }}
                >
                  ST.
                </h1>
                <h1
                  className="text-8xl font-black leading-none"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #ffd700, #b8860b)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 30px rgba(212,175,55,0.5))",
                  }}
                >
                  PATRICK'S
                </h1>
                <h1
                  className="text-8xl font-black leading-none"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #ffd700, #b8860b)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 30px rgba(212,175,55,0.5))",
                  }}
                >
                  NIGHT
                </h1>
              </div>
            </div>
            <div
              className="text-3xl font-bold"
              style={{ color: "#86efac" }}
            >
              by inFlux Jundiaí
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 text-2xl text-white/80">
                <span>📅</span>
                <span className="font-semibold">Sexta-feira, 20 de Março de 2026</span>
              </div>
              <div className="flex items-center gap-3 text-2xl text-white/80">
                <span>⏰</span>
                <span className="font-semibold">18h30 às 22h00</span>
              </div>
              <div className="flex items-center gap-3 text-xl text-green-300/80 mt-4 italic">
                <span>✨</span>
                <span>An evening of English, culture & craic</span>
              </div>
            </div>
          </div>

          {/* Right: QR Code */}
          <div className="flex flex-col items-center gap-6">
            {/* QR frame */}
            <div
              className="relative rounded-3xl p-5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "2px solid rgba(212,175,55,0.5)",
                boxShadow: pulse
                  ? "0 0 60px rgba(64,224,128,0.4), 0 0 120px rgba(64,224,128,0.15)"
                  : "0 0 30px rgba(64,224,128,0.2)",
                transition: "box-shadow 1.4s ease-in-out",
              }}
            >
              {/* Celtic corner decorations */}
              <div className="absolute top-2 left-2 text-2xl" style={{ color: "#d4af37" }}>✦</div>
              <div className="absolute top-2 right-2 text-2xl" style={{ color: "#d4af37" }}>✦</div>
              <div className="absolute bottom-2 left-2 text-2xl" style={{ color: "#d4af37" }}>✦</div>
              <div className="absolute bottom-2 right-2 text-2xl" style={{ color: "#d4af37" }}>✦</div>

              {/* Scanline effect */}
              <div
                className="absolute left-5 right-5 h-0.5 pointer-events-none z-10"
                style={{
                  top: `${20 + scanY * 0.6}%`,
                  background: "linear-gradient(90deg, transparent, rgba(64,224,128,0.6), transparent)",
                  boxShadow: "0 0 8px rgba(64,224,128,0.8)",
                  transition: "top 0.08s linear",
                }}
              />

              <img
                src={QR_URL}
                alt="QR Code"
                className="rounded-xl"
                style={{ width: "380px", height: "380px", display: "block" }}
              />
            </div>

            {/* Scan instruction */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex items-center gap-3 px-8 py-3 rounded-2xl text-2xl font-black"
                style={{
                  background: pulse ? "rgba(64,224,128,0.2)" : "rgba(64,224,128,0.1)",
                  border: "1.5px solid rgba(64,224,128,0.4)",
                  color: "#40e080",
                  transition: "background 1.4s ease-in-out",
                }}
              >
                <span>📱</span>
                <span>ESCANEIE PARA ENTRAR</span>
                <span>📱</span>
              </div>
              <p className="text-white/40 text-lg">
                {EVENT_URL.replace("https://", "")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: Characters + inFlux logo */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <img
              src="/characters/lucas-usa.png"
              alt="Lucas"
              className="rounded-full object-cover object-top"
              style={{ width: "80px", height: "80px", border: "3px solid #40916c" }}
            />
            <img
              src="/characters/emily-uk.jpg"
              alt="Emily"
              className="rounded-full object-cover object-top"
              style={{ width: "80px", height: "80px", border: "3px solid #40916c" }}
            />
            <img
              src="/characters/aiko-australia.jpg"
              alt="Aiko"
              className="rounded-full object-cover object-top"
              style={{ width: "80px", height: "80px", border: "3px solid #40916c" }}
            />
            <div className="ml-2">
              <p className="text-green-300 font-bold text-lg">Lucas · Emily · Aiko</p>
              <p className="text-white/50 text-sm">seus guias para a noite</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/30 text-sm">Powered by</p>
            <p
              className="text-3xl font-black"
              style={{ color: "#40e080" }}
            >
              inFlux
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
