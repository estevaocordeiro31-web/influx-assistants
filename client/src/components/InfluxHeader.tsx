import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function InfluxHeader() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo e Marca */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
          <img
            src="/logo-influx.png"
            alt="inFlux Logo"
            className="w-10 h-10"
          />
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold">inFlux</h1>
            <p className="text-xs opacity-75">Personal Tutor</p>
          </div>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {user && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center font-bold text-blue-900">
                  {user.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{user.name || "Aluno"}</p>
                  <p className="text-xs opacity-75 capitalize">{user.role}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </>
          )}
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-white/10 rounded"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Menu Mobile Expandido */}
      {mobileMenuOpen && user && (
        <div className="md:hidden bg-blue-800 px-4 py-4 border-t border-blue-700">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-blue-700">
            <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center font-bold text-blue-900">
              {user.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="text-sm">
              <p className="font-medium">{user.name || "Aluno"}</p>
              <p className="text-xs opacity-75 capitalize">{user.role}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full border-white text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      )}
    </header>
  );
}
