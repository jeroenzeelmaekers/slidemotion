import { useContext, useEffect, type ReactNode } from "react";
import { PresentationContext, SlideContext } from "../core/context.js";

// ---------------------------------------------------------------------------
// <SpeakerNotes>
// Content placed here is shown in the speaker view, not on the slide.
// Renders nothing in the main presentation view.
// ---------------------------------------------------------------------------

export type SpeakerNotesProps = {
  readonly children: ReactNode;
};

/**
 * Defines speaker notes for the current slide.
 * These are only visible in the speaker view window, not during presentation.
 *
 * @example
 * ```tsx
 * <Slide id="intro">
 *   <h1>Welcome</h1>
 *   <SpeakerNotes>
 *     Remember to greet the audience and introduce yourself.
 *   </SpeakerNotes>
 * </Slide>
 * ```
 */
export function SpeakerNotes({ children }: SpeakerNotesProps) {
  const presCtx = useContext(PresentationContext);
  const slideCtx = useContext(SlideContext);

  if (!presCtx) {
    throw new Error("<SpeakerNotes> must be used within <Presentation>");
  }
  if (!slideCtx) {
    throw new Error("<SpeakerNotes> must be used within <Slide>");
  }

  useEffect(() => {
    presCtx.speakerNotesRegistry.register(slideCtx.index, children);
    return () => {
      presCtx.speakerNotesRegistry.unregister(slideCtx.index);
    };
  }, [presCtx.speakerNotesRegistry, slideCtx.index, children]);

  // In the main presentation view, speaker notes render nothing.
  // The speaker view reads these via a separate mechanism.
  return null;
}
