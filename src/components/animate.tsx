import { useContext, type CSSProperties, type ReactNode } from "react";
import { StepContext, PresentationContext } from "../core/context.js";
import { interpolate } from "../animation/interpolate.js";
import { useComponentTheme } from "../theme/context.js";
import { mergeClassName } from "../theme/merge.js";

// ---------------------------------------------------------------------------
// <Animate>
// Declarative wrapper that animates CSS properties based on step progress.
// ---------------------------------------------------------------------------

export type AnimateStyle = {
  readonly opacity?: number;
  readonly x?: number;
  readonly y?: number;
  readonly scale?: number;
  readonly rotate?: number;
};

export type AnimateProps = {
  readonly children: ReactNode;
  /** Style when entering (progress=0). */
  readonly enter?: AnimateStyle;
  /** Style when fully visible (progress=1). Default: all properties at their natural values. */
  readonly animate?: AnimateStyle;
  /** Additional CSS styles to pass through. */
  readonly style?: CSSProperties | undefined;
  /** CSS class name. */
  readonly className?: string | undefined;
};

const DEFAULT_ANIMATE: AnimateStyle = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
};

/**
 * Animates CSS properties based on step progress.
 * Must be used within a `<Step>` (reads progress from StepContext).
 *
 * @example
 * ```tsx
 * <Step order={1}>
 *   <Animate enter={{ opacity: 0, y: -20 }}>
 *     <h1>Hello</h1>
 *   </Animate>
 * </Step>
 * ```
 */
export function Animate({
  children,
  enter,
  animate,
  style,
  className,
}: AnimateProps) {
  const progress = useProgress();
  const themeSlot = useComponentTheme("Animate");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);

  const from = { ...DEFAULT_ANIMATE, ...enter };
  const to = { ...DEFAULT_ANIMATE, ...animate };

  const opacity = interpolate(progress, [0, 1], [from.opacity ?? 1, to.opacity ?? 1]);
  const x = interpolate(progress, [0, 1], [from.x ?? 0, to.x ?? 0]);
  const y = interpolate(progress, [0, 1], [from.y ?? 0, to.y ?? 0]);
  const scale = interpolate(progress, [0, 1], [from.scale ?? 1, to.scale ?? 1]);
  const rotate = interpolate(progress, [0, 1], [from.rotate ?? 0, to.rotate ?? 0]);

  const transforms: Array<string> = [];
  if (x !== 0 || y !== 0) transforms.push(`translate(${x}px, ${y}px)`);
  if (scale !== 1) transforms.push(`scale(${scale})`);
  if (rotate !== 0) transforms.push(`rotate(${rotate}deg)`);

  const animatedStyle: CSSProperties = {
    opacity,
    transform: transforms.length > 0 ? transforms.join(" ") : undefined,
    ...style,
  };

  return (
    <div style={animatedStyle} className={resolvedClassName}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal: read progress from StepContext or PresentationContext
// ---------------------------------------------------------------------------

function useProgress(): number {
  const stepCtx = useContext(StepContext);
  if (stepCtx) return stepCtx.progress;

  const presCtx = useContext(PresentationContext);
  if (presCtx) return presCtx.state.stepProgress;

  return 1;
}
