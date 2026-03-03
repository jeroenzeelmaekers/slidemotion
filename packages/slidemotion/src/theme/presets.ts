import { defineTheme } from "./types.js";

// ---------------------------------------------------------------------------
// Default theme preset
//
// Uses Tailwind utilities referencing --sm-* CSS tokens defined in
// `styles.css`. Consumers import the stylesheet and get a working theme
// with zero configuration.
// ---------------------------------------------------------------------------

export const defaultTheme = defineTheme({
  Slide: {
    className: "flex flex-col bg-sm-background text-sm-foreground",
  },

  Presenter: {
    className: "flex flex-col h-screen bg-sm-background",
    classNames: {
      viewport: "flex-1 flex items-center justify-center overflow-hidden",
    },
  },

  Controls: {
    className:
      "flex items-center justify-center gap-4 px-4 py-2 bg-sm-surface text-sm-surface-foreground text-sm select-none",
    classNames: {
      prev: "bg-transparent border border-sm-border text-sm-foreground px-3 py-1 rounded-sm cursor-pointer text-base",
      next: "bg-transparent border border-sm-border text-sm-foreground px-3 py-1 rounded-sm cursor-pointer text-base",
      counter: "tabular-nums",
      step: "text-sm-muted-foreground",
    },
  },

  Overview: {
    className:
      "bg-sm-surface/95 flex items-center justify-center z-[1000]",
    classNames: {
      grid: "grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 p-8 max-w-[1200px] w-full",
      card: "aspect-video bg-sm-muted rounded-sm flex items-center justify-center cursor-pointer border-none text-sm-foreground text-2xl font-bold outline-1 outline-sm-border transition-[outline-color] duration-150",
      activeCard:
        "aspect-video bg-sm-muted rounded-sm flex items-center justify-center cursor-pointer border-none text-sm-foreground text-2xl font-bold outline-2 outline-sm-primary transition-[outline-color] duration-150",
      slideNumber: "text-sm-muted-foreground",
    },
  },

  Code: {
    className: "font-mono",
  },

  Terminal: {
    className:
      "rounded-sm overflow-hidden bg-sm-surface text-sm-surface-foreground font-mono",
    classNames: {
      chrome:
        "flex items-center gap-2 px-3 py-2 bg-sm-muted border-b border-sm-border",
      dots: "flex gap-1.5",
      dotClose: "w-3 h-3 rounded-full bg-[#ff5f56]",
      dotMinimize: "w-3 h-3 rounded-full bg-[#ffbd2e]",
      dotMaximize: "w-3 h-3 rounded-full bg-[#27c93f]",
      title: "text-sm-muted-foreground ml-2",
      body: "px-4 py-3",
      line: "flex items-center gap-2 min-h-[1.5em]",
      prompt: "text-sm-primary select-none",
      cursor:
        "inline-block w-2 h-[1.2em] bg-sm-primary animate-[sm-blink_1s_step-end_infinite] align-text-bottom",
      output: "text-sm-muted-foreground pl-6 mb-1",
    },
  },
});
