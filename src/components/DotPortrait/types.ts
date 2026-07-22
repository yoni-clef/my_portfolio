/** A single halftone dot derived from a grid cell. */
export interface DotData {
  // ── Immutable position & base appearance ──────────────────────────────────
  x: number;
  y: number;
  /** Base radius baked from the source image — never written after creation. */
  originalRadius: number;
  /** Base brightness baked from the source image — never written after creation. */
  originalBrightness: number;

  // ── Glitch overlay state (lerped each frame) ──────────────────────────────
  /**
   * Extra radius added on top of originalRadius for the glitch overlay dot.
   * Positive = slightly larger, negative = slightly smaller.
   * Range: roughly -originalRadius*0.4 to +originalRadius*0.6
   */
  glitchRadiusDelta: number;
  /** Target for glitchRadiusDelta — set by mouseInteraction each frame. */
  targetRadiusDelta: number;
  /**
   * Opacity of the glitch overlay dot (0 = invisible, 1 = fully opaque).
   * When 0 only the base dot is visible.
   */
  glitchOpacity: number;
  /** Target for glitchOpacity — set by mouseInteraction each frame. */
  targetOpacity: number;
  /**
   * Colour of the glitch overlay dot as a CSS string.
   * Typically a bright or inverted variant of the dot colour.
   */
  glitchColor: string;
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
  /** Accent colour used for the glitch overlay. Defaults to "#00ff41" (matrix green). */
  glitchColor?: string;
}

export interface DotPortraitProps {
  /** Image URL or path served from /public. */
  image: string;
  width?: number;
  height?: number;
  dotSpacing?: number;
  maxDotRadius?: number;
  minDotRadius?: number;
  contrast?: number;
  dotColor?: string;
  backgroundColor?: string;
  /** Accent colour for the glitch overlay. Defaults to "#00ff41". */
  glitchColor?: string;
  className?: string;
  // ── Phase 2: matrix glitch interaction ───────────────────────────────────
  /** Enable matrix glitch mouse effect. Defaults to true. */
  mouseInteraction?: boolean;
  /** Pixel radius of cursor influence. Defaults to 120. */
  interactionRadius?: number;
  /** Probability (0–1) a dot inside the radius gets a new glitch state per frame. Defaults to 0.18. */
  interactionStrength?: number;
  /** How extreme the visual distortion is (0–1). Defaults to 0.85. */
  glitchIntensity?: number;
  /** Lerp factor toward resting state per frame (0–1). Defaults to 0.1. */
  transitionSpeed?: number;
}
