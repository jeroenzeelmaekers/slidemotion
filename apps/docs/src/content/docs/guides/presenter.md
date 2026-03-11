---
title: Presenter
description: Presentation viewport, controls, and keyboard navigation.
---

`Presenter` is the runtime shell around your slides.

## Features

- keyboard navigation
- optional controls bar
- overview mode
- fullscreen toggle
- inline speaker notes panel
- optional devtools panel

## Example

```tsx
<Presenter controls keyboard devtools>
  <Slide id="intro">
    <h1>Hello</h1>
    <SpeakerNotes>Pause here. Ask one question.</SpeakerNotes>
  </Slide>
</Presenter>
```

## Shortcuts

- `ArrowRight`, `ArrowDown`, `Space`, `Enter`: next
- `ArrowLeft`, `ArrowUp`: previous
- `o`: overview
- `f`: fullscreen
- `s`: speaker notes

## Notes

Speaker notes are registered per slide and shown in the presenter shell when toggled.
