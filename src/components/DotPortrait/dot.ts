import type { DotData } from "./types";

/** Reserved for later interaction/physics phases. */
export class Dot implements DotData {
  x: number;
  y: number;

  originalX: number;
  originalY: number;

  radius: number;

  brightness: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    brightness: number
  ) {
    this.x = x;
    this.y = y;

    this.originalX = x;
    this.originalY = y;

    this.radius = radius;

    this.brightness = brightness;
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      this.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = color;

    ctx.fill();
  }
}