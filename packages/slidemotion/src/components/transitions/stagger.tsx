import { Children, isValidElement, useContext, type ReactNode, type ReactElement } from "react";
import { StepContext, PresentationContext } from "../../core/context.js";
import { interpolate } from "../../animation/interpolate.js";

// ---------------------------------------------------------------------------
// <Stagger>
// Staggers the animation of its children with a delay between each.
// Each child gets its own portion of the progress.
// ---------------------------------------------------------------------------

export type StaggerProps = {
  readonly children: ReactNode;
  /** Portion of the progress reserved between each child. Default: 0.12. */
  readonly interval?: number;
  /** Initial offset in pixels. Default: 10. */
  readonly y?: number;
};

export function Stagger({ children, interval = 0.12, y = 10 }: StaggerProps) {
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
        const totalOffset = Math.max(0, Math.min(interval, 1)) * Math.max(count - 1, 0);
        const available = Math.max(1 - totalOffset, 0.0001);
        const start = Math.min(i * interval, 1);
        const end = Math.min(start + available, 1);
        const childProgress = interpolate(progress, [start, end], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <StaggeredChild key={getChildKey(child, i)} progress={childProgress} y={y}>
            {child}
          </StaggeredChild>
        );
      })}
    </>
  );
}

function getChildKey(child: ReactElement, index: number): string {
  return child.key === null ? `stagger-${index}` : String(child.key);
}

function StaggeredChild({
  children,
  progress,
  y,
}: {
  children: ReactNode;
  progress: number;
  y: number;
}) {
  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [y, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
}

function useProgress(): number {
  const stepCtx = useContext(StepContext);
  const presCtx = useContext(PresentationContext);
  if (stepCtx) return stepCtx.progress;

  if (presCtx) return presCtx.state.stepProgress;

  return 1;
}
