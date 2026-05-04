/**
 * NextClassCard — Glassmorphism card with Bento-style layout
 * Shows next class, teacher, room with glass frosted effect.
 */

import { Calendar, User, MapPin, CheckCircle2 } from "lucide-react";
import type { AppTheme } from "@/lib/themes";

interface NextClassCardProps {
  appTheme: AppTheme;
  schedule: string | null;
  teacher: string | null;
  className: string | null;
}

export default function NextClassCard({
  appTheme,
  schedule,
  teacher,
  className,
}: NextClassCardProps) {
  if (!schedule && !teacher) return null;

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden transition-all hover:scale-[1.01] hover:border-opacity-80"
      style={{
        background: "rgba(46,139,122,0.08)",
        border: "1px solid rgba(46,139,122,0.2)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}>
      {/* Top shine */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(46,139,122,0.25), transparent)" }} />

      <span className="text-2xl block mb-3">📅</span>

      <p className="text-[10px] uppercase tracking-wider font-bold text-white/25 mb-1">Próxima Aula</p>

      {schedule && (
        <h3 className="text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif", color: "#7dd3c0" }}>
          {schedule}
        </h3>
      )}

      {teacher && (
        <div className="flex items-center gap-2 mt-2">
          <User className="w-3.5 h-3.5 text-teal-400/60" />
          <span className="text-sm text-white/50">{teacher}</span>
        </div>
      )}

      {className && (
        <div className="mt-3 px-3 py-2 rounded-xl"
          style={{ background: "rgba(46,139,122,0.1)", border: "1px solid rgba(46,139,122,0.2)" }}>
          <p className="text-[10px] text-white/30 mb-0.5">Sala</p>
          <p className="text-sm text-white/70 font-medium">{className}</p>
        </div>
      )}

      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold"
        style={{ background: "rgba(46,139,122,0.15)", color: "#7dd3c0", border: "1px solid rgba(46,139,122,0.25)" }}>
        <CheckCircle2 className="w-3 h-3" /> Confirmada
      </div>
    </div>
  );
}
