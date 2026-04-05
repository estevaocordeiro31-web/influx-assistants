import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const BOOKS: Record<string, { label: string; level: string; color: string; emoji: string }> = {
  book1: { label: "Book 1", level: "Beginner", color: "#22c55e", emoji: "🌱" },
  book2: { label: "Book 2", level: "Intermediate", color: "#3b82f6", emoji: "📘" },
  book3: { label: "Book 3", level: "Intermediate", color: "#3b82f6", emoji: "📗" },
  book4: { label: "Book 4", level: "Advanced", color: "#f59e0b", emoji: "🔥" },
  book5: { label: "Book 5", level: "Advanced", color: "#f59e0b", emoji: "⚡" },
  summit: { label: "Summit", level: "Master", color: "#a855f7", emoji: "🏆" },
};

const WELCOME_MESSAGES = [
  (name: string) => `Hey ${name}! 👋`,
  () => `Welcome to your first access to the`,
  () => `inFlux AITutor! 🤖✨`,
  (name: string, book: string) => `You're on ${book} — ${BOOKS[book]?.level ?? ""}! ${BOOKS[book]?.emoji ?? ""}`,
  () => `This semester is going to be INCREDIBLE.`,
  () => `Very soon, your personal AITutor`,
  () => `will be unlocked just for you —`,
  () => `a one-of-a-kind experience tailored`,
  () => `to YOUR learning journey. 🚀`,
  () => `But tonight... let's have fun! ☘️🍺`,
];

export default function EventWelcome() {
  const [, navigate] = useLocation();
  const name = localStorage.getItem("event_student_name") ?? "Friend";
  const book = localStorage.getItem("event_student_book") ?? "book1";
  const bookData = BOOKS[book] ?? BOOKS.book1;

  const [visibleLines, setVisibleLines] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);

  const lines = WELCOME_MESSAGES.map(fn => fn(name, book));

  // Typewriter effect line by line
  useEffect(() => {
    if (currentLine >= lines.length) {
      setTimeout(() => setShowButton(true), 400);
      return;
    }

    const line = lines[currentLine];
    let charIdx = 0;
    setTypedText("");

    const typeInterval = setInterval(() => {
      charIdx++;
      setTypedText(line.slice(0, charIdx));
      if (charIdx >= line.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setVisibleLines(v => v + 1);
          setCurrentLine(c => c + 1);
        }, currentLine < 2 ? 300 : 500);
      }
    }, currentLine === 0 ? 60 : 30);

    return () => clearInterval(typeInterval);
  }, [currentLine]);

  const lineColors = [
    "#86efac", // Hey name
    "#6b7280", // Welcome to
    bookData.color, // inFlux AITutor
    bookData.color, // book level
    "#ffffff", // This semester
    "#6b7280", // Very soon
    "#6b7280", // will be unlocked
    "#6b7280", // one-of-a-kind
    "#6b7280", // YOUR learning
    "#22c55e", // But tonight
  ];

  const lineSizes = [
    "text-3xl font-black",
    "text-base font-medium",
    "text-2xl font-black",
    "text-lg font-bold",
    "text-xl font-black",
    "text-base font-medium",
    "text-base font-medium",
    "text-base font-medium",
    "text-base font-medium",
    "text-xl font-black",
  ];

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #0d3320 0%, #061409 60%, #020a04 100%)" }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px #22c55e44; }
          50% { box-shadow: 0 0 50px #22c55e88, 0 0 80px #22c55e33; }
        }
        .fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .float-particle { animation: floatUp linear infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #22c55e, #86efac, #fbbf24, #86efac, #22c55e);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .glow-btn { animation: glowPulse 2s ease-in-out infinite; }
        .cursor-blink {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: #22c55e;
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: blink 0.8s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Floating particles */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none float-particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: "-30px",
            fontSize: `${10 + Math.random() * 14}px`,
            opacity: 0.15 + Math.random() * 0.25,
            animationDuration: `${7 + Math.random() * 7}s`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        >☘️</div>
      ))}

      {/* Badge */}
      <div className="flex justify-center pt-10 pb-2 fade-in-up">
        <div
          className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest flex items-center gap-2"
          style={{ background: `${bookData.color}22`, border: `1px solid ${bookData.color}44`, color: bookData.color }}
        >
          {bookData.emoji} {bookData.label} · {bookData.level}
        </div>
      </div>

      {/* Typewriter messages */}
      <div className="flex-1 px-8 pt-6 pb-4 flex flex-col gap-3 max-w-md mx-auto w-full">
        {/* Already revealed lines */}
        {lines.slice(0, visibleLines).map((line, i) => (
          <p
            key={i}
            className={`${lineSizes[i]} fade-in-up leading-tight`}
            style={{ color: lineColors[i], animationDelay: "0s" }}
          >
            {line}
          </p>
        ))}

        {/* Currently typing line */}
        {currentLine < lines.length && (
          <p
            className={`${lineSizes[currentLine]} leading-tight`}
            style={{ color: lineColors[currentLine] }}
          >
            {typedText}
            <span className="cursor-blink" />
          </p>
        )}
      </div>

      {/* CTA Button */}
      {showButton && (
        <div className="px-6 pb-10 max-w-md mx-auto w-full fade-in-up">
          {/* AITutor teaser card */}
          <div
            className="rounded-2xl p-4 mb-4 flex items-center gap-3"
            style={{ background: `${bookData.color}11`, border: `1px solid ${bookData.color}33` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${bookData.color}22` }}
            >
              🤖
            </div>
            <div>
              <p className="text-white font-bold text-sm">inFlux AITutor</p>
              <p className="text-xs" style={{ color: bookData.color }}>
                🔒 Coming soon — your personal AI tutor
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/events/intro")}
            className="w-full py-4 rounded-2xl font-black text-base text-black transition-all active:scale-95 glow-btn"
            style={{ background: `linear-gradient(135deg, ${bookData.color}, ${bookData.color}cc)` }}
          >
            ☘️ Start the Experience!
          </button>

          <button
            onClick={() => navigate("/events/hub")}
            className="w-full py-3 rounded-2xl font-bold text-sm mt-2 transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.04)", color: "#6b7280", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            Skip intro → Go to Hub
          </button>
        </div>
      )}
    </div>
  );
}
