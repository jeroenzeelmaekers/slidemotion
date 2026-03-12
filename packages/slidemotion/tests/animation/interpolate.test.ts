import { describe, it, expect } from "vitest";
import { interpolate } from "../../src/animation/interpolate.js";
import { quad } from "../../src/animation/easing.js";

describe("interpolate", () => {
  it("maps value linearly between two ranges", () => {
    expect(interpolate(0, [0, 1], [0, 100])).toBe(0);
    expect(interpolate(0.5, [0, 1], [0, 100])).toBe(50);
    expect(interpolate(1, [0, 1], [0, 100])).toBe(100);
  });

  it("maps negative output ranges", () => {
    expect(interpolate(0, [0, 1], [-100, 0])).toBe(-100);
    expect(interpolate(0.5, [0, 1], [-100, 0])).toBe(-50);
    expect(interpolate(1, [0, 1], [-100, 0])).toBe(0);
  });

  it("handles multi-segment ranges", () => {
    // 0→30 maps to 0→1, 30→60 maps to 1→0
    expect(interpolate(0, [0, 30, 60], [0, 1, 0])).toBe(0);
    expect(interpolate(15, [0, 30, 60], [0, 1, 0])).toBe(0.5);
    expect(interpolate(30, [0, 30, 60], [0, 1, 0])).toBe(1);
    expect(interpolate(45, [0, 30, 60], [0, 1, 0])).toBe(0.5);
    expect(interpolate(60, [0, 30, 60], [0, 1, 0])).toBe(0);
  });

  it("applies easing function", () => {
    // quad easing: t² → at 0.5, should be 0.25
    const result = interpolate(0.5, [0, 1], [0, 1], { easing: quad });
    expect(result).toBeCloseTo(0.25);
  });

  describe("extrapolation", () => {
    it("extends by default", () => {
      // Value 2 is outside [0,1] → extends linearly
      expect(interpolate(2, [0, 1], [0, 100])).toBe(200);
      expect(interpolate(-1, [0, 1], [0, 100])).toBe(-100);
    });

    it("clamps when extrapolateRight is 'clamp'", () => {
      const result = interpolate(2, [0, 1], [0, 100], {
        extrapolateRight: "clamp",
      });
      expect(result).toBe(100);
    });

    it("clamps when extrapolateLeft is 'clamp'", () => {
      const result = interpolate(-1, [0, 1], [0, 100], {
        extrapolateLeft: "clamp",
      });
      expect(result).toBe(0);
    });

    it("returns identity when extrapolateLeft is 'identity'", () => {
      const result = interpolate(-5, [0, 1], [0, 100], {
        extrapolateLeft: "identity",
      });
      expect(result).toBe(-5);
    });

    it("returns identity when extrapolateRight is 'identity'", () => {
      const result = interpolate(5, [0, 1], [0, 100], {
        extrapolateRight: "identity",
      });
      expect(result).toBe(5);
    });
  });

  describe("edge cases", () => {
    it("throws on inputRange with fewer than 2 elements", () => {
      expect(() => interpolate(0, [0], [0])).toThrow();
    });

    it("throws on mismatched range lengths", () => {
      expect(() => interpolate(0, [0, 1], [0])).toThrow();
    });

    it("throws on non-monotonic inputRange", () => {
      expect(() => interpolate(0, [0, 1, 0.5], [0, 1, 0])).toThrow();
    });

    it("handles zero-width segment", () => {
      // inputRange has [0, 0, 1] — first segment has zero width
      const result = interpolate(0, [0, 0, 1], [0, 50, 100]);
      expect(result).toBe(50);
    });
  });
});
