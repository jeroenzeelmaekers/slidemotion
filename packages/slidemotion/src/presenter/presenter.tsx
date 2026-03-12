import React, {
  useCallback,
  useContext,
  useEffect,
  Children,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PresentationContext, SlideRenderIndexContext } from "../core/context.js";
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
  /** Render a small dev panel with current state. Default: false */
  readonly devtools?: boolean | undefined;
};

export function Presenter({
  children,
  controls = true,
  keyboard = true,
  className,
  classNames,
  controlsProps,
  overviewProps,
  devtools = false,
}: PresenterProps) {
  const ctx = useContext(PresentationContext);
  if (!ctx) {
    throw new Error("<Presenter> must be used within <Presentation>");
  }

  const themeSlot = useComponentTheme("Presenter");
  const resolvedClassName = mergeClassName(themeSlot?.className, className);
  const resolvedClassNames = mergeClassNames(themeSlot?.classNames, classNames);

  const slideChildren = Children.toArray(children);

  useEffect(() => {
    ctx.setSlideCount(slideChildren.length);
  }, [ctx, slideChildren.length]);

  const [showOverview, setShowOverview] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);

  const speakerNotes = useMemo(
    () => ctx.speakerNotesRegistry.get(ctx.state.currentSlide),
    [ctx.speakerNotesRegistry, ctx.state.currentSlide],
  );

  const toggleOverview = useCallback(() => {
    setShowOverview((v) => !v);
  }, []);

  const toggleSpeakerNotes = useCallback(() => {
    setShowSpeakerNotes((v) => !v);
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
    onSpeakerNotesToggle: toggleSpeakerNotes,
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
          {slideChildren.map((child, index) => (
            <SlideRenderIndexContext.Provider
              key={getSlideChildKey(child, index, "slide")}
              value={index}
            >
              {child}
            </SlideRenderIndexContext.Provider>
          ))}
        </div>
      </div>

      {/* Controls */}
      {controls && <Controls {...controlsProps} />}

      {devtools && (
        <DevtoolsPanel
          currentSlide={ctx.state.currentSlide}
          currentStep={ctx.state.currentStep}
          slideCount={ctx.slideCount}
          animationStatus={ctx.state.animationStatus}
          direction={ctx.state.direction}
        />
      )}

      {showSpeakerNotes && speakerNotes && (
        <SpeakerNotesPanel onClose={toggleSpeakerNotes}>{speakerNotes}</SpeakerNotesPanel>
      )}

      {/* Overview modal */}
      {showOverview && (
        <Overview {...overviewProps} onClose={() => setShowOverview(false)}>
          {slideChildren.map((child, index) => (
            <SlideRenderIndexContext.Provider
              key={getSlideChildKey(child, index, "overview-slide")}
              value={index}
            >
              {child}
            </SlideRenderIndexContext.Provider>
          ))}
        </Overview>
      )}
    </div>
  );
}

function getSlideChildKey(child: ReactNode, index: number, prefix: string): string {
  if (React.isValidElement(child) && child.key !== null) {
    return String(child.key);
  }

  return `${prefix}-${index}`;
}

function DevtoolsPanel({
  currentSlide,
  currentStep,
  slideCount,
  animationStatus,
  direction,
}: {
  currentSlide: number;
  currentStep: number;
  slideCount: number;
  animationStatus: string;
  direction: string;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1100,
        padding: 12,
        borderRadius: 8,
        background: "rgba(17, 24, 39, 0.9)",
        color: "white",
        fontFamily: "ui-monospace, SFMono-Regular, monospace",
        fontSize: 12,
      }}
    >
      {`slide ${currentSlide + 1}/${slideCount} | step ${currentStep} | ${animationStatus} | ${direction}`}
    </div>
  );
}

function SpeakerNotesPanel({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 1100,
        width: 360,
        maxWidth: "calc(100vw - 32px)",
        maxHeight: "40vh",
        overflow: "auto",
        borderRadius: 12,
        padding: 16,
        background: "rgba(255, 255, 255, 0.96)",
        color: "#111827",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.18)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <strong>Speaker notes</strong>
        <button type="button" onClick={onClose} aria-label="Close speaker notes">
          Close
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
}
