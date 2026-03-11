---
title: Theming
description: Customize the look and feel of your presentation.
---

The theme system is className-first and headless-friendly.

## Defaults

`Presentation` applies `defaultTheme` automatically.

```tsx
<Presentation>
  <Presenter>{/* ready to style with built-ins */}</Presenter>
</Presentation>
```

Disable that with:

```tsx
<Presentation theme={false}>
  <Presenter>{/* fully headless */}</Presenter>
</Presentation>
```

## Define a theme

```tsx
import { defineTheme } from "slidemotion/theme";

export const deckTheme = defineTheme({
  Slide: {
    className: "flex flex-col bg-stone-50 text-stone-900",
  },
  Presenter: {
    className: "min-h-screen bg-stone-100",
    classNames: {
      viewport: "flex items-center justify-center p-8",
    },
  },
});
```

## Merge presets

```tsx
import { defaultTheme, mergeTheme } from "slidemotion/theme";

const theme = mergeTheme(defaultTheme, {
  Controls: {
    className: "backdrop-blur-md",
  },
});
```

## CSS tokens

`slidemotion/styles.css` exposes `--sm-*` tokens for layout chrome and `--sm-code-*` for code colors. Override them in your own CSS to restyle the whole deck without rewriting component slots.
