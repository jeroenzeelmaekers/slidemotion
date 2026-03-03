import type { AnimationMode, SpringConfig } from "../core/types.js";
import { spring } from "./spring.js";
import { linear } from "./easing.js";

// ---------------------------------------------------------------------------
// AnimationLoop
// Drives a progress value from 0→1 using requestAnimationFrame.
// Supports both tween (duration + easing) and spring (physics) modes.
// ---------------------------------------------------------------------------

export type AnimationLoopCallbacks = {
  readonly onProgress: (progress: number) => void;
  readonly onComplete: () => void;
};

/**
 * Creates an animation loop that drives a progress value from 0→1.
 *
 * Returns a controller with `start()` and `stop()` methods.
 * Only one animation runs at a time — calling `start()` cancels any previous.
 */
export function createAnimationLoop(callbacks: AnimationLoopCallbacks) {
  let rafId: number | null = null;
  let startTime: number | null = null;

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    startTime = null;
  }

  function start(mode: AnimationMode) {
    stop();

    const tick = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;

      if (mode.type === "tween") {
        const rawProgress = mode.duration <= 0 ? 1 : Math.min(elapsed / mode.duration, 1);
        const easing = mode.easing ?? linear;
        const progress = easing(rawProgress);

        callbacks.onProgress(progress);

        if (rawProgress >= 1) {
          callbacks.onComplete();
          startTime = null;
          rafId = null;
          return;
        }
      } else {
        // Spring mode
        const result = spring(elapsed, mode.config);
        callbacks.onProgress(result.value);

        if (result.done) {
          callbacks.onProgress(result.value);
          callbacks.onComplete();
          startTime = null;
          rafId = null;
          return;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
  }

  function startReverse(mode: AnimationMode) {
    stop();

    const tick = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;

      if (mode.type === "tween") {
        const rawProgress = mode.duration <= 0 ? 0 : Math.max(1 - elapsed / mode.duration, 0);
        const easing = mode.easing ?? linear;
        // For reverse, we invert the easing
        const progress = 1 - easing(1 - rawProgress);

        callbacks.onProgress(progress);

        if (rawProgress <= 0) {
          callbacks.onComplete();
          startTime = null;
          rafId = null;
          return;
        }
      } else {
        // Spring mode in reverse: spring from 1→0
        const result = spring(elapsed, mode.config, 1, 0);
        callbacks.onProgress(result.value);

        if (result.done) {
          callbacks.onProgress(result.value);
          callbacks.onComplete();
          startTime = null;
          rafId = null;
          return;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
  }

  return { start, startReverse, stop } as const;
}

// ---------------------------------------------------------------------------
// Convenience: create an AnimationMode from common inputs
// ---------------------------------------------------------------------------

export function tweenMode(duration: number, easing = linear): AnimationMode {
  return { type: "tween", duration, easing };
}

export function springMode(config?: Partial<SpringConfig>): AnimationMode {
  const full: SpringConfig = {
    stiffness: config?.stiffness ?? 100,
    damping: config?.damping ?? 10,
    mass: config?.mass ?? 1,
    overshootClamping: config?.overshootClamping ?? false,
    restDisplacementThreshold: config?.restDisplacementThreshold ?? 0.001,
    restSpeedThreshold: config?.restSpeedThreshold ?? 0.001,
  };
  return { type: "spring", config: full };
}
