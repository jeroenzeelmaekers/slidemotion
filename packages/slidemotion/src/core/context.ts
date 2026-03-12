import { createContext } from "react";
import type { ReactNode } from "react";
import type { PresentationState, PresentationAction, Direction, SlideTransition } from "./types.js";
import type { StepRegistry } from "./step-registry.js";

// ---------------------------------------------------------------------------
// Slide Transition Registry
// Tracks the transition type declared by each <Slide>.
// ---------------------------------------------------------------------------

export type SlideTransitionRegistry = {
  readonly register: (slideIndex: number, transition: SlideTransition) => void;
  readonly unregister: (slideIndex: number) => void;
  readonly get: (slideIndex: number) => SlideTransition;
};

export type SlideIndexCounter = {
  next(): number;
  readonly count: number;
};

export type SpeakerNotesRegistry = {
  readonly register: (slideIndex: number, notes: ReactNode) => void;
  readonly unregister: (slideIndex: number) => void;
  readonly get: (slideIndex: number) => ReactNode | null;
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
  readonly speakerNotesRegistry: SpeakerNotesRegistry;
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
  readonly transition: SlideTransition;
};

export const SlideContext = createContext<SlideContextValue | null>(null);
export const SlideRenderIndexContext = createContext<number | null>(null);

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
  readonly status: "hidden" | "entering" | "visible" | "exiting";
};

export const StepContext = createContext<StepContextValue | null>(null);
