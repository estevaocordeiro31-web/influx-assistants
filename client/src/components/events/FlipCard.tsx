import { useState } from "react";
import { CHARACTER_IMAGES, CHARACTER_COLORS, CHARACTER_INFO } from "@/data/stpatricks/chunks";
import type { StPatricksChunk } from "@/data/stpatricks/chunks";

interface FlipCardProps {
  chunk: StPatricksChunk;
  onFlipped?: () => void;
}

export function FlipCard({ chunk, onFlipped }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const color = CHARACTER_COLORS[chunk.who];
  const info = CHARACTER_INFO[chunk.who];
  const img = CHARACTER_IMAGES[chunk.who];

  const handleFlip = () => {
    setFlipped(f => !f);
    if (!flipped && onFlipped) onFlipped();
  };

  return (
    <div
      className="relative w-full cursor-pointer select-none"
      style={{ perspective: "1000px", minHeight: "280px" }}
      onClick={handleFlip}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          minHeight: "280px",
        }}
      >
        {/* FRENTE — EN */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 shadow-xl"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
            border: `2px solid ${color}66`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <img src={img} alt={info.name} className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: color }} />
            <span className="text-sm font-semibold" style={{ color }}>{info.name} {info.flag}</span>
          </div>
          <div className="text-3xl font-bold text-center mb-2" style={{ color }}>
            "{chunk.chunk}"
          </div>
          <p className="text-sm text-center text-gray-500 mt-2">Toque para ver a tradução</p>
          <div className="absolute bottom-4 right-4 text-xs text-gray-400">{chunk.flag}</div>
        </div>

        {/* VERSO — PT */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col p-6 shadow-xl overflow-y-auto"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`,
            border: `2px solid ${color}88`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <img src={img} alt={info.name} className="w-8 h-8 rounded-full object-cover border-2" style={{ borderColor: color }} />
            <span className="text-xs font-semibold" style={{ color }}>{info.name} • {info.accent}</span>
          </div>

          <div className="text-xl font-bold mb-1" style={{ color }}>"{chunk.chunk}"</div>
          <div className="text-base font-semibold text-white mb-2">= {chunk.equivalencia}</div>

          <p className="text-xs text-gray-300 mb-3">{chunk.contexto}</p>

          <div className="rounded-xl p-3 mb-2" style={{ background: `${color}22` }}>
            <p className="text-xs font-mono text-white whitespace-pre-line">{chunk.exemplo.en}</p>
            <p className="text-xs text-gray-400 mt-1 whitespace-pre-line">{chunk.exemplo.pt}</p>
          </div>

          {chunk.nota && (
            <p className="text-xs text-yellow-400 mt-1">{chunk.nota}</p>
          )}
        </div>
      </div>
    </div>
  );
}
