import type { HighlighterCore, LanguageInput, ThemeRegistrationRaw } from "shiki";
import { initSharedHighlighter } from "./highlighter-shared.js";
export { getSharedHighlighter, SM_CODE_THEME } from "./highlighter-shared.js";

/**
 * Initializes the shared Shiki highlighter.
 * Call this once at app startup with the languages and themes you need.
 *
 * The built-in CSS variables theme (`SM_CODE_THEME`) is always registered
 * automatically. Pass additional custom themes as needed.
 *
 * @example
 * ```ts
 * import { initHighlighter } from "slidemotion";
 * import githubDark from "shiki/dist/themes/github-dark.mjs";
 *
 * await initHighlighter({
 *   themes: [githubDark],
 *   langs: [
 *     import("@shikijs/langs/typescript"),
 *     import("@shikijs/langs/javascript"),
 *     import("@shikijs/langs/jsx"),
 *     import("@shikijs/langs/tsx"),
 *   ],
 * });
 * ```
 */
export async function initHighlighter(options: {
  themes?: Array<string | ThemeRegistrationRaw>;
  langs: Array<LanguageInput>;
}): Promise<HighlighterCore> {
  return initSharedHighlighter({
    ...options,
    engine: "oniguruma",
    createEngine: async () => {
      const { createOnigurumaEngine } = await import("shiki/engine/oniguruma");
      return createOnigurumaEngine(import("shiki/wasm"));
    },
  });
}
