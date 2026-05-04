import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ALL_THEMES, LAYOUTS, AppTheme, LayoutType, getThemesByGroup } from '@/lib/themes';
import { ChevronLeft, Lock, Check, Sparkles, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';

// ── Phone Mockup Preview ────────────────────────────────────────────────────
function PhonePreview({ theme, layout }: { theme: AppTheme; layout: LayoutType }) {
  const stats = [
    { icon: '🔥', val: '12', lbl: 'streak' },
    { icon: '📚', val: '68%', lbl: 'book 5' },
    { icon: '🕐', val: '7pm', lbl: 'aula' },
    { icon: '⭐', val: '3', lbl: 'badges' },
  ];

  const narrativeCards = [
    { icon: '🔥', title: 'Streak incrível!', val: '12 dias seguidos', quote: '"You\'re on fire!"' },
    { icon: '📚', title: 'Progresso', val: '68% — Book 5', quote: '"Almost there!"' },
    { icon: '🕐', title: 'Próxima aula', val: 'Hoje 19h', quote: '"See you tonight!"' },
  ];

  const font = theme.fontOverride || "'Syne', sans-serif";
  const isDark = !theme.background.includes('#f0');

  const renderStars = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: 'rgba(255,255,255,0.6)',
            animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );

  const renderAvatar = (size: number) => (
    <div
      className="rounded-full flex items-center justify-center relative flex-shrink-0"
      style={{ width: size, height: size, background: theme.avatarBg, fontSize: size * 0.45 }}
    >
      <div
        className="absolute rounded-full"
        style={{
          inset: -3,
          border: `1.5px solid ${theme.avatarRing}`,
          opacity: 0.5,
          borderRadius: '50%',
        }}
      />
      {theme.icon}
    </div>
  );

  const renderCard = (label: string, value: string, sub?: string) => (
    <div
      className="rounded-lg p-1.5"
      style={{ background: theme.cardBg, border: `0.5px solid ${theme.cardBorder}`, color: theme.cardText }}
    >
      <div style={{ fontSize: 6, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: 10, fontWeight: 700, fontFamily: font, color: theme.valueColor }}>{value}</div>
      {sub && <div style={{ fontSize: 5.5, opacity: 0.45, marginTop: 1 }}>{sub}</div>}
    </div>
  );

  const renderButton = (text: string) => (
    <div
      className="text-center rounded-full py-1 px-2 mx-auto"
      style={{
        fontSize: 8,
        fontWeight: 600,
        fontFamily: font,
        background: theme.buttonBg,
        color: theme.buttonColor,
        border: theme.buttonBorder || 'none',
        letterSpacing: '0.04em',
      }}
    >
      {text}
    </div>
  );

  const renderHeader = () => (
    <div className="text-center mb-1">
      {renderAvatar(32)}
      <div className="mt-1" style={{ fontSize: 8, color: theme.accentColor }}>{theme.name.split(' ')[0]}</div>
      <div style={{ fontSize: 7, opacity: 0.35 }}>Hi Marcus!</div>
      <div className="mt-1">{renderButton('🎤 Talk')}</div>
    </div>
  );

  const layoutContent = () => {
    switch (layout) {
      case 'orbit':
        return (
          <div className="flex-1 flex flex-col">
            {renderHeader()}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative" style={{ width: 110, height: 110 }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {renderAvatar(28)}
                </div>
                {stats.map((s, i) => {
                  const positions = [
                    { top: 0, left: '50%', transform: 'translateX(-50%)' },
                    { top: '50%', right: 0, transform: 'translateY(-50%)' },
                    { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
                    { top: '50%', left: 0, transform: 'translateY(-50%)' },
                  ];
                  return (
                    <div
                      key={i}
                      className="absolute rounded-lg p-1 text-center"
                      style={{
                        ...positions[i] as any,
                        width: 38,
                        background: theme.cardBg,
                        border: `0.5px solid ${theme.cardBorder}`,
                      }}
                    >
                      <div style={{ fontSize: 10 }}>{s.icon}</div>
                      <div style={{ fontSize: 8, fontWeight: 700, fontFamily: font, color: theme.valueColor }}>{s.val}</div>
                      <div style={{ fontSize: 5, opacity: 0.5 }}>{s.lbl}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'scroll':
        return (
          <div className="flex-1 flex flex-col">
            {renderHeader()}
            <div className="grid grid-cols-2 gap-1 flex-1 mt-1">
              {renderCard('Streak', '12', 'dias')}
              {renderCard('Book 5', '68%', 'progresso')}
              <div className="col-span-2">{renderCard('Próxima aula', 'Hoje 19h · Teacher Carol')}</div>
              {renderCard('Horas', '14h')}
              {renderCard('Badge', '🏆')}
            </div>
          </div>
        );

      case 'split':
        return (
          <div className="flex-1 flex gap-1.5">
            <div className="flex flex-col items-center gap-2 pt-1" style={{ width: 40 }}>
              {renderAvatar(26)}
              <div style={{ fontSize: 7, color: theme.accentColor }}>Elie</div>
              <div className="rounded-full py-0.5 px-1.5" style={{ fontSize: 7, background: theme.buttonBg, color: theme.buttonColor, border: theme.buttonBorder || 'none' }}>🎤</div>
              {[{ v: '12', l: 'streak' }, { v: '68%', l: 'book 5' }, { v: '14h', l: 'horas' }].map((s, i) => (
                <div key={i} className="text-center">
                  <div style={{ fontSize: 10, fontWeight: 700, fontFamily: font, color: theme.valueColor }}>{s.v}</div>
                  <div style={{ fontSize: 5, opacity: 0.45 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
              {renderCard('Sugestão do dia', 'Focus on Unit 7')}
              {renderCard('Próxima aula', 'Hoje 19h')}
              {renderCard('Evento', "St. Patrick's Night")}
              {renderCard('Badge', '🏆 7-Day Champ')}
            </div>
          </div>
        );

      case 'narrative':
        return (
          <div className="flex-1 flex flex-col">
            {renderHeader()}
            <div className="flex-1 flex flex-col gap-1 mt-1">
              {narrativeCards.map((c, i) => (
                <div
                  key={i}
                  className="rounded-lg p-1.5"
                  style={{ background: theme.cardBg, border: `0.5px solid ${theme.cardBorder}` }}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', fontSize: 8 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: 8, fontWeight: 600, color: theme.valueColor }}>{c.title}</div>
                      <div style={{ fontSize: 7, opacity: 0.6 }}>{c.val}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 6.5, fontStyle: 'italic', opacity: 0.7, color: theme.accentColor }}>{c.quote}</div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded-[20px] overflow-hidden transition-transform hover:-translate-y-1"
        style={{
          width: 160,
          aspectRatio: '9/16',
          border: '1.5px solid rgba(255,255,255,0.1)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        }}
      >
        <div
          className="w-full h-full p-2.5 flex flex-col relative"
          style={{ background: theme.background, color: isDark ? '#fff' : '#1e293b' }}
        >
          {isDark && renderStars()}
          <div className="relative z-10 flex flex-col h-full">
            {layoutContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function ThemeSelector() {
  const [, setLocation] = useLocation();
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('tutor_theme') || 'spatial-glossy');
  const [activeLayout, setActiveLayout] = useState<LayoutType>(() => (localStorage.getItem('tutor_layout') as LayoutType) || 'orbit');
  const [previewTheme, setPreviewTheme] = useState<AppTheme | null>(null);

  const themeGroups = useMemo(() => getThemesByGroup(), []);

  // For now all themes unlocked except legendary
  const unlockedThemes = useMemo(() => {
    const set = new Set(ALL_THEMES.filter(t => t.group !== 'legendary').map(t => t.id));
    // Legendary unlocked if all books complete (for now allow preview)
    return set;
  }, []);

  const isUnlocked = (id: string) => unlockedThemes.has(id);

  const handleSelectTheme = (theme: AppTheme) => {
    if (!isUnlocked(theme.id) && theme.group === 'legendary') {
      toast.error(`Desbloqueie: ${theme.unlockDescription}`);
      return;
    }
    setActiveTheme(theme.id);
    localStorage.setItem('tutor_theme', theme.id);
    window.dispatchEvent(new Event('tutor-theme-change'));
    toast.success(`Tema "${theme.name}" ativado!`);
  };

  const handleSelectLayout = (layout: LayoutType) => {
    setActiveLayout(layout);
    localStorage.setItem('tutor_layout', layout);
    window.dispatchEvent(new Event('tutor-layout-change'));
    toast.success(`Layout "${LAYOUTS.find(l => l.id === layout)?.name}" ativado!`);
  };

  const displayTheme = previewTheme || ALL_THEMES.find(t => t.id === activeTheme) || ALL_THEMES[0];

  const groupOrder: Array<{ key: string; label: string }> = [
    { key: 'launch', label: '🚀 Lançamento' },
    { key: 'kids', label: '🧒 Kids' },
    { key: 'teens', label: '🎧 Teens' },
    { key: 'adults', label: '💼 Adults' },
    { key: 'legendary', label: '🔮 Lendário' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1145 30%, #0d2137 60%, #0a1628 100%)' }}>
      {/* Twinkle keyframes */}
      <style>{`@keyframes twinkle{0%,100%{opacity:.15}50%{opacity:.8}}`}</style>

      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{
        background: 'rgba(15,10,30,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button onClick={() => setLocation('/student/home')} className="text-white/40 hover:text-white/70 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Temas & Layouts
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ── Layout Selector ──────────────────────────────────── */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            <LayoutGrid className="w-4 h-4" /> Layout do Dashboard
          </h2>
          <div className="flex gap-2 flex-wrap">
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                onClick={() => handleSelectLayout(l.id)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: activeLayout === l.id ? 'var(--purple, #6b3fa0)' : 'rgba(255,255,255,0.04)',
                  border: activeLayout === l.id ? '1px solid #6b3fa0' : '1px solid rgba(255,255,255,0.1)',
                  color: activeLayout === l.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  boxShadow: activeLayout === l.id ? '0 4px 16px rgba(107,63,160,0.3)' : 'none',
                }}
              >
                {l.number}. {l.name}
              </button>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-2">
            {LAYOUTS.find(l => l.id === activeLayout)?.description}
          </p>
        </div>

        {/* ── Large Preview ────────────────────────────────────── */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-3">
            <PhonePreview theme={displayTheme} layout={activeLayout} />
          </div>
          <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>
            {displayTheme.icon} {displayTheme.name}
          </h3>
          <p className="text-white/30 text-xs">{displayTheme.groupLabel}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 rounded-full" style={{ background: displayTheme.accentColor }} />
            <div className="w-5 h-5 rounded-full" style={{ background: displayTheme.valueColor }} />
            <div className="w-5 h-5 rounded-full" style={{ background: displayTheme.avatarBg.includes('gradient') ? displayTheme.avatarRing : displayTheme.avatarBg, border: '1px solid rgba(255,255,255,0.2)' }} />
          </div>
        </div>

        {/* ── Theme Grid by Group ──────────────────────────────── */}
        {groupOrder.map(({ key, label }) => {
          const themes = themeGroups[key];
          if (!themes || themes.length === 0) return null;
          return (
            <div key={key} className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] mb-3 pb-2" style={{
                color: 'rgba(255,255,255,0.3)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontFamily: "'Syne', sans-serif",
              }}>
                {label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {themes.map((theme) => {
                  const unlocked = isUnlocked(theme.id) || theme.group !== 'legendary';
                  const isActive = activeTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      className="flex flex-col items-center transition-all duration-200 group"
                      onClick={() => handleSelectTheme(theme)}
                      onMouseEnter={() => unlocked && setPreviewTheme(theme)}
                      onMouseLeave={() => setPreviewTheme(null)}
                    >
                      {/* Mini phone */}
                      <div
                        className="rounded-2xl overflow-hidden transition-all duration-200 mb-2"
                        style={{
                          width: '100%',
                          maxWidth: 140,
                          aspectRatio: '9/16',
                          border: isActive
                            ? `2px solid ${theme.accentColor}`
                            : '1.5px solid rgba(255,255,255,0.08)',
                          boxShadow: isActive ? `0 8px 24px ${theme.accentColor}30` : '0 4px 16px rgba(0,0,0,0.3)',
                          opacity: unlocked ? 1 : 0.4,
                          position: 'relative',
                        }}
                      >
                        <div
                          className="w-full h-full p-2 flex flex-col relative overflow-hidden"
                          style={{ background: theme.background, color: theme.cardText }}
                        >
                          {/* Mini content hint */}
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: theme.avatarBg, fontSize: 6 }}>
                              {theme.icon}
                            </div>
                            <div style={{ fontSize: 6, color: theme.accentColor }}>Elie</div>
                          </div>
                          <div className="flex-1 flex flex-col gap-0.5">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="rounded" style={{ height: 8, background: theme.cardBg, border: `0.5px solid ${theme.cardBorder}` }} />
                            ))}
                          </div>
                          <div className="rounded-full mt-1 py-0.5" style={{ background: theme.buttonBg, border: theme.buttonBorder || 'none', textAlign: 'center', fontSize: 5, color: theme.buttonColor, fontWeight: 600 }}>
                            Talk
                          </div>

                          {/* Active check / Lock */}
                          {isActive && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: theme.accentColor }}>
                              <Check className="w-2.5 h-2.5" style={{ color: theme.background.includes('#') ? theme.background : '#000' }} />
                            </div>
                          )}
                          {!unlocked && (
                            <div className="absolute top-1 right-1">
                              <Lock className="w-3 h-3 text-white/30" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Label */}
                      <div className="text-center">
                        <p className="text-white text-xs font-semibold">{theme.icon} {theme.name}</p>
                        {!unlocked && <p className="text-white/20 text-[9px]">{theme.unlockDescription}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ── Progress bar ─────────────────────────────────────── */}
        <div className="rounded-xl p-4 text-center" style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p className="text-white/40 text-sm">
            <span className="text-white font-bold">{ALL_THEMES.filter(t => isUnlocked(t.id) || t.group !== 'legendary').length}</span> de{' '}
            <span className="text-white font-bold">{ALL_THEMES.length}</span> temas · {' '}
            <span className="text-white font-bold">4</span> layouts disponíveis
          </p>
          <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full" style={{
              width: `${(ALL_THEMES.filter(t => isUnlocked(t.id) || t.group !== 'legendary').length / ALL_THEMES.length) * 100}%`,
              background: 'linear-gradient(135deg, #6b3fa0, #2e8b7a, #f5c842)',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
