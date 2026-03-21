import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const BOOKS = [
  { id: "book1", label: "Book 1", level: "Beginner", color: "#22c55e", emoji: "🌱", desc: "Starting your journey" },
  { id: "book2", label: "Book 2", level: "Intermediate", color: "#3b82f6", emoji: "📘", desc: "Building confidence" },
  { id: "book3", label: "Book 3", level: "Intermediate", color: "#3b82f6", emoji: "📗", desc: "Growing stronger" },
  { id: "book4", label: "Book 4", level: "Advanced", color: "#f59e0b", emoji: "🔥", desc: "Pushing boundaries" },
  { id: "book5", label: "Book 5", level: "Advanced", color: "#f59e0b", emoji: "⚡", desc: "Almost fluent" },
  { id: "summit", label: "Summit", level: "Master", color: "#a855f7", emoji: "🏆", desc: "Peak performance" },
];

export default function EventRegister() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [step, setStep] = useState<"name" | "book" | "submitting">("name");
  const [error, setError] = useState("");

  const joinMutation = trpc.culturalEvents.joinAsGuest.useMutation({
    onSuccess: (data: { participantId: number; token: string }) => {
      localStorage.setItem("event_participant_id", String(data.participantId));
      localStorage.setItem("event_id", "stpatricks_2026");
      localStorage.setItem("event_guest_token", data.token);
      // Store name and book for welcome screen
      localStorage.setItem("event_student_name", name);
      localStorage.setItem("event_student_book", selectedBook ?? "");
      navigate("/events/welcome");
    },
    onError: (_err: unknown) => {
      setError("Ops! Algo deu errado. Tente novamente.");
      setStep("book");
    },
  });

  const handleNameNext = () => {
    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your name (at least 2 characters)");
      return;
    }
    setError("");
    setStep("book");
  };

  const handleSubmit = () => {
    if (!selectedBook) {
      setError("Please select your book");
      return;
    }
    setStep("submitting");
    joinMutation.mutate({
      eventId: "stpatricks_2026",
      name: name.trim(),
    });
  };

  const selectedBookData = BOOKS.find(b => b.id === selectedBook);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #0d3320 0%, #061409 60%, #020a04 100%)" }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bookPop {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease forwards; }
        .book-pop { animation: bookPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .shimmer-text {
          background: linear-gradient(90deg, #22c55e, #86efac, #fbbf24, #86efac, #22c55e);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .float-particle { animation: floatUp linear infinite; }
      `}</style>

      {/* Floating particles */}
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none float-particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: "-30px",
            fontSize: `${12 + Math.random() * 16}px`,
            opacity: 0.2 + Math.random() * 0.3,
            animationDuration: `${6 + Math.random() * 6}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >☘️</div>
      ))}

      {/* Header */}
      <div className="flex flex-col items-center pt-10 pb-4 px-6 fade-in-up">
        <div
          className="px-3 py-1 rounded-full text-xs font-black tracking-widest mb-3"
          style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #22c55e44", color: "#86efac" }}
        >
          ☘️ St. Patrick's Experience
        </div>
        <h1 className="shimmer-text font-black text-3xl text-center leading-tight">
          {step === "name" ? "Who are you?" : "Your level?"}
        </h1>
        <p className="text-green-600 text-sm mt-1 text-center">
          {step === "name"
            ? "Tell us your name to get started"
            : `Hey ${name}! Choose your book to unlock the experience`}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all"
          style={{
            background: step === "name" ? "#22c55e" : "rgba(34,197,94,0.3)",
            color: step === "name" ? "#000" : "#22c55e",
          }}
        >1</div>
        <div className="w-8 h-0.5" style={{ background: step === "book" || step === "submitting" ? "#22c55e" : "#1a3a22" }} />
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all"
          style={{
            background: step === "book" || step === "submitting" ? "#22c55e" : "rgba(34,197,94,0.15)",
            color: step === "book" || step === "submitting" ? "#000" : "#22c55e44",
          }}
        >2</div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8 max-w-md mx-auto w-full">

        {/* Step 1: Name */}
        {step === "name" && (
          <div className="fade-in-up flex flex-col gap-4">
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(34,197,94,0.06)", border: "1px solid #22c55e22" }}
            >
              <label className="text-green-300 text-xs font-bold uppercase tracking-widest block mb-3">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleNameNext()}
                placeholder="Type your name here..."
                autoFocus
                className="w-full bg-transparent text-white text-xl font-bold outline-none placeholder-green-900"
                style={{ caretColor: "#22c55e" }}
              />
              <div className="mt-3 h-0.5 rounded-full" style={{ background: name.length > 1 ? "#22c55e" : "#1a3a22" }} />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleNameNext}
              disabled={name.trim().length < 2}
              className="w-full py-4 rounded-2xl font-black text-base text-black transition-all active:scale-95 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 0 30px #22c55e44" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Book selection */}
        {(step === "book" || step === "submitting") && (
          <div className="fade-in-up flex flex-col gap-3">
            {BOOKS.map((book, i) => {
              const isSelected = selectedBook === book.id;
              return (
                <button
                  key={book.id}
                  onClick={() => { setSelectedBook(book.id); setError(""); }}
                  className="w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-all active:scale-98"
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${book.color}22, ${book.color}11)`
                      : "rgba(255,255,255,0.03)",
                    border: isSelected ? `2px solid ${book.color}88` : "1px solid rgba(255,255,255,0.06)",
                    animationDelay: `${i * 0.05}s`,
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                    boxShadow: isSelected ? `0 0 20px ${book.color}33` : "none",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${book.color}22`, border: `1px solid ${book.color}44` }}
                  >
                    {book.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-black text-base">{book.label}</span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${book.color}22`, color: book.color }}
                      >
                        {book.level}
                      </span>
                    </div>
                    <p className="text-green-700 text-xs mt-0.5">{book.desc}</p>
                  </div>
                  {isSelected && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-black font-black text-sm flex-shrink-0"
                      style={{ background: book.color }}
                    >✓</div>
                  )}
                </button>
              );
            })}

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!selectedBook || step === "submitting"}
              className="w-full py-4 rounded-2xl font-black text-base text-black transition-all active:scale-95 disabled:opacity-40 mt-2"
              style={{
                background: selectedBookData
                  ? `linear-gradient(135deg, ${selectedBookData.color}, ${selectedBookData.color}cc)`
                  : "linear-gradient(135deg, #22c55e, #16a34a)",
                boxShadow: selectedBookData ? `0 0 30px ${selectedBookData.color}44` : "0 0 30px #22c55e44",
              }}
            >
              {step === "submitting" ? "⏳ Entering..." : `${selectedBookData?.emoji ?? "☘️"} Let's Go!`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
