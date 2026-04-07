import { useState } from "react";
import { Plane } from "lucide-react";

interface VacationPlus2ButtonProps {
  onClick?: () => void;
  className?: string;
}

export function VacationPlus2Button({ onClick, className = "" }: VacationPlus2ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group overflow-hidden
        px-8 py-4 rounded-2xl
        font-black text-2xl tracking-wider
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        ${className}
      `}
      style={{
        background: isHovered 
          ? 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #ff00ff 100%)'
          : 'linear-gradient(135deg, #00d4ff 0%, #00ff88 50%, #00d4ff 100%)',
        boxShadow: isHovered
          ? `
            0 0 20px rgba(0, 255, 136, 0.8),
            0 0 40px rgba(0, 212, 255, 0.6),
            0 0 60px rgba(255, 0, 255, 0.4),
            0 0 80px rgba(0, 255, 136, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.2)
          `
          : `
            0 0 15px rgba(0, 212, 255, 0.6),
            0 0 30px rgba(0, 255, 136, 0.4),
            0 0 45px rgba(0, 212, 255, 0.2),
            inset 0 0 15px rgba(255, 255, 255, 0.1)
          `,
      }}
    >
      {/* Animated background glow */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          animation: 'shine 2s infinite',
        }}
      />
      
      {/* Neon border effect */}
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{
          border: '2px solid transparent',
          background: 'linear-gradient(135deg, rgba(0,255,136,0.5), rgba(0,212,255,0.5), rgba(255,0,255,0.5)) border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Pulsing glow rings */}
      <div 
        className="absolute inset-0 rounded-2xl animate-pulse"
        style={{
          boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        <Plane 
          className="w-8 h-8 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
          }}
        />
        <span 
          className="text-white"
          style={{
            textShadow: `
              0 0 10px rgba(255,255,255,0.8),
              0 0 20px rgba(0,255,136,0.6),
              0 0 30px rgba(0,212,255,0.4),
              0 0 40px rgba(255,0,255,0.3)
            `,
          }}
        >
          VACATION 2
        </span>
      </div>

      {/* Sparkle effects */}
      <div className="absolute top-2 right-4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDuration: '1.5s' }} />
      <div className="absolute bottom-3 left-6 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
      <div className="absolute top-4 left-12 w-1 h-1 bg-green-300 rounded-full animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.3s' }} />

      {/* CSS Animation */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
      `}</style>
    </button>
  );
}

// Versão menor para uso em tabs
export function VacationPlus2Tab({ onClick, isActive = false }: { onClick?: () => void; isActive?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 
        rounded-xl transition-all duration-300
        ${isActive 
          ? 'text-white shadow-lg' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }
      `}
      style={isActive ? {
        background: 'linear-gradient(135deg, #00d4ff 0%, #00ff88 50%, #ff00ff 100%)',
        boxShadow: `
          0 0 15px rgba(0, 255, 136, 0.6),
          0 0 30px rgba(0, 212, 255, 0.4),
          0 0 45px rgba(255, 0, 255, 0.3)
        `,
      } : {}}
    >
      <Plane 
        className={`w-7 h-7 sm:w-8 sm:h-8 transform -rotate-45 ${isActive ? 'rotate-0' : ''} transition-transform`}
        style={isActive ? {
          filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))',
        } : {}}
      />
      <span 
        className="text-[10px] sm:text-xs font-bold tracking-wide"
        style={isActive ? {
          textShadow: '0 0 10px rgba(255,255,255,0.8)',
        } : {}}
      >
        Vacation 2
      </span>
      
      {/* Glow effect when active */}
      {isActive && (
        <>
          <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDuration: '1.5s' }} />
          <div className="absolute bottom-2 left-3 w-1 h-1 bg-cyan-300 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
        </>
      )}
    </button>
  );
}

export default VacationPlus2Button;
