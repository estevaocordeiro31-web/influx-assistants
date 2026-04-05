import { useEffect, useState } from "react";
import { CHARACTER_IMAGES, CHARACTER_COLORS, CHARACTER_INFO } from "@/data/stpatricks/chunks";
import type { Character } from "@/data/stpatricks/chunks";

interface CharacterBubbleProps {
  character: Character;
  message: string;
  animate?: boolean;
  size?: "sm" | "md" | "lg";
}

export function CharacterBubble({ character, message, animate = true, size = "md" }: CharacterBubbleProps) {
  const [displayed, setDisplayed] = useState(animate ? "" : message);
  const color = CHARACTER_COLORS[character];
  const info = CHARACTER_INFO[character];
  const img = CHARACTER_IMAGES[character];

  useEffect(() => {
    if (!animate) {
      setDisplayed(message);
      return;
    }
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(message.slice(0, i));
      if (i >= message.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [message, animate]);

  const imgSize = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-14 h-14" : "w-11 h-11";
  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-base" : "text-sm";

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <img
          src={img}
          alt={info.name}
          className={`${imgSize} rounded-full object-cover border-2 shadow-md`}
          style={{ borderColor: color }}
        />
        <span className="text-xs font-bold" style={{ color }}>{info.name}</span>
        <span className="text-xs text-gray-400">{info.flag}</span>
      </div>
      <div
        className={`flex-1 rounded-2xl rounded-tl-none p-3 shadow-md ${textSize} text-white leading-relaxed`}
        style={{ background: `linear-gradient(135deg, ${color}33, ${color}55)`, border: `1px solid ${color}66` }}
      >
        {displayed}
        {animate && displayed.length < message.length && (
          <span className="inline-block w-0.5 h-4 ml-0.5 bg-white animate-pulse" />
        )}
      </div>
    </div>
  );
}
