/**
 * VacationPlus2 — Book overview page with Glassmorphism Spatial design
 *
 * Grid of 8 lesson cards with status, progress, unlock animation.
 * Design: Glass cards, mesh gradient bg, animated elements.
 * URL: /book/vacation-plus-2
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Plane, Utensils, MapPin, Users, ShoppingBag, Lightbulb,
  Gamepad2, Rocket, Lock, CheckCircle2, ChevronRight, Trophy,
  BookOpen, Star, Flame, ChevronLeft,
} from "lucide-react";

const LESSONS = [
  { id: 1, title: "Going on Vacation", subtitle: "Airport & Travel", icon: Plane, color: "#06b6d4", secondary: "#3b82f6" },
  { id: 2, title: "Eating Out", subtitle: "Restaurants & Food", icon: Utensils, color: "#f97316", secondary: "#ef4444" },
  { id: 3, title: "Around Town", subtitle: "Transport & Directions", icon: MapPin, color: "#22c55e", secondary: "#10b981" },
  { id: 4, title: "Talking About Others", subtitle: "Personality & People", icon: Users, color: "#ec4899", secondary: "#f43f5e" },
  { id: 5, title: "Spending Money", subtitle: "Shopping & Budget", icon: ShoppingBag, color: "#eab308", secondary: "#f97316" },
  { id: 6, title: "A Piece of Advice", subtitle: "Suggestions & Tips", icon: Lightbulb, color: "#a855f7", secondary: "#7c3aed" },
  { id: 7, title: "Free Time", subtitle: "Hobbies & Activities", icon: Gamepad2, color: "#6366f1", secondary: "#3b82f6" },
  { id: 8, title: "Plans For The Future", subtitle: "Dreams & Goals", icon: Rocket, color: "#14b8a6", secondary: "#06b6d4" },
];

type LessonStatus = "locked" | "available" | "in_progress" | "completed";

interface LessonProgress {
  lessonNumber: number;
  progressPercentage: number;
  quizPassed: boolean;
  quizScore: number | null;
}

export default function VacationPlus2() {
  const [, setLocation] = useLocation();
  const [animateIn, setAnimateIn] = useState(false);

  const { data: progressData } = trpc.vacationPlus2Router.getProgress.useQuery();

  useEffect(() => {
    requestAnimationFrame(() => setAnimateIn(true));
  }, []);

  // Build progress map
  const progressMap = new Map<number, LessonProgress>();
  if (progressData && Array.isArray(progressData)) {
    for (const p of progressData) {
      const existing = progressMap.get(p.lessonNumber);
      if (!existing || p.progressPercentage > existing.progressPercentage) {
        progressMap.set(p.lessonNumber, {
          lessonNumber: p.lessonNumber,
          progressPercentage: Number(p.progressPercentage) || 0,
          quizPassed: p.quizPassed || false,
          quizScore: p.quizScore,
        });
      }
    }
  }

  function getLessonStatus(lessonId: number): LessonStatus {
    const progress = progressMap.get(lessonId);
    if (progress?.quizPassed) return "completed";
    if (progress && progress.progressPercentage > 0) return "in_progress";
    if (lessonId === 1) return "available";
    const prevProgress = progressMap.get(lessonId - 1);
    if (prevProgress?.quizPassed) return "available";
    if (lessonId <= 3) return "available";
    return "locked";
  }

  const completedCount = LESSONS.filter(l => getLessonStatus(l.id) === "completed").length;
  const overallProgress = Math.round((completedCount / LESSONS.length) * 100);

  return (
    <div className="min-h-screen pb-10 relative"
      style={{
        background: "#04040c",
        fontFamily: "'DM Sans', sans-serif",
      }}>

      {/* Page mesh gradient */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 70% 50% at 30% 20%, rgba(249,115,22,0.1), transparent 70%),
                     radial-gradient(ellipse 50% 60% at 70% 70%, rgba(6,182,212,0.08), transparent 70%)`,
      }} />

      <div className="relative z-10">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="px-5 pt-10 pb-8">
            {/* Back button */}
            <button onClick={() => setLocation("/student/home")}
              className="flex items-center gap-1 text-white/40 text-sm mb-6 hover:text-white/60 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Dashboard
            </button>

            <div className="flex items-start gap-5">
              {/* Book cover with glass effect */}
              <div className="flex-shrink-0 w-24 h-32 rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ea580c, #dc2626)",
                  boxShadow: "0 8px 32px rgba(249,115,22,0.25), inset -3px 0 8px rgba(0,0,0,0.2)",
                }}>
                <Plane className="w-10 h-10 text-white/90 mb-1" />
                <span className="text-white text-[10px] font-bold uppercase tracking-wider">VP2</span>
                {/* Spine */}
                <div className="absolute left-0 top-0 bottom-0 w-2"
                  style={{ background: "linear-gradient(to right, rgba(0,0,0,0.3), transparent)" }} />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-white text-2xl font-bold leading-tight mb-1"
                  style={{ fontFamily: "'Syne', sans-serif" }}>
                  Vacation Plus 2
                </h1>
                <p className="text-white/40 text-sm mb-4">8 lessons · 3 characters · 3 countries</p>

                {/* Progress bar with glow */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{
                        width: animateIn ? `${overallProgress}%` : "0%",
                        background: "linear-gradient(90deg, #f97316, #eab308, #22c55e)",
                        transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "0 0 12px rgba(249,115,22,0.4)",
                      }} />
                  </div>
                  <span className="text-white/50 text-sm font-mono">{overallProgress}%</span>
                </div>

                {/* Stats pills */}
                <div className="flex gap-2 mt-3">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
                    style={{ background: "rgba(34,197,94,0.1)", color: "#86efac", border: "1px solid rgba(34,197,94,0.15)" }}>
                    <CheckCircle2 className="w-3 h-3" /> {completedCount}/{LESSONS.length}
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
                    style={{ background: "rgba(234,179,8,0.1)", color: "#fde047", border: "1px solid rgba(234,179,8,0.15)" }}>
                    <Star className="w-3 h-3" /> {completedCount * 10} coins
                  </span>
                </div>
              </div>
            </div>

            {/* Characters */}
            <div className="flex gap-3 mt-6">
              {[
                { name: "Lucas", flag: "🇺🇸", color: "#3b82f6" },
                { name: "Emily", flag: "🇬🇧", color: "#ec4899" },
                { name: "Aiko", flag: "🇦🇺", color: "#22c55e" },
              ].map((char) => (
                <div key={char.name}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                  style={{
                    background: `${char.color}10`,
                    border: `1px solid ${char.color}20`,
                    backdropFilter: "blur(8px)",
                  }}>
                  <span>{char.flag}</span>
                  <span style={{ color: `${char.color}cc` }}>{char.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lesson Grid */}
        <div className="px-5 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LESSONS.map((lesson, idx) => {
              const Icon = lesson.icon;
              const status = getLessonStatus(lesson.id);
              const progress = progressMap.get(lesson.id);
              const isLocked = status === "locked";
              const isCompleted = status === "completed";
              const pct = progress?.progressPercentage || 0;

              return (
                <button
                  key={lesson.id}
                  disabled={isLocked}
                  onClick={() => setLocation(`/book/vacation-plus-2/lesson/${lesson.id}`)}
                  className="text-left rounded-2xl p-4 transition-all duration-300 active:scale-[0.97] group relative overflow-hidden"
                  style={{
                    background: isLocked
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(255,255,255,0.04)",
                    backdropFilter: isLocked ? undefined : "blur(12px)",
                    border: isCompleted
                      ? `1px solid rgba(34,197,94,0.3)`
                      : `1px solid ${isLocked ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.09)"}`,
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${idx * 60}ms`,
                  }}
                >
                  {/* Top shine line */}
                  {!isLocked && (
                    <div className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${lesson.color}25, transparent)` }} />
                  )}

                  {/* Completed badge */}
                  {isCompleted && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                  )}

                  {/* Lock icon */}
                  {isLocked && (
                    <div className="absolute top-3 right-3">
                      <Lock className="w-4 h-4 text-white/15" />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Icon circle with gradient */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isLocked
                          ? "rgba(255,255,255,0.03)"
                          : `linear-gradient(135deg, ${lesson.color}30, ${lesson.color}10)`,
                        border: isLocked ? undefined : `1px solid ${lesson.color}20`,
                      }}>
                      <Icon className="w-6 h-6"
                        style={{ color: isLocked ? "rgba(255,255,255,0.1)" : lesson.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: isLocked ? "rgba(255,255,255,0.1)" : `${lesson.color}80` }}>
                        Lesson {lesson.id}
                      </span>
                      <h3 className={`font-semibold text-sm mt-0.5 ${isLocked ? "text-white/15" : "text-white/90"}`}
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        {lesson.title}
                      </h3>
                      <p className={`text-xs mt-0.5 ${isLocked ? "text-white/8" : "text-white/35"}`}>
                        {lesson.subtitle}
                      </p>

                      {/* Progress bar */}
                      {pct > 0 && !isCompleted && (
                        <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background: `linear-gradient(90deg, ${lesson.color}, ${lesson.secondary})`,
                              boxShadow: `0 0 8px ${lesson.color}40`,
                            }} />
                        </div>
                      )}

                      {/* Quiz score */}
                      {isCompleted && progress?.quizScore != null && (
                        <div className="flex items-center gap-1 mt-2">
                          <Trophy className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400/80">{progress.quizScore}/4</span>
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    {!isLocked && (
                      <ChevronRight className="w-4 h-4 text-white/20 mt-3 group-hover:text-white/40 transition-colors" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
