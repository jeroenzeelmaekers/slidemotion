// ---------------------------------------------------------------------------
// slidemotion — public API
// ---------------------------------------------------------------------------

// Core types
export type {
  PresentationConfig,
  SlideTransition,
  SlideTransitionDirection,
  StepState,
  EventTriggerState,
  EasingFunction,
  ExtrapolationType,
  InterpolateOptions,
  SpringConfig,
  SpringInput,
  AnimationMode,
  AnimationStatus,
  Direction,
  CodeAnimationMode,
  LineRange,
  CodeHighlightMap,
  TerminalStep,
} from "./core/types.js";

// Components
export { Presentation, type PresentationProps } from "./components/presentation.js";
export { Slide, type SlideProps } from "./components/slide.js";
export { Step, type StepProps } from "./components/step.js";
export { Animate, type AnimateProps, type AnimateStyle } from "./components/animate.js";
export { SpeakerNotes, type SpeakerNotesProps } from "./components/notes.js";

// Transitions
export { FadeIn, type FadeInProps } from "./components/transitions/fade-in.js";
export { SlideIn, type SlideInProps } from "./components/transitions/slide-in.js";
export { ScaleIn, type ScaleInProps } from "./components/transitions/scale-in.js";
export { Stagger, type StaggerProps } from "./components/transitions/stagger.js";

// Code
export { Code } from "./code/code.js";
export type { CodeProps, CodeClassNames, TerminalProps, TerminalClassNames } from "./code/types.js";
export { Terminal } from "./code/terminal.js";
export { initHighlighter, getSharedHighlighter } from "./code/highlighter.js";
export { parseLineRange } from "./code/types.js";

// Presenter
export { Presenter, type PresenterProps, type PresenterClassNames } from "./presenter/presenter.js";
export { Controls, type ControlsProps, type ControlsClassNames } from "./presenter/controls.js";
export { Overview, type OverviewProps, type OverviewClassNames } from "./presenter/overview.js";

// Hooks
export { usePresentation } from "./hooks/use-presentation.js";
export { useSlide } from "./hooks/use-slide.js";
export { useStep } from "./hooks/use-step.js";
export { useStepProgress } from "./hooks/use-step-progress.js";
export { useEventTrigger, type EventTriggerHandle } from "./hooks/use-event-trigger.js";
export { useEventProgress } from "./hooks/use-event-progress.js";

// Animation
export { interpolate } from "./animation/interpolate.js";
export { spring, springDuration } from "./animation/spring.js";
export {
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
  asIn,
  asOut,
  asInOut,
} from "./animation/easing.js";
export { createAnimationLoop, tweenMode, springMode } from "./animation/animation-loop.js";

// Theme
export type { Theme, ThemeCSSVars } from "./theme/types.js";
export { defineTheme } from "./theme/types.js";
export { ThemeProvider, useTheme, type ThemeProviderProps } from "./theme/context.js";
