import type {
  DotData,
  ImageProcessingConfig,
  ImageProcessingResult,
} from "./types";

const DEFAULT_CONTRAST = 1;
const DEFAULT_MIN_RADIUS = 0.15;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";

    if (!src.startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function applyContrast(brightness: number, contrast: number): number {
  if (contrast === 1) {
    return brightness;
  }

  const normalized = brightness / 255;
  const adjusted = (normalized - 0.5) * contrast + 0.5;
  return Math.max(0, Math.min(255, adjusted * 255));
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

  let sum = 0;
  let count = 0;

  for (let y = cellY; y < endY; y += 1) {
    for (let x = cellX; x < endX; x += 1) {
      const index = (y * imageWidth + x) * 4;
      sum += getLuminance(
        pixels[index],
        pixels[index + 1],
        pixels[index + 2]
      );
      count += 1;
    }
  }

  return count > 0 ? sum / count : 255;
}

function brightnessToRadius(
  brightness: number,
  maxRadius: number
): number {
  const darkness = 1 - brightness / 255;
  return darkness * maxRadius;
}

function createDot(
  centerX: number,
  centerY: number,
  radius: number,
  brightness: number
): DotData {
  return {
    x: centerX,
    y: centerY,
    originalX: centerX,
    originalY: centerY,
    radius,
    brightness,
    velocityX: 0,
    velocityY: 0,
  };
}

export async function processImage(
  src: string,
  config: ImageProcessingConfig
): Promise<ImageProcessingResult> {
  const image = await loadImage(src);
  const contrast = config.contrast ?? DEFAULT_CONTRAST;
  const minRadius = config.minRadius ?? DEFAULT_MIN_RADIUS;

  const canvas = document.createElement("canvas");
  canvas.width = config.width;
  canvas.height = config.height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Unable to acquire 2D context for image processing.");
  }

  ctx.drawImage(image, 0, 0, config.width, config.height);

  const { data: pixels } = ctx.getImageData(
    0,
    0,
    config.width,
    config.height
  );

  const dots: DotData[] = [];
  const { spacing, maxRadius, width, height } = config;

  for (let cellY = 0; cellY < height; cellY += spacing) {
    for (let cellX = 0; cellX < width; cellX += spacing) {
      const rawBrightness = getCellAverageBrightness(
        pixels,
        width,
        height,
        cellX,
        cellY,
        spacing
      );

      const brightness = applyContrast(rawBrightness, contrast);
      const radius = brightnessToRadius(brightness, maxRadius);

      if (radius >= minRadius) {
        dots.push(
          createDot(
            cellX + spacing / 2,
            cellY + spacing / 2,
            radius,
            brightness
          )
        );
      }
    }
  }

  return {
    dots,
    width,
    height,
  };
}
