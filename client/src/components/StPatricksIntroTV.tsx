import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

// ─── CDN Images ──────────────────────────────────────────────────────────────
const LUCAS_IMG   = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/lucas-front_cf8484a0.jpg";
const EMILY_IMG   = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/emily-front_0daf3cbe.jpg";
const AIKO_IMG    = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/aiko-front_4d46e4a6.jpg";
const LUCAS_SCENE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/lucas-nyc_23052758.jpg";
const EMILY_SCENE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/emily-london_af529e0e.jpg";
const AIKO_SCENE  = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/aiko-sydney_9b11df80.jpg";

const SLIDE_DURATION = 18; // seconds per slide

const SLIDES = [
  {
    character: "lucas" as const,
    name: "LUCAS",
    flag: "🇺🇸",
    accent: "American English",
    image: LUCAS_IMG,
    scene: LUCAS_SCENE,
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.6)",
    situation: "excited" as const,
    text: "Hey everyone! Happy St. Patrick's Day! 🍀 I'm Lucas, from New York City. In the US, St. Patrick's Day is HUGE — green beer, massive parades, and everyone wearing green. If you're NOT wearing green, someone will pinch you! The biggest parade is right here in New York, with over two million people watching!",
    fact: "🗽 The NYC St. Patrick's Day parade has been happening since 1762 — before the USA even existed!",
  },
  {
    character: "emily" as const,
    name: "EMILY",
    flag: "🇬🇧",
    accent: "British English",
    image: EMILY_IMG,
    scene: EMILY_SCENE,
    color: "#ec4899",
    glow: "rgba(236,72,153,0.6)",
    situation: "explaining" as const,
    text: "Hello, lovely! I'm Emily, from London. St. Patrick's Day is actually an Irish holiday — Saint Patrick was the patron saint of Ireland. He's famous for driving all the snakes out of Ireland and using the shamrock to explain the Holy Trinity. In the UK, pubs go absolutely mad with Guinness and Irish music!",
    fact: "☘️ St. Patrick used the shamrock to explain Christianity — three leaves, one plant — the Holy Trinity!",
  },
  {
    character: "aiko" as const,
    name: "AIKO",
    flag: "🇦🇺",
    accent: "Australian English",
    image: AIKO_IMG,
    scene: AIKO_SCENE,
    color: "#a855f7",
    glow: "rgba(168,85,247,0.6)",
    situation: "casual" as const,
    text: "G'day! I'm Aiko, from Sydney! Australia has one of the biggest Irish communities outside of Ireland! In Sydney and Melbourne, St. Patrick's Day is a massive celebration. We've got Irish pubs everywhere, and people go all out with green outfits. The Irish came during the Gold Rush in the 1850s and never really left!",
    fact: "🦘 Australia has over 2.4 million people with Irish ancestry — nearly 10% of the population!",
  },
  {
    character: "lucas" as const,
    name: "LUCAS",
    flag: "🇺🇸",
    accent: "American English",
    image: LUCAS_IMG,
    scene: LUCAS_SCENE,
    color: "#22c55e",
    glow: "rgba(34,197,94,0.6)",
    situation: "excited" as const,
    text: "Tonight, we celebrate St. Patrick's Day inFlux style! Tongue twisters, music challenges, and the famous Who Am I game — all in English! Are you ready to test your English AND have a great time? Let's go! Sláinte — that means 'cheers' in Irish! 🥂",
    fact: "🎉 'Sláinte' (SLAWN-cha) is the Irish toast — it means 'health' and is used like 'cheers'!",
  },
];

// ─── Falling Shamrocks ────────────────────────────────────────────────────────
function FallingShamrocks() {
  const items = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${3 + Math.random() * 94}%`,
      delay: `${Math.random() * 12}s`,
      duration: `${8 + Math.random() * 8}s`,
      size: `${2 + Math.random() * 2.5}rem`,
      emoji: ["☘️", "🍀", "☘️", "🌿"][Math.floor(Math.random() * 4)],
      opacity: 0.4 + Math.random() * 0.5,
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((s) => (
        <div
          key={s.id}
          className="absolute"
          style={{
            left: s.left,
            top: "-4rem",
            fontSize: s.size,
            opacity: s.opacity,
            animation: `shamrockFall ${s.duration} ${s.delay} linear infinite`,
          }}
        >
          {s.emoji}
        </div>
      ))}
      <style>{`
        @keyframes shamrockFall {
          0%   { transform: translateY(-80px) rotate(0deg);   opacity: 0; }
          8%   { opacity: 0.85; }
          92%  { opacity: 0.85; }
          100% { transform: translateY(105vh) rotate(500deg); opacity: 0; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-120px) scale(0.9); opacity: 0; }
          to   { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(120px) scale(0.9); opacity: 0; }
          to   { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(30px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 40px var(--char-glow); }
          50%       { box-shadow: 0 0 80px var(--char-glow), 0 0 120px var(--char-glow); }
        }
        @keyframes timerShrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
        @keyframes wave {
          from { height: 6px; }
          to   { height: 36px; }
        }
      `}</style>
    </div>
  );
}

export default function StPatricksIntroTV() {
  const [, setLocation] = useLocation();
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const speakMutation = trpc.tts.speak.useMutation({
    onSuccess: (data) => {
      setAudioUrl(data.audioUrl);
      setIsPlaying(true);
    },
    onError: () => setIsPlaying(false),
  });

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(() => {});
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  const goToSlide = useCallback((next: number) => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setAudioUrl(null);
    setVisible(false);
    setTimeout(() => {
      setCurrent(next);
      setVisible(true);
      setTimerKey((k) => k + 1);
    }, 500);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setTimeout(() => {
      if (isLast) {
        setLocation("/events");
      } else {
        goToSlide(current + 1);
      }
    }, SLIDE_DURATION * 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, isPaused, isLast, goToSlide, setLocation]);

  // Auto-play TTS when slide appears
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => {
        speakMutation.mutate({
          text: slide.text,
          character: slide.character,
          situation: slide.situation,
        });
      }, 800);
      return () => clearTimeout(t);
    }
  }, [current, visible]);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, #050f05 0%, #071a07 40%, #0a2a0a 100%)" }}
    >
      <audio ref={audioRef} />
      <FallingShamrocks />

      {/* Background scene image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${slide.scene})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: visible ? 0.12 : 0,
          transition: "opacity 1s ease",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: `radial-gradient(circle, ${slide.glow.replace("0.6", "0.12")} 0%, transparent 70%)`, transition: "background 0.8s ease" }} />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: `radial-gradient(circle, ${slide.glow.replace("0.6", "0.10")} 0%, transparent 70%)`, transition: "background 0.8s ease" }} />

      {/* ── Top bar ── */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">☘️</span>
          <div>
            <h1 className="text-3xl font-black text-yellow-400 tracking-widest" style={{ textShadow: "0 0 30px rgba(234,179,8,0.8)" }}>
              ST. PATRICK'S NIGHT
            </h1>
            <p className="text-white/40 text-sm tracking-widest uppercase">by inFlux · English Cultural Night</p>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="rounded-full transition-all duration-500 flex items-center justify-center font-black text-sm"
              style={{
                width: i === current ? "3rem" : "1rem",
                height: "1rem",
                background: i < current ? s.color : i === current ? s.color : "rgba(255,255,255,0.2)",
                color: "white",
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(p => !p)}
            className="px-4 py-2 rounded-full text-sm font-bold border-2 text-white transition-all"
            style={{ borderColor: "rgba(255,255,255,0.3)", background: isPaused ? "rgba(255,255,255,0.1)" : "transparent" }}
          >
            {isPaused ? "▶ Resume" : "⏸ Pause"}
          </button>
          <button
            onClick={() => setLocation("/events")}
            className="px-4 py-2 rounded-full text-sm font-bold text-white/40 hover:text-white transition-colors"
          >
            Skip →
          </button>
        </div>
      </div>

      {/* Timer bar */}
      <div className="relative z-10 px-8 pb-4">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          {!isPaused && (
            <div
              key={timerKey}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${slide.color}, ${slide.glow})`,
                animation: `timerShrink ${SLIDE_DURATION}s linear forwards`,
              }}
            />
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex items-center gap-8 px-10 pb-6">

        {/* Character portrait — large */}
        <div
          className="flex-shrink-0 flex flex-col items-center gap-4"
          style={{
            opacity: visible ? 1 : 0,
            animation: visible ? "slideInLeft 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
          }}
        >
          <div
            className="relative rounded-3xl overflow-hidden border-4"
            style={{
              width: "clamp(260px, 22vw, 380px)",
              height: "clamp(360px, 30vw, 520px)",
              borderColor: slide.color,
              "--char-glow": slide.glow,
              animation: "pulseGlow 3s ease-in-out infinite",
            } as React.CSSProperties}
          >
            <img
              src={slide.image}
              alt={slide.name}
              className="w-full h-full object-cover object-top"
            />
            {/* Name overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 py-4 px-4 text-center"
              style={{ background: `linear-gradient(to top, ${slide.color}ee, transparent)` }}
            >
              <div className="text-white font-black tracking-widest" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}>
                {slide.name}
              </div>
              <div className="text-white/80 font-semibold" style={{ fontSize: "clamp(1rem, 1.5vw, 1.4rem)" }}>
                {slide.flag} {slide.accent}
              </div>
            </div>
          </div>

          {/* Sound wave */}
          {isPlaying && (
            <div className="flex items-end gap-1 h-10">
              {[0,1,2,3,4,5,6].map((i) => (
                <div
                  key={i}
                  className="w-2 rounded-full"
                  style={{
                    background: slide.color,
                    animation: `wave 0.6s ${i * 0.1}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Replay button */}
          <button
            onClick={() => speakMutation.mutate({ text: slide.text, character: slide.character, situation: slide.situation })}
            disabled={speakMutation.isPending || isPlaying}
            className="px-5 py-2 rounded-full font-bold text-white border-2 transition-all disabled:opacity-40"
            style={{ borderColor: slide.color, fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)" }}
          >
            {speakMutation.isPending ? "⏳ Loading..." : isPlaying ? "🔊 Playing..." : "🔊 Replay"}
          </button>
        </div>

        {/* Speech content */}
        <div
          className="flex-1 flex flex-col gap-5"
          style={{
            opacity: visible ? 1 : 0,
            animation: visible ? "slideInRight 0.6s 0.15s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
          }}
        >
          {/* Slide counter */}
          <div className="flex items-center gap-3">
            <div className="text-5xl">☘️</div>
            <div
              className="px-4 py-1 rounded-full font-black text-white"
              style={{ background: slide.color, fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)" }}
            >
              {current + 1} / {SLIDES.length}
            </div>
          </div>

          {/* Speech bubble */}
          <div
            className="rounded-3xl relative"
            style={{
              padding: "clamp(1.5rem, 2.5vw, 2.5rem)",
              background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,25,0,0.8) 100%)",
              border: `3px solid ${slide.color}55`,
              boxShadow: `0 0 50px ${slide.glow.replace("0.6", "0.1")}`,
            }}
          >
            {/* Bubble tail */}
            <div
              className="absolute left-[-18px] top-12 w-0 h-0"
              style={{
                borderTop: "18px solid transparent",
                borderBottom: "18px solid transparent",
                borderRight: `18px solid ${slide.color}55`,
              }}
            />
            <p
              className="text-white leading-relaxed font-semibold"
              style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)", lineHeight: 1.6 }}
            >
              {slide.text}
            </p>
          </div>

          {/* Fun fact */}
          <div
            className="rounded-2xl"
            style={{
              padding: "clamp(1rem, 1.5vw, 1.5rem)",
              background: "rgba(234,179,8,0.12)",
              border: "2px solid rgba(234,179,8,0.4)",
            }}
          >
            <p
              className="text-yellow-200 font-medium leading-relaxed"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.3rem)" }}
            >
              {slide.fact}
            </p>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-4 pt-2">
            {current > 0 && (
              <button
                onClick={() => goToSlide(current - 1)}
                className="px-6 py-3 rounded-full font-bold text-white border-2 border-white/20 hover:border-white/50 transition-all"
                style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)" }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={() => isLast ? setLocation("/events") : goToSlide(current + 1)}
              className="flex-1 rounded-full font-black text-white transition-all active:scale-95"
              style={{
                padding: "clamp(0.75rem, 1.2vw, 1rem)",
                background: `linear-gradient(135deg, ${slide.color}, ${slide.color}bb)`,
                boxShadow: `0 6px 30px ${slide.glow}`,
                fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
              }}
            >
              {isLast ? "🍀 Let's Play! Sláinte!" : "Next →"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-10 flex items-center justify-between px-8 pb-5 pt-2">
        <div className="text-white/20 text-sm tracking-widest uppercase">inFlux Cultural Night · St. Patrick's Day 2026</div>
        <div className="text-white/20 text-sm">
          {isPaused ? "⏸ Pausado" : `⏱ Avança em ${SLIDE_DURATION}s`}
        </div>
      </div>
    </div>
  );
}
