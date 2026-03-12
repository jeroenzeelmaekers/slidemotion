import type { EasingFunction } from "../core/types.js";

// ---------------------------------------------------------------------------
// Standard easing functions
// Ported from React Native / Remotion, following CSS easing spec conventions.
// Each function maps t ∈ [0,1] → [0,1].
// ---------------------------------------------------------------------------

export const linear: EasingFunction = (t) => t;

export const quad: EasingFunction = (t) => t * t;

export const cubic: EasingFunction = (t) => t * t * t;

export const quart: EasingFunction = (t) => t * t * t * t;

export const quint: EasingFunction = (t) => t * t * t * t * t;

export const sin: EasingFunction = (t) => 1 - Math.cos((t * Math.PI) / 2);

export const exp: EasingFunction = (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1)));

export const circle: EasingFunction = (t) => 1 - Math.sqrt(1 - t * t);

/**
 * Back easing — overshoots slightly then settles.
 * `s` controls overshoot magnitude (default 1.70158 ≈ 10% overshoot).
 */
export const back =
  (s: number = 1.70158): EasingFunction =>
  (t) =>
    t * t * ((s + 1) * t - s);

/**
 * Elastic easing — spring-like bounce.
 * `bounciness` controls amplitude (default 1).
 */
export const elastic = (bounciness: number = 1): EasingFunction => {
  const p = bounciness * Math.PI;
  return (t) =>
    t === 0 || t === 1 ? t : 1 - Math.pow(Math.cos((t * Math.PI) / 2), 3) * Math.cos(t * p);
};

/** Bounce easing — simulates a bouncing ball. */
export const bounce: EasingFunction = (t) => {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  }
  if (t < 2 / 2.75) {
    const t2 = t - 1.5 / 2.75;
    return 7.5625 * t2 * t2 + 0.75;
  }
  if (t < 2.5 / 2.75) {
    const t2 = t - 2.25 / 2.75;
    return 7.5625 * t2 * t2 + 0.9375;
  }
  const t2 = t - 2.625 / 2.75;
  return 7.5625 * t2 * t2 + 0.984375;
};

// ---------------------------------------------------------------------------
// Cubic bezier (CSS transition equivalent)
// ---------------------------------------------------------------------------

/**
 * Creates a cubic-bezier easing function, equivalent to CSS `cubic-bezier()`.
 * Uses Newton-Raphson iteration for solving the bezier curve.
 */
export const bezier = (x1: number, y1: number, x2: number, y2: number): EasingFunction => {
  // Pre-computed polynomial coefficients for the bezier curve
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveCurveX = (x: number): number => {
    // Newton-Raphson iteration (fast convergence for typical values)
    let t = x;
    for (let i = 0; i < 8; i++) {
      const currentX = sampleCurveX(t) - x;
      if (Math.abs(currentX) < 1e-7) return t;
      const derivative = sampleCurveDerivativeX(t);
      if (Math.abs(derivative) < 1e-7) break;
      t -= currentX / derivative;
    }

    // Fallback: bisection
    let lo = 0;
    let hi = 1;
    t = x;
    while (lo < hi) {
      const midX = sampleCurveX(t);
      if (Math.abs(midX - x) < 1e-7) return t;
      if (x > midX) {
        lo = t;
      } else {
        hi = t;
      }
      t = (hi - lo) / 2 + lo;
    }
    return t;
  };

  return (t) => {
    if (t === 0 || t === 1) return t;
    return sampleCurveY(solveCurveX(t));
  };
};

// ---------------------------------------------------------------------------
// CSS named easings
// ---------------------------------------------------------------------------

/** CSS `ease` — equivalent to cubic-bezier(0.25, 0.1, 0.25, 1) */
export const ease: EasingFunction = bezier(0.25, 0.1, 0.25, 1);

/** CSS `ease-in` — equivalent to cubic-bezier(0.42, 0, 1, 1) */
export const easeIn: EasingFunction = bezier(0.42, 0, 1, 1);

/** CSS `ease-out` — equivalent to cubic-bezier(0, 0, 0.58, 1) */
export const easeOut: EasingFunction = bezier(0, 0, 0.58, 1);

/** CSS `ease-in-out` — equivalent to cubic-bezier(0.42, 0, 0.58, 1) */
export const easeInOut: EasingFunction = bezier(0.42, 0, 0.58, 1);

// ---------------------------------------------------------------------------
// Modifiers: transform any easing into in/out/inOut variants
// ---------------------------------------------------------------------------

/** Applies easing only to the first half (ease-in). Identity if already in. */
export const asIn = (easing: EasingFunction): EasingFunction => easing;

/** Mirrors an ease-in function to create ease-out. */
export const asOut =
  (easing: EasingFunction): EasingFunction =>
  (t) =>
    1 - easing(1 - t);

/** Combines ease-in and ease-out into ease-in-out. */
export const asInOut =
  (easing: EasingFunction): EasingFunction =>
  (t) =>
    t < 0.5 ? easing(t * 2) / 2 : 1 - easing((1 - t) * 2) / 2;
