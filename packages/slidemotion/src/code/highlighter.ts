import type { HighlighterCore, BundledLanguage, ThemeRegistrationRaw } from "shiki";

// ---------------------------------------------------------------------------
// Shared Shiki Highlighter
// Lazily initialized singleton. Users can also provide their own.
// ---------------------------------------------------------------------------

let sharedHighlighter: HighlighterCore | null = null;
let initPromise: Promise<HighlighterCore> | null = null;

/**
 * The name of the built-in CSS variables theme.
 *
 * When used with `<Code theme={SM_CODE_THEME}>`, syntax tokens are
 * colored via `--sm-code-*` CSS custom properties defined in
 * `slidemotion/styles.css`. Light/dark switching happens purely in CSS.
 */
export const SM_CODE_THEME = "sm-code" as const;

/**
 * Initializes the shared Shiki highlighter.
 * Call this once at app startup with the languages and themes you need.
 *
 * The built-in CSS variables theme (`SM_CODE_THEME`) is always registered
 * automatically. Pass additional named or custom themes as needed.
 *
 * @example
 * ```ts
 * import { initHighlighter } from "slidemotion";
 *
 * await initHighlighter({
 *   themes: ["github-dark"],
 *   langs: ["typescript", "javascript", "jsx", "tsx"],
 * });
 * ```
 */
export async function initHighlighter(options: {
  themes?: Array<string | ThemeRegistrationRaw>;
  langs: Array<string | BundledLanguage>;
}): Promise<HighlighterCore> {
  if (sharedHighlighter) return sharedHighlighter;

  if (initPromise) return initPromise;

  initPromise = (async () => {
    const [{ createHighlighter }, { createCssVariablesTheme }] = await Promise.all([
      import("shiki"),
      import("shiki/core"),
    ]);

    const cssVarsTheme = createCssVariablesTheme({
      name: SM_CODE_THEME,
      variablePrefix: "--sm-code-",
    });

    const highlighter = await createHighlighter({
      themes: [cssVarsTheme, ...(options.themes ?? [])],
      langs: options.langs,
    });

    sharedHighlighter = highlighter;
    return highlighter;
  })();

  return initPromise;
}

/**
 * Returns the shared highlighter if initialized, or null.
 */
export function getSharedHighlighter(): HighlighterCore | null {
  return sharedHighlighter;
}
