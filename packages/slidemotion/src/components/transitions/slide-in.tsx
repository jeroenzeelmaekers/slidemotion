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
  readonly style?: CSSProperties;
  readonly className?: string;
};

export function SlideIn({
  children,
  from = "left",
  distance = 40,
  style,
  className,
}: SlideInProps) {
  const themeSlot = useComponentTheme("SlideIn");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);
  const enter = directionToOffset(from, distance);

  return (
    <Animate enter={{ opacity: 0, ...enter }} style={style} className={resolvedClassName}>
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
