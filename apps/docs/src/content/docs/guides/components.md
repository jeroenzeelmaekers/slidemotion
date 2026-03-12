---
title: Components
description: Core components for building presentations.
---

`slidemotion` is built from a small set of primitives:

- `Presentation` owns config, state, theming, and animation loops.
- `Presenter` renders the viewport, controls, overview, devtools, and speaker notes.
- `Slide` declares one slide plus its transition.
- `Step` makes content step-aware.
- `Animate` maps step progress to styles.

## `Presentation`

Use `Presentation` for deck-level defaults:

```tsx
<Presentation defaultStepDuration={420} defaultSlideTransition={{ type: "fade", duration: 220 }}>
  <Presenter>{/* slides */}</Presenter>
</Presentation>
```

- `theme` defaults to the built-in theme.
- `theme={false}` disables default styling.
- `defaultSlideTransition` gives every slide a baseline transition.

## `Slide`

Slides must have an `id` and can override the deck transition:

```tsx
<Slide id="intro" transition={{ type: "push", direction: "left", duration: 300 }}>
  ...
</Slide>
```

## `Step`

`Step` now supports per-step duration overrides and keeps content mounted while exiting backward.

```tsx
<Step order={2} duration={500}>
  <FadeIn>Details</FadeIn>
</Step>
```

## `Animate`

`Animate` supports `enter`, `animate`, and `exit` states.

```tsx
<Animate enter={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
  <h2>Animated</h2>
</Animate>
```

## Built-in transitions

- `FadeIn` supports `exitOpacity`
- `SlideIn` supports `exitTo`
- `ScaleIn` supports `exitTo`
- `Stagger` supports progress-based `interval` and `y`
