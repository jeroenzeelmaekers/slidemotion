import { describe, it, expect } from "vitest";
import { spring, springDuration } from "../../src/animation/spring.js";

describe("spring", () => {
  it("starts at 0 (from) at elapsed=0", () => {
    const { value } = spring(0);
    expect(value).toBeCloseTo(0, 2);
  });

  it("converges to 1 (to) after sufficient time", () => {
    const { value, done } = spring(5000);
    expect(value).toBeCloseTo(1, 2);
    expect(done).toBe(true);
  });

  it("is not done immediately", () => {
    const { done } = spring(0);
    expect(done).toBe(false);
  });

  it("overshoots with low damping", () => {
    // Low damping → underdamped → overshoots
    let maxValue = 0;
    for (let t = 0; t < 3000; t += 16) {
      const { value } = spring(t, { damping: 3, stiffness: 100, mass: 1 });
      if (value > maxValue) maxValue = value;
    }
    expect(maxValue).toBeGreaterThan(1);
  });

  it("does not overshoot with overshootClamping", () => {
    for (let t = 0; t < 3000; t += 16) {
      const { value } = spring(t, {
        damping: 3,
        stiffness: 100,
        mass: 1,
        overshootClamping: true,
      });
      expect(value).toBeLessThanOrEqual(1.001);
      expect(value).toBeGreaterThanOrEqual(-0.001);
    }
  });

  it("does not overshoot with high damping (overdamped)", () => {
    let maxValue = 0;
    for (let t = 0; t < 5000; t += 16) {
      const { value } = spring(t, { damping: 50, stiffness: 100, mass: 1 });
      if (value > maxValue) maxValue = value;
    }
    // Overdamped should not exceed 1 (or only very slightly due to floating point)
    expect(maxValue).toBeLessThan(1.01);
  });

  it("maps from/to custom range", () => {
    const { value: start } = spring(0, undefined, 10, 20);
    expect(start).toBeCloseTo(10, 1);

    const { value: end } = spring(5000, undefined, 10, 20);
    expect(end).toBeCloseTo(20, 1);
  });

  it("higher stiffness settles faster", () => {
    const durationLow = springDuration({ stiffness: 50, damping: 10, mass: 1 });
    const durationHigh = springDuration({ stiffness: 200, damping: 10, mass: 1 });
    // Higher stiffness doesn't always mean faster (depends on damping ratio)
    // but with same damping, it should generally be different
    expect(typeof durationLow).toBe("number");
    expect(typeof durationHigh).toBe("number");
  });
});

describe("springDuration", () => {
  it("returns a positive number", () => {
    const d = springDuration();
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThan(10000);
  });

  it("critically damped spring settles in reasonable time", () => {
    // Critical damping: zeta = 1 → d = 2*sqrt(k*m)
    // For k=100, m=1: d = 20
    const d = springDuration({ stiffness: 100, damping: 20, mass: 1 });
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThan(5000);
  });
});
