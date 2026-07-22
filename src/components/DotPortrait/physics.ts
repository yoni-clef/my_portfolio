import type { DotData } from "./types";
import { distance } from "./utils";

export interface PhysicsConfig {
    /** How strongly dots snap back to their origin (0–1 range, e.g. 0.08). */
    springStrength: number;
    /** Velocity damping per frame (0–1, e.g. 0.85 keeps 85 % of velocity). */
    friction: number;
    /** Pixel radius within which the cursor repels dots. */
    interactionRadius: number;
    /** Scalar multiplier for the repulsion force. */
    interactionStrength: number;
}

/**
 * Apply one physics tick to a single dot.
 *
 * Steps:
 *  1. Optional cursor repulsion
 *  2. Spring attraction back to origin
 *  3. Integrate velocity → position
 *  4. Apply friction
 */
export function tickDot(
    dot: DotData,
    config: PhysicsConfig,
    mouseX: number | null,
    mouseY: number | null,
    mouseActive: boolean
): void {
    // 1. Cursor repulsion
    if (mouseActive && mouseX !== null && mouseY !== null) {
        const dist = distance(dot.x, dot.y, mouseX, mouseY);

        if (dist < config.interactionRadius && dist > 0) {
            // Normalised direction away from cursor
            const nx = (dot.x - mouseX) / dist;
            const ny = (dot.y - mouseY) / dist;

            // Force falls off linearly with distance
            const falloff = 1 - dist / config.interactionRadius;
            const force = falloff * falloff * config.interactionStrength * 8;

            dot.velocityX += nx * force;
            dot.velocityY += ny * force;
        }
    }

    // 2. Spring force toward original position
    dot.velocityX += (dot.originalX - dot.x) * config.springStrength;
    dot.velocityY += (dot.originalY - dot.y) * config.springStrength;

    // 3. Integrate
    dot.x += dot.velocityX;
    dot.y += dot.velocityY;

    // 4. Friction / damping
    dot.velocityX *= config.friction;
    dot.velocityY *= config.friction;
}

/**
 * Tick every dot in the array in-place.
 */
export function tickAllDots(
    dots: DotData[],
    config: PhysicsConfig,
    mouseX: number | null,
    mouseY: number | null,
    mouseActive: boolean
): void {
    for (const dot of dots) {
        tickDot(dot, config, mouseX, mouseY, mouseActive);
    }
}
