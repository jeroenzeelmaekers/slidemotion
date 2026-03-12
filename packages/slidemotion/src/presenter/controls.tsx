import { useContext, type ReactNode } from "react";
import { PresentationContext } from "../core/context.js";
import { useComponentTheme } from "../theme/context.js";
import { mergeClassName, mergeClassNames } from "../theme/merge.js";

// ---------------------------------------------------------------------------
// <Controls>
// Navigation controls bar shown at the bottom of the presenter.
// Fully headless — all visual styling via className props.
// ---------------------------------------------------------------------------

export type ControlsClassNames = {
  /** Previous button. */
  readonly prev?: string | undefined;
  /** Next button. */
  readonly next?: string | undefined;
  /** Counter container (e.g. "2 / 6"). */
  readonly counter?: string | undefined;
  /** Step indicator within the counter. */
  readonly step?: string | undefined;
};

export type ControlsProps = {
  /** CSS class for the outer container. */
  readonly className?: string | undefined;
  /** CSS classes for internal elements. */
  readonly classNames?: ControlsClassNames | undefined;
  /** Override prev button content. Default: "←" */
  readonly prevLabel?: ReactNode | undefined;
  /** Override next button content. Default: "→" */
  readonly nextLabel?: ReactNode | undefined;
};

export function Controls({
  className,
  classNames,
  prevLabel = "←",
  nextLabel = "→",
}: ControlsProps) {
  const ctx = useContext(PresentationContext);
  if (!ctx) return null;

  const themeSlot = useComponentTheme("Controls");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);
  const resolvedClassNames = mergeClassNames(themeSlot?.classNames, classNames);

  const { state, dispatch, slideCount } = ctx;
  const { currentSlide, currentStep } = state;

  return (
    <div className={resolvedClassName}>
      <button
        className={resolvedClassNames?.prev}
        onClick={() => dispatch({ type: "prev" })}
        aria-label="Previous"
      >
        {prevLabel}
      </button>

      <span className={resolvedClassNames?.counter}>
        {currentSlide + 1} / {slideCount}
        {currentStep > 0 && <span className={resolvedClassNames?.step}> · step {currentStep}</span>}
      </span>

      <button
        className={resolvedClassNames?.next}
        onClick={() => dispatch({ type: "next" })}
        aria-label="Next"
      >
        {nextLabel}
      </button>
    </div>
  );
}
