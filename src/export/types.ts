// ---------------------------------------------------------------------------
// PDF export types
// ---------------------------------------------------------------------------

/** Options for exporting a presentation to PDF. */
export type ExportOptions = {
  /** URL of the running dev server. */
  readonly url: string;
  /** Output file path. */
  readonly output: string;
  /** Viewport width in pixels. Default: 1920 */
  readonly width?: number;
  /** Viewport height in pixels. Default: 1080 */
  readonly height?: number;
  /**
   * Max time in ms to wait for each slide to become idle.
   * Default: 10_000
   */
  readonly timeout?: number;
  /**
   * Delay in ms after idle before taking the screenshot.
   * Useful for letting fonts/images settle. Default: 100
   */
  readonly settleDelay?: number;
};

/** Selector constants used to coordinate with <Presenter>. */
export const SELECTORS = {
  root: "[data-slidemotion-root]",
  idle: "[data-slidemotion-idle]",
  slideCount: "data-slidemotion-slide-count",
  currentSlide: "data-slidemotion-current-slide",
  currentStep: "data-slidemotion-current-step",
} as const;
