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

type AnimateStatus = "hidden" | "entering" | "visible" | "exiting";

export type AnimateProps = {
  readonly children: ReactNode;
  /** Style when entering (progress=0). */
  readonly enter?: AnimateStyle;
  /** Style when fully visible (progress=1). Default: all properties at their natural values. */
  readonly animate?: AnimateStyle;
  /** Style when exiting backward. Defaults to `enter`. */
  readonly exit?: AnimateStyle;
  /** Additional CSS styles to pass through. */
  readonly style?: CSSProperties | undefined;
  /** CSS class name. */
  readonly className?: string | undefined;
  /** Render as a different element. Default: "div" */
  readonly as?: "div" | "span";
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
  exit,
  style,
  className,
  as = "div",
}: AnimateProps) {
  const { progress, status } = useProgress();
  const themeSlot = useComponentTheme("Animate");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);

  const from = { ...DEFAULT_ANIMATE, ...enter };
  const to = { ...DEFAULT_ANIMATE, ...animate };
  const exitTarget = { ...DEFAULT_ANIMATE, ...(exit ?? enter) };

  const start = status === "exiting" ? to : from;
  const end = status === "exiting" ? exitTarget : to;

  const opacity = interpolate(progress, [0, 1], [start.opacity ?? 1, end.opacity ?? 1]);
  const x = interpolate(progress, [0, 1], [start.x ?? 0, end.x ?? 0]);
  const y = interpolate(progress, [0, 1], [start.y ?? 0, end.y ?? 0]);
  const scale = interpolate(progress, [0, 1], [start.scale ?? 1, end.scale ?? 1]);
  const rotate = interpolate(progress, [0, 1], [start.rotate ?? 0, end.rotate ?? 0]);

  const transforms: Array<string> = [];
  if (x !== 0 || y !== 0) transforms.push(`translate(${x}px, ${y}px)`);
  if (scale !== 1) transforms.push(`scale(${scale})`);
  if (rotate !== 0) transforms.push(`rotate(${rotate}deg)`);

  const animatedStyle: CSSProperties = {
    opacity,
    transform: transforms.length > 0 ? transforms.join(" ") : undefined,
    ...style,
  };

  const Component = as;

  return (
    <Component style={animatedStyle} className={resolvedClassName}>
      {children}
    </Component>
  );
}

// ---------------------------------------------------------------------------
// Internal: read progress from StepContext or PresentationContext
// ---------------------------------------------------------------------------

function useProgress(): { readonly progress: number; readonly status: AnimateStatus } {
  const stepCtx = useContext(StepContext);
  const presCtx = useContext(PresentationContext);
  if (stepCtx) {
    return {
      progress: stepCtx.progress,
      status: stepCtx.status,
    };
  }

  if (presCtx) {
    return {
      progress: presCtx.state.stepProgress,
      status: presCtx.state.animationStatus === "running" ? "entering" : "visible",
    };
  }

  return { progress: 1, status: "visible" };
}
