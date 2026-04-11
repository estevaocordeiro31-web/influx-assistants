import { useState } from 'react';
import { useLocation } from 'wouter';
import { ALL_THEMES, AppTheme } from '@/lib/themes';
import { ChevronLeft, Lock, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ThemeSelector() {
  const [, setLocation] = useLocation();
  const [activeTheme, setActiveTheme] = useState('book-1');
  const [previewTheme, setPreviewTheme] = useState<AppTheme | null>(null);

  // For now, book themes 1-5 are unlocked, specials are locked
  // TODO: Check actual unlock conditions from backend
  const unlockedThemes = new Set(['book-1', 'book-2', 'book-3', 'book-4', 'book-5', 'streak-7']);

  const isUnlocked = (id: string) => unlockedThemes.has(id);

  const handleSelect = (theme: AppTheme) => {
    if (!isUnlocked(theme.id)) {
      toast.error(`Desbloqueie: ${theme.unlockDescription}`);
      return;
    }
    setActiveTheme(theme.id);
    toast.success(`Tema "${theme.name}" ativado!`);
  };

  const bookThemes = ALL_THEMES.filter(t => t.category === 'book');
  const specialThemes = ALL_THEMES.filter(t => t.category === 'special');

  const display = previewTheme || ALL_THEMES.find(t => t.id === activeTheme) || ALL_THEMES[0];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1145 30%, #0d2137 60%, #0a1628 100%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{
        background: 'rgba(15,10,30,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button onClick={() => setLocation('/student/dashboard')} className="text-white/40 hover:text-white/70 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            <Sparkles className="w-4 h-4 inline mr-1.5 text-purple-400" />
            Temas
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Preview */}
        <div className="rounded-2xl p-6 mb-6 text-center" style={{
          background: display.gradient,
          boxShadow: `0 8px 32px ${display.primary}30`,
        }}>
          <span className="text-4xl mb-2 block">{display.icon}</span>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            {display.name}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-6 h-6 rounded-full" style={{ background: display.primary }} />
            <div className="w-6 h-6 rounded-full" style={{ background: display.secondary }} />
            <div className="w-6 h-6 rounded-full border border-white/20" style={{ background: display.accent }} />
          </div>
        </div>

        {/* Book Themes */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
            Temas por Livro
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {bookThemes.map((theme) => {
              const unlocked = isUnlocked(theme.id);
              const isActive = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  className="relative rounded-xl p-4 text-left transition-all duration-200 group"
                  style={{
                    background: unlocked ? `${theme.primary}10` : 'rgba(255,255,255,0.02)',
                    border: isActive
                      ? `2px solid ${theme.primary}`
                      : '1px solid rgba(255,255,255,0.06)',
                    opacity: unlocked ? 1 : 0.5,
                  }}
                  onClick={() => handleSelect(theme)}
                  onMouseEnter={() => unlocked && setPreviewTheme(theme)}
                  onMouseLeave={() => setPreviewTheme(null)}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4" style={{ color: theme.primary }} />
                    </div>
                  )}
                  {!unlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3.5 h-3.5 text-white/20" />
                    </div>
                  )}
                  <span className="text-2xl">{theme.icon}</span>
                  <p className="text-white text-sm font-semibold mt-2">{theme.name}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{theme.unlockDescription}</p>
                  <div className="flex gap-1 mt-2">
                    <div className="w-4 h-4 rounded-full" style={{ background: theme.primary }} />
                    <div className="w-4 h-4 rounded-full" style={{ background: theme.secondary }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Special Themes */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
            Temas Especiais
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {specialThemes.map((theme) => {
              const unlocked = isUnlocked(theme.id);
              const isActive = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  className="relative rounded-xl p-4 text-left transition-all duration-200 group"
                  style={{
                    background: unlocked ? `${theme.primary}10` : 'rgba(255,255,255,0.02)',
                    border: isActive
                      ? `2px solid ${theme.primary}`
                      : '1px solid rgba(255,255,255,0.06)',
                    opacity: unlocked ? 1 : 0.45,
                  }}
                  onClick={() => handleSelect(theme)}
                  onMouseEnter={() => unlocked && setPreviewTheme(theme)}
                  onMouseLeave={() => setPreviewTheme(null)}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4" style={{ color: theme.primary }} />
                    </div>
                  )}
                  {!unlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3.5 h-3.5 text-white/20" />
                    </div>
                  )}
                  <span className="text-2xl">{theme.icon}</span>
                  <p className="text-white text-sm font-semibold mt-2">{theme.name}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{theme.unlockDescription}</p>
                  <div className="flex gap-1 mt-2">
                    <div className="w-4 h-4 rounded-full" style={{ background: theme.primary }} />
                    <div className="w-4 h-4 rounded-full" style={{ background: theme.secondary }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-xl p-4 text-center" style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p className="text-white/40 text-sm">
            <span className="text-white font-bold">{unlockedThemes.size}</span> de{' '}
            <span className="text-white font-bold">{ALL_THEMES.length}</span> temas desbloqueados
          </p>
          <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full" style={{
              width: `${(unlockedThemes.size / ALL_THEMES.length) * 100}%`,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
