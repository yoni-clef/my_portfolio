import type {
  DotData,
  ImageProcessingConfig,
  ImageProcessingResult,
} from "./types";

const DEFAULT_CONTRAST = 1;
const DEFAULT_MIN_RADIUS = 0.15;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    if (!src.startsWith("data:")) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function applyContrast(brightness: number, contrast: number): number {
  if (contrast === 1) return brightness;
  const n = brightness / 255;
  return Math.max(0, Math.min(255, ((n - 0.5) * contrast + 0.5) * 255));
}

function getCellAverageBrightness(
  pixels: Uint8ClampedArray,
  imageWidth: number,
  imageHeight: number,
  cellX: number,
  cellY: number,
  cellSize: number
): number {
  const endX = Math.min(cellX + cellSize, imageWidth);
  const endY = Math.min(cellY + cellSize, imageHeight);
  let sum = 0, count = 0;
  for (let y = cellY; y < endY; y++) {
    for (let x = cellX; x < endX; x++) {
      const i = (y * imageWidth + x) * 4;
      sum += getLuminance(pixels[i], pixels[i + 1], pixels[i + 2]);
      count++;
    }
  }
  return count > 0 ? sum / count : 255;
}

function brightnessToRadius(brightness: number, maxRadius: number): number {
  return (1 - brightness / 255) * maxRadius;
}

function createDot(cx: number, cy: number, radius: number, brightness: number): DotData {
  return {
    x: cx,
    y: cy,
    originalRadius: radius,
    originalBrightness: brightness,
    glitchRadiusDelta: 0,
    targetRadiusDelta: 0,
    glitchOpacity: 0,
    targetOpacity: 0,
    glitchColor: "#00ff41",
  };
}

export async function processImage(
  src: string,
  config: ImageProcessingConfig
): Promise<ImageProcessingResult> {
  const image = await loadImage(src);
  const contrast = config.contrast ?? DEFAULT_CONTRAST;
  const minRadius = config.minRadius ?? DEFAULT_MIN_RADIUS;

  const offscreen = document.createElement("canvas");
  offscreen.width = config.width;
  offscreen.height = config.height;

  const ctx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Unable to acquire 2D context for image processing.");

  ctx.drawImage(image, 0, 0, config.width, config.height);
  const { data: pixels } = ctx.getImageData(0, 0, config.width, config.height);

  const dots: DotData[] = [];
  const { spacing, maxRadius, width, height } = config;

  for (let cellY = 0; cellY < height; cellY += spacing) {
    for (let cellX = 0; cellX < width; cellX += spacing) {
      const raw = getCellAverageBrightness(pixels, width, height, cellX, cellY, spacing);
      const brightness = applyContrast(raw, contrast);
      const radius = brightnessToRadius(brightness, maxRadius);
      if (radius >= minRadius) {
        dots.push(createDot(cellX + spacing / 2, cellY + spacing / 2, radius, brightness));
      }
    }
  }

  return { dots, width, height };
}
