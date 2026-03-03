import type { CodeAnimationMode, CodeHighlightMap, LineRange } from "../core/types.js";
import type { HighlighterCore, BundledLanguage, ThemeRegistrationRaw } from "shiki";
export type { HighlighterCore, BundledLanguage, ThemeRegistrationRaw };

// ---------------------------------------------------------------------------
// <Code> component types
// ---------------------------------------------------------------------------

export type CodeClassNames = {
  /** Title bar container. */
  readonly title?: string | undefined;
  /** Title text span. */
  readonly titleText?: string | undefined;
  /** Pre element (fallback mode). */
  readonly pre?: string | undefined;
  /** Content wrapper around ShikiMagicMove or typewriter output. */
  readonly content?: string | undefined;
  /** Dimmed (non-highlighted) line overlay. */
  readonly highlightDim?: string | undefined;
  /** Active (highlighted) line overlay. */
  readonly highlightActive?: string | undefined;
};

export type CodeProps = {
  /** Language for syntax highlighting. */
  readonly lang: string;
  /**
   * Shiki theme — either a name (must be loaded in the highlighter)
   * or a ThemeRegistrationRaw object with a `name` field.
   * When an object is passed, it is auto-registered with the highlighter.
   *
   * Defaults to the built-in CSS variables theme (`SM_CODE_THEME`) which
   * reads colors from `--sm-code-*` custom properties in `styles.css`.
   */
  readonly theme?: string | ThemeRegistrationRaw | undefined;
  /** Array of code strings — each entry is a step state. */
  readonly steps: readonly string[];
  /** Pre-initialized Shiki highlighter. If not provided, uses the shared one. */
  readonly highlighter?: HighlighterCore;
  /** Line highlighting per step. Key = step index, value = line range string. */
  readonly highlight?: CodeHighlightMap;
  /** Opacity for non-highlighted (dimmed) lines. Default: 0.3 */
  readonly dimOpacity?: number;
  /** Show line numbers. Default: false */
  readonly lineNumbers?: boolean;
  /** Filename shown as a tab above the code. */
  readonly title?: string;
  /** Animation mode: "morph" (token-level FLIP) or "typewriter". Default: "morph" */
  readonly animation?: CodeAnimationMode;
  /** Morph animation duration in ms. Default: 500 */
  readonly animationDuration?: number;
  /** Per-token stagger delay in ms. Default: 0 */
  readonly stagger?: number;
  /** Typewriter speed in ms per character. Default: 30 */
  readonly typewriterSpeed?: number;
  /**
   * Step offset for auto-registration.
   * By default, Code auto-registers its steps starting at order 1.
   * Use this to shift (e.g. stepOffset=3 → code steps are orders 3, 4, 5...).
   */
  readonly stepOffset?: number;
  /** CSS class name for the container. */
  readonly className?: string;
  /** CSS classes for internal elements. */
  readonly classNames?: CodeClassNames;
};

// ---------------------------------------------------------------------------
// <Terminal> component types
// ---------------------------------------------------------------------------

export type TerminalStepDef = {
  readonly command: string;
  readonly output?: string;
};

export type TerminalClassNames = {
  /** Chrome bar container. */
  readonly chrome?: string | undefined;
  /** Dots container. */
  readonly dots?: string | undefined;
  /** Close dot. */
  readonly dotClose?: string | undefined;
  /** Minimize dot. */
  readonly dotMinimize?: string | undefined;
  /** Maximize dot. */
  readonly dotMaximize?: string | undefined;
  /** Title text in chrome bar. */
  readonly title?: string | undefined;
  /** Terminal body. */
  readonly body?: string | undefined;
  /** Individual command line row. */
  readonly line?: string | undefined;
  /** Prompt character. */
  readonly prompt?: string | undefined;
  /** Blinking cursor. */
  readonly cursor?: string | undefined;
  /** Command output block. */
  readonly output?: string | undefined;
};

export type TerminalProps = {
  /** Title shown in the terminal chrome. Default: "Terminal" */
  readonly title?: string;
  /** Array of command/output steps. */
  readonly steps: readonly TerminalStepDef[];
  /** Typing speed in ms per character. Default: 40 */
  readonly typingSpeed?: number;
  /** Prompt character(s). Default: "$" */
  readonly prompt?: string;
  /**
   * Step offset for auto-registration (same as Code).
   */
  readonly stepOffset?: number;
  /** CSS class name for the container. */
  readonly className?: string;
  /** CSS classes for internal elements. */
  readonly classNames?: TerminalClassNames;
};

// ---------------------------------------------------------------------------
// Line range parsing
// ---------------------------------------------------------------------------

/**
 * Parses a line range string like "1-3,5,7-9" into a Set of line numbers.
 *
 * @example
 * parseLineRange("1-3,5") // Set { 1, 2, 3, 5 }
 */
export function parseLineRange(range: LineRange): Set<number> {
  const result = new Set<number>();
  const parts = range.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = parseInt(startStr ?? "", 10);
      const end = parseInt(endStr ?? "", 10);
      if (!Number.isNaN(start) && !Number.isNaN(end)) {
        for (let i = start; i <= end; i++) {
          result.add(i);
        }
      }
    } else {
      const n = parseInt(trimmed, 10);
      if (!Number.isNaN(n)) {
        result.add(n);
      }
    }
  }
  return result;
}
