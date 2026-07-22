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
  if (!ctx) {
    throw new Error("Unable to acquire 2D context for rendering.");
  }

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

export function renderDots(
  ctx: CanvasRenderingContext2D,
  dots: DotData[],
  options: Required<Pick<RenderOptions, "dotColor" | "backgroundColor">> &
    Pick<RenderOptions, "width" | "height">
): void {
  const { width = 0, height = 0, backgroundColor, dotColor } = options;

  if (width > 0 && height > 0) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.fillStyle = dotColor;

  for (const dot of dots) {
    if (dot.radius <= 0) {
      continue;
    }

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function renderPortrait(
  canvas: HTMLCanvasElement,
  result: ImageProcessingResult,
  options: RenderOptions
): void {
  const ctx = setupCanvas(canvas, result.width, result.height);

  renderDots(ctx, result.dots, {
    width: result.width,
    height: result.height,
    dotColor: options.dotColor ?? "#ffffff",
    backgroundColor: options.backgroundColor ?? "#000000",
  });
}

export function disposeCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  clearCanvas(ctx);
  canvas.width = 0;
  canvas.height = 0;
}
