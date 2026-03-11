import type {
  HighlighterCore,
  LanguageInput,
  RegexEngine,
  ThemeRegistrationRaw,
} from "shiki";
import { createCssVariablesTheme, createHighlighterCore } from "shiki/core";

export type HighlighterEngine = "oniguruma" | "javascript";

let sharedHighlighter: HighlighterCore | null = null;
let initPromise: Promise<HighlighterCore> | null = null;
let sharedEngine: HighlighterEngine | null = null;

export const SM_CODE_THEME = "sm-code" as const;

function resolveThemeInput(theme: string | ThemeRegistrationRaw): ThemeRegistrationRaw {
  if (typeof theme !== "string") return theme;

  throw new Error(
    `initHighlighter does not support string theme names in fine-grained mode: ${theme}`,
  );
}

function assertEngineMatch(engine: HighlighterEngine) {
  if (sharedEngine !== null && sharedEngine !== engine) {
    throw new Error(
      `Shared highlighter already initialized with ${sharedEngine}; cannot reinitialize with ${engine}`,
    );
  }
}

export async function initSharedHighlighter(options: {
  themes?: Array<string | ThemeRegistrationRaw>;
  langs: Array<LanguageInput>;
  engine: HighlighterEngine;
  createEngine: () => Promise<RegexEngine>;
}): Promise<HighlighterCore> {
  assertEngineMatch(options.engine);

  if (sharedHighlighter) return sharedHighlighter;
  if (initPromise) return initPromise;

  sharedEngine = options.engine;

  initPromise = (async () => {
    try {
      const [regexEngine] = await Promise.all([options.createEngine()]);

      const cssVarsTheme = createCssVariablesTheme({
        name: SM_CODE_THEME,
        variablePrefix: "--sm-code-",
      });
      const themes = (options.themes ?? []).map(resolveThemeInput);

      const highlighter = await createHighlighterCore({
        engine: regexEngine,
        themes: [cssVarsTheme, ...themes],
        langs: options.langs,
      });

      sharedHighlighter = highlighter;
      return highlighter;
    } catch (error) {
      initPromise = null;
      sharedEngine = null;
      throw error;
    }
  })();

  return initPromise;
}

export function getSharedHighlighter(): HighlighterCore | null {
  return sharedHighlighter;
}
