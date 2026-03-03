import { useContext, useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import { PresentationContext, SlideContext, type SlideContextValue } from "../core/context.js";
import type { SlideTransition, SlideTransitionDirection } from "../core/types.js";
import { useComponentTheme } from "../theme/context.js";
import { mergeClassName } from "../theme/merge.js";

// ---------------------------------------------------------------------------
// <Slide>
// Represents a single slide. Only the active slide renders its children
// (plus the previous slide during an animated transition).
// ---------------------------------------------------------------------------

export type SlideProps = {
  readonly children: ReactNode;
  readonly id: string;
  /** CSS class for the slide container. */
  readonly className?: string | undefined;
  /** Transition when entering this slide. Default: "none" (instant). */
  readonly transition?: SlideTransition | undefined;
};

export function Slide({ children, id, className, transition = "none" }: SlideProps) {
  const presCtx = useContext(PresentationContext);
  if (!presCtx) {
    throw new Error("<Slide> must be used within <Presentation>");
  }

  const themeSlot = useComponentTheme("Slide");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);

  const index = presCtx.slideIndexCounter.next();
  const { state, slideTransitionRegistry } = presCtx;

  // Register transition
  useEffect(() => {
    slideTransitionRegistry.register(index, transition);
  }, [slideTransitionRegistry, index, transition]);

  const isActive = state.currentSlide === index;
  const isPrevious = state.previousSlide === index;
  const isTransitioning = state.previousSlide !== null;

  const contextValue: SlideContextValue = useMemo(
    () => ({ id, index, isActive }),
    [id, index, isActive],
  );

  // Only render if active or the outgoing slide during a transition
  if (!isActive && !isPrevious) return null;

  // Compute transition styles
  const transitionStyle = isTransitioning
    ? computeTransitionStyle(transition, state.slideTransitionProgress, state.direction, isActive)
    : undefined;

  return (
    <SlideContext.Provider value={contextValue}>
      <div
        className={resolvedClassName}
        style={{
          position: "absolute",
          inset: 0,
          ...transitionStyle,
        }}
        data-slidemotion-slide={id}
      >
        {children}
      </div>
    </SlideContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Transition style computation
// ---------------------------------------------------------------------------

function computeTransitionStyle(
  transition: SlideTransition,
  progress: number,
  direction: "forward" | "backward",
  isIncoming: boolean,
): CSSProperties | undefined {
  if (transition === "none") return undefined;

  const t = isIncoming ? progress : 1 - progress;

  if (transition === "fade" || (typeof transition === "object" && transition.type === "fade")) {
    return { opacity: t };
  }

  if (typeof transition === "object" && transition.type === "push") {
    const pushDirection = transition.direction;
    const offset = computePushOffset(pushDirection, direction, isIncoming, progress);
    return {
      transform: `translate(${offset.x}, ${offset.y})`,
    };
  }

  return undefined;
}

function computePushOffset(
  pushDirection: SlideTransitionDirection,
  navDirection: "forward" | "backward",
  isIncoming: boolean,
  progress: number,
): { readonly x: string; readonly y: string } {
  // Forward: incoming slides in from the push direction, outgoing slides out opposite
  // Backward: reverse of forward
  const forward = navDirection === "forward";
  const entering = isIncoming;

  // Choose the axis and sign
  const axis = pushDirection === "left" || pushDirection === "right" ? "x" : "y";
  const baseSign = pushDirection === "right" || pushDirection === "down" ? 1 : -1;

  // For forward + entering: start offscreen in push direction, move to 0
  // For forward + leaving: start at 0, move opposite of push direction
  // For backward: flip it
  let pct: number;
  if (forward && entering) {
    pct = baseSign * (1 - progress) * 100;
  } else if (forward && !entering) {
    pct = -baseSign * progress * 100;
  } else if (!forward && entering) {
    pct = -baseSign * (1 - progress) * 100;
  } else {
    pct = baseSign * progress * 100;
  }

  return axis === "x"
    ? { x: `${pct}%`, y: "0" }
    : { x: "0", y: `${pct}%` };
}
