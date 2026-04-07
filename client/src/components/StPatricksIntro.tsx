import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

// ─── CDN Images ──────────────────────────────────────────────────────────────
const LUCAS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/lucas-front_cf8484a0.jpg";
const EMILY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/emily-front_0daf3cbe.jpg";
const AIKO_IMG  = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/aiko-front_4d46e4a6.jpg";
const LUCAS_SCENE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/lucas-nyc_23052758.jpg";
const EMILY_SCENE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/emily-london_af529e0e.jpg";
const AIKO_SCENE  = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/aiko-sydney_9b11df80.jpg";

// ─── Script ──────────────────────────────────────────────────────────────────
const INTRO_SCRIPT = [
  {
    character: "lucas" as const,
    name: "Lucas",
    flag: "🇺🇸",
    accent: "American English",
    image: LUCAS_IMG,
    sceneImage: LUCAS_SCENE,
    accentColor: "#3b82f6",
    glowColor: "rgba(59,130,246,0.5)",
    situation: "excited" as const,
    text: "Hey everyone! Happy St. Patrick's Day! 🍀 I'm Lucas, from New York City. In the US, St. Patrick's Day is HUGE — we're talking green beer, massive parades, and everyone wearing green. If you're NOT wearing green, someone will pinch you! The biggest parade is right here in New York, with over two million people watching. It's wild!",
    translation: "Ei pessoal! Feliz Dia de São Patrício! Sou o Lucas, de Nova York. Nos EUA, o St. Patrick's Day é ENORME — cerveja verde, desfiles gigantes e todo mundo de verde. Se você NÃO estiver de verde, alguém vai te beliscar! O maior desfile fica aqui em Nova York, com mais de dois milhões de pessoas. É incrível!",
    fact: "🗽 Em Nova York, o desfile do St. Patrick's Day acontece desde 1762 — antes dos EUA existirem!",
  },
  {
    character: "emily" as const,
    name: "Emily",
    flag: "🇬🇧",
    accent: "British English",
    image: EMILY_IMG,
    sceneImage: EMILY_SCENE,
    accentColor: "#ec4899",
    glowColor: "rgba(236,72,153,0.5)",
    situation: "explaining" as const,
    text: "Hello, lovely! I'm Emily, from London. Now, St. Patrick's Day is actually an Irish holiday — Saint Patrick was the patron saint of Ireland. He's famous for driving all the snakes out of Ireland and using the shamrock to explain the Holy Trinity. In the UK, we celebrate it too, especially in cities with large Irish communities. Pubs go absolutely mad with Guinness and Irish music!",
    translation: "Olá, queridos! Sou a Emily, de Londres. O St. Patrick's Day é um feriado irlandês — São Patrício era o santo padroeiro da Irlanda. Famoso por expulsar as cobras da Irlanda e usar o trevo para explicar a Santíssima Trindade. No Reino Unido também celebramos, especialmente nos pubs com música irlandesa!",
    fact: "☘️ O trevo virou símbolo da Irlanda porque São Patrício o usou para explicar o Cristianismo — três folhas, uma planta!",
  },
  {
    character: "aiko" as const,
    name: "Aiko",
    flag: "🇦🇺",
    accent: "Australian English",
    image: AIKO_IMG,
    sceneImage: AIKO_SCENE,
    accentColor: "#a855f7",
    glowColor: "rgba(168,85,247,0.5)",
    situation: "casual" as const,
    text: "G'day! I'm Aiko, from Sydney! You know what's funny? Australia has one of the biggest Irish communities outside of Ireland! In Sydney and Melbourne, St. Patrick's Day is a massive celebration. We've got Irish pubs everywhere, and people go all out with green outfits. The Irish came to Australia during the Gold Rush in the 1850s, and they never really left — cheers to that! 🍺",
    translation: "Oi! Sou a Aiko, de Sydney! Sabia que a Austrália tem uma das maiores comunidades irlandesas fora da Irlanda? Em Sydney e Melbourne, o St. Patrick's Day é uma festa enorme. Temos pubs irlandeses em todo lugar e as pessoas capricham nos looks verdes. Os irlandeses vieram durante a Corrida do Ouro nos anos 1850 e nunca foram embora!",
    fact: "🦘 A Austrália tem mais de 2,4 milhões de pessoas com ancestralidade irlandesa — quase 10% da população!",
  },
  {
    character: "lucas" as const,
    name: "Lucas",
    flag: "🇺🇸",
    accent: "American English",
    image: LUCAS_IMG,
    sceneImage: LUCAS_SCENE,
    accentColor: "#22c55e",
    glowColor: "rgba(34,197,94,0.5)",
    situation: "excited" as const,
    text: "So tonight, we're going to celebrate St. Patrick's Day inFlux style! We've got tongue twisters, music challenges, and the famous Who Am I game — all in English! Are you ready to test your English AND have a great time? Let's go! Sláinte — that means 'cheers' in Irish! 🥂",
    translation: "Então esta noite vamos celebrar o St. Patrick's Day no estilo inFlux! Temos trava-línguas, desafios musicais e o famoso jogo Who Am I — tudo em inglês! Estão prontos para testar o inglês e se divertir muito? Vamos lá! Sláinte — isso significa 'saúde' em irlandês, tipo 'cheers'!",
    fact: "🎉 'Sláinte' (pronuncia-se SLAWN-cha) é o brinde irlandês — significa 'saúde' e é usado como 'cheers'!",
  },
];

// ─── Falling Shamrocks ────────────────────────────────────────────────────────
function FallingShamrocks() {
  const items = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${7 + Math.random() * 7}s`,
      size: `${1.2 + Math.random() * 1.4}rem`,
      emoji: ["☘️", "🍀", "☘️", "🌿"][Math.floor(Math.random() * 4)],
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
            animation: `shamrockFall ${s.duration} ${s.delay} linear infinite`,
          }}
        >
          {s.emoji}
        </div>
      ))}
      <style>{`
        @keyframes shamrockFall {
          0%   { transform: translateY(-60px) rotate(0deg);   opacity: 0; }
          8%   { opacity: 0.85; }
          92%  { opacity: 0.85; }
          100% { transform: translateY(105vh) rotate(400deg); opacity: 0; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-80px) scale(0.92); opacity: 0; }
          60%  { transform: translateX(8px) scale(1.02); opacity: 1; }
          80%  { transform: translateX(-3px) scale(0.99); }
          to   { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(80px) scale(0.92); opacity: 0; }
          60%  { transform: translateX(-8px) scale(1.02); opacity: 1; }
          80%  { transform: translateX(3px) scale(0.99); }
          to   { transform: translateX(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Sound wave bars ──────────────────────────────────────────────────────────
function SoundWave({ color }: { color: string }) {
  return (
    <div className="flex items-end gap-0.5 h-6">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1.5 rounded-full"
          style={{
            background: color,
            animation: `wave 0.7s ${i * 0.12}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          from { height: 4px; }
          to   { height: 22px; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StPatricksIntro() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [slideVisible, setSlideVisible] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakMutation = trpc.tts.speak.useMutation({
    onSuccess: (data) => {
      setAudioUrl(data.audioUrl);
      setIsPlaying(true);
    },
    onError: () => setIsPlaying(false),
  });

  const slide = INTRO_SCRIPT[currentSlide];
  const progress = ((currentSlide + 1) / INTRO_SCRIPT.length) * 100;
  const isLast = currentSlide === INTRO_SCRIPT.length - 1;

  const playAudio = () => {
    speakMutation.mutate({
      text: slide.text,
      character: slide.character,
      situation: slide.situation,
    });
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(() => {});
      if (autoAdvance) {
        audioRef.current.onended = () => {
          setIsPlaying(false);
          if (currentSlide < INTRO_SCRIPT.length - 1) {
            setTimeout(() => changeSlide(currentSlide + 1), 1500);
          }
        };
      } else {
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }
  }, [audioUrl, autoAdvance, currentSlide]);

  const changeSlide = (next: number) => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setAudioUrl(null);
    setShowTranslation(false);
    setSlideVisible(false);
    setTimeout(() => {
      setCurrentSlide(next);
      setSlideVisible(true);
    }, 350);
  };

  const goNext = () => {
    if (isLast) {
      setLocation("/events");
    } else {
      changeSlide(currentSlide + 1);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) changeSlide(currentSlide - 1);
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #071a07 0%, #0b2e0b 50%, #071a07 100%)" }}
    >
      <audio ref={audioRef} />
      <FallingShamrocks />

      {/* Glow orbs */}
      <div className="fixed top-[-120px] left-[-120px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)" }} />
      <div className="fixed bottom-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(21,128,61,0.18) 0%, transparent 70%)" }} />

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => setLocation("/events")}
          className="text-white/50 hover:text-white text-sm flex items-center gap-1 transition-colors"
        >
          ← Skip intro
        </button>
        <div className="text-center">
          <h1 className="text-xl font-black text-yellow-400 tracking-wide" style={{ textShadow: "0 0 20px rgba(234,179,8,0.6)" }}>
            ☘️ ST. PATRICK'S NIGHT
          </h1>
          <p className="text-white/40 text-xs">by inFlux</p>
        </div>
        <label className="flex items-center gap-1 text-white/50 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
            className="w-3 h-3 accent-green-500"
          />
          Auto
        </label>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-4 pb-3">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, #16a34a, ${slide.accentColor})` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {INTRO_SCRIPT.map((s, i) => (
            <button
              key={i}
              onClick={() => changeSlide(i)}
              className="w-6 h-6 rounded-full border-2 text-xs font-bold transition-all duration-300 flex items-center justify-center"
              style={{
                borderColor: i <= currentSlide ? s.accentColor : "rgba(255,255,255,0.2)",
                background: i < currentSlide ? s.accentColor : i === currentSlide ? `${s.accentColor}33` : "transparent",
                color: i <= currentSlide ? "white" : "rgba(255,255,255,0.3)",
              }}
            >
              {i < currentSlide ? "✓" : i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── Slide content ── */}
      <div
        className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-6 px-4 pb-4"
      >
        {/* Character portrait */}
        <div
          className="flex flex-col items-center gap-3 flex-shrink-0"
          style={{
            animation: slideVisible ? "slideInLeft 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
            opacity: slideVisible ? 1 : 0,
          }}
        >
          <div
            className="relative rounded-2xl overflow-hidden border-4"
            style={{
              width: "min(220px, 42vw)",
              height: "min(300px, 56vw)",
              borderColor: slide.accentColor,
              boxShadow: `0 0 50px ${slide.glowColor}, 0 20px 60px rgba(0,0,0,0.6)`,
            }}
          >
            <img
              src={slide.image}
              alt={slide.name}
              className="w-full h-full object-cover object-top"
            />
            {/* Name badge */}
            <div
              className="absolute bottom-0 left-0 right-0 py-2 px-3 text-center"
              style={{ background: `linear-gradient(to top, ${slide.accentColor}ee, transparent)` }}
            >
              <div className="text-white font-black text-lg leading-tight">
                {slide.name} {slide.flag}
              </div>
              <div className="text-white/70 text-xs">{slide.accent}</div>
            </div>
          </div>

          {/* Audio button + wave */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={playAudio}
              disabled={speakMutation.isPending || isPlaying}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white border-2 transition-all active:scale-95 disabled:opacity-50"
              style={{
                borderColor: slide.accentColor,
                background: isPlaying ? `${slide.accentColor}33` : "transparent",
              }}
            >
              {speakMutation.isPending ? (
                <><div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Loading...</>
              ) : isPlaying ? (
                <>🔊 Playing...</>
              ) : (
                <>🔊 Hear {slide.name}</>
              )}
            </button>
            {isPlaying && (
              <div className="flex flex-col items-center gap-1">
                <SoundWave color={slide.accentColor} />
                <button
                  onClick={() => { audioRef.current?.pause(); setIsPlaying(false); }}
                  className="text-white/40 hover:text-white text-xs transition-colors"
                >
                  ⏸ Pause
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Speech bubble */}
        <div
          className="flex-1 max-w-xl flex flex-col gap-4"
          style={{
            animation: slideVisible ? "slideInRight 0.55s 0.1s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
            opacity: slideVisible ? 1 : 0,
          }}
        >
          {/* Shamrock accent */}
          <div className="text-4xl">☘️</div>

          <div
            className="rounded-3xl p-5 md:p-7 relative"
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,30,0,0.75) 100%)",
              border: `2px solid ${slide.accentColor}55`,
              boxShadow: `0 0 30px ${slide.accentColor}15`,
            }}
          >
            {/* Bubble tail */}
            <div
              className="hidden md:block absolute left-[-14px] top-10 w-0 h-0"
              style={{
                borderTop: "14px solid transparent",
                borderBottom: "14px solid transparent",
                borderRight: `14px solid ${slide.accentColor}55`,
              }}
            />
            <p className="text-white leading-relaxed font-medium" style={{ fontSize: "clamp(0.9rem, 2vw, 1.15rem)" }}>
              {slide.text}
            </p>
            {/* Translation toggle */}
            <button
              onClick={() => setShowTranslation(t => !t)}
              className="mt-3 w-full text-xs py-1.5 rounded-xl text-center transition-colors"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}
            >
              {showTranslation ? "▲ Ocultar tradução" : "🇧🇷 Ver tradução em português"}
            </button>
            {showTranslation && (
              <p className="mt-2 text-green-200 text-sm leading-relaxed italic">
                {slide.translation}
              </p>
            )}
          </div>

          {/* Scene image */}
          <div className="rounded-2xl overflow-hidden" style={{ height: 90, border: `1px solid ${slide.accentColor}33` }}>
            <img src={slide.sceneImage} alt="scene" className="w-full h-full object-cover" style={{ objectPosition: "center 25%" }} />
          </div>

          {/* Fun fact */}
          <div
            className="rounded-2xl p-4 border"
            style={{
              background: "rgba(234,179,8,0.1)",
              borderColor: "rgba(234,179,8,0.35)",
            }}
          >
            <p className="text-yellow-200 text-sm leading-relaxed">{slide.fact}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {currentSlide > 0 && (
              <button
                onClick={goPrev}
                className="px-5 py-3 rounded-full font-bold text-white border-2 border-white/20 hover:border-white/40 transition-all"
              >
                ← Back
              </button>
            )}
            <button
              onClick={goNext}
              className="flex-1 py-3 rounded-full font-black text-white text-base transition-all active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${slide.accentColor}, ${slide.accentColor}bb)`,
                boxShadow: `0 4px 20px ${slide.glowColor}`,
              }}
            >
              {isLast ? "🍀 Let's Play!" : "Next →"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Slide dots ── */}
      <div className="relative z-10 flex justify-center gap-2 pb-5">
        {INTRO_SCRIPT.map((s, i) => (
          <button
            key={i}
            onClick={() => changeSlide(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === currentSlide ? "1.5rem" : "0.5rem",
              height: "0.5rem",
              background: i === currentSlide ? slide.accentColor : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
