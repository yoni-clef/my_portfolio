import type { DotData } from "./types";
import { distance } from "./utils";

export interface GlitchConfig {
    interactionRadius: number;
    /** Per-frame probability a dot inside radius gets a new glitch state (0–1). */
    interactionStrength: number;
    /** Scales all visual distortion amounts (0–1). */
    glitchIntensity: number;
    /** CSS colour for the glitch overlay dots. */
    glitchColor: string;
}

/**
 * Sets targetOpacity and targetRadiusDelta on every dot.
 *
 * Dots OUTSIDE the cursor radius have their targets reset to 0 (invisible overlay),
 * so the base portrait is fully unaffected.
 *
 * Dots INSIDE the cursor radius may receive a random glitch state:
 *   - targetOpacity  → 0.3–0.95 (overlay dot drawn on top at this opacity)
 *   - targetRadiusDelta → negative (shrink) or positive (enlarge)
 *   - glitchColor     → matrix green, bright white, or near-black
 *
 * The base dot is ALWAYS rendered underneath at its originalRadius and dotColor.
 * This overlay only adds on top — it never removes or hides the base layer.
 */
export function applyGlitch(
    dots: DotData[],
    config: GlitchConfig,
    mouseX: number | null,
    mouseY: number | null,
    mouseActive: boolean
): void {
    for (const dot of dots) {
        // No cursor → fade all overlays out
        if (!mouseActive || mouseX === null || mouseY === null) {
            dot.targetOpacity = 0;
            dot.targetRadiusDelta = 0;
            continue;
        }

        const dist = distance(dot.x, dot.y, mouseX, mouseY);

        // Outside radius → fade out
        if (dist >= config.interactionRadius) {
            dot.targetOpacity = 0;
            dot.targetRadiusDelta = 0;
            continue;
        }

        // Proximity: 1 at cursor, 0 at radius edge
        const proximity = 1 - dist / config.interactionRadius;

        // Stochastic flicker — only update a fraction of dots per frame
        if (Math.random() > config.interactionStrength * proximity) {
            // Keep current target (flicker by holding state)
            continue;
        }

        const intensity = config.glitchIntensity * proximity;

        // Choose a glitch flavour randomly
        const roll = Math.random();

        if (roll < 0.33) {
            // Brighten / matrix-green flash
            dot.targetOpacity = 0.3 + Math.random() * 0.55 * intensity;
            dot.glitchColor = config.glitchColor;
            dot.targetRadiusDelta = dot.originalRadius * (0.1 + Math.random() * 0.4) * intensity;
        } else if (roll < 0.66) {
            // White highlight — simulates a bright scan line
            dot.targetOpacity = 0.25 + Math.random() * 0.5 * intensity;
            dot.glitchColor = "#ffffff";
            dot.targetRadiusDelta = dot.originalRadius * (-0.1 - Math.random() * 0.3) * intensity;
        } else {
            // Near-black deepening — punch the dark areas darker
            dot.targetOpacity = 0.2 + Math.random() * 0.4 * intensity;
            dot.glitchColor = "#001a00";
            dot.targetRadiusDelta = dot.originalRadius * (0.05 + Math.random() * 0.2) * intensity;
        }
    }
}
