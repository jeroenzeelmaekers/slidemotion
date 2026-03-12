import { describe, expect, it } from "vitest";
import {
  atSteps,
  countCompletedStepOrders,
  rangeStepOrders,
  resolveStepOrders,
  resolveStepAliases,
  stepOrders,
} from "../../src/code/step-orders.js";

describe("atSteps", () => {
  it("returns explicit sparse orders", () => {
    expect(atSteps(1, 3, 5)).toEqual([1, 3, 5]);
  });

  it("throws for non-increasing orders", () => {
    expect(() => atSteps(1, 1)).toThrow("atSteps(...orders) must be strictly increasing");
  });
});

describe("stepOrders", () => {
  it("returns explicit sparse orders", () => {
    expect(stepOrders(1, 3, 5)).toEqual([1, 3, 5]);
  });

  it("throws for non-increasing orders", () => {
    expect(() => stepOrders(1, 1)).toThrow("stepOrders(...orders) must be strictly increasing");
  });
});

describe("rangeStepOrders", () => {
  it("builds consecutive orders", () => {
    expect(rangeStepOrders(2, 3)).toEqual([2, 3, 4]);
  });

  it("throws for invalid count", () => {
    expect(() => rangeStepOrders(2, -1)).toThrow(
      "rangeStepOrders(start, count) count must be a non-negative integer",
    );
  });
});

describe("resolveStepAliases", () => {
  it("prefers atSteps when present", () => {
    expect(resolveStepAliases([1, 3], undefined, "Code")).toEqual([1, 3]);
  });

  it("accepts matching aliases", () => {
    expect(resolveStepAliases([1, 3], [1, 3], "Code")).toEqual([1, 3]);
  });

  it("throws when aliases conflict", () => {
    expect(() => resolveStepAliases([1], [2], "Code")).toThrow(
      "<Code> atSteps and stepOrders must match when both are provided",
    );
  });
});

describe("resolveStepOrders", () => {
  it("builds sequential orders from stepOffset", () => {
    expect(resolveStepOrders(3, 2, undefined, "Code")).toEqual([2, 3, 4]);
  });

  it("accepts explicit step orders", () => {
    expect(resolveStepOrders(2, undefined, [1, 3], "Code")).toEqual([1, 3]);
  });

  it("returns empty array when count is zero", () => {
    expect(resolveStepOrders(0, 1, undefined, "Code")).toEqual([]);
  });

  it("throws when explicit step orders length mismatches", () => {
    expect(() => resolveStepOrders(2, undefined, [1], "Code")).toThrow(
      "<Code> stepOrders must have exactly 2 entries",
    );
  });

  it("throws when explicit step orders are not strictly increasing", () => {
    expect(() => resolveStepOrders(2, undefined, [2, 2], "Code")).toThrow(
      "<Code> stepOrders must be strictly increasing",
    );
  });
});

describe("countCompletedStepOrders", () => {
  it("counts completed sparse step orders", () => {
    expect(countCompletedStepOrders(0, [2, 4, 6])).toBe(0);
    expect(countCompletedStepOrders(2, [2, 4, 6])).toBe(1);
    expect(countCompletedStepOrders(5, [2, 4, 6])).toBe(2);
    expect(countCompletedStepOrders(6, [2, 4, 6])).toBe(3);
  });
});
