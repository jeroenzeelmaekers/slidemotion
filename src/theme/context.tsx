import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from "react";
import type { Theme, ThemeCSSVars } from "./types.js";

// ---------------------------------------------------------------------------
// Theme Context
// ---------------------------------------------------------------------------

const ThemeContext = createContext<Theme | null>(null);

export type ThemeProviderProps = {
  readonly theme: Theme;
  readonly children: ReactNode;
};

/**
 * Provides a theme to all slidemotion components below.
 * Injects CSS custom properties as inline styles on a wrapper `<div>`.
 *
 * Can be used standalone or implicitly via `<Presentation theme={...}>`.
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps): ReactNode {
  const cssVarStyle = useMemo(
    () => cssVarsToStyle(theme.cssVars),
    [theme.cssVars],
  );

  return (
    <ThemeContext.Provider value={theme}>
      {cssVarStyle ? (
        <div style={cssVarStyle} data-slidemotion-theme="">
          {children}
        </div>
      ) : (
        children
      )}
    </ThemeContext.Provider>
  );
}

/**
 * Access the current theme, or null if none provided.
 */
export function useTheme(): Theme | null {
  return useContext(ThemeContext);
}

/**
 * Access a specific component's theme slot.
 * Returns undefined if no theme or slot not defined.
 */
export function useComponentTheme<K extends keyof Theme>(
  component: K,
): Theme[K] | undefined {
  const theme = useContext(ThemeContext);
  if (!theme) return undefined;
  return theme[component];
}

// ---------------------------------------------------------------------------
// Internal: convert ThemeCSSVars to a CSSProperties object
// ---------------------------------------------------------------------------

function cssVarsToStyle(
  cssVars: ThemeCSSVars | undefined,
): CSSProperties | undefined {
  if (!cssVars) return undefined;

  const entries = Object.entries(cssVars);
  if (entries.length === 0) return undefined;

  // React's CSSProperties accepts CSS custom properties when keys start
  // with "--". Must use a regular object (not Object.create(null)) because
  // React DOM calls hasOwnProperty on the style object.
  const style: Record<string, string> & CSSProperties = {};
  for (const [key, value] of entries) {
    style[key] = value;
  }

  return style;
}
