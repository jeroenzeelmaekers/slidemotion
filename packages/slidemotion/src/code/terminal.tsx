import {
  useContext,
  useEffect,
  useId,
  useReducer,
} from "react";
import { PresentationContext, SlideContext } from "../core/context.js";
import type { TerminalProps } from "./types.js";
import { useComponentTheme } from "../theme/context.js";
import { mergeClassName, mergeClassNames } from "../theme/merge.js";
import {
  countCompletedStepOrders,
  resolveStepAliases,
  resolveStepOrders,
} from "./step-orders.js";

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
  atSteps,
  stepOrders: explicitStepOrders,
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

  const resolvedExplicitStepOrders = resolveStepAliases(
    atSteps,
    explicitStepOrders,
    "Terminal",
  );

  const stepOrders = resolveStepOrders(
    steps.length,
    stepOffset,
    resolvedExplicitStepOrders,
    "Terminal",
  );

  // Register steps
  useEffect(() => {
    for (let i = 0; i < stepOrders.length; i++) {
      const order = stepOrders[i];
      if (order !== undefined) {
        stepRegistry.register(slideIndex, `${instanceId}-term-${i}`, order);
      }
    }
    return () => {
      for (let i = 0; i < stepOrders.length; i++) {
        stepRegistry.unregister(slideIndex, `${instanceId}-term-${i}`);
      }
    };
  }, [stepRegistry, slideIndex, instanceId, stepOrders]);

  // Determine how many terminal steps are visible
  const currentStep = state.currentSlide === slideIndex ? state.currentStep : 0;
  const visibleStepCount = countCompletedStepOrders(currentStep, stepOrders);

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
            key={`${step.command}-${step.output ?? ""}`}
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
  const [state, dispatch] = useReducer(terminalEntryReducer, {
    typedChars: isLatest ? 0 : command.length,
    showOutput: isLatest ? false : output !== undefined,
  });

  // Reset when this entry becomes the latest (just appeared)
  useEffect(() => {
    dispatch({
      type: "syncLatest",
      isLatest,
      commandLength: command.length,
      hasOutput: output !== undefined,
    });
  }, [isLatest, command.length]);

  // Typewriter effect for the command
  useEffect(() => {
    if (state.typedChars >= command.length) {
      // Command fully typed → show output after a short delay
      if (output && !state.showOutput) {
        const timer = setTimeout(() => dispatch({ type: "showOutput" }), 200);
        return () => clearTimeout(timer);
      }
      return;
    }

    const timer = setTimeout(() => {
      dispatch({ type: "tick", commandLength: command.length });
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [state.typedChars, command.length, typingSpeed, output, state.showOutput]);

  const visibleCommand = command.slice(0, state.typedChars);
  const isTyping = state.typedChars < command.length;

  return (
    <div>
      <div className={classNames?.line}>
        <span className={classNames?.prompt}>{prompt}</span>
        <span>{visibleCommand}</span>
        {isTyping && <span className={classNames?.cursor} />}
      </div>
      {state.showOutput && output && (
        <div className={classNames?.output}>
          {output.split("\n").map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}

type TerminalEntryState = {
  readonly typedChars: number;
  readonly showOutput: boolean;
};

type TerminalEntryAction =
  | {
      readonly type: "syncLatest";
      readonly isLatest: boolean;
      readonly commandLength: number;
      readonly hasOutput: boolean;
    }
  | {
      readonly type: "tick";
      readonly commandLength: number;
    }
  | { readonly type: "showOutput" };

function terminalEntryReducer(
  state: TerminalEntryState,
  action: TerminalEntryAction,
): TerminalEntryState {
  switch (action.type) {
    case "syncLatest": {
      if (action.isLatest) {
        if (state.typedChars === 0 && !state.showOutput) {
          return state;
        }

        return {
          typedChars: 0,
          showOutput: false,
        };
      }

      if (state.typedChars === action.commandLength && state.showOutput === action.hasOutput) {
        return state;
      }

      return {
        typedChars: action.commandLength,
        showOutput: action.hasOutput,
      };
    }

    case "tick": {
      if (state.typedChars >= action.commandLength) {
        return state;
      }

      return {
        ...state,
        typedChars: state.typedChars + 1,
      };
    }

    case "showOutput": {
      if (state.showOutput) {
        return state;
      }

      return {
        ...state,
        showOutput: true,
      };
    }
  }
}
