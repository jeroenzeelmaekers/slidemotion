import {
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { PresentationContext } from "../core/context.js";
import { Controls, type ControlsProps } from "./controls.js";
import { Overview, type OverviewProps } from "./overview.js";
import { useKeyboardNavigation } from "./keyboard.js";
import { useComponentTheme } from "../theme/context.js";
import { mergeClassName, mergeClassNames } from "../theme/merge.js";

// ---------------------------------------------------------------------------
// <Presenter>
// Renders the slide viewport with navigation controls, keyboard shortcuts,
// overview mode, and fullscreen support.
// Must be used within <Presentation>.
// Slides (<Slide>) are direct children of <Presenter>.
// Fully headless — all visual styling via className/classNames props.
// ---------------------------------------------------------------------------

export type PresenterClassNames = {
  /** Wrapper around the viewport centering it. */
  readonly viewport?: string | undefined;
  /** The slide canvas (position:relative, overflow:hidden is applied). */
  readonly canvas?: string | undefined;
};

export type PresenterProps = {
  readonly children: ReactNode;
  /** Show navigation controls bar. Default: true */
  readonly controls?: boolean;
  /** Enable keyboard navigation. Default: true */
  readonly keyboard?: boolean;
  /** CSS class for the outer container. */
  readonly className?: string | undefined;
  /** CSS classes for internal elements. */
  readonly classNames?: PresenterClassNames | undefined;
  /** Props forwarded to the <Controls> component. */
  readonly controlsProps?: Omit<ControlsProps, never> | undefined;
  /** Props forwarded to the <Overview> component (excluding onClose/children). */
  readonly overviewProps?: Omit<OverviewProps, "onClose" | "children"> | undefined;
};

export function Presenter({
  children,
  controls = true,
  keyboard = true,
  className,
  classNames,
  controlsProps,
  overviewProps,
}: PresenterProps) {
  const ctx = useContext(PresentationContext);
  if (!ctx) {
    throw new Error("<Presenter> must be used within <Presentation>");
  }

  const themeSlot = useComponentTheme("Presenter");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);
  const resolvedClassNames = mergeClassNames(themeSlot?.classNames, classNames);

  // Slide count is derived from the counter after children render.
  // useEffect runs after render, so slideIndexCounter.count reflects
  // how many <Slide> components called next() this pass.
  useEffect(() => {
    ctx.setSlideCount(ctx.slideIndexCounter.count);
  });

  const [showOverview, setShowOverview] = useState(false);

  const toggleOverview = useCallback(() => {
    setShowOverview((v) => !v);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  // Keyboard navigation
  useKeyboardNavigation({
    enabled: keyboard,
    onOverviewToggle: toggleOverview,
    onFullscreenToggle: toggleFullscreen,
  });

  const { width, height } = ctx.state.config;
  const isIdle = ctx.state.animationStatus === "idle";

  return (
    <div className={resolvedClassName}>
      {/* Slide viewport */}
      <div className={resolvedClassNames?.viewport}>
        <div
          className={resolvedClassNames?.canvas}
          style={{
            position: "relative",
            width: `${width}px`,
            height: `${height}px`,
            overflow: "hidden",
          }}
          data-slidemotion-root=""
          data-slidemotion-slide-count={ctx.slideCount}
          data-slidemotion-current-slide={ctx.state.currentSlide}
          data-slidemotion-current-step={ctx.state.currentStep}
          {...(isIdle ? { "data-slidemotion-idle": "" } : {})}
        >
          {children}
        </div>
      </div>

      {/* Controls */}
      {controls && <Controls {...controlsProps} />}

      {/* Overview modal */}
      {showOverview && (
        <Overview
          {...overviewProps}
          onClose={() => setShowOverview(false)}
        >
          {children}
        </Overview>
      )}
    </div>
  );
}
