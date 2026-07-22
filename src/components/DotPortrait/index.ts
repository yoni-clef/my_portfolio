export { default as DotPortrait } from "./DotPortrait";
export { processImage } from "./imageProcessor";
export { renderPortrait, renderFrame, setupCanvas } from "./renderer";
export { startAnimation, stopAnimation } from "./animation";
export { applyGlitch } from "./mouseInteraction";
export type { AnimationState, AnimationConfig } from "./animation";
export type { GlitchConfig } from "./mouseInteraction";
export type {
  DotData,
  DotPortraitProps,
  ImageProcessingConfig,
  ImageProcessingResult,
  RenderOptions,
} from "./types";
