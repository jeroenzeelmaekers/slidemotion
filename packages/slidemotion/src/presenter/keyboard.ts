import { useCallback, useContext, useEffect } from "react";
import { PresentationContext } from "../core/context.js";

// ---------------------------------------------------------------------------
// Keyboard navigation
// Handles keyboard shortcuts for presentation navigation.
// ---------------------------------------------------------------------------

export type KeyboardShortcuts = {
  readonly next: readonly string[];
  readonly prev: readonly string[];
  readonly overview: readonly string[];
  readonly fullscreen: readonly string[];
  readonly speakerNotes: readonly string[];
};

const DEFAULT_SHORTCUTS: KeyboardShortcuts = {
  next: ["ArrowRight", "ArrowDown", " ", "Enter"],
  prev: ["ArrowLeft", "ArrowUp"],
  overview: ["o"],
  fullscreen: ["f"],
  speakerNotes: ["s"],
};

export function useKeyboardNavigation(options?: {
  enabled?: boolean;
  onOverviewToggle?: () => void;
  onFullscreenToggle?: () => void;
  onSpeakerNotesToggle?: () => void;
  shortcuts?: Partial<KeyboardShortcuts>;
}) {
  const enabled = options?.enabled ?? true;
  const ctx = useContext(PresentationContext);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled || !ctx) return;

      // Don't capture keys when user is typing in an input
      const target = e.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      const shortcuts = { ...DEFAULT_SHORTCUTS, ...options?.shortcuts };
      const key = e.key;

      if (shortcuts.next.includes(key)) {
        e.preventDefault();
        ctx.dispatch({ type: "next" });
      } else if (shortcuts.prev.includes(key)) {
        e.preventDefault();
        ctx.dispatch({ type: "prev" });
      } else if (shortcuts.overview.includes(key)) {
        e.preventDefault();
        options?.onOverviewToggle?.();
      } else if (shortcuts.fullscreen.includes(key)) {
        e.preventDefault();
        options?.onFullscreenToggle?.();
      } else if (shortcuts.speakerNotes.includes(key)) {
        e.preventDefault();
        options?.onSpeakerNotesToggle?.();
      }
    },
    [ctx, options],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
