import type { PresenterClassNames } from "../presenter/presenter.js";
import type { ControlsClassNames } from "../presenter/controls.js";
import type { OverviewClassNames } from "../presenter/overview.js";
import type { CodeClassNames, TerminalClassNames } from "../code/types.js";

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
 * A theme provides default classNames for every slidemotion component.
 * Components merge theme defaults with explicit props using string
 * concatenation (theme first, prop second — Tailwind last-class-wins).
 *
 * Colors are defined as CSS custom properties in `styles.css` using the
 * `--sm-*` prefix, bridged to Tailwind v4 via `@theme inline`. Override
 * `:root` / `.dark` in your own CSS to customize the palette.
 *
 * @example
 * ```ts
 * const myTheme = defineTheme({
 *   Slide: { className: "bg-sm-background text-sm-foreground" },
 *   Presenter: {
 *     className: "flex flex-col h-screen bg-sm-background",
 *     classNames: { viewport: "flex-1 flex items-center justify-center" },
 *   },
 * });
 * ```
 */
export type Theme = {
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
 *   Slide: { className: "bg-sm-background text-sm-foreground" },
 * });
 * ```
 */
export function defineTheme(theme: Theme): Theme {
  return theme;
}
