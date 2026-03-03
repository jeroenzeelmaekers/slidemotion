import type { ExtrapolationType, InterpolateOptions } from "../core/types.js";
import { linear } from "./easing.js";

// ---------------------------------------------------------------------------
// interpolate
// Maps a value from one range to another, with optional easing and
// extrapolation. Core animation primitive — identical concept to Remotion's
// interpolate() but independent implementation.
// ---------------------------------------------------------------------------

/**
 * Maps `value` from `inputRange` to `outputRange` with optional easing.
 *
 * @example
 * ```ts
 * // Map progress 0→1 to opacity 0→1
 * interpolate(0.5, [0, 1], [0, 1])  // 0.5
 *
 * // Map progress 0→1 to x position -100→0
 * interpolate(0.3, [0, 1], [-100, 0])  // -70
 *
 * // Multi-segment with easing
 * interpolate(frame, [0, 30, 60], [0, 1, 0], { easing: easeInOut })
 * ```
 */
export function interpolate(
  value: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
  options?: InterpolateOptions,
): number {
  if (inputRange.length < 2) {
    throw new Error("interpolate: inputRange must have at least 2 elements");
  }
  if (inputRange.length !== outputRange.length) {
    throw new Error("interpolate: inputRange and outputRange must have equal length");
  }
  for (let i = 1; i < inputRange.length; i++) {
    if ((inputRange[i] ?? 0) < (inputRange[i - 1] ?? 0)) {
      throw new Error("interpolate: inputRange must be monotonically non-decreasing");
    }
  }

  const easing = options?.easing ?? linear;
  const extrapolateLeft = options?.extrapolateLeft ?? "extend";
  const extrapolateRight = options?.extrapolateRight ?? "extend";

  // Find the segment the value falls in
  const segmentIndex = findSegment(value, inputRange);

  const inputMin = inputRange[segmentIndex] ?? 0;
  const inputMax = inputRange[segmentIndex + 1] ?? 1;
  const outputMin = outputRange[segmentIndex] ?? 0;
  const outputMax = outputRange[segmentIndex + 1] ?? 1;

  // Handle extrapolation for values outside the range
  if (value < (inputRange[0] ?? 0)) {
    return extrapolate(value, inputMin, inputMax, outputMin, outputMax, easing, extrapolateLeft);
  }
  if (value > (inputRange[inputRange.length - 1] ?? 1)) {
    return extrapolate(value, inputMin, inputMax, outputMin, outputMax, easing, extrapolateRight);
  }

  // Normalize value to 0→1 within segment
  const segmentRange = inputMax - inputMin;
  const t = segmentRange === 0 ? 0 : (value - inputMin) / segmentRange;

  // Apply easing
  const easedT = easing(t);

  // Map to output range
  return outputMin + easedT * (outputMax - outputMin);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function findSegment(value: number, inputRange: readonly number[]): number {
  for (let i = 1; i < inputRange.length - 1; i++) {
    if (value < (inputRange[i] ?? 0)) {
      return i - 1;
    }
  }
  return inputRange.length - 2;
}

function extrapolate(
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
  easing: (t: number) => number,
  type: ExtrapolationType,
): number {
  switch (type) {
    case "identity":
      return value;
    case "clamp":
      return value < inputMin ? outputMin : outputMax;
    case "extend": {
      const segmentRange = inputMax - inputMin;
      const t = segmentRange === 0 ? 0 : (value - inputMin) / segmentRange;
      const easedT = easing(t);
      return outputMin + easedT * (outputMax - outputMin);
    }
  }
}
