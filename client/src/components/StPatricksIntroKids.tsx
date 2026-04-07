import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

// ─── CDN Images (cartoon versions) ───────────────────────────────────────────
const LUCAS_CARTOON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/lucas_cartoon_0e7c2f81.jpg";
const EMILY_CARTOON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/emily_cartoon_3d9a1b22.jpg";
const AIKO_CARTOON  = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/aiko_cartoon_7f4e8c99.jpg";

const KIDS_SCRIPT = [
  {
    character: "lucas" as const,
    name: "Lucas",
    flag: "🇺🇸",
    image: LUCAS_CARTOON,
    color: "#3b82f6",
    bg: "from-blue-900/80 to-blue-950/90",
    situation: "excited" as const,
    text: "Hi! I'm Lucas! 👋 Happy St. Patrick's Day! 🍀 In the USA, everyone wears GREEN today! If you forget to wear green... someone will pinch you! 😄",
    translation: "Oi! Eu sou o Lucas! Feliz Dia de São Patrício! Nos EUA, todo mundo usa VERDE hoje! Se você esquecer de usar verde... alguém vai te beliscar!",
    word: "GREEN 🟢",
    wordPT: "verde",
    emoji: "🗽",
  },
  {
    character: "emily" as const,
    name: "Emily",
    flag: "🇬🇧",
    image: EMILY_CARTOON,
    color: "#ec4899",
    bg: "from-pink-900/80 to-pink-950/90",
    situation: "explaining" as const,
    text: "Hello! I'm Emily! 🌸 St. Patrick's Day is about Ireland! 🇮🇪 The SHAMROCK is the symbol of Ireland. It has THREE leaves! Can you count them? 1... 2... 3! ☘️",
    translation: "Olá! Eu sou a Emily! O Dia de São Patrício é sobre a Irlanda! O TREVO é o símbolo da Irlanda. Ele tem TRÊS folhas! Você consegue contar? 1... 2... 3!",
    word: "SHAMROCK ☘️",
    wordPT: "trevo",
    emoji: "🏰",
  },
  {
    character: "aiko" as const,
    name: "Aiko",
    flag: "🇦🇺",
    image: AIKO_CARTOON,
    color: "#a855f7",
    bg: "from-purple-900/80 to-purple-950/90",
    situation: "casual" as const,
    text: "G'day! I'm Aiko! 🌟 In Australia, we LOVE St. Patrick's Day too! 🎉 We eat yummy food, listen to music, and dance! It's a really FUN celebration! 🎵",
    translation: "Oi! Eu sou a Aiko! Na Austrália, a gente AMA o Dia de São Patrício também! A gente come comida gostosa, escuta música e dança! É uma festa muito DIVERTIDA!",
    word: "CELEBRATE 🎉",
    wordPT: "celebrar",
    emoji: "🦘",
  },
  {
    character: "lucas" as const,
    name: "Lucas",
    flag: "🇺🇸",
    image: LUCAS_CARTOON,
    color: "#22c55e",
    bg: "from-green-900/80 to-green-950/90",
    situation: "excited" as const,
    text: "Now it's YOUR turn! 🌟 Tonight we play games in ENGLISH! Are you ready? Let's say it together: SLÁINTE! 🥂 That means CHEERS in Irish! Can you say it? SLAWN-cha! 😄",
    translation: "Agora é a SUA vez! Esta noite a gente joga em INGLÊS! Você está pronto? Vamos dizer juntos: SLÁINTE! Isso significa SAÚDE em irlandês! Você consegue falar? SLAWN-cha!",
    word: "SLÁINTE 🥂",
    wordPT: "saúde / cheers",
    emoji: "🍀",
  },
];

// ─── Bouncing stars ───────────────────────────────────────────────────────────
function BouncingStars() {
  const items = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${5 + Math.random() * 5}s`,
      size: `${1.5 + Math.random() * 1.5}rem`,
      emoji: ["☘️", "🍀", "⭐", "✨", "🌟", "💚"][Math.floor(Math.random() * 6)],
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
            top: "-3rem",
            fontSize: s.size,
            animation: `kidsFloat ${s.duration} ${s.delay} ease-in-out infinite`,
          }}
        >
          {s.emoji}
        </div>
      ))}
      <style>{`
        @keyframes kidsFloat {
          0%   { transform: translateY(-60px) rotate(0deg);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
        @keyframes bounceIn {
          0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
          80%  { transform: scale(0.95) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes wordPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes waveKids {
          from { height: 5px; }
          to   { height: 28px; }
        }
      `}</style>
    </div>
  );
}

export default function StPatricksIntroKids() {
  const [, setLocation] = useLocation();
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const slide = KIDS_SCRIPT[current];
  const isLast = current === KIDS_SCRIPT.length - 1;

  const speakMutation = trpc.tts.speak.useMutation({
    onSuccess: (data) => { setAudioUrl(data.audioUrl); setIsPlaying(true); },
    onError: () => setIsPlaying(false),
  });

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(() => {});
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  const changeSlide = (next: number) => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setAudioUrl(null);
    setShowTranslation(false);
    setVisible(false);
    setTimeout(() => {
      setCurrent(next);
      setVisible(true);
    }, 400);
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #052005 0%, #0a2e0a 50%, #052005 100%)" }}
    >
      <audio ref={audioRef} />
      <BouncingStars />

      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${slide.color}15 0%, transparent 70%)`, transition: "background 0.5s ease" }} />

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => setLocation("/events")}
          className="text-white/40 hover:text-white text-sm transition-colors"
        >
          ← Sair
        </button>
        <div className="text-center">
          <h1 className="text-xl font-black text-yellow-400" style={{ textShadow: "0 0 20px rgba(234,179,8,0.7)" }}>
            ☘️ ST. PATRICK'S DAY
          </h1>
          <p className="text-white/40 text-xs">Kids Edition · inFlux</p>
        </div>
        <div className="text-2xl">{slide.emoji}</div>
      </div>

      {/* Progress dots */}
      <div className="relative z-10 flex justify-center gap-3 pb-3">
        {KIDS_SCRIPT.map((s, i) => (
          <button
            key={i}
            onClick={() => changeSlide(i)}
            className="rounded-full transition-all duration-400"
            style={{
              width: i === current ? "2rem" : "0.65rem",
              height: "0.65rem",
              background: i <= current ? s.color : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-5 px-4 pb-4">

        {/* Character — big cartoon */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            animation: visible ? "bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
          }}
        >
          <div
            className="relative rounded-full overflow-hidden border-8 mx-auto"
            style={{
              width: "min(180px, 45vw)",
              height: "min(180px, 45vw)",
              borderColor: slide.color,
              boxShadow: `0 0 40px ${slide.color}88, 0 0 80px ${slide.color}44`,
            }}
          >
            <img
              src={slide.image}
              alt={slide.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Name badge */}
          <div className="text-center mt-3">
            <span
              className="px-4 py-1 rounded-full font-black text-white text-lg"
              style={{ background: slide.color }}
            >
              {slide.name} {slide.flag}
            </span>
          </div>
        </div>

        {/* Word of the slide */}
        <div
          className="text-center"
          style={{
            animation: visible ? "wordPop 0.5s 0.3s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
          }}
        >
          <div
            className="inline-block px-5 py-2 rounded-2xl font-black text-white text-xl"
            style={{ background: `linear-gradient(135deg, ${slide.color}, ${slide.color}99)` }}
          >
            {slide.word}
          </div>
          <div className="text-white/50 text-sm mt-1">= {slide.wordPT}</div>
        </div>

        {/* Speech bubble */}
        <div
          className="w-full max-w-md"
          style={{
            opacity: visible ? 1 : 0,
            animation: visible ? "bounceIn 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
          }}
        >
          <div
            className="rounded-3xl p-5"
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,20,0,0.8) 100%)",
              border: `3px solid ${slide.color}66`,
              boxShadow: `0 0 30px ${slide.color}22`,
            }}
          >
            <p
              className="text-white font-bold leading-relaxed text-center"
              style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}
            >
              {slide.text}
            </p>

            {/* Translation toggle */}
            <button
              onClick={() => setShowTranslation(t => !t)}
              className="mt-3 w-full text-xs py-2 rounded-xl text-center transition-colors font-semibold"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
            >
              {showTranslation ? "▲ Ocultar" : "🇧🇷 Tradução em português"}
            </button>
            {showTranslation && (
              <p className="mt-2 text-green-300 text-sm leading-relaxed italic text-center">
                {slide.translation}
              </p>
            )}
          </div>
        </div>

        {/* Audio + navigation */}
        <div className="flex flex-col items-center gap-3 w-full max-w-md">
          {/* Sound wave */}
          {isPlaying && (
            <div className="flex items-end gap-1 h-8">
              {[0,1,2,3,4].map((i) => (
                <div
                  key={i}
                  className="w-2 rounded-full"
                  style={{
                    background: slide.color,
                    animation: `waveKids 0.55s ${i * 0.1}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => speakMutation.mutate({ text: slide.text, character: slide.character, situation: slide.situation })}
            disabled={speakMutation.isPending || isPlaying}
            className="w-full py-3 rounded-2xl font-black text-white text-lg transition-all active:scale-95 disabled:opacity-50"
            style={{
              background: isPlaying ? `${slide.color}55` : `linear-gradient(135deg, ${slide.color}, ${slide.color}aa)`,
              border: `3px solid ${slide.color}`,
            }}
          >
            {speakMutation.isPending ? "⏳ Carregando..." : isPlaying ? "🔊 Ouvindo..." : `🔊 Ouvir ${slide.name}!`}
          </button>

          <div className="flex gap-3 w-full">
            {current > 0 && (
              <button
                onClick={() => changeSlide(current - 1)}
                className="px-5 py-3 rounded-2xl font-bold text-white border-2 border-white/20 hover:border-white/40 transition-all"
              >
                ← Voltar
              </button>
            )}
            <button
              onClick={() => isLast ? setLocation("/events") : changeSlide(current + 1)}
              className="flex-1 py-3 rounded-2xl font-black text-white text-lg transition-all active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${slide.color}, ${slide.color}bb)`,
                boxShadow: `0 4px 20px ${slide.color}66`,
              }}
            >
              {isLast ? "🍀 Vamos jogar!" : "Próximo →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
