import { useContext } from "react";
import { StepContext, PresentationContext } from "../core/context.js";

/**
 * Returns the animation progress (0→1) for the current step.
 *
 * - Inside a `<Step>`: returns the progress of that specific step's transition.
 * - Outside a `<Step>` but inside `<Slide>`: returns the global step progress
 *   for the current step transition.
 *
 * @example
 * ```tsx
 * const progress = useStepProgress();
 * const opacity = interpolate(progress, [0, 1], [0, 1]);
 * ```
 */
export function useStepProgress(): number {
  const stepCtx = useContext(StepContext);
  if (stepCtx) {
    return stepCtx.progress;
  }

  // Fallback: read from presentation state directly
  const presCtx = useContext(PresentationContext);
  if (!presCtx) {
    throw new Error("useStepProgress must be used within <Presentation>");
  }
  return presCtx.state.stepProgress;
}
