import type { HighlighterCore, BundledLanguage, ThemeRegistrationRaw } from "shiki";

// ---------------------------------------------------------------------------
// Shared Shiki Highlighter
// Lazily initialized singleton. Users can also provide their own.
// ---------------------------------------------------------------------------

let sharedHighlighter: HighlighterCore | null = null;
let initPromise: Promise<HighlighterCore> | null = null;

/**
 * Initializes the shared Shiki highlighter.
 * Call this once at app startup with the languages and themes you need.
 *
 * @example
 * ```ts
 * import { initHighlighter } from "slidemotion";
 *
 * await initHighlighter({
 *   themes: ["github-dark", "github-light"],
 *   langs: ["typescript", "javascript", "jsx", "tsx"],
 * });
 * ```
 */
export async function initHighlighter(options: {
  themes: Array<string | ThemeRegistrationRaw>;
  langs: Array<string | BundledLanguage>;
}): Promise<HighlighterCore> {
  if (sharedHighlighter) return sharedHighlighter;

  if (initPromise) return initPromise;

  initPromise = (async () => {
    const { createHighlighter } = await import("shiki");
    const highlighter = await createHighlighter({
      themes: options.themes,
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
