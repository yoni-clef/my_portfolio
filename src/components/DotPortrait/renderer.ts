import type { DotData, ImageProcessingResult, RenderOptions } from "./types";

const MAX_DEVICE_PIXEL_RATIO = 3;

export function getDevicePixelRatio(): number {
  return Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
}

export function setupCanvas(
  canvas: HTMLCanvasElement,
  logicalWidth: number,
  logicalHeight: number
): CanvasRenderingContext2D {
  const dpr = getDevicePixelRatio();
  canvas.width = Math.max(1, Math.floor(logicalWidth * dpr));
  canvas.height = Math.max(1, Math.floor(logicalHeight * dpr));
  canvas.style.width = `${logicalWidth}px`;
  canvas.style.height = `${logicalHeight}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to acquire 2D context for rendering.");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  return ctx;
}

export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

/**
 * Layer 1 — base halftone portrait.
 *
 * Every dot is drawn at its originalRadius with the base dotColor.
 * This layer is ALWAYS rendered and never modified.
 */
function drawBaseDots(
  ctx: CanvasRenderingContext2D,
  dots: DotData[],
  dotColor: string
): void {
  ctx.fillStyle = dotColor;
  ctx.globalAlpha = 1;

  for (const dot of dots) {
    if (dot.originalRadius <= 0) continue;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.originalRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Layer 2 — glitch corruption overlay.
 *
 * Drawn on top of the base layer. Uses per-dot glitchOpacity and a radius
 * offset so it adds visual distortion without ever hiding the base dots.
 * When glitchOpacity is 0 nothing is drawn for that dot.
 */
function drawGlitchOverlay(ctx: CanvasRenderingContext2D, dots: DotData[]): void {
  // Group by colour to minimise fillStyle switches
  // Collect dots that actually need an overlay
  const byColor = new Map<string, DotData[]>();

  for (const dot of dots) {
    if (dot.glitchOpacity < 0.01) continue;
    let group = byColor.get(dot.glitchColor);
    if (!group) {
      group = [];
      byColor.set(dot.glitchColor, group);
    }
    group.push(dot);
  }

  for (const [color, group] of byColor) {
    ctx.fillStyle = color;
    for (const dot of group) {
      const r = Math.max(0.1, dot.originalRadius + dot.glitchRadiusDelta);
      ctx.globalAlpha = dot.glitchOpacity;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Restore default alpha
  ctx.globalAlpha = 1;
}

/**
 * Full frame render: background → base dots → glitch overlay.
 */
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  dots: DotData[],
  options: Required<Pick<RenderOptions, "dotColor" | "backgroundColor">> &
    Pick<RenderOptions, "width" | "height">
): void {
  const { width = 0, height = 0, backgroundColor, dotColor } = options;

  // Background
  if (width > 0 && height > 0) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  // Layer 1: always-visible base portrait
  drawBaseDots(ctx, dots, dotColor);

  // Layer 2: glitch overlay on top
  drawGlitchOverlay(ctx, dots);
}

/** Static render used when mouseInteraction is disabled. */
export function renderPortrait(
  canvas: HTMLCanvasElement,
  result: ImageProcessingResult,
  options: RenderOptions
): void {
  const ctx = setupCanvas(canvas, result.width, result.height);
  renderFrame(ctx, result.dots, {
    width: result.width,
    height: result.height,
    dotColor: options.dotColor ?? "#000000",
    backgroundColor: options.backgroundColor ?? "#ffffff",
  });
}

export function disposeCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  clearCanvas(ctx);
  canvas.width = 0;
  canvas.height = 0;
}
