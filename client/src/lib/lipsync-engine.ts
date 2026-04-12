/**
 * LipSync Engine — Maps ElevenLabs visemes to mouth shapes for avatar animation
 */

import type { LipSyncFrame } from "./elie-voice";

// ── Types ────────────────────────────────────────────────────────────────────

export interface MouthShape {
  openness: number;   // 0-1 (0=closed, 1=open)
  roundness: number;  // 0-1 (O/U sounds)
  stretch: number;    // 0-1 (E/I sounds)
  lipShape: "neutral" | "smile" | "round" | "open" | "teeth";
}

const NEUTRAL: MouthShape = { openness: 0, roundness: 0, stretch: 0, lipShape: "neutral" };

// ── Viseme → MouthShape mapping ──────────────────────────────────────────────

const VISEME_SHAPES: Record<string, MouthShape> = {
  // Silence
  sil: { openness: 0, roundness: 0, stretch: 0, lipShape: "neutral" },

  // Open vowels
  AA: { openness: 0.8, roundness: 0.3, stretch: 0, lipShape: "open" },
  AE: { openness: 0.6, roundness: 0.1, stretch: 0.2, lipShape: "open" },
  AH: { openness: 0.7, roundness: 0.2, stretch: 0, lipShape: "open" },
  AO: { openness: 0.6, roundness: 0.7, stretch: 0, lipShape: "round" },
  AW: { openness: 0.5, roundness: 0.6, stretch: 0, lipShape: "round" },
  AY: { openness: 0.6, roundness: 0.1, stretch: 0.4, lipShape: "open" },

  // Bilabials (lips together)
  B: { openness: 0, roundness: 0, stretch: 0, lipShape: "neutral" },
  P: { openness: 0, roundness: 0, stretch: 0, lipShape: "neutral" },
  PP: { openness: 0, roundness: 0, stretch: 0, lipShape: "neutral" },
  M: { openness: 0, roundness: 0, stretch: 0, lipShape: "neutral" },

  // Fricatives
  CH: { openness: 0.2, roundness: 0.6, stretch: 0, lipShape: "round" },
  SH: { openness: 0.2, roundness: 0.6, stretch: 0, lipShape: "round" },
  SS: { openness: 0.15, roundness: 0.1, stretch: 0.5, lipShape: "teeth" },

  // Alveolars
  D: { openness: 0.3, roundness: 0, stretch: 0.1, lipShape: "teeth" },
  DD: { openness: 0.3, roundness: 0, stretch: 0.1, lipShape: "teeth" },
  T: { openness: 0.3, roundness: 0, stretch: 0.1, lipShape: "teeth" },
  N: { openness: 0.3, roundness: 0, stretch: 0, lipShape: "teeth" },
  nn: { openness: 0.3, roundness: 0, stretch: 0, lipShape: "teeth" },

  // E/I sounds (stretch/smile)
  EH: { openness: 0.5, roundness: 0.1, stretch: 0.6, lipShape: "smile" },
  EY: { openness: 0.4, roundness: 0.1, stretch: 0.7, lipShape: "smile" },
  EE: { openness: 0.35, roundness: 0, stretch: 0.8, lipShape: "smile" },
  IH: { openness: 0.4, roundness: 0, stretch: 0.8, lipShape: "smile" },
  IY: { openness: 0.35, roundness: 0, stretch: 0.9, lipShape: "smile" },

  // Labiodentals
  F: { openness: 0.2, roundness: 0.1, stretch: 0, lipShape: "teeth" },
  FF: { openness: 0.2, roundness: 0.1, stretch: 0, lipShape: "teeth" },
  V: { openness: 0.2, roundness: 0.1, stretch: 0, lipShape: "teeth" },

  // Rounded vowels
  OH: { openness: 0.5, roundness: 0.8, stretch: 0, lipShape: "round" },
  OW: { openness: 0.5, roundness: 0.9, stretch: 0, lipShape: "round" },
  OY: { openness: 0.5, roundness: 0.7, stretch: 0.2, lipShape: "round" },
  OU: { openness: 0.4, roundness: 0.9, stretch: 0, lipShape: "round" },
  UH: { openness: 0.3, roundness: 1.0, stretch: 0, lipShape: "round" },
  UW: { openness: 0.3, roundness: 1.0, stretch: 0, lipShape: "round" },

  // Dental
  TH: { openness: 0.25, roundness: 0, stretch: 0.2, lipShape: "teeth" },

  // Retroflex/liquid
  R: { openness: 0.25, roundness: 0.4, stretch: 0, lipShape: "round" },
  RR: { openness: 0.25, roundness: 0.4, stretch: 0, lipShape: "round" },
  L: { openness: 0.35, roundness: 0, stretch: 0.2, lipShape: "teeth" },

  // Velar
  G: { openness: 0.35, roundness: 0, stretch: 0, lipShape: "open" },
  K: { openness: 0.35, roundness: 0, stretch: 0, lipShape: "open" },
  kk: { openness: 0.35, roundness: 0, stretch: 0, lipShape: "open" },
  NG: { openness: 0.3, roundness: 0, stretch: 0, lipShape: "open" },

  // Glottal/aspirate
  HH: { openness: 0.4, roundness: 0.2, stretch: 0, lipShape: "open" },
  W: { openness: 0.2, roundness: 0.9, stretch: 0, lipShape: "round" },
  Y: { openness: 0.3, roundness: 0, stretch: 0.6, lipShape: "smile" },
  ZH: { openness: 0.2, roundness: 0.5, stretch: 0, lipShape: "round" },
  Z: { openness: 0.2, roundness: 0.1, stretch: 0.4, lipShape: "teeth" },
};

// ── LipSync Engine ───────────────────────────────────────────────────────────

export class LipSyncEngine {
  private frames: LipSyncFrame[] = [];
  private currentIndex = 0;
  private startTime = 0;
  private currentShape: MouthShape = { ...NEUTRAL };
  private targetShape: MouthShape = { ...NEUTRAL };
  private animFrameId: number | null = null;
  private onUpdate: ((shape: MouthShape) => void) | null = null;

  /** Start processing a new set of lipsync frames */
  processFrames(frames: LipSyncFrame[]): void {
    this.frames = [...this.frames, ...frames];

    if (!this.animFrameId) {
      this.startTime = performance.now();
      this.animate();
    }
  }

  /** Add a single frame (for streaming) */
  addFrame(frame: LipSyncFrame): void {
    this.frames.push(frame);

    // Update target immediately
    this.targetShape = this.getVisemeShape(frame.viseme);

    if (!this.animFrameId) {
      this.startTime = performance.now();
      this.animate();
    }
  }

  /** Get MouthShape for a given viseme */
  getVisemeShape(viseme: string): MouthShape {
    return VISEME_SHAPES[viseme] || NEUTRAL;
  }

  /** Get the current interpolated mouth shape */
  getCurrentShape(): MouthShape {
    return { ...this.currentShape };
  }

  /** Register update callback (called every animation frame) */
  onShapeUpdate(cb: (shape: MouthShape) => void): void {
    this.onUpdate = cb;
  }

  /** Stop animation and reset */
  reset(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.frames = [];
    this.currentIndex = 0;
    this.currentShape = { ...NEUTRAL };
    this.targetShape = { ...NEUTRAL };
    this.onUpdate?.(this.currentShape);
  }

  /** Smoothly close mouth (for idle state) */
  transitionToIdle(): void {
    this.targetShape = { ...NEUTRAL };
    // Let the animation loop handle the smooth transition
    if (!this.animFrameId) {
      this.animate();
    }
    // Auto-stop after mouth closes
    setTimeout(() => {
      if (this.targetShape.openness === 0) {
        this.reset();
      }
    }, 300);
  }

  // ── Private ──────────────────────────────────────────────────────────────

  private animate = (): void => {
    // Smooth interpolation toward target
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const speed = 0.25; // Smoothing factor (lower = smoother)

    this.currentShape = {
      openness: lerp(this.currentShape.openness, this.targetShape.openness, speed),
      roundness: lerp(this.currentShape.roundness, this.targetShape.roundness, speed),
      stretch: lerp(this.currentShape.stretch, this.targetShape.stretch, speed),
      lipShape: this.targetShape.lipShape,
    };

    this.onUpdate?.(this.currentShape);

    // Check if we should continue
    const isMoving =
      Math.abs(this.currentShape.openness - this.targetShape.openness) > 0.005 ||
      Math.abs(this.currentShape.roundness - this.targetShape.roundness) > 0.005 ||
      Math.abs(this.currentShape.stretch - this.targetShape.stretch) > 0.005 ||
      this.frames.length > this.currentIndex;

    if (isMoving) {
      this.animFrameId = requestAnimationFrame(this.animate);
    } else {
      this.animFrameId = null;
    }
  };
}

// ── Singleton ────────────────────────────────────────────────────────────────

let _engine: LipSyncEngine | null = null;

export function getLipSyncEngine(): LipSyncEngine {
  if (!_engine) {
    _engine = new LipSyncEngine();
  }
  return _engine;
}
