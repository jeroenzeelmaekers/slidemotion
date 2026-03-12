import { useContext, useEffect, useId, useMemo, useReducer } from "react";
import { ShikiMagicMove } from "shiki-magic-move/react";
import type { HighlighterCore, ThemeRegistrationRaw, ThemedToken } from "shiki";
import { PresentationContext, SlideContext } from "../core/context.js";
import { getSharedHighlighter, SM_CODE_THEME } from "./highlighter-shared.js";
import { parseLineRange, type CodeProps } from "./types.js";
import { useComponentTheme } from "../theme/context.js";
import { mergeClassName, mergeClassNames } from "../theme/merge.js";
import { countCompletedStepOrders, resolveStepAliases, resolveStepOrders } from "./step-orders.js";

const FONT_STYLE_NONE = 0;
const FONT_STYLE_ITALIC = 1;
const FONT_STYLE_BOLD = 2;
const FONT_STYLE_UNDERLINE = 4;

type TypewriterState = {
  readonly visibleChars: number;
  readonly previousCode: string;
};

type TypewriterAction =
  | { readonly type: "syncCode"; readonly code: string }
  | { readonly type: "tick"; readonly totalChars: number };

function useResolvedTheme(
  theme: string | ThemeRegistrationRaw,
  highlighter: HighlighterCore | null,
): string | null {
  const themeName = typeof theme === "object" ? (theme.name ?? null) : theme;
  const themeObject = typeof theme === "object" ? theme : null;
  const initialReady =
    !themeObject ||
    (highlighter !== null &&
      themeName !== null &&
      highlighter.getLoadedThemes().includes(themeName));

  const [state, dispatch] = useReducer(resolvedThemeReducer, {
    ready: initialReady,
    loadedThemeName: themeName,
  });

  useEffect(() => {
    if (!themeObject) {
      dispatch({ type: "ready", themeName });
      return;
    }
    if (!highlighter || !themeName) return;

    if (highlighter.getLoadedThemes().includes(themeName)) {
      dispatch({ type: "ready", themeName });
      return;
    }

    let cancelled = false;
    dispatch({ type: "loading", themeName });
    highlighter.loadTheme(themeObject).then(() => {
      if (!cancelled) {
        dispatch({ type: "ready", themeName });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [themeObject, themeName, highlighter]);

  if (themeObject && !themeName) {
    throw new Error("<Code> theme object must have a `name` property");
  }

  return state.ready && themeName ? themeName : null;
}

export function Code({
  lang,
  theme = SM_CODE_THEME,
  steps,
  highlighter: externalHighlighter,
  highlight,
  dimOpacity = 0.6,
  lineNumbers = false,
  title,
  animation = "morph",
  animationDuration = 500,
  stagger = 0,
  typewriterSpeed = 30,
  renderer,
  atSteps,
  stepOrders: explicitStepOrders,
  stepOffset,
  className,
  classNames,
}: CodeProps) {
  const presCtx = useContext(PresentationContext);
  const slideCtx = useContext(SlideContext);

  if (!presCtx) throw new Error("<Code> must be used within <Presentation>");
  if (!slideCtx) throw new Error("<Code> must be used within <Slide>");

  const themeSlot = useComponentTheme("Code");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);
  const resolvedClassNames = mergeClassNames(themeSlot?.classNames, classNames);

  const instanceId = useId();
  const { stepRegistry, state } = presCtx;
  const { index: slideIndex } = slideCtx;

  const highlighter = externalHighlighter ?? getSharedHighlighter();
  const resolvedTheme = useResolvedTheme(theme, highlighter);

  const resolvedExplicitStepOrders = resolveStepAliases(atSteps, explicitStepOrders, "Code");
  const codeStepOrders = resolveStepOrders(
    Math.max(steps.length - 1, 0),
    stepOffset,
    resolvedExplicitStepOrders,
    "Code",
  );

  useEffect(() => {
    for (let index = 0; index < codeStepOrders.length; index++) {
      const order = codeStepOrders[index];
      if (order !== undefined) {
        stepRegistry.register(slideIndex, `${instanceId}-code-${index}`, order);
      }
    }

    return () => {
      for (let index = 0; index < codeStepOrders.length; index++) {
        stepRegistry.unregister(slideIndex, `${instanceId}-code-${index}`);
      }
    };
  }, [stepRegistry, slideIndex, instanceId, codeStepOrders]);

  const currentStep = state.currentSlide === slideIndex ? state.currentStep : 0;
  const codeStepIndex = Math.min(
    countCompletedStepOrders(currentStep, codeStepOrders),
    steps.length - 1,
  );
  const currentCode = steps[codeStepIndex] ?? steps[0] ?? "";
  const resolvedRenderer = resolveCodeRenderer(renderer, animation, highlighter, resolvedTheme);
  const highlightedLines = highlight?.[codeStepIndex]
    ? parseLineRange(highlight[codeStepIndex])
    : null;

  if (resolvedRenderer.kind === "typewriter") {
    return (
      <div className={resolvedClassName}>
        {title && (
          <CodeTitle
            title={title}
            className={resolvedClassNames?.title}
            titleTextClassName={resolvedClassNames?.titleText}
          />
        )}
        <TypewriterCode
          highlighter={resolvedRenderer.highlighter}
          code={currentCode}
          lang={lang}
          theme={resolvedRenderer.theme}
          speed={typewriterSpeed}
          animationDuration={animationDuration}
          lineNumbers={lineNumbers}
          highlightedLines={highlightedLines}
          dimOpacity={dimOpacity}
          className={resolvedClassNames?.content}
          lineClassName={resolvedClassNames?.highlightDim}
          activeLineClassName={resolvedClassNames?.highlightActive}
        />
      </div>
    );
  }

  if (resolvedRenderer.kind === "morph") {
    return (
      <div className={resolvedClassName}>
        {title && (
          <CodeTitle
            title={title}
            className={resolvedClassNames?.title}
            titleTextClassName={resolvedClassNames?.titleText}
          />
        )}
        <div
          className={resolvedClassNames?.content}
          style={highlightedLines ? { position: "relative" } : undefined}
        >
          <ShikiMagicMove
            highlighter={resolvedRenderer.highlighter}
            code={currentCode}
            lang={lang}
            theme={resolvedRenderer.theme}
            options={{
              duration: animationDuration,
              stagger,
              lineNumbers,
              animateContainer: true,
            }}
          />
          {highlightedLines && (
            <LineHighlightOverlay
              code={currentCode}
              highlightedLines={highlightedLines}
              animationDuration={animationDuration}
              dimOpacity={dimOpacity}
              lineClassName={resolvedClassNames?.highlightDim}
              activeLineClassName={resolvedClassNames?.highlightActive}
            />
          )}
        </div>
      </div>
    );
  }

  if (resolvedRenderer.kind === "tokens") {
    return (
      <div className={resolvedClassName}>
        {title && (
          <CodeTitle
            title={title}
            className={resolvedClassNames?.title}
            titleTextClassName={resolvedClassNames?.titleText}
          />
        )}
        <TokenCode
          highlighter={resolvedRenderer.highlighter}
          code={currentCode}
          lang={lang}
          theme={resolvedRenderer.theme}
          animationDuration={animationDuration}
          lineNumbers={lineNumbers}
          highlightedLines={highlightedLines}
          dimOpacity={dimOpacity}
          className={resolvedClassNames?.content}
          lineClassName={resolvedClassNames?.highlightDim}
          activeLineClassName={resolvedClassNames?.highlightActive}
        />
      </div>
    );
  }

  return (
    <div className={resolvedClassName}>
      {title && (
        <CodeTitle
          title={title}
          className={resolvedClassNames?.title}
          titleTextClassName={resolvedClassNames?.titleText}
        />
      )}
      <pre className={resolvedClassNames?.pre}>
        <code>{currentCode}</code>
      </pre>
    </div>
  );
}

type ResolvedCodeRenderer =
  | { readonly kind: "static" }
  | { readonly kind: "tokens"; readonly highlighter: HighlighterCore; readonly theme: string }
  | { readonly kind: "typewriter"; readonly highlighter: HighlighterCore; readonly theme: string }
  | { readonly kind: "morph"; readonly highlighter: HighlighterCore; readonly theme: string };

function resolveCodeRenderer(
  renderer: CodeProps["renderer"],
  animation: CodeProps["animation"],
  highlighter: HighlighterCore | null,
  resolvedTheme: string | null,
): ResolvedCodeRenderer {
  if (!highlighter || !resolvedTheme) {
    return { kind: "static" };
  }

  if (animation === "typewriter") {
    return { kind: "typewriter", highlighter, theme: resolvedTheme };
  }

  if (renderer?.kind === "tokens") {
    return { kind: "tokens", highlighter, theme: resolvedTheme };
  }

  if (renderer?.kind === "static") {
    return { kind: "static" };
  }

  return { kind: "morph", highlighter, theme: resolvedTheme };
}

function CodeTitle({
  title,
  className,
  titleTextClassName,
}: {
  title: string;
  className: string | undefined;
  titleTextClassName: string | undefined;
}) {
  return (
    <div className={className}>
      <span className={titleTextClassName}>{title}</span>
    </div>
  );
}

function LineHighlightOverlay({
  code,
  highlightedLines,
  animationDuration,
  dimOpacity,
  lineClassName,
  activeLineClassName,
}: {
  code: string;
  highlightedLines: Set<number>;
  animationDuration: number;
  dimOpacity: number;
  lineClassName: string | undefined;
  activeLineClassName: string | undefined;
}) {
  const lines = code.split("\n");
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {lines.map((_, lineIndex) => {
        const lineNumber = lineIndex + 1;
        const isDimmed = !highlightedLines.has(lineNumber);
        return (
          <div
            key={`line-${lineNumber}`}
            className={isDimmed ? lineClassName : activeLineClassName}
            style={{
              flex: 1,
              backgroundColor: isDimmed ? getDimOverlayColor(dimOpacity) : "transparent",
              transition: `background-color ${animationDuration}ms ease`,
            }}
          />
        );
      })}
    </div>
  );
}

function getDimOverlayColor(dimOpacity: number): string {
  const clampedDimOpacity = Math.min(Math.max(dimOpacity, 0), 1);
  const overlayAlpha = (1 - clampedDimOpacity) * 0.45;
  return `rgba(128,128,128,${overlayAlpha})`;
}

function TokenCode({
  highlighter,
  code,
  lang,
  theme,
  animationDuration,
  lineNumbers,
  highlightedLines,
  dimOpacity,
  className,
  lineClassName,
  activeLineClassName,
}: {
  highlighter: HighlighterCore;
  code: string;
  lang: string;
  theme: string;
  animationDuration: number;
  lineNumbers: boolean;
  highlightedLines: Set<number> | null;
  dimOpacity: number;
  className: string | undefined;
  lineClassName: string | undefined;
  activeLineClassName: string | undefined;
}) {
  const tokens = useMemo(
    () => highlighter.codeToTokens(code || " ", { lang, theme }),
    [highlighter, code, lang, theme],
  );

  return (
    <pre
      className={className}
      style={{
        margin: 0,
        background: tokens.bg,
        color: tokens.fg,
      }}
    >
      <code>
        {tokens.tokens.map((lineTokens, lineIndex) => {
          const lineNumber = lineIndex + 1;
          const isDimmed = highlightedLines !== null && !highlightedLines.has(lineNumber);
          return (
            <span
              key={`token-line-${lineNumber}`}
              className={isDimmed ? lineClassName : activeLineClassName}
              style={{
                display: "block",
                opacity: isDimmed ? dimOpacity : 1,
                transition: highlightedLines ? `opacity ${animationDuration}ms ease` : undefined,
              }}
            >
              {lineNumbers && (
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    minWidth: "2.5em",
                    marginRight: "1.5em",
                    opacity: 0.35,
                    textAlign: "right",
                  }}
                >
                  {lineNumber}
                </span>
              )}
              {lineTokens.map((token, tokenIndex) => (
                <TokenSpan
                  key={`token-${lineNumber}-${tokenIndex}-${token.offset}`}
                  token={token}
                />
              ))}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

function TokenSpan({ token }: { token: ThemedToken }) {
  const fontStyle = token.fontStyle ?? FONT_STYLE_NONE;

  return (
    <span
      style={{
        color: token.color,
        backgroundColor: token.bgColor,
        fontStyle: fontStyle & FONT_STYLE_ITALIC ? "italic" : undefined,
        fontWeight: fontStyle & FONT_STYLE_BOLD ? "bold" : undefined,
        textDecoration: fontStyle & FONT_STYLE_UNDERLINE ? "underline" : undefined,
        ...token.htmlStyle,
      }}
      {...token.htmlAttrs}
    >
      {token.content}
    </span>
  );
}

function TypewriterCode({
  highlighter,
  code,
  lang,
  theme,
  speed,
  animationDuration,
  lineNumbers,
  highlightedLines,
  dimOpacity,
  className,
  lineClassName,
  activeLineClassName,
}: {
  highlighter: HighlighterCore;
  code: string;
  lang: string;
  theme: string;
  speed: number;
  animationDuration: number;
  lineNumbers: boolean;
  highlightedLines: Set<number> | null;
  dimOpacity: number;
  className: string | undefined;
  lineClassName: string | undefined;
  activeLineClassName: string | undefined;
}) {
  const [state, dispatch] = useReducer(typewriterReducer, {
    visibleChars: 0,
    previousCode: code,
  });

  useEffect(() => {
    dispatch({ type: "syncCode", code });
  }, [code]);

  useEffect(() => {
    if (state.visibleChars >= code.length) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch({ type: "tick", totalChars: code.length });
    }, speed);

    return () => clearTimeout(timer);
  }, [state.visibleChars, code.length, speed]);

  const visibleCode = code.slice(0, state.visibleChars);

  return (
    <TokenCode
      highlighter={highlighter}
      code={visibleCode || " "}
      lang={lang}
      theme={theme}
      animationDuration={animationDuration}
      lineNumbers={lineNumbers}
      highlightedLines={highlightedLines}
      dimOpacity={dimOpacity}
      className={className}
      lineClassName={lineClassName}
      activeLineClassName={activeLineClassName}
    />
  );
}

function typewriterReducer(state: TypewriterState, action: TypewriterAction): TypewriterState {
  switch (action.type) {
    case "syncCode": {
      if (action.code === state.previousCode) {
        return state;
      }

      return {
        visibleChars: 0,
        previousCode: action.code,
      };
    }

    case "tick": {
      if (state.visibleChars >= action.totalChars) {
        return state;
      }

      return {
        ...state,
        visibleChars: state.visibleChars + 1,
      };
    }
  }
}

type ResolvedThemeState = {
  readonly ready: boolean;
  readonly loadedThemeName: string | null;
};

type ResolvedThemeAction =
  | { readonly type: "loading"; readonly themeName: string | null }
  | { readonly type: "ready"; readonly themeName: string | null };

function resolvedThemeReducer(
  state: ResolvedThemeState,
  action: ResolvedThemeAction,
): ResolvedThemeState {
  switch (action.type) {
    case "loading": {
      if (!state.ready && state.loadedThemeName === action.themeName) {
        return state;
      }

      return {
        ready: false,
        loadedThemeName: action.themeName,
      };
    }

    case "ready": {
      if (state.ready && state.loadedThemeName === action.themeName) {
        return state;
      }

      return {
        ready: true,
        loadedThemeName: action.themeName,
      };
    }
  }
}
