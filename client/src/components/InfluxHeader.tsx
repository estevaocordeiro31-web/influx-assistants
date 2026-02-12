import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { LogOut, Menu, X, Flame, Trophy, HelpCircle, Sparkles } from "lucide-react";
import { useState } from "react";

// Dados de demonstração
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

  // Usar dados de demonstração
  const displayUser = {
    name: user?.name || DEMO_USER.name,
    role: user?.role || "student",
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo e Marca */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setLocation("/student/dashboard")}>
          <img
            src="/fluxie-chat.png"
            alt="Fluxie - inFlux Mascot"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-white">inFlux <span className="text-green-400">Personal Tutor</span></h1>
          </div>
        </div>

        {/* Centro - Streak e Level */}
        <div className="hidden md:flex items-center gap-4">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-3 py-1">
            <Flame className="w-4 h-4 mr-1" />
            {DEMO_USER.streakDays} dias
          </Badge>
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-3 py-1">
            <Trophy className="w-4 h-4 mr-1" />
            {DEMO_USER.level}
          </Badge>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {/* Link para Tiago se autenticado */}
          {user?.email === "tiago.laerte@icloud.com" && (
            <Button
              onClick={() => setLocation("/tiago")}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-green-400 hover:bg-slate-800 flex items-center gap-2"
              title="Meu Espaço Personalizado"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden lg:inline">Meu Espaço</span>
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-bold text-slate-900 text-sm">
              {displayUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-medium text-white">{displayUser.name}</p>
              <p className="text-xs text-slate-400">Book 5 - Unit 8</p>
            </div>
          </div>
          {onOpenTutorial && (
            <Button
              onClick={onOpenTutorial}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-green-400 hover:bg-slate-800"
              title="Ver tutorial novamente"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-2 py-1 text-xs">
            <Flame className="w-3 h-3 mr-1" />
            {DEMO_USER.streakDays}
          </Badge>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile Expandido */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 px-4 py-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-bold text-slate-900">
              {displayUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-white">{displayUser.name}</p>
              <p className="text-xs text-slate-400">Book 5 - Unit 8 • {DEMO_USER.level}</p>
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              <Flame className="w-3 h-3 mr-1" />
              {DEMO_USER.streakDays} dias seguidos
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <Trophy className="w-3 h-3 mr-1" />
              {DEMO_USER.level}
            </Badge>
          </div>
          {/* Link para Tiago no mobile */}
          {user?.email === "tiago.laerte@icloud.com" && (
            <Button
              onClick={() => setLocation("/tiago")}
              variant="outline"
              size="sm"
              className="w-full border-green-600 text-green-400 hover:bg-green-600/20 mb-4"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Meu Espaço Personalizado
            </Button>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      )}
    </header>
  );
}
