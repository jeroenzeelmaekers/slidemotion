import type { EventTriggerHandle } from "./use-event-trigger.js";

/**
 * Returns the animation progress (0→1) for an event trigger.
 * Shorthand for `trigger.progress`.
 *
 * @example
 * ```tsx
 * const hover = useEventTrigger("hover");
 * const progress = useEventProgress(hover);
 * const scale = interpolate(progress, [0, 1], [1, 1.05]);
 * ```
 */
export function useEventProgress(trigger: EventTriggerHandle): number {
  return trigger.progress;
}
