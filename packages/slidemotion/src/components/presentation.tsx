import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useSyncExternalStore } from "react";
import type { PresentationConfig, PresentationAction, SlideTransition } from "../core/types.js";
import { createInitialState, presentationReducer, resolveSlideTransitionDuration } from "../core/engine.js";
import { createStepRegistry, type StepRegistry } from "../core/step-registry.js";
import { PresentationContext, type PresentationContextValue, type SlideTransitionRegistry, type SlideIndexCounter } from "../core/context.js";
import {
  createAnimationLoop,
  tweenMode,
} from "../animation/animation-loop.js";
import { linear } from "../animation/easing.js";
import type { Theme } from "../theme/types.js";
import { ThemeProvider } from "../theme/context.js";

// ---------------------------------------------------------------------------
// <Presentation>
// Root context provider. Provides the engine, step registry, and animation
// loop. Does NOT render the slide viewport — use <Presenter> for that.
// ---------------------------------------------------------------------------

export type PresentationProps = {
  readonly children: ReactNode;
  /** Theme providing CSS variables and default classNames for all components. */
  readonly theme?: Theme | undefined;
  readonly width?: number;
  readonly height?: number;
  /** Default step animation duration in ms. Default: 300 */
  readonly defaultStepDuration?: number;
};

export function Presentation({
  children,
  theme,
  width = 1920,
  height = 1080,
  defaultStepDuration = 300,
}: PresentationProps) {
  const config: PresentationConfig = useMemo(
    () => ({ width, height, defaultStepDuration }),
    [width, height, defaultStepDuration],
  );

  // -- Step registry (stable across renders) --
  const registryRef = useRef<StepRegistry | null>(null);
  if (!registryRef.current) {
    registryRef.current = createStepRegistry();
  }
  const stepRegistry = registryRef.current;

  // -- Slide transition registry --
  const slideTransitionsRef = useRef<Map<number, SlideTransition>>(new Map());
  const slideTransitionRegistry: SlideTransitionRegistry = useMemo(() => ({
    register: (slideIndex: number, transition: SlideTransition) => {
      slideTransitionsRef.current.set(slideIndex, transition);
    },
    get: (slideIndex: number): SlideTransition => {
      return slideTransitionsRef.current.get(slideIndex) ?? "none";
    },
  }), []);

  const getSlideTransition = useCallback(
    (slideIndex: number) => slideTransitionRegistry.get(slideIndex),
    [slideTransitionRegistry],
  );

  // -- State management --
  const stateRef = useRef(createInitialState(config));
  const slideCountRef = useRef(0);
  const renderRef = useRef(0);
  const forceRenderCallbacks = useRef(new Set<() => void>());

  const setSlideCount = useCallback((count: number) => {
    if (slideCountRef.current !== count) {
      slideCountRef.current = count;
      renderRef.current++;
      for (const cb of forceRenderCallbacks.current) {
        cb();
      }
    }
  }, []);

  // Subscribe to step registry changes so we re-render when steps register
  useSyncExternalStore(
    stepRegistry.subscribe,
    () => renderRef.current,
    () => renderRef.current,
  );

  // -- Animation loops --
  const stepLoopRef = useRef<ReturnType<typeof createAnimationLoop> | null>(null);
  const slideLoopRef = useRef<ReturnType<typeof createAnimationLoop> | null>(null);

  const dispatch = useCallback((action: PresentationAction) => {
    const prev = stateRef.current;
    const next = presentationReducer(
      prev,
      action,
      stepRegistry,
      slideCountRef.current,
      getSlideTransition,
    );

    if (next !== prev) {
      stateRef.current = next;
      renderRef.current++;

      for (const cb of forceRenderCallbacks.current) {
        cb();
      }

      // Slide transition just started
      if (
        next.previousSlide !== null &&
        prev.previousSlide === null &&
        next.animationStatus === "running"
      ) {
        const transitionSlide = next.direction === "forward"
          ? next.currentSlide
          : prev.currentSlide;
        const transition = getSlideTransition(transitionSlide);
        const duration = resolveSlideTransitionDuration(transition);

        if (duration > 0) {
          if (!slideLoopRef.current) {
            slideLoopRef.current = createAnimationLoop({
              onProgress: (progress) => {
                dispatch({ type: "updateSlideTransition", progress });
              },
              onComplete: () => {
                dispatch({ type: "completeSlideTransition" });
              },
            });
          }

          const mode = tweenMode(duration, linear);
          slideLoopRef.current.start(mode);
          return;
        }
      }

      // Step animation just started (only if no slide transition is active)
      if (
        next.animationStatus === "running" &&
        prev.animationStatus !== "running" &&
        next.previousSlide === null
      ) {
        if (!stepLoopRef.current) {
          stepLoopRef.current = createAnimationLoop({
            onProgress: (progress) => {
              dispatch({ type: "updateStepProgress", progress });
            },
            onComplete: () => {
              dispatch({ type: "completeAnimation" });
            },
          });
        }

        const mode = tweenMode(config.defaultStepDuration, linear);
        if (next.direction === "forward") {
          stepLoopRef.current.start(mode);
        } else {
          stepLoopRef.current.startReverse(mode);
        }
      }
    }
  }, [stepRegistry, config.defaultStepDuration, getSlideTransition]);

  // Force re-render hook using useSyncExternalStore
  const subscribe = useCallback((cb: () => void) => {
    forceRenderCallbacks.current.add(cb);
    return () => { forceRenderCallbacks.current.delete(cb); };
  }, []);

  useSyncExternalStore(
    subscribe,
    () => renderRef.current,
    () => renderRef.current,
  );

  // Cleanup
  useEffect(() => {
    return () => {
      stepLoopRef.current?.stop();
      slideLoopRef.current?.stop();
    };
  }, []);

  // -- Slide index counter (reset each render, read by <Slide>) --
  const slideIndexRef = useRef(0);
  slideIndexRef.current = 0; // reset every render
  const slideIndexCounter: SlideIndexCounter = useMemo(() => ({
    next: () => slideIndexRef.current++,
    get count() { return slideIndexRef.current; },
  }), []);

  const contextValue: PresentationContextValue = useMemo(
    () => ({
      state: stateRef.current,
      dispatch,
      stepRegistry,
      slideCount: slideCountRef.current,
      setSlideCount,
      slideTransitionRegistry,
      slideIndexCounter,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, stepRegistry, setSlideCount, slideTransitionRegistry, slideIndexCounter, renderRef.current],
  );

  const content = (
    <PresentationContext.Provider value={contextValue}>
      {children}
    </PresentationContext.Provider>
  );

  return theme
    ? <ThemeProvider theme={theme}>{content}</ThemeProvider>
    : content;
}
