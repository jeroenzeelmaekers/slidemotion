import { useCallback, useContext, useId, useRef, useEffect } from "react";
import { PresentationContext } from "../core/context.js";
import {
  createAnimationLoop,
  tweenMode,
  type AnimationLoopCallbacks,
} from "../animation/animation-loop.js";

export type EventTriggerHandle = {
  readonly name: string;
  readonly activate: () => void;
  readonly deactivate: () => void;
  readonly toggle: () => void;
  readonly progress: number;
};

/**
 * Creates an event trigger that can drive animations independently of steps.
 *
 * Each event trigger has its own progress (0→1) that animates when
 * activated/deactivated. Use `useEventProgress` or read `.progress`
 * to drive animations.
 *
 * @param name - Unique name for this event trigger
 * @param duration - Animation duration in ms (default: 200)
 *
 * @example
 * ```tsx
 * const hover = useEventTrigger("card-hover", 200);
 * const scale = interpolate(hover.progress, [0, 1], [1, 1.05]);
 *
 * <div
 *   style={{ transform: `scale(${scale})` }}
 *   onMouseEnter={hover.activate}
 *   onMouseLeave={hover.deactivate}
 * />
 * ```
 */
export function useEventTrigger(name: string, duration: number = 200): EventTriggerHandle {
  const ctx = useContext(PresentationContext);
  if (!ctx) {
    throw new Error("useEventTrigger must be used within <Presentation>");
  }

  const { state, dispatch } = ctx;

  const loopRef = useRef<ReturnType<typeof createAnimationLoop> | null>(null);

  // Lazily create animation loop
  if (!loopRef.current) {
    const callbacks: AnimationLoopCallbacks = {
      onProgress: (progress) => {
        dispatch({ type: "updateEventProgress", name, progress });
      },
      onComplete: () => {
        // Animation finished
      },
    };
    loopRef.current = createAnimationLoop(callbacks);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      loopRef.current?.stop();
    };
  }, []);

  const activate = useCallback(() => {
    dispatch({ type: "activateEvent", name });
    loopRef.current?.start(tweenMode(duration));
  }, [dispatch, name, duration]);

  const deactivate = useCallback(() => {
    dispatch({ type: "deactivateEvent", name });
    loopRef.current?.startReverse(tweenMode(duration));
  }, [dispatch, name, duration]);

  const toggle = useCallback(() => {
    const current = state.events.get(name);
    if (current?.active) {
      deactivate();
    } else {
      activate();
    }
  }, [state.events, name, activate, deactivate]);

  const eventState = state.events.get(name);
  const progress = eventState?.progress ?? 0;

  return { name, activate, deactivate, toggle, progress };
}
