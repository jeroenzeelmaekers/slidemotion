import { createContext } from "react";
import type {
  PresentationConfig,
  PresentationState,
  PresentationAction,
  Direction,
  EventTriggerState,
  SlideTransition,
} from "./types.js";
import type { StepRegistry } from "./step-registry.js";

// ---------------------------------------------------------------------------
// Slide Transition Registry
// Tracks the transition type declared by each <Slide>.
// ---------------------------------------------------------------------------

export type SlideTransitionRegistry = {
  readonly register: (slideIndex: number, transition: SlideTransition) => void;
  readonly get: (slideIndex: number) => SlideTransition;
};

// ---------------------------------------------------------------------------
// Slide Index Counter
// Mutable counter reset each render by <Presenter>, read by <Slide> to
// determine render-order index. Works because React renders children
// synchronously top-down within a single render pass.
// ---------------------------------------------------------------------------

export type SlideIndexCounter = {
  /** Claim the next index. Called by <Slide> during render. */
  next(): number;
  /** How many indices have been claimed this render pass. */
  readonly count: number;
};

// ---------------------------------------------------------------------------
// Presentation Context
// Provides the global presentation state and dispatch to all descendants.
// ---------------------------------------------------------------------------

export type PresentationContextValue = {
  readonly state: PresentationState;
  readonly dispatch: (action: PresentationAction) => void;
  readonly stepRegistry: StepRegistry;
  readonly slideCount: number;
  readonly setSlideCount: (count: number) => void;
  readonly slideTransitionRegistry: SlideTransitionRegistry;
  readonly slideIndexCounter: SlideIndexCounter;
};

export const PresentationContext = createContext<PresentationContextValue | null>(null);

// ---------------------------------------------------------------------------
// Slide Context
// Provides slide-specific info to components within a slide.
// ---------------------------------------------------------------------------

export type SlideContextValue = {
  readonly id: string;
  readonly index: number;
  readonly isActive: boolean;
};

export const SlideContext = createContext<SlideContextValue | null>(null);

// ---------------------------------------------------------------------------
// Step Context
// Provides step-specific info to components within a <Step>.
// ---------------------------------------------------------------------------

export type StepContextValue = {
  readonly order: number;
  readonly isActive: boolean;
  readonly isVisible: boolean;
  readonly progress: number;
  readonly direction: Direction;
};

export const StepContext = createContext<StepContextValue | null>(null);
