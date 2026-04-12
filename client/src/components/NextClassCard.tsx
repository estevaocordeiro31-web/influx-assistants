/**
 * NextClassCard — Shows next class schedule, teacher, and classroom
 */

import { Calendar, User, MapPin } from "lucide-react";
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

  const font = appTheme.fontOverride || "'Syne', sans-serif";

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: `linear-gradient(135deg, rgba(6,182,212,0.08) 0%, ${appTheme.cardBg || "rgba(255,255,255,0.05)"} 100%)`,
        border: `1px solid rgba(6,182,212,0.15)`,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl" style={{ background: "rgba(6,182,212,0.15)" }}>
          <Calendar className="w-4 h-4 text-cyan-400" />
        </div>
        <h3
          className="font-bold text-sm"
          style={{ fontFamily: font, color: appTheme.cardText || "#fff" }}
        >
          Sua Aula
        </h3>
      </div>

      <div className="space-y-2">
        {schedule && (
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400/60" />
            <span className="text-sm" style={{ color: `${appTheme.cardText || "#fff"}cc` }}>
              {schedule}
            </span>
          </div>
        )}
        {teacher && (
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-cyan-400/60" />
            <span className="text-sm" style={{ color: `${appTheme.cardText || "#fff"}cc` }}>
              {teacher}
            </span>
          </div>
        )}
        {className && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400/60" />
            <span className="text-sm" style={{ color: `${appTheme.cardText || "#fff"}cc` }}>
              {className}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
