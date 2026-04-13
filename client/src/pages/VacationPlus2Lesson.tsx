/**
 * VacationPlus2Lesson — Individual lesson page with 5 sections
 *
 * Sections: Overview, Vocabulary, Dialogues, Cultural Tips, Quiz
 * URL: /book/vacation-plus-2/lesson/:lessonNumber
 */

import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Plane, Utensils, MapPin, Users, ShoppingBag, Lightbulb,
  Gamepad2, Rocket, BookOpen, Volume2, Globe, MessageCircle,
  CheckCircle2, ChevronLeft, Play, Pause, Trophy, Star, Zap,
} from "lucide-react";
import { toast } from "sonner";

// ── Lesson metadata ──────────────────────────────────────────────────────────

const LESSON_META = [
  { id: 1, title: "Going on Vacation", icon: Plane, color: "#06b6d4", gradient: "from-cyan-500 to-blue-600" },
  { id: 2, title: "Eating Out", icon: Utensils, color: "#f97316", gradient: "from-orange-500 to-red-600" },
  { id: 3, title: "Around Town", icon: MapPin, color: "#22c55e", gradient: "from-green-500 to-emerald-600" },
  { id: 4, title: "Talking About Others", icon: Users, color: "#ec4899", gradient: "from-pink-500 to-rose-600" },
  { id: 5, title: "Spending Money", icon: ShoppingBag, color: "#eab308", gradient: "from-yellow-500 to-amber-600" },
  { id: 6, title: "A Piece of Advice", icon: Lightbulb, color: "#a855f7", gradient: "from-purple-500 to-violet-600" },
  { id: 7, title: "Free Time", icon: Gamepad2, color: "#6366f1", gradient: "from-indigo-500 to-blue-600" },
  { id: 8, title: "Plans For The Future", icon: Rocket, color: "#14b8a6", gradient: "from-teal-500 to-cyan-600" },
];

type SectionId = "overview" | "vocabulary" | "dialogues" | "cultural_tips" | "exercises";

const SECTIONS: { id: SectionId; label: string; icon: typeof BookOpen }[] = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "vocabulary", label: "Vocabulary", icon: Volume2 },
  { id: "dialogues", label: "Dialogues", icon: MessageCircle },
  { id: "cultural_tips", label: "Culture", icon: Globe },
  { id: "exercises", label: "Quiz", icon: Trophy },
];

// ── Sample vocabulary data per lesson ────────────────────────────────────────

const VOCAB_DATA: Record<number, Array<{ word: string; us: string; uk: string; au: string; meaning: string }>> = {
  1: [
    { word: "vacation", us: "vacation", uk: "holiday", au: "holiday", meaning: "Período de descanso" },
    { word: "airplane", us: "airplane", uk: "aeroplane", au: "plane", meaning: "Avião" },
    { word: "luggage", us: "luggage", uk: "luggage", au: "bags", meaning: "Bagagem" },
    { word: "round-trip", us: "round-trip", uk: "return ticket", au: "return", meaning: "Ida e volta" },
    { word: "boarding pass", us: "boarding pass", uk: "boarding card", au: "boarding pass", meaning: "Cartão de embarque" },
    { word: "gate", us: "gate", uk: "gate", au: "gate", meaning: "Portão de embarque" },
  ],
  2: [
    { word: "check", us: "check", uk: "bill", au: "bill", meaning: "Conta" },
    { word: "appetizer", us: "appetizer", uk: "starter", au: "entree", meaning: "Entrada" },
    { word: "fries", us: "fries", uk: "chips", au: "chips", meaning: "Batata frita" },
    { word: "takeout", us: "takeout", uk: "takeaway", au: "takeaway", meaning: "Para viagem" },
  ],
};

// ── Sample dialogue data ─────────────────────────────────────────────────────

const DIALOGUE_DATA: Record<number, Array<{ character: string; flag: string; text: string; color: string }>> = {
  1: [
    { character: "Lucas", flag: "🇺🇸", text: "Hey! I'm so pumped for this trip! I've got my bags packed and ready to go. Let's hit the road!", color: "#3b82f6" },
    { character: "Emily", flag: "🇬🇧", text: "Oh, how lovely! I've sorted out all my documents and booked a rather nice hotel near the city centre.", color: "#ec4899" },
    { character: "Aiko", flag: "🇦🇺", text: "No worries, mate! I've chucked everything in my backpack. Reckon we'll have a ripper time!", color: "#22c55e" },
  ],
};

// ── Component ────────────────────────────────────────────────────────────────

export default function VacationPlus2Lesson() {
  const params = useParams<{ lessonNumber: string }>();
  const lessonNum = parseInt(params.lessonNumber || "1");
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [completedSections, setCompletedSections] = useState<Set<SectionId>>(new Set());

  const meta = LESSON_META.find(l => l.id === lessonNum) || LESSON_META[0];
  const Icon = meta.icon;
  const vocab = VOCAB_DATA[lessonNum] || VOCAB_DATA[1] || [];
  const dialogues = DIALOGUE_DATA[lessonNum] || DIALOGUE_DATA[1] || [];

  const updateSection = trpc.vacationPlus2Router.updateSection.useMutation();

  function markComplete(section: SectionId) {
    setCompletedSections(prev => new Set([...prev, section]));
    updateSection.mutate({ lessonNumber: lessonNum, section });
    toast.success(`${section.replace("_", " ")} completed!`);
  }

  const sectionProgress = Math.round((completedSections.size / SECTIONS.length) * 100);

  return (
    <div className="min-h-screen pb-10"
      style={{
        background: "linear-gradient(160deg, #0a0a1a 0%, #0d1a2e 25%, #1a0a2e 50%, #0d1117 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

      {/* Header */}
      <div className="px-5 pt-8 pb-5">
        <button onClick={() => setLocation("/book/vacation-plus-2")}
          className="flex items-center gap-1 text-white/40 text-sm mb-4 hover:text-white/60 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Vacation Plus 2
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${meta.color}40, ${meta.color}15)` }}>
            <Icon className="w-7 h-7" style={{ color: meta.color }} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: `${meta.color}80` }}>
              Lesson {lessonNum}
            </span>
            <h1 className="text-white text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
              {meta.title}
            </h1>
          </div>
        </div>

        {/* Section progress */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${sectionProgress}%`, background: meta.color }} />
          </div>
          <span className="text-white/40 text-xs">{completedSections.size}/{SECTIONS.length}</span>
        </div>
      </div>

      {/* Section tabs */}
      <div className="px-5 mb-5">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            const isComplete = completedSections.has(sec.id);
            const SIcon = sec.icon;

            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
                style={{
                  background: isActive ? `${meta.color}20` : "rgba(255,255,255,0.03)",
                  color: isActive ? meta.color : "rgba(255,255,255,0.4)",
                  border: isActive ? `1px solid ${meta.color}30` : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {isComplete ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <SIcon className="w-3.5 h-3.5" />}
                {sec.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section content */}
      <div className="px-5">
        {/* ── OVERVIEW ── */}
        {activeSection === "overview" && (
          <div className="space-y-4">
            <div className="rounded-2xl p-5"
              style={{ background: `${meta.color}08`, border: `1px solid ${meta.color}15` }}>
              <h2 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                What you'll learn
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                In this lesson, you'll explore real-world English used by Lucas (US), Emily (UK), and Aiko (AU).
                Practice vocabulary, listen to authentic dialogues, discover cultural tips, and test your knowledge.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {["Vocabulary (US/UK/AU)", "Real dialogues", "Cultural facts", "Quiz (75% to pass)"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                    <CheckCircle2 className="w-3 h-3" style={{ color: meta.color }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => { markComplete("overview"); setActiveSection("vocabulary"); }}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`, boxShadow: `0 4px 16px ${meta.color}30` }}>
              Start Lesson
            </button>
          </div>
        )}

        {/* ── VOCABULARY ── */}
        {activeSection === "vocabulary" && (
          <div className="space-y-3">
            {vocab.map((v, i) => (
              <div key={i} className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{v.word}</h3>
                  <span className="text-white/30 text-xs">{v.meaning}</span>
                </div>
                <div className="flex gap-2">
                  {[
                    { label: "🇺🇸", value: v.us, color: "#3b82f6" },
                    { label: "🇬🇧", value: v.uk, color: "#ec4899" },
                    { label: "🇦🇺", value: v.au, color: "#22c55e" },
                  ].map((variant, j) => (
                    <span key={j} className="px-2 py-1 rounded-lg text-[11px]"
                      style={{ background: `${variant.color}10`, color: `${variant.color}aa`, border: `1px solid ${variant.color}15` }}>
                      {variant.label} {variant.value}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <button onClick={() => { markComplete("vocabulary"); setActiveSection("dialogues"); }}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)` }}>
              Continue to Dialogues &rarr;
            </button>
          </div>
        )}

        {/* ── DIALOGUES ── */}
        {activeSection === "dialogues" && (
          <div className="space-y-3">
            <p className="text-white/40 text-sm mb-2">Listen to how each character uses the vocabulary in context:</p>

            {dialogues.map((d, i) => (
              <div key={i} className="rounded-xl p-4"
                style={{ background: `${d.color}08`, border: `1px solid ${d.color}15` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{d.flag}</span>
                  <span className="text-sm font-semibold" style={{ color: d.color }}>{d.character}</span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed italic">"{d.text}"</p>
              </div>
            ))}

            <button onClick={() => { markComplete("dialogues"); setActiveSection("cultural_tips"); }}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)` }}>
              Continue to Culture &rarr;
            </button>
          </div>
        )}

        {/* ── CULTURAL TIPS ── */}
        {activeSection === "cultural_tips" && (
          <div className="space-y-3">
            {[
              { city: "New York", flag: "🇺🇸", char: "Lucas", tip: "Americans love small talk. At the airport, it's totally normal to chat with strangers in line!", color: "#3b82f6" },
              { city: "London", flag: "🇬🇧", char: "Emily", tip: "In the UK, 'queue' is sacred. Never skip the line — Brits take orderly queuing very seriously!", color: "#ec4899" },
              { city: "Sydney", flag: "🇦🇺", char: "Aiko", tip: "Aussies shorten everything! 'Afternoon' becomes 'arvo', 'breakfast' becomes 'brekkie'. It's all about being chill!", color: "#22c55e" },
            ].map((tip, i) => (
              <div key={i} className="rounded-xl p-4"
                style={{ background: `${tip.color}06`, border: `1px solid ${tip.color}12` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{tip.flag}</span>
                  <div>
                    <span className="text-sm font-semibold text-white/80">{tip.city}</span>
                    <span className="text-xs text-white/30 ml-2">with {tip.char}</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{tip.tip}</p>
              </div>
            ))}

            <button onClick={() => { markComplete("cultural_tips"); setActiveSection("exercises"); }}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)` }}>
              Ready for the Quiz! &rarr;
            </button>
          </div>
        )}

        {/* ── QUIZ ── */}
        {activeSection === "exercises" && (
          <div className="space-y-4">
            <div className="rounded-2xl p-5 text-center"
              style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.12)" }}>
              <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
              <h2 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                Lesson {lessonNum} Quiz
              </h2>
              <p className="text-white/40 text-sm mb-1">4 questions · 75% to pass</p>
              <p className="text-white/30 text-xs mb-4">Pass to unlock the next lesson and earn 10 inFlux Coins!</p>

              <button
                onClick={() => {
                  markComplete("exercises");
                  toast.success("Quiz section opened! Use the Tutor tab for full quiz.");
                }}
                className="px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #eab308, #f97316)", boxShadow: "0 4px 16px rgba(234,179,8,0.3)" }}>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Start Quiz
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
