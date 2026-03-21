import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// ─── Roteiro da introdução ──────────────────────────────────────────────────
const INTRO_SCRIPT = [
  {
    character: "lucas" as const,
    name: "Lucas",
    flag: "🇺🇸",
    image: "/characters/lucas-usa.png",
    bgColor: "from-blue-900 to-blue-700",
    accentColor: "#3b82f6",
    text: "Hey everyone! Happy St. Patrick's Day! 🍀 I'm Lucas, from New York City. In the US, St. Patrick's Day is HUGE — we're talking green beer, massive parades, and everyone wearing green. If you're NOT wearing green, someone will pinch you! The biggest parade is right here in New York, with over two million people watching. It's wild!",
    situation: "excited" as const,
    fact: "🗽 In New York, the St. Patrick's Day parade has been happening since 1762 — before the USA even existed!",
  },
  {
    character: "emily" as const,
    name: "Emily",
    flag: "🇬🇧",
    image: "/characters/emily-uk.jpg",
    bgColor: "from-red-900 to-red-700",
    accentColor: "#ef4444",
    text: "Hello, lovely! I'm Emily, from London. Now, St. Patrick's Day is actually an Irish holiday — Saint Patrick was the patron saint of Ireland. He's famous for driving all the snakes out of Ireland and using the shamrock to explain the Holy Trinity. In the UK, we celebrate it too, especially in cities with large Irish communities. Pubs go absolutely mad with Guinness and Irish music!",
    situation: "explaining" as const,
    fact: "☘️ The shamrock became a symbol of Ireland because St. Patrick used it to explain Christianity — three leaves, one plant!",
  },
  {
    character: "aiko" as const,
    name: "Aiko",
    flag: "🇦🇺",
    image: "/characters/aiko-australia.jpg",
    bgColor: "from-purple-900 to-purple-700",
    accentColor: "#a855f7",
    text: "G'day! I'm Aiko, from Sydney! You know what's funny? Australia has one of the biggest Irish communities outside of Ireland! In Sydney and Melbourne, St. Patrick's Day is a massive celebration. We've got Irish pubs everywhere, and people go all out with green outfits. The Irish came to Australia during the Gold Rush in the 1850s, and they never really left — cheers to that! 🍺",
    situation: "casual" as const,
    fact: "🦘 Australia has over 2.4 million people with Irish ancestry — that's nearly 10% of the population!",
  },
  {
    character: "lucas" as const,
    name: "Lucas",
    flag: "🇺🇸",
    image: "/characters/lucas-usa.png",
    bgColor: "from-green-900 to-green-700",
    accentColor: "#22c55e",
    text: "So tonight, we're going to celebrate St. Patrick's Day inFlux style! We've got tongue twisters, music challenges, and the famous Who Am I game — all in English! Are you ready to test your English AND have a great time? Let's go! Sláinte — that means 'cheers' in Irish! 🥂",
    situation: "excited" as const,
    fact: "🎉 'Sláinte' (pronounced SLAWN-cha) is the Irish toast — it means 'health' and is used like 'cheers'!",
  },
];

export default function StPatricksIntro() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakMutation = trpc.tts.speak.useMutation({
    onSuccess: (data) => {
      setAudioUrl(data.audioUrl);
      setIsPlaying(true);
    },
    onError: () => {
      setIsPlaying(false);
    },
  });

  const slide = INTRO_SCRIPT[currentSlide];
  const progress = ((currentSlide + 1) / INTRO_SCRIPT.length) * 100;

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
            setTimeout(() => {
              setCurrentSlide((s) => s + 1);
              setAudioUrl(null);
            }, 1500);
          }
        };
      }
    }
  }, [audioUrl, autoAdvance, currentSlide]);

  const goNext = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setAudioUrl(null);
    if (currentSlide < INTRO_SCRIPT.length - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      setLocation("/events");
    }
  };

  const goPrev = () => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setAudioUrl(null);
    if (currentSlide > 0) setCurrentSlide((s) => s - 1);
  };

  const isLast = currentSlide === INTRO_SCRIPT.length - 1;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slide.bgColor} transition-all duration-700 flex flex-col`}>
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => setLocation("/events")}
          className="text-white/70 hover:text-white text-sm flex items-center gap-1"
        >
          ← Skip intro
        </button>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs">{currentSlide + 1} / {INTRO_SCRIPT.length}</span>
          <label className="flex items-center gap-1 text-white/60 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
              className="w-3 h-3"
            />
            Auto
          </label>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-2">
        <Progress value={progress} className="h-1 bg-white/20" />
      </div>

      {/* St. Patrick's title */}
      <div className="text-center px-4 pt-2 pb-4">
        <h1 className="text-2xl font-black text-yellow-400 drop-shadow-lg tracking-wide">
          ☘️ ST. PATRICK'S NIGHT
        </h1>
        <p className="text-white/70 text-sm">by inFlux Jundiaí</p>
      </div>

      {/* Character card */}
      <div className="flex-1 flex flex-col items-center px-4 gap-4">
        {/* Character image with animation */}
        <div
          className="relative"
          style={{
            animation: "slideIn 0.5s ease-out",
          }}
        >
          <div
            className="w-36 h-36 rounded-full overflow-hidden border-4 shadow-2xl"
            style={{ borderColor: slide.accentColor }}
          >
            <img
              src={slide.image}
              alt={slide.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Speaking indicator */}
          {isPlaying && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-lg">
              <div className="flex gap-0.5 items-end h-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-white rounded-full"
                    style={{
                      height: `${8 + i * 4}px`,
                      animation: `soundBar 0.6s ease-in-out infinite ${i * 0.15}s alternate`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Character name badge */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-white text-xs font-bold shadow"
            style={{ backgroundColor: slide.accentColor }}
          >
            {slide.name} {slide.flag}
          </div>
        </div>

        {/* Speech bubble */}
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl">
          <p className="text-white text-sm leading-relaxed">{slide.text}</p>
        </div>

        {/* Fun fact */}
        <div className="w-full max-w-sm bg-yellow-400/20 border border-yellow-400/40 rounded-xl p-3">
          <p className="text-yellow-200 text-xs leading-relaxed">{slide.fact}</p>
        </div>

        {/* Audio controls */}
        <div className="flex items-center gap-3">
          <Button
            onClick={playAudio}
            disabled={speakMutation.isPending || isPlaying}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 gap-2"
            variant="outline"
          >
            {speakMutation.isPending ? (
              <>
                <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                Loading...
              </>
            ) : isPlaying ? (
              <>🔊 Playing...</>
            ) : (
              <>🔊 Hear {slide.name}</>
            )}
          </Button>
          {isPlaying && (
            <button
              onClick={() => {
                audioRef.current?.pause();
                setIsPlaying(false);
              }}
              className="text-white/60 hover:text-white text-xs"
            >
              ⏸ Pause
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 pb-6 pt-4 flex gap-3">
        {currentSlide > 0 && (
          <Button
            onClick={goPrev}
            variant="outline"
            className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            ← Back
          </Button>
        )}
        <Button
          onClick={goNext}
          className="flex-1 font-bold text-base shadow-lg"
          style={{ backgroundColor: slide.accentColor }}
        >
          {isLast ? "🍀 Let's Play!" : "Next →"}
        </Button>
      </div>

      {/* Slide dots */}
      <div className="flex justify-center gap-2 pb-4">
        {INTRO_SCRIPT.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              setIsPlaying(false);
              setAudioUrl(null);
              setCurrentSlide(i);
            }}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: i === currentSlide ? slide.accentColor : "rgba(255,255,255,0.3)",
              transform: i === currentSlide ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes soundBar {
          from { transform: scaleY(0.5); }
          to { transform: scaleY(1.5); }
        }
      `}</style>
    </div>
  );
}
