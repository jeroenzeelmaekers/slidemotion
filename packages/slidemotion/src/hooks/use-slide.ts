import { useContext } from "react";
import { SlideContext } from "../core/context.js";

/**
 * Access slide-specific information.
 * Must be used within a <Slide> component.
 *
 * @example
 * ```tsx
 * const { id, index, isActive, transition } = useSlide();
 * ```
 */
export function useSlide() {
  const ctx = useContext(SlideContext);
  if (!ctx) {
    throw new Error("useSlide must be used within <Slide>");
  }
  return ctx;
}
