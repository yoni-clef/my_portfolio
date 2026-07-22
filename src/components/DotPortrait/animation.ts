import type { DotData, RenderOptions } from "./types";
import type { PhysicsConfig } from "./physics";
import { tickAllDots } from "./physics";
import { clearCanvas, renderDots, setupCanvas } from "./renderer";

export interface AnimationState {
    rafId: number | null;
}

export interface AnimationConfig {
    canvas: HTMLCanvasElement;
    dots: DotData[];
    physics: PhysicsConfig;
    renderOptions: Required<Pick<RenderOptions, "dotColor" | "backgroundColor">> &
    Pick<RenderOptions, "width" | "height">;
    /** Returns the current logical mouse position, or null when outside. */
    getMouse: () => { x: number | null; y: number | null; active: boolean };
}

/**
 * Start the requestAnimationFrame loop.
 * Returns an AnimationState whose `rafId` can be cancelled via stopAnimation().
 */
export function startAnimation(config: AnimationConfig): AnimationState {
    const state: AnimationState = { rafId: null };

    const ctx = setupCanvas(
        config.canvas,
        config.renderOptions.width ?? 0,
        config.renderOptions.height ?? 0
    );

    const loop = () => {
        const { x, y, active } = config.getMouse();

        tickAllDots(config.dots, config.physics, x, y, active);

        clearCanvas(ctx);
        renderDots(ctx, config.dots, config.renderOptions);

        state.rafId = requestAnimationFrame(loop);
    };

    state.rafId = requestAnimationFrame(loop);
    return state;
}

/**
 * Cancel the running animation loop.
 */
export function stopAnimation(state: AnimationState): void {
    if (state.rafId !== null) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
    }
}
