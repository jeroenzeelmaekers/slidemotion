import type { HighlighterCore, LanguageInput, ThemeRegistrationRaw } from "shiki";
import { initSharedHighlighter } from "./highlighter-shared.js";

export async function initHighlighterJavaScript(options: {
  themes?: Array<string | ThemeRegistrationRaw>;
  langs: Array<LanguageInput>;
}): Promise<HighlighterCore> {
  return initSharedHighlighter({
    ...options,
    engine: "javascript",
    createEngine: async () => {
      const { createJavaScriptRegexEngine } = await import("shiki/engine/javascript");
      return createJavaScriptRegexEngine();
    },
  });
}
