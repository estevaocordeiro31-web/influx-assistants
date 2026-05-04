/**
 * StudentPassport — Public student passport page
 *
 * URL: /passport/:studentId
 * Shows QR code, stats, book progress, badges, next class.
 * Can be displayed on totems after check-in.
 */

import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { QrCode, Flame, Zap, BookOpen, Trophy, Clock, Award, ChevronUp, ChevronDown, Star } from "lucide-react";

const BRAIN_API = "https://brain.imaind.tech";

interface PassportData {
  student: {
    id: string;
    name: string;
    level: string;
    currentBook: string;
    bookProgress: number;
    streak: number;
    totalXP: number;
    influxDollars: number;
    rank: number;
    totalStudents: number;
    avatarInitials: string;
  };
  qrCode: {
    qrUrl: string;
    expiresAt: string;
  };
  badges: Array<{
    name: string;
    icon: string;
    earnedAt: string;
  }>;
  nextClass: {
    date: string;
    time: string;
    teacher: string;
    room: string;
  } | null;
  leaderboardNeighbors: Array<{
    name: string;
    points: number;
    rank: number;
    isCurrentUser: boolean;
  }>;
}

// ── Theme colors by book ─────────────────────────────────────────────────────

const BOOK_THEMES: Record<string, { primary: string; secondary: string; gradient: string }> = {
  "Vacation Plus 2": { primary: "#f59e0b", secondary: "#d97706", gradient: "linear-gradient(135deg, #f59e0b, #ea580c)" },
  "Beginner 1": { primary: "#3b82f6", secondary: "#2563eb", gradient: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  "Beginner 2": { primary: "#10b981", secondary: "#059669", gradient: "linear-gradient(135deg, #10b981, #14b8a6)" },
  "Intermediate 1": { primary: "#8b5cf6", secondary: "#7c3aed", gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)" },
  "Intermediate 2": { primary: "#ec4899", secondary: "#db2777", gradient: "linear-gradient(135deg, #ec4899, #f43f5e)" },
};

function getBookTheme(book: string) {
  return BOOK_THEMES[book] || BOOK_THEMES["Vacation Plus 2"];
}

// ── Component ────────────────────────────────────────────────────────────────

export default function StudentPassport() {
  const params = useParams<{ studentId: string }>();
  const studentId = params.studentId;
  const [data, setData] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!studentId) return;
      try {
        // Fetch QR
        const qrRes = await fetch(`${BRAIN_API}/api/presence/qr/student/${studentId}`);
        const qrData = await qrRes.json();

        // Fetch presence
        const presRes = await fetch(`${BRAIN_API}/api/presence/student/${studentId}`);
        const presData = await presRes.json();

        // Build passport data (mock enriched with real QR)
        setData({
          student: {
            id: studentId,
            name: presData.presence?.speechBubbleText?.match(/(?:Hey|Hi) (\w+)/)?.[1] || "Student",
            level: "Pre-Intermediate",
            currentBook: "Vacation Plus 2",
            bookProgress: 68,
            streak: presData.todayInteractions || 0,
            totalXP: 1250,
            influxDollars: 85,
            rank: 12,
            totalStudents: 258,
            avatarInitials: "ST",
          },
          qrCode: {
            qrUrl: qrData.qrUrl || "",
            expiresAt: qrData.expiresAt || "",
          },
          badges: [
            { name: "First Steps", icon: "footprints", earnedAt: "2025-12-01" },
            { name: "School Regular", icon: "calendar", earnedAt: "2026-01-15" },
            { name: "Quiz Master", icon: "brain", earnedAt: "2026-02-10" },
          ],
          nextClass: {
            date: "Tomorrow",
            time: "14:00",
            teacher: "Teacher Sarah",
            room: "Sala 3",
          },
          leaderboardNeighbors: [
            { name: "Ana", points: 1320, rank: 11, isCurrentUser: false },
            { name: "Student", points: 1250, rank: 12, isCurrentUser: true },
            { name: "Pedro", points: 1180, rank: 13, isCurrentUser: false },
          ],
        });
      } catch (err) {
        console.error("Passport load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0a0a1a, #1a0a2e)" }}>
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0a0a1a, #1a0a2e)" }}>
        <p className="text-white/40">Student not found</p>
      </div>
    );
  }

  const theme = getBookTheme(data.student.currentBook);

  return (
    <div className="min-h-screen pb-8"
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 30%, #0d1117 70%, #0a1a15 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

      {/* Hero */}
      <div className="relative px-6 pt-10 pb-8">
        <div className="absolute inset-0 opacity-20"
          style={{ background: theme.gradient }} />

        <div className="relative flex flex-col items-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4"
            style={{ background: theme.gradient, boxShadow: `0 8px 32px ${theme.primary}40` }}>
            {data.student.avatarInitials}
          </div>

          <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
            {data.student.name}
          </h1>

          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: `${theme.primary}20`, color: theme.primary, border: `1px solid ${theme.primary}30` }}>
              {data.student.level}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: "rgba(234,179,8,0.1)", color: "#eab308", border: "1px solid rgba(234,179,8,0.2)" }}>
              Rank #{data.student.rank}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-5">
        {/* QR Code */}
        <div className="rounded-2xl p-5 text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-3">My Check-in QR</p>
          <div className="w-48 h-48 mx-auto rounded-xl bg-white p-3 mb-3">
            {data.qrCode.qrUrl ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <QrCode className="w-20 h-20 text-gray-800" />
                <span className="sr-only">{data.qrCode.qrUrl}</span>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <QrCode className="w-20 h-20 text-gray-400" />
              </div>
            )}
          </div>
          <p className="text-white/20 text-[10px]">Scan at any school totem</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Flame} label="Streak" value={`${data.student.streak} days`} color="#ef4444" />
          <StatCard icon={Zap} label="Total XP" value={`${data.student.totalXP}`} color="#eab308" />
          <StatCard icon={Star} label="iF Dollars" value={`$${data.student.influxDollars}`} color="#22c55e" />
          <StatCard icon={Trophy} label="Rank" value={`#${data.student.rank}`} color="#a855f7" />
        </div>

        {/* Current Book */}
        <div className="rounded-2xl p-5"
          style={{ background: `${theme.primary}08`, border: `1px solid ${theme.primary}15` }}>
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-5 h-5" style={{ color: theme.primary }} />
            <p className="text-white/40 text-xs uppercase font-bold tracking-wider">Current Book</p>
          </div>
          <p className="text-white text-lg font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            {data.student.currentBook}
          </p>
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${data.student.bookProgress}%`, background: theme.gradient }} />
          </div>
          <p className="text-right text-white/40 text-xs mt-1">{data.student.bookProgress}%</p>
        </div>

        {/* Badges */}
        {data.badges.length > 0 && (
          <div className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-5 h-5 text-amber-400" />
              <p className="text-white/40 text-xs uppercase font-bold tracking-wider">Badges</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {data.badges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.15)" }}>
                  <span className="text-yellow-400 text-sm font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Class */}
        {data.nextClass && (
          <div className="rounded-2xl p-5"
            style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <p className="text-white/40 text-xs uppercase font-bold tracking-wider">Next Class</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{data.nextClass.date} at {data.nextClass.time}</p>
                <p className="text-white/40 text-sm">{data.nextClass.teacher} · {data.nextClass.room}</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard position */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.12)" }}>
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-5 h-5 text-purple-400" />
            <p className="text-white/40 text-xs uppercase font-bold tracking-wider">Leaderboard</p>
          </div>
          <div className="space-y-2">
            {data.leaderboardNeighbors.map((entry, i) => (
              <div key={i}
                className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                  entry.isCurrentUser ? "ring-1 ring-purple-500/30" : ""
                }`}
                style={{
                  background: entry.isCurrentUser ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.02)",
                }}>
                <div className="flex items-center gap-3">
                  <span className="text-white/40 text-sm font-mono w-6">#{entry.rank}</span>
                  {i === 0 && <ChevronUp className="w-3 h-3 text-green-400" />}
                  {i === 2 && <ChevronDown className="w-3 h-3 text-red-400" />}
                  <span className={`text-sm font-medium ${entry.isCurrentUser ? "text-white" : "text-white/60"}`}>
                    {entry.name}
                  </span>
                </div>
                <span className="text-white/40 text-sm">{entry.points} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-white/15 text-xs mt-8">
        inFlux Passport · Powered by ImAInd
      </p>
    </div>
  );
}

// ── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl p-4 text-center"
      style={{ background: `${color}08`, border: `1px solid ${color}12` }}>
      <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
      <p className="text-white text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</p>
      <p className="text-white/40 text-[10px] uppercase">{label}</p>
    </div>
  );
}
