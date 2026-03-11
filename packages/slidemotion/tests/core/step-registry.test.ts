import { describe, expect, it } from "vitest";
import { createStepRegistry } from "../../src/core/step-registry.js";

describe("createStepRegistry", () => {
  it("returns 0 for unregistered slide", () => {
    const reg = createStepRegistry();
    expect(reg.getMaxStep(0)).toBe(0);
    expect(reg.getMaxStep(99)).toBe(0);
  });

  it("tracks max step per slide", () => {
    const reg = createStepRegistry();
    reg.register(0, "a", 1);
    reg.register(0, "b", 3);
    reg.register(0, "c", 2);
    expect(reg.getMaxStep(0)).toBe(3);
  });

  it("tracks step durations per slide order", () => {
    const reg = createStepRegistry();
    reg.register(0, "a", 1, 200);
    reg.register(0, "b", 1, 450);
    reg.register(0, "c", 2, 300);

    expect(reg.getStepDuration(0, 1)).toBe(450);
    expect(reg.getStepDuration(0, 2)).toBe(300);
    expect(reg.getStepDuration(0, 3)).toBeUndefined();
  });

  it("isolates slides", () => {
    const reg = createStepRegistry();
    reg.register(0, "a", 5);
    reg.register(1, "b", 2);
    expect(reg.getMaxStep(0)).toBe(5);
    expect(reg.getMaxStep(1)).toBe(2);
  });

  it("updates max when registration changes", () => {
    const reg = createStepRegistry();
    reg.register(0, "a", 3);
    expect(reg.getMaxStep(0)).toBe(3);

    // Same id, higher order
    reg.register(0, "a", 5);
    expect(reg.getMaxStep(0)).toBe(5);
  });

  it("returns 0 after all entries unregistered", () => {
    const reg = createStepRegistry();
    reg.register(0, "a", 2);
    reg.register(0, "b", 4);
    reg.unregister(0, "a");
    reg.unregister(0, "b");
    expect(reg.getMaxStep(0)).toBe(0);
  });

  it("recalculates max after unregister", () => {
    const reg = createStepRegistry();
    reg.register(0, "a", 1);
    reg.register(0, "b", 5);
    reg.register(0, "c", 3);
    reg.unregister(0, "b");
    expect(reg.getMaxStep(0)).toBe(3);
  });

  it("notifies listeners on register", () => {
    const reg = createStepRegistry();
    let count = 0;
    reg.subscribe(() => { count++; });
    reg.register(0, "a", 1);
    expect(count).toBe(1);
    reg.register(0, "b", 2);
    expect(count).toBe(2);
  });

  it("notifies listeners on unregister", () => {
    const reg = createStepRegistry();
    reg.register(0, "a", 1);
    let count = 0;
    reg.subscribe(() => { count++; });
    reg.unregister(0, "a");
    expect(count).toBe(1);
  });

  it("unsubscribe stops notifications", () => {
    const reg = createStepRegistry();
    let count = 0;
    const unsub = reg.subscribe(() => { count++; });
    reg.register(0, "a", 1);
    expect(count).toBe(1);
    unsub();
    reg.register(0, "b", 2);
    expect(count).toBe(1);
  });

  it("unregister is idempotent for unknown ids", () => {
    const reg = createStepRegistry();
    // Should not throw
    reg.unregister(0, "nonexistent");
    reg.unregister(99, "nonexistent");
    expect(reg.getMaxStep(0)).toBe(0);
  });
});
