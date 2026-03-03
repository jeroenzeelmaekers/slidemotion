import type {
  PresentationState,
  PresentationAction,
  PresentationConfig,
  SlideTransition,
} from "./types.js";
import type { StepRegistry } from "./step-registry.js";

// ---------------------------------------------------------------------------
// Engine
// Pure reducer for the presentation state machine.
// All state transitions are handled here — the React layer just dispatches.
// ---------------------------------------------------------------------------

/** Resolve the duration of a slide transition. Returns 0 for "none". */
export function resolveSlideTransitionDuration(transition: SlideTransition): number {
  if (transition === "none") return 0;
  if (transition === "fade") return 300;
  if (typeof transition === "object") return transition.duration ?? 300;
  return 0;
}

export function createInitialState(config: PresentationConfig): PresentationState {
  return {
    currentSlide: 0,
    currentStep: 0,
    stepProgress: 1, // Start at 1 — step 0 is "initial state", fully visible
    direction: "forward",
    events: new Map(),
    config,
    animationStatus: "idle",
    previousSlide: null,
    slideTransitionProgress: 1,
  };
}

/**
 * Pure reducer for presentation state.
 * The `stepRegistry` is injected for step count lookups — it's external
 * mutable state but only read here, never mutated.
 * `getSlideTransition` resolves the transition type for a given slide index.
 */
export function presentationReducer(
  state: PresentationState,
  action: PresentationAction,
  stepRegistry: StepRegistry,
  slideCount: number,
  getSlideTransition: (slideIndex: number) => SlideTransition = () => "none",
): PresentationState {
  switch (action.type) {
    case "next": {
      // If animation is running, ignore
      if (state.animationStatus === "running") return state;

      const maxStep = stepRegistry.getMaxStep(state.currentSlide);

      if (state.currentStep < maxStep) {
        // Advance to next step within slide
        return {
          ...state,
          currentStep: state.currentStep + 1,
          stepProgress: 0,
          direction: "forward",
          animationStatus: "running",
        };
      }

      // Advance to next slide
      if (state.currentSlide < slideCount - 1) {
        const nextSlide = state.currentSlide + 1;
        const transition = getSlideTransition(nextSlide);
        const hasTransition = resolveSlideTransitionDuration(transition) > 0;

        return {
          ...state,
          currentSlide: nextSlide,
          currentStep: 0,
          stepProgress: 1,
          direction: "forward",
          animationStatus: hasTransition ? "running" : "idle",
          previousSlide: hasTransition ? state.currentSlide : null,
          slideTransitionProgress: hasTransition ? 0 : 1,
        };
      }

      // Already at last slide, last step — no-op
      return state;
    }

    case "prev": {
      if (state.animationStatus === "running") return state;

      if (state.currentStep > 0) {
        // Go back one step
        return {
          ...state,
          currentStep: state.currentStep - 1,
          stepProgress: 1,
          direction: "backward",
          animationStatus: "idle",
        };
      }

      // Go to previous slide, at its last step
      if (state.currentSlide > 0) {
        const prevSlide = state.currentSlide - 1;
        const prevMaxStep = stepRegistry.getMaxStep(prevSlide);
        // Use the *current* slide's transition for the reverse direction
        const transition = getSlideTransition(state.currentSlide);
        const hasTransition = resolveSlideTransitionDuration(transition) > 0;

        return {
          ...state,
          currentSlide: prevSlide,
          currentStep: prevMaxStep,
          stepProgress: 1,
          direction: "backward",
          animationStatus: hasTransition ? "running" : "idle",
          previousSlide: hasTransition ? state.currentSlide : null,
          slideTransitionProgress: hasTransition ? 0 : 1,
        };
      }

      return state;
    }

    case "goTo": {
      const slide = Math.max(0, Math.min(action.slide, slideCount - 1));
      const maxStep = stepRegistry.getMaxStep(slide);
      const step = action.step !== undefined
        ? Math.max(0, Math.min(action.step, maxStep))
        : 0;

      return {
        ...state,
        currentSlide: slide,
        currentStep: step,
        stepProgress: 1,
        direction: slide >= state.currentSlide ? "forward" : "backward",
        animationStatus: "idle",
        previousSlide: null,
        slideTransitionProgress: 1,
      };
    }

    case "updateStepProgress": {
      return {
        ...state,
        stepProgress: action.progress,
      };
    }

    case "completeAnimation": {
      return {
        ...state,
        stepProgress: 1,
        animationStatus: "idle",
      };
    }

    case "activateEvent": {
      const events = new Map(state.events);
      events.set(action.name, { active: true, progress: 0 });
      return { ...state, events };
    }

    case "deactivateEvent": {
      const events = new Map(state.events);
      const current = events.get(action.name);
      if (current) {
        events.set(action.name, { active: false, progress: current.progress });
      }
      return { ...state, events };
    }

    case "toggleEvent": {
      const events = new Map(state.events);
      const current = events.get(action.name);
      const active = current ? !current.active : true;
      events.set(action.name, { active, progress: current?.progress ?? 0 });
      return { ...state, events };
    }

    case "updateEventProgress": {
      const events = new Map(state.events);
      const current = events.get(action.name);
      if (current) {
        events.set(action.name, { ...current, progress: action.progress });
      }
      return { ...state, events };
    }

    case "registerSlideSteps": {
      // This is handled outside the reducer (step registry is external)
      // but we include it for completeness / future use
      return state;
    }

    case "updateSlideTransition": {
      return {
        ...state,
        slideTransitionProgress: action.progress,
      };
    }

    case "completeSlideTransition": {
      return {
        ...state,
        previousSlide: null,
        slideTransitionProgress: 1,
        animationStatus: "idle",
      };
    }
  }
}
