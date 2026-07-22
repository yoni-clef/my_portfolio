import type { DotData, RenderOptions } from "./types";
import type { GlitchConfig } from "./mouseInteraction";
import { applyGlitch } from "./mouseInteraction";
import { clearCanvas, renderFrame, setupCanvas } from "./renderer";

export interface AnimationState {
    rafId: number | null;
}

export interface AnimationConfig {
    canvas: HTMLCanvasElement;
    dots: DotData[];
    glitch: GlitchConfig;
    /** Lerp speed toward glitch targets per frame (0–1). */
    transitionSpeed: number;
    renderOptions: Required<Pick<RenderOptions, "dotColor" | "backgroundColor">> &
    Pick<RenderOptions, "width" | "height">;
    getMouse: () => { x: number | null; y: number | null; active: boolean };
}

/**
 * Lerp the glitch overlay properties toward their targets.
 * Base properties (x, y, originalRadius) are never written.
 */
function tickDot(dot: DotData, transitionSpeed: number): void {
    dot.glitchOpacity += (dot.targetOpacity - dot.glitchOpacity) * transitionSpeed;
    dot.glitchRadiusDelta += (dot.targetRadiusDelta - dot.glitchRadiusDelta) * transitionSpeed;
}

export function startAnimation(config: AnimationConfig): AnimationState {
    const state: AnimationState = { rafId: null };

    const ctx = setupCanvas(
        config.canvas,
        config.renderOptions.width ?? 0,
        config.renderOptions.height ?? 0
    );

    const loop = () => {
        const { x, y, active } = config.getMouse();

        // 1. Compute new glitch targets based on cursor
        applyGlitch(config.dots, config.glitch, x, y, active);

        // 2. Lerp each dot toward its target
        for (const dot of config.dots) {
            tickDot(dot, config.transitionSpeed);
        }

        // 3. Render
        clearCanvas(ctx);
        renderFrame(ctx, config.dots, config.renderOptions);

        state.rafId = requestAnimationFrame(loop);
    };

    state.rafId = requestAnimationFrame(loop);
    return state;
}

export function stopAnimation(state: AnimationState): void {
    if (state.rafId !== null) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
    }
}
