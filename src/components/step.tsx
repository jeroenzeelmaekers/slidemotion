import {
  useContext,
  useEffect,
  useId,
  useMemo,
  type ReactNode,
} from "react";
import {
  PresentationContext,
  SlideContext,
  StepContext,
  type StepContextValue,
} from "../core/context.js";

// ---------------------------------------------------------------------------
// <Step>
// Wraps content that appears/animates at a specific step order.
// Registers itself with the step registry on mount.
// ---------------------------------------------------------------------------

export type StepProps = {
  readonly children: ReactNode;
  /** The step order (1-indexed). Step 0 is the initial slide state. */
  readonly order: number;
  /** Override the default step animation duration (ms). */
  readonly duration?: number;
};

export function Step({ children, order }: StepProps) {
  const presCtx = useContext(PresentationContext);
  const slideCtx = useContext(SlideContext);

  if (!presCtx) {
    throw new Error("<Step> must be used within <Presentation>");
  }
  if (!slideCtx) {
    throw new Error("<Step> must be used within <Slide>");
  }

  const instanceId = useId();
  const { stepRegistry, state } = presCtx;
  const { index: slideIndex } = slideCtx;

  // Register this step on mount, unregister on unmount
  useEffect(() => {
    stepRegistry.register(slideIndex, instanceId, order);
    return () => {
      stepRegistry.unregister(slideIndex, instanceId);
    };
  }, [stepRegistry, slideIndex, instanceId, order]);

  // Determine this step's state
  const currentStep = state.currentStep;
  const stepProgress = state.stepProgress;
  const direction = state.direction;

  const isActive = currentStep === order;
  const isVisible = currentStep >= order;

  // Progress for this specific step:
  // - If this step is currently animating in: use stepProgress
  // - If this step is already past: 1
  // - If this step hasn't been reached: 0
  let progress: number;
  if (isActive && state.animationStatus === "running") {
    progress = stepProgress;
  } else if (isVisible) {
    progress = 1;
  } else {
    progress = 0;
  }

  const contextValue: StepContextValue = useMemo(
    () => ({
      order,
      isActive,
      isVisible,
      progress,
      direction,
    }),
    [order, isActive, isVisible, progress, direction],
  );

  // Don't render if the step hasn't been reached yet
  if (!isVisible && progress === 0) {
    return null;
  }

  return (
    <StepContext.Provider value={contextValue}>
      {children}
    </StepContext.Provider>
  );
}
