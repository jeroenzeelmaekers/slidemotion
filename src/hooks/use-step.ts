import { useContext } from "react";
import { StepContext } from "../core/context.js";

/**
 * Access step-specific information.
 * Must be used within a <Step> component.
 *
 * @example
 * ```tsx
 * const { order, isActive, isVisible, progress, direction } = useStep();
 * ```
 */
export function useStep() {
  const ctx = useContext(StepContext);
  if (!ctx) {
    throw new Error("useStep must be used within <Step>");
  }
  return ctx;
}
