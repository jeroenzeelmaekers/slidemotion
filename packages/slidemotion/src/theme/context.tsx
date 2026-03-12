import { createContext, useContext, type ReactNode } from "react";
import type { Theme } from "./types.js";

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
 *
 * Colors are defined via CSS custom properties in `styles.css`.
 * This provider only supplies component className defaults — no inline
 * style injection or wrapper elements.
 *
 * Can be used standalone or implicitly via `<Presentation theme={...}>`.
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps): ReactNode {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
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
export function useComponentTheme<K extends keyof Theme>(component: K): Theme[K] | undefined {
  const theme = useContext(ThemeContext);
  if (!theme) return undefined;
  return theme[component];
}
