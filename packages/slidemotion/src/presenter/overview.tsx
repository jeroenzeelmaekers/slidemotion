import { useContext, type ReactNode } from "react";
import { PresentationContext } from "../core/context.js";
import { useComponentTheme } from "../theme/context.js";
import { mergeClassName, mergeClassNames } from "../theme/merge.js";

// ---------------------------------------------------------------------------
// <Overview>
// Grid view of all slides. Click a slide to navigate to it.
// Fully headless — all visual styling via className props.
// ---------------------------------------------------------------------------

export type OverviewClassNames = {
  /** The grid container. */
  readonly grid?: string | undefined;
  /** Individual slide card button. */
  readonly card?: string | undefined;
  /** Active (current) slide card. */
  readonly activeCard?: string | undefined;
  /** Slide number label inside each card. */
  readonly slideNumber?: string | undefined;
};

export type OverviewProps = {
  readonly children: ReactNode;
  readonly onClose: () => void;
  /** CSS class for the overlay container (position:fixed inset:0 is applied). */
  readonly className?: string | undefined;
  /** CSS classes for internal elements. */
  readonly classNames?: OverviewClassNames | undefined;
};

export function Overview({
  children,
  onClose,
  className,
  classNames,
}: OverviewProps) {
  const ctx = useContext(PresentationContext);
  if (!ctx) return null;

  const themeSlot = useComponentTheme("Overview");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);
  const resolvedClassNames = mergeClassNames(themeSlot?.classNames, classNames);

  const { slideCount, dispatch } = ctx;

  return (
    <div
      className={resolvedClassName}
      style={{ position: "fixed", inset: 0 }}
      onClick={onClose}
    >
      <div className={resolvedClassNames?.grid}>
        {Array.from({ length: slideCount }, (_, i) => {
          const isActive = ctx.state.currentSlide === i;
          return (
            <button
              key={i}
              className={isActive ? resolvedClassNames?.activeCard : resolvedClassNames?.card}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "goTo", slide: i });
                onClose();
              }}
            >
              <span className={resolvedClassNames?.slideNumber}>{i + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
