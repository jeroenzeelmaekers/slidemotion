import type { SpringConfig } from "../core/types.js";

// ---------------------------------------------------------------------------
// Spring physics simulation
// Attempt-dampened harmonic oscillator, same model as React Native / Remotion.
// Pure function: given a progress value (0→1 representing time fraction),
// returns the spring-simulated position.
// ---------------------------------------------------------------------------

const DEFAULT_SPRING_CONFIG: SpringConfig = {
  stiffness: 100,
  damping: 10,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
};

/**
 * Simulates a spring animation.
 *
 * Unlike `interpolate`, spring doesn't use a simple easing curve.
 * It runs a physics simulation of a damped harmonic oscillator.
 *
 * @param elapsed - Time elapsed in milliseconds since animation start
 * @param config - Spring configuration (stiffness, damping, mass, etc.)
 * @param from - Start value (default 0)
 * @param to - End value (default 1)
 * @returns The current position of the spring
 *
 * @example
 * ```ts
 * // In a rAF loop:
 * const value = spring(elapsedMs, { stiffness: 200, damping: 20, mass: 1 });
 * element.style.transform = `scale(${value})`;
 * ```
 */
export function spring(
  elapsed: number,
  config?: Partial<SpringConfig>,
  from: number = 0,
  to: number = 1,
): { value: number; done: boolean } {
  const c: SpringConfig = { ...DEFAULT_SPRING_CONFIG, ...config };

  const { position, velocity } = simulateSpring(elapsed, c);

  const isComplete =
    Math.abs(position - 1) < c.restDisplacementThreshold &&
    Math.abs(velocity) < c.restSpeedThreshold;

  let value = position;
  if (c.overshootClamping) {
    value = Math.min(Math.max(value, 0), 1);
  }
  if (isComplete) {
    value = 1;
  }

  // Map from 0→1 to from→to
  const mapped = from + value * (to - from);

  return { value: mapped, done: isComplete };
}

/**
 * Computes the settled duration of a spring in milliseconds.
 * Useful for knowing when a spring animation will complete.
 */
export function springDuration(config?: Partial<SpringConfig>): number {
  const c: SpringConfig = { ...DEFAULT_SPRING_CONFIG, ...config };

  // Binary search for the time at which the spring settles
  let lo = 0;
  let hi = 10000; // 10 seconds max

  while (hi - lo > 1) {
    const mid = (lo + hi) / 2;
    const { position, velocity } = simulateSpring(mid, c);
    const settled =
      Math.abs(position - 1) < c.restDisplacementThreshold &&
      Math.abs(velocity) < c.restSpeedThreshold;
    if (settled) {
      hi = mid;
    } else {
      lo = mid;
    }
  }

  return hi;
}

// ---------------------------------------------------------------------------
// Internal: damped harmonic oscillator simulation
// Analytical solution for the second-order ODE:
//   m * x'' + d * x' + k * x = 0
// with initial conditions x(0) = -1, x'(0) = 0 (starting at rest, displaced)
// Target position is 1, so we solve for displacement from target.
// ---------------------------------------------------------------------------

function simulateSpring(
  elapsed: number,
  config: SpringConfig,
): { position: number; velocity: number } {
  const { stiffness: k, damping: d, mass: m } = config;

  // Convert to seconds for the physics simulation
  const t = elapsed / 1000;

  const omega0 = Math.sqrt(k / m); // natural frequency
  const zeta = d / (2 * Math.sqrt(k * m)); // damping ratio

  // Initial displacement from target (start at 0, target at 1 → displacement = -1)
  const x0 = -1;
  const v0 = 0;

  let position: number;
  let velocity: number;

  if (zeta < 1) {
    // Underdamped: oscillates
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    const expTerm = Math.exp(-zeta * omega0 * t);
    const A = x0;
    const B = (v0 + zeta * omega0 * x0) / omegaD;

    position = 1 + expTerm * (A * Math.cos(omegaD * t) + B * Math.sin(omegaD * t));
    velocity =
      expTerm *
      ((B * omegaD - A * zeta * omega0) * Math.cos(omegaD * t) -
        (A * omegaD + B * zeta * omega0) * Math.sin(omegaD * t));
  } else if (zeta === 1) {
    // Critically damped: fastest without oscillation
    const expTerm = Math.exp(-omega0 * t);
    position = 1 + expTerm * (x0 + (v0 + omega0 * x0) * t);
    velocity = expTerm * (v0 - (v0 + omega0 * x0) * omega0 * t + (v0 + omega0 * x0));
    // Simplified: velocity = expTerm * ((v0 + omega0 * x0) * (1 - omega0 * t) + v0)
    // Actually: d/dt[e^(-ω₀t)(x₀ + (v₀ + ω₀x₀)t)]
    velocity = expTerm * (v0 + omega0 * x0 - omega0 * (x0 + (v0 + omega0 * x0) * t));
  } else {
    // Overdamped: slow return without oscillation
    const s1 = -omega0 * (zeta - Math.sqrt(zeta * zeta - 1));
    const s2 = -omega0 * (zeta + Math.sqrt(zeta * zeta - 1));
    const A = (v0 - x0 * s2) / (s1 - s2);
    const B = x0 - A;

    position = 1 + A * Math.exp(s1 * t) + B * Math.exp(s2 * t);
    velocity = A * s1 * Math.exp(s1 * t) + B * s2 * Math.exp(s2 * t);
  }

  return { position, velocity };
}
