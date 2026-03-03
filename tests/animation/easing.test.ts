import { describe, it, expect } from "vitest";
import {
  linear,
  quad,
  cubic,
  quart,
  quint,
  sin,
  exp,
  circle,
  back,
  elastic,
  bounce,
  bezier,
  ease,
  easeIn,
  easeOut,
  easeInOut,
  asOut,
  asInOut,
} from "../../src/animation/easing.js";

describe("easing", () => {
  // All easing functions must satisfy: f(0) = 0, f(1) = 1
  const allEasings: Array<[string, (t: number) => number]> = [
    ["linear", linear],
    ["quad", quad],
    ["cubic", cubic],
    ["quart", quart],
    ["quint", quint],
    ["sin", sin],
    ["exp", exp],
    ["circle", circle],
    ["back()", back()],
    ["elastic()", elastic()],
    ["bounce", bounce],
    ["ease", ease],
    ["easeIn", easeIn],
    ["easeOut", easeOut],
    ["easeInOut", easeInOut],
  ];

  for (const [name, fn] of allEasings) {
    it(`${name}: f(0) ≈ 0 and f(1) ≈ 1`, () => {
      expect(fn(0)).toBeCloseTo(0, 5);
      expect(fn(1)).toBeCloseTo(1, 5);
    });
  }

  it("linear returns t unchanged", () => {
    expect(linear(0.25)).toBe(0.25);
    expect(linear(0.5)).toBe(0.5);
    expect(linear(0.75)).toBe(0.75);
  });

  it("quad is t²", () => {
    expect(quad(0.5)).toBeCloseTo(0.25);
    expect(quad(0.25)).toBeCloseTo(0.0625);
  });

  it("cubic is t³", () => {
    expect(cubic(0.5)).toBeCloseTo(0.125);
  });

  it("back overshoots past 1 at some point", () => {
    // back easing goes slightly past 0 at the start
    const mid = back()(0.5);
    // At t=1 it should be 1, but at some midpoint it may be negative
    expect(back()(0.1)).toBeLessThan(0);
  });

  describe("bezier", () => {
    it("linear bezier (0,0,1,1) equals linear", () => {
      const linearBezier = bezier(0, 0, 1, 1);
      expect(linearBezier(0)).toBe(0);
      expect(linearBezier(0.5)).toBeCloseTo(0.5, 2);
      expect(linearBezier(1)).toBe(1);
    });

    it("produces values between 0 and 1 for standard curves", () => {
      const fn = bezier(0.25, 0.1, 0.25, 1);
      for (let t = 0; t <= 1; t += 0.1) {
        const v = fn(t);
        expect(v).toBeGreaterThanOrEqual(-0.01);
        expect(v).toBeLessThanOrEqual(1.01);
      }
    });
  });

  describe("modifiers", () => {
    it("asOut mirrors the easing", () => {
      const outQuad = asOut(quad);
      // asOut(quad)(t) = 1 - quad(1-t) = 1 - (1-t)²
      expect(outQuad(0)).toBeCloseTo(0);
      expect(outQuad(1)).toBeCloseTo(1);
      expect(outQuad(0.5)).toBeCloseTo(0.75);
    });

    it("asInOut combines in and out", () => {
      const inOutQuad = asInOut(quad);
      expect(inOutQuad(0)).toBeCloseTo(0);
      expect(inOutQuad(1)).toBeCloseTo(1);
      expect(inOutQuad(0.5)).toBeCloseTo(0.5);
      // First half should be slower, second half faster
      expect(inOutQuad(0.25)).toBeCloseTo(0.125);
    });
  });
});
