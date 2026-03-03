import { describe, expect, it } from "vitest";
import {
  createInitialState,
  presentationReducer,
  resolveSlideTransitionDuration,
} from "../../src/core/engine.js";
import { createStepRegistry } from "../../src/core/step-registry.js";
import type { PresentationConfig, PresentationState, SlideTransition } from "../../src/core/types.js";

const defaultConfig: PresentationConfig = {
  width: 1920,
  height: 1080,
  defaultStepDuration: 300,
};

describe("createInitialState", () => {
  it("starts at slide 0, step 0, idle", () => {
    const state = createInitialState(defaultConfig);
    expect(state.currentSlide).toBe(0);
    expect(state.currentStep).toBe(0);
    expect(state.stepProgress).toBe(1);
    expect(state.direction).toBe("forward");
    expect(state.animationStatus).toBe("idle");
    expect(state.previousSlide).toBeNull();
    expect(state.slideTransitionProgress).toBe(1);
  });
});

describe("resolveSlideTransitionDuration", () => {
  it("returns 0 for 'none'", () => {
    expect(resolveSlideTransitionDuration("none")).toBe(0);
  });

  it("returns 300 for 'fade'", () => {
    expect(resolveSlideTransitionDuration("fade")).toBe(300);
  });

  it("returns custom duration for fade object", () => {
    expect(resolveSlideTransitionDuration({ type: "fade", duration: 500 })).toBe(500);
  });

  it("returns default 300 for fade object without duration", () => {
    expect(resolveSlideTransitionDuration({ type: "fade" })).toBe(300);
  });

  it("returns custom duration for push", () => {
    expect(resolveSlideTransitionDuration({ type: "push", direction: "left", duration: 400 })).toBe(400);
  });
});

describe("next action", () => {
  it("advances step within slide", () => {
    const reg = createStepRegistry();
    reg.register(0, "a", 1);
    reg.register(0, "b", 2);
    const state = createInitialState(defaultConfig);

    const next = presentationReducer(state, { type: "next" }, reg, 3);
    expect(next.currentSlide).toBe(0);
    expect(next.currentStep).toBe(1);
    expect(next.stepProgress).toBe(0);
    expect(next.animationStatus).toBe("running");
    expect(next.direction).toBe("forward");
  });

  it("advances to next slide when at max step (no transition)", () => {
    const reg = createStepRegistry();
    reg.register(0, "a", 1);
    let state = createInitialState(defaultConfig);
    state = presentationReducer(state, { type: "next" }, reg, 3); // step 0 → 1
    state = { ...state, stepProgress: 1, animationStatus: "idle" }; // simulate complete
    state = presentationReducer(state, { type: "next" }, reg, 3); // slide 0 → 1

    expect(state.currentSlide).toBe(1);
    expect(state.currentStep).toBe(0);
    expect(state.animationStatus).toBe("idle");
    expect(state.previousSlide).toBeNull();
  });

  it("advances to next slide with fade transition", () => {
    const reg = createStepRegistry();
    // No steps on slide 0 → immediate slide advance
    const state = createInitialState(defaultConfig);
    const getTransition = (i: number): SlideTransition => i === 1 ? "fade" : "none";

    const next = presentationReducer(state, { type: "next" }, reg, 3, getTransition);
    expect(next.currentSlide).toBe(1);
    expect(next.previousSlide).toBe(0);
    expect(next.slideTransitionProgress).toBe(0);
    expect(next.animationStatus).toBe("running");
  });

  it("no-ops at last slide last step", () => {
    const reg = createStepRegistry();
    let state: PresentationState = {
      ...createInitialState(defaultConfig),
      currentSlide: 2,
      currentStep: 0,
    };

    const next = presentationReducer(state, { type: "next" }, reg, 3);
    expect(next).toBe(state);
  });

  it("ignores when animation is running", () => {
    const reg = createStepRegistry();
    reg.register(0, "a", 1);
    const state: PresentationState = {
      ...createInitialState(defaultConfig),
      animationStatus: "running",
    };

    const next = presentationReducer(state, { type: "next" }, reg, 3);
    expect(next).toBe(state);
  });
});

describe("prev action", () => {
  it("goes back one step", () => {
    const reg = createStepRegistry();
    reg.register(0, "a", 1);
    reg.register(0, "b", 2);
    const state: PresentationState = {
      ...createInitialState(defaultConfig),
      currentStep: 2,
    };

    const prev = presentationReducer(state, { type: "prev" }, reg, 3);
    expect(prev.currentStep).toBe(1);
    expect(prev.direction).toBe("backward");
  });

  it("goes to previous slide at last step", () => {
    const reg = createStepRegistry();
    reg.register(0, "a", 1);
    reg.register(0, "b", 3);
    const state: PresentationState = {
      ...createInitialState(defaultConfig),
      currentSlide: 1,
      currentStep: 0,
    };

    const prev = presentationReducer(state, { type: "prev" }, reg, 3);
    expect(prev.currentSlide).toBe(0);
    expect(prev.currentStep).toBe(3);
    expect(prev.direction).toBe("backward");
  });

  it("goes to previous slide with transition when current slide has one", () => {
    const reg = createStepRegistry();
    const state: PresentationState = {
      ...createInitialState(defaultConfig),
      currentSlide: 1,
      currentStep: 0,
    };
    // Slide 1 has a fade transition
    const getTransition = (i: number): SlideTransition => i === 1 ? "fade" : "none";

    const prev = presentationReducer(state, { type: "prev" }, reg, 3, getTransition);
    expect(prev.currentSlide).toBe(0);
    expect(prev.previousSlide).toBe(1);
    expect(prev.slideTransitionProgress).toBe(0);
    expect(prev.animationStatus).toBe("running");
  });

  it("no-ops at first slide first step", () => {
    const reg = createStepRegistry();
    const state = createInitialState(defaultConfig);

    const prev = presentationReducer(state, { type: "prev" }, reg, 3);
    expect(prev).toBe(state);
  });
});

describe("goTo action", () => {
  it("jumps to specific slide and step", () => {
    const reg = createStepRegistry();
    reg.register(2, "a", 5);
    const state = createInitialState(defaultConfig);

    const next = presentationReducer(state, { type: "goTo", slide: 2, step: 3 }, reg, 3);
    expect(next.currentSlide).toBe(2);
    expect(next.currentStep).toBe(3);
    expect(next.animationStatus).toBe("idle");
    expect(next.previousSlide).toBeNull();
    expect(next.slideTransitionProgress).toBe(1);
  });

  it("clamps slide to valid range", () => {
    const reg = createStepRegistry();
    const state = createInitialState(defaultConfig);

    const next = presentationReducer(state, { type: "goTo", slide: 100 }, reg, 3);
    expect(next.currentSlide).toBe(2); // clamped to max
  });

  it("clamps step to slide max", () => {
    const reg = createStepRegistry();
    reg.register(1, "a", 2);
    const state = createInitialState(defaultConfig);

    const next = presentationReducer(state, { type: "goTo", slide: 1, step: 99 }, reg, 3);
    expect(next.currentStep).toBe(2);
  });

  it("defaults step to 0 when omitted", () => {
    const reg = createStepRegistry();
    const state = createInitialState(defaultConfig);

    const next = presentationReducer(state, { type: "goTo", slide: 1 }, reg, 3);
    expect(next.currentStep).toBe(0);
  });

  it("sets direction based on target slide", () => {
    const reg = createStepRegistry();
    const state: PresentationState = {
      ...createInitialState(defaultConfig),
      currentSlide: 2,
    };

    const back = presentationReducer(state, { type: "goTo", slide: 0 }, reg, 3);
    expect(back.direction).toBe("backward");

    const fwd = presentationReducer(state, { type: "goTo", slide: 2 }, reg, 3);
    expect(fwd.direction).toBe("forward");
  });
});

describe("animation progress actions", () => {
  it("updateStepProgress updates stepProgress", () => {
    const reg = createStepRegistry();
    const state = createInitialState(defaultConfig);

    const next = presentationReducer(state, { type: "updateStepProgress", progress: 0.5 }, reg, 1);
    expect(next.stepProgress).toBe(0.5);
  });

  it("completeAnimation resets to idle", () => {
    const reg = createStepRegistry();
    const state: PresentationState = {
      ...createInitialState(defaultConfig),
      animationStatus: "running",
      stepProgress: 0.8,
    };

    const next = presentationReducer(state, { type: "completeAnimation" }, reg, 1);
    expect(next.animationStatus).toBe("idle");
    expect(next.stepProgress).toBe(1);
  });
});

describe("slide transition actions", () => {
  it("updateSlideTransition updates progress", () => {
    const reg = createStepRegistry();
    const state: PresentationState = {
      ...createInitialState(defaultConfig),
      previousSlide: 0,
      slideTransitionProgress: 0,
      animationStatus: "running",
    };

    const next = presentationReducer(state, { type: "updateSlideTransition", progress: 0.6 }, reg, 3);
    expect(next.slideTransitionProgress).toBe(0.6);
  });

  it("completeSlideTransition clears previousSlide and resets to idle", () => {
    const reg = createStepRegistry();
    const state: PresentationState = {
      ...createInitialState(defaultConfig),
      previousSlide: 0,
      slideTransitionProgress: 0.9,
      animationStatus: "running",
    };

    const next = presentationReducer(state, { type: "completeSlideTransition" }, reg, 3);
    expect(next.previousSlide).toBeNull();
    expect(next.slideTransitionProgress).toBe(1);
    expect(next.animationStatus).toBe("idle");
  });
});

describe("event actions", () => {
  it("activateEvent creates event with active=true", () => {
    const reg = createStepRegistry();
    const state = createInitialState(defaultConfig);

    const next = presentationReducer(state, { type: "activateEvent", name: "highlight" }, reg, 1);
    expect(next.events.get("highlight")).toEqual({ active: true, progress: 0 });
  });

  it("deactivateEvent sets active=false preserving progress", () => {
    const reg = createStepRegistry();
    let state: PresentationState = {
      ...createInitialState(defaultConfig),
      events: new Map([["highlight", { active: true, progress: 0.7 }]]),
    };

    const next = presentationReducer(state, { type: "deactivateEvent", name: "highlight" }, reg, 1);
    expect(next.events.get("highlight")).toEqual({ active: false, progress: 0.7 });
  });

  it("toggleEvent flips active state", () => {
    const reg = createStepRegistry();
    const state = createInitialState(defaultConfig);

    const on = presentationReducer(state, { type: "toggleEvent", name: "x" }, reg, 1);
    expect(on.events.get("x")?.active).toBe(true);

    const off = presentationReducer(on, { type: "toggleEvent", name: "x" }, reg, 1);
    expect(off.events.get("x")?.active).toBe(false);
  });

  it("updateEventProgress updates progress for existing event", () => {
    const reg = createStepRegistry();
    const state: PresentationState = {
      ...createInitialState(defaultConfig),
      events: new Map([["x", { active: true, progress: 0 }]]),
    };

    const next = presentationReducer(state, { type: "updateEventProgress", name: "x", progress: 0.5 }, reg, 1);
    expect(next.events.get("x")).toEqual({ active: true, progress: 0.5 });
  });

  it("updateEventProgress no-ops for non-existent event", () => {
    const reg = createStepRegistry();
    const state = createInitialState(defaultConfig);

    const next = presentationReducer(state, { type: "updateEventProgress", name: "missing", progress: 0.5 }, reg, 1);
    expect(next.events.has("missing")).toBe(false);
  });
});
