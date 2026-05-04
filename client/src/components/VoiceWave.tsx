/**
 * VoiceWave — Real-time audio visualizer
 *
 * Purple-teal for Elie speaking, gold for student, idle pulse in grey.
 * Uses Web Audio API AnalyserNode + Canvas 2D.
 */

import { useEffect, useRef, useState } from "react";

type WaveMode = "idle" | "elie" | "student";

interface VoiceWaveProps {
  mode: WaveMode;
  audioStream?: MediaStream | null;
  height?: number;
  className?: string;
}

const COLORS = {
  idle: { start: "rgba(148,163,184,0.15)", end: "rgba(148,163,184,0.05)" },
  elie: { start: "rgba(107,63,160,0.7)", end: "rgba(46,139,122,0.5)" },
  student: { start: "rgba(234,179,8,0.7)", end: "rgba(249,115,22,0.5)" },
};

export default function VoiceWave({
  mode,
  audioStream,
  height = 48,
  className = "",
}: VoiceWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Simulated amplitude for idle and when no stream
  const [idlePhase, setIdlePhase] = useState(0);

  useEffect(() => {
    if (mode === "idle" || !audioStream) {
      // Idle animation loop
      let phase = 0;
      const draw = () => {
        phase += 0.02;
        setIdlePhase(phase);
        drawIdleWave(phase);
        animRef.current = requestAnimationFrame(draw);
      };
      animRef.current = requestAnimationFrame(draw);

      return () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
      };
    }

    // Active mode — connect to audio stream
    try {
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(audioStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        analyser.getByteFrequencyData(dataArray);
        drawActiveWave(dataArray, bufferLength);
        animRef.current = requestAnimationFrame(draw);
      };

      animRef.current = requestAnimationFrame(draw);
    } catch {
      // Fallback to idle
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (audioCtxRef.current?.state !== "closed") {
        audioCtxRef.current?.close().catch(() => {});
      }
    };
  }, [mode, audioStream]);

  // ── Draw functions ─────────────────────────────────────────────────────

  function drawIdleWave(phase: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const colors = COLORS.idle;

    ctx.clearRect(0, 0, w, h);

    const bars = 32;
    const barWidth = w / bars;
    const gap = 2;

    for (let i = 0; i < bars; i++) {
      const x = i * barWidth;
      const amp = 0.1 + 0.1 * Math.sin(phase + i * 0.3);
      const barHeight = h * amp;

      const gradient = ctx.createLinearGradient(0, h - barHeight, 0, h);
      gradient.addColorStop(0, colors.start);
      gradient.addColorStop(1, colors.end);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x + gap / 2, h - barHeight, barWidth - gap, barHeight, 2);
      ctx.fill();
    }
  }

  function drawActiveWave(dataArray: Uint8Array, bufferLength: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const colors = COLORS[mode] || COLORS.idle;

    ctx.clearRect(0, 0, w, h);

    const bars = Math.min(bufferLength, 32);
    const barWidth = w / bars;
    const gap = 2;

    for (let i = 0; i < bars; i++) {
      const dataIndex = Math.floor((i / bars) * bufferLength);
      const value = dataArray[dataIndex] / 255;
      const barHeight = Math.max(3, value * h * 0.9);

      const x = i * barWidth;

      const gradient = ctx.createLinearGradient(0, h - barHeight, 0, h);
      gradient.addColorStop(0, colors.start);
      gradient.addColorStop(1, colors.end);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x + gap / 2, h - barHeight, barWidth - gap, barHeight, 2);
      ctx.fill();
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={height}
      className={`w-full ${className}`}
      style={{
        height,
        imageRendering: "crisp-edges",
      }}
    />
  );
}
