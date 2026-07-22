"use client";

import { useEffect, useRef } from "react";

import { startAnimation, stopAnimation } from "./animation";
import type { AnimationState } from "./animation";
import { processImage } from "./imageProcessor";
import { disposeCanvas, renderPortrait } from "./renderer";
import type { DotPortraitProps, ImageProcessingResult } from "./types";

export default function DotPortrait({
  image,
  width = 500,
  height = 500,
  dotSpacing = 5,
  maxDotRadius = 3,
  minDotRadius = 0.15,
  contrast = 1,
  dotColor = "#000000",
  backgroundColor = "#ffffffc0",
  className,
  // Phase 2 physics props
  mouseInteraction = true,
  interactionRadius = 120,
  interactionStrength = 0.8,
  springStrength = 0.08,
  friction = 0.85,
}: DotPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultRef = useRef<ImageProcessingResult | null>(null);
  const animationRef = useRef<AnimationState | null>(null);

  // Logical mouse position in canvas coordinates (null = outside canvas)
  const mouseRef = useRef<{ x: number | null; y: number | null; active: boolean }>({
    x: null,
    y: null,
    active: false,
  });

  // ── Mouse tracking ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mouseInteraction) return;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Map from CSS pixels to logical canvas coordinates
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      mouseRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
        active: true,
      };
    };

    const onLeave = () => {
      mouseRef.current = { x: null, y: null, active: false };
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseInteraction, width, height]);

  // ── Image processing + animation loop ────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    // Stop any previous loop before starting a new one
    if (animationRef.current) {
      stopAnimation(animationRef.current);
      animationRef.current = null;
    }

    const processAndAnimate = async () => {
      try {
        const result = await processImage(image, {
          width,
          height,
          spacing: dotSpacing,
          maxRadius: maxDotRadius,
          minRadius: minDotRadius,
          contrast,
        });

        if (cancelled || canvasRef.current !== canvas) return;

        resultRef.current = result;

        if (mouseInteraction) {
          // Start physics-driven animation loop
          animationRef.current = startAnimation({
            canvas,
            dots: result.dots,
            physics: {
              springStrength,
              friction,
              interactionRadius,
              interactionStrength,
            },
            renderOptions: {
              width,
              height,
              dotColor,
              backgroundColor,
            },
            getMouse: () => mouseRef.current,
          });
        } else {
          // Static render — no animation needed
          renderPortrait(canvas, result, { width, height, dotColor, backgroundColor });
        }
      } catch (error) {
        if (!cancelled) {
          console.error("[DotPortrait] Failed to render portrait:", error);
        }
      }
    };

    void processAndAnimate();

    return () => {
      cancelled = true;
      if (animationRef.current) {
        stopAnimation(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [
    image,
    width,
    height,
    dotSpacing,
    maxDotRadius,
    minDotRadius,
    contrast,
    dotColor,
    backgroundColor,
    mouseInteraction,
    interactionRadius,
    interactionStrength,
    springStrength,
    friction,
  ]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;

    return () => {
      if (animationRef.current) {
        stopAnimation(animationRef.current);
        animationRef.current = null;
      }
      if (canvas) {
        disposeCanvas(canvas);
      }
      resultRef.current = null;
    };
  }, []);

  return (
    <div
      className={className}
      style={{ width, height, position: "relative", overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        aria-label="Interactive halftone dot portrait"
        style={{ display: "block", width: "100%", height: "100%", cursor: mouseInteraction ? "none" : "default" }}
      />
    </div>
  );
}
