import type { CSSProperties, ReactNode } from "react";
import { Animate } from "../animate.js";
import { useComponentTheme } from "../../theme/context.js";
import { mergeClassName } from "../../theme/merge.js";

// ---------------------------------------------------------------------------
// <ScaleIn>
// Scales children in from a smaller/larger size.
// ---------------------------------------------------------------------------

export type ScaleInProps = {
  readonly children: ReactNode;
  /** Starting scale. Default: 0.8. */
  readonly from?: number;
  readonly style?: CSSProperties;
  readonly className?: string;
};

export function ScaleIn({
  children,
  from = 0.8,
  style,
  className,
}: ScaleInProps) {
  const themeSlot = useComponentTheme("ScaleIn");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);

  return (
    <Animate enter={{ opacity: 0, scale: from }} style={style} className={resolvedClassName}>
      {children}
    </Animate>
  );
}
