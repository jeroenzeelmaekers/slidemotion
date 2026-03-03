import { defaultTheme, mergeTheme, defineTheme } from "slidemotion";

/**
 * Example theme — extends `defaultTheme` with custom overrides.
 *
 * All colors come from `--sm-*` CSS custom properties defined in
 * `slidemotion/styles.css`. Override `:root` / `.dark` in your own
 * CSS to customize the palette.
 */
export const exampleTheme = mergeTheme(
  defaultTheme,
  defineTheme({
    Controls: {
      classNames: {
        prev: "rounded-sm",
        next: "rounded-sm",
      },
    },
  }),
);
