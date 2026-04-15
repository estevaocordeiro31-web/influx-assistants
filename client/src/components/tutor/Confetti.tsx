/**
 * Confetti — CSS-only confetti burst for child mode celebrations
 * No external libs. Renders colored particles with fall animation.
 * Automatically cleans up after animation completes.
 */
import { useEffect, useState } from "react";

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
}

const COLORS = [
  "#1a6fdb", "#4da8ff", "#6abf4b", "#8fd675",
  "#f59e0b", "#f97316", "#8b5cf6", "#ec4899",
  "#10b981", "#ef4444",
];

const SHAPES = ["circle", "square", "triangle"] as const;

interface Particle {
  id: number;
  x: number;
  color: string;
  shape: typeof SHAPES[number];
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  drift: number;
}

export function Confetti({ active, duration = 3000, particleCount = 40 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }

    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.8,
      duration: 1.5 + Math.random() * 1.5,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 60,
    }));

    setParticles(newParticles);
    setVisible(true);

    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [active, duration, particleCount]);

  if (!visible || particles.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.shape === "triangle" ? 0 : p.size,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "2px" : 0,
            background: p.shape === "triangle" ? "transparent" : p.color,
            borderLeft: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
            borderRight: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
            borderBottom: p.shape === "triangle" ? `${p.size}px solid ${p.color}` : undefined,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default Confetti;
