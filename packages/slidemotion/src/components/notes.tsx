import type { ReactNode } from "react";

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
export function SpeakerNotes(_props: SpeakerNotesProps) {
  // In the main presentation view, speaker notes render nothing.
  // The speaker view reads these via a separate mechanism.
  return null;
}
