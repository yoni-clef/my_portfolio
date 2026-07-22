export { default as DotPortrait } from "./DotPortrait";
export { processImage } from "./imageProcessor";
export { renderPortrait, setupCanvas } from "./renderer";
export { startAnimation, stopAnimation } from "./animation";
export { tickAllDots } from "./physics";
export type { AnimationState, AnimationConfig } from "./animation";
export type { PhysicsConfig } from "./physics";
export type {
  DotData,
  DotPortraitProps,
  ImageProcessingConfig,
  ImageProcessingResult,
  RenderOptions,
} from "./types";
