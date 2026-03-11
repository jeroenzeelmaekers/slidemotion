import { defaultTheme, defineTheme, mergeTheme } from "slidemotion";

export const orangeTheme = mergeTheme(
  defaultTheme,
  defineTheme({
    Controls: {
      className:
        "flex items-center justify-center gap-6 px-6 py-3 bg-sm-surface/80 backdrop-blur-sm text-sm-surface-foreground text-sm select-none border-t border-sm-border",
      classNames: {
        prev: "flex items-center justify-center w-9 h-9 rounded-full bg-sm-muted hover:bg-sm-primary hover:text-sm-primary-foreground border border-sm-border hover:border-sm-primary text-sm-foreground cursor-pointer transition-colors duration-150",
        next: "flex items-center justify-center w-9 h-9 rounded-full bg-sm-muted hover:bg-sm-primary hover:text-sm-primary-foreground border border-sm-border hover:border-sm-primary text-sm-foreground cursor-pointer transition-colors duration-150",
        counter: "tabular-nums text-sm-muted-foreground",
        step: "text-sm-muted-foreground",
      },
    },
  }),
);
