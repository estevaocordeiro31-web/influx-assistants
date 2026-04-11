import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LogOut, Menu, X, Flame, HelpCircle, Sparkles } from "lucide-react";
import { useState } from "react";

const DEMO_USER = {
  name: "Estevao Cordeiro",
  level: "Avançado",
  streakDays: 45,
};

interface InfluxHeaderProps {
  onOpenTutorial?: () => void;
}

export default function InfluxHeader({ onOpenTutorial }: InfluxHeaderProps = {}) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayUser = {
    name: user?.name || DEMO_USER.name,
    role: user?.role || "student",
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <header className="sticky top-0 z-50 text-white" style={{
      background: 'rgba(15, 10, 30, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/student/dashboard")}>
          <img
            src="/fluxie-chat.png"
            alt="Fluxie"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              ImAInd <span style={{ color: '#06b6d4' }}>TUTOR</span>
            </h1>
          </div>
        </div>

        {/* Center - Streak */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#fb923c' }}>
            <Flame className="w-3.5 h-3.5" />
            {DEMO_USER.streakDays} dias
          </span>
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          {user?.email === "tiago.laerte@icloud.com" && (
            <Button
              onClick={() => setLocation("/tiago")}
              variant="ghost"
              size="sm"
              className="text-white/40 hover:text-purple-400 hover:bg-white/5"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff' }}>
              {displayUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-medium text-white text-xs">{displayUser.name}</p>
            </div>
          </div>
          {onOpenTutorial && (
            <Button onClick={onOpenTutorial} variant="ghost" size="sm" className="text-white/30 hover:text-white/60 hover:bg-white/5">
              <HelpCircle className="w-4 h-4" />
            </Button>
          )}
          <Button onClick={handleLogout} variant="ghost" size="sm" className="text-white/30 hover:text-white/60 hover:bg-white/5">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile right */}
        <div className="md:hidden flex items-center gap-2">
          <span className="text-[10px] px-2 py-1 rounded-full flex items-center gap-1"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#fb923c' }}>
            <Flame className="w-3 h-3" />
            {DEMO_USER.streakDays}
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-white/5 rounded-lg text-white/50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4" style={{ background: 'rgba(15,10,30,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff' }}>
              {displayUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-white text-sm">{displayUser.name}</p>
              <p className="text-xs text-white/30">{DEMO_USER.level}</p>
            </div>
          </div>
          {user?.email === "tiago.laerte@icloud.com" && (
            <Button
              onClick={() => setLocation("/tiago")}
              variant="outline"
              size="sm"
              className="w-full mb-3 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Meu Espaco
            </Button>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full border-white/10 text-white/50 hover:bg-white/5"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      )}
    </header>
  );
}
