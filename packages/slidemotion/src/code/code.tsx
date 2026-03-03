import {
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { ShikiMagicMove } from "shiki-magic-move/react";
import type { HighlighterCore, ThemeRegistrationRaw } from "shiki";
import { PresentationContext, SlideContext } from "../core/context.js";
import { getSharedHighlighter, SM_CODE_THEME } from "./highlighter.js";
import { parseLineRange, type CodeProps } from "./types.js";
import { useComponentTheme } from "../theme/context.js";
import { mergeClassName, mergeClassNames } from "../theme/merge.js";

// ---------------------------------------------------------------------------
// useResolvedTheme — resolves a theme prop to a string name.
// When given a ThemeRegistrationRaw object, auto-registers it with the
// highlighter and returns the name once ready. Returns null while loading.
// ---------------------------------------------------------------------------

function useResolvedTheme(
  theme: string | ThemeRegistrationRaw,
  highlighter: HighlighterCore | null,
): string | null {
  const themeName = typeof theme === "object" ? theme.name : theme;
  const themeObject = typeof theme === "object" ? theme : null;

  const [ready, setReady] = useState(() => {
    if (!themeObject) return true;
    if (!highlighter || !themeName) return false;
    return highlighter.getLoadedThemes().includes(themeName);
  });

  useEffect(() => {
    if (!themeObject) {
      setReady(true);
      return;
    }
    if (!highlighter || !themeName) return;

    if (highlighter.getLoadedThemes().includes(themeName)) {
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);
    highlighter.loadTheme(themeObject).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [themeObject, themeName, highlighter]);

  if (themeObject && !themeName) {
    throw new Error(
      "<Code> theme object must have a `name` property",
    );
  }

  return ready && themeName ? themeName : null;
}

// ---------------------------------------------------------------------------
// <Code>
// Syntax-highlighted code block with animated transitions between steps.
// Uses Shiki for highlighting and Shiki Magic Move for token-level morphing.
// Fully headless — all visual styling via className/classNames props.
// ---------------------------------------------------------------------------

export function Code({
  lang,
  theme = SM_CODE_THEME,
  steps,
  highlighter: externalHighlighter,
  highlight,
  dimOpacity = 0.3,
  lineNumbers = false,
  title,
  animation = "morph",
  animationDuration = 500,
  stagger = 0,
  typewriterSpeed = 30,
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

  // Resolve the highlighter and theme
  const highlighter = externalHighlighter ?? getSharedHighlighter();
  const resolvedTheme = useResolvedTheme(theme, highlighter);

  // Register steps with the step registry
  const baseOrder = stepOffset ?? 1;
  useEffect(() => {
    // Register one step for each transition (steps.length - 1 transitions)
    // But we register the max order so the engine knows how many steps exist
    if (steps.length > 1) {
      for (let i = 0; i < steps.length - 1; i++) {
        stepRegistry.register(slideIndex, `${instanceId}-code-${i}`, baseOrder + i);
      }
    }
    return () => {
      for (let i = 0; i < steps.length - 1; i++) {
        stepRegistry.unregister(slideIndex, `${instanceId}-code-${i}`);
      }
    };
  }, [stepRegistry, slideIndex, instanceId, baseOrder, steps.length]);

  // Determine which code step to show based on current presentation step
  const currentStep = state.currentSlide === slideIndex ? state.currentStep : 0;
  const codeStepIndex = Math.min(
    Math.max(0, currentStep - baseOrder + 1),
    steps.length - 1,
  );
  const currentCode = steps[codeStepIndex] ?? steps[0] ?? "";

  // Line highlighting
  const highlightedLines = highlight?.[codeStepIndex]
    ? parseLineRange(highlight[codeStepIndex])
    : null;

  if (!highlighter || !resolvedTheme) {
    return (
      <div className={resolvedClassName}>
        {title && <CodeTitle title={title} className={resolvedClassNames?.title} titleTextClassName={resolvedClassNames?.titleText} />}
        <pre className={resolvedClassNames?.pre}>
          <code>{currentCode}</code>
        </pre>
      </div>
    );
  }

  if (animation === "typewriter") {
    return (
      <div className={resolvedClassName}>
        {title && <CodeTitle title={title} className={resolvedClassNames?.title} titleTextClassName={resolvedClassNames?.titleText} />}
        <TypewriterCode
          highlighter={highlighter}
          code={currentCode}
          lang={lang}
          theme={resolvedTheme}
          speed={typewriterSpeed}
          lineNumbers={lineNumbers}
          className={resolvedClassNames?.content}
        />
      </div>
    );
  }

  // Morph mode (default): use ShikiMagicMove
  return (
    <div className={resolvedClassName}>
      {title && <CodeTitle title={title} className={resolvedClassNames?.title} titleTextClassName={resolvedClassNames?.titleText} />}
      <div
        className={resolvedClassNames?.content}
        style={highlightedLines ? { position: "relative" } : undefined}
      >
        <ShikiMagicMove
          highlighter={highlighter}
          code={currentCode}
          lang={lang}
          theme={resolvedTheme}
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
            dimOpacity={dimOpacity}
            lineClassName={resolvedClassNames?.highlightDim}
            activeLineClassName={resolvedClassNames?.highlightActive}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

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
  dimOpacity,
  lineClassName,
  activeLineClassName,
}: {
  code: string;
  highlightedLines: Set<number>;
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
      {lines.map((_, i) => {
        const lineNum = i + 1;
        const isDimmed = !highlightedLines.has(lineNum);
        return (
          <div
            key={i}
            className={isDimmed ? lineClassName : activeLineClassName}
            style={{
              flex: 1,
              backgroundColor: isDimmed
                ? `rgba(0,0,0,${1 - dimOpacity})`
                : "transparent",
              transition: "background-color 300ms ease",
            }}
          />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Typewriter mode
// Shows code appearing character by character.
// ---------------------------------------------------------------------------

function TypewriterCode({
  highlighter,
  code,
  lang,
  theme,
  speed,
  lineNumbers,
  className,
}: {
  highlighter: NonNullable<CodeProps["highlighter"]>;
  code: string;
  lang: string;
  theme: string;
  speed: number;
  lineNumbers: boolean;
  className: string | undefined;
}) {
  const [visibleChars, setVisibleChars] = useState(0);
  const [prevCode, setPrevCode] = useState(code);

  // When code changes, start typewriter from 0
  useEffect(() => {
    if (code !== prevCode) {
      setVisibleChars(0);
      setPrevCode(code);
    }
  }, [code, prevCode]);

  // Animate character reveal
  useEffect(() => {
    if (visibleChars >= code.length) return;

    const timer = setTimeout(() => {
      setVisibleChars((c) => c + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [visibleChars, code.length, speed]);

  const visibleCode = code.slice(0, visibleChars);
  const html = highlighter.codeToHtml(visibleCode || " ", {
    lang,
    theme,
  });

  return (
    <div
      className={className}
      style={{ position: "relative" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
