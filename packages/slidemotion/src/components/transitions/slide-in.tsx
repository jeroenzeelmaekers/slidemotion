import type { CSSProperties, ReactNode } from "react";
import { Animate } from "../animate.js";
import { useComponentTheme } from "../../theme/context.js";
import { mergeClassName } from "../../theme/merge.js";

// ---------------------------------------------------------------------------
// <SlideIn>
// Slides children in from a direction.
// ---------------------------------------------------------------------------

export type SlideInProps = {
  readonly children: ReactNode;
  readonly from?: "left" | "right" | "top" | "bottom";
  /** Distance in pixels. Default: 40. */
  readonly distance?: number;
  /** Direction used when exiting backward. Defaults to `from`. */
  readonly exitTo?: "left" | "right" | "top" | "bottom";
  readonly style?: CSSProperties;
  readonly className?: string;
};

export function SlideIn({
  children,
  from = "left",
  distance = 40,
  exitTo = from,
  style,
  className,
}: SlideInProps) {
  const themeSlot = useComponentTheme("SlideIn");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);
  const enter = directionToOffset(from, distance);
  const exit = directionToOffset(exitTo, distance);

  return (
    <Animate
      enter={{ opacity: 0, ...enter }}
      exit={{ opacity: 0, ...exit }}
      style={style}
      className={resolvedClassName}
    >
      {children}
    </Animate>
  );
}

function directionToOffset(
  from: "left" | "right" | "top" | "bottom",
  distance: number,
): { x?: number; y?: number } {
  switch (from) {
    case "left":
      return { x: -distance };
    case "right":
      return { x: distance };
    case "top":
      return { y: -distance };
    case "bottom":
      return { y: distance };
  }
}
