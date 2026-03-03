import type { CSSProperties, ReactNode } from "react";
import { Animate } from "../animate.js";
import { useComponentTheme } from "../../theme/context.js";
import { mergeClassName } from "../../theme/merge.js";

// ---------------------------------------------------------------------------
// <FadeIn>
// Fades children in from opacity 0.
// ---------------------------------------------------------------------------

export type FadeInProps = {
  readonly children: ReactNode;
  readonly style?: CSSProperties;
  readonly className?: string;
};

export function FadeIn({ children, style, className }: FadeInProps) {
  const themeSlot = useComponentTheme("FadeIn");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);

  return (
    <Animate enter={{ opacity: 0 }} style={style} className={resolvedClassName}>
      {children}
    </Animate>
  );
}
