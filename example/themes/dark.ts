import { defineTheme } from "slidemotion";

/**
 * Light theme inspired by the Orange Juice VSCode theme.
 *
 * CSS variables are injected on a wrapper element. The example `app.css`
 * maps them to Tailwind v4 `@theme` tokens so components can use semantic
 * utility classes like `bg-background` and `text-foreground`.
 */
export const orangeJuiceLightTheme = defineTheme({
  cssVars: {
    "--background": "#FAFAF8",
    "--foreground": "#3B3B3B",
    "--muted": "rgba(59,59,59,0.5)",
    "--border": "rgba(0,0,0,0.12)",
  },

  Slide: {
    className: "flex flex-col bg-background text-foreground",
  },

  Presenter: {
    className: "flex flex-col h-screen bg-background",
    classNames: {
      viewport: "flex-1 flex items-center justify-center overflow-hidden",
    },
  },

  Controls: {
    className: "flex items-center justify-center gap-4 px-4 py-2 bg-[#F0EDE8] text-foreground text-sm select-none",
    classNames: {
      prev: "bg-transparent border border-border text-foreground px-3 py-1 rounded cursor-pointer text-base",
      next: "bg-transparent border border-border text-foreground px-3 py-1 rounded cursor-pointer text-base",
      counter: "tabular-nums",
      step: "opacity-50",
    },
  },

  Overview: {
    className: "bg-[#F0EDE8]/95 flex items-center justify-center z-[1000]",
    classNames: {
      grid: "grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 p-8 max-w-[1200px] w-full",
      card: "aspect-video bg-black/5 rounded-lg flex items-center justify-center cursor-pointer border-none text-foreground text-2xl font-bold outline-1 outline-border transition-[outline-color] duration-150",
      activeCard: "aspect-video bg-black/5 rounded-lg flex items-center justify-center cursor-pointer border-none text-foreground text-2xl font-bold outline-2 outline-[#ff8c00] transition-[outline-color] duration-150",
      slideNumber: "opacity-50",
    },
  },
});
