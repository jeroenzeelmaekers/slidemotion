---
title: Animation
description: Animation primitives and easing functions.
---

slidemotion exposes low-level animation primitives for custom components.

## Core utilities

- `interpolate` for mapping progress ranges
- `spring` and `springDuration` for physical motion
- easing helpers from `slidemotion/animation`
- `createAnimationLoop`, `tweenMode`, `springMode` for custom drivers

## Step-aware animation

Use `useStepProgress()` or `useStep()` when you need custom motion logic.

```tsx
const progress = useStepProgress();
const opacity = interpolate(progress, [0, 1], [0, 1]);
```

## Enter and exit choreography

`Animate` and the built-in transition components now support backward exits. That makes reverse navigation feel intentional instead of abruptly unmounting content.
