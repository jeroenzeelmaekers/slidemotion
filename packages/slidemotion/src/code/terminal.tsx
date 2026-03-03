import {
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { PresentationContext, SlideContext } from "../core/context.js";
import type { TerminalProps } from "./types.js";
import { useComponentTheme } from "../theme/context.js";
import { mergeClassName, mergeClassNames } from "../theme/merge.js";

// ---------------------------------------------------------------------------
// <Terminal>
// Simulates a terminal with typed commands and output reveal.
// Each step types a command, then reveals its output.
// Fully headless — all visual styling via className/classNames props.
// ---------------------------------------------------------------------------

export function Terminal({
  title = "Terminal",
  steps,
  typingSpeed = 40,
  prompt = "$",
  stepOffset,
  className,
  classNames,
}: TerminalProps) {
  const presCtx = useContext(PresentationContext);
  const slideCtx = useContext(SlideContext);

  if (!presCtx) throw new Error("<Terminal> must be used within <Presentation>");
  if (!slideCtx) throw new Error("<Terminal> must be used within <Slide>");

  const themeSlot = useComponentTheme("Terminal");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);
  const resolvedClassNames = mergeClassNames(themeSlot?.classNames, classNames);

  const instanceId = useId();
  const { stepRegistry, state } = presCtx;
  const { index: slideIndex } = slideCtx;

  const baseOrder = stepOffset ?? 1;

  // Register steps
  useEffect(() => {
    for (let i = 0; i < steps.length; i++) {
      stepRegistry.register(slideIndex, `${instanceId}-term-${i}`, baseOrder + i);
    }
    return () => {
      for (let i = 0; i < steps.length; i++) {
        stepRegistry.unregister(slideIndex, `${instanceId}-term-${i}`);
      }
    };
  }, [stepRegistry, slideIndex, instanceId, baseOrder, steps.length]);

  // Determine how many terminal steps are visible
  const currentStep = state.currentSlide === slideIndex ? state.currentStep : 0;
  const visibleStepCount = Math.min(
    Math.max(0, currentStep - baseOrder + 1),
    steps.length,
  );

  return (
    <div className={resolvedClassName}>
      {/* Chrome bar */}
      <div className={resolvedClassNames?.chrome}>
        <div className={resolvedClassNames?.dots}>
          <div className={resolvedClassNames?.dotClose} />
          <div className={resolvedClassNames?.dotMinimize} />
          <div className={resolvedClassNames?.dotMaximize} />
        </div>
        <span className={resolvedClassNames?.title}>{title}</span>
      </div>

      {/* Terminal body */}
      <div className={resolvedClassNames?.body}>
        {steps.slice(0, visibleStepCount).map((step, i) => (
          <TerminalEntry
            key={i}
            command={step.command}
            output={step.output}
            prompt={prompt}
            typingSpeed={typingSpeed}
            isLatest={i === visibleStepCount - 1}
            classNames={resolvedClassNames}
          />
        ))}

        {/* Cursor on empty line */}
        <div className={resolvedClassNames?.line}>
          <span className={resolvedClassNames?.prompt}>{prompt}</span>
          <span className={resolvedClassNames?.cursor} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TerminalEntry
// ---------------------------------------------------------------------------

function TerminalEntry({
  command,
  output,
  prompt,
  typingSpeed,
  isLatest,
  classNames,
}: {
  command: string;
  output?: string | undefined;
  prompt: string;
  typingSpeed: number;
  isLatest: boolean;
  classNames: TerminalProps["classNames"];
}) {
  const [typedChars, setTypedChars] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  // Reset when this entry becomes the latest (just appeared)
  useEffect(() => {
    if (isLatest) {
      setTypedChars(0);
      setShowOutput(false);
    } else {
      // Previous entries are fully typed
      setTypedChars(command.length);
      setShowOutput(true);
    }
  }, [isLatest, command.length]);

  // Typewriter effect for the command
  useEffect(() => {
    if (typedChars >= command.length) {
      // Command fully typed → show output after a short delay
      if (output && !showOutput) {
        const timer = setTimeout(() => setShowOutput(true), 200);
        return () => clearTimeout(timer);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTypedChars((c) => c + 1);
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typedChars, command.length, typingSpeed, output, showOutput]);

  const visibleCommand = command.slice(0, typedChars);
  const isTyping = typedChars < command.length;

  return (
    <div>
      <div className={classNames?.line}>
        <span className={classNames?.prompt}>{prompt}</span>
        <span>{visibleCommand}</span>
        {isTyping && <span className={classNames?.cursor} />}
      </div>
      {showOutput && output && (
        <div className={classNames?.output}>
          {output.split("\n").map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
