import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { StepContext, PresentationContext } from "../../core/context.js";
import { interpolate } from "../../animation/interpolate.js";

// ---------------------------------------------------------------------------
// <Stagger>
// Staggers the animation of its children with a delay between each.
// Each child gets its own portion of the progress.
// ---------------------------------------------------------------------------

export type StaggerProps = {
  readonly children: ReactNode;
  /** Delay between each child in ms. Default: 80. */
  readonly interval?: number;
};

export function Stagger({ children, interval = 80 }: StaggerProps) {
  const progress = useProgress();
  const childArray = Children.toArray(children).filter(isValidElement);
  const count = childArray.length;

  if (count === 0) return null;

  // Total stagger delay as a proportion of progress
  // Each child starts at a staggered point in the 0→1 progress
  return (
    <>
      {childArray.map((child, i) => {
        // Each child has its own progress window
        // Child 0: starts at 0
        // Child 1: starts at offset
        // etc.
        const staggerFraction = count > 1 ? i / (count - 1) : 0;
        // Map: child starts when progress reaches staggerFraction * 0.5
        // and completes when progress reaches staggerFraction * 0.5 + 0.5
        const start = staggerFraction * 0.5;
        const end = start + 0.5;
        const childProgress = interpolate(
          progress,
          [start, end],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <StaggeredChild key={i} progress={childProgress}>
            {child}
          </StaggeredChild>
        );
      })}
    </>
  );
}

function StaggeredChild({
  children,
  progress,
}: {
  children: ReactNode;
  progress: number;
}) {
  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [10, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
}

function useProgress(): number {
  const stepCtx = useContext(StepContext);
  if (stepCtx) return stepCtx.progress;

  const presCtx = useContext(PresentationContext);
  if (presCtx) return presCtx.state.stepProgress;

  return 1;
}
