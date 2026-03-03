import { useContext } from "react";
import { PresentationContext } from "../core/context.js";

/**
 * Access the presentation state and navigation actions.
 *
 * @example
 * ```tsx
 * const { currentSlide, slideCount, next, prev, goTo } = usePresentation();
 * ```
 */
export function usePresentation() {
  const ctx = useContext(PresentationContext);
  if (!ctx) {
    throw new Error("usePresentation must be used within <Presentation>");
  }

  const { state, dispatch, slideCount } = ctx;

  return {
    currentSlide: state.currentSlide,
    currentStep: state.currentStep,
    slideCount,
    direction: state.direction,
    animationStatus: state.animationStatus,
    config: state.config,

    next: () => dispatch({ type: "next" }),
    prev: () => dispatch({ type: "prev" }),
    goTo: (slide: number, step?: number) =>
      dispatch({ type: "goTo", slide, ...(step !== undefined && { step }) }),
  } as const;
}
