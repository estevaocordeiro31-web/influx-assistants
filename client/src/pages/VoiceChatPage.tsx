import { useAuth } from '@/_core/hooks/useAuth';
import VoiceChat from '@/components/VoiceChat';
import { ArrowLeft, Mic, Target, BarChart3 } from 'lucide-react';
import { useLocation } from 'wouter';

export default function VoiceChatPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  if (!user && typeof window !== 'undefined' && !window.location.pathname.includes('/demo')) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #06090f 0%, #0c1222 40%, #111827 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <Mic size={40} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 16px' }} />
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#fff', marginBottom: 8 }}>
            Acesso Restrito
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', marginBottom: 24 }}>
            Voce precisa estar autenticado para acessar esta pagina.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 24px', borderRadius: 12,
              background: 'rgba(77,168,255,0.12)', border: '1px solid rgba(77,168,255,0.2)',
              color: '#4da8ff', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  const infoCards = [
    {
      icon: Target,
      title: 'Objetivo',
      desc: 'Praticar ingles conversacional com feedback personalizado baseado em chunks e equivalencias.',
      color: '#6abf4b',
    },
    {
      icon: Mic,
      title: 'Como Funciona',
      desc: 'Fale em ingles, a Elie entendera sua fala e respondera com feedback e sugestoes de melhoria.',
      color: '#4da8ff',
    },
    {
      icon: BarChart3,
      title: 'Progresso',
      desc: 'Seu desempenho e rastreado para oferecer exercicios cada vez mais desafiadores.',
      color: '#f59e0b',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #06090f 0%, #0c1222 40%, #111827 100%)',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <header style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(6,9,15,0.7)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/student/home')} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
            cursor: 'pointer', padding: 4, display: 'flex',
          }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#fff', margin: 0 }}>
              Voice Chat
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              Converse em ingles com a Elie
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(106,191,75,0.08)', border: '1px solid rgba(106,191,75,0.15)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6abf4b' }} />
          <span style={{ fontSize: '0.7rem', color: '#6abf4b', fontWeight: 500 }}>Online</span>
        </div>
      </header>

      {/* Voice Chat */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{
          borderRadius: 20, overflow: 'hidden',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          minHeight: 500,
        }}>
          <VoiceChat />
        </div>

        {/* Info cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          marginTop: 20,
        }}>
          {infoCards.map((card) => (
            <div key={card.title} style={{
              borderRadius: 16, padding: 18, position: 'relative', overflow: 'hidden',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${card.color}20`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${card.color}15, transparent)`,
              }} />
              <div style={{
                width: 32, height: 32, borderRadius: 10, marginBottom: 10,
                background: `${card.color}10`, border: `1px solid ${card.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <card.icon size={16} style={{ color: card.color }} />
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: '#fff', marginBottom: 6 }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, margin: 0 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
