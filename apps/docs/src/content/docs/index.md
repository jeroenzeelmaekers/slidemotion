---
title: Introduction
description: A React framework for building animated slide decks in JSX, optimized for presenting code.
---

slidemotion is a React framework for building animated slide decks in JSX, optimized for presenting code.

## Examples

- [Core deck example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/core) - slides, steps, animate, slide transitions
- [Code example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/code) - code morphing, highlighting, synced code steps
- [Terminal example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/terminal) - terminal playback, sparse timing, synced terminal steps

When slide choreography matters, prefer `atSteps` for `Code` and `Terminal` so code changes stay aligned with `Step` animations.

```tsx
import { atSteps, Code, Step } from "slidemotion";

<Step order={1}>
  <FadeIn>Explain the rename</FadeIn>
</Step>

<Code
  lang="ts"
  steps={[before, after]}
  atSteps={atSteps(1)}
/>
```
