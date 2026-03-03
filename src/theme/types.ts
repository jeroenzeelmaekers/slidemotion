import type { PresenterClassNames } from "../presenter/presenter.js";
import type { ControlsClassNames } from "../presenter/controls.js";
import type { OverviewClassNames } from "../presenter/overview.js";
import type { CodeClassNames, TerminalClassNames } from "../code/types.js";

// ---------------------------------------------------------------------------
// CSS Variables
// Themes inject these as inline styles on a wrapper element. Consumers map
// them to Tailwind v4 `@theme` tokens so components can use semantic
// utilities like `bg-background` and `text-foreground`.
// ---------------------------------------------------------------------------

/** CSS custom property name (must start with `--`). */
type CSSVarName = `--${string}`;

/** Record of CSS custom properties to inject on the theme wrapper. */
export type ThemeCSSVars = Readonly<Record<CSSVarName, string>>;

// ---------------------------------------------------------------------------
// Component theme slots
// ---------------------------------------------------------------------------

/**
 * Theme slot for a component with simple className only.
 */
type SimpleSlot = {
  readonly className?: string;
};

/**
 * Theme slot for a component with className + classNames object.
 */
type CompoundSlot<TClassNames> = {
  readonly className?: string;
  readonly classNames?: TClassNames;
};

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

/**
 * A theme provides CSS custom properties and default classNames for every
 * slidemotion component. Components merge theme defaults with explicit props
 * using string concatenation (theme first, prop second).
 *
 * @example
 * ```ts
 * const workTheme = defineTheme({
 *   cssVars: {
 *     "--background": "0 0% 4%",
 *     "--foreground": "0 0% 98%",
 *     "--primary": "217 91% 60%",
 *     "--muted": "0 0% 40%",
 *   },
 *   Slide: { className: "bg-background text-foreground" },
 *   Presenter: {
 *     className: "flex flex-col h-screen bg-background",
 *     classNames: { viewport: "flex-1 flex items-center justify-center" },
 *   },
 * });
 * ```
 */
export type Theme = {
  /** CSS custom properties injected on a wrapper element. */
  readonly cssVars?: ThemeCSSVars;

  // Simple components (className only)
  readonly Slide?: SimpleSlot;
  readonly Animate?: SimpleSlot;
  readonly FadeIn?: SimpleSlot;
  readonly SlideIn?: SimpleSlot;
  readonly ScaleIn?: SimpleSlot;

  // Compound components (className + classNames)
  readonly Presenter?: CompoundSlot<PresenterClassNames>;
  readonly Controls?: CompoundSlot<ControlsClassNames>;
  readonly Overview?: CompoundSlot<OverviewClassNames>;
  readonly Code?: CompoundSlot<CodeClassNames>;
  readonly Terminal?: CompoundSlot<TerminalClassNames>;
};

// ---------------------------------------------------------------------------
// Type-safe theme construction
// ---------------------------------------------------------------------------

/**
 * Identity function for type-safe theme creation. Zero runtime overhead.
 *
 * @example
 * ```ts
 * export const myTheme = defineTheme({
 *   cssVars: { "--background": "#0a0a0a" },
 *   Slide: { className: "bg-background text-foreground" },
 * });
 * ```
 */
export function defineTheme(theme: Theme): Theme {
  return theme;
}
