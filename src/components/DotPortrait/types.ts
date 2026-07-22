/** A single halftone dot derived from a grid cell. */
export interface DotData {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  radius: number;
  brightness: number;
  /** Current velocity — populated by the physics engine. */
  velocityX: number;
  velocityY: number;
}

/** Configuration passed to the image processor. */
export interface ImageProcessingConfig {
  width: number;
  height: number;
  spacing: number;
  maxRadius: number;
  minRadius?: number;
  contrast?: number;
}

/** Result returned after sampling and mapping an image to dots. */
export interface ImageProcessingResult {
  dots: DotData[];
  width: number;
  height: number;
}

/** Visual options passed to the canvas renderer. */
export interface RenderOptions {
  width: number;
  height: number;
  dotColor?: string;
  backgroundColor?: string;
}

export interface DotPortraitProps {
  /** Image URL or path served from /public. */
  image: string;
  /** Logical canvas width in CSS pixels. */
  width?: number;
  /** Logical canvas height in CSS pixels. */
  height?: number;
  /** Distance between dot cell centers in pixels. */
  dotSpacing?: number;
  /** Maximum dot radius for the darkest regions. */
  maxDotRadius?: number;
  /** Minimum dot radius; dots below this are skipped. */
  minDotRadius?: number;
  /** Contrast multiplier (1 = neutral, >1 increases contrast). */
  contrast?: number;
  dotColor?: string;
  backgroundColor?: string;
  className?: string;
  // ── Phase 2: interactive physics ────────────────────────────────────────
  /** Enable cursor-repulsion physics. Defaults to true. */
  mouseInteraction?: boolean;
  /** Pixel radius of cursor influence. Defaults to 120. */
  interactionRadius?: number;
  /** Repulsion force multiplier. Defaults to 0.8. */
  interactionStrength?: number;
  /** Spring constant pulling dots back to origin. Defaults to 0.08. */
  springStrength?: number;
  /** Velocity retention per frame (0–1). Defaults to 0.85. */
  friction?: number;
}
