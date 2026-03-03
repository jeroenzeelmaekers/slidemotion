// ---------------------------------------------------------------------------
// Presentation
// ---------------------------------------------------------------------------

/** Configuration for a presentation deck. */
export type PresentationConfig = {
  readonly width: number;
  readonly height: number;
  /** Default animation duration in ms for step transitions. */
  readonly defaultStepDuration: number;
};

// ---------------------------------------------------------------------------
// Slides
// ---------------------------------------------------------------------------

/** Slide-level transition type: instant cut, or an animated transition. */
export type SlideTransition =
  | "none"
  | "fade"
  | { readonly type: "fade"; readonly duration?: number }
  | { readonly type: "push"; readonly direction: SlideTransitionDirection; readonly duration?: number };

export type SlideTransitionDirection = "left" | "right" | "up" | "down";

export type SlideDefinition = {
  readonly id: string;
  readonly index: number;
  readonly transition: SlideTransition;
  readonly maxStep: number;
};

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

export type StepState =
  | "hidden"   // step has not been reached yet
  | "entering" // step is animating in (progress 0→1)
  | "visible"  // step animation complete, fully visible
  | "exiting"  // step is animating out (going backward)
  ;

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export type EventTriggerState = {
  readonly active: boolean;
  readonly progress: number;
};

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

/** Easing function: maps t ∈ [0,1] → [0,1]. */
export type EasingFunction = (t: number) => number;

export type ExtrapolationType = "extend" | "clamp" | "identity";

export type InterpolateOptions = {
  readonly easing?: EasingFunction;
  readonly extrapolateLeft?: ExtrapolationType;
  readonly extrapolateRight?: ExtrapolationType;
};

export type SpringConfig = {
  readonly stiffness: number;
  readonly damping: number;
  readonly mass: number;
  readonly overshootClamping: boolean;
  readonly restDisplacementThreshold: number;
  readonly restSpeedThreshold: number;
};

/** Input to the spring() pure function. */
export type SpringInput = {
  readonly progress: number;
  readonly config?: Partial<SpringConfig>;
  readonly from?: number;
  readonly to?: number;
};

// ---------------------------------------------------------------------------
// Animation Loop
// ---------------------------------------------------------------------------

export type AnimationMode =
  | { readonly type: "tween"; readonly duration: number; readonly easing: EasingFunction }
  | { readonly type: "spring"; readonly config: SpringConfig };

export type AnimationStatus =
  | "idle"
  | "running"
  | "completed";

// ---------------------------------------------------------------------------
// Navigation direction
// ---------------------------------------------------------------------------

export type Direction = "forward" | "backward";

// ---------------------------------------------------------------------------
// Engine state (the single source of truth)
// ---------------------------------------------------------------------------

export type PresentationState = {
  readonly currentSlide: number;
  readonly currentStep: number;
  readonly stepProgress: number;
  readonly direction: Direction;
  readonly events: ReadonlyMap<string, EventTriggerState>;
  readonly config: PresentationConfig;
  readonly animationStatus: AnimationStatus;
  /** Non-null during a slide transition; the slide we're leaving. */
  readonly previousSlide: number | null;
  /** 0→1 progress of the current slide transition. */
  readonly slideTransitionProgress: number;
};

// ---------------------------------------------------------------------------
// Engine actions (all possible state transitions)
// ---------------------------------------------------------------------------

export type PresentationAction =
  | { readonly type: "next" }
  | { readonly type: "prev" }
  | { readonly type: "goTo"; readonly slide: number; readonly step?: number }
  | { readonly type: "updateStepProgress"; readonly progress: number }
  | { readonly type: "completeAnimation" }
  | { readonly type: "activateEvent"; readonly name: string }
  | { readonly type: "deactivateEvent"; readonly name: string }
  | { readonly type: "toggleEvent"; readonly name: string }
  | { readonly type: "updateEventProgress"; readonly name: string; readonly progress: number }
  | { readonly type: "registerSlideSteps"; readonly slideIndex: number; readonly maxStep: number }
  | { readonly type: "updateSlideTransition"; readonly progress: number }
  | { readonly type: "completeSlideTransition" };

// ---------------------------------------------------------------------------
// Code component
// ---------------------------------------------------------------------------

export type CodeAnimationMode = "morph" | "typewriter";

/** Line range string like "1-3" or "1,3-5,8". */
export type LineRange = string;

export type CodeHighlightMap = Readonly<Record<number, LineRange>>;

// ---------------------------------------------------------------------------
// Terminal component
// ---------------------------------------------------------------------------

export type TerminalStep = {
  readonly command: string;
  readonly output?: string;
};
